import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Engagement } from "@/components/sections/home/Engagement";
import { Process } from "@/components/sections/home/Process";
import { PageHero } from "@/components/sections/PageHero";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/process", { title: "Our Delivery Process", description: "From first spark to full scale: discover, strategize, design, build, launch and grow." });

export default async function ProcessPage() {
  const [stages, models, faqs, site] = await Promise.all([api.process(), api.engagementModels(), api.faqs(), api.site()]);
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From first spark to *full* scale."
        intro="A delivery process built for visibility: short iterations, working demos and clear decisions at every stage."
        crumbs={[{ label: "Process", href: "/process" }]}
      />
      <Process stages={stages} heading={false} />
      <Engagement models={models} />
      <FAQ items={faqs.filter((f) => ["Delivery", "Engagement", "Support"].includes(f.category ?? ""))} />
      <FinalCTA settings={site.settings} />
    </>
  );
}
