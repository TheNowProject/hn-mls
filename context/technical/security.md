---
title: Operational prototype security boundary
status: current
authority: supporting
last_reviewed: 2026-08-15
---

# Operational prototype security boundary

The current artifact is a public, static VMLS operational workspace. Its client-side role projections, command guards, and local persistence support product evaluation; they are not authentication, authorization, trusted storage, or integration security controls.

## Implemented data-boundary behavior

- **FACT:** Bundled records are synthetic or masked and contain no intended real customer credentials or personal contact details.
- **FACT:** The client has no authentication flow, bearer tokens, server API, database, analytics, or live authority/integration connection.
- **FACT:** Accepted commands are serialized under a versioned browser `localStorage` replay contract; commands for another dossier, tampered commands, and obsolete payloads are rejected before configured initial state is restored.
- **FACT:** The Ngân hàng projection omits an entire dossier until the configured finance-sharing consent exists and then returns only its permitted fields.
- **FACT:** External references are packaged local assets. The 357 screenshot is dated and attributed in the source catalog, the HouseNow icon appears only on its Tin bán distribution-channel row, and neither site is embedded or contacted at runtime.
- **FACT:** The operational interface renders business data, lifecycle state, validation, and processing results. Evidence labels and repeated environment disclaimers are intentionally kept in repository documentation and review artifacts rather than rendered as product UI.

## Limitations

- Browser state is user-editable, clearable, and device-local. It is not trusted persistence or an immutable audit ledger.
- The role switcher previews configured workspaces and projections; it is not identity, Membership, Entitlement, Consent enforcement, or field-level authorization.
- Omitting or masking fields in a client-side projection is not a security boundary because a modified client can inspect bundled data.
- Reducer transition guards prevent accidental out-of-order prototype actions only; they provide no protection against a modified client.
- Static hosting still requires normal platform controls such as HTTPS, dependency review, security headers, deployment access governance, and incident ownership.
- The prototype has no retention enforcement, encryption/key operations, rate limiting, abuse protection, centralized observability, backup, recovery, or integration reconciliation.
- Configured VNeID, VPCC, tax, VPĐKĐĐ, Chủ đầu tư, 357, and HouseNow records or events do not prove a live contract, official decision, successful delivery, or production authority.

## Production-data gate

Do not load real Public, Industry, Restricted, customer, document, identity, financial, or authority data into this build.

> **PROPOSAL:** Before any environment uses real data, define a separate production architecture and complete threat/privacy review, identity and authorization design, data classification and retention policy, integration sandbox validation, monitoring, recovery, and legal/compliance approval.
