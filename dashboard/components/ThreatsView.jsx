"use client";

import ThreatChart from "./ThreatChart";

/**
 * Threat intel workspace: full-width chart + event ledger.
 * @param {{ data: { time: string, threats: number, scans: number }[], events: { timestamp: string, count: number, severity: string, category: string }[], onEventClick: (e: object) => void }} props
 */
export default function ThreatsView({ data, events, onEventClick }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-slate-800">Threat Intelligence</h2>
        <p className="text-[12px] text-slate-400">Scan activity and event ledger.</p>
      </div>
      <ThreatChart data={data} blocked={events.reduce((n, e) => n + e.count, 0)} endpoints={87} />
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <h3 className="mb-2 text-[13px] font-bold text-slate-800">Event ledger</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {events.map((e, i) => (
            <li key={`${e.timestamp}-${i}`}>
              <button
                type="button"
                onClick={() => onEventClick(e)}
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-50/70 px-3 py-2 text-left text-[12px] hover:bg-orange-50"
              >
                <span className="font-semibold capitalize text-slate-700">{e.category}</span>
                <span className="text-slate-400">
                  {e.timestamp} · <span className="font-semibold text-slate-700">{e.count}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
