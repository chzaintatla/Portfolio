"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { EASE } from "@/animations/variants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { Technology } from "@/types";

const r2 = (n: number) => Math.round(n * 100) / 100;

interface Group {
  slug: string;
  name: string;
  items: Technology[];
}

function group(techs: Technology[]): Group[] {
  const map = new Map<string, Group & { order: number }>();
  techs.forEach((t) => {
    const slug = t.category?.slug ?? "other";
    if (!map.has(slug)) map.set(slug, { slug, name: t.category?.name ?? "Other", order: t.category?.order ?? 99, items: [] });
    map.get(slug)!.items.push(t);
  });
  return [...map.values()].sort((a, b) => a.order - b.order);
}

/** Places n items on up to two concentric rings (percent coordinates around the centre). */
function orbit(n: number) {
  const inner = n <= 9 ? n : Math.ceil(n * 0.42);
  return Array.from({ length: n }, (_, i) => {
    const ring = i < inner ? 0 : 1;
    const count = ring === 0 ? inner : n - inner;
    const k = ring === 0 ? i : i - inner;
    const a = (k / count) * Math.PI * 2 - Math.PI / 2 + (ring ? Math.PI / count : 0);
    const rx = ring ? 44 : 27;
    const ry = ring ? 42 : 26;
    return { x: r2(50 + Math.cos(a) * rx), y: r2(50 + Math.sin(a) * ry), ring };
  });
}

/**
 * Technology constellation. The selected category is the hub; its technologies orbit it on one or two
 * rings with animated connections. Switching category re-forms the constellation.
 */
export function TechConstellation({ technologies }: { technologies: Technology[] }) {
  const groups = useMemo(() => group(technologies), [technologies]);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  if (!groups.length) return null;
  const g = groups[Math.min(active, groups.length - 1)];
  const pts = orbit(g.items.length);
  const hovered = g.items.find((t) => t.id === hover);

  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="tech-title">
      <div className="container-x">
        <div id="tech-title" className="mb-12">
          <SectionHeading eyebrow="Technology" title="Powered by the *right* technology." intro={`${technologies.length} technologies across ${groups.length} disciplines — chosen for the problem, not the trend.`} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div role="tablist" aria-label="Technology categories" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {groups.map((c, i) => (
              <button
                key={c.slug}
                role="tab"
                type="button"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-6 rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-300",
                  i === active ? "border-aqua/40 bg-aqua/[.06] text-ink" : "border-line text-mute hover:text-ink",
                )}
              >
                {c.name}
                <span className="text-xs text-dim tabular-nums">{c.items.length}</span>
              </button>
            ))}
          </div>

          {/* Constellation (desktop) */}
          <div className="relative hidden aspect-[16/10] lg:block" aria-hidden="true">
            <div className="bg-grid mask-radial absolute inset-0 opacity-50" />
            <div className="absolute top-1/2 left-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[.06]" />
            <div className="absolute top-1/2 left-1/2 h-[52%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.05]" />
            <AnimatePresence mode="wait">
              <motion.div key={g.slug} className="absolute inset-0" initial="hidden" animate="show" exit="hidden">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  {pts.map((p, i) => (
                    <motion.line
                      key={i}
                      x1={50}
                      y1={50}
                      x2={p.x}
                      y2={p.y}
                      vectorEffect="non-scaling-stroke"
                      stroke={hover === g.items[i].id ? "rgba(245,185,66,.8)" : p.ring ? "rgba(124,58,237,.35)" : "rgba(34,211,238,.45)"}
                      strokeWidth={hover === g.items[i].id ? 1.6 : 1}
                      strokeDasharray="3 5"
                      className="animate-dash"
                      variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: i * 0.03 } } }}
                    />
                  ))}
                </svg>
                <motion.span
                  className="absolute top-1/2 left-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua/70 p-3 text-center font-display text-xs font-semibold tracking-[0.14em] text-white uppercase shadow-[0_0_60px_rgba(124,58,237,.55)]"
                  variants={{ hidden: { scale: 0.4, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
                >
                  {g.name}
                </motion.span>
                {g.items.map((t, i) => (
                  <motion.span
                    key={t.id}
                    onMouseEnter={() => setHover(t.id)}
                    onMouseLeave={() => setHover(null)}
                    className={cn(
                      "pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap backdrop-blur transition-colors duration-300",
                      hover === t.id ? "border-gold/70 bg-gold/15 text-ink" : t.featured ? "border-aqua/40 bg-midnight/85 text-ink" : "border-line-hi bg-midnight/80 text-ink/80",
                    )}
                    style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }}
                    variants={{
                      hidden: { opacity: 0, scale: 0.5, left: "50%", top: "50%" },
                      show: { opacity: 1, scale: 1, left: `${pts[i].x}%`, top: `${pts[i].y}%`, transition: { duration: 0.7, delay: 0.1 + i * 0.035, ease: EASE } },
                    }}
                  >
                    {t.name}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
            {hovered?.description && (
              <p className="hairline absolute right-0 bottom-0 max-w-xs rounded-2xl bg-card/95 p-4 text-sm text-mute backdrop-blur">
                <span className="block font-medium text-ink">{hovered.name}</span>
                {hovered.description}
              </p>
            )}
          </div>

          {/* List (mobile/tablet + screen readers) */}
          <div className="lg:sr-only">
            <h3 className="sr-only">{g.name}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((t) => (
                <li key={t.id} className="hairline rounded-full bg-card/60 px-3.5 py-1.5 text-sm">{t.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
