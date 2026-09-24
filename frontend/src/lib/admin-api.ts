"use client";

/**
 * Browser client for the admin API. Requests go to same-origin /api (proxied to FastAPI), so the
 * HttpOnly session cookie is sent automatically. Mutations echo the readable CSRF cookie in a header
 * (double-submit), which the backend verifies.
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function csrf() {
  const m = document.cookie.match(/(?:^|; )sw_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function detailMessage(body: unknown, status: number): string {
  const d = (body as { detail?: unknown })?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e: { loc?: string[]; msg?: string }) => `${e.loc?.slice(-1)[0] ?? "field"}: ${e.msg}`).join("; ");
  return status === 413 ? "File too large" : `Request failed (${status})`;
}

export async function request<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const method = (rest.method ?? "GET").toUpperCase();
  const h = new Headers(headers);
  if (json !== undefined) h.set("content-type", "application/json");
  if (method !== "GET") h.set("x-csrf-token", csrf());
  const res = await fetch(path, {
    ...rest,
    method,
    headers: h,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    credentials: "same-origin",
    cache: "no-store",
  });
  if (res.status === 401 && !path.startsWith("/api/auth/login")) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(401, "Session expired");
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, detailMessage(body, res.status));
  return body as T;
}

export const adminApi = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, json?: unknown) => request<T>(p, { method: "POST", json }),
  put: <T>(p: string, json?: unknown) => request<T>(p, { method: "PUT", json }),
  del: (p: string) => request<void>(p, { method: "DELETE" }),
  upload: <T>(p: string, form: FormData) => request<T>(p, { method: "POST", body: form }),
};
