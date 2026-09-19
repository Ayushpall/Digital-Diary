"use client";

import React from "react";
import { PageBlock, DiaryMood, moodOptions } from "@/types/creative";
import { HandwritingRenderer } from "@/components/handwriting/HandwritingRenderer";
import { HandwritingStyleId, HandwritingInkColor, HandwritingFontSize } from "@/types/handwriting";
import { Trash2, Pin, Calendar, Sparkles } from "lucide-react";

interface PageBlocksRendererProps {
  blocks: PageBlock[];
  mood?: DiaryMood;
  title: string;
  date: string;
  styleId?: HandwritingStyleId;
  fontSize?: HandwritingFontSize;
  inkColor?: HandwritingInkColor;
  onRemoveBlock?: (blockId: string) => void;
  interactive?: boolean;
}

export function PageBlocksRenderer({
  blocks,
  mood,
  title,
  date,
  styleId = "cursive",
  fontSize = "md",
  inkColor = "midnight",
  onRemoveBlock,
  interactive = true,
}: PageBlocksRendererProps) {
  const selectedMoodObj = moodOptions.find((m) => m.id === mood);

  return (
    <div className="w-full flex flex-col gap-6 select-text">
      {/* Page Header: Date & Mood Stamp */}
      <div className="pb-3 border-b border-[#D8CABE]/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
          <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
          <span>{date}</span>
        </div>

        {/* Selected Mood Badge */}
        {selectedMoodObj && (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAE0CD] text-[#423023] border border-[#D5C5AC] text-xs font-medium shadow-2xs">
            <span className="text-sm">{selectedMoodObj.emoji}</span>
            <span>{selectedMoodObj.label}</span>
          </div>
        )}
      </div>

      {/* Inscribed Page Title */}
      {title ? (
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1D15] tracking-tight font-normal italic">
          {title}
        </h2>
      ) : (
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1D15]/30 tracking-tight font-normal italic">
          Untitled Memory
        </h2>
      )}

      {/* Render All Dynamic Blocks in Sequence */}
      <div className="space-y-6">
        {blocks.map((block) => {
          switch (block.type) {
            case "text":
              return (
                <div key={block.id} className="relative group">
                  <HandwritingRenderer
                    text={block.content}
                    style={styleId}
                    fontSize={fontSize}
                    color={inkColor}
                    enableVariations={true}
                  />
                  {interactive && onRemoveBlock && (
                    <button
                      onClick={() => onRemoveBlock(block.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 -right-2 p-1 text-[#A85B5B] hover:text-[#7D3434]"
                      title="Remove text section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );

            case "image":
              return (
                <div
                  key={block.id}
                  className="relative group my-4 w-full max-w-sm mx-auto p-3 bg-white rounded-lg shadow-md border border-[#D8C7B0] rotate-[-1deg] hover:rotate-0 transition-transform"
                >
                  {/* Washi tape visual on top edge */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#E4D8BA]/70 border border-[#D5C8A8]/60 shadow-xs rotate-[2deg] pointer-events-none" />

                  {/* The Image */}
                  <div className="rounded overflow-hidden max-h-64 bg-[#F2ECE1]">
                    <img
                      src={block.url}
                      alt={block.caption || "Journal keepsake"}
                      className="w-full max-w-full h-auto object-cover"
                    />
                  </div>

                  {/* Optional Handwritten Caption */}
                  {block.caption && (
                    <p className="font-handwriting text-base text-[#3E2D20] text-center pt-2 italic">
                      {block.caption}
                    </p>
                  )}

                  {interactive && onRemoveBlock && (
                    <button
                      onClick={() => onRemoveBlock(block.id)}
                      className="opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center bg-white/90 rounded-full text-[#A85B5B] hover:text-[#7D3434] shadow-xs"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );

            case "drawing":
              return (
                <div
                  key={block.id}
                  className="relative group my-3 w-full max-w-sm mx-auto p-3 rounded-xl border border-dashed border-[#D5C5AC] bg-[#FAF5ED]/50"
                >
                  <img
                    src={block.dataUrl}
                    alt="Handwritten Sketch"
                    className="max-w-full h-auto max-h-56 mx-auto object-contain"
                  />
                  {interactive && onRemoveBlock && (
                    <button
                      onClick={() => onRemoveBlock(block.id)}
                      className="opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center bg-[#FAF6EE] rounded-lg text-[#A85B5B] hover:text-[#7D3434] shadow-2xs"
                      title="Remove sketch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );

            case "sticker":
              return (
                <div
                  key={block.id}
                  className="relative group inline-block m-1.5 p-2 bg-[#FAF5ED] rounded-xl shadow-xs border border-[#E0D4C0] rotate-[3deg] hover:rotate-0 transition-transform"
                >
                  <span className="text-3xl select-none">{block.sticker}</span>
                  {interactive && onRemoveBlock && (
                    <button
                      onClick={() => onRemoveBlock(block.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 p-0.5 bg-[#FAF6EE] rounded-full text-[#A85B5B] hover:text-[#7D3434] shadow-xs"
                      title="Remove sticker"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
