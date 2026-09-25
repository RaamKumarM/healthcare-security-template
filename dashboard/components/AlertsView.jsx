"use client";

import { useState } from "react";

/**
 * Threat alerts feed with severity filter; click opens the drawer.
 * @param {{ events: { timestamp: string, count: number, severity: string, category: string }[], onAlertClick: (e: object) => void }} props
 */
export default function AlertsView({ events, onAlertClick }) {
  const [severity, setSeverity] = useState("All");
  const rows = severity === "All" ? events : events.filter((e) => e.severity === severity);

  const pill =
    "rounded-full px-2 py-0.5 text-[11px] font-semibold border " +
    "data-[s=High]:border-red-200 data-[s=High]:bg-red-50 data-[s=High]:text-red-700 " +
    "data-[s=Medium]:border-amber-200 data-[s=Medium]:bg-amber-50 data-[s=Medium]:text-amber-700 " +
    "data-[s=Low]:border-emerald-200 data-[s=Low]:bg-emerald-50 data-[s=Low]:text-emerald-700";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-slate-800">Threat Alerts</h2>
        <p className="text-[12px] text-slate-400">Live scan feed — select an alert for telemetry.</p>
      </div>
      <div className="flex gap-1">
        {["All", "High", "Medium", "Low"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeverity(s)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              severity === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        {rows.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-[12px] text-slate-400">
            No alerts at this severity.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {rows.map((e, i) => (
              <li key={`${e.timestamp}-${i}`}>
                <button
                  type="button"
                  onClick={() => onAlertClick(e)}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-50/70 px-3 py-2.5 text-left hover:bg-orange-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold capitalize text-slate-800">
                      {e.category} · {e.count} events
                    </span>
                    <span className="block text-[11px] text-slate-400">{e.timestamp}</span>
                  </span>
                  <span data-s={e.severity} className={pill}>
                    {e.severity}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
