"use client";

import React from "react";
import { BookOpen, Sparkles, Feather, Lock } from "lucide-react";

interface DiaryCoverProps {
  onOpen: () => void;
}

export function DiaryCover({ onOpen }: DiaryCoverProps) {
  return (
    <div className="w-full max-w-xl mx-auto cursor-pointer select-none" onClick={onOpen}>
      {/* Outer Leather Cover Container */}
      <div className="relative rounded-2xl p-8 sm:p-12 md:p-16 leather-outer border-2 border-[#4A3425] shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_35px_70px_-15px_rgba(20,12,7,0.6)] group">
        
        {/* Real Brass / Gold Filigree Corner Accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D8B97C]/80 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D8B97C]/80 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D8B97C]/80 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D8B97C]/80 rounded-br-sm pointer-events-none" />

        {/* Outer Stitched Perimeter Thread Line */}
        <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#A88A58]/30 rounded-xl pointer-events-none" />

        {/* Spine Fold Visual on Left Edge */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/50 via-black/20 to-transparent rounded-l-2xl pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-[#614532]/60 pointer-events-none" />

        {/* Hanging Crimson Silk Ribbon Bookmark */}
        <div className="absolute -top-3 right-14 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-5 h-28 bg-[#8B2222] shadow-lg border-x border-[#6E1A1A] ribbon-tail opacity-95 group-hover:h-32 transition-all duration-300" />
        </div>

        {/* Cover Content / Gold Foil Stamping */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[380px] sm:min-h-[460px]">
          
          {/* Top Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-[#1C120B] border border-[#78593E] flex items-center justify-center text-[#E5C78B] mb-8 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Feather className="w-8 h-8 text-[#D8B97C]" />
          </div>

          {/* Bookplate Title: "MY JOURNAL" */}
          <div className="relative px-6 py-4 rounded-xl border border-[#91714B]/40 bg-[#1D130C]/60 backdrop-blur-xs mb-4">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C2A36B] block mb-1">
              EST. 2026
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F6E9CF] tracking-wide font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              MY JOURNAL
            </h1>
            <span className="text-[11px] font-serif italic text-[#A68F74] block mt-1">
              Personal Reflections & Quiet Musings
            </span>
          </div>

          {/* Brass Latch Clasp */}
          <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-[#24170E] border border-[#6E4F36] text-[#D8B97C] text-xs font-serif italic shadow-inner">
            <Lock className="w-3.5 h-3.5 text-[#C49E4F]" />
            <span>Click to Unclasp & Open</span>
          </div>

          {/* Open Callout */}
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5C78B] text-[#24160C] text-xs font-medium uppercase tracking-wider hover:bg-[#F2D79E] shadow-md group-hover:shadow-lg transition-all active:scale-95">
            <BookOpen className="w-4 h-4" />
            <span>Open Diary</span>
          </div>
        </div>

        {/* Paper stack depth on right edge */}
        <div className="absolute top-3 bottom-3 -right-2 w-2 bg-[#EBE2D2] rounded-r-xs shadow-md border-r border-[#C7B59D] pointer-events-none" />
      </div>

      <p className="text-center text-xs font-serif italic text-[#7C6A5A] mt-4">
        Click the book cover or use the button to open your journal
      </p>
    </div>
  );
}
