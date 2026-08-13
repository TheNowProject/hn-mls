# Requirement traceability baseline

| Trace ID | Actor | Use case | Rules | Planned screen/API | Acceptance | Test focus |
|---|---|---|---|---|---|---|
| RT-01 | Agent | Find existing Property | BR-ID-01, BR-SEARCH-01, BR-DATA-01 | Search/results, identity detail, Property search API | AC-01, AC-06, AC-08 | Exact ID, address candidates, source conflict, empty result |
| RT-02 | Agent | Create Listing from Property | BR-ID-02, BR-LIST-01, BR-REP-01 | Listing composer, create API | AC-01, AC-03 | Relist, Unit link, invalid authority, preserved history |
| RT-03 | Brokerage | Review and activate | BR-REP-02, BR-LIFE-01, BR-AUDIT-01 | Review queue/panel, transition API | AC-02, AC-04 | Wrong organization, stale version, correction, approve |
| RT-04 | All target roles | View Listing detail by permission | BR-PERM-01, BR-PERM-02 | Role projections, detail API | AC-05 | Public/member/restricted leakage matrix including Seller own-scope |
| RT-05 | Steward | Resolve duplicate Property | BR-DUP-01, BR-DUP-02 | Quality queue, merge API | AC-07 | Not duplicate, merge, replay, preserve aliases/history |
| RT-06 | Developer | Maintain Unit inventory | BR-UNIT-01, BR-INT-01 | Inventory grid/import, import API | AC-09, AC-12 | Replay batch, partial errors, effective dates |
| RT-07 | Buyer | Discover and share | BR-PERM-02, BR-CONSENT-01 | Buyer search/detail/shortlist | AC-05, AC-10 | No restricted fields, consent grant/revoke |
| RT-08 | Bank | View finance context | BR-CONSENT-01, BR-PERM-01 | Finance panel, consented lead API | AC-05, AC-10 | Purpose mismatch, expired/revoked consent |
| RT-09 | Future Regulator | Inspect aggregate/authorized detail | BR-AGG-01, BR-PERM-01, BR-AUDIT-01 | Deferred quality dashboard, audit search | AC-05, AC-11 | Jurisdiction boundary, override reason, masking; excluded from target six-actor release |
| RT-10 | System/Integration | Synchronize changes | BR-INT-01, BR-INT-02, BR-LIFE-03 | Import/feed/reconciliation APIs | AC-08, AC-12 | Retry, duplicate, gap, replay, stale index |
| RT-11 | Agent | Produce an explainable CMA draft | BR-CMA-01, BR-CMA-02 | CMA subject/candidate workflow and local draft report | Prototype exploration; durable report acceptance remains future scope | Human include/exclude, rationale, indicative range, no automatic publish |
| RT-12 | Owner/Seller | Claim or link owned Property | BR-ID-01, BR-DATA-01, BR-AUDIT-01 | Seller property workspace, ownership-claim API | AC-06, AC-14 | No match, ambiguous match, conflicting claimant, reject/dispute, no premature verification |
| RT-13 | Owner/Seller | Grant, renew or revoke representation | BR-REP-01, BR-REP-02, BR-AUDIT-01 | Representation detail/version flow and API | AC-03, AC-04, AC-14 | Expiry, overlapping authority, revocation during Active Listing, preserved history |
| RT-14 | Owner/Seller | Grant or revoke distribution consent | BR-CONSENT-01, BR-INT-02, BR-AUDIT-01 | Public preview, channel consent and reconciliation API | AC-10, AC-12, AC-14 | Partial-channel consent, expiry, revoke, downstream withdrawal failure |
| RT-15 | Owner/Seller | Monitor owned Listing and permitted milestones | BR-PERM-01, BR-PERM-02, BR-LIFE-01 | Seller dashboard, Listing milestone projection | AC-05, AC-14 | Own-scope enforcement, buyer/privacy masking, stale status, multi-owner scope |
| RT-16 | Owner/Seller | Request correction, pause or withdrawal | BR-DATA-01, BR-LIFE-01, BR-AUDIT-01 | Seller case form, Brokerage/Steward review queue | AC-04, AC-07, AC-14 | Request is not direct mutation, SLA/escalation, rejected request, safety hold, outcome notification |
