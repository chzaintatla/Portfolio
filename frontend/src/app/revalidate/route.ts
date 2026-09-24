import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Called by the FastAPI backend after CMS edits so public pages refresh immediately
 * instead of waiting for the periodic revalidation window.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { tags } = (await req.json().catch(() => ({ tags: [] }))) as { tags?: unknown };
  const list = Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string").slice(0, 20) : [];
  list.forEach((t) => revalidateTag(t, { expire: 0 }));
  return NextResponse.json({ ok: true, revalidated: list });
}
