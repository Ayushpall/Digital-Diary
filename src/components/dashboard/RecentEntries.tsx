"use client";

import React from "react";
import { RecentEntryData } from "@/types/dashboard";
import { BookOpen, Calendar, ArrowRight, PenTool } from "lucide-react";

interface RecentEntriesProps {
  entries: RecentEntryData[];
  onOpenEntry?: (entryId: string) => void;
  onViewAll?: () => void;
}

export function RecentEntries({
  entries,
  onOpenEntry,
  onViewAll,
}: RecentEntriesProps) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#261A13] font-normal">
            Recent Entries
          </h2>
          <p className="text-xs text-[#7A6756] font-light">
            Thoughts and reflections penned across your pages
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-serif text-[#663E24] hover:text-[#3B2313] font-medium flex items-center gap-1"
        >
          <span>View all entries</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#EFE6D6] flex items-center justify-center mb-3 text-[#B89360]">
            <PenTool className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg text-[#261A13] font-medium mb-1">
            No entries written yet
          </h3>
          <p className="text-xs text-[#7A6756] font-light max-w-sm mb-4">
            Your journal is waiting for its first thought. Click "New Entry" above to write your first reflection.
          </p>
          <a
            href="/editor/demo?new=true"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium transition-colors shadow-xs"
          >
            <span>Start First Entry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs hover:shadow-md hover:border-[#C7B69E] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group"
            >
              {/* Left red margin line indicator */}
              <div className="absolute top-0 bottom-0 left-3 w-[1.5px] bg-[#E29288]/40" />

              {/* Main Content Info */}
              <div className="pl-4 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C7A6A] bg-[#EFE6D6] px-2.5 py-0.5 rounded-md border border-[#DDD0BC]">
                    <Calendar className="w-3 h-3 text-[#A89481]" />
                    <span>{entry.date}</span>
                  </span>
                  <span className="text-xs text-[#9B8878] font-serif italic">
                    {entry.dayOfWeek}
                  </span>
                  <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#EAE1D0] text-[#554233] border border-[#D5C6B0]">
                    {entry.mood}
                  </span>
                  <span className="text-[11px] text-[#A69483] font-mono ml-auto md:ml-0">
                    in {entry.diaryName}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg sm:text-xl text-[#261A13] font-medium mb-1.5 group-hover:text-[#643E24] transition-colors">
                  {entry.title}
                </h3>

                {/* Short Preview */}
                <p className="handwriting-ink text-base sm:text-lg text-[#554437] leading-relaxed line-clamp-2">
                  "{entry.preview}"
                </p>
              </div>

              {/* Action: Open Button */}
              <div className="pl-4 md:pl-0 flex items-center justify-end">
                <button
                  onClick={() => onOpenEntry?.(entry.id)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#EFE5D5] hover:bg-[#342419] text-[#422F22] hover:text-[#FAF5ED] text-xs font-medium border border-[#D8C7B0] hover:border-[#342419] transition-all duration-200 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B89360]" />
                  <span>Open Page</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
