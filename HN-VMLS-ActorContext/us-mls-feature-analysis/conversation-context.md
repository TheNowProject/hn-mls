# Conversation handoff: U.S. MLS feature analysis

Status: `RESEARCH CONTEXT`

Conversation dates: 2026-08-10 to 2026-08-13

Imported repository: `/Users/phatnt2702/Documents/ChatGPT/HN-VMLS`

## Original user request

The user asked in Vietnamese:

> Phân tích và làm feature analysis report cho tôi về hệ thống MLS của Mỹ.

The working interpretation was explicitly stated as `Multiple Listing Service` in U.S. real estate, not Major League Soccer.

The user subsequently requested that all task content and file context from the conversation be moved into the HN-VMLS repository.

## Work performed

1. Researched current primary or first-party sources from NAR, RESO, CRMLS, ICE Mortgage Technology, and MLS Grid.
2. Distinguished the U.S. MLS market infrastructure from the front-end MLS software used by agents and brokers.
3. Produced an 11-page Vietnamese feature analysis report.
4. Rendered the DOCX into page PNGs and a PDF twice.
5. Visually inspected every page of the final render.
6. Ran accessibility, DOCX archive, and table geometry checks.
7. Moved the final report, final PDF, report builder, both QA render sets, and this handoff context into HN-VMLS.

## Evidence model for repository use

The original report used inline numeric citations but did not assign HouseNow evidence labels. For repository use, interpret its content as follows:

- `SOURCE CLAIM`: Statements attributed to NAR, RESO, CRMLS, ICE, or MLS Grid, including counts, policy text, platform feature availability, API characteristics, and data-standard scope.
- `INFERENCE`: The interpretation that MLS is market infrastructure rather than merely a property-search website; capability maturity scores; strengths, weaknesses, gaps, and architectural synthesis.
- `PROPOSAL`: Priority opportunities, MVP-to-V2 roadmap, KPI suggestions, and reference architecture.
- `OPEN QUESTION`: Whether any U.S. behavior is relevant, lawful, desirable, or operationally feasible for Vietnam and HouseNow MLS.

No item in this research is a `FACT` about the current HouseNow implementation unless separately supported by current repository code or specifications.

## Core findings

### Structure of the U.S. MLS ecosystem

- `SOURCE CLAIM`: NAR describes roughly 500 MLS organizations in the United States.
- `SOURCE CLAIM`: RESO reported 489 functioning U.S. MLS systems and stated that at least 90% had RESO-certified Web API services at the time accessed.
- `INFERENCE`: There is no single nationwide MLS product or database. The market is a federation of local or regional operators, rule sets, memberships, software vendors, data licenses, and sharing arrangements.
- `INFERENCE`: The durable value lies in governed participation, shared structured data, accountability, distribution control, and historical data—not only search UI.

### Most mature capability groups

The report assessed the following as broadly mature across major platforms:

- Listing input and maintenance.
- Structured and map-based search.
- Saved searches, auto-email, hotsheets, and alerts.
- Client portals and collaboration.
- CMA and market statistics.
- Showing, open-house, and lockbox integration.
- IDX, VOW, syndication, and broker back-office distribution.
- Roster, identity, entitlement, compliance, and audit operations.
- RESO-aligned data transport and licensing workflows.

### Structural weaknesses

- `INFERENCE`: Regional fragmentation creates repeated fees, identities, licenses, schemas, rules, and integrations for multi-market brokerages.
- `INFERENCE`: RESO standardization improves exchange but does not remove all local fields, lookup semantics, status differences, or internal legacy schemas.
- `INFERENCE`: Agent experience is frequently split across MLS core, CMA, showing, lockbox, tax, forms, CRM, and transaction products.
- `INFERENCE`: Replicated feeds, caching, vendor licensing, and local compliance introduce latency and operational overhead.
- `INFERENCE`: AI capabilities were uneven and supplemental compared with established listing, search, and compliance workflows.

## Policy changes emphasized in the report

- `SOURCE CLAIM`: NAR Clear Cooperation policy requires covered listings to be submitted to the MLS within one business day of public marketing.
- `SOURCE CLAIM`: Beginning 2024-08-17, offers of compensation were prohibited on covered MLSs and could instead be negotiated off-MLS.
- `SOURCE CLAIM`: NAR policy requires a written buyer agreement before touring a home when the policy applies and is not inconsistent with state or federal law.
- `SOURCE CLAIM`: The 2025 Multiple Listing Options for Sellers policy introduced or clarified `Office Exclusive` and `Delayed Marketing` paths. A delayed-marketing listing can remain visible to MLS participants while public IDX and syndication are delayed for a locally determined period.
- `INFERENCE`: Listing status and distribution-channel eligibility must be modeled separately; one `Active/Inactive` flag is insufficient for such rules.

These are U.S./NAR policy observations, not HouseNow or Vietnam policy.

## Data and integration context

- `SOURCE CLAIM`: RESO Data Dictionary 2.0 documented 41 resources and 1,745 fields at the time accessed.
- `SOURCE CLAIM`: Relevant resources included Property, Member, Office, Media, OpenHouse, Contacts, SavedSearch, Prospecting, Showing, LockOrBox, HistoryTransactional, and InternetTracking.
- `INFERENCE`: A production MLS benefits from separate policy/identity, canonical data, workflow, integration, distribution, and analytics planes.
- `INFERENCE`: Certification at an external Web API boundary does not prove that the provider's internal data model is fully native to the same standard.
- `SOURCE CLAIM`: MLS Grid documented a replication-oriented Web API, OAuth 2 tokens, licensing controls, and restrictions around media use.

## Recommendations contained in the report

All recommendations below are `PROPOSAL` for comparison and must not override current HN-VMLS plans.

### P0 opportunities

- Policy-aware Listing lifecycle with independent channel rights.
- Quality-by-design add/edit with provenance, inline validation, and duplicate detection.
- Identity, entitlement, and data licensing across Member, Office, Team, Organization, and vendor access.
- Reliable distribution with delta, tombstone, retry, reconciliation, and freshness measurement.

### P1 opportunities

- Explainable natural-language search that exposes the generated filters.
- Consumer collaboration workspace for shortlist, comments, notifications, consent, and tour planning.
- Compliance workbench with versioned rules, evidence, case queue, cure, fine, appeal, and audit.
- Cross-market normalization and identity resolution where rights permit data access.

### P2 opportunities

- Explainable and reproducible CMA with source provenance and human-reviewed comparables.
- Vendor marketplace with scoped authorization, sandboxing, certification, monitoring, and scorecards.

## Relationship to HouseNow domain language

The imported report uses common U.S. industry wording such as agent, broker, property, listing, member, office, contact, and transaction. When applying its content to HN-VMLS:

- Use `Property` only for the durable asset identity defined in [`CONTEXT.md`](../../CONTEXT.md).
- Use `Listing` only for one market offering with its own identity, representation basis, effective period, visibility, and lifecycle.
- Keep `Closing Record` separate from both Property and Listing.
- Translate U.S. Member/Office concepts through the current `Party`, `Organization`, `Membership`, `Role`, and `Entitlement` model rather than copying them literally.
- Keep Listing Input, Incoming Listing, Active Listing, and Listing Status Event distinct.
- Keep Public, Industry, and Restricted Fields protected across UI, API, search, export, analytics, logs, and downstream feeds.
- Preserve human review for comparable selection unless an approved requirement changes it.

## Source list used

1. [NAR — Consumer Guide: Multiple Listing Services](https://www.nar.realtor/node/200359)
2. [RESO — Certification and MLS Map](https://www.reso.org/certification/)
3. [RESO — Data Dictionary 2.0](https://dd.reso.org/DD2.0/)
4. [RESO — Web API](https://www.reso.org/reso-web-api/)
5. [CRMLS — 2026 MLS Systems Comparison Chart](https://kb.crmls.org/wp-content/uploads/2025/01/2026_MLS_Systems_Comparison_Chart.pdf)
6. [CRMLS — 2026 Product Solutions Matrix](https://go.crmls.org/wp-content/uploads/2026/05/2026_Product_Solutions_Matrix.pdf)
7. [ICE Mortgage Technology — Paragon Connect MLS Platform](https://mortgagetech.ice.com/products/paragon-connect-mls-platform)
8. [NAR — MLS Clear Cooperation Policy](https://www.nar.realtor/about-nar/policies/mls-clear-cooperation-policy)
9. [NAR — Multiple Listing Options for Sellers](https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers)
10. [NAR — No Compensation Offers in MLS; Written Buyer Agreements](https://www.nar.realtor/handbook-on-multiple-listing-policy/no-compensation-offers-in-mls-section-4-written-buyer-agreements-required-policy-statement-8-13)
11. [NAR — Internet Data Exchange policy](https://www.nar.realtor/handbook-on-multiple-listing-policy/advertising-print-and-electronic-section-1-internet-data-exchange-idx-policy-policy-statement-7-58)
12. [NAR — Virtual Office Websites policy](https://www.nar.realtor/handbook-on-multiple-listing-policy/virtual-office-websites-policy-governing-use-of-mls-data-in-connection-with-internet-brokerage)
13. [MLS Grid — Documentation overview](https://docs.mlsgrid.com/)
14. [CRMLS — Introduction to IDX and Listing Distribution Options](https://go.crmls.org/wp-content/uploads/2026/03/2026_An_Introduction_to_IDX_and_Your_Listing_Distribution_Options.pdf)

Sources were accessed and reconciled on 2026-08-10. Time-sensitive policy and platform statements should be reverified before a future product or legal decision.

## Artifact history and QA

### Final tracked artifacts

- `HN-VMLS-ActorContext/us-mls-feature-analysis/Phan_tich_feature_MLS_My_2026.docx`
- `HN-VMLS-ActorContext/us-mls-feature-analysis/Phan_tich_feature_MLS_My_2026.pdf`
- `HN-VMLS-ActorContext/us-mls-feature-analysis/build_us_mls_feature_report.py`
- This context file and the folder README.

### Ignored local QA artifacts

- `tmp/conversation-imports/us-mls-feature-analysis/qa-v1/`: superseded first render, containing an initial PDF and 11 page PNGs.
- `tmp/conversation-imports/us-mls-feature-analysis/qa-v2/`: final 11 page PNGs inspected at original resolution.

### Checks completed before the original delivery

- DOCX rendered successfully to 11 pages.
- Every final page PNG was visually inspected.
- Accessibility audit: zero high, medium, or low findings.
- Table geometry audit: all tables had matching `tblW`, `tblInd`, `tblGrid`, and `tcW` values.
- DOCX ZIP integrity check: no archive errors.

## Handoff limitations

- This file captures all task-relevant user-visible context, artifacts, assumptions, sources, and outcomes from the conversation. It is not a raw export of hidden model reasoning or platform metadata.
- The original standalone project directory is now empty of files after the move; empty parent directories were left in place.
- No current HouseNow source code, specification, `CONTEXT.md`, `MASTER_PLAN.md`, or immutable `reference/mls/` file was modified as part of the import.
