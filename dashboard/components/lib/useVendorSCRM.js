"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api-client.js";

/**
 * Server-driven vendor filtering/search/sort/pagination state.
 * @param {{ pageSize?: number }} [opts]
 */
export function useVendorSCRM({ pageSize = 4 } = {}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("All");
  const [sort, setSort] = useState("name");
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams({
        q: query,
        severity,
        sort,
        dir,
        page: String(page),
        pageSize: String(pageSize),
      });
      const res = await apiFetch(`/api/vendors?${sp}`);
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Vendor request failed.");
      setRows(body.data.rows);
      setTotal(body.data.total);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vendor request failed.");
    } finally {
      setLoading(false);
    }
  }, [query, severity, sort, dir, page, pageSize]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    rows,
    total,
    page,
    pageSize,
    query,
    severity,
    sort,
    dir,
    loading,
    error,
    setQuery: (v) => {
      setPage(0);
      setQuery(v);
    },
    setSeverity: (v) => {
      setPage(0);
      setSeverity(v);
    },
    setSort: (v) => {
      setPage(0);
      setSort(v);
    },
    setDir,
    setPage,
    refetch: fetchPage,
  };
}
