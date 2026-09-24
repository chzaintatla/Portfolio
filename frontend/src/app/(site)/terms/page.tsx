import { LegalPage } from "@/components/sections/LegalPage";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("/terms", { title: "Terms of Use" });

const FALLBACK = `
<p>By using this website you agree to these terms.</p>
<h2>Content</h2>
<p>Content on this site is provided for general information. Case studies and articles describe our work and views; they are not guarantees of specific results.</p>
<h2>Intellectual property</h2>
<p>The SparkWave name, logo, design and content of this site belong to SparkWave Digital Systems unless otherwise stated.</p>
<h2>Project engagements</h2>
<p>Client projects are governed by a separate written agreement, which takes precedence over these terms.</p>
<h2>Contact</h2>
<p>Questions about these terms can be sent to us through the contact page.</p>`;

export default async function TermsPage() {
  const { settings } = await api.site();
  return <LegalPage title="Terms of Use" path="/terms" html={settings.terms_html} fallback={FALLBACK} />;
}
