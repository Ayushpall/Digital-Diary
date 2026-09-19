"use client";

import React from "react";
import { PenTool, BookOpen, Calendar, Search, ArrowUpRight } from "lucide-react";

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions = [
    {
      id: "new-entry",
      title: "New Entry",
      subtitle: "Open a blank page & type",
      icon: PenTool,
      accent: "bg-[#EFE6D6] text-[#422E20]",
      border: "border-[#DCCEB8]",
    },
    {
      id: "open-diary",
      title: "Open Diary",
      subtitle: "Flip through your active volume",
      icon: BookOpen,
      accent: "bg-[#E8DCB8] text-[#38261A]",
      border: "border-[#D5C6A0]",
    },
    {
      id: "calendar",
      title: "Calendar",
      subtitle: "Browse entries by date",
      icon: Calendar,
      accent: "bg-[#E7DFCE] text-[#473628]",
      border: "border-[#D4C8B4]",
    },
    {
      id: "search-memories",
      title: "Search Memories",
      subtitle: "Find thoughts & past reflections",
      icon: Search,
      accent: "bg-[#EAE0CF] text-[#4E3929]",
      border: "border-[#D8C7B0]",
    },
  ];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl sm:text-2xl text-[#261A13] font-normal">
          Quick Actions
        </h2>
        <span className="text-xs font-serif italic text-[#8B7868]">
          Touch or click to begin
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick?.(act.id)}
              className={`p-5 rounded-2xl bg-[#FAF6EE] border ${act.border} shadow-2xs hover:shadow-md hover:border-[#BFAD93] transition-all duration-200 text-left flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${act.accent} flex items-center justify-center shadow-xs border border-[#DECDB8] group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A89481] group-hover:text-[#38261A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div>
                <h3 className="font-serif text-lg text-[#261A13] font-medium mb-1">
                  {act.title}
                </h3>
                <p className="text-xs text-[#6B5A4B] font-light leading-relaxed">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
