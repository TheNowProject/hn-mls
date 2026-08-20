---
title: Current product and implementation state
status: current
authority: canonical
last_reviewed: 2026-08-20
---

# Current product and implementation state

The executable artifact is a Vietnamese, data-first VMLS pre-MVP. It combines registry lookup, represented inventory, seller-controlled Public projections, cooperating-broker distribution, transaction coordination, and read-only external-processing status. It is not a product narrative, legal-policy specification, official registry, or production integration.

The public entry contract is recorded in [VMLS landing workbench](./vmls-landing-workbench.md), the role-scoped interaction contract in [VMLS operational workspace](./vmls-operational-workspace.md), and the represented-inventory slice in [VMLS represented inventory and distribution demo](./vmls-representation-distribution-demo.md). This document records the newer V4 behavior where those working documents differ. The repeatable runbook is [VMLS operational workspace runbook](./vmls-demo-playbook.md). Visual implementation follows the [living-registry visual specification](../brand/vmls-living-registry-spec.md).

## Current artifact

| Area | Current state | Evidence boundary |
|---|---|---|
| Interface | Persistent application shell with role-scoped navigation, application catalog, registry search, work queues, represented inventory, dossier details, source cards, and append-oriented histories | `PROPOSAL` product surface; the repository build is directly inspectable |
| Brand | Standalone VMLS mark, registry green, warm paper surfaces, canonical fonts, thin rules, and compact operational density | `FACT` for local assets and build; no HouseNow byline |
| Default entry | Root workbench filters configured records by NPID/keyword, area, Developer, and Project, and keeps NPID/PLID/PTID separate | `PROPOSAL` interaction contract; all records are synthetic or masked |
| 357 source | Each transaction dossier has a configured `PropertySourceRecord357`, including source record/version/timestamps and safe Property field claims; its NPID is used directly by VMLS | `PROPOSAL`: 357-issued NPID and record contract are not an approved official interface; the bundled dated capture is a `FACT` |
| Representation and Tin bán | Seller confirmation creates PLID with `Đã khởi tạo`; represented inventory remains a separate eligible five-record set | `PROPOSAL`; a created Listing is not automatically Active or public |
| Public control | The owning Seller saves and applies one `PublicationProfile` per PLID; applied Public and Industry projections remain separate | `PROPOSAL`; hidden groups are omitted from serialized/rendered Public data |
| Corrections | Seller requests an asking-price change; Brokerage applies it as a new Listing revision. A previously sent channel becomes `Cần cập nhật` | `PROPOSAL`; no remote update is claimed |
| Buyer | Brokerage creates `BuyerDeclaration`; the configured Party fixture resolves the masked name | `PROPOSAL`; Seller and external agencies receive reduced projections |
| External processing | VPCC, VPĐKĐĐ, and Tax have searchable read-only queues/details. VMLS receives configured source events and derives progress | `PROPOSAL`; those agencies perform no VMLS business command |
| Automation | Final VPCC source result creates PTID, derives route, and prepares tax and applicable land-registry handoffs; Tax runs in parallel | `PROPOSAL`; no approved legal, tax, or integration contract is claimed |
| VNeID | Local two-step handoff creates a masked browser session that survives reload and is independent from role and business reset | `FACT` for local implementation; not live authentication or a VNeID request |
| Runtime | Static Vite/React client with configured records and reducer/state machines; no backend, database, analytics, or live API | `FACT` for this repository build |
| Persistence | Journey store `v4`, represented-market store, and VNeID session store replay independently; malformed or incompatible state resets safely | Browser convenience only, not authoritative persistence |
| Deployment target | `vmls.housenow.com.vn` | Deployment status must be verified separately |

Historical Phase 5–6 plans and [ADR 0001](../decisions/0001-local-mvp-architecture.md) describe the replaced Node/SQLite exploration slice. They remain design history and do not describe the current runtime.

## Information architecture

The application uses the [v2 process proposal](./vmls-process-v2.md) for the business sequence and [transaction screens v3](./vmls-process-v3.md) for list/detail navigation grammar.

The root workbench provides structured lookup, linked-object identity, selected-record facts, and the path into the workspace. The application catalog makes implemented VMLS modules and external exchanges legible. Only implemented functions and explicitly read-only records are interactive; an unimplemented card has no chevron, hover affordance, or false button.

The workspace contains:

- role work queues for Môi giới, Sàn môi giới, Người bán, Người mua, Ngân hàng, Chủ đầu tư, and Vận hành VMLS;
- represented Tin bán inventory, Industry detail, cooperating-broker registration, and HouseNow distribution;
- `Tin bán của tôi` for the owning Seller, with `Công khai & chỉnh sửa` and a Public preview;
- a Brokerage correction queue and Buyer declaration/handoff actions;
- dossier details with NPID/PLID/PTID, role-specific facts, processing milestones, and source timelines;
- VMLS source cards for VPCC, Tax, and VPĐKĐĐ, with `Nhận cập nhật` applying only the next configured source event;
- read-only VPCC, VPĐKĐĐ, and Tax queues/details containing configured masked records plus journey dossiers after handoff;
- integration events and user Audit Events as distinct append-only histories.

Role switching previews distinct authorized workspaces. It neither impersonates a real user nor advances the transaction by itself.

## Role jobs and command ownership

| Role | Primary job in the current artifact |
|---|---|
| Môi giới | Enter an existing 357-issued NPID, request Representation, search represented inventory, register to cooperate, send an eligible applied Public projection to HouseNow, and monitor assigned processing |
| Sàn môi giới | Declare the Buyer, hand off the notarization dossier, reconcile Seller price corrections, and coordinate Organization work |
| Người bán | Confirm Representation; decide optional Public field groups; preview and apply the profile; request a price correction; send a requested supplement as an outbound handoff |
| Người mua | Review contract fields and safe 357 Property provenance, confirm readiness, and acknowledge receipt of a new HĐMB on the Developer route |
| Ngân hàng | View only a consented finance projection |
| Chủ đầu tư | Process the configured HĐMB transfer route in the demo |
| Vận hành VMLS | Inspect object/source histories and receive the next configured VPCC, Tax, or VPĐKĐĐ event |
| VPCC | Search, filter, and inspect synchronized notarization status; no VMLS business action |
| VPĐKĐĐ | Search, filter, and inspect synchronized land-registration status; no VMLS business action |
| Cơ quan thuế | Search, filter, and inspect synchronized tax status; no VMLS business action |

`PROPOSAL`: This ownership split is a demo contract, not an approved Vietnam responsibility matrix. Production authorization still requires Organization, Role, Purpose, Resource, Scope, field classification, consent, and effective time as defined in [permissions](../domain/permissions.md).

## Record and projection model

The workspace keeps the following records and lifecycles separate:

- `PropertySourceRecord357` and Bất động sản/NPID;
- Representation request and confirmation;
- Tin bán/PLID and `PublicationProfile` draft/applied versions;
- `SellerCorrectionRequest`, Listing revision, channel state, and reconciliation event;
- `CoBrokerRegistration` and `DistributionEvent`;
- `BuyerDeclaration`, readiness, and optional Bank consent;
- VPCC/Tax/VPĐKĐĐ `ExternalProcessingCase` and `ExternalStatusEvent`;
- Giao dịch/PTID, automatically derived route, and route-specific result;
- user Audit Events, kept separate from external status events.

### 357 provenance

`PROPOSAL`: The configured 357 record issues the NPID and supplies safe Property claims. Each dossier stores source record ID, version, source-updated-at, VMLS-received-at, and field claims for project/developer, area, Property type, building/unit, explicitly named area concepts, and publication state. It contains no owner identity, CCCD, or private transaction history.

The dated 357 homepage image remains attributed reference media. It makes the source visible but is not proof that an official API, identifier policy, or live connection exists.

### Publication and correction

One `PublicationProfile` belongs to one PLID. PLID, transaction/property type, general area, and responsible Agent business contact are locked. Price, project/unit, detailed location, areas, features, description, and images are optional. The demo walkthrough hides detailed location and images.

Public lookup and HouseNow use only the applied Public projection. Represented inventory uses an independently allowlisted Industry projection. A field disabled by the Seller is omitted, not merely covered by CSS.

The correction sequence is:

```text
Người bán đề nghị sửa giá chào
→ Sàn đối chiếu và áp dụng
→ VMLS nối thêm revision Tin bán và Audit Event
→ nếu phiên bản cũ đã gửi HouseNow, trạng thái kênh thành “Cần cập nhật”
→ VMLS nối thêm reconciliation event; không khẳng định kênh ngoài đã đổi
```

### Buyer and privacy

Only the Brokerage creates `BuyerDeclaration`, using the Buyer reference, agreed whole-VND price, and expected signing date. The masked name is resolved from the configured Party record. The Buyer and responsible Agent receive the necessary transaction projection; the Seller receives a milestone; VPCC, VPĐKĐĐ, and Tax projections omit Buyer identity. The Buyer detail includes the safe 357 source snapshot and provenance timestamps.

### External source status

Every configured source event contains source, source-case identity, raw status, normalized status, processing organization, source update time, VMLS receipt time, and idempotency identity. The normalized states are `Chờ tiếp nhận`, `Đang xử lý`, `Yêu cầu bổ sung`, and `Đã xử lý`. Duplicate events are ignored, and an older event cannot regress status.

The external roles are monitoring projections. They never expose accept, sign, approve, supplement-request, or tax-decision actions. Vận hành VMLS receives the next event for one dossier and source; this action simulates inbound orchestration rather than work performed by the agency.

## Two independent operational records

| Record | NPID supplied by configured 357 record | Transfer basis | Result route |
|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | Hợp đồng mua bán với Chủ đầu tư | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | Giấy chứng nhận quyền sử dụng đất | VPĐKĐĐ |

The records never share NPID, PLID, PTID, Representation, Buyer declaration, external source case, event history, or state replay. For S2-12A, `69,2 m² thông thủy` and `82,3 m² tim tường` remain different area concepts with explicit source association.

The common flow is:

```text
Môi giới nhập NPID và gửi thông tin đến Người bán
→ Người bán xác nhận Representation
→ VMLS tạo PLID ở “Đã khởi tạo”
→ Người bán áp dụng cấu hình Public
→ Sàn khai báo Người mua
→ Người mua xác nhận checklist sẵn sàng
→ Sàn bàn giao hồ sơ công chứng
→ VMLS lần lượt nhận trạng thái VPCC; ngoại lệ bổ sung được Người bán gửi lại
→ kết quả VPCC cuối tạo PTID và route
→ VMLS lập handoff Thuế song song và VPĐKĐĐ nếu áp dụng
→ VMLS nhận trạng thái nguồn VPĐKĐĐ, hoặc Chủ đầu tư xử lý HĐMB trong demo
```

Tax progress does not gate either transfer route in this artifact.

## VNeID session boundary

The landing and application header expose `Đăng nhập bằng VNeID`. The local two-step handoff shows a masked configured identity and sharing scope; confirmation creates an independent versioned browser session. Reload preserves the session, `Đăng xuất` clears it, and `Đặt lại dữ liệu` leaves it untouched. The session does not change role, queue visibility, permissions, or dossier state and makes no external request.

The local VNeID capture may appear as attributed media. Neither the capture nor the local handoff is evidence of real VNeID authentication, consent, endorsement, or integration.

## Data, integration, and interface boundary

- `FACT`: The executable is client-only and all identities, source organizations, and dossiers are synthetic or masked.
- `FACT`: The VNeID, 357, and HouseNow assets are dated local captures used for deterministic display and recording.
- `FACT`: HouseNow appears only as a distribution channel/reference, never as a VMLS brand byline.
- `PROPOSAL`: The 357-issued NPID, field claims, PublicationProfile, correction, Buyer declaration, external events, route, tax handoff, and channel reconciliation are current demo contracts.
- `PROPOSAL`: PTID is a VMLS demo reference that may later map to an approved official identifier.
- `OPEN QUESTION`: Identifier ownership, official source contracts, tax decision rules, allowed Public/Industry fields, downstream reconciliation, SLAs, and legal approval remain unresolved.

Evidence labels belong in maintained documentation and QA artifacts. The product interface uses concise operational Vietnamese and must not render evidence labels, implementation caveats, “mô phỏng đề xuất”, storytelling copy, or disclaimer banners. Honest state names, source metadata, disabled availability, and the absence of false actions carry the boundary in the UI.

## Open approval gates

1. `OPEN QUESTION`: Which locality, segment, organizations, daily users, and measurable operational problem define the first pilot?
2. `OPEN QUESTION`: Which Vietnam representation, notarization, tax, transfer, and completion rules are approved?
3. `OPEN QUESTION`: Does 357 own or issue the official NPID, and what are the interface, versioning, correction, and conflict-resolution contracts?
4. `OPEN QUESTION`: Which Public, Industry, Restricted, purpose, consent, retention, and oversight rules apply?
5. `OPEN QUESTION`: Which official identifiers, integration contracts, idempotency rules, SLAs, security controls, and legal reviews are required?
6. `OPEN QUESTION`: Who approves a cooperating Môi giới and owns downstream lead, update, withdrawal, and reconciliation duties?

Implemented behavior remains non-authoritative wherever it differs from an accepted or locked decision.
