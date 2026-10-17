"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Box,
  FileText,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bone,
  Flame,
  Layers,
  Sparkles,
  Droplets,
} from "lucide-react";
import { AnatomyLayerId } from "@/types/anatomy";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ConditionCardItem {
  id: string;
  number: string;
  category: string;
  title: string;
  shortDescription: string;
  image: string;
  tags: string[];
  focusArea: "wrist" | "thumb" | "fingers" | "nerves" | "rest";
  layer: AnatomyLayerId;
  hotspotId?: string;
  kinematicMode?: "rest" | "pinch" | "grip" | "spread" | "phalen";
}

const CAROUSEL_CONDITIONS: ConditionCardItem[] = [
  {
    id: "carpal-tunnel-syndrome",
    number: "01",
    category: "NERVE COMPRESSION",
    title: "Carpal Tunnel Syndrome",
    shortDescription:
      "Compression of the median nerve within the carpal canal at the wrist, leading to numbness, tingling, and grip weakness.",
    image: "/images/conditions/carpal-tunnel.jpg",
    tags: ["Numbness", "Tingling", "Weakness"],
    focusArea: "wrist",
    layer: "nerves",
    hotspotId: "median-nerve",
    kinematicMode: "phalen",
  },
  {
    id: "thumb-arthritis",
    number: "02",
    category: "DEGENERATIVE JOINT",
    title: "Thumb Basal Joint Arthritis",
    shortDescription:
      "Degeneration of cartilage at the first carpometacarpal (CMC) joint, producing pain during pinch and grasp activities.",
    image: "/images/conditions/wrist-arthritis.jpg",
    tags: ["Pinch Pain", "CMC Joint", "Stiffness"],
    focusArea: "thumb",
    layer: "joints",
    hotspotId: "cmc-joint",
    kinematicMode: "pinch",
  },
  {
    id: "trigger-finger",
    number: "03",
    category: "TENDON & PULLEY",
    title: "Trigger Finger",
    shortDescription:
      "Stenosing tenosynovitis causing catching, clicking, or locking of a digit during flexion and extension.",
    image: "/images/conditions/trigger-finger.jpg",
    tags: ["Catching", "A1 Pulley", "Locking"],
    focusArea: "fingers",
    layer: "tendons",
    hotspotId: "a1-pulley",
    kinematicMode: "grip",
  },
  {
    id: "wrist-injuries",
    number: "04",
    category: "TRAUMA & INSTABILITY",
    title: "Wrist Injuries & Fractures",
    shortDescription:
      "Fractures, scaphoid injuries, and ligament tears resulting from acute falls or sporting impacts.",
    image: "/images/conditions/ligament-injury.jpg",
    tags: ["Scaphoid", "Fracture", "FOOSH"],
    focusArea: "wrist",
    layer: "bones",
    hotspotId: "scaphoid",
    kinematicMode: "rest",
  },
  {
    id: "tendon-pulley-conditions",
    number: "05",
    category: "TENOSYNOVITIS",
    title: "Tendon & Pulley Conditions",
    shortDescription:
      "Inflammation or injury to flexor tendons and annular pulley systems affecting finger movement and function.",
    image: "/images/conditions/tendon-conditions.jpg",
    tags: ["Flexor Glide", "Synovial", "Mobility"],
    focusArea: "fingers",
    layer: "tendons",
    hotspotId: "a1-pulley",
    kinematicMode: "spread",
  },
];

const LAYER_PILLS: { id: AnatomyLayerId; label: string; icon: React.ElementType }[] = [
  { id: "nerves", label: "Nerves", icon: Activity },
  { id: "bones", label: "Bones", icon: Bone },
  { id: "tendons", label: "Tendons", icon: Flame },
  { id: "joints", label: "Joints", icon: Layers },
  { id: "surface", label: "Surface", icon: Droplets },
];

export default function ConditionsGrid() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedLayerOverride, setSelectedLayerOverride] = useState<AnatomyLayerId | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag tracking refs
  const dragStartX = useRef<number>(0);
  const dragDeltaX = useRef<number>(0);
  const isDirectInteracting = useRef<boolean>(false);
  const wheelLockout = useRef<boolean>(false);

  const activeCondition = CAROUSEL_CONDITIONS[activeIndex];
  const totalCount = CAROUSEL_CONDITIONS.length;

  // Active 3D layer either from override or current condition
  const effectiveLayer = selectedLayerOverride || activeCondition.layer;

  // Navigate functions
  const goToIndex = useCallback((nextIdx: number) => {
    setActiveIndex(() => {
      const normalized = ((nextIdx % totalCount) + totalCount) % totalCount;
      return normalized;
    });
    setSelectedLayerOverride(null);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const handleNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  // Animate cards on index change with GSAP 3D choreography
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Card transform metrics
    const stepX = isMobile ? 240 : isTablet ? 320 : 380;
    const farStepX = isMobile ? 380 : isTablet ? 540 : 660;
    const depthZ = isMobile ? -100 : -150;
    const farDepthZ = isMobile ? -180 : -280;
    const rotY = isMobile ? 9 : 14;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      // Circular offset relative to activeIndex in range [-2, 2]
      let diff = i - activeIndex;
      if (diff > totalCount / 2) diff -= totalCount;
      if (diff < -totalCount / 2) diff += totalCount;

      let targetX = 0;
      let targetZ = 0;
      let targetRotY = 0;
      let targetScale = 1;
      let targetOpacity = 1;
      let zIndex = 30;

      if (diff === 0) {
        // Active Center Card
        targetX = 0;
        targetZ = 0;
        targetRotY = 0;
        targetScale = 1;
        targetOpacity = 1;
        zIndex = 50;
      } else if (diff === 1) {
        // Immediate Next
        targetX = stepX;
        targetZ = depthZ;
        targetRotY = -rotY;
        targetScale = 0.84;
        targetOpacity = 0.72;
        zIndex = 30;
      } else if (diff === -1) {
        // Immediate Prev
        targetX = -stepX;
        targetZ = depthZ;
        targetRotY = rotY;
        targetScale = 0.84;
        targetOpacity = 0.72;
        zIndex = 30;
      } else if (diff >= 2) {
        // Far Next
        targetX = farStepX;
        targetZ = farDepthZ;
        targetRotY = -rotY * 1.5;
        targetScale = 0.68;
        targetOpacity = 0.28;
        zIndex = 10;
      } else {
        // Far Prev
        targetX = -farStepX;
        targetZ = farDepthZ;
        targetRotY = rotY * 1.5;
        targetScale = 0.68;
        targetOpacity = 0.28;
        zIndex = 10;
      }

      gsap.to(card, {
        x: targetX,
        z: targetZ,
        rotationY: targetRotY,
        scale: targetScale,
        opacity: targetOpacity,
        zIndex,
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }, [activeIndex, totalCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond if section is roughly in viewport
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Mouse wheel interaction on carousel container
  const handleWheel = (e: React.WheelEvent) => {
    // If deltaX or horizontal intent
    if (Math.abs(e.deltaX) > 20 || (e.shiftKey && Math.abs(e.deltaY) > 20)) {
      if (wheelLockout.current) return;
      wheelLockout.current = true;
      if (e.deltaX > 0 || e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        wheelLockout.current = false;
      }, 420);
    }
  };

  // Pointer drag/swipe interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    setIsDragging(true);
    isDirectInteracting.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 60;
    if (dragDeltaX.current < -threshold) {
      handleNext();
    } else if (dragDeltaX.current > threshold) {
      handlePrev();
    }
    dragDeltaX.current = 0;
    setTimeout(() => {
      isDirectInteracting.current = false;
    }, 500);
  };

  // Optional ScrollTrigger section pinning for smooth storytelling
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=1600",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (isDirectInteracting.current) return; // direct user drag takes priority
          const progress = self.progress;
          const targetIndex = Math.min(
            Math.floor(progress * totalCount),
            totalCount - 1
          );
          setActiveIndex(targetIndex);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [totalCount]);

  return (
    <section
      ref={sectionRef}
      id="conditions"
      className="relative min-h-screen py-16 lg:py-24 bg-[#0A0E1A] text-white overflow-hidden border-b border-cyan-950/40 select-none flex flex-col justify-between"
      onWheel={handleWheel}
    >
      {/* Cinematic subtle background grid & radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-gradient-to-b from-[#03ACED]/12 via-[#1B1464]/20 to-transparent blur-3xl rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #03ACED 1px, transparent 1px), linear-gradient(to bottom, #03ACED 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Subtle circular stage floor light */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[1100px] h-[340px] bg-radial from-[#03ACED]/15 via-[#0A1A33]/40 to-transparent blur-2xl rounded-[100%] border-t border-cyan-400/20" />
      </div>

      {/* Subtle ambient lighting behind carousel cards */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div className="w-full max-w-4xl h-[420px] bg-gradient-to-t from-[#03ACED]/10 via-[#1B1464]/15 to-transparent blur-3xl rounded-full" />
      </div>

      {/* TOP HEADER & PILLARS (Z-INDEX 20) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-4">
          {/* Header left */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#03ACED] mb-3 font-semibold">
              <BookOpen className="w-4 h-4 text-[#03ACED]" />
              <span>PATIENT EDUCATION</span>
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.08] mb-4">
              Common hand and{" "}
              <span className="italic text-[#03ACED] font-serif font-light">
                wrist conditions
              </span>
            </h2>

            <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
              Explore educational resources about common conditions. All content is
              reviewed by the surgeon and designed to help you understand your symptoms,
              treatment options, and recovery.
            </p>

            {/* CTA + Layer Pills */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B1464] hover:bg-[#251b87] text-white text-xs sm:text-sm font-semibold tracking-wide border border-[#03ACED]/40 hover:border-[#03ACED] shadow-lg shadow-cyan-950/40 transition-all duration-200"
              >
                <span>Explore conditions</span>
                <span className="text-[#03ACED]">→</span>
              </a>

              {/* Layer switch buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-cyan-900/30">
                {LAYER_PILLS.map((l) => {
                  const Icon = l.icon;
                  const isActive = effectiveLayer === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLayerOverride(l.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#03ACED] text-[#0A0E1A] shadow-md shadow-cyan-500/20 font-semibold"
                          : "text-slate-400 hover:text-cyan-200 hover:bg-white/5"
                      }`}
                      title={`View ${l.label} anatomical structure`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{l.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Right Value Pillars */}
          <div className="hidden lg:flex flex-col gap-3.5 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-cyan-900/30">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Evidence based</div>
                <div className="text-[11px] text-slate-400">Reviewed by the surgeon</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">3D interactive</div>
                <div className="text-[11px] text-slate-400">Understand visually</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Clear explanations</div>
                <div className="text-[11px] text-slate-400">Symptoms, treatment & recovery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D CAROUSEL STAGE (Z-INDEX 20) */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-4"
        style={{ perspective: "1300px" }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous condition"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-[#03ACED] text-slate-300 hover:text-[#0A0E1A] border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer group active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next condition"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-[#03ACED] text-slate-300 hover:text-[#0A0E1A] border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer group active:scale-95"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Cards Track */}
        <div
          ref={carouselContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-[470px] sm:h-[490px] flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
        >
          {CAROUSEL_CONDITIONS.map((cond, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={cond.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => {
                  if (!isCenter) goToIndex(idx);
                }}
                className={`absolute w-[290px] sm:w-[330px] md:w-[360px] h-[440px] sm:h-[460px] rounded-3xl p-5 flex flex-col justify-between transition-colors duration-300 select-none ${
                  isCenter
                    ? "bg-gradient-to-b from-[#0F172A]/95 via-[#0A1020]/95 to-[#060A14]/98 border-2 border-[#03ACED] shadow-[0_0_40px_rgba(3,172,237,0.32)] backdrop-blur-xl cursor-default"
                    : "bg-[#090D1A]/85 hover:bg-[#0E1528]/90 border border-cyan-900/40 hover:border-cyan-400/50 backdrop-blur-md cursor-pointer"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
              >
                <div>
                  {/* Top Header inside card */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {cond.number}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isCenter
                          ? "bg-cyan-500/20 text-[#03ACED]"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Thumbnail Banner */}
                  <div className="w-full h-36 rounded-2xl overflow-hidden relative mb-4 border border-cyan-950/60 bg-[#060914] flex items-center justify-center">
                    <Image
                      src={cond.image}
                      alt={cond.title}
                      fill
                      sizes="(max-width: 768px) 300px, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs border border-cyan-800/30">
                      3D Diagnostic Atlas
                    </span>
                  </div>

                  {/* Category */}
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#03ACED] font-semibold mb-1">
                    {cond.category}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-editorial text-xl sm:text-2xl font-normal text-white leading-tight mb-2">
                    {cond.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-300/80 leading-relaxed line-clamp-3 mb-3">
                    {cond.shortDescription}
                  </p>
                </div>

                {/* Bottom Tags and Action Link */}
                <div>
                  {/* Symptom badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {cond.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action row */}
                  <div className="pt-3 border-t border-cyan-900/30 flex items-center justify-between text-xs">
                    <Link
                      href={`/conditions/${cond.id}`}
                      className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-white font-medium group transition-colors"
                      onClick={(e) => {
                        if (!isCenter) e.preventDefault();
                      }}
                    >
                      <span>Explore guide</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    {isCenter && (
                      <span className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#03ACED]" />
                        Active Focus
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM PROGRESS TRACK & DIAL (Z-INDEX 20) */}
      <div className="relative z-20 max-w-md mx-auto px-4 w-full pb-2">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs font-semibold text-cyan-400">01</span>

          {/* Stepper bar segments */}
          <div className="flex-1 flex items-center gap-2">
            {CAROUSEL_CONDITIONS.map((cond, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={cond.id}
                  onClick={() => goToIndex(i)}
                  aria-label={`Jump to condition ${cond.number}: ${cond.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 flex-1 ${
                    isActive
                      ? "bg-[#03ACED] shadow-md shadow-cyan-400/50 scale-y-125"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                />
              );
            })}
          </div>

          <span className="font-mono text-xs font-semibold text-slate-500">
            0{totalCount}
          </span>
        </div>

        <div className="text-center mt-3">
          <span className="text-[11px] font-mono text-slate-400 tracking-wider">
            DRAG OR USE ARROW KEYS TO NAVIGATE CONDITIONS
          </span>
        </div>
      </div>
    </section>
  );
}
