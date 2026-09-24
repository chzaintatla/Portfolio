"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { FieldInput } from "@/components/admin/Fields";
import type { Field } from "@/components/admin/resources";
import { Badge, Btn, confirmDelete, Drawer, Empty, PageHeader, Skeleton } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import type { SeoRecord } from "@/types";

const FIELDS: Field[] = [
  { name: "path", label: "Path", type: "text", required: true, hint: "e.g. /services" },
  { name: "title", label: "SEO title", type: "text", hint: "≈ 60 characters" },
  { name: "description", label: "Meta description", type: "textarea", hint: "≈ 155 characters" },
  { name: "keywords", label: "Keywords", type: "text" },
  { name: "canonical_url", label: "Canonical URL", type: "url" },
  { name: "og_title", label: "Open Graph title", type: "text" },
  { name: "og_description", label: "Open Graph description", type: "textarea" },
  { name: "og_image", label: "Open Graph image", type: "image" },
  { name: "twitter_card", label: "Twitter card", type: "select", options: [{ value: "summary_large_image", label: "Large image" }, { value: "summary", label: "Summary" }] },
  { name: "noindex", label: "Hide from search engines (noindex)", type: "boolean" },
];

export default function SeoPage() {
  const { can } = useAuth();
  const [rows, setRows] = useState<SeoRecord[] | null>(null);
  const [edit, setEdit] = useState<Partial<SeoRecord> | null>(null);
  const [schema, setSchema] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => adminApi.get<SeoRecord[]>("/api/admin/seo").then(setRows).catch((e: Error) => toast.error(e.message)), []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const open = (r: Partial<SeoRecord>) => {
    setEdit(r);
    setSchema(r.structured_data ? JSON.stringify(r.structured_data, null, 2) : "");
  };

  async function save() {
    if (!edit?.path) return toast.error("Path is required");
    let structured_data: unknown = null;
    if (schema.trim()) {
      try {
        structured_data = JSON.parse(schema);
      } catch {
        return toast.error("Structured data must be valid JSON");
      }
    }
    setSaving(true);
    try {
      const payload = Object.fromEntries(FIELDS.map((f) => [f.name, (edit as Record<string, unknown>)[f.name] === "" ? null : (edit as Record<string, unknown>)[f.name]]));
      await adminApi.put("/api/admin/seo", { ...payload, twitter_card: edit.twitter_card || "summary_large_image", noindex: !!edit.noindex, structured_data });
      toast.success("SEO saved");
      setEdit(null);
      void load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(r: SeoRecord) {
    if (!confirmDelete(`SEO for ${r.path}`)) return;
    await adminApi.del(`/api/admin/seo/${r.id}`).then(load).catch((e: Error) => toast.error(e.message));
  }

  return (
    <>
      <PageHeader
        title="SEO"
        description="Metadata for static pages. Projects, services, industries and posts carry their own SEO fields. The sitemap and robots.txt are generated automatically."
        actions={can("seo:write") && <Btn variant="primary" onClick={() => open({ path: "/", twitter_card: "summary_large_image" })}><Plus className="h-4 w-4" /> Add page</Btn>}
      />
      <p className="mb-4 text-sm text-mute">
        <a href="/sitemap.xml" target="_blank" className="text-aqua hover:underline">View sitemap.xml</a> · <a href="/robots.txt" target="_blank" className="text-aqua hover:underline">View robots.txt</a>
      </p>
      {!rows ? <Skeleton className="h-64" /> : rows.length === 0 ? <Empty>No page metadata yet.</Empty> : (
        <div className="hairline overflow-x-auto rounded-2xl bg-card/60">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line text-left text-xs text-dim"><tr><th className="px-4 py-3">Path</th><th>Title</th><th>Description</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{r.path} {r.noindex && <Badge tone="red">noindex</Badge>}</td>
                  <td className="max-w-xs truncate pr-3">{r.title ?? "—"}</td>
                  <td className="max-w-sm truncate pr-3 text-mute">{r.description ?? "—"}</td>
                  <td className="pr-3 text-right whitespace-nowrap">
                    <Btn variant="ghost" onClick={() => open(r)}>Edit</Btn>
                    {can("seo:delete") && <Btn variant="ghost" className="hover:!text-red-300" onClick={() => remove(r)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? `SEO · ${edit.path}` : "New page SEO"}>
        {edit && (
          <fieldset disabled={!can("seo:write")} className="space-y-4">
            {FIELDS.map((f) => (
              <FieldInput key={f.name} field={f} value={(edit as Record<string, unknown>)[f.name] ?? (f.type === "boolean" ? false : "")} onChange={(v) => setEdit((s) => ({ ...s!, [f.name]: v }))} />
            ))}
            <div>
              <label htmlFor="schema" className="mb-1.5 block text-xs font-medium text-mute">Structured data (JSON-LD)</label>
              <textarea id="schema" value={schema} onChange={(e) => setSchema(e.target.value)} rows={6} className="w-full rounded-xl border border-line bg-night p-3 font-mono text-xs" placeholder='{"@context":"https://schema.org", ...}' />
            </div>
            <Btn variant="primary" onClick={save} loading={saving}>Save</Btn>
          </fieldset>
        )}
      </Drawer>
    </>
  );
}
