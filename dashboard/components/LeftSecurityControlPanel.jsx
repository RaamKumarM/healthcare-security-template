"use client";

import { useState } from "react";
import { ShieldAlert, Lock, ArrowUpRight } from "lucide-react";

// Read-only stubs. Toggles are local UI state only — no writes to real systems.
const POLICY_TOGGLES = [
  { id: "hph-cpg-1", label: "HPH CPG: Network Segmentation" },
  { id: "hph-cpg-2", label: "HPH CPG: Endpoint Protection" },
  { id: "hph-cpg-3", label: "HPH CPG: Egress Filtering" },
];

const THREAT_ALERTS = [
  { id: "a1", severity: "high", text: "Blocked outbound connection to untrusted host" },
  { id: "a2", severity: "medium", text: "Anomalous dependency scan event flagged" },
  { id: "a3", severity: "low", text: "New vendor endpoint observed" },
];

export default function LeftSecurityControlPanel() {
  const [toggles, setToggles] = useState({ "hph-cpg-1": true, "hph-cpg-2": true, "hph-cpg-3": false });

  return (
    <section aria-label="Security control panel" className="flex flex-col gap-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          HPH CPG Policy Toggles
        </h2>
        <ul className="flex flex-col gap-3">
          {POLICY_TOGGLES.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3">
              <span className="text-sm">{p.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={!!toggles[p.id]}
                aria-label={p.label}
                onClick={() => setToggles((t) => ({ ...t, [p.id]: !t[p.id] }))}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  toggles[p.id] ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    toggles[p.id] ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">Local stub only — no system writes.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <ShieldAlert size={16} /> Threat / Egress Alerts
        </h2>
        <ul className="flex flex-col gap-2">
          {THREAT_ALERTS.map((a) => (
            <li
              key={a.id}
              className="flex items-start gap-2 rounded-lg bg-slate-950 p-2 text-sm"
            >
              <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <span>
                <span className="mr-2 rounded bg-slate-800 px-1.5 py-0.5 text-xs uppercase text-slate-300">
                  {a.severity}
                </span>
                {a.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Lock size={16} /> Admin Override
        </h2>
        <p className="text-sm text-slate-400">
          Read-only stub. Override actions are disabled in this template.
        </p>
        <button
          type="button"
          disabled
          title="Disabled stub"
          className="mt-3 w-full cursor-not-allowed rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-500"
        >
          Request Override (disabled)
        </button>
      </div>
    </section>
  );
}
