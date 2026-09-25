"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "./lib/api-client";
import { useToast } from "./lib/toast";

/**
 * Onboard-vendor dialog (stub persistence).
 * @param {{ open: boolean, onClose: () => void, onCreated: () => void }} props
 */
export default function AddVendorModal({ open, onClose, onCreated }) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [riskLevel, setRiskLevel] = useState("Medium");
  const [status, setStatus] = useState("Review");
  const [endpoints, setEndpoints] = useState("5");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vendor name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), riskLevel, status, endpoints }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Onboard failed.");
      toast.success(`Vendor "${body.data.vendor.name}" onboarded.`);
      setName("");
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onboard failed.");
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] focus:border-orange-400 focus:outline-none";

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-[14px] font-bold text-slate-800">Add New Vendor</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex flex-col gap-2.5 px-4 pb-2">
          <label className="text-[12px] text-slate-500">
            Vendor name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Health" className={`${field} mt-1`} />
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <label className="text-[12px] text-slate-500">
              Risk level
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className={`${field} mt-1`}>
                {["Low", "Medium", "High"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="text-[12px] text-slate-500">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${field} mt-1`}>
                {["Monitored", "Review", "Quarantined"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-[12px] text-slate-500">
            Endpoints
            <input
              type="number"
              min="0"
              value={endpoints}
              onChange={(e) => setEndpoints(e.target.value)}
              className={`${field} mt-1`}
            />
          </label>
          {error && <p className="rounded-lg bg-red-50 px-2.5 py-2 text-[12px] text-red-700">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-500 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Onboard Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
}
