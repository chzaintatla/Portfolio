"use client";

import { MotionConfig } from "framer-motion";

/** Framer respects the OS reduced-motion setting site-wide (transforms off, opacity fades kept). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
