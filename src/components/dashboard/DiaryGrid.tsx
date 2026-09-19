"use client";

import React from "react";
import { BookOpen, Plus, Clock, Bookmark, ChevronRight } from "lucide-react";
import { DiaryCardData } from "@/types/dashboard";

interface DiaryGridProps {
  diaries: DiaryCardData[];
  onOpenDiary?: (diaryId: string) => void;
  onCreateDiary?: () => void;
}

export function DiaryGrid({
  diaries,
  onOpenDiary,
  onCreateDiary,
}: DiaryGridProps) {
  const getCoverStyles = (color: DiaryCardData["coverColor"]) => {
    switch (color) {
      case "forest":
        return {
          bg: "bg-[#25392B]",
          border: "border-[#38523F]",
          ribbon: "bg-[#7BA082]",
          accent: "text-[#D3E4D6]",
        };
      case "burgundy":
        return {
          bg: "bg-[#3D1E24]",
          border: "border-[#572B33]",
          ribbon: "bg-[#9E5764]",
          accent: "text-[#EBD3D7]",
        };
      case "navy":
        return {
          bg: "bg-[#1E2B3D]",
          border: "border-[#2B3E57]",
          ribbon: "bg-[#5677A3]",
          accent: "text-[#D2E0F2]",
        };
      case "leather":
      default:
        return {
          bg: "bg-[#38261A]",
          border: "border-[#523B2A]",
          ribbon: "bg-[#C49E4F]",
          accent: "text-[#FAF5ED]",
        };
    }
  };

  return (
    <section id="diaries-section" className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#261A13] font-normal">
            My Diaries
          </h2>
          <p className="text-xs text-[#7A6756] font-light">
            Your bound collections of memories and musings
          </p>
        </div>
        <button
          onClick={onCreateDiary}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-serif text-[#663E24] hover:text-[#3B2313] font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {diaries.map((diary) => {
          const style = getCoverStyles(diary.coverColor);
          return (
            <div
              key={diary.id}
              onClick={() => onOpenDiary?.(diary.id)}
              className="group cursor-pointer rounded-2xl p-5 bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs hover:shadow-md hover:border-[#C4B29A] transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Miniature Notebook Cover Preview */}
              <div
                className={`w-full h-32 rounded-xl ${style.bg} border ${style.border} p-3.5 flex flex-col justify-between relative shadow-inner overflow-hidden group-hover:scale-[1.02] transition-transform`}
              >
                {/* Ribbon bookmark sticking down from the top edge */}
                <div
                  className={`absolute -top-1 right-6 w-3 h-10 ${style.ribbon} shadow-sm ribbon-tail`}
                />

                {/* Left side book spine stitch visual */}
                <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/15" />
                <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-black/30" />

                <div className="pl-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 text-[#FAF5ED]">
                    VOL. {diary.id.slice(-1)}
                  </span>
                  <h4 className="font-serif text-base text-[#FAF5ED] font-normal tracking-tight line-clamp-1 mt-0.5">
                    {diary.title}
                  </h4>
                </div>

                <div className="pl-3 flex items-center justify-between text-[11px] opacity-80 text-[#FAF5ED]">
                  <span className="font-mono">{diary.entriesCount} entries</span>
                  <span className="font-serif italic">Open book →</span>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-[#261A13] font-medium mb-1 line-clamp-1">
                    {diary.title}
                  </h3>
                  {diary.description && (
                    <p className="text-xs text-[#6B5A4B] font-light line-clamp-2 mb-3">
                      {diary.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E8DFC9] flex items-center justify-between text-xs text-[#826F5E]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#A89481]" />
                    <span>Last entry: {diary.lastEntry}</span>
                  </div>
                  <span className="text-[#3B2618] font-medium group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* "Create New Diary" Card */}
        <button
          onClick={onCreateDiary}
          className="rounded-2xl p-6 border-2 border-dashed border-[#CFBEA5] hover:border-[#967C5C] bg-[#F7F2E7]/70 hover:bg-[#F4EDE0] transition-all flex flex-col items-center justify-center text-center group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#EAE0CD] group-hover:bg-[#38261A] text-[#554030] group-hover:text-[#FAF5ED] flex items-center justify-center border border-[#D5C5AC] mb-3 transition-colors shadow-2xs">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#281C15] font-medium mb-1">
            Create New Diary
          </h3>
          <p className="text-xs text-[#736253] font-light max-w-[180px] leading-relaxed">
            Start a new dedicated journal with custom paper & cover style.
          </p>
        </button>
      </div>
    </section>
  );
}
