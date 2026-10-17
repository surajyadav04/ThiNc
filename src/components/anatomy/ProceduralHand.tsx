"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AnatomyLayerId } from "@/types/anatomy";

interface ProceduralHandProps {
  activeLayer: AnatomyLayerId;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (id: string) => void;
  isTouring?: boolean;
  kinematicMode?: "rest" | "pinch" | "grip" | "spread" | "phalen";
  isXRayGlass?: boolean;
  show3DPins?: boolean;
}

export default function ProceduralHand({
  activeLayer,
  selectedHotspotId,
  onSelectHotspot,
  isTouring = false,
  kinematicMode = "rest",
  isXRayGlass = false,
  show3DPins = true,
}: ProceduralHandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wristPivotRef = useRef<THREE.Group>(null);
  const nerveGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Current kinematic interpolation values
  const currentFlexion = useRef<number>(0);
  const targetFlexion = useRef<number>(0);
  const currentWristFlexion = useRef<number>(0);
  const targetWristFlexion = useRef<number>(0);

  // Set target flexion based on mode
  if (kinematicMode === "grip") {
    targetFlexion.current = 0.85;
    targetWristFlexion.current = 0;
  } else if (kinematicMode === "pinch") {
    targetFlexion.current = 0.55;
    targetWristFlexion.current = 0;
  } else if (kinematicMode === "spread") {
    targetFlexion.current = -0.15;
    targetWristFlexion.current = 0;
  } else if (kinematicMode === "phalen") {
    targetFlexion.current = 0.22;
    // 78 degrees flexion forward in radiocarpal joint (Phalen's test position)
    targetWristFlexion.current = 1.36;
  } else {
    targetFlexion.current = 0;
    targetWristFlexion.current = 0;
  }

  // Layer highlight and visibility booleans
  const isSurface = activeLayer === "surface";
  const isBones = activeLayer === "bones";
  const isTendons = activeLayer === "tendons";
  const isNerves = activeLayer === "nerves";
  const isJoints = activeLayer === "joints";

  // When X-Ray glass is active, surface contour is always visible with internal structures
  const showSurface = isSurface || isXRayGlass;
  const showBones = isBones || isSurface || isJoints || isNerves || isTendons || isXRayGlass;
  const showTendons = isTendons || isSurface || isXRayGlass;
  const showNerves = isNerves || isSurface || isXRayGlass;
  const showJoints = isJoints || isSurface || isXRayGlass;

  // Floating neural/biological particles geometry
  const particleGeo = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Frame animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth lerp for kinematic finger flexion
    currentFlexion.current += (targetFlexion.current - currentFlexion.current) * 0.08;

    // Smooth lerp for wrist joint flexion (Phalen's test)
    currentWristFlexion.current += (targetWristFlexion.current - currentWristFlexion.current) * 0.08;
    if (wristPivotRef.current) {
      wristPivotRef.current.rotation.x = currentWristFlexion.current;
    }

    // Organic hand breathing motion
    if (groupRef.current) {
      if (isTouring) {
        groupRef.current.rotation.y = -0.3 + Math.sin(t * 0.4) * 0.4;
        groupRef.current.rotation.x = -0.15 + Math.cos(t * 0.3) * 0.12;
      } else {
        groupRef.current.position.y = -0.25 + Math.sin(t * 0.7) * 0.04;
      }
    }

    // Slowly rotate floating neural particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.03;
      particlesRef.current.rotation.x = Math.sin(t * 0.02) * 0.05;
    }

    // Dynamic electrical nerve pulse: warning amber in Phalen test, serene cyan in rest
    if (nerveGroupRef.current) {
      const isPhalen = kinematicMode === "phalen";
      const speed = isPhalen ? 7.5 : 3.8;
      const pulse = isPhalen
        ? 1.1 + Math.sin(t * speed) * 0.55
        : 0.75 + Math.sin(t * speed) * 0.35;
      const targetColor = isPhalen ? new THREE.Color("#F59E0B") : new THREE.Color("#03ACED");

      nerveGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat.emissive) {
            mat.emissive.lerp(targetColor, 0.08);
            mat.emissiveIntensity = pulse;
          }
        }
      });
    }
  });

  // Materials
  const materials = useMemo(() => {
    return {
      bone: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#E2E8F0"),
        roughness: 0.28,
        metalness: 0.08,
        emissive: new THREE.Color("#0A1128"),
        emissiveIntensity: 0.15,
      }),
      boneHighlighted: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#FFFFFF"),
        roughness: 0.18,
        metalness: 0.05,
        emissive: new THREE.Color("#03ACED"),
        emissiveIntensity: 0.55,
      }),
      tendon: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#7DD3FC"),
        roughness: 0.35,
        metalness: 0.25,
        transparent: true,
        opacity: 0.88,
        emissive: new THREE.Color("#0284C7"),
        emissiveIntensity: 0.2,
      }),
      nerve: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#03ACED"),
        roughness: 0.15,
        emissive: new THREE.Color("#03ACED"),
        emissiveIntensity: 0.95,
        metalness: 0.1,
      }),
      nerveBranch: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#38BDF8"),
        roughness: 0.2,
        emissive: new THREE.Color("#0284C7"),
        emissiveIntensity: 0.7,
      }),
      joint: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#38BDF8"),
        roughness: 0.25,
        transparent: true,
        opacity: 0.72,
        emissive: new THREE.Color("#03ACED"),
        emissiveIntensity: 0.35,
      }),
      surface: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1B2A4A"),
        roughness: 0.45,
        metalness: 0.1,
        transparent: true,
        opacity: 0.22,
      }),
      surfaceContour: new THREE.MeshBasicMaterial({
        color: new THREE.Color("#03ACED"),
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      }),
      xraySkin: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0B223E"),
        roughness: 0.12,
        metalness: 0.05,
        transmission: 0.84,
        thickness: 1.25,
        transparent: true,
        opacity: 0.42,
        ior: 1.34,
        emissive: new THREE.Color("#03ACED"),
        emissiveIntensity: 0.06,
      }),
      xrayContour: new THREE.MeshBasicMaterial({
        color: new THREE.Color("#38BDF8"),
        transparent: true,
        opacity: 0.36,
        wireframe: true,
      }),
      carpalTunnelCompressed: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#F59E0B"),
        emissive: new THREE.Color("#F59E0B"),
        emissiveIntensity: 1.2,
        roughness: 0.2,
      }),
      pinCyan: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#FFFFFF"),
        emissive: new THREE.Color("#03ACED"),
        emissiveIntensity: 1.3,
        roughness: 0.1,
      }),
      particle: new THREE.PointsMaterial({
        color: new THREE.Color("#03ACED"),
        size: 0.045,
        transparent: true,
        opacity: 0.6,
      }),
    };
  }, []);

  // Digits definition (positions relative to wrist pivot at y = -0.72)
  const digits = [
    {
      id: "thumb",
      name: "Thumb",
      baseX: -0.72,
      baseY: 0.5,
      rotZ: 0.52,
      mcLen: 0.82,
      p1Len: 0.68,
      p2Len: 0.58,
      p3Len: 0.0,
      radius: 0.11,
      isThumb: true,
    },
    {
      id: "index",
      name: "Index Finger",
      baseX: -0.42,
      baseY: 1.14,
      rotZ: 0.1,
      mcLen: 0.98,
      p1Len: 0.88,
      p2Len: 0.62,
      p3Len: 0.42,
      radius: 0.095,
      isThumb: false,
    },
    {
      id: "middle",
      name: "Middle Finger",
      baseX: -0.06,
      baseY: 1.3,
      rotZ: 0.0,
      mcLen: 1.05,
      p1Len: 0.98,
      p2Len: 0.72,
      p3Len: 0.48,
      radius: 0.105,
      isThumb: false,
    },
    {
      id: "ring",
      name: "Ring Finger",
      baseX: 0.28,
      baseY: 1.2,
      rotZ: -0.09,
      mcLen: 0.95,
      p1Len: 0.88,
      p2Len: 0.62,
      p3Len: 0.42,
      radius: 0.092,
      isThumb: false,
    },
    {
      id: "small",
      name: "Small Finger",
      baseX: 0.58,
      baseY: 1.0,
      rotZ: -0.22,
      mcLen: 0.82,
      p1Len: 0.72,
      p2Len: 0.48,
      p3Len: 0.36,
      radius: 0.082,
      isThumb: false,
    },
  ];

  const skinMaterial = isXRayGlass ? materials.xraySkin : materials.surface;
  const contourMaterial = isXRayGlass ? materials.xrayContour : materials.surfaceContour;
  const isPhalen = kinematicMode === "phalen";

  return (
    <>
      {/* Ambient Neural Particles in 3D Space */}
      <points ref={particlesRef} geometry={particleGeo} material={materials.particle} />

      <group ref={groupRef} position={[0.2, -0.2, 0]} rotation={[-0.15, -0.25, 0.18]} scale={[1.2, 1.2, 1.2]}>
        {/* ================= 1. FOREARM SEGMENT (ANCHORED) ================= */}
        {/* Forearm Surface Skin */}
        {showSurface && (
          <mesh position={[-0.08, -1.6, 0]}>
            <cylinderGeometry args={[0.58, 0.68, 1.7, 24]} />
            <primitive object={skinMaterial} />
          </mesh>
        )}

        {/* Forearm Bones: Distal Radius & Ulna */}
        <group visible={showBones}>
          {/* Distal Radius */}
          <mesh position={[-0.32, -1.6, 0.04]} rotation={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.24, 0.26, 1.7, 20]} />
            <primitive object={isBones ? materials.boneHighlighted : materials.bone} />
          </mesh>
          <mesh position={[-0.45, -0.92, 0.12]}>
            <coneGeometry args={[0.08, 0.18, 14]} />
            <primitive object={isBones ? materials.boneHighlighted : materials.bone} />
          </mesh>

          {/* Distal Ulna */}
          <mesh position={[0.28, -1.65, -0.02]} rotation={[0, 0, -0.04]}>
            <cylinderGeometry args={[0.17, 0.19, 1.6, 18]} />
            <primitive object={isBones ? materials.boneHighlighted : materials.bone} />
          </mesh>
          <mesh position={[0.38, -0.95, -0.02]}>
            <coneGeometry args={[0.06, 0.16, 12]} />
            <primitive object={isBones ? materials.boneHighlighted : materials.bone} />
          </mesh>
        </group>

        {/* Forearm Proximal Median Nerve Trunk */}
        <group ref={nerveGroupRef} visible={showNerves}>
          <mesh position={[-0.07, -1.23, 0.24]}>
            <cylinderGeometry args={[0.05, 0.055, 1.3, 14]} />
            <primitive object={materials.nerve} />
          </mesh>
          <mesh position={[0.36, -1.13, 0.2]}>
            <cylinderGeometry args={[0.04, 0.045, 1.2, 12]} />
            <primitive object={materials.nerveBranch} />
          </mesh>
        </group>

        {/* Radiocarpal Capsule Ring */}
        <group visible={showJoints}>
          <mesh position={[-0.06, -0.88, 0.03]}>
            <torusGeometry args={[0.42, 0.09, 12, 28]} />
            <primitive object={materials.joint} />
          </mesh>
        </group>

        {/* ================= 2. ARTICULATING WRIST & HAND PIVOT ================= */}
        {/* Rotates on X axis at the radiocarpal line (y = -0.72) for Phalen's test */}
        <group ref={wristPivotRef} position={[0, -0.72, 0]}>
          {/* Palm Surface Skin */}
          {showSurface && (
            <group position={[0, 0.77, 0]}>
              <mesh>
                <boxGeometry args={[1.85, 2.0, 0.48]} />
                <primitive object={skinMaterial} />
              </mesh>
              <mesh>
                <boxGeometry args={[1.88, 2.02, 0.5]} />
                <primitive object={contourMaterial} />
              </mesh>
            </group>
          )}

          {/* SKELETAL: Carpal Bones Cluster */}
          <group visible={showBones} position={[0, 0, 0.02]}>
            {/* Scaphoid */}
            <mesh
              position={[-0.36, -0.04, 0.06]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.("scaphoid");
              }}
            >
              <capsuleGeometry args={[0.12, 0.22, 12, 16]} />
              <primitive
                object={
                  selectedHotspotId === "scaphoid" || isBones
                    ? materials.boneHighlighted
                    : materials.bone
                }
              />
            </mesh>

            {/* Lunate */}
            <mesh position={[-0.09, -0.02, 0.04]}>
              <sphereGeometry args={[0.19, 16, 16]} />
              <primitive object={materials.bone} />
            </mesh>

            {/* Triquetrum */}
            <mesh position={[0.22, -0.06, 0.02]}>
              <sphereGeometry args={[0.16, 14, 14]} />
              <primitive object={materials.bone} />
            </mesh>

            {/* Pisiform */}
            <mesh position={[0.28, -0.02, 0.18]}>
              <sphereGeometry args={[0.11, 14, 14]} />
              <primitive object={materials.bone} />
            </mesh>

            {/* Trapezium */}
            <mesh
              position={[-0.48, 0.25, 0.08]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.("cmc-joint");
              }}
            >
              <boxGeometry args={[0.25, 0.25, 0.25]} />
              <primitive
                object={
                  selectedHotspotId === "cmc-joint" || isBones
                    ? materials.boneHighlighted
                    : materials.bone
                }
              />
            </mesh>

            {/* Trapezoid */}
            <mesh position={[-0.24, 0.25, 0.05]}>
              <boxGeometry args={[0.2, 0.22, 0.22]} />
              <primitive object={materials.bone} />
            </mesh>

            {/* Capitate */}
            <mesh position={[0.02, 0.26, 0.03]}>
              <cylinderGeometry args={[0.2, 0.18, 0.38, 16]} />
              <primitive object={materials.bone} />
            </mesh>

            {/* Hamate */}
            <mesh position={[0.28, 0.22, 0.05]}>
              <boxGeometry args={[0.22, 0.26, 0.24]} />
              <primitive object={materials.bone} />
            </mesh>
            <mesh position={[0.26, 0.24, 0.2]}>
              <coneGeometry args={[0.06, 0.16, 12]} />
              <primitive object={materials.bone} />
            </mesh>
          </group>

          {/* SKELETAL: Metacarpals & Phalanges with Flexion */}
          <group visible={showBones}>
            {digits.map((d) => {
              const isThumb = d.isThumb;
              const mcpFlex = isThumb
                ? currentFlexion.current * 0.4
                : currentFlexion.current * 0.65;
              const pipFlex = isThumb
                ? currentFlexion.current * 0.5
                : currentFlexion.current * 0.85;

              return (
                <group key={d.id} position={[d.baseX, d.baseY, 0]} rotation={[0, 0, d.rotZ]}>
                  {/* Metacarpal Shaft */}
                  <mesh position={[0, -0.42, 0]}>
                    <cylinderGeometry args={[d.radius, d.radius * 1.15, d.mcLen, 16]} />
                    <primitive object={isBones ? materials.boneHighlighted : materials.bone} />
                  </mesh>

                  {/* Metacarpal Head */}
                  <mesh position={[0, 0.1, 0]}>
                    <sphereGeometry args={[d.radius * 1.45, 16, 16]} />
                    <primitive object={isBones ? materials.boneHighlighted : materials.bone} />
                  </mesh>

                  {/* Articulated Phalanx Chain */}
                  <group position={[0, 0.1, 0]} rotation={[mcpFlex, 0, 0]}>
                    {/* Proximal Phalanx */}
                    <mesh position={[0, d.p1Len * 0.5, 0]}>
                      <cylinderGeometry args={[d.radius * 0.88, d.radius, d.p1Len, 14]} />
                      <primitive object={materials.bone} />
                    </mesh>
                    <mesh position={[0, d.p1Len, 0]}>
                      <sphereGeometry args={[d.radius * 1.15, 12, 12]} />
                      <primitive object={materials.bone} />
                    </mesh>

                    {/* PIP Joint */}
                    <group position={[0, d.p1Len, 0]} rotation={[pipFlex, 0, 0]}>
                      {/* Intermediate Phalanx */}
                      <mesh position={[0, d.p2Len * 0.5, 0]}>
                        <cylinderGeometry args={[d.radius * 0.76, d.radius * 0.88, d.p2Len, 14]} />
                        <primitive object={materials.bone} />
                      </mesh>
                      <mesh position={[0, d.p2Len, 0]}>
                        <sphereGeometry args={[d.radius * 1.05, 12, 12]} />
                        <primitive object={materials.bone} />
                      </mesh>

                      {/* Distal Phalanx */}
                      {!isThumb && (
                        <group position={[0, d.p2Len, 0]} rotation={[pipFlex * 0.6, 0, 0]}>
                          <mesh position={[0, d.p3Len * 0.5, 0]}>
                            <cylinderGeometry args={[d.radius * 0.6, d.radius * 0.76, d.p3Len, 12]} />
                            <primitive object={materials.bone} />
                          </mesh>
                        </group>
                      )}
                    </group>
                  </group>
                </group>
              );
            })}
          </group>

          {/* TENDONS: Palm & Digital Rays */}
          <group visible={showTendons}>
            <mesh position={[-0.04, 0.04, 0.18]}>
              <boxGeometry args={[0.92, 0.82, 0.12]} />
              <primitive object={materials.tendon} />
            </mesh>

            {digits.map((d) => (
              <group key={`tendon-${d.id}`} position={[d.baseX, d.baseY, 0.12]} rotation={[0, 0, d.rotZ]}>
                <mesh position={[0, 0.45, 0]}>
                  <cylinderGeometry args={[0.04, 0.05, 1.6, 10]} />
                  <primitive object={materials.tendon} />
                </mesh>

                <mesh
                  position={[0, 0.1, 0.04]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot?.("a1-pulley");
                  }}
                >
                  <torusGeometry args={[0.15, 0.035, 10, 20]} />
                  <primitive
                    object={
                      selectedHotspotId === "a1-pulley" || isTendons
                        ? materials.nerve
                        : materials.tendon
                    }
                  />
                </mesh>
              </group>
            ))}
          </group>

          {/* NERVES: Distal Median Nerve & Sensory Branches */}
          <group visible={showNerves}>
            <group
              position={[0, 0.04, 0.24]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.("median-nerve");
              }}
            >
              {/* Main Canal Segment */}
              <mesh position={[-0.05, 0.12, 0]}>
                <cylinderGeometry args={[0.055, 0.05, 0.72, 14]} />
                <primitive object={materials.nerve} />
              </mesh>

              {/* Digital Sensory Branches */}
              <mesh position={[-0.35, 0.6, 0]} rotation={[0, 0, 0.48]}>
                <cylinderGeometry args={[0.028, 0.038, 0.85, 10]} />
                <primitive object={materials.nerveBranch} />
              </mesh>
              <mesh position={[-0.15, 0.85, 0]} rotation={[0, 0, 0.11]}>
                <cylinderGeometry args={[0.026, 0.032, 1.05, 10]} />
                <primitive object={materials.nerveBranch} />
              </mesh>
              <mesh position={[0.05, 0.9, 0]}>
                <cylinderGeometry args={[0.026, 0.032, 1.15, 10]} />
                <primitive object={materials.nerveBranch} />
              </mesh>
              <mesh position={[0.22, 0.8, 0]} rotation={[0, 0, -0.1]}>
                <cylinderGeometry args={[0.022, 0.028, 0.95, 10]} />
                <primitive object={materials.nerveBranch} />
              </mesh>
            </group>

            {/* Distal Ulnar Branch */}
            <group position={[0.36, 0.04, 0.2]}>
              <mesh position={[0.12, 0.6, 0]} rotation={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.024, 0.032, 0.95, 10]} />
                <primitive object={materials.nerveBranch} />
              </mesh>
            </group>
          </group>

          {/* JOINTS & LIGAMENTS */}
          <group visible={showJoints}>
            {/* Transverse Carpal Ligament (Flexor Retinaculum) */}
            <mesh
              position={[-0.03, 0.12, 0.3]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.("carpal-tunnel");
              }}
            >
              <boxGeometry args={[0.78, 0.38, 0.09]} />
              <primitive
                object={
                  isPhalen
                    ? materials.carpalTunnelCompressed
                    : selectedHotspotId === "carpal-tunnel" || isJoints
                    ? materials.nerve
                    : materials.joint
                }
              />
            </mesh>

            {/* 1st CMC Joint Capsule */}
            <mesh position={[-0.58, 0.56, 0.09]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <primitive
                object={
                  selectedHotspotId === "cmc-joint" || isJoints
                    ? materials.nerve
                    : materials.joint
                }
              />
            </mesh>

            {digits.map((d) => (
              <mesh key={`capsule-${d.id}`} position={[d.baseX, d.baseY + 0.1, 0.03]}>
                <sphereGeometry args={[d.radius * 1.5, 14, 14]} />
                <primitive object={materials.joint} />
              </mesh>
            ))}
          </group>

          {/* ================= 3. OCCLUSION-AWARE 3D DEPTH PINS ================= */}
          {show3DPins && (
            <group>
              {/* Median Nerve 3D Pin */}
              <group position={[0.0, 0.16, 0.44]}>
                <Html center distanceFactor={6} style={{ pointerEvents: "auto" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot?.("median-nerve");
                    }}
                    className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono backdrop-blur-md border transition-all duration-300 shadow-lg ${
                      isPhalen
                        ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#FDE68A] shadow-[#F59E0B]/30 animate-pulse"
                        : "bg-[#0A0D24]/90 border-[#03ACED]/80 text-[#E0F2FE] shadow-[#03ACED]/20 hover:scale-105 hover:bg-[#1B1464]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPhalen ? "bg-[#F59E0B] animate-ping" : "bg-[#03ACED]"
                      }`}
                    />
                    <span className="font-semibold whitespace-nowrap">
                      {isPhalen ? "Median Nerve (Compressed)" : "Median Nerve"}
                    </span>
                  </button>
                </Html>
              </group>

              {/* Transverse Carpal Ligament 3D Pin */}
              <group position={[-0.24, 0.28, 0.42]}>
                <Html center distanceFactor={6} style={{ pointerEvents: "auto" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot?.("carpal-tunnel");
                    }}
                    className="group flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono backdrop-blur-md bg-[#0A0D24]/85 border border-slate-600 text-slate-300 hover:border-[#03ACED] hover:text-white transition-all shadow-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#03ACED]" />
                    <span className="whitespace-nowrap">Carpal Ligament</span>
                  </button>
                </Html>
              </group>

              {/* Scaphoid Waist 3D Pin */}
              <group position={[-0.42, -0.04, 0.28]}>
                <Html center distanceFactor={6} style={{ pointerEvents: "auto" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot?.("scaphoid");
                    }}
                    className="group flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono backdrop-blur-md bg-[#0A0D24]/85 border border-slate-600 text-slate-300 hover:border-[#03ACED] hover:text-white transition-all shadow-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#03ACED]" />
                    <span className="whitespace-nowrap">Scaphoid Bone</span>
                  </button>
                </Html>
              </group>
            </group>
          )}
        </group>
      </group>
    </>
  );
}
