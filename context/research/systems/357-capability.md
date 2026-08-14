---
title: 357 capability audit for VMLS
status: research
authority: supporting
last_reviewed: 2026-08-14
evidence_labels:
  - FACT
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# 357 capability audit for VMLS

## Audit basis

`FACT`: Findings were revalidated against `TheNowProject/357-cong-thong-tin@adf59f9e6adb13a9e2ec401d2bd643b05388b314`. Source inspection establishes code capabilities, not deployment state, production data quality, legal authority, or operating ownership.

## Validated capabilities

- `FACT`: Property and property-identifier records include cadastral/commercial references, upstream mappings, issuance status, issuing authority, and issuance time. See `tooling/database/schema.prisma:17-72,129-158` and `PropertyIdentifierCodeController.java:18-38`.
- `FACT`: Broker-certificate records include issuer, certificate and personal identifiers, status, source, issue/expiry dates, and revocation state. See `schema.prisma:669-716`.
- `FACT`: Project and legal-document records retain participants, source mappings, typed/versioned documents, source file identity, checksum, and source-update time. See `schema.prisma:301-347,391-433,479-548` and `N3ApprovedSyncService.java:92-237`.
- `FACT`: Land synchronization retains Kafka and source/batch/event context, writes histories and relations, and quarantines unsupported or failed records. See `LandSyncKafkaListener.java:22-45`, `LandSyncMessageProcessor.java:60-238`, and `LandSyncRecordPlanner.java:28-51`.
- `FACT`: The transaction workflow models contracts, parties, Properties, assignment, status, reasons, annex hashes, and authority-specific review commands. See `schema.prisma:815-982` and `BusinessPortalController.java:72-309`.

These capabilities support registry-style identity, legal-record, source-record, version, and workflow traceability. They do not establish general field-level provenance or statutory effect.

## Material privacy finding

`FACT`: Spring Security permits unauthenticated `GET /api/public/**`. The public route `/api/public/properties/{propertyCode}` calls detail assembly with `includePrivateSections=true`; its response includes owner name/document/address and transaction history with buyer/seller names, value, and status. See `SecurityConfiguration.java:34-52`, `PublicLookupController.java:136-165`, and `PublicLookupService.java:862-995`.

`PROPOSAL`: Do not reuse this endpoint as a VMLS public projection. Reuse lookup mechanics only behind VMLS field classification, purpose, consent, and privacy policy, with separate public and authenticated projections.

## Boundary

- Calling 357 the legal or Regulatory System of Record is a `PROPOSAL`, not a source-code fact.
- Reuse identifier verification, project/legal retrieval, source synchronization, and regulatory-style submission/status behind explicit adapters.
- Do not infer offer, reservation, deposit, commission, closing checklist, or handover capability from the transaction-registration workflow.
