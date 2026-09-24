import { ArrowUpRight } from "lucide-react";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { TechConstellation } from "@/components/sections/home/TechConstellation";
import { PageHero } from "@/components/sections/PageHero";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import type { Technology } from "@/types";

export const generateMetadata = () =>
  pageMetadata("/technologies", { title: "Technologies", description: "The frameworks, platforms and AI tools we use to build reliable digital systems." });

export default async function TechnologiesPage() {
  const [techs, site] = await Promise.all([api.technologies(), api.site()]);
  const groups = techs.reduce<Record<string, Technology[]>>((acc, t) => {
    const k = t.category?.name ?? "Other";
    (acc[k] ||= []).push(t);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Technologies"
        title="Powered by the *right* technology."
        intro="Proven tools, chosen per project. Here's what our team works with most."
        crumbs={[{ label: "Technologies", href: "/technologies" }]}
      />
      <TechConstellation technologies={techs} />
      <section className="container-x space-y-14 pb-28">
        {Object.entries(groups).map(([cat, items]) => (
          <div key={cat} className="grid gap-6 border-t border-line pt-10 md:grid-cols-[240px_1fr]">
            <h2 className="eyebrow">{cat}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <li key={t.id} className="hairline rounded-2xl bg-card/60 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t.name}</h3>
                    {t.website && (
                      <a href={t.website} target="_blank" rel="noopener noreferrer" className="text-dim hover:text-aqua" aria-label={`${t.name} website`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {t.description && <p className="mt-2 text-sm text-mute">{t.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <FinalCTA settings={site.settings} />
    </>
  );
}
