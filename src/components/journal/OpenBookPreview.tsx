"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Heart, PenTool, CheckCircle2 } from "lucide-react";
import { InkColor } from "@/types";

interface OpenBookPreviewProps {
  interactive?: boolean;
}

export function OpenBookPreview({ interactive = true }: OpenBookPreviewProps) {
  const [typedText, setTypedText] = useState(
    "Today the rain tapped gently against the studio window. I brewed a cup of black tea, sat back, and watched how quiet thoughts find peace on paper. Sometimes all you need is a blank page and honest words."
  );
  const [activeInk, setActiveInk] = useState<InkColor>("midnight");
  const [customWord, setCustomWord] = useState("");

  const inkStyles: Record<InkColor, { text: string; label: string; bg: string }> = {
    midnight: {
      text: "text-[#1B2A3D]",
      label: "Midnight Fountain Pen",
      bg: "bg-[#1B2A3D]",
    },
    carbon: {
      text: "text-[#242120]",
      label: "Carbon Ink",
      bg: "bg-[#242120]",
    },
    sepia: {
      text: "text-[#4D3624]",
      label: "Walnut Sepia",
      bg: "bg-[#4D3624]",
    },
  };

  const handleAppendThought = (snippet: string) => {
    setTypedText((prev) => `${prev} ${snippet}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Outer Leather Journal Binder & Raised Shadow */}
      <div className="relative rounded-2xl p-3 sm:p-5 md:p-8 bg-[#332218] shadow-2xl border border-[#4A3426]/70">
        {/* Embossed Corner Hardware Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#BFA169]/60 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#BFA169]/60 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#BFA169]/60 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#BFA169]/60 rounded-br-sm pointer-events-none" />

        {/* Realistic Silk Ribbon Bookmark hanging from the top spine */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-5 h-20 sm:h-28 bg-[#8B2626] shadow-md border-x border-[#6E1C1C] ribbon-tail opacity-95 transition-all duration-300" />
        </div>

        {/* Two-Page Spread Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden bg-[#FAF6ED] shadow-inner border border-[#E0D4C0]">
          
          {/* LEFT PAGE: Date, Intro, Thought of the Day */}
          <div className="relative p-4 sm:p-8 md:p-10 paper-pattern-lined left-page-spine border-b md:border-b-0 md:border-r border-[#E8DEC9] min-h-[340px] sm:min-h-[440px] flex flex-col justify-between">
            {/* Red Margin Line */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-14 w-[1.5px] bg-[#E59388]/40 pointer-events-none" />

            <div className="relative z-10 pl-5 sm:pl-8">
              {/* Header Stamp */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D8CABE]/50 mb-4">
                <div className="flex items-center gap-2 text-xs font-serif italic text-[#877464]">
                  <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
                  <span>Sunday, October 18</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#877464] font-mono">
                  <span>Page 042</span>
                </div>
              </div>

              {/* Inscribed Page Title */}
              <h3 className="font-serif text-2xl text-[#2F221B] tracking-tight mb-4 font-normal italic">
                Autumn Reflections
              </h3>

              {/* Handwritten Left Page Text */}
              <div className={`handwriting-ink text-xl sm:text-2xl leading-8 ${inkStyles[activeInk].text} transition-colors duration-200`}>
                <p className="mb-4">
                  "Every thought we preserve becomes a quiet shelter for the soul years down the road."
                </p>
                <p className="text-lg sm:text-xl opacity-90">
                  Notes from the morning walk: crisp leaves, the sound of church bells in the distance, and the realization that slowing down is not a pause, but a beginning.
                </p>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="relative z-10 pl-5 sm:pl-8 pt-6 flex items-center justify-between text-xs text-[#8A7869] font-serif italic">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C49E4F]" />
                <span>Morning Journal</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[#B36060]/70" />
                <span>Gratitude</span>
              </div>
            </div>
          </div>

          {/* RIGHT PAGE: Live Keyboard-to-Handwriting Typing */}
          <div className="relative p-4 sm:p-8 md:p-10 paper-pattern-lined right-page-spine min-h-[340px] sm:min-h-[440px] flex flex-col justify-between">
            {/* Red Margin Line */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-14 w-[1.5px] bg-[#E59388]/40 pointer-events-none" />

            <div className="relative z-10 pl-5 sm:pl-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8CABE]/50 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8C7B6D]">
                  <PenTool className="w-3.5 h-3.5 text-[#B89360]" />
                  <span className="font-serif italic">Try typing below...</span>
                </div>
                {/* Live Ink Color Badges */}
                <div className="flex items-center gap-1.5">
                  {(["midnight", "carbon", "sepia"] as InkColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setActiveInk(color)}
                      title={`Switch to ${inkStyles[color].label}`}
                      className={`w-4 h-4 rounded-full ${inkStyles[color].bg} transition-transform ${
                        activeInk === color ? "scale-125 ring-2 ring-[#B89360] ring-offset-1 ring-offset-[#FAF6ED]" : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Live Editable Text on Paper Lines */}
              {interactive ? (
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    placeholder="Type anything here with your keyboard..."
                    rows={8}
                    className={`w-full flex-1 resize-none bg-transparent outline-none handwriting-ink text-xl sm:text-2xl leading-8 ${inkStyles[activeInk].text} placeholder:text-[#A8988A]/60 transition-colors duration-200`}
                  />
                </div>
              ) : (
                <div className={`handwriting-ink text-xl sm:text-2xl leading-8 ${inkStyles[activeInk].text}`}>
                  {typedText}
                </div>
              )}
            </div>

            {/* Interactive Live Typing Suggestion Chips */}
            <div className="relative z-10 pl-6 sm:pl-8 pt-4 border-t border-[#E2D6C5]/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-sans font-medium text-[#8F7D6D]">Add idea:</span>
              <button
                onClick={() => handleAppendThought("The evening dusk feels calm.")}
                className="text-xs px-2.5 py-1 rounded-full bg-[#EFE6D6] hover:bg-[#E5DAC6] text-[#4F3E33] border border-[#DDD0BC] transition-colors"
              >
                + Evening dusk
              </button>
              <button
                onClick={() => handleAppendThought("Grateful for quiet moments.")}
                className="text-xs px-2.5 py-1 rounded-full bg-[#EFE6D6] hover:bg-[#E5DAC6] text-[#4F3E33] border border-[#DDD0BC] transition-colors"
              >
                + Gratitude
              </button>
              <button
                onClick={() => setTypedText("")}
                className="text-xs px-2 py-1 rounded-full text-[#9C5449] hover:bg-[#F3E7E4] ml-auto transition-colors"
              >
                Clear page
              </button>
            </div>
          </div>
        </div>

        {/* Central Book Spine Shadow & Stitch Overlay */}
        <div className="hidden md:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-6 pointer-events-none z-20">
          <div className="w-full h-full journal-spine-crease opacity-70" />
        </div>
      </div>

      {/* Subtle Caption Underneath the Diary */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-serif italic text-[#7C6C5E]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#738C5F]" />
        <span>Type anywhere on the right page — your keystrokes instantly adapt into natural handwriting ink.</span>
      </div>
    </div>
  );
}
