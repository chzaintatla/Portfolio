import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { ImageBanner } from "@/components/sections/ImageBanner";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { api } from "@/lib/api";
import { recordMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await api.industries()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ind = await api.industry(slug);
  if (!ind) return { title: "Industry not found" };
  return recordMetadata(`/industries/${slug}`, ind, { title: `Digital solutions for ${ind.name}`, description: ind.description });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const [ind, projects, site] = await Promise.all([api.industry(slug), api.projects(), api.site()]);
  if (!ind) notFound();
  const work = projects.filter((p) => p.industry?.toLowerCase() === ind.name.toLowerCase());

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={`Digital systems for *${ind.name}.*`}
        intro={ind.description}
        crumbs={[{ label: "Industries", href: "/industries" }, { label: ind.name, href: `/industries/${ind.slug}` }]}
      >
        <div className="mt-10">
          <Button href={`/contact?industry=${encodeURIComponent(ind.name)}`}>Talk about your project</Button>
        </div>
      </PageHero>
      {ind.image && (
        <div className="container-x pb-12">
          <ImageBanner src={ind.image} alt={ind.name} priority />
        </div>
      )}
      <section className="container-x grid gap-6 pb-20 md:grid-cols-2">
        {ind.solutions.length > 0 && (
          <div className="hairline rounded-3xl bg-card/60 p-8">
            <h2 className="eyebrow mb-6">What we build</h2>
            <ul className="space-y-3">
              {ind.solutions.map((s) => (
                <li key={s} className="flex gap-3 text-lg"><Check className="mt-1 h-5 w-5 text-aqua" aria-hidden="true" /> {s}</li>
              ))}
            </ul>
          </div>
        )}
        {ind.challenges.length > 0 && (
          <div className="hairline rounded-3xl bg-card/60 p-8">
            <h2 className="eyebrow mb-6">Problems we solve</h2>
            <ul className="space-y-3 text-mute">
              {ind.challenges.map((c) => <li key={c}>— {c}</li>)}
            </ul>
          </div>
        )}
      </section>
      {work.length > 0 && (
        <section className="container-x pb-24">
          <div className="mb-10"><SectionHeading eyebrow="Work" title="Relevant *projects.*" /></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {work.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </section>
      )}
      <FinalCTA settings={site.settings} />
    </>
  );
}
