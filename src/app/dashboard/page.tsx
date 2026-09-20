"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DiaryGrid } from "@/components/dashboard/DiaryGrid";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { DiaryStats } from "@/components/dashboard/DiaryStats";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useDiaryData } from "@/lib/use-diary-data";
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
} from "lucide-react";

export default function DashboardPage() {
  const {
    diaries,
    recentEntries,
    stats,
    createDiary,
    deleteDiary,
    deleteEntry,
    updateDiaryCover,
  } = useDiaryData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCreatingDiary, setIsCreatingDiary] = useState(false);
  const [newDiaryModalOpen, setNewDiaryModalOpen] = useState(false);
  const [newDiaryTitle, setNewDiaryTitle] = useState("");
  const [newDiaryCover, setNewDiaryCover] = useState<DiaryCoverStyle>("embossed-leather");

  // Deletion modals state
  const [diaryToDelete, setDiaryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Theme change feedback
  const [themeToast, setThemeToast] = useState<string | null>(null);

  const primaryDiary = diaries.length > 0 ? diaries[0] : null;

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "new-entry":
        window.location.href = "/editor/demo?new=true";
        return;
      case "open-diary":
        window.location.href = "/diary/demo";
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
    window.location.href = "/diary/demo";
  };

  const handleCreateDiary = () => {
    setNewDiaryTitle("");
    setNewDiaryCover("embossed-leather");
    setNewDiaryModalOpen(true);
  };

  const handleSubmitNewDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleToUse = newDiaryTitle.trim() || "My New Journal";
    setIsCreatingDiary(true);
    try {
      await createDiary(titleToUse, newDiaryCover);
      setNewDiaryModalOpen(false);
    } catch (err) {
      console.error("Failed to create diary:", err);
    } finally {
      setIsCreatingDiary(false);
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
      setThemeToast(theme.name);
      setTimeout(() => setThemeToast(null), 3500);
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

      {/* Theme Applied Toast Alert */}
      {themeToast && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#342419] text-[#FAF5ED] px-4 py-3 rounded-xl shadow-xl border border-[#553E2D] flex items-center gap-2.5 text-xs font-serif animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#73A663]" />
          <span>Cover updated to &ldquo;{themeToast}&rdquo;!</span>
          <button
            onClick={() => setThemeToast(null)}
            className="ml-2 text-[#B8A695] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
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

            <p className="text-xs text-[#665547] font-light leading-relaxed mb-5">
              Give your journal a title and select an illustrated theme cover or classic leather for your shelf.
            </p>

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
