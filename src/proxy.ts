import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";

/**
 * Next.js 16 renamed `middleware` → `proxy` (Node runtime).
 * Optimistic gate only: if there's no session cookie, bounce admin routes to
 * login. Real JWT verification happens in the admin layout (server component).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/rgw-admin-login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/rgw-admin", "/rgw-admin/:path*"],
};
