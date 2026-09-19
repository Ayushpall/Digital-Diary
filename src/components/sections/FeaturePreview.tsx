"use client";

import React, { useState } from "react";
import { InkColor, PaperStyle } from "@/types";
import { 
  Bookmark, 
  Calendar, 
  Clock, 
  Download, 
  Maximize2, 
  PenTool, 
  RotateCcw, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";

export function FeaturePreview() {
  const [ink, setInk] = useState<InkColor>("sepia");
  const [paper, setPaper] = useState<PaperStyle>("lined");
  const [entryTitle, setEntryTitle] = useState("A peaceful rainy evening in October");
  const [entryBody, setEntryBody] = useState(
    "There is a peculiar serenity in late evening silence. The clock ticks softly on the mantelpiece, and shadows lengthen across the oak desk.\n\nWriting here feels different than typing into cold document editors. The words curve and breathe with human warmth. It reminds me of the leather journal my grandfather kept in his study drawer — worn at the corners, filled with patient ink."
  );

  const inkMap: Record<InkColor, { text: string; name: string; bg: string }> = {
    midnight: { text: "text-[#1C2C40]", name: "Midnight Navy", bg: "bg-[#1C2C40]" },
    carbon: { text: "text-[#23201F]", name: "Carbon Charcoal", bg: "bg-[#23201F]" },
    sepia: { text: "text-[#4F3624]", name: "Walnut Sepia", bg: "bg-[#4F3624]" },
  };

  const getPaperBg = () => {
    switch (paper) {
      case "dotgrid":
        return "paper-pattern-dots";
      case "blank":
        return "paper-pattern-plain";
      case "lined":
      default:
        return "paper-pattern-lined";
    }
  };

  return (
    <section id="editor-preview" className="py-20 md:py-28 bg-[#F3ECE0] border-t border-[#E0D3C0] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5D7C2] text-[#695443] text-xs font-mono uppercase tracking-widest mb-3 border border-[#D5C4AC]">
            <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Interactive Showcase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#281C15] tracking-tight font-normal">
            The Intimate Writing Canvas
          </h2>
          <p className="mt-3 text-[#645346] text-base sm:text-lg font-light">
            Preview the clutter-free editor. Choose your paper, adjust ink, and test the handwriting live.
          </p>
        </div>

        {/* Editor Apparatus Bar */}
        <div className="rounded-t-2xl bg-[#342419] p-3 sm:p-4 text-[#F3ECE0] flex flex-wrap items-center justify-between gap-4 border border-[#483324]">
          {/* Left: Book volume & date info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#4A3426] flex items-center justify-center text-[#E5C78D]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-serif font-medium text-[#FAF5ED] flex items-center gap-2">
                <span>Volume I — Autumn 2026</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#4C3627] text-[#D8C29D]">Page 12</span>
              </div>
              <div className="text-[11px] text-[#A69382] flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#BFA47A]" /> Oct 18, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#BFA47A]" /> 8:42 PM
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right Controls: Ink & Paper Pickers */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Ink Swatches */}
            <div className="flex items-center gap-2 bg-[#281B12] px-3 py-1.5 rounded-lg border border-[#442E20]">
              <span className="text-[11px] text-[#B5A494] font-serif italic hidden sm:inline">Ink:</span>
              {(["sepia", "midnight", "carbon"] as InkColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setInk(c)}
                  title={inkMap[c].name}
                  className={`w-4 h-4 rounded-full ${inkMap[c].bg} border border-[#FAF5ED]/30 transition-all ${
                    ink === c ? "scale-125 ring-2 ring-[#D5AF64] ring-offset-1 ring-offset-[#281B12]" : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {/* Paper Ruling Selector */}
            <div className="flex items-center gap-1 bg-[#281B12] p-1 rounded-lg border border-[#442E20] text-xs">
              <button
                onClick={() => setPaper("lined")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  paper === "lined" ? "bg-[#4D3627] text-[#FDF9F3] font-medium" : "text-[#9E8B7A] hover:text-[#EDE3D3]"
                }`}
              >
                Ruled
              </button>
              <button
                onClick={() => setPaper("dotgrid")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  paper === "dotgrid" ? "bg-[#4D3627] text-[#FDF9F3] font-medium" : "text-[#9E8B7A] hover:text-[#EDE3D3]"
                }`}
              >
                Dots
              </button>
              <button
                onClick={() => setPaper("blank")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  paper === "blank" ? "bg-[#4D3627] text-[#FDF9F3] font-medium" : "text-[#9E8B7A] hover:text-[#EDE3D3]"
                }`}
              >
                Blank
              </button>
            </div>
          </div>
        </div>

        {/* Realistic Open Single Page Canvas */}
        <div className={`relative p-8 sm:p-12 md:p-16 rounded-b-2xl shadow-2xl border-x border-b border-[#D8C7B0] ${getPaperBg()} min-h-[500px]`}>
          
          {/* Vertical Red Margin Guide */}
          <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-[1.5px] bg-[#DF8D82]/35 pointer-events-none" />

          {/* Content Area */}
          <div className="relative z-10 pl-6 sm:pl-10">
            {/* Inscribed Title Field */}
            <input
              type="text"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="w-full font-serif text-2xl sm:text-3xl text-[#2B1D16] tracking-tight bg-transparent border-b border-[#D8CABE]/60 pb-3 mb-6 outline-none focus:border-[#96714E]"
              placeholder="Give this entry a title..."
            />

            {/* Inscribed Body Area */}
            <textarea
              value={entryBody}
              onChange={(e) => setEntryBody(e.target.value)}
              rows={9}
              className={`w-full bg-transparent outline-none resize-none handwriting-ink text-2xl sm:text-3xl leading-8 ${inkMap[ink].text} transition-colors duration-200`}
              placeholder="Write your entry here..."
            />
          </div>

          {/* Bottom Page Navigation Controls & Page Number */}
          <div className="mt-8 pt-6 border-t border-[#DFD1BD]/80 flex items-center justify-between text-xs text-[#877565] font-serif">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#ECE0CD] hover:bg-[#E2D4BF] text-[#4E3D30] transition-colors border border-[#DAC9B1]">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Page</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#ECE0CD] hover:bg-[#E2D4BF] text-[#4E3D30] transition-colors border border-[#DAC9B1]">
                <span>Next Page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="font-mono text-xs text-[#877565]">
              Page 12 of 144
            </div>
          </div>
        </div>

        {/* Minimal Tooltip Hint */}
        <p className="text-center text-xs text-[#867566] font-serif italic mt-4">
          Click any control above to test ink tones and paper rulings dynamically.
        </p>
      </div>
    </section>
  );
}
