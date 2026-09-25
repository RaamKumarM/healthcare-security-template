import { readDb } from "../../../../dashboard/components/lib/store.js";
import { toCSV, toJSON } from "../../../../dashboard/components/lib/export.js";
import { ok, fail, withHandler } from "../../../../dashboard/components/lib/api-response.js";

/**
 * GET /api/compliance/report?format=json|csv — auditor export aggregating
 * audit trail, vendor risk scores, and HIPAA posture (stub data).
 */
export const GET = withHandler(async (req) => {
  const format = new URL(req.url).searchParams.get("format") ?? "json";
  if (!["json", "csv"].includes(format)) {
    return fail("BAD_REQUEST", "format must be json or csv.", 400);
  }

  const db = readDb();
  const payload = {
    generatedAt: new Date().toISOString(),
    hipaa: {
      score: db.metrics.hipaaScore,
      endpointHealth: db.metrics.endpointHealth,
      threatsBlocked: db.metrics.threatsBlocked,
    },
    vendors: db.vendors.map((v) => ({
      id: v.id,
      name: v.name,
      riskLevel: v.riskLevel,
      status: v.status,
      endpoints: v.endpoints,
      lastScanned: v.lastScanned,
    })),
    audit: db.auditLog,
  };

  if (format === "csv") {
    const rows = db.auditLog.map((a) => ({
      id: a.id,
      timestamp: a.timestamp,
      action: a.action,
      performedBy: a.performedBy,
      targetResource: a.targetResource ?? "-",
      status: a.status,
    }));
    return new Response(
      toCSV(rows, ["id", "timestamp", "action", "performedBy", "targetResource", "status"]),
      { headers: { "Content-Type": "text/csv" } }
    );
  }

  return new Response(toJSON(payload), { headers: { "Content-Type": "application/json" } });
});
