import { Check } from "lucide-react";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { EngagementModel } from "@/types";

export function Engagement({ models }: { models: EngagementModel[] }) {
  if (!models.length) return null;
  return (
    <section className="relative py-28 md:py-36" aria-labelledby="engage-title">
      <div className="container-x">
        <div id="engage-title" className="mb-16">
          <SectionHeading eyebrow="Engagement models" title="Flexible ways to work *together.*" />
        </div>
        <RevealGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" step={0.08}>
          {models.map((m, i) => (
            <RevealItem key={m.id}>
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1.5",
                  m.highlighted ? "border-violet/50 bg-gradient-to-b from-violet/15 to-card" : "border-line bg-card/60 hover:border-line-hi",
                )}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-violet via-aqua to-gold transition-transform duration-700 group-hover:scale-x-100" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dim tabular-nums">0{i + 1}</span>
                  {m.highlighted && <span className="rounded-full bg-violet/25 px-2.5 py-0.5 text-[0.7rem] text-violet-soft">Most flexible</span>}
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">{m.title}</h3>
                {m.summary && <p className="mt-3 text-sm text-mute">{m.summary}</p>}

                {m.best_for.length > 0 && (
                  <div className="mt-6">
                    <p className="eyebrow mb-2 !text-[0.65rem]">Best for</p>
                    <ul className="space-y-1 text-sm text-ink/85">
                      {m.best_for.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                )}
                {m.included.length > 0 && (
                  <div className="mt-6">
                    <p className="eyebrow mb-2 !text-[0.65rem]">What&apos;s included</p>
                    <ul className="space-y-1.5 text-sm text-mute">
                      {m.included.map((b) => (
                        <li key={b} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.model && <p className="mt-6 border-t border-line pt-4 text-xs text-dim">{m.model}</p>}
                <Link
                  href={`/contact?model=${encodeURIComponent(m.slug)}`}
                  className={cn(
                    "mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors",
                    m.highlighted ? "bg-ink text-midnight hover:bg-white" : "border border-line-hi hover:border-aqua/60",
                  )}
                >
                  {m.cta_label}
                </Link>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
