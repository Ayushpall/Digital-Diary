"use client";

import React from "react";
import { HandwritingFont } from "@/types/editor";
import { Type } from "lucide-react";

interface FontSelectorProps {
  value: HandwritingFont;
  onChange: (font: HandwritingFont) => void;
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const fonts: { id: HandwritingFont; name: string; fontClass: string }[] = [
    { id: "cursive", name: "Cursive", fontClass: "font-handwriting" },
    { id: "casual", name: "Casual", fontClass: "font-handwritingCasual" },
    { id: "classic", name: "Classic", fontClass: "font-handwritingAlt" },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-[#FAF6EE] p-1 rounded-xl border border-[#DECDB8] shadow-2xs">
      <div className="pl-2 pr-1 text-[#8C7A6B] hidden sm:flex items-center gap-1 text-xs">
        <Type className="w-3.5 h-3.5 text-[#B89360]" />
        <span className="font-serif italic">Script:</span>
      </div>
      {fonts.map((f) => {
        const isSelected =
          value === f.id ||
          (value === "caveat" && f.id === "cursive") ||
          (value === "kalam" && f.id === "classic");
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            title={f.name}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-semibold"
                : "text-[#5C4B3C] hover:bg-[#EFE5D5] hover:text-[#281A12]"
            }`}
          >
            <span className={`${f.fontClass} text-base font-normal leading-none`}>
              {f.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
