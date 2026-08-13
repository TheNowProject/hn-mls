# Phase 6.2 - Access governance

Date: 2026-08-13
Status: IMPLEMENTED PROPOSAL - product, legal, banking and data-governance validation remain required.

## Product decision

Role is a baseline capability bundle, not a global permission. Effective access is evaluated from Membership, Organization, Role, Purpose, Resource, Action, Scope, Field Classification, Consent and Effective Time.

The local prototype now makes this model explorable instead of relying only on a role switcher.

## Delivered

- A `Quyền & chia sẻ` workspace available to every actor.
- Actor-to-actor exchange views for data contributed by Agent, Bank and Developer.
- A field projection matrix across Agent, Brokerage, Developer, Bank, Regulator, Buyer and Data Steward.
- Public, Industry and Restricted field classifications.
- Purpose-bound consent records with recipient, fields and expiry.
- Time-bounded Access Request creation through the API and SQLite.
- Broker/Data Steward approval or rejection with a required reason.
- Sensitive-read audit when a Property projection contains Restricted fields.
- Mobile access to all role workspaces through a scrollable bottom navigation.

## Example policy

When an Agent publishes an Active Listing, a Buyer receives only the Public projection. A Bank receives minimum Property, price and verification data for an approved finance Purpose; owner/contact and finance data require explicit Consent. Private remarks, CRM data and internal audit are omitted.

In the reverse direction, an Agent can receive a Bank case status or a shared request for more information, but not credit score, underwriting notes or the Bank's internal risk model.

## Boundaries before pilot

- Approved Access Requests do not yet materialize durable Entitlement grants.
- Demo sessions do not represent real Membership or Organization federation.
- Consent is seeded exploration data; revocation and legal evidence workflows are not implemented.
- Regulator authority, banking purpose taxonomy, local retention and disclosure policy need accountable human approval.
- Search, export, analytics, notification and cache leakage controls still require security testing with production architecture.
