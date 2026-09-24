import { Bot, Eye, Handshake, Layers, Target, Zap } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const REASONS = [
  { title: "Business First", icon: Target, text: "We start with the outcome you need, then choose the technology — never the other way round." },
  { title: "Modern Technology", icon: Zap, text: "Proven, current stacks that are fast today and still easy to hire for tomorrow." },
  { title: "Transparent Delivery", icon: Eye, text: "Fortnightly demos, shared boards and plain-language updates. No black boxes." },
  { title: "Scalable Architecture", icon: Layers, text: "Clean boundaries, typed APIs and tested code, so growth doesn't mean a rewrite." },
  { title: "AI Ready", icon: Bot, text: "Data and workflows structured so AI features can be added when they create real value." },
  { title: "Long-Term Partnership", icon: Handshake, text: "Support, maintenance and growth after launch from the team that built it." },
];

export function WhySparkwave() {
  return (
    <section className="relative py-28 md:py-36" aria-labelledby="why-title">
      <div className="container-x">
        <div id="why-title" className="mb-16">
          <SectionHeading eyebrow="Why SparkWave" title="Technology without the *complexity.*" />
        </div>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
          {REASONS.map(({ title, icon: IconCmp, text }, i) => (
            <RevealItem key={title} className={cn(i === 1 && "lg:translate-y-10", i === 4 && "lg:translate-y-10")}>
              <TiltCard className="hairline h-full overflow-hidden rounded-3xl bg-card/60 p-8 transition-colors duration-500 hover:border-line-hi" cursor="default">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet/25 to-aqua/10 transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
                      <IconCmp className="h-5 w-5 text-ink" aria-hidden="true" strokeWidth={1.6} />
                    </span>
                    <span className="font-display text-5xl font-semibold text-white/[.05] transition-colors duration-500 group-hover:text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 text-mute">{text}</p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
