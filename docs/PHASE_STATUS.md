# Phase status and approval gates

Date: 2026-08-13

## Current implementation status

| Phase | Status | Evidence |
|---|---|---|
| 0 — Product alignment | Draft baseline complete; stakeholder approval pending | Product alignment, assumptions, open questions and decision log |
| 1 — Discovery | Complete for the supplied research repository | Discovery reports and read-only `reference/mls/` snapshot |
| 2 — Product/domain specification | Draft baseline complete; product, legal and domain approval pending | Requirements, permissions, lifecycle, rules, acceptance criteria and traceability |
| 3 — UX prototype | Six primary actor perspectives implemented; extended transaction screens remain | React application under `src/` and [`product/phase-6-1-actor-perspectives.md`](./product/phase-6-1-actor-perspectives.md) |
| 4 — Scope lock | Vertical-slice working baseline frozen; human sign-off pending | [`product/phase-4-scope-lock.md`](./product/phase-4-scope-lock.md) |
| 5 — Technical foundation | Operational for the local vertical slice | HTTP API, SQLite persistence, role scope, audit events and ADR |
| 6 — MVP execution | Core vertical slice and Property Intelligence extension operational; broader MVP epics remain | Lifecycle workflow, actor projections, price/closing/source history and CMA candidates |

This status does not claim pilot readiness. Demo authentication, production integrations, operational hardening and the unresolved approval gates below remain open.

## Deliverable index

### Phase 0

- [Product alignment baseline](./product/product-alignment.md)
- [Assumption log](./product/assumption-log.md)
- [Open questions](./product/open-questions.md)
- [Decision log](./decisions/decision-log.md)
- [Housenow domain language](../CONTEXT.md)

### Phase 1

- [Reference discovery summary](./research/reference-discovery.md)
- [Phase 1 discovery report](./research/phase-1-discovery.md)
- Read-only research snapshot at `reference/mls/`

### Phase 2

- [Product requirements baseline](./product/product-requirements-baseline.md)
- [Permission model](./domain/permission-model.md)
- [Data dictionary](./domain/data-dictionary.md)
- [Business rules catalog](./domain/business-rules.md)
- [MVP acceptance criteria](./product/mvp-acceptance-criteria.md)
- [Requirement traceability](./product/requirement-traceability.md)

### Phase 4–6 vertical slice

- [Phase 4 scope lock](./product/phase-4-scope-lock.md)
- [Local MVP architecture](./decisions/ADR-001-local-mvp-architecture.md)
- [Local API contract](./technical/api.md)
- [Security and current limitations](./technical/security-and-limitations.md)
- [Test strategy](./technical/test-strategy.md)
- [Phase 6.1 actor perspectives](./product/phase-6-1-actor-perspectives.md)

## Approval gates still open

The documentation work through Phase 2 is complete as a draft baseline. The following human decisions are required before describing Phase 0-2 as approved or scope-locked:

1. First product buyer and accountable decision owners.
2. Pilot organizations and daily user group.
3. Primary/secondary segment and first locality.
4. Vietnam Listing lifecycle and approval authority.
5. Canonical Property/Parcel/Project/Unit identity policy.
6. Source-of-truth and conflict-resolution ownership per field group.
7. Public, Industry, Restricted, and consent-based field policy.
8. Legal/compliance position on representation, owner participation, regulator authority, retention, and dispute.
9. Available implementation repository and permission to reference, fork, or reuse it.

## Recommended review sequence

1. Product Owner reviews `product-alignment.md` and resolves first buyer, segment, locality, and pilot.
2. Domain workshop reviews `CONTEXT.md`, lifecycle, identity, representation, and duplicate scenarios.
3. Legal/Data Governance reviews permission, consent, provenance, retention, and regulator scope.
4. Tech Lead reviews rules, acceptance criteria, integration unknowns, and reference-repo gap.
5. Product Design uses the approved subset to continue Phase 3 vertical slice.
