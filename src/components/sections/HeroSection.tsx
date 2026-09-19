"use client";

import React from "react";
import { BookOpen, ArrowRight, Sparkles, Feather } from "lucide-react";
import { OpenBookPreview } from "../journal/OpenBookPreview";

export function HeroSection() {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Gentle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#E8DAC2]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] border border-[#DDD0BC] text-[#6B5746] text-xs font-medium tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
            <span>The tactile beauty of paper, in your browser</span>
          </div>
        </div>

        {/* Hero Title & Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#261A13] tracking-tight leading-[1.15] font-normal mb-6">
            Your thoughts, <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#6E4226]">written like you.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#5F4F42] leading-relaxed max-w-2xl mx-auto font-sans font-light">
            A digital diary that turns your keyboard into a handwritten journal. Experience the calming pace of pen on paper, without the mess or lost notebooks.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#32231A] text-[#FAF6ED] text-base font-medium hover:bg-[#453125] shadow-lg hover:shadow-xl transition-all active:scale-95 border border-[#4C3628]"
            >
              <Feather className="w-4 h-4 text-[#D8B97C]" />
              <span>Start Writing</span>
              <ArrowRight className="w-4 h-4 text-[#A89482] ml-1" />
            </a>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#EFE6D6]/80 text-[#4E3E33] text-base font-medium hover:bg-[#E5DAC4] border border-[#D5C6AF] transition-all"
            >
              <span>See How It Works</span>
            </a>
          </div>
        </div>

        {/* Hero Visual: Open Diary Preview */}
        <div className="mt-12 md:mt-16">
          <OpenBookPreview interactive={true} />
        </div>
      </div>
    </section>
  );
}
