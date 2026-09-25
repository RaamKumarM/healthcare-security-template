import crypto from "node:crypto";

/**
 * Webhook request authentication (HMAC-SHA256, Node built-in only).
 * Senders sign the raw body:  x-soc-signature: sha256=<hex>.
 * Simple integrators may instead send the shared secret as x-api-key.
 */

export const STUB_WEBHOOK_SECRET = "soc-webhook-secret";

export function getWebhookSecret() {
  return process.env.SOC_WEBHOOK_SECRET ?? STUB_WEBHOOK_SECRET;
}

/**
 * @param {string} secret
 * @param {string} rawBody
 * @returns {string} "sha256=<hex>"
 */
export function signPayload(secret, rawBody) {
  return `sha256=${crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;
}

/**
 * @param {string} secret
 * @param {string} rawBody
 * @param {string} signature
 * @returns {boolean}
 */
export function verifySignature(secret, rawBody, signature) {
  if (!signature || !signature.startsWith("sha256=")) return false;
  const expected = signPayload(secret, rawBody);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * @param {Request} req
 * @param {string} rawBody
 * @returns {boolean} true if HMAC signature or API key is valid
 */
export function isWebhookAuthorized(req, rawBody) {
  const secret = getWebhookSecret();
  if (verifySignature(secret, rawBody, req.headers.get("x-soc-signature") ?? "")) return true;
  const key = req.headers.get("x-api-key") ?? "";
  return key.length > 0 && key === secret;
}
