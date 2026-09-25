"use client";

/** Skeleton placeholders matching dashboard card style (prevent layout shift). */

export function KpiSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-slate-100" />
        <div className="flex-1">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="mt-1 h-4 w-12 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-slate-100" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
      <div className="h-4 w-48 rounded bg-slate-100" />
      <div className="mt-3 h-56 rounded-xl bg-slate-100" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
      <div className="h-4 w-32 rounded bg-slate-100" />
      <div className="mt-3 flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
