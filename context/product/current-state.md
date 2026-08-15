---
title: Current product and implementation state
status: current
authority: canonical
last_reviewed: 2026-08-15
---

# Current product and implementation state

The executable artifact is a Vietnamese, data-first VMLS operational workspace. It opens directly to a role-scoped work queue and lets the viewer inspect records, submit structured payloads, and observe resulting lifecycle and integration events. It is not a landing page, product narrative, legal-policy specification, or production system.

The detailed interaction contract is recorded in [VMLS operational workspace](./vmls-operational-workspace.md). The repeatable runbook is [VMLS operational workspace runbook](./vmls-demo-playbook.md).

## Current artifact

| Area | Current state | Evidence boundary |
|---|---|---|
| Interface | Persistent application shell with role-scoped sidebar, global search, work queue, collection tables, record detail tabs, forms, status, and audit views | `PROPOSAL` product surface; the repository build is directly inspectable |
| Default workspace | Môi giới opens on `Công việc cần xử lý`; there is no introduction, story path, pilot page, or guided role handoff | `PROPOSAL` interaction contract |
| Core records | Bất động sản/`NPID`, Tin bán/`PLID`, and Giao dịch/`PTID` are separate linked objects with separate lifecycles | Adopted domain invariant; exact identifiers are configured sample data |
| Work management | Each role sees records within its projection, the current status, responsible role, due date, next work item, and allowed action | `PROPOSAL`; not an approved organization or SLA policy |
| Commands | Actions collect required business payloads instead of advancing a generic presentation step | `PROPOSAL`; payload validation is implemented locally |
| Automation | Seller confirmation creates the PLID automatically. A valid VPCC signing result creates the PTID, appends tax/integration events, and determines the transfer route automatically | `PROPOSAL`; no live integration contract is claimed |
| Runtime | Static Vite/React client with configured records and a reducer/state machine | `FACT` for this repository build |
| Persistence | Versioned browser storage replays accepted commands; reset returns both records to their configured initial state | Browser convenience only; not governed persistence or an authoritative Audit Event store |
| Deployment target | `vmls.housenow.com.vn` | Deployment status must be verified separately |

Historical Phase 5–6 plans and [ADR 0001](../decisions/0001-local-mvp-architecture.md) describe the replaced Node/SQLite exploration slice. They remain design history and do not describe the current runtime.

## Information architecture

The application uses the v2 proposal for business sequence and [transaction screens v3](./vmls-process-v3.md) for list/detail navigation and application-shell grammar.

The global header provides workspace context, search, the current role, and reset. The sidebar changes with the selected role. The main surfaces are:

- role work queue;
- Bất động sản collection and detail;
- Tin bán collection and detail;
- Giao dịch collection and detail;
- VPCC dossier queue and detail;
- VPĐKĐĐ or Developer transfer queue and detail;
- VMLS integration/source registry;
- append-oriented processing history.

Role switching is a preview of distinct authorized workspaces. It is not a numbered transaction step and the interface does not instruct the user to switch roles merely to advance a story.

## Role jobs

| Role | Primary operational job |
|---|---|
| Môi giới | Match the seller request to the correct Bất động sản, prepare the representation request, record the buyer, and monitor work assigned to the dossier |
| Sàn môi giới | Review representation status, current blockers, ownership of the next task, and due dates across the brokerage scope |
| Người bán | Review and confirm representation; provide a requested missing document |
| Người mua | Confirm readiness and, on the HĐMB route, acknowledge receipt of the new contract |
| Ngân hàng | View only a consented finance projection containing the permitted property, price, and readiness context |
| Văn phòng công chứng | Receive the dossier and required documents, request a specific supplement when needed, and return a structured signing result |
| Chủ đầu tư | Receive a routed HĐMB-transfer dossier and return transfer confirmation |
| Văn phòng đăng ký đất đai | Return the registration-change result for a routed land dossier |
| Vận hành VMLS | Inspect object identities, source registry, integration events, routing results, and audit history; system automation is not exposed as a manual VMLS action |

## Record and lifecycle model

The workspace does not use one global presentation stage as the source of truth. It tracks separate operational state for:

- Bất động sản matching;
- Representation request and confirmation;
- Tin bán creation and distribution;
- buyer/readiness information;
- VPCC dossier and supplement request;
- Giao dịch;
- transfer route and result;
- integration and audit events.

A work item is derived from those states and identifies the responsible role, action, priority, and due date. Commands that fail actor, state, or payload guards leave all records unchanged.

## Two independent operational records

The two fully interactive records never share an `NPID`, `PLID`, `PTID`, representation, VPCC dossier, event history, or browser-state replay:

| Record | Durable identity | Transfer basis | Result route |
|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | Hợp đồng mua bán với Chủ đầu tư | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | Giấy chứng nhận quyền sử dụng đất | Văn phòng đăng ký đất đai |

For S2-12A, `69,2 m² thông thủy` and `82,3 m² tim tường` remain separate area concepts and retain their source association. They are never collapsed into one unexplained area value.

The normal operational sequence is:

```text
Môi giới chọn đúng NPID và nguồn
→ Môi giới gửi yêu cầu đại diện có phạm vi và thời hạn
→ Người bán xác nhận
→ hệ thống cấp PLID với trạng thái “Đã khởi tạo”
→ Môi giới ghi nhận Người mua
→ Người mua xác nhận danh mục sẵn sàng
→ VPCC tiếp nhận hồ sơ và xử lý bổ sung nếu có
→ VPCC trả kết quả ký
→ hệ thống cấp PTID, ghi sự kiện tích hợp và xác định tuyến
→ VPĐKĐĐ trả kết quả đăng ký biến động
   hoặc Chủ đầu tư tiếp nhận, xác nhận chuyển nhượng và Người mua nhận HĐMB mới
```

## Contextual placement of supplied assets

- The dated 357 homepage capture belongs to the VMLS `Kết nối & nguồn dữ liệu` registry. Its record exposes owner, URL, capture date, coverage, and connection status. It is not presented as source evidence for either property.
- The exact HouseNow icon belongs to the `Kênh phân phối` table on Tin bán detail. HouseNow is one channel record with a field scope and delivery status, not a promotional surface.

## Data, integration, and security boundary

- `FACT`: The executable is client-only. There is no server, database, live API, authentication service, analytics, or real third-party connection.
- `FACT`: Personal identities are masked in configured records. Browser progress contains only the configured sample command payloads.
- `FACT`: The 357 asset is a dated capture of the public homepage and its configured status is `Chưa cấu hình`.
- `PROPOSAL`: VNeID, VPCC, tax, VPĐKĐĐ, Developer, and HouseNow events show the intended record contract and handoff shape.
- `PROPOSAL`: The configured PTID is a VMLS transaction reference. Ownership and mapping to any official identifier remain unresolved.
- `OPEN QUESTION`: Whether the tax flow is fully automated or requires an authority decision remains unresolved. The current workspace records events but does not establish an approved tax workflow.

Evidence labels and these boundaries belong in maintained documentation and review artifacts. They are not product badges, disclaimers, banners, or instructional copy in the operational interface.

## Open approval gates

1. `OPEN QUESTION`: Which locality, segment, organizations, daily users, and measurable operational problem define the first pilot?
2. `OPEN QUESTION`: Which Vietnam representation, notarization, tax, transfer, and completion rules are approved?
3. `OPEN QUESTION`: Which organization owns canonical Property/Parcel/Project/Unit identity and source-conflict resolution?
4. `OPEN QUESTION`: Which Public, Industry, Restricted, purpose, consent, retention, and oversight rules apply?
5. `OPEN QUESTION`: Which official identifiers, integration contracts, idempotency rules, SLAs, security controls, and legal reviews are required?

Implemented behavior remains non-authoritative wherever it differs from an accepted or locked decision.
