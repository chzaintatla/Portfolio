"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { EASE } from "@/animations/variants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { FAQ as FAQItem } from "@/types";

export function FAQ({ items, title = "Questions, *answered.*" }: { items: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;
  return (
    <section className="relative py-28 md:py-36" aria-labelledby="faq-title">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.6fr]">
        <div id="faq-title" className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow="FAQ" title={title} />
        </div>
        <ul className="border-t border-line">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${f.id}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className={cn("font-display text-lg font-medium transition-colors md:text-xl", isOpen ? "text-ink" : "text-ink/80")}>{f.question}</span>
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500", isOpen ? "rotate-45 border-aqua/60 bg-aqua/10 text-aqua" : "border-line text-mute")}>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${f.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-mute">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
