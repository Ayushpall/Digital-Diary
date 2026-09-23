import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/entries/[id] - Fetch single entry
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { id } = await params;

    const entry = await prisma.entry.findFirst({
      where: { id, userId },
      include: {
        diary: {
          select: { id: true, title: true, coverColor: true, paperStyle: true },
        },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "ok",
      entry: {
        id: entry.id,
        diaryId: entry.diaryId,
        diaryTitle: entry.diary.title,
        coverColor: entry.diary.coverColor,
        paperStyle: entry.diary.paperStyle,
        title: entry.title,
        content: entry.content,
        blocks: entry.blocks,
        handwritingFont: entry.handwritingFont,
        inkColor: entry.inkColor,
        date: entry.date.toISOString(),
        mood: entry.mood,
        weather: entry.weather,
        isFavorite: entry.isFavorite,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching entry:", error);
    return NextResponse.json({ error: "Failed to fetch entry" }, { status: 500 });
  }
}

// PUT /api/entries/[id] - Update entry
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.entry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    let parsedDate: Date | undefined = undefined;
    if (body.date !== undefined && body.date !== null) {
      const candidate = new Date(body.date);
      if (!isNaN(candidate.getTime())) {
        parsedDate = candidate;
      }
    }

    const updated = await prisma.entry.update({
      where: { id },
      data: {
        ...(body.title !== undefined && typeof body.title === "string" ? { title: body.title.trim() } : {}),
        ...(body.content !== undefined && typeof body.content === "string" ? { content: body.content } : {}),
        ...(body.blocks !== undefined ? { blocks: body.blocks } : {}),
        ...(body.handwritingFont !== undefined ? { handwritingFont: body.handwritingFont } : {}),
        ...(body.inkColor !== undefined ? { inkColor: body.inkColor } : {}),
        ...(body.mood !== undefined ? { mood: body.mood } : {}),
        ...(body.weather !== undefined ? { weather: body.weather } : {}),
        ...(body.isFavorite !== undefined ? { isFavorite: Boolean(body.isFavorite) } : {}),
        ...(parsedDate !== undefined ? { date: parsedDate } : {}),
      },
      include: {
        diary: {
          select: { title: true, coverColor: true },
        },
      },
    });

    // Touch the diary's updatedAt timestamp
    await prisma.diary.update({
      where: { id: existing.diaryId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      status: "ok",
      entry: {
        id: updated.id,
        diaryId: updated.diaryId,
        diaryTitle: updated.diary.title,
        coverColor: updated.diary.coverColor,
        title: updated.title,
        content: updated.content,
        blocks: updated.blocks,
        handwritingFont: updated.handwritingFont,
        inkColor: updated.inkColor,
        date: updated.date.toISOString(),
        mood: updated.mood,
        weather: updated.weather,
        isFavorite: updated.isFavorite,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

// DELETE /api/entries/[id] - Delete entry
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { id } = await params;

    const existing = await prisma.entry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.entry.delete({
      where: { id },
    });

    // Touch the diary's updatedAt timestamp
    await prisma.diary.update({
      where: { id: existing.diaryId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ status: "ok", message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
