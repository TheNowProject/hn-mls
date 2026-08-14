---
title: Static demo security boundary
status: current
authority: supporting
last_reviewed: 2026-08-15
---

# Static demo security boundary

The current artifact is a public, static pre-MVP demonstration. Its client-side role views and journey guards communicate product intent; they are not security controls.

## Implemented demo safeguards

- **FACT:** Bundled records are synthetic or masked and contain no intended real customer credentials or personal contact details.
- **FACT:** The client has no authentication flow, bearer tokens, server API, database, analytics, or live authority/integration connection.
- **FACT:** Progress is serialized under a versioned browser `localStorage` contract; invalid or obsolete payloads reset to configured sample state.
- **FACT:** External references are local assets. The 357 screenshot is dated and attributed, and no government page is embedded at runtime.
- **FACT:** VNeID, VPCC, tax, VPĐKĐĐ, Developer Portal, 357, and HouseNow behavior is labelled `Mô phỏng đề xuất` where it could be mistaken for live connectivity or official authority.

## Limitations

- Browser state is user-editable, clearable, and device-local. It is not trusted persistence or an immutable audit ledger.
- A role switcher is a storytelling projection, not identity, Membership, Entitlement, Consent, or field-level authorization.
- Reducer transition guards prevent accidental out-of-order demo actions only; they provide no protection against a modified client.
- Static hosting still requires normal platform controls such as HTTPS, dependency review, security headers, deployment access governance, and incident ownership.
- The demo has no retention enforcement, encryption/key operations, rate limiting, abuse protection, centralized observability, backup, recovery, or integration reconciliation.

## Pilot gate

Do not load real Public, Industry, Restricted, customer, document, identity, financial, or authority data into this build.

> **PROPOSAL:** Before any pilot with real data, define a separate production architecture and complete threat/privacy review, identity and authorization design, data classification and retention policy, integration sandbox validation, monitoring, recovery, and legal/compliance approval.
