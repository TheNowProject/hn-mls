---
title: MVP acceptance criteria baseline
status: draft
authority: working
last_reviewed: 2026-08-21
---

# MVP acceptance criteria baseline

Status: `DRAFT`
These criteria define testable outcomes. They do not approve unresolved legal or operating policy.

`SOURCE CLAIM`: The supplied process image and meeting flow describe notarization followed by Tax and land-registration work. The sequence is not independently approved legal policy.

`PROPOSAL`: The following V5 criteria define the deterministic client-side demo contract. The broader MVP criteria later in this document remain product baselines outside the narrower runtime slice.

## V5 executable-demo acceptance contract

### V5-AC-01 Landing, catalogue, and runtime accounts

- The public landing uses the Living Registry direction and the headline `Một định danh. Mọi nguồn dữ liệu. Một hành trình có thể truy vết.`
- A lightly animated NPID–PLID–PTID/HouseNow/357/Tax/VPĐKĐĐ network respects `prefers-reduced-motion`.
- Public search contains four to five configured Listings, prioritizes Phú Thượng, and returns only allowlisted NPID, PLID, Listing facts, and provenance.
- Public output contains no PTID, party, contract/document, obligation, processing, notification, work-item, Audit Event, or Integration Event field.
- `Mở tài khoản demo` exposes exactly Môi giới, Sàn môi giới, Người bán, Người mua, and Vận hành VMLS; unread badges are scoped per account.
- Legacy/unknown routes return to the landing and never default to an Agent projection.

### V5-AC-02 Identity, HouseNow snapshot, and declaration

- The initial fixture has one Phú Thượng Property/NPID and Listing/PLID, a versioned `HouseNowListingSnapshot`, and no declaration or PTID.
- NPID, PLID, external HouseNow Listing ID, contract ID, 357 transaction ID, PTID, source-case IDs, and event IDs remain distinct.
- Only the responsible Agent can submit the configured post-notary declaration.
- Input contains Buyer reference, whole-VND value, contract number/date, notary organization/date, required notarized-transfer-contract PDF metadata, and optional deposit-contract PDF metadata. NPID, PLID, and Seller derive from the Listing.
- Wrong actor, PLID, missing/wrong document, malformed value/date, extra field, or second submission produces no partial change.
- Success atomically creates `TransactionDeclaration`, PTID, Tax case/handoff, Audit Event, and Integration Event while storing no file bytes/base64/path.

### V5-AC-03 357 source and reconciliation

- Only VMLS Ops can synchronize the configured `TransactionSourceRecord357`, and the command succeeds at most once.
- The Agent declaration, HouseNow Listing snapshot, and 357 transaction source remain separate immutable/provenance-bearing records.
- Reconciliation classifies each configured field as `matched`, `mismatched`, `missing_in_vmls`, or `missing_in_357` without overwriting a source.
- The main fixture reconciles all comparable fields. Dedicated tests cover mismatch and both missing directions.
- Reconciliation differences remain visible to Ops but never block `ADVANCE_EXTERNAL_PROCESSING`.

### V5-AC-04 Sequential external processing

- Only VMLS Ops can advance processing; the command has no caller-supplied source, status, event index, or outcome.
- Each valid invocation applies exactly one next event: Tax received → action required → both obligations completed → VPĐKĐĐ received → VPĐKĐĐ processing → complete.
- Event 3 displays `Đã đóng thuế TNCN` and `Đã đóng lệ phí trước bạ` as separate completed rows and only then creates the VPĐKĐĐ handoff.
- No Land Registry case exists before both obligation rows complete.
- Duplicate, stale, skipped, exhausted, malformed, and unauthorized attempts are atomic no-ops; status never regresses and events do not duplicate.
- 357 synchronization and external-status progression are independent and may occur in either order after declaration.

### V5-AC-05 Notifications and work items

- Event 2 creates exactly one Seller notification and open work item without a tax amount or allocation of legal liability.
- Event 3 resolves the Seller work item without deleting its notification/history.
- Event 6 completes PTID and creates exactly one Buyer notification/work item directing certificate collection at VPĐKĐĐ.
- Only the recipient can mark a notification read; reading does not complete work or advance processing.
- Opening a notification routes to that account's permitted dossier projection, and unread/read state survives reload.
- The Buyer has no readiness or certificate-receipt acknowledgement command, and completion creates no `ClosingRecord`.

### V5-AC-06 Projections, replay, and reset

- Agent can declare and monitor; Brokerage is monitoring-only; Seller/Buyer receive recipient-scoped projections; Ops alone sees source comparison and synchronization controls.
- Seller and Buyer never receive the other party's reference. Seller notification contains no financial amount or payer assertion.
- Every accepted command appends the appropriate immutable history; user Audit Events, system Integration Events, and external source events remain separate.
- V5 state round-trips through its versioned browser key. V4, malformed, tampered, or unsupported payloads fail closed to the initial fixture.
- Successful V5 initialization removes only explicitly named legacy demo/market/VNeID keys and never clears unrelated browser storage.
- Reset restores the Phú Thượng Listing ready for declaration, removes V5 transaction/notification progress, and returns to the landing.
- Runtime navigation contains no Bank, Developer, VPCC, Tax, VPĐKĐĐ, VNeID, agency-operation, Buyer-readiness, Developer-transfer, or Closing Record workspace/action.

## Broader MVP baseline

## AC-01 Canonical identity and relist history

Given a Property with one or more historical Listings, when an authorized Agent creates a new Listing, then:

- the Property ID remains unchanged;
- a new Listing ID is allocated;
- all prior Listings remain queryable and unchanged;
- the new Listing references the selected Property/Unit and input source;
- an Audit Event identifies actor, organization, time, and creation method.

Edge cases: multiple candidate Properties, multi-parcel relation, Project Unit without Property link, conflicting address source, prior withdrawn/closed Listing.

## AC-02 Duplicate active representation

Given a candidate Listing whose subject and effective period conflict with an existing Active Listing, when activation is requested, then:

- the system evaluates configured duplicate/representation rules;
- silent duplicate activation is prohibited;
- the user sees matching evidence without unauthorized sensitive fields;
- a review case can record exception or rejection;
- the outcome is audited.

## AC-03 Listing validation and submission

When a Listing Input is submitted:

- field-level errors identify missing or invalid values;
- conditional rules use transaction type, Property type, representation, dates, and visibility;
- failed validation preserves user input;
- Incoming and Active rule sets are explicitly versioned and distinct;
- Active cannot be reached while blocking validation, authority, verification, or issue conditions remain.

## AC-04 Review and lifecycle transitions

For every proposed transition:

- only allowed next transitions are offered;
- backend policy checks actor, Membership, organization, resource scope, current version, effective period, and required evidence;
- invalid, stale, duplicate, or unauthorized requests make no partial state change;
- success commits current state, Listing Status Event, Audit Event, and downstream event atomically or through a reliable outbox;
- correction appends a compensating event and never deletes history.

## AC-05 Field visibility

For Public, Agent, responsible Agent, Brokerage, Developer, Bank, Buyer, Owner/Seller, Steward, and future authority-scoped Regulator scenarios:

- every field group matches the approved visibility matrix;
- restricted values do not leak through search snippets, counts where sensitive, exports, reports, notifications, URLs, logs, analytics, caches, or error messages;
- denied states explain the policy category without revealing protected content;
- restricted read/override is audited where policy requires.

## AC-06 Provenance and verification

For every identity-critical or authority-critical claim:

- source identity/key and effective/retrieval time are available to authorized users;
- normalized values retain lineage to raw source claims;
- conflicts do not destroy source records;
- verification states identify claim scope, verifier, rule version, assessment time, and expiry/review where relevant;
- public badges never imply broader or permanent verification than the recorded claim.

## AC-07 Duplicate review and merge

When duplicate candidates are reviewed:

- users can compare source identifiers, normalized address, geospatial/project-unit context, and history;
- only authorized Steward/authority roles can finalize merge;
- not-duplicate, link, and merge outcomes require reasons;
- merge preserves aliases, source records, Listing history, Audit Events, and downstream correlation;
- rerunning the same merge command is idempotent.

## AC-08 Search and discovery

- Search distinguishes Property, Listing, Project, Unit, and permitted source records.
- Filters use governed taxonomy and explicit units/currency/time semantics.
- Public, Industry, and Restricted search documents are independently authorized.
- Status/price changes reach relevant indexes within an approved measurable SLA.
- Stale or failed indexing is observable and reconcilable.

## AC-09 Project and Unit inventory

- Import validates Project/Building/Unit identity and reports row-level errors.
- Replaying the same source batch does not duplicate Units.
- Unit identity state is separate from commercial availability.
- Price/status changes are effective-dated and audited.
- Distribution assignment limits which Organization can create/distribute Unit Listings.

## AC-10 Buyer collaboration and consent

- Buyers see only Public data and the purpose-bound projection of their own transaction; they never receive another Buyer's record or unrestricted Seller data.
- Shortlist, share, contact, and viewing requests do not expose restricted Listing data.
- Sharing data with an Agent or Bank requires clear purpose and consent scope.
- Revocation prevents future access while preserving lawful audit/history.
- Data Issue reports can be submitted without exposing reporter details to unauthorized parties.

## AC-11 Operations and future regulator oversight

- Quality queues show assignment, severity, age, source, affected resources, and resolution history.
- Regulator detail access is bounded by authority and purpose; default dashboard views are aggregate.
- Override requires reason, authority reference where applicable, and Audit Event.
- Audit search/export applies retention, masking, and export authorization.

Regulator scenarios remain a deferred authorization boundary and are not part of the target six-actor market release.

## AC-12 Integration reliability

- Imports and outbound feeds have stable source/message IDs.
- Retries do not create duplicate records or events.
- Failed delivery is observable with reason and next action.
- Reconciliation identifies missing, stale, duplicate, and conflicting downstream state.
- Replay is authorized, bounded, and audited.

## AC-13 Administration and Break-glass Access

- Every user can inspect their own active Membership, Entitlement, Purpose, Scope, expiry and relevant Consent without seeing another Party's private access record.
- Organization Admin can manage Membership and approved Entitlement templates only inside the Organization boundary.
- System Admin can manage platform identity, Organization state and policy versions but receives no Restricted business-data fields by default.
- Break-glass Access requires a Resource, Field Classification, Purpose, incident/reference, duration and an approver distinct from the requester for critical field groups.
- Elevated access expires automatically, cannot be silently renewed and records every Restricted read in an immutable audit trail.
- Consent records and Access Request decisions are projected only to the data subject, requester, data owner, scoped approver or lawful authority.
- Cross-organization approval without explicit ownership or delegated authority is rejected by the backend.

## AC-14 Owner/Seller authority and oversight

- A Seller can see only Properties linked through an own verified/claimed relationship and receives no organization-wide search entitlement from the Seller role.
- Creating an Ownership Claim records claimant, claimed relationship, Property candidate, evidence references, status, effective time and Audit Event; it does not alter canonical Property data or imply automatic verification.
- Granting representation records Agent/Brokerage party, transaction and exclusivity scope, effective/expiry dates, evidence or acknowledgement version and distribution conditions.
- Renewing, replacing or revoking representation creates a new version/event and preserves the prior agreement and every Listing created under it.
- Seller distribution consent presents the exact public-field preview, channel or recipient class, purpose, duration and revocation effect before confirmation.
- Revocation blocks future use after its effective time and creates downstream reconciliation work; it does not silently delete history or fabricate a Listing transition.
- A Seller request to correct data, pause distribution or withdraw a Listing creates a review case with reason, evidence, owner, SLA and outcome; only an authorized lifecycle transition mutates Listing status.
- Seller Listing views expose permitted price/status/distribution and transaction milestones but never buyer identity, brokerage CRM, private remarks, underwriting data or unrestricted audit events.
- Conflicting claimants, co-owners, expired authority and disputed representation enter explicit pending/blocked states and cannot be bypassed by client-side controls.
- Every sensitive Seller action and every restricted read is purpose-, scope- and time-checked and audited.

## Relationship between V5 and the broader baseline

The V5 executable is accepted against V5-AC-01 through V5-AC-06. It provides visible evidence for the identity, provenance, projection, append-only history, idempotency, and integration-reconciliation principles in AC-01 and AC-04 through AC-06/AC-12. It does not claim to implement the backend enforcement, full Listing lifecycle, consent/access governance, Project inventory, CMA, production administration, or live integrations described by the broader MVP baseline.

All V5 identities and source records must remain synthetic or masked. Passing V5 tests does not validate the supplied process as legal policy or approve official NPID/PTID ownership, Tax rules, VPĐKĐĐ procedure, 357 contracts, HouseNow contracts, or agency SLAs.
