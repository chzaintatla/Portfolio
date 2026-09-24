import { LegalPage } from "@/components/sections/LegalPage";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("/privacy", { title: "Privacy Policy" });

const FALLBACK = `
<p>This policy explains what information SparkWave Digital Systems collects through this website and how it is used.</p>
<h2>Information we collect</h2>
<p>When you submit the contact form we collect the details you provide (name, email, company, phone, project information). We also record anonymous usage data such as pages visited, to understand how the site is used.</p>
<h2>How we use it</h2>
<p>We use your details only to respond to your enquiry and to manage our relationship with you. We do not sell personal data.</p>
<h2>Cookies and analytics</h2>
<p>We may use analytics tools such as Google Analytics and Meta Pixel when enabled. These tools may set cookies to measure visits and campaign performance.</p>
<h2>Your rights</h2>
<p>You can ask us to access, correct or delete your personal data at any time by emailing us.</p>`;

export default async function PrivacyPage() {
  const { settings } = await api.site();
  return <LegalPage title="Privacy Policy" path="/privacy" html={settings.privacy_html} fallback={FALLBACK} />;
}
