import React from "react";
import { BookOpen, Sparkles, Feather, Lock } from "lucide-react";
import { getCoverTheme } from "@/lib/cover-themes";

interface DiaryCoverProps {
  onOpen: () => void;
  coverStyle?: string;
  title?: string;
}

export function DiaryCover({ onOpen, coverStyle = "embossed-leather", title = "MY JOURNAL" }: DiaryCoverProps) {
  const theme = getCoverTheme(coverStyle);

  return (
    <div className="w-full max-w-xl mx-auto cursor-pointer select-none" onClick={onOpen}>
      {/* Outer Leather Cover Container */}
      <div className={`relative rounded-2xl overflow-hidden border-2 ${theme.borderColor} shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_35px_70px_-15px_rgba(20,12,7,0.6)] group`}>
        
        {/* Background Artwork or Leather Texture */}
        {theme.imageUrl ? (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={theme.imageUrl}
              alt={theme.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </div>
        ) : (
          <div className={`absolute inset-0 z-0 ${theme.bgColor} leather-outer`} />
        )}

        {/* Real Brass / Gold Filigree Corner Accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D8B97C]/80 rounded-tl-sm pointer-events-none z-10" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D8B97C]/80 rounded-tr-sm pointer-events-none z-10" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D8B97C]/80 rounded-bl-sm pointer-events-none z-10" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D8B97C]/80 rounded-br-sm pointer-events-none z-10" />

        {/* Outer Stitched Perimeter Thread Line */}
        <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#A88A58]/40 rounded-xl pointer-events-none z-10" />

        {/* Spine Fold Visual on Left Edge */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-l-2xl pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-[#614532]/60 pointer-events-none z-10" />

        {/* Hanging Crimson Silk Ribbon Bookmark */}
        <div className="absolute -top-3 right-14 z-20 flex flex-col items-center pointer-events-none">
          <div className={`w-5 h-28 ${theme.ribbonColor} shadow-lg border-x border-black/20 ribbon-tail opacity-95 group-hover:h-32 transition-all duration-300`} />
        </div>

        {/* Cover Content / Gold Foil Stamping */}
        <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col items-center justify-between text-center min-h-[420px] sm:min-h-[500px]">
          
          {/* Top Theme Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C120B]/70 border border-[#78593E]/60 text-[#E5C78B] text-[11px] font-mono tracking-widest uppercase backdrop-blur-xs shadow-inner">
            <Feather className="w-3 h-3 text-[#D8B97C]" />
            <span>{theme.name}</span>
          </div>

          {/* Bookplate Title */}
          <div className="relative px-6 py-4 rounded-xl border border-[#91714B]/50 bg-[#1D130C]/75 backdrop-blur-sm my-4 max-w-sm">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C2A36B] block mb-1">
              EST. 2026 • VOLUME I
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F6E9CF] tracking-wide font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
              {title}
            </h1>
            {theme.tagline ? (
              <span className="text-[11px] font-serif italic text-[#D8C7B0] block mt-1.5 line-clamp-2">
                "{theme.tagline}"
              </span>
            ) : (
              <span className="text-[11px] font-serif italic text-[#A68F74] block mt-1">
                Personal Reflections & Quiet Musings
              </span>
            )}
          </div>

          {/* Open Callout & Brass Clasp */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24170E]/80 border border-[#6E4F36] text-[#D8B97C] text-xs font-serif italic shadow-inner backdrop-blur-xs">
              <Lock className="w-3.5 h-3.5 text-[#C49E4F]" />
              <span>Click to Unclasp & Read</span>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5C78B] text-[#24160C] text-xs font-medium uppercase tracking-wider hover:bg-[#F2D79E] shadow-md group-hover:shadow-lg transition-all active:scale-95">
              <BookOpen className="w-4 h-4" />
              <span>Open Journal</span>
            </div>
          </div>
        </div>

        {/* Paper stack depth on right edge */}
        <div className="absolute top-3 bottom-3 -right-2 w-2 bg-[#EBE2D2] rounded-r-xs shadow-md border-r border-[#C7B59D] pointer-events-none z-10" />
      </div>

      <p className="text-center text-xs font-serif italic text-[#7C6A5A] mt-4">
        Click the book cover to open your handwritten pages
      </p>
    </div>
  );
}
