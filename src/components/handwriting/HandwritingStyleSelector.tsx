"use client";

import React from "react";
import { HandwritingStyleId } from "@/types/handwriting";
import { handwritingStyles } from "@/lib/handwriting-config";
import { Feather, Check } from "lucide-react";

interface HandwritingStyleSelectorProps {
  selectedStyle: HandwritingStyleId;
  onSelectStyle: (style: HandwritingStyleId) => void;
  layout?: "pills" | "cards";
}

export function HandwritingStyleSelector({
  selectedStyle,
  onSelectStyle,
  layout = "pills",
}: HandwritingStyleSelectorProps) {
  const stylesList = Object.values(handwritingStyles);

  if (layout === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stylesList.map((st) => {
          const isSelected = selectedStyle === st.id;
          return (
            <button
              key={st.id}
              onClick={() => onSelectStyle(st.id)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-[#38261A] text-[#FAF5ED] border-[#4D3525] shadow-sm scale-[1.02]"
                  : "bg-[#FAF6EE] text-[#342419] border-[#DDD0BC] hover:bg-[#F2E8D8]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                  {st.name}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#E5C78B]" />}
              </div>
              <p
                className={`text-2xl mb-1 ${st.fontFamilyClass}`}
                style={{ fontFamily: st.fontFamily }}
              >
                Today was a beautiful day.
              </p>
              <span
                className={`text-[11px] font-serif italic ${
                  isSelected ? "text-[#D8C7B0]" : "text-[#7C6958]"
                }`}
              >
                {st.description}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact Pills Layout
  return (
    <div className="inline-flex items-center gap-1.5 bg-[#FAF6EE] p-1.5 rounded-xl border border-[#DECDB8] shadow-2xs">
      <div className="pl-1.5 pr-1 text-[#8C7A6B] hidden sm:flex items-center gap-1 text-xs">
        <Feather className="w-3.5 h-3.5 text-[#B89360]" />
        <span className="font-serif italic">Script:</span>
      </div>
      {stylesList.map((st) => {
        const isSelected = selectedStyle === st.id;
        return (
          <button
            key={st.id}
            onClick={() => onSelectStyle(st.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-semibold"
                : "text-[#5C4B3C] hover:bg-[#EFE5D5] hover:text-[#281A12]"
            }`}
          >
            <span
              className={`text-base leading-none ${st.fontFamilyClass}`}
              style={{ fontFamily: st.fontFamily }}
            >
              {st.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
