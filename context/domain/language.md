---
title: VMLS domain language
status: current
authority: canonical
last_reviewed: 2026-08-20
---

# VMLS domain language

VMLS standardizes the language used to describe durable real-estate identities, market offerings, participating parties, and traceable data. Terms marked as unresolved in specifications do not become approved policy merely by appearing in this glossary.

## Operational workspace vocabulary

> **PROPOSAL:** These Vietnamese labels and configured identifiers are scoped to the static VMLS operational prototype. They preserve object boundaries while users search, inspect, and process records; they do not establish an official identifier, legal record, production lifecycle, or final Vietnamese domain translation. Repository evidence labels remain in maintained documentation and review artifacts, not in the product interface.

**Bất động sản / NPID**:
The workspace label and configured reference for the durable Property. It persists independently from each Tin bán or Giao dịch. In the V4 demo, the configured 357 source record issues the NPID and VMLS uses it directly; this relationship remains a `PROPOSAL` until an official interface and identifier owner are approved.
_Avoid_: PLID, PTID, Tin bán, Giao dịch, VMLS-generated NPID, established official government identifier

**Tin bán / PLID**:
The sale/transfer-only workspace rendering of a Listing and its separate configured identifier. Status `Đã khởi tạo` means the Listing record exists; it does not mean Active, approved, or publicly distributed.
_Avoid_: Bất động sản, NPID, Giao dịch, PTID, every future Listing type

**Giao dịch / PTID**:
A separate VMLS orchestration reference configured for the prototype and created after the notarization result. It may later map to an official identifier if an approved integration provides one; the configured PTID is not an official code, Closing Record, Property, Listing, or HouseNow billing `Transaction`.
_Avoid_: NPID, PLID, Closing Record, official transaction identifier

**Tuyến chuyển quyền / Transfer Route**:
The branch automatically derived from configured dossier data: VPĐKĐĐ for the synthetic landed Property or Chủ đầu tư/HĐMB for the supplied apartment case. The user does not select the branch, and implementation does not make either route approved Vietnam policy.
_Avoid_: user-selected destination, legal determination, universal Vietnam workflow

**Mã định danh Bất động sản**:
The Vietnamese interface label for the configured `NPID` supplied to the representation request. In this demo the Property is already identified before the Agent starts the request; this field is not a candidate-matching control.
_Avoid_: Mã BĐS, candidate ID, source-record ID

**Mã định danh Người bán / Người mua / Người đại diện**:
The Vietnamese interface labels for the configured `Party.reference` values used across the operational workflow. They remain distinct from the masked identity-document reference such as CCCD shown separately when permitted.
_Avoid_: Mã Người mua, Mã Người bán, Tham chiếu Người mua, CCCD as the Party record ID

**Bản ghi nguồn Bất động sản 357 / PropertySourceRecord357**:
The configured source record from which VMLS receives the NPID and permitted Property claims. It keeps a source record ID, source version, source update time, VMLS receipt time, and field-level claims for project/developer, location, property type, building/unit, named area concepts, and publication state. It excludes owner identity, CCCD, and private transaction history. The V4 demo contract that 357 issues the NPID is a `PROPOSAL`, not evidence of a live or approved interface.
_Avoid_: Bất động sản itself, owner record, live 357 API response, proof of official integration

## Asset identity

**Property**:
A durable identity for a physical or legally recognizable real-estate asset that persists across multiple market offerings.
_Avoid_: Listing, tin đăng, giao dịch

**Parcel**:
A cadastral or legal land unit associated with one or more Properties; the cardinality remains configurable until Vietnam discovery resolves it.
_Avoid_: Property, Listing, Source Record

**Project**:
A governed real-estate development that groups buildings, phases, inventory structure, legal documents, and distribution rights.
_Avoid_: Property, Brokerage

**Unit**:
A marketable product within a Project, such as an apartment, plot, shophouse, or villa; it may be linked to a canonical Property when identity evidence is sufficient.
_Avoid_: Listing, căn đang rao bán

**Property History**:
The append-oriented sequence of Listing, transaction, public-record, correction, and identity events associated with a Property.
_Avoid_: Listing History

## Market offering

**Listing**:
One market offering of a Property or Unit with its own identity, representation basis, transaction type, price, effective period, visibility, responsible party, and lifecycle.
_Avoid_: Property, bài đăng, Closing Record

**Listing Input**:
An editable, unsubmitted work item used to prepare a Listing; it does not have market status or distribution visibility.
_Avoid_: Incoming Listing, Active Listing

**Incoming Listing**:
A submitted Listing with a Listing ID that remains in a restricted preparation or review scope until Active rules are satisfied.
_Avoid_: Listing Input, Active Listing

**Active Listing**:
A Listing that has passed the applicable validation, representation, verification, and approval rules and is discoverable within its permitted distribution scope.
_Avoid_: Property đang tồn tại, Incoming Listing

**Listing Agreement**:
The representation or distribution basis authorizing a Listing, including participating parties, scope, transaction type, consent, and effective period.
_Avoid_: Listing, sale contract

**Listing Status**:
The current governed position of a Listing in its lifecycle.
_Avoid_: Property Status, nhãn tự do

**Listing Status Event**:
An immutable record of an allowed Listing transition, including actor, time, reason, before/after state, and supporting evidence where required.
_Avoid_: sửa trực tiếp status history

**Cấu hình công khai Tin bán / PublicationProfile**:
The field-group policy attached to one PLID that determines its Public projection. It has separate draft and applied versions. PLID, transaction/property type, general area, and the responsible Agent's business contact are locked; price, project/unit, detailed location, named areas, features, description, and images are optional. Public lookup and channel delivery consume only the applied version.
_Avoid_: Industry projection, consent for every channel, frontend-only hiding, editing the source Property

**Yêu cầu chỉnh sửa Tin bán / SellerCorrectionRequest**:
An append-oriented proposal from the owning Seller to change a permitted Listing value. The V4 demo uses `askingPrice`: the Seller records old/new values, the Brokerage applies or rejects the request, and an accepted request creates a new Listing revision. It does not rewrite prior events or the 357 source record.
_Avoid_: direct Seller mutation, Property-source correction, silent downstream update

**Khai báo Người mua / BuyerDeclaration**:
A transaction-scoped declaration created by the Brokerage after the Listing and representation prerequisites are satisfied. It contains the Buyer Party reference, agreed price, and expected signing date; the masked name is resolved from the configured Party record rather than entered again. Its projection is purpose- and role-specific.
_Avoid_: Agent-created buyer record, public Listing field, ownership claim, external-agency identity payload

**Closing Record**:
The permitted record of a completed transaction outcome related to a Listing, kept separate from Property and Listing identities.
_Avoid_: Listing, Property History

## Parties and authority

**Primary Market Actor**:
A product-experience perspective for one of the six participants in the locked market scope: Real-estate Agent, Brokerage, Developer, Buyer, Owner/Seller, or Bank. For an organizational actor such as a Brokerage, Developer, or Bank, the authenticated User still acts through a scoped Membership and Role.
_Avoid_: operational administrator, universal authorization role, every Party subtype

**Operational Role**:
A scoped platform or organization responsibility such as Data Steward, Organization Admin, or System Admin. It is not counted as a Primary Market Actor and never implies blanket access to business data.
_Avoid_: seventh market actor, superuser, unrestricted admin

**Party**:
A person or organization participating as owner, seller, buyer, landlord, tenant, representative, distributor, lender, or authority.
_Avoid_: User, Agent, Owner mặc định

**Organization**:
A governed participant boundary such as a brokerage, developer, bank, regulator, or HouseNow operations team.
_Avoid_: User group, Party role

**Membership**:
A time-bounded relationship granting a User a role and scope inside an Organization.
_Avoid_: User, role toàn hệ thống

**Role**:
A named bundle of baseline capabilities held through a Membership; it never grants universal access by itself.
_Avoid_: permission, chức danh toàn hệ thống

**Entitlement**:
The effective authority to perform an Action on a Resource within a Scope and Purpose during a defined period.
_Avoid_: Role, menu visibility

**Purpose**:
The declared, policy-recognized reason for accessing or using data in a specific workflow.
_Avoid_: free-text justification, role name

**Consent**:
A revocable and time-bounded authorization from a data subject or authorized Party for specified data, Purpose, and recipient.
_Avoid_: account relationship, permanent permission

**Access Request**:
A request for a new or temporary Entitlement that records requester, Resource, Field Classification, Purpose, duration, and decision.
_Avoid_: support ticket, automatic access

**Organization Admin**:
An operational role that manages Memberships and Entitlements within one Organization without gaining additional business-data visibility by default.
_Avoid_: System Admin, Brokerage, full-access user

**System Admin**:
A HouseNow operational role that governs platform identity, Organizations, policy, integrations, and service state without blanket access to business data.
_Avoid_: Data Steward, superuser with unrestricted data access

**Data Steward**:
An operational role that resolves identity, source, duplicate, taxonomy, and quality cases within an assigned Scope.
_Avoid_: System Admin, Organization Admin

**Break-glass Access**:
A temporary exceptional Entitlement to Restricted Fields that requires an explicit Purpose, reason, bounded duration, approval, and immutable Audit Events.
_Avoid_: permanent admin access, silent override

**Representation**:
The time-bounded authority for an Agent or Organization to act for a Party in a defined transaction or distribution scope.
_Avoid_: Ownership, Membership

**Đăng ký cùng bán / CoBrokerRegistration**:
A separate, time-bounded record that an eligible Agent has joined the permitted cooperation scope of an existing Listing. It never creates, replaces, or extends the seller's Representation and never grants access to Restricted seller data.
_Avoid_: Representation, Listing Agreement, seller consent, ownership of the Listing

**Nguồn hàng được đại diện / Represented Listing Inventory**:
An Industry projection of Listings that have an existing PLID, a confirmed and effective Representation, and an explicit cooperation scope. It is a searchable inventory view, not a Property registry or a list of every created Listing.
_Avoid_: all Properties, every `Đã khởi tạo` Listing, public portal inventory

**Phân phối Tin bán / Listing Distribution**:
The guarded delivery of an approved Public projection of one Listing to a named downstream channel under an effective channel consent. It is independent from Representation and CoBrokerRegistration.
_Avoid_: publishing the full Listing record, confirming a live integration, transferring ownership

**Distribution Event**:
An append-oriented record of an outbound delivery attempt for a Listing and channel, including actor, time, projection version, delivery status, and channel acknowledgement state.
_Avoid_: Listing Status Event, live-channel success without acknowledgement, mutable sync flag

**Cần cập nhật / Channel reconciliation state**:
The local status used when an applied Listing revision differs from the projection version previously sent to a channel. It creates a reconciliation event and indicates that another delivery may be needed; it never asserts that the external channel changed automatically.
_Avoid_: remotely updated, published, synchronized successfully

**Distribution Assignment**:
The authority granted by a Developer or authorized Party to an Organization to distribute specified Project or Unit inventory.
_Avoid_: Listing Agreement, Organization Membership

## Trust and governance

**Data Source**:
The origin of a record or field, including source key, retrieval time, effective time, confidence, and editability.
_Avoid_: Verification, source name as plain text only

**Hồ sơ xử lý ngoài VMLS / ExternalProcessingCase**:
A VMLS projection of a dossier processed in an external source system such as VPCC, VPĐKĐĐ, or the tax system. It links the VMLS case to the source case identifier and processing organization without granting the external role a VMLS business command.
_Avoid_: VMLS-owned authority case, editable agency workflow, transaction Audit Event

**Sự kiện trạng thái ngoài VMLS / ExternalStatusEvent**:
An immutable inbound source event containing source system, source case, raw status, normalized status, source update time, VMLS receipt time, and idempotency identity. Duplicate events are ignored and older events cannot move the normalized state backwards.
_Avoid_: user-created Audit Event, mutable status field, direct VPCC/VPĐKĐĐ/Tax command in VMLS

**Trạng thái xử lý chuẩn / ProcessingProjection**:
The role-scoped summary derived from external events using `Chờ tiếp nhận`, `Đang xử lý`, `Yêu cầu bổ sung`, or `Đã xử lý`, together with the unit currently processing the dossier. It is a milestone, not an invented completion percentage.
_Avoid_: source system of record, SLA guarantee, workflow action

**Hồ sơ thuế / TaxDossier**:
The tax-source processing case created from the configured outbound handoff after the final notarization event. It progresses in parallel with transfer routing and does not gate the Developer or VPĐKĐĐ route in the demo.
_Avoid_: proof that tax obligations are settled, manual tax action in VMLS, universal legal rule

**Phiên VNeID cục bộ / Local VNeID session**:
A versioned browser record created by the demo's two-step VNeID handoff. It stores only a masked configured identity and accepted sharing scope, persists independently from business-state reset, and neither authenticates against VNeID nor changes VMLS role or entitlements.
_Avoid_: production authentication, OTP exchange, live VNeID session, permission grant

**Verification**:
A time-bounded assessment of identity, authority, document, or data claims against defined evidence and rules.
_Avoid_: permanent truth, Data Source

**Provenance**:
The traceable relationship between data, its sources, transformations, actors, and effective time.
_Avoid_: Audit Event

**Audit Event**:
An immutable record of a material action or decision, including actor, organization, time, reason, target, and before/after values where applicable.
_Avoid_: activity feed, mutable note

**Data Issue**:
A structured claim that data is missing, stale, conflicting, duplicated, unauthorized, or incorrect and requires investigation or correction.
_Avoid_: generic support ticket

**Merge Decision**:
An auditable decision that two or more candidate records represent the same canonical entity while preserving source records and history.
_Avoid_: delete duplicate

## Visibility

**Public Field**:
A field permitted for consumer-facing distribution under current consent and policy.
_Avoid_: every field on a Listing

**Industry Field**:
A field available only to authenticated industry participants with an appropriate role and scope.
_Avoid_: Public Field, Restricted Field

**Restricted Field**:
A field available only for a specific purpose, actor, organization, authority, or consent scope and protected across UI, API, search, export, analytics, and logs.
_Avoid_: field hidden only in the interface

**Projection**:
The authorized field-level representation of a Resource returned to a consumer after Role, Scope, Purpose, Consent, and policy are evaluated.
_Avoid_: frontend-only hiding, full record with masked CSS

## Analysis

**CMA Report**:
A versioned comparative market analysis created for a Subject Property from a human-reviewed set of Comparable records.
_Avoid_: official valuation certificate

**Comparable**:
A Listing or Closing Record deliberately selected as relevant evidence for a CMA Report.
_Avoid_: every nearby Property

**Subject Property**:
The Property being analyzed in a CMA Report.
_Avoid_: Comparable, necessarily Active Listing
