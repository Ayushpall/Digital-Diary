"use client";

import React, { useMemo } from "react";
import { HandwritingStyleConfig } from "@/types/handwriting";

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

  // Split text by lines and words while preserving whitespace and newlines
  const paragraphs = useMemo(() => {
    return text.split("\n");
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
        if (para === "") {
          return <div key={`empty-${pIdx}`} className="h-8" />;
        }

        // Split paragraph into words and whitespace
        const tokens = para.split(/(\s+)/);

        return (
          <div key={`para-${pIdx}`} className="min-h-[32px] leading-8">
            {tokens.map((token, tIdx) => {
              // If token is whitespace, preserve it
              if (/^\s+$/.test(token)) {
                return (
                  <span key={`space-${pIdx}-${tIdx}`} className="inline">
                    {token}
                  </span>
                );
              }

              // Compute subtle deterministic rotation (-maxRotation to +maxRotation)
              const hashVal = simpleHash(token, pIdx * 100 + tIdx);
              const normalized = (Math.abs(hashVal) % 1000) / 1000; // 0 to 1
              const rotation = (normalized * 2 - 1) * maxRotation; // -max to +max
              
              // Slight micro-offset on Y axis (e.g. -0.5px to +0.5px) for natural ink baseline
              const yOffset = ((normalized * 2 - 1) * 0.5).toFixed(2);

              return (
                <span
                  key={`word-${pIdx}-${tIdx}`}
                  className="inline-block transition-transform duration-100"
                  style={{
                    transform: `rotate(${rotation.toFixed(2)}deg) translateY(${yOffset}px)`,
                    transformOrigin: "center baseline",
                  }}
                >
                  {token}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
