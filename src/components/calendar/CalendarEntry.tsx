"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { CalendarEntryData } from "@/types/calendar";
import { HandwritingRenderer } from "@/components/handwriting/HandwritingRenderer";
import { PageFlip } from "@/components/diary/PageFlip";
import { paginateContent } from "@/lib/pagination";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookOpen, 
  PenTool, 
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CalendarEntryProps {
  entry?: CalendarEntryData | null;
  selectedDateStr: string;
}

export function CalendarEntry({
  entry,
  selectedDateStr,
}: CalendarEntryProps) {
  const [leafIndex, setLeafIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");

  // Reset to first page when the selected entry or date changes
  useEffect(() => {
    setLeafIndex(0);
  }, [entry?.id, selectedDateStr]);

  // Paginate content to ~380 characters per leaf so the journal page remains compact and short
  const leaves = useMemo(() => {
    if (!entry || !entry.content) return [""];
    return paginateContent(entry.content, 380);
  }, [entry]);

  const totalLeaves = leaves.length;
  const currentLeafText = leaves[leafIndex] || "";

  const handleNextLeaf = React.useCallback(() => {
    if (leafIndex + 1 < totalLeaves) {
      setFlipDirection("forward");
      setLeafIndex((prev) => prev + 1);
    }
  }, [leafIndex, totalLeaves]);

  const handlePrevLeaf = React.useCallback(() => {
    if (leafIndex > 0) {
      setFlipDirection("backward");
      setLeafIndex((prev) => prev - 1);
    }
  }, [leafIndex]);

  // Keyboard navigation for turning single journal leaves with Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        handleNextLeaf();
      } else if (e.key === "ArrowLeft") {
        handlePrevLeaf();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextLeaf, handlePrevLeaf]);

  // Blank leaf when no entry exists for this date
  if (!entry) {
    return (
      <div className="h-[560px] sm:h-[580px] rounded-2xl p-6 sm:p-8 paper-pattern-lined border-l-4 border-l-[#5E3C22] border border-[#D5C6AC] shadow-xl bg-[#FAF6ED] flex flex-col justify-between relative select-text overflow-hidden">
        {/* Left red margin line */}
        <div className="absolute top-0 bottom-0 left-7 sm:left-9 w-[1.5px] bg-[#E59388]/30 pointer-events-none" />

        {/* Top Folio Header */}
        <div className="relative z-10 pl-6 pb-3 border-b border-[#D8CABE]/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
            <CalendarIcon className="w-3.5 h-3.5 text-[#B89360]" />
            <span>{selectedDateStr}</span>
          </div>
          <span className="text-[11px] font-mono text-[#9C8978] bg-[#EFE6D6] px-2.5 py-0.5 rounded-md border border-[#DDD0BC]">
            Blank Leaf
          </span>
        </div>

        {/* Center Blank State */}
        <div className="relative z-10 pl-6 py-8 text-center max-w-sm mx-auto flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 rounded-full bg-[#EFE5D5] flex items-center justify-center text-[#5C4533] mx-auto mb-3 border border-[#DAC9B1] shadow-2xs">
            <PenTool className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-[#2A1D15] font-normal mb-2">
            No Entry for This Day
          </h3>
          <p className="text-xs text-[#6B5A4B] font-light leading-relaxed mb-6">
            This page in your journal is currently unwritten. Pen your thoughts or memories for this date anytime.
          </p>
          <Link
            href={`/editor/demo?new=true&date=${selectedDateStr}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs transition-all active:scale-95"
          >
            <PenTool className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>+ Write Entry for This Date</span>
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 pl-6 pt-3 border-t border-[#E8DEC9] text-xs text-[#8C7A6B] font-serif italic flex items-center justify-between">
          <span>Digital Diary • Bound Leaf</span>
          <span className="text-[10px] font-mono text-[#A69482]">Ready for ink</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[560px] sm:h-[580px] rounded-2xl border-l-4 border-l-[#5E3C22] border border-[#D5C6AC] shadow-xl bg-[#FAF6ED] flex flex-col justify-between relative select-text overflow-hidden group">
      {/* Hanging silk ribbon bookmark simulation */}
      <div className="absolute -top-1 left-16 z-30 flex flex-col items-center pointer-events-none">
        <div className="w-3.5 h-12 bg-[#8B2222] shadow-sm border-x border-[#6E1A1A] ribbon-tail opacity-90" />
      </div>

      {/* Brass corner accent on top right */}
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#BFA169]/70 rounded-tr-sm pointer-events-none z-20" />

      {/* Outer Top Bar: Date, Flip Controls & Mood */}
      <div className="relative z-20 px-5 sm:px-7 pt-4 pb-3 border-b border-[#D8CABE]/50 bg-[#FAF6ED] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
          <CalendarIcon className="w-3.5 h-3.5 text-[#B89360]" />
          <span className="font-medium text-[#38261A]">
            {entry.dateFormatted} ({entry.dayOfWeek})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Half-side Page Flip Controls (Single Leaf Navigation) */}
          {totalLeaves > 1 && (
            <div className="flex items-center gap-1 bg-[#EFE6D6] px-2 py-0.5 rounded-xl border border-[#DDD0BC] shadow-2xs">
              <button
                type="button"
                onClick={handlePrevLeaf}
                disabled={leafIndex === 0}
                className="p-1 rounded-md text-[#554030] hover:bg-[#E2D5BF] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Flip to previous leaf (←)"
                aria-label="Previous leaf"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-[#3D2C1F] font-semibold min-w-[50px] text-center select-none">
                Page {leafIndex + 1}/{totalLeaves}
              </span>
              <button
                type="button"
                onClick={handleNextLeaf}
                disabled={leafIndex + 1 >= totalLeaves}
                className="p-1 rounded-md text-[#554030] hover:bg-[#E2D5BF] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Flip to next leaf (→)"
                aria-label="Next leaf"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mood indicator badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAE0CD] text-[#423023] border border-[#D5C5AC] text-xs font-medium shadow-2xs">
            <span className="text-xs">{entry.moodEmoji}</span>
            <span className="text-[11px]">{entry.moodLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Single Page Stage with Smooth 3D Half-Side Page Flip Animation */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <PageFlip
          pageKey={`${entry.id}-leaf-${leafIndex}`}
          direction={flipDirection}
          origin="left"
        >
          <div className="w-full h-full p-5 sm:p-7 paper-pattern-lined relative flex flex-col justify-between select-text">
            {/* Left red margin line */}
            <div className="absolute top-0 bottom-0 left-7 sm:left-9 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

            {/* Content Body */}
            <div className="pl-5 sm:pl-7 flex-1 overflow-hidden flex flex-col">
              {/* Entry Title */}
              <h2 className="font-serif text-xl sm:text-2xl text-[#2B1D15] tracking-tight mb-3 font-normal italic leading-snug">
                {leafIndex === 0 ? entry.title : `${entry.title} (cont.)`}
              </h2>

              {/* Handwritten Lines (fitted to ~380 chars per leaf so it never stretches long) */}
              <div className="flex-1 overflow-hidden">
                <HandwritingRenderer
                  text={currentLeafText}
                  style="cursive"
                  fontSize="md"
                  color={entry.inkColor}
                  enableVariations={true}
                />
              </div>
            </div>
          </div>
        </PageFlip>
      </div>

      {/* Bottom Footer: Word Count, Page Indicators & Actions */}
      <div className="relative z-20 px-5 sm:px-7 py-3 border-t border-[#E8DEC9] bg-[#FAF6ED] flex items-center justify-between text-xs text-[#8C7A6B] font-serif">
        <div className="flex items-center gap-2 text-[11px] text-[#8C7A6B]">
          <FileText className="w-3.5 h-3.5 text-[#B89360]" />
          <span>{entry.wordCount} words recorded</span>
        </div>

        {/* Leaf indicator dots if multi-page */}
        {totalLeaves > 1 && (
          <div className="hidden sm:flex items-center gap-1.5" aria-label="Page dots">
            {leaves.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFlipDirection(i > leafIndex ? "forward" : "backward");
                  setLeafIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  leafIndex === i
                    ? "w-4 bg-[#38261A]"
                    : "w-1.5 bg-[#D5C6B0] hover:bg-[#8E6945]"
                }`}
                title={`Turn to page ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link
            href="/diary/demo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE5D5] hover:bg-[#342419] text-[#422F22] hover:text-[#FAF5ED] border border-[#DAC9B1] hover:border-[#342419] transition-all text-xs font-medium shadow-2xs active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Open in Book</span>
          </Link>
          <Link
            href={`/editor/demo?id=${entry.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] transition-all shadow-xs active:scale-95"
          >
            <PenTool className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
