---
title: Legacy source repository discovery
status: research
authority: supporting
last_reviewed: 2026-08-14
evidence_labels:
  - FACT
  - INFERENCE
---

# Legacy source repository discovery

Date: 2026-08-12

## Executive finding

The supplied repository is a research and domain-discovery workspace. It does not contain an application, database schema, API, deployment configuration, or implementation modules that can currently be forked or reused.

Its value is as a reference corpus for terminology, observed Texas MLS workflows, visual evidence, and open questions for a Vietnam MLS. Texas-specific behavior is not treated as a Vietnam requirement.

## Evidence classification

- `FACT`: directly visible or clearly audible in the source walkthrough.
- `SOURCE CLAIM`: stated by a participant but not independently verified.
- `INFERENCE`: interpretation supported by evidence but not implementation proof.
- `PROPOSAL`: a design option for Housenow MLS.
- `OPEN QUESTION`: unresolved and requiring product, domain, legal, or engineering confirmation.

## Repository inventory

| Area | Contents | Classification |
|---|---|---|
| `reference/mls/CONTEXT.md` | Canonical reference terminology inside the immutable snapshot | Reference |
| `documents/research/mls-texas/BA-report.md` | Primary analyzed business reference | Reference |
| `visual-analysis.md`, transcript, selected frames | Supporting evidence | Reference |
| `.agents/` | Working rules and MLS-specific development guidance | Process reference |
| Application source | Not present | Not reusable |
| Database/API/infrastructure | Not present | Not reusable |

## Domain baseline supported by evidence

- `Property` is a durable asset identity.
- `Parcel` is a cadastral/legal land unit related to a Property; cardinality remains unresolved.
- `Listing` is one market offering with its own identity, price, representation, effective period, visibility, and lifecycle.
- A Property can have multiple Listings over time. A relist must not overwrite history.
- `Incomplete Listing Input`, `Incoming Listing`, and `Active Listing` are distinct concepts pending a formal state model.
- Status changes are auditable business transitions, not arbitrary string edits.
- Public, member-only, and restricted data must be separated beyond the UI layer.
- Provenance must travel with important records and fields.

## Reuse / replace / reference matrix

| Capability | Decision | Reason |
|---|---|---|
| Product terminology | Reference and adapt | Strong evidence baseline; requires Vietnam validation |
| Property/Listing separation | Adopt as prototype invariant | Supported by direct evidence and master-plan principles |
| Texas lifecycle labels | Reference only | Jurisdiction-specific and incomplete |
| Search/detail information architecture | Reference | Useful observed workflow; visual design should not be copied literally |
| Member/association model | Reference only | Vietnam governance model is unresolved |
| Source code and components | Replace/build new | No implementation source exists |
| API, schema, infrastructure | Design later | No evidence of implementation contracts |

## First prototype hypothesis

`PROPOSAL`: Build one evidence-grounded vertical slice:

1. Find an existing Property by normalized address or parcel identifier.
2. Inspect identity, source, confidence, and prior Listing history.
3. Start a new Listing without creating a duplicate Property.
4. Validate required data.
5. Submit as Incoming or activate when Active rules pass.
6. Append an audit event for every important transition.

This slice tests the core product promise: a canonical asset identity with traceable market offerings and history.

## Explicit prototype assumptions

- All people, organizations, properties, parcels, and prices are synthetic demo data.
- `Incoming` and `Active` are prototype workflow states, not approved Vietnam legal or operational policy.
- The prototype simulates permissions in the frontend only.
- No identity, contract, cadastral, tax, syndication, or regulator integration is implied.

## Open questions blocking MVP specification

- Who governs the MLS and verifies Property, Parcel, Listing, and representation data?
- What actor is the initial product buyer and pilot user?
- Is the first segment primary or secondary market, and in which locality?
- What identifier is canonical across province, project, building, unit, and parcel?
- Which lifecycle transitions and approval steps apply per transaction type?
- Which fields are public, industry-only, restricted, or consent-based?
- What source is authoritative for each field and how are conflicts resolved?
- Does Incoming allocate an MLS ID, and what is its visibility in Vietnam?

## Prototype acceptance criteria for the first slice

- Selecting a Property preserves its canonical Property ID.
- Creating a Listing always generates a separate Listing ID.
- Existing Listing history remains visible and unchanged.
- The UI shows source and verification context for identity-critical data.
- Invalid Active submission exposes actionable field errors.
- Valid transitions append actor, time, reason, and before/after status to the audit timeline.
- Role switching visibly changes access to member-only and restricted fields.
