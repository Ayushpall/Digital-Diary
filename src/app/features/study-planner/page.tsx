"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Plus,
  GraduationCap,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Filter,
  Check,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Flag,
  CalendarDays,
  PieChart,
  X,
  Tag,
} from "lucide-react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { toDateKey } from "@/lib/habit-streaks";

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string | null;
  totalTasks: number;
  completedTasks: number;
  totalSessions: number;
}

interface StudyTask {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | string;
  status: "Not Started" | "In Progress" | "Completed" | string;
  estimatedMinutes: number;
  completedAt?: string | null;
  subjectId?: string | null;
  subject?: { id: string; name: string; icon: string; color: string } | null;
  createdAt: string;
}

interface StudySession {
  id: string;
  subjectId?: string | null;
  subject?: { id: string; name: string; icon: string; color: string } | null;
  scheduledDate: string;
  startTime?: string | null;
  durationMinutes: number;
  notes?: string | null;
  completed: boolean;
  createdAt: string;
}

interface StudyStats {
  totalTasks: number;
  tasksDue: number;
  tasksCompleted: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  totalStudyMinutes: number;
  studyHours: number;
  studyTimeFormatted: string;
  completionPercentage: number;
  subjectBreakdown: Record<string, { total: number; completed: number; color: string }>;
}

const TASK_TYPES = [
  "Assignment",
  "Exam",
  "Quiz",
  "Project",
  "Revision",
  "Reading",
  "Study Session",
  "Other",
];

const STARTER_SUBJECTS = [
  { name: "Data Structures", icon: "🌳", color: "#3B5998" },
  { name: "Operating Systems", icon: "⚙️", color: "#54805E" },
  { name: "DBMS", icon: "🗄️", color: "#A85D36" },
  { name: "Machine Learning", icon: "🤖", color: "#6A4C93" },
  { name: "Software Engineering", icon: "📐", color: "#8E6945" },
];

export default function StudyPlannerPage() {
  const { isSignedIn, isLoaded } = useAuth();

  const [activeTab, setActiveTab] = useState<"tasks" | "calendar" | "sessions" | "subjects">("tasks");
  const [taskFilterTab, setTaskFilterTab] = useState<"all" | "today" | "upcoming" | "overdue" | "completed">("all");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<StudyStats>({
    totalTasks: 0,
    tasksDue: 0,
    tasksCompleted: 0,
    overdueTasks: 0,
    upcomingDeadlines: 0,
    totalStudyMinutes: 0,
    studyHours: 0,
    studyTimeFormatted: "0m",
    completionPercentage: 0,
    subjectBreakdown: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);

  // Form states - Task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubjectId, setTaskSubjectId] = useState("");
  const [taskType, setTaskType] = useState("Assignment");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(toDateKey(new Date()));
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("Not Started");
  const [taskEstMinutes, setTaskEstMinutes] = useState(60);
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);

  // Form states - Session
  const [sessionSubjectId, setSessionSubjectId] = useState("");
  const [sessionDate, setSessionDate] = useState(toDateKey(new Date()));
  const [sessionStartTime, setSessionStartTime] = useState("19:00");
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionFormError, setSessionFormError] = useState<string | null>(null);
  const [isSavingSession, setIsSavingSession] = useState(false);

  // Form states - Subject
  const [subjectName, setSubjectName] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("📚");
  const [subjectColor, setSubjectColor] = useState("#8E6945");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [subjectFormError, setSubjectFormError] = useState<string | null>(null);
  const [isSavingSubject, setIsSavingSubject] = useState(false);

  // Calendar View Month state
  const [calendarDate, setCalendarDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      const [subjectsRes, tasksRes, sessionsRes] = await Promise.all([
        fetch("/api/study/subjects"),
        fetch("/api/study/tasks"),
        fetch("/api/study/sessions"),
      ]);

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data.subjects || []);
      }
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data.sessions || []);
      }
    } catch (err: any) {
      console.error("Study Planner fetch error:", err);
      setError(err.message || "Failed to load study data");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded, fetchData]);

  // Open Task Modal for Create / Edit
  const openTaskModal = (taskToEdit?: StudyTask) => {
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setTaskTitle(taskToEdit.title);
      setTaskSubjectId(taskToEdit.subjectId || "");
      setTaskType(taskToEdit.type || "Assignment");
      setTaskDescription(taskToEdit.description || "");
      setTaskDueDate(toDateKey(new Date(taskToEdit.dueDate)));
      setTaskPriority(taskToEdit.priority || "Medium");
      setTaskStatus(taskToEdit.status || "Not Started");
      setTaskEstMinutes(taskToEdit.estimatedMinutes || 60);
    } else {
      setEditingTask(null);
      setTaskTitle("");
      setTaskSubjectId(subjects.length > 0 ? subjects[0].id : "");
      setTaskType("Assignment");
      setTaskDescription("");
      setTaskDueDate(toDateKey(new Date()));
      setTaskPriority("Medium");
      setTaskStatus("Not Started");
      setTaskEstMinutes(60);
    }
    setTaskFormError(null);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setTaskFormError("Task title is required");
      return;
    }
    if (!taskDueDate) {
      setTaskFormError("Due date is required");
      return;
    }

    setIsSavingTask(true);
    setTaskFormError(null);

    const payload = {
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      subjectId: taskSubjectId || undefined,
      type: taskType,
      dueDate: new Date(taskDueDate).toISOString(),
      priority: taskPriority,
      status: taskStatus,
      estimatedMinutes: Number(taskEstMinutes) || 30,
    };

    try {
      const url = editingTask ? `/api/study/tasks/${editingTask.id}` : "/api/study/tasks";
      const method = editingTask ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to save task" }));
        throw new Error(data.error || "Failed to save task");
      }

      setTaskModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setTaskFormError(err.message || "Failed to save task");
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleToggleTaskStatus = async (task: StudyTask) => {
    const nextStatus = task.status === "Completed" ? "In Progress" : "Completed";
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    try {
      const res = await fetch(`/api/study/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchData();
    } catch (err) {
      console.error("Toggle task error:", err);
      await fetchData();
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/study/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingTaskId(null);
        await fetchData();
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate) {
      setSessionFormError("Date is required");
      return;
    }

    setIsSavingSession(true);
    setSessionFormError(null);

    try {
      const res = await fetch("/api/study/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: sessionSubjectId || undefined,
          scheduledDate: new Date(sessionDate).toISOString(),
          startTime: sessionStartTime || "19:00",
          durationMinutes: Number(sessionDuration) || 60,
          notes: sessionNotes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to schedule session" }));
        throw new Error(data.error || "Failed to schedule session");
      }

      setSessionModalOpen(false);
      setSessionNotes("");
      await fetchData();
    } catch (err: any) {
      setSessionFormError(err.message || "Failed to schedule session");
    } finally {
      setIsSavingSession(false);
    }
  };

  const handleToggleSessionComplete = async (session: StudySession) => {
    try {
      const res = await fetch(`/api/study/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !session.completed }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Toggle session complete error:", err);
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setSubjectFormError("Subject name is required");
      return;
    }

    setIsSavingSubject(true);
    setSubjectFormError(null);

    try {
      const res = await fetch("/api/study/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subjectName.trim(),
          icon: subjectIcon.trim() || "📚",
          color: subjectColor || "#8E6945",
          description: subjectDescription.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to create subject" }));
        throw new Error(data.error || "Failed to create subject");
      }

      setSubjectModalOpen(false);
      setSubjectName("");
      setSubjectDescription("");
      await fetchData();
    } catch (err: any) {
      setSubjectFormError(err.message || "Failed to create subject");
    } finally {
      setIsSavingSubject(false);
    }
  };

  const handleAddStarterSubject = async (tpl: (typeof STARTER_SUBJECTS)[0]) => {
    try {
      const res = await fetch("/api/study/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tpl),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Add starter subject error:", err);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const res = await fetch(`/api/study/subjects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingSubjectId(null);
        await fetchData();
      }
    } catch (err) {
      console.error("Delete subject error:", err);
    }
  };

  // Calendar dates calculation
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0 is Sunday
  const calDays = Array.from({ length: daysInCalMonth }, (_, i) => i + 1);

  const prevMonthDaysCount = new Date(calYear, calMonth, 0).getDate();
  const leadingBlanks = Array.from({ length: firstDayOfWeek }, (_, i) => prevMonthDaysCount - firstDayOfWeek + i + 1);

  const todayKey = toDateKey(new Date());

  // Filter tasks based on taskFilterTab
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const sevenDays = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  const filteredTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    if (taskFilterTab === "completed") return t.status === "Completed";
    if (taskFilterTab === "today") {
      return t.status !== "Completed" && dueDate >= startOfToday && dueDate <= endOfToday;
    }
    if (taskFilterTab === "upcoming") {
      return t.status !== "Completed" && dueDate > endOfToday;
    }
    if (taskFilterTab === "overdue") {
      return t.status !== "Completed" && dueDate < startOfToday;
    }
    return true; // "all"
  });

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE] border-b border-[#DECDB8] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#3D2C1F] border border-[#D8C7B0] text-xs font-serif transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B89360]" />
            <span>Features</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#DECDB8]">
            <div className="w-7 h-7 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B]">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif text-base text-[#281B13] font-normal leading-tight block">
                Study Planner
              </span>
              <span className="text-[10px] text-[#8C7A6B] font-mono leading-tight block uppercase tracking-wider">
                Academic Knowledge Hub
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => {
              setSessionSubjectId(subjects.length > 0 ? subjects[0].id : "");
              setSessionModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE5D5] hover:bg-[#E2D5BF] text-[#422F22] border border-[#DAC9B1] text-xs font-serif transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-[#B89360]" />
            <span className="hidden sm:inline">+ Study Session</span>
            <span className="sm:hidden">+ Session</span>
          </button>

          <button
            onClick={() => openTaskModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#E5C78B]" />
            <span>+ Add Task</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-8 py-6 sm:py-10 pb-24 md:pb-12">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#261A13] font-normal mb-1.5">
              Study Planner
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#7C6A5A]">
              &ldquo;Plan today. Learn consistently.&rdquo;
            </p>
          </div>

          {/* View Mode Navigation Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-[#EAE0CF]/70 border border-[#D8C7B0] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1.5 ${
                activeTab === "tasks"
                  ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-medium"
                  : "text-[#5C4B3D] hover:text-[#2A1D15]"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tasks & Deadlines</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1.5 ${
                activeTab === "calendar"
                  ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-medium"
                  : "text-[#5C4B3D] hover:text-[#2A1D15]"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Study Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1.5 ${
                activeTab === "sessions"
                  ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-medium"
                  : "text-[#5C4B3D] hover:text-[#2A1D15]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sessions</span>
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1.5 ${
                activeTab === "subjects"
                  ? "bg-[#38261A] text-[#FAF5ED] shadow-xs font-medium"
                  : "text-[#5C4B3D] hover:text-[#2A1D15]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Subjects ({subjects.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
          {/* Card 1: Tasks Due */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Tasks Due</span>
              <Flag className="w-4 h-4 text-[#B89360]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-[#241912]">{stats.tasksDue}</span>
                <span className="text-xs font-serif italic text-[#7C6A5A]">remaining</span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">
                {stats.overdueTasks > 0 ? (
                  <span className="text-[#A84A3B] font-medium">{stats.overdueTasks} overdue</span>
                ) : (
                  "All current on schedule"
                )}
              </p>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-[#4A7352]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-[#241912]">{stats.tasksCompleted}</span>
                <span className="text-xs font-serif italic text-[#4A7352]">
                  ({stats.completionPercentage}%)
                </span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">
                of {stats.totalTasks} total planned tasks
              </p>
            </div>
          </div>

          {/* Card 3: Study Time */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Study Time</span>
              <Clock className="w-4 h-4 text-[#3B5B84]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-[#241912]">
                  {stats.studyTimeFormatted}
                </span>
                <span className="text-xs font-serif italic text-[#7C6A5A]">logged</span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">
                Completed focus time
              </p>
            </div>
          </div>

          {/* Card 4: Upcoming Deadlines */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8A7969] mb-2">
              <span>Upcoming Deadlines</span>
              <CalendarIcon className="w-4 h-4 text-[#C7603B]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl text-[#241912]">{stats.upcomingDeadlines}</span>
                <span className="text-xs font-serif italic text-[#7C6A5A]">next 7 days</span>
              </div>
              <p className="text-[11px] text-[#7C6A5A] font-light mt-1">
                Assignments & revisions
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            TAB 1: TASKS & DEADLINES LIST
           ======================================================== */}
        {activeTab === "tasks" && (
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7">
            {/* Filter Tabs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E8DEC9]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setTaskFilterTab("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors ${
                    taskFilterTab === "all"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium"
                      : "text-[#6C594A] hover:bg-[#EFE5D5]"
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setTaskFilterTab("today")}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors ${
                    taskFilterTab === "today"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium"
                      : "text-[#6C594A] hover:bg-[#EFE5D5]"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTaskFilterTab("upcoming")}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors ${
                    taskFilterTab === "upcoming"
                      ? "bg-[#38261A] text-[#FAF5ED] font-medium"
                      : "text-[#6C594A] hover:bg-[#EFE5D5]"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setTaskFilterTab("overdue")}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors ${
                    taskFilterTab === "overdue"
                      ? "bg-[#A84A3B] text-white font-medium"
                      : "text-[#A84A3B] hover:bg-[#F7EBE8]"
                  }`}
                >
                  Overdue ({stats.overdueTasks})
                </button>
                <button
                  onClick={() => setTaskFilterTab("completed")}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors ${
                    taskFilterTab === "completed"
                      ? "bg-[#4A7352] text-white font-medium"
                      : "text-[#4A7352] hover:bg-[#EDF5EF]"
                  }`}
                >
                  Completed ({stats.tasksCompleted})
                </button>
              </div>

              <button
                onClick={() => openTaskModal()}
                className="text-xs font-serif text-[#B89360] hover:text-[#38261A] flex items-center gap-1 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Task</span>
              </button>
            </div>

            {/* Task List or Empty State */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EFE6D6] text-[#8C7A6B] flex items-center justify-center mx-auto mb-3 border border-[#DACBB6]">
                  <GraduationCap className="w-7 h-7 text-[#B89360]" />
                </div>
                <h3 className="font-serif text-lg text-[#281B13] font-medium mb-1">
                  {taskFilterTab === "all" ? "No study tasks yet" : `No ${taskFilterTab} tasks`}
                </h3>
                <p className="text-xs text-[#7A695B] font-light max-w-sm mx-auto mb-5 leading-relaxed">
                  Enter an assignment or revision goal once, and it synchronizes into your study calendar and summaries automatically.
                </p>
                <button
                  onClick={() => openTaskModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E5C78B]" />
                  <span>+ Create New Task</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === "Completed";
                  const dueDateObj = new Date(task.dueDate);
                  const isOverdue = !isCompleted && dueDateObj < startOfToday;
                  const formattedDue = dueDateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCompleted
                          ? "bg-[#F3EFE6] border-[#D8C7B0] opacity-85"
                          : isOverdue
                          ? "bg-[#FCF6F5] border-[#ECCDC6]"
                          : "bg-[#FAF5ED] border-[#DECDB8] hover:border-[#B89360]"
                      }`}
                    >
                      {/* Left: Checkmark + Task Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleTaskStatus(task)}
                          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                            isCompleted
                              ? "bg-[#4A7352] text-white"
                              : "border-2 border-[#CBB8A2] hover:border-[#8E6945] text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4
                              className={`font-serif text-sm font-medium ${
                                isCompleted
                                  ? "line-through text-[#6C594A]"
                                  : "text-[#241912]"
                              }`}
                            >
                              {task.title}
                            </h4>

                            {/* Subject Pill */}
                            {task.subject && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md text-white font-medium shadow-2xs"
                                style={{ backgroundColor: task.subject.color || "#8E6945" }}
                              >
                                <span>{task.subject.icon}</span>
                                <span>{task.subject.name}</span>
                              </span>
                            )}

                            {/* Type Pill */}
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7969] px-2 py-0.5 rounded bg-[#EFE6D6]">
                              {task.type}
                            </span>

                            {/* Priority Badge */}
                            {task.priority === "High" && (
                              <span className="text-[10px] font-mono text-[#A84A3B] bg-[#F7EBE8] px-2 py-0.5 rounded border border-[#ECCDC6]">
                                High Priority
                              </span>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-xs text-[#7A695B] font-light leading-relaxed mb-1">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-[#8C7A6B] font-serif">
                            <span className={isOverdue ? "text-[#A84A3B] font-medium" : ""}>
                              Due: {formattedDue}
                            </span>
                            <span>•</span>
                            <span>Est: {task.estimatedMinutes} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          onClick={() => openTaskModal(task)}
                          className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#38261A] hover:bg-[#EFE6D6] transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-[#9B897A] hover:text-[#A84A3B] hover:bg-[#EFE6D6] transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: SMART STUDY CALENDAR (TASK 6)
           ======================================================== */}
        {activeTab === "calendar" && (
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7">
            {/* Calendar Month Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E8DEC9]">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-[#B89360]" />
                <div>
                  <h2 className="font-serif text-xl text-[#241912] font-medium">Smart Study Calendar</h2>
                  <p className="text-xs text-[#7A695B] font-light">
                    Assignments, exams & sessions automatically mapped to dates
                  </p>
                </div>
              </div>

              {/* Month Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                  className="p-1.5 rounded-lg border border-[#DDD0BC] bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#5C4B3D] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-serif text-sm text-[#281B13] font-medium min-w-[130px] text-center">
                  {calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button
                  onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                  className="p-1.5 rounded-lg border border-[#DDD0BC] bg-[#FAF5ED] hover:bg-[#EFE5D5] text-[#5C4B3D] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="px-2.5 py-1 rounded-lg text-xs font-serif bg-[#38261A] text-[#FAF5ED] hover:bg-[#483324] transition-colors"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-[#DECDB8] rounded-xl overflow-hidden bg-[#FAF5ED]">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 border-b border-[#DECDB8] bg-[#F5EDE1] text-center text-xs font-mono text-[#7A695B] py-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 divide-x divide-y divide-[#DECDB8]">
                {/* Leading blanks from previous month */}
                {leadingBlanks.map((blankDay, idx) => (
                  <div key={`blank-${idx}`} className="min-h-[90px] sm:min-h-[110px] p-1.5 bg-[#F7F2EA]/40 text-[#B8A796] text-xs font-mono">
                    <span className="opacity-40">{blankDay}</span>
                  </div>
                ))}

                {/* Actual Month Days */}
                {calDays.map((dayNum) => {
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const isToday = dateStr === todayKey;

                  // Tasks due on this date
                  const dayTasks = tasks.filter((t) => toDateKey(new Date(t.dueDate)) === dateStr);
                  // Sessions scheduled on this date
                  const daySessions = sessions.filter(
                    (s) => toDateKey(new Date(s.scheduledDate)) === dateStr
                  );

                  return (
                    <div
                      key={dayNum}
                      className={`min-h-[90px] sm:min-h-[110px] p-1.5 transition-colors flex flex-col justify-between ${
                        isToday ? "bg-[#FFFDF9] ring-1 ring-inset ring-[#B89360]" : "hover:bg-[#FAF6EE]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full ${
                            isToday ? "bg-[#38261A] text-[#FAF5ED] font-bold" : "text-[#5C4B3D]"
                          }`}
                        >
                          {dayNum}
                        </span>
                        {(dayTasks.length > 0 || daySessions.length > 0) && (
                          <span className="text-[10px] font-mono text-[#8C7A6B]">
                            {dayTasks.length + daySessions.length}
                          </span>
                        )}
                      </div>

                      {/* Events listed in this cell */}
                      <div className="space-y-1 mt-1 overflow-y-auto max-h-[70px]">
                        {dayTasks.map((t) => {
                          const isDone = t.status === "Completed";
                          const isExam = t.type === "Exam";
                          return (
                            <div
                              key={t.id}
                              onClick={() => openTaskModal(t)}
                              title={`${t.title} (${t.type}) - Click to view/edit`}
                              className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer truncate transition-all ${
                                isDone
                                  ? "bg-[#EAE0CF] text-[#6C594A] line-through"
                                  : isExam
                                  ? "bg-[#F7EBE8] text-[#9E392B] font-medium border border-[#ECCDC6]"
                                  : "bg-[#EFE5D5] text-[#3D2C1F] hover:bg-[#E5D7BF] border border-[#DDD0BC]"
                              }`}
                            >
                              • {t.title}
                            </div>
                          );
                        })}

                        {daySessions.map((s) => (
                          <div
                            key={s.id}
                            title={`Study Session: ${s.durationMinutes}m ${s.notes || ""}`}
                            className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                              s.completed
                                ? "bg-[#EDF5EF] text-[#3E6145] line-through"
                                : "bg-[#EDF5EF] text-[#2C5233] border border-[#CDE3D2]"
                            }`}
                          >
                            ⏱ {s.subject?.name || "Session"} ({s.durationMinutes}m)
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: STUDY SESSIONS (TASK 7)
           ======================================================== */}
        {activeTab === "sessions" && (
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8DEC9]">
              <div>
                <h2 className="font-serif text-xl text-[#241912] font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#B89360]" />
                  <span>Scheduled Study Sessions</span>
                </h2>
                <p className="text-xs text-[#7A695B] font-light mt-0.5">
                  Plan dedicated blocks of focused learning
                </p>
              </div>

              <button
                onClick={() => {
                  setSessionSubjectId(subjects.length > 0 ? subjects[0].id : "");
                  setSessionModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#E5C78B]" />
                <span>Schedule Session</span>
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EFE6D6] text-[#8C7A6B] flex items-center justify-center mx-auto mb-3 border border-[#DACBB6]">
                  <Clock className="w-7 h-7 text-[#B89360]" />
                </div>
                <h3 className="font-serif text-lg text-[#281B13] font-medium mb-1">
                  No study sessions scheduled
                </h3>
                <p className="text-xs text-[#7A695B] font-light max-w-sm mx-auto mb-5">
                  Block out specific study times for your subjects and track actual completed hours.
                </p>
                <button
                  onClick={() => setSessionModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#342419] text-[#FAF5ED] text-xs font-serif shadow-xs"
                >
                  + Schedule Your First Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((sess) => {
                  const dObj = new Date(sess.scheduledDate);
                  const dateStr = dObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={sess.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        sess.completed
                          ? "bg-[#F3EFE6] border-[#D8C7B0] opacity-85"
                          : "bg-[#FAF5ED] border-[#DECDB8] hover:border-[#B89360]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-md text-white font-medium"
                            style={{ backgroundColor: sess.subject?.color || "#8E6945" }}
                          >
                            <span>{sess.subject?.icon || "📚"}</span>
                            <span>{sess.subject?.name || "General"}</span>
                          </span>

                          <span className="text-xs font-serif italic text-[#7C6A5A]">
                            {sess.durationMinutes} minutes
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="font-serif text-base text-[#241912]">
                            {dateStr} at {sess.startTime || "19:00"}
                          </h4>
                        </div>

                        {sess.notes && (
                          <p className="text-xs text-[#6C594A] font-light leading-relaxed mb-3">
                            Goal: {sess.notes}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E8DEC9] flex items-center justify-between">
                        <button
                          onClick={() => handleToggleSessionComplete(sess)}
                          className={`text-xs font-serif flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                            sess.completed
                              ? "bg-[#EDF5EF] text-[#3E6145] font-medium"
                              : "bg-[#FAF5ED] border border-[#DDD0BC] text-[#5C4B3D] hover:bg-[#EFE5D5]"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{sess.completed ? "Completed" : "Mark Complete"}</span>
                        </button>

                        <button
                          onClick={async () => {
                            await fetch(`/api/study/sessions/${sess.id}`, { method: "DELETE" });
                            await fetchData();
                          }}
                          className="p-1 rounded-lg text-[#9B897A] hover:text-[#A84A3B] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: SUBJECTS & ANALYTICS (TASK 5 & 8)
           ======================================================== */}
        {activeTab === "subjects" && (
          <div className="space-y-8">
            {/* Subjects List */}
            <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E8DEC9]">
                <div>
                  <h2 className="font-serif text-xl text-[#241912] font-medium">Your Study Subjects</h2>
                  <p className="text-xs text-[#7A695B] font-light">Custom disciplines created by you</p>
                </div>

                <button
                  onClick={() => setSubjectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E5C78B]" />
                  <span>+ Add Subject</span>
                </button>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-[#7A695B] font-light max-w-sm mx-auto mb-4">
                    Create custom subjects to organize your assignments, exams, and study sessions.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                    {STARTER_SUBJECTS.map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => handleAddStarterSubject(tpl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5EDE1] hover:bg-[#ECE0D0] text-[#422F22] text-xs font-serif border border-[#D8C7B0] transition-colors"
                      >
                        <span>{tpl.icon}</span>
                        <span>{tpl.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-xl bg-[#FAF5ED] border border-[#DECDB8] shadow-2xs flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white shadow-2xs"
                            style={{ backgroundColor: sub.color || "#8E6945" }}
                          >
                            {sub.icon || "📚"}
                          </span>
                          <button
                            onClick={() => handleDeleteSubject(sub.id)}
                            className="p-1 rounded-lg text-[#B5A495] hover:text-[#A84A3B] transition-colors"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-serif text-lg text-[#241912] font-medium mb-1">
                          {sub.name}
                        </h4>
                        {sub.description && (
                          <p className="text-xs text-[#7A695B] font-light leading-relaxed mb-3">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E8DEC9] flex items-center justify-between text-xs font-serif text-[#7C6A5A]">
                        <span>{sub.totalTasks} tasks ({sub.completedTasks} done)</span>
                        <span>{sub.totalSessions} sessions</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subject Analytics Breakdown (TASK 8) */}
            <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xs p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8DEC9]">
                <PieChart className="w-4 h-4 text-[#B89360]" />
                <h3 className="font-serif text-lg text-[#241912] font-medium">Workload Distribution by Subject</h3>
              </div>

              {Object.keys(stats.subjectBreakdown).length === 0 ? (
                <p className="text-xs text-[#8C7A6B] font-serif italic py-4 text-center">
                  Add tasks linked to subjects to see distribution breakdown.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.subjectBreakdown).map(([name, data]) => {
                    const percent =
                      stats.totalTasks > 0 ? Math.round((data.total / stats.totalTasks) * 100) : 0;
                    return (
                      <div key={name}>
                        <div className="flex items-center justify-between text-xs font-serif mb-1">
                          <span className="font-medium text-[#261A13]">{name}</span>
                          <span className="text-[#7C6A5A]">
                            {data.completed}/{data.total} tasks completed ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#EAE0CF] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: data.color || "#8E6945",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CREATE / EDIT TASK MODAL */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9] mb-5">
              <h3 className="font-serif text-lg text-[#261A13] font-medium">
                {editingTask ? "Edit Study Task" : "Add New Task / Assignment"}
              </h3>
              <button
                onClick={() => setTaskModalOpen(false)}
                className="p-1 rounded-lg text-[#7C6A5A] hover:bg-[#EFE6D6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {taskFormError && (
              <div className="p-3 mb-4 rounded-xl bg-[#F7EBE8] text-[#8C3426] text-xs font-serif border border-[#ECCDC6] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{taskFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complete DSA Assignment 3"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] placeholder-[#A49383] text-sm focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Subject
                  </label>
                  <select
                    value={taskSubjectId}
                    onChange={(e) => setTaskSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  >
                    <option value="">No specific subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.icon} {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  >
                    {TASK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Est. Study Minutes
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={taskEstMinutes}
                    onChange={(e) => setTaskEstMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional instructions, assignment rubric, or reading chapter..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] placeholder-[#A49383] text-xs focus:outline-none focus:ring-1 focus:ring-[#8E6945] font-serif"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8DEC9]">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD0BC] bg-[#FAF5ED] text-[#5C4B3D] text-xs font-serif hover:bg-[#EFE5D5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTask}
                  className="px-5 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif font-medium shadow-xs disabled:opacity-50"
                >
                  {isSavingTask ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE STUDY SESSION MODAL */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9] mb-5">
              <h3 className="font-serif text-lg text-[#261A13] font-medium">
                Schedule Study Session
              </h3>
              <button
                onClick={() => setSessionModalOpen(false)}
                className="p-1 rounded-lg text-[#7C6A5A] hover:bg-[#EFE6D6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sessionFormError && (
              <div className="p-3 mb-4 rounded-xl bg-[#F7EBE8] text-[#8C3426] text-xs font-serif border border-[#ECCDC6] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{sessionFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Subject
                </label>
                <select
                  value={sessionSubjectId}
                  onChange={(e) => setSessionSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs font-serif"
                >
                  <option value="">General Study</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Goal / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Revise Process Scheduling algorithms"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs font-serif"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8DEC9]">
                <button
                  type="button"
                  onClick={() => setSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD0BC] bg-[#FAF5ED] text-[#5C4B3D] text-xs font-serif"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSession}
                  className="px-5 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif font-medium shadow-xs disabled:opacity-50"
                >
                  {isSavingSession ? "Scheduling..." : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SUBJECT MODAL */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#DECDB8] shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9] mb-5">
              <h3 className="font-serif text-lg text-[#261A13] font-medium">Add New Subject</h3>
              <button
                onClick={() => setSubjectModalOpen(false)}
                className="p-1 rounded-lg text-[#7C6A5A] hover:bg-[#EFE6D6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subjectFormError && (
              <div className="p-3 mb-4 rounded-xl bg-[#F7EBE8] text-[#8C3426] text-xs font-serif border border-[#ECCDC6] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{subjectFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Subject Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-sm font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Emoji / Icon
                  </label>
                  <input
                    type="text"
                    value={subjectIcon}
                    onChange={(e) => setSubjectIcon(e.target.value)}
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-center text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                    Theme Color
                  </label>
                  <input
                    type="color"
                    value={subjectColor}
                    onChange={(e) => setSubjectColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#422F22] mb-1.5">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms, complexity, trees, graphs"
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5ED] border border-[#D8C7B0] text-[#291D15] text-xs font-serif"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8DEC9]">
                <button
                  type="button"
                  onClick={() => setSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD0BC] bg-[#FAF5ED] text-[#5C4B3D] text-xs font-serif"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSubject}
                  className="px-5 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-serif font-medium shadow-xs disabled:opacity-50"
                >
                  {isSavingSubject ? "Creating..." : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
