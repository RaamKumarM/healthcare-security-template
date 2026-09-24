"use client";

import {
  LayoutDashboard,
  Inbox,
  Building2,
  Flame,
  CalendarCheck,
  Settings,
  ScrollText,
  Moon,
  Sun,
  Plus,
} from "lucide-react";

/**
 * Left navigation rail (reference: analytics sidebar).
 * @param {{ active: string, onNavigate: (id: string) => void }} props
 */

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "alerts", label: "Alerts", icon: Inbox },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "threats", label: "Threat Intel", icon: Flame },
  { id: "reviews", label: "Reviews", icon: CalendarCheck, badge: "5" },
];

const SYSTEM = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "audit", label: "Audit Log", icon: ScrollText },
];

export default function NavRail({ active, onNavigate }) {
  const item = (l) => {
    const isActive = active === l.id;
    return (
      <button
        key={l.id}
        type="button"
        onClick={() => onNavigate(l.id)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
          isActive ? "font-semibold text-orange-500" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <l.icon size={16} className="shrink-0" />
        <span className="flex-1 text-left">{l.label}</span>
        {l.badge && (
          <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {l.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside aria-label="Primary" className="flex w-52 shrink-0 flex-col gap-4 px-4 py-5">
      {/* Analyst profile */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-[13px] font-bold text-white">
          SO
        </span>
        <span>
          <span className="block text-[13px] font-bold text-slate-800">SecOps</span>
          <span className="block text-[11px] text-slate-400">Security Analyst</span>
        </span>
      </div>

      {/* Workspace switcher */}
      <div>
        <p className="mb-1 text-[11px] text-slate-400">Teams</p>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] text-slate-700"
        >
          Healthcare SOC
          <span className="text-slate-400">↕</span>
        </button>
      </div>

      {/* Menu */}
      <nav className="space-y-0.5">
        <p className="px-1 text-[11px] text-slate-400">Menu</p>
        {MENU.map(item)}
      </nav>

      <nav className="space-y-0.5">
        <p className="px-1 text-[11px] text-slate-400">System</p>
        {SYSTEM.map(item)}
      </nav>

      {/* Add vendor card */}
      <button
        type="button"
        className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-slate-300 px-3 py-5 text-slate-500 hover:border-orange-400 hover:text-orange-500"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
          <Plus size={16} />
        </span>
        <span className="text-[13px] font-semibold">Add New Vendor</span>
        <span className="text-[11px]">or review invite link</span>
      </button>

      {/* Dark / Light stub */}
      <div className="mt-auto flex items-center gap-2 text-[12px]">
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-slate-400">
          <Moon size={14} /> Dark
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2 font-semibold text-slate-800 shadow">
          <Sun size={14} /> Light
        </span>
      </div>
    </aside>
  );
}
