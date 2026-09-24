"use client";

import { Copy, FileText, Film, Folder, Loader2, Search, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/admin/AuthContext";
import { Btn, confirmDelete, Drawer, Empty, Input, Label, PageHeader, Select, Skeleton } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin-api";
import { cn, formatDate } from "@/lib/utils";
import type { Media, Page } from "@/types";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default function MediaPage() {
  const { can } = useAuth();
  const [data, setData] = useState<Page<Media> | null>(null);
  const [folders, setFolders] = useState<{ name: string; count: number }[]>([]);
  const [folder, setFolder] = useState("");
  const [kind, setKind] = useState("");
  const [q, setQ] = useState("");
  const [uploadFolder, setUploadFolder] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Media | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page_size: "96" });
    if (folder) params.set("folder", folder);
    if (kind) params.set("kind", kind);
    if (q) params.set("q", q);
    try {
      const [items, f] = await Promise.all([
        adminApi.get<Page<Media>>(`/api/admin/media?${params}`),
        adminApi.get<{ name: string; count: number }[]>("/api/admin/media/folders"),
      ]);
      setData(items);
      setFolders(f);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, [folder, kind, q]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    fd.append("folder", uploadFolder.trim() || "general");
    setUploading(true);
    try {
      const created = await adminApi.upload<Media[]>("/api/admin/media", fd);
      toast.success(`Uploaded ${created.length} file${created.length > 1 ? "s" : ""}`);
      void load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save(m: Media) {
    try {
      const updated = await adminApi.put<Media>(`/api/admin/media/${m.id}`, { alt: m.alt, folder: m.folder, filename: m.filename });
      setData((d) => d && { ...d, items: d.items.map((x) => (x.id === m.id ? updated : x)) });
      toast.success("Saved");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function remove(m: Media) {
    if (!confirmDelete(m.filename)) return;
    try {
      await adminApi.del(`/api/admin/media/${m.id}`);
      setSelected(null);
      void load();
      toast.success("Deleted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const copy = (m: Media) => {
    const url = m.url.startsWith("http") ? m.url : `${window.location.origin}${m.url}`;
    void navigator.clipboard.writeText(url).then(() => toast.success("URL copied"));
  };

  return (
    <>
      <PageHeader
        title="Media"
        description="Images, video and documents. Stored locally in development, Cloudinary or S3 in production."
        actions={can("media:write") && (
          <div className="flex gap-2">
            <Input aria-label="Upload to folder" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} className="w-36" placeholder="folder" />
            <Btn variant="primary" onClick={() => fileRef.current?.click()} loading={uploading}>{!uploading && <Upload className="h-4 w-4" />} Upload</Btn>
            <input ref={fileRef} type="file" multiple hidden accept="image/*,video/mp4,video/webm,application/pdf" onChange={(e) => upload(e.target.files)} />
          </div>
        )}
      />
      <div
        className="grid gap-6 lg:grid-cols-[200px_1fr]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (can("media:write")) void upload(e.dataTransfer.files); }}
      >
        <nav aria-label="Folders" className="space-y-0.5">
          {[{ name: "", count: folders.reduce((a, f) => a + f.count, 0) }, ...folders].map((f) => (
            <button key={f.name || "all"} type="button" onClick={() => setFolder(f.name)}
              className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm", folder === f.name ? "bg-white/[.07]" : "text-mute hover:text-ink")}>
              <span className="flex items-center gap-2"><Folder className="h-4 w-4" /> {f.name || "All files"}</span>
              <span className="text-xs text-dim">{f.count}</span>
            </button>
          ))}
        </nav>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-dim" />
              <Input className="pl-9" placeholder="Search files" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search media" />
            </div>
            <Select aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value)} className="w-36">
              <option value="">All types</option><option value="image">Images</option><option value="video">Video</option><option value="document">Documents</option>
            </Select>
          </div>
          {!data ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">{Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
          ) : data.items.length === 0 ? (
            <Empty>No files here yet. Drag & drop or click Upload.</Empty>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
              {data.items.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => setSelected(m)} className="group block w-full overflow-hidden rounded-xl border border-line text-left hover:border-aqua/50">
                    <div className="flex aspect-square items-center justify-center bg-night">
                      {m.mime_type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt={m.alt ?? ""} className="h-full w-full object-cover" loading="lazy" />
                      ) : m.mime_type.startsWith("video/") ? <Film className="h-8 w-8 text-dim" /> : <FileText className="h-8 w-8 text-dim" />}
                    </div>
                    <span className="block truncate px-2 py-1.5 text-xs text-mute">{m.filename}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {uploading && <p className="mt-4 flex items-center gap-2 text-sm text-mute"><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</p>}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="File details">
        {selected && (
          <div className="space-y-4">
            {selected.mime_type.startsWith("image/") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.url} alt={selected.alt ?? ""} className="w-full rounded-xl border border-line" />
            )}
            {selected.mime_type.startsWith("video/") && <video src={selected.url} controls className="w-full rounded-xl" />}
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-dim">Type</dt><dd>{selected.mime_type}</dd></div>
              <div><dt className="text-xs text-dim">Size</dt><dd>{kb(selected.size)}</dd></div>
              {selected.width && <div><dt className="text-xs text-dim">Dimensions</dt><dd>{selected.width} × {selected.height}</dd></div>}
              <div><dt className="text-xs text-dim">Uploaded</dt><dd>{formatDate(selected.created_at)}</dd></div>
            </dl>
            <div><Label htmlFor="m-name">File name</Label><Input id="m-name" value={selected.filename} onChange={(e) => setSelected({ ...selected, filename: e.target.value })} /></div>
            <div><Label htmlFor="m-alt">Alt text</Label><Input id="m-alt" value={selected.alt ?? ""} onChange={(e) => setSelected({ ...selected, alt: e.target.value })} placeholder="Describe the image for screen readers" /></div>
            <div><Label htmlFor="m-folder">Folder</Label><Input id="m-folder" value={selected.folder} onChange={(e) => setSelected({ ...selected, folder: e.target.value })} /></div>
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => copy(selected)}><Copy className="h-4 w-4" /> Copy URL</Btn>
              {can("media:write") && <Btn variant="primary" onClick={() => save(selected)}>Save</Btn>}
              {can("media:delete") && <Btn variant="danger" onClick={() => remove(selected)}><Trash2 className="h-4 w-4" /> Delete</Btn>}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
