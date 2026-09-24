"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { EASE } from "@/animations/variants";
import { Button } from "@/components/ui/Button";
import { Eyebrow, SplitHeading } from "@/components/ui/SplitHeading";
import { useIntroDelay } from "@/hooks/useIntroDelay";
import type { SiteSettings } from "@/types";

import { Backdrop } from "./Backdrop";

const Ecosystem = dynamic(() => import("./Ecosystem").then((m) => m.Ecosystem), { ssr: false });

const DEFAULT_HEADLINE = "Building Digital Systems That Move Businesses Forward.";

/** Highlights "digital" in the CMS headline unless the editor already marked a word with *asterisks*. */
function withHighlight(text: string) {
  return text.includes("*") ? text : text.replace(/\b(digital)\b/i, "*$1*");
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const headline = withHighlight(settings.hero_headline || DEFAULT_HEADLINE);
  const d = useIntroDelay();
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 lg:pt-24" aria-labelledby="hero-title">
      <Backdrop />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {settings.hero_eyebrow && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: d, ease: EASE }}>
              <Eyebrow className="mb-8">{settings.hero_eyebrow}</Eyebrow>
            </motion.div>
          )}
          <div id="hero-title">
            <SplitHeading
              as="h1"
              immediate
              delay={d + 0.15}
              text={headline.toUpperCase()}
              className="text-[clamp(2.6rem,5.1vw,5.9rem)] leading-[0.94] font-bold tracking-[-0.045em]"
            />
          </div>
          {settings.hero_subtext && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: d + 0.7, ease: EASE }}
              className="mt-8 max-w-xl text-lg text-mute md:text-xl"
            >
              {settings.hero_subtext}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: d + 0.85, ease: EASE }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button href="/contact" trackLabel="hero_start_project">Start a Project</Button>
            <Button href="/work" variant="outline" trackLabel="hero_explore_work">Explore Our Work</Button>
          </motion.div>
        </div>
        <motion.div
          className="relative mx-auto w-full max-w-[560px] lg:col-span-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: d + 0.3, ease: EASE }}
        >
          <div className="aspect-square">
            <Ecosystem />
          </div>
        </motion.div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight to-transparent" />
    </section>
  );
}
