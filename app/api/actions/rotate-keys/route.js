import { logAuditEvent } from "../../../../dashboard/components/lib/audit.js";
import { getAuth } from "../../../../dashboard/components/lib/auth.js";
import { ok, withHandler } from "../../../../dashboard/components/lib/api-response.js";

/**
 * POST /api/actions/rotate-keys — mock key rotation, logged via central audit.
 * Body: { scope?, reason? } — RBAC enforced in proxy (ADMIN/SECOPS).
 */
export const POST = withHandler(async (req) => {
  /** @type {import("../../../../dashboard/components/lib/types.js").RotateKeysPayload} */
  const body = await req.json().catch(() => ({}));
  const { role } = getAuth(req);
  const entry = logAuditEvent({
    userId: role ?? "unknown",
    action: "rotate-keys",
    targetResource: "admin-access-keys",
    metadata: { scope: body.scope ?? "administrative", reason: body.reason ?? "scheduled" },
    status: "queued",
  });
  return ok(
    {
      jobId: entry.id,
      action: entry.action,
      scope: entry.metadata.scope,
      reason: entry.metadata.reason,
      status: entry.status,
      at: entry.timestamp,
    },
    202
  );
});
