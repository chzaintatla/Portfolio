"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { Badge, Btn, Card, confirmDelete, Drawer, Input, Label, PageHeader, Skeleton, Toggle } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import type { Role } from "@/types";

const ACTIONS = ["read", "write", "delete"];

export default function RolesPage() {
  const { can } = useAuth();
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [resources, setResources] = useState<string[]>([]);
  const [draft, setDraft] = useState<Partial<Role> & { permissions: string[] } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([adminApi.get<Role[]>("/api/admin/roles"), adminApi.get<{ resources: string[] }>("/api/admin/permissions")]);
      setRoles(r);
      setResources(p.resources);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const has = (perms: string[], res: string, act: string) => perms.includes("*") || perms.includes(`${res}:*`) || perms.includes(`${res}:${act}`);

  function toggle(res: string, act: string) {
    if (!draft) return;
    let perms = draft.permissions.filter((p) => p !== "*");
    // Expand a resource wildcard before editing individual actions.
    if (perms.includes(`${res}:*`)) perms = [...perms.filter((p) => p !== `${res}:*`), ...ACTIONS.map((a) => `${res}:${a}`)];
    const code = `${res}:${act}`;
    perms = perms.includes(code) ? perms.filter((p) => p !== code) : [...perms, code];
    setDraft({ ...draft, permissions: perms });
  }

  async function save() {
    if (!draft?.name) return toast.error("Name is required");
    setSaving(true);
    try {
      const payload = { name: draft.name, description: draft.description ?? null, permissions: draft.permissions };
      if (draft.id) await adminApi.put(`/api/admin/roles/${draft.id}`, payload);
      else await adminApi.post("/api/admin/roles", payload);
      toast.success("Role saved");
      setDraft(null);
      void load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(r: Role) {
    if (!confirmDelete(`role "${r.name}"`)) return;
    await adminApi.del(`/api/admin/roles/${r.id}`).then(load).catch((e: Error) => toast.error(e.message));
  }

  return (
    <>
      <PageHeader
        title="Roles"
        description="Role-based permissions. Each resource can be granted read, write and delete."
        actions={can("roles:write") && <Btn variant="primary" onClick={() => setDraft({ name: "", description: "", permissions: [] })}><Plus className="h-4 w-4" /> New role</Btn>}
      />
      {!roles ? <Skeleton className="h-64" /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((r) => (
            <Card key={r.id} title={r.name} action={
              <div className="flex">
                {can("roles:write") && <Btn variant="ghost" onClick={() => setDraft({ ...r, permissions: [...r.permissions] })}>Edit</Btn>}
                {can("roles:delete") && <Btn variant="ghost" className="hover:!text-red-300" onClick={() => remove(r)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Btn>}
              </div>
            }>
              <p className="mb-3 text-sm text-mute">{r.description}</p>
              <div className="flex flex-wrap gap-1">
                {r.permissions.includes("*") ? <Badge tone="violet">Full access</Badge> : r.permissions.map((p) => <Badge key={p}>{p}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Drawer open={!!draft} onClose={() => setDraft(null)} title={draft?.id ? `Edit ${draft.name}` : "New role"} wide>
        {draft && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label htmlFor="r-name">Name</Label><Input id="r-name" value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
              <div><Label htmlFor="r-desc">Description</Label><Input id="r-desc" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
            </div>
            <Toggle checked={draft.permissions.includes("*")} onChange={(v) => setDraft({ ...draft, permissions: v ? ["*"] : [] })} label="Full access (administrator)" />
            {!draft.permissions.includes("*") && (
              <div className="hairline overflow-x-auto rounded-xl">
                <table className="w-full text-sm">
                  <thead className="border-b border-line text-xs text-dim"><tr><th className="px-4 py-2 text-left">Resource</th>{ACTIONS.map((a) => <th key={a} className="px-4 py-2 capitalize">{a}</th>)}</tr></thead>
                  <tbody>
                    {resources.map((res) => (
                      <tr key={res} className="border-b border-line/60 last:border-0">
                        <td className="px-4 py-2 capitalize">{res.replace(/-/g, " ")}</td>
                        {ACTIONS.map((a) => (
                          <td key={a} className="px-4 py-2 text-center">
                            <input type="checkbox" aria-label={`${res} ${a}`} checked={has(draft.permissions, res, a)} onChange={() => toggle(res, a)} className="h-4 w-4 accent-[#22D3EE]" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Btn variant="primary" onClick={save} loading={saving}>Save role</Btn>
          </div>
        )}
      </Drawer>
    </>
  );
}
