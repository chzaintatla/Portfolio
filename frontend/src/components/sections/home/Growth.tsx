"use client";

import { motion } from "framer-motion";
import { Eye, Heart, MousePointerClick, UserPlus } from "lucide-react";

import { EASE } from "@/animations/variants";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Service } from "@/types";

const METRICS = [
  { label: "Reach", icon: Eye, path: "M0 34 C 10 30, 18 32, 28 24 S 46 20, 56 14 S 74 10, 100 4" },
  { label: "Engagement", icon: Heart, path: "M0 30 C 12 32, 20 22, 30 24 S 48 14, 60 18 S 80 8, 100 8" },
  { label: "Leads", icon: UserPlus, path: "M0 36 C 14 34, 22 30, 34 28 S 52 22, 64 18 S 84 12, 100 10" },
  { label: "Conversions", icon: MousePointerClick, path: "M0 36 C 16 36, 26 32, 38 30 S 58 24, 70 20 S 88 14, 100 12" },
];
const BARS = [28, 40, 34, 52, 46, 60, 58, 72, 66, 84, 78, 92];

/** Digital growth services + an animated, clearly-labelled illustrative dashboard (no real figures). */
export function Growth({ services }: { services: Service[] }) {
  const items = Array.from(new Set(services.flatMap((s) => [s.title, ...s.features.map((f) => f.title)])));
  return (
    <section className="relative overflow-hidden bg-night py-28 md:py-36" aria-labelledby="growth-title">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-[40rem] w-[40rem] rounded-full bg-gold/[.07] blur-[160px]" />
      <div className="container-x relative grid gap-16 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
            style={{ transformPerspective: 1200 }}
            className="hairline rounded-[1.75rem] bg-card/80 p-5 shadow-2xl shadow-black/50 md:p-7"
            aria-label="Illustrative growth dashboard"
            role="img"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-aqua animate-pulse-soft" />
                <span className="text-sm font-medium">Growth overview</span>
              </div>
              <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-[0.68rem] text-gold">Illustrative</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {METRICS.map(({ label, icon: IconCmp, path }, i) => (
                <div key={label} className="rounded-2xl bg-white/[.03] p-4">
                  <div className="flex items-center gap-2 text-xs text-mute">
                    <IconCmp className="h-3.5 w-3.5 text-aqua" aria-hidden="true" /> {label}
                  </div>
                  <svg viewBox="0 0 100 40" className="mt-3 h-12 w-full overflow-visible" aria-hidden="true">
                    <defs>
                      <linearGradient id={`gf${i}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor={i % 2 ? "#22D3EE" : "#7C3AED"} stopOpacity=".35" />
                        <stop offset="1" stopColor={i % 2 ? "#22D3EE" : "#7C3AED"} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={`${path} L100 40 L0 40 Z`}
                      fill={`url(#gf${i})`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                    />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={i % 2 ? "#22D3EE" : "#A78BFA"}
                      strokeWidth="1.6"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 1.4, ease: EASE }}
                    />
                  </svg>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-white/[.03] p-4">
              <p className="mb-4 text-xs text-mute">Campaign performance by week</p>
              <div className="flex h-28 items-end gap-1.5" aria-hidden="true">
                {BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-violet/60 to-aqua/80"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.8, ease: EASE }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          <p className="mt-4 text-center text-xs text-dim">Conceptual visual — not client data.</p>
        </div>

        <div className="order-1 lg:order-2">
          <div id="growth-title">
            <SectionHeading eyebrow="Digital growth" title="Build your product. Build your *presence.*" intro="Social media, SEO and paid campaigns run by the same team that understands your product — measured by leads and conversions, not vanity metrics." />
          </div>
          {items.length > 0 && (
            <RevealGroup as="ul" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3" step={0.04}>
              {items.slice(0, 12).map((it) => (
                <RevealItem as="li" key={it} className="flex items-center gap-2 text-sm text-ink/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {it}
                </RevealItem>
              ))}
            </RevealGroup>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            {services.slice(0, 2).map((s, i) => (
              <Button key={s.id} href={`/services/${s.slug}`} variant={i ? "outline" : "primary"}>{s.title}</Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
