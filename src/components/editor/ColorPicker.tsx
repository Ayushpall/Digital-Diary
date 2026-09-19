"use client";

import React from "react";
import { EditorInkColor } from "@/types/editor";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  value: EditorInkColor;
  onChange: (color: EditorInkColor) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const inks: { id: EditorInkColor; name: string; hex: string; ring: string }[] = [
    { id: "midnight", name: "Midnight Navy", hex: "bg-[#1B2A3D]", ring: "ring-[#1B2A3D]" },
    { id: "carbon", name: "Carbon Charcoal", hex: "bg-[#232120]", ring: "ring-[#232120]" },
    { id: "sepia", name: "Walnut Sepia", hex: "bg-[#4A3423]", ring: "ring-[#4A3423]" },
    { id: "forest", name: "Forest Green", hex: "bg-[#243B28]", ring: "ring-[#243B28]" },
    { id: "burgundy", name: "Burgundy Wine", hex: "bg-[#4A1D24]", ring: "ring-[#4A1D24]" },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-[#FAF6EE] p-1.5 rounded-xl border border-[#DECDB8] shadow-2xs">
      <div className="pl-1 pr-1 text-[#8C7A6B] hidden sm:flex items-center gap-1 text-xs">
        <Palette className="w-3.5 h-3.5 text-[#B89360]" />
        <span className="font-serif italic">Ink:</span>
      </div>
      <div className="flex items-center gap-1.5 px-1">
        {inks.map((ink) => {
          const isSelected = value === ink.id;
          return (
            <button
              key={ink.id}
              onClick={() => onChange(ink.id)}
              title={ink.name}
              className={`w-5 h-5 rounded-full ${ink.hex} border border-[#DDD0BC] transition-transform ${
                isSelected
                  ? "scale-125 ring-2 ring-[#B89360] ring-offset-2 ring-offset-[#FAF6EE]"
                  : "opacity-75 hover:opacity-100 hover:scale-110"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
