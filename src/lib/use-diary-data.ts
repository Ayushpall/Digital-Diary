"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  mockDiaries,
  mockRecentEntries,
  mockDiaryStats,
} from "@/lib/mock-data";
import { DiaryCardData, RecentEntryData, DiaryStatsData } from "@/types/dashboard";

export function useDiaryData() {
  const { isSignedIn, isLoaded } = useAuth();
  const [diaries, setDiaries] = useState<DiaryCardData[]>(mockDiaries);
  const [recentEntries, setRecentEntries] = useState<RecentEntryData[]>(mockRecentEntries);
  const [stats, setStats] = useState<DiaryStatsData>(mockDiaryStats);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!isSignedIn) {
      setDiaries(mockDiaries);
      setRecentEntries(mockRecentEntries);
      setStats(mockDiaryStats);
      return;
    }

    setLoading(true);
    try {
      const [diariesRes, entriesRes, statsRes] = await Promise.all([
        fetch("/api/diaries"),
        fetch("/api/entries"),
        fetch("/api/stats"),
      ]);

      if (diariesRes.ok) {
        const data = await diariesRes.json();
        if (data.diaries && data.diaries.length > 0) {
          setDiaries(
            data.diaries.map((d: any) => ({
              id: d.id,
              title: d.title,
              entriesCount: d.pageCount,
              lastEntry: new Date(d.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              coverColor: d.coverColor,
              description: d.description || undefined,
            }))
          );
        } else {
          // If fresh tenant with 0 diaries, keep mockDiaries for pleasant empty state
          setDiaries(mockDiaries);
        }
      }

      if (entriesRes.ok) {
        const data = await entriesRes.json();
        if (data.entries && data.entries.length > 0) {
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
                mood: (e.mood as any) || "Reflective ☕",
                diaryName: e.diaryTitle || "My Journal",
              };
            })
          );
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.stats) {
          setStats({
            totalEntries: data.stats.totalPages,
            streakDays: data.stats.streakDays,
            pagesWritten: data.stats.totalPages,
            wordsWritten: data.stats.totalPages * 140,
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

  const createDiary = async (title: string, coverColor = "burgundy", description = "") => {
    if (!isSignedIn) {
      // In demo mode, update local state
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
      fetchData();
    }
  };

  return {
    diaries,
    recentEntries,
    stats,
    loading,
    refresh: fetchData,
    createDiary,
  };
}
