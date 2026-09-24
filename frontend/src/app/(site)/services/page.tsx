import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CmsImage, EmptyState } from "@/components/ui/misc";
import { api } from "@/lib/api";
import { Icon } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/services", {
    title: "Services",
    description: "Custom software, web and mobile development, AI, automation, design, QA, cloud and digital marketing.",
  });

const GROUPS: Record<string, string> = {
  engineering: "Product engineering",
  ai: "AI & automation",
  growth: "Digital growth",
};

export default async function ServicesPage() {
  const [services, site] = await Promise.all([api.services(), api.site()]);
  const groups = Object.entries(GROUPS)
    .map(([key, label]) => ({ key, label, items: services.filter((s) => s.group === key) }))
    .filter((g) => g.items.length);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything you need to *build,* launch & grow."
        intro="One partner across product engineering, AI and automation, and digital growth — so strategy, build and promotion pull in the same direction."
        crumbs={[{ label: "Services", href: "/services" }]}
      />
      <div className="container-x space-y-24 pb-24">
        {!groups.length && <EmptyState title="Services are being updated">Please check back shortly.</EmptyState>}
        {groups.map((g) => (
          <section key={g.key} aria-labelledby={`g-${g.key}`}>
            <h2 id={`g-${g.key}`} className="eyebrow mb-8">{g.label}</h2>
            <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" step={0.06}>
              {g.items.map((s) => (
                <RevealItem key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    data-cursor="explore"
                    className="group hairline relative flex h-full flex-col overflow-hidden rounded-3xl bg-card/60 p-7 transition-colors duration-500 hover:border-line-hi hover:bg-card"
                  >
                    {s.hero_image && (
                      <span className="relative -mx-7 -mt-7 mb-6 block aspect-[16/8] overflow-hidden">
                        <CmsImage src={s.hero_image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-spark group-hover:scale-110" />
                        <span className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      </span>
                    )}
                    <span aria-hidden="true" className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-violet/0 blur-3xl transition-colors duration-700 group-hover:bg-violet/25" />
                    <div className="relative flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[.04] transition-transform duration-500 group-hover:-rotate-6">
                        <Icon name={s.icon} className="h-5 w-5 text-aqua" />
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-dim transition-all duration-500 group-hover:rotate-45 group-hover:text-aqua" aria-hidden="true" />
                    </div>
                    <h3 className="relative mt-6 font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                    {s.tagline && <p className="relative mt-2 text-sm text-ink/80">{s.tagline}</p>}
                    {s.description && <p className="relative mt-3 text-sm text-mute">{s.description}</p>}
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        ))}
      </div>
      <FinalCTA settings={site.settings} />
    </>
  );
}
