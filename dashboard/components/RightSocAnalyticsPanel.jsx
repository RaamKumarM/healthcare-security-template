"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Building2, Activity, Ban, HeartPulse } from "lucide-react";
import { mockSecurityFeed } from "./lib/mockSecurityFeed";

// Static stubs for tables/grids. Only live numbers come from mockSecurityFeed
// (activeVendors, endpointHealth, threatsBlocked, hipaaScore, timeseries).
const VENDOR_SCRM = [
  { vendor: "MedNet Labs", risk: "Low", status: "Monitored" },
  { vendor: "CareCloud", risk: "Medium", status: "Review" },
  { vendor: "PharmaLink", risk: "Low", status: "Monitored" },
];

const SEGMENTATION = [
  { segment: "Clinical VLAN", endpoints: 42, health: "Healthy" },
  { segment: "Guest VLAN", endpoints: 18, health: "Isolated" },
  { segment: "IoMT VLAN", endpoints: 27, health: "Degraded" },
];

function RibbonCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        <Icon size={16} /> {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function RightSocAnalyticsPanel() {
  const { activeVendors, endpointHealth, threatsBlocked, hipaaScore, timeseries } =
    mockSecurityFeed;

  return (
    <section aria-label="SOC analytics panel" className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <RibbonCard icon={Building2} label="Active Vendors" value={activeVendors} />
        <RibbonCard icon={Activity} label="Endpoint Health %" value={`${endpointHealth}%`} />
        <RibbonCard icon={Ban} label="Threats Blocked" value={threatsBlocked} />
        <RibbonCard icon={HeartPulse} label="HIPAA Score" value={hipaaScore} />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          24h Network Threats & Dependency Scan Events
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b" }}
              />
              <Line type="monotone" dataKey="threats" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Vendor Network SCRM
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-1">Vendor</th>
                <th className="py-1">Risk</th>
                <th className="py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {VENDOR_SCRM.map((v) => (
                <tr key={v.vendor} className="border-t border-slate-800">
                  <td className="py-2">{v.vendor}</td>
                  <td className="py-2">{v.risk}</td>
                  <td className="py-2">{v.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Network Segmentation & Endpoint Status
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-1">Segment</th>
                <th className="py-1">Endpoints</th>
                <th className="py-1">Health</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENTATION.map((s) => (
                <tr key={s.segment} className="border-t border-slate-800">
                  <td className="py-2">{s.segment}</td>
                  <td className="py-2">{s.endpoints}</td>
                  <td className="py-2">{s.health}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
