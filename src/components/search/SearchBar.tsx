"use client";

import React from "react";
import { Search, X, Sparkles, Tag } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (tag: string) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  suggestions = ["startup", "ideas", "rain", "books", "gratitude"],
  onSelectSuggestion,
}: SearchBarProps) {
  return (
    <div className="w-full bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-[#D8C7B0] shadow-sm">
      {/* Input row */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-[#8C7A6B] pointer-events-none">
          <Search className="w-5 h-5 text-[#B89360]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search memories by title, content, date, tag, or mood..."
          aria-label="Search memories by title, content, date, tag, or mood"
          className="w-full pl-12 pr-10 py-3.5 bg-[#FAF5ED] rounded-xl border border-[#DECDB8] outline-none font-serif text-base sm:text-lg text-[#2A1D15] placeholder:text-[#A89685]/70 focus:border-[#8E6945] focus:ring-2 focus:ring-[#8E6945]/15 transition-all shadow-inner diary-focus"
        />

        {query && (
          <button
            onClick={() => onQueryChange("")}
            aria-label="Clear search input"
            className="absolute right-3 p-1.5 rounded-lg text-[#887463] hover:text-[#2A1D15] hover:bg-[#EFE5D5] transition-colors diary-focus active:scale-95"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Quick Tags */}
      {suggestions.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-[#E8DFC9] flex flex-wrap items-center gap-2">
          <span className="text-xs font-serif italic text-[#887564] flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-[#B89360]" />
            <span>Popular tags:</span>
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSelectSuggestion?.(s)}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#EFE5D5] hover:bg-[#E5D7BE] text-[#4A3728] border border-[#DAC8AF] transition-colors font-mono"
            >
              #{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
