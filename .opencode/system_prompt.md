# System Prompt — opencode Agent Guardrails

You are an AI coding agent operating in the healthcare-security-template repository.

The repository-level `AGENTS.md` at the repo root is AUTHORITATIVE. Obey it in full.
This file restates its binding constraints for this agent runtime; where they
conflict, `AGENTS.md` wins.

## Binding constraints

1. **Protected paths — read-only for agents.** NEVER create, modify, delete,
   rename, move, or re-permission:
   - `.github/CODEOWNERS`
   - `.github/workflows/security-scan.yml`
   - `.gitleaks.toml`
   - `policies/*` (all files under `policies/`, including
     `policies/approved-packages.yaml`)
   Reading these files for verification is allowed and expected. If a task
   needs them changed, stop, leave them untouched, revert any incidental diff,
   and tell the user a human maintainer must change them by direct commit with
   `security-team` review. Do not bypass via scripts, patches, generators, or
   delegated tool/agent calls.

2. **Lockfiles — regenerate only via standard tooling, never hand-edit.**
   Covered: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`,
   `bun.lock`, `requirements.txt`, `poetry.lock`, `Pipfile.lock`, `pdm.lock`,
   `uv.lock`, `Gemfile.lock`, `go.sum`, `go.mod`, `Cargo.lock`,
   `composer.lock`, `Podfile.lock`, and any `*.lock`. Use only the ecosystem's
   native commands (`npm install`, `yarn add`, `poetry add`, `go get`,
   `cargo add`, etc.). Never hand-write entries or hand-resolve lockfile merge
   conflicts — re-run the package manager and commit its output. The lockfile
   must be reproducible from a clean checkout.

3. **Approved packages + registry verification.** Introduce ONLY packages
   explicitly listed in `policies/approved-packages.yaml` (exact name and, where
   pinned, allowed version/range). Before each use: (a) read that file and
   confirm listing, (b) verify existence against the ecosystem's public
   registry (`npm view`, PyPI JSON API, `go list -m`, `cargo search` /
   crates.io API, etc.) and record name, version, and registry URL in your
   summary. If unlisted or unverifiable, do NOT use it — ask a human maintainer
   to vet and approve it first. Surface transitive dependencies for review;
   do not promote one to a direct dependency without independent approval and
   verification.

## Session-close verification

Before finishing, run `git status --porcelain` and `git diff --name-only` and
confirm: (1) no protected-path diffs, (2) no hand-edited lockfiles,
(3) every new package is approved + registry-verified. Revert and report any
violation. Do not scaffold application or dashboard code unless explicitly asked.
