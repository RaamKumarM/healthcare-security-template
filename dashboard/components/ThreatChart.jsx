"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Threat activity combo chart (orange bars + indigo line) with side mini tiles.
 * @param {{ data: { time: string, threats: number, scans: number }[], blocked?: number, endpoints?: number }} props
 */

const TILES = [
  { label: "Egress Blocks", value: "38" },
  { label: "Open Reviews", value: "12" },
  { label: "MTTR", value: "26m" },
];

export default function ThreatChart({ data, blocked = 142, endpoints = 87 }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap gap-6 text-[12px] text-slate-400">
          <span>
            Threats blocked <span className="block text-[15px] font-bold text-slate-800">{blocked}</span>
          </span>
          <span>
            Period <span className="block text-[15px] font-bold text-slate-800">24 hours</span>
          </span>
          <span>
            Vendor endpoints <span className="block text-[15px] font-bold text-slate-800">{endpoints}</span>
          </span>
        </div>
        <div className="mt-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#eef1f6" vertical={false} />
              <XAxis dataKey="time" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="scans" fill="#f97316" radius={[6, 6, 0, 0]} barSize={18} />
              <Line
                type="monotone"
                dataKey="threats"
                stroke="#3730a3"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {TILES.map((t) => (
          <div
            key={t.label}
            className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
          >
            <p className="text-[12px] text-slate-400">{t.label}</p>
            <p className="text-xl font-bold text-slate-800">{t.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
