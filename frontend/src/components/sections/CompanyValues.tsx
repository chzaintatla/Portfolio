"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { EASE } from "@/animations/variants";
import { CmsImage } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface CompanyValue {
  title: string;
  description?: string;
  icon?: string;
  image?: string;
}

/**
 * Company values as four tall columns. Each shows a large outline icon, a gradient number and the title;
 * hovering (or focusing / tapping) a column swaps it to a photo panel with the full description.
 * Content comes from Admin → Settings (`company_values`, `values_heading`, `values_intro`).
 */
export function CompanyValues({ values, heading, intro }: { values: CompanyValue[]; heading?: string; intro?: string }) {
  const [active, setActive] = useState<number | null>(null);
  if (!values.length) return null;

  return (
    <section className="relative py-24 md:py-32" aria-labelledby="values-title">
      <div className="container-x">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <div id="values-title">
            <SplitHeading text={heading || "Company values"} className="text-4xl leading-none font-semibold text-gradient sm:text-5xl lg:text-6xl" />
          </div>
          {intro && (
            <Reveal delay={0.15}>
              <p className="text-lg text-mute">{intro}</p>
            </Reveal>
          )}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0" onMouseLeave={() => setActive(null)}>
          {values.map((v, i) => {
            const on = active === i;
            return (
              <motion.li
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                className="relative"
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(on ? null : i)}
                  aria-expanded={on}
                  data-cursor="explore"
                  className="group relative flex h-[30rem] w-full flex-col overflow-hidden rounded-3xl text-left lg:h-[36rem] lg:rounded-none lg:first:rounded-l-3xl lg:last:rounded-r-3xl"
                >
                  {/* resting state: soft gradient rising from the bottom */}
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-violet/35 via-aqua/10 to-transparent" />
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(80%_60%_at_30%_100%,rgba(34,211,238,.28),transparent_70%)]" />
                  {i > 0 && <span aria-hidden="true" className="absolute inset-y-10 left-0 hidden w-px bg-line lg:block" />}

                  {/* hover state: photo panel */}
                  <AnimatePresence>
                    {on && v.image && (
                      <motion.span
                        key="photo"
                        initial={{ clipPath: "inset(100% 0 0 0)" }}
                        animate={{ clipPath: "inset(0% 0 0 0)" }}
                        exit={{ clipPath: "inset(0 0 100% 0)" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="absolute inset-0 z-10"
                      >
                        <motion.span className="absolute inset-0" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: EASE }}>
                          <CmsImage src={v.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        </motion.span>
                        <span className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20" />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span className="relative z-20 flex h-full flex-col p-7 lg:p-9">
                    <motion.span
                      animate={{ opacity: on ? 0 : 1, y: on ? -20 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="text-white/25"
                    >
                      <Icon name={v.icon} className="h-28 w-28 [stroke-width:1] transition-transform duration-700 group-hover:scale-105" />
                    </motion.span>

                    <motion.span layout className="mt-auto block" transition={{ duration: 0.5, ease: EASE }}>
                      <span className={cn("block font-display text-6xl font-bold tracking-tight transition-colors duration-500 lg:text-7xl", on ? "text-white" : "text-gradient")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-6 block font-display text-2xl leading-tight font-semibold tracking-tight lg:text-[1.9rem]">{v.title}</span>
                      <AnimatePresence initial={false}>
                        {on && v.description && (
                          <motion.span
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
                            className="block overflow-hidden"
                          >
                            <span className="mt-4 block text-[0.95rem] leading-relaxed text-ink/85">{v.description}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
