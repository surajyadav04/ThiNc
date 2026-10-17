"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, HeartHandshake, ArrowRight, Play, X, Sparkles } from "lucide-react";

export default function AboutSection() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section id="about" className="relative py-20 lg:py-28 bg-gradient-to-r from-[#F4F7FB] via-[#F8FAFC] to-[#EEF5FC] text-[#111827] overflow-hidden border-b border-[#DCE5EE]">

      {/* Ambient subtle light cyan bloom */}
      <div className="absolute right-[20%] top-1/4 w-[500px] h-[500px] bg-[#03ACED]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Eyebrow Row with Coral Springs Clinic Tag */}
        <div className="flex items-center justify-between pb-4 mb-2">
          {/* Left Eyebrow with Cyan Dot */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#1B1464] uppercase font-bold">
              ABOUT THE PRACTICE
            </span>
          </div>

          {/* Right Coral Springs Clinic Tag matching reference */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#64748B] uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#03ACED]" />
              <div className="w-8 h-[1px] bg-[#03ACED]/40" />
            </div>
            <div className="text-right leading-tight">
              <div>CORAL SPRINGS</div>
              <div>CLINIC</div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Column Copy + Right Column Visual Montage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left Column: Heading, Subheading, Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Headline matching reference */}
            <h2 className="font-serif-editorial text-5xl sm:text-6xl xl:text-7xl font-normal text-[#111827] tracking-tight leading-[1.05]">
              Dr. Purnell{" "}
              <span className="text-[#03ACED]">Traverso</span>
            </h2>

            {/* Subheading Credentials */}
            <div className="text-[11px] font-mono tracking-[0.22em] text-[#64748B] uppercase font-semibold">
              HAND AND WRIST SURGEON, CORAL SPRINGS, FLORIDA
            </div>

            {/* Paragraph 1 */}
            <p className="text-slate-700 text-base sm:text-[17px] leading-relaxed font-normal">
              Dr. Purnell Traverso is a hand and wrist surgeon practising in Coral Springs, Florida.
              The practice is built around evidence-based care, clear communication, and working directly with both patients and referring physicians.
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-700 text-base sm:text-[17px] leading-relaxed font-normal">
              Every patient visit is guided by helping individuals understand the root anatomy of their symptoms before discussing procedural interventions, ensuring you leave knowing more about your condition rather than feeling sold to.
            </p>

            {/* Key Highlights Row with divider */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-[#111827] font-medium">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#03ACED]/40 bg-white flex items-center justify-center text-[#03ACED]">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Coral Springs, Florida</span>
              </div>

              <div className="hidden sm:block w-[1px] h-6 bg-[#DCE5EE]" />

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#03ACED]/40 bg-white flex items-center justify-center text-[#03ACED]">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span>Patient-First Consultation</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-6 pt-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 bg-[#03ACED] hover:bg-[#0284C7] text-[#0A0D24] font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-[#03ACED]/25 transition-all focus:outline-none focus:ring-2 focus:ring-[#03ACED]"
              >
                <span>Request a consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="flex items-center gap-3 group text-left focus:outline-none"
              >
                <div className="w-11 h-11 rounded-full bg-white border border-slate-300 group-hover:border-[#03ACED] flex items-center justify-center text-[#111827] group-hover:text-[#03ACED] shadow-sm transition-all">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="flex flex-col text-xs leading-tight font-medium text-[#111827] group-hover:text-[#03ACED] transition-colors">
                  <span>Learn more</span>
                  <span>about the practice</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Multi-Layered Visual Montage matching reference */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            <div className="relative w-full aspect-[16/11] max-w-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/80">
              <Image
                src="/images/about-surgeon-montage.png"
                alt="Dr. Purnell Traverso performing surgical procedure alongside modern Coral Springs clinic lobby and anatomical visual"
                fill
                priority
                className="object-cover object-center select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Brand Mantra Bar matching reference */}
        <div className="mt-14 pt-6 border-t border-[#DCE5EE] flex items-center gap-3 text-xs font-mono text-[#64748B] tracking-[0.16em] uppercase">
          <div className="w-1 h-4 bg-[#03ACED]" />
          <span>EVIDENCE-BASED CARE &nbsp; / &nbsp; CLEAR COMMUNICATION &nbsp; / &nbsp; PATIENT-FOCUSED APPROACH</span>
        </div>
      </div>

      {/* Video / Practice Overview Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0D24]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#DCE5EE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5EE]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
                <h3 className="font-semibold text-lg text-[#111827]">About Dr. Purnell Traverso</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Dr. Purnell Traverso provides specialized surgical and conservative management for hand, wrist, and peripheral nerve conditions in Coral Springs, Florida.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div><strong>Specialty Focus:</strong> Hand, wrist, and peripheral nerve surgery.</div>
              <div><strong>Practice Philosophy:</strong> Thorough anatomical explanation, conservative therapy first, precision procedural intervention when indicated.</div>
              <div><strong>Location:</strong> Coral Springs, Florida.</div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2.5 bg-[#0A0D24] text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
