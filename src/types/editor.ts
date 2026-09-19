export type HandwritingFont = "classic" | "casual" | "cursive" | "caveat" | "kalam";

export type EditorInkColor = "midnight" | "carbon" | "sepia" | "forest" | "burgundy";

export type EditorFontSize = "sm" | "md" | "lg" | "xl";

export type EditorTextAlign = "left" | "center" | "right";

export interface EditorSettings {
  font: HandwritingFont;
  inkColor: EditorInkColor;
  fontSize: EditorFontSize;
  textAlign: EditorTextAlign;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

export interface DiaryEntryState {
  title: string;
  content: string;
  date: string;
  settings: EditorSettings;
}
