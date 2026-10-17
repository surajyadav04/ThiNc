"use client";

import React, { useState } from "react";
import { ConditionInfo } from "@/types/anatomy";
import { CONDITIONS_DATA } from "@/data/anatomyData";
import { ChevronRight, Info, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

interface ConditionDetailModalProps {
  condition?: ConditionInfo;
  onClose?: () => void;
}

export default function ConditionDetailSection({
  condition = CONDITIONS_DATA[0],
}: ConditionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "symptoms" | "causes" | "treatment" | "faqs">("overview");

  return (
    <section className="py-20 bg-white text-[#111827] border-b border-[#DCE5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching storyboard panel 05 */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">
          <a href="#conditions" className="hover:text-[#03ACED]">Conditions</a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#111827] font-semibold">{condition.title}</span>
        </nav>

        {/* Condition Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] text-xs font-mono text-[#1B1464] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
              {condition.category}
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#111827] tracking-tight leading-tight">
              {condition.title}
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed">
              {condition.shortDescription}
            </p>
          </div>

          {/* Pending Surgeon Review Card matching reference */}
          <div className="lg:col-span-5 bg-[#F7F9FC] border border-[#DCE5EE] rounded-2xl p-5 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-[#03ACED] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-[#111827] block mb-1">Content Pending Surgeon Review</span>
              All clinical content is reviewed by Dr. Purnell Traverso before publication. Educational descriptions serve as proposed draft summaries.
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="border-b border-[#DCE5EE] mb-8">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto" role="tablist">
            {(["overview", "symptoms", "causes", "treatment", "faqs"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 text-sm sm:text-base font-medium capitalize border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-[#03ACED] text-[#1B1464] font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#F7F9FC] rounded-2xl border border-[#DCE5EE] p-6 sm:p-8">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B1464] font-semibold">
                  Condition Overview (Proposal Draft)
                </h3>
                <p className="text-slate-700 text-base leading-relaxed">
                  {condition.overview}
                </p>
                <div className="p-4 rounded-xl bg-white border border-[#DCE5EE] text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-[#111827] block">Surgical Practice Philosophy:</span>
                  Initial management emphasizes conservative and non-operative measures where appropriate, reserving procedural decompression for progressive or refractory symptoms.
                </div>
              </div>
            )}

            {activeTab === "symptoms" && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B1464] font-semibold">
                  Typical Clinical Presentation
                </h3>
                <ul className="space-y-3">
                  {condition.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#03ACED] shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "causes" && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B1464] font-semibold">
                  Contributing Factors & Etiology
                </h3>
                <ul className="space-y-3">
                  {condition.causes.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#1B1464] mt-2 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "treatment" && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B1464] font-semibold">
                  Management Pathways
                </h3>
                <div className="space-y-3">
                  {condition.treatment.map((t, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#DCE5EE] text-sm text-slate-700">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#1B1464] font-semibold">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {condition.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl border border-[#DCE5EE] space-y-1.5">
                      <span className="font-semibold text-sm text-[#111827] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#03ACED] shrink-0" />
                        {faq.question}
                      </span>
                      <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Anatomical Cutaway Illustration */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0A0D24] to-[#1B1464] rounded-2xl p-6 text-white border border-[#1B1464] relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-xl">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-mono uppercase text-[#67D5EA]">Anatomical Focus</span>
              <span className="text-[11px] bg-[#03ACED]/20 text-[#67D5EA] border border-[#03ACED]/40 px-2 py-0.5 rounded">
                Median Nerve Canal
              </span>
            </div>

            {/* Stylized wrist cutaway SVG graphic */}
            <div className="my-6 relative flex items-center justify-center">
              <svg viewBox="0 0 240 180" className="w-full max-w-[240px] text-slate-400" fill="none">
                {/* Carpal arch */}
                <ellipse cx="120" cy="90" rx="90" ry="50" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                {/* Transverse Carpal Ligament */}
                <path d="M50 80 Q120 105 190 80" stroke="#67D5EA" strokeWidth="4" />
                {/* Flexor tendons (clusters of circles) */}
                <circle cx="85" cy="100" r="10" fill="#38BDF8" opacity="0.6" />
                <circle cx="110" cy="115" r="10" fill="#38BDF8" opacity="0.6" />
                <circle cx="135" cy="115" r="10" fill="#38BDF8" opacity="0.6" />
                <circle cx="155" cy="100" r="10" fill="#38BDF8" opacity="0.6" />
                {/* Median Nerve (Glowing yellow/cyan highlighted directly beneath ligament) */}
                <circle cx="120" cy="82" r="12" fill="#03ACED" />
                <circle cx="120" cy="82" r="16" stroke="#CFF6FB" strokeWidth="2" opacity="0.7" />
              </svg>

              {/* Pin 1: Median nerve */}
              <div className="absolute top-2 left-6 bg-[#0A0D24]/90 border border-[#03ACED] px-2.5 py-1 rounded text-[11px] text-white">
                <span>Median nerve</span>
              </div>
              {/* Pin 2: Carpal tunnel */}
              <div className="absolute bottom-2 right-6 bg-[#0A0D24]/90 border border-slate-700 px-2.5 py-1 rounded text-[11px] text-slate-300">
                <span>Carpal tunnel</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-3 z-10 flex items-center justify-between">
              <span>Surgical Decompression Pathway</span>
              <a href="#contact" className="text-[#03ACED] hover:underline font-medium">
                Consultation Details →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
