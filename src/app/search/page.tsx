"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SearchTimeframe } from "@/types/search";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { mockSearchEntries } from "@/lib/search-data";
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  PenTool, 
  Feather, 
  Sparkles 
} from "lucide-react";

export default function SearchPage() {
  // Pre-seed query with "startup" to immediately showcase the user's requested example
  const [query, setQuery] = useState("startup");
  const [activeFilter, setActiveFilter] = useState<SearchTimeframe>("all");

  // Filter entries based on query (title, content, date, tags, mood) and timeframe
  const filteredEntries = useMemo(() => {
    const q = query.toLowerCase().trim();

    return mockSearchEntries.filter((entry) => {
      // 1. Timeframe filter check
      if (activeFilter !== "all" && entry.timeframe !== activeFilter) {
        return false;
      }

      // If query is empty, match everything in the timeframe
      if (!q) return true;

      // 2. Search by title
      if (entry.title.toLowerCase().includes(q)) return true;

      // 3. Search by content
      if (entry.content.toLowerCase().includes(q)) return true;

      // 4. Search by date
      if (entry.date.toLowerCase().includes(q) || entry.dayOfWeek.toLowerCase().includes(q)) {
        return true;
      }

      // 5. Search by tags
      if (entry.tags.some((tag) => tag.toLowerCase().includes(q))) return true;

      // 6. Search by mood
      if (entry.mood.toLowerCase().includes(q) || entry.moodEmoji.includes(q)) {
        return true;
      }

      return false;
    });
  }, [query, activeFilter]);

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between">
      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE] border-b border-[#DECDB8] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#3D2C1F] border border-[#D8C7B0] text-xs font-serif transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Dashboard</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#DECDB8]">
            <div className="w-7 h-7 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif text-base text-[#281B13] font-normal leading-tight block">
                Memory Search
              </span>
              <span className="text-[10px] text-[#8C7A6B] font-mono leading-tight block uppercase tracking-wider">
                Local Journal Archive
              </span>
            </div>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/calendar"
            className="hidden md:inline-flex text-xs font-serif text-[#786657] hover:text-[#38261A] px-2.5 py-1.5"
          >
            Calendar
          </Link>

          <Link
            href="/diary/demo"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BF] text-[#422F22] border border-[#DAC9B1] text-xs font-serif transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="hidden sm:inline">Reading Room</span>
          </Link>

          <Link
            href="/editor/demo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
          >
            <PenTool className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>+ New Entry</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN SEARCH STAGE */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {/* Intro Tagline */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#261A13] font-normal tracking-tight mb-1">
            Search Your Past Reflections
          </h2>
          <p className="text-xs sm:text-sm text-[#736253] font-light">
            Instantly query all written memories by keywords, topics, moods, or calendar dates.
          </p>
        </div>

        {/* Search Bar with Popular Tag Suggestions */}
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          suggestions={["startup", "ideas", "coffee", "rain", "books", "nature"]}
          onSelectSuggestion={(s) => setQuery(s)}
        />

        {/* Results List with Timeframe Filtering & Highlighted Words */}
        <SearchResults
          entries={filteredEntries}
          totalCount={mockSearchEntries.length}
          query={query}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </main>

      {/* 3. FOOTER */}
      <footer className="hidden md:block bg-[#FAF6EE] border-t border-[#DECDB8] px-4 py-3 text-center text-xs font-serif italic text-[#887463]">
        Digital Diary • Local In-Browser Search • Zero Remote Queries
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
