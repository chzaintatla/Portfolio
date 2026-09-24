"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger } from "@/animations/gsap";
import { CmsImage } from "@/components/ui/misc";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/lib/icons";
import type { Industry } from "@/types";

/**
 * Industries as a horizontal track. On desktop the section pins and vertical scroll drives the track
 * (GSAP). On touch / small screens / reduced motion it's a native swipeable row.
 */
export function Industries({ industries }: { industries: Industry[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = section.current;
    const row = track.current;
    if (!el || !row) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => row.scrollWidth - window.innerWidth + 96;
      const tween = gsap.to(row, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [industries.length]);

  if (!industries.length) return null;

  return (
    <section ref={section} className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="industries-title">
      <div className="container-x mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div id="industries-title">
          <SectionHeading eyebrow="Industries" title="Built for different industries. Designed around *real* problems." />
        </div>
        <Link href="/industries" className="group inline-flex shrink-0 items-center gap-2 text-sm text-mute hover:text-ink">
          All industries <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
      </div>

      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:px-12"
      >
        {industries.map((ind, i) => (
          <li key={ind.id} className="w-[82vw] shrink-0 snap-start sm:w-[380px]">
            <Link
              href={`/industries/${ind.slug}`}
              data-cursor="explore"
              className="group hairline relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-3xl bg-card/70 p-7 transition-colors duration-500 hover:border-line-hi hover:bg-card"
            >
              {ind.image && (
                <span aria-hidden="true" className="absolute inset-0">
                  <CmsImage src={ind.image} alt="" fill sizes="380px" className="object-cover opacity-25 transition-all duration-[1.2s] ease-spark group-hover:scale-110 group-hover:opacity-40" />
                  <span className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/30" />
                </span>
              )}
              <span aria-hidden="true" className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-violet/0 blur-3xl transition-colors duration-700 group-hover:bg-violet/30" />
              <div className="relative flex items-start justify-between">
                <span className="hairline flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[.03] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={ind.icon} className="h-5 w-5 text-aqua" />
                </span>
                <span className="text-xs text-dim tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="relative mt-10 font-display text-2xl font-semibold tracking-tight">{ind.name}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-mute">{ind.description}</p>
              {ind.solutions.length > 0 && (
                <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
                  {ind.solutions.slice(0, 4).map((s) => (
                    <li key={s} className="rounded-full bg-white/[.04] px-2.5 py-1 text-[0.72rem] text-mute">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
