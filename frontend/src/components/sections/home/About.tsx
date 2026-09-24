"use client";

import { motion } from "framer-motion";
import { Blocks, Link2, Sprout, Workflow } from "lucide-react";
import { useState } from "react";

import { EASE } from "@/animations/variants";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";

const PRINCIPLES = [
  { title: "Build", icon: Blocks, text: "Products engineered for real users — clean architecture, tested code, and documentation your team can own." },
  { title: "Automate", icon: Workflow, text: "Repetitive work moved out of inboxes and spreadsheets into reliable, monitored workflows." },
  { title: "Integrate", icon: Link2, text: "CRMs, payments, messaging and data connected so information flows without copy-paste." },
  { title: "Grow", icon: Sprout, text: "Marketing, analytics and continuous improvement that turn a launch into momentum." },
];

export function About({ heading, body }: { heading?: string; body?: string }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="about" className="relative py-28 md:py-36" aria-labelledby="about-title">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="mb-6">Who we are</Eyebrow>
            </Reveal>
            <div id="about-title">
              <SplitHeading
                text={heading || "Technology should solve problems, not create them."}
                className="text-[2.4rem] leading-[1] font-semibold sm:text-6xl lg:text-[5rem]"
              />
            </div>
          </div>
          {body && (
            <Reveal className="lg:col-span-5 lg:pt-16" delay={0.2}>
              <p className="text-lg leading-relaxed text-mute md:text-xl">{body}</p>
            </Reveal>
          )}
        </div>

        <div className="mt-20 flex flex-col gap-3 lg:h-[340px] lg:flex-row">
          {PRINCIPLES.map((p, i) => {
            const active = open === i;
            return (
              <motion.button
                key={p.title}
                type="button"
                layout
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                aria-expanded={active}
                transition={{ layout: { duration: 0.6, ease: EASE } }}
                className={cn(
                  "hairline relative flex overflow-hidden rounded-3xl p-7 text-left transition-colors duration-500",
                  active ? "bg-card lg:flex-[2.4]" : "bg-night/60 lg:flex-1",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="principle-glow"
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(600px_circle_at_0%_100%,rgba(124,58,237,.28),transparent_60%)]"
                  />
                )}
                <div className="relative flex w-full flex-col justify-between gap-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dim tabular-nums">0{i + 1}</span>
                    <p.icon className={cn("h-7 w-7 transition-all duration-500", active ? "rotate-0 text-aqua" : "-rotate-12 text-mute")} aria-hidden="true" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{p.title}</h3>
                    <motion.p
                      initial={false}
                      animate={{ opacity: active ? 1 : 0, height: active ? "auto" : 0, marginTop: active ? 16 : 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="max-w-md overflow-hidden text-mute"
                    >
                      {p.text}
                    </motion.p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
