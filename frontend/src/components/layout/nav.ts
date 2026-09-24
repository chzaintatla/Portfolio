import type { SiteData } from "@/types";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}
export interface NavItem extends NavLink {
  children?: NavLink[];
}

/** Navigation structure. Service entries come from the CMS; the section structure is fixed. */
export function buildNav(site: SiteData): NavItem[] {
  const engineering = site.services.filter((s) => s.group === "engineering");
  const solutions = site.services.filter((s) => s.group !== "engineering");
  return [
    {
      label: "Services",
      href: "/services",
      children: engineering.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    },
    {
      label: "Solutions",
      href: "/industries",
      children: [
        ...solutions.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
        { label: "Industries", href: "/industries" },
      ],
    },
    { label: "Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "Technologies", href: "/technologies" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/blog" },
  ];
}
