"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ListSkeleton } from "./Skeleton";

/**
 * Vendors / Segments card wired to Phase 2 hook state.
 * Vendors tab: server search/sort/severity/pagination. Segments tab: client
 * severity filter + sort. Row click opens the telemetry drawer.
 */
export default function VendorList({ vendor, segments, onVendorClick, onSegmentClick }) {
  const [tab, setTab] = useState("vendors");
  const [segSort, setSegSort] = useState("name");
  const [segDir, setSegDir] = useState(1);
  // Mounted flag: server prerender and the client's first render must produce
  // identical HTML, so interactivity-gated attributes stay inert until hydration
  // has matched and the mount effect has run.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const segRows = useMemo(() => {
    const base =
      vendor.severity === "All"
        ? [...segments.rows]
        : segments.rows.filter((s) => s.severity === vendor.severity);
    const key = segSort === "name" ? "name" : segSort === "endpoints" ? "endpoints" : "health";
    return base.sort(
      (a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * segDir
    );
  }, [segments.rows, vendor.severity, segSort, segDir]);

  const totalPages = Number.isFinite(vendor.total / vendor.pageSize)
    ? Math.max(1, Math.ceil(vendor.total / vendor.pageSize))
    : 1;
  const pages = totalPages;

  const onVendorSort = (key, nextDir) => {
    const map = { name: "name", risk: "riskLevel", status: "status" };
    vendor.setSort(map[key]);
    vendor.setDir(nextDir);
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      {/* Tabs + search */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg bg-slate-100/80 p-0.5 text-[12px]">
          {["vendors", "segments"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1 font-semibold capitalize ${
                tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="flex w-44 items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1.5">
          <Search size={12} className="text-slate-400" />
          <input
            value={vendor.query}
            onChange={(e) => vendor.setQuery(e.target.value)}
            placeholder="Filter rows..."
            aria-label="Filter rows"
            className="w-full bg-transparent text-[12px] focus:outline-none"
          />
        </label>
      </div>

      {/* Severity pills */}
      <div className="mb-2 flex gap-1">
        {["All", "High", "Medium", "Low"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => vendor.setSeverity(s)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              vendor.severity === s
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {tab === "vendors" ? (
        <>
          <div className="flex gap-3 px-1 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
            <SortHeader
              label="Vendor"
              k="name"
              sort={vendor.sort}
              dir={vendor.dir}
              onSort={onVendorSort}
            />
            <span className="flex-1" />
            <SortHeader
              label="Risk"
              k="risk"
              sort={vendor.sort}
              dir={vendor.dir}
              onSort={onVendorSort}
            />
            <SortHeader
              label="Status"
              k="status"
              sort={vendor.sort}
              dir={vendor.dir}
              onSort={onVendorSort}
            />
          </div>

          {vendor.loading ? (
            <ListSkeleton rows={4} />
          ) : vendor.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-4 text-center text-[12px] text-red-700">
              Vendors failed to load.{" "}
              <button type="button" onClick={vendor.refetch} className="font-semibold underline">
                Retry
              </button>
            </div>
          ) : vendor.rows.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-[12px] text-slate-400">
              No vendors match these filters.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {vendor.rows.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => onVendorClick(v)}
                    className="flex w-full items-center gap-2.5 rounded-xl bg-slate-50/70 px-3 py-2.5 text-left hover:bg-orange-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-800">
                      {initials(v.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-slate-800">
                        {v.name}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {v.endpoints} endpoints · {v.status}
                      </span>
                    </span>
                    <span className="hidden rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600 sm:inline">
                      {v.riskLevel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {mounted ? (
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Page {vendor.page + 1} of {pages} · {vendor.total} vendors
              </span>
              <span className="flex gap-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={vendor.page === 0}
                  onClick={() => vendor.setPage(Math.max(0, vendor.page - 1))}
                  className="rounded-md border border-slate-200 p-1.5 disabled:opacity-40"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={vendor.page >= pages - 1}
                  onClick={() => vendor.setPage(Math.min(pages - 1, vendor.page + 1))}
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
        </>
      ) : (
        <>
          <div className="flex gap-3 px-1 pb-1 text-[11px] uppercase tracking-wide text-slate-400">
            <SegSort label="Segment" k="name" segSort={segSort} segDir={segDir} setSegSort={setSegSort} setSegDir={setSegDir} />
            <span className="flex-1" />
            <SegSort label="Endpoints" k="endpoints" segSort={segSort} segDir={segDir} setSegSort={setSegSort} setSegDir={setSegDir} />
            <SegSort label="Health" k="health" segSort={segSort} segDir={segDir} setSegSort={setSegSort} setSegDir={setSegDir} />
          </div>
          {segments.loading ? (
            <ListSkeleton rows={4} />
          ) : segments.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-4 text-center text-[12px] text-red-700">
              Segments failed to load.{" "}
              <button type="button" onClick={segments.refetch} className="font-semibold underline">
                Retry
              </button>
            </div>
          ) : segRows.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-[12px] text-slate-400">
              No segments match this severity.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {segRows.map((s) => (
                <li key={s.vlanId}>
                  <button
                    type="button"
                    onClick={() => onSegmentClick(s)}
                    className="flex w-full items-center gap-2.5 rounded-xl bg-slate-50/70 px-3 py-2.5 text-left hover:bg-orange-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      {s.vlanId.replace("vlan-", "V")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-slate-800">
                        {s.name}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {s.endpoints} endpoints · {s.vlanId}
                      </span>
                    </span>
                    <span className="text-[12px] text-slate-500">{s.health}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function SortHeader({ label, k, sort, dir, onSort }) {
  const map = { name: "name", risk: "riskLevel", status: "status" };
  const active = sort === map[k];
  return (
    <button
      type="button"
      onClick={() => onSort(k, active && dir === "asc" ? "desc" : "asc")}
      className={`inline-flex items-center gap-1 hover:text-slate-800 ${active ? "text-slate-800" : ""}`}
    >
      {label}
      <ArrowUpDown size={11} className={active ? "text-orange-500" : "text-slate-300"} />
    </button>
  );
}

function SegSort({ label, k, segSort, segDir, setSegSort, setSegDir }) {
  const active = segSort === k;
  return (
    <button
      type="button"
      onClick={() => {
        if (active) setSegDir(-segDir);
        else {
          setSegSort(k);
          setSegDir(1);
        }
      }}
      className={`inline-flex items-center gap-1 hover:text-slate-800 ${active ? "text-slate-800" : ""}`}
    >
      {label}
      <ArrowUpDown size={11} className={active ? "text-orange-500" : "text-slate-300"} />
    </button>
  );
}
