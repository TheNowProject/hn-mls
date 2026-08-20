---
title: Test strategy
status: current
authority: supporting
last_reviewed: 2026-08-21
---

# Test strategy

This strategy covers the static VMLS V5 demo described by [current state](../product/current-state.md), [acceptance criteria](../product/acceptance-criteria.md), and the [demo playbook](../product/vmls-demo-playbook.md). It verifies one titled-property Phú Thượng journey, five runtime accounts, post-notary Agent declaration, separate HouseNow/357 provenance, non-blocking reconciliation, sequential Tax → VPĐKĐĐ events, recipient-scoped notifications, privacy projections, and V5 browser replay.

It does not validate production authorization, official identifier ownership, legal/tax correctness, live document upload, or any HouseNow, 357, Tax, or VPĐKĐĐ integration. `SOURCE CLAIM`: the supplied process material describes the high-level sequence. `PROPOSAL`: the tested sequence and command ownership are the deterministic demo contract, not legal policy.

## Required release gates

Run from the release candidate:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

All commands must pass before preview deployment. Browser smoke testing and a black-box pass must use the exact built candidate. Store local screenshots, traces, and recording artifacts only in ignored QA/output locations; do not commit source video or scratch extraction data.

## Unit and data-contract coverage

### Fixture, identity, and provenance

- The fixture exposes exactly five runtime roles/accounts: Agent, Brokerage, Seller, Buyer, and VMLS Ops.
- Public catalogue contains four to five Listings and prioritizes Phú Thượng; exactly one Listing participates in the transaction journey.
- Initial Phú Thượng state has NPID, PLID, and `HouseNowListingSnapshot`, but no declaration, PTID, 357 transaction source, Tax event, Land case, obligation completion, notification, or work item.
- NPID, PLID, HouseNow external Listing ID, PTID, contract ID, 357 transaction ID, source case ID, notification ID, and event/idempotency IDs remain distinct.
- HouseNow snapshot retains its own version, source-updated time, VMLS-received time, and safe source claims; transaction commands never mutate it.
- Every fixture/event timestamp is deterministic and the UI presents it as `Bộ dữ liệu mẫu`, not a future live observation.

### `SUBMIT_TRANSACTION_DECLARATION`

- Agent is the only accepted actor; test Agent success and the nearest wrong actors Brokerage and VMLS Ops, plus Seller/Buyer denial.
- Exact input contains Buyer reference, whole-VND transaction value, contract number/date, notary organization/date, required notarized-transfer-contract PDF metadata, and optional deposit-contract PDF metadata.
- NPID, PLID, and Seller resolve from the configured Listing rather than editable payload fields.
- Reject unknown PLID, wrong assigned Listing, missing required PDF, non-PDF media type, invalid filename/size/value/date, missing key, extra key, and duplicate submission.
- Invalid commands leave every domain record, event/history, derived work item, and serialized replay unchanged.
- Success atomically creates the declaration, one PTID, Tax case/handoff, Audit Event, and Integration Event.
- State stores document metadata only; no File/Blob, base64, object URL, local path, or document contents appear in reducer state, projections, or serialization.

### `SYNC_TRANSACTION_FROM_357` and reconciliation

- Only VMLS Ops can synchronize and only after declaration; wrong actor, missing declaration, wrong source shape, extra key, and second invocation are no-ops.
- The 357 record retains source transaction ID, NPID, contract facts, value, masked Buyer/Seller values, notary organization, source time, and VMLS receipt time.
- Synchronization never overwrites the declaration, HouseNow snapshot, Property, Listing, or PTID.
- All configured matching fields produce `matched` in the main fixture.
- Dedicated fixtures/tests produce `mismatched`, `missing_in_vmls`, and `missing_in_357` without destroying either source.
- A mismatch/missing result does not disable or reject `ADVANCE_EXTERNAL_PROCESSING`.
- Replaying/reloading preserves the same comparison and does not append a second source/reconciliation history.

### `ADVANCE_EXTERNAL_PROCESSING`

- Only VMLS Ops can invoke the command; the payload cannot choose source, status, event index, result, or timestamps.
- One invocation accepts exactly one configured next event and appends one external event.
- The required order is:
  1. Tax received/appointment or awaiting-obligation notice;
  2. financial action required;
  3. personal income tax and registration fee completed;
  4. VPĐKĐĐ received the title-transfer administrative dossier;
  5. VPĐKĐĐ processing;
  6. transfer complete.
- Before event 3, no VPĐKĐĐ case/handoff exists. Event 3 completes two separately addressable obligation rows and creates the handoff atomically.
- Duplicate, stale, skipped, exhausted, malformed, unauthorized, and extra-key commands are atomic no-ops; status cannot regress.
- 357 synchronization may happen before, between, or after status events without changing their allowed order.
- External source events, user Audit Events, and system Integration Events remain separate append-oriented collections.

### Notifications and work items

- Event 2 creates exactly one Seller notification and one open Seller work item. The payload/text includes no amount and no assertion of who legally owes a tax/fee.
- A retry of event 2 does not duplicate either record.
- Event 3 resolves the Seller work item and preserves its notification/history.
- Event 6 completes the PTID and creates exactly one Buyer notification and collection work item.
- `MARK_NOTIFICATION_READ` succeeds only for the selected recipient and changes only read metadata. Wrong account/ID, extra keys, and repeated read are safe/no-op as appropriate.
- Reading a notification never completes a work item or advances the external sequence.
- No Buyer readiness, certificate-receipt acknowledgement, or Closing Record is created.

### Projection, navigation, and storage

- Public, Agent, Brokerage, Seller, Buyer, and Ops projections are independent explicit allowlists.
- Public serialization/DOM contains no PTID, parties, contract/document metadata, obligations, processing status, notifications, work items, source comparison, or internal event/history data.
- Brokerage can monitor Organization facts but has no declaration, approval, sync, or status command.
- Seller and Buyer projections omit the other party's reference and every field not needed for their notification/milestone job.
- Only Ops receives detailed declaration-vs-357 comparison, external event identity/idempotency fields, and complete demo histories.
- Journey state uses V5 schema/storage. Valid state round-trips; V4, malformed, tampered, unknown-action, invalid-actor, or incompatible payload fails closed to the initial fixture.
- V5 migration removes only an explicit legacy-key allowlist after successful initialization; unrelated local/session storage remains unchanged.
- Valid direct routes restore the permitted projection. Legacy or unknown hashes return to landing rather than selecting Agent.
- Reset restores Phú Thượng ready for declaration, clears only V5 progress/notifications, and returns to landing.

## Playwright end-to-end coverage

### Landing and public privacy

1. Verify standalone VMLS/Living Registry branding, exact headline, `Mở tài khoản demo`, and the data-network hero at desktop and mobile sizes.
2. Verify the hero animates lightly by default and has no required animation when reduced motion is enabled.
3. Search NPID, PLID, and a location/Listing term; verify Phú Thượng priority and four-to-five-record catalogue depth.
4. Inspect DOM, serialized UI data, URL, accessible names, and visible provenance for Public-field leakage. PTID and all private transaction data must be absent.
5. Open the account switcher by mouse and keyboard. Verify exactly five accounts and per-account unread counts.

### Full Phú Thượng journey

6. As Agent, open the Phú Thượng Listing and inspect the distinct NPID/PLID/HouseNow source ID/version/timestamps.
7. Exercise invalid declaration states, then submit a valid post-notary declaration with required PDF metadata and optional deposit metadata. Verify PTID and Tax handoff appear once.
8. Switch to Brokerage. Verify monitoring projection and absence of declaration/approval controls.
9. As Ops, run `Đồng bộ từ 357`. Verify both source records remain visible, every main-fixture field matches, and the control becomes `Đã đồng bộ`.
10. Reset and repeat the journey with `Đồng bộ từ Thuế và VPĐKĐĐ` before 357 to prove reconciliation is not a gate.
11. Advance event 1 and verify the preview/control now names event 2.
12. Advance event 2, switch to Seller, verify one unread badge/notification/open work item, open it, and verify routing/read persistence with no amount or payer claim.
13. Return to Ops and advance event 3. Verify two separate completed obligation rows, resolved Seller work item, and newly created VPĐKĐĐ handoff.
14. Advance events 4 and 5 and verify received/processing states with no skip or invented percentage.
15. Advance event 6, switch to Buyer, verify one unread completion notification/work item and the instruction to collect the updated certificate at VPĐKĐĐ.
16. Verify no Buyer acknowledgement, Closing Record, Developer route, Bank step, VPCC step, or agency business-action workspace appears.

### Replay, route, and reset

17. Reload/direct-route after declaration, 357 reconciliation, Seller notification, and completion; verify same account-scoped projection and unread state.
18. Try legacy and unknown hashes and verify landing fallback without Agent data exposure.
19. Seed incompatible/tampered V4/V5 storage and verify a clean fixture rather than partial replay.
20. Set an unrelated browser-storage sentinel, initialize/migrate V5, and reset. Verify the sentinel survives while only known legacy/V5 keys change as specified.

## Browser, accessibility, and visual verification

Verify at minimum:

- `1920 × 1080`, `1440 × 900`, `1024 × 768`, and `390 × 844`;
- keyboard order, visible focus, semantic names, account-switcher/dialog focus handling, Escape/return behavior, contrast, and reduced motion;
- no clipping of identifiers, source versions/timestamps, declaration controls, reconciliation rows, obligation rows, notification text, or event previews;
- statuses have non-color cues and the data-network hero remains understandable without animation;
- unread badges are announced with account context and marking read updates accessible state;
- no broken local font/image, unexpected console/page error, or network request to HouseNow, 357, Tax, VPĐKĐĐ, or VNeID;
- no HouseNow brand byline, evidence badge, legal endorsement, fake percentage/KPI, fake agency action, or date presented as live future data.

## Independent black-box dogfood

Run without inspecting reducer state from DevTools:

1. public search and privacy;
2. account switcher and Brokerage monitoring boundary;
3. valid/invalid Agent declaration;
4. status-first and 357-first orderings;
5. six sequential status events, Seller/Buyer notifications, read/reload behavior;
6. reset, legacy-route fallback, and corrupted-storage recovery;
7. keyboard, reduced-motion, and responsive passes.

Record severity, reproduction steps, expected/actual result, screenshot/trace, and release disposition. No Critical/High finding may remain open; Medium findings require explicit demo-level disposition.

## Privacy and integrity assertions

- Test the allowed account and nearest wrong account for every command.
- Verify denied data is absent from projection, DOM, search, URL, browser storage subsets, notifications, accessible labels, logs, and error messages—not merely hidden with CSS.
- Verify every rejected command leaves records, histories, derived state, notification counts, and serialized replay unchanged.
- Verify source timestamps are not replaced by VMLS receipt timestamps and raw/source data is not overwritten by reconciliation output.
- Verify accepted user commands, system side effects, and external events append to their own histories and preserve correlation/idempotency identity.
- Verify public and five role projections fail closed for unknown fields and routes.

## Deliberately not covered

- Real authentication, authorization, backend API, database, concurrency, upload/storage, backup, recovery, load, penetration, or production security testing; these systems do not exist in V5.
- Official NPID/PTID ownership, HouseNow or 357 data accuracy, official Tax/VPĐKĐĐ statuses, legal responsibility for obligations, or proof of certificate collection.
- Live HouseNow, 357, Tax, VPĐKĐĐ, VNeID, VPCC, Developer, Bank, email, SMS, or push-notification contract testing.
- Validation of the supplied process image as Vietnam legal procedure or any production SLA.

Production acceptance remains future work after identifier ownership, official source/message contracts, lawful data boundaries, authorization policy, integration security, retry/reconciliation rules, and responsible stakeholder approval are established.
