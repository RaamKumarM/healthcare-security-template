/**
 * Stub session auth (NO production value). Real identity requires a
 * maintainer-approved auth package (e.g. next-auth) — none is currently
 * listed in policies/approved-packages.yaml, so routes + UI share this
 * local-only stub token/role pair for guard wiring.
 */

export const STUB_TOKEN = "soc-stub-token";
/** Analyst persona used by the dashboard client. */
export const STUB_ROLE = "SECOPS";

const ROLES = ["ADMIN", "SECOPS", "VIEWER"];

/**
 * @param {Request} req
 * @returns {{ authenticated: boolean, role: string | null }}
 */
export function getAuth(req) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const rawRole = (req.headers.get("x-soc-role") ?? "").toUpperCase();
  return {
    authenticated: token === STUB_TOKEN,
    role: ROLES.includes(rawRole) ? rawRole : null,
  };
}

/** @param {string | null} role */
export function canExecuteActions(role) {
  return role === "ADMIN" || role === "SECOPS";
}
