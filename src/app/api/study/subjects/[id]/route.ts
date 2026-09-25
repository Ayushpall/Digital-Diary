import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/study/subjects/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const subject = await prisma.subject.findFirst({
      where: { id, userId: authUser.userId },
      include: {
        tasks: { orderBy: { dueDate: "asc" } },
        sessions: { orderBy: { scheduledDate: "desc" } },
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", subject });
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json({ error: "Failed to fetch subject" }, { status: 500 });
  }
}

// PATCH /api/study/subjects/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.subject.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, icon, color, description } = body;

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && typeof name === "string" ? { name: name.trim() } : {}),
        ...(icon !== undefined ? { icon: icon?.trim() || "📚" } : {}),
        ...(color !== undefined ? { color: color?.trim() || "#8E6945" } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
      },
    });

    return NextResponse.json({ status: "ok", subject: updated });
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}

// DELETE /api/study/subjects/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.subject.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    await prisma.subject.delete({
      where: { id },
    });

    return NextResponse.json({ status: "ok", message: "Subject deleted" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}
