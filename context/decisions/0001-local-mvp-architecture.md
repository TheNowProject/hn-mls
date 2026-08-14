---
title: Local MVP architecture
status: accepted
authority: approved
last_reviewed: 2026-08-14
---

# ADR-001: Local MVP architecture

Status: Accepted for development baseline
Date: 2026-08-13

## Context

The repository contains a React prototype and domain research, but no backend, persistence or production identity system. Phase 6 needs an executable vertical slice without prematurely selecting a cloud vendor.

## Decision

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

## Consequences

- The local MVP has persistence, backend authorization and auditable transitions.
- SQLite supports development and pilot-like demos, not the final scale or availability target.
- Demo tokens must be replaced before any external deployment.
- Partner sync and document storage remain explicit future adapters.
