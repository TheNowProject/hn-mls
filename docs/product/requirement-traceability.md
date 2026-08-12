# Requirement traceability baseline

| Trace ID | Actor | Use case | Rules | Planned screen/API | Acceptance | Test focus |
|---|---|---|---|---|---|---|
| RT-01 | Agent | Find existing Property | BR-ID-01, BR-SEARCH-01, BR-DATA-01 | Search/results, identity detail, Property search API | AC-01, AC-06, AC-08 | Exact ID, address candidates, source conflict, empty result |
| RT-02 | Agent | Create Listing from Property | BR-ID-02, BR-LIST-01, BR-REP-01 | Listing composer, create API | AC-01, AC-03 | Relist, Unit link, invalid authority, preserved history |
| RT-03 | Brokerage | Review and activate | BR-REP-02, BR-LIFE-01, BR-AUDIT-01 | Review queue/panel, transition API | AC-02, AC-04 | Wrong organization, stale version, correction, approve |
| RT-04 | All roles | View Listing detail by permission | BR-PERM-01, BR-PERM-02 | Role projections, detail API | AC-05 | Public/member/restricted leakage matrix |
| RT-05 | Steward | Resolve duplicate Property | BR-DUP-01, BR-DUP-02 | Quality queue, merge API | AC-07 | Not duplicate, merge, replay, preserve aliases/history |
| RT-06 | Developer | Maintain Unit inventory | BR-UNIT-01, BR-INT-01 | Inventory grid/import, import API | AC-09, AC-12 | Replay batch, partial errors, effective dates |
| RT-07 | Buyer | Discover and share | BR-PERM-02, BR-CONSENT-01 | Buyer search/detail/shortlist | AC-05, AC-10 | No restricted fields, consent grant/revoke |
| RT-08 | Bank | View finance context | BR-CONSENT-01, BR-PERM-01 | Finance panel, consented lead API | AC-05, AC-10 | Purpose mismatch, expired/revoked consent |
| RT-09 | Regulator | Inspect aggregate/authorized detail | BR-AGG-01, BR-PERM-01, BR-AUDIT-01 | Quality dashboard, audit search | AC-05, AC-11 | Jurisdiction boundary, override reason, masking |
| RT-10 | System/Integration | Synchronize changes | BR-INT-01, BR-INT-02, BR-LIFE-03 | Import/feed/reconciliation APIs | AC-08, AC-12 | Retry, duplicate, gap, replay, stale index |
| RT-11 | Agent | Produce an explainable CMA draft | BR-CMA-01, BR-CMA-02 | CMA subject/candidate workflow and local draft report | Prototype exploration; durable report acceptance remains future scope | Human include/exclude, rationale, indicative range, no automatic publish |
