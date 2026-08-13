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

| Resource / action | Agent | Brokerage | Developer | Bank | Regulator | Buyer | Steward |
|---|---|---|---|---|---|---|---|
| Property / read | Assigned/industry scope | Organization scope | Own Project/Unit scope | Purpose-limited | Jurisdiction scope | Public projection | Quality scope |
| Property / propose correction | Yes | Yes | Own scope | Yes | Request/override by authority | Report | Yes |
| Property / merge | No | Recommend | Recommend | No | Override by authority | No | Assigned Steward only |
| Listing / create | Own representation | On behalf within organization | Own inventory | No | No | No | Assisted correction only |
| Listing / edit | Responsible Listing | Organization scope | Own inventory | No | Override by authority | No | Correction scope |
| Listing / submit | Responsible Listing | Organization scope | Own inventory | No | No | No | No |
| Listing / approve Active | No | Configured organization scope | Configured own inventory | No | Override/supervision only | No | Quality co-review only |
| Listing / transition | Allowed own transitions | Allowed organization transitions | Own inventory transitions | No | Authorized override | No | Correction only |
| Listing / restricted fields | Need-to-know subset | Organization policy | Own inventory subset | Explicit purpose/consent only | Statutory scope | No | Assigned investigation scope |
| Representation / create | Propose | Validate organization party | Create distribution basis | No | Inspect by authority | No | Verify evidence |
| Project/Unit / maintain | No | Assigned distribution subset | Own Project scope | No | Override by authority | No | Identity/quality correction |
| Audit / read | Own resources | Organization scope | Own resources | Limited purpose | Statutory scope | Public history only | Assigned/all operational scope |
| Audit / mutate/delete | No | No | No | No | No | No | No |
| Data Issue / report | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Data Issue / resolve | No | Organization correction | Own-data correction | No | Authority workflow | No | Assigned Steward |
| Aggregate dashboard | Own metrics | Organization metrics | Own Project metrics | Approved market/product view | Jurisdiction view | No | Operational quality view |

## Field-level visibility matrix

| Field group | Public | Agent/member | Responsible Agent | Brokerage | Developer | Bank | Regulator | Steward |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Public address/location projection | Yes | Yes | Yes | Yes | Yes | Purpose-limited | Aggregate/detail by authority | Yes |
| Exact unit/access detail | Policy-dependent | Entitled | Yes | Yes | Own inventory | No by default | Authority | Assigned case |
| Public price/status/features/media | Yes if distributed | Yes | Yes | Yes | Own inventory | Purpose-limited | Yes | Yes |
| Private remarks/showing instructions | No | No by default | Yes | Need-to-know | Own inventory subset | No | Authority if lawful | Assigned case |
| Owner identity/contact | No | No by default | Consent/purpose | Supervisory need | Own relationship | Explicit consent only | Statutory purpose | Verification case only |
| Representation evidence/documents | No | No | Own Listing | Review scope | Own scope | No | Authority | Verification scope |
| Agent/organization industry contact | Public subset | Yes | Yes | Yes | Yes | Purpose-limited | Yes | Yes |
| Verification evidence | Outcome only | Outcome/scope | Relevant details | Review details | Own details | Outcome only | Authority | Full assigned case |
| Source/provenance | Public summary | Industry projection | Relevant details | Relevant details | Own details | Purpose-limited | Authority | Full assigned case |
| Audit event | Public milestone only | Own scope | Own Listing | Organization scope | Own resource | Limited purpose | Authority | Operational scope |
| Closing/finance/consent data | No by default | No by default | Allowed transaction scope | Supervisory allowed scope | Own transaction subset | Explicit consent/purpose | Authority | Incident/quality scope |

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
- Admin/regulator override requires purpose, reason, authority scope, and Audit Event.
- System Admin has no blanket business-data projection; exceptional Restricted reads require Break-glass Access and cannot be granted to the requester by the requester alone.
- Consent is purpose-bound, revocable, time-bounded, and never inferred from a generic account relationship.
