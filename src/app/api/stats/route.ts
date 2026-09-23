import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Calculates consecutive daily journaling streak ending today or yesterday.
 * Deduplicates multiple entries written on the same calendar day.
 */
function calculateWritingStreak(dates: Date[]): number {
  if (!dates || dates.length === 0) return 0;

  // Convert dates to sorted unique YYYY-MM-DD strings in local/UTC date
  const uniqueDateKeys = Array.from(
    new Set(
      dates.map((d) => {
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })
    )
  ).sort().reverse();

  if (uniqueDateKeys.length === 0) return 0;

  const now = new Date();
  const todayKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayKey = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, "0")}-${String(yesterday.getUTCDate()).padStart(2, "0")}`;

  // Check if the latest entry is today or yesterday
  const latestDate = uniqueDateKeys[0];
  let anchorDate: Date;

  if (latestDate === todayKey) {
    anchorDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  } else if (latestDate === yesterdayKey) {
    anchorDate = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()));
  } else {
    // Streak has ended
    return 0;
  }

  const dateSet = new Set(uniqueDateKeys);
  let streak = 0;
  let checkTime = anchorDate.getTime();

  while (true) {
    const d = new Date(checkTime);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

    if (dateSet.has(key)) {
      streak += 1;
      checkTime -= 24 * 60 * 60 * 1000;
    } else {
      break;
    }
  }

  return streak;
}

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalDiaries, userEntries, entriesThisMonth, favoriteCount] =
      await Promise.all([
        prisma.diary.count({ where: { userId } }),
        prisma.entry.findMany({
          where: { userId },
          select: { content: true, date: true },
        }),
        prisma.entry.count({
          where: {
            userId,
            date: { gte: startOfMonth },
          },
        }),
        prisma.entry.count({
          where: {
            userId,
            isFavorite: true,
          },
        }),
      ]);

    const totalEntries = userEntries.length;

    // Calculate pages written: max(1, ceil(content.length / 500)) per entry
    const pagesWritten = userEntries.reduce((acc, entry) => {
      const len = (entry.content || "").length;
      return acc + Math.max(1, Math.ceil(len / 500));
    }, 0);

    // Calculate words written: sum of words across all entries
    const wordsWritten = userEntries.reduce((acc, entry) => {
      const words = (entry.content || "").trim().split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);

    // Calculate writing streak across all entry dates
    const streakDays = calculateWritingStreak(userEntries.map((e) => e.date));

    return NextResponse.json({
      status: "ok",
      stats: {
        totalDiaries,
        totalEntries,
        totalPages: pagesWritten,
        pagesWritten,
        wordsWritten,
        entriesThisMonth,
        favoriteCount,
        streakDays,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
