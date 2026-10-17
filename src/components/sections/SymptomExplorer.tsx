"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import Hand3DCanvas from "../anatomy/Hand3DCanvas";
import AnatomyAssemblyViewer from "../anatomy/AnatomyAssemblyViewer";
import { AnatomyLayerId } from "@/types/anatomy";
import {
  ArrowRight,
  Play,
  Activity,
  ChevronRight,
  Layers,
  MousePointer2,
  Box,
  RotateCcw,
} from "lucide-react";

interface ConditionCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface SymptomData {
  id: string;
  stepNumber: string;
  eyebrow: string;
  title: string;
  description: string;
  commonSymptoms: string[];
  relatedConditions: ConditionCardItem[];
  hotspot: string;
  transform: {
    origin: string;
    scale: number;
    x: number;
    y: number;
  };
}

const SYMPTOM_DATA: Record<string, SymptomData> = {
  wrist: {
    id: "wrist",
    stepNumber: "01 / 04",
    eyebrow: "WRIST DISCOMFORT",
    title: "The wrist connects your hand to your arm.",
    description:
      "The wrist is made up of 8 small carpal bones, ligaments, tendons, and nerves. Discomfort often relates to nerve compression, ligament injury, or inflammatory changes.",
    commonSymptoms: [
      "Numbness or tingling waking you up at night",
      "A dull ache that radiates upward into the forearm",
      "Pain when pushing up from a chair or bearing weight",
      "Persistent swelling or stiffness following a fall",
    ],
    relatedConditions: [
      {
        id: "carpal-tunnel-syndrome",
        title: "Carpal Tunnel Syndrome",
        description: "Compression of the median nerve.",
        image: "/images/conditions/carpal-tunnel.jpg",
      },
      {
        id: "wrist-arthritis",
        title: "Wrist Arthritis",
        description: "Degeneration of the wrist joint.",
        image: "/images/conditions/wrist-arthritis.jpg",
      },
      {
        id: "ligament-injuries",
        title: "Ligament Injuries",
        description: "Sprains and tears from acute or repetitive stress.",
        image: "/images/conditions/ligament-injury.jpg",
      },
    ],
    hotspot: "wrist",
    transform: { origin: "50% 68%", scale: 1.08, x: 0, y: -15 },
  },
  thumb: {
    id: "thumb",
    stepNumber: "02 / 04",
    eyebrow: "THUMB BASE & OPPOSITION",
    title: "The basal joint enables key pinch and grasp.",
    description:
      "The first carpometacarpal (CMC) saddle joint allows wide circumduction but endures immense mechanical stress during everyday pinch and twist tasks.",
    commonSymptoms: [
      "Sharp pain at the base of the thumb when turning keys or doorknobs",
      "Difficulty opening tightly sealed jars or holding a book",
      "A feeling of grinding, clicking, or instability at the thumb joint",
      "Localized swelling or a prominent bump near the wrist junction",
    ],
    relatedConditions: [
      {
        id: "thumb-arthritis",
        title: "Thumb Basal Joint Arthritis",
        description: "Degeneration of cartilage at the first CMC joint.",
        image: "/images/conditions/wrist-arthritis.jpg",
      },
      {
        id: "de-quervain",
        title: "De Quervain Tenosynovitis",
        description: "Inflammation of thumb abductor and extensor tendons.",
        image: "/images/conditions/ligament-injury.jpg",
      },
      {
        id: "skier-thumb",
        title: "UCL Ligament Sprain",
        description: "Tear of the ulnar collateral ligament at the thumb base.",
        image: "/images/conditions/carpal-tunnel.jpg",
      },
    ],
    hotspot: "thumb",
    transform: { origin: "32% 52%", scale: 1.15, x: 25, y: 10 },
  },
  fingers: {
    id: "fingers",
    stepNumber: "03 / 04",
    eyebrow: "DIGITAL MOBILITY & GLIDE",
    title: "Tendons glide through protective fibrous pulleys.",
    description:
      "Fingers contain no internal muscles. Movement is produced by forearm flexor and extensor tendons sliding through protective fibrous pulleys along each phalanx.",
    commonSymptoms: [
      "A finger that catches, clicks, or locks in a bent position upon waking",
      "Tender nodule in the palm near the base of the finger",
      "Stiffness or swelling in the knuckle joints after repetitive use",
      "Gradual thickening that pulls a finger toward the palm",
    ],
    relatedConditions: [
      {
        id: "trigger-finger",
        title: "Trigger Finger",
        description: "Stenosing tenosynovitis at the A1 pulley.",
        image: "/images/conditions/carpal-tunnel.jpg",
      },
      {
        id: "dupuytren-contracture",
        title: "Dupuytren Disease",
        description: "Fibromatosis and palmar fascial cord thickening.",
        image: "/images/conditions/ligament-injury.jpg",
      },
      {
        id: "mallet-finger",
        title: "Mallet Finger Injury",
        description: "Extensor tendon avulsion at the distal knuckle joint.",
        image: "/images/conditions/wrist-arthritis.jpg",
      },
    ],
    hotspot: "fingers",
    transform: { origin: "52% 25%", scale: 1.15, x: 0, y: 40 },
  },
  nerves: {
    id: "nerves",
    stepNumber: "04 / 04",
    eyebrow: "SENSATION & INNERVATION",
    title: "Peripheral nerves deliver sensation and fine motor control.",
    description:
      "Three main peripheral nerves govern the hand. Compressive neuropathies produce distinct maps of numbness, tingling, and intrinsic muscle weakness.",
    commonSymptoms: [
      "Tingling or loss of feeling in the thumb, index, and middle fingers",
      "Numbness isolated to the small finger and outer ring finger",
      "Dropping items or difficulty buttoning shirts due to lost sensation",
      "Burning sensations or electric shocks when flexing the wrist",
    ],
    relatedConditions: [
      {
        id: "carpal-tunnel-syndrome",
        title: "Carpal Tunnel Syndrome",
        description: "Median nerve compression at the wrist.",
        image: "/images/conditions/carpal-tunnel.jpg",
      },
      {
        id: "cubital-tunnel",
        title: "Cubital Tunnel Syndrome",
        description: "Ulnar nerve compression along the inner elbow.",
        image: "/images/conditions/ligament-injury.jpg",
      },
      {
        id: "radial-neuropathy",
        title: "Radial Sensory Neuropathy",
        description: "Nerve irritation along the dorsoradial hand.",
        image: "/images/conditions/carpal-tunnel.jpg",
      },
    ],
    hotspot: "median-nerve",
    transform: { origin: "48% 54%", scale: 1.12, x: 10, y: -10 },
  },
};

export default function SymptomExplorer() {
  const [selectedAreaId, setSelectedAreaId] = useState<string>("wrist");
  const [activeLayer, setActiveLayer] = useState<AnatomyLayerId>("surface");
  const [viewMode3D, setViewMode3D] = useState<boolean>(false);

  // Animation Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const handVisualRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const conditionCardsRef = useRef<HTMLDivElement>(null);

  const currentArea = SYMPTOM_DATA[selectedAreaId] || SYMPTOM_DATA.wrist;

  // GSAP Choreography: smooth focus shift, camera re-framing, card reveals
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Smooth Hand Camera Pan & Scale
      if (handVisualRef.current) {
        gsap.to(handVisualRef.current, {
          scale: currentArea.transform.scale,
          x: currentArea.transform.x,
          y: currentArea.transform.y,
          transformOrigin: currentArea.transform.origin,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // 2. Right Info Card Slide and Cross-fade
      if (infoCardRef.current) {
        gsap.fromTo(
          infoCardRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
        );
      }

      // 3. Stagger Related Condition Cards
      if (conditionCardsRef.current) {
        const cards = conditionCardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.1 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedAreaId]);

  const areaPills = [
    {
      id: "wrist",
      label: "Wrist",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v6m0 8v6M8 8h8m-8 8h8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: "thumb",
      label: "Thumb",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 10v12M15 10.5a3 3 0 1 1-6 0V6a2 2 0 0 1 4 0v4.5" />
          <path d="M11 14h6a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6" />
        </svg>
      ),
    },
    {
      id: "fingers",
      label: "Fingers",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18V8a2 2 0 0 1 4 0v10m0-12a2 2 0 0 1 4 0v12m0-12a2 2 0 0 1 4 0v10" />
        </svg>
      ),
    },
    {
      id: "nerves",
      label: "Nerves",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M12 8l4-4m-4 8l5-3m-5 7l4 4M12 6l-4-4m4 8l-5-3m5 7l-4 4" />
        </svg>
      ),
    },
  ];

  const anatomyLayersList: { id: AnatomyLayerId; label: string; iconSrc: string }[] = [
    { id: "surface", label: "Surface", iconSrc: "/images/layer-bones.jpg" },
    { id: "bones", label: "Bones", iconSrc: "/images/layer-bones.jpg" },
    { id: "tendons", label: "Tendons", iconSrc: "/images/conditions/ligament-injury.jpg" },
    { id: "nerves", label: "Nerves", iconSrc: "/images/conditions/carpal-tunnel.jpg" },
    { id: "joints", label: "Joints", iconSrc: "/images/conditions/wrist-arthritis.jpg" },
  ];

  return (
    <section
      id="symptoms"
      ref={containerRef}
      className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#0A0D24] text-[#111827]"
    >
      {/* Background Architectural Glow behind the Hand */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[68%] h-[85%] bg-radial from-[#121A38] via-[#0A0D24] to-transparent pointer-events-none rounded-l-full opacity-90 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: Headline & Area Selector ================= */}
          <div className="lg:col-span-4 space-y-8 z-10">
            <div>
              {/* Pulse Heartbeat Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#03ACED] font-semibold mb-3">
                <Activity className="w-4 h-4 text-[#03ACED]" />
                <span>Your Symptoms</span>
              </div>

              {/* Editorial Headline */}
              <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.25rem] font-normal text-[#0A0D24] tracking-tight leading-[1.08] mb-4">
                Where are you experiencing{" "}
                <span className="text-[#03ACED] italic font-serif-editorial">discomfort?</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
                Select an area to explore the anatomy and learn about common related conditions.
              </p>
            </div>

            {/* Area Selector Pills matching Reference */}
            <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Select symptom area">
              {areaPills.map((pill) => {
                const isSelected = selectedAreaId === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedAreaId(pill.id)}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#03ACED] ${
                      isSelected
                        ? "bg-[#0A0D24] text-white shadow-xl shadow-[#0A0D24]/20 border border-[#03ACED]/50"
                        : "bg-white/95 text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    <span
                      className={`transition-colors ${
                        isSelected ? "text-[#03ACED]" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    >
                      {pill.icon}
                    </span>
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Vertical Patient Journey Stepper */}
            <div className="hidden sm:block pt-4 border-t border-slate-200/80">
              <div className="space-y-4">
                {[
                  { step: "01", label: "Select an area", active: true },
                  { step: "02", label: "Explore the anatomy", active: false },
                  { step: "03", label: "Learn about conditions", active: false },
                  { step: "04", label: "Understand treatment options", active: false },
                ].map((item, idx) => (
                  <div key={item.step} className="flex items-center gap-3 text-xs font-mono">
                    <span
                      className={`w-2 h-2 rounded-full transition-all ${
                        item.active
                          ? "bg-[#03ACED] ring-4 ring-[#03ACED]/20"
                          : "bg-slate-300"
                      }`}
                    />
                    <span className={item.active ? "text-[#0A0D24] font-semibold" : "text-slate-400"}>
                      <span className="text-[#03ACED] mr-1.5">{item.step}</span>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= CENTER COLUMN: Anatomical Hand & Interactive Pins ================= */}
          <div className="lg:col-span-4 relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[540px]">
            {/* View Mode Toggle: Atlas vs 3D Rig */}
            <div className="absolute top-2 z-30 flex items-center gap-1.5 bg-[#0A0D24]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[11px] font-mono text-white shadow-lg">
              <button
                type="button"
                onClick={() => setViewMode3D(false)}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  !viewMode3D ? "bg-[#03ACED] text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Anatomy Atlas
              </button>
              <button
                type="button"
                onClick={() => setViewMode3D(true)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all ${
                  viewMode3D ? "bg-[#03ACED] text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Box className="w-3 h-3" />
                <span>3D Model</span>
              </button>
            </div>

            {viewMode3D ? (
              /* Real 4-Layer GLB Medical Assembly Rig with Mesh-Level Highlighting */
              <div className="w-full h-[520px] rounded-2xl overflow-hidden bg-[#0A0D24] border border-[#1B1464] shadow-2xl relative">
                <AnatomyAssemblyViewer
                  highlightMeshName={
                    selectedAreaId === "wrist"
                      ? "scaphoid"
                      : selectedAreaId === "thumb"
                      ? "digit I"
                      : selectedAreaId === "fingers"
                      ? "flexor tendon"
                      : "median"
                  }
                  enableCalibrationHUD={true}
                  className="w-full h-full"
                />
              </div>
            ) : (
              /* High-DPI Illustrated Anatomical Hand with Dynamic GSAP Focal Zoom */
              <div className="relative w-full max-w-[380px] aspect-[3/4] flex items-center justify-center overflow-visible select-none">
                <div ref={handVisualRef} className="relative w-full h-full will-change-transform">
                  <Image
                    src="/images/symptom-hand-atlas.jpg"
                    alt="Human hand and wrist anatomical atlas"
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                    priority
                  />

                  {/* ================= Dynamic Hotspot Pins & Concentric Pulse Rings ================= */}
                  {/* 1. Wrist Hotspot Pin */}
                  <div
                    onClick={() => setSelectedAreaId("wrist")}
                    className="absolute left-[48%] top-[68%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative flex items-center justify-center">
                      {selectedAreaId === "wrist" && (
                        <>
                          <span className="absolute w-14 h-14 rounded-full border border-[#03ACED] animate-ping opacity-60" />
                          <span className="absolute w-10 h-10 rounded-full border border-[#03ACED]/80 animate-pulse" />
                        </>
                      )}
                      <span className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0D24]/90 border border-[#03ACED] text-white text-xs font-mono font-medium shadow-xl shadow-[#03ACED]/30 group-hover:scale-105 transition-all">
                        <span className="w-2 h-2 rounded-full bg-[#03ACED] animate-pulse" />
                        <span>Wrist</span>
                      </span>
                    </div>
                  </div>

                  {/* 2. Thumb Hotspot Pin */}
                  <div
                    onClick={() => setSelectedAreaId("thumb")}
                    className={`absolute left-[26%] top-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-opacity duration-300 ${
                      selectedAreaId !== "thumb" ? "opacity-60 hover:opacity-100" : "opacity-100"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {selectedAreaId === "thumb" && (
                        <span className="absolute w-10 h-10 rounded-full border border-[#03ACED] animate-ping opacity-60" />
                      )}
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0D24]/85 border border-slate-600 group-hover:border-[#03ACED] text-white text-xs font-mono shadow-lg transition-all">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#03ACED]" />
                        <span>Thumb</span>
                      </span>
                    </div>
                  </div>

                  {/* 3. Fingers Hotspot Pin */}
                  <div
                    onClick={() => setSelectedAreaId("fingers")}
                    className={`absolute left-[54%] top-[16%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-opacity duration-300 ${
                      selectedAreaId !== "fingers" ? "opacity-60 hover:opacity-100" : "opacity-100"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {selectedAreaId === "fingers" && (
                        <span className="absolute w-10 h-10 rounded-full border border-[#03ACED] animate-ping opacity-60" />
                      )}
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0D24]/85 border border-slate-600 group-hover:border-[#03ACED] text-white text-xs font-mono shadow-lg transition-all">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#03ACED]" />
                        <span>Fingers</span>
                      </span>
                    </div>
                  </div>

                  {/* 4. Median Nerve Hotspot Pin */}
                  <div
                    onClick={() => setSelectedAreaId("nerves")}
                    className={`absolute left-[58%] top-[78%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-opacity duration-300 ${
                      selectedAreaId !== "nerves" ? "opacity-60 hover:opacity-100" : "opacity-100"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {selectedAreaId === "nerves" && (
                        <span className="absolute w-10 h-10 rounded-full border border-[#03ACED] animate-ping opacity-60" />
                      )}
                      <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0D24]/85 border border-slate-600 group-hover:border-[#03ACED] text-white text-xs font-mono shadow-lg transition-all">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#03ACED]" />
                        <span>Median nerve</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: Glassmorphic Information & Conditions ================= */}
          <div className="lg:col-span-4 space-y-6 z-10">
            {/* Primary Glassmorphic Detail Card */}
            <div
              ref={infoCardRef}
              className="bg-[#0A0D24]/90 backdrop-blur-xl rounded-2xl border border-[#1E293B] p-6 sm:p-7 shadow-2xl text-white relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-widest text-[#03ACED] font-semibold">
                  {currentArea.eyebrow}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentArea.stepNumber}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-white tracking-tight leading-[1.12] mb-3">
                {currentArea.title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {currentArea.description}
              </p>

              {/* Common Symptoms Checklist */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                  Common Symptoms
                </h4>
                <ul className="space-y-2">
                  {currentArea.commonSymptoms.map((symptom, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED] shrink-0 mt-1.5" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
                <a
                  href="#conditions-grid"
                  className="inline-flex items-center gap-2 bg-[#03ACED] hover:bg-[#0296D0] text-black text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-[#03ACED]/20 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>Explore {currentArea.id} conditions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#wrist-explorer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-full hover:bg-slate-800/50 transition-all"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[#03ACED]">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                  <span>Watch the anatomy in action</span>
                </a>
              </div>
            </div>

            {/* Related Conditions Cards Carousel */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="uppercase tracking-widest text-slate-400 font-semibold">
                  Related Conditions
                </span>
                <a href="#conditions-grid" className="text-[#03ACED] hover:underline flex items-center gap-1 text-[11px]">
                  <span>View all</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              <div ref={conditionCardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentArea.relatedConditions.map((cond) => (
                  <a
                    key={cond.id}
                    href="#conditions-grid"
                    className="group bg-[#0A0D24]/85 backdrop-blur-md border border-[#1E293B] hover:border-[#03ACED]/60 rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  >
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2 bg-slate-900">
                      <Image
                        src={cond.image}
                        alt={cond.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-white group-hover:text-[#03ACED] transition-colors leading-tight mb-1">
                        {cond.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                        {cond.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-800/60 flex justify-end">
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#03ACED] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR: View Anatomy Layers Bar matching Reference ================= */}
        <div className="mt-14 pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0A0D24] font-semibold">
              View Anatomy Layers
            </span>
          </div>

          {/* 5 Layer Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {anatomyLayersList.map((layer) => {
              const active = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActiveLayer(layer.id)}
                  className={`group relative flex flex-col items-center p-1.5 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-[#0A0D24] ring-2 ring-[#03ACED] shadow-lg shadow-[#03ACED]/20"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 mb-1">
                    <Image
                      src={layer.iconSrc}
                      alt={layer.label}
                      fill
                      className={`object-cover transition-opacity ${
                        active ? "opacity-100" : "opacity-60 group-hover:opacity-90"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-medium ${
                      active ? "text-[#03ACED]" : "text-slate-600"
                    }`}
                  >
                    {layer.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Mouse Helper Hint */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <MousePointer2 className="w-3.5 h-3.5 text-[#03ACED]" />
            <span>Click different areas to explore anatomy and related conditions.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
