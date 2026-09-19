"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { EditorSettings } from "@/types/editor";
import { PageBlock, DiaryMood, StickerItem } from "@/types/creative";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { TextEditor } from "@/components/editor/TextEditor";
import { DrawingCanvas } from "@/components/creative/DrawingCanvas";
import { ImageUploader } from "@/components/creative/ImageUploader";
import { StickerPicker } from "@/components/creative/StickerPicker";
import { MoodSelector } from "@/components/creative/MoodSelector";
import { PageBlocksRenderer } from "@/components/creative/PageBlocksRenderer";
import { 
  ArrowLeft, 
  Calendar, 
  Save, 
  Feather, 
  PenTool, 
  Eye, 
  CheckCircle2,
  X,
  Image as ImageIcon,
  Smile,
  Sparkles,
  Palette,
  FileText
} from "lucide-react";

export default function EditorDemoPage() {
  const { isSignedIn } = useAuth();
  const [title, setTitle] = useState("Thoughts on Machine & Mind");
  const [content, setContent] = useState(
    "Today I learned something interesting about artificial intelligence.\n\nWhile computers compute patterns at astronomical speeds, they don't possess human nostalgia or the quiet feeling of writing by candlelight. Tools like this remind me that technology is at its best when it serves human reflection, rather than replacing it."
  );

  const [date, setDate] = useState("18 September 2026");
  const [mood, setMood] = useState<DiaryMood>("happy");
  const [activeDraftTab, setActiveDraftTab] = useState<"text" | "photo" | "sketch" | "stickers">("text");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const [activeMobileView, setActiveMobileView] = useState<"write" | "preview">("write");
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Creative page blocks (Image, Drawing, Stickers)
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  const [settings, setSettings] = useState<EditorSettings>({
    font: "cursive",
    inkColor: "midnight",
    fontSize: "md",
    textAlign: "left",
    isBold: false,
    isItalic: false,
    isUnderline: false,
  });

  // Simulated auto-save timer
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
    }, 800);
    return () => clearTimeout(timer);
  }, [title, content, settings, mood, blocks]);

  const handleUpdateSettings = (updates: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleManualSave = async () => {
    setSaveStatus("saving");
    try {
      if (isSignedIn) {
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            blocks,
            handwritingFont: settings.font,
            inkColor: settings.inkColor,
            mood,
          }),
        });
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaveStatus("saved");
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  };

  // Creative Block Actions
  const handleAddImage = (dataUrl: string, caption?: string) => {
    const newBlock: PageBlock = {
      id: `img-${Date.now()}`,
      type: "image",
      url: dataUrl,
      caption: caption || "Keepsake",
    };
    setBlocks((prev) => [...prev, newBlock]);
    setActiveDraftTab("text"); // return to text
  };

  const handleAddDrawing = (dataUrl: string) => {
    const newBlock: PageBlock = {
      id: `draw-${Date.now()}`,
      type: "drawing",
      dataUrl,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setActiveDraftTab("text");
  };

  const handleAddSticker = (sticker: StickerItem) => {
    const newBlock: PageBlock = {
      id: `stk-${Date.now()}`,
      type: "sticker",
      sticker,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  // Compile full page blocks list: primary text block + appended creative blocks
  const allPageBlocks: PageBlock[] = [
    {
      id: "main-content-text",
      type: "text",
      content: content,
    },
    ...blocks,
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between">
      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#F4EDE2] border-b border-[#DECDB8] px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        {/* Left: Back Navigation & Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/diary/demo"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#EAE0D0] text-[#3D2C1F] border border-[#D8C7B0] text-xs font-serif transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Back to Diary</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 border-l border-[#DECDB8] pl-3 ml-1">
            <div className="w-7 h-7 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B]">
              <Feather className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif text-base text-[#281B13] font-normal">
              Creative Diary Studio
            </span>
          </div>
        </div>

        {/* Center: Mood Selector & Date Indicator */}
        <div className="flex items-center gap-3">
          <MoodSelector selectedMood={mood} onSelectMood={setMood} />
          <div className="hidden md:flex items-center gap-1.5 text-xs font-serif italic text-[#786657] border-l border-[#DECDB8] pl-3">
            <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="font-medium text-[#3A291D]">{date}</span>
          </div>
        </div>

        {/* Right: Save Button & Quick Navigation */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden md:inline-flex text-xs font-serif text-[#786657] hover:text-[#38261A] px-2.5 py-1.5"
          >
            Dashboard
          </Link>

          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* 2. TOOLBAR */}
      <EditorToolbar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onSave={handleManualSave}
        saveStatus={saveStatus}
      />

      {/* Mobile Tab Switcher: Write | Preview (< md) */}
      <div className="md:hidden flex items-center justify-center p-2.5 bg-[#FAF6EE] border-b border-[#DECDB8]">
        <div className="flex rounded-xl bg-[#EFE5D5] p-1 border border-[#DECDB8] shadow-2xs">
          <button
            onClick={() => setActiveMobileView("write")}
            className={`flex items-center justify-center gap-2 px-6 py-2 min-h-[44px] rounded-lg text-xs font-serif font-medium transition-all active:scale-95 ${
              activeMobileView === "write"
                ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-semibold"
                : "text-[#635142] hover:text-[#38261A]"
            }`}
          >
            <PenTool className="w-4 h-4 text-[#E5C78B]" />
            <span>Write</span>
          </button>
          <button
            onClick={() => setActiveMobileView("preview")}
            className={`flex items-center justify-center gap-2 px-6 py-2 min-h-[44px] rounded-lg text-xs font-serif font-medium transition-all active:scale-95 ${
              activeMobileView === "preview"
                ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-semibold"
                : "text-[#635142] hover:text-[#38261A]"
            }`}
          >
            <Eye className="w-4 h-4 text-[#E5C78B]" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE (Split View on Desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-6 flex flex-col">
        {/* Outer Journal Binder Box */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-[#D5C6AC] shadow-xl bg-[#FAF6ED] flex flex-col md:flex-row min-h-[540px] sm:min-h-[640px]">
          
          {/* LEFT PANEL: Studio Tools (Text, Image, Sketch, Stickers) */}
          <div
            className={`w-full md:w-1/2 h-full flex-col bg-[#FAF6EE] border-r border-[#DECDB8] ${
              activeMobileView === "write" ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Tool Category Selector Bar */}
            <div className="px-3 sm:px-5 py-2.5 border-b border-[#E2D5C3] bg-[#F5ECE0] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
                <button
                  onClick={() => setActiveDraftTab("text")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-serif transition-colors ${
                    activeDraftTab === "text"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-2xs"
                      : "text-[#5A4839] hover:bg-[#EAE0CF]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Text</span>
                </button>

                <button
                  onClick={() => setActiveDraftTab("photo")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-serif transition-colors ${
                    activeDraftTab === "photo"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-2xs"
                      : "text-[#5A4839] hover:bg-[#EAE0CF]"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>

                <button
                  onClick={() => setActiveDraftTab("sketch")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-serif transition-colors ${
                    activeDraftTab === "sketch"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-2xs"
                      : "text-[#5A4839] hover:bg-[#EAE0CF]"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Sketch</span>
                </button>

                <button
                  onClick={() => setActiveDraftTab("stickers")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-serif transition-colors ${
                    activeDraftTab === "stickers"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-2xs"
                      : "text-[#5A4839] hover:bg-[#EAE0CF]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Stickers</span>
                </button>
              </div>

              {blocks.length > 0 && (
                <span className="text-[11px] font-mono text-[#8C7A6B]">
                  {blocks.length} {blocks.length === 1 ? "element" : "elements"} attached
                </span>
              )}
            </div>

            {/* Active Tool Subview */}
            <div className="flex-1 overflow-y-auto">
              {activeDraftTab === "text" && (
                <TextEditor
                  title={title}
                  onTitleChange={setTitle}
                  content={content}
                  onContentChange={setContent}
                />
              )}

              {activeDraftTab === "photo" && (
                <div className="p-6">
                  <ImageUploader onImageSelected={handleAddImage} />
                </div>
              )}

              {activeDraftTab === "sketch" && (
                <div className="p-6">
                  <DrawingCanvas
                    onSaveDrawing={handleAddDrawing}
                    onCancel={() => setActiveDraftTab("text")}
                  />
                </div>
              )}

              {activeDraftTab === "stickers" && (
                <div className="p-6">
                  <StickerPicker onSelectSticker={handleAddSticker} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Live Composite Page Preview (Text, Images, Sketches, Stickers) */}
          <div
            className={`w-full md:w-1/2 h-full flex-col bg-[#FAF6ED] p-6 sm:p-8 md:p-10 paper-pattern-lined right-page-spine relative overflow-y-auto ${
              activeMobileView === "preview" ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Red vertical margin line on left */}
            <div className="absolute top-0 bottom-0 left-10 sm:left-12 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

            <div className="relative z-10 pl-6 sm:pl-8 flex-1 flex flex-col justify-between">
              {/* Dynamic Composite Blocks Renderer */}
              <PageBlocksRenderer
                blocks={allPageBlocks}
                mood={mood}
                title={title}
                date={date}
                styleId={
                  settings.font === "caveat"
                    ? "cursive"
                    : settings.font === "kalam"
                    ? "classic"
                    : settings.font
                }
                fontSize={settings.fontSize}
                inkColor={settings.inkColor}
                onRemoveBlock={handleRemoveBlock}
                interactive={true}
              />

              {/* Bottom Page Footer */}
              <div className="pt-6 border-t border-[#E8DEC9] mt-8 flex items-center justify-between text-xs text-[#8C7A6B] font-serif italic">
                <span>Page preview with living ink & attached keepsakes</span>
                <span className="font-mono text-[11px]">Vol. I • Page 25</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="bg-[#FAF6EE] border-t border-[#DECDB8] px-4 sm:px-6 py-2.5 text-xs text-[#827162] font-serif flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5D8A50]" />
          <span>Local Creative Session • Ready to record memories</span>
        </div>
        <div className="hidden sm:block text-[11px] font-mono text-[#917E6E]">
          Attached: {blocks.length} elements • Mood: {mood}
        </div>
      </footer>

      {/* Saved Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#342419] text-[#FAF5ED] px-4 py-3 rounded-xl shadow-xl border border-[#553E2D] flex items-center gap-2.5 text-xs font-serif animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#73A663]" />
          <span>Journal page saved with all creative attachments!</span>
          <button
            onClick={() => setShowSavedToast(false)}
            className="ml-2 text-[#B8A695] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
