---
title: Business rules catalog
status: proposal
authority: working
last_reviewed: 2026-08-14
---

# Business rules catalog

Status: `PROPOSAL BASELINE` unless evidence level says otherwise.

## Identity

| ID | Rule | Evidence | Failure behavior |
|---|---|---|---|
| BR-ID-01 | Property and Listing have separate canonical identities. One Property may have multiple Listings over time. | FACT + adopted invariant | Reject model/write that overwrites prior Listing identity |
| BR-ID-02 | Creating a Listing from an existing Property preserves Property ID and creates a new Listing identity. | FACT/INFERENCE + PROPOSAL | Abort creation and surface identity conflict |
| BR-ID-03 | A Unit may link to a Property only after identity evidence is sufficient. | PROPOSAL | Keep Unit and Property link pending review |
| BR-ID-04 | A Parcel relation does not assume one-to-one cardinality. | OPEN QUESTION guarded by PROPOSAL | Support multiple candidate relations |

## Listing lifecycle

| ID | Rule | Evidence | Failure behavior |
|---|---|---|---|
| BR-LIST-01 | Relisting creates a new Listing and preserves prior Listing history. | FACT + invariant | Reject overwrite |
| BR-LIST-02 | Listing Input is not a market status and has no distribution visibility. | FACT distinction + PROPOSAL term | Keep draft outside discovery index |
| BR-LIST-03 | Incoming has a Listing ID but restricted visibility; Active requires full applicable validation. | FACT in reference, PROPOSAL for Vietnam | Block broad distribution |
| BR-LIFE-01 | Status changes use allowed transitions with actor, scope, guards, effective time, and reason. | FACT + PROPOSAL | Reject invalid transition and append no partial event |
| BR-LIFE-02 | Incorrect transitions are corrected by compensating events, never deletion or history rewrite. | PROPOSAL | Require authorized correction workflow |
| BR-LIFE-03 | Concurrent transition requests require idempotency and version conflict handling. | PROPOSAL | Return conflict and latest state |

## Authority and permission

| ID | Rule | Evidence | Failure behavior |
|---|---|---|---|
| BR-REP-01 | Organization Membership alone does not prove authority to market a Property. | PROPOSAL | Require valid Representation/Distribution Assignment |
| BR-REP-02 | Active transition requires authority valid for subject, transaction type, scope, and effective time. | PROPOSAL | Block and request evidence/correction |
| BR-PERM-01 | Authorization is evaluated using active Membership, organization, purpose, resource, action, scope, classification, consent, and time. | PROPOSAL | Deny by default |
| BR-PERM-02 | Public, Industry, and Restricted fields use separate authorized projections across all consumers. | FACT separation + PROPOSAL | Omit field and audit suspicious access where required |
| BR-CONSENT-01 | Consent is purpose-bound, revocable, time-bounded, and not inferred from account relationship. | PROPOSAL | Deny use outside consent scope |
| BR-OWNER-01 | An Ownership Claim is evidence to review, not automatic proof and never directly changes canonical Property data. | PROPOSAL | Keep claim Pending/Disputed and block authority-dependent action |
| BR-OWNER-02 | Seller authority is limited by relationship, ownership share/delegation, subject, transaction, effective period and required co-owner threshold. | PROPOSAL | Block grant/revoke and open evidence/dispute path |
| BR-OWNER-03 | Representation renew, replacement and revocation append a version/event and preserve every prior agreement and Listing history. | PROPOSAL | Reject destructive overwrite; route Active Listing for review |
| BR-OWNER-04 | Seller correction, pause and withdrawal actions create a case; only an authorized correction or lifecycle transition mutates the target. | PROPOSAL | Preserve target state and route review with SLA |
| BR-OWNER-05 | Seller projections expose own authority, consent and permitted milestones but exclude buyer identity, CRM, private remarks, underwriting and unrestricted audit. | PROPOSAL | Omit fields, deny access and audit suspicious reads |
| BR-CONSENT-02 | Seller distribution consent binds an exact preview/version, field/media scope, channel/recipient, purpose and effective period. | PROPOSAL | Block distribution when decision is missing, expired or mismatched |
| BR-CONSENT-03 | Consent revocation stops future permitted use and triggers downstream reconciliation without deleting lawful history. | PROPOSAL | Queue withdrawal/reconciliation, expose failure and retain audit |

## Data governance

| ID | Rule | Evidence | Failure behavior |
|---|---|---|---|
| BR-DATA-01 | Important imported records and fields retain source key, retrieval time, effective time, confidence, and editability. | INFERENCE + PROPOSAL | Mark incomplete provenance and block governed transitions where required |
| BR-DATA-02 | Conflicting source claims coexist until a reasoned correction resolves the canonical projection. | PROPOSAL | Open Data Issue, do not overwrite source |
| BR-DUP-01 | Matching creates duplicate candidates; destructive automatic merge is prohibited by default. | INFERENCE + PROPOSAL | Queue Steward review |
| BR-DUP-02 | Merge preserves aliases, sources, histories, audit events, and correlation IDs. | PROPOSAL | Reject merge plan that deletes lineage |
| BR-AUDIT-01 | Material changes append immutable Audit Events with actor, organization, time, reason, target, and before/after values. | PROPOSAL non-negotiable | Roll back material write if audit cannot be persisted atomically |
| BR-UNIT-01 | Unit identity lifecycle and commercial availability are separate state dimensions. | PROPOSAL | Reject ambiguous single status field |
| BR-AGG-01 | Regulator/market dashboards default to aggregate or authorized detail projections and apply suppression rules where needed. | PROPOSAL | Suppress unauthorized detail |

## Search, integration, and analysis

| ID | Rule | Evidence | Failure behavior |
|---|---|---|---|
| BR-SEARCH-01 | Search results identify whether a hit is Property, Listing, Project, Unit, or source record. | PROPOSAL from domain distinction | Do not render ambiguous generic result |
| BR-SEARCH-02 | Restricted fields cannot enter public/member search indexes or snippets. | PROPOSAL | Reject indexing document and alert security telemetry |
| BR-INT-01 | Import uses source plus source key for idempotency and supports replay/reconciliation. | PROPOSAL | Quarantine ambiguous/repeated batch |
| BR-INT-02 | Outbound distribution requires explicit field mapping, consent/policy, version, retry, and reconciliation. | SOURCE CLAIM + PROPOSAL | Stop/queue delivery and expose failure state |
| BR-CMA-01 | Comparable selection remains human-reviewed unless an approved requirement defines automation. | SOURCE CLAIM + PROPOSAL | Label suggestions and require explicit selection |
| BR-CMA-02 | Published CMA versions are immutable snapshots of criteria, selections, calculations, and source timing. | PROPOSAL | Create a new version for edits |

## Rule governance

- Every rule has an owner, effective period, version, and jurisdiction/organization scope before MVP implementation.
- Policy changes do not rewrite historical decisions; events retain the rule version used.
- Texas-specific labels, licensing, association, agreement, SLA, and status rules remain open until authoritative Vietnam approval.
