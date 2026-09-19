import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Feather } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EC] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 group" aria-label="Digital Diary Home">
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

      {/* Clerk SignIn Component */}
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-lg border border-[#E8DFD1] bg-[#FAF6EE]",
              headerTitle: "text-[#2A1E17] font-serif",
              headerSubtitle: "text-[#6B5E51]",
              socialButtonsBlockButton: "border-[#E8DFD1] hover:bg-[#F2ECE1] text-[#2C2621]",
              formButtonPrimary: "bg-[#32231A] hover:bg-[#463226] text-[#FAF5ED]",
              footerActionLink: "text-[#8B5A36] hover:text-[#5E381E]",
            },
          }}
        />
      </div>
    </div>
  );
}
