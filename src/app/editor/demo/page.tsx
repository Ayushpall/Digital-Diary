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
import { PageFlip } from "@/components/diary/PageFlip";
import { paginateContent } from "@/lib/pagination";
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
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditorDemoContent() {
  const { isSignedIn, isLoaded } = useAuth();
  const searchParams = useSearchParams();
  const isNewParam = searchParams.get("new") === "true";
  const entryIdParam = searchParams.get("id");

  const [entryId, setEntryId] = useState<string | null>(entryIdParam);
  const [title, setTitle] = useState(isNewParam ? "" : "Thoughts on Machine & Mind");
  const [content, setContent] = useState(
    isNewParam
      ? ""
      : "Today I learned something interesting about artificial intelligence.\n\nWhile computers compute patterns at astronomical speeds, they don't possess human nostalgia or the quiet feeling of writing by candlelight. Tools like this remind me that technology is at its best when it serves human reflection, rather than replacing it."
  );

  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );
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

  // Track if this is the initial mount to prevent immediate blank overwrite
  const [hasInitialized, setHasInitialized] = useState(false);
  const isSavingRef = React.useRef(false);

  // Load existing entry if id param is provided
  useEffect(() => {
    if (entryIdParam && isLoaded) {
      fetch(`/api/entries/${entryIdParam}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.entry) {
            setTitle(data.entry.title || "");
            setContent(data.entry.content || "");
            if (data.entry.blocks) setBlocks(data.entry.blocks);
            if (data.entry.mood) setMood(data.entry.mood);
            if (data.entry.handwritingFont) {
              setSettings((prev) => ({ ...prev, font: data.entry.handwritingFont }));
            }
            if (data.entry.inkColor) {
              setSettings((prev) => ({ ...prev, inkColor: data.entry.inkColor }));
            }
          }
          setHasInitialized(true);
        })
        .catch(() => setHasInitialized(true));
    } else {
      // If guest has local draft and not explicitly ?new=true, restore it
      if (!isNewParam && typeof window !== "undefined") {
        const savedDraft = localStorage.getItem("digital_diary_draft");
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.title) setTitle(parsed.title);
            if (parsed.content) setContent(parsed.content);
            if (parsed.blocks) setBlocks(parsed.blocks);
          } catch {}
        }
      }
      setHasInitialized(true);
    }
  }, [entryIdParam, isNewParam, isLoaded]);

  // Real Debounced Auto-Save (1200ms debounce)
  useEffect(() => {
    if (!hasInitialized) return;

    // Only save if there is content or title
    if (!title.trim() && !content.trim() && blocks.length === 0) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      try {
        if (isSignedIn) {
          const payload = {
            title: title.trim() || "Untitled Entry",
            content,
            blocks,
            handwritingFont: settings.font,
            inkColor: settings.inkColor,
            mood,
          };

          if (entryId) {
            // Update existing entry
            await fetch(`/api/entries/${entryId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } else {
            // Create new entry
            const res = await fetch("/api/entries", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.entry?.id) {
                setEntryId(data.entry.id);
                // Update URL quietly without full page reload
                window.history.replaceState(null, "", `/editor/demo?id=${data.entry.id}`);
              }
            }
          }
        } else {
          // Guest draft saved locally in browser
          localStorage.setItem(
            "digital_diary_draft",
            JSON.stringify({ title, content, blocks, mood, settings })
          );
        }
        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save error:", err);
        setSaveStatus("idle");
      } finally {
        isSavingRef.current = false;
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, content, settings, mood, blocks, isSignedIn, entryId, hasInitialized]);

  const handleUpdateSettings = (updates: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleManualSave = async () => {
    setSaveStatus("saving");
    try {
      if (isSignedIn) {
        const payload = {
          title: title.trim() || "Untitled Entry",
          content,
          blocks,
          handwritingFont: settings.font,
          inkColor: settings.inkColor,
          mood,
        };

        if (entryId) {
          await fetch(`/api/entries/${entryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          const res = await fetch("/api/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.entry?.id) {
              setEntryId(data.entry.id);
              window.history.replaceState(null, "", `/editor/demo?id=${data.entry.id}`);
            }
          }
        }
      } else {
        localStorage.setItem(
          "digital_diary_draft",
          JSON.stringify({ title, content, blocks, mood, settings })
        );
      }
      setSaveStatus("saved");
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (e) {
      console.error("Save error:", e);
      setSaveStatus("idle");
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

  // Pagination & Auto-flip states (500 characters per leaf)
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [previewFlipDirection, setPreviewFlipDirection] = useState<"forward" | "backward">("forward");
  const prevPageCountRef = React.useRef(1);

  // Split content at 500 characters so each page flips cleanly
  const contentPages = React.useMemo(() => paginateContent(content, 500), [content]);

  // When text crosses 500 characters, automatically flip forward to the new page!
  useEffect(() => {
    const newPageCount = contentPages.length;
    if (newPageCount > prevPageCountRef.current) {
      setPreviewFlipDirection("forward");
      setPreviewPageIndex(newPageCount - 1);
    } else if (newPageCount < prevPageCountRef.current && previewPageIndex >= newPageCount) {
      setPreviewFlipDirection("backward");
      setPreviewPageIndex(Math.max(0, newPageCount - 1));
    }
    prevPageCountRef.current = newPageCount;
  }, [contentPages.length, previewPageIndex]);

  // Active page text & blocks for preview
  const activePageText = contentPages[previewPageIndex] || "";
  const activePageBlocks: PageBlock[] = [
    {
      id: `main-content-text-p${previewPageIndex}`,
      type: "text",
      content: activePageText,
    },
    ...(previewPageIndex === 0 ? blocks : []),
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
                  activePageIndex={previewPageIndex}
                  onSelectPage={(idx) => {
                    setPreviewFlipDirection(idx > previewPageIndex ? "forward" : "backward");
                    setPreviewPageIndex(idx);
                  }}
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

          {/* RIGHT PANEL: Live Composite Page Preview with 3D PageFlip (500 chars/leaf) */}
          <div
            className={`w-full md:w-1/2 h-full flex-col bg-[#FAF6ED] p-4 sm:p-6 md:p-8 paper-pattern-lined right-page-spine relative overflow-y-auto ${
              activeMobileView === "preview" ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Red vertical margin line on left */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

            {/* Top Page Navigation Bar */}
            <div className="relative z-20 flex items-center justify-between pb-3 border-b border-[#E0D3C0] mb-4 text-xs font-serif text-[#6C594A]">
              <div className="flex items-center gap-2 pl-6 sm:pl-8">
                <BookOpen className="w-3.5 h-3.5 text-[#B89360]" />
                <span className="font-medium text-[#38261A]">Living Ink Leaf</span>
                {contentPages.length > 1 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EAE0CF] text-[#554030] border border-[#D5C5AC]">
                    {contentPages.length} Pages • Auto-flipping active
                  </span>
                )}
              </div>

              {/* Interactive Page Flip Controls */}
              {contentPages.length > 1 && (
                <div className="flex items-center gap-1 bg-[#EFE5D5] px-2 py-0.5 rounded-xl border border-[#D5C5AC] shadow-2xs">
                  <button
                    onClick={() => {
                      if (previewPageIndex > 0) {
                        setPreviewFlipDirection("backward");
                        setPreviewPageIndex(previewPageIndex - 1);
                      }
                    }}
                    disabled={previewPageIndex === 0}
                    className="p-1 rounded hover:bg-[#E2D5BF] disabled:opacity-30 transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] font-medium text-[#38261A] px-1">
                    Page {previewPageIndex + 1} of {contentPages.length}
                  </span>
                  <button
                    onClick={() => {
                      if (previewPageIndex < contentPages.length - 1) {
                        setPreviewFlipDirection("forward");
                        setPreviewPageIndex(previewPageIndex + 1);
                      }
                    }}
                    disabled={previewPageIndex >= contentPages.length - 1}
                    className="p-1 rounded hover:bg-[#E2D5BF] disabled:opacity-30 transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 3D Realistic Page-Flip Container */}
            <div className="relative z-10 pl-6 sm:pl-8 flex-1 flex flex-col justify-between">
              <PageFlip
                pageKey={`editor-page-${previewPageIndex}`}
                direction={previewFlipDirection}
              >
                <div className="w-full flex flex-col justify-between min-h-[460px]">
                  <PageBlocksRenderer
                    blocks={activePageBlocks}
                    mood={previewPageIndex === 0 ? mood : undefined}
                    title={previewPageIndex === 0 ? title : `${title || "Story"} (cont.)`}
                    date={date}
                    showHeader={true}
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
                </div>
              </PageFlip>

              {/* Bottom Page Footer with Folio Stamp */}
              <div className="pt-4 border-t border-[#E8DEC9] mt-6 flex items-center justify-between text-xs text-[#8C7A6B] font-serif italic">
                <span>
                  {contentPages.length > 1
                    ? `Page ${previewPageIndex + 1} of ${contentPages.length}`
                    : "Single page draft"}
                </span>
                <span className="font-mono text-[11px] text-[#4A3728]">
                  {activePageText.length} / 500 chars on this leaf
                </span>
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

export default function EditorDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center font-serif text-[#554030]">
          Preparing Studio...
        </div>
      }
    >
      <EditorDemoContent />
    </Suspense>
  );
}
