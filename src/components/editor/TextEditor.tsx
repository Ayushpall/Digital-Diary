"use client";

import React from "react";
import { PenLine, FileText } from "lucide-react";

interface TextEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onContentChange: (content: string) => void;
}

export function TextEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
}: TextEditorProps) {
  // Word & Character count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="h-full flex flex-col bg-[#FAF6EE] border-r border-[#DECDB8] p-6 sm:p-8 select-text">
      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2D5C3] mb-4">
        <div className="flex items-center gap-2 text-xs font-serif italic text-[#7C6958]">
          <PenLine className="w-3.5 h-3.5 text-[#B89360]" />
          <span>Keyboard Input Draft</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#8C7A6B]">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
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
        placeholder="Type your thoughts freely with your keyboard. Notice how they transform into living handwriting on the right..."
        className="w-full flex-1 bg-transparent resize-none outline-none font-sans text-base text-[#38281D] leading-relaxed placeholder:text-[#A8988A]/60"
        rows={16}
      />

      {/* Footer Helper Note */}
      <div className="pt-3 border-t border-[#E8DFC9] flex items-center justify-between text-xs text-[#8A7969] font-serif italic">
        <span>Standard keyboard typing</span>
        <span className="text-[11px] font-mono text-[#8C7A6B]">Markdown supported</span>
      </div>
    </div>
  );
}
