---
title: Permission model baseline
status: proposal
authority: working
last_reviewed: 2026-08-20
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
| Buyer declaration / create | No | Transaction within Organization scope | No | No | Confirm own readiness only | No | No | Inspect by authority when lawful |
| Project/Unit / maintain | No | Assigned distribution subset | Own Project scope | No | No | No; view owned Unit projection | Identity/quality correction | Override by authority |
| Audit / read | Own resources | Organization scope | Own resources | Limited purpose | Public history only | Own consent/authority/milestones | Assigned/all operational scope | Statutory scope |
| Audit / mutate/delete | No | No | No | No | No | No | No | No |
| Data Issue / report | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Data Issue / resolve | No | Organization correction | Own-data correction | No | No | Accept/reject own outcome only | Assigned Steward | Authority workflow |
| Aggregate dashboard | Own metrics | Organization metrics | Own Project metrics | Approved market/product view | No | Own Listing summary | Operational quality view | Jurisdiction view |

## Static V4 demo command contract

`PROPOSAL`: The client-side reducer enforces the following narrow demo contract. It demonstrates intended ownership and field projection only; it is not production authorization and does not replace the decision function above.

| Workspace | Mutable commands in VMLS | Read projection |
|---|---|---|
| Môi giới | Request seller Representation; register to cooperate; send an eligible applied Public projection to HouseNow | Assigned dossiers, Industry inventory, relevant processing milestone and source timeline |
| Sàn môi giới | Declare Buyer; apply a pending Seller price-correction request; hand off a ready notarization dossier | Organization queue, correction queue, represented inventory, relevant Buyer/processing projection |
| Người bán | Confirm or reject Representation; save PublicationProfile draft; apply PublicationProfile; request permitted Listing correction; send a requested supplemental document as an outbound handoff | Own PLID only, Public preview, own authority/consent milestones, processing summary |
| Người mua | Confirm the configured readiness checklist; acknowledge the new HĐMB on the Developer route | Own contract fields, permitted 357 Property snapshot, processing summary; no seller private data |
| Chủ đầu tư | Record intake and transfer confirmation for the configured HĐMB route | Routed Developer dossier only |
| Ngân hàng | None in this slice | A consented finance projection only; the whole dossier is absent without Buyer consent |
| Vận hành VMLS | Receive the next configured inbound source event for a specific dossier and source | Object links, source cards, routing result, integration events, and audit events |
| VPCC | None | Read-only synchronized queue and detail |
| VPĐKĐĐ | None | Read-only synchronized queue and detail |
| Cơ quan thuế | None | Read-only synchronized queue and detail |

The VNeID local session is independent from this matrix. `CONFIRM_VNEID_LOGIN` and `LOGOUT_VNEID` create or clear only the masked browser session; they do not select a role, grant an Entitlement, unlock a command, or change a dossier.

### Publication and correction projection rules

- One `PublicationProfile` belongs to one PLID and has `draftVersion` and `appliedVersion`.
- PLID, transaction/property type, general location, and responsible Agent business contact are locked Public groups. The Seller may decide whether the configured price, project/unit, detailed location, named areas, features, description, and images appear.
- Public search and HouseNow serialize only the applied Public projection. The Industry projection for represented inventory is independently allowlisted and is never expanded by a Public setting.
- A Seller correction is a request, not a direct mutation. Only the Brokerage applies the configured request; acceptance appends a Listing revision and an Audit Event.
- If the previous applied version was already sent, applying a correction marks the channel `Cần cập nhật` and appends reconciliation data. It does not claim an external update.

### Buyer and external-source projection rules

- Only the Brokerage creates `BuyerDeclaration`. The responsible Agent and Buyer receive the fields required for their job; the Seller receives a milestone rather than Buyer identity; VPCC, VPĐKĐĐ, and Tax projections omit Buyer identity.
- The Buyer's Property panel exposes only the safe configured `PropertySourceRecord357` claims and their provenance. It excludes owner identity, CCCD, and private transaction history.
- External processing states use `Chờ tiếp nhận`, `Đang xử lý`, `Yêu cầu bổ sung`, and `Đã xử lý`. The raw source status, source system, processing organization, source timestamp, and VMLS receipt timestamp remain inspectable where the role is entitled.
- VPCC, VPĐKĐĐ, and Tax records are read-only. Their configured queues support search, filter, and detail only; no accept, sign, approve, request-supplement, or tax-decision command is available in VMLS.
- Vận hành VMLS receives the next configured source event. Event identities are idempotent, duplicates are ignored, and an older event cannot regress the normalized status.
- External status events and user-created Audit Events are separate append-only collections.

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
