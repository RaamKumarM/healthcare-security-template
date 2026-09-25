import { readDb } from "../../../dashboard/components/lib/store.js";
import { ok, fail, withHandler } from "../../../dashboard/components/lib/api-response.js";

/**
 * GET /api/segments?vlanId= — all segments, or single-segment telemetry (persistent store).
 */
export const GET = withHandler(async (req) => {
  const vlanId = new URL(req.url).searchParams.get("vlanId");
  const { segments } = readDb();
  if (!vlanId) return ok({ rows: segments, total: segments.length });

  const seg = segments.find((s) => s.vlanId === vlanId);
  if (!seg) return fail("NOT_FOUND", `Unknown vlanId: ${vlanId}.`, 404);

  return ok({
    ...seg,
    telemetry: { note: "Stub telemetry; no live systems access.", range: "Last 24 hours" },
  });
});
