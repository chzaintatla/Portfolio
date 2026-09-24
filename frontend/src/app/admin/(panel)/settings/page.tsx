"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { FieldInput } from "@/components/admin/Fields";
import type { Field } from "@/components/admin/resources";
import { Btn, Card, PageHeader, Skeleton } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";

const GROUPS: { title: string; description?: string; fields: Field[] }[] = [
  {
    title: "Company",
    fields: [
      { name: "company_name", label: "Company name", type: "text" },
      { name: "company_tagline", label: "Tagline", type: "text" },
      { name: "company_description", label: "Short description (footer, SEO)", type: "textarea", full: true },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "contact_email", label: "Email", type: "email" },
      { name: "contact_phone", label: "Phone", type: "text" },
      { name: "contact_whatsapp", label: "WhatsApp link", type: "url", hint: "https://wa.me/…" },
      { name: "contact_location", label: "Location", type: "text" },
      { name: "booking_url", label: "Consultation booking URL", type: "url", hint: "Calendly etc. Empty = contact form", full: true },
    ],
  },
  {
    title: "Homepage",
    fields: [
      { name: "hero_eyebrow", label: "Hero eyebrow", type: "text", full: true },
      { name: "hero_headline", label: "Hero headline", type: "text", full: true, hint: "wrap a word in *asterisks* to highlight it" },
      { name: "hero_subtext", label: "Hero supporting text", type: "textarea", full: true },
      { name: "about_heading", label: "About heading", type: "text", full: true },
      { name: "about_body", label: "About text", type: "textarea", full: true },
      { name: "cta_headline", label: "Final CTA headline", type: "text", full: true },
      { name: "cta_subtext", label: "Final CTA text", type: "textarea", full: true },
      { name: "stats", label: "Company statistics", type: "objects", full: true, hint: "only verified numbers — hidden when empty", of: [{ name: "value", label: "Value (e.g. 40+)" }, { name: "label", label: "Label (e.g. Projects)" }] },
    ],
  },
  {
    title: "Company values",
    description: "Shown on the homepage and About page. Hovering a value reveals its photo and description.",
    fields: [
      { name: "values_heading", label: "Heading", type: "text" },
      { name: "values_intro", label: "Intro", type: "textarea", full: true },
      { name: "company_values", label: "Values", type: "objects", full: true, hint: "icon = a name from the icon list, e.g. Lightbulb", of: [{ name: "title", label: "Title" }, { name: "icon", label: "Icon name" }, { name: "image", label: "Image URL" }, { name: "description", label: "Description", type: "textarea" }] },
    ],
  },
  {
    title: "Blog topics",
    description: "Topic ideas rotated daily in the Blog publishing planner.",
    fields: [{ name: "blog_topics", label: "Topics", type: "tags", full: true }],
  },
  {
    title: "Contact form options",
    fields: [
      { name: "budgets", label: "Budget ranges", type: "tags", full: true },
      { name: "timelines", label: "Timelines", type: "tags", full: true },
      { name: "referral_options", label: "\"How did you hear about us?\" options", type: "tags", full: true },
    ],
  },
  {
    title: "Analytics",
    description: "Leave empty to disable. First-party analytics always run.",
    fields: [
      { name: "ga_measurement_id", label: "Google Analytics 4 ID", type: "text", hint: "G-XXXXXXX" },
      { name: "meta_pixel_id", label: "Meta Pixel ID", type: "text" },
      { name: "google_site_verification", label: "Search Console verification code", type: "text", full: true },
    ],
  },
  {
    title: "Legal pages",
    fields: [
      { name: "privacy_html", label: "Privacy Policy", type: "richtext", full: true, hint: "empty = default text" },
      { name: "terms_html", label: "Terms of Use", type: "richtext", full: true, hint: "empty = default text" },
    ],
  },
];

export default function SettingsPage() {
  const { can } = useAuth();
  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const writable = can("settings:write");

  useEffect(() => {
    adminApi
      .get<{ key: string; value: unknown }[]>("/api/admin/settings")
      .then((rows) => setValues(Object.fromEntries(rows.map((r) => [r.key, r.value]))))
      .catch((e: Error) => toast.error(e.message));
  }, []);

  async function save() {
    if (!values || !dirty.size) return;
    setSaving(true);
    try {
      await adminApi.put("/api/admin/settings", { values: Object.fromEntries([...dirty].map((k) => [k, values[k] ?? ""])) });
      setDirty(new Set());
      toast.success("Settings saved — the site updates automatically");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site-wide content and configuration."
        actions={<>
          <Link href="/admin/social-links" className="inline-flex items-center rounded-xl border border-line px-4 py-2.5 text-sm hover:border-line-hi">Social links</Link>
          {writable && <Btn variant="primary" onClick={save} loading={saving} disabled={!dirty.size}>Save{dirty.size ? ` (${dirty.size})` : ""}</Btn>}
        </>}
      />
      {!values ? (
        <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-48" />)}</div>
      ) : (
        <fieldset disabled={!writable} className="space-y-4">
          {GROUPS.map((g) => (
            <Card key={g.title} title={g.title}>
              {g.description && <p className="-mt-2 mb-4 text-xs text-dim">{g.description}</p>}
              <div className="grid gap-5 md:grid-cols-2">
                {g.fields.map((f) => (
                  <div key={f.name} className={f.full ? "md:col-span-2" : undefined}>
                    <FieldInput
                      field={f}
                      value={values[f.name] ?? (f.type === "tags" || f.type === "objects" ? [] : "")}
                      onChange={(v) => {
                        setValues((s) => ({ ...s!, [f.name]: v }));
                        setDirty((d) => new Set(d).add(f.name));
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </fieldset>
      )}
    </>
  );
}
