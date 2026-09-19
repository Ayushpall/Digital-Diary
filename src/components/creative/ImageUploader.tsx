"use client";

import React, { useRef } from "react";
import { Upload, Image as ImageIcon, X, Sparkles } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string, caption?: string) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader for in-browser local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onImageSelected(result, file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <div className="bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-dashed border-[#D5C6AC] shadow-2xs text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="max-w-xs mx-auto flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-[#EFE5D5] flex items-center justify-center text-[#553E2C] mb-3 border border-[#DAC9B1]">
          <ImageIcon className="w-6 h-6 text-[#B89360]" />
        </div>

        <h4 className="font-serif text-base text-[#2A1D15] font-normal mb-1">
          Attach Photo or Keepsake
        </h4>
        <p className="text-xs text-[#7A695B] font-light leading-relaxed mb-4">
          Select an image from your computer to tape onto your journal leaf (local preview only).
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-[#E5C78B]" />
          <span>Browse Device Image</span>
        </button>
      </div>
    </div>
  );
}
