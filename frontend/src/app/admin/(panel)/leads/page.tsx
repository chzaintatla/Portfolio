"use client";

import { Download, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { STATUS_TONE } from "@/components/admin/DashboardView";
import { Badge, Btn, Empty, Input, PageHeader, Select, Skeleton } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { cn, formatDate } from "@/lib/utils";
import type { Lead, LeadStatus, Page } from "@/types";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

function LeadsTable() {
  const sp = useSearchParams();
  const router = useRouter();
  const status = sp.get("status") ?? "";
  const priority = sp.get("priority") ?? "";
  const page = Number(sp.get("page") ?? 1);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [data, setData] = useState<Page<Lead> | null>(null);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(sp);
    if (v) next.set(k, v);
    else next.delete(k);
    if (k !== "page") next.delete("page");
    router.replace(`/admin/leads?${next}`);
  };

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), page_size: "25" });
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (sp.get("q")) params.set("q", sp.get("q")!);
    adminApi.get<Page<Lead>>(`/api/admin/leads?${params}`).then(setData).catch((e: Error) => toast.error(e.message));
  }, [page, status, priority, sp]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <>
      <PageHeader
        title="Leads"
        description="Every contact form submission becomes a lead."
        actions={<a href="/api/admin/leads/export" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm hover:border-line-hi"><Download className="h-4 w-4" /> Export CSV</a>}
      />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {["", ...STATUSES].map((s) => (
          <button key={s || "all"} type="button" onClick={() => setParam("status", s)}
            className={cn("rounded-full border px-3 py-1.5 text-xs capitalize", status === s ? "border-aqua/50 bg-aqua/10" : "border-line text-mute hover:text-ink")}>
            {s || "All"}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <form onSubmit={(e) => { e.preventDefault(); setParam("q", q); }} className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-dim" />
          <Input className="pl-9" placeholder="Search name, email, company" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search leads" />
        </form>
        <Select aria-label="Priority" value={priority} onChange={(e) => setParam("priority", e.target.value)} className="w-40">
          <option value="">Any priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      {!data ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : data.items.length === 0 ? (
        <Empty>No leads match these filters.</Empty>
      ) : (
        <div className="hairline overflow-x-auto rounded-2xl bg-card/60">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line text-left text-xs text-dim">
              <tr><th className="px-4 py-3">Lead</th><th>Service</th><th>Budget</th><th>Source</th><th>Priority</th><th>Status</th><th>Received</th></tr>
            </thead>
            <tbody>
              {data.items.map((l) => (
                <tr key={l.id} className="border-b border-line/60 last:border-0 hover:bg-white/[.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-medium hover:text-aqua">{l.name}</Link>
                    <p className="text-xs text-mute">{l.company ? `${l.company} · ` : ""}{l.email}</p>
                  </td>
                  <td className="pr-3 text-mute">{l.service ?? "—"}</td>
                  <td className="pr-3 text-mute">{l.budget ?? "—"}</td>
                  <td className="pr-3"><Badge>{l.source}</Badge></td>
                  <td className="pr-3"><Badge tone={l.priority === "high" ? "red" : l.priority === "low" ? "default" : "amber"}>{l.priority}</Badge></td>
                  <td className="pr-3"><Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge></td>
                  <td className="pr-4 whitespace-nowrap text-mute">{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Btn disabled={page <= 1} onClick={() => setParam("page", String(page - 1))}>Previous</Btn>
          <span className="text-mute">{page} / {pages}</span>
          <Btn disabled={page >= pages} onClick={() => setParam("page", String(page + 1))}>Next</Btn>
        </div>
      )}
    </>
  );
}

export default function LeadsPage() {
  return (
    <Suspense>
      <LeadsTable />
    </Suspense>
  );
}
