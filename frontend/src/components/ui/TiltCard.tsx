"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Subtle 3D tilt with a glow that follows the cursor. Inert on touch devices. */
export function TiltCard({ children, className, max = 6, cursor = "explore" }: {
  children: ReactNode; className?: string; max?: number; cursor?: string;
}) {
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(124,58,237,.18), transparent 60%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("group relative", className)}
      data-cursor={cursor}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />
      {children}
    </motion.div>
  );
}
