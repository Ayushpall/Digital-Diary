"use client";

import React from "react";
import Link from "next/link";
import { DiaryStatsData } from "@/types/dashboard";
import {
  Flame,
  FileText,
  BookMarked,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface DiaryStatsProps {
  stats: DiaryStatsData;
}

export function DiaryStats({ stats }: DiaryStatsProps) {
  const statItems = [
    {
      id: "entries",
      label: "Total Entries",
      value: stats.totalEntries,
      suffix: "memories",
      icon: BookMarked,
      desc: "Recorded thoughts & moments",
      accent: "text-[#B89360]",
    },
    {
      id: "streak",
      label: "Writing Streak",
      value: stats.streakDays,
      suffix: "days in a row",
      icon: Flame,
      desc: "Consistent daily journaling",
      accent: "text-[#C7603B]",
    },
    {
      id: "pages",
      label: "Pages Written",
      value: stats.pagesWritten,
      suffix: "leaves bound",
      icon: FileText,
      desc: "Filled across your volumes",
      accent: "text-[#4A7352]",
    },
  ];

  return (
    <section className="mt-12 mb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl sm:text-2xl text-[#261A13] font-normal">
          Diary Statistics
        </h2>
        <span className="text-xs font-serif italic text-[#8B7868]">
          Quiet milestones along your journey
        </span>
      </div>

      {/* Live Habit & Study Productivity Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Habit summary card */}
        <Link
          href="/features/habits"
          className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs hover:border-[#B89360] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7969]">
                <CheckCircle2 className="w-4 h-4 text-[#4A7352]" />
                <span>Habits Today</span>
              </div>
              <span className="text-xs font-serif font-medium text-[#B89360] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Open Tracker <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-serif text-2xl sm:text-3xl text-[#241912] font-normal tracking-tight">
                {stats.habitsSummary?.completed ?? 0} / {stats.habitsSummary?.total ?? 0} completed
              </span>
              <span className="text-sm font-serif font-semibold text-[#4A7352]">
                {stats.habitsSummary?.percentage ?? 0}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EAE0CF] overflow-hidden">
              <div
                className="h-full bg-[#4A7352] rounded-full transition-all duration-500"
                style={{ width: `${stats.habitsSummary?.percentage ?? 0}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-[#7C6A5A] font-light mt-3">
            Build routines, track consistency and maintain streaks.
          </p>
        </Link>

        {/* Study Planner Summary Card */}
        <Link
          href="/features/study-planner"
          className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs hover:border-[#B89360] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7969]">
                <GraduationCap className="w-4 h-4 text-[#8E6945]" />
                <span>Study Planner</span>
              </div>
              <span className="text-xs font-serif font-medium text-[#B89360] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Open Planner <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-serif text-2xl sm:text-3xl text-[#241912] font-normal tracking-tight">
                {stats.studySummary?.tasksDue ?? 0} {stats.studySummary?.tasksDue === 1 ? "task due" : "tasks due"}
              </span>
              <span className="text-xs font-serif italic text-[#8C7A6B]">
                {stats.studySummary?.upcomingExams ?? 0} upcoming {(stats.studySummary?.upcomingExams === 1 ? "exam" : "exams")}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#7C6A5A] font-light mt-3">
            Plan subjects, assignments, tasks and study sessions.
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statItems.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Subtle vintage watermark badge */}
              <div className="absolute top-4 right-4 text-[#DECDB8]/60 group-hover:text-[#DECDB8] transition-colors">
                <Icon className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#8A7969] block mb-2">
                  {st.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl text-[#241912] font-normal tracking-tight">
                    {st.value}
                  </span>
                  <span className="text-xs font-serif italic text-[#7C6A5A]">
                    {st.suffix}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8DFC9] flex items-center gap-1.5 text-xs text-[#7B695A] font-light">
                <Sparkles className={`w-3.5 h-3.5 ${st.accent}`} />
                <span>{st.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
