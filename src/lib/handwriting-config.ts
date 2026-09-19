import { HandwritingStyleConfig, HandwritingStyleId, HandwritingInkColor } from "@/types/handwriting";

export const handwritingStyles: Record<HandwritingStyleId, HandwritingStyleConfig> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Structured, upright calligraphic penmanship",
    fontFamily: "var(--font-kalam), 'Kalam', cursive",
    fontFamilyClass: "font-handwritingAlt",
    fontSize: "1.5rem",
    letterSpacing: "0.015em",
    lineHeight: "2rem", // 32px matches ruled paper lines
    rotationVariation: 0.6, // subtle organic slant variation
    color: "#232120",
  },
  casual: {
    id: "casual",
    name: "Casual",
    description: "Relaxed, everyday natural print handwriting",
    fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
    fontFamilyClass: "font-handwritingCasual",
    fontSize: "1.55rem",
    letterSpacing: "0.025em",
    lineHeight: "2rem",
    rotationVariation: 0.9, // slightly more playful rotation
    color: "#4A3423",
  },
  cursive: {
    id: "cursive",
    name: "Cursive",
    description: "Flowing, elegant fountain-pen cursive script",
    fontFamily: "var(--font-caveat), 'Caveat', cursive",
    fontFamilyClass: "font-handwriting",
    fontSize: "1.65rem",
    letterSpacing: "0.01em",
    lineHeight: "2rem",
    rotationVariation: 1.2, // expressive slant variations
    color: "#1B2A3D",
  },
};

export const inkColorMap: Record<HandwritingInkColor, { hex: string; textClass: string; label: string }> = {
  midnight: { hex: "#1B2A3D", textClass: "text-[#1B2A3D]", label: "Midnight Navy" },
  carbon: { hex: "#232120", textClass: "text-[#232120]", label: "Carbon Charcoal" },
  sepia: { hex: "#4A3423", textClass: "text-[#4A3423]", label: "Walnut Sepia" },
  forest: { hex: "#243B28", textClass: "text-[#243B28]", label: "Forest Green" },
  burgundy: { hex: "#4A1D24", textClass: "text-[#4A1D24]", label: "Burgundy Wine" },
};
