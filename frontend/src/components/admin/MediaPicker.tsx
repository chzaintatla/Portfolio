"use client";

import { Loader2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { adminApi } from "@/lib/admin-api";
import type { Media, Page } from "@/types";

import { Drawer, Input } from "./ui";

/** Choose an existing media item or upload a new one. */
export function MediaPicker({ open, onClose, onPick, folder = "general" }: {
  open: boolean; onClose: () => void; onPick: (m: Media) => void; folder?: string;
}) {
  const [items, setItems] = useState<Media[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ kind: "image", page_size: "60" });
      if (q) params.set("q", q);
      setItems((await adminApi.get<Page<Media>>(`/api/admin/media?${params}`)).items);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void load();
  }, [open, load]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    fd.append("folder", folder);
    setUploading(true);
    try {
      const created = await adminApi.upload<Media[]>("/api/admin/media", fd);
      toast.success("Uploaded");
      if (created.length === 1) onPick(created[0]);
      else void load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Choose media" wide>
      <div className="mb-4 flex gap-2">
        <Input placeholder="Search media…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-midnight">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      </div>
      {loading ? (
        <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-aqua" />
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-mute">No images yet — upload one.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => onPick(m)} className="group block w-full overflow-hidden rounded-xl border border-line hover:border-aqua/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? m.filename} className="aspect-square w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                <span className="block truncate px-2 py-1 text-left text-[0.7rem] text-mute">{m.filename}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
