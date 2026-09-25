import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/habits/[id]/complete - Toggle completion for a specific calendar date
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { userId } = authUser;

    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty, defaults to today
    }

    const targetDate = body?.date ? new Date(body.date) : new Date();
    // Normalize to midnight UTC date
    const normalizedDate = new Date(
      Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate())
    );

    // Check if completion record exists
    const existing = await prisma.habitCompletion.findFirst({
      where: {
        habitId: id,
        completedDate: normalizedDate,
      },
    });

    if (existing) {
      // Toggle off / undo
      await prisma.habitCompletion.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        status: "ok",
        action: "uncompleted",
        completed: false,
        habitId: id,
        date: normalizedDate.toISOString(),
      });
    } else {
      // Mark completed
      const completion = await prisma.habitCompletion.create({
        data: {
          habitId: id,
          userId,
          completedDate: normalizedDate,
          count: 1,
        },
      });

      return NextResponse.json({
        status: "ok",
        action: "completed",
        completed: true,
        habitId: id,
        date: normalizedDate.toISOString(),
        completionId: completion.id,
      });
    }
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    return NextResponse.json({ error: "Failed to toggle completion" }, { status: 500 });
  }
}
