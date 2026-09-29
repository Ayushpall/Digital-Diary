"use client";

import React, { useMemo } from "react";
import { HandwritingStyleConfig } from "@/types/handwriting";
import { parseFormattedText } from "@/lib/rich-text";

interface HandwritingTextProps {
  text: string;
  config: HandwritingStyleConfig;
  rotationVariation?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Simple deterministic hash for string to get consistent pseudo-random numbers
function simpleHash(str: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i) + index;
    hash |= 0;
  }
  return hash;
}

export function HandwritingText({
  text,
  config,
  rotationVariation,
  className = "",
  style = {},
}: HandwritingTextProps) {
  const maxRotation =
    rotationVariation !== undefined ? rotationVariation : config.rotationVariation;

  // Split text by paragraphs and formatted runs (supports both rich HTML and plain text)
  const paragraphs = useMemo(() => {
    return parseFormattedText(text);
  }, [text]);

  if (!text) {
    return null;
  }

  return (
    <div
      className={`handwriting-ink whitespace-pre-wrap break-words ${config.fontFamilyClass} ${className}`}
      style={{
        fontFamily: config.fontFamily,
        letterSpacing: config.letterSpacing,
        lineHeight: config.lineHeight,
        ...style,
      }}
    >
      {paragraphs.map((para, pIdx) => {
        const alignClass =
          para.align === "center"
            ? "text-center"
            : para.align === "right"
            ? "text-right"
            : "text-left";

        const totalText = para.runs.map((r) => r.text).join("");
        if (totalText === "") {
          return <div key={`empty-${pIdx}`} className="h-8" />;
        }

        return (
          <div key={`para-${pIdx}`} className={`min-h-[32px] leading-8 ${alignClass}`}>
            {para.runs.map((run, rIdx) => {
              // Split run text into words and whitespace
              const tokens = run.text.split(/(\s+)/);

              const runStyleClass = [
                run.bold ? "font-bold" : "",
                run.italic ? "italic" : "",
                run.underline ? "underline underline-offset-4 decoration-[#B89360]/60" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <React.Fragment key={`run-${pIdx}-${rIdx}`}>
                  {tokens.map((token, tIdx) => {
                    // If token is whitespace, preserve it
                    if (/^\s+$/.test(token)) {
                      return (
                        <span key={`space-${pIdx}-${rIdx}-${tIdx}`} className="inline">
                          {token}
                        </span>
                      );
                    }

                    // Compute subtle deterministic rotation (-maxRotation to +maxRotation)
                    const hashVal = simpleHash(token, pIdx * 1000 + rIdx * 100 + tIdx);
                    const normalized = (Math.abs(hashVal) % 1000) / 1000; // 0 to 1
                    const rotation = (normalized * 2 - 1) * maxRotation; // -max to +max
                    
                    // Slight micro-offset on Y axis for natural ink baseline
                    const yOffset = ((normalized * 2 - 1) * 0.5).toFixed(2);

                    return (
                      <span
                        key={`word-${pIdx}-${rIdx}-${tIdx}`}
                        className={`inline-block transition-transform duration-100 ${runStyleClass}`}
                        style={{
                          transform: `rotate(${rotation.toFixed(2)}deg) translateY(${yOffset}px)`,
                          transformOrigin: "center baseline",
                        }}
                      >
                        {token}
                      </span>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
