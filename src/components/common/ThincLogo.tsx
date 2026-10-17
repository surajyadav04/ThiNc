"use client";

import React from "react";
import Image from "next/image";

interface ThincLogoProps {
  theme?: "light" | "dark";
  variant?: "badge" | "transparent";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ThincLogo({
  theme = "light",
  variant = "badge",
  className = "",
  size = "md",
}: ThincLogoProps) {
  // Determine pixel height based on size
  const heightPx = size === "sm" ? 34 : size === "lg" ? 54 : 44;
  const widthPx = Math.round(heightPx * (733 / 236));

  // If theme is dark, transparent variant blends directly with dark background
  const imgSrc = variant === "transparent" || theme === "dark"
    ? "/images/thinc-logo-transparent.png"
    : "/images/thinc-logo-badge.png";

  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      {/* Exact official logo image provided by the user */}
      <Image
        src={imgSrc}
        alt="THiNC Traverso Hand Logo"
        width={widthPx}
        height={heightPx}
        priority
        className="h-10 sm:h-11 w-auto object-contain rounded-lg shadow-sm"
      />
    </div>
  );
}
