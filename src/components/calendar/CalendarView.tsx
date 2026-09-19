"use client";

import React from "react";
import { CalendarEntryData } from "@/types/calendar";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Calendar as CalendarIcon,
  Sparkles
} from "lucide-react";

interface CalendarViewProps {
  currentDate: Date;
  selectedDateKey: string;
  onSelectDate: (dateKey: string, dateObj: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  entriesMap: Record<string, CalendarEntryData>;
}

export function CalendarView({
  currentDate,
  selectedDateKey,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  entriesMap,
}: CalendarViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    currentDate
  );

  // Calculate days in month & starting day of week
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Weekdays
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Check if today matches a cell
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  // Build grid calendar cells
  const cells: {
    dayNumber: number;
    isCurrentMonth: boolean;
    dateKey: string;
    dateObj: Date;
  }[] = [];

  // 1. Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const m = prevMonthDate.getMonth() + 1;
    const key = `${prevMonthDate.getFullYear()}-${String(m).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    cells.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateKey: key,
      dateObj: prevMonthDate,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    cells.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateKey: key,
      dateObj: currDate,
    });
  }

  // 3. Next month leading days to complete the 35 or 42 grid
  const remaining = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const m = nextMonthDate.getMonth() + 1;
    const key = `${nextMonthDate.getFullYear()}-${String(m).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    cells.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateKey: key,
      dateObj: nextMonthDate,
    });
  }

  return (
    <div className="bg-[#FAF6EE] rounded-2xl p-3.5 sm:p-6 md:p-7 border border-[#D8C7B0] shadow-md select-none">
      {/* Month Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-[#DECDB8]">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#8E7C6C] block">
            Memory Calendar
          </span>
          <h2 className="font-serif text-xl sm:text-3xl text-[#261A13] font-normal tracking-tight">
            {monthName} <span className="text-[#875837]">{year}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Today Button */}
          <button
            onClick={onGoToday}
            aria-label="Return to today in calendar"
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BE] text-[#423023] border border-[#DAC8B0] text-xs font-serif transition-colors shadow-2xs active:scale-95 touch-manipulation diary-focus"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Today</span>
          </button>

          {/* Previous / Next Month Arrows */}
          <div className="flex items-center rounded-xl bg-[#EFE5D5] p-1 border border-[#DAC8B0]">
            <button
              onClick={onPrevMonth}
              aria-label="Previous month"
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-[#554232] hover:bg-[#FAF5ED] transition-colors active:scale-95 touch-manipulation diary-focus"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextMonth}
              aria-label="Next month"
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-[#554232] hover:bg-[#FAF5ED] transition-colors active:scale-95 touch-manipulation diary-focus"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pt-3 sm:pt-4 pb-2 text-[11px] sm:text-xs font-serif italic text-[#8A7868]">
        {weekDays.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Monthly Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((cell, idx) => {
          const hasEntry = Boolean(entriesMap[cell.dateKey]);
          const entry = entriesMap[cell.dateKey];
          const isSelected = selectedDateKey === cell.dateKey;
          const isToday = todayKey === cell.dateKey;

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(cell.dateKey, cell.dateObj)}
              className={`min-h-[50px] sm:min-h-[64px] p-1 sm:p-2 rounded-xl border transition-all flex flex-col justify-between text-left relative group touch-manipulation active:scale-95 ${
                isSelected
                  ? "bg-[#38261A] text-[#FAF5ED] border-[#483324] shadow-md scale-[1.02] z-10"
                  : cell.isCurrentMonth
                  ? "bg-[#FAF5ED] hover:bg-[#F2E8D8] text-[#2C1F16] border-[#E5D7C2]"
                  : "bg-[#F5EFE4]/60 text-[#B09F8E] border-transparent opacity-60"
              }`}
            >
              {/* Top: Day Number & Today indicator */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-serif text-xs sm:text-base leading-none ${
                    isToday && !isSelected
                      ? "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E5C78B] text-[#281A12] flex items-center justify-center font-bold text-xs"
                      : ""
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {/* Entry Visual Indicator badge */}
                {hasEntry && (
                  <span
                    className={`text-xs ${
                      isSelected ? "scale-110" : "group-hover:scale-110"
                    } transition-transform`}
                    title={`${entry.moodLabel}: ${entry.title}`}
                  >
                    {entry.moodEmoji}
                  </span>
                )}
              </div>

              {/* Bottom: Entry snippet or ink dot */}
              {hasEntry ? (
                <div className="w-full flex items-center justify-between mt-1">
                  <span
                    className={`text-[10px] font-serif italic truncate max-w-[85%] hidden sm:inline ${
                      isSelected ? "text-[#E5C78B]" : "text-[#7A6655]"
                    }`}
                  >
                    {entry.title}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-[#E5C78B]" : "bg-[#B89360]"
                    } ml-auto sm:ml-0`}
                  />
                </div>
              ) : (
                <div className="h-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Help hint */}
      <div className="mt-5 pt-4 border-t border-[#DECDB8] flex flex-wrap items-center justify-between gap-3 text-xs font-serif italic text-[#8A7969]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B89360]" />
            <span>Has Entry</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-xs">😊 🔥 😔</span>
            <span>Mood recorded</span>
          </span>
        </div>
        <span>Click any date to inspect page</span>
      </div>
    </div>
  );
}
