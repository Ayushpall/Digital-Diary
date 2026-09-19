"use client";

import React from "react";
import { EditorSettings } from "@/types/editor";
import { Calendar, Feather } from "lucide-react";
import { HandwritingRenderer } from "../handwriting/HandwritingRenderer";
import { HandwritingStyleId } from "@/types/handwriting";

interface HandwritingPreviewProps {
  title: string;
  content: string;
  date: string;
  settings: EditorSettings;
}

export function HandwritingPreview({
  title,
  content,
  date,
  settings,
}: HandwritingPreviewProps) {
  // Map font setting to style id
  const styleId: HandwritingStyleId =
    settings.font === "classic" || settings.font === "kalam"
      ? "classic"
      : settings.font === "casual"
      ? "casual"
      : "cursive";

  const alignClass =
    settings.textAlign === "center"
      ? "text-center"
      : settings.textAlign === "right"
      ? "text-right"
      : "text-left";

  return (
    <div className="h-full flex flex-col bg-[#FAF6ED] p-6 sm:p-8 md:p-10 paper-pattern-lined right-page-spine relative overflow-y-auto select-text">
      {/* Red vertical margin line on left */}
      <div className="absolute top-0 bottom-0 left-10 sm:left-12 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

      {/* Top Folio Header */}
      <div className="relative z-10 pl-6 sm:pl-8 pb-3 border-b border-[#D8CABE]/50 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-serif italic text-[#847262]">
          <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8A7969] font-mono">
          <Feather className="w-3.5 h-3.5 text-[#B89360]" />
          <span>Handwriting Preview</span>
        </div>
      </div>

      {/* Handwriting Inscribed Content Area */}
      <div className="relative z-10 pl-6 sm:pl-8 flex-1">
        {/* Entry Title */}
        {title ? (
          <h2
            className={`font-serif text-2xl sm:text-3xl text-[#2B1D15] tracking-tight mb-4 font-normal italic ${alignClass}`}
          >
            {title}
          </h2>
        ) : (
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1D15]/30 tracking-tight mb-4 font-normal italic">
            Untitled Memory
          </h2>
        )}

        {/* Live Handwritten Body Text using HandwritingRenderer */}
        <div
          className={`${
            settings.isBold ? "font-bold" : ""
          } ${settings.isItalic ? "italic" : ""} ${
            settings.isUnderline ? "underline underline-offset-4 decoration-[#B89360]/60" : ""
          }`}
        >
          <HandwritingRenderer
            text={content}
            style={styleId}
            fontSize={settings.fontSize}
            color={settings.inkColor}
            alignment={settings.textAlign}
            enableVariations={true}
          />
        </div>
      </div>

      {/* Bottom Page Footer */}
      <div className="relative z-10 pl-6 sm:pl-8 pt-4 border-t border-[#E8DEC9] flex items-center justify-between text-xs text-[#8C7A6B] font-serif italic">
        <span>Inscribed in real-time</span>
        <span className="font-mono text-[11px]">Page Preview</span>
      </div>
    </div>
  );
}
