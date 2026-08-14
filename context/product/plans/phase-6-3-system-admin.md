---
title: Phase 6.3 System Admin control plane
status: proposal
authority: working
last_reviewed: 2026-08-14
---

# Phase 6.3 - System Admin control plane

Date: 2026-08-13
Status: READY FOR BUILD - production identity, legal and security policy remain approval gates.

## Goal

Add administration without creating a universal business-data superuser. Every actor keeps a transparent `Quyền của tôi` view; Organization Admin manages its own Membership boundary; System Admin manages the Housenow control plane; Data Steward keeps an assigned quality scope.

## Build scope

### Surface 1 - Quyền của tôi

Available to every actor:

- Active Memberships and Organizations.
- Effective Entitlements with Resource, Action, Scope, Purpose and expiry.
- Consent involving the current Party only.
- Own Access Requests and decisions.
- Plain-language denied, masked, expired and pending states.
- Generic policy matrix without private organization or user records.

### Surface 2 - Quản trị tổ chức

Available to an Organization Admin within one Organization:

- Invite, suspend and remove members.
- Assign approved role/Entitlement templates.
- Review Access Requests owned by the Organization.
- Inspect Organization-scoped access metadata and audit allowed by policy.
- No automatic access to CRM, owner identity, private remarks, finance records or Restricted documents.

### Surface 3 - System Admin

Available only to Housenow platform operations:

- Create, verify, suspend and restore Organizations.
- Recover/suspend accounts and inspect session/security metadata.
- Version role templates, field classifications and authorization policies.
- Manage integrations, service health and policy rollout.
- Route Access Requests to the correct data owner or approver.
- Initiate Break-glass Access but never silently grant permanent business-data access.

### Surface 4 - Break-glass Access

- Select Resource and exact Restricted Field groups.
- Require Purpose, incident/reference, reason and duration.
- Require an approver distinct from requester for critical groups.
- Issue a temporary Entitlement with start and expiry.
- Display an elevated-session banner and remaining time.
- Audit activation, every Restricted read, export attempt, expiry and revocation.

## Mandatory gap fixes before adding screens

1. Filter Consent records to subject, grantee, data owner, scoped approver or lawful authority; the current prototype returns the seeded Consent list too broadly.
2. Restrict Access Request approval by Organization/data ownership; current Broker and Data Steward checks are role-only and can approve across unrelated Organizations.
3. Materialize approved requests as time-bounded Entitlements rather than treating status `Đã duyệt` as effective access by implication.
4. Split policy transparency from operational records so all actors can understand rules without viewing other users' requests or consent.

## Data model additions

| Record | Required fields |
|---|---|
| Organization Admin Assignment | User, Organization, role, scope, effective start/end, status |
| Policy Version | Version, field classification, rule set, owner, effective time, rollout state |
| Entitlement Grant | Subject, Organization, Resource, Action, Scope, Purpose, source request, start, expiry, revoked state |
| Break-glass Session | Requester, approver, incident, Resource, fields, Purpose, start, expiry, status |
| Sensitive Read Event | Session/grant, actor, Resource, fields returned, Purpose, time, outcome |

## API preparation

- `GET /me/access` - current Memberships, Entitlements, Consent and requests.
- `GET /organizations/:id/access` - Organization Admin view with organization-bound authorization.
- `POST /organizations/:id/memberships` - invite or assign approved role template.
- `POST /access-requests/:id/decision` - enforce data-owner/organization approver scope.
- `POST /admin/break-glass` - initiate an exceptional request.
- `POST /admin/break-glass/:id/approve` - separate approver activates a temporary grant.
- `POST /admin/break-glass/:id/revoke` - end elevated access early.
- `GET /admin/security-audit` - metadata-first security audit with content projections.

## Build sequence

1. Tighten Consent and Access Request projection tests around the two known gaps.
2. Add Organization Admin and System Admin demo identities without business-data projection.
3. Add durable Entitlement Grant and Policy Version records.
4. Enforce organization/data-owner scope in approval APIs.
5. Build `Quyền của tôi`, `Quản trị tổ chức` and `System Admin` navigation surfaces.
6. Build Break-glass request, approval, countdown, revoke and expiry flows.
7. Add sensitive-read audit coverage across API, search and export paths.
8. Run actor-by-actor regression, responsive review and security-negative tests.

## Required test scenarios

- System Admin reads platform metadata but receives no private remarks, owner contact, CRM or finance content.
- Organization Admin cannot list or change Membership outside its Organization.
- Broker cannot approve a Bank request unless the Brokerage owns the resource or has delegated approval authority.
- Buyer sees only Consent where the Buyer is the subject or authorized recipient.
- Data Steward cannot use a quality assignment to open unrelated finance fields.
- Break-glass requester cannot self-approve a critical request.
- Expired or revoked Break-glass Entitlement fails immediately and leaves an audit event.
- Search result, export, notification, analytics and error payloads do not leak Restricted values.

## Definition of ready

- ADR is accepted and glossary terms are stable.
- Permission matrix includes administrative control-plane rules.
- Known privacy gaps are explicit and testable.
- API boundaries, data records, UI surfaces and negative test scenarios are specified.
- Real data remains prohibited until production authentication, security review and legal policy are approved.
