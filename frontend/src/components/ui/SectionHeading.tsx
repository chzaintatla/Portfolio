import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";
import { Eyebrow, SplitHeading } from "./SplitHeading";

export function SectionHeading({ eyebrow, title, intro, align = "left", className, children, as = "h2" }: {
  eyebrow?: string; title: string; intro?: ReactNode; align?: "left" | "center"; className?: string;
  children?: ReactNode; as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow className={cn("mb-6", align === "center" && "justify-center")}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitHeading
        as={as}
        text={title}
        className="text-[2.35rem] leading-[1.02] font-semibold sm:text-5xl lg:text-[4.25rem]"
      />
      {intro && (
        <Reveal delay={0.15}>
          <p className={cn("mt-6 max-w-2xl text-lg text-mute md:text-xl", align === "center" && "mx-auto")}>{intro}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
