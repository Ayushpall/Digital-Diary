"use client";

import React from "react";
import { BookOpen, Feather, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-24 md:py-32 bg-[#2D1F16] text-[#FAF5EC] relative overflow-hidden">
      {/* Subtle radial warmth glow behind the text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#613C22]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#463224] text-[#D8B97C] text-xs font-mono uppercase tracking-widest mb-6 border border-[#5E4331]">
          <Sparkles className="w-3.5 h-3.5 text-[#E7C789]" />
          <span>Your Sanctuary Awaits</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight font-normal mb-6">
          Start your first page.
        </h2>

        <p className="text-lg sm:text-xl text-[#C4B2A1] max-w-xl mx-auto font-light leading-relaxed mb-10">
          Turn the key, open the cover, and let your keyboard breathe life into timeless handwriting.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[#FAF5EC] text-[#291B13] text-base font-medium hover:bg-[#EFE6D6] shadow-xl hover:shadow-2xl transition-all active:scale-95"
          >
            <Feather className="w-4 h-4 text-[#7A4B29]" />
            <span>Open Diary</span>
            <ArrowRight className="w-4 h-4 text-[#7A4B29]" />
          </a>
        </div>

        {/* Reassurance Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A89685] font-serif italic">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8EAD71]" /> Instant Access
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8EAD71]" /> No Sign-Up Required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8EAD71]" /> 100% Private to Your Device
          </span>
        </div>
      </div>
    </section>
  );
}
