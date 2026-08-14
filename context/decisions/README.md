---
title: Decision register
status: current
authority: working
last_reviewed: 2026-08-14
---

# Decision register

| ID | Date | Evidence level | Decision | Rationale | Owner | Revisit when |
|---|---|---|---|---|---|---|
| D-001 | 2026-08-12 | PROPOSAL | Treat the supplied `TheNowProject/mls` snapshot as a read-only reference corpus, not reusable implementation. | The snapshot contains research and evidence but no application source, schema, API, or infrastructure. | Project team | An implementation repository is supplied |
| D-002 | 2026-08-12 | FACT + PROPOSAL | Keep Property and Listing as separate identities in all prototype and specification work. | Reference evidence shows multiple Listings for the same Property over time; master plan requires canonical identity and immutable history. | Product/Domain owner pending | Only if contrary authoritative domain evidence emerges |
| D-003 | 2026-08-12 | PROPOSAL | Use synthetic TP.HCM secondary-market residential records for prototype exploration. | Enables coherent prototype progress without real personal data. | Product owner pending | Segment, locality, and pilot are chosen |
| D-004 | 2026-08-12 | PROPOSAL | Treat Incoming as a submitted, restricted Listing distinct from editable Listing Input and Active market status. | Preserves the strongest reference distinction without adopting Texas transition policy wholesale. | Product/Legal pending | Vietnam lifecycle workshop completes |
| D-005 | 2026-08-12 | PROPOSAL | Classify fields as Public, Industry, or Restricted at specification level. | UI-only hiding cannot prevent leakage through search, export, analytics, or integrations. | Data Governance/Security pending | Field-level policy is approved |
| D-006 | 2026-08-13 | ACCEPTED PRODUCT DIRECTION | Separate System Admin control-plane authority from business-data access; require Break-glass Access for exceptional Restricted reads. | A blanket superuser would create avoidable privacy, insider-risk and audit gaps while conflating platform operations with MLS participation. | Project owner | Security/legal review rejects the separation or defines a narrower emergency-access model |
| D-007 | 2026-08-13 | ACCEPTED PRODUCT SCOPE | Define and order the six Primary Market Actors as Agent, Brokerage, Developer, Buyer, Owner/Seller and Bank. Keep Regulator as deferred exploration and Data Steward as an Operational Role at the end of the role switcher rather than removing either. | The project owner explicitly locked the actor scope. Five target actors and the MLS core already exist; Owner/Seller requires a scoped workspace and durable ownership, representation, consent and case workflows rather than a core rewrite. | Project owner | Seller validation changes its authority workflow, or a concrete regulator pilot with lawful authority is committed |
