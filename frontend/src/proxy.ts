import { type NextRequest, NextResponse } from "next/server";

/**
 * Optimistic admin guard: without a session cookie, /admin/* redirects to the login page.
 * Authorization itself is enforced by the API on every request (JWT + role permissions).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !req.cookies.has("sw_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
