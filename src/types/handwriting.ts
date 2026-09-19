export type HandwritingStyleId = "classic" | "casual" | "cursive";

export interface HandwritingStyleConfig {
  id: HandwritingStyleId;
  name: string;
  description: string;
  fontFamily: string; // CSS font family variable or class
  fontFamilyClass: string;
  fontSize: string; // default font size e.g. "1.5rem"
  letterSpacing: string; // e.g. "0.02em"
  lineHeight: string; // e.g. "2rem" (32px to match ruled lines)
  rotationVariation: number; // max degree of rotation variation, e.g. 0.8
  color: string; // default ink color hex or CSS
}

export type HandwritingInkColor = "midnight" | "carbon" | "sepia" | "forest" | "burgundy";

export type HandwritingFontSize = "sm" | "md" | "lg" | "xl";

export type HandwritingTextAlign = "left" | "center" | "right";
