"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, Feather } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error quietly
    console.error("Diary render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8DAC2]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B]">
            <Feather className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg tracking-tight text-[#2A1D15]">
            Digital Diary
          </span>
        </Link>
      </header>

      {/* Main Error Box */}
      <main className="w-full max-w-xl mx-auto my-auto">
        <div className="relative rounded-2xl p-6 sm:p-10 bg-[#FAF6EE] paper-pattern-lined border border-[#D5C6AC] shadow-xl text-center">
          <div className="absolute top-0 bottom-0 left-8 sm:left-10 w-[1.5px] bg-[#E59388]/35 pointer-events-none" />

          <div className="relative z-10 pl-4 sm:pl-6">
            <div className="w-16 h-16 rounded-2xl bg-[#F3E7E4] flex items-center justify-center text-[#9C5449] mx-auto mb-5 border border-[#E2C7C4] shadow-inner">
              <AlertCircle className="w-8 h-8 text-[#9C5449]" />
            </div>

            <div className="inline-block px-3 py-0.5 rounded-full bg-[#EAE0CD] text-[#554233] text-xs font-mono mb-3 border border-[#D8C7B0]">
              Temporary Ink Smudge
            </div>

            <h1 className="font-serif text-3xl text-[#281A12] font-normal tracking-tight mb-3">
              Something Interrupted Your Reflection
            </h1>

            <p className="handwriting-ink text-xl text-[#524134] leading-relaxed mb-8">
              "An unexpected smudge occurred on this leaf. Don't worry — your thoughts and journal volumes remain intact."
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E8DFC9]">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] transition-all shadow-xs active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#E5C78B]" />
                <span>Gently Retry Page</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BE] text-[#423023] border border-[#DAC8B0] text-xs font-serif transition-all active:scale-95"
              >
                <Home className="w-4 h-4 text-[#B89360]" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-xs font-serif italic text-[#8E7D6D]">
        Digital Diary • Safe local journal environment
      </footer>
    </div>
  );
}
