---
title: HouseNow capability audit for VMLS
status: research
authority: supporting
last_reviewed: 2026-08-14
evidence_labels:
  - FACT
  - INFERENCE
  - PROPOSAL
---

# HouseNow capability audit for VMLS

## Audit basis

`FACT`: Findings were revalidated against `TheNowProject/housenow-monorepo@6e354dd6f399a6a2d0f0edc7f5412d45734b2111`. They describe code capabilities, not production readiness or approved VMLS semantics.

## Validated capabilities

- `FACT`: Listing supports marketplace ownership, agency association, media, address, price, moderation/publication state, source fields, engagement, recommendation, and search indexes. Agent creation, admin moderation, and broad listed-record search are implemented. See `packages/db/prisma/schema.prisma:1958-2100`, `agent-listing-router.ts:852-935`, `admin/.../listing-router.ts:5791-5869`, and `client/.../listing-router.ts:87-295`.
- `FACT`: ContactRequest, Lead, LeadInfo, and demand history support contact capture, assigned agent, origin, notes, matching, criteria, behavioral signals, PIC, purchase timing, loan interest, and change history. See `schema.prisma:2190-2210,2291-2350,2381-2434,2518-2547`.
- `FACT`: Agency and membership models support organization profile, budget, member role, invitations, activation, removal, subscription linkage, and history. See `schema.prisma:524-612` and `agency-member-router.ts:28-423`.
- `FACT`: Bank, package, member, LoanRequest, LoanContract, disbursement, operational status, and history models support loan intake and servicing operations. See `schema.prisma:614-674,3046-3072,3110-3150,3212-3226`.

## MLS boundary

HouseNow is a strong marketplace, CRM, organization, notification, and finance substrate. It does not supply canonical VMLS semantics for durable Property/Parcel identity, Listing Agreement, Representation, Consent, purpose-bound Entitlement, field projection, or Closing Record.

`FACT`: HouseNow `Transaction` stores web/admin/Google/IAP/wallet payment, package, subscription, receipt/provider, export, discount, and channel data. It is a billing transaction, not a property deal. See `schema.prisma:2822-2865`.

`PROPOSAL`: At the integration boundary, name this concept `BillingTransaction` and keep any Commercial Deal and Closing Record separate.
