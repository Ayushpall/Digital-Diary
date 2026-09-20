"use client";

import React from "react";
import { Plus, Menu, Feather, Calendar } from "lucide-react";

interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
  onNewEntryClick?: () => void;
}

export function DashboardHeader({
  onOpenMobileMenu,
  onNewEntryClick,
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = React.useState("Good morning");
  const [todayStr, setTodayStr] = React.useState(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  });

  React.useEffect(() => {
    const now = new Date();
    setTodayStr(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now)
    );

    const hour = now.getHours();
    if (hour >= 4 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <header className="pb-8 pt-6 sm:pt-8 border-b border-[#DECDB8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start gap-3">
        {/* Mobile menu hamburger button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden mt-1 p-2 rounded-xl bg-[#EFE5D5] text-[#4A3728] border border-[#D8C7B0] hover:bg-[#E5DAC6] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#887463] mb-1" suppressHydrationWarning>
            <Calendar className="w-3.5 h-3.5 text-[#B89360]" />
            <span>{todayStr}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#261A13] tracking-tight font-normal" suppressHydrationWarning>
            {greeting} 👋
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#685749] font-light">
            Ready to write something today?
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewEntryClick}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#342419] text-[#FAF5ED] text-sm font-medium hover:bg-[#483324] shadow-md hover:shadow-lg transition-all active:scale-95 border border-[#523B2A] group"
        >
          <Plus className="w-4 h-4 text-[#E5C78B] group-hover:rotate-90 transition-transform duration-200" />
          <span>+ New Entry</span>
        </button>
      </div>
    </header>
  );
}
