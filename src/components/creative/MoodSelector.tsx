"use client";

import React from "react";
import { DiaryMood, moodOptions } from "@/types/creative";
import { Smile } from "lucide-react";

interface MoodSelectorProps {
  selectedMood: DiaryMood;
  onSelectMood: (mood: DiaryMood) => void;
}

export function MoodSelector({
  selectedMood,
  onSelectMood,
}: MoodSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 bg-[#FAF6EE] p-1.5 rounded-xl border border-[#DECDB8] shadow-2xs">
      <div className="pl-1.5 pr-1 text-[#8C7A6B] hidden sm:flex items-center gap-1 text-xs">
        <Smile className="w-3.5 h-3.5 text-[#B89360]" />
        <span className="font-serif italic">Mood:</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {moodOptions.map((m) => {
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMood(m.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-serif transition-all ${
                isSelected
                  ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-xs scale-105"
                  : "text-[#5C4A3A] hover:bg-[#EFE5D5]"
              }`}
              title={`${m.label}`}
            >
              <span className="text-sm leading-none">{m.emoji}</span>
              <span className="hidden md:inline text-[11px]">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
