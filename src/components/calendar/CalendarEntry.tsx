"use client";

import React from "react";
import Link from "next/link";
import { CalendarEntryData } from "@/types/calendar";
import { HandwritingRenderer } from "@/components/handwriting/HandwritingRenderer";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookOpen, 
  PenTool, 
  Clock, 
  ArrowRight,
  FileText
} from "lucide-react";

interface CalendarEntryProps {
  entry?: CalendarEntryData | null;
  selectedDateStr: string;
}

export function CalendarEntry({
  entry,
  selectedDateStr,
}: CalendarEntryProps) {
  if (!entry) {
    return (
      <div className="h-full rounded-2xl p-8 sm:p-10 paper-pattern-lined right-page-spine border border-[#D5C6AC] shadow-md bg-[#FAF6ED] flex flex-col justify-between relative select-text min-h-[460px]">
        {/* Margin Guide */}
        <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1.5px] bg-[#E59388]/30 pointer-events-none" />

        <div className="relative z-10 pl-6">
          <div className="pb-3 border-b border-[#D8CABE]/50 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
              <CalendarIcon className="w-3.5 h-3.5 text-[#B89360]" />
              <span>{selectedDateStr}</span>
            </div>
            <span className="text-[11px] font-mono text-[#9C8978]">Blank Leaf</span>
          </div>

          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#EFE5D5] flex items-center justify-center text-[#5C4533] mx-auto mb-4 border border-[#DAC9B1]">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#2A1D15] font-normal mb-2">
              No Entry for This Day
            </h3>
            <p className="text-xs text-[#6B5A4B] font-light leading-relaxed mb-6">
              This page in your journal is currently blank. Pen your memories or reflections for this date anytime.
            </p>
            <Link
              href="/editor/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs transition-all active:scale-95 diary-focus"
            >
              <PenTool className="w-3.5 h-3.5 text-[#E5C78B]" />
              <span>+ Write Entry for This Date</span>
            </Link>
          </div>
        </div>

        <div className="relative z-10 pl-6 pt-4 border-t border-[#E8DEC9] text-xs text-[#8C7A6B] font-serif italic">
          <span>Digital Diary • Volume I</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl p-6 sm:p-10 paper-pattern-lined right-page-spine border border-[#D5C6AC] shadow-md bg-[#FAF6ED] flex flex-col justify-between relative select-text min-h-[460px]">
      {/* Margin Guide */}
      <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1.5px] bg-[#E59388]/30 pointer-events-none" />

      <div className="relative z-10 pl-6 flex-1 flex flex-col">
        {/* Top Folio Header */}
        <div className="pb-3 border-b border-[#D8CABE]/50 mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
            <CalendarIcon className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="font-medium text-[#38261A]">
              {entry.dateFormatted} ({entry.dayOfWeek})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mood indicator badge with Emoji */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0CD] text-[#423023] border border-[#D5C5AC] text-xs font-medium shadow-2xs">
              <span className="text-sm">{entry.moodEmoji}</span>
              <span>{entry.moodLabel}</span>
            </div>

            <span className="text-[11px] font-mono text-[#8C7A6B] hidden sm:inline">
              in {entry.diaryName}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1D15] tracking-tight mb-4 font-normal italic">
          {entry.title}
        </h2>

        {/* Handwritten Content rendered via engine */}
        <div className="flex-1 mb-6">
          <HandwritingRenderer
            text={entry.content}
            style="cursive"
            fontSize="md"
            color={entry.inkColor}
            enableVariations={true}
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 pl-6 pt-4 border-t border-[#E8DEC9] flex items-center justify-between text-xs text-[#8C7A6B] font-serif">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-[#B89360]" />
          <span>{entry.wordCount} words recorded</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/diary/demo"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl bg-[#EFE5D5] hover:bg-[#342419] text-[#422F22] hover:text-[#FAF5ED] border border-[#DAC9B1] hover:border-[#342419] transition-all text-xs font-medium diary-focus active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open in Book</span>
          </Link>
          <Link
            href="/editor/demo"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] transition-all shadow-xs diary-focus active:scale-95"
          >
            <PenTool className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
