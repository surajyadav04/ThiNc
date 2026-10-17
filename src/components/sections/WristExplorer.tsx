"use client";

import React, { useState } from "react";
import Image from "next/image";
import Hand3DCanvas from "../anatomy/Hand3DCanvas";
import { AnatomyLayerId } from "@/types/anatomy";
import {
  Activity,
  Gauge,
  RotateCcw,
  ShieldAlert,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  FileText,
  ArrowRight,
  Crosshair,
  Box,
} from "lucide-react";

type VisualViewMode = "axial-cross-section" | "ligament-volar" | "3d-interactive";
type KinematicOption = "rest" | "phalen" | "grip" | "pinch";

interface LandmarkPin {
  id: string;
  name: string;
  sublabel: string;
  description: string;
  x: number;
  y: number;
}

const AXIAL_PINS: LandmarkPin[] = [
  {
    id: "median-nerve",
    name: "Median Nerve",
    sublabel: "Sensory & Motor Trunk",
    description:
      "Occupies the most superficial position directly beneath the transverse ligament. Extremely vulnerable to ischemic compression when canal volume decreases.",
    x: 41,
    y: 44,
  },
  {
    id: "transverse-ligament",
    name: "Transverse Carpal Ligament",
    sublabel: "Flexor Retinaculum",
    description:
      "A dense fibrous roof spanning the hook of hamate, pisiform, scaphoid tuberosity, and trapezium ridge. Inextensible structure driving canal hypertension.",
    x: 62,
    y: 28,
  },
  {
    id: "flexor-tendons",
    name: "Flexor Tendons (9 Bundles)",
    sublabel: "Deep & Superficial Excursion",
    description:
      "Four flexor digitorum superficialis, four profundus, and one flexor pollicis longus tendon share the tunnel, surrounded by tenosynovial sheaths.",
    x: 56,
    y: 46,
  },
  {
    id: "scaphoid-bone",
    name: "Scaphoid Floor",
    sublabel: "Radial Carpal Column",
    description:
      "Forms the radial bony floor of the carpal tunnel arch. Crucial link between proximal and distal carpal rows with retrograde intraosseous blood supply.",
    x: 35,
    y: 64,
  },
  {
    id: "lunate-bone",
    name: "Lunate Bone",
    sublabel: "Central Carpal Keystones",
    description:
      "Central articular bone of the proximal row. Subject to volar dislocation during severe wrist hyperextension, acutely compressing the median nerve.",
    x: 58,
    y: 65,
  },
];

const VOLAR_PINS: LandmarkPin[] = [
  {
    id: "scapholunate-ligament",
    name: "Scapholunate Ligament (SLIL)",
    sublabel: "Primary Row Stabilizer",
    description:
      "Critical C-shaped interosseous band binding the scaphoid and lunate. Disruption leads to scapholunate dissociation and progressive DISI deformity.",
    x: 48,
    y: 46,
  },
  {
    id: "tfcc-complex",
    name: "TFCC Complex",
    sublabel: "Ulnar Shock Absorber",
    description:
      "The triangular fibrocartilage complex stabilizes the distal radioulnar joint and cushions axial compressive forces transmitted through the ulnar carpus.",
    x: 68,
    y: 48,
  },
  {
    id: "distal-radius",
    name: "Distal Radius Articular Surface",
    sublabel: "Radiocarpal Joint Line",
    description:
      "Biconcave articular facet bearing 80% of axial wrist load. Bounded laterally by the radial styloid process.",
    x: 38,
    y: 76,
  },
  {
    id: "distal-ulna",
    name: "Distal Ulna & Styloid",
    sublabel: "Forearm Rotational Pivot",
    description:
      "Articulates with the ulnar notch of the radius in pronation and supination, serving as the bony anchor for the TFCC meniscus.",
    x: 66,
    y: 78,
  },
];

export default function WristExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<string>("nerves");
  const [viewMode, setViewMode] = useState<VisualViewMode>("axial-cross-section");
  const [kinematicMode, setKinematicMode] = useState<KinematicOption>("rest");
  const [isXRayGlass, setIsXRayGlass] = useState<boolean>(false);
  const [selectedPinId, setSelectedPinId] = useState<string>("median-nerve");

  const topics: { id: string; label: string; layer: AnatomyLayerId; description: string; detail: string }[] = [
    {
      id: "overview",
      label: "Overview",
      layer: "surface",
      description: "A compact biomechanical junction linking the forearm muscles to the five digital rays.",
      detail:
        "The carpal tunnel is formed posteriorly by the arching carpal bones and anteriorly by the unyielding transverse carpal ligament.",
    },
    {
      id: "bones",
      label: "Bones",
      layer: "bones",
      description: "Eight carpal bones arranged in two transverse rows, transmitting axial and rotational forces.",
      detail:
        "The proximal row articulates with the distal radius and TFCC; the distal row articulates stably with the metacarpal bases.",
    },
    {
      id: "tendons",
      label: "Tendons",
      layer: "tendons",
      description: "Nine flexor tendons share the carpal tunnel alongside the median nerve.",
      detail:
        "Four flexor digitorum superficialis, four flexor digitorum profundus, and one flexor pollicis longus tendon pass beneath the ligament.",
    },
    {
      id: "nerves",
      label: "Nerves",
      layer: "nerves",
      description: "The median nerve occupies the most superficial position directly beneath the transverse ligament.",
      detail:
        "Susceptible to compression when synovitis, edema, or prolonged wrist flexion increases pressure within the inextensible canal.",
    },
    {
      id: "joints",
      label: "Joints",
      layer: "joints",
      description: "Intercarpal ligaments bind the carpal bones into a synchronous shock-absorbing arch.",
      detail:
        "The scapholunate and lunotriquetral interosseous ligaments are crucial for maintaining row stability.",
    },
    {
      id: "conditions",
      label: "Common conditions",
      layer: "nerves",
      description: "Carpal tunnel syndrome, scaphoid nonunion, and de Quervain tenosynovitis are common pathologies.",
      detail:
        "Conservative treatments often precede surgical options, tailored to clinical electrodiagnostic and exam findings.",
    },
  ];

  const currentTopic = topics.find((t) => t.id === selectedTopic) || topics[0];
  const isPhalen = kinematicMode === "phalen";

  // Simulated canal hydrostatic pressure
  const canalPressure = isPhalen ? 31.8 : kinematicMode === "grip" ? 18.4 : 2.5;
  const isPressureCritical = canalPressure > 30.0;

  // Active Pin Details
  const activePinsList = viewMode === "axial-cross-section" ? AXIAL_PINS : VOLAR_PINS;
  const activePinDetail =
    activePinsList.find((p) => p.id === selectedPinId) || activePinsList[0];

  return (
    <section
      id="wrist-explorer"
      className="relative py-24 bg-[#060919] text-white border-t border-[#1B1464]/80 overflow-hidden select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] bg-radial from-[#03ACED]/10 via-[#0A0D24]/60 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#67D5EA]">
                Anatomy & Functional Diagnostics
              </span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight">
              The Wrist & Carpal Canal: <br />
              <span className="text-[#03ACED] italic font-serif-editorial">A closer look</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            Inspect the high-resolution cross-sectional architecture of the carpal tunnel, analyze ligamentous row stability, and simulate intracarpal hydrostatic pressure during functional wrist flexion.
          </p>
        </div>

        {/* 3-Column Layout: Left Topics Rail | Center Diagnostics Visualizer | Right Inspector Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN (lg:col-span-3): Topics & Landmarks ================= */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#67D5EA] pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Diagnostic Topics</span>
              <span className="text-slate-500">6 views</span>
            </div>

            {/* Topic Radio Selection */}
            <div className="space-y-1.5" role="radiogroup" aria-label="Wrist anatomy topics">
              {topics.map((t) => {
                const isSelected = selectedTopic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedTopic(t.id);
                      if (t.id === "nerves") {
                        setViewMode("axial-cross-section");
                        setSelectedPinId("median-nerve");
                      } else if (t.id === "joints") {
                        setViewMode("ligament-volar");
                        setSelectedPinId("scapholunate-ligament");
                      } else if (t.id === "bones") {
                        setViewMode("ligament-volar");
                        setSelectedPinId("distal-radius");
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-all duration-300 ${
                      isSelected
                        ? "bg-[#0A1633] border border-[#03ACED] text-white font-medium shadow-lg shadow-[#03ACED]/15 ring-1 ring-[#03ACED]"
                        : "bg-[#090E20]/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full border transition-colors ${
                          isSelected ? "bg-[#03ACED] border-[#03ACED] shadow-sm shadow-[#03ACED]" : "border-slate-600"
                        }`}
                      />
                      <span>{t.label}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#03ACED]" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Landmark Hotspots List */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-2 font-semibold">
                Landmark Quick-Focus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "median-nerve", name: "Median Nerve", mode: "axial-cross-section" },
                  { id: "transverse-ligament", name: "Transverse Ligament", mode: "axial-cross-section" },
                  { id: "scapholunate-ligament", name: "Scapholunate (SLIL)", mode: "ligament-volar" },
                  { id: "tfcc-complex", name: "TFCC Complex", mode: "ligament-volar" },
                  { id: "flexor-tendons", name: "9 Flexor Tendons", mode: "axial-cross-section" },
                ].map((item) => {
                  const active = selectedPinId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setViewMode(item.mode as VisualViewMode);
                        setSelectedPinId(item.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        active
                          ? "bg-[#03ACED]/20 text-[#67D5EA] border border-[#03ACED]"
                          : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= CENTER COLUMN (lg:col-span-6): Diagnostics Visualizer ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Visualizer Shell */}
            <div className="relative h-[480px] sm:h-[540px] bg-[#0A0D24] rounded-2xl border border-[#1B1464] overflow-hidden flex flex-col shadow-2xl shadow-black/80">
              {/* Top Viewport Toolbar */}
              <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
                {/* 3 Visual Modes Pill Selector */}
                <div className="flex items-center gap-1 bg-[#0A0D24]/90 backdrop-blur-md p-1 rounded-full border border-slate-800 pointer-events-auto shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("axial-cross-section");
                      setSelectedPinId("median-nerve");
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all ${
                      viewMode === "axial-cross-section"
                        ? "bg-[#03ACED] text-black shadow-md shadow-[#03ACED]/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Canal Cross-Section
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("ligament-volar");
                      setSelectedPinId("scapholunate-ligament");
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all ${
                      viewMode === "ligament-volar"
                        ? "bg-[#03ACED] text-black shadow-md shadow-[#03ACED]/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Ligamentous Arch
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("3d-interactive")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all ${
                      viewMode === "3d-interactive"
                        ? "bg-[#03ACED] text-black shadow-md shadow-[#03ACED]/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    <span>3D Lab</span>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:flex items-center gap-2 bg-[#0A0D24]/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED] animate-pulse" />
                  <span className="uppercase text-[#67D5EA]">
                    {viewMode === "axial-cross-section"
                      ? "Axial Anatomy"
                      : viewMode === "ligament-volar"
                      ? "Volar Ligaments"
                      : "3D Biomechanics"}
                  </span>
                </div>
              </div>

              {/* Viewport Core Graphics */}
              <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
                {viewMode === "axial-cross-section" && (
                  /* Ultra-High Resolution Axial Carpal Canal Cross-Section */
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image
                      src="/images/wrist-carpal-tunnel-axial.jpg"
                      alt="Axial cross-sectional medical 3D rendering of the carpal tunnel and median nerve"
                      fill
                      className="object-contain"
                      priority
                    />

                    {/* Interactive Hotspot Pins on the Axial Slice */}
                    {AXIAL_PINS.map((pin) => {
                      const isActive = selectedPinId === pin.id;
                      return (
                        <div
                          key={pin.id}
                          onClick={() => setSelectedPinId(pin.id)}
                          className="absolute cursor-pointer z-20 group -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        >
                          <div className="relative flex items-center justify-center">
                            {isActive ? (
                              <>
                                <span className="absolute w-12 h-12 rounded-full border border-[#03ACED] animate-ping opacity-75" />
                                <span className="absolute w-8 h-8 rounded-full border border-[#03ACED]/90 animate-pulse" />
                                <span className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0D24]/90 border border-[#03ACED] text-white text-xs font-mono font-semibold shadow-xl shadow-[#03ACED]/40">
                                  <span className="w-2 h-2 rounded-full bg-[#03ACED] animate-pulse" />
                                  <span className="whitespace-nowrap">{pin.name}</span>
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A0D24]/85 border border-slate-700 hover:border-[#03ACED] text-slate-300 hover:text-white text-[11px] font-mono shadow-md transition-all group-hover:scale-105">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#03ACED]" />
                                <span className="whitespace-nowrap">{pin.name}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {viewMode === "ligament-volar" && (
                  /* Ultra-High Resolution Volar Wrist Ligaments & TFCC */
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image
                      src="/images/wrist-ligament-volar.jpg"
                      alt="Volar wrist anatomy showing scapholunate ligament and TFCC complex"
                      fill
                      className="object-contain"
                      priority
                    />

                    {/* Interactive Pins on the Volar Arch */}
                    {VOLAR_PINS.map((pin) => {
                      const isActive = selectedPinId === pin.id;
                      return (
                        <div
                          key={pin.id}
                          onClick={() => setSelectedPinId(pin.id)}
                          className="absolute cursor-pointer z-20 group -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        >
                          <div className="relative flex items-center justify-center">
                            {isActive ? (
                              <>
                                <span className="absolute w-12 h-12 rounded-full border border-[#03ACED] animate-ping opacity-75" />
                                <span className="absolute w-8 h-8 rounded-full border border-[#03ACED]/90 animate-pulse" />
                                <span className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0D24]/90 border border-[#03ACED] text-white text-xs font-mono font-semibold shadow-xl shadow-[#03ACED]/40">
                                  <span className="w-2 h-2 rounded-full bg-[#03ACED] animate-pulse" />
                                  <span className="whitespace-nowrap">{pin.name}</span>
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A0D24]/85 border border-slate-700 hover:border-[#03ACED] text-slate-300 hover:text-white text-[11px] font-mono shadow-md transition-all group-hover:scale-105">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#03ACED]" />
                                <span className="whitespace-nowrap">{pin.name}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {viewMode === "3d-interactive" && (
                  /* Real-Time Three.js 3D Articulated Model */
                  <Hand3DCanvas
                    activeLayer={currentTopic.layer}
                    selectedHotspotId={selectedPinId}
                    kinematicMode={kinematicMode}
                    isXRayGlass={isXRayGlass}
                    focusArea="wrist"
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Bottom Canal Pressure Gauge HUD */}
              <div className="p-3.5 bg-[#0A0D24]/95 backdrop-blur-md border-t border-slate-800 z-20">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <Gauge className={`w-3.5 h-3.5 ${isPressureCritical ? "text-[#F59E0B]" : "text-[#03ACED]"}`} />
                    <span className="text-slate-300">Intracarpal Canal Pressure:</span>
                    <span className={`font-semibold ${isPressureCritical ? "text-[#F59E0B]" : "text-[#67D5EA]"}`}>
                      {canalPressure.toFixed(1)} mmHg
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                      isPressureCritical
                        ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#FDE68A] animate-pulse"
                        : "bg-[#03ACED]/15 border-[#03ACED]/60 text-[#67D5EA]"
                    }`}
                  >
                    {isPressureCritical ? "Ischemic Threshold Exceeded (> 30 mmHg)" : "Normal Baseline Perfusion (< 10 mmHg)"}
                  </span>
                </div>

                {/* Pressure Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isPressureCritical ? "bg-[#F59E0B]" : "bg-[#03ACED]"
                    }`}
                    style={{ width: `${Math.min(100, (canalPressure / 40.0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Functional Kinematics Control Bar */}
            <div className="p-4 rounded-xl bg-[#0A0D24]/90 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#03ACED]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
                    Biomechanical Provocation Test
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Real-Time Simulation</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setKinematicMode("rest")}
                  className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                    kinematicMode === "rest"
                      ? "bg-[#0A1633] border border-[#03ACED] text-white font-medium shadow-md shadow-[#03ACED]/15"
                      : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Neutral Rest (0°)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setKinematicMode("phalen")}
                  className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-all col-span-2 sm:col-span-1 ${
                    isPhalen
                      ? "bg-[#F59E0B] text-black font-bold shadow-lg shadow-[#F59E0B]/30 animate-pulse"
                      : "bg-[#F59E0B]/15 text-[#FDE68A] border border-[#F59E0B]/60 hover:bg-[#F59E0B]/25"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Phalen Test (80°)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setKinematicMode("grip")}
                  className={`px-2 py-2 rounded-lg text-xs font-mono transition-all ${
                    kinematicMode === "grip"
                      ? "bg-[#0A1633] border border-[#03ACED] text-white"
                      : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  Power Grip
                </button>

                <button
                  type="button"
                  onClick={() => setKinematicMode("pinch")}
                  className={`px-2 py-2 rounded-lg text-xs font-mono transition-all ${
                    kinematicMode === "pinch"
                      ? "bg-[#0A1633] border border-[#03ACED] text-white"
                      : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  Precision Pinch
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (lg:col-span-3): Clinical Inspector Card ================= */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-[#0A0D24]/90 backdrop-blur-xl rounded-2xl border border-[#1E293B] p-6 shadow-2xl text-white space-y-5">
              {/* Card Tag */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#67D5EA] block mb-2 font-semibold">
                  {viewMode === "axial-cross-section"
                    ? "Canal Cross-Section"
                    : viewMode === "ligament-volar"
                    ? "Ligamentous Architecture"
                    : "Orthopedic Biomechanics"}
                </span>
                <h3 className="font-serif-editorial text-3xl font-normal text-white tracking-tight leading-tight mb-2">
                  {activePinDetail.name}
                </h3>
                <div className="text-xs font-mono text-[#03ACED] mb-3">
                  {activePinDetail.sublabel}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {activePinDetail.description}
                </p>
              </div>

              {/* Dynamic Pathophysiology Card during Phalen's maneuver */}
              {isPhalen ? (
                <div className="p-3.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/60 text-xs text-slate-200 leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 text-[#FDE68A] font-semibold font-mono text-[11px] uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                    <span>Ischemic Provocation Mechanism</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Sustained 80° flexion crowds the transverse ligament against the carpal bones. Pressure exceeds the 30 mmHg microvascular threshold, precipitating sensory paresthesias in the median distribution.
                  </p>
                </div>
              ) : (
                /* Clinical Note (Draft) matching reference standards */
                <div className="p-3.5 rounded-xl bg-[#081226] border border-[#03ACED]/30 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#03ACED]/20 border border-[#03ACED]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5 text-[#03ACED]" />
                  </div>
                  <div className="text-xs leading-relaxed">
                    <span className="font-mono text-[#67D5EA] block font-medium mb-0.5">
                      Clinical Note (Draft):
                    </span>
                    <span className="text-slate-300">{currentTopic.detail}</span>
                  </div>
                </div>
              )}

              {/* Key Surgical Structures */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                  Key Structures
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activePinsList.map((pin) => (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setSelectedPinId(pin.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                        selectedPinId === pin.id
                          ? "bg-[#03ACED]/20 text-[#67D5EA] border border-[#03ACED]"
                          : "bg-[#0E1626] border border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {pin.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Related Conditions Carousel */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2.5 text-xs font-mono">
                  <span className="uppercase tracking-widest text-slate-400 font-semibold">
                    Related Conditions
                  </span>
                  <a
                    href="#conditions-grid"
                    className="text-[#03ACED] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      title: "Carpal Tunnel",
                      desc: "Median nerve compression.",
                      image: "/images/conditions/carpal-tunnel.jpg",
                    },
                    {
                      title: "Wrist Arthritis",
                      desc: "Radiocarpal cartilage wear.",
                      image: "/images/conditions/wrist-arthritis.jpg",
                    },
                    {
                      title: "Ligament Tear",
                      desc: "Scapholunate sprain.",
                      image: "/images/conditions/ligament-injury.jpg",
                    },
                  ].map((item, cIdx) => (
                    <a
                      key={cIdx}
                      href="#conditions-grid"
                      className="group bg-[#090E20] border border-slate-800 hover:border-[#03ACED]/60 rounded-xl p-2 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-1.5 bg-slate-900">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-white leading-tight group-hover:text-[#03ACED] transition-colors mb-0.5">
                          {item.title}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight line-clamp-2">
                          {item.desc}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Medical Disclaimer Card */}
              <div className="p-3 rounded-xl bg-[#090E20] border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 text-[#03ACED] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="text-slate-300 font-medium block">Clinical Disclaimer:</span>
                  Educational content is for general information only and is not a substitute for a medical consultation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
