"use client";

import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { adminApi } from "@/lib/admin-api";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

import { MediaPicker } from "./MediaPicker";
import type { Field } from "./resources";
import { RichText } from "./RichText";
import { Input, inputCls, Label, Select, Textarea, Toggle } from "./ui";

type V = unknown;

function TagsInput({ value, onChange, id }: { value: string[]; onChange: (v: string[]) => void; id: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(/\n|,(?=\s)/).map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setDraft("");
  };
  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="rounded-xl border border-line bg-night p-2">
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((t, i) => (
            <li key={`${t}-${i}`} className="group inline-flex items-center gap-1 rounded-lg bg-white/[.06] py-1 pr-1 pl-2.5 text-sm">
              {t}
              <button type="button" onClick={() => move(i, -1)} className="hidden rounded p-0.5 text-dim hover:text-ink group-hover:inline" aria-label={`Move ${t} left`}><ArrowUp className="h-3 w-3 -rotate-90" /></button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="rounded p-0.5 text-dim hover:text-red-300" aria-label={`Remove ${t}`}><X className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder="Type and press Enter"
        className="w-full bg-transparent px-1.5 py-1 text-sm placeholder:text-dim focus:outline-none"
      />
    </div>
  );
}

function ObjectsInput({ field, value, onChange }: { field: Field; value: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void }) {
  const of = field.of ?? [];
  const update = (i: number, k: string, v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [k]: v } : row)));
  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex gap-2 rounded-xl border border-line bg-night/60 p-2.5">
          <div className={cn("grid flex-1 gap-2", of.length > 2 ? "sm:grid-cols-2" : of.length === 2 ? "sm:grid-cols-[1fr_2fr]" : "")}>
            {of.map((sub) =>
              sub.type === "textarea" ? (
                <Textarea key={sub.name} aria-label={sub.label} placeholder={sub.label} value={row[sub.name] ?? ""} onChange={(e) => update(i, sub.name, e.target.value)} className="min-h-10" rows={2} />
              ) : sub.type === "select" ? (
                <Select key={sub.name} aria-label={sub.label} value={row[sub.name] ?? sub.options?.[0]} onChange={(e) => update(i, sub.name, e.target.value)}>
                  {sub.options?.map((o) => <option key={o}>{o}</option>)}
                </Select>
              ) : (
                <Input key={sub.name} aria-label={sub.label} placeholder={sub.label} value={row[sub.name] ?? ""} onChange={(e) => update(i, sub.name, e.target.value)} />
              ),
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => move(i, -1)} className="rounded p-1 text-dim hover:text-ink" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} className="rounded p-1 text-dim hover:text-ink" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded p-1 text-dim hover:text-red-300" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, Object.fromEntries(of.map((s) => [s.name, s.options?.[0] ?? ""]))])} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-aqua hover:bg-aqua/10">
        <Plus className="h-4 w-4" /> Add {field.label.toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  );
}

const optionCache = new Map<string, Promise<Record<string, unknown>[]>>();
function useOptions(source?: string) {
  const [opts, setOpts] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    if (!source) return;
    if (!optionCache.has(source)) optionCache.set(source, adminApi.get<Record<string, unknown>[]>(source).catch(() => []));
    void optionCache.get(source)!.then(setOpts);
  }, [source]);
  return opts;
}

function RelationsInput({ field, value, onChange }: { field: Field; value: number[]; onChange: (v: number[]) => void }) {
  const opts = useOptions(field.source);
  const label = field.sourceLabel ?? "name";
  return (
    <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-line bg-night p-2.5">
      {opts.length === 0 && <span className="text-sm text-dim">No options yet</span>}
      {opts.map((o) => {
        const id = o.id as number;
        const on = value.includes(id);
        return (
          <button key={id} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== id) : [...value, id])}
            className={cn("rounded-lg border px-2.5 py-1 text-sm transition-colors", on ? "border-aqua/50 bg-aqua/15 text-ink" : "border-line text-mute hover:text-ink")}>
            {String(o[label])}
          </button>
        );
      })}
    </div>
  );
}

function RelationInput({ field, value, onChange, id }: { field: Field; value: number | null; onChange: (v: number | null) => void; id: string }) {
  const opts = useOptions(field.source);
  const label = field.sourceLabel ?? "name";
  return (
    <Select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}>
      <option value="">— None —</option>
      {opts.map((o) => <option key={o.id as number} value={o.id as number}>{String(o[label])}</option>)}
    </Select>
  );
}

function ImageInput({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-3">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-night">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : <ImageIcon className="h-6 w-6 text-dim" />}
      </div>
      <div className="flex-1 space-y-2">
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /images/…" />
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:border-aqua/50">Choose / upload</button>
          {value && <button type="button" onClick={() => onChange("")} className="rounded-lg px-3 py-1.5 text-xs text-mute hover:text-red-300">Remove</button>}
        </div>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(m) => { onChange(m.url); setOpen(false); }} />
    </div>
  );
}

function toLocalInput(v: V) {
  if (!v || typeof v !== "string") return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

/** Renders one CMS field according to its type. */
export function FieldInput({ field, value, onChange }: { field: Field; value: V; onChange: (v: V) => void }) {
  const id = `f-${field.name}`;
  const str = (value ?? "") as string;
  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <Textarea id={id} value={str} onChange={(e) => onChange(e.target.value)} rows={4} />;
      break;
    case "richtext":
      control = <RichText value={str} onChange={onChange} label={field.label} />;
      break;
    case "number":
      control = <Input id={id} type="number" value={value === null || value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} />;
      break;
    case "boolean":
      return <Toggle checked={!!value} onChange={onChange} label={field.label} />;
    case "select":
      control = (
        <Select id={id} value={str} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      );
      break;
    case "icon":
      control = (
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line"><Icon name={str} className="h-5 w-5 text-aqua" /></span>
          <Select id={id} value={str} onChange={(e) => onChange(e.target.value)}>
            <option value="">— None —</option>
            {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </div>
      );
      break;
    case "tags":
      control = <TagsInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
      break;
    case "objects":
      control = <ObjectsInput field={field} value={Array.isArray(value) ? (value as Record<string, string>[]) : []} onChange={onChange} />;
      break;
    case "relations":
      control = <RelationsInput field={field} value={Array.isArray(value) ? (value as number[]) : []} onChange={onChange} />;
      break;
    case "relation":
      control = <RelationInput id={id} field={field} value={(value as number) ?? null} onChange={onChange} />;
      break;
    case "image":
      control = <ImageInput id={id} value={str} onChange={onChange} />;
      break;
    case "datetime":
      control = <Input id={id} type="datetime-local" value={toLocalInput(value)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} />;
      break;
    case "color":
      control = (
        <div className="flex gap-2">
          <input type="color" aria-label={`${field.label} picker`} value={str || "#7C3AED"} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-night" />
          <Input id={id} value={str} onChange={(e) => onChange(e.target.value)} placeholder="#7C3AED" />
        </div>
      );
      break;
    default:
      control = (
        <input
          id={id}
          type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
          className={inputCls}
          value={str}
          required={field.required}
          onChange={(e) => onChange(field.type === "slug" ? e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") : e.target.value)}
        />
      );
  }
  return (
    <div>
      <Label htmlFor={id} hint={field.hint}>{field.label}{field.required && <span className="text-aqua"> *</span>}</Label>
      {control}
    </div>
  );
}
