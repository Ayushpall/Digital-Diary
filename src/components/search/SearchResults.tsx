"use client";

import React from "react";
import { SearchableDiaryEntry, SearchTimeframe } from "@/types/search";
import { SearchResultCard } from "./SearchResultCard";
import { Feather, BookX, Sparkles, Filter } from "lucide-react";

interface SearchResultsProps {
  entries: SearchableDiaryEntry[];
  totalCount: number;
  query: string;
  activeFilter: SearchTimeframe;
  onFilterChange: (filter: SearchTimeframe) => void;
}

export function SearchResults({
  entries,
  totalCount,
  query,
  activeFilter,
  onFilterChange,
}: SearchResultsProps) {
  const filterOptions: { id: SearchTimeframe; label: string }[] = [
    { id: "all", label: "All" },
    { id: "week", label: "This week" },
    { id: "month", label: "This month" },
    { id: "older", label: "Older" },
  ];

  return (
    <div className="w-full mt-6">
      {/* Filters & Results Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DECDB8] mb-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF6EE] p-1 rounded-xl border border-[#DECDB8] shadow-2xs overflow-x-auto no-scrollbar max-w-full">
          <div className="pl-2 pr-1 text-[#8C7A6B] hidden sm:flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="font-serif italic">Filter:</span>
          </div>
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-serif transition-colors whitespace-nowrap active:scale-95 ${
                activeFilter === opt.id
                  ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-xs"
                  : "text-[#5C4B3C] hover:bg-[#EFE5D5]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs font-serif italic text-[#7C6958]">
          {query ? (
            <span>
              Found <strong className="text-[#38261A]">{entries.length}</strong>{" "}
              {entries.length === 1 ? "memory" : "memories"} matching "
              <span className="text-[#875837] font-sans font-medium">{query}</span>"
            </span>
          ) : (
            <span>
              Showing <strong className="text-[#38261A]">{entries.length}</strong>{" "}
              recorded {entries.length === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>
      </div>

      {/* Results List or Empty State */}
      {entries.length === 0 ? (
        <div className="rounded-2xl p-12 sm:p-16 bg-[#FAF6EE] border border-dashed border-[#D5C5AC] text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-[#EFE5D5] flex items-center justify-center text-[#614936] mx-auto mb-4 border border-[#DAC8B0] shadow-inner">
            <BookX className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#261A13] font-normal mb-2">
            No memories found.
          </h3>
          <p className="text-xs sm:text-sm text-[#6C5B4E] font-light leading-relaxed mb-6">
            We couldn't find any entries matching "{query}". Try checking your spelling,
            searching by a mood like "Inspired", or exploring another timeframe filter.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-serif italic text-[#8A7869]">
            <Feather className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Every blank page is a memory waiting to be penned</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map((entry) => (
            <SearchResultCard
              key={entry.id}
              entry={entry}
              highlightQuery={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}
