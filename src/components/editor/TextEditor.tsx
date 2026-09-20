"use client";

import React from "react";
import { PenLine, FileText } from "lucide-react";

interface TextEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onContentChange: (content: string) => void;
  activePageIndex?: number;
  onSelectPage?: (pageIndex: number) => void;
}

export function TextEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  activePageIndex = 0,
  onSelectPage,
}: TextEditorProps) {
  // Word & Character count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const charsPerPage = 500;

  // Capacity math
  const totalPages = Math.max(1, Math.ceil(charCount / charsPerPage));
  const currentTypingPage = Math.max(1, Math.ceil(charCount / charsPerPage));
  const charsInCurrentPage = charCount === 0 ? 0 : ((charCount - 1) % charsPerPage) + 1;
  const pageFillPercentage = Math.min(100, Math.round((charsInCurrentPage / charsPerPage) * 100));
  const isPageAlmostFull = charsInCurrentPage >= 440;

  return (
    <div className="h-full flex flex-col bg-[#FAF6EE] border-r border-[#DECDB8] p-6 sm:p-8 select-text">
      {/* Top Header Label & Live 500-char Page Gauge */}
      <div className="flex flex-col gap-2 pb-3 border-b border-[#E2D5C3] mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#7C6958]">
            <PenLine className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Keyboard Draft</span>
            <span className="text-[#38261A] font-sans font-medium px-2 py-0.5 rounded bg-[#EAE0CF] border border-[#D5C6B0] not-italic">
              Page {currentTypingPage} of {totalPages}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-[#8C7A6B]">
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="font-semibold text-[#38261A]">{charsInCurrentPage} / {charsPerPage} chars</span>
          </div>
        </div>

        {/* 500-character physical leaf progress bar */}
        <div className="w-full bg-[#E8DEC9] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isPageAlmostFull ? "bg-[#C46835]" : "bg-[#8E6945]"
            }`}
            style={{ width: `${pageFillPercentage}%` }}
          />
        </div>

        {/* Sensory Auto-Turn Warning */}
        {isPageAlmostFull && (
          <div className="text-[11px] font-serif italic text-[#A85822] flex items-center gap-1.5 pt-0.5 animate-pulse">
            <span>✨ Page {currentTypingPage} is almost full ({charsInCurrentPage}/500 chars). Text beyond 500 chars automatically turns to Page {currentTypingPage + 1}!</span>
          </div>
        )}
      </div>

      {/* Entry Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Entry Title..."
        className="w-full font-serif text-2xl sm:text-3xl text-[#281B13] tracking-tight bg-transparent border-b border-[#E2D6C5] pb-2 mb-4 outline-none placeholder:text-[#A69482]/60 focus:border-[#8E6945] transition-colors"
      />

      {/* Entry Body Textarea */}
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Type your thoughts freely with your keyboard. When you reach 500 characters, the page will automatically flip to the next leaf..."
        className="w-full flex-1 bg-transparent resize-none outline-none font-sans text-base text-[#38281D] leading-relaxed placeholder:text-[#A8988A]/60"
        rows={16}
      />

      {/* Footer Helper Note & Page Switcher */}
      <div className="pt-3 border-t border-[#E8DFC9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8A7969] font-serif italic">
        <div className="flex items-center gap-2">
          <span>Auto-flipping at 500 chars/page</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EAE0CF] text-[#4A382A]">
            {totalPages} {totalPages === 1 ? "leaf" : "leaves"} penned
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#8C7A6B]">
          Total: {charCount} characters
        </span>
      </div>
    </div>
  );
}
