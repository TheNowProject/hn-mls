---
title: Test strategy
status: current
authority: supporting
last_reviewed: 2026-08-17
---

# Test strategy

This strategy covers the static VMLS data workspace described by the [operational workspace contract](../product/vmls-operational-workspace.md) and the [represented inventory and distribution proposal](../product/vmls-representation-distribution-demo.md). It verifies coherent records, structured lookup, honest module availability, guarded commands, role projections, derived queues, and the local boundary of outbound distribution. It does not validate production policy, security controls, external contracts, publication on HouseNow, or legal correctness; those boundaries are maintained in [security](./security.md).

## Automated coverage

- Fixture tests enforce six market roles and three system/external workspaces, two independent dossiers, distinct `NPID`/`PLID`/`PTID` identities, masked parties, sourced area concepts, and separate representation, finance-sharing, and dossier distribution records.
- Connection/channel tests enforce that VNeID, 357, and HouseNow have dated local captures and explicit data contracts. The 357 capture remains a catalog record rather than dossier evidence; HouseNow remains a Tin bán distribution channel with the supplied icon and status `Chưa phát hành`.
- Represented-market tests enforce a separate five-record synthetic set, distinct Property/Tin bán/Representation identities, effective eligibility, NPID/area/developer/project filtering with AND semantics, and a fail-closed Industry projection.
- Represented-market reducer tests cover the Môi giới-only `CoBrokerRegistration`, exact command shapes, duplicate rejection, unchanged original Representation, HouseNow channel consent, public payload allowlist, event idempotency, `Đã gửi · Chờ phản hồi kênh`, and versioned command replay with tamper fallback.
- Reducer tests cover actor, state, and payload guards; exact NPID submission; independent record lifecycles; automatic PLID/PTID creation; the recoverable VPCC supplement; append-oriented histories; both automatically selected transfer routes; derived work queues; invalid-action atomicity; and versioned persistence/replay.
- Projection tests cover role-specific record and field visibility, including complete dossier omission before Ngân hàng consent and the minimized projection after consent.
- Playwright tests cover structured root lookup, the role application hub, represented inventory/detail/distribution, the queue, computed metric filters, global search, collection/list and dossier-detail surfaces, structured forms and validation, privacy behavior, both transfer outcomes, source/channel placement, hash-route restoration, local persistence, and `Đặt lại dữ liệu`.
- Application-hub checks enforce interaction semantics rather than appearance alone: implemented modules navigate, configured media records open a read-only drawer, and event-only or unconfigured modules have no button, link, keyboard target, or misleading hover treatment.
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
- the landing provides working NPID/keyword, area, developer, and project filters; combined filters use AND semantics; result rows preserve linked identities and open the correct Tin bán or dossier;
- the application hub makes every configured capability and external flow legible while only implemented and explicitly read-only records are actionable;
- represented-inventory filters, status tabs, tables, detail facts, privacy copy, preflight, field allowlist, excluded-field list, and outbound event remain usable without horizontal loss;
- the landing and workspace use the standalone VMLS mark and contain no HouseNow byline, presentation rail, role-handoff prompt, progress percentage, evidence badge, unsupported KPI, or repeated environment disclaimer.

## End-to-end operational path

1. Open the root URL and verify the landing contains seven configured records, distinguishes NPID/PLID/PTID, and filters by exact NPID or keyword, area, developer, and project. Combine at least two structured filters and verify AND semantics. Verify malformed public routes recover through the no-result state.
2. Open `Ứng dụng` as Môi giới. Verify relevant operational modules navigate, VNeID/357/HouseNow open only local read-only records, and event-only or unconfigured modules do not expose an action. Repeat with a role whose capability projection differs.
3. Open `Nguồn hàng được đại diện`; verify five eligible Tin bán and their responsible Môi giới/Sàn, NPID, PLID, Representation state, and collaboration state. Search each supported dimension and combine filters. Verify no seller identity, contact, evidence, buyer, finance, VPCC, PTID, audit, or correlation data appears.
4. As Môi giới, open `PLID-HN-31001`, create one `Đăng ký hợp tác bán`, and verify the original responsible Môi giới and seller Representation do not change. Reload the direct hash route and verify the registration persists. As Sàn môi giới, verify the same inventory/detail is read-only and the distribution route is denied.
5. Open `Phân phối Tin bán`, verify all four preflight conditions, the explicit `Dữ liệu gửi` and `Không chia sẻ` lists, then send to HouseNow. Verify one event with `Đã gửi · Chờ phản hồi kênh`, no claim of publication, no duplicate send, and persistence after reload.
6. Select a role and enter its transaction queue. Verify role selection and last destination persist; an unconsented Bank opens its empty queue, while a consented Bank opens only the opaque-token projection. Then open each permitted dossier and verify the linked-object strip keeps NPID, PLID, and PTID separate.
7. As Môi giới, enter the exact NPID, Representation scope and effective period, then choose `Gửi thông tin đến Người bán`. Verify a missing or wrong identifier, an invalid date range, and a wrong role cannot mutate state; no candidate or source-selection control is rendered.
8. As Người bán, confirm Representation without editing a system confirmation identifier and verify that PLID is created automatically with status `Đã khởi tạo`. Verify the Representation view consistently contains both Người bán and Người đại diện (Môi giới). On dossier Tin bán detail, verify HouseNow uses the supplied icon and remains `Chưa phát hành`; this is distinct from the represented-market outbound event in step 5.
9. Record the buyer, then verify the buyer sees their name, identifier, Property identifier, contract information, agreed price and expected signing date before confirming the existing readiness checklist. Test finance-sharing both ways. The Ngân hàng queue must omit an unconsented dossier entirely and expose only the permitted projection for a consented dossier. Inspect the Sàn môi giới coordination projection separately.
10. As VPCC, submit the exact required document set. For the landed-property dossier, request one specific supplement, provide it as Người bán, and verify the same dossier becomes ready for signing without losing prior events.
11. Record each valid VPCC contract identifier and signing time without a document-digest input. Verify PTID, tax/integration events, and the correct transfer route are created atomically without a manual VMLS action or user-selected route. Complete both the Chủ đầu tư/HĐMB route and the VPĐKĐĐ result route.
12. Use `Đặt lại dữ liệu` and verify both transaction dossiers return to their configured initial state, all represented-market registrations and distribution events are removed, the five eligible inventory records remain, and reload preserves the reset.

Store independent browser QA reports, screenshots, traces, and recordings under `output/qa/vmls-data-product-redesign/`. Generated evidence remains local and uncommitted.

## Privacy and data-integrity assertions

- Test both permitted and nearest wrong-role access for every mutable command.
- Verify unauthorized records and fields are absent from the rendered projection, global search, metrics, filters, list rows, detail tabs, and audit views—not merely visually hidden.
- Verify invalid actions leave object state, work items, audit events, integration events, and serialized replay unchanged.
- Verify each accepted command appends its payload to the command log and appends an audit event with actor, target, time, and correlation data without overwriting prior submissions or supplement events.
- Verify the two dossiers never share identifiers, command history, transfer result, or persisted replay state.
- Verify the five represented-market records do not reuse either transaction dossier identifier and that a `CoBrokerRegistration` never mutates the original Representation.
- Verify the Industry projection and HouseNow payload are explicit allowlists. Injected seller, evidence, buyer, finance, VPCC, PTID, audit, correlation, or unknown fields must fail closed rather than pass through serialization or rendering.
- Verify the represented-market summary and status tabs derive only from the current Môi giới's registration and distribution events.
- Verify refresh, direct hash navigation, role switching, search, filters, lists, and details all derive from the same projected record state. Root lookup must preserve the NPID/query, area, developer, and project filters together in the hash and after reload/back navigation.

## Deliberately not covered

- Real authentication, authorization, API, database, concurrency, backup, recovery, load, or security testing; those systems do not exist in this prototype.
- VNeID, VPCC, tax, VPĐKĐĐ, Chủ đầu tư, 357, HouseNow, or other external contract tests; configured events and local assets are not live integrations. A local `DistributionEvent` is not an end-to-end HouseNow test.
- Validation of legal, tax, cadastral, notarization, identity, or developer-transfer policy.

Production-grade acceptance criteria remain future work after real-data boundaries and external contracts are approved.
