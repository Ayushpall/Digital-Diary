"use client";

import React from "react";
import {
  EditorSettings,
  HandwritingFont,
  EditorInkColor,
  EditorFontSize,
  EditorTextAlign
} from "@/types/editor";
import { FontSelector } from "./FontSelector";
import { ColorPicker } from "./ColorPicker";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Check,
  Sparkles,
  TextCursorInput
} from "lucide-react";

interface EditorToolbarProps {
  settings: EditorSettings;
  onUpdateSettings: (updates: Partial<EditorSettings>) => void;
  onSave: () => void;
  saveStatus: "idle" | "saving" | "saved";
}

export function EditorToolbar({
  settings,
  onUpdateSettings,
  onSave,
  saveStatus,
}: EditorToolbarProps) {
  const fontSizes: { id: EditorFontSize; label: string }[] = [
    { id: "sm", label: "A-" },
    { id: "md", label: "A" },
    { id: "lg", label: "A+" },
    { id: "xl", label: "A++" },
  ];

  return (
    <div className="w-full bg-[#FAF6ED] border-b border-[#DECDB8] px-4 py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Toolbar Cluster: Font Style, Color, Font Size */}
        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
          {/* Handwriting Font Style */}
          <FontSelector
            value={settings.font}
            onChange={(font) => onUpdateSettings({ font })}
          />

          {/* Ink Color Picker */}
          <ColorPicker
            value={settings.inkColor}
            onChange={(inkColor) => onUpdateSettings({ inkColor })}
          />

          {/* Font Size Selector */}
          <div className="flex items-center bg-[#FAF6EE] p-1 rounded-xl border border-[#DECDB8] shadow-2xs">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => onUpdateSettings({ fontSize: size.id })}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${settings.fontSize === size.id
                  ? "bg-[#38261A] text-[#FAF5ED] font-bold"
                  : "text-[#635142] hover:bg-[#EFE5D5]"
                  }`}
                title={`Font size: ${size.id}`}
              >
                {size.label}
              </button>
            ))}
          </div>

          {/* Text Alignment */}
          <div className="flex items-center bg-[#FAF6EE] p-1 rounded-xl border border-[#DECDB8] shadow-2xs">
            <button
              onClick={() => onUpdateSettings({ textAlign: "left" })}
              className={`p-1.5 rounded-lg transition-colors ${settings.textAlign === "left"
                ? "bg-[#38261A] text-[#FAF5ED]"
                : "text-[#635142] hover:bg-[#EFE5D5]"
                }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ textAlign: "center" })}
              className={`p-1.5 rounded-lg transition-colors ${settings.textAlign === "center"
                ? "bg-[#38261A] text-[#FAF5ED]"
                : "text-[#635142] hover:bg-[#EFE5D5]"
                }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ textAlign: "right" })}
              className={`p-1.5 rounded-lg transition-colors ${settings.textAlign === "right"
                ? "bg-[#38261A] text-[#FAF5ED]"
                : "text-[#635142] hover:bg-[#EFE5D5]"
                }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Formatting: Bold, Italic, Underline */}
          <div className="flex items-center bg-[#FAF6EE] p-1 rounded-xl border border-[#DECDB8] shadow-2xs">
            <button
              onClick={() => onUpdateSettings({ isBold: !settings.isBold })}
              className={`p-1.5 rounded-lg transition-colors ${settings.isBold
                ? "bg-[#38261A] text-[#FAF5ED]"
                : "text-[#635142] hover:bg-[#EFE5D5]"
                }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ isItalic: !settings.isItalic })}
              className={`p-1.5 rounded-lg transition-colors ${settings.isItalic
                ? "bg-[#38261A] text-[#FAF5ED]"
                : "text-[#635142] hover:bg-[#EFE5D5]"
                }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ isUnderline: !settings.isUnderline })}
              className={`p-1.5 rounded-lg transition-colors ${settings.isUnderline
                ? "bg-[#38261A] text-[#FAF5ED]"
                : "text-[#635142] hover:bg-[#EFE5D5]"
                }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Toolbar Cluster: Autosave status & Save Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Simulated Autosave Status */}
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-[#7C6958]">
            {saveStatus === "saving" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#D4A137] animate-pulse" />
                <span>Saving to paper...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#5D8A50]" />
                <span>Saved just now</span>
              </>
            )}
          </div>

          {/* Save Action Button */}
          <button
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483424] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>Save Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
