"use client";

import React from "react";
import { PenTool, ShieldCheck, BookMarked, Smartphone, Feather, Sparkles } from "lucide-react";

export function CoreFeatures() {
  const features = [
    {
      icon: PenTool,
      tag: "Fluid Typography",
      title: "Type → Handwriting",
      description:
        "Type at full speed with your mechanical keyboard or laptop. Our typography engine dynamically flows letters into natural cursive ink, complete with realistic baseline variance.",
    },
    {
      icon: ShieldCheck,
      tag: "Zero Cloud Leaks",
      title: "Private Journal",
      description:
        "Your deepest reflections stay strictly on your local device. No logins, no tracking cookies, and no remote database servers storing your personal life.",
    },
    {
      icon: BookMarked,
      tag: "Tactile Realism",
      title: "Beautiful Digital Pages",
      description:
        "Warm ivory paper, organic grain, subtle spine creases, and delicate ruled lines. Crafted to feel like an intimate physical notebook rather than a generic SaaS dashboard.",
    },
    {
      icon: Smartphone,
      tag: "Universal Layout",
      title: "Access Anywhere",
      description:
        "Seamlessly switches between a classic two-page spread on desktop and a single pocket-journal view on mobile and tablet with touch-ready responsiveness.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#F4EFE6] border-y border-[#E5DAC8]/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE1CF] text-[#7A6655] text-xs font-mono uppercase tracking-widest mb-3 border border-[#DAC9B1]">
            <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Handcrafted Simplicity</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#281C15] tracking-tight font-normal">
            Designed for genuine reflection, <br />
            <span className="italic text-[#704629]">not corporate productivity.</span>
          </h2>
          <p className="mt-4 text-[#635346] text-base sm:text-lg font-light leading-relaxed">
            Every detail is tailored to slow your heart rate, quiet your mind, and make daily journaling an irresistible ritual.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-[#FAF6EE] border border-[#DFD3BF] shadow-sm hover:shadow-md hover:border-[#CFBEA4] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Subtle top corner bookmark indicator */}
                <div className="absolute top-0 right-8 w-6 h-4 bg-[#DCCBB4] rounded-b-md opacity-40 group-hover:opacity-70 transition-opacity" />

                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EFE6D6] flex items-center justify-center text-[#3D2C20] border border-[#DDD0BC] mb-6 group-hover:scale-110 group-hover:bg-[#3D2C20] group-hover:text-[#F6EEDF] transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-mono tracking-wider uppercase text-[#968270] block mb-2">
                    {item.tag}
                  </span>

                  <h3 className="font-serif text-2xl text-[#261B14] mb-3 font-normal">
                    {item.title}
                  </h3>

                  <p className="text-[#635347] text-sm sm:text-base leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8DFCF] flex items-center gap-2 text-xs font-serif italic text-[#8B7766]">
                  <Feather className="w-3.5 h-3.5 text-[#B89360]" />
                  <span>Curated for mindful writing</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
