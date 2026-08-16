---
title: Test strategy
status: current
authority: supporting
last_reviewed: 2026-08-16
---

# Test strategy

This strategy covers the static VMLS operational workspace described by the [operational workspace contract](../product/vmls-operational-workspace.md). It verifies a useful data product with coherent records, guarded commands, role projections, and derived queues. It does not validate production policy, security controls, external contracts, or legal correctness; those boundaries are maintained in [security](./security.md).

## Automated coverage

- Fixture tests enforce six market roles and three system/external workspaces, two independent dossiers, distinct `NPID`/`PLID`/`PTID` identities, masked parties, sourced area concepts, and separate representation, finance-sharing, and distribution records.
- Connection/channel tests enforce that VNeID, 357, and HouseNow have dated local captures and explicit data contracts. The 357 capture remains a catalog record rather than dossier evidence; HouseNow remains a Tin bán distribution channel with the supplied icon and status `Chưa phát hành`.
- Reducer tests cover actor, state, and payload guards; exact NPID submission; independent record lifecycles; automatic PLID/PTID creation; the recoverable VPCC supplement; append-oriented histories; both automatically selected transfer routes; derived work queues; invalid-action atomicity; and versioned persistence/replay.
- Projection tests cover role-specific record and field visibility, including complete dossier omission before Ngân hàng consent and the minimized projection after consent.
- Playwright tests cover the queue, computed metric filters, global search, collection/list and dossier-detail surfaces, structured forms and validation, privacy behavior, both transfer outcomes, source/channel placement, hash-route restoration, local persistence, and `Đặt lại dữ liệu`.
- The Môi giới queue check keeps the presentation-only `Khởi tạo` entry point disabled and verifies that it cannot change the two pre-created sample dossiers, the route, or persisted state.
- Lint, prototype-contract type checking, unit tests, production build, and browser tests are required release gates.

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Browser and interface verification

Verify at minimum:

- `1440 × 900` and `1920 × 1080` for the primary presentation;
- `1024 × 768` for compact desktop/tablet;
- `390 × 844` for mobile;
- keyboard navigation, visible focus, semantic labels, sufficient contrast, and reduced motion;
- no missing fonts or images, unexpected console errors, or unexpected network requests;
- readable Vietnamese labels, values, identifiers, validation errors, tables, and forms at the intended recording scale;
- the landing provides working search, linked identifiers, state-derived work data, read-only connection previews, and a direct workspace entry; it contains no presentation rail, role-handoff prompt, progress percentage, evidence badge, unsupported KPI, or repeated environment disclaimer.

## End-to-end operational path

1. Open the root URL and verify the landing searches the public allowlist, retains query/result state in the hash route, distinguishes NPID/PLID/PTID, and exposes only role-safe workspace entry. Verify malformed public routes recover through the no-result state.
2. Select a role and enter its queue. Verify role selection and last destination persist; an unconsented Bank opens its empty queue, while a consented Bank opens only the opaque-token projection. Then open each permitted dossier and verify the linked-object strip keeps NPID, PLID, and PTID separate.
3. As Môi giới, enter the exact NPID, representation scope and effective period, then choose `Gửi thông tin đến Người bán`. Verify a missing or wrong identifier, an invalid date range, and a wrong role cannot mutate state; no candidate or source-selection control is rendered.
4. As Người bán, confirm representation without editing a system confirmation identifier and verify that PLID is created automatically with status `Đã khởi tạo`. Verify the representation view consistently contains both Người bán and Người đại diện (Môi giới). On Tin bán detail, verify HouseNow appears only in `Kênh phân phối`, uses the supplied icon, and remains `Chưa phát hành`.
5. Record the buyer, then verify the buyer sees their name, identifier, Property identifier, contract information, agreed price and expected signing date before confirming the existing readiness checklist. Test finance-sharing both ways. The Ngân hàng queue must omit an unconsented dossier entirely and expose only the permitted projection for a consented dossier. Inspect the Sàn môi giới coordination projection separately.
6. As VPCC, submit the exact required document set. For the landed-property dossier, request one specific supplement, provide it as Người bán, and verify the same dossier becomes ready for signing without losing prior events.
7. Record each valid VPCC contract identifier and signing time without a document-digest input. Verify PTID, tax/integration events, and the correct transfer route are created atomically without a manual VMLS action or user-selected route.
8. Complete the Chủ đầu tư intake → transfer confirmation → buyer receipt path for the HĐMB dossier. Independently complete the VPĐKĐĐ result path for the landed-property dossier without a new-owner-reference input. Verify both queues, details, statuses, and histories after completion.
9. On the landing and as Vận hành VMLS, inspect the three read-only connection records. Verify VNeID is an unconnected seller-confirmation point, 357 is a public reference with no dossier-level data, and HouseNow is an unpublished Tin bán channel; open each local screenshot without operating the external website.
10. Reload a dossier hash route to verify command replay and visible state restoration. Use `Đặt lại dữ liệu`, confirm both dossiers return to configured initial state, then reload once more to verify the reset persisted.

Store independent browser QA reports, screenshots, traces, and recordings under `output/qa/vmls-data-product-redesign/`. Generated evidence remains local and uncommitted.

## Privacy and data-integrity assertions

- Test both permitted and nearest wrong-role access for every mutable command.
- Verify unauthorized records and fields are absent from the rendered projection, global search, metrics, filters, list rows, detail tabs, and audit views—not merely visually hidden.
- Verify invalid actions leave object state, work items, audit events, integration events, and serialized replay unchanged.
- Verify each accepted command appends its payload to the command log and appends an audit event with actor, target, time, and correlation data without overwriting prior submissions or supplement events.
- Verify the two dossiers never share identifiers, command history, transfer result, or persisted replay state.
- Verify refresh, direct hash navigation, role switching, search, filters, lists, and details all derive from the same projected record state.

## Deliberately not covered

- Real authentication, authorization, API, database, concurrency, backup, recovery, load, or security testing; those systems do not exist in this prototype.
- VNeID, VPCC, tax, VPĐKĐĐ, Chủ đầu tư, 357, HouseNow, or other external contract tests; configured events and local assets are not live integrations.
- Validation of legal, tax, cadastral, notarization, identity, or developer-transfer policy.

Production-grade acceptance criteria remain future work after real-data boundaries and external contracts are approved.
