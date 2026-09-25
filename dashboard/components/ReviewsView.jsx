"use client";

import { useVendorSCRM } from "./lib/useVendorSCRM";
import { apiFetch } from "./lib/api-client";
import { useToast } from "./lib/toast";
import { ListSkeleton } from "./Skeleton";

/** Pending vendor reviews with approve / quarantine actions (stub persistence). */
export default function ReviewsView() {
  const toast = useToast();
  const vendors = useVendorSCRM({ pageSize: 50 });

  const setStatus = async (v, status) => {
    try {
      const res = await apiFetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, status }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Update failed.");
      toast.success(`"${v.name}" → ${status}.`);
      vendors.refetch();
    } catch (e) {
      toast.error(`Update failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  // Only "Review" items are pending — approving or quarantining resolves them
  // out of this list.
  const pending = vendors.rows.filter((v) => v.status === "Review");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-slate-800">Pending Reviews</h2>
        <p className="text-[12px] text-slate-400">Approve or quarantine flagged vendors.</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        {vendors.loading ? (
          <ListSkeleton rows={4} />
        ) : vendors.error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-4 text-center text-[12px] text-red-700">
            Reviews failed to load.{" "}
            <button type="button" onClick={vendors.refetch} className="font-semibold underline">
              Retry
            </button>
          </div>
        ) : pending.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-[12px] text-slate-400">
            No pending reviews. All vendors monitored.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pending.map((v) => (
              <li
                key={v.id}
                className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50/70 px-3 py-2.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-slate-800">
                    {v.name}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {v.riskLevel} risk · {v.status}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setStatus(v, "Monitored")}
                  className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-600"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(v, "Quarantined")}
                  className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[12px] font-semibold text-white hover:bg-slate-700"
                >
                  Quarantine
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
