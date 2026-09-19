"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DiaryPageData } from "@/types/diary";
import { DiaryCover } from "./DiaryCover";
import { DiaryPage } from "./DiaryPage";
import { PageFlip } from "./PageFlip";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  BookMarked,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowLeft
} from "lucide-react";

interface DiaryBookProps {
  pages: DiaryPageData[];
  initialOpen?: boolean;
}

export function DiaryBook({ pages, initialOpen = true }: DiaryBookProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  // pageIndex is the index in `pages` for the left page in two-page spread (0, 2, 4...)
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const totalPages = pages.length;

  const handleNextPage = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    // Desktop shows 2 pages, mobile shows 1
    // We check window size or advance by 2
    if (pageIndex + 2 < totalPages) {
      setDirection("forward");
      setPageIndex((prev) => prev + 2);
    }
  }, [isOpen, pageIndex, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (!isOpen) return;
    if (pageIndex > 0) {
      setDirection("backward");
      setPageIndex((prev) => Math.max(0, prev - 2));
    } else {
      // If at page 0 and goes back, close the cover!
      setIsOpen(false);
    }
  }, [isOpen, pageIndex]);

  // Mobile-specific next/prev (1 page increment)
  const handleMobileNext = () => {
    if (pageIndex + 1 < totalPages) {
      setDirection("forward");
      setPageIndex((prev) => prev + 1);
    }
  };

  const handleMobilePrev = () => {
    if (pageIndex > 0) {
      setDirection("backward");
      setPageIndex((prev) => prev - 1);
    } else {
      setIsOpen(false);
    }
  };

  // Touch swipe detection for flipping pages naturally on mobile devices
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger if horizontal swipe is prominent and > 45px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        // Swiped left -> flip forward
        handleMobileNext();
      } else {
        // Swiped right -> flip backward
        handleMobilePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation handler: ArrowLeft / ArrowRight / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isMobile = window.innerWidth < 768;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isMobile) {
          handleMobileNext();
        } else {
          handleNextPage();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isMobile) {
          handleMobilePrev();
        } else {
          handlePrevPage();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextPage, handlePrevPage, handleMobileNext, handleMobilePrev]);

  // If diary is closed, show realistic cover
  if (!isOpen) {
    return (
      <div className="py-8 sm:py-12 flex flex-col items-center">
        <DiaryCover onOpen={() => setIsOpen(true)} />
      </div>
    );
  }

  const leftPage = pages[pageIndex];
  const rightPage = pages[pageIndex + 1];

  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex + 2 < totalPages;

  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      {/* Top Controls Toolbar */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between px-2 sm:px-4 text-xs font-serif">
        <button
          onClick={() => setIsOpen(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BF] text-[#4A3728] border border-[#D8C7B0] transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Close Cover</span>
        </button>

        {/* Page counter & reading status */}
        <div className="flex items-center gap-2 text-[#7C6958]">
          <BookOpen className="w-3.5 h-3.5 text-[#B89360]" />
          <span className="hidden sm:inline">Volume I:</span>
          <span className="font-mono text-[#38261A] font-medium">
            <span className="md:hidden">Page {pageIndex + 1} of {totalPages}</span>
            <span className="hidden md:inline">
              Pages {leftPage ? leftPage.pageNumber : 1}
              {rightPage ? `–${rightPage.pageNumber}` : ""} of {totalPages}
            </span>
          </span>
        </div>

        {/* Keyboard hints */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#917E6E]">
          <span className="px-1.5 py-0.5 rounded bg-[#EAE0CF] border border-[#D5C6B0]">←</span>
          <span className="px-1.5 py-0.5 rounded bg-[#EAE0CF] border border-[#D5C6B0]">→</span>
          <span className="font-serif italic text-[#7C6958]">keys flip pages</span>
        </div>
      </div>

      {/* Main Physical Book Canvas */}
      <div className="relative rounded-2xl p-3 sm:p-5 md:p-8 bg-[#332218] shadow-2xl border border-[#4D3627]">
        {/* Embossed Corner Hardware Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#BFA169]/60 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#BFA169]/60 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#BFA169]/60 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#BFA169]/60 rounded-br-sm pointer-events-none" />

        {/* Hanging Silk Ribbon Bookmark draped over top spine */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-5 h-20 sm:h-28 bg-[#8B2222] shadow-md border-x border-[#6E1A1A] ribbon-tail opacity-95 transition-all duration-300" />
        </div>

        {/* Desktop Two-Page Spread (md+) */}
        <div className="hidden md:block">
          <PageFlip pageKey={`spread-${pageIndex}`} direction={direction}>
            <div className="relative grid grid-cols-2 rounded-xl overflow-hidden bg-[#FAF6ED] shadow-inner border border-[#E0D4C0]">
              {/* Left Page */}
              <div className="min-h-[560px]">
                {leftPage ? (
                  <DiaryPage page={leftPage} position="left" />
                ) : (
                  <div className="p-10 paper-pattern-lined h-full flex items-center justify-center text-xs font-serif italic text-[#A69482]">
                    Blank leaf
                  </div>
                )}
              </div>

              {/* Right Page */}
              <div className="min-h-[560px]">
                {rightPage ? (
                  <DiaryPage page={rightPage} position="right" />
                ) : (
                  <div className="p-10 paper-pattern-lined h-full flex items-center justify-center text-xs font-serif italic text-[#A69482]">
                    Blank leaf
                  </div>
                )}
              </div>

              {/* Central Spine Shadow */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 pointer-events-none z-20 journal-spine-crease opacity-70" />
            </div>
          </PageFlip>
        </div>

        {/* Mobile Single Page View (<md) */}
        <div className="md:hidden">
          <PageFlip pageKey={`mobile-${pageIndex}`} direction={direction}>
            <div className="rounded-xl overflow-hidden bg-[#FAF6ED] shadow-inner border border-[#E0D4C0] min-h-[500px]">
              {leftPage && <DiaryPage page={leftPage} position="single" />}
            </div>
          </PageFlip>
        </div>

        {/* Realistic Stacked Page Edges (bottom and sides) */}
        <div className="absolute -bottom-1 left-6 right-6 h-1.5 bg-[#EBE1D0] rounded-b-sm border-b border-[#D8C7B0] shadow-sm pointer-events-none" />
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between px-2 sm:px-4">
        {/* Desktop Previous Button */}
        <div className="hidden md:block">
          <button
            onClick={handlePrevPage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EFE5D5] hover:bg-[#342419] text-[#463324] hover:text-[#FAF5ED] border border-[#D8C7B0] hover:border-[#342419] transition-all text-xs font-medium shadow-2xs group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Previous Pages</span>
          </button>
        </div>

        {/* Mobile Previous Button */}
        <div className="md:hidden">
          <button
            onClick={handleMobilePrev}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EFE5D5] text-[#463324] border border-[#D8C7B0] text-xs font-medium shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
        </div>

        {/* Jump / Flip hint */}
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.ceil(totalPages / 2) }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i * 2 > pageIndex ? "forward" : "backward");
                setPageIndex(i * 2);
              }}
              title={`Jump to page ${i * 2 + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${Math.floor(pageIndex / 2) === i
                ? "bg-[#38261A] w-5"
                : "bg-[#D8C8B2] hover:bg-[#B89E82]"
                }`}
            />
          ))}
        </div>

        {/* Jump / Flip dots for Mobile (single page based) */}
        <div className="md:hidden flex items-center gap-1.5" aria-label="Pages">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > pageIndex ? "forward" : "backward");
                setPageIndex(i);
              }}
              aria-label={`Jump to page ${i + 1}`}
              className={`h-2 rounded-full transition-all diary-focus ${pageIndex === i
                ? "bg-[#38261A] w-4"
                : "bg-[#D8C8B2] w-2 hover:bg-[#B89E82]"
                }`}
            />
          ))}
        </div>

        {/* Desktop Next Button */}
        <div className="hidden md:block">
          <button
            onClick={handleNextPage}
            disabled={!canGoNext}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-xs font-medium shadow-2xs group ${canGoNext
              ? "bg-[#342419] text-[#FAF5ED] border-[#483324] hover:bg-[#483324]"
              : "bg-[#EFE5D5] text-[#A69482] border-[#D8C7B0] cursor-not-allowed opacity-60"
              }`}
          >
            <span>Next Pages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Next Button */}
        <div className="md:hidden">
          <button
            onClick={handleMobileNext}
            disabled={pageIndex + 1 >= totalPages}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium shadow-2xs ${pageIndex + 1 < totalPages
              ? "bg-[#342419] text-[#FAF5ED] border-[#483324]"
              : "bg-[#EFE5D5] text-[#A69482] border-[#D8C7B0] opacity-60"
              }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div >
  );
}
