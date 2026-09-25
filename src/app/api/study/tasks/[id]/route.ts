import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/study/tasks/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const task = await prisma.studyTask.findFirst({
      where: { id, userId: authUser.userId },
      include: {
        subject: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", task });
  } catch (error) {
    console.error("Error fetching study task:", error);
    return NextResponse.json({ error: "Failed to fetch study task" }, { status: 500 });
  }
}

// PATCH /api/study/tasks/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { userId } = authUser;

    const existing = await prisma.studyTask.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, subjectId, type, dueDate, priority, status, estimatedMinutes } =
      body;

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

    let completedAtUpdate = undefined;
    if (status !== undefined) {
      if (status === "Completed") {
        completedAtUpdate = existing.completedAt || new Date();
      } else {
        completedAtUpdate = null;
      }
    }

    const updated = await prisma.studyTask.update({
      where: { id },
      data: {
        ...(title && typeof title === "string" ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(verifiedSubjectId !== undefined ? { subjectId: verifiedSubjectId } : {}),
        ...(type !== undefined ? { type: type?.trim() || "Assignment" } : {}),
        ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
        ...(priority && ["Low", "Medium", "High"].includes(priority) ? { priority } : {}),
        ...(status && ["Not Started", "In Progress", "Completed"].includes(status)
          ? { status, completedAt: completedAtUpdate }
          : {}),
        ...(typeof estimatedMinutes === "number" && estimatedMinutes > 0
          ? { estimatedMinutes }
          : {}),
      },
      include: {
        subject: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    return NextResponse.json({ status: "ok", task: updated });
  } catch (error) {
    console.error("Error updating study task:", error);
    return NextResponse.json({ error: "Failed to update study task" }, { status: 500 });
  }
}

// DELETE /api/study/tasks/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.studyTask.findFirst({
      where: { id, userId: authUser.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.studyTask.delete({
      where: { id },
    });

    return NextResponse.json({ status: "ok", message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting study task:", error);
    return NextResponse.json({ error: "Failed to delete study task" }, { status: 500 });
  }
}
