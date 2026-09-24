# Healthcare Security SOC — Dashboard Template

Template for a healthcare Security Operations Center (SOC) dashboard with
security guardrails enforced for every AI coding agent working in this repo
(see `AGENTS.md`, authoritative).

## Overall progress: ~30% — Phase 1 complete

### Phase 1 — done
- **Agent guardrails**: `AGENTS.md` + `.opencode/system_prompt.md` (protected
  paths, lockfile discipline, approved-packages-only with registry verification)
  and `.github/CODEOWNERS` (`security-team` review on `.github/**`,
  `.gitleaks.toml`, `policies/**`).
- **Dependency baseline**: Next.js 16 + React 19 + Tailwind CSS 3.4 + Recharts +
  lucide-react, pinned in `package.json`, lockfile generated via `npm install`
  only. Every package is listed in `policies/approved-packages.yaml` and was
  verified against the public npm registry.
- **Data contract**: `data-contracts/soc-metrics.schema.json` defines the only
  shape the dashboard consumes (`activeVendors`, `endpointHealth`,
  `threatsBlocked`, `hipaaScore`, `timeseries`), fed by the stub
  `dashboard/components/lib/mockSecurityFeed.js`. No live systems, logs, code,
  or agent traces are read or displayed.
- **Dashboard UI** (`/dashboard`, redirects from `/`): analytics-style layout
  rebuilt from scratch — left nav rail (analyst profile, Healthcare SOC
  switcher, Dashboard/Alerts/Vendors/Threat Intel/Reviews, Add New Vendor),
  center column (greeting + search, 3 KPI cards with progress + deltas,
  orange-bar/indigo-line threat chart with side tiles, Latest Vendors table,
  HIPAA posture donut + promo banner), right profile rail (progress-ring avatar,
  stats, Playbooks/Compliance/Settings links, control-status gauge).

### How to run
- `npm install` (regenerates `package-lock.json` — never hand-edit it)
- `npm run dev` / `npm run build` / `npm start`

### Rules for contributors (agents and humans)
1. Never edit `.github/CODEOWNERS`, `.github/workflows/security-scan.yml`,
   `.gitleaks.toml`, or anything under `policies/` via an agent session —
   human maintainer direct commit with `security-team` review only.
2. Use only packages listed in `policies/approved-packages.yaml`, verified
   against the public registry before use.
3. Topology of secrets scanning (`gitleaks`) and dependency/SAST scanning
   (Trivy + Semgrep → SARIF) is maintainer-owned CI, not agent-editable.

## Phase 2 — up next (0%)
Scope to be defined: hardened data wiring, auth/access control, export/report
flows, and production readiness. Awaiting kickoff.
