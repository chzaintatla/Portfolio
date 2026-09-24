"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/admin/AuthContext";
import { DashboardView } from "@/components/admin/DashboardView";
import { Badge, Btn, Card } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";
import type { AuditLog, Page } from "@/types";

function AuditTrail() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<AuditLog> | null>(null);
  useEffect(() => {
    adminApi.get<Page<AuditLog>>(`/api/admin/audit-logs?page=${page}&page_size=25`).then(setData).catch(() => setData(null));
  }, [page]);
  if (!data) return null;
  const pages = Math.max(1, Math.ceil(data.total / 25));
  return (
    <Card title="Audit log" className="mt-4" action={<span className="text-xs text-dim">{data.total} events</span>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-dim"><tr><th className="py-2">When</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
          <tbody>
            {data.items.map((l) => (
              <tr key={l.id} className="border-t border-line/60">
                <td className="py-2 pr-3 whitespace-nowrap text-mute">{formatDate(l.created_at, { dateStyle: "short", timeStyle: "short" })}</td>
                <td className="pr-3">{l.user_email ?? "—"}</td>
                <td className="pr-3"><Badge tone={l.action === "delete" ? "red" : l.action.startsWith("login") ? "blue" : "default"}>{l.action}</Badge></td>
                <td className="pr-3">{l.entity}{l.entity_id ? ` #${l.entity_id}` : ""}</td>
                <td className="max-w-xs truncate text-mute">{l.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Btn disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Btn>
          <span className="text-mute">{page} / {pages}</span>
          <Btn disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Btn>
        </div>
      )}
    </Card>
  );
}

export default function AnalyticsPage() {
  const { can } = useAuth();
  return (
    <>
      <DashboardView title="Analytics" detailed />
      {can("users:read") && <AuditTrail />}
      <p className="mt-6 text-xs text-dim">
        First-party analytics are collected by the site itself. Google Analytics and Meta Pixel IDs can be set in Settings → Analytics.
      </p>
    </>
  );
}
