"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarEntry } from "@/components/calendar/CalendarEntry";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { mockCalendarEntries } from "@/lib/calendar-data";
import { CalendarEntryData } from "@/types/calendar";
import { 
  ArrowLeft, 
  BookOpen, 
  PenTool, 
  Feather, 
  Calendar as CalendarIcon, 
  Sparkles 
} from "lucide-react";

export default function CalendarPage() {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Format today's date key YYYY-MM-DD
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const [currentDate, setCurrentDate] = useState<Date>(now);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [calendarEntries, setCalendarEntries] = useState<Record<string, CalendarEntryData[]>>({});

  const loadEntries = () => {
    if (!isSignedIn) {
      // Unauthenticated demo visitors can explore mock calendar entries
      const normalizedMock: Record<string, CalendarEntryData[]> = {};
      Object.entries(mockCalendarEntries).forEach(([k, v]) => {
        normalizedMock[k] = [v];
      });
      setCalendarEntries(normalizedMock);
      setSelectedDateKey("2026-09-18");
      setCurrentDate(new Date(2026, 8, 18));
      return;
    }

    // Authenticated user: fetch actual entries from database
    fetch("/api/entries")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.entries && data.entries.length > 0) {
          const map: Record<string, CalendarEntryData[]> = {};
          data.entries.forEach((e: any) => {
            const d = new Date(e.date);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            const item: CalendarEntryData = {
              id: e.id,
              dateKey,
              dateFormatted: d.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
              title: e.title,
              content: e.content,
              moodEmoji: e.mood ? "✨" : "☕",
              moodLabel: e.mood || "Reflective",
              inkColor: "midnight",
              diaryName: e.diaryTitle || "My Journal",
              wordCount: e.content ? e.content.trim().split(/\s+/).length : 0,
            };
            if (!map[dateKey]) {
              map[dateKey] = [];
            }
            map[dateKey].push(item);
          });
          setCalendarEntries(map);

          // If current selected date has no entry but there's a recent entry, select that date
          const firstKey = Object.keys(map)[0];
          if (firstKey) {
            setSelectedDateKey(firstKey);
            const [y, m] = firstKey.split("-");
            setCurrentDate(new Date(parseInt(y), parseInt(m) - 1, 1));
          }
        } else {
          // Fresh user with 0 entries
          setCalendarEntries({});
        }
      })
      .catch((err) => console.error("Error fetching calendar entries:", err));
  };

  useEffect(() => {
    if (!isLoaded) return;
    loadEntries();

    const handleDataChange = () => {
      loadEntries();
    };

    window.addEventListener("diary-data-changed", handleDataChange);
    return () => {
      window.removeEventListener("diary-data-changed", handleDataChange);
    };
  }, [isSignedIn, isLoaded]);

  // Format the selected date for display
  const getFormattedSelectedDate = (dateKey: string) => {
    const parts = dateKey.split("-");
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
    }
    return dateKey;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setCurrentDate(today);
    setSelectedDateKey(key);
  };

  const handleSelectDate = (dateKey: string, dateObj: Date) => {
    setSelectedDateKey(dateKey);
    if (dateObj.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(dateObj);
    }
  };

  const selectedEntries = calendarEntries[selectedDateKey] || [];
  const selectedEntry = selectedEntries[0] || null;

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between">
      {/* Top Header Navigation */}
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
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif text-base text-[#281B13] font-normal leading-tight block">
                Memory Calendar
              </span>
              <span className="text-[10px] text-[#8C7A6B] font-mono leading-tight block uppercase tracking-wider">
                Digital Diary Timeline
              </span>
            </div>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
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

      {/* Main Calendar Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Monthly Calendar View (7 cols on lg) */}
          <div className="lg:col-span-7">
            <CalendarView
              currentDate={currentDate}
              selectedDateKey={selectedDateKey}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onGoToday={handleGoToday}
              entriesMap={calendarEntries}
            />
          </div>

          {/* Right Column: Selected Day's Diary Entry (5 cols on lg) */}
          <div className="lg:col-span-5" id="entry-detail-card">
            <CalendarEntry
              entry={selectedEntry}
              entries={selectedEntries}
              selectedDateKey={selectedDateKey}
              selectedDateStr={getFormattedSelectedDate(selectedDateKey)}
            />
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="hidden md:block bg-[#FAF6EE] border-t border-[#DECDB8] px-4 py-3 text-center text-xs font-serif italic text-[#887463]">
        Digital Diary • Memory Calendar • Every day holds a quiet reflection
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
