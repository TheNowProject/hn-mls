---
title: Local MVP API
status: current
authority: supporting
last_reviewed: 2026-08-14
---

# Local MVP API

Base path: `/api`

All endpoints except health and session require `Authorization: Bearer <demo-token>`.

## Session

`POST /session`

```json
{ "roleId": "agent" }
```

Returns a development-only bearer token and actor profile.

## Bootstrap

`GET /bootstrap`

Returns the actor-scoped Property view, current and historical Listings, allowed actions and quality issues when permitted.

Each Property includes a `market` discriminator (`hcm` or `hanoi`). The local UI applies the selected data-space scope consistently across search, Listing workspace, quality queue and actor dashboards.

Supported demo actors: `agent`, `broker`, `developer`, `buyer`, `seller`, `bank`, plus the deferred `regulator` perspective and operational `steward` role.

For `seller`, bootstrap returns only Properties linked through that actor's Property–Party relationship or Ownership Claim. The backend rejects direct access to an unrelated Property ID.

## Notifications

`GET /notifications?market=hcm`

Returns only notifications projected for the authenticated actor and selected market (`hcm` or `hanoi`). The client does not submit a target role. Every notification route is constrained to a workspace available to that actor; read/unread state is kept separately for each actor–market scope in the exploration session.

## Property Intelligence

`GET /properties/:propertyId/intelligence`

Returns a purpose-scoped Property 360 projection. Depending on the actor, the response can include list-price events, Listing episodes, verified closing records, cumulative days on market, relist count, CMA candidate snapshot, source events and audit history.

The projection is enforced by the backend: Buyer receives public fields only; Seller receives an own-relationship projection without private remarks, buyer/CRM/finance fields or unrestricted audit; Bank and Developer do not receive private remarks or audit; Regulator keeps audit within the simulated authority scope but receives no private remarks; Agent receives private remarks only for an assigned Listing.

When the resulting projection contains Restricted fields, the local slice appends a sensitive-read audit event with actor, organization, resource, field group, purpose and time.

## Owner/Seller authority

`POST /ownership-claims`

Creates a pending Ownership Claim with relationship, ownership share, evidence reference and reason. It does not verify ownership or mutate canonical Property data.

`GET|POST /properties/:propertyId/representations`

Returns append-oriented Representation versions or records a Seller command. The current local command supports auditable revocation; grant/renew command forms remain in the Phase 6.4 backlog.

`GET|POST /properties/:propertyId/distribution-consents`

Returns versioned consent records or revokes an effective consent. Revocation appends a version and marks downstream reconciliation as required.

`GET|POST /seller-cases`

Returns cases in the actor's scope or creates a correction, pause, withdrawal or representation-dispute request. Creating a case never mutates Listing status directly.

`POST /seller-cases/:caseId/decision`

Allows a scoped Brokerage reviewer or Data Steward to record a case decision and Audit Event.

## Access governance

`GET /access`

Returns the current actor profile, field-level projection matrix, actor-to-actor exchange policy, relevant consent records, visible Access Requests and sensitive-read audit events.

`POST /access-requests`

Creates a time-bounded request containing `resourceId`, `fieldGroup`, `purpose` and `duration`.

`POST /access-requests/:requestId/decision`

Allows Broker or Data Steward to approve or reject a pending request with a required reason. The prototype persists the decision; production still requires a policy engine to turn an approved request into an effective Entitlement.

## Public discovery

`GET /public/properties`

Returns Active Listings projected to public fields. Private remarks and full audit events are omitted at the backend.

## Create Listing

`POST /listings`

Required fields: `propertyId`, `price`, `expiresAt`, `agreement`, `publicRemarks`, `status` and distribution consent.

The backend rejects duplicate current Listings and appends Listing status and audit events atomically.

## Transition Listing

`POST /listings/:listingId/transitions`

```json
{ "to": "Active", "reason": "Representation and required fields verified" }
```

The backend evaluates role, current state and allowed transition before writing an immutable event.

## Health

`GET /health`

Returns database connectivity and service time.
