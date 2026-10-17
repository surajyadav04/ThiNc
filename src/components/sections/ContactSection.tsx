"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Shield,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  MessageSquare,
  Stethoscope,
  Scan,
  ClipboardCheck,
  Activity,
  Heart,
  Leaf,
  Scissors,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ChevronDown,
  Sun,
  CloudSun,
  CalendarClock,
  Sparkles,
} from "lucide-react";

type ConsultationType = "new-patient" | "follow-up" | "second-opinion" | "physician-referral";
type PreferredTime = "morning" | "afternoon" | "flexible";
type ContactMethod = "phone" | "text" | "email";

export default function ContactSection() {
  const [consultationType, setConsultationType] = useState<ConsultationType>("new-patient");
  const [preferredTime, setPreferredTime] = useState<PreferredTime>("morning");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-28 bg-[#0A0E1A] text-white overflow-hidden border-t border-cyan-950/40"
    >
      {/* Cinematic subtle background grid & radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-gradient-to-b from-[#03ACED]/10 via-[#1B1464]/20 to-transparent blur-3xl rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #03ACED 1px, transparent 1px), linear-gradient(to bottom, #03ACED 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Top Floating Editorial Script Annotation */}
        <div className="hidden lg:flex justify-end items-center mb-2 pr-6">
          <div className="flex items-center gap-2 text-cyan-300/80 font-serif italic text-base">
            <span>Specialized care for every hand</span>
            <span className="text-xl -rotate-12 translate-y-1 text-cyan-400">⤷</span>
          </div>
        </div>

        {/* 2-Column Grid: Left Practice Information | Right Interactive Request Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* ================= LEFT COLUMN (lg:col-span-7) ================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header Area */}
            <div className="relative">
              {/* Headline & Description */}
              <div className="max-w-xl relative z-10">
                <div className="text-[11px] font-mono tracking-[0.22em] text-[#03ACED] uppercase font-bold mb-3">
                  APPOINTMENTS & ENQUIRIES
                </div>

                <h2 className="font-serif-editorial text-5xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.05] mb-5">
                  Book a <br />
                  <span className="text-[#03ACED]">Consultation</span>
                </h2>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                  Get expert evaluation and personalized treatment for hand, wrist, and upper limb conditions.
                  We are here to help you move, work and live without pain.
                </p>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
                      <Calendar className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight">Expert Evaluation</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-snug">Specialized in hand and upper limb care</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
                      <Shield className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight">Personalized Plan</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-snug">Evidence-based treatment options</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
                      <Users className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight">Ongoing Support</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-snug">From diagnosis to full recovery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Office Card matching Mockup */}
            <div className="bg-[#0F172A]/90 rounded-2xl border border-cyan-900/40 p-4 sm:p-5 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Office Photo */}
                <div className="sm:col-span-5 relative w-full aspect-[16/10] sm:aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-cyan-900/30">
                  <Image
                    src="/images/clinic-lobby-reception.jpg"
                    alt="Coral Springs Hand & Orthopedic Clinic reception desk and modern lobby"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Office Details */}
                <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif-editorial text-2xl font-normal text-white mb-2">
                      Our Office
                    </h3>
                    <div className="flex items-start gap-2.5 text-xs text-slate-300 mb-3">
                      <MapPin className="w-4 h-4 text-[#03ACED] shrink-0 mt-0.5" />
                      <span>1234 Medical Center Drive, Coral Springs, FL 33065</span>
                    </div>

                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#03ACED] px-3.5 py-1.5 rounded-full border border-cyan-500/30 hover:border-[#03ACED] bg-slate-900/60 transition-colors"
                    >
                      <span>Get Directions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#03ACED] shrink-0" />
                      <div>
                        <span className="font-semibold text-white">(954) 555-0123</span>
                        <span className="text-slate-400 block text-[11px]">Call our office</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#03ACED] shrink-0" />
                      <div>
                        <span className="font-semibold text-white">contact@traversohand.com</span>
                        <span className="text-slate-400 block text-[11px]">We typically respond within 1 business day</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#03ACED] shrink-0" />
                      <div>
                        <span className="font-semibold text-white">Mon - Fri: 8:30 AM - 5:00 PM</span>
                        <span className="text-slate-400 block text-[11px]">Closed on weekends</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect at Your Visit (STEP BY STEP) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-white">
                  What to expect at your visit
                </h3>
                <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
                  STEP BY STEP
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* 01 Consultation */}
                <div className="bg-[#0F172A]/80 rounded-xl border border-cyan-900/40 p-3.5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                        01
                      </span>
                      <MessageSquare className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div className="font-semibold text-xs text-white mb-1">Consultation</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Detailed discussion of your symptoms and medical history.
                    </p>
                  </div>
                </div>

                {/* 02 Examination */}
                <div className="bg-[#0F172A]/80 rounded-xl border border-cyan-900/40 p-3.5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                        02
                      </span>
                      <Stethoscope className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div className="font-semibold text-xs text-white mb-1">Examination</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Physical evaluation of hand, wrist, and upper limb function.
                    </p>
                  </div>
                </div>

                {/* 03 Imaging */}
                <div className="bg-[#0F172A]/80 rounded-xl border border-cyan-900/40 p-3.5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                        03
                      </span>
                      <Scan className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div className="font-semibold text-xs text-white mb-1">Imaging (if needed)</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      X-ray, MRI, or electrodiagnostic testing.
                    </p>
                  </div>
                </div>

                {/* 04 Personalized Plan */}
                <div className="bg-[#0F172A]/80 rounded-xl border border-cyan-900/40 p-3.5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                        04
                      </span>
                      <ClipboardCheck className="w-4 h-4 text-[#03ACED]" />
                    </div>
                    <div className="font-semibold text-xs text-white mb-1">Personalized Plan</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Clear treatment options tailored to your condition and lifestyle.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Treatment Approach Dark Navy Banner */}
            <div className="bg-[#0A1628] rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#03ACED] shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif-editorial text-xl font-normal text-white">
                      Our treatment approach
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-lg mt-0.5">
                      We create individualized treatment plans based on your condition, goals, and daily activities from non-surgical care to advanced surgical options.
                    </p>
                  </div>
                </div>

                <a
                  href="#wrist-explorer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-[#03ACED] hover:text-white transition-colors shrink-0"
                >
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 4 Approach Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-800/80">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Leaf className="w-3.5 h-3.5 text-[#03ACED]" />
                    <span>Non-Surgical Care</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Bracing, therapy, medication, activity modification
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Scissors className="w-3.5 h-3.5 text-[#03ACED]" />
                    <span>Minimally Invasive</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Advanced techniques for faster recovery
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <LinkIcon className="w-3.5 h-3.5 text-[#03ACED]" />
                    <span>Surgical Options</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    When needed, for long-term function and pain relief
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Heart className="w-3.5 h-3.5 text-[#03ACED]" />
                    <span>Rehabilitation</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Guidance through recovery and return to activity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (lg:col-span-5): Form Card ================= */}
          <div className="lg:col-span-5">
            <div className="bg-[#0F172A]/90 rounded-3xl p-6 sm:p-8 border border-cyan-900/40 shadow-2xl space-y-6">
              {/* Card Header with Stepper */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest text-[#03ACED] uppercase font-bold">
                    REQUEST AN APPOINTMENT
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    STEP 1 OF 3
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#03ACED]" />
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* Title & Prompt */}
              <div>
                <h3 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-white tracking-tight leading-tight mb-1">
                  Let&apos;s get started
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Please share a few details and we will get back to you to confirm your appointment.
                </p>
              </div>

              {isSubmitted ? (
                /* Submission Confirmation State */
                <div className="p-6 rounded-2xl bg-[#090D1A] border border-cyan-500/40 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#03ACED] text-[#0A0E1A] flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif-editorial text-2xl text-white mb-1">
                      Request Received
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                      Thank you, <span className="font-semibold text-cyan-400">{fullName || "Patient"}</span>.
                      Our intake coordinator will contact you by {contactMethod} within 1 business day to finalize your consultation time.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-cyan-900/40 text-left text-xs space-y-1 font-mono text-slate-300">
                    <div><strong>Type:</strong> {consultationType.replace("-", " ").toUpperCase()}</div>
                    <div><strong>Preferred Window:</strong> {preferredTime.toUpperCase()}</div>
                    {additionalNotes && <div><strong>Notes:</strong> {additionalNotes}</div>}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName("");
                      setPhoneNumber("");
                      setEmailAddress("");
                      setAdditionalNotes("");
                    }}
                    className="text-xs font-semibold text-[#03ACED] hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                /* Active Interactive Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Field 1: Consultation Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Consultation type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          id: "new-patient",
                          title: "New Patient",
                          desc: "Hand, wrist, or finger symptoms",
                          icon: Calendar,
                        },
                        {
                          id: "follow-up",
                          title: "Follow-up Visit",
                          desc: "Existing patient",
                          icon: Shield,
                        },
                        {
                          id: "second-opinion",
                          title: "Second Opinion",
                          desc: "Surgical or imaging review",
                          icon: Stethoscope,
                        },
                        {
                          id: "physician-referral",
                          title: "Physician Referral",
                          desc: "Referred by a clinician",
                          icon: Users,
                        },
                      ].map((type) => {
                        const Icon = type.icon;
                        const isSelected = consultationType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setConsultationType(type.id as ConsultationType)}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                              isSelected
                                ? "bg-cyan-950/60 border-[#03ACED] ring-1 ring-[#03ACED]"
                                : "bg-[#090D1A]/80 border-cyan-950/60 hover:border-cyan-800/60 hover:bg-[#0E1528]"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-[#03ACED] text-[#0A0E1A]"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              {isSelected && (
                                <ArrowRight className="w-3.5 h-3.5 text-[#03ACED]" />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white leading-tight">
                                {type.title}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                {type.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 2: Preferred Date & Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Preferred date & time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: "morning",
                          title: "Morning",
                          sub: "8:30 AM - 12:00 PM",
                          icon: Sun,
                        },
                        {
                          id: "afternoon",
                          title: "Afternoon",
                          sub: "1:00 PM - 4:30 PM",
                          icon: CloudSun,
                        },
                        {
                          id: "flexible",
                          title: "Any Available Time",
                          sub: "I am flexible",
                          icon: CalendarClock,
                        },
                      ].map((time) => {
                        const Icon = time.icon;
                        const isSelected = preferredTime === time.id;
                        return (
                          <button
                            key={time.id}
                            type="button"
                            onClick={() => setPreferredTime(time.id as PreferredTime)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "bg-cyan-950/60 border-[#03ACED] ring-1 ring-[#03ACED]"
                                : "bg-[#090D1A]/80 border-cyan-950/60 hover:border-cyan-800/60"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 mx-auto mb-1 ${
                                isSelected ? "text-[#03ACED]" : "text-slate-400"
                              }`}
                            />
                            <div className="text-xs font-bold text-white leading-tight">
                              {time.title}
                            </div>
                            <div className="text-[9px] text-slate-400 leading-tight mt-0.5">
                              {time.sub}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 3: Your Details (Name & Phone) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Your details
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Full name</span>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3 py-2 rounded-xl border border-cyan-950/70 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#03ACED] focus:border-transparent bg-[#090D1A]"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Phone number</span>
                        <div className="flex">
                          <div className="flex items-center gap-1 px-2.5 bg-slate-900 border border-r-0 border-cyan-950/70 rounded-l-xl text-xs text-slate-400 font-mono">
                            <span>+1</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Your phone number"
                            className="w-full px-3 py-2 rounded-r-xl border border-cyan-950/70 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#03ACED] focus:border-transparent bg-[#090D1A] font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Email address</span>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 rounded-xl border border-cyan-950/70 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#03ACED] focus:border-transparent bg-[#090D1A] font-mono"
                      />
                    </div>
                  </div>

                  {/* Field 4: Additional Information (Optional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Additional information (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Tell us about your symptoms, affected hand, duration, or any specific concerns..."
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/70 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#03ACED] focus:border-transparent bg-[#090D1A] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Field 5: Preferred Contact Method */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-200 block">
                      Preferred contact method
                    </span>
                    <div className="flex items-center gap-5 text-xs text-slate-300">
                      {[
                        { id: "phone", label: "Phone call" },
                        { id: "text", label: "Text message" },
                        { id: "email", label: "Email" },
                      ].map((m) => (
                        <label
                          key={m.id}
                          className="flex items-center gap-1.5 cursor-pointer hover:text-white"
                        >
                          <input
                            type="radio"
                            name="contactMethod"
                            checked={contactMethod === m.id}
                            onChange={() => setContactMethod(m.id as ContactMethod)}
                            className="w-3.5 h-3.5 text-[#03ACED] focus:ring-[#03ACED]"
                          />
                          <span>{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#03ACED] hover:bg-[#0284C7] text-[#0A0E1A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all group focus:outline-none focus:ring-2 focus:ring-[#03ACED] cursor-pointer"
                  >
                    <span>Request Appointment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Privacy & Compliance Disclaimer */}
                  <div className="pt-2 flex items-start gap-2.5 text-[10px] text-slate-400 leading-tight">
                    <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <p>
                      Your information is secure and will only be used for scheduling and general enquiries.
                      Please do not submit medical records, diagnostic images, or sensitive health information.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
