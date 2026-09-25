import { readDb } from "../../../dashboard/components/lib/store.js";
import { ok, withHandler } from "../../../dashboard/components/lib/api-response.js";

/**
 * GET /api/audit?page=&pageSize= — audit trail, newest first (stub persistence).
 */
export const GET = withHandler(async (req) => {
  const sp = new URL(req.url).searchParams;
  const page = Math.max(0, parseInt(sp.get("page") ?? "0", 10) || 0);
  const pageSize = Math.min(50, Math.max(1, parseInt(sp.get("pageSize") ?? "10", 10) || 10));
  const rows = [...readDb().auditLog].reverse();
  return ok({
    rows: rows.slice(page * pageSize, page * pageSize + pageSize),
    total: rows.length,
    page,
    pageSize,
  });
});
