import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/work", { title: "Our Work", description: "Products and platforms designed and engineered by SparkWave Digital Systems." });

export default async function WorkPage() {
  const [projects, site] = await Promise.all([api.projects(), api.site()]);
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Products we've *built.*"
        intro="Mobile apps, platforms and AI systems — each one designed around a real business problem."
        crumbs={[{ label: "Work", href: "/work" }]}
      />
      <section className="container-x pb-28">
        <WorkGrid projects={projects} />
      </section>
      <FinalCTA settings={site.settings} />
    </>
  );
}
