import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/study/sessions/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const session = await prisma.studySession.findFirst({
      where: { id, userId: authUser.userId },
      include: {
        subject: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", session });
  } catch (error) {
    console.error("Error fetching study session:", error);
    return NextResponse.json({ error: "Failed to fetch study session" }, { status: 500 });
  }
}

// PATCH /api/study/sessions/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { userId } = authUser;

    const existing = await prisma.studySession.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await req.json();
    const { subjectId, scheduledDate, startTime, durationMinutes, notes, completed } = body;

    let verifiedSubjectId: string | null | undefined = undefined;
    if (subjectId !== undefined) {
      if (subjectId === null || subjectId === "") {
        verifiedSubjectId = null;
      } else {
        const subject = await prisma.subject.findFirst({
          where: { id: subjectId, userId },
        });
        if (subject) {
          verifiedSubjectId = subject.id;
        }
      }
    }

    const updated = await prisma.studySession.update({
      where: { id },
      data: {
        ...(verifiedSubjectId !== undefined ? { subjectId: verifiedSubjectId } : {}),
        ...(scheduledDate ? { scheduledDate: new Date(scheduledDate) } : {}),
        ...(startTime !== undefined ? { startTime: startTime?.trim() || "19:00" } : {}),
        ...(typeof durationMinutes === "number" && durationMinutes > 0 ? { durationMinutes } : {}),
        ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
        ...(typeof completed === "boolean" ? { completed } : {}),
      },
      include: {
        subject: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    return NextResponse.json({ status: "ok", session: updated });
  } catch (error) {
    console.error("Error updating study session:", error);
    return NextResponse.json({ error: "Failed to update study session" }, { status: 500 });
  }
}

// DELETE /api/study/sessions/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.studySession.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await prisma.studySession.delete({
      where: { id },
    });

    return NextResponse.json({ status: "ok", message: "Session deleted" });
  } catch (error) {
    console.error("Error deleting study session:", error);
    return NextResponse.json({ error: "Failed to delete study session" }, { status: 500 });
  }
}
