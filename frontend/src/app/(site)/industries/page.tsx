import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { CmsImage, EmptyState } from "@/components/ui/misc";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { api } from "@/lib/api";
import { Icon } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/industries", { title: "Industries", description: "Digital systems designed around the real problems of different industries." });

export default async function IndustriesPage() {
  const [industries, site] = await Promise.all([api.industries(), api.site()]);
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built for different industries. Designed around *real* problems."
        intro="Every sector has its own workflows, regulations and customers. We start there — then choose the technology."
        crumbs={[{ label: "Industries", href: "/industries" }]}
      />
      <section className="container-x pb-28">
        {!industries.length && <EmptyState title="Industries coming soon" />}
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
          {industries.map((ind) => (
            <RevealItem key={ind.id}>
              <Link href={`/industries/${ind.slug}`} data-cursor="explore" className="group hairline flex h-full flex-col overflow-hidden rounded-3xl bg-card/60 p-7 transition-colors duration-500 hover:border-line-hi hover:bg-card">
                {ind.image && (
                  <span className="relative -mx-7 -mt-7 mb-6 block aspect-[16/9] overflow-hidden">
                    <CmsImage src={ind.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-spark group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[.04] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={ind.icon} className="h-5 w-5 text-aqua" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-dim transition-all group-hover:rotate-45 group-hover:text-aqua" aria-hidden="true" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">{ind.name}</h2>
                <p className="mt-3 text-sm text-mute">{ind.description}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {ind.solutions.map((s) => <li key={s} className="rounded-full bg-white/[.04] px-2.5 py-1 text-[0.72rem] text-mute">{s}</li>)}
                </ul>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <FinalCTA settings={site.settings} />
    </>
  );
}
