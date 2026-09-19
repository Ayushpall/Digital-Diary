import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#FCFAF6",
          100: "#F9F5EC",
          200: "#F2EADB",
          300: "#E9DCB8",
          400: "#DFCFA5",
          line: "rgba(180, 155, 130, 0.22)",
          margin: "rgba(215, 120, 110, 0.28)",
          shadow: "rgba(38, 28, 20, 0.08)",
        },
        ink: {
          midnight: "#1A2536",
          carbon: "#232120",
          sepia: "#4A3525",
          faded: "#5C554E",
          subtle: "#8A7E72",
        },
        leather: {
          dark: "#2A1D15",
          warm: "#422E22",
          brass: "#C29B38",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "serif"],
        handwriting: ["var(--font-caveat)", "cursive"],
        handwritingAlt: ["var(--font-kalam)", "cursive"],
        handwritingCasual: ["var(--font-patrick-hand)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        book: "0 25px 50px -12px rgba(42, 29, 21, 0.25), 0 0 0 1px rgba(160, 130, 100, 0.15)",
        page: "0 10px 25px -5px rgba(42, 29, 21, 0.12), 0 8px 10px -6px rgba(42, 29, 21, 0.08)",
        spine: "inset 0 0 30px rgba(45, 30, 20, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
