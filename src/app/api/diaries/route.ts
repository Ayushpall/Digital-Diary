import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/diaries - List tenant's diaries
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diaries = await prisma.diary.findMany({
      where: { userId },
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, coverColor = "burgundy", paperStyle = "ruled" } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Ensure tenant user record exists in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@placeholder.local`,
      },
    });

    const diary = await prisma.diary.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        coverColor,
        paperStyle,
      },
    });

    return NextResponse.json({ status: "ok", diary }, { status: 201 });
  } catch (error) {
    console.error("Error creating diary:", error);
    return NextResponse.json({ error: "Failed to create diary" }, { status: 500 });
  }
}
