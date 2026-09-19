import { DiaryCardData, RecentEntryData, DiaryStatsData } from "@/types/dashboard";

export const mockDiaries: DiaryCardData[] = [
  {
    id: "journal-1",
    title: "My Personal Journal",
    entriesCount: 24,
    lastEntry: "Today",
    coverColor: "leather",
    description: "Daily reflections, quiet musings, and evening thoughts.",
  },
  {
    id: "journal-2",
    title: "Travel & Wandering",
    entriesCount: 15,
    lastEntry: "3 days ago",
    coverColor: "forest",
    description: "Memories from train rides, mountain trails, and old bookstores.",
  },
  {
    id: "journal-3",
    title: "Creative Sparks & Poetry",
    entriesCount: 9,
    lastEntry: "Last week",
    coverColor: "burgundy",
    description: "Fragments of ideas, metaphors, and unfinished stanzas.",
  },
];

export const mockRecentEntries: RecentEntryData[] = [
  {
    id: "entry-1",
    date: "Oct 18, 2026",
    dayOfWeek: "Sunday",
    title: "The Autumn Rain & A Warm Cup",
    preview:
      "Today the rain tapped gently against the studio window. I brewed a cup of black tea, sat back, and watched how quiet thoughts find peace on paper. Sometimes all you need is a blank page and honest words...",
    mood: "Peaceful 🌙",
    diaryName: "My Personal Journal",
  },
  {
    id: "entry-2",
    date: "Oct 16, 2026",
    dayOfWeek: "Friday",
    title: "Walking Through Old Bookstores",
    preview:
      "Found an ancient copy of Rilke's Letters to a Young Poet in a corner stall. The scent of aged paper and cedar wood filled the narrow aisle. I wrote down three lines that stayed in my head all afternoon...",
    mood: "Reflective ☕",
    diaryName: "Travel & Wandering",
  },
  {
    id: "entry-3",
    date: "Oct 14, 2026",
    dayOfWeek: "Wednesday",
    title: "Dawn Light over the Garden",
    preview:
      "Woke up before the alarm. The mist was still hanging low over the grass, silver in the early dawn. It felt as though the whole world was holding its breath before the day began...",
    mood: "Inspired ✨",
    diaryName: "My Personal Journal",
  },
  {
    id: "entry-4",
    date: "Oct 11, 2026",
    dayOfWeek: "Sunday",
    title: "Quiet Gratitude for Small Things",
    preview:
      "Clean sheets, fresh bread, a long conversation by the fire with an old friend. Nothing extraordinary occurred today, which is precisely why it was extraordinary...",
    mood: "Grateful 🌸",
    diaryName: "My Personal Journal",
  },
];

export const mockDiaryStats: DiaryStatsData = {
  totalEntries: 48,
  streakDays: 7,
  pagesWritten: 96,
  wordsWritten: 14250,
};
