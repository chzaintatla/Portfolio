"use client";

import { Plus, Trash2 } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { Badge, Btn, confirmDelete, Drawer, Input, Label, PageHeader, Select, Skeleton, Toggle } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";
import type { Role, User } from "@/types";

interface Draft { id?: number; name: string; email: string; password: string; role_id: number | null; is_active: boolean }

export default function UsersPage() {
  const { can, user: me } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [u, r] = await Promise.all([adminApi.get<User[]>("/api/admin/users"), adminApi.get<Role[]>("/api/admin/roles").catch(() => [])]);
      setUsers(u);
      setRoles(r);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (!draft.id && draft.password.length < 10) return toast.error("Password must be at least 10 characters");
    setSaving(true);
    const payload: Record<string, unknown> = { name: draft.name, email: draft.email, is_active: draft.is_active };
    if (draft.id !== me?.id) payload.role_id = draft.role_id;
    if (draft.password) payload.password = draft.password;
    try {
      if (draft.id) await adminApi.put(`/api/admin/users/${draft.id}`, payload);
      else await adminApi.post("/api/admin/users", payload);
      toast.success(draft.id ? "User updated" : "User created");
      setDraft(null);
      void load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(u: User) {
    if (!confirmDelete(u.email)) return;
    await adminApi.del(`/api/admin/users/${u.id}`).then(load).catch((e: Error) => toast.error(e.message));
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="People who can sign in to the CMS."
        actions={can("users:write") && <Btn variant="primary" onClick={() => setDraft({ name: "", email: "", password: "", role_id: roles[0]?.id ?? null, is_active: true })}><Plus className="h-4 w-4" /> Add user</Btn>}
      />
      {!users ? <Skeleton className="h-64" /> : (
        <div className="hairline overflow-x-auto rounded-2xl bg-card/60">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line text-left text-xs text-dim"><tr><th className="px-4 py-3">User</th><th>Role</th><th>Status</th><th>Last sign-in</th><th /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3"><p className="font-medium">{u.name}{u.id === me?.id && <span className="ml-2 text-xs text-dim">(you)</span>}</p><p className="text-xs text-mute">{u.email}</p></td>
                  <td><Badge tone="violet">{u.role?.name ?? "—"}</Badge></td>
                  <td><Badge tone={u.is_active ? "green" : "red"}>{u.is_active ? "Active" : "Disabled"}</Badge></td>
                  <td className="text-mute">{u.last_login_at ? formatDate(u.last_login_at, { dateStyle: "medium", timeStyle: "short" }) : "Never"}</td>
                  <td className="pr-3 text-right whitespace-nowrap">
                    {can("users:write") && <Btn variant="ghost" onClick={() => setDraft({ id: u.id, name: u.name, email: u.email, password: "", role_id: u.role?.id ?? null, is_active: u.is_active })}>Edit</Btn>}
                    {can("users:delete") && u.id !== me?.id && <Btn variant="ghost" className="hover:!text-red-300" onClick={() => remove(u)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Drawer open={!!draft} onClose={() => setDraft(null)} title={draft?.id ? "Edit user" : "New user"}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <div><Label htmlFor="u-name">Name</Label><Input id="u-name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div><Label htmlFor="u-email">Email</Label><Input id="u-email" type="email" required value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
            <div>
              <Label htmlFor="u-pass" hint={draft.id ? "leave empty to keep current" : "min. 10 characters"}>Password</Label>
              <Input id="u-pass" type="password" autoComplete="new-password" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} minLength={draft.id ? undefined : 10} required={!draft.id} />
            </div>
            <div>
              <Label htmlFor="u-role">Role</Label>
              <Select id="u-role" value={draft.role_id ?? ""} disabled={draft.id === me?.id} onChange={(e) => setDraft({ ...draft, role_id: e.target.value ? Number(e.target.value) : null })}>
                <option value="">No role</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </div>
            {draft.id !== me?.id && <Toggle checked={draft.is_active} onChange={(v) => setDraft({ ...draft, is_active: v })} label="Active" />}
            <Btn type="submit" variant="primary" loading={saving}>Save</Btn>
          </form>
        )}
      </Drawer>
    </>
  );
}
