export type MoodType = "Calm 🌿" | "Reflective ☕" | "Inspired ✨" | "Peaceful 🌙" | "Grateful 🌸";

export type DiaryCoverStyle =
  | "leather"
  | "forest"
  | "burgundy"
  | "navy"
  | "embossed-leather"
  | "rain-forest"
  | "writer-celestial"
  | "creative-typewriter";

export interface DiaryCardData {
  id: string;
  title: string;
  entriesCount: number;
  lastEntry: string;
  coverColor: DiaryCoverStyle;
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
  habitsSummary?: {
    completed: number;
    total: number;
    percentage: number;
  };
  studySummary?: {
    tasksDue: number;
    upcomingExams: number;
  };
}
