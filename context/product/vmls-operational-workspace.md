---
title: VMLS operational workspace contract
status: proposal
authority: working
last_reviewed: 2026-08-15
---

# VMLS operational workspace contract

## Purpose

`PROPOSAL`: The public pre-MVP should behave like a usable data and operations product. Its landing is a registry workbench: a stakeholder understands VMLS by searching records, inspecting linked identities and external touchpoints, then entering role-owned work and observing state changes. The interface must not rely on marketing-only sections, a guided narrative, numbered presentation stages, or policy disclaimers to explain the product.

This document uses [v2](./vmls-process-v2.md) as the proposed business sequence and [v3](./vmls-process-v3.md) as the list/detail navigation reference. It does not approve the legal, tax, identity, notarization, land-registration, Developer, or integration contracts represented by those sources.

## Interface rules

1. Open directly to the current role's work queue.
2. Use one persistent application shell: product, location/workspace context, global search, current role/user, and role-scoped sidebar.
3. Render data, status, validation, ownership, due dates, actions, and results. Do not render product-story copy or evidence-governance labels.
4. Every metric is a filter, every identifier opens its object, every status comes from record state, and every action opens a drill-down or submits a guarded command.
5. Role switching is a preview mechanism in the account/workspace control. It is never the “next step” of a dossier.
6. System-derived changes occur automatically and appear as events. VMLS itself is not a user that clicks automation buttons.
7. Keep `NPID`, `PLID`, `PTID`, representation ID, VPCC dossier ID, source record IDs, and external result IDs visibly distinct.
8. Preserve brand through typography, color, spacing, and status semantics. Decorative elements must not displace working data.

## Default entry contract

The root route is the public registry workbench. Its first viewport must provide real search across configured dossier data, one selected record, the NPID/PLID/PTID relationship, current work, and a direct workspace entry. Counts and statuses are derived from reducer state; no market-scale KPI is invented.

The Môi giới queue remains the default operational workspace. `Mở không gian làm việc` enters that queue unless the viewer selects another role. Existing direct hash routes remain valid and bypass the public landing.

### Header

- VMLS brand and current workspace.
- Search by dossier, project/location, `NPID`, `PLID`, or `PTID`.
- Current role and role switch.
- Notifications if they map to work items.
- `Đặt lại dữ liệu` as a utility action, not primary navigation.

### Queue toolbar

The toolbar supports search plus filters for actionable state, current status, route, responsible role, and priority where the active role may use them.

Summary metrics are derived from the same visible rows and act as filters:

- Tất cả;
- Việc của tôi;
- Đang chờ bên khác;
- Có vướng mắc;
- Đã xong.

### Queue table

| Column | Operational meaning |
|---|---|
| Bất động sản | Recognizable record title or project/unit context |
| NPID | Durable Property identity; opens the property tab |
| PLID | Listing identity when created; empty before seller confirmation |
| PTID | Transaction identity when created; empty before a valid signing result |
| Việc cần làm | The next derived work item, not a narrative stage label |
| Trạng thái | Current aggregate status derived from object lifecycles |
| Phụ trách | Role responsible for the next accepted command |
| Cập nhật / hạn xử lý | Time context for operational triage |
| Hành động | Opens the record; it does not mutate data from the table |

Empty values use a concise operational state such as `Chưa có`. They do not explain the product model in prose.

## Role-scoped navigation and jobs

| Role | Navigation | Commands and decisions |
|---|---|---|
| Môi giới | Công việc, Bất động sản, Tin bán, Giao dịch | Match NPID and sources; send representation request; record buyer |
| Sàn môi giới | Điều phối hồ sơ, Bất động sản, Tin bán | Filter blockers, verify representation/listing state, inspect owner and due date |
| Người bán | Yêu cầu và tài liệu, Bất động sản, Tin bán | Confirm representation; provide an exact requested document |
| Người mua | Hồ sơ mua, Giao dịch | Confirm readiness; acknowledge receipt of a new HĐMB |
| Ngân hàng | Hồ sơ được chia sẻ | Inspect only the permitted finance projection after consent |
| Văn phòng công chứng | Công việc, Hồ sơ công chứng | Receive a complete dossier; request a supplement; record signing result |
| Chủ đầu tư | Công việc, Chuyển nhượng HĐMB | Record intake; confirm HĐMB transfer |
| Văn phòng đăng ký đất đai | Công việc, Đăng ký biến động | Record the registration-change result |
| Vận hành VMLS | Theo dõi xử lý, Bất động sản, Tin bán, Giao dịch, Kết nối & nguồn dữ liệu, Nhật ký | Inspect state, correlation, sources, routing, integration events, and audit history |

`PROPOSAL`: These roles and projections are a usability contract for the prototype. Production authorization must evaluate organization, purpose, resource scope, field classification, consent, and time according to [permissions](../domain/permissions.md).

## Record detail contract

Every record detail uses the same structure:

1. Breadcrumb back to the current role's collection.
2. Record title, aggregate status, responsible role, priority, and due date.
3. Linked object strip for NPID, PLID, and PTID. Missing identities are empty states, not disabled story cards.
4. Role-permitted tabs:
   - Tổng quan;
   - Dữ liệu BĐS;
   - Quyền đại diện;
   - Tin bán;
   - Người mua;
   - Công chứng;
   - Chuyển quyền;
   - Lịch sử.
5. `Việc cần làm` panel containing the form for the current role, or a status summary when another role owns the next command.

Restricted tabs and fields are omitted from the projection. They are not rendered and then hidden with explanatory copy.

## Command and payload contract

All commands require the correct role, current object states, and a valid payload. An invalid command is atomic: no object, event, or derived work item changes.

| Command owner | Command | Required payload | Result |
|---|---|---|---|
| Môi giới | Match Bất động sản | Candidate `NPID` and the complete selected source-ID set | Property match state and audit event update |
| Môi giới | Send representation request | Scope, effective start, expiry | Representation becomes `Chờ xác nhận` |
| Người bán | Confirm representation | Explicit acceptance and confirmation reference | Representation becomes confirmed; system automatically creates PLID with status `Đã khởi tạo` |
| Môi giới | Record buyer | Buyer reference, integer agreed price, expected signing date | Readiness becomes `Chờ người mua xác nhận` |
| Người mua | Confirm readiness | Explicit confirmation and all required checklist items; optional finance-sharing choice | Readiness becomes `Đã sẵn sàng công chứng`; bank projection is created only when consent exists |
| VPCC | Receive dossier | Submission reference and complete required document-ID set | VPCC dossier becomes `Đã tiếp nhận` |
| VPCC | Request supplement | Reason code, document type, due date | An owned, recoverable supplement work item is created |
| Người bán | Provide supplement | Document ID, requested type, PDF filename | The same VPCC dossier becomes `Đủ hồ sơ ký`; the original submission remains in history |
| VPCC | Record signing result | Result reference, August 2026 signing timestamp, document digest | System automatically creates PTID, records tax/integration events, and derives the route |
| VPĐKĐĐ | Record registration result | Result reference, effective timestamp, buyer reference | Property and transaction reflect the registration-change outcome |
| Chủ đầu tư | Receive transfer dossier | Intake reference, received timestamp, document count | HĐMB route enters Developer processing |
| Chủ đầu tư | Confirm HĐMB transfer | Confirmation reference and timestamp | Transaction becomes confirmed; receipt work is assigned to the buyer |
| Người mua | Acknowledge new HĐMB | Receipt reference, received timestamp, explicit acknowledgement | HĐMB route records delivery without adding a separate fake closing action |

## Automatic transitions

The following are not user actions:

### PLID creation

After a valid seller confirmation, VMLS atomically:

- confirms the Representation;
- creates the configured PLID;
- sets Tin bán to `Đã khởi tạo`;
- appends the confirmation and Listing-creation events;
- updates every permitted queue and projection.

This action does not activate or publish the Tin bán.

### PTID creation and routing

After a valid VPCC signing result, VMLS atomically:

- records the signed result and correlation reference;
- creates the configured PTID linked to the existing NPID and PLID;
- appends the configured tax/integration events;
- evaluates the configured transfer basis;
- assigns the record to the VPĐKĐĐ queue or Developer queue.

The user never chooses the route. `PROPOSAL`: the current deterministic bases are HĐMB with Developer and Giấy chứng nhận with VPĐKĐĐ; authorized Vietnam stakeholders must approve the production rule set.

## Separate lifecycle state

The implementation maintains independent state for Property match, Representation, Listing, readiness, notary dossier, Transaction, transfer, integration events, and audit events. A single global “step” must not control all UI.

This separation is required because:

- PLID may exist while readiness remains incomplete;
- the VPCC dossier may require a supplement without changing Property or Listing identity;
- PTID may exist while the receiving organization still has work;
- integration events may retry without overwriting business outcomes;
- each role needs a queue derived from the objects it is allowed to see.

## Source and channel placement

### 357

The 357 homepage capture is a row in `Kết nối & nguồn dữ liệu` with:

- source name and owner;
- public URL;
- category;
- capture and last-check times;
- connection status;
- coverage statement;
- a drawer that displays the locally stored screenshot.

It must not be listed as a source record for either NPID unless a future verified record-level contract supports that claim.

### HouseNow

HouseNow is a row in the Tin bán `Kênh phân phối` table with the supplied icon, permitted field scope, delivery state, and update time when available. The connection registry may also show a dated, read-only capture of the public apartment category next to the outbound field mapping. It must not become an endorsement or separate transaction stage.

### VNeID

VNeID is a representation-confirmation touchpoint. Its connection record describes the request fields prepared by VMLS and the result fields VMLS would record. A dated capture from the official app listing may be shown read-only; the application must not reproduce login, OTP, face verification, or confirmation controls.

## UI content exclusions

The operational interface excludes:

- marketing-only hero sections, unsupported KPIs, or product slogans without a data function;
- “journey”, “explore”, presentation-step, pilot, and completion-story calls to action;
- `FACT`, `SOURCE CLAIM`, `INFERENCE`, `PROPOSAL`, and `OPEN QUESTION` badges;
- repeated statements that the screen is simulated, proposed, fictional, or not legally authoritative;
- prose-only role cards describing what a user could see;
- progress percentages and rails used solely to drive a walkthrough;
- decorative diagrams without a navigation, data, or state function.

Repository documentation and QA reports continue to preserve evidence labels and external-contract boundaries.

## Acceptance criteria

1. First paint is an operational queue with searchable records, status, owner, and next work.
2. Within three interactions, a user can open a dossier and submit its first valid command.
3. Queue metrics and filters are computed from the same projected rows and update after accepted commands.
4. Every editable transition has a payload form and validation; there is no generic “advance” action.
5. PLID creation, PTID creation, tax-event append, and routing require no VMLS-role click.
6. The two records remain independent under action, refresh, persistence replay, and reset.
7. Role switching changes navigation, records, fields, and allowed actions—not only explanatory wording.
8. The Sàn view provides an operational coordination queue. The Bank view contains only consented records and permitted fields.
9. NPID, PLID, PTID, source IDs, dossier IDs, result references, timestamps, and correlation IDs are data, not decoration.
10. VNeID, 357, and HouseNow appear only in the contextual surfaces defined above; all external captures are local and read-only.
11. Every material accepted command appends an audit event; prior submissions and supplement events remain visible.
12. No product-story or evidence-governance wording is rendered in the UI.
