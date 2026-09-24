import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { SiteSettings } from "@/types";

import { Backdrop } from "./home/Backdrop";

export function FinalCTA({ settings }: { settings: SiteSettings }) {
  const headline = settings.cta_headline || "Let's turn your next idea into reality.";
  const withHighlight = headline.includes("*") ? headline : headline.replace(/\b(reality)\b/i, "*$1*");
  const booking = settings.booking_url;
  return (
    <section className="relative isolate overflow-hidden py-32 md:py-44" aria-labelledby="cta-title">
      <Backdrop particles={30} />
      {/* spark lines */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 600">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M-50 ${380 + i * 40} C 300 ${300 + i * 30}, 520 ${520 - i * 40}, 760 ${420 - i * 10} S 1200 ${260 + i * 50}, 1500 ${320 + i * 30}`}
            fill="none"
            stroke={["#7C3AED", "#22D3EE", "#F5B942"][i]}
            strokeOpacity={0.35 - i * 0.08}
            strokeWidth="1.2"
            strokeDasharray="6 10"
            className="animate-dash"
            style={{ animationDuration: `${3 + i}s` }}
          />
        ))}
      </svg>
      <div className="container-x relative text-center">
        <div id="cta-title">
          <SplitHeading
            text={withHighlight.toUpperCase()}
            className="mx-auto max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.04em]"
          />
        </div>
        {settings.cta_subtext && (
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-xl text-lg text-mute md:text-xl">{settings.cta_subtext}</p>
          </Reveal>
        )}
        <Reveal delay={0.35} className="mt-12 flex flex-wrap justify-center gap-3">
          <Button href="/contact" trackLabel="cta_start_project">Start a Project</Button>
          <Button
            href={booking || "/contact?type=consultation"}
            external={!!booking}
            variant="outline"
            trackLabel="cta_book_consultation"
          >
            Book a Consultation
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
