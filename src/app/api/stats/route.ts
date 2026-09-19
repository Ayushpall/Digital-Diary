import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalDiaries, totalEntries, entriesThisMonth, favoriteCount] =
      await Promise.all([
        prisma.diary.count({ where: { userId } }),
        prisma.entry.count({ where: { userId } }),
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

    return NextResponse.json({
      status: "ok",
      stats: {
        totalDiaries,
        totalPages: totalEntries,
        entriesThisMonth,
        favoriteCount,
        streakDays: totalEntries > 0 ? Math.min(totalEntries, 5) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
