import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SplitHeading } from "@/components/ui/SplitHeading";
import { jsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

import { Backdrop } from "./home/Backdrop";

interface Crumb {
  label: string;
  href: string;
}

/** Hero for inner pages, with breadcrumbs (visible + BreadcrumbList structured data). */
export function PageHero({ eyebrow, title, intro, crumbs = [], children }: {
  eyebrow?: string; title: string; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode;
}) {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
  };
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <Backdrop particles={14} />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-dim">
            {trail.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
                {i === trail.length - 1 ? (
                  <span aria-current="page" className="text-mute">{c.label}</span>
                ) : (
                  <Link href={c.href} className="hover:text-ink">{c.label}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && (
          <Reveal>
            <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <SplitHeading as="h1" immediate text={title} className="max-w-5xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] font-bold tracking-[-0.04em]" />
        {intro && (
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-lg text-mute md:text-xl">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
