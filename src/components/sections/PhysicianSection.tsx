"use client";

import React, { useState } from "react";
import { ArrowRight, ClipboardCheck, PhoneCall, Stethoscope, Share2, FileText, CheckCircle2, X } from "lucide-react";

export default function PhysicianSection() {
  const [showReferralModal, setShowReferralModal] = useState(false);

  const pillars = [
    {
      icon: Stethoscope,
      title: "Conditions treated",
      description: "Comprehensive care for elective compression neuropathies, complex wrist ligament instability, post-traumatic reconstruction, and arthritis.",
    },
    {
      icon: ClipboardCheck,
      title: "Referral process",
      description: "Streamlined referral documentation without administrative bottlenecks. Rapid intake scheduling for acute fractures and tendon injuries.",
    },
    {
      icon: Share2,
      title: "Clinical approach",
      description: "Evidence-based, conservative therapy first whenever viable, supported by timely clinical correspondence following all consultations.",
    },
    {
      icon: PhoneCall,
      title: "Direct clinical line",
      description: "Direct physician-to-physician communication channels for urgent inquiries, diagnostic consultations, and post-operative progress reviews.",
    },
  ];

  return (
    <section id="physicians" className="py-24 bg-[#F7F9FC] text-[#111827] border-b border-[#DCE5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Referral Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1B1464] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
              <span>For Physicians</span>
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#111827] tracking-tight leading-[1.08]">
              Expertise and <br />
              <span className="text-[#1B1464] italic">Collaboration</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed">
              Information for referring physicians and professional partners, including referral process, conditions treated and collaborative care.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setShowReferralModal(true)}
                className="inline-flex items-center gap-2 bg-[#03ACED] hover:bg-[#0284C7] text-[#0A0D24] font-semibold text-sm px-6 py-3.5 rounded-full shadow-md shadow-[#03ACED]/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#03ACED]"
              >
                <span>Refer a patient</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-[#DCE5EE] text-[#111827] text-sm font-medium px-5 py-3.5 rounded-full transition-colors"
              >
                <span>Clinical Liaison Office</span>
              </a>
            </div>

            {/* Referral Info Box */}
            <div className="p-4 rounded-xl bg-white border border-[#DCE5EE] text-xs text-slate-600 leading-relaxed space-y-1">
              <span className="font-semibold text-[#111827] block">Referral Turnaround Commitment:</span>
              Routine consultations offered within 5 to 7 business days; urgent trauma and acute neurovascular conditions accommodated same-day or next-day.
            </div>
          </div>

          {/* Right Column: Surgical & Clinical Cards Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-6 bg-white rounded-2xl border border-[#DCE5EE] shadow-sm hover:border-[#03ACED] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] text-[#1B1464] flex items-center justify-center mb-4">
                        <IconComponent className="w-5 h-5 text-[#03ACED]" />
                      </div>
                      <h3 className="font-semibold text-base text-[#111827] mb-2">{pillar.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal for Refer a Patient */}
        {showReferralModal && (
          <div className="fixed inset-0 z-50 bg-[#0A0D24]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#DCE5EE] shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE5EE]">
                <h3 className="font-semibold text-lg text-[#111827]">Physician Referral Information</h3>
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-mono"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  To refer a patient to Dr. Purnell Traverso in Coral Springs, FL:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
                  <div><strong>Phone:</strong> (954) Practice Phone (Placeholder)</div>
                  <div><strong>Secure Fax:</strong> (954) Clinical Fax (Placeholder)</div>
                  <div><strong>Practice Location:</strong> Coral Springs, Florida</div>
                </div>
                <p className="text-xs text-slate-500">
                  Please attach recent clinic notes, relevant radiographic imaging reports (X-ray, MRI, CT), and electrodiagnostic (EMG/NCS) studies if available.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-5 py-2.5 bg-[#0A0D24] text-white rounded-lg text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
