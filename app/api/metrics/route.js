import { readDb } from "../../../dashboard/components/lib/store.js";
import { ok, withHandler } from "../../../dashboard/components/lib/api-response.js";

/** GET /api/metrics — KPIs + threat scan time series (persistent store). */
export const GET = withHandler(async () => ok(readDb().metrics));
