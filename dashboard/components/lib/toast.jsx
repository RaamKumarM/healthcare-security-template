"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

/**
 * @typedef {"success" | "warning" | "error"} ToastKind
 * @typedef {{ id: number, kind: ToastKind, message: string }} Toast
 */

const ToastContext = createContext(null);

/** Global toast provider (light cards matching dashboard style). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((kind, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const api = useMemo(
    () => ({
      success: (m) => push("success", m),
      warning: (m) => push("warning", m),
      error: (m) => push("error", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[70] flex w-80 flex-col gap-2">
        {toasts.map((t) => {
          const Icon =
            t.kind === "success" ? CheckCircle2 : t.kind === "warning" ? AlertTriangle : XCircle;
          const bar =
            t.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : t.kind === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-red-200 bg-red-50 text-red-800";
          return (
            <div
              key={t.id}
              className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[13px] shadow-lg ${bar}`}
            >
              <Icon size={15} className="mt-0.5 shrink-0" />
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                className="opacity-60 hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/** @returns {{ success: (m: string) => void, warning: (m: string) => void, error: (m: string) => void }} */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { success: () => {}, warning: () => {}, error: () => {} };
  return ctx;
}
