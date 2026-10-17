"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Menu, X } from "lucide-react";
import ThincLogo from "../common/ThincLogo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "Conditions", href: "#conditions-grid" },
    { label: "Anatomy", href: "#anatomy-journey" },
    { label: "For Patients", href: "#symptom-explorer" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="absolute top-0 inset-x-0 z-50 bg-transparent text-[#111827] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo matching reference */}
        <Link
          href="/"
          className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#03ACED] rounded-lg p-1"
          aria-label="THiNC Traverso Hand Home"
        >
          <ThincLogo theme="light" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-800 hover:text-[#03ACED] transition-colors focus:outline-none focus:ring-1 focus:ring-[#03ACED] rounded px-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions: Contact pill + Search circle */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#03ACED] hover:bg-[#0284C7] text-[#080D24] font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#03ACED]"
          >
            <span>Contact</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 rounded-full border border-slate-300/80 hover:border-[#03ACED] bg-white/70 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-[#03ACED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#03ACED]"
            aria-label="Search conditions and anatomy"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#03ACED] rounded-lg"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Quick Search Dropdown */}
      {searchOpen && (
        <div className="border-t border-[#DCE5EE] bg-white px-4 py-3 shadow-lg">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search symptoms, anatomy, or conditions (e.g. Carpal Tunnel, Thumb arthritis)..."
              className="w-full text-sm py-2 bg-transparent focus:outline-none text-slate-800"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DCE5EE] px-4 pt-4 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100 hover:text-[#03ACED] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#03ACED] text-[#080D24] font-semibold py-3 rounded-full text-center"
            >
              <span>Contact the Practice</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
