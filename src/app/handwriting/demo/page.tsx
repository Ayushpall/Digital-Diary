"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HandwritingStyleId, 
  HandwritingInkColor, 
  HandwritingFontSize, 
  HandwritingTextAlign 
} from "@/types/handwriting";
import { HandwritingRenderer } from "@/components/handwriting/HandwritingRenderer";
import { HandwritingStyleSelector } from "@/components/handwriting/HandwritingStyleSelector";
import { handwritingStyles, inkColorMap } from "@/lib/handwriting-config";
import { 
  ArrowLeft, 
  Sparkles, 
  Feather, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sliders, 
  RotateCcw,
  CheckCircle2,
  FileText
} from "lucide-react";

export default function HandwritingDemoPage() {
  const [text, setText] = useState("Today was a beautiful day.");
  const [styleId, setStyleId] = useState<HandwritingStyleId>("cursive");
  const [inkColor, setInkColor] = useState<HandwritingInkColor>("midnight");
  const [fontSize, setFontSize] = useState<HandwritingFontSize>("md");
  const [alignment, setAlignment] = useState<HandwritingTextAlign>("left");
  const [enableVariations, setEnableVariations] = useState(true);

  // Preset sample buttons for testing
  const presets = [
    {
      label: "Short Thought",
      text: "Today was a beautiful day.",
    },
    {
      label: "Long Paragraphs",
      text: "Today was a beautiful day.\n\nI walked down to the edge of the harbor just as the morning fishing boats were gliding in. The water looked like beaten copper in the early light.\n\nI sat on a weathered bench and wrote three pages in my pocket notebook. It is strange how quickly a busy mind calms down the moment ink touches paper. We spend so much of our modern lives in hurried digital conversations, forgetting the stillness of our own handwriting.",
    },
    {
      label: "Poetic Lines",
      text: "Soft rain upon the roof,\nQuiet kettle on the stove,\nWords taking root,\nIn the paper grove.",
    },
    {
      label: "Empty Text (Test)",
      text: "",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EDE2] text-[#2C2621] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-[#FAF6EE] border-b border-[#DECDB8] px-4 sm:px-8 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/editor/demo"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#3D2C1F] border border-[#D8C7B0] text-xs font-serif transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Editor</span>
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-[#DECDB8]">
            <div className="w-7 h-7 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B]">
              <Feather className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-serif text-lg text-[#2A1D15] font-normal">
              Keyboard-to-Handwriting Engine Test Lab
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-xs font-serif text-[#7A695A] hover:text-[#2A1D15] px-3 py-1.5"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Testing Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        
        {/* Controls Configuration Panel */}
        <div className="bg-[#FAF6EE] p-5 sm:p-6 rounded-2xl border border-[#D8C8B2] shadow-xs flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DECDB8] pb-4">
            {/* Style Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-serif italic text-[#7C6958]">
                Handwriting Style:
              </span>
              <HandwritingStyleSelector
                selectedStyle={styleId}
                onSelectStyle={setStyleId}
                layout="pills"
              />
            </div>

            {/* Ink Color Swatches */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif italic text-[#7C6958]">Ink:</span>
              {(Object.keys(inkColorMap) as HandwritingInkColor[]).map((ink) => (
                <button
                  key={ink}
                  onClick={() => setInkColor(ink)}
                  title={inkColorMap[ink].label}
                  className={`w-6 h-6 rounded-full border border-[#FAF5ED] transition-transform ${
                    ink === "midnight"
                      ? "bg-[#1B2A3D]"
                      : ink === "carbon"
                      ? "bg-[#232120]"
                      : ink === "sepia"
                      ? "bg-[#4A3423]"
                      : ink === "forest"
                      ? "bg-[#243B28]"
                      : "bg-[#4A1D24]"
                  } ${
                    inkColor === ink
                      ? "scale-125 ring-2 ring-[#B89360] ring-offset-2 ring-offset-[#FAF6EE]"
                      : "opacity-75 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif italic text-[#7C6958]">Size:</span>
              <div className="flex rounded-xl bg-[#EFE5D5] p-1 border border-[#DECDB8]">
                {(["sm", "md", "lg", "xl"] as HandwritingFontSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                      fontSize === sz
                        ? "bg-[#38261A] text-[#FAF5ED]"
                        : "text-[#5C4A3A] hover:bg-[#E2D5BF]"
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-variation Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEnableVariations(!enableVariations)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-serif transition-colors ${
                  enableVariations
                    ? "bg-[#EFE5D5] text-[#342419] border-[#B89360]"
                    : "bg-[#FAF6EE] text-[#8C7A6B] border-[#DECDB8]"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#B89360]" />
                <span>Natural Tilt: {enableVariations ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          {/* Preset Buttons for Quick Testing */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-serif italic text-[#7C6A5B] mr-1">Test presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setText(preset.text)}
                className="px-3 py-1.5 rounded-xl bg-[#EFE5D5] hover:bg-[#E5D7BF] text-[#423124] border border-[#DAC9AF] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Side-by-Side Playground */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[480px]">
          
          {/* Left: Input Textarea */}
          <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#D8C8B2] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DECDB8] mb-3">
                <span className="text-xs font-serif italic text-[#7C6958]">
                  Keyboard Input (Type here)
                </span>
                <span className="text-xs font-mono text-[#8C7A6B]">
                  {text.length} characters
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type anything here with your keyboard..."
                rows={12}
                className="w-full bg-transparent resize-none outline-none font-sans text-base text-[#38281D] leading-relaxed placeholder:text-[#A8988A]/60"
              />
            </div>

            <div className="pt-3 border-t border-[#E8DFC9] flex items-center justify-between text-xs text-[#827060] font-serif italic">
              <span>Keystrokes render in real-time</span>
              <button
                onClick={() => setText("")}
                className="text-[#9C5449] hover:underline"
              >
                Clear text
              </button>
            </div>
          </div>

          {/* Right: Live Handwriting Preview on Ruled Paper */}
          <div className="rounded-2xl p-8 sm:p-10 paper-pattern-lined right-page-spine border border-[#D8C8B2] shadow-md relative overflow-y-auto flex flex-col justify-between bg-[#FAF6ED]">
            {/* Margin Guide */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

            <div className="relative z-10 pl-6 flex-1">
              <div className="pb-3 border-b border-[#D8CABE]/50 mb-4 flex items-center justify-between">
                <span className="text-xs font-serif italic text-[#847262]">
                  Handwriting Engine Output
                </span>
                <span className="text-[11px] font-mono text-[#8C7A6B] uppercase">
                  Style: {handwritingStyles[styleId].name}
                </span>
              </div>

              {/* Master Handwriting Renderer Output */}
              <HandwritingRenderer
                text={text}
                style={styleId}
                fontSize={fontSize}
                color={inkColor}
                alignment={alignment}
                enableVariations={enableVariations}
                placeholder="Type on the left to see handwriting render here..."
              />
            </div>

            {/* Bottom Page Footer */}
            <div className="relative z-10 pl-6 pt-4 border-t border-[#E8DEC9] flex items-center justify-between text-xs text-[#8A7969] font-serif italic">
              <span>Wrapped naturally across ruled lines</span>
              <CheckCircle2 className="w-4 h-4 text-[#6A9457]" />
            </div>
          </div>
        </div>

        {/* 3 Styles Visual Comparison Card */}
        <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#D8C8B2] shadow-xs">
          <h3 className="font-serif text-lg text-[#261A13] font-normal mb-4">
            Available Handwriting Styles Comparison
          </h3>
          <HandwritingStyleSelector
            selectedStyle={styleId}
            onSelectStyle={setStyleId}
            layout="cards"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF6EE] border-t border-[#DECDB8] px-4 py-3 text-center text-xs font-serif italic text-[#887463]">
        Digital Diary • Keyboard-to-Handwriting Engine v1.0
      </footer>
    </div>
  );
}
