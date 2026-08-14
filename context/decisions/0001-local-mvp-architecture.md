---
title: Superseded local MVP architecture
status: superseded
authority: approved
last_reviewed: 2026-08-15
---

# ADR-001: Local MVP architecture

Status: Superseded on 2026-08-15 by the static public pre-MVP demo
Date: 2026-08-13

> **FACT:** This ADR records the retired Node/SQLite exploration slice. Its server, database, bearer-session, and browser API-client decisions are not part of the current executable runtime. See the [current product state](../product/current-state.md).

## Context

The repository contains a React prototype and domain research, but no backend, persistence or production identity system. Phase 6 needs an executable vertical slice without prematurely selecting a cloud vendor.

## Historical decision

- Keep React and Vite for the browser application.
- Add a Node HTTP API using platform modules.
- Use Node SQLite as the development persistence adapter.
- Keep lifecycle rules and permission checks in domain modules independent of HTTP and SQLite.
- Use a small API client seam in the browser.
- Use deterministic demo bearer sessions for local review only.

## Module seams

### Listing lifecycle module

Interface:

- `allowedTransitions(status, role)`
- `assertTransition({ from, to, role, reason })`
- `validateListingInput(input)`

The implementation owns transition rules, role guards and validation messages.

### MLS store module

Interface:

- `bootstrap(actor)`
- `createListing(actor, input)`
- `transitionListing(actor, input)`
- `close()`

SQLite is the first adapter. Tests may use a temporary SQLite file without changing callers.

### Browser API client module

Interface:

- `login(roleId)`
- `bootstrap()`
- `createListing(input)`
- `transitionListing(listingId, input)`

The implementation owns authentication headers, JSON parsing and normalized errors.

## Historical consequences

- The retired local MVP had persistence, backend authorization, and auditable transitions.
- SQLite supported development and pilot-like demos, not the final scale or availability target.
- Demo tokens would have required replacement before any external deployment.
- Partner sync and document storage remained explicit future adapters.
