"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, Clock, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { EASE } from "@/animations/variants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ProcessStage } from "@/types";

// Node tints cycle through the brand palette.
const TINTS = [
  "from-violet/40 to-violet/5 text-violet-soft",
  "from-aqua/35 to-aqua/5 text-aqua",
  "from-gold/35 to-gold/5 text-gold",
];

/** Zig-zag positions (percent of the stage area): odd stages low, even stages high. */
function positions(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    x: n === 1 ? 50 : 8 + (i * 84) / (n - 1),
    y: i % 2 === 0 ? 68 : 26,
  }));
}

/** Smooth curve through all node centres, in a 1000×400 viewBox. */
function curve(pts: { x: number; y: number }[]) {
  const p = pts.map((q) => ({ x: q.x * 10, y: q.y * 4 }));
  let d = `M ${p[0].x - 60} ${p[0].y + 70} Q ${p[0].x - 30} ${p[0].y + 40} ${p[0].x} ${p[0].y}`;
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1];
    const b = p[i];
    const mx = (a.x + b.x) / 2;
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  const last = p[p.length - 1];
  d += ` Q ${last.x + 40} ${last.y - 20} ${Math.min(last.x + 90, 1000)} ${last.y - 75}`;
  return d;
}

function Detail({ stage }: { stage: ProcessStage }) {
  const groups = [
    { title: "Activities", items: stage.activities },
    { title: "Deliverables", items: stage.deliverables },
    { title: "Team", items: stage.team },
    { title: "Technology", items: stage.technologies },
  ].filter((g) => g.items.length);
  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_1.4fr]">
      <div>
        <p className="eyebrow !text-aqua">{stage.number} · {stage.stage}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">{stage.title}</h3>
        {stage.description && <p className="mt-3 text-mute">{stage.description}</p>}
        {stage.duration && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm">
            <Clock className="h-4 w-4 text-gold" aria-hidden="true" /> {stage.duration}
          </p>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <dt className="eyebrow mb-2 !text-[0.65rem]">{g.title}</dt>
            <dd>
              <ul className="space-y-1 text-sm text-ink/85">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aqua" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Delivery process as a journey: numbered circular stations on a dashed zig-zag path that draws in on
 * scroll, a spark travelling along it and a paper plane taking off at the end. Hover/click (or wait —
 * it auto-advances) to see each stage's activities, deliverables, team and technology.
 */
export function Process({ stages, heading = true }: { stages: ProcessStage[]; heading?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || stages.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % stages.length), 4200);
    return () => window.clearInterval(t);
  }, [inView, paused, stages.length]);

  if (!stages.length) return null;
  const pts = positions(stages.length);
  const path = curve(pts);
  const stage = stages[Math.min(active, stages.length - 1)];

  return (
    <section className="relative py-24 md:py-32" aria-labelledby="process-title">
      <div className="container-x">
        {heading && (
          <div id="process-title" className="mb-12 md:mb-16">
            <SectionHeading
              align="center"
              eyebrow="Delivery process"
              title="From first spark to *full* scale."
              intro="Feel free to join us at any point in your journey."
            />
          </div>
        )}

        <div
          ref={ref}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="hairline relative overflow-hidden rounded-[2rem] bg-card/50 p-6 md:p-10"
        >
          {/* soft pastel glows, echoing the brand gradient */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-violet/25 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-0 h-80 w-[28rem] rounded-full bg-gold/10 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-[32rem] rounded-full bg-aqua/15 blur-[140px]" />

          {/* ---------------- desktop journey ---------------- */}
          <div className="relative hidden aspect-[1000/430] lg:block">
            <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-0 h-[93%] w-full overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="proc-line" x1="0" x2="1">
                  <stop offset="0" stopColor="#7C3AED" />
                  <stop offset=".55" stopColor="#22D3EE" />
                  <stop offset="1" stopColor="#F5B942" />
                </linearGradient>
              </defs>
              {/* faint full track */}
              <path d={path} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" strokeDasharray="4 7" vectorEffect="non-scaling-stroke" />
              {/* coloured track draws in on scroll */}
              <motion.path
                d={path}
                fill="none"
                stroke="url(#proc-line)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              />
              {/* marching dashes over the drawn line */}
              <path d={path} fill="none" stroke="#080A12" strokeWidth="3" strokeDasharray="5 9" className="animate-dash" vectorEffect="non-scaling-stroke" />
              <circle r="5" fill="#F5B942" className="motion-reduce:hidden">
                <animateMotion dur="7s" repeatCount="indefinite" path={path} />
              </circle>
            </svg>

            {/* start marker */}
            <span aria-hidden="true" className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-aqua bg-midnight" style={{ left: `${pts[0].x - 6}%`, top: `${(pts[0].y + 17.5) * 0.93}%` }} />
            {/* paper plane */}
            <motion.span
              aria-hidden="true"
              className="absolute text-aqua"
              style={{ right: "0%", top: `${(pts[pts.length - 1].y - 19) * 0.93}%` }}
              animate={{ x: [0, 6, 0], y: [0, -8, 0], rotate: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Send className="h-11 w-11 drop-shadow-[0_0_18px_rgba(34,211,238,.6)]" strokeWidth={1.5} />
            </motion.span>

            <ol>
              {stages.map((s, i) => {
                const on = i === active;
                const low = i % 2 === 0;
                return (
                  <motion.li
                    key={s.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pts[i].x}%`, top: `${pts[i].y * 0.93}%` }}
                    initial={{ opacity: 0, scale: 0.6, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.28, ease: EASE }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      aria-label={`Stage ${s.number}: ${s.stage}`}
                      className="group flex flex-col items-center"
                    >
                      <span className="relative block">
                        {/* pulse ring on the active station */}
                        {on && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-aqua/40" />}
                        <motion.span
                          animate={{ scale: on ? 1.08 : 1, y: on ? -4 : 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className={cn(
                            "relative flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full border bg-gradient-to-br shadow-[0_18px_50px_-18px_rgba(0,0,0,.8)] backdrop-blur transition-colors duration-500",
                            TINTS[i % TINTS.length],
                            on ? "border-aqua/60 shadow-[0_0_45px_-8px_rgba(34,211,238,.55)]" : "border-line-hi",
                          )}
                        >
                          <span className="flex h-[5.75rem] w-[5.75rem] items-center justify-center rounded-full bg-night/90">
                            <Icon name={s.icon} className="h-9 w-9 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                          </span>
                        </motion.span>
                        <span className="absolute -top-1 -left-1 flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-midnight shadow-lg">
                          {Number(s.number) || i + 1}
                        </span>
                      </span>
                      <span className={cn("mt-4 font-display text-lg font-semibold tracking-tight transition-colors", on ? "text-ink" : "text-ink/70")}>
                        {s.stage.charAt(0) + s.stage.slice(1).toLowerCase()}
                      </span>
                      <AnimatePresence>
                        {on && low && (
                          <motion.span
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-1 max-w-[11rem] text-center text-xs text-mute"
                          >
                            {s.duration}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          {/* ---------------- mobile / tablet journey ---------------- */}
          <ol className="relative space-y-3 lg:hidden">
            <span aria-hidden="true" className="absolute top-8 bottom-8 left-[2.4rem] border-l-2 border-dashed border-aqua/30" />
            {stages.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.id} className="relative">
                  <button type="button" onClick={() => setActive(i)} aria-pressed={on} className="flex w-full items-center gap-4 text-left">
                    <span className={cn("relative flex h-[4.8rem] w-[4.8rem] shrink-0 items-center justify-center rounded-full border bg-gradient-to-br", TINTS[i % TINTS.length], on ? "border-aqua/60" : "border-line-hi")}>
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-night"><Icon name={s.icon} className="h-6 w-6" /></span>
                      <span className="absolute -top-1 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-midnight">{Number(s.number) || i + 1}</span>
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold">{s.stage.charAt(0) + s.stage.slice(1).toLowerCase()}</span>
                      <span className="block text-sm text-mute">{s.duration}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* ---------------- active stage detail ---------------- */}
          <div className="relative mt-8 border-t border-line pt-8" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Detail stage={stage} />
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {stages.map((s, i) => (
                  <span key={s.id} className={cn("h-1 rounded-full transition-all duration-500", i === active ? "w-10 bg-aqua" : "w-4 bg-line-hi")} />
                ))}
              </div>
              <Link href="/process" className="group inline-flex items-center gap-2 text-sm font-medium text-aqua">
                Know more about how we work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
