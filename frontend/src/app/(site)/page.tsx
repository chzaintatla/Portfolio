import { type CompanyValue, CompanyValues } from "@/components/sections/CompanyValues";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { About } from "@/components/sections/home/About";
import { Automation } from "@/components/sections/home/Automation";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { Engagement } from "@/components/sections/home/Engagement";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { Growth } from "@/components/sections/home/Growth";
import { Hero } from "@/components/sections/home/Hero";
import { Industries } from "@/components/sections/home/Industries";
import { Insights } from "@/components/sections/home/Insights";
import { Process } from "@/components/sections/home/Process";
import { Services } from "@/components/sections/home/Services";
import { TechConstellation } from "@/components/sections/home/TechConstellation";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { WhySparkwave } from "@/components/sections/home/WhySparkwave";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/", {
    title: "SparkWave Digital Systems — Digital Product, AI, Automation & Growth Partner",
  });

export default async function HomePage() {
  const [site, services, industries, projects, stages, techs, models, testimonials, blog, faqs] = await Promise.all([
    api.site(),
    api.services(),
    api.industries(),
    api.projects("?featured=true"),
    api.process(),
    api.technologies(),
    api.engagementModels(),
    api.testimonials(),
    api.blog("?page_size=3"),
    api.faqs(),
  ]);
  const s = site.settings;
  // Fall back to all projects if nothing is flagged featured yet.
  const work = projects.length ? projects : await api.projects();

  return (
    <>
      <Hero settings={s} />
      <Capabilities stats={Array.isArray(s.stats) ? s.stats : []} />
      <About heading={s.about_heading} body={s.about_body} />
      <CompanyValues values={Array.isArray(s.company_values) ? (s.company_values as CompanyValue[]) : []} heading={s.values_heading as string} intro={s.values_intro as string} />
      <Industries industries={industries} />
      <Services services={services.filter((x) => x.show_on_home)} />
      <Automation services={services.filter((x) => x.group === "ai")} />
      <WhySparkwave />
      <FeaturedWork projects={work} />
      <Process stages={stages} />
      <TechConstellation technologies={techs} />
      <Engagement models={models} />
      <Growth services={services.filter((x) => x.group === "growth")} />
      <Testimonials items={testimonials} />
      <Insights posts={blog.items} />
      <FAQ items={faqs.slice(0, 10)} />
      <FinalCTA settings={s} />
    </>
  );
}
