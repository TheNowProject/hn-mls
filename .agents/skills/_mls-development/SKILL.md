---
name: _mls-development
description: Apply MLS repository evidence, domain, data-governance, privacy, lifecycle, integration, and validation conventions. Use when writing or reviewing code, designing schemas or APIs, changing listing workflows, implementing search/CMA/syndication, or validating MLS behavior.
---

# MLS development

## Ground every change

Before designing or implementing MLS behavior:

1. Read the relevant terms in `CONTEXT.md`.
2. Read the matching section of `documents/research/mls-texas/BA-report.md`.
3. Use `visual-analysis.md`, transcript timestamps, keyframes, or contact sheets when the claim needs primary evidence.
4. Preserve the evidence level:
   - `FACT`: directly visible or clearly audible.
   - `SOURCE CLAIM`: stated by a participant but not independently verified.
   - `INFERENCE`: evidence-backed interpretation, not implementation proof.
   - `PROPOSAL`: design option for this project.
   - `OPEN QUESTION`: unresolved decision.

Texas-specific behavior is research input, not an automatically accepted Vietnam requirement. Regulatory, licensing, SLA, contract, and association rules require explicit product/legal confirmation.

## Domain invariants

- `Property` is the durable real-estate asset or unit.
- `Parcel` is a cadastral/tax land record associated with a property; cardinality must remain configurable until discovery resolves it.
- `Listing` is one market offering of a property and has its own identity, agreement, price, actors, effective dates, visibility, and lifecycle.
- Never overwrite historical listings when a property is relisted.
- Keep `Incomplete Listing Input`, `Incoming Listing`, `Active Listing`, and market statuses distinct until an approved state model says otherwise.
- Model status changes as auditable transitions, not arbitrary string updates.
- Keep `Listing Agreement`, `Closing Record`, and `CMA Report` separate from Property and Listing.
- Treat comparable selection as human-in-the-loop unless an approved requirement explicitly defines automated valuation behavior.

## Data governance

- Preserve provenance per source record and, where needed, per field: source, source key, retrieval time, effective time, confidence, and editability.
- Design identity resolution and deduplication before allowing copy/prefill flows to create a new Property.
- Separate public, member-only, and restricted fields in authorization policy, search indexes, exports, reports, logs, analytics, and downstream feeds.
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
- public/member/restricted field leakage;
- provenance and audit persistence;
- retry/idempotency and downstream reconciliation;
- empty, duplicate, stale, conflicting, and partially sourced records.

Run the narrowest safe checks first. Record commands, results, untested paths, and assumptions in the handoff.
