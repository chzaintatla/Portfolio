"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { EASE } from "@/animations/variants";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3";

/**
 * Word-by-word clip reveal. Words wrapped in *asterisks* get the animated gradient.
 * The heading carries the full text as its accessible name; the animated spans are hidden from AT.
 */
export function SplitHeading({ text, as = "h2", className, delay = 0, immediate = false }: {
  text: string; as?: Tag; className?: string; delay?: number; immediate?: boolean;
}) {
  const Cmp = motion[as];
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.4 } };
  return (
    <Cmp
      className={cn("font-display", className)}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text.replace(/\*/g, "")}
    >
      {words.map((word, i) => {
        const highlight = /^\*.*\*[.,!?]*$/.test(word);
        const clean = word.replace(/\*/g, "");
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden="true">
            <motion.span
              className={cn("inline-block", highlight && "text-gradient animate-gradient-x")}
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.85, ease: EASE } },
              }}
            >
              {clean}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Cmp>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span className="h-px w-8 bg-gradient-to-r from-violet to-aqua" aria-hidden="true" />
      {children}
    </p>
  );
}
