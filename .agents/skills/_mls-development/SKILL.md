---
name: _mls-development
description: Apply MLS repository evidence, domain, data-governance, privacy, lifecycle, integration, and validation conventions. Use when writing or reviewing code, designing schemas or APIs, changing listing workflows, implementing search/CMA/syndication, or validating MLS behavior.
---

# MLS development

## Ground every change

Before designing or implementing MLS behavior:

1. Read the relevant terms in `CONTEXT.md`.
2. Read the relevant current specification under `docs/` and record any unresolved product or policy decision instead of inferring it from the prototype.
3. When research evidence is relevant, read the matching section of `reference/mls/documents/research/mls-texas/BA-report.md`.
4. Use the visual analysis, transcript timestamps, keyframes, or contact sheets under `reference/mls/documents/research/mls-texas/` when the claim needs primary evidence.
5. Preserve the evidence level:
   - `FACT`: directly visible or clearly audible.
   - `SOURCE CLAIM`: stated by a participant but not independently verified.
   - `INFERENCE`: evidence-backed interpretation, not implementation proof.
   - `PROPOSAL`: design option for this project.
   - `OPEN QUESTION`: unresolved decision.

Texas-specific behavior is research input, not an automatically accepted Vietnam requirement. Regulatory, licensing, SLA, contract, and association rules require explicit product/legal confirmation.

Treat `reference/mls/` as an immutable legacy snapshot. Put current product, implementation, agent, and QA changes at the repository root.

## Domain invariants

- `Property` is the durable identity for a physical or legally recognizable real-estate asset.
- `Parcel` is a cadastral/tax land record associated with a property; cardinality must remain configurable until discovery resolves it.
- Keep `Project`, `Unit`, `Property`, and `Parcel` distinct. A Unit may link to a canonical Property only when identity evidence is sufficient.
- `Listing` is one market offering of a Property or Unit and has its own identity, representation basis, price, parties, effective dates, visibility, and lifecycle.
- Never overwrite historical listings when a property is relisted.
- Keep `Listing Input`, `Incoming Listing`, `Active Listing`, and market statuses distinct until an approved state model says otherwise.
- Model status changes as auditable transitions, not arbitrary string updates.
- Keep `Listing Agreement`, `Closing Record`, and `CMA Report` separate from Property and Listing.
- Treat comparable selection as human-in-the-loop unless an approved requirement explicitly defines automated valuation behavior.

## Data governance

- Preserve provenance per source record and, where needed, per field: source, source key, retrieval time, effective time, confidence, and editability.
- Design identity resolution and deduplication before allowing copy/prefill flows to create a new Property.
- Separate Public, Industry, and Restricted Fields in authorization policy, search indexes, exports, reports, logs, analytics, and downstream feeds.
- Sensitive owner, private remarks, showing, access, document, and contact data must not leak through derived views or telemetry.
- Historical/audit events must be append-oriented and retain actor, time, reason, before/after values, and correlation identifiers where applicable.

## Listing and integration changes

- Validate transition guards, permissions, required/conditional inputs, effective dates, and idempotency.
- Verify downstream effects for search, reports, notifications, syndication, and partner integrations.
- Define opt-in/opt-out, field mapping, delivery SLA, retries, reconciliation, and replay for every outbound feed.
- Do not infer Matrix, Cloud CMA, portal, tax, showing, or transaction API contracts from the walkthrough; document them as integration unknowns until contracts exist.

## Implementation style

- Prefer deep modules with explicit domain interfaces over UI-shaped data models.
- Keep policy/configuration that varies by jurisdiction or organization out of hard-coded application branches.
- Make units, area sources, money, dates, timezone, and effective-period semantics explicit.
- Avoid abstractions that have only speculative future value.
- Put temporary source media and generated scratch files in `tmp/`, never in tracked source or documentation folders.

## Verification baseline

For relevant changes, cover:

- property versus listing identity and relist history;
- valid and invalid lifecycle transitions;
- correct and incorrect actors/organization scopes;
- Public/Industry/Restricted Field leakage;
- provenance and audit persistence;
- retry/idempotency and downstream reconciliation;
- empty, duplicate, stale, conflicting, and partially sourced records.

Run the narrowest safe checks first. Record commands, results, untested paths, and assumptions in the handoff.
