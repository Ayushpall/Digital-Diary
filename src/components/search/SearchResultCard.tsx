"use client";

import React from "react";
import Link from "next/link";
import { SearchableDiaryEntry } from "@/types/search";
import { Calendar, BookOpen, Tag } from "lucide-react";

interface SearchResultCardProps {
  entry: SearchableDiaryEntry;
  highlightQuery?: string;
}

// Highlight matching words with warm golden ink badge
function HighlightedText({
  text,
  query,
}: {
  text: string;
  query?: string;
}) {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }

  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <span>{text}</span>;

  // Escape regex special chars
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#EAD4AB] text-[#291B13] px-1 py-0.5 rounded-sm font-medium underline decoration-[#9E7B4F]/40"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function SearchResultCard({
  entry,
  highlightQuery,
}: SearchResultCardProps) {
  return (
    <div className="group rounded-2xl p-5 sm:p-6 bg-[#FAF6EE] border border-[#D8C7B0] shadow-2xs hover:shadow-md hover:border-[#C4B29A] transition-all relative overflow-hidden flex flex-col justify-between">
      {/* Red vertical margin guide on left */}
      <div className="absolute top-0 bottom-0 left-3 w-[1.5px] bg-[#E29288]/40 pointer-events-none" />

      <div className="pl-3 sm:pl-4">
        {/* Top Meta Header: Date & Mood */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E8DFC9] mb-3">
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
            <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="font-medium text-[#382618]">
              <HighlightedText text={entry.date} query={highlightQuery} />
            </span>
            <span className="text-[#9C8978]">({entry.dayOfWeek})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mood pill with Emoji */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAE0CD] text-[#423023] border border-[#D5C5AC] text-xs font-medium shadow-2xs">
              <span className="text-xs">{entry.moodEmoji}</span>
              <HighlightedText text={entry.mood} query={highlightQuery} />
            </span>

            <span className="text-[11px] font-mono text-[#8C7A6B] hidden sm:inline">
              in {entry.diaryName}
            </span>
          </div>
        </div>

        {/* Entry Title */}
        <h3 className="font-serif text-xl sm:text-2xl text-[#261A13] font-medium mb-2 group-hover:text-[#643E24] transition-colors">
          <HighlightedText text={entry.title} query={highlightQuery} />
        </h3>

        {/* Snippet Body */}
        <p className="handwriting-ink text-lg sm:text-xl text-[#524134] leading-relaxed line-clamp-3 mb-4">
          "<HighlightedText text={entry.content} query={highlightQuery} />"
        </p>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#EFE5D5] text-[#554233] border border-[#DAC8B0]"
              >
                #<HighlightedText text={t} query={highlightQuery} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pl-3 sm:pl-4 mt-5 pt-3 border-t border-[#E8DFC9] flex items-center justify-between text-xs text-[#847262]">
        <span className="font-serif italic text-[11px]">Bound memory leaf</span>

        <Link
          href="/diary/demo"
          className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-[#EFE5D5] hover:bg-[#342419] text-[#422F22] hover:text-[#FAF5ED] border border-[#DAC9B1] hover:border-[#342419] transition-all font-medium text-xs shadow-2xs active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#B89360]" />
          <span>Open in Diary</span>
        </Link>
      </div>
    </div>
  );
}
