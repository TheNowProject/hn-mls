---
title: VMLS system adaptation boundary
status: research
authority: supporting
last_reviewed: 2026-08-14
evidence_labels:
  - FACT
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# VMLS system adaptation boundary

This proposal combines the commit-pinned [357](./357-capability.md) and [HouseNow](./housenow-capability.md) audits without treating either schema as the VMLS domain model.

## Proposed ownership

| Capability | Proposed owner |
|---|---|
| Property/certificate identifier claims, project legal records, regulatory-style submission | 357 adapter, subject to governance and privacy contracts |
| Listing creation/moderation/search, media, CRM, agency operations, notifications, loan intake | HouseNow adapter |
| Property/Parcel identity resolution, Project/Unit mapping, Listing lifecycle and relist history | VMLS canonical core |
| Party, Membership, Representation, Consent, Purpose, Entitlement, and field projection | VMLS canonical core |
| Provenance, Verification, Closing Record, audit, reconciliation | VMLS canonical core |

## Integration invariants

1. `PROPOSAL`: Use source system, source key, retrieval/effective time, status, and reconciliation state; never merge the databases or copy either source schema wholesale.
2. `PROPOSAL`: Treat 357 legal and identifier data as upstream claims until governance and API contracts establish authority.
3. `PROPOSAL`: Keep marketplace Listing and CRM behavior in HouseNow-facing contexts; send only required legal milestones into 357-facing workflows.
4. `PROPOSAL`: Keep HouseNow BillingTransaction, a future Commercial Deal, and Closing Record as separate concepts.
5. `PROPOSAL`: Put VMLS authorization and projection policy in front of any 357 owner, party, value, document, or history lookup.

## Gaps requiring new capability

- Cross-system identity mapping and reconciliation.
- Versioned inventory, price/policy, distribution, quota, and reservation concurrency.
- Representation, consent, co-broker cooperation, commission, and dispute evidence.
- Structured appraisal/risk and purpose-bound finance projection.
- Closing coordination, handover, and lawful oversight case management.

## Open decisions

- `OPEN QUESTION`: Which system is legally authoritative for each identifier and legal field in the first pilot?
- `OPEN QUESTION`: Which source fields may be cached, projected publicly, or require authenticated purpose?
- `OPEN QUESTION`: Which legal milestone belongs in VMLS versus an external registry workflow?
