"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface PageFlipProps {
  children: React.ReactNode;
  pageKey: string | number;
  direction?: "forward" | "backward";
  origin?: "left" | "right" | "auto";
}

export function PageFlip({
  children,
  pageKey,
  direction = "forward",
  origin = "auto",
}: PageFlipProps) {
  const variants: Variants = {
    enter: (dir: "forward" | "backward") => ({
      rotateY: dir === "forward" ? 35 : -35,
      opacity: 0,
      scale: 0.98,
      boxShadow: "0 25px 50px -12px rgba(30, 20, 10, 0.4)",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      boxShadow: "0 10px 25px -5px rgba(30, 20, 10, 0.15)",
      transition: {
        duration: 0.45,
      },
    },
    exit: (dir: "forward" | "backward") => ({
      rotateY: dir === "forward" ? -45 : 45,
      opacity: 0,
      scale: 0.98,
      boxShadow: "0 25px 50px -12px rgba(30, 20, 10, 0.4)",
      transition: {
        duration: 0.35,
      },
    }),
  };

  return (
    <div className="w-full h-full [perspective:1400px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pageKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin:
              origin === "left"
                ? "left center"
                : origin === "right"
                ? "right center"
                : direction === "forward"
                ? "left center"
                : "right center",
          }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
