---
title: Current product and implementation state
status: current
authority: canonical
last_reviewed: 2026-08-17
---

# Current product and implementation state

The executable artifact is a Vietnamese, data-first VMLS product with a registry workbench and role-scoped applications. The public entry searches two configured transaction dossiers and five separate represented Tin bán by NPID or keyword, area, developer, and project. From the same result set, a viewer can distinguish linked NPID/PLID/PTID records and open either an operational dossier or an Industry projection of a Tin bán. The workspace supports represented-inventory lookup, collaboration registration, a bounded distribution handoff, structured dossier commands, and resulting lifecycle events. It is not a product narrative, legal-policy specification, or production system.

The public entry contract is recorded in [VMLS landing workbench](./vmls-landing-workbench.md), the role-scoped interaction contract is recorded in [VMLS operational workspace](./vmls-operational-workspace.md), and the represented-inventory slice is recorded in [VMLS represented inventory and distribution demo](./vmls-representation-distribution-demo.md). The repeatable runbook is [VMLS operational workspace runbook](./vmls-demo-playbook.md). Visual implementation follows the [living-registry visual specification](../brand/vmls-living-registry-spec.md).

## Current artifact

| Area | Current state | Evidence boundary |
|---|---|---|
| Interface | Persistent application shell with role-scoped sidebar, application hub, global search, work queue, market inventory, collection tables, record detail tabs, forms, status, and audit views | `PROPOSAL` product surface; the repository build is directly inspectable |
| Brand | Standalone VMLS mark, registry-green structure, warm paper surfaces, canonical fonts, thin rules, and compact operational density | `FACT` for the local assets and current build; no HouseNow byline is rendered |
| Default entry | The root route opens a registry workbench with combined NPID/keyword, area, developer, and project filters over seven configured records | `PROPOSAL` interaction contract; the configured records are synthetic or masked |
| Operational entry | `Mở không gian làm việc` opens the selected role queue; direct hash routes continue to bypass the landing | `PROPOSAL` interaction contract |
| Application map | `Ứng dụng` projects relevant VMLS capabilities and external exchanges for the selected role | Implemented routes have an action; dated capture records are read-only; event-only and unconfigured records are visible without a false click target |
| Core records | Bất động sản/`NPID`, Tin bán/`PLID`, and Giao dịch/`PTID` are separate linked objects with separate lifecycles | Adopted domain invariant; exact identifiers are configured sample data |
| Represented inventory | Five effective Tin bán have a confirmed, effective seller Representation, Industry visibility, and open collaboration scope | `PROPOSAL` eligibility rules implemented over a separate synthetic fixture set |
| Collaboration | A Môi giới can register as a cooperating broker on an eligible PLID; the original seller Representation and responsible Môi giới remain unchanged | `PROPOSAL`; this creates a separate `CoBrokerRegistration`, not a second seller Representation |
| Distribution | An eligible registration can create one HouseNow `DistributionEvent` containing only the configured public allowlist and its projection version | `PROPOSAL`; the local result stops at `Đã gửi · Chờ phản hồi kênh` and does not claim publication outside VMLS |
| Work management | Each role sees records within its projection, the current status, responsible role, due date, next work item, and allowed action | `PROPOSAL`; not an approved organization or SLA policy |
| Commands | Actions collect required business payloads instead of advancing a generic presentation step | `PROPOSAL`; payload validation is implemented locally |
| Automation | Seller confirmation creates the PLID automatically. A valid VPCC signing result creates the PTID, appends tax/integration events, and determines the transfer route automatically | `PROPOSAL`; no live integration contract is claimed |
| Runtime | Static Vite/React client with configured records and a reducer/state machine | `FACT` for this repository build |
| Persistence | Separate versioned browser stores replay accepted dossier and represented-market commands; reset returns both stores to configured initial state | Browser convenience only; not governed persistence or an authoritative Audit Event store |
| Deployment target | `vmls.housenow.com.vn` | Deployment status must be verified separately |

Historical Phase 5–6 plans and [ADR 0001](../decisions/0001-local-mvp-architecture.md) describe the replaced Node/SQLite exploration slice. They remain design history and do not describe the current runtime.

## Information architecture

The application uses the v2 proposal for business sequence and [transaction screens v3](./vmls-process-v3.md) for list/detail navigation and application-shell grammar.

The public landing provides structured registry lookup across seven allowlisted records, a selected-record identity trace, projected property/project context, and read-only external touchpoint records. Its controls deep-link to the operational product; it does not advance dossier or market state. Inside the workspace, the global header provides context, search, the current role, and reset. The sidebar changes with the selected role. The main surfaces are:

- role application and external-exchange hub;
- role work queue;
- represented Tin bán inventory, Industry detail, and distribution workspace;
- Bất động sản collection and detail;
- Tin bán collection and detail;
- Giao dịch collection and detail;
- VPCC dossier queue and detail;
- VPĐKĐĐ or Developer transfer queue and detail;
- VMLS integration/source registry;
- append-oriented processing history.

Every external or expansion module remains visible in the application map so the ecosystem is legible. Clickability communicates implemented behavior: operational modules navigate, VNeID/357/HouseNow capture records open a read-only preview, and event-only or unconfigured modules render as plain records. Role switching is a preview of distinct authorized workspaces. It is not a numbered transaction step and the interface does not instruct the user to switch roles merely to advance a story.

## Role jobs

| Role | Primary operational job |
|---|---|
| Môi giới | Search represented inventory, register to cooperate on an eligible PLID, send its public projection to an allowed channel, enter an existing Bất động sản identifier, request Representation, record a buyer, and monitor assigned work |
| Sàn môi giới | Inspect represented inventory without a registration or distribution command; review Representation status, current blockers, next-task ownership, and due dates across the brokerage scope |
| Người bán | Review and confirm representation; provide a requested missing document |
| Người mua | Confirm readiness and, on the HĐMB route, acknowledge receipt of the new contract |
| Ngân hàng | View only a consented finance projection containing the permitted property, price, and readiness context |
| Văn phòng công chứng | Receive the dossier and required documents, request a specific supplement when needed, and return a structured signing result |
| Chủ đầu tư | Receive a routed HĐMB-transfer dossier and return transfer confirmation |
| Văn phòng đăng ký đất đai | Return the registration-change result for a routed land dossier |
| Vận hành VMLS | Inspect object identities, source registry, integration events, routing results, and audit history; system automation is not exposed as a manual VMLS action |

## Record and lifecycle model

The workspace does not use one global presentation stage as the source of truth. It tracks separate operational state for:

- Bất động sản identity received through its existing `NPID`;
- Representation request and confirmation;
- Tin bán creation and distribution;
- cooperating-broker registration on an eligible Tin bán;
- outbound distribution events and channel acknowledgement state;
- buyer/readiness information;
- VPCC dossier and supplement request;
- Giao dịch;
- transfer route and result;
- integration and audit events.

A work item is derived from those states and identifies the responsible role, action, priority, and due date. Commands that fail actor, state, or payload guards leave all records unchanged.

The represented-inventory slice deliberately uses a separate set of five synthetic apartment records (`NPID-HN-21001` through `NPID-HN-21005`, linked to `PLID-HN-31001` through `PLID-HN-31005`). It does not reuse either transaction dossier or infer that a dossier Tin bán is already effective. Its Industry projection includes property and market facts, project/developer, price, responsible Môi giới and Sàn, Representation status, and collaboration state. It omits seller identity and contact, Representation evidence, buyer and finance data, VPCC material, PTID, audit history, and correlation identifiers.

The market action sequence is:

```text
Tra cứu một Tin bán đủ điều kiện bằng NPID/khu vực/Chủ đầu tư/Dự án
→ xem Industry projection
→ Môi giới tạo CoBrokerRegistration
→ kiểm tra trạng thái Tin bán, Representation, đăng ký và consent kênh
→ gửi public projection đến HouseNow
→ ghi DistributionEvent “Đã gửi · Chờ phản hồi kênh”
```

The last state is a local outbound-handoff record, not proof that HouseNow accepted or published a live listing.

## Two independent operational records

The two fully interactive records never share an `NPID`, `PLID`, `PTID`, representation, VPCC dossier, event history, or browser-state replay:

| Record | Durable identity | Transfer basis | Result route |
|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | Hợp đồng mua bán với Chủ đầu tư | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | Giấy chứng nhận quyền sử dụng đất | Văn phòng đăng ký đất đai |

For S2-12A, `69,2 m² thông thủy` and `82,3 m² tim tường` remain separate area concepts and retain their source association. They are never collapsed into one unexplained area value.

The normal operational sequence is:

```text
Môi giới nhập NPID, phạm vi và thời hạn
→ Môi giới gửi thông tin đến Người bán
→ Người bán xác nhận
→ hệ thống cấp PLID với trạng thái “Đã khởi tạo”
→ Môi giới ghi nhận Người mua
→ Người mua kiểm tra thông tin hợp đồng và xác nhận danh mục sẵn sàng
→ VPCC tiếp nhận hồ sơ và xử lý bổ sung nếu có
→ VPCC trả mã hợp đồng và thời điểm ký
→ hệ thống cấp PTID, ghi sự kiện tích hợp và xác định tuyến
→ VPĐKĐĐ trả kết quả đăng ký biến động
   hoặc Chủ đầu tư tiếp nhận, xác nhận chuyển nhượng và Người mua nhận HĐMB mới
```

## Contextual placement of external captures

- The VNeID capture comes from the official Google Play listing and is shown with the representation handoff contract. The VMLS UI never reproduces login, OTP, identity, or consent actions.
- The dated 357 homepage capture belongs to the VMLS `Kết nối & nguồn dữ liệu` registry. Its record exposes owner, URL, capture date, coverage, and connection status. It is not presented as source evidence for either property.
- The HouseNow apartment-category capture documents the outbound market surface. The exact HouseNow icon remains on the channel record. A represented-market send records only a local outbound event; the separate dossier channel can remain `Chưa phát hành`.
- All three captures are local, read-only media. Opening them never calls or mutates an external system.

## Data, integration, and security boundary

- `FACT`: The executable is client-only. There is no server, database, live API, authentication service, analytics, or real third-party connection.
- `FACT`: Personal identities are masked in configured records. Browser progress contains only the configured sample command payloads.
- `FACT`: The VNeID, 357, and HouseNow assets are dated captures of public surfaces stored locally for deterministic display and recording.
- `FACT`: The rendered brand is VMLS alone. HouseNow appears only where its channel or capture is relevant to the workflow.
- `PROPOSAL`: VNeID, VPCC, tax, VPĐKĐĐ, Developer, and HouseNow events show the intended record contract and handoff shape.
- `PROPOSAL`: Represented-inventory eligibility, Industry projection, cooperating-broker registration, channel consent, public allowlist, and DistributionEvent shape are current demo contracts.
- `PROPOSAL`: The configured PTID is a VMLS transaction reference. Ownership and mapping to any official identifier remain unresolved.
- `OPEN QUESTION`: Whether the tax flow is fully automated or requires an authority decision remains unresolved. The current workspace records events but does not establish an approved tax workflow.

Evidence labels and these boundaries belong in maintained documentation and review artifacts. They are not product badges, disclaimers, banners, or instructional copy in the operational interface.

## Open approval gates

1. `OPEN QUESTION`: Which locality, segment, organizations, daily users, and measurable operational problem define the first pilot?
2. `OPEN QUESTION`: Which Vietnam representation, notarization, tax, transfer, and completion rules are approved?
3. `OPEN QUESTION`: Which organization owns canonical Property/Parcel/Project/Unit identity and source-conflict resolution?
4. `OPEN QUESTION`: Which Public, Industry, Restricted, purpose, consent, retention, and oversight rules apply?
5. `OPEN QUESTION`: Which official identifiers, integration contracts, idempotency rules, SLAs, security controls, and legal reviews are required?
6. `OPEN QUESTION`: Who approves a cooperating Môi giới, owns downstream leads, and retracts channel content when Representation or consent expires?

Implemented behavior remains non-authoritative wherever it differs from an accepted or locked decision.
