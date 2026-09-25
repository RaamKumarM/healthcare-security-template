"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Bell, User, ChevronRight, Target, CalendarCheck, Settings } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/**
 * Right profile rail with gauge (reference: profile panel + Project Status gauge).
 * @param {{ vendors: number, blocked: number, score: number, onNavigate: (id: string) => void }} props
 */

const LINKS = [
  { label: "Pending Reviews", target: "reviews", icon: Target, tint: "bg-indigo-50 text-indigo-700" },
  { label: "Compliance Plan", target: "audit", icon: CalendarCheck, tint: "bg-rose-50 text-rose-500" },
  { label: "Settings", target: "settings", icon: Settings, tint: "bg-orange-50 text-orange-500" },
];

export default function ProfilePanel({ vendors, blocked, score, onNavigate }) {
  const [popup, setPopup] = useState(null);
  const toggle = (p) => setPopup((cur) => (cur === p ? null : p));
  // Notification dot clears once the bell popup has been opened (persisted).
  const [unread, setUnread] = useState(true);
  useEffect(() => {
    try {
      if (window.localStorage.getItem("soc-bell-read") === "1") setUnread(false);
    } catch {
      /* private mode */
    }
  }, []);
  const openBell = () => {
    toggle("bell");
    setUnread(false);
    try {
      window.localStorage.setItem("soc-bell-read", "1");
    } catch {
      /* noop */
    }
  };

  const MESSAGES = [
    { from: "SOC Bot", text: "Nightly scan finished — 142 threats blocked." },
    { from: "CareCloud", text: "Endpoint review requested for 9 nodes." },
  ];
  const NOTICES = [
    { text: "Blocked outbound connection to untrusted host", time: "2m ago" },
    { text: "New vendor endpoint awaiting review", time: "1h ago" },
    { text: "HPH CPG policy check completed", time: "3h ago" },
  ];
  const gauge = [
    { name: "passing", value: 132 },
    { name: "rest", value: 11 },
  ];

  return (
    <aside aria-label="Profile panel" className="flex w-60 shrink-0 flex-col gap-4 px-4 py-5">
      <div className="relative flex items-center justify-end gap-2">
        <button type="button" aria-label="Messages" onClick={() => toggle("messages")} className="rounded-lg bg-white p-2 text-slate-400 shadow-sm hover:text-orange-500">
          <MessageSquare size={16} />
        </button>
        <button type="button" aria-label="Notifications" onClick={openBell} className="relative rounded-lg bg-white p-2 text-slate-400 shadow-sm hover:text-orange-500">
          <Bell size={16} />
          {unread && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />}
        </button>
        <button type="button" aria-label="Profile" onClick={() => toggle("user")} className="rounded-lg bg-white p-2 text-slate-400 shadow-sm hover:text-orange-500">
          <User size={16} />
        </button>
        {popup && (
          <>
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setPopup(null)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
              {popup === "messages" && (
                <>
                  <p className="mb-2 text-[12px] font-bold text-slate-800">Messages</p>
                  <ul className="flex flex-col gap-2">
                    {MESSAGES.map((m) => (
                      <li key={m.from} className="rounded-lg bg-slate-50 px-2.5 py-2">
                        <p className="text-[12px] font-semibold text-slate-700">{m.from}</p>
                        <p className="text-[12px] text-slate-500">{m.text}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {popup === "bell" && (
                <>
                  <p className="mb-2 text-[12px] font-bold text-slate-800">Notifications</p>
                  <ul className="flex flex-col gap-2">
                    {NOTICES.map((n) => (
                      <li key={n.text} className="rounded-lg bg-slate-50 px-2.5 py-2">
                        <p className="text-[12px] text-slate-700">{n.text}</p>
                        <p className="text-[11px] text-slate-400">{n.time} · stub</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {popup === "user" && (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-[12px] font-bold text-white">
                      SO
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold text-slate-800">SecOps</span>
                      <span className="block text-[11px] text-slate-400">Security Analyst</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPopup(null);
                      onNavigate("settings");
                    }}
                    className="mt-2.5 w-full rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-semibold text-white hover:bg-slate-700"
                  >
                    Open Settings
                  </button>
                </>
              )}
            </div>
          </>
        )}
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
            onClick={() => onNavigate(l.target)}
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
