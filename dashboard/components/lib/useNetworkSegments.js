"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api-client.js";

/**
 * Segmentation list state + per-VLAN drawer telemetry fetching.
 * @returns {{ rows: import("./types.js").NetworkSegment[], loading: boolean, error: string | null, detail: object | null, detailLoading: boolean, fetchDetail: (vlanId: string) => void, clearDetail: () => void, refetch: () => void }}
 */
export function useNetworkSegments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/segments");
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Segment request failed.");
      setRows(body.data.rows);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Segment request failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (vlanId) => {
    setDetailLoading(true);
    try {
      const res = await apiFetch(`/api/segments?vlanId=${encodeURIComponent(vlanId)}`);
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Telemetry request failed.");
      setDetail(body.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    rows,
    loading,
    error,
    detail,
    detailLoading,
    fetchDetail,
    clearDetail: () => setDetail(null),
    refetch,
  };
}
