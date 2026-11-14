import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 2200;

// Celeste, Turquoise, Ice-Blue & Pure White Palette
const PALETTE = [
  '#38d9d6', // Bright Turquoise
  '#7dd3fc', // Luminous Celeste / Sky Blue
  '#ffffff', // Crisp Pure White
  '#0ea5e9', // Deep Cyan Blue
  '#a5f3fc', // Ice Cyan
  '#2dd4bf'  // Clinical Teal
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateConstellations(count: number) {
  const brainPositions = new Float32Array(count * 3);
  const kneePositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);

  const colorObjs = PALETTE.map((hex) => new THREE.Color(hex));

  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 3 + 1);
    const r2 = seededRandom(i * 3 + 2);
    const r3 = seededRandom(i * 3 + 3);
    const r4 = seededRandom(i * 3 + 4);
    const r5 = seededRandom(i * 3 + 5);

    // -----------------------------------------------------------------
    // 1. 3D CORTICAL BRAIN CONSTELLATION (Two Defined Hemispheres + Gyri)
    // -----------------------------------------------------------------
    const isRightHemi = i % 2 === 0;
    const hemiSign = isRightHemi ? 1 : -1;

    const u = r1 * Math.PI * 2;
    const v = Math.acos(2 * r2 - 1);
    // Surface-concentrated shell so the brain outline is super crisp
    const shellRadius = 0.88 + 0.12 * Math.pow(r3, 0.35);

    let bx = shellRadius * Math.sin(v) * Math.cos(u) * 0.56;
    let by = shellRadius * Math.sin(v) * Math.sin(u) * 0.78;
    let bz = shellRadius * Math.cos(v) * 1.08;

    // Cortical gyri/sulci ridges so it looks unmistakably like a brain
    const ridge =
      Math.sin(bz * 8.5 + by * 4.0) * 0.055 +
      Math.cos(bx * 9.0 - by * 6.0) * 0.04;
    bx += hemiSign * (0.2 + Math.abs(bx) * 0.32) + ridge * hemiSign;

    if (by < -0.15) {
      by *= 0.65;
    }

    // Cerebellum & descending motor tract at back-bottom
    if (i > count * 0.84) {
      const stemT = (i - count * 0.84) / (count * 0.16);
      bx = (r1 - 0.5) * 0.24;
      by = -0.45 - stemT * 0.85;
      bz = -0.18 - Math.sin(stemT * Math.PI) * 0.15 + (r2 - 0.5) * 0.16;
    }

    brainPositions[i * 3] = bx;
    brainPositions[i * 3 + 1] = by + 0.12;
    brainPositions[i * 3 + 2] = bz;

    // -----------------------------------------------------------------
    // 2. 3D ANATOMICAL KNEE (LCA HTH) SURFACE CONSTELLATION
    // -----------------------------------------------------------------
    let kx = 0;
    let ky = 0;
    let kz = 0;

    if (i < count * 0.38) {
      // Distal Femur & Dual Femoral Condyles (Clear anatomical silhouette)
      const t = i / (count * 0.38);
      const angle = r1 * Math.PI * 2;
      if (t < 0.62) {
        const yPos = 0.25 + (t / 0.62) * 0.92;
        const radius = 0.22 + (1 - t / 0.62) * 0.12;
        kx = Math.cos(angle) * radius;
        ky = yPos;
        kz = Math.sin(angle) * radius;
      } else {
        const condyleSign = i % 2 === 0 ? 1 : -1;
        kx = condyleSign * 0.2 + Math.cos(angle) * 0.17;
        ky = 0.14 + Math.sin(angle) * 0.18;
        kz = (r2 - 0.5) * 0.34;
      }
    } else if (i < count * 0.74) {
      // Proximal Tibia, Tibial Plateau & Fibula Head
      const t = (i - count * 0.38) / (count * 0.36);
      const angle = r1 * Math.PI * 2;
      if (t < 0.28) {
        // Wide Tibial Plateau
        kx = (r1 - 0.5) * 0.68;
        ky = -0.14 - t * 0.25;
        kz = (r2 - 0.5) * 0.44;
      } else {
        const yPos = -0.22 - ((t - 0.28) / 0.72) * 0.95;
        const radius = 0.2 * (1 - (t - 0.28) * 0.22);
        kx = Math.cos(angle) * radius;
        ky = yPos;
        kz = Math.sin(angle) * radius;
      }
    } else if (i < count * 0.88) {
      // Patella (Rótula) + Injerto HTH (Hueso-Tendón-Hueso Rotuliano) in front
      const t = (i - count * 0.74) / (count * 0.14);
      const angle = r1 * Math.PI * 2;
      if (t < 0.5) {
        // Patella shield
        kx = Math.cos(angle) * 0.17;
        ky = 0.12 + Math.sin(angle) * 0.16;
        kz = 0.34 + (r2 - 0.5) * 0.06;
      } else {
        // Patellar tendon (HTH) descending to tibial tuberosity
        const lt = (t - 0.5) / 0.5;
        kx = (r1 - 0.5) * 0.1;
        ky = 0.04 - lt * 0.36;
        kz = 0.33 - lt * 0.08;
      }
    } else {
      // Glowing Reconstructed ACL Graft (LCA) crossing diagonal inside the notch
      const t = (i - count * 0.88) / (count * 0.12);
      kx = -0.12 + t * 0.24 + (r1 - 0.5) * 0.05;
      ky = 0.22 - t * 0.42 + (r2 - 0.5) * 0.05;
      kz = -0.12 + t * 0.26 + (r3 - 0.5) * 0.05;
    }

    kneePositions[i * 3] = kx;
    kneePositions[i * 3 + 1] = ky;
    kneePositions[i * 3 + 2] = kz;

    // Color assignment: highlight ACL & Patellar HTH in Pure White & Bright Turquoise
    let colorIdx = Math.floor(r4 * colorObjs.length);
    if (i >= count * 0.74) {
      colorIdx = i % 2 === 0 ? 0 : 2; // #38d9d6 Turquoise & #ffffff White
    }
    const c = colorObjs[colorIdx];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    scales[i] = 0.65 + r5 * 0.85;
    phases[i] = r1 * Math.PI * 2;
  }

  return { brainPositions, kneePositions, colors, scales, phases };
}

interface ConstellationCloudProps {
  mode: 'auto' | 'brain' | 'knee';
}

const ConstellationCloud: React.FC<ConstellationCloudProps> = ({ mode }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const kneeMeshGroupRef = useRef<THREE.Group>(null);
  const tibiaGroupRef = useRef<THREE.Group>(null);
  const brainShellRef = useRef<THREE.Group>(null);
  // Start directly showing the 3D Knee (morph = 1) so it's immediately clear
  const morphRef = useRef(1);

  const { brainPositions, kneePositions, colors, scales, phases } = useMemo(
    () => generateConstellations(PARTICLE_COUNT),
    []
  );

  const triangleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const s = 0.02;
    const vertices = new Float32Array([
      0, s, 0,
      -s * 0.866, -s * 0.5, 0,
      s * 0.866, -s * 0.5, 0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);

  const dummyObj = useMemo(() => new THREE.Object3D(), []);
  const colorAttrInitialized = useRef(false);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!colorAttrInitialized.current) {
      const c = new THREE.Color();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        c.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
        mesh.setColorAt(i, c);
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colorAttrInitialized.current = true;
    }

    const t = state.clock.getElapsedTime();

    // Target morph: 0 = Brain, 1 = Knee (in 'auto', spends 70% on Knee and 30% on Brain)
    let targetMorph = 1;
    if (mode === 'knee') {
      targetMorph = 1;
    } else if (mode === 'brain') {
      targetMorph = 0;
    } else {
      const cycle = Math.cos(t * 0.45);
      targetMorph = THREE.MathUtils.smoothstep(cycle, -0.55, 0.15);
    }

    morphRef.current += (targetMorph - morphRef.current) * Math.min(1, delta * 3.0);
    const m = morphRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.45 + state.pointer.x * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.06 - state.pointer.y * 0.18;
    }

    // Gentle anatomical knee flexion in real time
    const kneeFlexAngle = (0.5 - 0.5 * Math.cos(t * 1.35)) * 0.52 * m;
    const cosFlex = Math.cos(kneeFlexAngle);
    const sinFlex = Math.sin(kneeFlexAngle);

    if (kneeMeshGroupRef.current) {
      kneeMeshGroupRef.current.visible = m > 0.05;
      kneeMeshGroupRef.current.scale.setScalar(Math.max(0.001, m));
    }
    if (tibiaGroupRef.current) {
      tibiaGroupRef.current.rotation.x = kneeFlexAngle;
    }
    if (brainShellRef.current) {
      brainShellRef.current.visible = 1 - m > 0.05;
      brainShellRef.current.scale.setScalar(Math.max(0.001, 1 - m));
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const phase = phases[i];

      const bx = brainPositions[idx];
      const by = brainPositions[idx + 1];
      const bz = brainPositions[idx + 2];

      const kx = kneePositions[idx];
      let ky = kneePositions[idx + 1];
      let kz = kneePositions[idx + 2];

      if (ky < -0.05) {
        const dy = ky + 0.05;
        const dz = kz;
        ky = -0.05 + dy * cosFlex - dz * sinFlex;
        kz = dz * cosFlex + dy * sinFlex;
      }

      const x = THREE.MathUtils.lerp(bx, kx, m) + Math.sin(t * 1.4 + phase) * 0.012;
      const y = THREE.MathUtils.lerp(by, ky, m) + Math.cos(t * 1.2 + phase) * 0.012;
      const z = THREE.MathUtils.lerp(bz, kz, m) + Math.sin(t * 1.5 + phase * 0.7) * 0.012;

      dummyObj.position.set(x, y, z);
      dummyObj.rotation.set(
        t * 0.7 + phase,
        t * 0.5 + phase * 1.3,
        t * 0.4 + phase * 0.7
      );
      const pulse = 0.88 + 0.25 * Math.sin(t * 2.2 + phase);
      dummyObj.scale.setScalar(scales[i] * pulse);
      dummyObj.updateMatrix();
      mesh.setMatrixAt(i, dummyObj.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Instanced 3D Celestial Particles */}
      <instancedMesh
        ref={meshRef}
        args={[triangleGeometry, undefined, PARTICLE_COUNT]}
        frustumCulled={false}
      >
        <meshBasicMaterial
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
          opacity={0.94}
        />
      </instancedMesh>

      {/* HOLOGRAPHIC 3D ANATOMICAL KNEE CORE (Makes the Knee 100% Recognizable!) */}
      <group ref={kneeMeshGroupRef}>
        {/* Distal Femur Shaft & Condyles */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.19, 0.23, 0.85, 20]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#38d9d6"
            emissiveIntensity={0.25}
            transparent
            opacity={0.28}
            wireframe={false}
          />
        </mesh>
        <mesh position={[-0.17, 0.16, 0]}>
          <sphereGeometry args={[0.17, 20, 20]} />
          <meshStandardMaterial
            color="#38d9d6"
            emissive="#38d9d6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.32}
          />
        </mesh>
        <mesh position={[0.17, 0.16, 0]}>
          <sphereGeometry args={[0.17, 20, 20]} />
          <meshStandardMaterial
            color="#38d9d6"
            emissive="#38d9d6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.32}
          />
        </mesh>

        {/* Glowing Reconstructed ACL (LCA) Graft inside the joint */}
        <mesh position={[0, 0.0, 0.04]} rotation={[0.45, 0, -0.35]}>
          <cylinderGeometry args={[0.036, 0.036, 0.36, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Patella (Rótula) */}
        <mesh position={[0, 0.14, 0.32]}>
          <sphereGeometry args={[0.13, 18, 18]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#38d9d6"
            emissiveIntensity={0.45}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Articulated Tibia + Patellar Tendon (HTH Graft) */}
        <group ref={tibiaGroupRef} position={[0, -0.05, 0]}>
          {/* Tibial Plateau */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.28, 0.22, 0.14, 24]} />
            <meshStandardMaterial
              color="#38d9d6"
              emissive="#0ea5e9"
              emissiveIntensity={0.3}
              transparent
              opacity={0.34}
            />
          </mesh>
          {/* Tibial Shaft */}
          <mesh position={[0, -0.58, 0]}>
            <cylinderGeometry args={[0.19, 0.14, 0.85, 20]} />
            <meshStandardMaterial
              color="#0ea5e9"
              emissive="#38d9d6"
              emissiveIntensity={0.22}
              transparent
              opacity={0.28}
            />
          </mesh>
          {/* Glowing HTH Patellar Tendon Graft Band */}
          <mesh position={[0, -0.05, 0.3]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.075, 0.32, 0.025]} />
            <meshBasicMaterial color="#38d9d6" transparent opacity={0.85} />
          </mesh>
        </group>

        {/* Orbital Holographic Biomechanical Ring around Knee */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.5, 48]} />
          <meshBasicMaterial color="#38d9d6" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* HOLOGRAPHIC 3D BRAIN CORTEX CORE (Visible in Brain mode) */}
      <group ref={brainShellRef} position={[0, 0.12, 0]}>
        <mesh position={[-0.26, 0, 0]} scale={[0.55, 0.72, 0.98]}>
          <sphereGeometry args={[0.85, 20, 20]} />
          <meshStandardMaterial
            color="#38d9d6"
            emissive="#0ea5e9"
            emissiveIntensity={0.35}
            transparent
            opacity={0.24}
            wireframe
          />
        </mesh>
        <mesh position={[0.26, 0, 0]} scale={[0.55, 0.72, 0.98]}>
          <sphereGeometry args={[0.85, 20, 20]} />
          <meshStandardMaterial
            color="#38d9d6"
            emissive="#0ea5e9"
            emissiveIntensity={0.35}
            transparent
            opacity={0.24}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
};

export interface ConstellationHero3DProps {
  mode?: 'auto' | 'brain' | 'knee';
}

export const ConstellationHero3D: React.FC<ConstellationHero3DProps> = ({
  mode = 'knee'
}) => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.05, 2.95], fov: 40, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[2, 3, 2]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-2, -1, 2]} intensity={0.8} color="#38d9d6" />
        <ConstellationCloud mode={mode} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.65}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
        />
      </Canvas>
    </div>
  );
};

export default ConstellationHero3D;
