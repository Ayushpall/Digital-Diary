"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  mockDiaries,
  mockRecentEntries,
  mockDiaryStats,
} from "@/lib/mock-data";
import { DiaryCardData, RecentEntryData, DiaryStatsData, MoodType } from "@/types/dashboard";

export const DIARY_DATA_CHANGED_EVENT = "diary-data-changed";

export function notifyDiaryDataChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DIARY_DATA_CHANGED_EVENT));
  }
}

function formatMoodLabel(mood: string | null | undefined): MoodType {
  if (!mood) return "Reflective ☕";
  const m = mood.toLowerCase();
  if (m.includes("calm") || m === "calm") return "Calm 🌿";
  if (m.includes("reflect") || m === "reflective") return "Reflective ☕";
  if (m.includes("inspir") || m === "inspired") return "Inspired ✨";
  if (m.includes("peace") || m === "peaceful") return "Peaceful 🌙";
  if (m.includes("grate") || m === "grateful") return "Grateful 🌸";
  if (m.includes("happy") || m === "happy") return "Inspired ✨";
  if (m.includes("sad") || m === "melancholy") return "Reflective ☕";
  return "Reflective ☕";
}

export function useDiaryData() {
  const { isSignedIn, isLoaded } = useAuth();
  const [diaries, setDiaries] = useState<DiaryCardData[]>([]);
  const [recentEntries, setRecentEntries] = useState<RecentEntryData[]>([]);
  const [stats, setStats] = useState<DiaryStatsData>({
    totalEntries: 0,
    streakDays: 0,
    pagesWritten: 0,
    wordsWritten: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!isSignedIn) {
      setDiaries(mockDiaries);
      setRecentEntries(mockRecentEntries);
      setStats(mockDiaryStats);
      setLoading(false);
      return;
    }

    try {
      const [diariesRes, entriesRes, statsRes] = await Promise.all([
        fetch("/api/diaries"),
        fetch("/api/entries"),
        fetch("/api/stats"),
      ]);

      if (diariesRes.ok) {
        const data = await diariesRes.json();
        if (data.diaries && Array.isArray(data.diaries)) {
          setDiaries(
            data.diaries.map((d: any) => ({
              id: d.id,
              title: d.title,
              entriesCount: d.pageCount ?? 0,
              lastEntry: new Date(d.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              coverColor: d.coverColor,
              description: d.description || undefined,
            }))
          );
        } else {
          setDiaries([]);
        }
      }

      if (entriesRes.ok) {
        const data = await entriesRes.json();
        if (data.entries && Array.isArray(data.entries)) {
          setRecentEntries(
            data.entries.slice(0, 5).map((e: any) => {
              const d = new Date(e.date);
              return {
                id: e.id,
                date: d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
                title: e.title,
                preview: e.content.slice(0, 120) + (e.content.length > 120 ? "..." : ""),
                mood: formatMoodLabel(e.mood),
                diaryName: e.diaryTitle || "My Journal",
              };
            })
          );
        } else {
          setRecentEntries([]);
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.stats) {
          setStats({
            totalEntries: data.stats.totalEntries ?? data.stats.totalPages ?? 0,
            streakDays: data.stats.streakDays ?? 0,
            pagesWritten: data.stats.pagesWritten ?? data.stats.totalPages ?? 0,
            wordsWritten: data.stats.wordsWritten ?? ((data.stats.totalEntries ?? 0) * 140),
          });
        }
      }
    } catch (err) {
      console.error("Failed to load tenant diary data:", err);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded, fetchData]);

  // Listen to global changes across components and window focus
  useEffect(() => {
    if (!isSignedIn) return;

    const handleDataChange = () => {
      fetchData();
    };

    window.addEventListener(DIARY_DATA_CHANGED_EVENT, handleDataChange);
    window.addEventListener("focus", handleDataChange);

    return () => {
      window.removeEventListener(DIARY_DATA_CHANGED_EVENT, handleDataChange);
      window.removeEventListener("focus", handleDataChange);
    };
  }, [isSignedIn, fetchData]);

  const createDiary = async (title: string, coverColor = "embossed-leather", description = "") => {
    if (!isSignedIn) {
      const newD: DiaryCardData = {
        id: `diary-${Date.now()}`,
        title,
        entriesCount: 0,
        lastEntry: "Just now",
        coverColor: coverColor as any,
        description,
      };
      setDiaries((prev) => [newD, ...prev]);
      return newD;
    }

    const res = await fetch("/api/diaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, coverColor, description }),
    });

    if (res.ok) {
      const data = await res.json();
      await fetchData();
      notifyDiaryDataChanged();
      return data.diary;
    } else {
      const errorData = await res.json().catch(() => ({ error: "Failed to create diary" }));
      throw new Error(errorData.error || "Failed to create diary");
    }
  };

  const deleteDiary = async (diaryId: string) => {
    if (!isSignedIn) {
      setDiaries((prev) => prev.filter((d) => d.id !== diaryId));
      return true;
    }

    try {
      const res = await fetch(`/api/diaries/${diaryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchData();
        notifyDiaryDataChanged();
        return true;
      }
    } catch (err) {
      console.error("Failed to delete diary:", err);
    }
    return false;
  };

  const deleteEntry = async (entryId: string) => {
    if (!isSignedIn) {
      setRecentEntries((prev) => prev.filter((e) => e.id !== entryId));
      return true;
    }

    try {
      const res = await fetch(`/api/entries/${entryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchData();
        notifyDiaryDataChanged();
        return true;
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
    return false;
  };

  const updateDiaryCover = async (diaryId: string, coverColor: string) => {
    if (!isSignedIn) {
      setDiaries((prev) =>
        prev.map((d) => (d.id === diaryId ? { ...d, coverColor: coverColor as any } : d))
      );
      return true;
    }

    try {
      const res = await fetch(`/api/diaries/${diaryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverColor }),
      });
      if (res.ok) {
        await fetchData();
        notifyDiaryDataChanged();
        return true;
      }
    } catch (err) {
      console.error("Failed to update diary cover:", err);
    }
    return false;
  };

  return {
    diaries,
    recentEntries,
    stats,
    loading,
    refresh: fetchData,
    createDiary,
    deleteDiary,
    deleteEntry,
    updateDiaryCover,
  };
}
