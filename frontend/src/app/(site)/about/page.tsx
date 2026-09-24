import { Code2, Link2, Mail } from "lucide-react";

import { type CompanyValue, CompanyValues } from "@/components/sections/CompanyValues";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { About } from "@/components/sections/home/About";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { WhySparkwave } from "@/components/sections/home/WhySparkwave";
import { PageHero } from "@/components/sections/PageHero";
import { CmsImage } from "@/components/ui/misc";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/about", { title: "About SparkWave Digital Systems", description: "A digital product, AI, automation and growth partner for modern businesses." });

export default async function AboutPage() {
  const [site, team] = await Promise.all([api.site(), api.team()]);
  const s = site.settings;
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Building digital systems that move *businesses* forward."
        intro={s.company_description}
        crumbs={[{ label: "About", href: "/about" }]}
      />
      <Capabilities stats={Array.isArray(s.stats) ? s.stats : []} />
      <About heading={s.about_heading} body={s.about_body} />
      <CompanyValues values={Array.isArray(s.company_values) ? (s.company_values as CompanyValue[]) : []} heading={s.values_heading as string} intro={s.values_intro as string} />
      <WhySparkwave />
      {team.length > 0 && (
        <section className="container-x py-24" aria-labelledby="team-h">
          <div id="team-h" className="mb-12"><SectionHeading eyebrow="Team" title="The people behind the *work.*" /></div>
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <RevealItem key={m.id} className="group">
                <div className="hairline relative aspect-[4/5] overflow-hidden rounded-3xl bg-card">
                  {m.photo ? (
                    <CmsImage src={m.photo} alt={m.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  ) : (
                    <span className="flex h-full items-center justify-center font-display text-6xl text-white/10">{m.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{m.name}</h3>
                <p className="text-sm text-mute">{m.position}</p>
                {m.bio && <p className="mt-2 text-sm text-mute">{m.bio}</p>}
                <div className="mt-3 flex gap-3 text-dim">
                  {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="hover:text-aqua"><Link2 className="h-4 w-4" /></a>}
                  {m.github && <a href={m.github} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on GitHub`} className="hover:text-aqua"><Code2 className="h-4 w-4" /></a>}
                  {m.email && <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`} className="hover:text-aqua"><Mail className="h-4 w-4" /></a>}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}
      <FinalCTA settings={s} />
    </>
  );
}
