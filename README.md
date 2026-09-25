# Healthcare Security SOC — Dashboard Template

Template for a healthcare Security Operations Center (SOC) dashboard with
security guardrails enforced for every AI coding agent working in this repo
(see `AGENTS.md`, authoritative).

## Overall progress: ~75% — Phases 1–5 complete

### What and what
- **Phase 1 — guardrails + UI shell**: `AGENTS.md`, CODEOWNERS, pinned deps
  (Next 16/React 19/Tailwind 3.4/Recharts/lucide), metric data contract,
  analytics-style `/dashboard` (nav rail, KPIs, threat chart, vendors,
  HIPAA donut, profile rail).
- **Phase 2 — data layer**: entity/action schemas, 5 API routes
  (`metrics`, `vendors`, `segments`, 2 action handlers), fetch hooks,
  CSV/JSON export utils, standardized API envelope.
- **Phase 3 — wiring**: hooks → UI, telemetry drawer, audit modal, toasts,
  skeletons, rotate/audit/export actions, error + empty states.
- **Phase 4 — persistence + guards**: file-backed JSON store + `npm run seed`,
  stub-session RBAC proxy (401/403 tiers), vendor create/update/delete.
  Real ORM/IdP/CI explicitly deferred to maintainer (unapproved packages,
  protected paths).
- **Phase 5 — live ops**: HMAC webhook ingestion, SSE event stream, central
  append-only audit log, auditor report (JSON/CSV), `/api/healthz`.

### Left for later
- Maintainer direct commits: real database + ORM, identity provider,
  `.github/workflows/ci.yml`.
- Tests, prod deploy, hardening beyond stubs.

### How to run
- `npm install` (regenerates `package-lock.json` — never hand-edit it)
- `npm run seed` (resets local `data/soc-db.json`)
- `npm run dev` / `npm run build` / `npm start`

### Rules for contributors (agents and humans)
1. Never edit `.github/CODEOWNERS`, `.github/workflows/security-scan.yml`,
   `.gitleaks.toml`, or anything under `policies/` via an agent session —
   human maintainer direct commit with `security-team` review only.
2. Use only packages listed in `policies/approved-packages.yaml`, verified
   against the public registry before use.
3. Topology of secrets scanning (`gitleaks`) and dependency/SAST scanning
   (Trivy + Semgrep → SARIF) is maintainer-owned CI, not agent-editable.

## Phase 6 — up next (0%)
Real database, identity provider, CI workflow, tests, prod deploy.
Awaiting kickoff.
