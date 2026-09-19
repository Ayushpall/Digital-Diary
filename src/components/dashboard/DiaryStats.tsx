"use client";

import React from "react";
import { DiaryStatsData } from "@/types/dashboard";
import { Flame, FileText, BookMarked, Sparkles } from "lucide-react";

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
