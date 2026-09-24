import { BrainCircuit, Code2, Globe, Smartphone, TrendingUp, Workflow } from "lucide-react";

import { Counter } from "@/components/ui/Counter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Stat } from "@/types";

const CAPABILITIES = [
  { label: "Software Development", icon: Code2 },
  { label: "AI Solutions", icon: BrainCircuit },
  { label: "Mobile Apps", icon: Smartphone },
  { label: "Web Platforms", icon: Globe },
  { label: "Automation", icon: Workflow },
  { label: "Digital Growth", icon: TrendingUp },
];

/**
 * Trust strip right after the hero. Stats are only shown when the admin has entered them
 * (Admin → Settings → stats); nothing is invented.
 */
export function Capabilities({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative border-y border-line bg-night/60 py-20 md:py-24" aria-labelledby="cap-title">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-end">
          <SplitHeading
            text="Technology built around *your* business."
            className="max-w-md text-3xl leading-[1.05] font-semibold md:text-[2.6rem]"
          />
          <RevealGroup as="ul" className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3" step={0.1}>
            {CAPABILITIES.map(({ label, icon: Icon }, i) => (
              <RevealItem as="li" key={label} className="group relative flex items-center gap-3 bg-midnight px-5 py-6 transition-colors duration-500 hover:bg-card">
                <span className="text-[0.7rem] text-dim tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <Icon className="h-5 w-5 text-aqua transition-transform duration-500 group-hover:rotate-12" aria-hidden="true" strokeWidth={1.6} />
                <span className="text-sm font-medium md:text-base">{label}</span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-violet via-aqua to-gold transition-transform duration-700 group-hover:scale-x-100" aria-hidden="true" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {stats.length > 0 && (
          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-12 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-sm text-mute">{s.label}</dt>
                <dd className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
                  <Counter value={s.value} className="text-gradient" />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
