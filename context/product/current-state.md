---
title: Current product and implementation state
status: current
authority: canonical
last_reviewed: 2026-08-15
---

# Current product and implementation state

The current executable artifact is a public-facing, Vietnamese pre-MVP interactive demo of the VMLS Living Registry idea. It is suitable for stakeholder onboarding and pilot-design conversations. It is not a pilot, production system, or statement of approved Vietnam operating policy.

## Current artifact

| Area | Current state | Evidence boundary |
|---|---|---|
| Product narrative | Demonstrates durable Property identity, a separate sale Listing, a separate property-sale Transaction, provenance, authorization signals, and append-oriented history | Product direction is canonical; exact transaction behavior remains a **PROPOSAL** |
| Journey | Implements the common path and both outcomes described below using the `vmls-process-v2` proposal | No legal, tax, authority, or integration behavior is approved by the demo |
| Audience | Optimized for senior stakeholder walkthroughs and pilot-design discussion | **PROPOSAL**, pending pilot participants and success measures |
| Runtime | Static Vite/React client with configured mock data and a reducer/state machine | **FACT** for this repository build |
| Persistence and navigation | Versioned browser `localStorage` and hash routes for dossier, role, and pilot views | Demo convenience only; not governed persistence or authorization |
| Deployment target | `vmls.housenow.com.vn` | Target environment; deployment status must be verified separately |

Historical Phase 5–6 plans and [ADR 0001](../decisions/0001-local-mvp-architecture.md) describe the replaced Node/SQLite exploration slice. They remain useful design history but do not describe the current executable runtime.

## Implemented demo journey

The demo keeps two independent dossiers and never reuses their `NPID`, `PLID`, or `PTID` identities:

- Sun Grand City Thụy Khuê Residence, Unit S2-12A → Developer/HĐMB route.
- A fully synthetic landed Property → VPĐKĐĐ route.

The gated common path is:

```text
Môi giới khớp Bất động sản và yêu cầu xác nhận
→ Người bán xác nhận đại diện qua bàn giao VNeID mô phỏng
→ VMLS khởi tạo Tin bán / PLID ở trạng thái “Đã khởi tạo”
→ ghi nhận Người mua và xác minh sẵn sàng công chứng
→ VPCC nộp hồ sơ, có thể yêu cầu bổ sung một lần, rồi ghi nhận ký
→ VMLS tạo tham chiếu Giao dịch / PTID, ghi sự kiện thuế và tự định tuyến
→ VPĐKĐĐ phê duyệt hoặc Chủ đầu tư tiếp nhận, xác nhận chuyển nhượng và trả HĐMB mới
→ hồ sơ sống được cập nhật
```

Brokerage (`Sàn môi giới`) and Bank (`Ngân hàng`) receive optional projections over the same records; they are not numbered v2 stages. VMLS, Văn phòng công chứng, and Văn phòng đăng ký đất đai are grouped as simulated system/external workspaces rather than additional market actors.

## Data, integration, and security boundary

- **FACT:** All demo data is bundled, synthetic or masked. The supplied apartment chronology is normalized to August 2026, and its `69,2 m² thông thủy` and `82,3 m² tim tường` values retain distinct source concepts.
- **FACT:** There is no server, database, API, authentication, authorization service, analytics, or live third-party integration in the current build.
- **FACT:** Browser `localStorage` retains only editable demo progress. Reset restores configured sample state; browser state must not be treated as an Audit Event store.
- **PROPOSAL:** VNeID, VPCC, tax, VPĐKĐĐ, Developer Portal, 357, and HouseNow touchpoints demonstrate a possible orchestration experience only.
- **PROPOSAL:** PTID is a VMLS demo reference that could later map to an official identifier; it is not presented as one today.
- **FACT:** The dated 357 homepage capture is attributed external reference material, not evidence of endorsement or connectivity. HouseNow appears only as a demo distribution channel.

## Open approval gates

1. **OPEN QUESTION:** Which pilot buyer, locality, segment, organizations, daily users, and measurable risk should the first pilot validate?
2. **OPEN QUESTION:** Which Vietnam Listing, representation, notarization, tax, transfer, and completion rules are approved?
3. **OPEN QUESTION:** Which organization has authority over canonical Property/Parcel/Project/Unit identity and source conflicts?
4. **OPEN QUESTION:** Which Public, Industry, Restricted, purpose, consent, retention, and oversight policies apply?
5. **OPEN QUESTION:** Which identity providers, official identifiers, integration contracts, operational SLAs, security controls, and legal reviews are required for a pilot?

Implemented demo behavior remains non-authoritative whenever it differs from an accepted, locked, or canonical decision.
