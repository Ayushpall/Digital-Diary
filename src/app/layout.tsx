import type { Metadata } from "next";
import { Newsreader, Caveat, Kalam, Patrick_Hand, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
  weight: ["300", "400", "700"],
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  display: "swap",
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Diary — Your thoughts, written like you",
  description:
    "A virtual diary that feels like an authentic handwritten notebook. Type your thoughts with a keyboard and watch them render as realistic handwriting on warm paper.",
  keywords: ["digital diary", "handwritten journal", "virtual notebook", "personal diary", "private journal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${caveat.variable} ${kalam.variable} ${patrickHand.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F8F4EC] text-[#2C2621] antialiased selection:bg-[#E2D4BF] selection:text-[#1A2536]">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#32231A",
              colorText: "#2C2621",
              colorBackground: "#FAF6EE",
              colorInputBackground: "#FFFFFF",
              colorInputText: "#2C2621",
              borderRadius: "0.75rem",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
