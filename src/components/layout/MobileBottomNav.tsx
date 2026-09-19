"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  PenTool, 
  Calendar as CalendarIcon, 
  Search 
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Diary",
      href: "/diary/demo",
      icon: BookOpen,
      isActive: pathname.startsWith("/diary"),
    },
    {
      label: "Write",
      href: "/editor/demo",
      icon: PenTool,
      isActive: pathname.startsWith("/editor"),
      isPrimary: true,
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
      isActive: pathname.startsWith("/calendar"),
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
      isActive: pathname.startsWith("/search"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#DECDB8] px-3 py-1.5 shadow-[0_-4px_20px_rgba(40,25,15,0.08)]" aria-label="Mobile Bottom Navigation">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                aria-current={item.isActive ? "page" : undefined}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md border transition-all ${
                    item.isActive
                      ? "bg-[#2A1D15] text-[#FAF5ED] border-[#4A3425] scale-105"
                      : "bg-[#38261A] text-[#FAF5ED] border-[#4A3425] hover:bg-[#483324]"
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#E5C78B]" />
                </div>
                <span
                  className={`text-[10px] font-serif font-medium mt-1 ${
                    item.isActive ? "text-[#38261A] font-bold" : "text-[#7C6958]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={item.isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 rounded-xl transition-colors ${
                item.isActive
                  ? "text-[#38261A]"
                  : "text-[#7C6958] hover:text-[#38261A]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    item.isActive ? "text-[#38261A]" : "text-[#8C7A6B]"
                  }`}
                />
                {item.isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B89360]" />
                )}
              </div>
              <span
                className={`text-[10px] font-serif mt-1 ${
                  item.isActive ? "font-bold text-[#38261A]" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
