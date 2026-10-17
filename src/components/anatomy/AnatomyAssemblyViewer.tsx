"use client";

import React, { Suspense, useState, useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Sliders, Copy, RotateCcw, Eye, Layers, Check } from "lucide-react";

interface LayerTransform {
  pos: [number, number, number];
  rot: [number, number, number]; // in radians
  scale: [number, number, number];
  opacity: number;
  visible: boolean;
  color?: string;
}

// Initial calculated baseline alignments matching the asset bounding boxes
const INITIAL_TRANSFORMS: Record<string, LayerTransform> = {
  bones: {
    pos: [0, -0.98, 0],
    rot: [0, 0, 0],
    scale: [10, 10, 10],
    opacity: 1.0,
    visible: true,
  },
  skin: {
    // Skin model is ~18.5cm along Z, rotate 90 deg around X to align with Y axis
    pos: [-0.5, 0.2, 1.18],
    rot: [Math.PI / 2, 0, 0],
    scale: [10, 10, 10],
    opacity: 0.35,
    visible: true,
  },
  muscles: {
    // Center was [-0.274, 0.938, 0.006], offset subtracted to align with bones
    pos: [2.74, -9.38, -0.06],
    rot: [0, 0, 0],
    scale: [10, 10, 10],
    opacity: 0.85,
    visible: true,
  },
  nerves: {
    // Left arm model, mirror on X (-10) and subtract origin offset
    pos: [2.71, -12.05, -1.62],
    rot: [0, 0, 0],
    scale: [-10, 10, 10],
    opacity: 1.0,
    visible: true,
  },
};

// ================= Individual Layer Subcomponents =================

function BonesModel({
  transform,
  highlightMeshName,
}: {
  transform: LayerTransform;
  highlightMeshName?: string | null;
}) {
  const { scene } = useGLTF("/models/hand/hand-bones.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const isTarget = highlightMeshName && mesh.name.toLowerCase().includes(highlightMeshName.toLowerCase());
        mesh.material = new THREE.MeshStandardMaterial({
          color: isTarget ? new THREE.Color("#03ACED") : new THREE.Color("#E2E8F0"),
          roughness: 0.25,
          metalness: 0.08,
          emissive: isTarget ? new THREE.Color("#03ACED") : new THREE.Color("#0A1128"),
          emissiveIntensity: isTarget ? 0.8 : 0.1,
          transparent: transform.opacity < 1.0,
          opacity: transform.opacity,
        });
      }
    });
  }, [clonedScene, transform.opacity, highlightMeshName]);

  if (!transform.visible) return null;

  return (
    <primitive
      object={clonedScene}
      position={transform.pos}
      rotation={transform.rot}
      scale={transform.scale}
    />
  );
}

function SkinModel({ transform }: { transform: LayerTransform }) {
  const { scene } = useGLTF("/models/hand/hand-posable.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#0B223E"),
          roughness: 0.15,
          metalness: 0.05,
          transmission: 0.8,
          thickness: 1.2,
          transparent: true,
          opacity: transform.opacity,
          ior: 1.34,
          emissive: new THREE.Color("#03ACED"),
          emissiveIntensity: 0.08,
        });
      }
    });
  }, [clonedScene, transform.opacity]);

  if (!transform.visible) return null;

  return (
    <primitive
      object={clonedScene}
      position={transform.pos}
      rotation={transform.rot}
      scale={transform.scale}
    />
  );
}

function MusclesModel({
  transform,
  highlightMeshName,
}: {
  transform: LayerTransform;
  highlightMeshName?: string | null;
}) {
  const { scene } = useGLTF("/models/hand/right-forearm-and-hand-muscles.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const isTarget = highlightMeshName && mesh.name.toLowerCase().includes(highlightMeshName.toLowerCase());
        mesh.material = new THREE.MeshStandardMaterial({
          color: isTarget ? new THREE.Color("#38BDF8") : new THREE.Color("#C084FC"),
          roughness: 0.35,
          metalness: 0.1,
          emissive: isTarget ? new THREE.Color("#03ACED") : new THREE.Color("#581C87"),
          emissiveIntensity: isTarget ? 0.7 : 0.15,
          transparent: transform.opacity < 1.0,
          opacity: transform.opacity,
        });
      }
    });
  }, [clonedScene, transform.opacity, highlightMeshName]);

  if (!transform.visible) return null;

  return (
    <primitive
      object={clonedScene}
      position={transform.pos}
      rotation={transform.rot}
      scale={transform.scale}
    />
  );
}

function NervesModel({
  transform,
  highlightMeshName,
}: {
  transform: LayerTransform;
  highlightMeshName?: string | null;
}) {
  const { scene } = useGLTF("/models/hand/arm-nerves.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const isMedian = mesh.name.toLowerCase().includes("median");
        const isTarget = highlightMeshName && mesh.name.toLowerCase().includes(highlightMeshName.toLowerCase());
        mesh.material = new THREE.MeshStandardMaterial({
          color: isTarget || isMedian ? new THREE.Color("#03ACED") : new THREE.Color("#FACC15"),
          roughness: 0.15,
          metalness: 0.1,
          emissive: isTarget || isMedian ? new THREE.Color("#03ACED") : new THREE.Color("#CA8A04"),
          emissiveIntensity: isTarget || isMedian ? 1.5 : 0.6,
          transparent: transform.opacity < 1.0,
          opacity: transform.opacity,
        });
      }
    });
  }, [clonedScene, transform.opacity, highlightMeshName]);

  if (!transform.visible) return null;

  return (
    <primitive
      object={clonedScene}
      position={transform.pos}
      rotation={transform.rot}
      scale={transform.scale}
    />
  );
}

// Preload all four GLTF assets into the browser cache
useGLTF.preload("/models/hand/hand-bones.glb");
useGLTF.preload("/models/hand/hand-posable.glb");
useGLTF.preload("/models/hand/right-forearm-and-hand-muscles.glb");
useGLTF.preload("/models/hand/arm-nerves.glb");

// ================= Main Assembly & Calibration Component =================

interface AnatomyAssemblyViewerProps {
  highlightMeshName?: string | null;
  className?: string;
  enableCalibrationHUD?: boolean;
}

export default function AnatomyAssemblyViewer({
  highlightMeshName = null,
  className = "w-full h-[520px]",
  enableCalibrationHUD = true,
}: AnatomyAssemblyViewerProps) {
  const [transforms, setTransforms] = useState(INITIAL_TRANSFORMS);
  const [activeLayerKey, setActiveLayerKey] = useState<string>("bones");
  const [isHudOpen, setIsHudOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeLayer = transforms[activeLayerKey];

  const updateActiveTransform = (field: "pos" | "rot" | "scale", index: number, value: number) => {
    setTransforms((prev) => {
      const current = prev[activeLayerKey];
      const updatedTuple = [...current[field]] as [number, number, number];
      updatedTuple[index] = value;
      return {
        ...prev,
        [activeLayerKey]: {
          ...current,
          [field]: updatedTuple,
        },
      };
    });
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(transforms, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative ${className} select-none bg-[#0A0D24] rounded-2xl overflow-hidden border border-[#1B1464]`}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} color="#0E1626" />
        <directionalLight position={[4, 5, 4]} intensity={2.5} color="#FFFFFF" />
        <directionalLight position={[-4, 2, -3]} intensity={3.0} color="#03ACED" />
        <pointLight position={[0, -2, 2]} intensity={1.8} color="#38BDF8" />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <BonesModel transform={transforms.bones} highlightMeshName={highlightMeshName} />
            <SkinModel transform={transforms.skin} />
            <MusclesModel transform={transforms.muscles} highlightMeshName={highlightMeshName} />
            <NervesModel transform={transforms.nerves} highlightMeshName={highlightMeshName} />
          </group>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={1.2}
            maxDistance={8.0}
            rotateSpeed={0.8}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Floating Toggle for Calibration HUD */}
      {enableCalibrationHUD && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHudOpen(!isHudOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono backdrop-blur-md transition-all shadow-lg ${
              isHudOpen
                ? "bg-[#03ACED] text-black font-bold shadow-[#03ACED]/30"
                : "bg-[#0A0D24]/85 text-slate-300 border border-slate-700 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isHudOpen ? "Close Calibrator" : "Anatomy Calibrator"}</span>
          </button>
        </div>
      )}

      {/* Live Calibration Inspector Drawer */}
      {enableCalibrationHUD && isHudOpen && (
        <div className="absolute top-12 right-3 z-30 w-80 max-h-[460px] overflow-y-auto bg-[#0A0D24]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl text-xs font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[#67D5EA] font-semibold uppercase tracking-wider">
              Asset Alignment
            </span>
            <button
              type="button"
              onClick={() => setTransforms(INITIAL_TRANSFORMS)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              title="Reset to default initial transforms"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Layer Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl">
            {["bones", "skin", "muscles", "nerves"].map((key) => {
              const active = activeLayerKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveLayerKey(key)}
                  className={`py-1.5 rounded-lg text-center uppercase tracking-wider text-[10px] transition-all ${
                    active
                      ? "bg-[#03ACED] text-black font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Visibility & Opacity Toggle */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() =>
                setTransforms((prev) => ({
                  ...prev,
                  [activeLayerKey]: {
                    ...prev[activeLayerKey],
                    visible: !prev[activeLayerKey].visible,
                  },
                }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${
                activeLayer.visible
                  ? "bg-[#03ACED]/20 border-[#03ACED] text-[#67D5EA]"
                  : "bg-slate-900 border-slate-700 text-slate-500"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{activeLayer.visible ? "Visible" : "Hidden"}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px]">Opacity:</span>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={activeLayer.opacity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTransforms((prev) => ({
                    ...prev,
                    [activeLayerKey]: {
                      ...prev[activeLayerKey],
                      opacity: val,
                    },
                  }));
                }}
                className="w-20 accent-[#03ACED]"
              />
              <span className="text-slate-300 text-[10px] w-6">{activeLayer.opacity.toFixed(2)}</span>
            </div>
          </div>

          {/* Position Controls */}
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] block">Position [X, Y, Z]</span>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => (
                <div key={`pos-${idx}`} className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">{["X", "Y", "Z"][idx]}</span>
                  <input
                    type="number"
                    step="0.05"
                    value={activeLayer.pos[idx]}
                    onChange={(e) => updateActiveTransform("pos", idx, parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation Controls (Degrees input, converted to Radians) */}
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] block">Rotation [X, Y, Z Deg]</span>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => (
                <div key={`rot-${idx}`} className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">{["X", "Y", "Z"][idx]}°</span>
                  <input
                    type="number"
                    step="5"
                    value={Math.round((activeLayer.rot[idx] * 180) / Math.PI)}
                    onChange={(e) => {
                      const deg = parseFloat(e.target.value) || 0;
                      updateActiveTransform("rot", idx, (deg * Math.PI) / 180);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale Controls */}
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] block">Scale [X, Y, Z]</span>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => (
                <div key={`scale-${idx}`} className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">{["X", "Y", "Z"][idx]}</span>
                  <input
                    type="number"
                    step="0.5"
                    value={activeLayer.scale[idx]}
                    onChange={(e) => updateActiveTransform("scale", idx, parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Export JSON Button */}
          <button
            type="button"
            onClick={copyConfig}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1B1464] hover:bg-[#03ACED] hover:text-black text-white font-semibold transition-all border border-[#03ACED]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Config Copied to Clipboard" : "Copy Aligned JSON"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
