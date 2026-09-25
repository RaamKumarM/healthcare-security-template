import { NextResponse } from "next/server";
import { getAuth, canExecuteActions } from "./dashboard/components/lib/auth.js";

/**
 * Stub-session RBAC guard for API routes (local mock only — NOT production auth).
 * - Authenticated /api/* require the stub session token → 401 UNAUTHENTICATED,
 *   except webhooks (own HMAC), healthz and the SSE stream (callers that
 *   cannot send headers — checked in-route where applicable).
 * - Any mutating request (POST/PATCH/PUT/DELETE) outside webhooks requires
 *   ADMIN or SECOPS role → 403 FORBIDDEN.
 */
export default function proxy(req) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/api/")) return NextResponse.next();
  if (
    pathname.startsWith("/api/webhooks/") ||
    pathname === "/api/healthz" ||
    pathname.startsWith("/api/events/stream")
  ) {
    return NextResponse.next();
  }

  const { authenticated, role } = getAuth(req);
  if (!authenticated) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHENTICATED", message: "Missing or invalid session token." } },
      { status: 401 }
    );
  }
  if (req.method !== "GET" && !canExecuteActions(role)) {
    return NextResponse.json(
      { ok: false, error: { code: "FORBIDDEN", message: "ADMIN or SECOPS role required." } },
      { status: 403 }
    );
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
