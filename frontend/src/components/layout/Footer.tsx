import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Logo, LogoMark } from "@/components/ui/Logo";
import type { SiteData } from "@/types";

export function Footer({ site }: { site: SiteData }) {
  const s = site.settings;
  const engineering = site.services.filter((x) => x.group === "engineering").slice(0, 7);
  const solutions = site.services.filter((x) => x.group !== "engineering");
  const year = new Date().getFullYear();

  const columns = [
    { title: "Services", links: engineering.map((x) => ({ label: x.title, href: `/services/${x.slug}` })) },
    {
      title: "Solutions",
      links: [
        ...solutions.map((x) => ({ label: x.title, href: `/services/${x.slug}` })),
        { label: "Industries", href: "/industries" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Work", href: "/work" },
        { label: "Process", href: "/process" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Insights", href: "/blog" },
        { label: "Technologies", href: "/technologies" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-night">
      <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]" />

      <div className="container-x relative pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-mute">{s.company_description}</p>
            <ul className="mt-8 space-y-3 text-sm">
              {s.contact_email && (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="inline-flex items-center gap-3 text-mute hover:text-ink">
                    <Mail className="h-4 w-4 text-aqua" aria-hidden="true" /> {s.contact_email}
                  </a>
                </li>
              )}
              {s.contact_phone && (
                <li>
                  <a href={s.contact_whatsapp || `tel:${s.contact_phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-3 text-mute hover:text-ink">
                    <Phone className="h-4 w-4 text-aqua" aria-hidden="true" /> {s.contact_phone}
                  </a>
                </li>
              )}
              {s.contact_location && (
                <li className="inline-flex items-center gap-3 text-mute">
                  <MapPin className="h-4 w-4 text-aqua" aria-hidden="true" /> {s.contact_location}
                </li>
              )}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="eyebrow mb-5 !text-[0.7rem]">{col.title}</h2>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-sm text-mute transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-line pt-10 md:flex-row md:items-end">
          <Link href="/contact" className="group flex items-end gap-4" data-cursor="explore">
            <LogoMark className="h-14 w-14 shrink-0 transition-transform duration-700 ease-spark group-hover:rotate-[20deg]" animated />
            <span className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.9] font-semibold tracking-tight">
              Let&apos;s build<span className="text-gradient"> together.</span>
            </span>
          </Link>
          {site.socials.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {site.socials.map((so) => (
                <li key={so.url}>
                  <a
                    href={so.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hairline inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-mute transition-colors hover:border-aqua/50 hover:text-ink"
                  >
                    {so.platform} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 text-xs text-dim sm:flex-row">
          <p>© {year} {s.company_name ?? "SparkWave Digital Systems"}. All rights reserved.</p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
