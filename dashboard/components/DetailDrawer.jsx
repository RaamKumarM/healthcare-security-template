"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";

/**
 * Sliding detail drawer for vendor / VLAN telemetry (stub data).
 * Vendor items additionally expose status editing + two-step delete.
 * @param {{
 *   item: null | { kind: string, title: string, meta: { k: string, v: string }[], vendorId?: string, status?: string },
 *   onClose: () => void,
 *   onStatusChange?: (id: string, status: string) => void,
 *   onDeleteVendor?: (id: string) => void,
 * }} props
 */
export default function DetailDrawer({ item, onClose, onStatusChange, onDeleteVendor }) {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    setConfirming(false);
  }, [item]);

  const isVendor = !!item?.vendorId;

  return (
    <div aria-hidden={!item} className={`fixed inset-0 z-[60] ${item ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/30 transition-opacity ${item ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label={item ? item.title : "Details"}
        className={`absolute right-3 top-3 flex h-[calc(100%-24px)] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform duration-200 ${
          item ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">{item?.kind ?? ""}</p>
            <h2 className="text-[14px] font-bold text-slate-800">{item?.title ?? "Details"}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="rounded-xl bg-orange-50 px-3 py-2 text-[12px] text-orange-700">
            Stub telemetry — read-only preview. No live systems access.
          </p>
          <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
            {(item?.meta ?? []).map((m) => (
              <div key={m.k} className="flex justify-between gap-3 px-3 py-2.5 text-[13px]">
                <dt className="text-slate-400">{m.k}</dt>
                <dd className="font-semibold text-slate-800">{m.v}</dd>
              </div>
            ))}
          </dl>

          {isVendor && (
            <div className="mt-3 rounded-xl border border-slate-100 p-3">
              <p className="text-[12px] font-bold text-slate-800">Modify status</p>
              <div className="mt-2 flex gap-1.5">
                {["Monitored", "Review", "Quarantined"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={item.status === s}
                    onClick={() => onStatusChange?.(item.vendorId, s)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold disabled:opacity-40 ${
                      item.status === s
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!confirming ? (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} /> Delete vendor
                </button>
              ) : (
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDeleteVendor?.(item.vendorId)}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-red-700"
                  >
                    Confirm delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[12px] text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
