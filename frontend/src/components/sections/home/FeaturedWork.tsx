"use client";

import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger } from "@/animations/gsap";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProjectCard as Project } from "@/types";

import { ProjectCard } from "../ProjectCard";

/**
 * Featured work. Desktop: the section pins and the cards travel horizontally with scroll, with a
 * progress bar and a gentle depth effect. Mobile / reduced motion: a vertical stack.
 */
export function FeaturedWork({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const row = track.current;
    if (!el || !row) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, row.scrollWidth - window.innerWidth + 120);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.7,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(row, { x: () => -distance(), ease: "none" }, 0);
      if (bar.current) tl.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      gsap.utils.toArray<HTMLElement>(row.children).forEach((card) => {
        gsap.fromTo(card, { opacity: 0.35, scale: 0.94 }, {
          opacity: 1, scale: 1, ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tl, start: "left 95%", end: "left 55%", scrub: true },
        });
      });
      return () => tl.scrollTrigger?.kill();
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [projects.length]);

  if (!projects.length) return null;

  return (
    <section ref={section} className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-16 lg:pb-0" aria-labelledby="work-title">
      <div className="container-x mb-12 flex flex-col justify-between gap-6 lg:mb-10 lg:flex-row lg:items-end">
        <div id="work-title">
          <SectionHeading eyebrow="Featured work" title="Products we've *built.*" />
        </div>
        <Button href="/work" variant="outline" className="shrink-0">All projects</Button>
      </div>
      <div ref={track} className="flex flex-col gap-6 px-5 md:px-8 lg:w-max lg:flex-row lg:px-12">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} large className="w-full lg:w-[min(38vw,560px)] lg:shrink-0" />
        ))}
      </div>
      <div className="container-x mt-10 hidden lg:block" aria-hidden="true">
        <div className="h-px w-full bg-line">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-gradient-to-r from-violet via-aqua to-gold" />
        </div>
      </div>
    </section>
  );
}
