"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Mode = "default" | "link" | "view" | "explore" | "hidden";

/**
 * Desktop-only custom cursor. Elements opt in via `data-cursor="link" | "view" | "explore"`.
 * Links and buttons expand it automatically. Never rendered for touch or reduced-motion users.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const ok =
      window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    // Enabling here is a one-time sync with the device's capabilities.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role='button'], input, textarea, select");
      if (!el) return setMode("default");
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return setMode("hidden");
      const explicit = el.dataset.cursor as Mode | undefined;
      setMode(explicit ?? "link");
    };
    const leave = () => setMode("hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const label = mode === "view" ? "VIEW" : mode === "explore" ? "EXPLORE" : "";
  const size = mode === "view" || mode === "explore" ? 88 : mode === "link" ? 44 : mode === "hidden" ? 0 : 12;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        backgroundColor: label ? "rgba(248,250,252,1)" : mode === "link" ? "rgba(34,211,238,0.12)" : "rgba(248,250,252,1)",
        borderColor: mode === "link" ? "rgba(34,211,238,0.8)" : "rgba(0,0,0,0)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      // Border drawn via inline style so it can animate.
      initial={false}
    >
      <span className="absolute inset-0 rounded-full border" style={{ borderColor: "inherit" }} />
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="font-display text-[0.7rem] font-semibold tracking-[0.18em] text-midnight"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
