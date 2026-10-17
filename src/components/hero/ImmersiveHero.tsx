"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 300;
const FRAME_PATH = "/hero-frames/frame_";

const MILESTONES = [
  {
    id: "surface",
    layer: "01 / 04",
    eyebrow: "C U T A N E O U S \u00A0 S U R F A C E",
    headlinePart1: "Specialized",
    headlinePart2: "palmar architecture.",
    desc: "Tethered skin and dense tactile mechanoreceptors provide fine stereognosis and friction for secure grasp.",
    slideTitle: "Surface and tactile sensation",
    start: 0.05,
    end: 0.25,
  },
  {
    id: "tendons",
    layer: "02 / 04",
    eyebrow: "F L E X O R \u00A0 A P P A R A T U S",
    headlinePart1: "Nine deep",
    headlinePart2: "gliding tendons.",
    desc: "Transmitting power from forearm muscle bellies through synovial sheaths and protective annular pulleys.",
    slideTitle: "Tendon excursion and pulleys",
    start: 0.28,
    end: 0.48,
  },
  {
    id: "bones",
    layer: "03 / 04",
    eyebrow: "S K E L E T A L \u00A0 F O U N D A T I O N",
    headlinePart1: "Eight articulating",
    headlinePart2: "carpal bones.",
    desc: "Arranged in synchronous proximal and distal rows to disperse axial impact forces and facilitate wrist mobility.",
    slideTitle: "Carpal joint kinematics",
    start: 0.51,
    end: 0.71,
  },
  {
    id: "canal",
    layer: "04 / 04",
    eyebrow: "N E U R O V A S C U L A R \u00A0 C A N A L",
    headlinePart1: "The median",
    headlinePart2: "nerve pathway.",
    desc: "Passing beneath the transverse carpal ligament to deliver sensibility to radial digits and thenar motor command.",
    slideTitle: "Median nerve and carpal tunnel",
    start: 0.74,
    end: 0.96,
  },
];

function getMilestoneOpacity(p: number, start: number, end: number) {
  const fadeInDuration = 0.035;
  const fadeOutDuration = 0.035;
  if (p < start || p > end) return 0;
  if (p < start + fadeInDuration) {
    return (p - start) / fadeInDuration;
  }
  if (p > end - fadeOutDuration) {
    return (end - p) / fadeOutDuration;
  }
  return 1;
}

export default function ImmersiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const leftWashRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Loaded frames cache
  const framesCache = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const lastRenderedIndex = useRef<number>(-1);
  const renderPending = useRef<boolean>(false);
  const currentScrollProgress = useRef<number>(0);

  // UI state
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState<boolean>(false);

  // Parallax subtle mouse state
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Helper to format frame URL
  const getFrameUrl = useCallback((idx: number) => {
    const num = String(idx + 1).padStart(4, "0");
    return `${FRAME_PATH}${num}.webp`;
  }, []);

  // Draw a frame to canvas with high-DPI and aspect-ratio preservation
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    const targetWidth = Math.floor(rect.width * dpr);
    const targetHeight = Math.floor(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const imageAspect = 1920 / 1080;
    const canvasAspect = rect.width / rect.height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasAspect > imageAspect) {
      drawW = rect.width;
      drawH = rect.width / imageAspect;
      drawX = 0;
      drawY = (rect.height - drawH) / 2;
    } else {
      drawH = rect.height;
      drawW = rect.height * imageAspect;
      const isMobile = rect.width < 768;
      const horizontalFactor = isMobile ? 0.5 : 0.62;
      drawX = (rect.width - drawW) * horizontalFactor;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    lastRenderedIndex.current = index;
  }, []);

  // Request animation frame for smooth redraw
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
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      framesCache.current[0] = firstImg;
      setFirstFrameLoaded(true);
      drawFrame(0);
    };

    // 2. Preload first 25 frames immediately
    const preloadImmediateCount = 25;
    for (let i = 1; i < preloadImmediateCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        framesCache.current[i] = img;
      };
    }

    // 3. Progressively load remainder in chunks
    let currentIdx = preloadImmediateCount;
    let isCancelled = false;

    const loadNextBatch = () => {
      if (isCancelled || currentIdx >= TOTAL_FRAMES) return;
      const batchSize = 12;
      const end = Math.min(currentIdx + batchSize, TOTAL_FRAMES);
      for (let i = currentIdx; i < end; i++) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          framesCache.current[i] = img;
        };
      }
      currentIdx = end;

      if (currentIdx < TOTAL_FRAMES) {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 300 });
        } else {
          setTimeout(loadNextBatch, 80);
        }
      }
    };

    const timer = setTimeout(loadNextBatch, 250);

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

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          currentScrollProgress.current = p;

          // Fade out all initial hero opening text as soon as scrolling starts
          const fadeThreshold = 0.025;
          const rawOpacity = Math.max(0, Math.min(1, 1 - p / fadeThreshold));
          const textOpacity = rawOpacity * rawOpacity;
          const textY = (1 - rawOpacity) * -20;

          if (textOverlayRef.current) {
            textOverlayRef.current.style.opacity = textOpacity.toFixed(3);
            textOverlayRef.current.style.transform = `translate3d(0, ${textY.toFixed(1)}px, 0)`;
            textOverlayRef.current.style.pointerEvents = textOpacity < 0.02 ? "none" : "auto";
            textOverlayRef.current.style.display = textOpacity <= 0 ? "none" : "grid";
          }

          if (leftWashRef.current) {
            leftWashRef.current.style.opacity = textOpacity.toFixed(3);
            leftWashRef.current.style.display = textOpacity <= 0 ? "none" : "block";
          }

          // Progressively reveal editorial text milestones with the exact same hero typography design
          MILESTONES.forEach((m, idx) => {
            const el = milestonesRef.current[idx];
            if (!el) return;
            const op = getMilestoneOpacity(p, m.start, m.end);
            if (op <= 0) {
              el.style.opacity = "0";
              el.style.display = "none";
            } else {
              el.style.display = "flex";
              el.style.opacity = op.toFixed(3);
              const translateY = (1 - op) * 16;
              el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
            }
          });

          // Calculate frame index: 0 to TOTAL_FRAMES - 1
          const frameIdx = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1)))
          );
          requestFrameRender(frameIdx);
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, requestFrameRender]);

  // Mouse parallax interaction
  const handlePointerMove = (e: React.PointerEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 16;
    const y = (clientY / window.innerHeight - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  const handlePointerLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Scroll to next section
  const handleScrollToNext = () => {
    const nextSection = document.getElementById("journey") || document.getElementById("symptoms");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reduced motion alternative rendering
  if (isReducedMotion) {
    return (
      <section className="relative min-h-[90vh] bg-gradient-to-r from-[#F4F7FB] via-[#E2E8F0] to-[#0A0D24] flex items-center justify-center p-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[11px] font-mono tracking-[0.25em] text-[#475569] uppercase font-semibold">
              H A N D &nbsp; A N D &nbsp; W R I S T &nbsp; S U R G E R Y
            </div>
            <h1 className="font-serif-editorial text-5xl sm:text-6xl font-normal leading-[1.05] text-[#111827]">
              Understand <br />
              <span className="text-[#03ACED]">your hand.</span>
            </h1>
            <p className="text-[#475569] text-lg max-w-lg">
              Explore the anatomy behind your symptoms. Learn about common conditions and when to seek care.
            </p>
            <div className="flex gap-4">
              <a
                href="#symptoms"
                className="bg-[#03ACED] text-[#080D24] font-semibold px-7 py-3.5 rounded-full shadow-lg"
              >
                Explore the hand →
              </a>
            </div>
          </div>
          <div className="lg:col-span-6 relative h-[500px]">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="anatomy"
      className="hero relative bg-[#0A0D24] text-[#111827] select-none"
      style={{ height: "620vh" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Sticky Viewport Container */}
      <div
        ref={stickyRef}
        className="hero-sticky sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Fullscreen High-Performance Frame-Sequence Canvas with enhanced brightness */}
        <canvas
          ref={canvasRef}
          aria-label="High-resolution anatomical frame sequence of the human hand"
          className="absolute inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: firstFrameLoaded ? 1 : 0.85,
            filter: "brightness(1.12) contrast(1.06)",
          }}
        />

        {/* Crisp luminous white gradient on the left for opening headline readability */}
        <div
          ref={leftWashRef}
          className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-white/90 via-white/70 to-transparent pointer-events-none z-10 will-change-[opacity]"
        />

        {/* Ambient atmospheric cyan glow */}
        <div className="absolute top-1/4 right-[15%] w-[520px] h-[520px] bg-[#03ACED]/25 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Main Initial Content Layout (Visible at scroll 0%, fades on scroll) */}
        <div
          ref={textOverlayRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24 sm:pt-28 pb-8 z-20 pointer-events-none will-change-[opacity,transform]"
        >
          {/* Left Column: Editorial Headline, Supporting Copy, and Actions */}
          <div
            className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 pointer-events-auto transition-transform duration-300"
            style={{
              transform: `translate3d(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px, 0)`,
            }}
          >
            <div className="space-y-5 max-w-lg">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#475569] uppercase font-semibold">
                  H A N D &nbsp; A N D &nbsp; W R I S T &nbsp; S U R G E R Y
                </span>
              </div>

              {/* Large Headline with THiNC Cyan Accent */}
              <h1 className="font-serif-editorial text-4xl sm:text-6xl xl:text-7xl font-normal leading-[1.05] tracking-tight text-[#111827]">
                Understand <br />
                <span className="text-[#03ACED]">your hand.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-[#475569] text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
                Explore the anatomy behind your symptoms. Learn about common conditions and when to seek care.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-2">
                <a
                  href="#symptoms"
                  className="inline-flex items-center gap-2.5 bg-[#03ACED] hover:bg-[#0284C7] text-[#080D24] font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-[#03ACED]/25 transition-all focus:outline-none focus:ring-2 focus:ring-[#03ACED]"
                >
                  <span>Explore the hand</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Watch how it works Play Trigger */}
                <button
                  type="button"
                  onClick={handleScrollToNext}
                  className="flex items-center gap-3 group text-left focus:outline-none"
                >
                  <div className="w-11 h-11 rounded-full bg-white border border-slate-300 group-hover:border-[#03ACED] flex items-center justify-center text-[#111827] group-hover:text-[#03ACED] shadow-sm transition-all">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div className="flex flex-col text-xs leading-tight font-medium text-[#111827] group-hover:text-[#03ACED] transition-colors">
                    <span>Watch</span>
                    <span>how it works</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Left: Story step indicator */}
            <div className="pt-5 border-t border-slate-300/80 space-y-2.5">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-semibold text-[#111827]">
                  01 / 04
                </span>

                {/* Segmented Progress Bars */}
                <div className="flex items-center gap-1.5 w-24">
                  <div className="h-1 flex-1 rounded-full bg-[#03ACED]" />
                  <div className="h-1 flex-1 rounded-full bg-slate-300" />
                  <div className="h-1 flex-1 rounded-full bg-slate-300" />
                  <div className="h-1 flex-1 rounded-full bg-slate-300" />
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={handleScrollToNext}
                    className="w-7 h-7 rounded-full border border-slate-300 bg-white/80 hover:border-slate-500 flex items-center justify-center text-slate-600 hover:text-[#03ACED] transition-colors"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleScrollToNext}
                    className="w-7 h-7 rounded-full border border-slate-300 bg-white/80 hover:border-slate-500 flex items-center justify-center text-slate-600 hover:text-[#03ACED] transition-colors"
                    aria-label="Next step"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slide Title */}
              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-semibold text-[#111827]">
                  The structures that power your hand
                </div>
                <div className="w-10 h-0.5 bg-[#03ACED]" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= Progressive Scroll Narration Milestones ================= */}
        {/* Rendered in the exact same left column with identical typography, font-size, layout, and styling */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24 sm:pt-28 pb-8">
            <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[460px] flex items-center">
              {MILESTONES.map((m, idx) => (
                <div
                  key={m.id}
                  ref={(el) => {
                    milestonesRef.current[idx] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-between space-y-6 sm:space-y-8 pointer-events-none will-change-[opacity,transform]"
                  style={{ display: "none", opacity: 0 }}
                >
                  <div className="space-y-5 max-w-lg">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
                      <span className="text-[11px] font-mono tracking-[0.25em] text-[#67D5EA] uppercase font-semibold">
                        {m.eyebrow}
                      </span>
                    </div>

                    {/* Large Editorial Headline identical to opening hero */}
                    <h2 className="font-serif-editorial text-4xl sm:text-6xl xl:text-7xl font-normal leading-[1.05] tracking-tight text-white">
                      {m.headlinePart1} <br />
                      <span className="text-[#03ACED]">{m.headlinePart2}</span>
                    </h2>

                    {/* Supporting Body Copy identical to opening hero */}
                    <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-lg">
                      {m.desc}
                    </p>
                  </div>

                  {/* Bottom Step Indicator matching hero layout */}
                  <div className="pt-5 border-t border-slate-700/80 space-y-2.5">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-semibold text-white">
                        {m.layer}
                      </span>

                      {/* Segmented Progress Bars (filling progressively 1 to 4) */}
                      <div className="flex items-center gap-1.5 w-24">
                        {MILESTONES.map((_, dotIdx) => (
                          <div
                            key={dotIdx}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              dotIdx <= idx ? "bg-[#03ACED]" : "bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Slide Title & Cyan Accent Rule */}
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {m.slideTitle}
                      </div>
                      <div className="w-10 h-0.5 bg-[#03ACED]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
