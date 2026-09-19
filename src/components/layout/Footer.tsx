"use client";

import React from "react";
import { Feather, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#241811] text-[#C2B2A2] border-t border-[#3D2C20] py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-[#3B291D]">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3A271B] flex items-center justify-center text-[#E8C888] border border-[#523A2A]">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-xl text-[#FAF5EC] block">Digital Diary</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A7869] block">
                Virtual Handwritten Notebook
              </span>
            </div>
          </div>

          {/* Quotation */}
          <div className="text-center md:text-right max-w-sm">
            <p className="font-serif italic text-sm text-[#DFD3C4]">
              "The palest ink is better than the best memory."
            </p>
            <span className="text-[11px] text-[#7A6A5C] font-mono block mt-1">
              — Chinese Proverb
            </span>
          </div>
        </div>

        {/* Bottom Subfooter */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#806F61]">
          <p>© {new Date().getFullYear()} Digital Diary. Built for thoughtful minds.</p>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-[#EDE3D4] transition-colors">
              Back to Top
            </a>
            <a href="#features" className="hover:text-[#EDE3D4] transition-colors">
              Features
            </a>
            <a href="#privacy" className="hover:text-[#EDE3D4] transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
