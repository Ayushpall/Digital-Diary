import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/habits/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const habit = await prisma.habit.findFirst({
      where: { id, userId: authUser.userId },
      include: { completions: { orderBy: { completedDate: "desc" } } },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", habit });
  } catch (error) {
    console.error("Error fetching habit:", error);
    return NextResponse.json({ error: "Failed to fetch habit" }, { status: 500 });
  }
}

// PATCH /api/habits/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.habit.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, icon, category, frequency, targetCount, isActive } = body;

    const updated = await prisma.habit.update({
      where: { id },
      data: {
        ...(name && typeof name === "string" ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(icon !== undefined ? { icon: icon?.trim() || "✨" } : {}),
        ...(category !== undefined ? { category: category?.trim() || "General" } : {}),
        ...(frequency && ["daily", "weekly", "monthly"].includes(frequency.toLowerCase())
          ? { frequency: frequency.toLowerCase() }
          : {}),
        ...(typeof targetCount === "number" && targetCount > 0 ? { targetCount } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      include: { completions: true },
    });

    return NextResponse.json({ status: "ok", habit: updated });
  } catch (error) {
    console.error("Error updating habit:", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
  }
}

// DELETE /api/habits/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.habit.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ status: "ok", message: "Habit deleted" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
