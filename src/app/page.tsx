"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { CoreFeatures } from "@/components/sections/CoreFeatures";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturePreview } from "@/components/sections/FeaturePreview";
import { PrivacySection } from "@/components/sections/PrivacySection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EC]">
      {/* 1. Sticky Tactile Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* 2 & 3. Hero Section with Live Open Diary Visual */}
        <HeroSection />

        {/* 4. Core Features */}
        <CoreFeatures />

        {/* 5. How It Works Progression */}
        <HowItWorks />

        {/* 6. Realistic Feature / Canvas Preview */}
        <FeaturePreview />

        {/* 7. Privacy Statement */}
        <PrivacySection />

        {/* 8. Final Call to Action */}
        <FinalCta />
      </main>

      {/* 9. Warm Minimal Footer */}
      <Footer />
    </div>
  );
}
