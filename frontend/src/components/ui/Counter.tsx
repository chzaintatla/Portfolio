"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const PATTERN = /^(\D*)(\d+(?:\.\d+)?)(.*)$/;

/** Counts up the numeric part of values like "40+", "12", "98%". Non-numeric values render as-is. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = value.match(PATTERN);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    const m = value.match(PATTERN);
    if (!m || !inView) return;
    const [, pre, num, post] = m;
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const controls = animate(0, parseFloat(num), {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${pre}${v.toFixed(decimals)}${post}`),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
