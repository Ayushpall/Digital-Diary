export type SearchTimeframe = "all" | "week" | "month" | "older";

export interface SearchableDiaryEntry {
  id: string;
  date: string; // e.g. "18 September 2026"
  dateKey?: string; // "2026-09-18"
  dayOfWeek: string;
  title: string;
  content: string;
  tags: string[];
  mood: string;
  moodEmoji: string;
  diaryName: string;
  timeframe: "week" | "month" | "older";
}
