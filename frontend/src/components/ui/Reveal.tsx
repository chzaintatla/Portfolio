"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { fadeUp, stagger } from "@/animations/variants";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "li" | "ul" | "p" | "span" | "article";
  amount?: number;
}

/** Fades/slides children in once when they enter the viewport. */
export function Reveal({ children, className, variants = fadeUp, delay = 0, as = "div", amount = 0.25 }: RevealProps) {
  const Cmp = motion[as] as ElementType;
  return (
    <Cmp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Cmp>
  );
}

/** Container that staggers `RevealItem` children. */
export function RevealGroup({ children, className, step = 0.08, as = "div", amount = 0.15 }: {
  children: ReactNode; className?: string; step?: number; as?: "div" | "ul" | "section"; amount?: number;
}) {
  const Cmp = motion[as] as ElementType;
  return (
    <Cmp className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount }} variants={stagger(step)}>
      {children}
    </Cmp>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const Cmp = motion[as] as ElementType;
  return (
    <Cmp className={className} variants={fadeUp}>
      {children}
    </Cmp>
  );
}
