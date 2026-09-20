"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DiaryBook } from "@/components/diary/DiaryBook";
import { sampleDiaryPages } from "@/lib/diary-data";
import { DiaryPageData } from "@/types/diary";
import { paginateContent } from "@/lib/pagination";
import { Feather, ArrowLeft, Sparkles, Home } from "lucide-react";

export default function DiaryDemoPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [pages, setPages] = useState<DiaryPageData[]>(() => {
    // Paginate sample demo pages as well so demo text never overflows
    const paginatedSample: DiaryPageData[] = [];
    let pNum = 1;
    sampleDiaryPages.forEach((p) => {
      const chunks = paginateContent(p.content, 500);
      chunks.forEach((chunk, cIdx) => {
        paginatedSample.push({
          ...p,
          id: `${p.id}-chunk-${cIdx}`,
          pageNumber: pNum++,
          title: cIdx === 0 ? p.title : `${p.title} (cont.)`,
          content: chunk,
        });
      });
    });
    return paginatedSample;
  });

  const [primaryDiaryCover, setPrimaryDiaryCover] = useState<string>("embossed-leather");
  const [primaryDiaryTitle, setPrimaryDiaryTitle] = useState<string>("My Personal Journal");
  const [pageToDelete, setPageToDelete] = useState<DiaryPageData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Fetch primary diary details for cover styling
    fetch("/api/diaries")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.diaries && data.diaries.length > 0) {
          setPrimaryDiaryCover(data.diaries[0].coverColor || "embossed-leather");
          setPrimaryDiaryTitle(data.diaries[0].title || "My Personal Journal");
        }
      })
      .catch(() => {});

    fetch("/api/entries")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.entries && data.entries.length > 0) {
          const cover: DiaryPageData = {
            id: "user-diary-cover",
            pageNumber: 0,
            isCover: true,
            title: data.entries[0]?.diaryTitle || "My Personal Journal",
            content: "",
          };

          const realPages: DiaryPageData[] = [];
          let currentFolioNumber = 1;

          data.entries.forEach((e: any) => {
            const d = new Date(e.date);
            const dateFormatted = d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" });

            // Automatically split entry when full at 500 characters so each page flips cleanly
            const chunks = paginateContent(e.content || "", 500);

            chunks.forEach((chunk, chunkIndex) => {
              realPages.push({
                id: `${e.id}-p${chunkIndex + 1}`,
                entryId: e.id,
                pageNumber: currentFolioNumber++,
                title: chunkIndex === 0 ? e.title : `${e.title} (cont.)`,
                content: chunk,
                blocks: chunkIndex === 0 ? e.blocks : undefined,
                date: dateFormatted,
                dayOfWeek: dayOfWeek,
                mood: chunkIndex === 0 ? e.mood : undefined,
                ink: "midnight",
                paperStyle: "lined",
              });
            });
          });

          setPages([cover, ...realPages]);
        } else if (isSignedIn) {
          // Fresh signed-in user with no entries yet
          setPages([
            {
              id: "fresh-diary-cover",
              pageNumber: 0,
              isCover: true,
              title: "My Personal Journal",
              content: "",
            },
            {
              id: "fresh-diary-p1",
              pageNumber: 1,
              title: "A Blank Canvas",
              content: "This volume has not been penned yet.\n\nClick '+ Write' in the top corner to compose your first reflection and watch your handwriting appear.",
              date: "Today",
              dayOfWeek: "New Journal",
              mood: "hopeful",
              ink: "midnight",
              paperStyle: "lined",
            },
          ]);
        }
      })
      .catch((err) => console.error("Error loading user entries:", err));
  }, [isSignedIn, isLoaded]);

  const handleDeletePage = (page: DiaryPageData) => {
    setPageToDelete(page);
  };

  const handleConfirmDeletePage = async () => {
    if (!pageToDelete) return;
    setIsDeleting(true);
    try {
      if (pageToDelete.entryId) {
        await fetch(`/api/entries/${pageToDelete.entryId}`, { method: "DELETE" });
        setPages((prev) => prev.filter((p) => p.entryId !== pageToDelete.entryId));
      } else {
        setPages((prev) => prev.filter((p) => p.id !== pageToDelete.id));
      }
      setPageToDelete(null);
    } catch (err) {
      console.error("Failed to delete page:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2A1D16] text-[#FAF5ED] flex flex-col justify-between relative overflow-hidden">
      {/* Warm atmospheric candlelight desk glow in the background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#694226]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-20 px-3 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between gap-2 border-b border-[#4A3427]/60 backdrop-blur-xs bg-[#241710]/80">
        {/* Back navigation */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-xl bg-[#362318] hover:bg-[#4A3223] text-[#DFD1BF] border border-[#523A2B] text-xs font-serif transition-colors shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D8B97C]" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#A69382] hover:text-[#FAF5ED] text-xs font-serif transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Landing</span>
          </Link>
        </div>

        {/* Title Center */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#3D281C] flex items-center justify-center text-[#E5C78B] border border-[#5C3F2C]">
            <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-serif text-sm sm:text-lg text-[#FAF5ED] font-normal tracking-tight block">
              The Reading Room
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#A68F7B] font-mono block -mt-0.5 sm:-mt-1 uppercase tracking-wider hidden xs:block">
              Physical Simulation
            </span>
          </div>
        </div>

        {/* Hints & Write Button */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#362318] border border-[#523A2B] text-xs font-serif italic text-[#C9B7A3]">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B97C]" />
            <span>Use ← → Arrow keys to turn pages</span>
          </div>

          <Link
            href="/editor/demo"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl bg-[#D8B97C] hover:bg-[#E5C78B] text-[#24160C] text-xs font-medium transition-colors shadow-xs active:scale-95 whitespace-nowrap"
          >
            <span>+ Write</span>
          </Link>
        </div>
      </header>

      {/* Main Reading Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-2.5 sm:px-6 md:px-8 py-6 md:py-12">
        <DiaryBook
          pages={pages}
          initialOpen={true}
          coverStyle={primaryDiaryCover}
          title={primaryDiaryTitle}
          onDeleteCurrentPage={handleDeletePage}
        />
      </main>

      {/* Delete Page Confirmation Modal */}
      {pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-7 max-w-sm w-full text-[#2C2016]">
            <h3 className="font-serif text-xl font-medium mb-2 text-[#24160C]">
              Tear Out This Page?
            </h3>
            <p className="text-xs text-[#6B5A4B] font-light leading-relaxed mb-6">
              Are you sure you want to delete &ldquo;{pageToDelete.title || "this entry"}&rdquo;? This written leaf will be permanently removed from your bound journal.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-serif text-[#685648] hover:bg-[#EFE5D5] transition-colors"
              >
                Keep Page
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePage}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#8B261E] hover:bg-[#A83228] text-[#FAF5ED] text-xs font-medium transition-colors shadow-xs"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Subtle Ambient Footer */}
      <footer className="relative z-10 px-4 py-4 border-t border-[#4A3427]/40 text-center text-xs font-serif italic text-[#887463]">
        <span>Digital Diary • Crafted to feel like authentic pen on paper</span>
      </footer>
    </div>
  );
}
