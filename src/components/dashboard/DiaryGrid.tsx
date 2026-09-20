import React from "react";
import { BookOpen, Plus, Clock, Bookmark, ChevronRight, Trash2 } from "lucide-react";
import { DiaryCardData } from "@/types/dashboard";
import { getCoverTheme } from "@/lib/cover-themes";

interface DiaryGridProps {
  diaries: DiaryCardData[];
  onOpenDiary?: (diaryId: string) => void;
  onCreateDiary?: () => void;
  onDeleteDiary?: (diaryId: string, diaryTitle: string) => void;
}

export function DiaryGrid({
  diaries,
  onOpenDiary,
  onCreateDiary,
  onDeleteDiary,
}: DiaryGridProps) {
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
          const theme = getCoverTheme(diary.coverColor);
          return (
            <div
              key={diary.id}
              onClick={() => onOpenDiary?.(diary.id)}
              className="group cursor-pointer rounded-2xl p-4 sm:p-5 bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs hover:shadow-md hover:border-[#C4B29A] transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Miniature Notebook Cover Preview */}
              <div
                className={`w-full h-36 rounded-xl ${theme.bgColor} border ${theme.borderColor} p-3.5 flex flex-col justify-between relative shadow-inner overflow-hidden group-hover:scale-[1.02] transition-transform`}
              >
                {/* Background Image if illustrated theme */}
                {theme.imageUrl ? (
                  <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={theme.imageUrl}
                      alt={theme.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
                  </div>
                ) : null}

                {/* Ribbon bookmark sticking down from top edge */}
                <div
                  className={`absolute -top-1 right-6 w-3 h-10 ${theme.ribbonColor} shadow-sm ribbon-tail z-10`}
                />

                {/* Left side book spine stitch visual */}
                <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/20 z-10" />
                <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-black/40 z-10" />

                <div className="pl-3 relative z-10">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-85 text-[#FAF5ED]">
                    VOL. {diary.id.slice(-1)}
                  </span>
                  <h4 className="font-serif text-base text-[#FAF5ED] font-medium tracking-tight line-clamp-1 mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {diary.title}
                  </h4>
                </div>

                <div className="pl-3 relative z-10 flex items-center justify-between text-[11px] opacity-90 text-[#FAF5ED]">
                  <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                    {diary.entriesCount} entries
                  </span>
                  <span className="font-serif italic text-xs">Open →</span>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg text-[#261A13] font-medium mb-1 line-clamp-1">
                      {diary.title}
                    </h3>
                    {onDeleteDiary && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDiary(diary.id, diary.title);
                        }}
                        className="opacity-60 group-hover:opacity-100 p-1 rounded-lg text-[#A68F7E] hover:text-[#B33939] hover:bg-[#F2DFDF] transition-all"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

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
