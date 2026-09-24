"use client";

import { motion } from "framer-motion";

import { EASE } from "@/animations/variants";

/**
 * Page transition on every route change (templates remount per navigation).
 * Only opacity + y: a lingering filter/transform on this wrapper would break GSAP pinned sections,
 * and framer resets `transform` to none once y settles at 0.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
      {children}
    </motion.div>
  );
}
