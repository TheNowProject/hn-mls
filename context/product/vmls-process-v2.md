# VMLS transaction flow v2

> Evidence status: **PROPOSAL** — revised through stakeholder review on 2026-08-20. This document describes the configured pre-MVP flow, not an approved legal, tax, identity, notarization, land-registration, Developer, or production-integration workflow.
>
> Naming: HNRE in the supplied source flow is treated as VMLS. `NPID` identifies the Bất động sản, `PLID` identifies the Tin bán, and `PTID` identifies the Giao dịch. They are separate lifecycle objects.

Use [transaction screens v3](./vmls-process-v3.md) for shell and list/detail navigation grammar. Where an older screenshot shows an agency performing work in VMLS, this current text controls: VPCC, VPĐKĐĐ, and Cơ quan thuế only expose read-only synchronized status.

## Governing decisions

1. `PROPOSAL`: 357 issues the NPID used directly by VMLS and provides safe Property claims with record-level provenance. An official identifier owner and interface remain an `OPEN QUESTION`.
2. Môi giới does not match candidate Properties in this flow. The Agent enters an existing NPID and sends representation information to the Seller.
3. Seller confirmation creates PLID in `Đã khởi tạo`; it does not imply Active or public distribution.
4. The Seller controls optional Public field groups through one draft/applied `PublicationProfile` per PLID. The Industry cooperation projection is separate.
5. The Brokerage, not the Agent, declares the Buyer and hands off the notarization dossier.
6. VPCC, VPĐKĐĐ, and Tax work in their source systems. Their VMLS workspaces are read-only queues/details synchronized from configured source events.
7. Vận hành VMLS may receive the next configured source event for one dossier and source. It cannot invent or skip a source result.
8. Final notarization status creates PTID, derives the route, and creates applicable outbound handoffs. Tax proceeds in parallel and does not gate the route.
9. The Developer/HĐMB branch remains interactive in this demo.

## Records and histories

| Record | Purpose | Mutation boundary |
|---|---|---|
| `PropertySourceRecord357` | Source record/version/timestamps and safe Property field claims, including the NPID | Inbound configured source data; no owner/CCCD/private transaction history |
| Bất động sản / NPID | Durable Property identity used by VMLS | Independent from PLID and PTID |
| Representation | Seller authority granted to the responsible Agent/Brokerage | Môi giới requests; Seller confirms |
| Tin bán / PLID | Sale/transfer offering | Created after Representation confirmation |
| `PublicationProfile` | Applied Public field groups for one PLID | Seller saves draft and applies; locked groups cannot be removed |
| `SellerCorrectionRequest` | Old/new Listing value proposed by Seller | Brokerage applies as a new revision; history is not overwritten |
| `BuyerDeclaration` | Buyer reference, agreed price, expected signing date | Brokerage only |
| `ExternalProcessingCase` | Link between VMLS dossier and a VPCC, Tax, or VPĐKĐĐ source case | Read-only for the agency role |
| `ExternalStatusEvent` | Raw/normalized status and source/VMLS timestamps | Append-only, idempotent, non-regressive |
| Giao dịch / PTID | VMLS orchestration reference for the transaction | Created on the final configured VPCC result |
| Audit Event | User/system action inside VMLS | Separate from external status events |

## Common flow

### 00 — Optional local VNeID session

The landing or header opens a local two-step handoff, displays a masked configured identity and the sharing scope, then records confirmation in a separate browser session store. It makes no VNeID request, does not change role or entitlement, does not gate routes, and is not cleared by business-data reset.

### 01 — Môi giới requests Representation

- Enter the exact existing `Mã định danh Bất động sản` issued by the configured 357 record.
- Enter representation scope, effective date, and expiry date.
- Send the information to the Seller.
- Always show the Seller and Agent/representative blocks before and after submission.

There is no candidate-match decision and no editable system confirmation code.

### 02 — Người bán confirms Representation

The Seller reviews the NPID, Seller, representative Agent/Brokerage, scope, and term, then confirms. VMLS creates PLID automatically with status `Đã khởi tạo`.

### 03 — Người bán applies the Public profile

The Seller opens `Tin bán của tôi` and `Công khai & chỉnh sửa`:

- locked groups: PLID, transaction/property type, general area, and Agent business contact;
- optional groups: price, project/unit, detailed location, named areas, features, description, and images;
- `Lưu bản nháp` increments the draft without changing distribution;
- `Áp dụng cấu hình` creates the next applied Public projection.

The walkthrough hides detailed location and images. Public search and HouseNow consume the applied projection. Represented inventory uses its own Industry projection.

### 04 — Cooperation, distribution, and correction

An eligible Agent may register to cooperate without changing the original Representation. An outbound HouseNow delivery contains only the applied Public projection and stops at a local send/acknowledgement state.

The Seller may request a change to `askingPrice`. The Brokerage compares old/new values and applies it as a new Listing revision. If a previous version was sent, the channel becomes `Cần cập nhật` and VMLS appends a reconciliation event; no external update is asserted.

### 05 — Sàn declares the Buyer

The Brokerage records:

- `Mã định danh Người mua`;
- agreed whole-VND price;
- expected signing date.

The masked name is resolved from the configured Party. The responsible Agent and Buyer receive the fields needed for their job. The Seller receives only the milestone; VPCC, VPĐKĐĐ, and Tax do not receive Buyer identity in this demo.

The Buyer reviews contract fields, the checklist, and `Dữ liệu BĐS từ 357`, including NPID, source record, version, source-update time, VMLS-receipt time, and safe Property claims.

### 06 — Sàn hands off the notarization dossier

When readiness and required documents are complete, the Brokerage sends an outbound handoff. This creates or activates the configured VPCC external-processing case; it does not mean VPCC processed the dossier in VMLS.

### 07 — VMLS receives VPCC status

Vận hành VMLS applies the next configured VPCC event. Standard projection states are:

- `Chờ tiếp nhận`;
- `Đang xử lý`;
- `Yêu cầu bổ sung`;
- `Đã xử lý`.

If VPCC requests a supplement, the Seller receives a task and sends the requested PDF as an outbound handoff. VMLS then continues receiving source events; the VPCC workspace remains read-only throughout.

### 08 — Final VPCC result creates PTID and route

The final configured source event includes the contract identifier and signing time. VMLS atomically:

1. marks the notary source case `Đã xử lý`;
2. creates PTID;
3. derives the transfer route from the configured basis;
4. creates the Tax handoff;
5. creates the VPĐKĐĐ handoff when the land route applies;
6. appends integration events separately from user Audit Events.

The user never selects the route.

## Parallel Tax status

Tax has its own `ExternalProcessingCase` and event timeline. Vận hành VMLS receives configured Tax events; the Tax workspace only searches, filters, and inspects synchronized status. Tax progression is parallel and does not gate completion of either branch in this demo.

`OPEN QUESTION`: The official tax decision points, settlement evidence, responsible authority, and gating rules require approval. The demo's non-gating behavior is not a legal conclusion.

## Branch A — VPĐKĐĐ

For the configured land-certificate basis:

```text
VMLS creates the outbound VPĐKĐĐ handoff
→ VMLS receives configured source statuses
→ the read-only VPĐKĐĐ queue/detail shows processing organization and source timestamps
→ the final event records the registration-change result
```

No VMLS button accepts, approves, signs, or assigns the land case. There is no owner-reference input.

## Branch B — Developer/HĐMB

For the configured Developer purchase-contract basis:

```text
Chủ đầu tư records intake
→ Chủ đầu tư confirms the transfer
→ Người mua acknowledges receipt of the new HĐMB
```

The same PTID remains linked throughout. There is no additional fake closing step.

## Processing projection across roles

Môi giới, Sàn, Người bán, and Người mua queues/details show the current milestone and processing organization. They use source status and source time, never an invented percentage. Each permitted detail can show a source timeline while preserving privacy:

- Seller sees own authority, publication, correction, and transaction milestones, not Buyer identity;
- Buyer sees own contract and safe 357 Property data;
- external agency views omit market-party private identities;
- Bank sees only a consented finance projection.

## Configured demo data

| Record | NPID | PLID after confirmation | PTID after final VPCC event | Route |
|---|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | `PLID-HN-00125` | `PTID-HN-00031` | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | `PLID-HN-00208` | `PTID-HN-00044` | VPĐKĐĐ |

All identities and processing organizations are synthetic or masked. For S2-12A, `69,2 m² thông thủy` and `82,3 m² tim tường` remain two sourced concepts.

## Interface wording boundary

Evidence labels and implementation boundaries remain in repository documentation and QA evidence. The Vietnamese interface must not show labels or phrases such as `PROPOSAL`, `mô phỏng đề xuất`, implementation disclaimers, or presentation-story copy. It communicates truth through operational names, source metadata, explicit state, read-only affordances, field omission, and absence of unsupported actions.
