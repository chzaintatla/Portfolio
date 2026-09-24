import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Analytics } from "@/components/layout/Analytics";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { INTRO_SCRIPT, Loader } from "@/components/layout/Loader";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { buildNav } from "@/components/layout/nav";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { api } from "@/lib/api";
import { jsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await api.site();
  return settings.google_site_verification
    ? { verification: { google: String(settings.google_site_verification) } }
    : {};
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await api.site();
  const s = site.settings;
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.company_name ?? "SparkWave Digital Systems",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-mark.png`,
    description: s.company_description,
    email: s.contact_email,
    telephone: s.contact_phone,
    sameAs: site.socials.map((x) => x.url),
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(org)} />
      <MotionProvider>
      <Loader />
      <SmoothScroll />
      <Cursor />
      <Navbar items={buildNav(site)} />
      <main id="main">{children}</main>
      <Footer site={site} />
      <Toaster theme="dark" position="bottom-right" />
      <Analytics gaId={s.ga_measurement_id} pixelId={s.meta_pixel_id} />
      </MotionProvider>
    </>
  );
}
