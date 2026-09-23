import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/entries - List tenant entries with optional filtering
export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { searchParams } = new URL(req.url);
    const diaryId = searchParams.get("diaryId");
    const query = searchParams.get("q");
    const favoriteOnly = searchParams.get("favorite") === "true";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDateParam && !isNaN(new Date(startDateParam).getTime())) {
      dateFilter.gte = new Date(startDateParam);
    }
    if (endDateParam && !isNaN(new Date(endDateParam).getTime())) {
      dateFilter.lte = new Date(endDateParam);
    }

    const entries = await prisma.entry.findMany({
      where: {
        userId,
        ...(diaryId ? { diaryId } : {}),
        ...(favoriteOnly ? { isFavorite: true } : {}),
        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
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
          select: { title: true, coverColor: true, paperStyle: true },
        },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      status: "ok",
      entries: entries.map((e) => ({
        id: e.id,
        diaryId: e.diaryId,
        diaryTitle: e.diary.title,
        coverColor: e.diary.coverColor,
        paperStyle: e.diary.paperStyle,
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
        updatedAt: e.updatedAt,
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
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
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

    // Verify target diary belongs to user, or resolve/create default
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
            description: "Daily reflections, quiet musings, and evening thoughts.",
            coverColor: "embossed-leather",
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

    let parsedDate = new Date();
    if (date) {
      const candidate = new Date(date);
      if (!isNaN(candidate.getTime())) {
        parsedDate = candidate;
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
        mood: mood || null,
        weather: weather || null,
        isFavorite: Boolean(isFavorite),
        date: parsedDate,
      },
      include: {
        diary: {
          select: { title: true, coverColor: true },
        },
      },
    });

    // Touch the diary's updatedAt timestamp
    await prisma.diary.update({
      where: { id: targetDiaryId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(
      {
        status: "ok",
        entry: {
          id: entry.id,
          diaryId: entry.diaryId,
          diaryTitle: entry.diary.title,
          coverColor: entry.diary.coverColor,
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
