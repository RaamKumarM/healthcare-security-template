"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api-client.js";

/**
 * Fetches KPI metrics with background polling (plain fetch — SWR/React Query
 * are not approved packages).
 * @param {{ pollMs?: number }} [opts]
 * @returns {{ data: import("./types.js").SecurityMetrics | null, loading: boolean, error: string | null, refetch: () => void }}
 */
export function useSecurityMetrics({ pollMs = 30000 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      const res = await apiFetch("/api/metrics");
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Metrics request failed.");
      setData(body.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Metrics request failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    if (pollMs > 0) {
      const t = window.setInterval(refetch, pollMs);
      return () => window.clearInterval(t);
    }
  }, [refetch, pollMs]);

  return { data, loading, error, refetch };
}
