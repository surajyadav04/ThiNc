"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import ProceduralHand from "./ProceduralHand";
import { AnatomyLayerId } from "@/types/anatomy";

interface Hand3DCanvasProps {
  activeLayer: AnatomyLayerId;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (id: string) => void;
  isTouring?: boolean;
  kinematicMode?: "rest" | "pinch" | "grip" | "spread" | "phalen";
  isXRayGlass?: boolean;
  show3DPins?: boolean;
  focusArea?: "wrist" | "thumb" | "fingers" | "nerves" | "rest";
  className?: string;
}

function GSAPCameraDirector({ focusArea = "rest" }: { focusArea?: string }) {
  const { camera } = useThree();

  useEffect(() => {
    let target = { x: 0, y: -0.2, z: 4.6 };
    if (focusArea === "wrist") {
      target = { x: 0.05, y: -0.72, z: 3.2 };
    } else if (focusArea === "thumb") {
      target = { x: -0.65, y: -0.15, z: 3.1 };
    } else if (focusArea === "fingers") {
      target = { x: 0, y: 0.65, z: 3.3 };
    } else if (focusArea === "nerves") {
      target = { x: -0.05, y: -0.5, z: 2.9 };
    }

    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.1,
      ease: "power2.out",
    });
  }, [focusArea, camera]);

  return null;
}

export default function Hand3DCanvas({
  activeLayer,
  selectedHotspotId,
  onSelectHotspot,
  isTouring = false,
  kinematicMode = "rest",
  isXRayGlass = false,
  show3DPins = true,
  focusArea = "rest",
  className = "w-full h-full min-h-[480px]",
}: Hand3DCanvasProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!hasMounted) {
    return (
      <div className={`flex items-center justify-center bg-[#0A0D24] text-slate-400 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#03ACED] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#67D5EA]">Initializing 3D Anatomy Model</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} select-none`}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Clinical Editorial Lighting */}
        <ambientLight intensity={0.9} color="#0E1626" />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-4, 2, -3]} intensity={3.0} color="#03ACED" />
        <pointLight position={[0, -2, 2]} intensity={1.6} color="#38BDF8" />

        <Suspense fallback={null}>
          <GSAPCameraDirector focusArea={focusArea} />
          <ProceduralHand
            activeLayer={activeLayer}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={onSelectHotspot}
            isTouring={isTouring && !reducedMotion}
            kinematicMode={kinematicMode}
            isXRayGlass={isXRayGlass}
            show3DPins={show3DPins}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2.4}
            maxDistance={6.5}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 3.4}
            rotateSpeed={0.8}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Screen-reader text equivalent */}
      <div className="sr-only" aria-live="polite">
        Interactive 3D model of the human hand and wrist. Current layer displayed is {activeLayer}.
        Use layer controls below or review the static anatomical text descriptions.
      </div>
    </div>
  );
}
