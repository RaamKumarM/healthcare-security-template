"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ShieldCheck, Siren, HeartPulse } from "lucide-react";
import NavRail from "./NavRail";
import KpiCard from "./KpiCard";
import ThreatChart from "./ThreatChart";
import VendorList from "./VendorList";
import ScoreDonut from "./ScoreDonut";
import ProfilePanel from "./ProfilePanel";
import { mockSecurityFeed } from "./lib/mockSecurityFeed";

/** Analytics-style SOC shell rebuilt from scratch (reference: analytics dashboard). */

const VENDORS = [
  { vendor: "MedNet Labs", initials: "ML", meta: "12 endpoints · Low risk", risk: "Low" },
  { vendor: "CareCloud", initials: "CC", meta: "9 endpoints · Medium risk", risk: "Medium" },
  { vendor: "PharmaLink", initials: "PL", meta: "21 endpoints · Low risk", risk: "Low" },
  { vendor: "Nova Diagnostics", initials: "ND", meta: "6 endpoints · High risk", risk: "High" },
];

export default function SocAnalytics() {
  const [active, setActive] = useState("dashboard");

  const chartData = mockSecurityFeed.timeseries.map((t) => ({
    time: t.time,
    threats: t.threats,
    scans: t.threats * 3 + 4,
  }));

  return (
    <div className="min-h-screen bg-[#e6eaf1] p-3 text-[13px] text-slate-800 sm:p-5">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-hidden rounded-[24px] bg-[#f7f8fb] shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <NavRail active={active} onNavigate={setActive} />

        {/* Center column */}
        <main className="min-w-0 flex-1 border-x border-slate-100 bg-white/40 px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-emerald-950">Analytics</h1>
              <p className="text-[12px] text-slate-400">Welcome back, let&apos;s get back to work.</p>
            </div>
            <label className="flex w-64 items-center gap-2 rounded-lg bg-slate-100/80 px-3 py-2">
              <Search size={14} className="text-slate-400" />
              <input
                placeholder="Search Dashboard"
                aria-label="Search Dashboard"
                className="w-full bg-transparent text-[13px] placeholder:text-slate-400 focus:outline-none"
              />
              <SlidersHorizontal size={14} className="text-slate-400" />
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <KpiCard
              icon={ShieldCheck}
              tint="bg-indigo-800"
              label="Active Vendors"
              value={mockSecurityFeed.activeVendors}
              pct={72}
              delta="45%"
            />
            <KpiCard
              icon={Siren}
              tint="bg-rose-400"
              label="Threats Blocked"
              value={mockSecurityFeed.threatsBlocked}
              pct={88}
              delta="55%"
            />
            <KpiCard
              icon={HeartPulse}
              tint="bg-green-500"
              label="HIPAA Score"
              value={mockSecurityFeed.hipaaScore}
              pct={mockSecurityFeed.hipaaScore}
              delta="15%"
            />
          </div>

          <div className="mt-4">
            <ThreatChart data={chartData} />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <VendorList rows={VENDORS} />
            <ScoreDonut score={mockSecurityFeed.hipaaScore} coverage={86} />
          </div>
        </main>

        <ProfilePanel
          vendors={mockSecurityFeed.activeVendors}
          blocked={mockSecurityFeed.threatsBlocked}
          score={mockSecurityFeed.hipaaScore}
        />
      </div>
    </div>
  );
}
