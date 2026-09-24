"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { EASE } from "@/animations/variants";
import { CmsImage } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

/** Wide image that clip-reveals on entry and drifts with scroll (parallax). */
export function ImageBanner({ src, alt = "", className, priority }: { src: string; alt?: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(12% 6% 12% 6% round 2rem)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE }}
      className={cn("hairline relative aspect-[16/9] overflow-hidden rounded-[2rem] md:aspect-[21/8]", className)}
    >
      <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y }}>
        <CmsImage src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-midnight/10" />
    </motion.div>
  );
}
