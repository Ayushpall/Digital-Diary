export type DiaryMood =
  | "happy"
  | "sad"
  | "motivated"
  | "tired"
  | "loved"
  | "normal";

export interface MoodOption {
  id: DiaryMood;
  emoji: string;
  label: string;
}

export const moodOptions: MoodOption[] = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "motivated", emoji: "🔥", label: "Motivated" },
  { id: "tired", emoji: "😴", label: "Tired" },
  { id: "loved", emoji: "❤️", label: "Loved" },
  { id: "normal", emoji: "😐", label: "Normal" },
];

export const stickerList = ["❤️", "⭐", "🌸", "☀️", "🎯", "✈️", "📚"] as const;
export type StickerItem = typeof stickerList[number];

export type BlockType = "text" | "image" | "drawing" | "sticker";

export interface TextBlock {
  id: string;
  type: "text";
  content: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  caption?: string;
}

export interface DrawingBlock {
  id: string;
  type: "drawing";
  dataUrl: string;
  caption?: string;
}

export interface StickerBlock {
  id: string;
  type: "sticker";
  sticker: StickerItem;
  label?: string;
}

export type PageBlock = TextBlock | ImageBlock | DrawingBlock | StickerBlock;
