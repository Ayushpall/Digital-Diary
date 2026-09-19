"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DiaryGrid } from "@/components/dashboard/DiaryGrid";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { DiaryStats } from "@/components/dashboard/DiaryStats";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { mockDiaries, mockRecentEntries, mockDiaryStats } from "@/lib/mock-data";
import { Sparkles, X, BookOpen, PenTool, Check } from "lucide-react";

export default function DashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [noticeModal, setNoticeModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    tag: string;
  }>({
    open: false,
    title: "",
    description: "",
    tag: "",
  });

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "new-entry":
        window.location.href = "/editor/demo";
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
    setNoticeModal({
      open: true,
      title: "Create New Journal Volume",
      description:
        "Select your cover leather (Burgundy, Forest Green, Classic Oak, or Midnight Navy), pick paper ruling (Ruled, Dots, or Blank), and title your collection.",
      tag: "New Volume Setup",
    });
  };

  const handleOpenEntry = (entryId: string) => {
    window.location.href = "/diary/demo";
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
            diaries={mockDiaries}
            onOpenDiary={handleOpenDiary}
            onCreateDiary={handleCreateDiary}
          />

          {/* Section 3: Recent Entries */}
          <RecentEntries
            entries={mockRecentEntries}
            onOpenEntry={handleOpenEntry}
            onViewAll={() => handleAction("calendar")}
          />

          {/* Section 4: Diary Statistics */}
          <DiaryStats stats={mockDiaryStats} />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Action Notification Modal */}
      {noticeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261A13]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D5C6AC] shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
            <button
              onClick={() => setNoticeModal({ ...noticeModal, open: false })}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#887564] hover:bg-[#EFE5D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D5] text-[#554030] text-xs font-mono uppercase tracking-wider mb-4 border border-[#DDD0BC]">
              <Sparkles className="w-3.5 h-3.5 text-[#B89360]" />
              <span>{noticeModal.tag}</span>
            </div>

            <h3 className="font-serif text-2xl text-[#261A13] font-normal mb-2">
              {noticeModal.title}
            </h3>

            <p className="text-sm text-[#665547] font-light leading-relaxed mb-6">
              {noticeModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC9]">
              <button
                onClick={() => setNoticeModal({ ...noticeModal, open: false })}
                className="px-5 py-2.5 rounded-xl bg-[#342419] text-[#FAF5ED] text-xs font-medium hover:bg-[#483324] transition-colors shadow-xs"
              >
                Continue Writing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
