import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/entries - List tenant entries with optional filtering
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const diaryId = searchParams.get("diaryId");
    const query = searchParams.get("q");
    const favoriteOnly = searchParams.get("favorite") === "true";

    const entries = await prisma.entry.findMany({
      where: {
        userId,
        ...(diaryId ? { diaryId } : {}),
        ...(favoriteOnly ? { isFavorite: true } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        diary: {
          select: { title: true, coverColor: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      status: "ok",
      entries: entries.map((e) => ({
        id: e.id,
        diaryId: e.diaryId,
        diaryTitle: e.diary.title,
        coverColor: e.diary.coverColor,
        title: e.title,
        content: e.content,
        blocks: e.blocks,
        handwritingFont: e.handwritingFont,
        inkColor: e.inkColor,
        date: e.date.toISOString(),
        mood: e.mood,
        weather: e.weather,
        isFavorite: e.isFavorite,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

// POST /api/entries - Create a new entry in tenant's diary
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      diaryId,
      title,
      content = "",
      blocks = null,
      handwritingFont = "Newsreader",
      inkColor = "#1A2536",
      mood = null,
      weather = null,
      date = null,
      isFavorite = false,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Verify diary exists and belongs to this tenant, or auto-assign/create default
    let targetDiaryId = diaryId;
    if (!targetDiaryId) {
      const defaultDiary = await prisma.diary.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });

      if (defaultDiary) {
        targetDiaryId = defaultDiary.id;
      } else {
        const newDiary = await prisma.diary.create({
          data: {
            userId,
            title: "My Personal Journal",
            coverColor: "burgundy",
            paperStyle: "ruled",
          },
        });
        targetDiaryId = newDiary.id;
      }
    } else {
      const verified = await prisma.diary.findFirst({
        where: { id: targetDiaryId, userId },
      });
      if (!verified) {
        return NextResponse.json({ error: "Diary volume not found" }, { status: 404 });
      }
    }

    const entry = await prisma.entry.create({
      data: {
        userId,
        diaryId: targetDiaryId,
        title: title.trim(),
        content: typeof content === "string" ? content : "",
        blocks: blocks || undefined,
        handwritingFont,
        inkColor,
        mood,
        weather,
        isFavorite: Boolean(isFavorite),
        date: date && !isNaN(new Date(date).getTime()) ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({ status: "ok", entry }, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
