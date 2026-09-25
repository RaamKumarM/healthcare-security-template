import { readDb, writeDb } from "../../../../dashboard/components/lib/store.js";
import { logAuditEvent } from "../../../../dashboard/components/lib/audit.js";
import { isWebhookAuthorized } from "../../../../dashboard/components/lib/security.js";
import { ok, fail, withHandler } from "../../../../dashboard/components/lib/api-response.js";

const SEVERITIES = ["Low", "Medium", "High"];
const CATEGORIES = ["intrusion", "malware", "egress", "dependency"];

/**
 * Normalize a flexible external payload into the internal ThreatEvent schema.
 * Accepts { timestamp|time, count|eventCount|events, severity?, category? }.
 */
function normalizeThreat(body) {
  const count = Math.max(
    0,
    parseInt(body.count ?? body.eventCount ?? body.events ?? "1", 10) || 0
  );
  const severity = SEVERITIES.includes(body.severity)
    ? body.severity
    : count >= 10
      ? "High"
      : count >= 5
        ? "Medium"
        : "Low";
  const category = CATEGORIES.includes(body.category) ? body.category : "intrusion";
  return {
    timestamp: body.timestamp ?? body.time ?? new Date().toISOString(),
    count,
    severity,
    category,
  };
}

/**
 * POST /api/webhooks/threats — ingest external threat payload (stub persistence).
 * Auth: x-soc-signature (HMAC-SHA256 of raw body) or x-api-key. Secret must
 * be configured via SOC_WEBHOOK_SECRET in production (stub default is local-only).
 */
export const POST = withHandler(async (req) => {
  const rawBody = await req.text();
  if (!isWebhookAuthorized(req, rawBody)) {
    return fail("UNAUTHORIZED", "Invalid webhook signature or API key.", 401);
  }

  let body;
  try {
    body = JSON.parse(rawBody || "{}");
  } catch {
    return fail("BAD_REQUEST", "Malformed JSON payload.", 400);
  }

  const event = normalizeThreat(body);
  const db = readDb();
  db.metrics.timeseries.push(event);
  db.metrics.timeseries = db.metrics.timeseries.slice(-48);
  db.metrics.threatsBlocked += event.count;
  writeDb(db);
  logAuditEvent({
    userId: "webhook",
    action: "webhook.ingest",
    targetResource: "threat-events",
    metadata: event,
    status: "ingested",
  });

  return ok({ event, threatsBlocked: db.metrics.threatsBlocked }, 202);
});

/** GET documents the stub contract (not a secret). */
export const GET = withHandler(async () =>
  ok({
    usage: "POST JSON threat payload with x-soc-signature (HMAC-SHA256, sha256=<hex>) or x-api-key.",
    secretConfigured: (process.env.SOC_WEBHOOK_SECRET ?? "") !== "",
  })
);
