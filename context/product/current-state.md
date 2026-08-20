---
title: Current product and implementation state
status: current
authority: canonical
last_reviewed: 2026-08-21
---

# Current product and implementation state

The executable artifact is a Vietnamese, client-only VMLS V5 demo focused on one titled-property transaction in Phú Thượng:

```text
HouseNow Listing snapshot
→ Môi giới khai báo giao dịch đã công chứng
→ Thuế
→ VPĐKĐĐ
→ Người mua nhận thông báo lấy Giấy chứng nhận
```

It demonstrates linked identities, source provenance, transaction reconciliation, sequential external-processing projection, and role-scoped notifications. It is not an official registry, legal-policy specification, tax calculator, agency workflow, production integration, or proof that a named external system exposes an API.

`SOURCE CLAIM`: The supplied process image and meeting/demo discussion describe a transfer sequence involving notarization, tax obligations, and land-registration processing. They have not been independently validated as an approved Vietnam legal workflow.

`PROPOSAL`: V5 adopts the sequence below as a deterministic demo contract. Implemented behavior does not promote the source claim into legal policy.

## Current artifact

| Area | Current state | Evidence boundary |
|---|---|---|
| Public entry | Living Registry landing with the headline “Một định danh. Mọi nguồn dữ liệu. Một hành trình có thể truy vết.”, registry search, and a data-network hero | `PROPOSAL` interface; the local build and assets are directly inspectable |
| Public catalogue | Four to five configured Listings with Phú Thượng prioritized; only allowlisted NPID, PLID, Listing facts, and provenance are returned | Synthetic/configured data only; no PTID, party, contract, or processing state is Public |
| HouseNow source | A versioned `HouseNowListingSnapshot` is linked to the Phú Thượng Listing | `PROPOSAL`; it is a deterministic local fixture, not a live export, feed, or publication acknowledgement |
| Transaction declaration | The responsible Agent submits a post-notarization declaration with Buyer reference, value, contract/notary facts, and document metadata | `PROPOSAL` command ownership and data contract; document bytes are not stored |
| Transaction identity | A successful declaration atomically creates the `Transaction` and VMLS PTID, Tax handoff, Audit Event, and Integration Event | `PROPOSAL`; PTID is a demo orchestration reference, not an official identifier or Closing Record |
| 357 source | VMLS Ops may import one configured `TransactionSourceRecord357` and reconcile it against the Agent declaration field by field | `PROPOSAL`; source records remain separate and 357 never overwrites the declaration |
| External status | One VMLS Ops control advances exactly one configured Tax/VPĐKĐĐ event in a six-event linear sequence | `PROPOSAL`; no live Tax or VPĐKĐĐ request is made |
| Notifications | Tax-due work is delivered to the Seller; completion/collection work is delivered to the Buyer | Local inbox/work-item behavior only; it does not prove legal service or agency delivery |
| Runtime accounts | Môi giới, Sàn môi giới, Người bán, Người mua, and Vận hành VMLS | Demo account switcher only, not authentication or production entitlement |
| Runtime | Static Vite/React client with configured fixtures and reducer/state machines; no backend, database, analytics, or live API | `FACT` for this repository architecture |
| Persistence | Versioned V5 browser store replays the demo; malformed, incompatible, or tampered state fails closed to the initial fixture | Browser convenience only, not authoritative persistence |
| Deployment target | `vmls.housenow.com.vn` | Deployment status must be verified separately |

Historical Phase 5–6 plans and [ADR 0001](../decisions/0001-local-mvp-architecture.md) describe a replaced Node/SQLite exploration slice. [Transaction flow v2](./vmls-process-v2.md) and [transaction screens v3](./vmls-process-v3.md) are retained as superseded design history; they do not control V5.

## Information architecture

The public landing provides:

- standalone VMLS branding and Living Registry visual language;
- an allowlisted search across configured NPID, PLID, location, and safe Listing facts;
- a network visualization connecting NPID, PLID, PTID, HouseNow, 357, Tax, and VPĐKĐĐ concepts without revealing a private transaction;
- `Mở tài khoản demo`, followed by an account switcher containing exactly five runtime accounts;
- unread counts scoped to the selected account.

The authenticated demo workspace provides:

- one assigned Phú Thượng dossier and post-notary declaration form for the Agent;
- organization-level read-only monitoring for the Brokerage;
- recipient-scoped inbox, work items, and safe transaction milestones for Seller and Buyer;
- source records, reconciliation, event history, and two independent synchronization controls for VMLS Ops.

Bank, Developer, VPCC, Tax, VPĐKĐĐ, agency-operation, VNeID, represented-market governance, and Developer-transfer workspaces are not navigable V5 runtime roles. Their canonical actor/domain distinctions and historical modules remain in the repository; runtime removal does not erase them from the broader product model.

Legacy or unknown hashes fail closed to the landing. They must not silently grant the Agent projection or select another role.

## Role jobs and command ownership

| Runtime account | V5 job |
|---|---|
| Môi giới | Inspect the assigned HouseNow Listing snapshot, submit the post-notary transaction declaration, and monitor the resulting PTID |
| Sàn môi giới | Monitor the Organization's Listing/transaction and derived milestones; no declaration or approval gate |
| Người bán | Receive and open the tax-obligation notification/work item; inspect only the permitted Seller projection |
| Người mua | Inspect only the permitted Buyer projection and receive/open the completion notification to collect the updated certificate at VPĐKĐĐ |
| Vận hành VMLS | Inspect provenance and histories, synchronize the configured 357 transaction record once, review reconciliation, and advance the next configured external event |

`PROPOSAL`: This ownership split is the V5 demo contract, not an approved Vietnam responsibility matrix. Production authorization still requires User, Membership, Organization, Role, Purpose, Resource, Action, Scope, field classification, consent, and effective time as defined in [permissions](../domain/permissions.md).

## Record and event model

V5 keeps these records separate:

- `Property` / NPID: durable asset identity;
- `Listing` / PLID: market offering;
- `HouseNowListingSnapshot`: immutable configured source snapshot with external Listing ID, version, and source/VMLS timestamps;
- `TransactionDeclaration`: the Agent's post-notary declaration and document metadata;
- `Transaction` / PTID: VMLS orchestration record created from an accepted declaration;
- `TransactionSourceRecord357`: independent transaction source record imported later by Ops;
- `ReconciliationResult`: per-field comparison between the VMLS declaration and 357 record;
- Tax and VPĐKĐĐ `ExternalProcessingCase` records and immutable `ExternalStatusEvent` history;
- two separate financial-obligation rows for personal income tax and registration fee;
- recipient-scoped notifications and work items;
- user Audit Events and system/integration events, retained as separate append-oriented histories.

The V5 runtime does not create `BuyerDeclaration`, a notary-processing case, a transfer-route branch, or a `ClosingRecord`. Buyer reference is one restricted field of the transaction declaration. `NPID`, `PLID`, `PTID`, external source IDs, contract IDs, and event IDs are never used interchangeably.

### HouseNow and 357 provenance

`PROPOSAL`: The HouseNow snapshot is evidence of the Listing input used by this demo. It never becomes the Property itself and is not edited when the transaction progresses.

`PROPOSAL`: The 357 record is a transaction source received after declaration. VMLS stores source transaction ID, NPID, contract facts, transaction value, masked Buyer/Seller values, notary organization, source timestamp, and VMLS receipt timestamp. It remains distinct from both the HouseNow snapshot and Agent declaration.

Reconciliation returns one result per configured comparable field:

- `matched`;
- `mismatched`;
- `missing_in_vmls`;
- `missing_in_357`.

A mismatch or missing value is visible to Ops but does not overwrite either source and does not block the Tax/VPĐKĐĐ sequence. The main Phú Thượng fixture reconciles successfully.

## V5 lifecycle

### Declaration

The Agent submits the configured PLID with Buyer reference, whole-VND transaction value, contract number/date, notary organization/date, and file metadata. The notarized transfer contract PDF is required; the deposit contract PDF is optional. Only filename, media type, size, and configured reference metadata are retained.

An accepted `SUBMIT_TRANSACTION_DECLARATION` atomically:

1. takes NPID, PLID, and Seller from the configured Listing;
2. appends the declaration;
3. creates PTID and Tax case/handoff;
4. appends one Audit Event and one Integration Event.

The command is Agent-only, exact-shape validated, and one-shot for the configured Listing. Wrong actor, Listing, document type, missing/extra field, or duplicate submission leaves all state unchanged.

### Independent synchronization controls

After declaration, VMLS Ops has two controls:

- `Đồng bộ từ 357` imports the configured transaction record once and produces reconciliation. It is independent from external-status progression.
- `Đồng bộ từ Thuế và VPĐKĐĐ` previews and applies exactly the next valid configured event. The UI cannot choose an arbitrary source or status.

The external sequence is:

| Event | Result and side effect |
|---:|---|
| 1 | Tax has received the dossier; an appointment/awaiting-obligation notice is available |
| 2 | Financial obligations require action; one Seller notification and external-work item are created |
| 3 | `Đã đóng thuế TNCN` and `Đã đóng lệ phí trước bạ` are recorded separately; the Seller work item closes and the VPĐKĐĐ handoff is created |
| 4 | VPĐKĐĐ has received the administrative dossier for title transfer |
| 5 | VPĐKĐĐ is processing the administrative procedure |
| 6 | Transfer processing is complete; PTID completes and one Buyer notification/work item directs collection of the updated certificate at VPĐKĐĐ |

There is no VPĐKĐĐ case before both obligation rows complete. Duplicate, stale, skipped, exhausted, or malformed event commands are atomic no-ops and cannot regress state.

## Projection and notification boundary

- Public search uses an explicit allowlist and never serializes PTID, parties, document metadata, contract facts, financial-obligation detail, notifications, work items, or internal events.
- Agent sees the assigned Listing snapshot, full declaration needed for the job, and safe processing milestones.
- Brokerage sees its Organization's safe monitoring projection and cannot mutate the transaction.
- Seller and Buyer see only their own safe transaction projection and recipient-scoped inbox/work items. Neither sees the other party's private reference.
- Seller notification says that financial obligations require action; it shows no amount and makes no assertion about which party legally owes a particular charge.
- Buyer completion is a notification/work item, not an acknowledgement that a certificate was collected.
- Ops alone sees the two source records, per-field reconciliation, external cases/events, and synchronization controls.

Opening a notification marks only that recipient's item read and routes to the permitted dossier projection. Role switching alone never advances the lifecycle or marks an item read.

## Persistence and reset

- Journey state uses a dedicated V5 key such as `vmls:phu-thuong:2026-08:v5` and an exact versioned schema.
- V4 command logs are incompatible and are never replayed into V5 semantics.
- After V5 initializes successfully, only the explicitly named legacy demo/market/VNeID keys are removed; unrelated browser storage is untouched.
- Reload and valid direct routes restore the same projection, unread counts, reconciliation, and processing index.
- Invalid payloads, actors, action logs, schema versions, or routes fail closed to the initial fixture/landing.
- `Đặt lại dữ liệu` restores the Listing ready for declaration, removes V5 transaction progress and notifications, and returns to the public landing.
- Fixture timestamps are deterministic; the interface labels them `Bộ dữ liệu mẫu` instead of presenting a future date as a live observation.

## Data, integration, and approval boundary

- `FACT`: The executable is client-only; identities, source organizations, Listing records, documents, events, and notifications are synthetic or masked.
- `FACT`: Bundled HouseNow/357 materials are local reference assets and make no external request.
- `SOURCE CLAIM`: The supplied process image and meeting flow state a notarization → Tax → land-registration sequence.
- `PROPOSAL`: Post-notary Agent declaration, PTID timing, HouseNow snapshot, 357 reconciliation, six-event sequence, financial-obligation labels, and notification timing are deterministic V5 demo contracts.
- `OPEN QUESTION`: Official identifier owners, legal state transitions, responsibility for each tax/fee, official message schemas, source authority, integration security, retries, SLAs, retention, and completion evidence require authorized stakeholder approval.

Evidence labels remain in maintained documentation and QA artifacts. The product interface communicates the boundary with source labels, timestamps, honest local states, read-only projections, and absence of unsupported actions; it does not render evidence badges or legal disclaimers as product copy.
