"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { apiFetch } from "./lib/api-client";
import { toCSV, download } from "./lib/export";
import { useToast } from "./lib/toast";
import { ListSkeleton } from "./Skeleton";

/** Audit trail workspace with pagination + CSV export (stub persistence). */
export default function AuditView() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Keep server HTML and first client render identical (hydration safety).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const pageSize = 8;

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/audit?page=${page}&pageSize=${pageSize}`);
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Audit request failed.");
      setRows(body.data.rows);
      setTotal(body.data.total);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audit request failed.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  const exportCsv = async () => {
    try {
      const res = await apiFetch("/api/audit?page=0&pageSize=50");
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Export failed.");
      download(
        "soc-audit-log.csv",
        toCSV(body.data.rows, ["id", "timestamp", "action", "performedBy", "targetResource", "status"]),
        "text/csv"
      );
      toast.success(`Exported ${body.data.total} audit rows (CSV).`);
    } catch (e) {
      toast.error(`Export failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-slate-800">Audit Log</h2>
          <p className="text-[12px] text-slate-400">Immutable trail of sensitive operations.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12px] font-medium text-slate-600 shadow-sm hover:text-orange-500"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        {loading ? (
          <ListSkeleton rows={5} />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-4 text-center text-[12px] text-red-700">
            Audit log failed to load.{" "}
            <button type="button" onClick={fetchPage} className="font-semibold underline">
              Retry
            </button>
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-[12px] text-slate-400">
            No audit entries yet. Run an action to create trail entries.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {rows.map((a) => (
              <li key={a.id} className="rounded-xl bg-slate-50/70 px-3 py-2.5">
                <p className="text-[13px] font-semibold text-slate-800">
                  {a.action} <span className="font-normal text-slate-400">· {a.status}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {a.performedBy} · {a.targetResource ?? "-"} · {a.timestamp}
                </p>
              </li>
            ))}
          </ul>
        )}
        {mounted ? (
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Page {page + 1} of {pages} · {total} entries
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 0}
                onClick={() => setPage(Math.max(0, page - 1))}
                className="rounded-md border border-slate-200 p-1.5 disabled:opacity-40"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={page >= pages - 1}
                onClick={() => setPage(Math.min(pages - 1, page + 1))}
                className="rounded-md border border-slate-200 p-1.5 disabled:opacity-40"
              >
                <ChevronRight size={12} />
              </button>
            </span>
          </div>
        ) : (
          <div
            className="mt-2 flex items-center justify-between text-[11px] text-slate-400"
            aria-hidden="true"
          >
            <span>Page 1 of 1 · loading…</span>
          </div>
        )}
      </div>
    </div>
  );
}
