"use client";

import { X, Download } from "lucide-react";

/**
 * Audit status modal with optional JSON download.
 * @param {{ open: boolean, title: string, lines: { k: string, v: string }[], onDownload: () => void, onClose: () => void }} props
 */
export default function ActionModal({ open, title, lines, onDownload, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>
        <dl className="mx-4 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {lines.map((l) => (
            <div key={l.k} className="flex justify-between gap-3 px-3 py-2.5 text-[13px]">
              <dt className="text-slate-400">{l.k}</dt>
              <dd className="font-semibold text-slate-800">{l.v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-slate-700"
          >
            <Download size={13} /> Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
