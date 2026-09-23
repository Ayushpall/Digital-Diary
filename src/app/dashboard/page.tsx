"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DiaryGrid } from "@/components/dashboard/DiaryGrid";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { DiaryStats } from "@/components/dashboard/DiaryStats";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useDiaryData, notifyDiaryDataChanged } from "@/lib/use-diary-data";
import { COVER_THEMES, getCoverTheme } from "@/lib/cover-themes";
import { DiaryCoverStyle } from "@/types/dashboard";
import {
  Sparkles,
  X,
  BookOpen,
  PenTool,
  Check,
  Trash2,
  Palette,
  Feather,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Smile,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const {
    diaries,
    recentEntries,
    stats,
    refresh,
    createDiary,
    deleteDiary,
    deleteEntry,
    updateDiaryCover,
  } = useDiaryData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Create Diary modal state
  const [isCreatingDiary, setIsCreatingDiary] = useState(false);
  const [newDiaryModalOpen, setNewDiaryModalOpen] = useState(false);
  const [newDiaryTitle, setNewDiaryTitle] = useState("");
  const [newDiaryCover, setNewDiaryCover] = useState<DiaryCoverStyle>("embossed-leather");
  const [createDiaryError, setCreateDiaryError] = useState<string | null>(null);

  // Quick Entry modal state
  const todayKey = new Date().toISOString().split("T")[0];
  const [quickEntryModalOpen, setQuickEntryModalOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickMood, setQuickMood] = useState("happy");
  const [quickDiaryId, setQuickDiaryId] = useState("");
  const [quickDate, setQuickDate] = useState(todayKey);
  const [isSavingQuick, setIsSavingQuick] = useState(false);
  const [quickEntryError, setQuickEntryError] = useState<string | null>(null);

  // Deletion modals state
  const [diaryToDelete, setDiaryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success toast feedback
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const primaryDiary = diaries.length > 0 ? diaries[0] : null;

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "new-entry":
        setQuickTitle("");
        setQuickContent("");
        setQuickMood("happy");
        setQuickDate(new Date().toISOString().split("T")[0]);
        setQuickDiaryId(primaryDiary?.id || "");
        setQuickEntryError(null);
        setQuickEntryModalOpen(true);
        return;
      case "open-diary":
        if (primaryDiary) {
          window.location.href = `/diary/demo?diaryId=${encodeURIComponent(primaryDiary.id)}`;
        } else {
          window.location.href = "/diary/demo";
        }
        return;
      case "calendar":
        window.location.href = "/calendar";
        return;
      case "search-memories":
        window.location.href = "/search";
        return;
      default:
        break;
    }
  };

  const handleOpenDiary = (diaryId: string) => {
    window.location.href = `/diary/demo?diaryId=${encodeURIComponent(diaryId)}`;
  };

  const handleCreateDiary = () => {
    setNewDiaryTitle("");
    setNewDiaryCover("embossed-leather");
    setCreateDiaryError(null);
    setNewDiaryModalOpen(true);
  };

  const handleSubmitNewDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleToUse = newDiaryTitle.trim() || "My New Journal";
    setIsCreatingDiary(true);
    setCreateDiaryError(null);
    try {
      await createDiary(titleToUse, newDiaryCover);
      setNewDiaryModalOpen(false);
      showToast(`Created diary volume "${titleToUse}"`);
    } catch (err: any) {
      console.error("Failed to create diary:", err);
      setCreateDiaryError(err.message || "Failed to create diary. Please try again.");
    } finally {
      setIsCreatingDiary(false);
    }
  };

  const handleSaveQuickEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) {
      setQuickEntryError("Please enter a title for your entry.");
      return;
    }

    setIsSavingQuick(true);
    setQuickEntryError(null);
    try {
      const payload = {
        title: quickTitle.trim(),
        content: quickContent,
        mood: quickMood,
        diaryId: quickDiaryId || primaryDiary?.id,
        date: quickDate ? new Date(quickDate).toISOString() : new Date().toISOString(),
        handwritingFont: "cursive",
        inkColor: "midnight",
      };

      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to save entry" }));
        throw new Error(errorData.error || "Failed to save entry");
      }

      setQuickEntryModalOpen(false);
      setQuickTitle("");
      setQuickContent("");
      await refresh();
      notifyDiaryDataChanged();
      showToast("Reflection saved to your journal!");
    } catch (err: any) {
      console.error("Quick entry save error:", err);
      setQuickEntryError(err.message || "Could not save entry. Please try again.");
    } finally {
      setIsSavingQuick(false);
    }
  };

  const handleOpenEntry = (entryId: string) => {
    window.location.href = `/editor/demo?id=${encodeURIComponent(entryId)}`;
  };

  const handleConfirmDeleteDiary = async () => {
    if (!diaryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDiary(diaryToDelete.id);
      showToast(`Deleted "${diaryToDelete.title}"`);
      setDiaryToDelete(null);
    } catch (err) {
      console.error("Failed to delete diary:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteEntry = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEntry(entryToDelete.id);
      showToast(`Deleted "${entryToDelete.title}"`);
      setEntryToDelete(null);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApplyCoverTheme = async (themeId: DiaryCoverStyle) => {
    if (!primaryDiary) return;
    try {
      await updateDiaryCover(primaryDiary.id, themeId);
      const theme = getCoverTheme(themeId);
      showToast(`Cover updated to "${theme.name}"!`);
    } catch (err) {
      console.error("Failed to update cover theme:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2C2621] flex flex-col md:flex-row">
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Dashboard Canvas Area */}
      <main className="flex-1 min-w-0 px-3 sm:px-8 lg:px-12 py-4 sm:py-6 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <DashboardHeader
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            onNewEntryClick={() => handleAction("new-entry")}
          />

          {/* Section 1: Quick Actions */}
          <QuickActions onActionClick={handleAction} />

          {/* Section 2: My Diaries with Deletion Option */}
          <DiaryGrid
            diaries={diaries}
            onOpenDiary={handleOpenDiary}
            onCreateDiary={handleCreateDiary}
            onDeleteDiary={(diaryId) => {
              const d = diaries.find((item) => item.id === diaryId);
              setDiaryToDelete(d ? { id: d.id, title: d.title } : { id: diaryId, title: "this diary" });
            }}
          />

          {/* Section 3: Recent Entries with Deletion Option */}
          <RecentEntries
            entries={recentEntries}
            onOpenEntry={handleOpenEntry}
            onViewAll={() => handleAction("calendar")}
            onDeleteEntry={(entryId) => {
              const e = recentEntries.find((item) => item.id === entryId);
              setEntryToDelete(e ? { id: e.id, title: e.title } : { id: entryId, title: "this entry" });
            }}
          />

          {/* Section 4: Diary Statistics */}
          <DiaryStats stats={stats} />

          {/* Section 5: Journal Themes & Heirloom Covers Gallery */}
          <section id="themes-section" className="mt-12 mb-16 pt-8 border-t border-[#DECDB8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D5] text-[#554030] text-xs font-mono uppercase tracking-wider mb-2 border border-[#DDD0BC]">
                  <Palette className="w-3.5 h-3.5 text-[#B89360]" />
                  <span>Cover Themes Gallery</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#261A13] font-normal">
                  Journal Cover Themes & Art
                </h2>
                <p className="text-xs text-[#7A6756] font-light">
                  Personalize your bound volumes with illustrated keepsake art or classic heirloom leathers.
                </p>
              </div>

              {primaryDiary && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF6EE] border border-[#D8C7B0] text-xs font-serif text-[#463324] shadow-2xs">
                  <span className="text-[#8C7662]">Current Volume:</span>
                  <span className="font-semibold text-[#2C1D13]">{getCoverTheme(primaryDiary.coverColor).name}</span>
                </div>
              )}
            </div>

            {/* Illustrated Art Covers Showcase */}
            <div className="mb-8">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#685341] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B89360]" />
                <span>Illustrated Keepsake Covers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COVER_THEMES.filter((t) => t.category === "art").map((theme) => {
                  const isActive = primaryDiary?.coverColor === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`group relative rounded-2xl overflow-hidden bg-[#FAF6EE] border-2 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between ${
                        isActive
                          ? "border-[#B89360] ring-2 ring-[#B89360]/30 shadow-md"
                          : "border-[#DDD0BC] hover:border-[#8E6945]"
                      }`}
                    >
                      {/* Cover Thumbnail */}
                      <div className="relative h-52 overflow-hidden bg-[#241710]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={theme.imageUrl}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                        {/* Ribbon Bookmark simulation */}
                        <div className="absolute top-0 right-5 w-3.5 h-14 shadow-md pointer-events-none z-10 opacity-90">
                          <div className={`w-full h-full ${theme.ribbonColor} ribbon-tail`} />
                        </div>

                        {isActive && (
                          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#342419]/90 backdrop-blur-xs border border-[#E5C78B]/70 text-[#FAF5ED] text-[10px] font-mono tracking-wider uppercase shadow-md">
                            <Check className="w-3 h-3 text-[#E5C78B]" />
                            <span>Active Cover</span>
                          </div>
                        )}

                        {theme.tagline && (
                          <div className="absolute bottom-3 left-3 right-3 text-[11px] font-serif italic text-[#FAF5ED]/90 leading-tight drop-shadow-sm pointer-events-none">
                            &ldquo;{theme.tagline}&rdquo;
                          </div>
                        )}
                      </div>

                      {/* Cover Info & Action Button */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-medium text-[#261A13] mb-1 group-hover:text-[#8E6945] transition-colors">
                            {theme.name}
                          </h4>
                          <p className="text-[11px] text-[#786657] font-light leading-relaxed mb-3">
                            {theme.subtitle}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyCoverTheme(theme.id as DiaryCoverStyle)}
                          disabled={isActive}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-serif font-medium transition-all shadow-2xs flex items-center justify-center gap-1.5 ${
                            isActive
                              ? "bg-[#EFE5D5] text-[#7C6958] cursor-default border border-[#DDD0BC]"
                              : "bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] border border-[#483324] active:scale-98"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#B89360]" />
                              <span>Current Primary Cover</span>
                            </>
                          ) : (
                            <>
                              <Palette className="w-3.5 h-3.5 text-[#E5C78B]" />
                              <span>Apply to Journal</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Classic Bookbinding Leather Swatches */}
            <div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#685341] mb-3 flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#B89360]" />
                <span>Classic Bookbinding Leathers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COVER_THEMES.filter((t) => t.category === "classic").map((theme) => {
                  const isActive = primaryDiary?.coverColor === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`group rounded-2xl overflow-hidden bg-[#FAF6EE] border-2 transition-all duration-300 shadow-xs hover:shadow-lg p-4 flex flex-col justify-between ${
                        isActive
                          ? "border-[#B89360] ring-2 ring-[#B89360]/30 shadow-md"
                          : "border-[#DDD0BC] hover:border-[#8E6945]"
                      }`}
                    >
                      <div>
                        {/* Leather texture block */}
                        <div className={`h-24 rounded-xl ${theme.bgColor} border ${theme.borderColor} shadow-inner mb-3 relative overflow-hidden flex items-center justify-center`}>
                          <div className="absolute inset-2 border border-dashed border-[#D8B97C]/30 rounded-lg pointer-events-none" />
                          <div className="text-xs font-serif italic text-[#FAF5ED]/80 font-medium">
                            {theme.name}
                          </div>
                        </div>
                        <h4 className="font-serif text-sm font-medium text-[#261A13] mb-1">
                          {theme.name}
                        </h4>
                        <p className="text-[11px] text-[#786657] font-light leading-relaxed mb-3">
                          {theme.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyCoverTheme(theme.id as DiaryCoverStyle)}
                        disabled={isActive}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-serif font-medium transition-all shadow-2xs flex items-center justify-center gap-1.5 ${
                          isActive
                            ? "bg-[#EFE5D5] text-[#7C6958] cursor-default border border-[#DDD0BC]"
                            : "bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] border border-[#483324] active:scale-98"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#B89360]" />
                            <span>Current Cover</span>
                          </>
                        ) : (
                          <>
                            <Palette className="w-3.5 h-3.5 text-[#E5C78B]" />
                            <span>Apply Leather</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Toast Alert */}
      {feedbackToast && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#342419] text-[#FAF5ED] px-4 py-3 rounded-xl shadow-xl border border-[#553E2D] flex items-center gap-2.5 text-xs font-serif animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#73A663]" />
          <span>{feedbackToast}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-[#B8A695] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Quick Diary / Quick Entry Modal */}
      {quickEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261A13]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-7 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickEntryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#887564] hover:bg-[#EFE5D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D5] text-[#554030] text-xs font-mono uppercase tracking-wider mb-3 border border-[#DDD0BC]">
              <PenTool className="w-3.5 h-3.5 text-[#B89360]" />
              <span>Quick Journal Reflection</span>
            </div>

            <h3 className="font-serif text-2xl text-[#261A13] font-normal mb-1">
              Capture a Thought
            </h3>
            <p className="text-xs text-[#665547] font-light leading-relaxed mb-4">
              Pen a quick memory directly into your journal with instant cloud persistence.
            </p>

            {quickEntryError && (
              <div className="mb-4 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] text-xs text-[#842029] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{quickEntryError}</span>
              </div>
            )}

            <form onSubmit={handleSaveQuickEntry} className="space-y-4">
              {/* Target Diary & Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif text-[#4D3A2C] mb-1 font-medium">
                    Journal Volume
                  </label>
                  <select
                    value={quickDiaryId || primaryDiary?.id || ""}
                    onChange={(e) => setQuickDiaryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EDE2] border border-[#D8C7B0] text-[#2C2016] text-xs focus:outline-none focus:border-[#8E6945]"
                  >
                    {diaries.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif text-[#4D3A2C] mb-1 font-medium">
                    Date of Memory
                  </label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EDE2] border border-[#D8C7B0] text-[#2C2016] text-xs focus:outline-none focus:border-[#8E6945]"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-serif text-[#4D3A2C] mb-1 font-medium">
                  Entry Title
                </label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Afternoon light, A quiet walk..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#D8C7B0] text-[#2C2016] placeholder:text-[#A49483] text-sm focus:outline-none focus:border-[#8E6945]"
                  autoFocus
                  required
                />
              </div>

              {/* Mood Pills */}
              <div>
                <label className="block text-xs font-serif text-[#4D3A2C] mb-1.5 font-medium">
                  Current Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "happy", label: "Inspired ✨" },
                    { id: "calm", label: "Calm 🌿" },
                    { id: "reflective", label: "Reflective ☕" },
                    { id: "peaceful", label: "Peaceful 🌙" },
                    { id: "grateful", label: "Grateful 🌸" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setQuickMood(m.id)}
                      className={`px-3 py-1 rounded-full text-xs font-serif transition-colors border ${
                        quickMood === m.id
                          ? "bg-[#342419] text-[#FAF5ED] border-[#342419]"
                          : "bg-[#F4EDE2] text-[#554030] border-[#D8C7B0] hover:bg-[#EFE6D6]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Textarea with Paper Feel */}
              <div>
                <label className="block text-xs font-serif text-[#4D3A2C] mb-1 font-medium">
                  Your Reflection
                </label>
                <textarea
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6ED] border border-[#D8C7B0] text-[#2C2016] placeholder:text-[#A49483] text-sm focus:outline-none focus:border-[#8E6945] handwriting-ink leading-relaxed"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8DFC9]">
                <a
                  href="/editor/demo?new=true"
                  className="text-xs font-serif text-[#8E6945] hover:text-[#553822] flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickEntryModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-serif text-[#685648] hover:bg-[#EFE5D5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingQuick}
                    className="px-5 py-2 rounded-xl bg-[#342419] text-[#FAF5ED] text-xs font-medium hover:bg-[#483324] disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    {isSavingQuick ? (
                      "Saving..."
                    ) : (
                      <>
                        <PenTool className="w-3.5 h-3.5 text-[#E5C78B]" />
                        <span>Save Entry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Create New Diary Volume Modal */}
      {newDiaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261A13]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setNewDiaryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#887564] hover:bg-[#EFE5D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D5] text-[#554030] text-xs font-mono uppercase tracking-wider mb-3 border border-[#DDD0BC]">
              <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
              <span>New Volume Setup</span>
            </div>

            <h3 className="font-serif text-2xl text-[#261A13] font-normal mb-1">
              Bind a New Journal
            </h3>

            <p className="text-xs text-[#665547] font-light leading-relaxed mb-4">
              Give your journal a title and select an illustrated theme cover or classic leather for your shelf.
            </p>

            {createDiaryError && (
              <div className="mb-4 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] text-xs text-[#842029] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{createDiaryError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewDiary} className="space-y-4">
              <div>
                <label className="block text-xs font-serif text-[#4D3A2C] mb-1.5 font-medium">
                  Journal Title
                </label>
                <input
                  type="text"
                  value={newDiaryTitle}
                  onChange={(e) => setNewDiaryTitle(e.target.value)}
                  placeholder="e.g. My Personal Journal, Travel Memories..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#D8C7B0] text-[#2C2016] placeholder:text-[#A49483] text-sm focus:outline-none focus:border-[#8E6945] transition-colors"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-[#4D3A2C] mb-2 font-medium">
                  Choose Cover Art or Leather Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COVER_THEMES.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setNewDiaryCover(c.id as DiaryCoverStyle)}
                      className={`relative rounded-xl overflow-hidden border-2 flex flex-col items-center justify-between text-left transition-all p-1.5 ${
                        newDiaryCover === c.id
                          ? "border-[#8E6945] ring-2 ring-[#8E6945]/40 scale-102 bg-[#F2E8DA]"
                          : "border-[#DDD0BC] hover:border-[#8E6945]/60 bg-[#F7F1E7]"
                      }`}
                    >
                      {c.imageUrl ? (
                        <div className="w-full h-16 rounded-lg overflow-hidden relative mb-1.5 bg-[#241710]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-full h-16 rounded-lg ${c.bgColor} border ${c.borderColor} mb-1.5 flex items-center justify-center`}>
                          <span className="text-[10px] text-[#FAF5ED]/80 font-serif">Classic</span>
                        </div>
                      )}
                      <span className="text-[11px] text-[#2C2016] font-serif font-medium line-clamp-1 w-full text-center">
                        {c.name.replace(" Leather", "")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC9]">
                <button
                  type="button"
                  onClick={() => setNewDiaryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-serif text-[#685648] hover:bg-[#EFE5D5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingDiary}
                  className="px-5 py-2.5 rounded-xl bg-[#342419] text-[#FAF5ED] text-xs font-medium hover:bg-[#483324] disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isCreatingDiary ? "Binding Volume..." : "Create Volume"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Diary Confirmation Modal */}
      {diaryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-7 max-w-sm w-full text-[#2C2016]">
            <div className="w-10 h-10 rounded-xl bg-[#F8ECE8] border border-[#E8C5BE] flex items-center justify-center text-[#8B261E] mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-1.5 text-[#24160C]">
              Delete Diary Volume?
            </h3>
            <p className="text-xs text-[#6B5A4B] font-light leading-relaxed mb-6">
              Are you sure you want to delete &ldquo;{diaryToDelete.title}&rdquo;? All entries and pages bound inside this volume will be permanently deleted.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDiaryToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-serif text-[#685648] hover:bg-[#EFE5D5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDiary}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#8B261E] hover:bg-[#A83228] text-[#FAF5ED] text-xs font-medium transition-colors shadow-xs"
              >
                {isDeleting ? "Deleting..." : "Delete Volume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Entry Confirmation Modal */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-7 max-w-sm w-full text-[#2C2016]">
            <div className="w-10 h-10 rounded-xl bg-[#F8ECE8] border border-[#E8C5BE] flex items-center justify-center text-[#8B261E] mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-1.5 text-[#24160C]">
              Tear Out Entry?
            </h3>
            <p className="text-xs text-[#6B5A4B] font-light leading-relaxed mb-6">
              Are you sure you want to delete &ldquo;{entryToDelete.title}&rdquo;? This entry will be permanently removed from your journal.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-serif text-[#685648] hover:bg-[#EFE5D5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEntry}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#8B261E] hover:bg-[#A83228] text-[#FAF5ED] text-xs font-medium transition-colors shadow-xs"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
