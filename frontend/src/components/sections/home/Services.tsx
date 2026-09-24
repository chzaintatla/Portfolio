"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EASE } from "@/animations/variants";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

/**
 * Services as large numbered rows. Desktop: hovering a row expands it, washes in a gradient,
 * spins the icon and reveals the description. Mobile: the same rows behave as an accordion.
 */
export function Services({ services }: { services: Service[] }) {
  const [active, setActive] = useState<number | null>(null);
  if (!services.length) return null;

  return (
    <section id="services" className="relative py-28 md:py-36" aria-labelledby="services-title">
      <div className="container-x">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div id="services-title">
            <SectionHeading eyebrow="Services" title="Everything you need to *build,* launch & grow." />
          </div>
          <Button href="/services" variant="outline" className="shrink-0">All services</Button>
        </div>

        <ul className="border-t border-line" onMouseLeave={() => setActive(null)}>
          {services.map((s, i) => {
            const open = active === i;
            const panelId = `svc-panel-${s.id}`;
            return (
              <li key={s.id} className="relative border-b border-line" onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}>
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(124,58,237,.16),rgba(34,211,238,.06)_55%,transparent)] bg-[length:200%_100%] animate-gradient-x"
                />
                <button
                  type="button"
                  className="relative flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActive(open ? null : i)}
                  data-cursor="explore"
                >
                  <span className="w-8 shrink-0 font-display text-sm text-dim tabular-nums md:w-14">{s.number ?? String(i + 1).padStart(2, "0")}</span>
                  <span className={cn(
                    "hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 md:flex",
                    open ? "rotate-[-8deg] border-aqua/50 bg-aqua/10" : "border-line",
                  )}>
                    <Icon name={s.icon} className={cn("h-5 w-5 transition-colors", open ? "text-aqua" : "text-mute")} />
                  </span>
                  <span className={cn(
                    "flex-1 font-display text-[1.45rem] leading-tight font-medium tracking-tight transition-all duration-500 md:text-4xl lg:text-5xl",
                    open ? "translate-x-2 text-ink" : "text-ink/80",
                  )}>
                    {s.title}
                  </span>
                  <Plus className={cn("h-5 w-5 shrink-0 text-mute transition-transform duration-500 md:hidden", open && "rotate-45 text-aqua")} aria-hidden="true" />
                  <ArrowRight className={cn("hidden h-6 w-6 shrink-0 transition-all duration-500 md:block", open ? "translate-x-0 -rotate-45 text-aqua" : "-translate-x-3 text-dim")} aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="relative overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 md:grid-cols-[3.5rem_3rem_1fr_1fr] md:gap-8 md:pb-10">
                        <span className="hidden md:block" />
                        <span className="hidden md:block" />
                        <p className="max-w-xl text-mute md:text-lg">{s.description}</p>
                        <div className="flex flex-col items-start gap-5">
                          {s.features.length > 0 && (
                            <ul className="flex flex-wrap gap-2">
                              {s.features.slice(0, 4).map((f) => (
                                <li key={f.title} className="hairline rounded-full px-3 py-1 text-xs text-mute">{f.title}</li>
                              ))}
                            </ul>
                          )}
                          <Link href={`/services/${s.slug}`} className="group inline-flex items-center gap-2 text-sm font-medium text-aqua">
                            Explore {s.title}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
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
