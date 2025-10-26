"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import * as React from "react";

import { SiteHeader } from "../SiteHeader";
import { ToastProvider } from "../ui/toast-provider";

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="page-content"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: reduceMotion ? 0.18 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <ToastProvider />
    </div>
  );
}
