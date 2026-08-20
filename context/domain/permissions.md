---
title: Permission model baseline
status: proposal
authority: working
last_reviewed: 2026-08-21
---

# Permission model baseline

Status: `PROPOSAL`
Production enforcement requirement: backend policy plus consumer-specific field projection.

## Authorization decision

Every request evaluates:

`User + active Membership + Organization + Role + Purpose + Resource + Action + Scope + Field Classification + Consent + Effective Time`

No global role name grants universal access. Frontend visibility is informative only and cannot replace backend authorization.

System Admin and Organization Admin are control-plane roles. Neither receives additional Property, Listing, CRM, finance, consent, document or audit-content visibility merely by holding the admin role.

## Administrative control plane

| Capability | Organization Admin | System Admin | Data Steward |
|---|---|---|---|
| Manage Membership | Own Organization | Platform support/recovery scope | No |
| Assign standard Entitlement | Own Organization and approved templates | Configure templates/policy; no silent business grant | No |
| Suspend User/Organization | Own members | Platform-wide with reason and audit | No |
| Configure policy/version | No | Yes, with change review and audit | Recommend only |
| Resolve identity/source/duplicate | No by default | No by default | Assigned quality case |
| Read Restricted business data | Existing business Entitlement only | No by default | Assigned quality case only |
| Approve Access Request | Data owner/Organization scope | Policy routing or support scope only | Assigned quality request |
| Activate Break-glass Access | No | Initiate; second approval required for critical groups | Approve only when assigned by policy |
| View audit | Own Organization metadata/content by Entitlement | Platform/security metadata; content still projected | Assigned operational scope |

Break-glass Access must identify the requester, approver, incident/reference, Resource, Field Classification, Purpose, start, expiry and every read performed during the elevated session.

## Resource-action-scope matrix

| Resource / action | Agent | Brokerage | Developer | Bank | Buyer | Owner/Seller | Steward | Future Regulator |
|---|---|---|---|---|---|---|---|---|
| Property / read | Assigned/industry scope | Organization scope | Own Project/Unit scope | Purpose-limited | Public projection | Own verified/claimed relationship | Quality scope | Jurisdiction scope |
| Property / propose correction | Yes | Yes | Own scope | Yes | Report | Own Property case | Yes | Request/override by authority |
| Property / merge | No | Recommend | Recommend | No | No | Dispute only | Assigned Steward only | Override by authority |
| Ownership Claim / create | Assisted | View organization-linked | No | No | No | Own claim | Verify assigned case | Inspect by authority |
| Listing / create | Own representation | On behalf within organization | Own inventory | No | No | No direct create; supply authority/consent | Assisted correction only | No |
| Listing / edit | Responsible Listing | Organization scope; apply Seller correction | Own inventory | No | No | Decide Public field groups; request value correction | Correction scope | Override by authority |
| Listing / submit | Responsible Listing | Organization scope | Own inventory | No | No | Acknowledge own authority scope | No | No |
| Listing / approve Active | No | Configured organization scope | Configured own inventory | No | No | No | Quality co-review only | Override/supervision only |
| Listing / transition | Allowed own transitions | Allowed organization transitions | Own inventory transitions | No | No | Request only | Correction only | Authorized override |
| Listing / restricted fields | Need-to-know subset | Organization policy | Own inventory subset | Explicit purpose/consent only | No | Own authority/consent projection only | Assigned investigation scope | Statutory scope |
| Represented inventory / search | Industry projection when entitled | Organization/market scope | Own inventory projection | No | No | Own Listing summary only | Quality scope | Jurisdiction scope |
| Co-broker registration / create | Eligible Listing and own Membership | Organization policy/supervision | No | No | No | No direct action | No | No |
| Listing distribution / send | Responsible Listing or active CoBrokerRegistration plus channel consent | Organization policy/supervision | Own inventory scope | No | No | Grant/revoke own channel consent | Verification only | Supervision by authority |
| Representation / create | Propose | Validate organization party | Create distribution basis | No | No | Grant/renew/revoke own authority | Verify evidence | Inspect by authority |
| Distribution consent / decide | Propose scope | Validate and execute | Own-unit distribution scope | No | Own buyer consent only | Grant/revoke own Listing channels | Verify assigned case | Inspect by authority |
| Transaction declaration / create | Responsible Listing, post-notary scope | Monitor Organization scope | No in V5 | No in V5 | No; own projection only | No; own projection only | Quality review only | Inspect by authority when lawful |
| Project/Unit / maintain | No | Assigned distribution subset | Own Project scope | No | No | No; view owned Unit projection | Identity/quality correction | Override by authority |
| Audit / read | Own resources | Organization scope | Own resources | Limited purpose | Public history only | Own consent/authority/milestones | Assigned/all operational scope | Statutory scope |
| Audit / mutate/delete | No | No | No | No | No | No | No | No |
| Data Issue / report | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Data Issue / resolve | No | Organization correction | Own-data correction | No | No | Accept/reject own outcome only | Assigned Steward | Authority workflow |
| Aggregate dashboard | Own metrics | Organization metrics | Own Project metrics | Approved market/product view | No | Own Listing summary | Operational quality view | Jurisdiction view |

## Static V5 demo command contract

`PROPOSAL`: The client-side reducer enforces the following narrow demo contract. It demonstrates intended ownership and fail-closed projections only; it is not production authentication or authorization and does not replace the decision function above.

| Runtime account | Mutable commands in VMLS | Read projection |
|---|---|---|
| Môi giới | `SUBMIT_TRANSACTION_DECLARATION` for the one assigned post-notary Listing | Assigned NPID/PLID, HouseNow snapshot, accepted declaration, PTID, and safe processing milestones |
| Sàn môi giới | None | Organization-scoped Listing/transaction monitoring projection |
| Người bán | `MARK_NOTIFICATION_READ` only for a notification addressed to the selected Seller | Own safe dossier milestone, own notification, and own work item; no Buyer reference, amount, source comparison, or internal history |
| Người mua | `MARK_NOTIFICATION_READ` only for a notification addressed to the selected Buyer | Own safe dossier milestone, own completion notification, and own collection work item; no Seller reference or tax detail |
| Vận hành VMLS | `SYNC_TRANSACTION_FROM_357` once; `ADVANCE_EXTERNAL_PROCESSING` for exactly the next configured event | Both source records, per-field reconciliation, external cases/events, obligations, Audit Events, and Integration Events |
| Public visitor | None | Explicitly allowlisted NPID, PLID, Listing facts, HouseNow source label/version, and safe provenance only |

Only these five accounts are available in the V5 account switcher. Bank, Developer, VPCC, Tax, VPĐKĐĐ, VNeID, and agency-operation workspaces are outside V5 runtime scope. This does not remove their distinct Party/Organization/Role concepts from the broader canonical model.

### Transaction-declaration rules

- `SUBMIT_TRANSACTION_DECLARATION` is Agent-only and scoped to the configured Phú Thượng PLID.
- The command takes only Buyer reference, whole-VND transaction value, contract number/date, notary organization/date, required notarized-transfer-contract PDF metadata, and optional deposit-contract PDF metadata. NPID, PLID, and Seller are resolved from the Listing, not trusted from editable input.
- File metadata is validated and stored; file bytes, base64, object URLs, and local paths are not domain state.
- Wrong actor, PLID, required document, media type, value/date shape, extra key, or second submission leaves all records and histories unchanged.
- Success atomically creates the declaration, PTID, Tax case/handoff, Audit Event, and Integration Event.

### HouseNow and 357 source rules

- Public search and the Agent view consume an allowlisted `HouseNowListingSnapshot`; it is separate from Property and Listing and cannot be mutated by transaction commands.
- `SYNC_TRANSACTION_FROM_357` is VMLS Ops-only and one-shot after declaration. It accepts the exact configured source record shape and never accepts VMLS fields as authoritative source updates.
- Declaration and 357 records remain side by side. Reconciliation assigns `matched`, `mismatched`, `missing_in_vmls`, or `missing_in_357` per configured field.
- Mismatch or missing values do not overwrite either source and do not gate external-status progression. Only Ops sees detailed reconciliation.

### External processing and notification rules

- `ADVANCE_EXTERNAL_PROCESSING` is VMLS Ops-only. The reducer selects the next event; callers cannot choose a source, status, event index, or outcome.
- The accepted order is Tax received → tax action required → both obligations completed → VPĐKĐĐ received → VPĐKĐĐ processing → completed.
- A VPĐKĐĐ case cannot exist before both configured obligation rows are complete.
- Duplicate, stale, skipped, exhausted, malformed, or unauthorized commands are atomic no-ops and cannot regress processing.
- Event 2 creates one Seller notification and open work item without amount or payer allocation. Event 3 resolves that work item. Event 6 creates one Buyer notification and collection work item.
- `MARK_NOTIFICATION_READ` requires the selected account to be the notification recipient. It changes only read state and never resolves the work item or advances processing.
- External status events, user Audit Events, and system Integration Events are separate append-oriented collections.

### Projection rules

- Public, Agent, Brokerage, Seller, Buyer, and Ops projections use independent fail-closed allowlists; frontend hiding is insufficient.
- Public output structurally omits PTID, parties, contract/document data, obligations, processing, notifications, work items, and internal histories.
- Brokerage monitors the Organization record but has no declaration, approval, 357-sync, or status-sync command.
- Seller and Buyer projections are recipient-scoped and omit the other party's reference. The Seller sees no tax amount or legal-liability claim.
- Ops alone sees raw source comparisons, event identities, idempotency data, and full demo histories.
- Unknown routes or legacy role hashes return to the public landing rather than defaulting to the Agent account.

## Field-level visibility matrix

| Field group | Public | Agent/member | Responsible Agent | Brokerage | Developer | Bank | Buyer | Owner/Seller | Steward | Future Regulator |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Public address/location projection | Yes | Yes | Yes | Yes | Yes | Purpose-limited | Yes | Own Property | Yes | Aggregate/detail by authority |
| Exact unit/access detail | Policy-dependent | Entitled | Yes | Yes | Own inventory | No by default | No | Own Property; access instruction excluded | Assigned case | Authority |
| Public price/status/features/media | Yes if distributed | Yes | Yes | Yes | Own inventory | Purpose-limited | Yes | Own Listing | Yes | Yes |
| Private remarks/showing instructions | No | No by default | Yes | Need-to-know | Own inventory subset | No | No | No by default | Assigned case | Authority if lawful |
| Owner identity/contact | No | No by default | Consent/purpose | Supervisory need | Own relationship | Explicit consent only | No | Own identity/authorized co-owner subset | Verification case only | Statutory purpose |
| Representation evidence/documents | No | No | Own Listing | Review scope | Own scope | No | No | Own agreement | Verification scope | Authority |
| Agent/organization industry contact | Public subset | Yes | Yes | Yes | Yes | Purpose-limited | Public subset | Responsible party for own Listing | Yes | Yes |
| Verification evidence | Outcome only | Outcome/scope | Relevant details | Review details | Own details | Outcome only | Outcome only | Own claim outcome and permitted evidence | Full assigned case | Authority |
| Source/provenance | Public summary | Industry projection | Relevant details | Relevant details | Own details | Purpose-limited | Public summary | Own-claim relevant subset | Full assigned case | Authority |
| Audit event | Public milestone only | Own scope | Own Listing | Organization scope | Own resource | Limited purpose | Public milestone | Own authority/consent/milestone events | Operational scope | Authority |
| Closing/finance/consent data | No by default | No by default | Allowed transaction scope | Supervisory allowed scope | Own transaction subset | Explicit consent/purpose | Own buyer consent only | Own consent and permitted transaction milestones | Incident/quality scope | Authority |

## Permission states required in UI

- Allowed and visible.
- Allowed but masked until purpose/consent is selected.
- Not allowed with a plain-language explanation.
- Temporarily unavailable because Membership, consent, verification, or effective period expired.
- Pending access request or organization approval.

## Non-negotiable controls for MVP

- Deny by default.
- Backend checks for every read and write.
- Separate projections/indexes for Public, Industry, and Restricted data.
- Scope audit for restricted reads and all material writes.
- Prevent restricted data from logs, analytics payloads, exports, caches, notifications, and search snippets.
- Admin or future regulator override requires purpose, reason, authority scope, and Audit Event.
- System Admin has no blanket business-data projection; exceptional Restricted reads require Break-glass Access and cannot be granted to the requester by the requester alone.
- Consent is purpose-bound, revocable, time-bounded, and never inferred from a generic account relationship.
