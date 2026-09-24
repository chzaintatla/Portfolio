import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Suspense } from "react";

import { ContactForm } from "@/components/sections/ContactForm";
import { FAQ } from "@/components/sections/FAQ";
import { PageHero } from "@/components/sections/PageHero";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  pageMetadata("/contact", { title: "Contact — Start a Project", description: "Tell us what you're building and we'll help you figure out what comes next." });

export default async function ContactPage() {
  const [site, faqs] = await Promise.all([api.site(), api.faqs()]);
  const s = site.settings;
  const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  const channels = [
    s.contact_email && { icon: Mail, label: "Email", value: s.contact_email, href: `mailto:${s.contact_email}` },
    s.contact_phone && { icon: Phone, label: "Phone", value: s.contact_phone, href: `tel:${s.contact_phone.replace(/\s/g, "")}` },
    s.contact_whatsapp && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: s.contact_whatsapp },
    s.contact_location && { icon: MapPin, label: "Location", value: s.contact_location },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something *great.*"
        intro="Share a few details about your project. We'll come back with questions, ideas and a clear next step."
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="container-x grid gap-10 pb-24 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          {channels.map((c) => (
            <div key={c.label} className="hairline flex items-start gap-4 rounded-2xl bg-card/60 p-5">
              <c.icon className="mt-0.5 h-5 w-5 text-aqua" aria-hidden="true" />
              <div>
                <p className="text-xs text-dim">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-ink hover:text-aqua" {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{c.value}</a>
                ) : <p>{c.value}</p>}
              </div>
            </div>
          ))}
          <div className="hairline flex items-start gap-4 rounded-2xl bg-card/60 p-5">
            <Clock className="mt-0.5 h-5 w-5 text-gold" aria-hidden="true" />
            <div>
              <p className="text-xs text-dim">Response time</p>
              <p>Within one business day</p>
            </div>
          </div>
        </aside>
        <Suspense>
          <ContactForm
            services={site.services.map((x) => x.title)}
            budgets={list(s.budgets)}
            timelines={list(s.timelines)}
            referrals={list(s.referral_options)}
          />
        </Suspense>
      </section>
      <FAQ items={faqs.slice(0, 6)} />
    </>
  );
}
