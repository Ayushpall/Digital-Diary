import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/study/tasks - List tenant's study tasks and compute study analytics
export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");

    const tasks = await prisma.studyTask.findMany({
      where: {
        userId,
        ...(subjectId ? { subjectId } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(priority ? { priority } : {}),
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
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });

    // Also get study sessions to compute complete study analytics
    const sessions = await prisma.studySession.findMany({
      where: { userId },
      select: { durationMinutes: true, completed: true, scheduledDate: true },
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysLater = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter((t) => t.status === "Completed").length;
    const tasksDue = totalTasks - tasksCompleted;
    const overdueTasks = tasks.filter(
      (t) => t.status !== "Completed" && new Date(t.dueDate) < todayStart
    ).length;
    const upcomingDeadlines = tasks.filter((t) => {
      const d = new Date(t.dueDate);
      return t.status !== "Completed" && d >= todayStart && d <= sevenDaysLater;
    }).length;

    // Study Time calculations
    const taskMinutes = tasks
      .filter((t) => t.status === "Completed")
      .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

    const sessionMinutes = sessions
      .filter((s) => s.completed)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    const totalCompletedMinutes = taskMinutes + sessionMinutes;
    const studyHours = Math.floor(totalCompletedMinutes / 60);
    const remainingMinutes = totalCompletedMinutes % 60;
    const formattedStudyTime =
      studyHours > 0 ? `${studyHours}h ${remainingMinutes}m` : `${remainingMinutes}m`;

    const completionPercentage =
      totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

    // Tasks by subject breakdown
    const subjectBreakdown: Record<string, { total: number; completed: number; color: string }> = {};
    tasks.forEach((t) => {
      const subjName = t.subject?.name || "General";
      const subjColor = t.subject?.color || "#8E6945";
      if (!subjectBreakdown[subjName]) {
        subjectBreakdown[subjName] = { total: 0, completed: 0, color: subjColor };
      }
      subjectBreakdown[subjName].total += 1;
      if (t.status === "Completed") {
        subjectBreakdown[subjName].completed += 1;
      }
    });

    return NextResponse.json({
      status: "ok",
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        type: t.type,
        dueDate: t.dueDate,
        priority: t.priority,
        status: t.status,
        estimatedMinutes: t.estimatedMinutes || 30,
        completedAt: t.completedAt,
        subjectId: t.subjectId,
        subject: t.subject,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      stats: {
        totalTasks,
        tasksDue,
        tasksCompleted,
        overdueTasks,
        upcomingDeadlines,
        totalStudyMinutes: totalCompletedMinutes,
        studyHours,
        studyTimeFormatted: formattedStudyTime,
        completionPercentage,
        subjectBreakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching study tasks:", error);
    return NextResponse.json({ error: "Failed to fetch study tasks" }, { status: 500 });
  }
}

// POST /api/study/tasks - Create a new study task / assignment
export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = authUser;
    const body = await req.json();
    const {
      title,
      description,
      subjectId,
      type = "Assignment",
      dueDate,
      priority = "Medium",
      status = "Not Started",
      estimatedMinutes = 30,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    if (!dueDate) {
      return NextResponse.json({ error: "Due date is required" }, { status: 400 });
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

    const isCompleted = status === "Completed";

    const task = await prisma.studyTask.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        subjectId: verifiedSubjectId,
        type: type?.trim() || "Assignment",
        dueDate: new Date(dueDate),
        priority: ["Low", "Medium", "High"].includes(priority) ? priority : "Medium",
        status: ["Not Started", "In Progress", "Completed"].includes(status)
          ? status
          : "Not Started",
        estimatedMinutes: typeof estimatedMinutes === "number" && estimatedMinutes > 0 ? estimatedMinutes : 30,
        completedAt: isCompleted ? new Date() : null,
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

    return NextResponse.json({ status: "ok", task }, { status: 201 });
  } catch (error) {
    console.error("Error creating study task:", error);
    return NextResponse.json({ error: "Failed to create study task" }, { status: 500 });
  }
}
