import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/entries/[id] - Fetch single entry
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const entry = await prisma.entry.findFirst({
      where: { id, userId },
      include: {
        diary: {
          select: { title: true, coverColor: true, paperStyle: true },
        },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", entry });
  } catch (error) {
    console.error("Error fetching entry:", error);
    return NextResponse.json({ error: "Failed to fetch entry" }, { status: 500 });
  }
}

// PUT /api/entries/[id] - Update entry
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.entry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const updated = await prisma.entry.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.blocks !== undefined && { blocks: body.blocks }),
        ...(body.handwritingFont !== undefined && { handwritingFont: body.handwritingFont }),
        ...(body.inkColor !== undefined && { inkColor: body.inkColor }),
        ...(body.mood !== undefined && { mood: body.mood }),
        ...(body.weather !== undefined && { weather: body.weather }),
        ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
      },
    });

    return NextResponse.json({ status: "ok", entry: updated });
  } catch (error) {
    console.error("Error updating entry:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

// DELETE /api/entries/[id] - Delete entry
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({ status: "ok", message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
