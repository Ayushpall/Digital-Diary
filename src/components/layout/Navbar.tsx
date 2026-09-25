"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Feather, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F8F4EC]/90 border-b border-[#E8DFD1]/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Digital Diary Home">
          <div className="w-10 h-10 rounded-lg bg-[#3A291E] flex items-center justify-center text-[#F5EFEB] shadow-sm border border-[#523C2D] group-hover:scale-105 transition-transform duration-200">
            <Feather className="w-5 h-5 text-[#E6C687]" />
          </div>
          <div>
            <span className="font-serif text-2xl tracking-tight text-[#2A1E17] font-medium block">
              Digital Diary
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B] font-mono block -mt-1">
              Handwritten Journal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#615246]" aria-label="Main Navigation">
          <Link
            href="/"
            className="hover:text-[#2A1E17] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1.5px] after:bg-[#8B5A36] after:absolute after:bottom-0 after:left-0 after:transition-all rounded-sm"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="hover:text-[#2A1E17] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1.5px] after:bg-[#8B5A36] after:absolute after:bottom-0 after:left-0 after:transition-all rounded-sm"
          >
            Features
          </Link>
          <a
            href="#how-it-works"
            className="hover:text-[#2A1E17] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1.5px] after:bg-[#8B5A36] after:absolute after:bottom-0 after:left-0 after:transition-all rounded-sm"
          >
            How It Works
          </a>
          <a
            href="#privacy"
            className="hover:text-[#2A1E17] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1.5px] after:bg-[#8B5A36] after:absolute after:bottom-0 after:left-0 after:transition-all rounded-sm"
          >
            Privacy
          </a>
        </nav>

        {/* Right CTA Button & Auth */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-[#615246] hover:text-[#2A1E17] transition-colors py-1 px-3">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#32231A] text-[#FAF5ED] text-sm font-medium hover:bg-[#463226] shadow-sm hover:shadow-md transition-all active:scale-95 border border-[#4F392B]"
          >
            <BookOpen className="w-4 h-4 text-[#D8B97C]" />
            <span>Start Writing</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#524338] hover:bg-[#EFE7D8] transition-colors"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#F8F4EC] border-b border-[#E8DFD1] space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#4D3F34] hover:bg-[#EFE6D6]"
          >
            Home
          </Link>
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#4D3F34] hover:bg-[#EFE6D6]"
          >
            Features
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#4D3F34] hover:bg-[#EFE6D6]"
          >
            How It Works
          </a>
          <a
            href="#privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#4D3F34] hover:bg-[#EFE6D6]"
          >
            Privacy
          </a>
          <div className="pt-2 flex items-center justify-between gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#4D3F34] hover:bg-[#EFE6D6] rounded-md transition-colors"
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="px-2 py-1 flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
                <span className="text-xs text-[#6B5E51]">Account</span>
              </div>
            </SignedIn>
            <a
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#32231A] text-[#FAF5ED] text-sm font-medium shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-[#D8B97C]" />
              <span>Start Writing</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
