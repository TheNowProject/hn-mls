---
title: Phase 6.1 Property Intelligence and actor perspectives
status: superseded
authority: working
last_reviewed: 2026-08-15
---

# Phase 6.1 — Property Intelligence and actor perspectives

> **FACT — SUPERSEDED 2026-08-15:** This plan records the removed Node/SQLite workspace exploration. It is retained as historical product evidence and does not describe the current executable runtime. See [current state](../current-state.md).

Date: 2026-08-13
Status: HISTORICAL IMPLEMENTED EXPLORATION — superseded by the static public demo.

## Actor model

The prototype now exposes all six locked Primary Market Actors: Agent, Brokerage, Developer, Buyer, Owner/Seller and Bank. Data Steward remains an operational role, while Regulator code is retained as deferred exploration evidence until a lawful oversight workflow is committed.

| Actor | Primary decision surface | Default projection |
|---|---|---|
| Agent (`Môi giới`) | Search, Property 360, Listing lifecycle, CMA | Member; restricted fields only for assigned Listings |
| Brokerage (`Sàn môi giới`) | Review queue, lifecycle approval, quality and organization | Brokerage-scoped audit and restricted data |
| Developer (`Chủ đầu tư`) | Project/Unit inventory, availability and distribution assignment | Own-inventory; no private remarks or audit |
| Bank (`Ngân hàng`) | Finance-fit cases with purpose and consent | Consent-based; minimum necessary data |
| Buyer (`Người mua`) | Verified search, shortlist, price changes and showing | Public; Active Listings only |
| Owner/Seller (`Người bán / Chủ sở hữu`) | Owned Property, representation, distribution consent, Listing milestones and correction/dispute requests | Own verified/claimed relationship; no CRM, buyer identity, private remarks or unrestricted audit |
| Data Steward | Identity, source, duplicate and quality resolution | Operational projection with source and audit evidence |

## Property Intelligence delivered

- List-price events with effective time, actor, reason, source and confidence.
- Original/current price, percentage change, DOM, cumulative DOM and relist count.
- Historical Listing episodes with Closing Record, closing price, date and verification state.
- Source-event timeline for identity, area and address evidence.
- CMA candidate snapshot with low/median/high price per area and mandatory human-review label.
- Media/document summary in Property 360.
- Backend field projection, not client-only hiding.
- Two data spaces, TP. Hồ Chí Minh and Hà Nội, with market-scoped search, Listing counts, issue queues, hot sheets and actor workspaces.

## Exploration flows delivered

- Search supports governed property-type chips, advanced verification/status/quality filters, sorting and an interactive map view.
- Property 360 can open a data issue report, buyer showing request, Listing composer, lifecycle transition or CMA workspace without placeholder-only stops.
- Contacts supports client creation, needs/budget context, shortlist summary, notes and showing confirmation.
- CMA supports subject selection, comparable include/exclude, analyst rationale and a saved draft with an indicative range.
- Quality Queue supports filtering, assignment, resolution evidence and visible removal of resolved items during the session.
- Organization supports member filtering, entitlement review and scoped invitations.
- Developer, Bank, Regulator and Buyer workspaces open role-specific record context and save a next step. Seller now has a backend-scoped first vertical slice for own Property, Ownership Claim, Representation, distribution consent and review cases; Regulator remains a legacy/deferred exploration perspective.
- App Hub routes to MLS Core, CMA Studio, Showing Desk and Distribution Monitor.

Core Listing mutations use the HTTP API and SQLite. Secondary exploration actions intentionally use in-memory session state until their domain policy and persistence contracts are approved.

## Governance boundaries

- The finance view is not a lending commitment or valuation.
- The retained regulator exploration view does not infer legal status or violations from market signals and is outside the target six-actor release.
- Seller access must be relationship-scoped and must not expose buyer identity, brokerage CRM, private remarks, underwriting data or unrestricted audit.
- Buyer data never includes private remarks, audit events, internal status events or restricted source details.
- Developer and Bank views omit private remarks and full audit history.
- Demo sessions are not production authentication; consent, jurisdiction and organization scope remain simulated.

## Next validation gates

1. Confirm actual purpose/consent fields and expiry behavior with legal and banking stakeholders.
2. Confirm developer Project/Unit ownership and distribution-assignment boundaries.
3. Confirm Seller ownership-claim, representation, consent, co-owner and dispute policy; then implement the Seller workspace and backend projection.
4. Replace synthetic market candidates with an explainable comparable-selection service.
5. Keep regulator authorization and aggregate views deferred until jurisdiction, legal authority, aggregation thresholds and drill-down rules are approved.
