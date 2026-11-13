import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type ConstellationShapeMode = 'brain' | 'knee' | 'auto';

interface ConstellationHero3DProps {
  mode?: ConstellationShapeMode;
}

const PARTICLE_COUNT = 2800;
const PALETTE = [
  '#8052ff', // Electric Iris (dominant)
  '#8052ff',
  '#ffb829', // Saffron Spark
  '#15846e', // Deep Verdant
  '#a855f7', // Violet
  '#38bdf8', // Cyan spark
  '#ec4899', // Magenta spark
  '#ffffff'  // Bone White
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const ConstellationCloud: React.FC<{ mode: ConstellationShapeMode }> = ({ mode }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const morphRef = useRef(0);

  const {
    brainPositions,
    kneePositions,
    rotations,
    scales,
    colors,
    phases,
    isAmbient,
    isGraft
  } = useMemo(() => {
    const brainPos = new Float32Array(PARTICLE_COUNT * 3);
    const kneePos = new Float32Array(PARTICLE_COUNT * 3);
    const rots = new Float32Array(PARTICLE_COUNT * 3);
    const scs = new Float32Array(PARTICLE_COUNT);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const phs = new Float32Array(PARTICLE_COUNT);
    const ambientFlags = new Uint8Array(PARTICLE_COUNT);
    const graftFlags = new Uint8Array(PARTICLE_COUNT);

    const tmpColor = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r1 = seededRandom(i * 3 + 1);
      const r2 = seededRandom(i * 3 + 2);
      const r3 = seededRandom(i * 3 + 3);
      const r4 = seededRandom(i * 7 + 5);

      phs[i] = r1 * Math.PI * 2;
      rots[i * 3] = r1 * Math.PI * 2;
      rots[i * 3 + 1] = r2 * Math.PI * 2;
      rots[i * 3 + 2] = r3 * Math.PI * 2;

      const ambient = i >= PARTICLE_COUNT * 0.87;
      ambientFlags[i] = ambient ? 1 : 0;

      // --- 1. BRAIN CONSTELLATION COORDINATES ---
      if (ambient) {
        // Scattered ambient triangle field floating in the void
        const theta = r1 * Math.PI * 2;
        const phi = Math.acos(2 * r2 - 1);
        const rad = 1.55 + r3 * 1.45;
        brainPos[i * 3] = rad * Math.sin(phi) * Math.cos(theta) * 1.25;
        brainPos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta) * 0.95;
        brainPos[i * 3 + 2] = rad * Math.cos(phi) * 1.1;
        scs[i] = 0.55 + r4 * 0.85;
      } else {
        // Two sculpted cerebral hemispheres + cerebellum + brainstem
        const hemisphere = i % 2 === 0 ? 1 : -1;
        const u = r1 * Math.PI * 2;
        const v = Math.acos(2 * r2 - 1);

        // Shell bias so cortical surface & gyri folds are crisp
        const shell = 0.72 + 0.28 * Math.pow(r3, 0.35);

        let bx = Math.sin(v) * Math.cos(u);
        let by = Math.cos(v);
        let bz = Math.sin(v) * Math.sin(u);

        // Cortical gyri/sulci harmonic folds
        const gyri =
          0.075 * Math.sin(bx * 9.5 + bz * 7.0) * Math.cos(by * 8.5) +
          0.045 * Math.cos(bz * 13.0 - bx * 6.0);

        const radius = (1.02 + gyri) * shell;

        // Anatomically proportioned hemisphere
        let x = Math.abs(bx) * 0.78 * radius + 0.085;
        let y = by * 0.86 * radius;
        let z = bz * 1.22 * radius;

        // Flatten inferior base & curve temporal lobe forward/down
        if (y < -0.2) {
          y *= 0.68;
          if (z > -0.2 && z < 0.55) {
            y -= 0.16 * Math.exp(-Math.pow((z - 0.15) * 2.5, 2));
            x += 0.08;
          }
        }

        // Slight occipital tapering & cerebellum cluster
        if (i % 11 === 0) {
          // Cerebellum under occipital lobe
          x = Math.abs(bx) * 0.48 * shell + 0.04;
          y = -0.52 + by * 0.26 * shell;
          z = -0.68 + bz * 0.34 * shell;
        }

        brainPos[i * 3] = x * hemisphere;
        brainPos[i * 3 + 1] = y + 0.08;
        brainPos[i * 3 + 2] = z;
        scs[i] = 0.65 + r4 * 0.75;
      }

      // --- 2. ARTICULATED 3D KNEE JOINT (LCA HTH) CONSTELLATION ---
      if (ambient) {
        kneePos[i * 3] = brainPos[i * 3] * 1.05;
        kneePos[i * 3 + 1] = brainPos[i * 3 + 1];
        kneePos[i * 3 + 2] = brainPos[i * 3 + 2];
      } else if (i < PARTICLE_COUNT * 0.36) {
        // Distal Femur + Femoral Condyles
        const t = i / (PARTICLE_COUNT * 0.36);
        const angle = r1 * Math.PI * 2;
        const h = 0.18 + t * 1.15;
        const condyleFlare = Math.exp(-Math.pow((h - 0.24) * 3.8, 2));
        const radX = 0.24 + condyleFlare * 0.26;
        const radZ = 0.22 + condyleFlare * 0.22;
        const shell = 0.78 + 0.22 * r2;
        const condyleSplit = condyleFlare * 0.12 * Math.sign(Math.cos(angle));

        kneePos[i * 3] = (Math.cos(angle) * radX * shell) + condyleSplit;
        kneePos[i * 3 + 1] = h;
        kneePos[i * 3 + 2] = Math.sin(angle) * radZ * shell - h * 0.12;
      } else if (i < PARTICLE_COUNT * 0.70) {
        // Proximal Tibia + Tibial Plateau
        const t = (i - PARTICLE_COUNT * 0.36) / (PARTICLE_COUNT * 0.34);
        const angle = r1 * Math.PI * 2;
        const h = -0.18 - t * 1.15;
        const plateauFlare = Math.exp(-Math.pow((h + 0.22) * 4.2, 2));
        const radX = 0.21 + plateauFlare * 0.27;
        const radZ = 0.20 + plateauFlare * 0.18;
        const shell = 0.78 + 0.22 * r2;

        kneePos[i * 3] = Math.cos(angle) * radX * shell;
        kneePos[i * 3 + 1] = h;
        kneePos[i * 3 + 2] = Math.sin(angle) * radZ * shell;
      } else if (i < PARTICLE_COUNT * 0.79) {
        // Patella (Rótula) + Patellar Tendon (HTH donor site)
        const angle = r1 * Math.PI * 2;
        const v = Math.acos(2 * r2 - 1);
        kneePos[i * 3] = Math.sin(v) * Math.cos(angle) * 0.22;
        kneePos[i * 3 + 1] = 0.08 + Math.cos(v) * 0.22;
        kneePos[i * 3 + 2] = 0.44 + Math.sin(v) * Math.sin(angle) * 0.1;
        graftFlags[i] = 1;
      } else {
        // Anterior Cruciate Ligament (LCA — HTH Graft) + Meniscal ring
        const s = (i - PARTICLE_COUNT * 0.79) / (PARTICLE_COUNT * 0.08);
        if (s < 0.55) {
          // Diagonal LCA graft fiber bundle from anteromedial tibia to posterolateral femur
          const u = s / 0.55;
          kneePos[i * 3] = (0.08 - u * 0.20) + (r1 - 0.5) * 0.07;
          kneePos[i * 3 + 1] = (-0.18 + u * 0.42) + (r2 - 0.5) * 0.07;
          kneePos[i * 3 + 2] = (0.16 - u * 0.28) + (r3 - 0.5) * 0.07;
          graftFlags[i] = 1;
        } else {
          // Medial & Lateral Meniscus rings in joint space (y ≈ 0)
          const side = i % 2 === 0 ? 1 : -1;
          const ang = (r1 - 0.5) * Math.PI * 1.5;
          kneePos[i * 3] = side * (0.20 + Math.cos(ang) * 0.14);
          kneePos[i * 3 + 1] = (r2 - 0.5) * 0.05;
          kneePos[i * 3 + 2] = Math.sin(ang) * 0.20;
        }
      }

      // Color selection from Dala palette
      const hex = graftFlags[i]
        ? i % 2 === 0
          ? '#ffb829'
          : '#8052ff'
        : PALETTE[Math.floor(r4 * PALETTE.length)];
      tmpColor.set(hex);
      cols[i * 3] = tmpColor.r;
      cols[i * 3 + 1] = tmpColor.g;
      cols[i * 3 + 2] = tmpColor.b;
    }

    return {
      brainPositions: brainPos,
      kneePositions: kneePos,
      rotations: rots,
      scales: scs,
      colors: cols,
      phases: phs,
      isAmbient: ambientFlags,
      isGraft: graftFlags
    };
  }, []);

  // Crisp flat equilateral triangle geometry (matching Dala's triangular particle glyphs)
  const triangleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const s = 0.022;
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

    // Determine target morph (0 = Brain, 1 = Knee)
    let targetMorph = 0;
    if (mode === 'knee') {
      targetMorph = 1;
    } else if (mode === 'brain') {
      targetMorph = 0;
    } else {
      // Smooth auto cycle every 7 seconds
      const cycle = Math.sin(t * 0.55);
      targetMorph = THREE.MathUtils.smoothstep(cycle, -0.35, 0.35);
    }

    morphRef.current += (targetMorph - morphRef.current) * Math.min(1, delta * 3.2);
    const m = morphRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22 + state.pointer.x * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.08 - state.pointer.y * 0.22;
    }

    const kneeFlexAngle = Math.sin(t * 1.4) * 0.26 * m;
    const cosFlex = Math.cos(kneeFlexAngle);
    const sinFlex = Math.sin(kneeFlexAngle);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const phase = phases[i];

      const bx = brainPositions[idx];
      const by = brainPositions[idx + 1];
      const bz = brainPositions[idx + 2];

      let kx = kneePositions[idx];
      let ky = kneePositions[idx + 1];
      let kz = kneePositions[idx + 2];

      // Subtle biomechanical flexion on tibia when in knee mode
      if (ky < -0.05 && !isAmbient[i]) {
        const ry = ky * cosFlex - kz * sinFlex;
        const rz = ky * sinFlex + kz * cosFlex;
        ky = ry;
        kz = rz;
      }

      const drift = isAmbient[i] ? 0.065 : 0.018;
      const dx = Math.sin(t * 0.9 + phase) * drift;
      const dy = Math.cos(t * 1.1 + phase * 1.3) * drift;
      const dz = Math.sin(t * 0.8 + phase * 0.7) * drift;

      dummyObj.position.set(
        bx + (kx - bx) * m + dx,
        by + (ky - by) * m + dy,
        bz + (kz - bz) * m + dz
      );

      dummyObj.rotation.set(
        rotations[idx] + t * 0.45,
        rotations[idx + 1] + t * 0.55,
        rotations[idx + 2]
      );

      const pulse = isGraft[i]
        ? 1 + 0.35 * Math.sin(t * 3.2 + phase)
        : 1 + 0.18 * Math.sin(t * 1.8 + phase);
      dummyObj.scale.setScalar(scales[i] * pulse);
      dummyObj.updateMatrix();
      mesh.setMatrixAt(i, dummyObj.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[triangleGeometry, undefined, PARTICLE_COUNT]}>
        <meshBasicMaterial
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
};

export const ConstellationHero3D: React.FC<ConstellationHero3DProps> = ({ mode = 'auto' }) => {
  return (
    <div className="relative h-full w-full select-none">
      {/* Subtle ambient deep-verdant & electric-iris radial glow behind the 3D particle cloud */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 52% 48%, rgba(128, 82, 255, 0.18) 0%, rgba(21, 132, 110, 0.08) 38%, rgba(0, 0, 0, 0) 70%)'
        }}
      />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.05, 3.15], fov: 42, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <ConstellationCloud mode={mode} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
        />
      </Canvas>
    </div>
  );
};

export default ConstellationHero3D;
