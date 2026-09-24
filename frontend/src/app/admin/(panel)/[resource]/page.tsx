"use client";

import { ArrowDown, ArrowUp, Check, ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { BlogPlanner } from "@/components/admin/BlogPlanner";
import { type Column, RESOURCES } from "@/components/admin/resources";
import { Badge, Btn, confirmDelete, Empty, Input, PageHeader, Skeleton, Toggle } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

type Row = Record<string, unknown> & { id: number };

const get = (r: Row, path: string) => path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | null)?.[k], r);

function Cell({ row, col }: { row: Row; col: Column }) {
  const v = get(row, col.key);
  switch (col.kind) {
    case "bool":
      return v ? <Check className="h-4 w-4 text-aqua" /> : <span className="text-dim">—</span>;
    case "badge":
      return v ? <Badge tone={v === "published" ? "green" : v === "draft" ? "amber" : "default"}>{String(v)}</Badge> : null;
    case "date":
      return <span className="text-mute">{formatDate(v as string) || "—"}</span>;
    case "count":
      return <span className="text-mute">{Array.isArray(v) ? v.length : 0}</span>;
    case "image":
      return v ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(v)} alt="" className="h-9 w-9 rounded-lg object-cover" />
      ) : <span className="block h-9 w-9 rounded-lg bg-white/5" />;
    default:
      return <span className="line-clamp-1">{v === null || v === undefined || v === "" ? "—" : String(v)}</span>;
  }
}

export default function ResourceListPage() {
  const { resource } = useParams<{ resource: string }>();
  const res = RESOURCES[resource];
  const { can } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    if (!res) return;
    try {
      setRows(await adminApi.get<Row[]>(res.adminEndpoint));
    } catch (e) {
      toast.error((e as Error).message);
      setRows([]);
    }
  }, [res]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows || !res) return [];
    const needle = q.trim().toLowerCase();
    return needle ? rows.filter((r) => JSON.stringify([r[res.titleField], r.slug, r.category]).toLowerCase().includes(needle)) : rows;
  }, [rows, q, res]);

  if (!res) notFound();
  const writable = can(`${res.perm}:write`);
  const deletable = can(`${res.perm}:delete`);

  async function togglePublish(row: Row) {
    if (!res.publishField) return;
    const next = !row[res.publishField];
    setRows((rs) => rs?.map((r) => (r.id === row.id ? { ...r, [res.publishField!]: next } : r)) ?? null);
    try {
      await adminApi.put(`${res.endpoint}/${row.id}`, { [res.publishField]: next });
      toast.success(next ? "Published" : "Unpublished");
    } catch (e) {
      toast.error((e as Error).message);
      void load();
    }
  }

  async function move(index: number, dir: number) {
    if (!rows) return;
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[index], next[j]] = [next[j], next[index]];
    setRows(next);
    try {
      await adminApi.put(`${res.endpoint}/reorder`, next.map((r, i) => ({ id: r.id, order: i })));
    } catch (e) {
      toast.error((e as Error).message);
      void load();
    }
  }

  async function remove(row: Row) {
    if (!confirmDelete(`"${String(row[res.titleField])}"`)) return;
    try {
      await adminApi.del(`${res.endpoint}/${row.id}`);
      setRows((rs) => rs?.filter((r) => r.id !== row.id) ?? null);
      toast.success("Deleted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const canReorder = res.orderable && writable && !q;

  return (
    <>
      <PageHeader
        title={res.label}
        description={res.description}
        actions={<>{res.links?.map((l) => (
          <Link key={l.href} href={l.href} className="inline-flex items-center rounded-xl border border-line px-4 py-2.5 text-sm hover:border-line-hi">{l.label}</Link>
        ))}{writable && (
          <Link href={`/admin/${res.key}/new`} className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-midnight hover:bg-white">
            <Plus className="h-4 w-4" /> New {res.singular.toLowerCase()}
          </Link>
        )}</>}
      />
      {res.key === "blog" && <BlogPlanner />}
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-dim" />
        <Input className="pl-9" placeholder={`Search ${res.label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
      </div>

      {rows === null ? (
        <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : filtered.length === 0 ? (
        <Empty>{q ? "No matches." : `No ${res.label.toLowerCase()} yet.`}</Empty>
      ) : (
        <div className="hairline overflow-x-auto rounded-2xl bg-card/60">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line text-left text-xs text-dim">
              <tr>
                {canReorder && <th className="w-16 px-3 py-3 font-medium">Order</th>}
                {res.columns.map((c) => <th key={c.key} className="px-3 py-3 font-medium">{c.label}</th>)}
                {res.publishField && <th className="px-3 py-3 font-medium">Published</th>}
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className="border-b border-line/60 last:border-0 hover:bg-white/[.02]">
                  {canReorder && (
                    <td className="px-3 py-2">
                      <div className="flex gap-0.5">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-dim hover:text-ink disabled:opacity-30" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === filtered.length - 1} className="rounded p-1 text-dim hover:text-ink disabled:opacity-30" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  )}
                  {res.columns.map((c) => (
                    <td key={c.key} className="px-3 py-2.5">
                      {c.key === res.titleField ? (
                        <Link href={`/admin/${res.key}/${row.id}`} className="font-medium hover:text-aqua"><Cell row={row} col={c} /></Link>
                      ) : <Cell row={row} col={c} />}
                    </td>
                  ))}
                  {res.publishField && (
                    <td className="px-3 py-2">
                      {writable ? <Toggle checked={!!row[res.publishField]} onChange={() => togglePublish(row)} /> : row[res.publishField] ? "Yes" : "No"}
                    </td>
                  )}
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      {res.viewPath?.(row) && (
                        <a href={res.viewPath(row)!} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-dim hover:bg-white/5 hover:text-ink" aria-label="View on site"><ExternalLink className="h-4 w-4" /></a>
                      )}
                      <Link href={`/admin/${res.key}/${row.id}`} className="rounded-lg p-2 text-dim hover:bg-white/5 hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                      {deletable && (
                        <Btn variant="ghost" className="!p-2 hover:!text-red-300" onClick={() => remove(row)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
