"use client";

import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { FieldInput } from "@/components/admin/Fields";
import { blankRecord, type Field, RESOURCES } from "@/components/admin/resources";
import { Btn, Card, PageHeader } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "content", label: "Content" },
  { key: "media", label: "Media" },
  { key: "settings", label: "Settings" },
  { key: "seo", label: "SEO" },
] as const;

/** Only send editable fields; empty optional strings become null so typed columns validate. */
function toPayload(fields: Field[], values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    let v = values[f.name];
    if (v === "" && !f.required && f.type !== "richtext") v = null;
    if (f.type === "richtext" && v === null) v = "";
    if (f.type === "objects" && Array.isArray(v)) v = v.filter((row) => Object.values(row as object).some((x) => String(x ?? "").trim()));
    out[f.name] = v;
  }
  return out;
}

export default function ResourceEditPage() {
  const { resource, id } = useParams<{ resource: string; id: string }>();
  const res = RESOURCES[resource];
  const isNew = id === "new";
  const router = useRouter();
  const sp = useSearchParams();
  const { can } = useAuth();
  const [values, setValues] = useState<Record<string, unknown> | null>(() => {
    if (!isNew || !res) return null;
    const blank = blankRecord(res);
    // Daily planner links pass ?date=YYYY-MM-DD (and optionally ?title=) for a post on that day.
    const date = sp.get("date");
    if (res.key === "blog" && date) {
      const at = new Date(`${date}T09:00:00`);
      const future = at.getTime() > Date.now();
      Object.assign(blank, { published_at: at.toISOString(), status: future ? "scheduled" : "published" });
    }
    if (sp.get("title")) blank[res.titleField] = sp.get("title");
    return blank;
  });
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("content");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!res || isNew) return;
    adminApi
      .get<Record<string, unknown>>(`${res.adminEndpoint}/${id}`)
      .then((r) => setValues(res.fromRecord ? res.fromRecord(r) : r))
      .catch((e: Error) => toast.error(e.message));
  }, [res, id, isNew]);

  const tabs = useMemo(() => TABS.filter((t) => res?.fields.some((f) => (f.tab ?? "content") === t.key)), [res]);
  if (!res) notFound();
  const writable = can(`${res.perm}:write`);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    const missing = res.fields.find((f) => f.required && !String(values[f.name] ?? "").trim());
    if (missing) {
      setTab((missing.tab ?? "content") as typeof tab);
      toast.error(`${missing.label} is required`);
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload(res.fields, values);
      const saved = isNew
        ? await adminApi.post<Record<string, unknown>>(res.endpoint, payload)
        : await adminApi.put<Record<string, unknown>>(`${res.endpoint}/${id}`, payload);
      toast.success(isNew ? `${res.singular} created` : "Changes saved — the site updates automatically");
      if (isNew) router.replace(`/admin/${res.key}/${saved.id}`);
      else setValues(res.fromRecord ? res.fromRecord(saved) : saved);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const title = isNew ? `New ${res.singular.toLowerCase()}` : String(values?.[res.titleField] ?? res.singular);
  const view = !isNew && values ? res.viewPath?.(values) : null;

  return (
    <form onSubmit={onSubmit}>
      <Link href={`/admin/${res.key}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {res.label}
      </Link>
      <PageHeader
        title={title}
        actions={
          <>
            {view && (
              <a href={view} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm hover:border-line-hi">
                View <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {writable && <Btn type="submit" variant="primary" loading={saving}>{isNew ? "Create" : "Save changes"}</Btn>}
          </>
        }
      />
      {!values ? (
        <Loader2 className="mx-auto mt-16 h-6 w-6 animate-spin text-aqua" />
      ) : (
        <>
          {tabs.length > 1 && (
            <div role="tablist" className="mb-4 flex gap-1 border-b border-line">
              {tabs.map((t) => (
                <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
                  className={cn("-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors", tab === t.key ? "border-aqua text-ink" : "border-transparent text-mute hover:text-ink")}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <Card>
            <fieldset disabled={!writable} className="grid gap-5 md:grid-cols-2">
              {res.fields.filter((f) => (f.tab ?? "content") === tab).map((f) => (
                <div key={f.name} className={cn(f.full && "md:col-span-2")}>
                  <FieldInput field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s!, [f.name]: v }))} />
                </div>
              ))}
            </fieldset>
          </Card>
          {writable && (
            <div className="sticky bottom-4 mt-6 flex justify-end">
              <Btn type="submit" variant="primary" loading={saving} className="shadow-2xl shadow-black/60">{isNew ? "Create" : "Save changes"}</Btn>
            </div>
          )}
        </>
      )}
    </form>
  );
}
