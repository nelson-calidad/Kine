import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Eye, Pause, Play } from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/**
 * Generates an anatomical distal femoral shaft + metaphyseal flare above the condyles.
 * The condyles themselves are sculpted separately to leave a true, open intercondylar notch
 * (escotadura intercondílea) where the intra-articular ACL / HTH graft is housed.
 */
function createFemurShaftGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = metaphyseal base above notch (y = 0.22), 1 = proximal shaft (y = 1.20)
    const y = 0.22 + t * 0.98;
    const flare = Math.exp(-t * 3.8) * 0.085;
    const shaft = 0.125 + 0.012 * Math.sin(t * Math.PI);
    const r = (shaft + flare) * (i === steps ? 0.95 : 1);
    points.push(new THREE.Vector2(r, y));
  }
  const geom = new THREE.LatheGeometry(points, 36);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Generates an anatomical proximal tibial shaft + metaphyseal flare up to the tibial plateau.
 */
function createTibiaShaftGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = distal shaft (y = -1.16), 1 = sub-plateau (y = -0.10)
    const y = -1.16 + t * 1.06;
    const flare = Math.pow(t, 3.0) * 0.145;
    const shaft = 0.108 + 0.014 * t;
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

const tempFemoralAttach = new THREE.Vector3();
const tempTibialAttach = new THREE.Vector3();
const tempGraftMid = new THREE.Vector3();
const tempPatellaInfPole = new THREE.Vector3();
const tempTuberosity = new THREE.Vector3();
const tempTendonMid = new THREE.Vector3();
const tempUp = new THREE.Vector3(0, 1, 0);
const tempDir = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();

const AnatomicalKneeJoint: React.FC<AnatomicalKneeJointProps> = ({
  playing,
  highlightHTH
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const tibiaAssemblyRef = useRef<THREE.Group>(null);
  const patellaAssemblyRef = useRef<THREE.Group>(null);
  const aclTendonRef = useRef<THREE.Mesh>(null);
  const femoralPlugRef = useRef<THREE.Mesh>(null);
  const tibialPlugRef = useRef<THREE.Mesh>(null);
  const patellarTendonRef = useRef<THREE.Mesh>(null);
  const donorSeamRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(0.18);

  const femurShaftGeom = useMemo(() => createFemurShaftGeometry(), []);
  const tibiaShaftGeom = useMemo(() => createTibiaShaftGeometry(), []);

  // Clinical PBR materials: Ivory Cortical Bone, Hyaline Cartilage, Fibrocartilage Meniscus, Tendon
  const boneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#EFECE6',
        roughness: 0.5,
        metalness: 0.04
      }),
    []
  );

  const cartilageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4E8EC',
        roughness: 0.26,
        metalness: 0.05
      }),
    []
  );

  const meniscusMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8ABBC4',
        roughness: 0.34,
        metalness: 0.05
      }),
    []
  );

  const nativeTendonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#DCE5EA',
        roughness: 0.42,
        metalness: 0.03,
        transparent: true,
        opacity: highlightHTH ? 0.48 : 0.82
      }),
    [highlightHTH]
  );

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (playing) {
      phaseRef.current += clampedDelta * 0.32;
    }

    // Physiological flexion-extension cycle (0° to ~68° = 1.18 rad)
    // In our coordinate frame: +Z is Anterior, -Z is Posterior, +X is Medial, -X is Lateral.
    // Flexion rotates the distal tibia posteriorly (-Z), which is a positive rotation around X.
    const rawCycle = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
    const flexAngle = THREE.MathUtils.smoothstep(rawCycle, 0.04, 0.96) * 1.16;

    // 1. Coupled Tibiofemoral Kinematics (Flexion + Posterior Femoral Rollback / Tibial Glide)
    const pivotY = -0.02;
    const pivotZ = -0.025 * Math.sin(flexAngle * 0.85);
    if (tibiaAssemblyRef.current) {
      tibiaAssemblyRef.current.position.set(0, pivotY, pivotZ);
      tibiaAssemblyRef.current.rotation.set(flexAngle, 0, 0);
    }

    // 2. Coupled Patellofemoral Kinematics (Patella glides inferiorly and posteriorly in the trochlear groove)
    const patellaY = 0.22 - flexAngle * 0.165;
    const patellaZ = 0.285 - flexAngle * 0.085 - Math.pow(flexAngle, 2) * 0.035;
    const patellaPitch = flexAngle * 0.56;
    if (patellaAssemblyRef.current) {
      patellaAssemblyRef.current.position.set(0, patellaY, patellaZ);
      patellaAssemblyRef.current.rotation.set(patellaPitch, 0, 0);
    }

    // 3. Dynamic Patellar Tendon spanning from Inferior Pole of Patella to Tibial Tuberosity
    // Inferior pole of patella in root space:
    tempPatellaInfPole.set(0, -0.095, 0.015);
    tempQuat.setFromAxisAngle( new THREE.Vector3(1, 0, 0), patellaPitch );
    tempPatellaInfPole.applyQuaternion(tempQuat).add(new THREE.Vector3(0, patellaY, patellaZ));

    // Tibial tuberosity in tibia local space is (0, -0.27, 0.225):
    tempTuberosity.set(0, -0.27, 0.225);
    tempQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), flexAngle);
    tempTuberosity.applyQuaternion(tempQuat).add(new THREE.Vector3(0, pivotY, pivotZ));

    if (patellarTendonRef.current) {
      tempTendonMid.lerpVectors(tempPatellaInfPole, tempTuberosity, 0.5);
      const tendonLen = tempPatellaInfPole.distanceTo(tempTuberosity);
      tempDir.subVectors(tempPatellaInfPole, tempTuberosity).normalize();
      tempQuat.setFromUnitVectors(tempUp, tempDir);
      patellarTendonRef.current.position.copy(tempTendonMid);
      patellarTendonRef.current.quaternion.copy(tempQuat);
      patellarTendonRef.current.scale.set(1, Math.max(0.18, tendonLen), 1);

      if (donorSeamRef.current) {
        donorSeamRef.current.position.copy(tempTendonMid);
        donorSeamRef.current.quaternion.copy(tempQuat);
        donorSeamRef.current.scale.set(1, Math.max(0.18, tendonLen * 0.92), 1);
      }
    }

    // 4. Intra-articular Reconstructed LCA (Injerto HTH) inside the Intercondylar Notch:
    // Femoral attachment: posteromedial aspect of the lateral femoral condyle (-0.068, 0.115, -0.075)
    tempFemoralAttach.set(-0.068, 0.115, -0.075);
    // Tibial attachment: anteromedial intercondylar area of tibial plateau (0.042, -0.045, 0.068) in tibia frame
    tempTibialAttach.set(0.042, -0.045, 0.068);
    tempQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), flexAngle);
    tempTibialAttach.applyQuaternion(tempQuat).add(new THREE.Vector3(0, pivotY, pivotZ));

    tempGraftMid.lerpVectors(tempFemoralAttach, tempTibialAttach, 0.5);
    const graftLen = tempFemoralAttach.distanceTo(tempTibialAttach);
    tempDir.subVectors(tempFemoralAttach, tempTibialAttach).normalize();
    tempQuat.setFromUnitVectors(tempUp, tempDir);

    if (aclTendonRef.current) {
      aclTendonRef.current.position.copy(tempGraftMid);
      aclTendonRef.current.quaternion.copy(tempQuat);
      aclTendonRef.current.scale.set(1, Math.max(0.12, graftLen), 1);
    }
    if (femoralPlugRef.current) {
      femoralPlugRef.current.position.copy(tempFemoralAttach);
      femoralPlugRef.current.quaternion.copy(tempQuat);
    }
    if (tibialPlugRef.current) {
      tibialPlugRef.current.position.copy(tempTibialAttach);
      tibialPlugRef.current.quaternion.copy(tempQuat);
    }

    if (rootGroupRef.current && playing) {
      // Gentle anterolateral/anteromedial oblique oscillation so the open intercondylar notch
      // and the intra-articular HTH graft are clearly visible
      rootGroupRef.current.rotation.y = -0.48 + Math.sin(phaseRef.current * Math.PI) * 0.22;
    }
  });

  const graftColor = '#25C8CC';
  const graftEmissive = highlightHTH ? '#25C8CC' : '#12787B';
  const graftEmissiveIntensity = highlightHTH ? 0.58 : 0.22;
  const bonePlugColor = highlightHTH ? '#82E5E4' : '#DFDCD4';

  return (
    <group ref={rootGroupRef} rotation={[0.06, -0.48, 0]} position={[0, -0.04, 0]}>
      {/* ================================================================= */}
      {/* 1. FÉMUR DISTAL CON ESCOTADURA INTERCONDÍLEA ABIERTA              */}
      {/* ================================================================= */}
      <group>
        <mesh geometry={femurShaftGeom} material={boneMaterial} castShadow receiveShadow />

        {/* Tapa proximal del fémur */}
        <mesh position={[0, 1.2, 0]} material={boneMaterial}>
          <sphereGeometry args={[0.12, 24, 16]} />
        </mesh>

        {/* Puente metafisario anterior (tróclea femoral superior) */}
        <mesh
          position={[0, 0.2, 0.05]}
          scale={[1.35, 0.72, 0.92]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.15, 28, 28]} />
        </mesh>

        {/* Cóndilo Femoral Lateral (-X) y Medial (+X) separados por la escotadura intercondílea */}
        <mesh
          position={[-0.145, 0.095, -0.025]}
          scale={[0.78, 1.05, 1.32]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.16, 32, 32]} />
        </mesh>
        <mesh
          position={[0.145, 0.095, -0.025]}
          scale={[0.78, 1.05, 1.32]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.16, 32, 32]} />
        </mesh>

        {/* Cartílago articular hialino sobre cóndilos y tróclea femoral */}
        <mesh
          position={[-0.145, 0.072, -0.018]}
          scale={[0.8, 0.92, 1.34]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.161, 28, 28]} />
        </mesh>
        <mesh
          position={[0.145, 0.072, -0.018]}
          scale={[0.8, 0.92, 1.34]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.161, 28, 28]} />
        </mesh>
        <mesh
          position={[0, 0.145, 0.115]}
          scale={[1.15, 0.75, 0.65]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.125, 24, 24]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. INJERTO HTH INTRAARTICULAR RECONSTRUYENDO EL LCA               */}
      {/*    (Taco óseo femoral + Porción tendinosa + Taco óseo tibial)     */}
      {/* ================================================================= */}
      <group>
        {/* Porción tendinosa intraarticular del injerto HTH (longitud unitaria escalada dinámicamente) */}
        <mesh ref={aclTendonRef} castShadow>
          <cylinderGeometry args={[0.032, 0.035, 1.0, 24]} />
          <meshStandardMaterial
            color={graftColor}
            emissive={graftEmissive}
            emissiveIntensity={graftEmissiveIntensity}
            roughness={0.28}
          />
        </mesh>

        {/* Taco óseo femoral (en túnel del cóndilo femoral lateral) */}
        <mesh ref={femoralPlugRef}>
          <cylinderGeometry args={[0.038, 0.038, 0.065, 20]} />
          <meshStandardMaterial
            color={bonePlugColor}
            emissive={highlightHTH ? '#25C8CC' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.45 : 0}
            roughness={0.38}
          />
        </mesh>

        {/* Taco óseo tibial (en túnel tibial anteromedial) */}
        <mesh ref={tibialPlugRef}>
          <cylinderGeometry args={[0.038, 0.038, 0.065, 20]} />
          <meshStandardMaterial
            color={bonePlugColor}
            emissive={highlightHTH ? '#25C8CC' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.45 : 0}
            roughness={0.38}
          />
        </mesh>

        {/* Ligamento Cruzado Posterior (LCP — referencia anatómica posterior en tono neutro) */}
        <mesh position={[0.035, 0.015, -0.075]} rotation={[0.46, 0, -0.25]}>
          <cylinderGeometry args={[0.024, 0.026, 0.22, 18]} />
          <meshStandardMaterial color="#8DA5B2" roughness={0.55} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 3. RÓTULA (PATELLA) Y APARATO EXTENSOR NATIVO                     */}
      {/*    (Semitransparente al resaltar HTH para ver el LCA interno)     */}
      {/* ================================================================= */}
      <group ref={patellaAssemblyRef} position={[0, 0.22, 0.285]}>
        {/* Rótula ósea */}
        <mesh scale={[1.02, 1.08, 0.55]} castShadow receiveShadow>
          <sphereGeometry args={[0.125, 28, 28]} />
          <meshStandardMaterial
            color="#EFECE6"
            roughness={0.48}
            transparent={highlightHTH}
            opacity={highlightHTH ? 0.72 : 1.0}
          />
        </mesh>

        {/* Sitio dador rotuliano (tercio central inferior de la rótula) */}
        <mesh position={[0, -0.045, 0.052]}>
          <boxGeometry args={[0.042, 0.085, 0.025]} />
          <meshStandardMaterial
            color="#82E5E4"
            emissive="#25C8CC"
            emissiveIntensity={highlightHTH ? 0.35 : 0.1}
            roughness={0.4}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Tendón cuadricipital proximal */}
        <mesh position={[0, 0.24, -0.035]} rotation={[0.16, 0, 0]} material={nativeTendonMaterial}>
          <cylinderGeometry args={[0.078, 0.088, 0.32, 20]} />
        </mesh>
      </group>

      {/* Tendón rotuliano nativo (conectado dinámicamente entre rótula y tuberosidad tibial) */}
      <mesh ref={patellarTendonRef} material={nativeTendonMaterial}>
        <boxGeometry args={[0.095, 1.0, 0.024]} />
      </mesh>

      {/* Línea sutil de cosecha del tercio central del tendón rotuliano (zona dadora HTH) */}
      <mesh ref={donorSeamRef}>
        <boxGeometry args={[0.022, 1.0, 0.028]} />
        <meshStandardMaterial
          color="#82E5E4"
          emissive="#25C8CC"
          emissiveIntensity={highlightHTH ? 0.3 : 0.08}
          transparent
          opacity={highlightHTH ? 0.55 : 0.25}
        />
      </mesh>

      {/* ================================================================= */}
      {/* 4. TIBIA PROXIMAL, PLATILLOS, MENISCOS Y PERONÉ                   */}
      {/* ================================================================= */}
      <group ref={tibiaAssemblyRef} position={[0, -0.02, 0]}>
        <mesh geometry={tibiaShaftGeom} material={boneMaterial} castShadow receiveShadow />

        {/* Platillo tibial proximal */}
        <mesh
          position={[0, -0.075, -0.01]}
          scale={[1.18, 0.3, 0.92]}
          material={boneMaterial}
          receiveShadow
        >
          <cylinderGeometry args={[0.255, 0.225, 0.16, 32]} />
        </mesh>

        {/* Espinas tibiales (eminencia intercondílea) */}
        <mesh position={[0, -0.028, 0.01]} scale={[0.9, 0.6, 0.9]} material={boneMaterial}>
          <coneGeometry args={[0.048, 0.055, 16]} />
        </mesh>

        {/* Meniscos Medial y Lateral (anillos fibrocartilaginosos sobre el platillo tibial) */}
        <mesh
          position={[-0.135, -0.032, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          material={meniscusMaterial}
        >
          <torusGeometry args={[0.112, 0.023, 16, 32]} />
        </mesh>
        <mesh
          position={[0.135, -0.032, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          material={meniscusMaterial}
        >
          <torusGeometry args={[0.112, 0.023, 16, 32]} />
        </mesh>

        {/* Tuberosidad Anterior de la Tibia (TAT) */}
        <mesh position={[0, -0.27, 0.2]} scale={[0.88, 1.18, 0.78]} material={boneMaterial}>
          <sphereGeometry args={[0.072, 20, 20]} />
        </mesh>

        {/* Peroné (Fibula — referencia anatómica posterolateral en -X) */}
        <group position={[-0.235, -0.22, -0.08]}>
          <mesh material={boneMaterial} castShadow>
            <sphereGeometry args={[0.072, 20, 20]} />
          </mesh>
          <mesh position={[0.01, -0.48, 0]} material={boneMaterial} castShadow>
            <cylinderGeometry args={[0.042, 0.036, 0.92, 20]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

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
      {/* Top educational & anatomical legend */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-1.5">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#061522]/90 backdrop-blur-md border border-[#244154] px-3 py-1 text-[11px] font-medium text-[#F1F7FA]">
          <span className="h-2 w-2 rounded-full bg-[#25C8CC]" />
          <span>Injerto HTH intraarticular (LCA)</span>
        </span>
        <span className="rounded-full bg-[#061522]/80 border border-[#244154] px-2.5 py-0.5 text-[10px] text-[#A7B9C6]">
          Representación anatómica educativa
        </span>
      </div>

      <div className="w-full h-full">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.05, 2.82], fov: 35, near: 0.1, far: 15 }}
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
            minAzimuthAngle={-Math.PI * 0.55}
            maxAzimuthAngle={Math.PI * 0.55}
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
          <span>{highlightHTH ? 'Injerto HTH destacado' : 'Destacar injerto HTH'}</span>
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
            {playing ? (
              <Pause className="h-3 w-3 text-[#25C8CC]" />
            ) : (
              <Play className="h-3 w-3 text-[#25C8CC]" />
            )}
            <span>{playing ? 'Pausar' : 'Animar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstellationHero3D;
