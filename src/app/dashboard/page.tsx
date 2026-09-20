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
import { Sparkles, X, BookOpen, PenTool, Check } from "lucide-react";

export default function DashboardPage() {
  const { diaries, recentEntries, stats, createDiary } = useDiaryData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCreatingDiary, setIsCreatingDiary] = useState(false);
  const [newDiaryModalOpen, setNewDiaryModalOpen] = useState(false);
  const [newDiaryTitle, setNewDiaryTitle] = useState("");
  const [newDiaryCover, setNewDiaryCover] = useState<"burgundy" | "forest" | "navy" | "leather">("burgundy");

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
    setNewDiaryCover("burgundy");
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

          {/* Section 2: My Diaries */}
          <DiaryGrid
            diaries={diaries}
            onOpenDiary={handleOpenDiary}
            onCreateDiary={handleCreateDiary}
          />

          {/* Section 3: Recent Entries */}
          <RecentEntries
            entries={recentEntries}
            onOpenEntry={handleOpenEntry}
            onViewAll={() => handleAction("calendar")}
          />

          {/* Section 4: Diary Statistics */}
          <DiaryStats stats={stats} />

          {/* Section 5: Journal Settings & Personal Profile */}
          <section id="settings-section" className="mt-12 mb-16 pt-8 border-t border-[#DECDB8]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#261A13] font-normal">
                  Settings & Preferences
                </h2>
                <p className="text-xs text-[#7A6756] font-light">
                  Manage your personal writing desk, default typography, and private workspace
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Writing Environment */}
              <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs">
                <h3 className="font-serif text-lg text-[#261A13] font-medium mb-1">
                  Writing Atmosphere
                </h3>
                <p className="text-xs text-[#736253] font-light mb-4">
                  Default ink colors, paper rulings, and sensory features.
                </p>

                <div className="space-y-3.5 text-xs text-[#4A392B]">
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFC9]">
                    <span className="font-medium">Paper Texture Pattern</span>
                    <span className="font-mono text-[#7B6959]">Vintage Ruled Lines</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFC9]">
                    <span className="font-medium">Handwriting Fluidity</span>
                    <span className="font-mono text-[#7B6959]">Living Ink Enabled</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFC9]">
                    <span className="font-medium">Auto-Save Frequency</span>
                    <span className="font-mono text-[#4A7352] font-semibold">Continuous (1.2s debounce)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium">Physical Page Flip Sound</span>
                    <span className="font-mono text-[#7B6959]">Subtle Velvet</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Privacy & Account Isolation */}
              <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs">
                <h3 className="font-serif text-lg text-[#261A13] font-medium mb-1">
                  Private Cloud Vault
                </h3>
                <p className="text-xs text-[#736253] font-light mb-4">
                  Multi-tenant isolation backed by Neon PostgreSQL.
                </p>

                <div className="space-y-3.5 text-xs text-[#4A392B]">
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFC9]">
                    <span className="font-medium">Database Isolation</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EFE2] text-[#345938] font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4A7352]" />
                      Tenant Encrypted
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFC9]">
                    <span className="font-medium">Active Volumes</span>
                    <span className="font-mono text-[#7B6959]">{diaries.length} Bound</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFC9]">
                    <span className="font-medium">Total Entries Stored</span>
                    <span className="font-mono text-[#7B6959]">{stats.totalEntries} Saved</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium">Storage Region</span>
                    <span className="font-mono text-[#7B6959]">Neon Serverless PG</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Interactive Create New Diary Volume Modal */}
      {newDiaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261A13]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
            <button
              onClick={() => setNewDiaryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#887564] hover:bg-[#EFE5D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D5] text-[#554030] text-xs font-mono uppercase tracking-wider mb-4 border border-[#DDD0BC]">
              <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
              <span>New Volume Setup</span>
            </div>

            <h3 className="font-serif text-2xl text-[#261A13] font-normal mb-2">
              Bind a New Journal
            </h3>

            <p className="text-xs text-[#665547] font-light leading-relaxed mb-5">
              Give your journal a title and select a leather cover style for your shelf.
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
                  Leather Cover Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "burgundy", label: "Burgundy", bg: "bg-[#3D1E24]" },
                    { id: "forest", label: "Forest", bg: "bg-[#25392B]" },
                    { id: "navy", label: "Midnight", bg: "bg-[#1E2B3D]" },
                    { id: "leather", label: "Classic Oak", bg: "bg-[#38261A]" },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setNewDiaryCover(c.id as any)}
                      className={`h-12 rounded-xl ${c.bg} border-2 flex flex-col items-center justify-center transition-all ${
                        newDiaryCover === c.id
                          ? "border-[#E5C78B] ring-2 ring-[#8E6945]/40 scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <span className="text-[10px] text-[#FAF5ED] font-serif capitalize">
                        {c.label}
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
    </div>
  );
}
