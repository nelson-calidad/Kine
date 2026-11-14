import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface RehabExerciseSceneProps {
  exerciseId: string;
  playing: boolean;
  finalPose: boolean;
  slowMode: boolean;
  resetSignal: number;
  inView: boolean;
}

const CAMERA_CONFIG: Record<
  string,
  { position: [number, number, number]; target: [number, number, number]; fov: number }
> = {
  'deslizamiento-del-talon': {
    position: [0.06, 0.44, 1.62],
    target: [0.06, 0.16, 0],
    fov: 32
  },
  'flexion-asistida-con-toalla': {
    position: [0.06, 0.46, 1.62],
    target: [0.06, 0.18, 0],
    fov: 32
  },
  'flexion-autoasistida-pelota-mani': {
    position: [0.1, 0.48, 1.68],
    target: [0.1, 0.2, 0],
    fov: 33
  },
  'flexion-activa-en-sedestacion': {
    position: [0.02, 0.56, 1.68],
    target: [-0.02, 0.44, 0],
    fov: 34
  },
  'flexion-asistida-prono': {
    position: [0.14, 0.54, 1.62],
    target: [0.1, 0.22, -0.04],
    fov: 32
  },
  'extension-pasiva-apoyo-talon': {
    position: [0.18, 0.42, 1.52],
    target: [0.22, 0.14, 0.04],
    fov: 30
  },
  'contraccion-isometrica-cuadriceps': {
    position: [0.14, 0.44, 1.52],
    target: [0.18, 0.14, 0.04],
    fov: 30
  },
  'bombeo-activo-tobillo': {
    position: [0.34, 0.4, 1.38],
    target: [0.42, 0.14, 0.05],
    fov: 28
  },
  'elevacion-pierna-extendida': {
    position: [0.08, 0.48, 1.64],
    target: [0.08, 0.2, 0],
    fov: 32
  }
};

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
  const strapRightRef = useRef<THREE.Mesh>(null);
  const strapLeftRef = useRef<THREE.Mesh>(null);
  const strapLoopRef = useRef<THREE.Mesh>(null);
  const heelMarkerRef = useRef<THREE.Mesh>(null);
  const kneeBandRef = useRef<THREE.Mesh>(null);
  const peanutBallGroupRef = useRef<THREE.Group>(null);
  const quadGlowRef = useRef<THREE.Mesh>(null);
  const physioHandRef = useRef<THREE.Group>(null);
  const ankleFlowRef = useRef<THREE.Mesh>(null);

  const phaseRef = useRef(0);
  const smoothTRef = useRef(finalPose ? 1 : 0);

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

    // Reset all bones to rest quaternion first
    for (const key in bones) {
      const b = bones[key];
      if (b.userData.restQuat) {
        b.quaternion.copy(b.userData.restQuat);
      }
    }

    const breath = Math.sin(crankPhase) * 0.014;

    if (
      exerciseId === 'deslizamiento-del-talon' ||
      exerciseId === 'flexion-asistida-con-toalla' ||
      exerciseId === 'flexion-autoasistida-pelota-mani' ||
      exerciseId === 'extension-pasiva-apoyo-talon' ||
      exerciseId === 'contraccion-isometrica-cuadriceps' ||
      exerciseId === 'bombeo-activo-tobillo' ||
      exerciseId === 'elevacion-pierna-extendida'
    ) {
      // Decúbito supino sobre camilla
      group.rotation.set(-Math.PI / 2, Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.09, 0);

      setBoneLocalEuler(bones, 'neck01', 0.18 - breath * 0.4, 0, 0);
      setBoneLocalEuler(bones, 'head', 0.14, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.04 + breath, 0, 0);

      // Default relaxed arms along mat
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
      setBoneLocalEuler(bones, 'upperarm01R', -0.06, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', -0.78, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
      setBoneLocalEuler(bones, 'upperarm01L', -0.06, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', -0.78, 0, 0);

      // Default left leg relaxed
      setBoneLocalEuler(bones, 'upperleg01L', -0.05, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.06, 0, 0);
      setBoneLocalEuler(bones, 'footL', -0.05, 0, 0);

      if (exerciseId === 'deslizamiento-del-talon') {
        const kneeFlex = 0.08 + t * 1.62;
        const hipFlex = kneeFlex * 0.515 - 0.03;
        setBoneLocalEuler(bones, 'upperleg01R', -hipFlex, 0, -0.06);
        setBoneLocalEuler(bones, 'lowerleg01R', kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -kneeFlex * 0.35, 0, 0);
      } else if (exerciseId === 'flexion-asistida-con-toalla') {
        setBoneLocalEuler(bones, 'spine02', 0.08, 0, 0);
        setBoneLocalEuler(bones, 'spine01', 0.1, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
        setBoneLocalEuler(bones, 'upperarm01R', 0.05 - t * 0.17, 0, 0.26);
        setBoneLocalEuler(bones, 'lowerarm01R', 0.15 + t * 0.4, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
        setBoneLocalEuler(bones, 'upperarm01L', 0.05 - t * 0.17, 0, -0.26);
        setBoneLocalEuler(bones, 'lowerarm01L', 0.15 + t * 0.4, 0, 0);

        const kneeFlex = 0.14 + t * 1.62;
        const hipFlex = kneeFlex * 0.515 - 0.025;
        setBoneLocalEuler(bones, 'upperleg01R', -hipFlex, 0, -0.06);
        setBoneLocalEuler(bones, 'lowerleg01R', kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -kneeFlex * 0.42 - 0.12, 0, 0);
      } else if (exerciseId === 'flexion-autoasistida-pelota-mani') {
        // 3. Pelota maní transversal bajo las piernas: rueda hacia los glúteos flexionando ambas rodillas
        const ballX = 0.64 - t * 0.28;
        const hipX = -0.077;
        const hipY = 0.083;
        const targetX = ballX - 0.02;
        const targetY = 0.27 + t * 0.03;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.06);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -0.15, 0, 0);

        // Pierna sana también acompaña sobre la pelota maní
        setBoneLocalEuler(bones, 'upperleg01L', -ik.hipFlex, 0, 0.06);
        setBoneLocalEuler(bones, 'lowerleg01L', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footL', -0.15, 0, 0);

        if (peanutBallGroupRef.current) {
          peanutBallGroupRef.current.position.set(ballX, 0.145, 0);
          peanutBallGroupRef.current.rotation.z = t * 1.85;
        }
      } else if (exerciseId === 'extension-pasiva-apoyo-talon') {
        // 6. Extensión pasiva con rollo bajo el talón y rodilla libre descendiendo suavemente a 0°
        const residualFlex = (1 - t) * 0.28;
        setBoneLocalEuler(bones, 'upperleg01R', -0.08 - residualFlex * 0.45, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', residualFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.12, 0, 0);
      } else if (exerciseId === 'contraccion-isometrica-cuadriceps') {
        // 7. Contracción isométrica de cuádriceps presionando la parte posterior de la rodilla hacia la camilla
        const relaxFlex = (1 - t) * 0.18;
        setBoneLocalEuler(bones, 'upperleg01R', -0.02 - relaxFlex * 0.5, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', relaxFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.08 + t * 0.18, 0, 0);

        if (quadGlowRef.current) {
          const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.12 + t * 0.55;
          quadGlowRef.current.scale.set(1, 1 + t * 0.12, 1 + t * 0.12);
        }
      } else if (exerciseId === 'bombeo-activo-tobillo') {
        // 8. Bombeo activo de tobillo: alternar dorsiflexión y flexión plantar
        setBoneLocalEuler(bones, 'upperleg01R', -0.06, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', 0.06, 0, 0);
        // t = 0 -> dorsiflexión (+0.52), t = 1 -> flexión plantar (-0.58)
        const ankleAngle = 0.52 - t * 1.1;
        setBoneLocalEuler(bones, 'footR', ankleAngle, 0, 0);
        setBoneLocalEuler(bones, 'toe2-1R', ankleAngle * 0.45, 0, 0);

        if (ankleFlowRef.current) {
          ankleFlowRef.current.position.set(0.62 - t * 0.22, 0.11, 0.095);
        }
      } else if (exerciseId === 'elevacion-pierna-extendida') {
        // 9. Elevación de pierna extendida (SLR): pierna sana flexionada de apoyo, pierna operada sube 100% extendida
        setBoneLocalEuler(bones, 'upperleg01L', -0.82, 0, 0.06);
        setBoneLocalEuler(bones, 'lowerleg01L', 1.52, 0, 0);
        setBoneLocalEuler(bones, 'footL', -0.62, 0, 0);

        // Cuádriceps traba rodilla en 0° y eleva desde cadera
        const slrHipLift = 0.03 + t * 0.62;
        setBoneLocalEuler(bones, 'upperleg01R', -slrHipLift, 0, -0.05);
        setBoneLocalEuler(bones, 'lowerleg01R', 0.0, 0, 0);
        setBoneLocalEuler(bones, 'footR', 0.2, 0, 0);
      }
    } else if (exerciseId === 'flexion-activa-en-sedestacion') {
      // 4. Flexión autoasistida en sedestación: el pie sano asiste por delante al pie operado hacia atrás
      group.rotation.set(0, Math.PI / 2, 0, 'YXZ');
      group.position.set(-0.14, -0.435, 0);

      setBoneLocalEuler(bones, 'spine04', 0.05, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.02 + breath, 0, 0);
      setBoneLocalEuler(bones, 'neck01', -0.04, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
      setBoneLocalEuler(bones, 'upperarm01R', 0.05, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.1, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
      setBoneLocalEuler(bones, 'upperarm01L', 0.05, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.1, 0, 0);

      const hipX = -0.147;
      const hipY = 0.492;
      const targetX = 0.28 - t * 0.26;
      const targetY = 0.072;
      const ikR = solve2BoneIK(hipX, hipY, targetX, targetY, UPRIGHT_THIGH_OFFSET);

      setBoneLocalEuler(bones, 'upperleg01R', -ikR.hipFlex, 0, -0.04);
      setBoneLocalEuler(bones, 'lowerleg01R', ikR.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', ikR.shinAngle - -Math.PI / 2, 0, 0);

      // El pie sano (izquierdo) se cruza suavemente para asistir al tobillo operado hacia atrás
      const ikL = solve2BoneIK(hipX, hipY, targetX + 0.035, targetY + 0.02, UPRIGHT_THIGH_OFFSET);
      setBoneLocalEuler(bones, 'upperleg01L', -ikL.hipFlex, 0, -0.08);
      setBoneLocalEuler(bones, 'lowerleg01L', ikL.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footL', ikL.shinAngle - -Math.PI / 2, 0, 0);
    } else if (exerciseId === 'flexion-asistida-prono') {
      // 5. Flexión asistida en decúbito prono (boca abajo) con contracción-relajación supervisada
      group.rotation.set(Math.PI / 2, -Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.11, 0);

      // Brazos cómodos flexionados hacia la cabecera en prono
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.25);
      setBoneLocalEuler(bones, 'upperarm01R', 0.1, 0, 0.65);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.55, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.25);
      setBoneLocalEuler(bones, 'upperarm01L', 0.1, 0, -0.65);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.55, 0, 0);

      // Pierna sana extendida sobre la camilla
      setBoneLocalEuler(bones, 'upperleg01L', 0.02, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.05, 0, 0);
      setBoneLocalEuler(bones, 'footL', 0.15, 0, 0);

      // Tres fases clínicas:
      // 0..0.35: lleva a ~88° (1.50 rad)
      // 0.35..0.68: contracción isométrica de cuádriceps contra resistencia manual (8-15 s)
      // 0.68..1.0: relajación y ganancia suave de flexión (~112°, 1.92 rad)
      let proneFlex = 1.48;
      let isIsoHold = 0;
      if (t < 0.35) {
        const p = THREE.MathUtils.smoothstep(t, 0, 0.35);
        proneFlex = 0.95 + p * 0.53;
      } else if (t < 0.68) {
        proneFlex = 1.48 + Math.sin((t - 0.35) * 30) * 0.015;
        isIsoHold = 1;
      } else {
        const p = THREE.MathUtils.smoothstep(t, 0.68, 1.0);
        proneFlex = 1.48 + p * 0.44;
      }

      setBoneLocalEuler(bones, 'upperleg01R', 0.02, 0, -0.05);
      setBoneLocalEuler(bones, 'lowerleg01R', proneFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', 0.1, 0, 0);

      if (quadGlowRef.current) {
        const mat = quadGlowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = isIsoHold ? 0.65 : 0.12;
      }
    }

    group.updateMatrixWorld(true);

    // Position smooth 3D knee band directly on operated right knee (lowerleg01R)
    const kneeBone = getBone(bones, 'lowerleg01R');
    if (kneeBone && kneeBandRef.current) {
      tempVecA.setFromMatrixPosition(kneeBone.matrixWorld);
      kneeBone.getWorldQuaternion(dummyQuat);
      kneeBandRef.current.position.copy(tempVecA);
      kneeBandRef.current.quaternion.copy(dummyQuat);
    }

    // Update live 3D heel/foot indicator & physiotherapist support
    const footBone = getBone(bones, 'footR');
    if (footBone) {
      tempVecA.setFromMatrixPosition(footBone.matrixWorld);
      if (heelMarkerRef.current) {
        if (exerciseId === 'flexion-activa-en-sedestacion') {
          heelMarkerRef.current.position.set(tempVecA.x + 0.05, 0.006, tempVecA.z);
        } else {
          heelMarkerRef.current.position.set(tempVecA.x, 0.006, tempVecA.z);
        }
      }
      if (physioHandRef.current && exerciseId === 'flexion-asistida-prono') {
        physioHandRef.current.position.copy(tempVecA);
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
    const speedFactor = slowMode ? 0.2 : 0.42;

    if (playing) {
      phaseRef.current += clampedDelta * speedFactor;
      const rawT = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
      const t = THREE.MathUtils.smoothstep(rawT, 0.06, 0.94);
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
      {/* Articulated MakeHuman Character */}
      <group ref={characterGroupRef}>
        <primitive object={clonedScene} />
      </group>

      {/* Smooth 3D Knee Support Band on Operated Right Knee (Luminous Celeste/Turquoise) */}
      <mesh ref={kneeBandRef} castShadow>
        <cylinderGeometry args={[0.062, 0.055, 0.075, 32]} />
        <meshStandardMaterial
          color="#38d9d6"
          emissive="#38d9d6"
          emissiveIntensity={0.28}
          roughness={0.35}
        />
      </mesh>

      {/* Rehabilitation Plinth / Mat + Head Pillow */}
      {isPlinthExercise && (
        <group>
          <mesh position={[0.04, -0.03, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.84, 0.06, 0.72]} />
            <meshStandardMaterial color="#132d46" roughness={0.65} metalness={0.12} />
          </mesh>
          <mesh position={[0.04, -0.075, 0]} receiveShadow>
            <boxGeometry args={[1.86, 0.03, 0.74]} />
            <meshStandardMaterial color="#0b1d2e" roughness={0.5} metalness={0.25} />
          </mesh>
          <mesh
            position={[-0.68, exerciseId === 'flexion-asistida-prono' ? 0.015 : 0.022, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[0.28, 0.045, 0.42]} />
            <meshStandardMaterial color="#21496b" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* 1 & 2: Linear Heel Slide Track Indicator on Mat */}
      {(exerciseId === 'deslizamiento-del-talon' ||
        exerciseId === 'flexion-asistida-con-toalla') && (
        <group>
          <mesh position={[0.61, 0.002, 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.038]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.45} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.76, 0.006, 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.026, 0.045, 28]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 2: Non-elastic Rehabilitation Towel / Cincha */}
      {exerciseId === 'flexion-asistida-con-toalla' && (
        <group>
          <mesh ref={strapRightRef} castShadow>
            <boxGeometry args={[0.025, 0.008, 1]} />
            <meshStandardMaterial
              color="#38d9d6"
              emissive="#38d9d6"
              emissiveIntensity={0.22}
              roughness={0.4}
            />
          </mesh>
          <mesh ref={strapLeftRef} castShadow>
            <boxGeometry args={[0.025, 0.008, 1]} />
            <meshStandardMaterial
              color="#38d9d6"
              emissive="#38d9d6"
              emissiveIntensity={0.22}
              roughness={0.4}
            />
          </mesh>
          <mesh ref={strapLoopRef} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.043, 0.009, 12, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 3: Pelota Maní Terapéutica Transversal (Peanut Ball) */}
      {exerciseId === 'flexion-autoasistida-pelota-mani' && (
        <group ref={peanutBallGroupRef} position={[0.56, 0.145, 0]}>
          {/* Left lobe of peanut ball */}
          <mesh position={[0, 0, -0.15]} castShadow receiveShadow>
            <sphereGeometry args={[0.145, 28, 28]} />
            <meshStandardMaterial
              color="#28b8c8"
              emissive="#0ea5e9"
              emissiveIntensity={0.12}
              roughness={0.35}
            />
          </mesh>
          {/* Central saddle bridge of peanut ball */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.112, 0.112, 0.3, 28]} />
            <meshStandardMaterial
              color="#38d9d6"
              emissive="#0ea5e9"
              emissiveIntensity={0.14}
              roughness={0.35}
            />
          </mesh>
          {/* Right lobe of peanut ball */}
          <mesh position={[0, 0, 0.15]} castShadow receiveShadow>
            <sphereGeometry args={[0.145, 28, 28]} />
            <meshStandardMaterial
              color="#28b8c8"
              emissive="#0ea5e9"
              emissiveIntensity={0.12}
              roughness={0.35}
            />
          </mesh>
          {/* White grip ribs so rotation is clearly visible */}
          <mesh position={[0, 0, 0.15]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.146, 0.005, 8, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0, 0, -0.15]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.146, 0.005, 8, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
        </group>
      )}

      {/* 4: Camilla / Silla Alta + Pista de Deslizamiento Autoasistido */}
      {exerciseId === 'flexion-activa-en-sedestacion' && (
        <group>
          <mesh position={[-0.08, 0.42, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.46, 0.045, 0.48]} />
            <meshStandardMaterial color="#15324d" roughness={0.65} />
          </mesh>
          <mesh position={[-0.29, 0.68, 0]} rotation={[0, 0, 0.05]} receiveShadow castShadow>
            <boxGeometry args={[0.04, 0.48, 0.46]} />
            <meshStandardMaterial color="#15324d" roughness={0.65} />
          </mesh>
          {[
            [-0.26, 0.205, 0.19],
            [-0.26, 0.205, -0.19],
            [0.1, 0.205, 0.19],
            [0.1, 0.205, -0.19]
          ].map(([lx, ly, lz], idx) => (
            <mesh key={idx} position={[lx, ly, lz]} receiveShadow castShadow>
              <cylinderGeometry args={[0.016, 0.014, 0.41, 12]} />
              <meshStandardMaterial color="#5882a6" roughness={0.35} metalness={0.4} />
            </mesh>
          ))}
          <mesh position={[0.2, 0.003, 0.075]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.36, 0.045]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.45} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.32, 0.006, 0.075]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.028, 0.048, 28]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 5: Decúbito Prono — Contacto Manual del Kinesiólogo + Indicador Isométrico */}
      {exerciseId === 'flexion-asistida-prono' && (
        <group>
          <group ref={physioHandRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.09, 24]} />
              <meshStandardMaterial
                color="#38d9d6"
                emissive="#38d9d6"
                emissiveIntensity={0.35}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
          {/* Indicador luminoso de contracción isométrica del cuádriceps sobre la camilla */}
          <mesh
            ref={quadGlowRef}
            position={[0.16, 0.05, -0.095]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.085, 0.075, 0.28, 24]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.2} />
          </mesh>
        </group>
      )}

      {/* 6: Extensión Pasiva — Apoyo Cilíndrico Bajo el Talón y Rodilla Libre */}
      {exerciseId === 'extension-pasiva-apoyo-talon' && (
        <group>
          <mesh position={[0.74, 0.042, 0.095]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.048, 0.048, 0.22, 28]} />
            <meshStandardMaterial
              color="#38d9d6"
              emissive="#0ea5e9"
              emissiveIntensity={0.2}
              roughness={0.4}
            />
          </mesh>
          {/* Indicador de espacio libre bajo la rodilla (extensión a 0°) */}
          <mesh position={[0.35, 0.004, 0.095]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.04, 0.065, 28]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 7: Contracción Isométrica de Cuádriceps — Halo de Activación Muscular + Apoyo Poplíteo */}
      {exerciseId === 'contraccion-isometrica-cuadriceps' && (
        <group>
          <mesh
            ref={quadGlowRef}
            position={[0.15, 0.11, 0.095]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.082, 0.07, 0.26, 24]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0.35, 0.012, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.18, 20]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 8: Bombeo Activo de Tobillo — Indicador de Retorno Venoso */}
      {exerciseId === 'bombeo-activo-tobillo' && (
        <group>
          <mesh
            ref={ankleFlowRef}
            position={[0.55, 0.11, 0.095]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <torusGeometry args={[0.06, 0.008, 12, 28]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.75} />
          </mesh>
        </group>
      )}

      {/* 9: Elevación de Pierna Extendida (SLR) — Guía de Arco de Elevación sin Lag */}
      {exerciseId === 'elevacion-pierna-extendida' && (
        <group>
          <mesh position={[0.74, 0.22, 0.095]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.012, 0.36, 0.012]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const RehabExerciseScene: React.FC<RehabExerciseSceneProps> = ({
  exerciseId,
  playing,
  finalPose,
  slowMode,
  resetSignal,
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
      <ambientLight intensity={1.05} />
      <hemisphereLight args={['#ffffff', '#38d9d6', 0.75]} />
      <directionalLight
        position={[1.8, 2.8, 2.2]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-1.8, 1.6, -1.4]} intensity={0.6} color="#7dd3fc" />
      <directionalLight position={[0.5, 1.2, -2.0]} intensity={0.4} color="#38d9d6" />

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
          opacity={0.45}
          scale={2.8}
          blur={2.2}
          far={1.4}
          color="#040d17"
        />
      </Suspense>

      <OrbitControls
        target={cam.target}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.56}
        minAzimuthAngle={-Math.PI * 0.25}
        maxAzimuthAngle={Math.PI * 0.28}
        rotateSpeed={0.55}
      />
    </Canvas>
  );
};

useGLTF.preload('/models/rehab-human.glb');
export default RehabExerciseScene;
