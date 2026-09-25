"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  BookOpen,
  Check,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface FeaturesStats {
  habits: {
    total: number;
    completedToday: number;
    streak: number;
  };
  study: {
    tasksDue: number;
    completed: number;
    studyTime: string;
  };
}

export default function FeaturesPage() {
  const { isSignedIn } = useAuth();
  const [stats, setStats] = useState<FeaturesStats>({
    habits: { total: 0, completedToday: 0, streak: 0 },
    study: { tasksDue: 0, completed: 0, studyTime: "0m" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [habitsRes, studyRes] = await Promise.all([
          fetch("/api/habits"),
          fetch("/api/study/tasks"),
        ]);

        let hStats = { total: 0, completedToday: 0, streak: 0 };
        let sStats = { tasksDue: 0, completed: 0, studyTime: "0m" };

        if (habitsRes.ok) {
          const hData = await habitsRes.json();
          if (hData.stats) {
            hStats = {
              total: hData.stats.totalHabits ?? 0,
              completedToday: hData.stats.todayCompletedCount ?? 0,
              streak: hData.stats.currentStreak ?? 0,
            };
          }
        }

        if (studyRes.ok) {
          const sData = await studyRes.json();
          if (sData.stats) {
            sStats = {
              tasksDue: sData.stats.tasksDue ?? 0,
              completed: sData.stats.tasksCompleted ?? 0,
              studyTime: sData.stats.studyTimeFormatted || "0m",
            };
          }
        }

        setStats({ habits: hStats, study: sStats });
      } catch (err) {
        console.error("Failed to load feature stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isSignedIn]);

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
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif text-base text-[#281B13] font-normal leading-tight block">
                Features Hub
              </span>
              <span className="text-[10px] text-[#8C7A6B] font-mono leading-tight block uppercase tracking-wider">
                Productivity & Study Companion
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BF] text-[#422F22] border border-[#DAC9B1] text-xs font-serif transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="hidden sm:inline">Calendar</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>My Journal</span>
          </Link>
        </div>
      </header>

      {/* Main Features Hub Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-24 md:pb-12">
        {/* Hub Title Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D5] text-[#554030] text-xs font-mono uppercase tracking-wider mb-3 border border-[#DDD0BC]">
            <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Companion Tools</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#261A13] font-normal mb-3 tracking-tight">
            Features
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#6C594A]">
            Tools for building a better everyday life.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* 1. Habit Tracker Card */}
          <div className="rounded-2xl bg-[#FAF6EE] border border-[#DECDB8] shadow-2xs hover:shadow-md transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden">
            {/* Top decorative badge */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#EFE6D6]/40 pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#3D2C1F] text-[#FAF5ED] flex items-center justify-center shadow-xs border border-[#553E2D] group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-[#E5C78B]" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A7969] px-2.5 py-1 rounded-md bg-[#EFE6D6] border border-[#DECDB8]">
                  Routine & Discipline
                </span>
              </div>

              <h2 className="font-serif text-2xl text-[#261A13] font-medium mb-2 group-hover:text-[#8E6945] transition-colors">
                Habit Tracker
              </h2>

              <p className="text-sm text-[#6C594A] font-light leading-relaxed mb-6">
                Build routines, track consistency and maintain streaks. Track daily, weekly, and monthly commitments with visual calendars.
              </p>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[#554335] border border-[#E0D1BF]">
                  <Check className="w-3 h-3 text-[#B89360]" /> Daily, Weekly & Monthly
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[#554335] border border-[#E0D1BF]">
                  <Flame className="w-3 h-3 text-[#C7603B]" /> Auto-calculated Streaks
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[#554335] border border-[#E0D1BF]">
                  <Layers className="w-3 h-3 text-[#4A7352]" /> Monthly Grid View
                </span>
              </div>

              {/* Mini-stat block */}
              <div className="p-4 rounded-xl bg-[#F5EFE4] border border-[#E2D5C0] mb-6">
                <div className="flex items-center justify-between text-xs text-[#7A695B] mb-1 font-serif">
                  <span>Current Progress</span>
                  {stats.habits.streak > 0 && (
                    <span className="inline-flex items-center gap-1 font-mono text-[#C7603B] font-semibold">
                      <Flame className="w-3 h-3" /> {stats.habits.streak} day streak
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-xl text-[#281B12]">
                    {stats.habits.total > 0
                      ? `${stats.habits.completedToday} of ${stats.habits.total} completed today`
                      : "0 active habits"}
                  </span>
                  <span className="text-xs font-mono text-[#8C7A6B]">
                    {stats.habits.total > 0
                      ? `${Math.round((stats.habits.completedToday / stats.habits.total) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/features/habits"
              className="w-full py-3 px-4 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] font-serif font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 group-hover:shadow-md"
            >
              <span>Open Habit Tracker</span>
              <ArrowRight className="w-4 h-4 text-[#E5C78B] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 2. Study Planner Card */}
          <div className="rounded-2xl bg-[#FAF6EE] border border-[#DECDB8] shadow-2xs hover:shadow-md transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden">
            {/* Top decorative badge */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#EFE6D6]/40 pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#3D2C1F] text-[#FAF5ED] flex items-center justify-center shadow-xs border border-[#553E2D] group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6 text-[#E5C78B]" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A7969] px-2.5 py-1 rounded-md bg-[#EFE6D6] border border-[#DECDB8]">
                  Academic & Learning
                </span>
              </div>

              <h2 className="font-serif text-2xl text-[#261A13] font-medium mb-2 group-hover:text-[#8E6945] transition-colors">
                Study Planner
              </h2>

              <p className="text-sm text-[#6C594A] font-light leading-relaxed mb-6">
                Plan subjects, assignments, tasks and study sessions. Enter once and information synchronizes throughout your planner and calendar.
              </p>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[#554335] border border-[#E0D1BF]">
                  <BookOpen className="w-3 h-3 text-[#B89360]" /> Custom Subjects
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[#554335] border border-[#E0D1BF]">
                  <Calendar className="w-3 h-3 text-[#3B5B84]" /> Smart Study Calendar
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[#554335] border border-[#E0D1BF]">
                  <Clock className="w-3 h-3 text-[#4A7352]" /> Focus Study Sessions
                </span>
              </div>

              {/* Mini-stat block */}
              <div className="p-4 rounded-xl bg-[#F5EFE4] border border-[#E2D5C0] mb-6">
                <div className="flex items-center justify-between text-xs text-[#7A695B] mb-1 font-serif">
                  <span>Current Workload</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[#554030]">
                    <Clock className="w-3 h-3 text-[#B89360]" /> {stats.study.studyTime} completed
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-xl text-[#281B12]">
                    {stats.study.tasksDue} {stats.study.tasksDue === 1 ? "task due" : "tasks due"}
                  </span>
                  <span className="text-xs font-mono text-[#8C7A6B]">
                    {stats.study.completed} completed
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/features/study-planner"
              className="w-full py-3 px-4 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] font-serif font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 group-hover:shadow-md"
            >
              <span>Open Study Planner</span>
              <ArrowRight className="w-4 h-4 text-[#E5C78B] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Tactile Quote Footer Section */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#FAF6EE]/80 border border-[#E4D6C3] max-w-xl mx-auto">
          <p className="font-serif italic text-sm text-[#6B5A4B] leading-relaxed">
            &ldquo;Small daily disciplines accumulated over time lead to profound personal and intellectual growth.&rdquo;
          </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
