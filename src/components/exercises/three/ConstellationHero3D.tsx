import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Eye, Pause, Play } from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/**
 * Generates a smooth, anatomically proportioned 3D bone shaft + condylar flare
 * using LatheGeometry + gentle anteroposterior sculpting.
 */
function createFemurGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = condylar base (y=0.05), 1 = proximal shaft (y=1.18)
    const y = 0.08 + t * 1.1;
    // Smooth metaphyseal flare towards the femoral condyles at the bottom
    const flare = Math.exp(-t * 4.2) * 0.14;
    const shaft = 0.135 + 0.015 * Math.sin(t * Math.PI);
    const r = (shaft + flare) * (i === steps ? 0.92 : 1);
    points.push(new THREE.Vector2(r, y));
  }
  const geom = new THREE.LatheGeometry(points, 36);
  geom.computeVertexNormals();
  return geom;
}

function createTibiaGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = distal shaft (y=-1.18), 1 = tibial plateau (y=-0.06)
    const y = -1.16 + t * 1.1;
    // Smooth flare up to the broad tibial plateau at t = 1
    const flare = Math.pow(t, 3.2) * 0.16;
    const shaft = 0.115 + 0.015 * t;
    const r = shaft + flare;
    points.push(new THREE.Vector2(r, y));
  }
  const geom = new THREE.LatheGeometry(points, 36);
  geom.computeVertexNormals();
  return geom;
}

interface AnatomicalKneeJointProps {
  playing: boolean;
  highlightHTH: boolean;
}

const AnatomicalKneeJoint: React.FC<AnatomicalKneeJointProps> = ({
  playing,
  highlightHTH
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const tibiaAssemblyRef = useRef<THREE.Group>(null);
  const patellaAssemblyRef = useRef<THREE.Group>(null);
  const aclGraftRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(0.2);

  const femurShaftGeom = useMemo(() => createFemurGeometry(), []);
  const tibiaShaftGeom = useMemo(() => createTibiaGeometry(), []);

  // Realistic clinical materials: Ivory Bone, Hyaline Cartilage, Turquoise Graft
  const boneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#EFECE6',
        roughness: 0.52,
        metalness: 0.04
      }),
    []
  );

  const cartilageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#CBE4E8',
        roughness: 0.28,
        metalness: 0.05
      }),
    []
  );

  const meniscusMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8CBCC4',
        roughness: 0.35,
        metalness: 0.05
      }),
    []
  );

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (playing) {
      phaseRef.current += clampedDelta * 0.38;
    }

    // Smooth physiological knee flexion-extension cycle (0° to ~68°)
    const rawCycle = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
    const flexAngle = THREE.MathUtils.smoothstep(rawCycle, 0.05, 0.95) * 1.15;

    if (tibiaAssemblyRef.current) {
      // In our anatomical joint: +Z is Anterior, -Z is Posterior.
      // Flexing the knee bends the distal tibia posteriorly (-Z), which is a positive rotation around X.
      tibiaAssemblyRef.current.rotation.x = flexAngle;
    }

    if (patellaAssemblyRef.current) {
      // Patella glides inferiorly and posteriorly along the femoral trochlea as knee flexes
      const patellaY = 0.16 - flexAngle * 0.14;
      const patellaZ = 0.31 - flexAngle * 0.075;
      patellaAssemblyRef.current.position.set(0, patellaY, patellaZ);
      patellaAssemblyRef.current.rotation.x = flexAngle * 0.52;
    }

    if (aclGraftRef.current) {
      // ACL runs from posteromedial aspect of lateral femoral condyle to anteromedial tibial spine
      aclGraftRef.current.rotation.x = -0.52 + flexAngle * 0.38;
      aclGraftRef.current.position.set(0, 0.01 - flexAngle * 0.02, 0.02 - flexAngle * 0.03);
    }

    if (rootGroupRef.current && playing) {
      // Subtle 3/4 clinical oblique presentation so both Patella/HTH and intra-articular LCA are visible
      rootGroupRef.current.rotation.y = -0.58 + Math.sin(phaseRef.current * Math.PI) * 0.18;
    }
  });

  const graftColor = '#25C8CC';
  const graftEmissive = highlightHTH ? '#25C8CC' : '#12787B';
  const graftEmissiveIntensity = highlightHTH ? 0.55 : 0.22;

  return (
    <group ref={rootGroupRef} rotation={[0.04, -0.55, 0]} position={[0, -0.04, 0]}>
      {/* ================================================================= */}
      {/* 1. FÉMUR DISTAL (Hueso Marfil + Cóndilos Femorales + Cartílago)   */}
      {/* ================================================================= */}
      <group>
        <mesh geometry={femurShaftGeom} material={boneMaterial} castShadow receiveShadow />

        {/* Proximal cross-section cap */}
        <mesh position={[0, 1.18, 0]} material={boneMaterial}>
          <SphereCap radius={0.125} />
        </mesh>

        {/* Medial & Lateral Femoral Condyles */}
        <mesh
          position={[-0.145, 0.11, -0.03]}
          scale={[0.88, 1.05, 1.32]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.165, 32, 32]} />
        </mesh>
        <mesh
          position={[0.145, 0.11, -0.03]}
          scale={[0.88, 1.05, 1.32]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.165, 32, 32]} />
        </mesh>

        {/* Anterior Trochlear Groove Bridge */}
        <mesh
          position={[0, 0.14, 0.1]}
          scale={[1.25, 0.9, 0.85]}
          material={cartilageMaterial}
          receiveShadow
        >
          <sphereGeometry args={[0.14, 28, 28]} />
        </mesh>

        {/* Smooth Hyaline Articular Cartilage Layers on Condyles */}
        <mesh
          position={[-0.145, 0.085, -0.02]}
          scale={[0.9, 0.95, 1.34]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.166, 28, 28]} />
        </mesh>
        <mesh
          position={[0.145, 0.085, -0.02]}
          scale={[0.9, 0.95, 1.34]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.166, 28, 28]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. LIGAMENTO CRUZADO ANTERIOR RECONSTRUIDO (LCA EN TURQUESA)      */}
      {/* ================================================================= */}
      <mesh ref={aclGraftRef} position={[0, 0.01, 0.02]} rotation={[-0.52, 0, 0.24]} castShadow>
        <cylinderGeometry args={[0.036, 0.04, 0.28, 24]} />
        <meshStandardMaterial
          color={graftColor}
          emissive={graftEmissive}
          emissiveIntensity={graftEmissiveIntensity + 0.12}
          roughness={0.3}
        />
      </mesh>

      {/* Ligamento Cruzado Posterior (Referencia anatómica en tono neutro) */}
      <mesh position={[0.02, 0.0, -0.06]} rotation={[0.48, 0, -0.22]}>
        <cylinderGeometry args={[0.028, 0.03, 0.25, 20]} />
        <meshStandardMaterial color="#9BB2BE" roughness={0.55} />
      </mesh>

      {/* ================================================================= */}
      {/* 3. RÓTULA (PATELLA) + TENDÓN CUADRICIPITAL                        */}
      {/* ================================================================= */}
      <group ref={patellaAssemblyRef} position={[0, 0.16, 0.31]}>
        {/* Rótula ósea */}
        <mesh scale={[1.05, 1.12, 0.58]} material={boneMaterial} castShadow receiveShadow>
          <sphereGeometry args={[0.135, 28, 28]} />
        </mesh>

        {/* Bloque óseo rotuliano del injerto HTH (resaltado cuando se activa HTH) */}
        <mesh position={[0, -0.04, 0.055]}>
          <boxGeometry args={[0.065, 0.11, 0.045]} />
          <meshStandardMaterial
            color={highlightHTH ? '#82E5E4' : '#DFDCD4'}
            emissive={highlightHTH ? '#25C8CC' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.55 : 0}
            roughness={0.4}
          />
        </mesh>

        {/* Tendón cuadricipital superior (suave transición hacia el muslo) */}
        <mesh position={[0, 0.28, -0.04]} rotation={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.095, 0.36, 20]} />
          <meshStandardMaterial color="#D5DEE2" roughness={0.55} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 4. TIBIA PROXIMAL, MENISCOS, PERONÉ E INJERTO ROTULIANO (HTH)     */}
      {/* ================================================================= */}
      <group ref={tibiaAssemblyRef} position={[0, -0.02, 0]}>
        <mesh geometry={tibiaShaftGeom} material={boneMaterial} castShadow receiveShadow />

        {/* Tibial Plateau Condylar Caps */}
        <mesh
          position={[0, -0.07, -0.01]}
          scale={[1.18, 0.32, 0.92]}
          material={boneMaterial}
          receiveShadow
        >
          <cylinderGeometry args={[0.26, 0.23, 0.18, 32]} />
        </mesh>

        {/* Medial & Lateral Menisci (Anatomical C-shaped fibrocartilage rings) */}
        <mesh
          position={[-0.135, -0.035, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          material={meniscusMaterial}
        >
          <torusGeometry args={[0.115, 0.024, 16, 32]} />
        </mesh>
        <mesh
          position={[0.135, -0.035, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          material={meniscusMaterial}
        >
          <torusGeometry args={[0.115, 0.024, 16, 32]} />
        </mesh>

        {/* Tuberosidad Anterior de la Tibia (Inserción distal del injerto HTH) */}
        <mesh position={[0, -0.27, 0.21]} scale={[0.9, 1.2, 0.8]} material={boneMaterial}>
          <sphereGeometry args={[0.075, 20, 20]} />
        </mesh>

        {/* Bloque óseo tibial del injerto HTH */}
        <mesh position={[0, -0.26, 0.245]}>
          <boxGeometry args={[0.065, 0.11, 0.045]} />
          <meshStandardMaterial
            color={highlightHTH ? '#82E5E4' : '#DFDCD4'}
            emissive={highlightHTH ? '#25C8CC' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.55 : 0}
            roughness={0.4}
          />
        </mesh>

        {/* Tendón Rotuliano — Injerto HTH (Hueso-Tendón-Hueso) en Turquesa Clínico */}
        <mesh position={[0, -0.08, 0.275]} rotation={[-0.14, 0, 0]} castShadow>
          <boxGeometry args={[0.082, 0.34, 0.032]} />
          <meshStandardMaterial
            color={graftColor}
            emissive={graftEmissive}
            emissiveIntensity={graftEmissiveIntensity}
            roughness={0.32}
          />
        </mesh>

        {/* Peroné (Fibula — lateral anatomical landmark) */}
        <group position={[-0.24, -0.22, -0.08]}>
          <mesh material={boneMaterial} castShadow>
            <sphereGeometry args={[0.075, 20, 20]} />
          </mesh>
          <mesh position={[0.01, -0.48, 0]} material={boneMaterial} castShadow>
            <cylinderGeometry args={[0.045, 0.038, 0.92, 20]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const SphereCap: React.FC<{ radius: number }> = ({ radius }) => (
  <sphereGeometry args={[radius, 24, 16]} />
);

export interface ConstellationHero3DProps {
  mode?: 'auto' | 'brain' | 'knee';
}

export const ConstellationHero3D: React.FC<ConstellationHero3DProps> = () => {
  const [playing, setPlaying] = useState(true);
  const [highlightHTH, setHighlightHTH] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between rounded-2xl bg-[#081A28] border border-[#244154] overflow-hidden">
      {/* Discreet top anatomical legend */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#061522]/85 backdrop-blur-md border border-[#244154] px-3 py-1 text-[11px] font-medium text-[#F1F7FA]">
          <span className="h-2 w-2 rounded-full bg-[#25C8CC]" />
          <span>Anatomía 3D · LCA + Injerto HTH</span>
        </span>
      </div>

      <div className="w-full h-full">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.06, 2.85], fov: 36, near: 0.1, far: 15 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.95} />
          <hemisphereLight args={['#F1F7FA', '#10283A', 0.65]} />
          <directionalLight
            position={[2.2, 2.8, 2.6]}
            intensity={1.25}
            color="#FFFFFF"
            castShadow
          />
          <directionalLight position={[-2.2, 1.2, 1.5]} intensity={0.55} color="#82E5E4" />
          <directionalLight position={[0, -1.5, -2.0]} intensity={0.35} color="#25C8CC" />

          <AnatomicalKneeJoint playing={playing} highlightHTH={highlightHTH} />

          <ContactShadows
            position={[0, -1.22, 0]}
            opacity={0.35}
            scale={2.4}
            blur={2.4}
            far={1.6}
            color="#030B12"
          />

          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.6}
            minPolarAngle={Math.PI * 0.28}
            maxPolarAngle={Math.PI * 0.68}
            minAzimuthAngle={-Math.PI * 0.45}
            maxAzimuthAngle={Math.PI * 0.45}
          />
        </Canvas>
      </div>

      {/* Discreet bottom medical viewer controls */}
      <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setHighlightHTH((prev) => !prev)}
          aria-pressed={highlightHTH}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
            highlightHTH
              ? 'bg-[#25C8CC]/20 border-[#25C8CC] text-[#F1F7FA]'
              : 'bg-[#061522]/85 border-[#244154] text-[#A7B9C6] hover:text-[#F1F7FA]'
          }`}
        >
          <Eye className="h-3.5 w-3.5 text-[#25C8CC]" />
          <span>Resaltar injerto HTH</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetCamera}
            title="Restablecer vista 3D"
            aria-label="Restablecer vista 3D"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#061522]/85 border border-[#244154] text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setPlaying((prev) => !prev)}
            aria-label={playing ? 'Pausar flexión 3D' : 'Reproducir flexión 3D'}
            className="inline-flex items-center gap-1 rounded-full bg-[#061522]/85 border border-[#244154] px-2.5 py-1 text-[11px] font-medium text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
          >
            {playing ? <Pause className="h-3 w-3 text-[#25C8CC]" /> : <Play className="h-3 w-3 text-[#25C8CC]" />}
            <span>{playing ? 'Pausar' : 'Animar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstellationHero3D;
