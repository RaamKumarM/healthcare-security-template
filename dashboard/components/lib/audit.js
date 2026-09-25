import { appendAudit } from "./store.js";

/**
 * Centralized immutable compliance audit logger.
 * Every sensitive operation must go through this function — entries are
 * append-only (no update/delete API exists on the audit log).
 *
 * @param {{ userId: string, action: string, targetResource?: string, metadata?: object, status?: string }} evt
 * @returns {{ id: string, action: string, performedBy: string, targetResource: string, metadata: object, status: string, timestamp: string }}
 */
export function logAuditEvent({ userId, action, targetResource = "-", metadata = {}, status = "ok" }) {
  if (!userId || !action) {
    throw new Error("logAuditEvent requires userId and action.");
  }
  return appendAudit({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    action,
    performedBy: userId,
    targetResource,
    metadata,
    status,
    timestamp: new Date().toISOString(),
  });
}
