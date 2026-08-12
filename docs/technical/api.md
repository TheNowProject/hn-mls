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

Supported demo actors: `agent`, `broker`, `developer`, `bank`, `regulator`, `buyer`, and the operational `steward` role.

## Property Intelligence

`GET /properties/:propertyId/intelligence`

Returns a purpose-scoped Property 360 projection. Depending on the actor, the response can include list-price events, Listing episodes, verified closing records, cumulative days on market, relist count, CMA candidate snapshot, source events and audit history.

The projection is enforced by the backend: Buyer receives public fields only; Bank and Developer do not receive private remarks or audit; Regulator keeps audit within the simulated authority scope but receives no private remarks; Agent receives private remarks only for an assigned Listing.

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
