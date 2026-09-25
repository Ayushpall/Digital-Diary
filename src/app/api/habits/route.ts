import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { calculateOverallHabitStats } from "@/lib/habit-streaks";

export const dynamic = "force-dynamic";

// GET /api/habits - List tenant's habits with completions and calculated stats
export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { searchParams } = new URL(req.url);
    const categoryFilter = searchParams.get("category");
    const frequencyFilter = searchParams.get("frequency");

    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...(frequencyFilter ? { frequency: frequencyFilter } : {}),
      },
      include: {
        completions: {
          orderBy: { completedDate: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const stats = calculateOverallHabitStats(habits);

    return NextResponse.json({
      status: "ok",
      habits: stats.enrichedHabits,
      stats: {
        totalHabits: stats.totalHabits,
        todayCompletedCount: stats.todayCompletedCount,
        todayRemainingCount: stats.todayRemainingCount,
        todayProgressPercent: stats.todayProgressPercent,
        currentStreak: stats.currentStreak,
        bestStreak: stats.bestStreak,
        completedThisMonth: stats.completedThisMonth,
        monthlyCompletionPercent: stats.monthlyCompletionPercent,
        monthDayMap: stats.monthDayMap,
      },
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

// POST /api/habits - Create a new habit
export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const body = await req.json();
    const {
      name,
      description,
      icon = "✨",
      category = "General",
      frequency = "daily",
      targetCount = 1,
      startDate,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Habit name is required" }, { status: 400 });
    }

    const validFrequency = ["daily", "weekly", "monthly"].includes(frequency?.toLowerCase())
      ? frequency.toLowerCase()
      : "daily";

    const habit = await prisma.habit.create({
      data: {
        userId,
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || "✨",
        category: category?.trim() || "General",
        frequency: validFrequency,
        targetCount: typeof targetCount === "number" && targetCount > 0 ? targetCount : 1,
        startDate: startDate ? new Date(startDate) : new Date(),
      },
      include: {
        completions: true,
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        habit: {
          ...habit,
          isCompletedToday: false,
          currentStreak: 0,
          bestStreak: 0,
          monthCompletionCount: 0,
          completionKeys: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
