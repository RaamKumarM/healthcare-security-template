/**
 * Shared JSDoc type definitions mirroring data-contracts/soc-entities.schema.json.
 * Plain .js (no TS dependency — `typescript` is not an approved package).
 *
 * @typedef {"Low" | "Medium" | "High"} RiskLevel
 * @typedef {"Monitored" | "Review" | "Quarantined"} VendorStatus
 * @typedef {"Healthy" | "Isolated" | "Degraded"} SegmentHealth
 * @typedef {"intrusion" | "malware" | "egress" | "dependency"} ThreatCategory
 *
 * @typedef {Object} Vendor
 * @property {string} id
 * @property {string} name
 * @property {RiskLevel} riskLevel
 * @property {VendorStatus} status
 * @property {number} endpoints
 * @property {string} lastScanned ISO timestamp (stub)
 * @property {RiskLevel} [severity]
 *
 * @typedef {Object} NetworkSegment
 * @property {string} vlanId
 * @property {string} name
 * @property {number} endpoints
 * @property {SegmentHealth} health
 * @property {RiskLevel} [severity]
 *
 * @typedef {Object} ThreatEvent
 * @property {string} timestamp
 * @property {number} count
 * @property {RiskLevel} severity
 * @property {ThreatCategory} category
 *
 * @typedef {Object} SecurityMetrics
 * @property {number} threatsBlocked
 * @property {number} activeVendors
 * @property {number} hipaaScore
 * @property {number} endpointHealth
 * @property {ThreatEvent[]} [timeseries]
 *
 * @typedef {Object} RotateKeysPayload
 * @property {string} [scope]
 * @property {string} [reason]
 *
 * @typedef {Object} AccessUpdatePayload
 * @property {string} subject
 * @property {string} role
 * @property {"grant" | "revoke"} [action]
 *
 * @typedef {Object} PolicyAuditPayload
 * @property {"hipaa" | "cpg" | "both"} [framework]
 *
 * @typedef {Object} ReportRequestPayload
 * @property {"json" | "csv"} format
 * @property {"vendors" | "segments" | "metrics"} [scope]
 *
 * @typedef {Object} PageResult
 * @property {any[]} rows
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 */

export const __types = true;
