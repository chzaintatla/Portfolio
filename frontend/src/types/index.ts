// Types mirror the FastAPI response schemas in backend/app/schemas/__init__.py.

export interface Seo {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
}

export interface Result {
  label: string;
  value: string;
}
export interface Step {
  title: string;
  description?: string | null;
}

export interface TechCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
}
export interface TechnologyRef {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
}
export interface Technology extends TechnologyRef {
  category: TechCategory | null;
  description?: string | null;
  website?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface ServiceRef {
  id: number;
  title: string;
  slug: string;
  icon?: string | null;
}
export interface ProjectRef {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  thumbnail?: string | null;
  short_description?: string | null;
}

export interface Service extends Seo {
  id: number;
  title: string;
  slug: string;
  number?: string | null;
  group: "engineering" | "ai" | "growth" | string;
  tagline?: string | null;
  description?: string | null;
  body?: string | null;
  icon?: string | null;
  hero_image?: string | null;
  benefits: string[];
  process: Step[];
  deliverables: string[];
  platforms: string[];
  features: { title: string; description?: string | null }[];
  technologies: TechnologyRef[];
  projects: ProjectRef[];
  show_on_home: boolean;
  published: boolean;
  order: number;
}

export interface ProjectImage {
  url: string;
  alt?: string | null;
  caption?: string | null;
  kind: string;
}
export interface ProjectCard {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  industry?: string | null;
  short_description?: string | null;
  thumbnail?: string | null;
  accent?: string | null;
  featured: boolean;
  is_demo: boolean;
  platforms: string[];
  technologies: TechnologyRef[];
  results: Result[];
}
export interface Project extends ProjectCard, Seo {
  client?: string | null;
  role?: string | null;
  long_description?: string | null;
  challenge?: string | null;
  solution?: string | null;
  design_notes?: string | null;
  development_notes?: string | null;
  architecture?: string | null;
  features: string[];
  hero_image?: string | null;
  video_url?: string | null;
  external_url?: string | null;
  images: ProjectImage[];
  services: ServiceRef[];
  published: boolean;
  order: number;
}

export interface Industry extends Seo {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  image?: string | null;
  description?: string | null;
  solutions: string[];
  challenges: string[];
  published: boolean;
  order: number;
}

export interface ProcessStage {
  id: number;
  number: string;
  stage: string;
  title: string;
  description?: string | null;
  duration?: string | null;
  icon?: string | null;
  activities: string[];
  deliverables: string[];
  team: string[];
  technologies: string[];
  published: boolean;
  order: number;
}

export interface EngagementModel {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  best_for: string[];
  included: string[];
  model?: string | null;
  cta_label: string;
  highlighted: boolean;
  published: boolean;
  order: number;
}

export interface Testimonial {
  id: number;
  client_name: string;
  designation?: string | null;
  company?: string | null;
  photo?: string | null;
  quote: string;
  video_url?: string | null;
  rating?: number | null;
  published: boolean;
  order: number;
  is_demo: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  published: boolean;
  order: number;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  photo?: string | null;
  bio?: string | null;
  skills: string[];
  linkedin?: string | null;
  github?: string | null;
  email?: string | null;
  published: boolean;
  order: number;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  order?: number;
  count?: number;
}
export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}
export interface BlogPostCard {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  author_name?: string | null;
  category?: BlogCategory | null;
  tags: BlogTag[];
  published_at?: string | null;
  reading_minutes: number;
  status: string;
}
export interface BlogPost extends BlogPostCard, Seo {
  content: string;
  is_demo: boolean;
}

export interface DailyGroup {
  date: string;
  posts: BlogPostCard[];
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  company_description?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_location?: string;
  booking_url?: string;
  hero_eyebrow?: string;
  hero_headline?: string;
  hero_subtext?: string;
  about_heading?: string;
  about_body?: string;
  cta_headline?: string;
  cta_subtext?: string;
  stats?: Stat[];
  budgets?: string[];
  timelines?: string[];
  referral_options?: string[];
  ga_measurement_id?: string;
  meta_pixel_id?: string;
  google_site_verification?: string;
  [key: string]: unknown;
}

export interface SiteData {
  settings: SiteSettings;
  socials: { platform: string; url: string }[];
  services: { title: string; slug: string; group: string }[];
}

export interface SeoRecord {
  id: number;
  path: string;
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_card: string;
  structured_data?: Record<string, unknown> | null;
  noindex: boolean;
}

// ---------------------------------------------------------------- admin
export interface Role {
  id: number;
  name: string;
  description?: string | null;
  permissions: string[];
}
export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  role: Role | null;
  last_login_at?: string | null;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export interface LeadNote {
  id: number;
  body: string;
  author_name?: string | null;
  created_at: string;
}
export interface Lead {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string;
  referral?: string | null;
  source: string;
  page?: string | null;
  status: LeadStatus;
  priority: "low" | "medium" | "high";
  follow_up_date?: string | null;
  assigned_to_id?: number | null;
  notes: LeadNote[];
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  filename: string;
  url: string;
  folder: string;
  mime_type: string;
  size: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  created_at: string;
}

export interface Dashboard {
  totals: {
    leads: number;
    new_leads: number;
    projects: number;
    services: number;
    blog_posts: number;
    testimonials: number;
    page_views: number;
    win_rate: number;
  };
  lead_trend: { date: string; count: number }[];
  view_trend: { date: string; count: number }[];
  pipeline: { status: LeadStatus; count: number }[];
  lead_sources: { source: string; count: number }[];
  popular_projects: { title: string; slug: string; views: number }[];
  popular_services: { title: string; slug: string; views: number }[];
  cta_clicks: { label: string; count: number }[];
  upcoming_follow_ups: { id: number; name: string; date: string; status: LeadStatus }[];
  days: number;
}

export interface AuditLog {
  id: number;
  user_email?: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  summary?: string | null;
  ip?: string | null;
  created_at: string;
}
