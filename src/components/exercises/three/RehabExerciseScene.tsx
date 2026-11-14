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

interface SceneCameraSpec {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  boundsSize: [number, number]; // [width, height] of the 3D action envelope for dynamic aspect-ratio framing
}

const CAMERA_CONFIG: Record<string, SceneCameraSpec> = {
  'deslizamiento-del-talon': {
    position: [0.02, 0.56, 2.24],
    target: [0.02, 0.2, 0],
    fov: 34,
    boundsSize: [1.92, 0.68]
  },
  'flexion-asistida-con-toalla': {
    position: [0.02, 0.58, 2.24],
    target: [0.02, 0.22, 0],
    fov: 34,
    boundsSize: [1.92, 0.72]
  },
  'flexion-autoasistida-pelota-mani': {
    position: [0.04, 0.62, 2.3],
    target: [0.04, 0.24, 0],
    fov: 35,
    boundsSize: [1.94, 0.78]
  },
  'flexion-activa-en-sedestacion': {
    position: [0.68, 0.78, 2.38],
    target: [0.02, 0.64, 0],
    fov: 36,
    boundsSize: [1.35, 1.48]
  },
  'flexion-asistida-prono': {
    position: [0.06, 0.68, 2.38],
    target: [0.05, 0.34, -0.08],
    fov: 35,
    boundsSize: [1.98, 1.38]
  },
  'extension-pasiva-apoyo-talon': {
    position: [0.05, 0.54, 2.22],
    target: [0.05, 0.18, 0],
    fov: 34,
    boundsSize: [1.92, 0.64]
  },
  'contraccion-isometrica-cuadriceps': {
    position: [0.04, 0.54, 2.22],
    target: [0.04, 0.18, 0],
    fov: 34,
    boundsSize: [1.92, 0.64]
  },
  'bombeo-activo-tobillo': {
    position: [0.16, 0.52, 2.12],
    target: [0.14, 0.18, 0],
    fov: 33,
    boundsSize: [1.86, 0.62]
  },
  'elevacion-pierna-extendida': {
    position: [0.03, 0.6, 2.28],
    target: [0.03, 0.24, 0],
    fov: 34,
    boundsSize: [1.92, 0.88]
  }
};

/**
 * Generates a single continuous, smooth therapeutic Peanut Ball (Pelota Maní) mesh
 * via LatheGeometry so there are no seams or deformations when rolling.
 * Outer lobes radius R_lobe = 0.165 m, central waist radius R_waist = 0.122 m.
 */
function createPeanutBallGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const segments = 48;
  const halfLen = 0.29;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments; // 0 to 1
    const y = (u * 2 - 1) * halfLen; // -0.29 to +0.29
    const norm = u * 2 - 1; // -1 to +1
    const endEnvelope = Math.sqrt(Math.max(0, 1 - Math.pow(norm, 2)));
    const peanutProfile = 0.122 + 0.062 * Math.sin(Math.abs(norm) * Math.PI * 0.8);
    const radius = endEnvelope * peanutProfile;
    points.push(new THREE.Vector2(radius, y));
  }
  const geom = new THREE.LatheGeometry(points, 36);
  // Rotate so the long axis of the peanut ball lies along the Z axis (transverse to the body)
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Customizes a cloned character's vertex colors so that:
 * - Patient ('patient'): gets a skin-tight, zero-Z-fighting turquoise knee sleeve (#25C8CC)
 *   painted directly onto the operated right knee vertices (x < 0, y in [0.472, 0.542]).
 * - Physiotherapist ('physio'): wears full-length dark clinical trousers (#12283A) and a
 *   clinical teal scrub top (#1A5B68) with NO knee band.
 */
function customizeCharacterVertexColors(root: THREE.Group, role: 'patient' | 'physio') {
  const sleeveColor = new THREE.Color('#25C8CC');
  const sleeveBorder = new THREE.Color('#82E5E4');
  const physioPants = new THREE.Color('#12283A');
  const physioScrub = new THREE.Color('#1A5B68');
  const tempColor = new THREE.Color();

  root.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    mesh.geometry = mesh.geometry.clone();
    const posAttr = mesh.geometry.attributes.position;
    const colAttr = mesh.geometry.attributes.color;
    if (!posAttr || !colAttr) return;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      tempColor.setRGB(colAttr.getX(i), colAttr.getY(i), colAttr.getZ(i));

      if (role === 'patient') {
        // Right leg (x < -0.02) around the anatomical knee joint (y in [0.468, 0.546])
        if (x < -0.02 && y >= 0.468 && y <= 0.546) {
          const bandMask = smoothstep(0.468, 0.478, y) * (1 - smoothstep(0.536, 0.546, y));
          const borderZone =
            smoothstep(0.472, 0.478, y) * (1 - smoothstep(0.478, 0.485, y)) +
            smoothstep(0.529, 0.535, y) * (1 - smoothstep(0.535, 0.542, y));
          tempColor.lerp(sleeveColor, bandMask * 0.92);
          if (borderZone > 0.05) {
            tempColor.lerp(sleeveBorder, Math.min(1, borderZone * 0.85));
          }
          colAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }
      } else {
        // Physiotherapist full-length clinical trousers (y in [0.105, 0.96]) on non-arm vertices (|x| < 0.25)
        if (Math.abs(x) < 0.25 && y >= 0.105 && y <= 0.965) {
          const pantsMask = smoothstep(0.105, 0.125, y) * (1 - smoothstep(0.945, 0.965, y));
          tempColor.lerp(physioPants, pantsMask);
          colAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        } else if (y > 0.95 && y < 1.44 && Math.abs(x) < 0.34) {
          const scrubMask = smoothstep(0.95, 0.975, y) * (1 - smoothstep(1.42, 1.445, y));
          tempColor.lerp(physioScrub, scrubMask * 0.75);
          colAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }
      }
    }
    colAttr.needsUpdate = true;
  });
}

const dummyEuler = new THREE.Euler();
const dummyQuat = new THREE.Quaternion();
const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();
const tempVecC = new THREE.Vector3();
const tempMid = new THREE.Vector3();
const tempUp = new THREE.Vector3(0, 1, 0);
const tempDir = new THREE.Vector3();

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

/**
 * Applies natural anatomical finger flexion so hands never look stiff or robotic.
 */
function setHandCurl(
  bones: Record<string, THREE.Bone>,
  side: 'R' | 'L',
  curlAmount: number
) {
  for (let f = 2; f <= 5; f++) {
    for (let s = 1; s <= 3; s++) {
      setBoneLocalEuler(bones, `finger${f}-${s}${side}`, curlAmount * (s === 1 ? 0.55 : 0.75), 0, 0);
    }
  }
  setBoneLocalEuler(bones, `finger1-2${side}`, curlAmount * 0.35, 0, 0);
  setBoneLocalEuler(bones, `finger1-3${side}`, curlAmount * 0.45, 0, 0);
}

const L_THIGH = 0.4258;
const L_SHIN = 0.3911;
const SUPINE_THIGH_OFFSET = 0.052;

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

// 3D CCD IK solver for UpperArm + LowerArm -> Effector (finger3-1 or wrist)
const _jointPos = new THREE.Vector3();
const _effPos = new THREE.Vector3();
const _curDir = new THREE.Vector3();
const _tarDir = new THREE.Vector3();
const _rotQuat = new THREE.Quaternion();
const _parentQuatInv = new THREE.Quaternion();

function solveArmIK3D(
  rootGroup: THREE.Object3D,
  upperArm: THREE.Bone | undefined,
  lowerArm: THREE.Bone | undefined,
  effector: THREE.Bone | undefined,
  targetWorld: THREE.Vector3,
  iterations = 8
) {
  if (!upperArm || !lowerArm || !effector) return;
  const chain = [lowerArm, upperArm];
  for (let iter = 0; iter < iterations; iter++) {
    for (const joint of chain) {
      rootGroup.updateMatrixWorld(true);
      _jointPos.setFromMatrixPosition(joint.matrixWorld);
      _effPos.setFromMatrixPosition(effector.matrixWorld);
      _curDir.subVectors(_effPos, _jointPos).normalize();
      _tarDir.subVectors(targetWorld, _jointPos).normalize();
      if (_curDir.lengthSq() > 0.0001 && _tarDir.lengthSq() > 0.0001) {
        _rotQuat.setFromUnitVectors(_curDir, _tarDir);
        if (joint.parent) {
          joint.parent.getWorldQuaternion(_parentQuatInv).invert();
          joint.getWorldQuaternion(dummyQuat);
          dummyQuat.premultiply(_rotQuat).premultiply(_parentQuatInv);
          joint.quaternion.copy(dummyQuat);
        }
      }
    }
  }
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
  const peanutBallGroupRef = useRef<THREE.Group>(null);
  const quadGlowRef = useRef<THREE.Mesh>(null);
  const ankleFlowRef = useRef<THREE.Mesh>(null);

  const phaseRef = useRef(0);
  const smoothTRef = useRef(finalPose ? 1 : 0);

  const peanutGeometry = useMemo(() => createPeanutBallGeometry(), []);

  // Patient model with skin-tight vertex-colored right knee band (zero Z-fighting)
  const { clonedScene, bones } = useMemo(() => {
    const clone = skeletonClone(scene) as THREE.Group;
    const boneMap: Record<string, THREE.Bone> = {};

    customizeCharacterVertexColors(clone, 'patient');

    clone.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        bone.userData.restQuat = bone.quaternion.clone();
        boneMap[bone.name] = bone;
        boneMap[bone.name.replace(/\./g, '')] = bone;
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

  // Physiotherapist model in full clinical trousers & scrub top for Exercise 5 (Prone)
  const { physioScene, physioBones } = useMemo(() => {
    const clone = skeletonClone(scene) as THREE.Group;
    const boneMap: Record<string, THREE.Bone> = {};

    customizeCharacterVertexColors(clone, 'physio');

    clone.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone;
        bone.userData.restQuat = bone.quaternion.clone();
        boneMap[bone.name] = bone;
        boneMap[bone.name.replace(/\./g, '')] = bone;
      }
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.vertexColors = true;
          mat.roughness = 0.66;
          mat.metalness = 0.04;
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

    const breath = Math.sin(crankPhase) * 0.01;

    if (
      exerciseId === 'deslizamiento-del-talon' ||
      exerciseId === 'flexion-asistida-con-toalla' ||
      exerciseId === 'flexion-autoasistida-pelota-mani' ||
      exerciseId === 'extension-pasiva-apoyo-talon' ||
      exerciseId === 'contraccion-isometrica-cuadriceps' ||
      exerciseId === 'bombeo-activo-tobillo' ||
      exerciseId === 'elevacion-pierna-extendida'
    ) {
      // Decúbito supino sobre camilla (superficie superior en y = 0.000)
      group.rotation.set(-Math.PI / 2, Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.088, 0);

      setBoneLocalEuler(bones, 'neck01', 0.14 - breath * 0.3, 0, 0);
      setBoneLocalEuler(bones, 'head', 0.1, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.03 + breath, 0, 0);

      // Brazos apoyados de forma natural sobre la camilla (sin penetrar la superficie)
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.22);
      setBoneLocalEuler(bones, 'upperarm01R', -0.02, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', -0.52, 0, 0);
      setHandCurl(bones, 'R', 0.25);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.22);
      setBoneLocalEuler(bones, 'upperarm01L', -0.02, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', -0.52, 0, 0);
      setHandCurl(bones, 'L', 0.25);

      // Pierna izquierda (sana) apoyada directamente sobre la camilla (minY = 0.004 m)
      setBoneLocalEuler(bones, 'upperleg01L', 0.022, 0, 0.04);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.04, 0, 0);
      setBoneLocalEuler(bones, 'footL', -0.06, 0, 0);

      const hipX = -0.077;
      const hipY = 0.081;

      if (exerciseId === 'deslizamiento-del-talon') {
        // 1. Deslizamiento del talón: contacto continuo del calcáneo sobre la camilla (minY en [0.000, 0.009])
        const targetX = 0.735 - t * 0.4;
        const targetY = 0.066 + Math.sin(t * Math.PI * 0.62) * 0.062;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -ik.kneeFlex * 0.28, 0, 0);
      } else if (exerciseId === 'flexion-asistida-con-toalla') {
        // 2. Flexión autoasistida con toalla o cincha: coordinación brazos-pierna con sujeción anatómica
        setBoneLocalEuler(bones, 'spine02', 0.07, 0, 0);
        setBoneLocalEuler(bones, 'spine01', 0.08, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.22);
        setBoneLocalEuler(bones, 'upperarm01R', 0.08 - t * 0.22, 0, 0.24);
        setBoneLocalEuler(bones, 'lowerarm01R', 0.12 + t * 0.46, 0, 0);
        setHandCurl(bones, 'R', 0.62);

        setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.22);
        setBoneLocalEuler(bones, 'upperarm01L', 0.08 - t * 0.22, 0, -0.24);
        setBoneLocalEuler(bones, 'lowerarm01L', 0.12 + t * 0.46, 0, 0);
        setHandCurl(bones, 'L', 0.62);

        const targetX = 0.735 - t * 0.42;
        const targetY = 0.068 + Math.sin(t * Math.PI * 0.62) * 0.064;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -ik.kneeFlex * 0.3 - 0.08, 0, 0);
      } else if (exerciseId === 'flexion-autoasistida-pelota-mani') {
        // 3. Pelota maní terapéutica: lóbulos de R=0.165 m apoyados en y=0.000 (centro en y=0.165 m).
        // En z=+-0.125 m la superficie superior de la pelota está en y=0.313 m; tobillos apoyados tangencialmente sin penetración.
        const ballLobeRadius = 0.165;
        const ballX = 0.66 - t * 0.3;
        const targetX = ballX - 0.02;
        const targetY = 0.375;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -ik.kneeFlex * 0.22, 0, 0);

        setBoneLocalEuler(bones, 'upperleg01L', -ik.hipFlex, 0, 0.04);
        setBoneLocalEuler(bones, 'lowerleg01L', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footL', -ik.kneeFlex * 0.22, 0, 0);

        if (peanutBallGroupRef.current) {
          peanutBallGroupRef.current.position.set(ballX, ballLobeRadius, 0);
          // Rodamiento mecánico exacto sin deslizamiento: dTheta = -dX / R_lobe
          peanutBallGroupRef.current.rotation.z = (0.66 - ballX) / ballLobeRadius;
        }
      } else if (exerciseId === 'extension-pasiva-apoyo-talon') {
        // 6. Extensión pasiva con apoyo bajo el talón (tope del rodillo en y = 0.092 m) y rodilla libre
        const residualFlex = (1 - t) * 0.22;
        const hipAngle = 0.045 + residualFlex * 0.46;
        setBoneLocalEuler(bones, 'upperleg01R', -hipAngle, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', residualFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.06, 0, 0);
      } else if (exerciseId === 'contraccion-isometrica-cuadriceps') {
        // 7. Contracción isométrica de cuádriceps: talón apoyado, rodilla extiende suavemente hacia la camilla
        const relaxFlex = (1 - t) * 0.14;
        const hipAngle = -0.022 + relaxFlex * 0.48;
        setBoneLocalEuler(bones, 'upperleg01R', -hipAngle, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', relaxFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.04 + t * 0.14, 0, 0);
      } else if (exerciseId === 'bombeo-activo-tobillo') {
        // 8. Bombeo activo de tobillo: rodilla estable, dorsiflexión y flexión plantar rítmica
        setBoneLocalEuler(bones, 'upperleg01R', 0.002, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', 0.04, 0, 0);
        const ankleAngle = 0.36 - t * 0.88;
        setBoneLocalEuler(bones, 'footR', ankleAngle, 0, 0);
        setBoneLocalEuler(bones, 'toe2-1R', ankleAngle * 0.45, 0, 0);

        if (ankleFlowRef.current) {
          ankleFlowRef.current.position.set(0.62 - t * 0.22, 0.12, 0.14);
        }
      } else if (exerciseId === 'elevacion-pierna-extendida') {
        // 9. Elevación de pierna extendida (SLR): pierna sana flexionada de apoyo (planta en y=0.000),
        // pierna operada con rodilla mantenida a 0° y elevación mediante flexión pura de cadera
        const ikL = solve2BoneIK(hipX, hipY, 0.38, 0.118, SUPINE_THIGH_OFFSET);
        setBoneLocalEuler(bones, 'upperleg01L', -ikL.hipFlex, 0, 0.05);
        setBoneLocalEuler(bones, 'lowerleg01L', ikL.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footL', -ikL.kneeFlex * 0.28, 0, 0);

        const slrHipLift = -0.022 + t * 0.58;
        setBoneLocalEuler(bones, 'upperleg01R', -slrHipLift, 0, -0.04);
        setBoneLocalEuler(bones, 'lowerleg01R', 0.0, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.16, 0, 0);
      }
    } else if (exerciseId === 'flexion-activa-en-sedestacion') {
      // 4. Flexión autoasistida en sedestación: sentado al borde de camilla alta (asiento en y = 0.513 m).
      // Ambos muslos permanecen apoyados horizontalmente sobre la superficie sin atravesar el asiento.
      group.rotation.set(0, Math.PI / 2, 0, 'YXZ');
      group.position.set(-0.14, -0.335, 0);

      setBoneLocalEuler(bones, 'spine04', 0.04, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.02 + breath, 0, 0);
      setBoneLocalEuler(bones, 'neck01', -0.04, 0, 0);

      // Manos apoyadas sobre los bordes laterales de la camilla alta (y ~ 0.515 m)
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
      setBoneLocalEuler(bones, 'upperarm01R', -0.32, 0, 0.22);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.62, 0, 0);
      setHandCurl(bones, 'R', 0.45);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
      setBoneLocalEuler(bones, 'upperarm01L', -0.32, 0, -0.22);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.62, 0, 0);
      setHandCurl(bones, 'L', 0.45);

      const kneeFlexR = 1.18 + t * 0.72; // ~68° a ~110° de flexión de rodilla
      setBoneLocalEuler(bones, 'upperleg01R', -1.48, 0, -0.03);
      setBoneLocalEuler(bones, 'lowerleg01R', kneeFlexR, 0, 0);
      setBoneLocalEuler(bones, 'footR', 0.12, 0, 0);

      // El miembro sano (izquierdo) cruza su pie por delante del tobillo derecho operado y asiste la flexión hacia atrás
      setBoneLocalEuler(bones, 'upperleg01L', -1.46, -0.08, -0.21);
      setBoneLocalEuler(bones, 'lowerleg01L', kneeFlexR - 0.1, 0, 0);
      setBoneLocalEuler(bones, 'footL', 0.25, 0, 0);
    } else if (exerciseId === 'flexion-asistida-prono') {
      // 5. Flexión asistida en decúbito prono (técnica profesional de contracción-relajación en 4 fases)
      group.rotation.set(Math.PI / 2, -Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.138, 0);

      // Cabeza girada suavemente hacia un lado sobre la almohadilla baja
      setBoneLocalEuler(bones, 'neck01', -0.08, 0.35, 0);
      setBoneLocalEuler(bones, 'head', -0.05, 0.25, 0);

      // Brazos del paciente apoyados sobre la superficie superior de la camilla (minY >= 0.025 m, nunca debajo)
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.25);
      setBoneLocalEuler(bones, 'upperarm01R', -0.18, 0, 0.35);
      setBoneLocalEuler(bones, 'lowerarm01R', -0.68, 0, 0);
      setHandCurl(bones, 'R', 0.25);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.25);
      setBoneLocalEuler(bones, 'upperarm01L', -0.18, 0, -0.35);
      setBoneLocalEuler(bones, 'lowerarm01L', -0.68, 0, 0);
      setHandCurl(bones, 'L', 0.25);

      // Pierna izquierda sana apoyada cómodamente sobre el dorso del pie en la camilla
      setBoneLocalEuler(bones, 'upperleg01L', -0.02, 0, 0.04);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.16, 0, 0);
      setBoneLocalEuler(bones, 'footL', 0.52, 0, 0);
      setBoneLocalEuler(bones, 'toe2-1L', 0.35, 0, 0);

      // Cuatro fases biomecánicas:
      // Fase A (0.00 <= t < 0.25): Posicionamiento inicial en rango tolerable (~85°–90°, 1.52 rad)
      // Fase B (0.25 <= t < 0.60): Contracción isométrica del cuádriceps contra resistencia manual (8–15 s, sin desplazamiento angular)
      // Fase C (0.60 <= t < 0.72): Relajación muscular manteniendo contacto manual estable sin tirón brusco
      // Fase D (0.72 <= t <= 1.00): Ganancia suave de flexión acompañada por el kinesiólogo (1.52 -> 1.80 rad)
      let proneFlex = 1.52;
      let quadIsoIntensity = 0.05;
      if (t < 0.25) {
        const p = THREE.MathUtils.smoothstep(t, 0, 0.25);
        proneFlex = 1.24 + p * 0.28;
        quadIsoIntensity = 0.04;
      } else if (t < 0.6) {
        proneFlex = 1.52; // Articulación mantiene su posición durante la contracción isométrica
        const rampIn = THREE.MathUtils.smoothstep(t, 0.25, 0.31);
        const rampOut = 1 - THREE.MathUtils.smoothstep(t, 0.54, 0.6);
        quadIsoIntensity = 0.05 + rampIn * rampOut * 0.55;
      } else if (t < 0.72) {
        proneFlex = 1.52; // Fase C: Relajación sin tirón brusco
        quadIsoIntensity = 0.04;
      } else {
        const p = THREE.MathUtils.smoothstep(t, 0.72, 1.0);
        proneFlex = 1.52 + p * 0.28; // Fase D: Ganancia progresiva de flexión
        quadIsoIntensity = 0.04;
      }

      setBoneLocalEuler(bones, 'upperleg01R', -0.02, 0, -0.04);
      setBoneLocalEuler(bones, 'lowerleg01R', proneFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', 0.15, 0, 0);

      if (quadGlowRef.current) {
        const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = quadIsoIntensity;
      }
    }

    group.updateMatrixWorld(true);

    // En Ejercicio 5 (Prono): resolver cinemática inversa 3D de las manos del kinesiólogo
    // para garantizar contacto anatómico exacto con el segmento distal de la pierna y la pelvis del paciente
    if (exerciseId === 'flexion-asistida-prono' && physioGroupRef.current) {
      const pGroup = physioGroupRef.current;
      for (const key in physioBones) {
        const b = physioBones[key];
        if (b.userData.restQuat) {
          b.quaternion.copy(b.userData.restQuat);
        }
      }

      // Kinesiólogo de pie fuera del borde posterior (-Z) de la camilla, mirando hacia el paciente (+Z)
      pGroup.position.set(0.16, -0.52, -0.52);
      pGroup.rotation.set(0, 0.04, 0);

      setBoneLocalEuler(physioBones, 'spine04', 0.15, 0, 0);
      setBoneLocalEuler(physioBones, 'spine02', 0.16, 0, 0);
      setBoneLocalEuler(physioBones, 'neck01', 0.2, -0.08, 0);

      setBoneLocalEuler(physioBones, 'shoulder01R', 0, 0, 0.22);
      setBoneLocalEuler(physioBones, 'upperarm01R', 0.45, 0, 0.25);
      setBoneLocalEuler(physioBones, 'lowerarm01R', 0.35, 0, 0);
      setHandCurl(physioBones, 'R', 0.38);

      setBoneLocalEuler(physioBones, 'shoulder01L', 0, 0, -0.22);
      setBoneLocalEuler(physioBones, 'upperarm01L', 0.45, 0, -0.25);
      setBoneLocalEuler(physioBones, 'lowerarm01L', 0.35, 0, 0);
      setHandCurl(physioBones, 'L', 0.52);

      const footBone = getBone(bones, 'footR');
      const kneeBone = getBone(bones, 'lowerleg01R');
      if (footBone && kneeBone) {
        tempVecA.setFromMatrixPosition(kneeBone.matrixWorld);
        tempVecB.setFromMatrixPosition(footBone.matrixWorld);
        // Punto de contacto distal en la cara anterior del segmento distal de la pierna del paciente:
        tempVecC.lerpVectors(tempVecA, tempVecB, 0.78);
        tempVecC.x += 0.032;

        solveArmIK3D(
          pGroup,
          getBone(physioBones, 'upperarm01L'),
          getBone(physioBones, 'lowerarm01L'),
          getBone(physioBones, 'finger3-1L'),
          tempVecC,
          8
        );

        // Mano derecha del kinesiólogo estabilizando la pelvis / muslo proximal del paciente:
        tempVecA.set(-0.02, 0.225, -0.105);
        solveArmIK3D(
          pGroup,
          getBone(physioBones, 'upperarm01R'),
          getBone(physioBones, 'lowerarm01R'),
          getBone(physioBones, 'finger3-1R'),
          tempVecA,
          8
        );
      }
      pGroup.updateMatrixWorld(true);
    }

    // Posicionar indicador sutil de activación de cuádriceps alineado con el fémur derecho (Ejercicios 5, 7 y 9)
    const hipBoneR = getBone(bones, 'upperleg01R');
    const kneeBoneR = getBone(bones, 'lowerleg01R');
    if (
      hipBoneR &&
      kneeBoneR &&
      quadGlowRef.current &&
      (exerciseId === 'contraccion-isometrica-cuadriceps' ||
        exerciseId === 'elevacion-pierna-extendida' ||
        exerciseId === 'flexion-asistida-prono')
    ) {
      tempVecA.setFromMatrixPosition(hipBoneR.matrixWorld);
      tempVecB.setFromMatrixPosition(kneeBoneR.matrixWorld);
      tempMid.lerpVectors(tempVecA, tempVecB, 0.52);
      tempDir.subVectors(tempVecB, tempVecA).normalize();
      dummyQuat.setFromUnitVectors(tempUp, tempDir);
      // Desplazar sutilmente hacia la cara anterior del muslo
      if (exerciseId === 'flexion-asistida-prono') {
        tempMid.y -= 0.035;
      } else {
        tempMid.y += 0.042;
      }
      quadGlowRef.current.position.copy(tempMid);
      quadGlowRef.current.quaternion.copy(dummyQuat);

      if (exerciseId === 'contraccion-isometrica-cuadriceps') {
        const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.08 + t * 0.42;
      } else if (exerciseId === 'elevacion-pierna-extendida') {
        const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.18 + Math.min(1, t * 2.2) * 0.28;
      }
    }

    // Marcador de recorrido del pie / talón en Ejercicios 1, 2 y 4
    const footBone = getBone(bones, 'footR');
    if (footBone && heelMarkerRef.current) {
      tempVecA.setFromMatrixPosition(footBone.matrixWorld);
      if (exerciseId === 'flexion-activa-en-sedestacion') {
        heelMarkerRef.current.position.set(tempVecA.x + 0.04, 0.006, tempVecA.z);
      } else {
        heelMarkerRef.current.position.set(tempVecA.x - 0.03, 0.004, tempVecA.z);
      }
    }

    // Cincha / Toalla en Ejercicio 2 conectada exactamente del arco plantar a las palmas de ambas manos
    const toeBone = getBone(bones, 'toe2-1R');
    const handRBone = getBone(bones, 'finger3-1R');
    const handLBone = getBone(bones, 'finger3-1L');

    if (
      exerciseId === 'flexion-asistida-con-toalla' &&
      toeBone &&
      footBone &&
      handRBone &&
      handLBone
    ) {
      tempVecA.setFromMatrixPosition(toeBone.matrixWorld);
      tempVecB.setFromMatrixPosition(footBone.matrixWorld);
      tempVecA.lerp(tempVecB, 0.32);

      if (strapLoopRef.current) {
        strapLoopRef.current.position.copy(tempVecA);
      }

      // Banda derecha hacia la mano derecha
      tempVecC.setFromMatrixPosition(handRBone.matrixWorld);
      if (strapRightRef.current) {
        tempMid.copy(tempVecA).add(tempVecC).multiplyScalar(0.5);
        const dist = tempVecA.distanceTo(tempVecC);
        strapRightRef.current.position.copy(tempMid);
        strapRightRef.current.lookAt(tempVecC);
        strapRightRef.current.scale.set(1, 1, Math.max(0.05, dist));
      }

      // Banda izquierda hacia la mano izquierda
      tempVecC.setFromMatrixPosition(handLBone.matrixWorld);
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
    const speedFactor = slowMode ? 0.16 : 0.34;

    if (playing) {
      phaseRef.current += clampedDelta * speedFactor;
      const rawT = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
      const t = THREE.MathUtils.smoothstep(rawT, 0.04, 0.96);
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

      {/* Camilla Clínica + Almohada + Patas Estructurales */}
      {isPlinthExercise && (
        <group>
          {/* Colchoneta superior (superficie exacta en y = 0.000) */}
          <mesh position={[0.04, -0.03, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.9, 0.06, 0.74]} />
            <meshStandardMaterial color="#152E42" roughness={0.68} metalness={0.08} />
          </mesh>
          {/* Bastidor inferior */}
          <mesh position={[0.04, -0.075, 0]} receiveShadow>
            <boxGeometry args={[1.92, 0.03, 0.76]} />
            <meshStandardMaterial color="#0D2030" roughness={0.55} metalness={0.2} />
          </mesh>
          {/* Patas metálicas de la camilla clínica */}
          {[
            [-0.82, -0.3, 0.31],
            [-0.82, -0.3, -0.31],
            [0.88, -0.3, 0.31],
            [0.88, -0.3, -0.31]
          ].map(([lx, ly, lz], idx) => (
            <mesh key={idx} position={[lx, ly, lz]} receiveShadow>
              <cylinderGeometry args={[0.022, 0.02, 0.44, 14]} />
              <meshStandardMaterial color="#35536B" roughness={0.45} metalness={0.35} />
            </mesh>
          ))}
          {/* Almohada cefálica */}
          <mesh
            position={[-0.72, exerciseId === 'flexion-asistida-prono' ? 0.014 : 0.025, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry
              args={[0.28, exerciseId === 'flexion-asistida-prono' ? 0.028 : 0.05, 0.42]}
            />
            <meshStandardMaterial color="#244660" roughness={0.65} />
          </mesh>
        </group>
      )}

      {/* 1 & 2: Guía de Deslizamiento del Talón */}
      {(exerciseId === 'deslizamiento-del-talon' ||
        exerciseId === 'flexion-asistida-con-toalla') && (
        <group>
          <mesh position={[0.52, 0.002, 0.16]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.46, 0.032]} />
            <meshBasicMaterial color="#25C8CC" transparent opacity={0.35} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.7, 0.004, 0.16]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.024, 0.04, 28]} />
            <meshBasicMaterial color="#82E5E4" transparent opacity={0.8} side={THREE.DoubleSide} />
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
            <torusGeometry args={[0.044, 0.009, 12, 24]} />
            <meshStandardMaterial color="#F1F7FA" roughness={0.35} />
          </mesh>
        </group>
      )}

      {/* 3: Pelota Maní Terapéutica continua (eje largo transversal al cuerpo) */}
      {exerciseId === 'flexion-autoasistida-pelota-mani' && (
        <group ref={peanutBallGroupRef} position={[0.66, 0.165, 0]}>
          <mesh geometry={peanutGeometry} castShadow receiveShadow>
            <meshStandardMaterial color="#25C8CC" roughness={0.38} metalness={0.05} />
          </mesh>
          {/* Bandas meridianas sobre la superficie para visualizar con claridad el rodamiento real */}
          <mesh position={[0, 0, 0.13]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.151, 0.004, 8, 36]} />
            <meshBasicMaterial color="#F1F7FA" transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0, -0.13]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.151, 0.004, 8, 36]} />
            <meshBasicMaterial color="#F1F7FA" transparent opacity={0.55} />
          </mesh>
        </group>
      )}

      {/* 4: Camilla Alta / Silla Estable de Sedestación (Superficie superior en y = 0.513 m) */}
      {exerciseId === 'flexion-activa-en-sedestacion' && (
        <group>
          {/* Asiento firme de la camilla alta */}
          <mesh position={[-0.08, 0.49, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.48, 0.046, 0.52]} />
            <meshStandardMaterial color="#163247" roughness={0.65} />
          </mesh>
          {/* Respaldo posterior */}
          <mesh position={[-0.31, 0.76, 0]} rotation={[0, 0, 0.04]} receiveShadow castShadow>
            <boxGeometry args={[0.04, 0.5, 0.48]} />
            <meshStandardMaterial color="#163247" roughness={0.65} />
          </mesh>
          {/* Patas altas estables hasta el piso (y = 0.000) */}
          {[
            [-0.28, 0.235, 0.21],
            [-0.28, 0.235, -0.21],
            [0.12, 0.235, 0.21],
            [0.12, 0.235, -0.21]
          ].map(([lx, ly, lz], idx) => (
            <mesh key={idx} position={[lx, ly, lz]} receiveShadow castShadow>
              <cylinderGeometry args={[0.018, 0.015, 0.47, 14]} />
              <meshStandardMaterial color="#587E96" roughness={0.4} metalness={0.35} />
            </mesh>
          ))}
          <mesh position={[0.16, 0.003, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.36, 0.04]} />
            <meshBasicMaterial color="#25C8CC" transparent opacity={0.35} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.28, 0.006, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.026, 0.044, 28]} />
            <meshBasicMaterial color="#82E5E4" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 5, 7 y 9: Indicador anatómico sutil de activación del cuádriceps sobre el muslo derecho */}
      {(exerciseId === 'flexion-asistida-prono' ||
        exerciseId === 'contraccion-isometrica-cuadriceps' ||
        exerciseId === 'elevacion-pierna-extendida') && (
        <mesh ref={quadGlowRef}>
          <cylinderGeometry args={[0.064, 0.074, 0.26, 24]} />
          <meshBasicMaterial color="#25C8CC" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      )}

      {/* 6: Extensión Pasiva — Rodillo Firme Bajo el Talón (y_top = 0.092 m) y Rodilla Libre */}
      {exerciseId === 'extension-pasiva-apoyo-talon' && (
        <group>
          <mesh
            position={[0.75, 0.046, 0.16]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.046, 0.046, 0.22, 28]} />
            <meshStandardMaterial color="#25C8CC" roughness={0.45} />
          </mesh>
          {/* Indicador sutil en la camilla bajo la rodilla libre (sin almohada debajo) */}
          <mesh position={[0.35, 0.003, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.036, 0.056, 28]} />
            <meshBasicMaterial color="#82E5E4" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 7: Almohadilla poplítea fina de referencia bajo la rodilla en Isométrico de Cuádriceps */}
      {exerciseId === 'contraccion-isometrica-cuadriceps' && (
        <mesh position={[0.35, 0.012, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 20]} />
          <meshStandardMaterial color="#82E5E4" roughness={0.45} />
        </mesh>
      )}

      {/* 8: Bombeo Activo de Tobillo — Almohadilla fina en Aquiles + aro de retorno venoso */}
      {exerciseId === 'bombeo-activo-tobillo' && (
        <group>
          <mesh position={[0.66, 0.014, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.16, 18]} />
            <meshStandardMaterial color="#244660" roughness={0.55} />
          </mesh>
          <mesh
            ref={ankleFlowRef}
            position={[0.55, 0.12, 0.15]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <torusGeometry args={[0.056, 0.006, 12, 28]} />
            <meshBasicMaterial color="#25C8CC" transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * Dynamic Bounding-Box & Aspect-Ratio Camera Framing Controller.
 * Guarantees that the entire body, plinth, physiotherapist, and accessories remain
 * centered and inside the frustum across both narrow mobile viewports and desktop screens.
 */
const CameraRigController: React.FC<{
  camSpec: SceneCameraSpec;
  cameraResetSignal: number;
  exerciseId: string;
}> = ({ camSpec, cameraResetSignal, exerciseId }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    const aspect = size.height > 0 ? size.width / size.height : 1.5;
    const vFovRad = THREE.MathUtils.degToRad(camSpec.fov);
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

    const [boundsW, boundsH] = camSpec.boundsSize;
    const distForH = (boundsH * 1.18) / (2 * Math.tan(vFovRad / 2));
    const distForW = (boundsW * 1.14) / (2 * Math.tan(hFovRad / 2));

    const targetVec = new THREE.Vector3(...camSpec.target);
    const basePosVec = new THREE.Vector3(...camSpec.position);
    const viewDir = basePosVec.clone().sub(targetVec);
    const baseDist = viewDir.length();
    viewDir.normalize();

    const finalDist = Math.max(baseDist, distForH, distForW);
    const finalPos = targetVec.clone().addScaledVector(viewDir, finalDist);

    camera.position.copy(finalPos);
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetVec);
      controlsRef.current.update();
    }
    invalidate();
  }, [exerciseId, cameraResetSignal, camSpec, size.width, size.height, camera, invalidate]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={camSpec.target}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI * 0.24}
      maxPolarAngle={Math.PI * 0.56}
      minAzimuthAngle={-Math.PI * 0.34}
      maxAzimuthAngle={Math.PI * 0.34}
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
        camSpec={cam}
        cameraResetSignal={cameraResetSignal}
        exerciseId={exerciseId}
      />
    </Canvas>
  );
};

useGLTF.preload('/models/rehab-human.glb');
export default RehabExerciseScene;
