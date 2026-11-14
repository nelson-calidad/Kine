import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Eye, Pause, Play } from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/**
 * Generates an anatomical distal femoral shaft + metaphyseal flare above the condyles,
 * with a closed, rounded proximal end at y = +0.86 so the femur is completely visible without clipping.
 */
function createFemurShaftGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = metaphyseal base (y = 0.18), 1 = proximal tip (y = 0.86)
    const y = 0.18 + t * 0.68;
    const flare = Math.exp(-t * 4.0) * 0.082;
    const shaft = 0.118 + 0.01 * Math.sin(t * Math.PI);
    // Smooth dome cap at the top (t -> 1) so the bone never looks cut off
    const topCap = t > 0.88 ? Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.88) / 0.12, 2))) : 1;
    const r = (shaft + flare) * topCap;
    points.push(new THREE.Vector2(r, y));
  }
  const geom = new THREE.LatheGeometry(points, 36);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Generates an anatomical proximal tibial shaft + metaphyseal flare up to the tibial plateau,
 * with a closed, rounded distal end at y = -0.86 so the tibia is completely visible without clipping.
 */
function createTibiaShaftGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = distal tip (y = -0.86), 1 = sub-plateau (y = -0.09)
    const y = -0.86 + t * 0.77;
    const flare = Math.pow(t, 3.0) * 0.14;
    const shaft = 0.102 + 0.012 * t;
    const bottomCap = t < 0.12 ? Math.sqrt(Math.max(0, 1 - Math.pow((0.12 - t) / 0.12, 2))) : 1;
    const r = (shaft + flare) * bottomCap;
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
const tempMclFem = new THREE.Vector3();
const tempMclTib = new THREE.Vector3();
const tempLclFem = new THREE.Vector3();
const tempLclFib = new THREE.Vector3();
const tempUp = new THREE.Vector3(0, 1, 0);
const tempDir = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const xAxis = new THREE.Vector3(1, 0, 0);

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
  const mclRef = useRef<THREE.Mesh>(null);
  const lclRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(0.22);

  const femurShaftGeom = useMemo(() => createFemurShaftGeometry(), []);
  const tibiaShaftGeom = useMemo(() => createTibiaShaftGeometry(), []);

  // Atlas-grade realistic materials (opaque cortical bone, articular cartilage, fibrocartilage, fibrous tissue)
  const boneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#EDE9E0',
        roughness: 0.52,
        metalness: 0.03
      }),
    []
  );

  const cartilageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D5E7EB',
        roughness: 0.28,
        metalness: 0.04
      }),
    []
  );

  const meniscusMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8CB9C2',
        roughness: 0.36,
        metalness: 0.04
      }),
    []
  );

  const ligamentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#C8D6DE',
        roughness: 0.46,
        metalness: 0.02
      }),
    []
  );

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (playing) {
      phaseRef.current += clampedDelta * 0.26;
    }

    // Gentle physiological flexion-extension (0° to ~58° = 1.02 rad)
    const rawCycle = 0.5 - 0.5 * Math.cos(phaseRef.current * Math.PI * 2);
    const flexAngle = THREE.MathUtils.smoothstep(rawCycle, 0.04, 0.96) * 1.02;

    // 1. Coupled Tibiofemoral Kinematics (Flexion + Posterior Femoral Rollback)
    const pivotY = -0.02;
    const pivotZ = -0.022 * Math.sin(flexAngle * 0.85);
    if (tibiaAssemblyRef.current) {
      tibiaAssemblyRef.current.position.set(0, pivotY, pivotZ);
      tibiaAssemblyRef.current.rotation.set(flexAngle, 0, 0);
    }

    // 2. Coupled Patellofemoral Kinematics (Patella glides inferiorly and posteriorly in the trochlear groove)
    const patellaY = 0.21 - flexAngle * 0.155;
    const patellaZ = 0.275 - flexAngle * 0.08 - Math.pow(flexAngle, 2) * 0.03;
    const patellaPitch = flexAngle * 0.54;
    if (patellaAssemblyRef.current) {
      patellaAssemblyRef.current.position.set(0, patellaY, patellaZ);
      patellaAssemblyRef.current.rotation.set(patellaPitch, 0, 0);
    }

    // 3. Dynamic Patellar Tendon spanning from Inferior Pole of Patella to Tibial Tuberosity
    tempPatellaInfPole.set(0, -0.09, 0.015);
    tempQuat.setFromAxisAngle(xAxis, patellaPitch);
    tempPatellaInfPole.applyQuaternion(tempQuat);
    tempPatellaInfPole.y += patellaY;
    tempPatellaInfPole.z += patellaZ;

    tempTuberosity.set(0, -0.25, 0.215);
    tempQuat.setFromAxisAngle(xAxis, flexAngle);
    tempTuberosity.applyQuaternion(tempQuat);
    tempTuberosity.y += pivotY;
    tempTuberosity.z += pivotZ;

    if (patellarTendonRef.current) {
      tempTendonMid.lerpVectors(tempPatellaInfPole, tempTuberosity, 0.5);
      const tendonLen = tempPatellaInfPole.distanceTo(tempTuberosity);
      tempDir.subVectors(tempPatellaInfPole, tempTuberosity).normalize();
      tempQuat.setFromUnitVectors(tempUp, tempDir);
      patellarTendonRef.current.position.copy(tempTendonMid);
      patellarTendonRef.current.quaternion.copy(tempQuat);
      patellarTendonRef.current.scale.set(1, Math.max(0.16, tendonLen), 1);

      if (donorSeamRef.current) {
        donorSeamRef.current.position.copy(tempTendonMid);
        donorSeamRef.current.quaternion.copy(tempQuat);
        donorSeamRef.current.scale.set(1, Math.max(0.16, tendonLen * 0.9), 1);
      }
    }

    // 4. Intra-articular Reconstructed LCA (Injerto HTH/BTB) inside the Intercondylar Notch:
    // Femoral tunnel: posteromedial aspect of lateral femoral condyle (-0.065, 0.11, -0.072)
    tempFemoralAttach.set(-0.065, 0.11, -0.072);
    // Tibial tunnel: anteromedial intercondylar area of tibial plateau (0.04, -0.042, 0.065)
    tempTibialAttach.set(0.04, -0.042, 0.065);
    tempQuat.setFromAxisAngle(xAxis, flexAngle);
    tempTibialAttach.applyQuaternion(tempQuat);
    tempTibialAttach.y += pivotY;
    tempTibialAttach.z += pivotZ;

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

    // 5. Medial Collateral Ligament (LCM) & Lateral Collateral Ligament (LCL)
    if (mclRef.current) {
      tempMclFem.set(0.245, 0.12, -0.01);
      tempMclTib.set(0.22, -0.22, 0.01);
      tempQuat.setFromAxisAngle(xAxis, flexAngle);
      tempMclTib.applyQuaternion(tempQuat);
      tempMclTib.y += pivotY;
      tempMclTib.z += pivotZ;

      tempTendonMid.lerpVectors(tempMclFem, tempMclTib, 0.5);
      const len = tempMclFem.distanceTo(tempMclTib);
      tempDir.subVectors(tempMclFem, tempMclTib).normalize();
      tempQuat.setFromUnitVectors(tempUp, tempDir);
      mclRef.current.position.copy(tempTendonMid);
      mclRef.current.quaternion.copy(tempQuat);
      mclRef.current.scale.set(1, len, 1);
    }

    if (lclRef.current) {
      tempLclFem.set(-0.245, 0.11, -0.025);
      tempLclFib.set(-0.23, -0.2, -0.075);
      tempQuat.setFromAxisAngle(xAxis, flexAngle);
      tempLclFib.applyQuaternion(tempQuat);
      tempLclFib.y += pivotY;
      tempLclFib.z += pivotZ;

      tempTendonMid.lerpVectors(tempLclFem, tempLclFib, 0.5);
      const len = tempLclFem.distanceTo(tempLclFib);
      tempDir.subVectors(tempLclFem, tempLclFib).normalize();
      tempQuat.setFromUnitVectors(tempUp, tempDir);
      lclRef.current.position.copy(tempTendonMid);
      lclRef.current.quaternion.copy(tempQuat);
      lclRef.current.scale.set(1, len, 1);
    }

    if (rootGroupRef.current && playing) {
      // Slow, smooth 3D atlas rotation
      rootGroupRef.current.rotation.y = -0.46 + Math.sin(phaseRef.current * Math.PI) * 0.28;
    }
  });

  const graftColor = highlightHTH ? '#25C8CC' : '#7BCACE';
  const graftEmissive = highlightHTH ? '#1E9EA2' : '#0E5255';
  const graftEmissiveIntensity = highlightHTH ? 0.32 : 0.12;
  const bonePlugColor = highlightHTH ? '#82E5E4' : '#DFDCD4';

  return (
    <group ref={rootGroupRef} rotation={[0.05, -0.46, 0]} position={[0, 0.02, 0]}>
      {/* ================================================================= */}
      {/* 1. FÉMUR DISTAL CON ESCOTADURA INTERCONDÍLEA ABIERTA              */}
      {/* ================================================================= */}
      <group>
        <mesh geometry={femurShaftGeom} material={boneMaterial} castShadow receiveShadow />

        {/* Puente metafisario anterior (tróclea femoral superior) */}
        <mesh
          position={[0, 0.19, 0.045]}
          scale={[1.32, 0.7, 0.9]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.145, 28, 28]} />
        </mesh>

        {/* Cóndilos Femorales Lateral (-X) y Medial (+X) */}
        <mesh
          position={[-0.142, 0.092, -0.025]}
          scale={[0.78, 1.04, 1.3]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.156, 32, 32]} />
        </mesh>
        <mesh
          position={[0.142, 0.092, -0.025]}
          scale={[0.78, 1.04, 1.3]}
          material={boneMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.156, 32, 32]} />
        </mesh>

        {/* Cartílago articular hialino sobre cóndilos y tróclea femoral */}
        <mesh
          position={[-0.142, 0.07, -0.018]}
          scale={[0.8, 0.9, 1.32]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.157, 28, 28]} />
        </mesh>
        <mesh
          position={[0.142, 0.07, -0.018]}
          scale={[0.8, 0.9, 1.32]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.157, 28, 28]} />
        </mesh>
        <mesh
          position={[0, 0.14, 0.11]}
          scale={[1.12, 0.72, 0.62]}
          material={cartilageMaterial}
        >
          <sphereGeometry args={[0.12, 24, 24]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. INJERTO HTH INTRAARTICULAR (LCA) Y LIGAMENTOS DE LA RODILLA    */}
      {/* ================================================================= */}
      <group>
        {/* Porción tendinosa intraarticular del injerto HTH (LCA reconstruido) */}
        <mesh ref={aclTendonRef} castShadow>
          <cylinderGeometry args={[0.03, 0.033, 1.0, 24]} />
          <meshStandardMaterial
            color={graftColor}
            emissive={graftEmissive}
            emissiveIntensity={graftEmissiveIntensity}
            roughness={0.34}
          />
        </mesh>

        {/* Taco óseo femoral del injerto HTH */}
        <mesh ref={femoralPlugRef}>
          <cylinderGeometry args={[0.035, 0.035, 0.058, 20]} />
          <meshStandardMaterial
            color={bonePlugColor}
            emissive={highlightHTH ? '#1E9EA2' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.25 : 0}
            roughness={0.42}
          />
        </mesh>

        {/* Taco óseo tibial del injerto HTH */}
        <mesh ref={tibialPlugRef}>
          <cylinderGeometry args={[0.035, 0.035, 0.058, 20]} />
          <meshStandardMaterial
            color={bonePlugColor}
            emissive={highlightHTH ? '#1E9EA2' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.25 : 0}
            roughness={0.42}
          />
        </mesh>

        {/* Ligamento Cruzado Posterior (LCP) */}
        <mesh position={[0.032, 0.015, -0.072]} rotation={[0.46, 0, -0.25]} material={ligamentMaterial}>
          <cylinderGeometry args={[0.022, 0.024, 0.21, 18]} />
        </mesh>

        {/* Ligamento Colateral Medial (LCM) */}
        <mesh ref={mclRef} material={ligamentMaterial}>
          <boxGeometry args={[0.014, 1.0, 0.048]} />
        </mesh>

        {/* Ligamento Colateral Lateral (LCL) */}
        <mesh ref={lclRef} material={ligamentMaterial}>
          <cylinderGeometry args={[0.014, 0.014, 1.0, 14]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 3. RÓTULA (PATELLA) Y APARATO EXTENSOR                            */}
      {/* ================================================================= */}
      <group ref={patellaAssemblyRef} position={[0, 0.21, 0.275]}>
        {/* Rótula ósea */}
        <mesh scale={[1.0, 1.05, 0.54]} material={boneMaterial} castShadow receiveShadow>
          <sphereGeometry args={[0.12, 28, 28]} />
        </mesh>

        {/* Zona dadora rotuliana (tercio central inferior) */}
        <mesh position={[0, -0.042, 0.048]}>
          <boxGeometry args={[0.038, 0.078, 0.022]} />
          <meshStandardMaterial
            color={highlightHTH ? '#82E5E4' : '#D8E2E6'}
            emissive={highlightHTH ? '#1E9EA2' : '#000000'}
            emissiveIntensity={highlightHTH ? 0.22 : 0}
            roughness={0.45}
          />
        </mesh>

        {/* Tendón cuadricipital proximal */}
        <mesh position={[0, 0.22, -0.032]} rotation={[0.15, 0, 0]} material={ligamentMaterial}>
          <cylinderGeometry args={[0.072, 0.082, 0.28, 20]} />
        </mesh>
      </group>

      {/* Tendón rotuliano nativo (conectado dinámicamente entre rótula y tuberosidad tibial) */}
      <mesh ref={patellarTendonRef} material={ligamentMaterial}>
        <boxGeometry args={[0.088, 1.0, 0.022]} />
      </mesh>

      {/* Indicación discreta de cosecha del tercio central (zona dadora HTH) */}
      <mesh ref={donorSeamRef}>
        <boxGeometry args={[0.02, 1.0, 0.025]} />
        <meshStandardMaterial
          color={highlightHTH ? '#82E5E4' : '#B8C9D1'}
          emissive={highlightHTH ? '#1E9EA2' : '#000000'}
          emissiveIntensity={highlightHTH ? 0.22 : 0}
          roughness={0.4}
        />
      </mesh>

      {/* ================================================================= */}
      {/* 4. TIBIA PROXIMAL, PLATILLOS, MENISCOS Y PERONÉ                   */}
      {/* ================================================================= */}
      <group ref={tibiaAssemblyRef} position={[0, -0.02, 0]}>
        <mesh geometry={tibiaShaftGeom} material={boneMaterial} castShadow receiveShadow />

        {/* Platillo tibial proximal */}
        <mesh
          position={[0, -0.072, -0.01]}
          scale={[1.16, 0.28, 0.9]}
          material={boneMaterial}
          receiveShadow
        >
          <cylinderGeometry args={[0.248, 0.22, 0.15, 32]} />
        </mesh>

        {/* Espinas tibiales (eminencia intercondílea) */}
        <mesh position={[0, -0.026, 0.01]} scale={[0.88, 0.58, 0.88]} material={boneMaterial}>
          <coneGeometry args={[0.045, 0.052, 16]} />
        </mesh>

        {/* Meniscos Medial y Lateral */}
        <mesh
          position={[-0.132, -0.03, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          material={meniscusMaterial}
        >
          <torusGeometry args={[0.108, 0.022, 16, 32]} />
        </mesh>
        <mesh
          position={[0.132, -0.03, -0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          material={meniscusMaterial}
        >
          <torusGeometry args={[0.108, 0.022, 16, 32]} />
        </mesh>

        {/* Tuberosidad Anterior de la Tibia (TAT) */}
        <mesh position={[0, -0.25, 0.195]} scale={[0.85, 1.15, 0.75]} material={boneMaterial}>
          <sphereGeometry args={[0.068, 20, 20]} />
        </mesh>

        {/* Peroné (Fibula — completo y sin cortes distales) */}
        <group position={[-0.228, -0.2, -0.078]}>
          <mesh material={boneMaterial} castShadow>
            <sphereGeometry args={[0.066, 20, 20]} />
          </mesh>
          <mesh position={[0.012, -0.32, 0]} material={boneMaterial} castShadow>
            <capsuleGeometry args={[0.034, 0.54, 12, 20]} />
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

  // Respect prefers-reduced-motion on device
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (mq.matches) {
        setPlaying(false);
      }
    };
    handleChange();
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between rounded-2xl bg-[#071826] border border-[#1E394B] overflow-hidden">
      {/* Discreet top anatomical label */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#061522]/85 backdrop-blur-md border border-[#1E394B] px-3 py-1 text-[11px] font-medium text-[#A7B9C6]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#25C8CC]" />
          <span>Modelo anatómico · LCA / HTH</span>
        </span>
      </div>

      <div className="w-full h-full">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.02, 2.75], fov: 34, near: 0.1, far: 15 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.95} />
          <hemisphereLight args={['#F1F7FA', '#10283A', 0.65]} />
          <directionalLight
            position={[2.2, 2.8, 2.6]}
            intensity={1.2}
            color="#FFFFFF"
            castShadow
          />
          <directionalLight position={[-2.2, 1.2, 1.5]} intensity={0.45} color="#82E5E4" />
          <directionalLight position={[0, -1.5, -2.0]} intensity={0.28} color="#25C8CC" />

          <AnatomicalKneeJoint playing={playing} highlightHTH={highlightHTH} />

          <ContactShadows
            position={[0, -0.94, 0]}
            opacity={0.32}
            scale={2.2}
            blur={2.4}
            far={1.5}
            color="#030B12"
          />

          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            minDistance={1.85}
            maxDistance={3.8}
            enablePan={false}
            rotateSpeed={0.6}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.72}
            minAzimuthAngle={-Math.PI * 0.65}
            maxAzimuthAngle={Math.PI * 0.65}
          />
        </Canvas>
      </div>

      {/* Discreet bottom medical viewer controls */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setHighlightHTH((prev) => !prev)}
          aria-pressed={highlightHTH}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
            highlightHTH
              ? 'bg-[#10283A]/90 border-[#25C8CC]/70 text-[#F1F7FA]'
              : 'bg-[#061522]/85 border-[#1E394B] text-[#A7B9C6] hover:text-[#F1F7FA]'
          }`}
        >
          <Eye className="h-3.5 w-3.5 text-[#25C8CC]" />
          <span>Injerto HTH</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reiniciar vista"
            aria-label="Reiniciar vista"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#061522]/85 border border-[#1E394B] text-[#A7B9C6] hover:text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setPlaying((prev) => !prev)}
            aria-label={playing ? 'Pausar rotación y movimiento' : 'Reproducir movimiento'}
            className="inline-flex items-center gap-1 rounded-full bg-[#061522]/85 border border-[#1E394B] px-2.5 py-1 text-[11px] font-medium text-[#F1F7FA] hover:border-[#25C8CC] transition-colors"
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
