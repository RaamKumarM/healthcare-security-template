import { readDb, writeDb } from "../../../dashboard/components/lib/store.js";
import { logAuditEvent } from "../../../dashboard/components/lib/audit.js";
import { getAuth } from "../../../dashboard/components/lib/auth.js";
import { ok, fail, withHandler } from "../../../dashboard/components/lib/api-response.js";

const SORTABLE = ["name", "riskLevel", "status", "endpoints", "lastScanned"];
const RISKS = ["Low", "Medium", "High"];
const STATUSES = ["Monitored", "Review", "Quarantined"];

/**
 * GET /api/vendors?q=&severity=&sort=&dir=&page=&pageSize=
 * Paginated, searchable, sortable vendor SCRM data (persistent store).
 */
export const GET = withHandler(async (req) => {
  const sp = new URL(req.url).searchParams;
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const severity = sp.get("severity") ?? "All";
  const sort = sp.get("sort") ?? "name";
  const dir = sp.get("dir") === "desc" ? -1 : 1;
  const page = Math.max(0, parseInt(sp.get("page") ?? "0", 10) || 0);
  const pageSize = Math.min(50, Math.max(1, parseInt(sp.get("pageSize") ?? "4", 10) || 4));

  if (!SORTABLE.includes(sort)) return fail("BAD_REQUEST", `Invalid sort key: ${sort}.`, 400);
  if (!["All", "Low", "Medium", "High"].includes(severity)) {
    return fail("BAD_REQUEST", `Invalid severity: ${severity}.`, 400);
  }

  const { vendors } = readDb();
  let rows = vendors.filter(
    (v) =>
      (severity === "All" || v.severity === severity) &&
      (!q || `${v.name} ${v.status} ${v.riskLevel}`.toLowerCase().includes(q))
  );
  rows = [...rows].sort(
    (a, b) => String(a[sort]).localeCompare(String(b[sort]), undefined, { numeric: true }) * dir
  );

  return ok({
    rows: rows.slice(page * pageSize, page * pageSize + pageSize),
    total: rows.length,
    page,
    pageSize,
  });
});

/**
 * POST /api/vendors — onboard a vendor (stub persistence).
 * Body: { name*, riskLevel?, status?, endpoints? } — ADMIN/SECOPS via proxy.
 */
export const POST = withHandler(async (req) => {
  const body = await req.json().catch(() => ({}));
  const name = (body.name ?? "").trim();
  if (!name) return fail("BAD_REQUEST", "Vendor name is required.", 400);
  const riskLevel = body.riskLevel ?? "Medium";
  const status = body.status ?? "Review";
  const endpoints = Math.max(0, parseInt(body.endpoints ?? "0", 10) || 0);
  if (!RISKS.includes(riskLevel)) return fail("BAD_REQUEST", `Invalid riskLevel: ${riskLevel}.`, 400);
  if (!STATUSES.includes(status)) return fail("BAD_REQUEST", `Invalid status: ${status}.`, 400);

  const { role } = getAuth(req);
  const db = readDb();
  const vendor = {
    id: `v-${Date.now()}`,
    name,
    riskLevel,
    status,
    endpoints,
    lastScanned: new Date().toISOString(),
    severity: riskLevel,
  };
  db.vendors.push(vendor);
  writeDb(db);
  logAuditEvent({
    userId: role ?? "unknown",
    action: "vendor.onboard",
    targetResource: vendor.id,
    metadata: { name, riskLevel, status },
    status: "created",
  });
  return ok({ vendor }, 201);
});

/**
 * PATCH /api/vendors — update vendor status (stub persistence).
 * Body: { id*, status* } — ADMIN/SECOPS via proxy.
 */
export const PATCH = withHandler(async (req) => {
  const body = await req.json().catch(() => ({}));
  if (!body.id || !STATUSES.includes(body.status)) {
    return fail("BAD_REQUEST", "Valid id and status (Monitored|Review|Quarantined) required.", 400);
  }
  const { role } = getAuth(req);
  const db = readDb();
  const vendor = db.vendors.find((v) => v.id === body.id);
  if (!vendor) return fail("NOT_FOUND", `Unknown vendor id: ${body.id}.`, 404);
  vendor.status = body.status;
  vendor.lastScanned = new Date().toISOString();
  writeDb(db);
  logAuditEvent({
    userId: role ?? "unknown",
    action: "vendor.status",
    targetResource: vendor.id,
    metadata: { name: vendor.name, status: vendor.status },
    status: "updated",
  });
  return ok({ vendor });
});

/**
 * DELETE /api/vendors?id= — remove a vendor (stub persistence).
 * ADMIN/SECOPS via proxy.
 */
export const DELETE = withHandler(async (req) => {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return fail("BAD_REQUEST", "Vendor id is required.", 400);
  const { role } = getAuth(req);
  const db = readDb();
  const idx = db.vendors.findIndex((v) => v.id === id);
  if (idx === -1) return fail("NOT_FOUND", `Unknown vendor id: ${id}.`, 404);
  const [removed] = db.vendors.splice(idx, 1);
  writeDb(db);
  logAuditEvent({
    userId: role ?? "unknown",
    action: "vendor.delete",
    targetResource: id,
    metadata: { name: removed.name },
    status: "deleted",
  });
  return ok({ deleted: id });
});
