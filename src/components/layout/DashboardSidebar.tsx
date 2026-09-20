"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Search, 
  Settings, 
  Feather, 
  Home, 
  Sun, 
  Moon, 
  LogOut,
  ChevronRight,
  X
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  activeTab = "dashboard",
  onTabChange,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [themeDark, setThemeDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("digital_diary_theme");
      if (saved === "warm-ink") {
        setThemeDark(true);
        document.documentElement.classList.add("theme-warm-ink");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextState = !themeDark;
    setThemeDark(nextState);
    if (typeof window !== "undefined") {
      if (nextState) {
        document.documentElement.classList.add("theme-warm-ink");
        localStorage.setItem("digital_diary_theme", "warm-ink");
      } else {
        document.documentElement.classList.remove("theme-warm-ink");
        localStorage.setItem("digital_diary_theme", "parchment");
      }
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "diaries", label: "My Diaries", icon: BookOpen, href: "#diaries-section" },
    { id: "calendar", label: "Calendar", icon: CalendarIcon, href: "/calendar" },
    { id: "search", label: "Search", icon: Search, href: "/search" },
    { id: "settings", label: "Settings", icon: Settings, href: "#settings-section" },
  ];

  const handleNavClick = (id: string) => {
    if (onTabChange) onTabChange(id);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#F4EDE2] border-r border-[#DECDB8] p-5 w-64 select-none">
      {/* Top: Logo & Main Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#38261A] flex items-center justify-center text-[#E5C78B] shadow-sm border border-[#523B2A] group-hover:scale-105 transition-transform duration-200">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl tracking-tight text-[#2A1D15] font-medium block">
                Digital Diary
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#887463] font-mono block -mt-1">
                Personal Home
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg text-[#7C6958] hover:bg-[#E8DCB8] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-[#DECDB8]/80" />

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#38261A] text-[#FAF5ED] shadow-sm font-semibold"
                    : "text-[#5C4C3E] hover:bg-[#EBE0CF] hover:text-[#2A1D15]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E5C78B]" : "text-[#857161]"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#E5C78B]" />}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom: User Profile Placeholder & Theme Toggle */}
      <div className="space-y-4 pt-4 border-t border-[#DECDB8]">
        {/* Theme Toggle Pill */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#EBE0CF] border border-[#DECDB8] text-xs font-serif text-[#665445]">
          <span className="flex items-center gap-1.5 font-medium pl-1">
            {themeDark ? <Moon className="w-3.5 h-3.5 text-[#B89360]" /> : <Sun className="w-3.5 h-3.5 text-[#B89360]" />}
            <span>Paper Theme</span>
          </span>
          <button
            onClick={() => setThemeDark(!themeDark)}
            className="px-2.5 py-1 rounded-md bg-[#FAF5ED] text-[#3A281B] text-[11px] font-sans font-medium hover:bg-white shadow-2xs transition-colors border border-[#DDD0BC]"
          >
            {themeDark ? "Warm Ink" : "Parchment"}
          </button>
        </div>

        {/* User Profile Card */}
        {isSignedIn && user ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User profile"}
                  className="w-9 h-9 rounded-full object-cover border border-[#523B2A] shadow-inner"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#3B291D] text-[#E8C888] font-serif font-medium text-sm flex items-center justify-center border border-[#523B2A] shadow-inner flex-shrink-0">
                  {(user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-serif font-medium text-[#291D15] leading-tight truncate">
                  {user.fullName || user.username || "Private Journaler"}
                </p>
                <p className="text-[10px] text-[#8C7A6B] font-mono leading-tight truncate">
                  {user.primaryEmailAddress?.emailAddress || "Signed in"}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 text-[#887564] hover:text-[#3B291D] hover:bg-[#EBE0CF] rounded-lg transition-colors diary-focus active:scale-95 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#3B291D] text-[#E8C888] font-serif font-medium text-sm flex items-center justify-center border border-[#523B2A] shadow-inner">
                G
              </div>
              <div>
                <p className="text-xs font-serif font-medium text-[#291D15] leading-tight">
                  Guest Explorer
                </p>
                <p className="text-[10px] text-[#8C7A6B] font-mono leading-tight">
                  Preview Mode
                </p>
              </div>
            </div>
            <Link
              href="/sign-in"
              title="Sign In"
              aria-label="Sign In"
              className="px-2 py-1 text-xs font-serif bg-[#38261A] text-[#FAF5ED] hover:bg-[#483324] rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#291D15]/40 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
