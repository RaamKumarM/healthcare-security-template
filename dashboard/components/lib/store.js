import fs from "node:fs";
import path from "node:path";
import { vendors, segments, securityMetrics } from "./mockDb.js";

/**
 * File-backed JSON persistence (no ORM dependency — prisma/drizzle are not
 * approved packages). Auto-seeds from mock datasets on first read.
 */

const DB_PATH = path.join(process.cwd(), "data", "soc-db.json");

function seedPayload() {
  return {
    vendors: structuredClone(vendors),
    segments: structuredClone(segments),
    metrics: securityMetrics(),
    /** @type {any[]} AuditLog: { id, action, performedBy, status, timestamp } */
    auditLog: [],
    seededAt: new Date().toISOString(),
  };
}

/** @returns {{ vendors: any[], segments: any[], metrics: any, auditLog: any[] }} */
export function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return seedDb();
  }
}

/** @param {object} db */
export function writeDb(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function seedDb() {
  const db = seedPayload();
  writeDb(db);
  return db;
}

/** @param {object} entry @returns {object} */
export function appendAudit(entry) {
  const db = readDb();
  db.auditLog.push(entry);
  writeDb(db);
  return entry;
}
