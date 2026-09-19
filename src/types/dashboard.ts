export type MoodType = "Calm 🌿" | "Reflective ☕" | "Inspired ✨" | "Peaceful 🌙" | "Grateful 🌸";

export interface DiaryCardData {
  id: string;
  title: string;
  entriesCount: number;
  lastEntry: string;
  coverColor: "leather" | "forest" | "burgundy" | "navy";
  description?: string;
}

export interface RecentEntryData {
  id: string;
  date: string;
  dayOfWeek: string;
  title: string;
  preview: string;
  mood: MoodType;
  diaryName: string;
}

export interface DiaryStatsData {
  totalEntries: number;
  streakDays: number;
  pagesWritten: number;
  wordsWritten: number;
}
