"use client";

import React from "react";

interface StageItem {
  id: string;
  number: string;
  navTitle: string;
  rangeStart: number;
  rangeEnd: number;
}

interface AnatomyScrollDialProps {
  stages: StageItem[];
  activeStageIndex: number;
  scrollProgress: number; // 0 to 1
  onSelectStage: (index: number) => void;
  className?: string;
}

export default function AnatomyScrollDial({
  stages,
  activeStageIndex,
  scrollProgress,
  onSelectStage,
  className = "",
}: AnatomyScrollDialProps) {
  // Needle rotation angle: maps 0..1 to -65 deg .. +65 deg
  const needleAngle = -65 + Math.min(1, Math.max(0, scrollProgress)) * 130;

  // Calibrated depth simulation: 0.0mm (surface) to 18.5mm (intercarpal core)
  const simulatedDepthMm = (scrollProgress * 18.5).toFixed(1);

  return (
    <div
      className={`relative flex flex-col items-start select-none ${className}`}
      role="region"
      aria-label="Anatomical depth scroll dial"
    >
      {/* Top Instrument Label */}
      <div className="flex items-center gap-2 mb-3 text-[10px] font-mono tracking-[0.24em] text-slate-400 uppercase font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED] animate-pulse" />
        <span>ANATOMICAL DEPTH DIAL</span>
      </div>

      <div className="flex items-center gap-6">
        {/* ================= PHYSICAL DIAL GAUGE (SVG INSTRUMENT) ================= */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(3,172,237,0.18)]"
          >
            {/* Outer Bezel Rim */}
            <circle
              cx="80"
              cy="80"
              r="76"
              fill="#080E24"
              stroke="#1B264A"
              strokeWidth="2.5"
            />
            {/* Subtle Knurled Outer Ring */}
            <circle
              cx="80"
              cy="80"
              r="73"
              fill="none"
              stroke="#03ACED"
              strokeWidth="0.8"
              strokeOpacity="0.3"
              strokeDasharray="2 3"
            />
            {/* Inner Dial Face */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="#060919"
              stroke="#0F172A"
              strokeWidth="1.5"
            />

            {/* Calibrated Arc Track (-65 deg to +65 deg, center at 80,80) */}
            {/* 130 degree arc from angle 155 to angle 25 (clockwise through top) */}
            <path
              d="M 28 108 A 60 60 0 1 1 132 108"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Active Glow Progress Arc */}
            <path
              d="M 28 108 A 60 60 0 1 1 132 108"
              fill="none"
              stroke="#03ACED"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="220"
              strokeDashoffset={220 - scrollProgress * 220}
              className="transition-[stroke-dashoffset] duration-150"
            />

            {/* Radial Vernier Ticks */}
            {Array.from({ length: 25 }).map((_, i) => {
              const angleDeg = -65 + (i / 24) * 130 - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const isMajor = i % 4 === 0;
              const rInner = isMajor ? 52 : 56;
              const rOuter = 62;
              const x1 = 80 + rInner * Math.cos(angleRad);
              const y1 = 80 + rInner * Math.sin(angleRad);
              const x2 = 80 + rOuter * Math.cos(angleRad);
              const y2 = 80 + rOuter * Math.sin(angleRad);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? "#67D5EA" : "#334155"}
                  strokeWidth={isMajor ? 1.5 : 0.8}
                />
              );
            })}

            {/* 6 Stage Anchor Dots along the calibrated arc */}
            {stages.map((_, sIdx) => {
              const angleDeg = -65 + (sIdx / 5) * 130 - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const cx = 80 + 60 * Math.cos(angleRad);
              const cy = 80 + 60 * Math.sin(angleRad);
              const isPastOrCurrent = sIdx <= activeStageIndex;

              return (
                <circle
                  key={sIdx}
                  cx={cx}
                  cy={cy}
                  r={activeStageIndex === sIdx ? 3.5 : 2}
                  fill={activeStageIndex === sIdx ? "#03ACED" : isPastOrCurrent ? "#67D5EA" : "#334155"}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Dynamic Rotating Needle */}
            <g
              transform={`rotate(${needleAngle} 80 80)`}
              className="transition-transform duration-100 ease-out"
            >
              {/* Pointer Needle Body */}
              <polygon
                points="78,80 82,80 80.5,24 79.5,24"
                fill="#03ACED"
                filter="drop-shadow(0 0 6px #03ACED)"
              />
              {/* Needle Counterweight */}
              <line
                x1="80"
                y1="80"
                x2="80"
                y2="94"
                stroke="#03ACED"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
            </g>

            {/* Central Dial Pivot Cap */}
            <circle cx="80" cy="80" r="14" fill="#0A122A" stroke="#03ACED" strokeWidth="1.8" />
            <circle cx="80" cy="80" r="7" fill="#03ACED" />
            <circle cx="80" cy="80" r="3" fill="#FFFFFF" />

            {/* Live Calibrated Millimeter Depth Readout */}
            <text
              x="80"
              y="126"
              textAnchor="middle"
              className="fill-slate-400 font-mono text-[9px] uppercase tracking-wider"
            >
              DEPTH
            </text>
            <text
              x="80"
              y="140"
              textAnchor="middle"
              className="fill-[#67D5EA] font-mono text-[12px] font-bold tracking-tight"
            >
              {simulatedDepthMm} mm
            </text>
          </svg>
        </div>

        {/* ================= LARGER, INTERACTIVE STAGE BUTTONS ================= */}
        <div className="flex flex-col space-y-2">
          {stages.map((stage, idx) => {
            const isActive = activeStageIndex === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(idx)}
                className={`group flex items-center gap-3.5 text-left py-1.5 px-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#0A1633] text-white font-semibold ring-1 ring-[#03ACED] shadow-lg shadow-[#03ACED]/15"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {/* Large Stage Number */}
                <span
                  className={`font-mono text-sm sm:text-base font-bold transition-colors ${
                    isActive ? "text-[#03ACED]" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  {stage.number}
                </span>

                {/* Tactile Line Indicator */}
                <span
                  className={`h-[2px] transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-8 bg-[#03ACED] shadow-sm shadow-[#03ACED]"
                      : "w-3 bg-slate-700 group-hover:w-5 group-hover:bg-slate-500"
                  }`}
                />

                {/* Stage Name */}
                <div className="flex flex-col">
                  <span
                    className={`text-sm sm:text-base tracking-wide font-medium whitespace-nowrap ${
                      isActive ? "text-white font-bold" : "text-slate-300 group-hover:text-white"
                    }`}
                  >
                    {stage.navTitle}
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
