import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THiNC | Traverso Hand and Wrist Surgery | Coral Springs, Florida",
  description: "Dr. Purnell Traverso, hand and wrist specialist in Coral Springs, FL. Interactive patient-centered anatomy, symptom exploration, and clinical care.",
};

import SmoothScroll from "@/components/providers/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#111827]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
