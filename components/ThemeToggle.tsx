"use client";

import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <motion.button
      type="button"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "theme-toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="sr-only">{isDark ? "Light theme" : "Dark theme"}</span>
      <Sun aria-hidden className="theme-toggle__icon sun" />
      <MoonStar aria-hidden className="theme-toggle__icon moon" />
    </motion.button>
  );
}

export default ThemeToggle;
