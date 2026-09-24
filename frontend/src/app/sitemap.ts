import type { MetadataRoute } from "next";

import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 3600;

const STATIC = ["/", "/about", "/services", "/work", "/process", "/technologies", "/industries", "/blog", "/contact", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await api.sitemap();
  const noindex = new Set(data.noindex ?? []);
  const entry = (path: string, lastModified?: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    priority,
  });
  const dyn = (key: string, prefix: string, priority: number) =>
    ((data as Record<string, { slug: string; updated_at: string }[]>)[key] ?? []).map((r) => entry(`${prefix}/${r.slug}`, r.updated_at, priority));

  return [
    ...STATIC.map((p) => entry(p, undefined, p === "/" ? 1 : 0.8)),
    ...dyn("services", "/services", 0.8),
    ...dyn("projects", "/work", 0.7),
    ...dyn("industries", "/industries", 0.6),
    ...dyn("blog", "/blog", 0.6),
  ].filter((e) => !noindex.has(e.url.replace(SITE_URL, "") || "/"));
}
