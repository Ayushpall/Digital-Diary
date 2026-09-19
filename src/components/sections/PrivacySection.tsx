"use client";

import React from "react";
import { Lock, EyeOff, HardDrive, ShieldCheck } from "lucide-react";

export function PrivacySection() {
  const points = [
    {
      icon: HardDrive,
      title: "Local-First Architecture",
      desc: "Every keystroke and journal entry is kept directly in your browser's private local storage. No external server ever receives your diary.",
    },
    {
      icon: EyeOff,
      title: "Zero Analytics or Telemetry",
      desc: "We don't track your writing habits, word count, or browsing patterns. Your time spent writing belongs entirely to you.",
    },
    {
      icon: Lock,
      title: "No Accounts or Passwords to Lose",
      desc: "No email verification links, no cloud breaches, and no risk of forgotten passwords locking you out of your private memories.",
    },
  ];

  return (
    <section id="privacy" className="py-20 md:py-28 bg-[#EFE8DC] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-[#39281D] flex items-center justify-center text-[#E6C688] mx-auto mb-6 shadow-md border border-[#523A2B]">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Big Privacy Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl text-[#261A13] tracking-tight font-normal mb-4">
          Your thoughts are personal.
        </h2>

        <p className="text-lg sm:text-xl text-[#5F4E40] max-w-2xl mx-auto font-light leading-relaxed mb-12">
          In an era of cloud synchronization and data mining, Digital Diary is intentionally built as an offline sanctuary. It works like an authentic paper journal: what you write here stays here.
        </p>

        {/* 3 Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl bg-[#FAF6EE] border border-[#DDD0BC] shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EAE0CE] flex items-center justify-center text-[#554032] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-[#2A1E17] mb-2 font-medium">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6A5A4D] font-light leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
