# Agent listing intelligence audit

Date: 2026-08-13  
Surface: HouseNow MLS local prototype  
Actor: Môi giới  
Scope: Search → Property 360 → Listing overview → History → Data source

## Overall verdict

The prototype has the correct domain foundation: Property and Listing are visibly separate, historical Listings are preserved, current price/price-per-area/DOM are present, and provenance has its own surface. The next valuable increment is not another dashboard card. It is a deeper **Property & Listing Intelligence** experience that helps an agent evaluate, explain and act on one property.

## Evidence labels

- **FACT**: directly observed in the reference walkthrough or current prototype.
- **SOURCE CLAIM**: stated in the source material but not independently verified.
- **PROPOSAL**: recommended HouseNow behavior; requires Vietnam product/data/legal confirmation where relevant.

## Captured flow

### Step 1 — Agent dashboard — HEALTHY FOUNDATION

![Agent dashboard](./screenshots/01-dashboard.png)

Strengths:

- The entry point correctly encourages finding an existing Property before creating a Listing.
- Active/Incoming/work/viewing metrics and Hot Sheets establish an operational context.

Risks:

- Market Watch and Hot Sheets are currently summary cards without a drill-down path to the underlying listings, calculation period or source.
- The dashboard does not yet expose price-change, relist, expiry or stale-data work queues that are especially useful to agents.

### Step 2 — Search and Property 360 overview — PARTIAL

![Property overview](./screenshots/02-property-overview.png)

Strengths:

- Result rows show verification, Listing status, key facts and price.
- Property ID and Parcel reference are distinct from Listing ID.
- Current price, price per area, list/expiry dates and DOM are present.

Risks:

- The detail pane is a useful preview but too shallow to be the agent's durable working record.
- Only six Property facts are shown; no project/building context, legal/area source, amenities, media count, distribution state or listing contacts are visible.
- **Confirmed behavior gap:** Member mode says agent, office and full history are available but does not actually render agent or office.
- One hero image is not an inspectable photo gallery and there are no documents/floor plans/video assets.
- The showing button is still a prototype notification, not an availability/instruction/appointment flow.

### Step 3 — Listing history and audit — PARTIAL

![Listing history](./screenshots/03-listing-history.png)

Strengths:

- Prior Listing IDs remain separate and the timeline does not overwrite history.
- Audit shows actor, role, time and reason.

Risks:

- Historical rows show only offer type, status, period and one display price. They do not distinguish original list price, latest list price and verified closing price.
- There is no price-change timeline, status-duration timeline, listing DOM versus cumulative property CDOM, relist linkage or sold-to-list ratio.
- Closing records stored by the backend are not projected into Property 360.
- Listing status events are persisted but not exposed to the client.
- Audit lacks before/after values, source, correlation identifier and event classification in the current UI model.
- Sale/public-record events should not be mixed with internal audit; they need separate provenance and visibility.

### Step 4 — Data source — PARTIAL

![Data source](./screenshots/04-data-source.png)

Strengths:

- Source, freshness and confidence are visible.
- The prototype clearly labels synthetic/unconnected data.

Risks:

- One confidence label for the whole Property hides field-level conflicts. Area, address, legal/project/unit and price evidence may come from different sources.
- “High confidence” does not explain what was verified, by whom, when, using which rule, or when it should be reviewed again.
- There is no side-by-side conflict view or correction proposal per field.

## Recommended information architecture

Keep the current right pane as a quick preview. Add a full **Property 360** workspace for deeper work:

1. **Overview** — identity, verification scope, property facts, current Listing and primary actions.
2. **Listing** — current offer, public/member remarks, agent/office, agreement period, distribution and showing instructions.
3. **Price & history** — price/status timeline, all Listing episodes, closing records and permitted public-record events.
4. **Market** — nearby comparable candidates, range/median, price per area and DOM; agent explicitly includes/excludes records before creating a CMA.
5. **Media & documents** — photos, floor plan, virtual tour, supplements and permission-aware documents.
6. **Sources & quality** — per-field source/freshness/confidence, conflicts and report/correction actions.

## Prioritized improvements

### P0 — Agent decision card

Add the minimum information needed to evaluate the current Listing without opening another tool:

- Original list price, current price, absolute/percentage change and last price-change date.
- Price per area with explicit area type/source.
- Listing DOM and Property CDOM/relist count as separate metrics.
- Agent and Brokerage/Office in Member projection.
- Agreement/effective/expiry period and distribution state.
- Verification scope, last checked time and blocking data issues.

### P0 — Explainable Property timeline

Use separate event types on one chronological surface:

- Listing created/relisted.
- Price changed, with before/after and reason.
- Status changed, with effective time and actor.
- Closing recorded, with permitted close price/date and source/confidence.
- Public/source-record event, clearly labelled as imported evidence.
- Identity/data correction and merge decision.

Do not display buyer/seller identity, mortgage data or sensitive documents by default. Those fields require approved Vietnam source, purpose and permission policy.

### P0 — Backend detail projection

Avoid expanding the bootstrap payload indefinitely. Add a dedicated detail interface such as `GET /api/properties/:id/intelligence` returning role-projected sections. Extend the model with:

- `listing_price_events`;
- richer `closing_records` with source, verification and visibility;
- exposed `listing_status_events`;
- `property_source_events` or public-record events;
- before/after/correlation fields for audit events.

### P1 — Media, documents and showing

- Photo gallery with labels/order/source and permission.
- Floor plan, virtual-tour link and document groups.
- Member-only showing instructions, availability, appointment request and feedback history.
- Never expose lockbox/access details in Public views, snippets, logs or notifications.

### P1 — Market context and CMA entry

- “Find comparables” from Property 360.
- Candidate filters for distance, recency, type, area, rooms and status.
- Active versus Closed groups, low/median/average/high, price per area and DOM.
- Human include/exclude with rationale.
- Immutable data snapshot/version when a CMA is published.

This is a **PROPOSAL** grounded in the reference workflow. It must not become an automatic valuation claim.

### P1 — Search and agent workflow

- Filters for price change, new/relisted, days on market, expiry window, verification and issue state.
- Saved searches, shortlist/cart and public client-share projection.
- Drill-down from Hot Sheets to the exact changed Listings.
- Sort by newest, price change, DOM, price per area and data confidence.

### P2 — Maps and external records

- Property/parcel/project map and nearby comparable map.
- Planning/flood/legal/tax-style records only after local authoritative sources and field semantics are confirmed.
- Every imported claim needs source key, retrieved/effective time and editability.

## Accessibility risks visible from screenshots

- Secondary metadata is visually very small; validate at 200% zoom and on narrower layouts.
- State is not color-only because text labels are present, which is good.
- Keyboard traversal, focus order, screen-reader announcements, modal focus trapping and contrast cannot be confirmed from screenshots alone and require hands-on testing.

## Recommended next increment

Name it **Phase 6.1 — Agent Property Intelligence** and keep it to one complete vertical slice:

1. Enrich one Property with three Listing episodes, two price changes and one verified closing record.
2. Build the role-projected detail endpoint.
3. Build the full Property 360 page with Overview, Listing, Price & history and Sources.
4. Connect “Find comparables” to a reviewed candidate list; publishing CMA remains out of scope for this increment.
5. Test Public versus Agent versus Broker leakage, historical persistence and refresh behavior.

## Reference basis

- **FACT:** the reference listing detail exposes Listing, Tax, Photos, History, Parcel Map, Flood Map, Foreclosure and Supplements.
- **FACT:** the reference flow preserves multiple MLS records for the same Property and displays public-record sale history.
- **FACT:** the CMA flow reports Active/Sold comparables, low/median/average/high, price per area and DOM.
- **PROPOSAL:** HouseNow should adapt these capabilities to Vietnam sources and permissions rather than copy Texas policy or fields.

## Evidence limits

- This audit used the local prototype and repository evidence, not production user analytics or interviews.
- External source availability, legal basis and data quality for Vietnam were not verified.
- Screenshots support visible UX findings only; they do not establish full accessibility compliance or backend security.
