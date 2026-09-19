"use client";

import React from "react";
import { 
  HandwritingStyleId, 
  HandwritingStyleConfig, 
  HandwritingInkColor, 
  HandwritingFontSize, 
  HandwritingTextAlign 
} from "@/types/handwriting";
import { handwritingStyles, inkColorMap } from "@/lib/handwriting-config";
import { HandwritingText } from "./HandwritingText";

export interface HandwritingRendererProps {
  text: string;
  style?: HandwritingStyleId | HandwritingStyleConfig;
  fontSize?: HandwritingFontSize | string;
  color?: HandwritingInkColor | string;
  alignment?: HandwritingTextAlign;
  enableVariations?: boolean;
  className?: string;
  placeholder?: string;
}

export function HandwritingRenderer({
  text,
  style = "cursive",
  fontSize = "md",
  color = "midnight",
  alignment = "left",
  enableVariations = true,
  className = "",
  placeholder = "Start typing to see your handwriting come alive...",
}: HandwritingRendererProps) {
  // Resolve configuration
  const config: HandwritingStyleConfig =
    typeof style === "string" ? handwritingStyles[style] || handwritingStyles.cursive : style;

  // Resolve color
  const resolvedColor =
    typeof color === "string" && color in inkColorMap
      ? inkColorMap[color as HandwritingInkColor].hex
      : color || config.color;

  // Resolve font size
  const fontSizeStyle: React.CSSProperties = {};
  if (typeof fontSize === "string") {
    switch (fontSize) {
      case "sm":
        fontSizeStyle.fontSize = "1.25rem";
        break;
      case "lg":
        fontSizeStyle.fontSize = "1.75rem";
        break;
      case "xl":
        fontSizeStyle.fontSize = "2.1rem";
        break;
      case "md":
        fontSizeStyle.fontSize = "1.5rem";
        break;
      default:
        fontSizeStyle.fontSize = fontSize; // Custom CSS size
        break;
    }
  }

  // Text alignment
  const alignClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
      ? "text-right"
      : "text-left";

  if (!text || text.trim() === "") {
    return (
      <div
        className={`handwriting-ink italic text-[#A69482]/60 select-none py-2 ${alignClass} ${className}`}
        style={{
          fontFamily: config.fontFamily,
          ...fontSizeStyle,
        }}
      >
        {placeholder}
      </div>
    );
  }

  return (
    <div
      className={`w-full relative ${alignClass} ${className}`}
      style={{
        color: resolvedColor,
        ...fontSizeStyle,
      }}
    >
      <HandwritingText
        text={text}
        config={config}
        rotationVariation={enableVariations ? config.rotationVariation : 0}
      />
    </div>
  );
}
