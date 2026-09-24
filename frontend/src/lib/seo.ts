import type { Metadata } from "next";

import { api } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";
import type { Seo } from "@/types";

const SITE_NAME = "SparkWave Digital Systems";

interface Fallback {
  title: string;
  description?: string | null;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
}

function build(path: string, fb: Fallback, record: {
  title?: string | null; description?: string | null; keywords?: string | null; canonical?: string | null;
  ogTitle?: string | null; ogDescription?: string | null; ogImage?: string | null; card?: string | null;
  noindex?: boolean;
}): Metadata {
  const title = record.title || fb.title;
  const description = record.description || fb.description || undefined;
  const image = record.ogImage || fb.image || undefined;
  return {
    title,
    description,
    keywords: record.keywords || undefined,
    alternates: { canonical: record.canonical || absoluteUrl(path) },
    robots: record.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: record.ogTitle || title,
      description: record.ogDescription || description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: fb.type ?? "website",
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
      ...(fb.publishedTime ? { publishedTime: fb.publishedTime } : {}),
    },
    twitter: {
      card: (record.card as "summary_large_image" | "summary") || "summary_large_image",
      title: record.ogTitle || title,
      description: record.ogDescription || description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

/** Metadata for static routes, overridable in Admin → SEO (keyed by path). */
export async function pageMetadata(path: string, fb: Fallback): Promise<Metadata> {
  const r = await api.seo(path);
  return build(path, fb, {
    title: r?.title, description: r?.description, keywords: r?.keywords, canonical: r?.canonical_url,
    ogTitle: r?.og_title, ogDescription: r?.og_description, ogImage: r?.og_image, card: r?.twitter_card,
    noindex: r?.noindex,
  });
}

/** Metadata for CMS records that carry their own SEO fields. */
export function recordMetadata(path: string, seo: Seo, fb: Fallback): Metadata {
  return build(path, fb, {
    title: seo.seo_title, description: seo.seo_description, keywords: seo.seo_keywords,
    canonical: seo.canonical_url, ogImage: seo.og_image,
  });
}

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\u003c") };
}
