"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

type MotionWrapperProps = {
  children: React.ReactNode;
};

export function FadeStagger({ children }: MotionWrapperProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-20%" }}
      variants={{
        hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
        show: reduceMotion
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { staggerChildren: 0.08, ease: [0.22, 1, 0.36, 1] },
            },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeItem({ children }: MotionWrapperProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0.18 : 0.28, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
