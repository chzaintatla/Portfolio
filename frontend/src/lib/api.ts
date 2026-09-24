import "server-only";

import type {
  BlogCategory, BlogPost, BlogPostCard, DailyGroup, EngagementModel, FAQ, Industry, Page, ProcessStage, Project,
  ProjectCard, SeoRecord, Service, SiteData, TeamMember, Technology, Testimonial,
} from "@/types";

/**
 * Server-side CMS client. Every public page reads through here, so admin edits show up after the
 * backend calls /revalidate (tag-based) or, at the latest, after REVALIDATE_SECONDS.
 *
 * Failures resolve to `fallback` instead of throwing so a backend outage degrades sections to their
 * empty states instead of taking the whole site down.
 */
const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;

async function get<T>(path: string, tags: string[], fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags },
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      if (res.status !== 404) console.error(`[api] ${path} → ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[api] ${path} unreachable`, (err as Error).message);
    return fallback;
  }
}

const emptySite: SiteData = { settings: {}, socials: [], services: [] };
const emptyPage = <T,>(): Page<T> => ({ items: [], total: 0, page: 1, page_size: 9 });

export const api = {
  site: () => get<SiteData>("/api/site", ["site", "services"], emptySite),
  seo: (path: string) => get<SeoRecord | null>(`/api/seo?path=${encodeURIComponent(path)}`, ["seo"], null),
  sitemap: () =>
    get<Record<string, { slug: string; updated_at: string }[]> & { noindex?: string[] }>(
      "/api/sitemap",
      ["projects", "services", "blog", "industries", "seo"],
      {},
    ),

  services: (params = "") => get<Service[]>(`/api/services${params}`, ["services"], []),
  service: (slug: string) => get<Service | null>(`/api/services/${encodeURIComponent(slug)}`, ["services"], null),

  projects: (params = "") => get<ProjectCard[]>(`/api/projects${params}`, ["projects"], []),
  project: (slug: string) =>
    get<Project | null>(`/api/projects/${encodeURIComponent(slug)}`, ["projects", `project:${slug}`], null),

  industries: () => get<Industry[]>("/api/industries", ["industries"], []),
  industry: (slug: string) => get<Industry | null>(`/api/industries/${encodeURIComponent(slug)}`, ["industries"], null),
  technologies: () => get<Technology[]>("/api/technologies", ["technologies"], []),
  process: () => get<ProcessStage[]>("/api/process", ["process"], []),
  engagementModels: () => get<EngagementModel[]>("/api/engagement-models", ["engagement-models"], []),
  testimonials: () => get<Testimonial[]>("/api/testimonials", ["testimonials"], []),
  faqs: () => get<FAQ[]>("/api/faqs", ["faqs"], []),
  team: () => get<TeamMember[]>("/api/team", ["team"], []),

  blog: (query = "") => get<Page<BlogPostCard>>(`/api/blog${query}`, ["blog"], emptyPage<BlogPostCard>()),
  blogDaily: (days = 14) => get<DailyGroup[]>(`/api/blog/daily?days=${days}`, ["blog"], []),
  blogCategories: () => get<BlogCategory[]>("/api/blog/categories", ["blog"], []),
  post: (slug: string) => get<BlogPost | null>(`/api/blog/${encodeURIComponent(slug)}`, ["blog", `post:${slug}`], null),
  relatedPosts: (slug: string) =>
    get<BlogPostCard[]>(`/api/blog/${encodeURIComponent(slug)}/related`, ["blog"], []),
};
