import React from "react";
import Link from "next/link";
import { BookX, Home, BookOpen, Feather } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden">
      {/* Gentle candlelight desk glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8DAC2]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Brand Stamp */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B] shadow-2xs">
            <Feather className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg tracking-tight text-[#2A1D15]">
            Digital Diary
          </span>
        </Link>
      </header>

      {/* Center Parchment Page */}
      <main className="w-full max-w-xl mx-auto my-auto">
        <div className="relative rounded-2xl p-6 sm:p-10 bg-[#FAF6EE] paper-pattern-lined border border-[#D5C6AC] shadow-xl text-center">
          {/* Red margin guideline on left */}
          <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

          <div className="relative z-10 pl-4 sm:pl-6">
            {/* Ink Blot / Torn Leaf Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#EFE5D5] flex items-center justify-center text-[#614936] mx-auto mb-5 border border-[#DAC8B0] shadow-inner">
              <BookX className="w-8 h-8 text-[#B89360]" />
            </div>

            <div className="inline-block px-3 py-0.5 rounded-full bg-[#EAE0CD] text-[#554233] text-xs font-mono mb-3 border border-[#D8C7B0]">
              404 • Missing Leaf
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#281A12] font-normal tracking-tight mb-3">
              This Page Seems Missing
            </h1>

            <p className="handwriting-ink text-xl sm:text-2xl text-[#524134] leading-relaxed mb-8">
              "Some thoughts wander off the edge of the parchment. This leaf cannot be found in the current volume."
            </p>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E8DFC9]">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] transition-all shadow-xs active:scale-95"
              >
                <Home className="w-4 h-4 text-[#E5C78B]" />
                <span>Return to Dashboard</span>
              </Link>

              <Link
                href="/diary/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BE] text-[#423023] border border-[#DAC8B0] text-xs font-serif transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-[#B89360]" />
                <span>Open Reading Room</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Ambient Footer */}
      <footer className="py-4 text-xs font-serif italic text-[#8E7D6D]">
        Digital Diary • Quiet reflections safely kept
      </footer>
    </div>
  );
}
