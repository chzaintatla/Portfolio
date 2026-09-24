"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Quote } from "lucide-react";
import { useEffect, useState } from "react";

import { EASE } from "@/animations/variants";
import { CmsImage, DemoBadge } from "@/components/ui/misc";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/types";

/** Testimonial slider. Renders nothing when there are no published testimonials. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % count), 7000);
    return () => window.clearInterval(t);
  }, [count, paused]);

  if (!count) return null;
  const t = items[i];

  return (
    <section
      className="relative py-28 md:py-36"
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="container-x">
        <div id="testimonials-title" className="mb-14">
          <SectionHeading eyebrow="Testimonials" title="What our clients *say.*" />
        </div>
        <div className="hairline relative overflow-hidden rounded-[2rem] bg-card/60 p-8 md:p-14">
          <Quote className="absolute top-8 right-8 h-24 w-24 text-white/[.04]" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: EASE }}
              aria-live="polite"
            >
              <DemoBadge show={t.is_demo} />
              <blockquote className="mt-4 max-w-4xl font-display text-2xl leading-snug tracking-tight md:text-[2.2rem]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                {t.photo ? (
                  <CmsImage src={t.photo} alt={t.client_name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua font-display text-lg font-semibold" aria-hidden="true">
                    {t.client_name.charAt(0)}
                  </span>
                )}
                <span>
                  <span className="block font-medium">{t.client_name}</span>
                  <span className="block text-sm text-mute">{[t.designation, t.company].filter(Boolean).join(", ")}</span>
                </span>
                {t.video_url && (
                  <a href={t.video_url} target="_blank" rel="noopener noreferrer" className="hairline ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:border-aqua/50">
                    <Play className="h-4 w-4 text-aqua" aria-hidden="true" /> Watch video
                  </a>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          {count > 1 && (
            <div className="mt-10 flex items-center gap-4">
              <button type="button" onClick={() => setI((v) => (v - 1 + count) % count)} className="hairline flex h-11 w-11 items-center justify-center rounded-full hover:border-aqua/50" aria-label="Previous testimonial">
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setI((v) => (v + 1) % count)} className="hairline flex h-11 w-11 items-center justify-center rounded-full hover:border-aqua/50" aria-label="Next testimonial">
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="ml-2 flex gap-1.5" aria-hidden="true">
                {items.map((x, k) => (
                  <span key={x.id} className={`h-1 rounded-full transition-all duration-500 ${k === i ? "w-8 bg-aqua" : "w-3 bg-line-hi"}`} />
                ))}
              </div>
              <span className="sr-only">{`Testimonial ${i + 1} of ${count}`}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
