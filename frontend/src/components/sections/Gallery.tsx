"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CmsImage } from "@/components/ui/misc";
import type { ProjectImage } from "@/types";

/** Screenshot grid with a keyboard-accessible lightbox. */
export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  if (!images.length) return null;
  const current = open !== null ? images[open] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.url} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              data-cursor="view"
              className="group hairline relative block aspect-square w-full overflow-hidden rounded-2xl bg-card"
              aria-label={`Open ${img.alt || img.caption || `screenshot ${i + 1}`}`}
            >
              <CmsImage src={img.url} alt={img.alt || `${title} screenshot ${i + 1}`} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              {img.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left text-xs text-ink/90 opacity-0 transition-opacity group-hover:opacity-100">
                  {img.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption || "Screenshot"}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              key={current.url}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CmsImage src={current.url} alt={current.alt || ""} fill sizes="90vw" className="object-contain" />
            </motion.div>
            {current.caption && <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-mute">{current.caption}</p>}
            <button type="button" onClick={close} className="absolute top-5 right-5 rounded-full bg-white/10 p-3" aria-label="Close" autoFocus>
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 rounded-full bg-white/10 p-3" aria-label="Previous">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 rounded-full bg-white/10 p-3" aria-label="Next">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
