---
title: Phase 6.4 Owner/Seller workspace
status: proposal
authority: working
last_reviewed: 2026-08-14
---

# Phase 6.4 — Owner/Seller workspace and target actor completion

Date: 2026-08-13
Status: `IN PROGRESS — FIRST VERTICAL SLICE OPERATIONAL`
Scope owner: Project owner

## Locked actor scope

The canonical Primary Market Actor order is:

1. Real-estate Agent / `Môi giới BĐS` (`agent`)
2. Brokerage / `Sàn môi giới` (`broker`)
3. Developer / `Chủ đầu tư dự án BĐS` (`developer`)
4. Buyer / `Người mua` (`buyer`)
5. Owner/Seller / `Người bán / Chủ sở hữu BĐS` (`seller`)
6. Bank / `Ngân hàng` (`bank`)

The role switcher keeps non-primary perspectives after those six:

7. Regulator / `Cơ quan quản lý` (`regulator`) — deferred exploration
8. Data Steward (`steward`) — operational role

Organization Admin and System Admin remain separate control-plane roles under the Phase 6.3 plan. They are not Primary Market Actors and do not receive business-data visibility by default.

## Current gap

| Perspective | UI/API state | Build action |
|---|---|---|
| Agent | Implemented | Regression only |
| Brokerage | Implemented | Regression only |
| Developer | Implemented exploration | Regression and scope review |
| Buyer | Implemented exploration | Regression and consent review |
| Owner/Seller | First vertical slice operational | Complete grant/renew, reviewer UI and downstream enforcement |
| Bank | Implemented exploration | Regression and purpose/consent review |
| Regulator | Implemented legacy exploration | Keep after primary actors; no new scope |
| Data Steward | Implemented operational view | Keep after primary actors; no market-actor claim |

The missing target role is only `seller`. Completing it changes the target UI from five implemented primary actors plus legacy/operations perspectives to all six locked Primary Market Actors.

## Implementation progress

Implemented in the first vertical slice:

- Seller demo login and canonical role order;
- backend-enforced own-property bootstrap and Property Intelligence projection;
- durable Party/Property relationship and pending Ownership Claim creation;
- append-oriented Representation and distribution-consent revocation with Audit Event;
- downstream reconciliation flag after consent revocation;
- correction, pause, withdrawal and dispute case creation plus scoped Broker/Data Steward decision API;
- Seller-specific navigation, notifications and three working workspaces;
- synthetic TP.HCM/Hà Nội ownership, Representation, consent and case states;
- positive and negative HTTP tests plus desktop/mobile UI walkthrough.

Remaining before Phase 6.4 completion:

- grant and renew commands/forms for Representation and distribution consent;
- reviewer UI integration for Ownership Claim and Seller case decisions;
- effective downstream distribution enforcement and reconciliation worker;
- co-owner threshold, disputed claimant and expiry automation;
- final actor-by-actor regression after the remaining commands are added.

## Product boundary

Seller is the source of ownership/authority evidence and distribution consent, not a Listing reviewer or unrestricted data consumer.

Seller can:

- see Properties linked through a verified, pending or disputed own relationship;
- create and follow an Ownership Claim;
- inspect, grant, renew or revoke Representation within the permitted relationship scope;
- review the exact public projection and decide distribution consent by channel, purpose and effective period;
- see own Listing price, status, distribution and permitted transaction milestones;
- request data correction, distribution pause or Listing withdrawal through an auditable review case;
- receive Seller-specific notifications about claims, Representation, consent, Listing changes and case outcomes.

Seller cannot:

- search all Industry or Restricted inventory because they own one Property;
- create, approve or directly transition a Listing by default;
- see buyer identity, brokerage CRM, private remarks, underwriting data or unrestricted audit history;
- silently overwrite ownership, Representation, consent, Listing state or historical evidence.

## Build slices

### Slice 1 — Role, projection and navigation

- Add the `seller` demo identity and keep the canonical role order defined above.
- Add Seller navigation: `Tổng quan`, `BĐS của tôi`, `Đại diện & phân phối`, `Yêu cầu`, `Quyền & chia sẻ`.
- Add an own-relationship Property projection in both bootstrap and Property Intelligence APIs.
- Add explicit denied/masked states for non-owned Property, CRM, private remarks, buyer and finance fields.
- Add Seller notification routing; no notification may link to a workspace Seller cannot open.

### Slice 2 — Durable authority model

Add append-oriented local persistence for:

- `parties` and Property–Party relationships;
- `ownership_claims` with claimant, relationship, evidence reference, status and decision;
- `representations` with Agent/Brokerage, transaction scope, exclusivity, start, expiry and version;
- `distribution_consents` with preview version, fields/media, channels, purpose, start, expiry and revocation;
- `seller_cases` for correction, pause, withdrawal and dispute requests;
- immutable Audit Events for every material decision or state change.

Seed both TP.HCM and Hà Nội with at least one verified relationship, one pending claim, one expiring Representation, one revoked/expired consent and one open case.

### Slice 3 — Seller workflows

- Claim/link Property and show pending, verified, rejected and disputed outcomes.
- Grant/renew/revoke Representation without replacing prior versions.
- Preview and grant/revoke distribution consent with downstream impact copy.
- Review own Listing milestones and price/status history through Seller projection.
- Submit correction, pause or withdrawal requests without mutating the Listing directly.
- Let Brokerage/Data Steward process the appropriate case while preserving organization and assignment boundaries.

### Slice 4 — Regression and hardening

- Run the same Property through all six primary projections and assert field differences.
- Add negative tests for non-owned Property IDs, conflicting claimants, expired authority, revoked consent and direct Listing transitions.
- Verify notification isolation by actor and market.
- Verify responsive role switching and all Seller empty/loading/error/permission states.
- Re-run the complete API, lint and production-build suite.

## Planned API surface

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/seller/properties` | Return only own verified/claimed Property relationships |
| `POST` | `/api/ownership-claims` | Create an auditable claim without changing canonical Property data |
| `GET` | `/api/properties/:id/representations` | Return Seller-authorized Representation versions |
| `POST` | `/api/properties/:id/representations` | Grant, renew or revoke through an append-oriented command |
| `GET` | `/api/properties/:id/distribution-consents` | Return consent versions and current effective projection |
| `POST` | `/api/properties/:id/distribution-consents` | Grant or revoke consent against an exact preview/version |
| `GET` | `/api/seller-cases` | Return cases visible to the Seller or assigned reviewer |
| `POST` | `/api/seller-cases` | Create correction, pause, withdrawal or dispute case |
| `POST` | `/api/seller-cases/:id/decision` | Allow only the scoped Brokerage/Data Steward reviewer to decide |

Endpoint names are the implementation baseline; request/response schemas must reuse the existing API error envelope and actor projection rules.

## Acceptance checklist

- [x] Role switcher shows the six Primary Market Actors first in the locked order.
- [x] Regulator and Data Steward remain available after the six primary actors.
- [x] Seller login, bootstrap, notifications and access snapshot work through the local API.
- [x] Seller sees only linked Property relationships and the permitted own-scope fields.
- [x] Ownership Claim never automatically verifies ownership or mutates Property identity.
- [ ] Representation and consent changes preserve prior versions and append Audit Events.
- [x] Correction/pause/withdrawal is a case, not a direct Listing transition.
- [ ] Revoked or expired consent prevents future distribution use.
- [ ] Buyer identity, CRM, private remarks, underwriting and unrestricted audit remain absent.
- [x] Both TP.HCM and Hà Nội contain realistic Seller states.
- [x] All eight current role perspectives remain navigable without dead-end routes.
- [x] Automated positive and negative authorization tests pass for the current vertical slice.

## Build order

1. Add failing projection and authorization tests for Seller own-scope and forbidden fields.
2. Add Seller demo identity, role order, navigation and notification contract.
3. Add persistence and seed data for relationships, claims, Representation, consent and cases.
4. Add backend queries, commands, authorization and audit.
5. Build Seller overview and `BĐS của tôi`.
6. Build Representation, distribution consent and case flows.
7. Add Brokerage/Data Steward review integration.
8. Run six-actor regression, responsive review and security-negative tests.

## Validation still required before pilot

The local build can proceed with synthetic evidence references and explicit pending/disputed states. Pilot use still requires Product/Legal approval of accepted ownership evidence, identity assurance, co-owner thresholds, delegated authority, e-signature needs, retention and downstream consent-revocation obligations.
