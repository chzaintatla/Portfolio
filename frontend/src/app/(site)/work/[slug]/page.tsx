import { ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { Gallery } from "@/components/sections/Gallery";
import { Backdrop } from "@/components/sections/home/Backdrop";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { ViewTracker } from "@/components/sections/ViewTracker";
import { Button } from "@/components/ui/Button";
import { ConceptBadge } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { api } from "@/lib/api";
import { jsonLd, recordMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await api.projects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await api.project(slug);
  if (!p) return { title: "Project not found" };
  return recordMetadata(`/work/${slug}`, p, {
    title: `${p.title} — Case Study`,
    description: p.short_description,
    image: p.og_image || p.hero_image || p.thumbnail,
  });
}

function Block({ label, html }: { label: string; html?: string | null }) {
  if (!html) return null;
  return (
    <Reveal className="grid gap-6 border-t border-line py-14 md:grid-cols-[240px_1fr]">
      <h2 className="eyebrow">{label}</h2>
      <div className="prose-spark max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
    </Reveal>
  );
}

function videoEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, site, all] = await Promise.all([api.project(slug), api.site(), api.projects()]);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const embed = project.video_url ? videoEmbed(project.video_url) : null;
  const facts = [
    { label: "Industry", value: project.industry },
    { label: "Category", value: project.category },
    { label: "Client", value: project.client },
    { label: "Platforms", value: project.platforms.join(" · ") },
    { label: "Role", value: project.role },
    { label: "Services", value: project.services.map((s) => s.title).join(", ") },
  ].filter((f) => f.value);
  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.short_description,
    image: project.hero_image ? absoluteUrl(project.hero_image) : undefined,
    url: absoluteUrl(`/work/${project.slug}`),
    creator: { "@type": "Organization", name: "SparkWave Digital Systems" },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <ViewTracker type="project" slug={project.slug} />

      <header className="relative isolate overflow-hidden pt-36 pb-16 md:pt-44">
        <Backdrop particles={12} />
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-dim">
            <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/work" className="hover:text-ink">Work</Link> / <span className="text-mute">{project.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{project.is_demo ? "Concept build" : "Case study"}</p>
            <ConceptBadge show={project.is_demo} />
          </div>
          <SplitHeading as="h1" immediate text={project.title} className="mt-5 text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-bold tracking-[-0.05em]" />
          {project.short_description && (
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-2xl text-lg text-mute md:text-xl">{project.short_description}</p>
            </Reveal>
          )}
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-3 xl:grid-cols-6">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow !text-[0.65rem]">{f.label}</dt>
                <dd className="mt-2 text-sm">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container-x">
        <Reveal>
          <ProjectVisual
            title={project.title}
            image={project.hero_image || project.thumbnail}
            accent={project.accent}
            category={project.category}
            priority
            sizes="100vw"
            className="hairline aspect-[16/10] rounded-[2rem] md:aspect-[21/10]"
          />
        </Reveal>
        {(project.external_url || project.results.length > 0) && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            {project.results.length > 0 && (
              <dl className="flex flex-wrap gap-10">
                {project.results.map((r) => (
                  <div key={r.label}>
                    <dd className="font-display text-4xl font-semibold text-gradient">{r.value}</dd>
                    <dt className="mt-1 text-sm text-mute">{r.label}</dt>
                  </div>
                ))}
              </dl>
            )}
            {project.external_url && (
              <Button href={project.external_url} external variant="outline">
                {/play.google|apps.apple/.test(project.external_url) ? "View on the store" : "Visit live product"}
              </Button>
            )}
          </div>
        )}

        <div className="mt-16">
          <Block label="Overview" html={project.long_description} />
          <Block label="The challenge" html={project.challenge} />
          <Block label="Our solution" html={project.solution} />

          {project.features.length > 0 && (
            <Reveal className="grid gap-6 border-t border-line py-14 md:grid-cols-[240px_1fr]">
              <h2 className="eyebrow">Key features</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="hairline flex items-center gap-3 rounded-2xl bg-card/60 px-5 py-4">
                    <Check className="h-4 w-4 shrink-0 text-aqua" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Block label="Design" html={project.design_notes} />
          <Block label="Development" html={project.development_notes} />
          <Block label="Architecture" html={project.architecture} />

          {project.images.length > 0 && (
            <section className="border-t border-line py-14" aria-labelledby="shots">
              <h2 id="shots" className="eyebrow mb-8">Screens</h2>
              <Gallery images={project.images} title={project.title} />
            </section>
          )}

          {project.video_url && (
            <section className="border-t border-line py-14" aria-labelledby="vid">
              <h2 id="vid" className="eyebrow mb-8">Walkthrough</h2>
              {embed ? (
                <div className="hairline aspect-video overflow-hidden rounded-3xl">
                  <iframe src={embed} title={`${project.title} video`} className="h-full w-full" loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen />
                </div>
              ) : (
                <video src={project.video_url} controls preload="metadata" className="hairline w-full rounded-3xl" />
              )}
            </section>
          )}

          {project.technologies.length > 0 && (
            <section className="grid gap-6 border-t border-line py-14 md:grid-cols-[240px_1fr]">
              <h2 className="eyebrow">Technology stack</h2>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t.id} className="hairline rounded-full bg-card/60 px-4 py-2 text-sm">{t.name}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {next && next.slug !== project.slug && (
          <Link href={`/work/${next.slug}`} data-cursor="view" className="group mt-10 mb-10 block border-t border-line py-16">
            <p className="eyebrow">Next project</p>
            <p className="mt-4 flex items-center justify-between font-display text-[clamp(2.5rem,7vw,6rem)] leading-none font-bold tracking-tight transition-colors group-hover:text-aqua">
              {next.title}
              <ArrowUpRight className="h-12 w-12 transition-transform duration-500 group-hover:rotate-45 md:h-20 md:w-20" aria-hidden="true" />
            </p>
          </Link>
        )}
      </div>
      <FinalCTA settings={site.settings} />
    </article>
  );
}
