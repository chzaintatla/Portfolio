"use client";

import { motion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type MouseEvent, type ReactNode, useRef } from "react";

import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-midnight hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,.1),0_20px_60px_-20px_rgba(124,58,237,.8)]",
  outline: "border border-line-hi text-ink hover:border-aqua/60 hover:bg-white/[.03]",
  ghost: "text-ink hover:text-aqua",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  arrow?: boolean;
  magnetic?: boolean;
  trackLabel?: string;
  external?: boolean;
}

/** Pill button with a magnetic pull toward the cursor and an arrow that slides on hover. */
export function Button({
  children, href, onClick, variant = "primary", className, type = "button", disabled, arrow = true,
  magnetic = true, trackLabel, external,
}: ButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current || !window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const handleClick = () => {
    if (trackLabel) track("cta_click", { label: trackLabel, href });
    onClick?.();
  };

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="relative inline-flex h-5 w-5 overflow-hidden" aria-hidden="true">
          <ArrowUpRight className="absolute h-5 w-5 transition-transform duration-500 ease-spark group-hover:translate-x-5 group-hover:-translate-y-5" />
          <ArrowUpRight className="absolute h-5 w-5 -translate-x-5 translate-y-5 transition-transform duration-500 ease-spark group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </>
  );
  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
    styles[variant],
    className,
  );

  return (
    <motion.span ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset} className="inline-flex" data-cursor="link">
      {href ? (
        external ? (
          <a href={href} className={cls} onClick={handleClick} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <Link href={href} className={cls} onClick={handleClick}>
            {inner}
          </Link>
        )
      ) : (
        <button type={type} className={cls} onClick={handleClick} disabled={disabled}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
