"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { apiFetch, getRole, setRole } from "./lib/api-client";
import { useToast } from "./lib/toast";

/**
 * Settings workspace: stub persona role, theme, runtime status.
 * @param {{ theme: string, onTheme: (t: string) => void }} props
 */
export default function SettingsView({ theme, onTheme }) {
  const toast = useToast();
  const [role, setRoleState] = useState(getRole());
  const [runtime, setRuntime] = useState(null);

  useEffect(() => {
    apiFetch("/api/healthz")
      .then((r) => r.json())
      .then((b) => {
        if (b.ok || b.checks) setRuntime(b.checks);
      })
      .catch(() => {});
  }, []);

  const pickRole = (r) => {
    setRole(r);
    setRoleState(r);
    toast.success(`Stub persona → ${r}. POST /api/* now enforces ${r} permissions.`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-slate-800">Settings</h2>
        <p className="text-[12px] text-slate-400">Persona, appearance, and runtime status (stub).</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <h3 className="text-[13px] font-bold text-slate-800">Stub persona role</h3>
        <p className="text-[12px] text-slate-400">Demonstrates proxy RBAC on mutating endpoints.</p>
        <div className="mt-2 flex gap-1.5">
          {["VIEWER", "SECOPS", "ADMIN"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => pickRole(r)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                role === r ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <h3 className="text-[13px] font-bold text-slate-800">Appearance</h3>
        <div className="mt-2 flex gap-1.5 text-[12px]">
          <button
            type="button"
            onClick={() => onTheme("dark")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 ${
              theme === "dark" ? "bg-slate-900 font-semibold text-white" : "bg-slate-100 text-slate-400"
            }`}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            type="button"
            onClick={() => onTheme("light")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 ${
              theme === "light" ? "bg-white font-semibold text-slate-800 shadow" : "bg-slate-100 text-slate-400"
            }`}
          >
            <Sun size={14} /> Light
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <h3 className="text-[13px] font-bold text-slate-800">Runtime status</h3>
        {runtime ? (
          <dl className="mt-2 divide-y divide-slate-100 text-[12px]">
            <div className="flex justify-between py-1.5">
              <dt className="text-slate-400">Database</dt>
              <dd className="font-semibold text-slate-800">
                {runtime.database?.status} · {runtime.database?.vendors ?? 0} vendors
              </dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-slate-400">Uptime / memory</dt>
              <dd className="font-semibold text-slate-800">
                {runtime.runtime?.uptimeS ?? 0}s · {runtime.runtime?.memoryMb ?? 0} MB
              </dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-slate-400">Webhook signing</dt>
              <dd className="font-semibold text-slate-800">
                {runtime.integrations?.webhookSigningConfigured ? "configured" : "stub default"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-[12px] text-slate-400">Loading runtime status…</p>
        )}
      </div>
    </div>
  );
}
