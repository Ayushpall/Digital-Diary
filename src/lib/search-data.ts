import { SearchableDiaryEntry } from "@/types/search";

export const mockSearchEntries: SearchableDiaryEntry[] = [
  {
    id: "search-1",
    date: "18 September 2026",
    dateKey: "2026-09-18",
    dayOfWeek: "Friday",
    title: "A New Venture & Clean Ink",
    content:
      "Today I had an idea about starting a startup focused on tactile digital goods. I want to build things that slow people down instead of demanding frantic attention. Explored user journeys and interface aesthetics late into the evening.",
    tags: ["startup", "ideas", "technology", "design"],
    mood: "Inspired",
    moodEmoji: "😊",
    diaryName: "My Personal Journal",
    timeframe: "week",
  },
  {
    id: "search-2",
    date: "12 September 2026",
    dayOfWeek: "Saturday",
    title: "Coffee & Brainstorming",
    content:
      "Discussed startup ideas with my friends over dark pour-over coffee. We debated the philosophy of software as furniture — durable, quiet, and personal. Left with a notebook full of margins and arrows.",
    tags: ["startup", "friends", "coffee", "brainstorming"],
    mood: "Energized",
    moodEmoji: "🔥",
    diaryName: "Creative Sparks",
    timeframe: "week",
  },
  {
    id: "search-3",
    date: "7 September 2026",
    dayOfWeek: "Monday",
    title: "Rain on Slate & Quiet Hours",
    content:
      "Steady September rain drumming against the slate roof. Lighted a beeswax candle and read Thoreau's reflections on solitude. Writing in cursive makes thoughts feel patient.",
    tags: ["rain", "solitude", "reading", "autumn"],
    mood: "Peaceful",
    moodEmoji: "🌙",
    diaryName: "My Personal Journal",
    timeframe: "month",
  },
  {
    id: "search-4",
    date: "2 September 2026",
    dayOfWeek: "Wednesday",
    title: "Morning Garden Walk",
    content:
      "The morning air smelled of wet cedar and fallen pine needles. Observed two deer grazing quietly beyond the stonewall. Nature never hurries, yet everything gets accomplished.",
    tags: ["nature", "morning", "garden", "gratitude"],
    mood: "Calm",
    moodEmoji: "🌿",
    diaryName: "Travel & Wandering",
    timeframe: "month",
  },
  {
    id: "search-5",
    date: "24 August 2026",
    dayOfWeek: "Monday",
    title: "Old Bookshops on King Street",
    content:
      "Stumbled into an antiquarian bookstore tucked between two bakeries. Found a leatherbound ledger from 1912 with handwritten maritime logs. The quality of old paper and walnut ink is unmatched.",
    tags: ["books", "vintage", "antiques", "history"],
    mood: "Reflective",
    moodEmoji: "☕",
    diaryName: "Travel & Wandering",
    timeframe: "older",
  },
  {
    id: "search-6",
    date: "14 August 2026",
    dayOfWeek: "Friday",
    title: "Overcoming Resistance",
    content:
      "Felt stuck in my creative work earlier this week. The cure, as always, was not more thinking, but simply sitting down and writing honest sentences on paper until momentum returned.",
    tags: ["creativity", "writing", "momentum", "habits"],
    mood: "Relieved",
    moodEmoji: "✨",
    diaryName: "My Personal Journal",
    timeframe: "older",
  },
];
