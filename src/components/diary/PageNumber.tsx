"use client";

import React from "react";

interface PageNumberProps {
  number: number;
  position?: "left" | "right";
}

export function PageNumber({ number, position = "right" }: PageNumberProps) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-serif italic text-[#8A7869] select-none ${
        position === "left" ? "justify-start" : "justify-end"
      }`}
    >
      {position === "left" && (
        <>
          <span className="font-mono text-[11px] text-[#786657]">
            {String(number).padStart(2, "0")}
          </span>
          <span className="text-[#C2B29E] font-sans text-[10px]">❧</span>
        </>
      )}

      {position === "right" && (
        <>
          <span className="text-[#C2B29E] font-sans text-[10px]">☙</span>
          <span className="font-mono text-[11px] text-[#786657]">
            {String(number).padStart(2, "0")}
          </span>
        </>
      )}
    </div>
  );
}
