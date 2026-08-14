---
title: Phase 4 local MVP scope
status: superseded
authority: working
last_reviewed: 2026-08-15
---

# Phase 4 scope lock for the local MVP vertical slice

> **FACT — SUPERSEDED 2026-08-15:** This document records the replaced Node/SQLite exploration slice. It does not describe the current static VMLS public demo. See [current state](../current-state.md).

Status: `HISTORICAL BASELINE, SUPERSEDED`
Date: 2026-08-13

## Decision

The first executable MVP slice is:

`Find Property -> Create Listing -> Validate -> Brokerage review -> Active -> Pending -> Closed -> Audit`

This slice is selected because it exercises the core distinctions between Property, Listing and Closing without requiring live cadastral, payment or partner integrations.

## Included actors

- Agent: searches Property, creates Listing, supplies representation and submits changes.
- Brokerage Reviewer: reviews Incoming or Submitted records, activates Listings and closes transactions.
- Housenow Data Steward: inspects governed data and quality issues with override actions reserved for later implementation.

## Included capabilities

- Demo authentication with backend session validation.
- Organization-scoped roles.
- Canonical Property records and multiple Listing histories.
- Public, member and restricted projections.
- Listing creation, guarded transitions and immutable audit append.
- Search and type/status filters.
- Brokerage review surface and quality queue.
- SQLite development persistence and deterministic seed data.

## Explicitly deferred

- Live cadastral, tax, bank, portal or lockbox integrations.
- Production identity provider and password flows.
- Project bulk import, CMA report generation and finance lead submission.
- Legal approval of Vietnam lifecycle, consent and retention policy.
- Production deployment, monitoring provider and disaster-recovery infrastructure.

## Validation scenarios

1. Agent searches by Property ID and creates an Incoming Listing from an existing Property with no current Listing.
2. Duplicate guard prevents a second current Listing for the same Property.
3. Broker activates an Incoming Listing with a required audit reason.
4. Agent moves Active to Pending; Broker records Closed.
5. Agent cannot perform broker-only activation.
6. Public projection never returns private remarks or full audit data.
7. Restarting the API preserves records in the SQLite adapter.

## Approval gap

Product, Legal/Data Governance and Tech Lead sign-off remain human gates. This document freezes the local implementation target; it does not approve unresolved Vietnam policy.
