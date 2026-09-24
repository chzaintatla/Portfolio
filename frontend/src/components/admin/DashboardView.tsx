"use client";

import { BookOpen, Boxes, Briefcase, Eye, Inbox, MessageSquareQuote, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminApi } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";
import type { Dashboard } from "@/types";

import { BarsChart, TrendChart } from "./charts";
import { Badge, Card, PageHeader, Select, Skeleton } from "./ui";

export const STATUS_TONE = { new: "blue", contacted: "violet", qualified: "amber", proposal: "amber", won: "green", lost: "red" } as const;

export function DashboardView({ title = "Dashboard", detailed = false }: { title?: string; detailed?: boolean }) {
  const [days, setDays] = useState(30);
  const [d, setD] = useState<Dashboard | null>(null);

  useEffect(() => {
    adminApi.get<Dashboard>(`/api/admin/dashboard?days=${days}`).then(setD).catch((e: Error) => toast.error(e.message));
  }, [days]);

  const tiles = d
    ? [
        { label: "Total leads", value: d.totals.leads, icon: Inbox, href: "/admin/leads" },
        { label: "New leads", value: d.totals.new_leads, icon: Sparkles, href: "/admin/leads?status=new" },
        { label: "Win rate", value: `${d.totals.win_rate}%`, icon: Trophy },
        { label: `Page views (${d.days}d)`, value: d.totals.page_views.toLocaleString(), icon: Eye },
        { label: "Projects", value: d.totals.projects, icon: Briefcase, href: "/admin/projects" },
        { label: "Services", value: d.totals.services, icon: Boxes, href: "/admin/services" },
        { label: "Blog posts", value: d.totals.blog_posts, icon: BookOpen, href: "/admin/blog" },
        { label: "Testimonials", value: d.totals.testimonials, icon: MessageSquareQuote, href: "/admin/testimonials" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title={title}
        description="Leads, traffic and content at a glance."
        actions={
          <Select aria-label="Period" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-36">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </Select>
        }
      />
      {!d ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {tiles.map((t) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between text-xs text-mute">
                    {t.label}
                    <t.icon className="h-4 w-4 text-aqua" />
                  </div>
                  <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{t.value}</p>
                </>
              );
              return t.href ? (
                <Link key={t.label} href={t.href} className="hairline rounded-2xl bg-card/70 p-5 transition-colors hover:border-line-hi">{inner}</Link>
              ) : (
                <div key={t.label} className="hairline rounded-2xl bg-card/70 p-5">{inner}</div>
              );
            })}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Card title="Leads over time"><TrendChart data={d.lead_trend} name="Leads" color="#7C3AED" /></Card>
            <Card title="Page views"><TrendChart data={d.view_trend} name="Views" /></Card>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card title="Pipeline" className="xl:col-span-2"><BarsChart data={d.pipeline} xKey="status" yKey="count" name="Leads" /></Card>
            <Card title="Lead sources"><BarsChart data={d.lead_sources} xKey="source" yKey="count" name="Leads" horizontal /></Card>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card title="Popular projects">
              <ol className="space-y-2 text-sm">
                {d.popular_projects.map((p) => (
                  <li key={p.slug} className="flex justify-between gap-2"><span className="truncate">{p.title}</span><span className="text-mute tabular-nums">{p.views}</span></li>
                ))}
              </ol>
            </Card>
            <Card title="Popular services">
              <ol className="space-y-2 text-sm">
                {d.popular_services.map((p) => (
                  <li key={p.slug} className="flex justify-between gap-2"><span className="truncate">{p.title}</span><span className="text-mute tabular-nums">{p.views}</span></li>
                ))}
              </ol>
            </Card>
            <Card title="Upcoming follow-ups">
              {d.upcoming_follow_ups.length === 0 ? <p className="text-sm text-dim">Nothing scheduled.</p> : (
                <ul className="space-y-2 text-sm">
                  {d.upcoming_follow_ups.map((f) => (
                    <li key={f.id}>
                      <Link href={`/admin/leads/${f.id}`} className="flex items-center justify-between gap-2 hover:text-aqua">
                        <span className="truncate">{f.name}</span>
                        <span className="flex items-center gap-2 text-xs text-mute">{formatDate(f.date)} <Badge tone={STATUS_TONE[f.status]}>{f.status}</Badge></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
          {detailed && (
            <Card title="CTA clicks"><BarsChart data={d.cta_clicks} xKey="label" yKey="count" name="Clicks" horizontal /></Card>
          )}
        </div>
      )}
    </>
  );
}
