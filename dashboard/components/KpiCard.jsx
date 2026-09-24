"use client";

/**
 * KPI card with icon medallion, progress bar and delta (reference: top stat cards).
 * @param {{ icon: React.ElementType, tint: string, label: string, value: string | number, pct: number, delta: string }} props
 */
export default function KpiCard({ icon: Icon, tint, label, value, pct, delta }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${tint}`}>
          <Icon size={17} />
        </span>
        <span>
          <span className="block text-[11px] text-slate-400">{label}</span>
          <span className="block text-[15px] font-bold text-slate-800">{value}</span>
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-800" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[12px] font-semibold text-indigo-800">+ {delta}</p>
    </div>
  );
}
