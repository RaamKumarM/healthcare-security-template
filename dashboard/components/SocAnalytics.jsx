"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Siren,
  HeartPulse,
  Activity,
  Download,
  KeyRound,
} from "lucide-react";
import NavRail from "./NavRail";
import KpiCard from "./KpiCard";
import ThreatChart from "./ThreatChart";
import VendorList from "./VendorList";
import ScoreDonut from "./ScoreDonut";
import ProfilePanel from "./ProfilePanel";
import DetailDrawer from "./DetailDrawer";
import ActionModal from "./ActionModal";
import AddVendorModal from "./AddVendorModal";
import AlertsView from "./AlertsView";
import VendorsView from "./VendorsView";
import ThreatsView from "./ThreatsView";
import ReviewsView from "./ReviewsView";
import AuditView from "./AuditView";
import SettingsView from "./SettingsView";
import { KpiSkeleton, ChartSkeleton } from "./Skeleton";
import { ToastProvider, useToast } from "./lib/toast";
import { useSecurityMetrics } from "./lib/useSecurityMetrics";
import { useVendorSCRM } from "./lib/useVendorSCRM";
import { useNetworkSegments } from "./lib/useNetworkSegments";
import { toCSV, toJSON, download } from "./lib/export";
import { apiFetch } from "./lib/api-client";
import { mockSecurityFeed } from "./lib/mockSecurityFeed";

/** Analytics shell: views per menu, wired data layer, stub actions, dark mode. */

function toEvents(ts) {
  return (ts ?? []).map((t) => ({
    timestamp: t.timestamp ?? t.time ?? "—",
    count: t.count ?? t.threats ?? 0,
    severity:
      t.severity ?? ((t.count ?? t.threats ?? 0) >= 10 ? "High" : (t.count ?? t.threats ?? 0) >= 5 ? "Medium" : "Low"),
    category: t.category ?? "intrusion",
  }));
}

function ShellInner() {
  const toast = useToast();
  const [active, setActive] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [vendorModal, setVendorModal] = useState(false);
  const metrics = useSecurityMetrics();
  const vendors = useVendorSCRM({ pageSize: 4 });
  const segments = useNetworkSegments();
  const [drawer, setDrawer] = useState(null);
  const [vlan, setVlan] = useState(null);
  const [audit, setAudit] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  const refreshReviewCount = async () => {
    try {
      const res = await apiFetch("/api/vendors?severity=All&pageSize=50");
      const body = await res.json();
      if (body.ok) setReviewCount(body.data.rows.filter((v) => v.status === "Review").length);
    } catch {
      /* badge stays stale — non-blocking */
    }
  };

  useEffect(() => {
    refreshReviewCount();
    const t = window.setInterval(refreshReviewCount, 30000);
    return () => window.clearInterval(t);
  }, [active]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("soc-theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch {
      /* private mode — stay light */
    }
  }, []);

  const changeTheme = (t) => {
    setTheme(t);
    try {
      window.localStorage.setItem("soc-theme", t);
    } catch {
      /* noop */
    }
  };

  const m = metrics.data ?? mockSecurityFeed;
  const events = toEvents(m.timeseries);
  const chartData = events.map((e) => ({
    time: e.timestamp,
    threats: e.count,
    scans: e.count * 3 + 4,
  }));

  // Error toasts for failed endpoint calls.
  useEffect(() => {
    if (metrics.error) toast.error(`Metrics unavailable: ${metrics.error}`);
  }, [metrics.error, toast]);
  useEffect(() => {
    if (vendors.error) toast.error(`Vendors unavailable: ${vendors.error}`);
  }, [vendors.error, toast]);
  useEffect(() => {
    if (segments.error) toast.error(`Segments unavailable: ${segments.error}`);
  }, [segments.error, toast]);

  // VLAN drawer telemetry.
  useEffect(() => {
    if (vlan) segments.fetchDetail(vlan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vlan]);
  useEffect(() => {
    if (vlan && segments.detail && !segments.detailLoading) {
      const d = segments.detail;
      setDrawer({
        kind: "Segment telemetry",
        title: d.name,
        meta: [
          { k: "VLAN", v: d.vlanId },
          { k: "Endpoints", v: String(d.endpoints) },
          { k: "Health", v: d.health },
          { k: "Severity", v: d.severity ?? "—" },
          { k: "Telemetry", v: d.telemetry?.range ?? "Last 24 hours" },
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments.detail, segments.detailLoading]);

  const openVendor = (v) =>
    setDrawer({
      kind: "Vendor telemetry",
      title: v.name,
      vendorId: v.id,
      status: v.status,
      meta: [
        { k: "Vendor ID", v: v.id },
        { k: "Risk", v: v.riskLevel },
        { k: "Status", v: v.status },
        { k: "Endpoints", v: String(v.endpoints) },
        { k: "Last scanned", v: v.lastScanned },
      ],
    });

  const openEvent = (e) =>
    setDrawer({
      kind: "Threat event",
      title: `${e.category} · ${e.count} events`,
      meta: [
        { k: "Timestamp", v: e.timestamp },
        { k: "Severity", v: e.severity },
        { k: "Category", v: e.category },
        { k: "Source", v: "threat scan feed (stub)" },
      ],
    });

  const timedFetch = (url, opts) => apiFetch(url, opts);

  const changeVendorStatus = async (id, status) => {
    try {
      const res = await timedFetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Update failed.");
      toast.success(`Vendor → ${status}.`);
      setDrawer(null);
      setVlan(null);
      vendors.refetch();
      refreshReviewCount();
    } catch (e) {
      toast.error(`Update failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  const deleteVendor = async (id) => {
    try {
      const res = await timedFetch(`/api/vendors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Delete failed.");
      toast.success("Vendor deleted.");
      setDrawer(null);
      setVlan(null);
      vendors.refetch();
      refreshReviewCount();
    } catch (e) {
      toast.error(`Delete failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  const rotateKeys = async () => {
    try {
      const res = await timedFetch("/api/actions/rotate-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "administrative", reason: "manual-rotation" }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Rotation failed.");
      toast.success(`Key rotation queued (${body.data.jobId}).`);
    } catch (e) {
      toast.error(`Rotate keys failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  const runAudit = async () => {
    try {
      const res = await timedFetch("/api/actions/audit-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ framework: "both" }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Audit failed.");
      const d = body.data;
      setAudit({
        title: `HPH CPG Audit — ${d.status}`,
        lines: [
          { k: "Check ID", v: d.checkId },
          { k: "Framework", v: d.framework },
          { k: "Status", v: d.status },
          { k: "HIPAA score", v: String(d.summary.hipaaScore) },
          { k: "Threats blocked", v: String(d.summary.threatsBlocked) },
        ],
        raw: d,
      });
    } catch (e) {
      toast.error(`Audit failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  const exportReport = async () => {
    try {
      const sp = new URLSearchParams({
        q: vendors.query,
        severity: vendors.severity,
        sort: "name",
        dir: "asc",
        page: "0",
        pageSize: "50",
      });
      const res = await timedFetch(`/api/vendors?${sp}`);
      const body = await res.json();
      if (!body.ok) throw new Error(body.error?.message ?? "Export failed.");
      download(
        "soc-vendor-report.csv",
        toCSV(body.data.rows, ["id", "name", "riskLevel", "status", "endpoints", "lastScanned"]),
        "text/csv"
      );
      toast.success(`Exported ${body.data.total} vendor rows (CSV).`);
    } catch (e) {
      toast.error(`Export failed: ${e instanceof Error ? e.message : "timeout."}`);
    }
  };

  const resetFilters = () => {
    vendors.setQuery("");
    vendors.setSeverity("All");
    toast.success("Filters cleared.");
  };

  return (
    <div
      className={`min-h-screen p-3 text-[13px] sm:p-5 ${
        theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-[#e6eaf1] text-slate-800"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl gap-2 overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.12)] ${
          theme === "dark" ? "dark-scheme bg-[#f7f8fb]" : "bg-[#f7f8fb]"
        }`}
      >
        <NavRail
          active={active}
          onNavigate={setActive}
          theme={theme}
          onTheme={changeTheme}
          reviewCount={reviewCount}
          onAddVendor={() => {
            setActive("vendors");
            setVendorModal(true);
          }}
          onWorkspaceInfo={() => toast.success("Healthcare SOC is the only workspace in this stub.")}
        />

        {/* Center column */}
        <main className="min-w-0 flex-1 border-x border-slate-100 bg-white/40 px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-emerald-950">Analytics</h1>
              <p className="text-[12px] text-slate-400">Welcome back, let&apos;s get back to work.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex w-56 items-center gap-2 rounded-lg bg-slate-100/80 px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  value={vendors.query}
                  onChange={(e) => vendors.setQuery(e.target.value)}
                  placeholder="Search vendors…"
                  aria-label="Search vendors"
                  className="w-full bg-transparent text-[13px] placeholder:text-slate-400 focus:outline-none"
                />
                <button type="button" onClick={resetFilters} aria-label="Clear filters" title="Clear filters">
                  <SlidersHorizontal size={14} className="text-slate-400 hover:text-orange-500" />
                </button>
              </label>
              <button
                type="button"
                onClick={exportReport}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12px] font-medium text-slate-600 shadow-sm hover:text-orange-500"
              >
                <Download size={13} /> Export Report
              </button>
              <button
                type="button"
                onClick={rotateKeys}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-2 text-[12px] font-medium text-white shadow-sm hover:bg-slate-700"
              >
                <KeyRound size={13} /> Rotate Keys
              </button>
            </div>
          </div>

          {active === "dashboard" && (
            <>
              <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                <button
                  type="button"
                  onClick={runAudit}
                  className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  Audit HPH CPG compliance
                </button>
                {metrics.loading && <span className="px-1 py-1 text-slate-400">Refreshing metrics…</span>}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.loading && !metrics.data ? (
                  <>
                    <KpiSkeleton /> <KpiSkeleton /> <KpiSkeleton /> <KpiSkeleton />
                  </>
                ) : (
                  <>
                    <KpiCard
                      icon={ShieldCheck}
                      tint="bg-indigo-800"
                      label="Active Vendors"
                      value={m.activeVendors}
                      pct={72}
                      delta="45%"
                    />
                    <KpiCard
                      icon={Activity}
                      tint="bg-teal-500"
                      label="Endpoint Health %"
                      value={`${m.endpointHealth}%`}
                      pct={m.endpointHealth}
                      delta="2%"
                    />
                    <KpiCard
                      icon={Siren}
                      tint="bg-rose-400"
                      label="Threats Blocked"
                      value={m.threatsBlocked}
                      pct={88}
                      delta="55%"
                    />
                    <KpiCard
                      icon={HeartPulse}
                      tint="bg-green-500"
                      label="HIPAA Score"
                      value={m.hipaaScore}
                      pct={m.hipaaScore}
                      delta="15%"
                    />
                  </>
                )}
              </div>

              <div className="mt-4">
                {metrics.loading && !metrics.data ? (
                  <ChartSkeleton />
                ) : (
                  <ThreatChart
                    data={chartData}
                    blocked={m.threatsBlocked}
                    endpoints={vendors.rows.reduce((n, v) => n + (v.endpoints ?? 0), 0) || 87}
                  />
                )}
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <VendorList
                  vendor={vendors}
                  segments={segments}
                  onVendorClick={openVendor}
                  onSegmentClick={(s) => setVlan(s.vlanId)}
                />
                <ScoreDonut score={m.hipaaScore} coverage={86} />
              </div>
            </>
          )}

          {active === "alerts" && <AlertsView events={events} onAlertClick={openEvent} />}
          {active === "vendors" && (
            <VendorsView
              vendor={vendors}
              segments={segments}
              onVendorClick={openVendor}
              onSegmentClick={(s) => setVlan(s.vlanId)}
            />
          )}
          {active === "threats" && (
            <ThreatsView data={chartData} events={events} onEventClick={openEvent} />
          )}
          {active === "reviews" && <ReviewsView />}
          {active === "audit" && <AuditView />}
          {active === "settings" && <SettingsView theme={theme} onTheme={changeTheme} />}
        </main>

        <ProfilePanel
          vendors={m.activeVendors}
          blocked={m.threatsBlocked}
          score={m.hipaaScore}
          onNavigate={setActive}
        />
      </div>

      <DetailDrawer
        item={drawer}
        onStatusChange={changeVendorStatus}
        onDeleteVendor={deleteVendor}
        onClose={() => {
          setDrawer(null);
          setVlan(null);
        }}
      />
      <ActionModal
        open={!!audit}
        title={audit?.title ?? ""}
        lines={audit?.lines ?? []}
        onDownload={() => {
          if (audit) {
            download("soc-audit.json", toJSON(audit.raw), "application/json");
            toast.success("Audit summary downloaded (JSON).");
          }
        }}
        onClose={() => setAudit(null)}
      />
      <AddVendorModal
        open={vendorModal}
        onClose={() => setVendorModal(false)}
        onCreated={() => {
          vendors.refetch();
          refreshReviewCount();
        }}
      />
    </div>
  );
}

export default function SocAnalytics() {
  return (
    <ToastProvider>
      <ShellInner />
    </ToastProvider>
  );
}
