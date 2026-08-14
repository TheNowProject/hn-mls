---
title: Current product and implementation state
status: current
authority: canonical
last_reviewed: 2026-08-14
---

# Current product and implementation state

HouseNow MLS is in Phase 6 as an exploration-ready local prototype. It is suitable for structured founder, product, domain, design, and engineering review. It is not a pilot or production system.

## Phase status

| Phase | Current state | Authority and evidence |
|---|---|---|
| 0 — Product alignment | Actor scope is locked; buyer, pilot, locality, and several operating-policy decisions remain open | [Alignment](./alignment.md), [open questions](./open-questions.md) |
| 1 — Discovery | Complete for the available immutable research snapshot | [Discovery](../research/discovery/texas-mls.md) |
| 2 — Product and domain specification | Working baseline; product, legal, and data-governance approval remains open | [Requirements](./requirements.md), [domain](../domain/) |
| 3 — UX prototype | Six market perspectives and supporting operational workspaces are navigable | React application under `src/` |
| 4 — Vertical-slice scope | Working scope is frozen; human sign-off remains open | [Phase 4 scope](./scopes/phase-4.md) |
| 5 — Technical foundation | Operational for the local slice | Node HTTP API, SQLite, authorization, lifecycle, audit, and tests |
| 6 — MVP execution | Core Listing flow, Property Intelligence, access governance, and exploration workspaces are operational | [Phase plans](./plans/) |
| 6.3 — Admin control plane | Accepted design and build-ready plan; not implemented | [Plan](./plans/phase-6-3-system-admin.md), [ADR](../decisions/0002-separate-admin-control-plane.md) |
| 6.4 — Owner/Seller | First vertical slice operational; grant/renew and broader downstream enforcement remain | [Plan](./plans/phase-6-4-owner-seller.md) |

## Implemented local flows

```text
Find Property → inspect source/history → create Listing → validate
→ Brokerage review → Active → Pending → Closed
→ Closing Record + immutable Audit Event
```

The prototype also includes:

- Property 360 with price events, original/current price, DOM/CDOM, relist history, Closing Records, sources, and human-reviewed CMA candidates.
- Contacts, needs, shortlist, notes, showing confirmation, and CMA exploration.
- Brokerage quality queue, organization membership, and entitlement review.
- Actor- and data-space-specific projections, consent visibility, Access Requests, decisions, and sensitive-read audit.
- Owner/Seller own-scope Property relationships, Ownership Claims, Representation/consent versioning, correction/pause/withdrawal cases, and notifications.
- Project, Finance, Buyer Shortlist, deferred Oversight exploration, and an App Hub linking MLS Core, CMA Studio, Showing Desk, and Distribution Monitor.

Core lifecycle, access-request, authorization, and audit mutations persist through SQLite. Several secondary exploration actions remain browser-session state.

## Data and security boundary

- The dataset is synthetic: 26 Properties across Ho Chi Minh City and Hanoi.
- Authentication uses demo tokens; production identity, account recovery, and organization onboarding are not implemented.
- Sensitive visibility is demonstrated through backend projections, but production policy, legal review, retention, encryption operations, and external integrations remain approval gates.
- No current regulator workflow is approved. Data Steward and administrators do not receive blanket business-data access.

## Open approval gates

1. First product buyer, pilot organizations, daily users, market segment, and locality.
2. Vietnam Listing lifecycle, representation, cooperation, and approval authority.
3. Canonical Property/Parcel/Project/Unit identity and source-conflict ownership.
4. Public, Industry, Restricted, purpose, consent, retention, and oversight policy.
5. Production identity, integration contracts, operational SLA, and legal/compliance review.

Product intent wins only when marked accepted, locked, or canonical. A prototype behavior that differs from such intent is an implementation gap. Drafts and proposals remain non-authoritative even when partially implemented.
