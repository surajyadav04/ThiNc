"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import ThincLogo from "../common/ThincLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0A0D24] text-white border-t border-[#1B1464] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Practice Identity */}
          <div className="md:col-span-5 space-y-4">
            <ThincLogo theme="dark" />

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Dr. Purnell Traverso, hand and wrist surgeon practising in Coral Springs, Florida.
              Committed to patient understanding, clinical precision, and collaborative specialist care.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#67D5EA]">
              <ShieldCheck className="w-4 h-4 text-[#03ACED]" />
              <span>WCAG 2.2 AA Accessibility Standards</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#67D5EA]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#symptoms" className="hover:text-white transition-colors">Symptom Explorer</a></li>
              <li><a href="#anatomy" className="hover:text-white transition-colors">Wrist Anatomy</a></li>
              <li><a href="#conditions" className="hover:text-white transition-colors">Common Conditions</a></li>
              <li><a href="#physicians" className="hover:text-white transition-colors">For Referring Physicians</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Dr. Traverso</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Office</a></li>
            </ul>
          </div>

          {/* Practice Hours & Location */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#67D5EA]">
              Practice Location
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dr. Purnell Traverso MD<br />
              Hand and Wrist Surgery Practice<br />
              Coral Springs, Florida
            </p>
            <div className="text-xs text-slate-500 font-mono pt-2">
              Website replacement preview for traversohand.com
            </div>
          </div>
        </div>

        {/* Legal, Disclaimer and Regulatory Disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-3xl leading-relaxed">
            Educational Disclaimer: All anatomical and clinical descriptions on this website represent proposed drafts awaiting formal surgeon review. This content is provided solely for general educational purposes and does not establish a physician-patient relationship or constitute medical diagnosis.
          </p>
          <div className="font-mono text-[11px] whitespace-nowrap">
            (c) 2026 THiNC / Traverso Hand.
          </div>
        </div>
      </div>
    </footer>
  );
}
