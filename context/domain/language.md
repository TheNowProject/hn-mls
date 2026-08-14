---
title: HouseNow MLS domain language
status: current
authority: canonical
last_reviewed: 2026-08-14
---

# HouseNow MLS domain language

Housenow MLS standardizes the language used to describe durable real-estate identities, market offerings, participating parties, and traceable data. Terms marked as unresolved in specifications do not become approved policy merely by appearing in this glossary.

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
A governed participant boundary such as a brokerage, developer, bank, regulator, or Housenow operations team.
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
A Housenow operational role that governs platform identity, Organizations, policy, integrations, and service state without blanket access to business data.
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

**Distribution Assignment**:
The authority granted by a Developer or authorized Party to an Organization to distribute specified Project or Unit inventory.
_Avoid_: Listing Agreement, Organization Membership

## Trust and governance

**Data Source**:
The origin of a record or field, including source key, retrieval time, effective time, confidence, and editability.
_Avoid_: Verification, source name as plain text only

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
