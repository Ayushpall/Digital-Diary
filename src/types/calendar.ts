export interface CalendarEntryData {
  id: string;
  dateKey: string; // "YYYY-MM-DD" e.g. "2026-09-18"
  dateFormatted: string; // "18 September 2026"
  dayOfWeek: string; // "Friday"
  title: string;
  content: string;
  moodEmoji: string; // "😊", "🔥", "😔", etc.
  moodLabel: string; // "Inspired", "Fired Up", "Melancholy", etc.
  inkColor: "midnight" | "carbon" | "sepia" | "forest" | "burgundy";
  diaryName: string;
  wordCount: number;
}
