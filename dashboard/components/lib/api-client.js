import { STUB_ROLE, STUB_TOKEN } from "./auth.js";

/** Mutable stub persona (Settings view can switch VIEWER/SECOPS/ADMIN). */
let currentRole = STUB_ROLE;

/** @param {string} role */
export function setRole(role) {
  currentRole = ["ADMIN", "SECOPS", "VIEWER"].includes(role) ? role : STUB_ROLE;
}

export function getRole() {
  return currentRole;
}

/**
 * Authenticated fetch wrapper for dashboard API calls (stub session).
 * @param {string} path
 * @param {RequestInit} [opts]
 */
export function apiFetch(path, opts = {}) {
  return fetch(path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${STUB_TOKEN}`,
      "x-soc-role": currentRole,
      ...(opts.headers ?? {}),
    },
    signal: opts.signal ?? AbortSignal.timeout(10000),
  });
}
