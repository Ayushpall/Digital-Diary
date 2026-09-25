import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/study/sessions - List tenant's study sessions
export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const completedParam = searchParams.get("completed");

    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        ...(subjectId ? { subjectId } : {}),
        ...(completedParam !== null ? { completed: completedParam === "true" } : {}),
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
      orderBy: [{ scheduledDate: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({
      status: "ok",
      sessions: sessions.map((s) => ({
        id: s.id,
        subjectId: s.subjectId,
        subject: s.subject,
        scheduledDate: s.scheduledDate,
        startTime: s.startTime,
        durationMinutes: s.durationMinutes,
        notes: s.notes,
        completed: s.completed,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return NextResponse.json({ error: "Failed to fetch study sessions" }, { status: 500 });
  }
}

// POST /api/study/sessions - Create a new study session
export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const body = await req.json();
    const {
      subjectId,
      scheduledDate,
      startTime = "19:00",
      durationMinutes = 60,
      notes,
      completed = false,
    } = body;

    if (!scheduledDate) {
      return NextResponse.json({ error: "Scheduled date is required" }, { status: 400 });
    }

    // Verify subject ownership if provided
    let verifiedSubjectId: string | null = null;
    if (subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: subjectId, userId },
      });
      if (subject) {
        verifiedSubjectId = subject.id;
      }
    }

    const session = await prisma.studySession.create({
      data: {
        userId,
        subjectId: verifiedSubjectId,
        scheduledDate: new Date(scheduledDate),
        startTime: startTime?.trim() || "19:00",
        durationMinutes:
          typeof durationMinutes === "number" && durationMinutes > 0 ? durationMinutes : 60,
        notes: notes?.trim() || null,
        completed: Boolean(completed),
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json({ status: "ok", session }, { status: 201 });
  } catch (error) {
    console.error("Error creating study session:", error);
    return NextResponse.json({ error: "Failed to create study session" }, { status: 500 });
  }
}
