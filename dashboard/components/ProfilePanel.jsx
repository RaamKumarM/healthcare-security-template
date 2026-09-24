"use client";

import { MessageSquare, Bell, User, ChevronRight, Target, CalendarCheck, Settings } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/**
 * Right profile rail with gauge (reference: profile panel + Project Status gauge).
 * @param {{ vendors: number, blocked: number, score: number }} props
 */

const LINKS = [
  { label: "Playbooks", icon: Target, tint: "bg-indigo-50 text-indigo-700" },
  { label: "Compliance Plan", icon: CalendarCheck, tint: "bg-rose-50 text-rose-500" },
  { label: "Settings", icon: Settings, tint: "bg-orange-50 text-orange-500" },
];

export default function ProfilePanel({ vendors, blocked, score }) {
  const gauge = [
    { name: "passing", value: 132 },
    { name: "rest", value: 11 },
  ];

  return (
    <aside aria-label="Profile panel" className="flex w-60 shrink-0 flex-col gap-4 px-4 py-5">
      <div className="flex items-center justify-end gap-2">
        <button type="button" aria-label="Messages" className="rounded-lg bg-white p-2 text-slate-400 shadow-sm hover:text-orange-500">
          <MessageSquare size={16} />
        </button>
        <button type="button" aria-label="Notifications" className="relative rounded-lg bg-white p-2 text-slate-400 shadow-sm hover:text-orange-500">
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>
        <button type="button" aria-label="Profile" className="rounded-lg bg-white p-2 text-slate-400 shadow-sm hover:text-orange-500">
          <User size={16} />
        </button>
      </div>

      {/* Avatar with progress ring */}
      <div className="flex flex-col items-center">
        <span className="relative flex h-20 w-20 items-center justify-center">
          <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#ede9fe" strokeWidth="5" />
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="#3730a3"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - score / 100)}`}
            />
          </svg>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
            SO
          </span>
        </span>
        <p className="mt-1 text-[14px] font-bold text-slate-800">SecOps</p>
        <p className="text-[12px] text-slate-400">Security Analyst</p>
      </div>

      <div className="flex justify-between text-center">
        {[
          { v: vendors, l: "Vendors" },
          { v: blocked, l: "Blocked" },
          { v: score, l: "Score" },
        ].map((s) => (
          <span key={s.l}>
            <span className="block text-[15px] font-bold text-indigo-900">{s.v}</span>
            <span className="block text-[11px] text-slate-400">{s.l}</span>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {LINKS.map((l) => (
          <button
            key={l.label}
            type="button"
            className="flex items-center gap-2.5 rounded-xl bg-white/60 px-2 py-1.5 hover:bg-white"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${l.tint}`}>
              <l.icon size={16} />
            </span>
            <span className="flex-1 text-left text-[13px] font-medium text-slate-600">{l.label}</span>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      {/* Gauge */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <p className="text-[13px] font-bold text-slate-800">Control Status</p>
        <p className="text-[15px] font-bold text-slate-800">
          121 <span className="font-normal text-slate-300">/ 143</span>
        </p>
        <p className="text-[11px] text-slate-400">checks passing</p>
        <div className="mx-auto h-28 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gauge}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                strokeWidth={0}
              >
                <Cell fill="#f97316" />
                <Cell fill="#e2e8f0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </aside>
  );
}
