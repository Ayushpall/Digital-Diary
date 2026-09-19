"use client";

import React from "react";
import { StickerItem, stickerList } from "@/types/creative";
import { Sparkles } from "lucide-react";

interface StickerPickerProps {
  onSelectSticker: (sticker: StickerItem) => void;
}

export function StickerPicker({ onSelectSticker }: StickerPickerProps) {
  return (
    <div className="bg-[#FAF6EE] p-3 sm:p-4 rounded-xl border border-[#DECDB8] shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs font-serif italic text-[#7C6A5A] mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
        <span>Click sticker to paste onto page:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {stickerList.map((st) => (
          <button
            key={st}
            onClick={() => onSelectSticker(st)}
            className="w-10 h-10 rounded-xl bg-[#FAF5ED] hover:bg-[#EFE5D5] border border-[#DECDB8] hover:border-[#B89360] flex items-center justify-center text-xl shadow-2xs hover:scale-125 transition-transform duration-150 active:scale-95"
            title={`Add sticker ${st}`}
          >
            {st}
          </button>
        ))}
      </div>
    </div>
  );
}
