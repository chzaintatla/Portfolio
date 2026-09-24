import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ImageBanner } from "@/components/sections/ImageBanner";
import { Process } from "@/components/sections/home/Process";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ViewTracker } from "@/components/sections/ViewTracker";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { api } from "@/lib/api";
import { Icon } from "@/lib/icons";
import { jsonLd, recordMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const services = await api.services();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await api.service(slug);
  if (!s) return { title: "Service not found" };
  return recordMetadata(`/services/${slug}`, s, { title: s.title, description: s.description });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, site, stages, allProjects, faqs] = await Promise.all([
    api.service(slug), api.site(), api.process(), api.projects(), api.faqs(),
  ]);
  if (!service) notFound();

  // Related work: explicit links first, then projects that list this service.
  const related = allProjects.filter((p) => service.projects.some((r) => r.id === p.id)).slice(0, 3);
  const steps = service.process.length
    ? service.process.map((p, i) => ({
        id: i, number: String(i + 1).padStart(2, "0"), stage: p.title.toUpperCase(), title: p.title,
        description: p.description, activities: [], deliverables: [], team: [], technologies: [], published: true, order: i,
      }))
    : stages;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "Organization", name: site.settings.company_name ?? "SparkWave Digital Systems" },
    url: absoluteUrl(`/services/${service.slug}`),
    areaServed: "Worldwide",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <ViewTracker type="service" slug={service.slug} />
      <PageHero
        eyebrow={service.number ? `Service ${service.number}` : "Service"}
        title={service.title}
        intro={service.tagline ? `${service.tagline} ${service.description ?? ""}` : service.description}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title, href: `/services/${service.slug}` }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={`/contact?service=${encodeURIComponent(service.title)}`} trackLabel={`service_${service.slug}_start`}>
            Start a Project
          </Button>
          <Button href="#capabilities" variant="outline">What&apos;s included</Button>
        </div>
      </PageHero>

      {service.hero_image && (
        <div className="container-x pb-8">
          <ImageBanner src={service.hero_image} alt={service.title} priority />
        </div>
      )}

      {service.body && (
        <section className="container-x pb-10">
          <div className="prose-spark max-w-3xl" dangerouslySetInnerHTML={{ __html: service.body }} />
        </section>
      )}

      {service.features.length > 0 && (
        <section id="capabilities" className="container-x scroll-mt-28 py-20" aria-labelledby="cap-h">
          <div id="cap-h" className="mb-12">
            <SectionHeading eyebrow="Capabilities" title="What we *deliver.*" />
          </div>
          <RevealGroup className="grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
            {service.features.map((f, i) => (
              <RevealItem key={f.title} className="group bg-midnight p-7 transition-colors duration-500 hover:bg-card">
                <span className="text-xs text-dim tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{f.title}</h3>
                {f.description && <p className="mt-2 text-sm text-mute">{f.description}</p>}
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {(service.platforms.length > 0 || service.benefits.length > 0 || service.deliverables.length > 0) && (
        <section className="container-x grid gap-6 py-16 lg:grid-cols-3">
          {service.benefits.length > 0 && (
            <div className="hairline rounded-3xl bg-card/60 p-8 lg:col-span-2">
              <h2 className="eyebrow mb-6">Why it matters</h2>
              <ul className="space-y-4">
                {service.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-lg">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-aqua" aria-hidden="true" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-6">
            {service.platforms.length > 0 && (
              <div className="hairline rounded-3xl bg-card/60 p-8">
                <h2 className="eyebrow mb-4">Platforms</h2>
                <ul className="flex flex-wrap gap-2">
                  {service.platforms.map((p) => (
                    <li key={p} className="rounded-full bg-white/[.05] px-3 py-1.5 text-sm">{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {service.deliverables.length > 0 && (
              <div className="hairline rounded-3xl bg-card/60 p-8">
                <h2 className="eyebrow mb-4">Deliverables</h2>
                <ul className="space-y-2 text-sm text-ink/85">
                  {service.deliverables.map((d) => <li key={d}>— {d}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {service.technologies.length > 0 && (
        <section className="container-x py-16">
          <h2 className="eyebrow mb-6">Technology we use</h2>
          <ul className="flex flex-wrap gap-2">
            {service.technologies.map((t) => (
              <li key={t.id} className="hairline inline-flex items-center gap-2 rounded-full bg-card/60 px-4 py-2 text-sm">
                <Icon name="Cpu" className="h-3.5 w-3.5 text-aqua" /> {t.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Process stages={steps} />

      {related.length > 0 && (
        <section className="container-x py-24" aria-labelledby="rel-h">
          <div id="rel-h" className="mb-12">
            <SectionHeading eyebrow="Related work" title="See it in *action.*" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </section>
      )}

      <FAQ items={faqs.filter((f) => f.category === "Services" || f.category === "Pricing").slice(0, 5)} />
      <FinalCTA settings={site.settings} />
    </>
  );
}
