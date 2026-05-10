"use client";

import { useReducedMotion } from "framer-motion";

export function useAppReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

export const springSnappy = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
};

export const fadeUp = (reduceMotion: boolean) =>
  reduceMotion
    ? { initial: false, animate: false }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" as const },
      };
