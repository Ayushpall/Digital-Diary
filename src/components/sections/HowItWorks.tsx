"use client";

import React from "react";
import { Keyboard, Palette, BookmarkCheck, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      stepTitle: "Step 1 — Write",
      headline: "Open a fresh page & type freely",
      description:
        "No complex formatting toolbars or distraction-heavy sidebars. Just an open notebook ready for your thoughts, captured as fast as your fingers can type.",
      icon: Keyboard,
      tag: "Effortless Capture",
    },
    {
      number: "02",
      stepTitle: "Step 2 — Choose handwriting",
      headline: "Pick your ink & pen style",
      description:
        "Select your preferred handwriting personality — from vintage fountain pen cursive to casual ink script — paired with rich inks like midnight blue, carbon, or warm sepia.",
      icon: Palette,
      tag: "Personal Identity",
    },
    {
      number: "03",
      stepTitle: "Step 3 — Save your memory",
      headline: "Safely bound in your digital volume",
      description:
        "Your entries are neatly organized by day and page index, stored locally on your machine. Turn back the pages whenever you wish to revisit past memories.",
      icon: BookmarkCheck,
      tag: "Local Keepsake",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#F8F4EC] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#948171] block mb-2">
            The Journaling Flow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#261A13] tracking-tight font-normal">
            How Digital Diary Works
          </h2>
          <p className="mt-3 text-[#665649] text-base sm:text-lg font-light">
            Three intuitive steps connecting digital convenience with authentic journal nostalgia.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#FAF6EE] p-8 rounded-2xl border border-[#E0D4C0] shadow-xs flex flex-col justify-between"
              >
                {/* Number Badge resembling an Inked Wax Seal */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E8DCB8] flex items-center justify-center font-serif text-lg font-medium text-[#4D3926] border border-[#D5C6A0] shadow-inner">
                    {step.number}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#F0E8D9] flex items-center justify-center text-[#695444] border border-[#DDD0BC]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono tracking-wider uppercase text-[#968270] block mb-1">
                    {step.stepTitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#291D16] mb-3 font-normal">
                    {step.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-[#615145] leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E8DFC9] flex items-center text-xs font-sans text-[#7D6B5D]">
                  <span className="font-medium text-[#4D3A2C]">{step.tag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA teaser */}
        <div className="mt-14 text-center">
          <a
            href="#editor-preview"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#643E23] hover:text-[#3B2212] transition-colors"
          >
            <span>Preview the live writing editor</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
