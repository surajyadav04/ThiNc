"use client";

import React from "react";

interface StageItem {
  id: string;
  number: string;
  navTitle: string;
  rangeStart: number;
  rangeEnd: number;
}

interface AnatomyMeasuringScaleProps {
  stages: StageItem[];
  activeStageIndex: number;
  scrollProgress: number; // 0 to 1
  onSelectStage: (index: number) => void;
  className?: string;
}

export default function AnatomyMeasuringScale({
  stages,
  activeStageIndex,
  scrollProgress,
  onSelectStage,
  className = "",
}: AnatomyMeasuringScaleProps) {
  // Clamped progress (0 to 1)
  const p = Math.min(1, Math.max(0, scrollProgress));

  // Simulated anatomical penetration depth: 0.0 mm to 20.0 mm
  const currentDepthMm = (p * 20.0).toFixed(1);

  // Vertical track height in pixels
  const TRACK_HEIGHT = 380;
  const sliderY = p * TRACK_HEIGHT;

  // Millimeter markings for the ruler (0 to 20 mm in 2mm increments)
  const mmMarks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  return (
    <div
      className={`relative flex flex-col items-start select-none ${className}`}
      role="region"
      aria-label="Anatomical depth measuring scale"
    >
      {/* Top Instrument Header */}
      <div className="flex items-center gap-2 mb-4 text-[10px] font-mono tracking-[0.24em] text-slate-400 uppercase font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED] animate-pulse" />
        <span>ANATOMICAL DEPTH SCALE</span>
        <span className="text-slate-600 font-mono text-[9px]">[MM]</span>
      </div>

      <div className="flex items-start gap-6 lg:gap-8">
        {/* ================= VERNIER MEASURING SCALE RULER (SVG) ================= */}
        <div className="relative w-16 sm:w-20 shrink-0" style={{ height: `${TRACK_HEIGHT}px` }}>
          <svg
            viewBox={`0 0 76 ${TRACK_HEIGHT}`}
            className="w-full h-full drop-shadow-[0_0_20px_rgba(3,172,237,0.15)]"
          >
            {/* Ruler Base Beam */}
            <rect
              x="12"
              y="0"
              width="52"
              height={TRACK_HEIGHT}
              rx="6"
              fill="#080E24"
              stroke="#1B264A"
              strokeWidth="1.5"
            />

            {/* Inner Recessed Scale Track */}
            <rect
              x="16"
              y="4"
              width="44"
              height={TRACK_HEIGHT - 8}
              rx="4"
              fill="#050816"
              stroke="#0F172A"
              strokeWidth="1"
            />

            {/* Cyan Depth Fill Line */}
            <line
              x1="22"
              y1="8"
              x2="22"
              y2={Math.max(8, sliderY)}
              stroke="#03ACED"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-[y2] duration-75"
            />

            {/* Precision Ruler Ticks (Every 5px minor tick, every 19px major tick) */}
            {Array.from({ length: 41 }).map((_, i) => {
              const y = 8 + (i / 40) * (TRACK_HEIGHT - 16);
              const isMajor = i % 4 === 0;
              const isMedium = i % 2 === 0 && !isMajor;
              const tickWidth = isMajor ? 14 : isMedium ? 9 : 5;

              return (
                <g key={i}>
                  <line
                    x1="26"
                    y1={y}
                    x2={26 + tickWidth}
                    y2={y}
                    stroke={isMajor ? "#67D5EA" : isMedium ? "#475569" : "#334155"}
                    strokeWidth={isMajor ? 1.5 : 0.8}
                  />
                  {isMajor && (
                    <text
                      x="44"
                      y={y + 3}
                      className="fill-slate-400 font-mono text-[8px] font-semibold"
                    >
                      {mmMarks[i / 4]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 6 Stage Anchor Indicators on Ruler */}
            {stages.map((_, sIdx) => {
              const stageY = 8 + (sIdx / 5) * (TRACK_HEIGHT - 16);
              const isCurrent = activeStageIndex === sIdx;
              return (
                <circle
                  key={sIdx}
                  cx="12"
                  cy={stageY}
                  r={isCurrent ? 3.5 : 2}
                  fill={isCurrent ? "#03ACED" : "#334155"}
                  stroke={isCurrent ? "#FFFFFF" : "none"}
                  strokeWidth="0.8"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Sliding Vernier Caliper Carriage */}
            <g
              transform={`translate(0, ${Math.min(TRACK_HEIGHT - 20, Math.max(6, sliderY))})`}
              className="transition-transform duration-75 ease-out"
            >
              {/* Caliper Bracket Frame */}
              <rect
                x="4"
                y="-10"
                width="68"
                height="20"
                rx="4"
                fill="#0A1633"
                stroke="#03ACED"
                strokeWidth="1.8"
                filter="drop-shadow(0 0 8px rgba(3,172,237,0.45))"
              />
              {/* Pointer Indicator Triangle */}
              <polygon points="68,-5 74,0 68,5" fill="#03ACED" />
              {/* LED Center Jewel */}
              <circle cx="16" cy="0" r="3.5" fill="#03ACED" />
              <circle cx="16" cy="0" r="1.5" fill="#FFFFFF" />

              {/* Live Depth Digits */}
              <text
                x="44"
                y="3.5"
                textAnchor="middle"
                className="fill-[#67D5EA] font-mono text-[9px] font-bold"
              >
                {currentDepthMm}mm
              </text>
            </g>
          </svg>
        </div>

        {/* ================= LARGER STAGE MILESTONES ALONGSIDE SCALE ================= */}
        <div
          className="flex flex-col justify-between py-1"
          style={{ height: `${TRACK_HEIGHT}px` }}
        >
          {stages.map((stage, idx) => {
            const isActive = activeStageIndex === idx;
            const stageDepths = ["0.0 mm", "3.5 mm", "7.0 mm", "10.5 mm", "14.0 mm", "18.5 mm"];

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(idx)}
                className={`group flex items-center gap-3.5 text-left py-2 px-3.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#0A1633] text-white font-semibold ring-1 ring-[#03ACED] shadow-lg shadow-[#03ACED]/20 translate-x-1"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {/* Stage Number */}
                <span
                  className={`font-mono text-base font-bold transition-colors ${
                    isActive ? "text-[#03ACED]" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  {stage.number}
                </span>

                {/* Tactile Connector Bar */}
                <span
                  className={`h-[2px] transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-8 bg-[#03ACED] shadow-sm shadow-[#03ACED]"
                      : "w-3 bg-slate-700 group-hover:w-5 group-hover:bg-slate-500"
                  }`}
                />

                {/* Stage Details */}
                <div className="flex flex-col">
                  <span
                    className={`text-sm sm:text-base tracking-wide font-medium whitespace-nowrap ${
                      isActive ? "text-white font-bold" : "text-slate-300 group-hover:text-white"
                    }`}
                  >
                    {stage.navTitle}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                    Depth: {stageDepths[idx]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
