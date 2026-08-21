---
title: VMLS domain language
status: current
authority: canonical
last_reviewed: 2026-08-21
---

# VMLS domain language

VMLS standardizes the language used to describe durable real-estate identities, market offerings, participating parties, and traceable data. Terms marked as unresolved in specifications do not become approved policy merely by appearing in this glossary.

## Operational workspace vocabulary

> **PROPOSAL:** These Vietnamese labels and configured identifiers are scoped to the static VMLS V5 demo. They preserve object and source boundaries; they do not establish official identifiers, legal records, production lifecycles, integration contracts, or final Vietnamese domain translations. Repository evidence labels remain in maintained documentation and review artifacts, not in the product interface.

**Bất động sản / NPID**:
The workspace label and configured reference for the durable Property. It persists independently from every Tin bán, source snapshot, declaration, and Giao dịch. V5 does not claim that HouseNow or 357 officially issues this identifier.
_Avoid_: PLID, PTID, Tin bán, Giao dịch, HouseNow Listing ID, 357 transaction ID, established government identifier

**Tin bán / PLID**:
The workspace rendering of one Listing and its separate configured identifier. In the V5 proposal, Seller confirmation creates the PLID with status `Đã khởi tạo`. A PLID does not imply that the Listing is Active, approved, published, publicly distributed, sent to HouseNow, or currently synchronized to HouseNow.
_Avoid_: Bất động sản, NPID, HouseNow Listing ID, Giao dịch, PTID

**Yêu cầu xác nhận quyền đại diện / RepresentationRequest**:
An Agent-authored proposal asking the identified Seller to grant a defined representation scope and effective period for an existing Property/NPID. While pending, it is not a Representation and creates no Listing/PLID.
_Avoid_: confirmed Representation, Listing Input, Listing, seller consent to publication, VNeID authentication proof

**Xác nhận quyền đại diện / RepresentationConfirmation**:
The identified Seller's decision on a pending RepresentationRequest. An acceptance establishes the scoped Representation and initializes the PLID but is distinct from the later sharing consent and HouseNow publication acknowledgement.
_Avoid_: Listing approval, Active transition, PublicationProfile, Distribution Event, HouseNow send

**Xác nhận thông tin chia sẻ / ListingSharingConfirmation**:
The Seller's explicit allowlist of Listing information groups that may be sent to HouseNow. It follows Representation confirmation and does not itself publish the Listing.
_Avoid_: RepresentationConfirmation, Listing approval, HouseNow acknowledgement

**Phát hành HouseNow / HouseNowDistribution**:
The Agent's one-shot demo command after Seller sharing consent. It records the configured HouseNow acknowledgement and immutable `HouseNowListingSnapshot`; in V5 this is a deterministic client-side proposal, not evidence of a live API delivery.
_Avoid_: Listing approval, legal authorization, live integration proof

**Giao dịch / PTID**:
A separate VMLS orchestration reference created in V5 when the Agent's valid post-notary transaction declaration is accepted. It may later map to an official identifier if an approved integration provides one; it is not an official code, Closing Record, Property, Listing, contract number, or HouseNow billing `Transaction`.
_Avoid_: NPID, PLID, Closing Record, contract ID, 357 transaction ID, official transaction identifier

**Mã định danh Bất động sản**:
The Vietnamese interface label for the configured `NPID`. Public lookup may return it, but it remains distinct from every external source-record key.
_Avoid_: Mã BĐS, HouseNow Listing ID, 357 transaction ID, source-record ID

**Mã định danh Người bán / Người mua / Người đại diện**:
The Vietnamese interface labels for configured `Party.reference` values. They are Restricted transaction data unless a narrower projection is approved and remain distinct from identity-document references such as CCCD.
_Avoid_: NPID, PLID, PTID, CCCD as Party record ID, a Public Listing field

**Ảnh chụp Tin bán HouseNow / HouseNowListingSnapshot**:
An immutable, versioned local source snapshot matched to one VMLS Listing. It retains the external Listing ID, source version, source-updated time, VMLS-received time, and only the configured Listing claims. A match is neither the canonical Property nor proof of a live HouseNow export, API, outbound send, publication, or acknowledgement.
_Avoid_: Listing itself, Property, editable current HouseNow state, live feed response, Distribution Event

**Khai báo giao dịch / TransactionDeclaration**:
The Agent-authored, transaction-scoped post-notary declaration accepted for one configured PLID. It contains Buyer reference, whole-VND transaction value, contract/notary facts, and file metadata. The notarized transfer-contract PDF metadata is required; deposit-contract metadata is optional. It never stores document bytes in V5.
_Avoid_: BuyerDeclaration, Listing edit, 357 source record, proof of legal validity, uploaded document contents

**Bản ghi giao dịch nguồn 357 / TransactionSourceRecord357**:
An independent transaction source record synchronized after the VMLS declaration. It preserves source transaction ID, NPID, contract/value facts, masked Buyer/Seller values, notary organization, source timestamp, VMLS receipt timestamp, and provenance. It does not issue the V5 NPID, replace the HouseNow snapshot, or overwrite the Agent declaration.
_Avoid_: PropertySourceRecord357, TransactionDeclaration, Giao dịch/PTID, live 357 API response, official approval

The user-facing source name is `Hệ thống thông tin về nhà ở và thị trường bất động sản`. `357` remains only in internal identifiers, fixture codes, command names, and historical/research language where changing it would alter a technical contract or evidence reference.

**Kết quả đối soát / ReconciliationResult**:
An append-oriented comparison between the Agent declaration and one 357 source record. Each configured field is `matched`, `mismatched`, `missing_in_vmls`, or `missing_in_357`. A difference creates visible investigation context but does not silently merge, overwrite, or block the V5 status demo.
_Avoid_: Merge Decision, corrected source record, authoritative legal determination, synchronization success flag

**Nghĩa vụ tài chính / FinancialObligation**:
A transaction-scoped projected row for one configured obligation label. V5 displays personal income tax and registration fee separately and records completion from the deterministic source-event sequence. It contains no calculated amount and does not establish who legally owes a charge.
_Avoid_: tax calculation, invoice, legal liability, proof of payment from a live authority

**Thông báo và việc cần làm / Notification and WorkItem**:
Recipient-scoped records derived from a material transaction event. A notification communicates the milestone; its linked work item records whether follow-up remains open. Marking a notification read does not complete the work item or advance the external process.
_Avoid_: ExternalStatusEvent, Audit Event, email/SMS delivery proof, lifecycle command

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

**Đã khởi tạo / Initialized Listing**:
A Listing status meaning that a PLID has been allocated and the offering exists in a restricted preparation scope. It does not mean Active, approved, published, publicly distributed, or delivered to a downstream channel.
_Avoid_: Active Listing, published Listing, HouseNow-synchronized Listing, Distribution Event

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
An append-oriented proposal from the owning Seller to change a permitted Listing value. An approved implementation may apply it as a new Listing revision without rewriting prior events or source records. The concept remains in the broader product model but is not a V5 runtime command.
_Avoid_: direct Seller mutation, Property-source correction, silent downstream update

**Khai báo Người mua / BuyerDeclaration**:
A standalone, transaction-scoped declaration of Buyer participation. It remains a possible broader-domain record but is not created in V5: V5 places the Restricted Buyer reference inside the Agent's post-notary `TransactionDeclaration` instead.
_Avoid_: TransactionDeclaration, Public Listing field, ownership claim, external-agency identity payload

**Closing Record**:
The permitted record of a completed transaction outcome related to a Listing, kept separate from Property and Listing identities. V5 completes the PTID and notifies the Buyer but deliberately creates no Closing Record.
_Avoid_: Listing, Property History

## Parties and authority

**Primary Market Actor**:
A product-experience perspective for one of the six participants in the locked broader market scope: Real-estate Agent, Brokerage, Developer, Buyer, Owner/Seller, or Bank. For an organizational actor such as a Brokerage, Developer, or Bank, the authenticated User still acts through a scoped Membership and Role. V5 exposes only Agent, Brokerage, Buyer, Owner/Seller, and the operational VMLS Ops account; excluding Developer and Bank from runtime navigation does not remove them from the canonical actor model.
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
The time-bounded authority, established after the eligible Party confirms a RepresentationRequest, for an Agent or Organization to act in a defined transaction or distribution scope.
_Avoid_: RepresentationRequest, RepresentationConfirmation, Ownership, Membership, publication consent

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
The role-scoped summary derived from external events, including the source, current milestone, and processing unit. V5 uses the configured Tax/VPĐKĐĐ milestones instead of an invented completion percentage; broader normalized taxonomies require an approved source mapping.
_Avoid_: source system of record, SLA guarantee, workflow action

**Hồ sơ thuế / TaxDossier**:
The tax-source processing case created atomically from an accepted V5 post-notary declaration. Its configured events must reach completion of both financial-obligation rows before a VPĐKĐĐ handoff exists. This sequence is a demo proposal, not a universal legal rule or proof received from a live authority.
_Avoid_: tax calculation, legal liability, direct Tax action in VMLS, live settlement proof

**Phiên VNeID cục bộ / Local VNeID session**:
A versioned browser record used by the superseded V4 two-step handoff. It remains historical module vocabulary but is outside V5 runtime navigation. It never represented production authentication or an entitlement.
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
