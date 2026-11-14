import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export interface RehabExerciseSceneProps {
  exerciseId: string;
  playing: boolean;
  finalPose: boolean;
  slowMode: boolean;
  resetSignal: number;
  cameraResetSignal?: number;
  inView: boolean;
}

const CAMERA_CONFIG: Record<
  string,
  { position: [number, number, number]; target: [number, number, number]; fov: number }
> = {
  'deslizamiento-del-talon': {
    position: [0.02, 0.56, 2.26],
    target: [0.02, 0.2, 0],
    fov: 34
  },
  'flexion-asistida-con-toalla': {
    position: [0.02, 0.58, 2.26],
    target: [0.02, 0.22, 0],
    fov: 34
  },
  'flexion-autoasistida-pelota-mani': {
    position: [0.05, 0.6, 2.32],
    target: [0.05, 0.22, 0],
    fov: 35
  },
  'flexion-activa-en-sedestacion': {
    position: [0.68, 0.72, 2.38],
    target: [0.0, 0.56, 0],
    fov: 36
  },
  'flexion-asistida-prono': {
    position: [0.1, 0.68, 2.36],
    target: [0.08, 0.34, -0.05],
    fov: 35
  },
  'extension-pasiva-apoyo-talon': {
    position: [0.06, 0.54, 2.22],
    target: [0.06, 0.18, 0],
    fov: 34
  },
  'contraccion-isometrica-cuadriceps': {
    position: [0.04, 0.54, 2.22],
    target: [0.04, 0.18, 0],
    fov: 34
  },
  'bombeo-activo-tobillo': {
    position: [0.18, 0.52, 2.08],
    target: [0.18, 0.18, 0],
    fov: 32
  },
  'elevacion-pierna-extendida': {
    position: [0.04, 0.58, 2.28],
    target: [0.04, 0.22, 0],
    fov: 34
  }
};

/**
 * Generates a single continuous, smooth therapeutic Peanut Ball (Pelota Maní) mesh
 * via LatheGeometry so there are no seams or deformations when rolling.
 */
function createPeanutBallGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const segments = 48;
  const halfLen = 0.29;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments; // 0 to 1
    const y = (u * 2 - 1) * halfLen; // -0.29 to +0.29
    const norm = u * 2 - 1; // -1 to +1
    // Smooth rounded ends + peanut waist in the center (norm = 0)
    const endEnvelope = Math.sqrt(Math.max(0, 1 - Math.pow(norm, 2)));
    const peanutWaist = 0.125 + 0.055 * Math.sin(Math.abs(norm) * Math.PI * 0.82);
    const radius = endEnvelope * peanutWaist;
    points.push(new THREE.Vector2(radius, y));
  }
  const geom = new THREE.LatheGeometry(points, 36);
  // Rotate so the long axis of the peanut ball lies along the Z axis (transverse to the body)
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

const dummyEuler = new THREE.Euler();
const dummyQuat = new THREE.Quaternion();
const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();
const tempVecC = new THREE.Vector3();
const tempMid = new THREE.Vector3();

function getBone(
  bones: Record<string, THREE.Bone>,
  name: string
): THREE.Bone | undefined {
  return bones[name] || bones[name.replace(/\./g, '')];
}

function setBoneLocalEuler(
  bones: Record<string, THREE.Bone>,
  name: string,
  rx: number,
  ry: number,
  rz: number,
  order: THREE.EulerOrder = 'XYZ'
) {
  const bone = getBone(bones, name);
  if (!bone) return;
  const rest: THREE.Quaternion | undefined = bone.userData.restQuat;
  if (!rest) return;
  dummyEuler.set(rx, ry, rz, order);
  dummyQuat.setFromEuler(dummyEuler);
  bone.quaternion.copy(rest).multiply(dummyQuat);
}

const L_THIGH = 0.4258;
const L_SHIN = 0.3911;
const SUPINE_THIGH_OFFSET = 0.052;
const UPRIGHT_THIGH_OFFSET = -Math.PI / 2 + 0.052;

function solve2BoneIK(
  hipX: number,
  hipY: number,
  ankleX: number,
  ankleY: number,
  baseThighOffset: number
) {
  const dx = ankleX - hipX;
  const dy = ankleY - hipY;
  const maxReach = L_THIGH + L_SHIN - 0.004;
  const minReach = Math.abs(L_THIGH - L_SHIN) + 0.02;
  const d = Math.min(maxReach, Math.max(minReach, Math.hypot(dx, dy)));

  const cosKneeInterior =
    (L_THIGH * L_THIGH + L_SHIN * L_SHIN - d * d) / (2 * L_THIGH * L_SHIN);
  const kneeInterior = Math.acos(THREE.MathUtils.clamp(cosKneeInterior, -1, 1));
  const kneeFlex = Math.PI - kneeInterior - 0.069;

  const cosAlpha =
    (L_THIGH * L_THIGH + d * d - L_SHIN * L_SHIN) / (2 * L_THIGH * d);
  const alpha = Math.acos(THREE.MathUtils.clamp(cosAlpha, -1, 1));
  const targetAngle = Math.atan2(dy, dx);

  const thighAngle = targetAngle + alpha;
  const hipFlex = thighAngle - baseThighOffset;
  const shinAngle = thighAngle - (Math.PI - kneeInterior);

  return { hipFlex, kneeFlex, thighAngle, shinAngle };
}

interface ActorProps {
  exerciseId: string;
  playing: boolean;
  finalPose: boolean;
  slowMode: boolean;
  resetSignal: number;
}

const AnimatedPhysioActor: React.FC<ActorProps> = ({
  exerciseId,
  playing,
  finalPose,
  slowMode,
  resetSignal
}) => {
  const { scene } = useGLTF('/models/rehab-human.glb');
  const { invalidate } = useThree();

  const characterGroupRef = useRef<THREE.Group>(null);
  const physioGroupRef = useRef<THREE.Group>(null);
  const strapRightRef = useRef<THREE.Mesh>(null);
  const strapLeftRef = useRef<THREE.Mesh>(null);
  const strapLoopRef = useRef<THREE.Mesh>(null);
  const heelMarkerRef = useRef<THREE.Mesh>(null);
  const kneeBandRef = useRef<THREE.Mesh>(null);
  const peanutBallGroupRef = useRef<THREE.Group>(null);
  const quadGlowRef = useRef<THREE.Mesh>(null);
  const ankleFlowRef = useRef<THREE.Mesh>(null);

  const phaseRef = useRef(0);
  const smoothTRef = useRef(finalPose ? 1 : 0);

  const peanutGeometry = useMemo(() => createPeanutBallGeometry(), []);

  // Patient model
  const { clonedScene, bones } = useMemo(() => {
    const clone = skeletonClone(scene) as THREE.Group;
    const boneMap: Record<string, THREE.Bone> = {};

    clone.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        bone.userData.restQuat = bone.quaternion.clone();
        boneMap[bone.name] = bone;
      }
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.vertexColors = true;
          mat.roughness = 0.68;
          mat.metalness = 0.04;
          mesh.material = mat;
        }
      }
    });

    return { clonedScene: clone, bones: boneMap };
  }, [scene]);

  // Second articulated human model for the Physiotherapist (Kinesiólogo) in Exercise 5 (Prone)
  const { physioScene, physioBones } = useMemo(() => {
    const clone = skeletonClone(scene) as THREE.Group;
    const boneMap: Record<string, THREE.Bone> = {};

    clone.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        bone.userData.restQuat = bone.quaternion.clone();
        boneMap[bone.name] = bone;
      }
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.vertexColors = true;
          mat.color.set('#d8eef2');
          mat.roughness = 0.65;
          mesh.material = mat;
        }
      }
    });

    return { physioScene: clone, physioBones: boneMap };
  }, [scene]);

  useEffect(() => {
    phaseRef.current = 0;
    smoothTRef.current = 0;
    invalidate();
  }, [resetSignal, exerciseId, invalidate]);

  useEffect(() => {
    if (!playing) {
      phaseRef.current = finalPose ? 0.5 : 0;
      invalidate();
    }
  }, [finalPose, playing, invalidate]);

  const applyPose = (t: number, crankPhase: number) => {
    const group = characterGroupRef.current;
    if (!group) return;

    // Reset all patient bones to rest quaternion first
    for (const key in bones) {
      const b = bones[key];
      if (b.userData.restQuat) {
        b.quaternion.copy(b.userData.restQuat);
      }
    }

    const breath = Math.sin(crankPhase) * 0.012;

    if (
      exerciseId === 'deslizamiento-del-talon' ||
      exerciseId === 'flexion-asistida-con-toalla' ||
      exerciseId === 'flexion-autoasistida-pelota-mani' ||
      exerciseId === 'extension-pasiva-apoyo-talon' ||
      exerciseId === 'contraccion-isometrica-cuadriceps' ||
      exerciseId === 'bombeo-activo-tobillo' ||
      exerciseId === 'elevacion-pierna-extendida'
    ) {
      // Decúbito supino sobre camilla (superficie superior en y = 0)
      group.rotation.set(-Math.PI / 2, Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.09, 0);

      setBoneLocalEuler(bones, 'neck01', 0.18 - breath * 0.4, 0, 0);
      setBoneLocalEuler(bones, 'head', 0.14, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.04 + breath, 0, 0);

      // Brazos apoyados de forma natural sobre la camilla
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
      setBoneLocalEuler(bones, 'upperarm01R', -0.06, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', -0.78, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
      setBoneLocalEuler(bones, 'upperarm01L', -0.06, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', -0.78, 0, 0);

      // Pierna izquierda (sana) relajada por defecto
      setBoneLocalEuler(bones, 'upperleg01L', -0.05, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.06, 0, 0);
      setBoneLocalEuler(bones, 'footL', -0.05, 0, 0);

      if (exerciseId === 'deslizamiento-del-talon') {
        // 1. Deslizamiento del talón: IK 2 huesos manteniendo el talón apoyado sobre la camilla (y = 0.073)
        const hipX = -0.077;
        const hipY = 0.083;
        const targetX = 0.72 - t * 0.42;
        const targetY = 0.075;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -ik.kneeFlex * 0.36, 0, 0);
      } else if (exerciseId === 'flexion-asistida-con-toalla') {
        // 2. Flexión autoasistida con toalla o cincha: manos acompañan suavemente mientras el talón desliza
        setBoneLocalEuler(bones, 'spine02', 0.08, 0, 0);
        setBoneLocalEuler(bones, 'spine01', 0.1, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
        setBoneLocalEuler(bones, 'upperarm01R', 0.04 - t * 0.16, 0, 0.26);
        setBoneLocalEuler(bones, 'lowerarm01R', 0.14 + t * 0.38, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
        setBoneLocalEuler(bones, 'upperarm01L', 0.04 - t * 0.16, 0, -0.26);
        setBoneLocalEuler(bones, 'lowerarm01L', 0.14 + t * 0.38, 0, 0);

        const hipX = -0.077;
        const hipY = 0.083;
        const targetX = 0.7 - t * 0.43;
        const targetY = 0.078;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -ik.kneeFlex * 0.4 - 0.1, 0, 0);
      } else if (exerciseId === 'flexion-autoasistida-pelota-mani') {
        // 3. Pelota maní terapéutica transversal bajo las piernas: rueda hacia el cuerpo con pelvis estable
        const ballX = 0.65 - t * 0.3;
        const ballRadiusCenter = 0.125;
        const hipX = -0.077;
        const hipY = 0.083;
        // Tobillos/pantorrillas apoyados sobre la hendidura central superior de la pelota maní (y = 0.25)
        const targetX = ballX - 0.02;
        const targetY = ballRadiusCenter * 2 + 0.025;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -0.18, 0, 0);

        setBoneLocalEuler(bones, 'upperleg01L', -ik.hipFlex, 0, 0.05);
        setBoneLocalEuler(bones, 'lowerleg01L', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footL', -0.18, 0, 0);

        if (peanutBallGroupRef.current) {
          peanutBallGroupRef.current.position.set(ballX, ballRadiusCenter, 0);
          // Rodamiento físico coherente: al desplazarse hacia -X (hacia los glúteos), gira en +Z
          peanutBallGroupRef.current.rotation.z = (0.65 - ballX) / ballRadiusCenter;
        }
      } else if (exerciseId === 'extension-pasiva-apoyo-talon') {
        // 6. Extensión pasiva con apoyo bajo el talón y rodilla libre
        const residualFlex = (1 - t) * 0.24;
        setBoneLocalEuler(bones, 'upperleg01R', -0.07 - residualFlex * 0.45, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', residualFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.1, 0, 0);
      } else if (exerciseId === 'contraccion-isometrica-cuadriceps') {
        // 7. Contracción isométrica de cuádriceps: presiona hueco poplíteo hacia la camilla sin flexionar
        const relaxFlex = (1 - t) * 0.15;
        setBoneLocalEuler(bones, 'upperleg01R', -0.02 - relaxFlex * 0.48, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', relaxFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.08 + t * 0.16, 0, 0);

        if (quadGlowRef.current) {
          const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.08 + t * 0.48;
          quadGlowRef.current.scale.set(1, 1 + t * 0.1, 1 + t * 0.1);
        }
      } else if (exerciseId === 'bombeo-activo-tobillo') {
        // 8. Bombeo activo de tobillo: dorsiflexión y flexión plantar lenta
        setBoneLocalEuler(bones, 'upperleg01R', -0.05, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', 0.05, 0, 0);
        const ankleAngle = 0.5 - t * 1.05;
        setBoneLocalEuler(bones, 'footR', ankleAngle, 0, 0);
        setBoneLocalEuler(bones, 'toe2-1R', ankleAngle * 0.45, 0, 0);

        if (ankleFlowRef.current) {
          ankleFlowRef.current.position.set(0.62 - t * 0.22, 0.11, 0.095);
        }
      } else if (exerciseId === 'elevacion-pierna-extendida') {
        // 9. Elevación de pierna extendida (SLR): rodilla 100% trabada en extensión (0°)
        setBoneLocalEuler(bones, 'upperleg01L', -0.82, 0, 0.06);
        setBoneLocalEuler(bones, 'lowerleg01L', 1.52, 0, 0);
        setBoneLocalEuler(bones, 'footL', -0.62, 0, 0);

        const slrHipLift = 0.03 + t * 0.58;
        setBoneLocalEuler(bones, 'upperleg01R', -slrHipLift, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', 0.0, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.18, 0, 0);
      }
    } else if (exerciseId === 'flexion-activa-en-sedestacion') {
      // 4. Flexión autoasistida en sedestación: sentado al borde de camilla/silla alta, pie sano asiste al operado
      group.rotation.set(0, Math.PI / 2, 0, 'YXZ');
      group.position.set(-0.14, -0.435, 0);

      setBoneLocalEuler(bones, 'spine04', 0.04, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.02 + breath, 0, 0);
      setBoneLocalEuler(bones, 'neck01', -0.04, 0, 0);

      // Manos sosteniendo los bordes del asiento para estabilidad pélvica
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
      setBoneLocalEuler(bones, 'upperarm01R', 0.05, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.1, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
      setBoneLocalEuler(bones, 'upperarm01L', 0.05, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.1, 0, 0);

      const hipX = -0.147;
      const hipY = 0.492;
      const targetX = 0.27 - t * 0.26;
      const targetY = 0.072;
      const ikR = solve2BoneIK(hipX, hipY, targetX, targetY, UPRIGHT_THIGH_OFFSET);

      setBoneLocalEuler(bones, 'upperleg01R', -ikR.hipFlex, 0, -0.02);
      setBoneLocalEuler(bones, 'lowerleg01R', ikR.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', ikR.shinAngle - -Math.PI / 2, 0, 0);

      // El miembro sano (izquierdo) se cruza hacia la línea media para apoyar su talón sobre la cara anterior del tobillo operado y asistirlo hacia atrás
      const ikL = solve2BoneIK(
        hipX,
        hipY,
        targetX + 0.042,
        targetY + 0.032,
        UPRIGHT_THIGH_OFFSET
      );
      setBoneLocalEuler(bones, 'upperleg01L', -ikL.hipFlex, -0.08, -0.16);
      setBoneLocalEuler(bones, 'lowerleg01L', ikL.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footL', ikL.shinAngle - -Math.PI / 2 + 0.12, 0, 0);
    } else if (exerciseId === 'flexion-asistida-prono') {
      // 5. Flexión asistida en decúbito prono (supervisada por el kinesiólogo)
      group.rotation.set(Math.PI / 2, -Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.11, 0);

      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.25);
      setBoneLocalEuler(bones, 'upperarm01R', 0.1, 0, 0.65);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.55, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.25);
      setBoneLocalEuler(bones, 'upperarm01L', 0.1, 0, -0.65);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.55, 0, 0);

      setBoneLocalEuler(bones, 'upperleg01L', 0.02, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.05, 0, 0);
      setBoneLocalEuler(bones, 'footL', 0.15, 0, 0);

      // Tres fases diferenciadas:
      // 1) t < 0.32: posicionamiento a ~90° (1.52 rad)
      // 2) 0.32 <= t < 0.68: contracción isométrica de cuádriceps SIN movimiento articular (8–15 s)
      // 3) t >= 0.68: relajación y ganancia suave de flexión acompañada por el profesional
      let proneFlex = 1.52;
      let isIsoHold = false;
      if (t < 0.32) {
        const p = THREE.MathUtils.smoothstep(t, 0, 0.32);
        proneFlex = 1.05 + p * 0.47;
      } else if (t < 0.68) {
        proneFlex = 1.52; // Contracción isométrica: sin desplazamiento angular
        isIsoHold = true;
      } else {
        const p = THREE.MathUtils.smoothstep(t, 0.68, 1.0);
        proneFlex = 1.52 + p * 0.38;
      }

      setBoneLocalEuler(bones, 'upperleg01R', 0.02, 0, -0.05);
      setBoneLocalEuler(bones, 'lowerleg01R', proneFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', 0.1, 0, 0);

      if (quadGlowRef.current) {
        const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = isIsoHold ? 0.58 : 0.08;
      }

      // Pose del Kinesiólogo de pie junto al extremo distal de la camilla acompañando la pierna
      if (physioGroupRef.current) {
        for (const key in physioBones) {
          const b = physioBones[key];
          if (b.userData.restQuat) {
            b.quaternion.copy(b.userData.restQuat);
          }
        }
        physioGroupRef.current.position.set(0.56, -0.38, -0.44);
        physioGroupRef.current.rotation.set(0, -0.35, 0);

        const reachAdjust = (proneFlex - 1.52) * 0.22;
        setBoneLocalEuler(physioBones, 'spine02', 0.18, 0, 0);
        setBoneLocalEuler(physioBones, 'neck01', 0.15, 0, 0);

        setBoneLocalEuler(physioBones, 'shoulder01R', 0, 0, 0.2);
        setBoneLocalEuler(physioBones, 'upperarm01R', 0.72 + reachAdjust, 0, 0.18);
        setBoneLocalEuler(physioBones, 'lowerarm01R', 0.35 - reachAdjust * 0.5, 0, 0);

        setBoneLocalEuler(physioBones, 'shoulder01L', 0, 0, -0.2);
        setBoneLocalEuler(physioBones, 'upperarm01L', 0.68 + reachAdjust, 0, -0.18);
        setBoneLocalEuler(physioBones, 'lowerarm01L', 0.32 - reachAdjust * 0.5, 0, 0);
      }
    }

    group.updateMatrixWorld(true);

    // Posicionar banda de rodilla en el miembro operado (lowerleg01R)
    const kneeBone = getBone(bones, 'lowerleg01R');
    if (kneeBone && kneeBandRef.current) {
      tempVecA.setFromMatrixPosition(kneeBone.matrixWorld);
      kneeBone.getWorldQuaternion(dummyQuat);
      kneeBandRef.current.position.copy(tempVecA);
      kneeBandRef.current.quaternion.copy(dummyQuat);
    }

    const footBone = getBone(bones, 'footR');
    if (footBone && heelMarkerRef.current) {
      tempVecA.setFromMatrixPosition(footBone.matrixWorld);
      if (exerciseId === 'flexion-activa-en-sedestacion') {
        heelMarkerRef.current.position.set(tempVecA.x + 0.05, 0.006, tempVecA.z);
      } else {
        heelMarkerRef.current.position.set(tempVecA.x, 0.006, tempVecA.z);
      }
    }

    const toeBone = getBone(bones, 'toe2-1R');
    const wristRBone = getBone(bones, 'wristR');
    const wristLBone = getBone(bones, 'wristL');

    if (
      exerciseId === 'flexion-asistida-con-toalla' &&
      toeBone &&
      footBone &&
      wristRBone &&
      wristLBone
    ) {
      tempVecA.setFromMatrixPosition(toeBone.matrixWorld);
      tempVecB.setFromMatrixPosition(footBone.matrixWorld);
      tempVecA.lerp(tempVecB, 0.35);

      if (strapLoopRef.current) {
        strapLoopRef.current.position.copy(tempVecA);
      }

      tempVecC.setFromMatrixPosition(wristRBone.matrixWorld);
      tempVecC.x += 0.03;
      tempVecC.y -= 0.02;
      tempVecC.z -= 0.03;
      if (strapRightRef.current) {
        tempMid.copy(tempVecA).add(tempVecC).multiplyScalar(0.5);
        const dist = tempVecA.distanceTo(tempVecC);
        strapRightRef.current.position.copy(tempMid);
        strapRightRef.current.lookAt(tempVecC);
        strapRightRef.current.scale.set(1, 1, Math.max(0.05, dist));
      }

      tempVecC.setFromMatrixPosition(wristLBone.matrixWorld);
      tempVecC.x += 0.03;
      tempVecC.y -= 0.02;
      tempVecC.z += 0.03;
      if (strapLeftRef.current) {
        tempMid.copy(tempVecA).add(tempVecC).multiplyScalar(0.5);
        const dist = tempVecA.distanceTo(tempVecC);
        strapLeftRef.current.position.copy(tempMid);
        strapLeftRef.current.lookAt(tempVecC);
        strapLeftRef.current.scale.set(1, 1, Math.max(0.05, dist));
      }
    }
  };

  useEffect(() => {
    applyPose(finalPose ? 1 : 0, finalPose ? Math.PI * 0.5 : -0.45);
    invalidate();
  }, [clonedScene, exerciseId, finalPose, invalidate]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const speedFactor = slowMode ? 0.18 : 0.38;

    if (playing) {
      phaseRef.current += clampedDelta * speedFactor;
      const rawT = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
      const t = THREE.MathUtils.smoothstep(rawT, 0.05, 0.95);
      smoothTRef.current = t;
      const crankAngle = -phaseRef.current * Math.PI * 2;
      applyPose(t, crankAngle);
    } else {
      const targetT = finalPose ? 1 : 0;
      const diff = targetT - smoothTRef.current;
      if (Math.abs(diff) > 0.002) {
        smoothTRef.current += diff * Math.min(1, clampedDelta * (slowMode ? 4.5 : 8.5));
        applyPose(smoothTRef.current, -0.45 + smoothTRef.current * (Math.PI * 0.95));
        invalidate();
      } else {
        smoothTRef.current = targetT;
        applyPose(targetT, -0.45 + targetT * (Math.PI * 0.95));
      }
    }
  });

  const isPlinthExercise = exerciseId !== 'flexion-activa-en-sedestacion';

  return (
    <group>
      {/* Paciente Articulado */}
      <group ref={characterGroupRef}>
        <primitive object={clonedScene} />
      </group>

      {/* Kinesiólogo supervisando en Ejercicio 5 (Decúbito Prono) */}
      {exerciseId === 'flexion-asistida-prono' && (
        <group ref={physioGroupRef}>
          <primitive object={physioScene} />
        </group>
      )}

      {/* Banda identificatoria en la rodilla operada (Turquesa Clínico #25C8CC) */}
      <mesh ref={kneeBandRef} castShadow>
        <cylinderGeometry args={[0.062, 0.055, 0.075, 32]} />
        <meshStandardMaterial
          color="#25C8CC"
          emissive="#25C8CC"
          emissiveIntensity={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Camilla Clínica + Almohada */}
      {isPlinthExercise && (
        <group>
          <mesh position={[0.04, -0.03, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.86, 0.06, 0.74]} />
            <meshStandardMaterial color="#152E42" roughness={0.68} metalness={0.08} />
          </mesh>
          <mesh position={[0.04, -0.075, 0]} receiveShadow>
            <boxGeometry args={[1.88, 0.03, 0.76]} />
            <meshStandardMaterial color="#0D2030" roughness={0.55} metalness={0.2} />
          </mesh>
          <mesh
            position={[-0.68, exerciseId === 'flexion-asistida-prono' ? 0.015 : 0.022, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[0.28, 0.045, 0.42]} />
            <meshStandardMaterial color="#244660" roughness={0.65} />
          </mesh>
        </group>
      )}

      {/* 1 & 2: Guía de Deslizamiento del Talón */}
      {(exerciseId === 'deslizamiento-del-talon' ||
        exerciseId === 'flexion-asistida-con-toalla') && (
        <group>
          <mesh position={[0.52, 0.002, 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.46, 0.034]} />
            <meshBasicMaterial color="#25C8CC" transparent opacity={0.38} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.72, 0.006, 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.024, 0.042, 28]} />
            <meshBasicMaterial color="#82E5E4" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 2: Toalla o Cincha de Autoasistencia */}
      {exerciseId === 'flexion-asistida-con-toalla' && (
        <group>
          <mesh ref={strapRightRef} castShadow>
            <boxGeometry args={[0.024, 0.007, 1]} />
            <meshStandardMaterial color="#25C8CC" roughness={0.45} />
          </mesh>
          <mesh ref={strapLeftRef} castShadow>
            <boxGeometry args={[0.024, 0.007, 1]} />
            <meshStandardMaterial color="#25C8CC" roughness={0.45} />
          </mesh>
          <mesh ref={strapLoopRef} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.042, 0.008, 12, 24]} />
            <meshStandardMaterial color="#F1F7FA" roughness={0.35} />
          </mesh>
        </group>
      )}

      {/* 3: Pelota Maní Terapéutica continua (eje largo transversal al cuerpo) */}
      {exerciseId === 'flexion-autoasistida-pelota-mani' && (
        <group ref={peanutBallGroupRef} position={[0.56, 0.125, 0]}>
          <mesh geometry={peanutGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color="#25C8CC"
              roughness={0.38}
              metalness={0.05}
            />
          </mesh>
          {/* Bandas de referencia visual para percibir el rodamiento de la pelota maní */}
          <mesh position={[0, 0, 0.14]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.168, 0.004, 8, 36]} />
            <meshBasicMaterial color="#F1F7FA" transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0, -0.14]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.168, 0.004, 8, 36]} />
            <meshBasicMaterial color="#F1F7FA" transparent opacity={0.55} />
          </mesh>
        </group>
      )}

      {/* 4: Camilla / Silla Alta de Sedestación */}
      {exerciseId === 'flexion-activa-en-sedestacion' && (
        <group>
          <mesh position={[-0.08, 0.42, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.46, 0.045, 0.48]} />
            <meshStandardMaterial color="#163247" roughness={0.65} />
          </mesh>
          <mesh position={[-0.29, 0.68, 0]} rotation={[0, 0, 0.05]} receiveShadow castShadow>
            <boxGeometry args={[0.04, 0.48, 0.46]} />
            <meshStandardMaterial color="#163247" roughness={0.65} />
          </mesh>
          {[
            [-0.26, 0.205, 0.19],
            [-0.26, 0.205, -0.19],
            [0.1, 0.205, 0.19],
            [0.1, 0.205, -0.19]
          ].map(([lx, ly, lz], idx) => (
            <mesh key={idx} position={[lx, ly, lz]} receiveShadow castShadow>
              <cylinderGeometry args={[0.016, 0.014, 0.41, 12]} />
              <meshStandardMaterial color="#587E96" roughness={0.4} metalness={0.35} />
            </mesh>
          ))}
          <mesh position={[0.18, 0.003, 0.075]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.36, 0.042]} />
            <meshBasicMaterial color="#25C8CC" transparent opacity={0.38} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.3, 0.006, 0.075]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.026, 0.045, 28]} />
            <meshBasicMaterial color="#82E5E4" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 5: Decúbito Prono — Indicador de fase isométrica en el cuádriceps */}
      {exerciseId === 'flexion-asistida-prono' && (
        <mesh
          ref={quadGlowRef}
          position={[0.16, 0.055, -0.095]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.082, 0.072, 0.28, 24]} />
          <meshBasicMaterial color="#25C8CC" transparent opacity={0.2} />
        </mesh>
      )}

      {/* 6: Extensión Pasiva — Apoyo Cilíndrico Bajo el Talón y Rodilla Libre */}
      {exerciseId === 'extension-pasiva-apoyo-talon' && (
        <group>
          <mesh position={[0.74, 0.042, 0.095]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.048, 0.048, 0.22, 28]} />
            <meshStandardMaterial color="#25C8CC" roughness={0.45} />
          </mesh>
          <mesh position={[0.35, 0.004, 0.095]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.038, 0.06, 28]} />
            <meshBasicMaterial color="#82E5E4" transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 7: Contracción Isométrica de Cuádriceps */}
      {exerciseId === 'contraccion-isometrica-cuadriceps' && (
        <group>
          <mesh
            ref={quadGlowRef}
            position={[0.15, 0.11, 0.095]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.08, 0.068, 0.26, 24]} />
            <meshBasicMaterial color="#25C8CC" transparent opacity={0.3} />
          </mesh>
          <mesh position={[0.35, 0.012, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.18, 20]} />
            <meshStandardMaterial color="#82E5E4" roughness={0.45} />
          </mesh>
        </group>
      )}

      {/* 8: Bombeo Activo de Tobillo */}
      {exerciseId === 'bombeo-activo-tobillo' && (
        <mesh
          ref={ankleFlowRef}
          position={[0.55, 0.11, 0.095]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[0.058, 0.007, 12, 28]} />
          <meshBasicMaterial color="#25C8CC" transparent opacity={0.65} />
        </mesh>
      )}

      {/* 9: Elevación de Pierna Extendida */}
      {exerciseId === 'elevacion-pierna-extendida' && (
        <mesh position={[0.74, 0.22, 0.095]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.01, 0.34, 0.01]} />
          <meshBasicMaterial color="#25C8CC" transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  );
};

const CameraRigController: React.FC<{
  camPosition: [number, number, number];
  camTarget: [number, number, number];
  cameraResetSignal: number;
  exerciseId: string;
}> = ({ camPosition, camTarget, cameraResetSignal, exerciseId }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    camera.position.set(camPosition[0], camPosition[1], camPosition[2]);
    if (controlsRef.current) {
      controlsRef.current.target.set(camTarget[0], camTarget[1], camTarget[2]);
      controlsRef.current.update();
    }
    invalidate();
  }, [exerciseId, cameraResetSignal, camPosition, camTarget, camera, invalidate]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={camTarget}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI * 0.25}
      maxPolarAngle={Math.PI * 0.56}
      minAzimuthAngle={-Math.PI * 0.32}
      maxAzimuthAngle={Math.PI * 0.32}
      rotateSpeed={0.55}
    />
  );
};

export const RehabExerciseScene: React.FC<RehabExerciseSceneProps> = ({
  exerciseId,
  playing,
  finalPose,
  slowMode,
  resetSignal,
  cameraResetSignal = 0,
  inView
}) => {
  const cam = CAMERA_CONFIG[exerciseId] || CAMERA_CONFIG['deslizamiento-del-talon'];

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={inView && playing ? 'always' : 'demand'}
      camera={{ position: cam.position, fov: cam.fov, near: 0.1, far: 15 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={1.0} />
      <hemisphereLight args={['#F1F7FA', '#10283A', 0.7]} />
      <directionalLight
        position={[1.8, 2.8, 2.2]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-1.8, 1.6, -1.4]} intensity={0.55} color="#82E5E4" />
      <directionalLight position={[0.5, 1.2, -2.0]} intensity={0.35} color="#25C8CC" />

      <Suspense fallback={null}>
        <AnimatedPhysioActor
          exerciseId={exerciseId}
          playing={inView && playing}
          finalPose={finalPose}
          slowMode={slowMode}
          resetSignal={resetSignal}
        />
        <ContactShadows
          position={[0, -0.002, 0]}
          opacity={0.4}
          scale={2.8}
          blur={2.2}
          far={1.4}
          color="#040D16"
        />
      </Suspense>

      <CameraRigController
        camPosition={cam.position}
        camTarget={cam.target}
        cameraResetSignal={cameraResetSignal}
        exerciseId={exerciseId}
      />
    </Canvas>
  );
};

useGLTF.preload('/models/rehab-human.glb');
export default RehabExerciseScene;
