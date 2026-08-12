# Phase 6.1 — Property Intelligence and actor perspectives

Date: 2026-08-13  
Status: IMPLEMENTED PROPOSAL — requires product, legal and data-governance validation before pilot use.

## Actor model

The reference material defines six primary product actors. Data Steward is retained as a seventh operational role, not counted as a primary market actor.

| Actor | Primary decision surface | Default projection |
|---|---|---|
| Môi giới | Search, Property 360, Listing lifecycle, CMA | Member; restricted fields only for assigned Listings |
| Sàn môi giới | Review queue, lifecycle approval, quality and organization | Brokerage-scoped audit and restricted data |
| Chủ đầu tư | Project/Unit inventory, availability and distribution assignment | Own-inventory; no private remarks or audit |
| Ngân hàng | Finance-fit cases with purpose and consent | Consent-based; minimum necessary data |
| Cơ quan quản lý | Aggregate market signals and quality oversight | Authority-scoped; audit retained, private remarks hidden |
| Người mua | Verified search, shortlist, price changes and showing | Public; Active Listings only |
| Data Steward | Identity, source, duplicate and quality resolution | Operational projection with source and audit evidence |

## Property Intelligence delivered

- List-price events with effective time, actor, reason, source and confidence.
- Original/current price, percentage change, DOM, cumulative DOM and relist count.
- Historical Listing episodes with Closing Record, closing price, date and verification state.
- Source-event timeline for identity, area and address evidence.
- CMA candidate snapshot with low/median/high price per area and mandatory human-review label.
- Media/document summary in Property 360.
- Backend field projection, not client-only hiding.
- Two data spaces, TP. Hồ Chí Minh and Hà Nội, with market-scoped search, Listing counts, issue queues, hot sheets and actor workspaces.

## Governance boundaries

- The finance view is not a lending commitment or valuation.
- The regulator view does not infer legal status or violations from market signals.
- Buyer data never includes private remarks, audit events, internal status events or restricted source details.
- Developer and Bank views omit private remarks and full audit history.
- Demo sessions are not production authentication; consent, jurisdiction and organization scope remain simulated.

## Next validation gates

1. Confirm actual purpose/consent fields and expiry behavior with legal and banking stakeholders.
2. Confirm developer Project/Unit ownership and distribution-assignment boundaries.
3. Confirm regulator jurisdiction, aggregation thresholds and permitted drill-down.
4. Replace synthetic market candidates with an explainable comparable-selection service.
5. Add owner/seller operational participation only after representation and identity policy is approved.
