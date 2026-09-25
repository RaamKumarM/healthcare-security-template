import { readDb } from "../../../dashboard/components/lib/store.js";
import { getWebhookSecret, STUB_WEBHOOK_SECRET } from "../../../dashboard/components/lib/security.js";

/**
 * GET /api/healthz — operational health (stub checks, no external calls).
 * 200 when the store is readable, 503 otherwise.
 */
export async function GET() {
  const started = Date.now();
  let database = { status: "down", latencyMs: 0, vendors: 0 };
  try {
    const db = readDb();
    database = {
      status: "up",
      latencyMs: Date.now() - started,
      vendors: db.vendors.length,
    };
  } catch (e) {
    database = {
      status: "down",
      latencyMs: Date.now() - started,
      vendors: 0,
      error: e instanceof Error ? e.message : "store unreadable",
    };
  }

  const mem = process.memoryUsage();
  const body = {
    ok: database.status === "up",
    status: database.status === "up" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks: {
      database,
      runtime: {
        status: "up",
        uptimeS: Math.round(process.uptime()),
        memoryMb: Math.round(mem.heapUsed / 1024 / 1024),
      },
      integrations: {
        status: "stub",
        webhookSigningConfigured: getWebhookSecret() !== STUB_WEBHOOK_SECRET,
      },
    },
  };

  return Response.json(body, { status: database.status === "up" ? 200 : 503 });
}
