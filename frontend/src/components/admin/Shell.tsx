"use client";

import {
  BarChart3, Boxes, BookOpen, Briefcase, Building2, Cpu, FolderTree, HelpCircle, Image as ImageIcon, Inbox,
  KeyRound, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Search, Settings, Shield, Users, UsersRound, Workflow,
  Handshake, ExternalLink, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

import { useAuth } from "./AuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, perm: "analytics:read" },
  { href: "/admin/leads", label: "Leads", icon: Inbox, perm: "leads:read" },
  { section: "Content" },
  { href: "/admin/projects", label: "Projects", icon: Briefcase, perm: "projects:read" },
  { href: "/admin/services", label: "Services", icon: Boxes, perm: "services:read" },
  { href: "/admin/industries", label: "Industries", icon: Building2, perm: "industries:read" },
  { href: "/admin/technologies", label: "Technologies", icon: Cpu, perm: "technologies:read" },
  { href: "/admin/process", label: "Process", icon: Workflow, perm: "process:read" },
  { href: "/admin/engagement-models", label: "Engagement Models", icon: Handshake, perm: "engagement-models:read" },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, perm: "testimonials:read" },
  { href: "/admin/blog", label: "Blog", icon: BookOpen, perm: "blog:read" },
  { href: "/admin/blog-categories", label: "Categories", icon: FolderTree, perm: "blog:read" },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, perm: "faqs:read" },
  { href: "/admin/media", label: "Media", icon: ImageIcon, perm: "media:read" },
  { href: "/admin/team", label: "Team", icon: UsersRound, perm: "team:read" },
  { section: "Site" },
  { href: "/admin/seo", label: "SEO", icon: Search, perm: "seo:read" },
  { href: "/admin/settings", label: "Settings", icon: Settings, perm: "settings:read" },
  { href: "/admin/users", label: "Users", icon: Users, perm: "users:read" },
  { href: "/admin/roles", label: "Roles", icon: KeyRound, perm: "roles:read" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, perm: "analytics:read" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, can, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  const items = NAV.filter((n) => "section" in n || can(n.perm));
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin"><Logo /></Link>
        <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {items.map((n, i) =>
          "section" in n ? (
            <li key={i} className="px-3 pt-5 pb-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-dim uppercase">{n.section}</li>
          ) : (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  isActive(n.href) ? "bg-white/[.07] text-ink" : "text-mute hover:bg-white/[.03] hover:text-ink",
                )}
              >
                <n.icon className={cn("h-4 w-4", isActive(n.href) && "text-aqua")} aria-hidden="true" />
                {n.label}
              </Link>
            </li>
          ),
        )}
      </ul>
      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua text-sm font-semibold">{user?.name.charAt(0)}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-dim"><Shield className="h-3 w-3" /> {user?.role?.name ?? "No role"}</p>
          </div>
          <button type="button" onClick={logout} className="rounded-lg p-2 text-mute hover:bg-white/5 hover:text-ink" aria-label="Sign out" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-midnight lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-night lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 border-r border-line bg-night" onClick={(e) => e.stopPropagation()}>{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-midnight/80 px-4 backdrop-blur md:px-8">
          <button type="button" className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="hidden text-sm text-dim lg:block">SparkWave CMS</span>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
            View site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
