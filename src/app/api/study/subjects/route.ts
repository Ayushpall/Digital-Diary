import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/study/subjects - List tenant's study subjects
export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;

    const subjects = await prisma.subject.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            tasks: true,
            sessions: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      status: "ok",
      subjects: subjects.map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.icon || "📚",
        color: s.color || "#8E6945",
        description: s.description,
        totalTasks: s._count.tasks,
        completedTasks: s.tasks.filter((t) => t.status === "Completed").length,
        totalSessions: s._count.sessions,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching study subjects:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

// POST /api/study/subjects - Create a new subject
export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const body = await req.json();
    const { name, icon = "📚", color = "#8E6945", description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    // Check duplicate name
    const existing = await prisma.subject.findUnique({
      where: {
        userId_name: {
          userId,
          name: name.trim(),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Subject "${name.trim()}" already exists` },
        { status: 409 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        userId,
        name: name.trim(),
        icon: icon?.trim() || "📚",
        color: color?.trim() || "#8E6945",
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        subject: {
          id: subject.id,
          name: subject.name,
          icon: subject.icon,
          color: subject.color,
          description: subject.description,
          totalTasks: 0,
          completedTasks: 0,
          totalSessions: 0,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
