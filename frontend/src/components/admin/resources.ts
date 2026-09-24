/**
 * CMS resource definitions. Each entry drives the generic list + editor screens in the admin:
 * which endpoint to call, which columns to show and which fields the editor renders.
 */
import { ICON_NAMES } from "@/lib/icons";

export type FieldType =
  | "text" | "textarea" | "number" | "boolean" | "slug" | "url" | "email" | "richtext" | "image" | "tags"
  | "objects" | "select" | "relations" | "relation" | "icon" | "datetime" | "color";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  tab?: "content" | "media" | "seo" | "settings";
  options?: { value: string; label: string }[];
  /** For objects: sub-fields of each item. */
  of?: { name: string; label: string; type?: "text" | "textarea" | "select"; options?: string[] }[];
  /** For relation(s): admin endpoint to load options from, and the label field. */
  source?: string;
  sourceLabel?: string;
  full?: boolean;
}

export interface Column {
  key: string;
  label: string;
  kind?: "text" | "bool" | "badge" | "date" | "image" | "count";
}

export interface Resource {
  key: string;
  label: string;
  singular: string;
  description: string;
  endpoint: string; // public prefix used for POST/PUT/DELETE
  adminEndpoint: string;
  perm: string;
  titleField: string;
  publishField?: string;
  orderable?: boolean;
  columns: Column[];
  fields: Field[];
  /** Map an API record into editor values (e.g. relation objects → id arrays). */
  fromRecord?: (r: Record<string, unknown>) => Record<string, unknown>;
  /** Map editor values into the API payload. */
  toPayload?: (v: Record<string, unknown>) => Record<string, unknown>;
  viewPath?: (r: Record<string, unknown>) => string | null;
  links?: { href: string; label: string }[];
}

const SEO: Field[] = [
  { name: "seo_title", label: "SEO title", type: "text", tab: "seo", hint: "≈ 60 characters" },
  { name: "seo_description", label: "Meta description", type: "textarea", tab: "seo", hint: "≈ 155 characters" },
  { name: "seo_keywords", label: "Keywords", type: "text", tab: "seo", hint: "comma separated" },
  { name: "canonical_url", label: "Canonical URL", type: "url", tab: "seo" },
  { name: "og_image", label: "Open Graph image", type: "image", tab: "seo" },
];

const ids = (v: unknown) => (Array.isArray(v) ? v.map((x) => (x as { id: number }).id) : []);
const iconOptions = ICON_NAMES.map((n) => ({ value: n, label: n }));

export const RESOURCES: Record<string, Resource> = {
  projects: {
    key: "projects", label: "Projects", singular: "Project", description: "Case studies shown on the Work pages and homepage.",
    endpoint: "/api/projects", adminEndpoint: "/api/admin/projects", perm: "projects", titleField: "title", publishField: "published", orderable: true,
    columns: [
      { key: "thumbnail", label: "", kind: "image" }, { key: "title", label: "Title" }, { key: "category", label: "Category" },
      { key: "industry", label: "Industry" }, { key: "featured", label: "Featured", kind: "bool" }, { key: "is_demo", label: "Concept", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", hint: "auto-generated if empty" },
      { name: "category", label: "Category", type: "text", hint: "e.g. Mobile App, SaaS Platform" },
      { name: "industry", label: "Industry", type: "text" },
      { name: "client", label: "Client", type: "text" },
      { name: "role", label: "Our role", type: "text" },
      { name: "platforms", label: "Platforms", type: "tags", hint: "Android, iOS, Web, Desktop" },
      { name: "accent", label: "Accent colour", type: "color" },
      { name: "short_description", label: "Short description", type: "textarea", full: true },
      { name: "long_description", label: "Overview", type: "richtext", full: true },
      { name: "challenge", label: "Challenge", type: "richtext", full: true },
      { name: "solution", label: "Solution", type: "richtext", full: true },
      { name: "features", label: "Features", type: "tags", full: true },
      { name: "design_notes", label: "Design", type: "richtext", full: true },
      { name: "development_notes", label: "Development", type: "richtext", full: true },
      { name: "architecture", label: "Architecture", type: "richtext", full: true },
      { name: "results", label: "Results", type: "objects", full: true, hint: "only verified outcomes", of: [{ name: "value", label: "Value" }, { name: "label", label: "Label" }] },
      { name: "service_ids", label: "Services", type: "relations", source: "/api/admin/services", sourceLabel: "title", full: true },
      { name: "technology_ids", label: "Technologies", type: "relations", source: "/api/admin/technologies", sourceLabel: "name", full: true },
      { name: "thumbnail", label: "Thumbnail", type: "image", tab: "media" },
      { name: "hero_image", label: "Hero image", type: "image", tab: "media" },
      { name: "images", label: "Gallery", type: "objects", tab: "media", full: true, of: [{ name: "url", label: "Image URL" }, { name: "alt", label: "Alt text" }, { name: "caption", label: "Caption" }, { name: "kind", label: "Kind", type: "select", options: ["gallery", "screenshot", "design"] }] },
      { name: "video_url", label: "Video URL", type: "url", tab: "media", hint: "YouTube, Vimeo or MP4" },
      { name: "external_url", label: "Live URL", type: "url", tab: "media" },
      { name: "featured", label: "Featured on homepage", type: "boolean", tab: "settings" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "is_demo", label: "Concept build (shows a \"Concept\" badge)", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
      ...SEO,
    ],
    fromRecord: (r) => ({ ...r, technology_ids: ids(r.technologies), service_ids: ids(r.services) }),
    viewPath: (r) => `/work/${r.slug}`,
  },
  services: {
    key: "services", label: "Services", singular: "Service", description: "Services, their pages and the homepage service list.",
    endpoint: "/api/services", adminEndpoint: "/api/admin/services", perm: "services", titleField: "title", publishField: "published", orderable: true,
    columns: [{ key: "number", label: "#" }, { key: "title", label: "Title" }, { key: "group", label: "Group", kind: "badge" }, { key: "show_on_home", label: "Home", kind: "bool" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "number", label: "Number", type: "text", hint: "e.g. 01" },
      { name: "group", label: "Group", type: "select", options: [{ value: "engineering", label: "Engineering" }, { value: "ai", label: "AI & Automation" }, { value: "growth", label: "Digital Growth" }] },
      { name: "icon", label: "Icon", type: "icon", options: iconOptions },
      { name: "tagline", label: "Tagline", type: "text", full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "body", label: "Page body", type: "richtext", full: true },
      { name: "features", label: "Features", type: "objects", full: true, of: [{ name: "title", label: "Title" }, { name: "description", label: "Description", type: "textarea" }] },
      { name: "benefits", label: "Benefits", type: "tags", full: true },
      { name: "deliverables", label: "Deliverables", type: "tags", full: true },
      { name: "platforms", label: "Platforms offered", type: "tags", full: true, hint: "only list platforms you actually offer" },
      { name: "process", label: "Service process", type: "objects", full: true, hint: "empty = use global process", of: [{ name: "title", label: "Step" }, { name: "description", label: "Description", type: "textarea" }] },
      { name: "technology_ids", label: "Technologies", type: "relations", source: "/api/admin/technologies", sourceLabel: "name", full: true },
      { name: "hero_image", label: "Hero image", type: "image", tab: "media" },
      { name: "show_on_home", label: "Show on homepage", type: "boolean", tab: "settings" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
      ...SEO,
    ],
    fromRecord: (r) => ({ ...r, technology_ids: ids(r.technologies) }),
    viewPath: (r) => `/services/${r.slug}`,
  },
  industries: {
    key: "industries", label: "Industries", singular: "Industry", description: "Industries shown on the homepage track and industry pages.",
    endpoint: "/api/industries", adminEndpoint: "/api/admin/industries", perm: "industries", titleField: "name", publishField: "published", orderable: true,
    columns: [{ key: "image", label: "", kind: "image" }, { key: "name", label: "Name" }, { key: "solutions", label: "Solutions", kind: "count" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "icon", label: "Icon", type: "icon", options: iconOptions },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "solutions", label: "Relevant solutions", type: "tags", full: true },
      { name: "challenges", label: "Problems we solve", type: "tags", full: true },
      { name: "image", label: "Image", type: "image", tab: "media" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
      ...SEO,
    ],
    viewPath: (r) => `/industries/${r.slug}`,
  },
  technologies: {
    key: "technologies", label: "Technologies", singular: "Technology", description: "Technology constellation and stack lists.", links: [{ href: "/admin/technology-categories", label: "Manage categories" }],
    endpoint: "/api/technologies", adminEndpoint: "/api/admin/technologies", perm: "technologies", titleField: "name", publishField: "published", orderable: true,
    columns: [{ key: "icon", label: "", kind: "image" }, { key: "name", label: "Name" }, { key: "category.name", label: "Category", kind: "badge" }, { key: "featured", label: "Featured", kind: "bool" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "category_id", label: "Category", type: "relation", source: "/api/admin/technology-categories", sourceLabel: "name" },
      { name: "website", label: "Website", type: "url" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "icon", label: "Icon / logo", type: "image", tab: "media" },
      { name: "featured", label: "Featured", type: "boolean", tab: "settings" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
    ],
    fromRecord: (r) => ({ ...r, category_id: (r.category as { id?: number } | null)?.id ?? null }),
  },
  "technology-categories": {
    key: "technology-categories", label: "Technology Categories", singular: "Category", description: "Groups used by the technology constellation.",
    endpoint: "/api/technology-categories", adminEndpoint: "/api/admin/technology-categories", perm: "technologies", titleField: "name",
    columns: [{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }, { key: "order", label: "Order" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  process: {
    key: "process", label: "Process", singular: "Stage", description: "Delivery process stages (homepage timeline and /process).",
    endpoint: "/api/process", adminEndpoint: "/api/admin/process", perm: "process", titleField: "title", publishField: "published", orderable: true,
    columns: [{ key: "number", label: "#" }, { key: "stage", label: "Stage", kind: "badge" }, { key: "title", label: "Title" }, { key: "duration", label: "Duration" }],
    fields: [
      { name: "number", label: "Number", type: "text", required: true, hint: "e.g. 01" },
      { name: "stage", label: "Stage label", type: "text", required: true, hint: "e.g. DISCOVER" },
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "duration", label: "Duration", type: "text" },
      { name: "icon", label: "Icon", type: "icon", options: iconOptions },
      { name: "activities", label: "Activities", type: "tags", full: true },
      { name: "deliverables", label: "Deliverables", type: "tags", full: true },
      { name: "team", label: "Team", type: "tags", full: true },
      { name: "technologies", label: "Technology", type: "tags", full: true },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
    ],
  },
  "engagement-models": {
    key: "engagement-models", label: "Engagement Models", singular: "Engagement model", description: "Ways to work together.",
    endpoint: "/api/engagement-models", adminEndpoint: "/api/admin/engagement-models", perm: "engagement-models", titleField: "title", publishField: "published", orderable: true,
    columns: [{ key: "title", label: "Title" }, { key: "highlighted", label: "Highlighted", kind: "bool" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "summary", label: "Summary", type: "textarea", full: true },
      { name: "best_for", label: "Best for", type: "tags", full: true },
      { name: "included", label: "What's included", type: "tags", full: true },
      { name: "model", label: "Engagement / billing model", type: "text", full: true },
      { name: "cta_label", label: "Button label", type: "text" },
      { name: "highlighted", label: "Highlight this card", type: "boolean", tab: "settings" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
    ],
  },
  testimonials: {
    key: "testimonials", label: "Testimonials", singular: "Testimonial", description: "Only publish real, approved client quotes.",
    endpoint: "/api/testimonials", adminEndpoint: "/api/admin/testimonials", perm: "testimonials", titleField: "client_name", publishField: "published", orderable: true,
    columns: [{ key: "photo", label: "", kind: "image" }, { key: "client_name", label: "Client" }, { key: "company", label: "Company" }, { key: "is_demo", label: "Demo", kind: "bool" }],
    fields: [
      { name: "client_name", label: "Client name", type: "text", required: true },
      { name: "designation", label: "Designation", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "rating", label: "Rating (1–5)", type: "number" },
      { name: "quote", label: "Testimonial", type: "textarea", required: true, full: true },
      { name: "photo", label: "Client photo", type: "image", tab: "media" },
      { name: "video_url", label: "Video URL", type: "url", tab: "media" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "is_demo", label: "Demo content", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
    ],
  },
  blog: {
    key: "blog", label: "Blog", singular: "Post", description: "Insights articles.",
    endpoint: "/api/blog", adminEndpoint: "/api/admin/blog", perm: "blog", titleField: "title",
    columns: [{ key: "title", label: "Title" }, { key: "category.name", label: "Category", kind: "badge" }, { key: "status", label: "Status", kind: "badge" }, { key: "published_at", label: "Published", kind: "date" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "category_id", label: "Category", type: "relation", source: "/api/admin/blog-categories", sourceLabel: "name" },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "content", label: "Content", type: "richtext", full: true },
      { name: "tags", label: "Tags", type: "tags", full: true },
      { name: "author_name", label: "Author", type: "text" },
      { name: "featured_image", label: "Featured image", type: "image", tab: "media" },
      { name: "status", label: "Status", type: "select", tab: "settings", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "scheduled", label: "Scheduled" }] },
      { name: "published_at", label: "Publish date", type: "datetime", tab: "settings" },
      { name: "is_demo", label: "Demo content", type: "boolean", tab: "settings" },
      ...SEO,
    ],
    fromRecord: (r) => ({ ...r, category_id: (r.category as { id?: number } | null)?.id ?? null, tags: Array.isArray(r.tags) ? r.tags.map((t) => (t as { name: string }).name) : [] }),
    viewPath: (r) => (r.status === "published" ? `/blog/${r.slug}` : null),
  },
  "blog-categories": {
    key: "blog-categories", label: "Blog Categories", singular: "Category", description: "Blog categories.",
    endpoint: "/api/blog-categories", adminEndpoint: "/api/admin/blog-categories", perm: "blog", titleField: "name",
    columns: [{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }, { key: "order", label: "Order" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  faqs: {
    key: "faqs", label: "FAQs", singular: "FAQ", description: "Frequently asked questions.",
    endpoint: "/api/faqs", adminEndpoint: "/api/admin/faqs", perm: "faqs", titleField: "question", publishField: "published", orderable: true,
    columns: [{ key: "question", label: "Question" }, { key: "category", label: "Category", kind: "badge" }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true, full: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, full: true },
      { name: "category", label: "Category", type: "text", hint: "Pricing, Delivery, Services, Support, Engagement, Technology" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
    ],
  },
  team: {
    key: "team", label: "Team", singular: "Team member", description: "Team section on the About page.",
    endpoint: "/api/team", adminEndpoint: "/api/admin/team", perm: "team", titleField: "name", publishField: "published", orderable: true,
    columns: [{ key: "photo", label: "", kind: "image" }, { key: "name", label: "Name" }, { key: "position", label: "Position" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "linkedin", label: "LinkedIn", type: "url" },
      { name: "github", label: "GitHub", type: "url" },
      { name: "bio", label: "Bio", type: "textarea", full: true },
      { name: "skills", label: "Skills", type: "tags", full: true },
      { name: "photo", label: "Photo", type: "image", tab: "media" },
      { name: "published", label: "Published", type: "boolean", tab: "settings" },
      { name: "order", label: "Order", type: "number", tab: "settings" },
    ],
  },
  "social-links": {
    key: "social-links", label: "Social Links", singular: "Social link", description: "Links in the footer.",
    endpoint: "/api/social-links", adminEndpoint: "/api/admin/social-links", perm: "settings", titleField: "platform", publishField: "published", orderable: true,
    columns: [{ key: "platform", label: "Platform" }, { key: "url", label: "URL" }],
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "URL", type: "url", required: true },
      { name: "published", label: "Published", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
};

/** Defaults for a brand-new record. */
export function blankRecord(res: Resource): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of res.fields) {
    if (f.type === "boolean") out[f.name] = f.name === "published" || f.name === "show_on_home";
    else if (f.type === "tags" || f.type === "objects" || f.type === "relations") out[f.name] = [];
    else if (f.type === "number") out[f.name] = 0;
    else if (f.type === "select") out[f.name] = f.options?.[0]?.value ?? "";
    else out[f.name] = "";
  }
  return out;
}
