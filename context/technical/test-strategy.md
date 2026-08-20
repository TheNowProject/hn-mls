---
title: Test strategy
status: current
authority: supporting
last_reviewed: 2026-08-20
---

# Test strategy

This strategy covers the static VMLS V4 workspace described by [current state](../product/current-state.md), the [v2 process](../product/vmls-process-v2.md), and the [demo playbook](../product/vmls-demo-playbook.md). It verifies record boundaries, seller publication control, Buyer command ownership, source-event orchestration, privacy projections, local VNeID session behavior, and honest external-system affordances.

It does not validate production authorization, official NPID ownership, legal/tax correctness, live VNeID authentication, or any 357, VPCC, Tax, VPĐKĐĐ, Developer, or HouseNow integration. `PROPOSAL`: the configured 357 record issues the NPID in this demo; the test proves the fixture contract, not an official interface.

## Required release gates

Run from a clean release candidate:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

All commands must pass before preview deployment. The exact preview candidate then receives a browser smoke test and independent black-box dogfood pass. Production is promoted only from that candidate; a failed production smoke test requires rollback to the previous ready deployment.

Store screenshots, browser traces, QA report, and generated video evidence under `output/qa/vmls-interactive-demo/`. MP4, raw WebM, VTT, screenshots, and QA evidence remain local and uncommitted.

## Unit and data-contract coverage

### Record identity and 357 provenance

- Two independent transaction dossiers never share NPID, PLID, PTID, Representation, Buyer declaration, source case, event history, or replay state.
- NPID, PLID, PTID, source-record ID, source-case ID, contract ID, and event/correlation ID remain distinct typed values.
- `PropertySourceRecord357` supplies the same NPID used as the VMLS Property identifier; no second VMLS-generated NPID exists.
- Each source record has source record ID, version, source-updated-at, VMLS-received-at, and safe claims for project/developer, location, Property type, building/unit, named area concepts, and publication state.
- The 357 projection and serialization contain no owner identity, CCCD, or private transaction history.
- S2-12A keeps `69,2 m² thông thủy` and `82,3 m² tim tường` as separate sourced concepts.

### PublicationProfile and represented market

- Marketplace state replays from its current versioned schema; incompatible, old, or tampered payload resets safely.
- One `PublicationProfile` belongs to one PLID and keeps independent `draftVersion` and `appliedVersion`.
- `SAVE_PUBLICATION_DRAFT` accepts only permitted optional field-group IDs and the owning Seller; locked fields cannot be disabled or injected through the payload.
- Saving a draft does not change the applied Public projection or any previously serialized channel payload.
- `APPLY_PUBLICATION_PROFILE` applies the current draft and increments only the appropriate version/history.
- Public lookup and HouseNow derive from the applied Public projection. Disabled groups are structurally absent from the returned object and rendered output.
- The Industry projection is independently allowlisted and is not expanded or reduced by a Public setting.
- `CoBrokerRegistration` remains Agent-only, does not change the original Representation/responsible Agent, and is still required for the configured distribution action.
- HouseNow delivery rejects unknown fields and records only the applied projection/version and local acknowledgement state.

### Seller correction and channel reconciliation

- `REQUEST_LISTING_CORRECTION` is Seller-only, scoped to the Seller's own PLID, and accepts the configured `askingPrice` old/new values without mutating Listing/source history.
- `APPLY_LISTING_CORRECTION` is Brokerage-only and rejects wrong role, request, PLID, state, value type, or extra payload keys.
- Acceptance appends a new Listing revision and user Audit Event while preserving prior values and request history.
- If the prior version was distributed, the local channel becomes `Cần cập nhật` and a reconciliation event is appended exactly once.
- Reconciliation never changes a past DistributionEvent and never records remote publication or remote update success.

### Buyer ownership and privacy

- `DECLARE_BUYER` is Brokerage-only. Agent, Seller, Buyer, VMLS, VPCC, VPĐKĐĐ, Tax, Developer, and Bank attempts are rejected atomically.
- Payload uses exact keys for Buyer reference, whole-VND agreed price, and expected signing date. Masked name is resolved from the configured Party, not accepted as input.
- Responsible Agent and Buyer receive the required projection; Seller receives only a milestone; external agencies receive no Buyer identity.
- Buyer detail includes contract data, readiness checklist, and the safe 357 snapshot with record/version/timestamps.
- Bank receives no dossier before consent and only the configured minimized finance projection after consent.
- `HANDOFF_NOTARY_DOSSIER` is Brokerage-only and requires readiness plus the exact configured document set.

### External processing and Tax

- VPCC, VPĐKĐĐ, and Tax fixtures expose at least 5–6 synthetic/masked rows with source case, NPID, optional PTID, BĐS, raw/normalized status, processing organization, source update time, and VMLS receipt time.
- Standard status is one of `Chờ tiếp nhận`, `Đang xử lý`, `Yêu cầu bổ sung`, or `Đã xử lý`; raw source status is preserved separately.
- All three external roles always have `allowedActions=[]`. Legacy direct accept/sign/approve/supplement/tax commands are rejected or absent.
- `RECEIVE_EXTERNAL_EVENT` is VMLS-only and accepts exactly `{ caseId, source }`.
- One invocation applies only the next configured event for that dossier/source. Wrong case/source, missing handoff, exhausted fixture, duplicate event ID, and extra keys leave state unchanged.
- Duplicate events are idempotent; an older source event cannot regress normalized state; events append in accepted source order.
- External status events are stored separately from user Audit Events.
- `SUBMIT_SUPPLEMENT_HANDOFF` is Seller-only, requires the active request/type/PDF payload, and records an outbound handoff without pretending VPCC acted in VMLS.
- The final configured VPCC event creates PTID and route once, then prepares Tax and applicable VPĐKĐĐ handoffs atomically.
- Tax status can progress before, during, or after either transfer branch and never gates the Developer or VPĐKĐĐ outcome in the demo.
- The Developer route retains its configured interactive intake, confirmation, and Buyer receipt commands.

### VNeID local session and replay

- Journey state uses schema/storage `v4`; old or malformed journey payloads reset safely instead of partially replaying.
- The VNeID session uses an independent versioned key and contains only the configured masked identity, accepted sharing scope, and local session metadata.
- `CONFIRM_VNEID_LOGIN` and `LOGOUT_VNEID` do not change selected role, entitlement, queue, dossier, marketplace state, or route.
- Reload restores a valid session. Business-data reset preserves it; logout clears only it.
- Invalid/tampered session data fails closed.

## Playwright end-to-end coverage

### Landing, VNeID, and source lookup

1. Verify the landing is a functional data workbench, not a portfolio/product-story hero. It has standalone VMLS branding, VNeID entry, NPID/keyword, area, Developer, and Project filters.
2. Complete the local two-step VNeID handoff. Verify masked identity/scopes, reload persistence, role independence, business reset independence, separate logout, and zero requests to a VNeID origin.
3. Combine root filters with AND semantics, search exact NPID, open the correct record, and inspect 357 source record/version/timestamps and safe field claims.
4. Verify no evidence label, `mô phỏng đề xuất`, implementation disclaimer, unsupported endorsement, or HouseNow brand byline appears in the UI.

### Seller → Agent → HouseNow → correction

5. As Seller, open `Tin bán của tôi`; verify only own PLID appears. Hide detailed location and images, save draft, confirm Public output is unchanged, then apply and confirm both groups are absent.
6. As Agent, open the same represented Listing, verify the Industry projection remains complete within its allowlist, register to cooperate, and send to HouseNow.
7. Intercept/inspect the local payload and assert exact applied Public keys/version; no hidden group or Restricted data may exist in the object, DOM, log, search snippet, or event.
8. As Seller, request the configured price correction. As Brokerage, inspect the queue and apply it. Verify new price/version/revision, `Cần cập nhật`, and reconciliation event; verify there is no remote-update claim.

### Buyer, notarization, and both outcomes

9. Complete Representation for a transaction dossier and verify PLID is created in `Đã khởi tạo` with Seller and representative facts consistently present.
10. As Brokerage, declare Buyer. Verify Agent has no declaration action; Buyer sees masked identity, contract details, checklist, and 357 panel; Seller/external roles do not see Buyer identity.
11. Confirm readiness, test Bank consent off/on, then hand off the notarization dossier as Brokerage.
12. Open VPCC role. Search/filter/open the journey row and verify the entire workspace is read-only.
13. As VMLS, receive VPCC events in order. For Phú Thượng, reach `Yêu cầu bổ sung`; as Seller, submit the PDF handoff; continue receiving events.
14. Verify duplicate/retry interaction does not append a second event and status cannot regress.
15. Receive each final VPCC event. Verify distinct PTIDs, automatic routes, Tax handoffs, and the land handoff only where applicable.
16. Progress Tax independently, complete S2-12A through Developer/HĐMB, and complete Phú Thượng through received VPĐKĐĐ events. Verify Tax does not gate either outcome.

### Cross-role processing and external queues

17. In Agent, Brokerage, Seller, and Buyer queues/details, verify processing milestone and organization derive from the same source history and use no invented percentage.
18. Verify each role's timeline omits fields outside its projection. In particular, Seller and external agencies must not render Buyer identity.
19. Open VPCC, VPĐKĐĐ, and Tax queues at initial and handed-off states. Verify 5–6+ rows, all normalized states, search/filter/detail, source and received timestamps, and no action button/keyboard target.
20. Verify the application catalog distinguishes navigable implementations, read-only records, event-only flows, and unavailable modules without false hover/chevron/action.
21. Reload direct hash routes and verify valid `v4`, marketplace, and VNeID replay. Reset business data and verify only the VNeID session remains; logout then removes it.

## Browser, accessibility, and visual verification

Verify at minimum:

- `1920 × 1080` and `1440 × 900` for presentation;
- `1024 × 768` for compact desktop/tablet;
- `390 × 844` for mobile;
- keyboard order, visible focus, dialog focus trap/return, Escape behavior, semantic names, contrast, and reduced motion;
- usable tables, cards, filters, forms, timestamps, identifiers, correction values, source timelines, and action states without clipped essential information;
- seller toggles express selected state programmatically and Public preview updates accessibly;
- read-only external tables expose no misleading interactive row/control beyond filter, search, and detail;
- all fonts/images load locally, no broken asset, no unexpected console/page error, and no unexpected network request;
- the VNeID flow, 357 source panel, and HouseNow handoff make no external request;
- all Vietnamese labels follow the domain language: `Mã định danh Bất động sản/Người mua/Người bán`, `Mã hợp đồng`, and no removed reference/digest fields;
- no `Powered by HouseNow`, presentation rail, role-handoff storytelling prompt, progress percentage, fake KPI, evidence badge, `mô phỏng đề xuất`, or repeated disclaimer.

## Independent black-box dogfood

Run against the exact release candidate without reading reducer state from DevTools:

1. common path from local VNeID session through source lookup, Seller Public control, Agent cooperation/distribution, correction, Brokerage Buyer declaration/handoff, VPCC events, PTID, and one completed route;
2. Phú Thượng supplement exception and VPĐKĐĐ outcome;
3. S2-12A Developer/HĐMB outcome;
4. Tax progression before and after route completion;
5. Agent/Brokerage/Seller/Buyer progress projections and Bank consent boundary;
6. all three agency queues/details in read-only mode;
7. reload/reset/logout and corrupted-storage fallback;
8. keyboard and representative responsive passes.

Classify findings with severity, reproduction steps, expected/actual result, screenshot/trace, and release disposition. No Critical/High finding may remain open at release; Medium findings require explicit demo-level disposition.

## Production and video verification

After preview and production smoke tests pass:

- record the 20–22 minute silent walkthrough at `1920 × 1080` using [the playbook](../product/vmls-demo-playbook.md);
- burn readable Vietnamese callouts into the visible video and export matching WebVTT;
- include the local VNeID handoff, record-level 357 provenance, applied HouseNow payload/reconciliation, both route outcomes, cross-role progress, and the three read-only agency queues;
- never interact with a real VNeID, 357, or HouseNow surface;
- validate MP4/WebM metadata, resolution, duration, silence, full decode, representative frame samples, subtitle order/duration/coverage, and checksums;
- inspect frames around every route/status transition to ensure callouts do not cover identifiers, source timestamps, or primary controls.

## Privacy and integrity assertions

- Test the allowed actor and nearest wrong actor for every mutable command.
- Verify unauthorized records/fields are absent from projection, DOM, global search, metrics, filters, lists, details, histories, serialized storage, and channel payload—not merely visually hidden.
- Verify every invalid action leaves domain objects, histories, events, derived work, and serialized replay unchanged.
- Verify accepted user commands append Audit Events while inbound source changes append ExternalStatusEvents; neither overwrites or impersonates the other.
- Verify Public, Industry, Buyer, Seller, Bank, and external-agency projections use independent fail-closed allowlists.
- Verify source timestamps are not replaced by VMLS receipt times and raw source status is not overwritten by normalized status.
- Verify refresh, role switching, hash navigation, filters, queues, and detail all derive from the same projected state.

## Deliberately not covered

- Real authentication, authorization, API, database, concurrency, backup, recovery, load, penetration, or production security testing; those systems do not exist in this prototype.
- Official 357 NPID policy or data accuracy.
- Live VNeID, 357, VPCC, Tax, VPĐKĐĐ, Developer, HouseNow, or other external contract testing.
- Validation of legal, tax, cadastral, notarization, identity, representation, Developer-transfer, or completion policy.

Production-grade acceptance remains future work after source ownership, real-data boundaries, integration contracts, and authorized policy are approved.
