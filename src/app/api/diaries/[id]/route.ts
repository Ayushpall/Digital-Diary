import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/diaries/[id] - Fetch single diary volume
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { id } = await params;

    const diary = await prisma.diary.findFirst({
      where: { id, userId },
      include: {
        entries: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: { entries: true },
        },
      },
    });

    if (!diary) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", diary });
  } catch (error) {
    console.error("Error fetching diary:", error);
    return NextResponse.json({ error: "Failed to fetch diary" }, { status: 500 });
  }
}

// PUT /api/diaries/[id] - Update diary volume
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { id } = await params;
    const body = await req.json();
    const { title, description, coverColor, paperStyle, isFavorite } = body;

    const existing = await prisma.diary.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }

    const updated = await prisma.diary.update({
      where: { id },
      data: {
        ...(title !== undefined && typeof title === "string" ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(coverColor !== undefined ? { coverColor } : {}),
        ...(paperStyle !== undefined ? { paperStyle } : {}),
        ...(isFavorite !== undefined ? { isFavorite: Boolean(isFavorite) } : {}),
      },
    });

    return NextResponse.json({ status: "ok", diary: updated });
  } catch (error) {
    console.error("Error updating diary:", error);
    return NextResponse.json({ error: "Failed to update diary" }, { status: 500 });
  }
}

// DELETE /api/diaries/[id] - Delete diary volume
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { id } = await params;

    const existing = await prisma.diary.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }

    await prisma.diary.delete({
      where: { id },
    });

    return NextResponse.json({ status: "ok", message: "Diary deleted successfully" });
  } catch (error) {
    console.error("Error deleting diary:", error);
    return NextResponse.json({ error: "Failed to delete diary" }, { status: 500 });
  }
}
