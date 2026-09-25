/**
 * Utility functions for calculating streaks and statistics for habits.
 * All calculations are derived deterministically from HabitCompletion dates.
 */

export interface HabitCompletionRecord {
  id: string;
  habitId: string;
  completedDate: Date | string;
  count: number;
}

export interface HabitWithCompletions {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  category: string;
  frequency: string;
  targetCount: number;
  startDate: Date | string;
  isActive: boolean;
  completions: HabitCompletionRecord[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Normalizes a Date or date string to local "YYYY-MM-DD".
 */
export function toDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes a Date or date string to UTC "YYYY-MM-DD" for stable comparison.
 */
export function toUtcDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates current and best daily streaks.
 * Consecutive calendar days completed ending today or yesterday.
 */
export function calculateDailyStreaks(completedDateKeys: string[]): {
  currentStreak: number;
  bestStreak: number;
} {
  if (!completedDateKeys || completedDateKeys.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Deduplicate and sort descending
  const uniqueKeys = Array.from(new Set(completedDateKeys)).sort().reverse();
  const keySet = new Set(uniqueKeys);

  const now = new Date();
  const todayKey = toDateKey(now);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayKey = toDateKey(yesterday);

  // Determine current streak
  let currentStreak = 0;
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (keySet.has(todayKey)) {
    // Has completed today
    while (keySet.has(toDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  } else if (keySet.has(yesterdayKey)) {
    // Has completed yesterday, today still pending
    cursor = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    while (keySet.has(toDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Calculate best streak historically
  let bestStreak = 0;
  let tempStreak = 0;
  const sortedAsc = Array.from(keySet).sort();

  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedAsc[i - 1]);
      const currDate = new Date(sortedAsc[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return { currentStreak, bestStreak };
}

/**
 * Aggregates statistics for habit dashboard.
 */
export function calculateOverallHabitStats(
  habits: HabitWithCompletions[],
  targetDate: Date = new Date()
) {
  const totalHabits = habits.filter((h) => h.isActive).length;
  const todayKey = toDateKey(targetDate);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let todayCompletedCount = 0;
  let totalCompletionsThisMonth = 0;
  let maxCurrentStreak = 0;
  let maxBestStreak = 0;

  // Track daily completion counts for the month
  const monthDayMap: Record<number, number> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    monthDayMap[d] = 0;
  }

  const enrichedHabits = habits.map((habit) => {
    const completedDateKeys = habit.completions.map((c) => toDateKey(c.completedDate));
    const isCompletedToday = completedDateKeys.includes(todayKey);
    if (isCompletedToday) {
      todayCompletedCount += 1;
    }

    const { currentStreak, bestStreak } = calculateDailyStreaks(completedDateKeys);
    if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak;
    if (bestStreak > maxBestStreak) maxBestStreak = bestStreak;

    // Filter completions in this month
    const thisMonthCompletions = habit.completions.filter((c) => {
      const d = typeof c.completedDate === "string" ? new Date(c.completedDate) : c.completedDate;
      return d.getFullYear() === year && d.getMonth() === month;
    });

    totalCompletionsThisMonth += thisMonthCompletions.length;

    thisMonthCompletions.forEach((c) => {
      const d = typeof c.completedDate === "string" ? new Date(c.completedDate) : c.completedDate;
      const dayNum = d.getDate();
      if (monthDayMap[dayNum] !== undefined) {
        monthDayMap[dayNum] += 1;
      }
    });

    return {
      ...habit,
      isCompletedToday,
      currentStreak,
      bestStreak,
      monthCompletionCount: thisMonthCompletions.length,
      completionKeys: completedDateKeys,
    };
  });

  const todayProgressPercent =
    totalHabits > 0 ? Math.round((todayCompletedCount / totalHabits) * 100) : 0;

  // Monthly expected total: totalHabits * days passed in month
  const todayDayNum = targetDate.getDate();
  const expectedMonthSoFar = totalHabits * todayDayNum;
  const monthlyCompletionPercent =
    expectedMonthSoFar > 0
      ? Math.min(100, Math.round((totalCompletionsThisMonth / expectedMonthSoFar) * 100))
      : 0;

  return {
    totalHabits,
    todayCompletedCount,
    todayRemainingCount: Math.max(0, totalHabits - todayCompletedCount),
    todayProgressPercent,
    currentStreak: maxCurrentStreak,
    bestStreak: maxBestStreak,
    completedThisMonth: totalCompletionsThisMonth,
    monthlyCompletionPercent,
    monthDayMap,
    enrichedHabits,
  };
}
