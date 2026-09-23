import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/diaries - List tenant's diaries
export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;

    let diaries = await prisma.diary.findMany({
      where: { userId },
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // If tenant has no diaries yet, initialize with default "My Personal Journal"
    if (diaries.length === 0) {
      const defaultDiary = await prisma.diary.create({
        data: {
          userId,
          title: "My Personal Journal",
          description: "Daily reflections, quiet musings, and evening thoughts.",
          coverColor: "embossed-leather",
          paperStyle: "ruled",
        },
        include: {
          _count: {
            select: { entries: true },
          },
        },
      });
      diaries = [defaultDiary];
    }

    return NextResponse.json({
      status: "ok",
      diaries: diaries.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        coverColor: d.coverColor,
        paperStyle: d.paperStyle,
        isFavorite: d.isFavorite,
        pageCount: d._count.entries,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching diaries:", error);
    return NextResponse.json({ error: "Failed to fetch diaries" }, { status: 500 });
  }
}

// POST /api/diaries - Create a new diary volume for tenant
export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const body = await req.json();
    const { title, description, coverColor = "embossed-leather", paperStyle = "ruled" } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const diary = await prisma.diary.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        coverColor: typeof coverColor === "string" ? coverColor : "embossed-leather",
        paperStyle: typeof paperStyle === "string" ? paperStyle : "ruled",
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        diary: {
          id: diary.id,
          title: diary.title,
          description: diary.description,
          coverColor: diary.coverColor,
          paperStyle: diary.paperStyle,
          isFavorite: diary.isFavorite,
          pageCount: 0,
          createdAt: diary.createdAt,
          updatedAt: diary.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating diary:", error);
    return NextResponse.json({ error: "Failed to create diary" }, { status: 500 });
  }
}
