"use client";

import { ArrowLeft, Loader2, Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { Btn, Card, confirmDelete, Input, Label, PageHeader, Select, Textarea } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";
import type { Lead, User } from "@/types";

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { can } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const writable = can("leads:write");

  useEffect(() => {
    adminApi.get<Lead>(`/api/admin/leads/${id}`).then(setLead).catch((e: Error) => toast.error(e.message));
    if (can("users:read")) adminApi.get<User[]>("/api/admin/users").then(setUsers).catch(() => undefined);
  }, [id, can]);

  async function update(patch: Partial<Lead>) {
    if (!lead) return;
    setLead({ ...lead, ...patch });
    try {
      setLead(await adminApi.put<Lead>(`/api/admin/leads/${id}`, patch));
      toast.success("Lead updated");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function addNote(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      setLead(await adminApi.post<Lead>(`/api/admin/leads/${id}/notes`, { body: note }));
      setNote("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!lead || !confirmDelete(`the lead from ${lead.name}`)) return;
    try {
      await adminApi.del(`/api/admin/leads/${id}`);
      toast.success("Lead deleted");
      router.replace("/admin/leads");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  if (!lead) return <Loader2 className="mx-auto mt-20 h-6 w-6 animate-spin text-aqua" />;

  const info = [
    ["Company", lead.company], ["Service", lead.service], ["Budget", lead.budget], ["Timeline", lead.timeline],
    ["Heard about us", lead.referral], ["Source", lead.source], ["Page", lead.page], ["Received", formatDate(lead.created_at, { dateStyle: "medium", timeStyle: "short" })],
  ].filter(([, v]) => v);

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-mute hover:text-ink"><ArrowLeft className="h-4 w-4" /> Leads</Link>
      <PageHeader
        title={lead.name}
        description={lead.email}
        actions={
          <>
            <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm hover:border-line-hi"><Mail className="h-4 w-4" /> Email</a>
            {lead.phone && <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm hover:border-line-hi"><Phone className="h-4 w-4" /> Call</a>}
            {can("leads:delete") && <Btn variant="danger" onClick={remove}><Trash2 className="h-4 w-4" /> Delete</Btn>}
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card title="Message">
            <p className="whitespace-pre-wrap text-ink/90">{lead.message}</p>
            <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
              {info.map(([k, v]) => (
                <div key={k}><dt className="text-xs text-dim">{k}</dt><dd className="mt-0.5 text-sm break-words">{v}</dd></div>
              ))}
            </dl>
          </Card>
          <Card title={`Notes (${lead.notes.length})`}>
            {writable && (
              <form onSubmit={addNote} className="mb-5 space-y-2">
                <Textarea aria-label="New note" placeholder="Add a note — calls, meetings, next steps…" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
                <div className="flex justify-end"><Btn type="submit" variant="primary" loading={busy}>Add note</Btn></div>
              </form>
            )}
            {lead.notes.length === 0 ? <p className="text-sm text-dim">No notes yet.</p> : (
              <ul className="space-y-3">
                {lead.notes.map((n) => (
                  <li key={n.id} className="rounded-xl bg-white/[.03] p-4">
                    <p className="text-sm whitespace-pre-wrap">{n.body}</p>
                    <p className="mt-2 text-xs text-dim">{n.author_name ?? "System"} · {formatDate(n.created_at, { dateStyle: "medium", timeStyle: "short" })}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <Card title="Pipeline" className="h-fit">
          <fieldset disabled={!writable} className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={lead.status} onChange={(e) => update({ status: e.target.value as Lead["status"] })} className="capitalize">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" value={lead.priority} onChange={(e) => update({ priority: e.target.value as Lead["priority"] })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="follow">Follow-up date</Label>
              <Input id="follow" type="date" value={lead.follow_up_date ?? ""} onChange={(e) => update({ follow_up_date: e.target.value || null })} />
            </div>
            <div>
              <Label htmlFor="assigned">Assigned to</Label>
              <Select id="assigned" value={lead.assigned_to_id ?? ""} onChange={(e) => update({ assigned_to_id: e.target.value ? Number(e.target.value) : null })}>
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input id="source" defaultValue={lead.source} onBlur={(e) => e.target.value !== lead.source && update({ source: e.target.value })} />
            </div>
          </fieldset>
        </Card>
      </div>
    </>
  );
}
