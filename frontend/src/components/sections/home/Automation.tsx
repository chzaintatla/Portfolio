import { BarChart3, Bot, Database, MessageCircle, Repeat, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Service } from "@/types";

import { Backdrop } from "./Backdrop";

// The illustrated pipeline is part of the design; the capability list comes from the CMS.
const FLOW = [
  { label: "New Lead", note: "Web form · Ads · WhatsApp", icon: UserPlus },
  { label: "AI Qualification", note: "Intent, budget & fit scored", icon: Bot },
  { label: "CRM", note: "Record created & enriched", icon: Database },
  { label: "WhatsApp", note: "Instant personalised reply", icon: MessageCircle },
  { label: "Sales Team", note: "Assigned by territory & score", icon: Users },
  { label: "Follow-up", note: "Sequenced reminders", icon: Repeat },
  { label: "Analytics", note: "Pipeline & conversion reporting", icon: BarChart3 },
];
const STEP = 1.1; // seconds each step stays lit
const CYCLE = FLOW.length * STEP;

export function Automation({ services }: { services: Service[] }) {
  const capabilities = services.flatMap((s) => s.features.map((f) => f.title));
  const primary = services[0];
  return (
    <section className="relative isolate overflow-hidden bg-night py-28 md:py-36" aria-labelledby="auto-title">
      <Backdrop tone="aqua" particles={14} />
      <div className="container-x relative grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <div id="auto-title">
            <SectionHeading eyebrow="AI & Automation" title="Automate the work. *Amplify* the business." intro="AI agents and automated workflows that capture, qualify, route and follow up — so your team spends its time on the conversations that matter." />
          </div>
          {capabilities.length > 0 && (
            <RevealGroup as="ul" className="mt-10 flex flex-wrap gap-2" step={0.04}>
              {Array.from(new Set(capabilities)).slice(0, 14).map((c) => (
                <RevealItem as="li" key={c} className="hairline rounded-full bg-white/[.03] px-3.5 py-1.5 text-sm text-ink/80 transition-colors hover:border-aqua/50 hover:text-ink">
                  {c}
                </RevealItem>
              ))}
            </RevealGroup>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            {services.map((s, i) => (
              <Button key={s.id} href={`/services/${s.slug}`} variant={i === 0 ? "primary" : "outline"}>
                {s.title}
              </Button>
            ))}
            {!primary && <Button href="/contact">Discuss automation</Button>}
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-md" aria-label="Example automated lead workflow">
          <div aria-hidden="true" className="absolute top-7 bottom-7 left-[27px] w-px bg-gradient-to-b from-violet/60 via-aqua/40 to-gold/50" />
          <span
            aria-hidden="true"
            className="absolute left-[23px] h-[9px] w-[9px] rounded-full bg-gold shadow-[0_0_18px_4px_rgba(245,185,66,.7)] motion-reduce:hidden"
            style={{ animation: `flow-packet ${CYCLE}s linear infinite` }}
          />
          <ol className="relative space-y-3">
            {FLOW.map(({ label, note, icon: IconCmp }, i) => (
              <li key={label} className="relative flex items-center gap-4">
                <span
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-card"
                  style={{ animation: `flow-node ${CYCLE}s ${i * STEP}s infinite` }}
                >
                  <IconCmp className="h-5 w-5 text-aqua" aria-hidden="true" strokeWidth={1.6} />
                </span>
                <div className="hairline flex-1 rounded-2xl bg-card/70 px-5 py-3 backdrop-blur" style={{ animation: `flow-card ${CYCLE}s ${i * STEP}s infinite` }}>
                  <p className="font-display text-[0.95rem] font-medium">{label}</p>
                  <p className="text-xs text-mute">{note}</p>
                </div>
              </li>
            ))}
          </ol>
          <figcaption className="mt-6 text-center text-xs text-dim">Illustrative workflow</figcaption>
          <style>{`
            @keyframes flow-packet { from { top: 24px } to { top: calc(100% - 60px) } }
            @keyframes flow-node {
              0% { border-color: rgba(34,211,238,.9); box-shadow: 0 0 28px -4px rgba(34,211,238,.7); }
              ${((STEP / CYCLE) * 100).toFixed(1)}% { border-color: rgba(34,211,238,.9); box-shadow: 0 0 28px -4px rgba(34,211,238,.7); }
              ${((STEP / CYCLE) * 100 + 4).toFixed(1)}%, 100% { border-color: rgba(255,255,255,.08); box-shadow: none; }
            }
            @keyframes flow-card {
              0%, ${((STEP / CYCLE) * 100).toFixed(1)}% { transform: translateX(6px); background-color: rgba(22,27,43,.95); }
              ${((STEP / CYCLE) * 100 + 4).toFixed(1)}%, 100% { transform: translateX(0); }
            }
          `}</style>
        </figure>
      </div>
    </section>
  );
}
