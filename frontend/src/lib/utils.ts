import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path = "/") => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function formatDate(value?: string | null, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", opts).format(new Date(value));
}

export function stripHtml(html?: string | null) {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
