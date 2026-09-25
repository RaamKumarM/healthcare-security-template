import { mockSecurityFeed } from "./mockSecurityFeed.js";

/**
 * Canonical mock datasets (stub only). UI stubs mirror these records.
 * @typedef {import("./types.js").Vendor} Vendor
 * @typedef {import("./types.js").NetworkSegment} NetworkSegment
 * @typedef {import("./types.js").ThreatEvent} ThreatEvent
 */

const SCAN_TS = "2026-09-25T00:00:00.000Z";

/** @type {Vendor[]} */
export const vendors = [
  { id: "v-mednet", name: "MedNet Labs", riskLevel: "Low", status: "Monitored", endpoints: 12, lastScanned: SCAN_TS, severity: "Low" },
  { id: "v-care", name: "CareCloud", riskLevel: "Medium", status: "Review", endpoints: 9, lastScanned: SCAN_TS, severity: "Medium" },
  { id: "v-pharma", name: "PharmaLink", riskLevel: "Low", status: "Monitored", endpoints: 21, lastScanned: SCAN_TS, severity: "Low" },
  { id: "v-nova", name: "Nova Diagnostics", riskLevel: "High", status: "Quarantined", endpoints: 6, lastScanned: SCAN_TS, severity: "High" },
  { id: "v-helix", name: "Helix Billing", riskLevel: "Medium", status: "Monitored", endpoints: 14, lastScanned: SCAN_TS, severity: "Medium" },
  { id: "v-steri", name: "SteriSupply Co", riskLevel: "High", status: "Review", endpoints: 8, lastScanned: SCAN_TS, severity: "High" },
];

/** @type {NetworkSegment[]} */
export const segments = [
  { vlanId: "vlan-10", name: "Clinical VLAN", endpoints: 42, health: "Healthy", severity: "Low" },
  { vlanId: "vlan-20", name: "Guest VLAN", endpoints: 18, health: "Isolated", severity: "Medium" },
  { vlanId: "vlan-30", name: "IoMT VLAN", endpoints: 27, health: "Degraded", severity: "High" },
  { vlanId: "vlan-40", name: "Research VLAN", endpoints: 12, health: "Healthy", severity: "Low" },
  { vlanId: "vlan-50", name: "Backup VLAN", endpoints: 9, health: "Isolated", severity: "Medium" },
];

const CATEGORIES = ["intrusion", "malware", "egress", "dependency"];

/** Threat scan series derived from the contracted mock feed shape. @returns {ThreatEvent[]} */
export function threatEvents() {
  return mockSecurityFeed.timeseries.map((t, i) => ({
    timestamp: t.time,
    count: t.threats,
    severity: t.threats >= 10 ? "High" : t.threats >= 5 ? "Medium" : "Low",
    category: CATEGORIES[i % CATEGORIES.length],
  }));
}

/** Aggregated KPIs + series, matching SecurityMetrics. */
export function securityMetrics() {
  return {
    threatsBlocked: mockSecurityFeed.threatsBlocked,
    activeVendors: mockSecurityFeed.activeVendors,
    hipaaScore: mockSecurityFeed.hipaaScore,
    endpointHealth: mockSecurityFeed.endpointHealth,
    timeseries: threatEvents(),
  };
}

/** In-memory mock action log (process-local stub). */
export const actionLog = [];
