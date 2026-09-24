"use client";

import { Mail } from "lucide-react";

/**
 * Latest vendors table (reference: Latest Customers).
 * @param {{ rows: { vendor: string, initials: string, meta: string, risk: string }[] }} props
 */
export default function VendorList({ rows }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-slate-800">Latest Vendors</h3>
        <button type="button" className="text-[12px] text-slate-400 hover:text-orange-500">
          View All
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map((v) => (
          <li
            key={v.vendor}
            className="flex items-center gap-2.5 rounded-xl bg-slate-50/70 px-3 py-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-800">
              {v.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-slate-800">
                {v.vendor}
              </span>
              <span className="block text-[11px] text-slate-400">{v.meta}</span>
            </span>
            <span className="hidden rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600 sm:inline">
              {v.risk}
            </span>
            <button
              type="button"
              aria-label={`Message ${v.vendor}`}
              className="rounded-full bg-white p-2 text-slate-400 shadow hover:text-orange-500"
            >
              <Mail size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
