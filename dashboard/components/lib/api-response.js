/**
 * Standardized API response envelope + error middleware wrapper.
 * Success: { ok: true, data }  ·  Failure: { ok: false, error: { code, message } }
 */

/** @param {any} data @param {number} [status] */
export function ok(data, status = 200) {
  return Response.json({ ok: true, data }, { status });
}

/**
 * @param {string} code machine-readable code (e.g. BAD_REQUEST)
 * @param {string} message human-readable message
 * @param {number} [status]
 */
export function fail(code, message, status = 400) {
  return Response.json({ ok: false, error: { code, message } }, { status });
}

/**
 * Wraps a route handler with JSON error formatting.
 * @param {(req: Request, ctx?: any) => Promise<Response>} fn
 */
export function withHandler(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error (stub).";
      return fail("INTERNAL", message, 500);
    }
  };
}
