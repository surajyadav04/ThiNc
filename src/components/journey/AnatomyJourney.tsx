"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  Crosshair,
} from "lucide-react";
import AnatomyMeasuringScale from "../anatomy/AnatomyMeasuringScale";

const TOTAL_FRAMES = 300;
const FRAME_BASE_PATH = "/anatomy-frames/frame_";

interface JourneyStageConfig {
  id: string;
  number: string;
  navTitle: string;
  tagline: string;
  subtitle: string;
  description: string;
  clinicalNote: string;
  keyStructures: string[];
  rangeStart: number;
  rangeEnd: number;
}

const STAGES: JourneyStageConfig[] = [
  {
    id: "whole-hand",
    number: "01",
    navTitle: "Whole Hand",
    tagline: "WHOLE HAND",
    subtitle: "Surface & structure",
    description:
      "Specialized glabrous skin with dense tactile mechanoreceptors and tethered palmar fascia designed to resist shearing forces during grasp.",
    clinicalNote:
      "Surface topography and skin cleavage lines guide atraumatic surgical access to preserve cutaneous nerve sensibility.",
    keyStructures: ["Palmar aponeurosis", "Tactile fingertip pads", "Glabrous dermal ridges", "Thenar skin contour"],
    rangeStart: 0.0,
    rangeEnd: 0.166,
  },
  {
    id: "bones",
    number: "02",
    navTitle: "Bones",
    tagline: "BONES",
    subtitle: "The skeletal framework",
    description:
      "Eight carpal bones arranged in proximal and distal synchronous rows articulate with the radius and metacarpals to distribute axial mechanical loads.",
    clinicalNote:
      "Anatomical alignment of the proximal carpal row is critical to prevent progressive wrist instability and post-traumatic arthritis.",
    keyStructures: ["Scaphoid column", "Lunate keystone", "Distal radius facet", "Metacarpal rays"],
    rangeStart: 0.166,
    rangeEnd: 0.333,
  },
  {
    id: "tendons",
    number: "03",
    navTitle: "Tendons",
    tagline: "TENDONS",
    subtitle: "Movement & connection",
    description:
      "Deep and superficial flexor tendons glide through synovial sheaths and protective annular pulleys, translating muscular contractility into precision finger motion.",
    clinicalNote:
      "Smooth tendon excursion through the A1-A2 annular pulleys is essential to avoid stenosing tenosynovitis (trigger finger).",
    keyStructures: ["Flexor digitorum profundus", "Flexor digitorum superficialis", "Annular pulleys (A1-A5)", "Flexor pollicis longus"],
    rangeStart: 0.333,
    rangeEnd: 0.5,
  },
  {
    id: "nerves",
    number: "04",
    navTitle: "Nerves",
    tagline: "NERVES",
    subtitle: "Sensation & control",
    description:
      "The median, ulnar, and radial nerves deliver high-density sensory innervation to the digits and motor control to intrinsic hand muscles.",
    clinicalNote:
      "The median nerve is especially vulnerable to ischemic microvascular compression within the inextensible fibro-osseous carpal canal.",
    keyStructures: ["Median nerve trunk", "Recurrent thenar branch", "Ulnar motor nerve", "Digital sensory nerves"],
    rangeStart: 0.5,
    rangeEnd: 0.666,
  },
  {
    id: "blood-flow",
    number: "05",
    navTitle: "Blood Flow",
    tagline: "BLOOD FLOW",
    subtitle: "Circulation & tissue support",
    description:
      "Superficial and deep palmar arterial arches form redundant anastomotic networks that sustain microvascular perfusion across all digital rays.",
    clinicalNote:
      "Collateral microcirculation protects digital vitality; retrograde osseous flow to the scaphoid makes proximal fractures prone to avascular necrosis.",
    keyStructures: ["Superficial palmar arch", "Deep palmar arch", "Common digital arteries", "Princeps pollicis artery"],
    rangeStart: 0.666,
    rangeEnd: 0.833,
  },
  {
    id: "joints",
    number: "06",
    navTitle: "Joints",
    tagline: "JOINTS",
    subtitle: "Movement & stability",
    description:
      "Dense intercarpal and collateral ligaments bind the carpal architecture into a coordinated shock-absorbing and kinematic suspension system.",
    clinicalNote:
      "Disruption of the scapholunate interosseous ligament (SLIL) destabilizes the wrist, initiating progressive DISI rotational collapse.",
    keyStructures: ["Scapholunate ligament (SLIL)", "Lunotriquetral band", "TFCC articular disc", "Radiocarpal capsular complex"],
    rangeStart: 0.833,
    rangeEnd: 1.0,
  },
];

export default function AnatomyJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cached frame images array
  const framesCache = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const lastRenderedIndex = useRef<number>(-1);
  const renderPending = useRef<boolean>(false);
  const currentScrollProgress = useRef<number>(0);

  // Active Stage Index (0 - 5)
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [scrollProgressState, setScrollProgressState] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState<boolean>(false);

  // Helper to format frame path with WebP priority and JPG fallback
  const getFrameUrl = useCallback((index: number, format: "webp" | "jpg" = "webp") => {
    const num = String(index + 1).padStart(4, "0");
    return `${FRAME_BASE_PATH}${num}.${format}`;
  }, []);

  // Canvas Drawing logic with high-DPI scaling and vertical contain aspect ratio
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve cached image or locate nearest cached frame
    let img: HTMLImageElement | null = framesCache.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let b = index - 1; b >= 0; b--) {
        const candidate = framesCache.current[b];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
      if (!img) {
        for (let f = index + 1; f < TOTAL_FRAMES; f++) {
          const candidate = framesCache.current[f];
          if (candidate && candidate.complete && candidate.naturalWidth > 0) {
            img = candidate;
            break;
          }
        }
      }
    }

    if (!img) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Frame aspect is 1920 / 1080
    const imageAspect = 1920 / 1080;
    const canvasAspect = rect.width / rect.height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    // Cover fit: fill screen edge-to-edge with no letterbox or pillarbox borders
    if (canvasAspect > imageAspect) {
      // Screen is wider than 16:9: fill width, center vertically
      drawW = rect.width;
      drawH = rect.width / imageAspect;
      drawX = 0;
      drawY = (rect.height - drawH) / 2;
    } else {
      // Screen is taller than 16:9: fill height, center horizontally
      drawH = rect.height;
      drawW = rect.height * imageAspect;
      drawX = (rect.width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    lastRenderedIndex.current = index;
  }, []);

  // Request smooth animation frame render
  const requestFrameRender = useCallback(
    (index: number) => {
      if (renderPending.current && lastRenderedIndex.current === index) return;
      renderPending.current = true;
      requestAnimationFrame(() => {
        drawFrame(index);
        renderPending.current = false;
      });
    },
    [drawFrame]
  );

  // Progressive frame loader
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setIsReducedMotion(true);
    }

    // 1. Immediately load frame 0
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0, "webp");
    firstImg.onerror = () => {
      firstImg.src = getFrameUrl(0, "jpg");
    };
    firstImg.onload = () => {
      framesCache.current[0] = firstImg;
      setFirstFrameLoaded(true);
      drawFrame(0);
    };

    // 2. Preload first 30 frames immediately for instant scrubbing
    const initialBatch = 30;
    for (let i = 1; i < initialBatch; i++) {
      const img = new Image();
      img.src = getFrameUrl(i, "webp");
      img.onerror = () => {
        img.src = getFrameUrl(i, "jpg");
      };
      img.onload = () => {
        framesCache.current[i] = img;
      };
    }

    // 3. Progressively load remaining frames in idle batches
    let currentIdx = initialBatch;
    let isCancelled = false;

    const loadNextBatch = () => {
      if (isCancelled || currentIdx >= TOTAL_FRAMES) return;
      const batchSize = 15;
      const end = Math.min(currentIdx + batchSize, TOTAL_FRAMES);

      for (let i = currentIdx; i < end; i++) {
        const img = new Image();
        img.src = getFrameUrl(i, "webp");
        img.onerror = () => {
          img.src = getFrameUrl(i, "jpg");
        };
        img.onload = () => {
          framesCache.current[i] = img;
        };
      }
      currentIdx = end;

      if (currentIdx < TOTAL_FRAMES) {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 250 });
        } else {
          setTimeout(loadNextBatch, 60);
        }
      }
    };

    const timer = setTimeout(loadNextBatch, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [drawFrame, getFrameUrl]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (lastRenderedIndex.current >= 0) {
        drawFrame(lastRenderedIndex.current);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Master GSAP ScrollTrigger setup
  useEffect(() => {
    if (isReducedMotion || !containerRef.current || !stickyRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          const progress = self.progress;
          currentScrollProgress.current = progress;
          setScrollProgressState(progress);

          // Map continuous scroll progress to frame sequence
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
          );

          requestFrameRender(frameIndex);

          // Update active stage based on percentage ranges:
          // 0.00-0.166: 0, 0.166-0.333: 1, 0.333-0.500: 2, 0.500-0.666: 3, 0.666-0.833: 4, 0.833-1.000: 5
          const stageIdx = Math.min(5, Math.floor(progress * 6));
          setActiveStageIndex((prev) => (prev !== stageIdx ? stageIdx : prev));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion, requestFrameRender]);

  // Click on a stage to scroll directly to its start range
  const handleStageClick = (idx: number) => {
    if (!containerRef.current) return;
    const stage = STAGES[idx];
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerTop + (stage.rangeStart + 0.02) * containerHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  const activeStage = STAGES[activeStageIndex];
  const isFinalTransition = scrollProgressState > 0.94;

  return (
    <section
      ref={containerRef}
      id="anatomy-journey"
      className="relative w-full h-[700vh] bg-black text-white"
    >
      {/* 100vh Sticky Viewport Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between select-none bg-black"
      >
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-radial from-[#03ACED]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        {/* 1. Main Anatomy HTML5 Canvas: fitted edge-to-edge */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />

        {/* 2. Top Header (Full width across screen) */}
        <header className="relative z-30 pt-6 px-6 sm:px-10 lg:px-14 xl:px-16 w-full flex items-center justify-between pointer-events-auto">
          {/* Left Eyebrow */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#03ACED] animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.24em] text-[#67D5EA] uppercase font-bold">
              ANATOMY JOURNEY
            </span>
          </div>

          {/* Right Minimal Stage Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A0D24]/80 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-[#03ACED] font-semibold">{activeStage.number}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300 uppercase tracking-wider font-medium">{activeStage.navTitle}</span>
          </div>
        </header>

        {/* 3. Middle Interactive Layer: Full width with Left Measuring Scale & Right-Edge Text */}
        <div className="relative z-30 w-full px-6 sm:px-10 lg:px-14 xl:px-16 flex-1 flex items-center justify-between pointer-events-none py-4">
          {/* ================= LEFT COLUMN: INTERACTIVE MEASURING SCALE ================= */}
          <div className="pointer-events-auto hidden md:block">
            <AnatomyMeasuringScale
              stages={STAGES}
              activeStageIndex={activeStageIndex}
              scrollProgress={scrollProgressState}
              onSelectStage={handleStageClick}
            />
          </div>

          {/* ================= RIGHT COLUMN: ANATOMICAL EXPLODED CALLOUTS (FAR RIGHT SIDE) ================= */}
          <div className="pointer-events-auto ml-auto max-w-sm sm:max-w-md w-full text-left transition-all duration-500">
            {/* Anatomical Pin / Crosshair Callout */}
            <div className="flex items-center justify-end sm:justify-start gap-3 mb-2.5">
              <span className="w-3 h-3 rounded-full border border-[#03ACED] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED] animate-ping" />
              </span>
              <div className="hidden sm:block h-[1px] w-12 bg-gradient-to-r from-[#03ACED] to-transparent" />
              <span className="text-xs font-mono tracking-[0.2em] text-[#67D5EA] uppercase font-bold">
                STAGE {activeStage.number} &bull; {activeStage.tagline}
              </span>
            </div>

            {/* Large Editorial Headline */}
            <h3 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.08] mb-3">
              {activeStage.subtitle}
            </h3>

            {/* Clear Anatomical Description */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5 max-w-md font-normal">
              {activeStage.description}
            </p>

            {/* Floating Clinical Observation Highlight */}
            <div className="pl-3.5 border-l-2 border-[#03ACED] py-1 mb-5 text-left bg-gradient-to-r from-[#03ACED]/10 to-transparent rounded-r-lg">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#67D5EA] block font-semibold mb-1">
                ANATOMICAL OBSERVATION
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{activeStage.clinicalNote}&rdquo;
              </p>
            </div>

            {/* Target Anatomical Architecture Tokens */}
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold block text-left">
                TARGET STRUCTURES
              </span>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {activeStage.keyStructures.map((struct, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#0A1224]/80 border border-slate-700/80 text-slate-200 hover:border-[#03ACED]/60 transition-colors shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED]" />
                    <span>{struct}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Link to 3D Atlas */}
            <div className="text-left">
              <a
                href="#symptom-explorer"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#03ACED] hover:text-white font-semibold transition-colors group"
              >
                <span>Explore 3D Patient Atlas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* 4. Bottom Navigation & Mobile Stage Stepper */}
        <footer className="relative z-30 pb-5 px-6 sm:px-10 lg:px-14 xl:px-16 w-full flex items-center justify-between pointer-events-auto">
          {/* Mobile Stages Dots */}
          <div className="flex md:hidden items-center gap-1.5">
            {STAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleStageClick(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeStageIndex === idx ? "w-6 bg-[#03ACED]" : "w-2 bg-slate-700"
                }`}
                aria-label={`Go to stage ${idx + 1}`}
              />
            ))}
          </div>

          {/* Desktop Left Scroll Prompt */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
            <ArrowDown className="w-3.5 h-3.5 text-[#03ACED] animate-bounce" />
            <span>Scroll to travel through the anatomical layers</span>
          </div>

          {/* Final Transition Callout when reaching the end */}
          {isFinalTransition ? (
            <a
              href="#symptom-explorer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#03ACED] hover:bg-[#0284C7] text-black text-xs font-mono font-bold shadow-lg shadow-[#03ACED]/30 transition-all animate-pulse"
            >
              <span>Now explore it yourself</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div className="text-right text-[11px] font-mono text-slate-500">
              <span>CONTINUOUS ANATOMICAL SEQUENCE</span>
            </div>
          )}
        </footer>
      </div>
    </section>
  );
}
