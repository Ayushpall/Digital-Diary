"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Plus,
  Flame,
  Trophy,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Check,
  Circle,
  X,
  Target,
  BarChart2,
  Tag,
  AlertCircle,
} from "lucide-react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { toDateKey } from "@/lib/habit-streaks";

interface HabitRecord {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  category: string;
  frequency: "daily" | "weekly" | "monthly" | string;
  targetCount: number;
  startDate: string;
  isActive: boolean;
  isCompletedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  monthCompletionCount: number;
  completionKeys: string[];
}

interface HabitStats {
  totalHabits: number;
  todayCompletedCount: number;
  todayRemainingCount: number;
  todayProgressPercent: number;
  currentStreak: number;
  bestStreak: number;
  completedThisMonth: number;
  monthlyCompletionPercent: number;
  monthDayMap: Record<number, number>;
}

const CATEGORIES = [
  "Morning",
  "Afternoon",
  "Evening",
  "Health",
  "Study",
  "Fitness",
  "Mindfulness",
  "Personal",
  "Other",
];

const STARTER_TEMPLATES = [
  { name: "Morning Meditation", icon: "🧘", category: "Mindfulness", frequency: "daily" },
  { name: "Drink 2L Water", icon: "💧", category: "Health", frequency: "daily" },
  { name: "Read 20 Minutes", icon: "📖", category: "Personal", frequency: "daily" },
  { name: "Study DSA", icon: "💻", category: "Study", frequency: "daily" },
  { name: "Evening Workout", icon: "🏃", category: "Fitness", frequency: "daily" },
];

export default function HabitTrackerPage() {
  const { isSignedIn, isLoaded } = useAuth();

  const [habits, setHabits] = useState<HabitRecord[]>([]);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    todayCompletedCount: 0,
    todayRemainingCount: 0,
    todayProgressPercent: 0,
    currentStreak: 0,
    bestStreak: 0,
    completedThisMonth: 0,
    monthlyCompletionPercent: 0,
    monthDayMap: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Month navigation for Month View
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Add Habit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitIcon, setHabitIcon] = useState("✨");
  const [habitCategory, setHabitCategory] = useState("Morning");
  const [habitFrequency, setHabitFrequency] = useState("daily");
  const [habitTarget, setHabitTarget] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [habitToDelete, setHabitToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHabits = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/habits");
      if (!res.ok) {
        throw new Error("Failed to load habits");
      }
      const data = await res.json();
      setHabits(data.habits || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error("Habits fetch error:", err);
      setError(err.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      fetchHabits();
    }
  }, [isLoaded, fetchHabits]);

  // Toggle habit completion on a given date key (defaults to today)
  const handleToggleCompletion = async (habitId: string, dateStr?: string) => {
    const targetDateStr = dateStr || toDateKey(new Date());

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completionKeys.includes(targetDateStr);
        const newKeys = exists
          ? h.completionKeys.filter((k) => k !== targetDateStr)
          : [...h.completionKeys, targetDateStr];

        return {
          ...h,
          isCompletedToday: targetDateStr === toDateKey(new Date()) ? !exists : h.isCompletedToday,
          completionKeys: newKeys,
          monthCompletionCount: exists
            ? Math.max(0, h.monthCompletionCount - 1)
            : h.monthCompletionCount + 1,
        };
      })
    );

    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: targetDateStr }),
      });

      if (!res.ok) {
        throw new Error("Failed to save habit progress");
      }

      // Refresh to ensure exact synchronized streak numbers
      await fetchHabits();
    } catch (err) {
      console.error("Completion toggle error:", err);
      // Revert on error
      await fetchHabits();
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) {
      setFormError("Habit name is required");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: habitName.trim(),
          description: habitDescription.trim() || undefined,
          icon: habitIcon.trim() || "✨",
          category: habitCategory,
          frequency: habitFrequency,
          targetCount: Number(habitTarget) || 1,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to create habit" }));
        throw new Error(errorData.error || "Failed to create habit");
      }

      setModalOpen(false);
      setHabitName("");
      setHabitDescription("");
      setHabitIcon("✨");
      setHabitCategory("Morning");
      setHabitFrequency("daily");
      setHabitTarget(1);
      await fetchHabits();
    } catch (err: any) {
      setFormError(err.message || "Failed to save habit");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStarterTemplate = async (template: (typeof STARTER_TEMPLATES)[0]) => {
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          icon: template.icon,
          category: template.category,
          frequency: template.frequency,
          targetCount: 1,
        }),
      });
      if (res.ok) {
        await fetchHabits();
      }
    } catch (err) {
      console.error("Template add error:", err);
    }
  };

  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/habits/${habitToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHabitToDelete(null);
        await fetchHabits();
      }
    } catch (err) {
      console.error("Delete habit error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };
  const handleCurrentMonth = () => {
    setCurrentMonthDate(new Date());
  };

  const monthYearStr = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const currentMonthNum = currentMonthDate.getMonth();
  const currentYearNum = currentMonthDate.getFullYear();
  const daysInCurrentMonth = new Date(currentYearNum, currentMonthNum + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  const today = new Date();
  const isSelectedCurrentMonth =
    today.getFullYear() === currentYearNum && today.getMonth() === currentMonthNum;
  const todayDayNum = today.getDate();

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    if (selectedCategory === "All") return true;
    return h.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE] border-b border-[#DECDB8] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#3D2C1F] border border-[#D8C7B0] text-xs font-serif transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Features</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#DECDB8]">
            <div className="w-7 h-7 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif text-base text-[#281B13] font-normal leading-tight block">
                Habit Tracker
              </span>
              <span className="text-[10px] text-[#8C7A6B] font-mono leading-tight block uppercase tracking-wider">
                Digital Diary Routines
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>+ Add Habit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-8 py-6 sm:py-10 pb-24 md:pb-12">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#261A13] font-normal mb-1.5">
              Habit Tracker
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#7C6A5A]">
              &ldquo;Small routines, meaningful change.&rdquo;
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-colors whitespace-nowrap ${
                selectedCategory === "All"
                  ? "bg-[#38261A] text-[#FAF5ED] font-medium"
                  : "bg-[#FAF6EE] text-[#6E5D4E] hover:bg-[#EFE5D5] border border-[#DDD0BC]"
              }`}
            >
              All Habits
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#38261A] text-[#FAF5ED] font-medium"
                    : "bg-[#FAF6EE] text-[#6E5D4E] hover:bg-[#EFE5D5] border border-[#DDD0BC]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top 4 Key Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
          {/* Card 1: Today's Progress */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Today&apos;s Progress</span>
              <Target className="w-4 h-4 text-[#B89360]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif text-3xl text-[#241912]">
                  {stats.todayCompletedCount} / {stats.totalHabits}
                </span>
                <span className="text-xs font-serif italic text-[#4A7352]">
                  ({stats.todayProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#EAE0CF] overflow-hidden">
                <div
                  className="h-full bg-[#4A7352] rounded-full transition-all duration-500"
                  style={{ width: `${stats.todayProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Current Streak */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Current Streak</span>
              <Flame className="w-4 h-4 text-[#C7603B]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-[#241912]">{stats.currentStreak}</span>
                <span className="text-xs font-serif italic text-[#7C6A5A]">
                  {stats.currentStreak === 1 ? "day" : "days"}
                </span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">
                Consecutive days maintained
              </p>
            </div>
          </div>

          {/* Card 3: Best Streak */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Best Streak</span>
              <Trophy className="w-4 h-4 text-[#D8B97C]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-[#241912]">{stats.bestStreak}</span>
                <span className="text-xs font-serif italic text-[#7C6A5A]">
                  {stats.bestStreak === 1 ? "day record" : "days record"}
                </span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">All-time personal high</p>
            </div>
          </div>

          {/* Card 4: Completed This Month */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Completed This Month</span>
              <CheckCircle2 className="w-4 h-4 text-[#4A7352]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-[#241912]">
                  {stats.completedThisMonth}
                </span>
                <span className="text-xs font-serif italic text-[#7C6A5A]">total check-ins</span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">
                {stats.monthlyCompletionPercent}% consistency rate
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: TODAY'S TRACKING CHECKLIST */}
        <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7 mb-8">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E8DEC9]">
            <div>
              <h2 className="font-serif text-xl text-[#241912] font-medium flex items-center gap-2">
                <span>Today&apos;s Checklist</span>
                <span className="text-xs font-mono text-[#8C7A6B] bg-[#EFE6D6] px-2 py-0.5 rounded-full">
                  {today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </h2>
              <p className="text-xs text-[#7A695B] font-light mt-0.5">
                Click any habit to mark complete or undo
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-serif text-[#B89360] hover:text-[#38261A] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Habit</span>
            </button>
          </div>

          {filteredHabits.length === 0 ? (
            /* Empty State (New User Experience) */
            <div className="text-center py-10 px-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EFE6D6] text-[#8C7A6B] flex items-center justify-center mx-auto mb-3 border border-[#DACBB6]">
                <Target className="w-7 h-7 text-[#B89360]" />
              </div>
              <h3 className="font-serif text-lg text-[#281B13] font-medium mb-1">
                Create your first habit
              </h3>
              <p className="text-xs text-[#7A695B] font-light max-w-md mx-auto mb-6 leading-relaxed">
                Consistency begins with a single gentle step. Start tracking your daily, weekly, or monthly rituals.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif font-medium shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#E5C78B]" />
                <span>+ Create Your First Habit</span>
              </button>

              {/* Starter Templates Picker */}
              <div className="mt-8 pt-6 border-t border-[#E8DEC9]/80 max-w-lg mx-auto">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A7969] block mb-3">
                  Or pick a starter routine:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {STARTER_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.name}
                      onClick={() => handleAddStarterTemplate(tpl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5EDE1] hover:bg-[#ECE0D0] text-[#422F22] text-xs font-serif border border-[#D8C7B0] transition-colors"
                    >
                      <span>{tpl.icon}</span>
                      <span>{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Habit Checklist */
            <div className="space-y-3">
              {filteredHabits.map((habit) => {
                const isCompleted = habit.isCompletedToday;
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleCompletion(habit.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      isCompleted
                        ? "bg-[#F3EFE6] border-[#D0C2AE] opacity-90"
                        : "bg-[#FAF5ED] hover:bg-[#F8F2E6] border-[#E0D3C1] hover:border-[#B89360]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Checkbox indicator */}
                      <button
                        type="button"
                        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-[#4A7352] text-[#FAF5ED] border border-[#3E6145] shadow-2xs"
                            : "bg-[#FAF6EE] border-2 border-[#CBB8A2] group-hover:border-[#8E6945] text-transparent"
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      {/* Icon */}
                      <span className="text-xl select-none">{habit.icon || "✨"}</span>

                      {/* Name & Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-serif text-sm font-medium truncate ${
                              isCompleted
                                ? "text-[#5C4D40] line-through decoration-[#8C7A6B]/60"
                                : "text-[#241912]"
                            }`}
                          >
                            {habit.name}
                          </h4>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7969] px-2 py-0.5 rounded bg-[#EFE6D6]">
                            {habit.category}
                          </span>
                        </div>
                        {habit.description && (
                          <p className="text-xs text-[#7A695B] font-light truncate mt-0.5">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Streak & Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {habit.currentStreak > 0 && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE6D6] text-xs font-mono text-[#C7603B] font-medium border border-[#D8C7B0]">
                          <Flame className="w-3.5 h-3.5" />
                          <span>{habit.currentStreak}d</span>
                        </div>
                      )}

                      <button
                        onClick={() => setHabitToDelete({ id: habit.id, name: habit.name })}
                        className="p-1.5 rounded-lg text-[#9B897A] hover:text-[#A84A3B] hover:bg-[#EFE6D6] transition-colors"
                        title="Delete Habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: MONTH VIEW TRACKER (Inspired by Reference Grid) */}
        <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#E8DEC9]">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-5 h-5 text-[#B89360]" />
              <div>
                <h2 className="font-serif text-xl text-[#241912] font-medium">Monthly Consistency Matrix</h2>
                <p className="text-xs text-[#7A695B] font-light">Visual matrix for all tracked habits</p>
              </div>
            </div>

            {/* Month Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-[#DDD0BC] bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#5C4B3D] transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-serif text-sm text-[#281B13] font-medium min-w-[130px] text-center">
                {monthYearStr}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-[#DDD0BC] bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#5C4B3D] transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {!isSelectedCurrentMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="px-2.5 py-1 rounded-lg text-xs font-serif bg-[#38261A] text-[#FAF5ED] hover:bg-[#483324] transition-colors"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {filteredHabits.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#8C7A6B] font-serif italic">
              No habits to display in the monthly tracker yet.
            </div>
          ) : (
            /* Responsive Horizontal Scrolling Grid */
            <div className="overflow-x-auto pb-3">
              <div className="min-w-[760px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#DECDB8] text-[11px] font-mono text-[#7A695B]">
                      <th className="text-left py-2.5 px-3 font-medium sticky left-0 bg-[#FAF6EE] z-10 w-48 shadow-[2px_0_4px_rgba(40,25,15,0.03)]">
                        Habit
                      </th>
                      {daysArray.map((dayNum) => {
                        const isToday = isSelectedCurrentMonth && dayNum === todayDayNum;
                        return (
                          <th
                            key={dayNum}
                            className={`py-2 px-1 text-center font-normal min-w-[26px] ${
                              isToday ? "bg-[#38261A] text-[#FAF5ED] rounded-t-md font-semibold" : ""
                            }`}
                          >
                            {dayNum}
                          </th>
                        );
                      })}
                      <th className="py-2 px-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE5D5]">
                    {filteredHabits.map((habit) => {
                      let habitMonthCompletions = 0;
                      return (
                        <tr key={habit.id} className="hover:bg-[#F5EFE4]/60 transition-colors">
                          {/* Sticky Habit Name Column */}
                          <td className="py-2.5 px-3 sticky left-0 bg-[#FAF6EE] z-10 shadow-[2px_0_4px_rgba(40,25,15,0.03)]">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{habit.icon || "✨"}</span>
                              <span className="font-serif text-xs font-medium text-[#291D15] truncate max-w-[140px]">
                                {habit.name}
                              </span>
                            </div>
                          </td>

                          {/* Day check columns */}
                          {daysArray.map((dayNum) => {
                            const dateKey = `${currentYearNum}-${String(currentMonthNum + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                            const isCompleted = habit.completionKeys.includes(dateKey);
                            const isToday = isSelectedCurrentMonth && dayNum === todayDayNum;

                            if (isCompleted) habitMonthCompletions += 1;

                            return (
                              <td
                                key={dayNum}
                                className={`py-1.5 px-1 text-center ${
                                  isToday ? "bg-[#38261A]/5" : ""
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleToggleCompletion(habit.id, dateKey)}
                                  title={`${habit.name} - ${dateKey}`}
                                  className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-all ${
                                    isCompleted
                                      ? "bg-[#4A7352] text-[#FAF5ED] shadow-2xs scale-100"
                                      : "text-[#D2C3AF] hover:text-[#8E6945] hover:bg-[#EAE0CF]/60"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#DECDB8]" />
                                  )}
                                </button>
                              </td>
                            );
                          })}

                          {/* Total completions column */}
                          <td className="py-2.5 px-3 text-right font-mono text-xs font-medium text-[#291D15]">
                            {habitMonthCompletions}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: MONTHLY COMPLETION ACTIVITY OVERVIEW */}
        <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8DEC9]">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#B89360]" />
              <h2 className="font-serif text-lg text-[#241912] font-medium">Daily Consistency Graph</h2>
            </div>
            <span className="text-xs font-mono text-[#8C7A6B]">{monthYearStr}</span>
          </div>

          {/* Simple Clean Bar Distribution */}
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-31 gap-1 items-end h-28 border-b border-[#DECDB8] pb-1">
              {daysArray.map((dayNum) => {
                const count = stats.monthDayMap[dayNum] || 0;
                const max = Math.max(1, stats.totalHabits);
                const heightPercent = Math.min(100, Math.round((count / max) * 100));
                const isToday = isSelectedCurrentMonth && dayNum === todayDayNum;

                return (
                  <div key={dayNum} className="flex flex-col items-center h-full justify-end group">
                    <div
                      className={`w-full max-w-[14px] rounded-t-sm transition-all duration-300 ${
                        count > 0
                          ? isToday
                            ? "bg-[#38261A]"
                            : "bg-[#54805E] hover:bg-[#3E6145]"
                          : "bg-[#EAE0CF]/50"
                      }`}
                      style={{ height: count > 0 ? `${Math.max(12, heightPercent)}%` : "4px" }}
                      title={`Day ${dayNum}: ${count} completions`}
                    />
                    <span
                      className={`text-[9px] font-mono mt-1 ${
                        isToday ? "font-bold text-[#38261A]" : "text-[#8C7A6B]"
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#7A695B] font-serif pt-3">
              <span>Day 1 of {daysInCurrentMonth}</span>
              <span>Total completions this month: {stats.completedThisMonth}</span>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE HABIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#38261A] text-[#E5C78B] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#261A13] font-medium leading-tight">
                    Add New Habit
                  </h3>
                  <span className="text-xs text-[#7A695B] font-light">
                    Cultivate a recurring daily or weekly practice
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#7C6A5A] hover:bg-[#EFE6D6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-[#F7EBE8] text-[#8C3426] text-xs font-serif border border-[#ECCDC6] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Habit Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Read 20 Minutes"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] placeholder-[#A49383] text-sm focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Non-fiction, philosophy, or personal growth"
                  value={habitDescription}
                  onChange={(e) => setHabitDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] placeholder-[#A49383] text-sm focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Emoji / Icon
                  </label>
                  <input
                    type="text"
                    value={habitIcon}
                    onChange={(e) => setHabitIcon(e.target.value)}
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-center text-lg focus:outline-none focus:ring-1 focus:ring-[#8E6945]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Category
                  </label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Frequency
                  </label>
                  <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Target Goal
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={habitTarget}
                    onChange={(e) => setHabitTarget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8DEC9]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD0BC] bg-[#FAF5ED] text-[#5C4B3D] text-xs font-serif hover:bg-[#EFE5D5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif font-medium shadow-xs transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Create Habit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg text-[#261A13] font-medium mb-2">Delete Habit?</h3>
            <p className="text-xs text-[#7A695B] font-light leading-relaxed mb-5">
              Are you sure you want to remove &ldquo;{habitToDelete.name}&rdquo;? All completion history will be removed.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setHabitToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#DDD0BC] bg-[#FAF5ED] text-[#5C4B3D] text-xs font-serif"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHabit}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-xl bg-[#98382B] hover:bg-[#7D2E23] text-white text-xs font-serif font-medium shadow-2xs disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
