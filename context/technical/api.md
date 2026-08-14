---
title: Retired local MVP API
status: superseded
authority: supporting
last_reviewed: 2026-08-15
---

# Retired local MVP API

> **FACT:** The previous Node HTTP API and SQLite implementation were removed when the repository became a static VMLS pre-MVP demo on 2026-08-15. There is no current `/api` base path, health endpoint, bearer token, server-side projection, or persistent mutation service.

The current Vite/React build reads bundled synthetic data, applies journey guards in a client reducer, and stores versioned demo progress in browser `localStorage`. Hash routes make demo views addressable on static hosting.

These client behaviors are presentation mechanics, not authentication, authorization, governed persistence, audit storage, or an external integration contract. Historical endpoint details remain available through Git history and must not be used as current implementation documentation.

> **OPEN QUESTION:** API boundaries, identity, policy enforcement, persistence, idempotency, reconciliation, and official-system contracts must be designed after the pilot scope and authority model are approved.
