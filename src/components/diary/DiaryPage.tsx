"use client";

import React from "react";
import { DiaryPageData } from "@/types/diary";
import { PageNumber } from "./PageNumber";
import { PageBlocksRenderer } from "@/components/creative/PageBlocksRenderer";
import { Calendar, Sparkles } from "lucide-react";

interface DiaryPageProps {
  page: DiaryPageData;
  position: "left" | "right" | "single";
}

export function DiaryPage({ page, position }: DiaryPageProps) {
  const spineClass =
    position === "left"
      ? "left-page-spine border-r border-[#E2D6C3]"
      : position === "right"
      ? "right-page-spine"
      : "border border-[#E0D4C0]";

  const inkColorClass =
    page.ink === "sepia"
      ? "text-[#4A3423]"
      : page.ink === "carbon"
      ? "text-[#232120]"
      : "text-[#1B293A]";

  return (
    <div
      className={`relative w-full h-full min-h-[480px] sm:min-h-[580px] p-5 sm:p-8 md:p-10 paper-pattern-lined ${spineClass} bg-[#FAF6ED] flex flex-col justify-between select-text`}
    >
      {/* Red vertical margin line */}
      <div
        className={`absolute top-0 bottom-0 ${
          position === "left"
            ? "right-8 sm:right-10 w-[1.5px] bg-[#E59388]/30"
            : "left-6 sm:left-10 w-[1.5px] bg-[#E59388]/30"
        } pointer-events-none`}
      />

      {/* Top Folio Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#D8CABE]/50 mb-4">
        {page.date ? (
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
            <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="font-medium text-[#463426]">{page.date}</span>
            {page.dayOfWeek && (
              <span className="text-[#968474]">({page.dayOfWeek})</span>
            )}
          </div>
        ) : (
          <div className="text-xs font-serif italic text-[#968474]">Memoirs</div>
        )}

        {page.mood && (
          <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#EAE1D0] text-[#554233] border border-[#D5C6B0] shadow-2xs">
            {page.mood}
          </span>
        )}
      </div>

      {/* Main Page Inscription / Content */}
      <div className="relative z-10 flex-1 pl-2 sm:pl-4">
        {page.title && (
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1D15] tracking-tight mb-4 font-normal italic">
            {page.title}
          </h2>
        )}

        {/* Cursive handwritten body text aligned to ruled baseline */}
        <div
          className={`handwriting-ink text-xl sm:text-2xl leading-8 ${inkColorClass} whitespace-pre-line`}
        >
          {page.content}
        </div>

        {/* Creative Keepsake Blocks (Photos, Sketches, Stickers) */}
        {page.blocks && page.blocks.length > 0 && (
          <div className="mt-4 pointer-events-auto">
            <PageBlocksRenderer blocks={page.blocks} showHeader={false} interactive={false} />
          </div>
        )}
      </div>

      {/* Bottom Page Footer with Folio Stamp */}
      <div className="relative z-10 pt-4 border-t border-[#E8DEC9] flex items-center justify-between">
        <span className="text-[11px] font-serif italic text-[#968576]">
          Digital Diary Volume I
        </span>
        <PageNumber
          number={page.pageNumber}
          position={position === "left" ? "left" : "right"}
        />
      </div>
    </div>
  );
}
