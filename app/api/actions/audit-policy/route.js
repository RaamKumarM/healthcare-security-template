import { readDb } from "../../../../dashboard/components/lib/store.js";
import { logAuditEvent } from "../../../../dashboard/components/lib/audit.js";
import { getAuth } from "../../../../dashboard/components/lib/auth.js";
import { ok, fail, withHandler } from "../../../../dashboard/components/lib/api-response.js";

/**
 * POST /api/actions/audit-policy — mock HIPAA/CPG check, logged via central audit.
 * Body: { framework?: "hipaa" | "cpg" | "both" } — RBAC enforced in proxy.
 */
export const POST = withHandler(async (req) => {
  /** @type {import("../../../../dashboard/components/lib/types.js").PolicyAuditPayload} */
  const body = await req.json().catch(() => ({}));
  const framework = body.framework ?? "both";
  if (!["hipaa", "cpg", "both"].includes(framework)) {
    return fail("BAD_REQUEST", `Invalid framework: ${framework}.`, 400);
  }
  const { role } = getAuth(req);
  const m = readDb().metrics;
  const entry = logAuditEvent({
    userId: role ?? "unknown",
    action: "audit-policy",
    targetResource: "compliance-policies",
    metadata: {
      framework,
      hipaaScore: m.hipaaScore,
      threatsBlocked: m.threatsBlocked,
    },
    status: "passed",
  });
  return ok(
    {
      checkId: entry.id,
      action: entry.action,
      framework: entry.metadata.framework,
      status: entry.status,
      summary: {
        hipaaScore: entry.metadata.hipaaScore,
        threatsBlocked: entry.metadata.threatsBlocked,
      },
      at: entry.timestamp,
    },
    202
  );
});
