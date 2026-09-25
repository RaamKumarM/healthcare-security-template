import { seedDb } from "../dashboard/components/lib/store.js";

const db = seedDb();
console.log(
  `Seeded data/soc-db.json: ${db.vendors.length} vendors, ${db.segments.length} segments, ` +
    `${db.metrics.timeseries.length} threat events, ${db.auditLog.length} audit entries.`
);
