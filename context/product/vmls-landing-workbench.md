---
title: VMLS public registry workbench
status: current
authority: working
last_reviewed: 2026-08-15
evidence_labels:
  - FACT
  - PROPOSAL
  - OPEN QUESTION
---

# VMLS public registry workbench

## Evidence boundary

- `FACT`: The executable is a static Vite/React client with two configured, masked dossiers and versioned browser persistence. It has no authentication, database, live registry, or external API.
- `FACT`: The root route is a data-first landing workbench. Existing `#/vai-tro/...` routes remain the role-scoped operational product.
- `FACT`: The [Living Registry board](../brand/assets/vmls-living-registry.png) and [brand direction](../brand/README.md) are the canonical visual references.
- `FACT`: VNeID, the Ministry of Construction portal, and HouseNow appear as dated, read-only external-system records. Their local screenshots do not establish a live connection or record-level provenance.
- `OPEN QUESTION`: Production public-search scope, authorization, source contracts, coverage, and SLA remain unresolved.

Evidence labels govern this document. They do not appear in product copy.

## Product job

The landing gives a first-time visitor a usable entrance to the VMLS data product without turning the interface into a presentation sequence. It supports five concrete jobs:

1. Search the configured public projection by existing identifier or recognizable Bất động sản context.
2. Distinguish Bất động sản/`NPID`, Tin bán/`PLID`, and Giao dịch/`PTID` as separate lifecycle objects.
3. Inspect the current public status, next public milestone, transfer basis, and derived route for a selected record.
4. Inspect the field scope and factual status of VNeID, 357, and HouseNow in read-only drawers.
5. Open the correct role queue, open an allowed role projection, or resume the last valid workspace destination.

It contains no testimonials, decorative KPI claims, guided story, numbered presentation steps, fake integration actions, or general `Khám phá` CTA.

## Implemented information architecture

| Route | Behavior |
|---|---|
| `#/` | Landing with an empty search input and the first configured public record selected |
| `#/tra-cuu?q=<query>` | Search result with query retained through refresh and browser navigation |
| `#/tra-cuu/<case-key>` | Selected public record; unknown or malformed keys show a recoverable no-result state |
| `#/vai-tro/<role-id>/cong-viec` | Existing role-scoped work queue |
| `#/vai-tro/<role-id>/ho-so/<case-token>/<tab>` | Existing role-scoped dossier projection |

The public case key is only a static-demo route key. Bank operational details continue to use the opaque consent share token. The landing never falls back from a selected role to an Agent dossier.

## First viewport

At `1440 × 900` and `1024 × 768`, the first viewport contains:

- the VMLS mark with subordinate `by HouseNow` origin line;
- navigation to `Hồ sơ` and `Điểm nối`;
- the role selector and workspace/resume action;
- the page heading `Tra cứu và điều phối hồ sơ`;
- a real search form;
- the selected public record;
- the separate `NPID` / `PLID` / `PTID` identity trace;
- public next-work, transfer, and deadline data.

The heading is an interface label, not a marketing promise. The first viewport uses no generic real-estate image because the configured records do not provide an approved record image.

## Component-to-job contract

| Component | Data | Job | Interaction |
|---|---|---|---|
| Search | Public allowlist over current persisted state | Find one of the configured records | Submit query; URL, selected result, and focus update |
| Selected record | Public projection | Inspect current object identities and public lifecycle | Read identifiers; open the selected role projection when allowed, otherwise open that role's queue |
| Identity trace | Existing Property, Listing, Transaction objects | Distinguish three independent lifecycles | Read-only; `Chưa có` remains non-interactive |
| Dossier table | Same public projection as search | Compare the two configured records | Select a record and update the selected panel/URL |
| Session snapshot | Currently displayed records | Understand the scope of the current result set | Read-only derived counts; never a market KPI |
| Role summary | Role projections over current state | Check scope, actionable work, and blockers before entering | Change role and open/resume its queue |
| External registry | Configured integration records | Inspect owner, direction, field groups, status, source and date | Open a read-only drawer or the original public URL |

A component may be read-only when its job is to communicate a record value. It must not be styled as an action unless it performs one.

## Search and public projection

The client-side index contains only:

- existing `NPID`;
- existing `PLID` after Tin bán creation;
- existing `PTID` after Giao dịch creation;
- configured public title;
- Bất động sản name and type;
- Project and Unit labels;
- generalized demo location.

It excludes dossier identifiers, Party names and references, contact and identity data, representation references, finance data, Bank share tokens, documents, supplement details, audit/integration payloads, and correlation identifiers.

The landing consumes `projectStateForPublic(state)`, an explicit nested allowlist. It does not receive a full operational state and hide fields with CSS.

Public status and next work are also allowlisted. A notary supplement is generalized to `Đang xử lý công chứng` / `Hoàn tất công chứng`; its reason, document type, responsible Party, and supplement due date do not cross the boundary.

Search behavior:

- matching is accent-insensitive and case-insensitive;
- missing future `PLID`/`PTID` values cannot be found;
- search does not mutate dossier state or add an Audit Event;
- query, result, refresh, browser Back, and direct-case routes stay consistent;
- clearing a no-result query returns to `#/`;
- malformed encoded case routes show no result instead of selecting a default record.

## Role access and resume

- The selected landing role is stored with the versioned browser state and survives query-route remounts and refresh.
- The top and bottom workspace actions enter the selected role's queue.
- When the selected role matches a stored valid destination, the action becomes `Tiếp tục công việc` and returns to that exact queue or dossier route.
- `Mở hồ sơ · <Vai trò>` appears only when that role has a projection for the selected record.
- When the role has no projection, the action becomes `Xem hàng đợi · <Vai trò>`.
- A consented Bank dossier uses its opaque share token. An unconsented Bank never receives an Agent route or private dossier fields.

## External-system records

All three records share the same useful fields: name, owner, relationship, direction, factual status, outbound field groups, inbound field groups, original URL, capture date, and local screenshot.

The drawers contain no login, OTP, biometric, confirmation, connection, synchronization, publication, or API-success controls.

### VNeID

| Field | Value |
|---|---|
| Relationship | `Điểm xác nhận người bán` |
| Direction | `Nhận kết quả xác nhận` |
| Data sent | `Mã yêu cầu`, `Mã định danh Bất động sản`, `Phạm vi đại diện`, `Thời hạn hiệu lực` |
| Data received | `Kết quả`, `Thời điểm xác nhận` |
| Status | `Chưa kết nối` |
| Read action | `Xem dữ liệu bàn giao` |
| Local visual | Dated official Google Play listing capture |

### Hệ thống thông tin về nhà ở và thị trường bất động sản

| Field | Value |
|---|---|
| Relationship | `Nguồn tham chiếu công khai` |
| Direction | `Tham chiếu nguồn` |
| Data sent | `Không có` |
| Data received | `Chưa có dữ liệu cấp hồ sơ` |
| Status | `Chưa cấu hình` |
| Read action | `Xem ảnh chụp` |
| Local visual | Dated homepage capture from [thongtinbds.moc.gov.vn](https://thongtinbds.moc.gov.vn/) |

The capture is not attached to either `NPID` as source evidence.

### HouseNow

| Field | Value |
|---|---|
| Relationship | `Kênh phân phối Tin bán` |
| Direction | `Chuẩn bị dữ liệu gửi` |
| Data sent | `PLID`, title, price, Bất động sản fields, selected content and images |
| Data received | Delivery status and update time |
| Status | `Chưa phát hành` |
| Read action | `Xem phạm vi phân phối` |
| Local visual | Supplied exact icon and dated [apartment category](https://www.housenow.com.vn/can-ho-chung-cu) capture |

The selected Tin bán is not represented as published on HouseNow.

## Visual system

The implementation uses the canonical brand system as an interface system:

| Function | Token |
|---|---|
| Display heading | Be Vietnam Pro ExtraBold |
| Interface copy | IBM Plex Sans |
| Identifiers and time | IBM Plex Mono |
| Structure | Registry Green `#0D5142` |
| Page field | Archive Ivory `#F3EFE5` |
| Record surfaces | Paper White `#FCFBF7` |
| Primary text | Ledger Ink `#17211D` |
| Identity/lifecycle trace | Mint Trace `#6BCBB1` |
| Primary action | Coral Signal `#F06445` |
| Border/secondary | Patina `#6D8E82` |
| Warning | Amber `#C88A2C` |

Cadastral linework appears only in the selected-record surface. Mint connects actual related identities. Coral is reserved for the main workspace action. The HouseNow icon appears only in the distribution record and Tin bán channel.

## Responsive and accessibility contract

- `1440 × 900`, `1024 × 768`, and `390 × 844` have no document-level horizontal overflow.
- At `390 × 844`, search and workspace controls are at least `44px` high and the identity trace stacks vertically.
- Data tables become labeled record rows on mobile without discarding business fields.
- Search submission focuses the selected-result heading.
- Drawer opening focuses its heading; Tab is trapped; Escape closes and restores trigger focus.
- Visible focus, status text, contrast, and reduced motion are preserved.
- JavaScript scrolling uses `auto` when `prefers-reduced-motion: reduce` is active.
- Fonts, icons, and screenshots are local; normal use requires no third-party request.

## Final video contract

The final walkthrough is silent, `1920 × 1080`, and 15–18 minutes. It starts on the landing, performs real local search and workspace actions, completes both configured transfer routes, and uses VNeID, 357, and HouseNow only as read-only context.

The MP4 contains burned-in Vietnamese captions and ships with matching raw WebM and WebVTT. While each local visual is open, the matching exact caption appears:

1. `VNeID là điểm xác nhận người bán bên ngoài VMLS. Video không đăng nhập hoặc thực hiện định danh.`
2. `Cổng 357 được ghi nhận như một nguồn tham chiếu công khai. Ảnh chụp không đại diện cho kết nối dữ liệu cấp hồ sơ.`
3. `HouseNow là một đích phân phối Tin bán. Video chỉ thể hiện phạm vi bàn giao, không đăng tin thật.`

Each external visual remains readable for at least eight seconds. The recording does not open or operate the external websites, and it sends no external mutation request.

## Release gates

1. Root route is the public data workbench; direct role routes still work.
2. Exact ID and property-context searches return only public allowlisted fields.
3. `NPID`, `PLID`, and `PTID` remain distinct and lifecycle-correct.
4. Both configured transfer bases are visible by selecting their record; the route remains system-derived.
5. Role selection, projection, consent, Bank token, and resume behavior are correct.
6. VNeID, 357, and HouseNow drawers use local dated assets, exact field contracts, and no fake actions.
7. Keyboard, focus, reduced motion, contrast, asset loading, and target responsive layouts pass.
8. Unit, lint, typecheck, build, Playwright, independent black-box, preview, and production smoke checks pass.
9. The final captioned video passes duration, resolution, no-audio, content, and frame inspection gates.

## Out of scope

- production public search or national coverage;
- real authentication/authorization;
- live VNeID, 357, HouseNow, VPCC, tax, VPĐKĐĐ, or Developer APIs;
- publishing a real Tin bán;
- real personal data;
- an approved legal or policy workflow;
- marketing testimonials, partner-logo walls, market-size claims, or decorative metrics.
