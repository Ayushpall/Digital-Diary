"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { SearchTimeframe, SearchableDiaryEntry } from "@/types/search";
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
  const { isSignedIn, isLoaded } = useAuth();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchTimeframe>("all");
  const [entries, setEntries] = useState<SearchableDiaryEntry[]>([]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // For guest demo mode, show mock entries and seed query
      setEntries(mockSearchEntries);
      setQuery("startup");
      return;
    }

    // Authenticated user: fetch actual entries from API
    fetch("/api/entries")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.entries && data.entries.length > 0) {
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          const mapped: SearchableDiaryEntry[] = data.entries.map((e: any) => {
            const d = new Date(e.date);
            let timeframe: "week" | "month" | "older" = "older";
            if (d >= oneWeekAgo) {
              timeframe = "week";
            } else if (d >= oneMonthAgo) {
              timeframe = "month";
            }

            // Extract tags or fallback
            const tags: string[] = ["journal", e.mood || "thought"];

            return {
              id: e.id,
              date: d.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
              title: e.title,
              content: e.content,
              tags,
              mood: e.mood || "Reflective",
              moodEmoji: e.mood === "happy" ? "😊" : "✨",
              diaryName: e.diaryTitle || "My Journal",
              timeframe,
            };
          });
          setEntries(mapped);
        } else {
          // Fresh user: clean empty state
          setEntries([]);
        }
      })
      .catch((err) => console.error("Error fetching search entries:", err));
  }, [isSignedIn, isLoaded]);

  // Filter entries based on query (title, content, date, tags, mood) and timeframe
  const filteredEntries = useMemo(() => {
    const q = query.toLowerCase().trim();

    return entries.filter((entry) => {
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
  }, [entries, query, activeFilter]);

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
