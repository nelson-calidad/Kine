import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface RehabExerciseSceneProps {
  exerciseId: string;
  playing: boolean;
  finalPose: boolean;
  slowMode: boolean;
  resetSignal: number;
  inView: boolean;
}

const L1 = 0.42;
const L2 = 0.44;
const SUPINE_THIGH_OFFSET = 0.085;
const UPRIGHT_THIGH_OFFSET = -Math.PI / 2 + 0.085;
const KNEE_REST_OFFSET = 0.11;

function solve2BoneIK(
  hipX: number,
  hipY: number,
  targetX: number,
  targetY: number,
  thighRestAngle: number
) {
  const dx = targetX - hipX;
  const dy = targetY - hipY;
  const rawD = Math.hypot(dx, dy);
  const d = Math.max(0.18, Math.min(L1 + L2 - 0.008, rawD));

  const cosKnee = Math.max(-1, Math.min(1, (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2)));
  const kneeFlex = Math.PI - Math.acos(cosKnee);

  const alpha = Math.atan2(dy, dx);
  const cosHip = Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
  const thighAngle = alpha + Math.acos(cosHip);

  const hipFlex = thighAngle - thighRestAngle;
  const shinAngle = thighAngle - kneeFlex;

  return {
    hipFlex,
    kneeFlex: Math.max(0, kneeFlex - KNEE_REST_OFFSET),
    thighAngle,
    shinAngle
  };
}

const dummyEuler = new THREE.Euler();
const dummyQuat = new THREE.Quaternion();
const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();
const tempVecC = new THREE.Vector3();
const tempMid = new THREE.Vector3();

function getBone(bones: Record<string, THREE.Object3D>, name: string): THREE.Object3D | undefined {
  return bones[name] || bones[name.replace(/\./g, '')];
}

function setBoneLocalEuler(
  bones: Record<string, THREE.Object3D>,
  name: string,
  rx: number,
  ry = 0,
  rz = 0
) {
  const bone = getBone(bones, name);
  if (!bone || !bone.userData.restQuat) return;
  dummyEuler.set(rx, ry, rz, 'XYZ');
  dummyQuat.setFromEuler(dummyEuler);
  bone.quaternion.copy(bone.userData.restQuat).multiply(dummyQuat);
}

const CAMERA_CONFIG: Record<
  string,
  { position: [number, number, number]; target: [number, number, number]; fov: number }
> = {
  'deslizamiento-del-talon': {
    position: [0.06, 0.56, 1.62],
    target: [0.08, 0.16, 0.04],
    fov: 35
  },
  'flexion-asistida-con-toalla': {
    position: [0.06, 0.58, 1.64],
    target: [0.06, 0.18, 0.04],
    fov: 35
  },
  'deslizamiento-del-pie-en-pared': {
    position: [0.02, 0.64, 1.68],
    target: [0.04, 0.25, 0.04],
    fov: 36
  },
  'flexion-activa-en-sedestacion': {
    position: [0.42, 0.68, 1.58],
    target: [0.04, 0.44, 0.02],
    fov: 36
  },
  'bicicleta-estatica-sin-resistencia': {
    position: [0.36, 0.78, 1.72],
    target: [0.04, 0.54, 0.0],
    fov: 37
  }
};

const AnimatedPhysioActor: React.FC<{
  exerciseId: string;
  playing: boolean;
  finalPose: boolean;
  slowMode: boolean;
  resetSignal: number;
}> = ({ exerciseId, playing, finalPose, slowMode, resetSignal }) => {
  const gltf = useGLTF('/models/rehab-human.glb');
  const { invalidate } = useThree();

  const characterGroupRef = useRef<THREE.Group>(null);
  const kneeBandRef = useRef<THREE.Mesh>(null);
  const strapRightRef = useRef<THREE.Mesh>(null);
  const strapLeftRef = useRef<THREE.Mesh>(null);
  const strapLoopRef = useRef<THREE.Mesh>(null);
  const heelMarkerRef = useRef<THREE.Mesh>(null);
  const pedalRightRef = useRef<THREE.Group>(null);
  const pedalLeftRef = useRef<THREE.Group>(null);
  const crankArmRightRef = useRef<THREE.Mesh>(null);
  const crankArmLeftRef = useRef<THREE.Mesh>(null);

  const phaseRef = useRef<number>(finalPose ? 0.5 : 0);
  const smoothTRef = useRef<number>(finalPose ? 1 : 0);

  const { clonedScene, bones } = useMemo(() => {
    const cloned = cloneSkeleton(gltf.scene);
    const boneMap: Record<string, THREE.Object3D> = {};

    cloned.traverse((obj) => {
      if (obj.name) {
        obj.userData.restQuat = obj.quaternion.clone();
        boneMap[obj.name] = obj;
        boneMap[obj.name.replace(/\./g, '')] = obj;
      }
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = obj as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        mesh.material = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.78,
          metalness: 0.04
        });
      }
    });

    return { clonedScene: cloned, bones: boneMap };
  }, [gltf.scene]);

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

    if (
      exerciseId === 'deslizamiento-del-talon' ||
      exerciseId === 'flexion-asistida-con-toalla' ||
      exerciseId === 'deslizamiento-del-pie-en-pared'
    ) {
      // Supine posture on rehabilitation plinth/mat (mat top at y = 0)
      group.rotation.set(-Math.PI / 2, Math.PI / 2, 0, 'YXZ');
      group.position.set(0.85, 0.09, 0);

      // Gentle neck/head elevation on pillow
      setBoneLocalEuler(bones, 'neck01', 0.18, 0, 0);
      setBoneLocalEuler(bones, 'head', 0.14, 0, 0);

      // Left (non-operated) leg relaxed on the mat
      setBoneLocalEuler(bones, 'upperleg01L', -0.05, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', 0.06, 0, 0);
      setBoneLocalEuler(bones, 'footL', -0.05, 0, 0);

      if (exerciseId === 'deslizamiento-del-talon') {
        // Arms relaxed flat alongside the body on the mat (un-bending rest elbow flexion)
        setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
        setBoneLocalEuler(bones, 'upperarm01R', -0.06, 0, 0.28);
        setBoneLocalEuler(bones, 'lowerarm01R', -0.78, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
        setBoneLocalEuler(bones, 'upperarm01L', -0.06, 0, -0.28);
        setBoneLocalEuler(bones, 'lowerarm01L', -0.78, 0, 0);

        // Right heel slides horizontally along y = 0.073 (keeping heel flush on mat y = 0)
        const kneeFlex = 0.08 + t * 1.62;
        const hipFlex = kneeFlex * 0.515 - 0.03;
        setBoneLocalEuler(bones, 'upperleg01R', -hipFlex, 0, -0.06);
        setBoneLocalEuler(bones, 'lowerleg01R', kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -kneeFlex * 0.35, 0, 0);
      } else if (exerciseId === 'flexion-asistida-con-toalla') {
        // Upper torso slightly supported, hands holding non-elastic towel strap
        setBoneLocalEuler(bones, 'spine02', 0.08, 0, 0);
        setBoneLocalEuler(bones, 'spine01', 0.1, 0, 0);

        // Elbows flex smoothly as the heel slides towards the body
        setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
        setBoneLocalEuler(bones, 'upperarm01R', 0.05 - t * 0.17, 0, 0.26);
        setBoneLocalEuler(bones, 'lowerarm01R', 0.15 + t * 0.4, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
        setBoneLocalEuler(bones, 'upperarm01L', 0.05 - t * 0.17, 0, -0.26);
        setBoneLocalEuler(bones, 'lowerarm01L', 0.15 + t * 0.4, 0, 0);

        // Heel stays supported on the mat while sliding towards glutes
        const kneeFlex = 0.14 + t * 1.62;
        const hipFlex = kneeFlex * 0.515 - 0.025;
        setBoneLocalEuler(bones, 'upperleg01R', -hipFlex, 0, -0.06);
        setBoneLocalEuler(bones, 'lowerleg01R', kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', -kneeFlex * 0.42 - 0.12, 0, 0);
      } else if (exerciseId === 'deslizamiento-del-pie-en-pared') {
        // Supine facing vertical wall at x = 0.55, arms resting flat on mat
        setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
        setBoneLocalEuler(bones, 'upperarm01R', -0.06, 0, 0.28);
        setBoneLocalEuler(bones, 'lowerarm01R', -0.78, 0, 0);

        setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
        setBoneLocalEuler(bones, 'upperarm01L', -0.06, 0, -0.28);
        setBoneLocalEuler(bones, 'lowerarm01L', -0.78, 0, 0);

        // 2-bone IK keeping right foot in continuous contact with vertical wall at x = 0.508
        const hipX = -0.077;
        const hipY = 0.083;
        const targetX = 0.5;
        const targetY = 0.55 - t * 0.27;
        const ik = solve2BoneIK(hipX, hipY, targetX, targetY, SUPINE_THIGH_OFFSET);

        setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.06);
        setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
        setBoneLocalEuler(bones, 'footR', ik.shinAngle - 0.25, 0, 0);
      }
    } else if (exerciseId === 'flexion-activa-en-sedestacion') {
      // Seated upright on firm clinical chair (seat top at y = 0.43)
      group.rotation.set(0, Math.PI / 2, 0, 'YXZ');
      group.position.set(-0.14, -0.435, 0);

      setBoneLocalEuler(bones, 'spine04', 0.05, 0, 0);
      setBoneLocalEuler(bones, 'neck01', -0.04, 0, 0);

      // Hands resting naturally on sides of chair seat / thighs
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.24);
      setBoneLocalEuler(bones, 'upperarm01R', 0.05, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.1, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.24);
      setBoneLocalEuler(bones, 'upperarm01L', 0.05, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.1, 0, 0);

      // Left leg planted firmly on floor in front
      setBoneLocalEuler(bones, 'upperleg01L', -1.46, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', 1.45, 0, 0);
      setBoneLocalEuler(bones, 'footL', 0.02, 0, 0);

      // Operated right foot slides BACKWARD underneath the chair along the floor (y = 0.072)
      const hipX = -0.147;
      const hipY = 0.492;
      const targetX = 0.3 - t * 0.255;
      const targetY = 0.072;
      const ik = solve2BoneIK(hipX, hipY, targetX, targetY, UPRIGHT_THIGH_OFFSET);

      setBoneLocalEuler(bones, 'upperleg01R', -ik.hipFlex, 0, -0.05);
      setBoneLocalEuler(bones, 'lowerleg01R', ik.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', ik.shinAngle - -Math.PI / 2, 0, 0);
    } else if (exerciseId === 'bicicleta-estatica-sin-resistencia') {
      // Seated on stationary rehabilitation bike
      group.rotation.set(0, Math.PI / 2, 0, 'YXZ');
      group.position.set(-0.173, -0.207, 0);

      // Ergonomic upright cycling torso inclination
      setBoneLocalEuler(bones, 'spine04', 0.16, 0, 0);
      setBoneLocalEuler(bones, 'spine02', 0.12, 0, 0);
      setBoneLocalEuler(bones, 'neck01', -0.18, 0, 0);

      // Hands grasping stationary bike handlebars
      setBoneLocalEuler(bones, 'shoulder01R', 0, 0, 0.25);
      setBoneLocalEuler(bones, 'upperarm01R', 0.65, 0, 0.28);
      setBoneLocalEuler(bones, 'lowerarm01R', 0.15, 0, 0);

      setBoneLocalEuler(bones, 'shoulder01L', 0, 0, -0.25);
      setBoneLocalEuler(bones, 'upperarm01L', 0.65, 0, -0.28);
      setBoneLocalEuler(bones, 'lowerarm01L', 0.15, 0, 0);

      const hipX = -0.18;
      const hipY = 0.72;
      const crankX = 0.11;
      const crankY = 0.31;
      const radius = 0.142;

      const angleR = playing ? crankPhase : -0.45 + t * (Math.PI * 0.95);
      const angleL = angleR + Math.PI;

      const rx = crankX + radius * Math.cos(angleR);
      const ry = crankY + radius * Math.sin(angleR);
      const ikR = solve2BoneIK(hipX, hipY, rx, ry, UPRIGHT_THIGH_OFFSET);

      setBoneLocalEuler(bones, 'upperleg01R', -ikR.hipFlex, 0, -0.05);
      setBoneLocalEuler(bones, 'lowerleg01R', ikR.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footR', ikR.shinAngle - -Math.PI / 2, 0, 0);

      const lx = crankX + radius * Math.cos(angleL);
      const ly = crankY + radius * Math.sin(angleL);
      const ikL = solve2BoneIK(hipX, hipY, lx, ly, UPRIGHT_THIGH_OFFSET);

      setBoneLocalEuler(bones, 'upperleg01L', -ikL.hipFlex, 0, 0.05);
      setBoneLocalEuler(bones, 'lowerleg01L', ikL.kneeFlex, 0, 0);
      setBoneLocalEuler(bones, 'footL', ikL.shinAngle - -Math.PI / 2, 0, 0);

      const pedalOffsetX = 0.055;
      const pedalOffsetY = -0.028;
      if (pedalRightRef.current) {
        pedalRightRef.current.position.set(rx + pedalOffsetX, ry + pedalOffsetY, 0.095);
      }
      if (pedalLeftRef.current) {
        pedalLeftRef.current.position.set(lx + pedalOffsetX, ly + pedalOffsetY, -0.095);
      }
      if (crankArmRightRef.current) {
        crankArmRightRef.current.position.set(
          crankX + pedalOffsetX + radius * 0.5 * Math.cos(angleR),
          crankY + pedalOffsetY + radius * 0.5 * Math.sin(angleR),
          0.065
        );
        crankArmRightRef.current.rotation.z = angleR;
      }
      if (crankArmLeftRef.current) {
        crankArmLeftRef.current.position.set(
          crankX + pedalOffsetX + radius * 0.5 * Math.cos(angleL),
          crankY + pedalOffsetY + radius * 0.5 * Math.sin(angleL),
          -0.065
        );
        crankArmLeftRef.current.rotation.z = angleL;
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

    // Update live 3D heel/foot indicator & towel straps from real world bone positions
    const footBone = getBone(bones, 'footR');
    if (footBone && heelMarkerRef.current) {
      tempVecA.setFromMatrixPosition(footBone.matrixWorld);
      if (exerciseId === 'deslizamiento-del-pie-en-pared') {
        heelMarkerRef.current.position.set(0.542, tempVecA.y, tempVecA.z);
      } else if (exerciseId === 'flexion-activa-en-sedestacion') {
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
    const speedFactor = slowMode ? 0.22 : 0.46;

    if (playing) {
      phaseRef.current += clampedDelta * speedFactor;
      const t = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
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

  const isSupine =
    exerciseId === 'deslizamiento-del-talon' ||
    exerciseId === 'flexion-asistida-con-toalla' ||
    exerciseId === 'deslizamiento-del-pie-en-pared';

  return (
    <group>
      {/* Articulated MakeHuman Character */}
      <group ref={characterGroupRef}>
        <primitive object={clonedScene} />
      </group>

      {/* Smooth 3D Knee Support Band on Operated Right Knee */}
      <mesh ref={kneeBandRef} castShadow>
        <cylinderGeometry args={[0.062, 0.055, 0.075, 32]} />
        <meshStandardMaterial color="#32a6a4" roughness={0.6} />
      </mesh>

      {/* 1, 2, 3: Supine Rehabilitation Plinth / Mat + Head Pillow */}
      {isSupine && (
        <group>
          <mesh position={[0.04, -0.03, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.82, 0.06, 0.68]} />
            <meshStandardMaterial color="#dce9ec" roughness={0.85} />
          </mesh>
          <mesh position={[0.04, -0.075, 0]} receiveShadow>
            <boxGeometry args={[1.84, 0.03, 0.7]} />
            <meshStandardMaterial color="#9bb2bd" roughness={0.7} />
          </mesh>
          <mesh position={[-0.68, 0.022, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.28, 0.048, 0.42]} />
            <meshStandardMaterial color="#f8fbfc" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 1 & 2: Linear Heel Slide Track Indicator on Mat */}
      {(exerciseId === 'deslizamiento-del-talon' ||
        exerciseId === 'flexion-asistida-con-toalla') && (
        <group>
          <mesh position={[0.61, 0.002, 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.035]} />
            <meshBasicMaterial color="#32a6a4" transparent opacity={0.28} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.76, 0.006, 0.125]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.025, 0.042, 24]} />
            <meshBasicMaterial color="#173b59" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 2: Non-elastic Rehabilitation Towel / Strap */}
      {exerciseId === 'flexion-asistida-con-toalla' && (
        <group>
          <mesh ref={strapRightRef} castShadow>
            <boxGeometry args={[0.024, 0.007, 1]} />
            <meshStandardMaterial color="#32a6a4" roughness={0.6} />
          </mesh>
          <mesh ref={strapLeftRef} castShadow>
            <boxGeometry args={[0.024, 0.007, 1]} />
            <meshStandardMaterial color="#32a6a4" roughness={0.6} />
          </mesh>
          <mesh ref={strapLoopRef} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.042, 0.008, 10, 24]} />
            <meshStandardMaterial color="#173b59" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* 3: Vertical Wall Panel & Controlled Descent Track */}
      {exerciseId === 'deslizamiento-del-pie-en-pared' && (
        <group>
          <mesh position={[0.565, 0.38, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.045, 0.88, 0.72]} />
            <meshStandardMaterial color="#e3edf2" roughness={0.85} />
          </mesh>
          <mesh position={[0.538, 0.015, 0]}>
            <boxGeometry args={[0.015, 0.03, 0.72]} />
            <meshStandardMaterial color="#9bb2bd" roughness={0.7} />
          </mesh>
          <mesh position={[0.541, 0.42, 0.075]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.04, 0.36]} />
            <meshBasicMaterial color="#32a6a4" transparent opacity={0.3} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.542, 0.52, 0.075]} rotation={[0, -Math.PI / 2, 0]}>
            <ringGeometry args={[0.026, 0.044, 24]} />
            <meshBasicMaterial color="#173b59" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 4: Stable Clinical Chair + Backward Floor Slide Track */}
      {exerciseId === 'flexion-activa-en-sedestacion' && (
        <group>
          <mesh position={[-0.08, 0.42, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.44, 0.04, 0.46]} />
            <meshStandardMaterial color="#d5e4e8" roughness={0.8} />
          </mesh>
          <mesh position={[-0.28, 0.68, 0]} rotation={[0, 0, 0.05]} receiveShadow castShadow>
            <boxGeometry args={[0.04, 0.48, 0.44]} />
            <meshStandardMaterial color="#d5e4e8" roughness={0.8} />
          </mesh>
          {[
            [-0.26, 0.205, 0.19],
            [-0.26, 0.205, -0.19],
            [0.1, 0.205, 0.19],
            [0.1, 0.205, -0.19]
          ].map(([lx, ly, lz], idx) => (
            <mesh key={idx} position={[lx, ly, lz]} receiveShadow castShadow>
              <cylinderGeometry args={[0.016, 0.014, 0.41, 12]} />
              <meshStandardMaterial color="#5c7686" roughness={0.5} metalness={0.2} />
            </mesh>
          ))}
          <mesh position={[0.21, 0.003, 0.075]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.34, 0.045]} />
            <meshBasicMaterial color="#32a6a4" transparent opacity={0.28} />
          </mesh>
          <mesh ref={heelMarkerRef} position={[0.32, 0.006, 0.075]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.028, 0.046, 24]} />
            <meshBasicMaterial color="#173b59" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 5: Stationary Rehabilitation Bike (Bicicleta Fija) */}
      {exerciseId === 'bicicleta-estatica-sin-resistencia' && (
        <group>
          <mesh position={[0.08, 0.018, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.92, 0.032, 0.06]} />
            <meshStandardMaterial color="#425b6d" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[-0.28, 0.018, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.06, 0.032, 0.46]} />
            <meshStandardMaterial color="#425b6d" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0.46, 0.018, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.06, 0.032, 0.46]} />
            <meshStandardMaterial color="#425b6d" roughness={0.5} metalness={0.3} />
          </mesh>

          <mesh position={[-0.12, 0.36, 0]} rotation={[0, 0, 0.24]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 0.68, 14]} />
            <meshStandardMaterial color="#5c7686" roughness={0.45} metalness={0.3} />
          </mesh>
          <mesh position={[-0.2, 0.675, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.22, 0.045, 0.18]} />
            <meshStandardMaterial color="#173b59" roughness={0.7} />
          </mesh>

          <mesh position={[0.31, 0.44, 0]} rotation={[0, 0, -0.18]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 0.84, 14]} />
            <meshStandardMaterial color="#5c7686" roughness={0.45} metalness={0.3} />
          </mesh>
          <mesh position={[0.275, 0.835, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.44, 12]} />
            <meshStandardMaterial color="#173b59" roughness={0.6} />
          </mesh>
          <mesh position={[0.33, 0.88, 0]} rotation={[0, 0, -0.5]} castShadow>
            <boxGeometry args={[0.1, 0.025, 0.14]} />
            <meshStandardMaterial color="#294b60" roughness={0.5} />
          </mesh>

          <mesh position={[0.165, 0.282, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.07, 28]} />
            <meshStandardMaterial color="#d5e4e8" roughness={0.6} />
          </mesh>
          <mesh position={[0.165, 0.282, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 18]} />
            <meshStandardMaterial color="#173b59" roughness={0.5} />
          </mesh>

          <mesh position={[0.165, 0.282, 0.095]}>
            <ringGeometry args={[0.136, 0.148, 36]} />
            <meshBasicMaterial color="#32a6a4" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>

          <mesh ref={crankArmRightRef} position={[0.22, 0.282, 0.065]}>
            <boxGeometry args={[0.15, 0.022, 0.012]} />
            <meshStandardMaterial color="#425b6d" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh ref={crankArmLeftRef} position={[0.1, 0.282, -0.065]}>
            <boxGeometry args={[0.15, 0.022, 0.012]} />
            <meshStandardMaterial color="#425b6d" metalness={0.4} roughness={0.4} />
          </mesh>

          <group ref={pedalRightRef} position={[0.3, 0.28, 0.095]}>
            <mesh castShadow>
              <boxGeometry args={[0.11, 0.02, 0.075]} />
              <meshStandardMaterial color="#173b59" roughness={0.6} />
            </mesh>
          </group>
          <group ref={pedalLeftRef} position={[0.03, 0.28, -0.095]}>
            <mesh castShadow>
              <boxGeometry args={[0.11, 0.02, 0.075]} />
              <meshStandardMaterial color="#173b59" roughness={0.6} />
            </mesh>
          </group>
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
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#ffffff', '#cbe2e0', 0.65]} />
      <directionalLight
        position={[1.8, 2.8, 2.2]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-1.6, 1.4, -1.2]} intensity={0.35} />

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
          opacity={0.28}
          scale={2.8}
          blur={2.2}
          far={1.4}
        />
      </Suspense>

      <OrbitControls
        target={cam.target}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.56}
        minAzimuthAngle={-Math.PI * 0.22}
        maxAzimuthAngle={Math.PI * 0.28}
        rotateSpeed={0.55}
      />
    </Canvas>
  );
};

useGLTF.preload('/models/rehab-human.glb');
export default RehabExerciseScene;
