# MVP acceptance criteria baseline

Status: `DRAFT`  
These criteria define testable outcomes. They do not approve unresolved legal or operating policy.

## AC-01 Canonical identity and relist history

Given a Property with one or more historical Listings, when an authorized Agent creates a new Listing, then:

- the Property ID remains unchanged;
- a new Listing ID is allocated;
- all prior Listings remain queryable and unchanged;
- the new Listing references the selected Property/Unit and input source;
- an Audit Event identifies actor, organization, time, and creation method.

Edge cases: multiple candidate Properties, multi-parcel relation, Project Unit without Property link, conflicting address source, prior withdrawn/closed Listing.

## AC-02 Duplicate active representation

Given a candidate Listing whose subject and effective period conflict with an existing Active Listing, when activation is requested, then:

- the system evaluates configured duplicate/representation rules;
- silent duplicate activation is prohibited;
- the user sees matching evidence without unauthorized sensitive fields;
- a review case can record exception or rejection;
- the outcome is audited.

## AC-03 Listing validation and submission

When a Listing Input is submitted:

- field-level errors identify missing or invalid values;
- conditional rules use transaction type, Property type, representation, dates, and visibility;
- failed validation preserves user input;
- Incoming and Active rule sets are explicitly versioned and distinct;
- Active cannot be reached while blocking validation, authority, verification, or issue conditions remain.

## AC-04 Review and lifecycle transitions

For every proposed transition:

- only allowed next transitions are offered;
- backend policy checks actor, Membership, organization, resource scope, current version, effective period, and required evidence;
- invalid, stale, duplicate, or unauthorized requests make no partial state change;
- success commits current state, Listing Status Event, Audit Event, and downstream event atomically or through a reliable outbox;
- correction appends a compensating event and never deletes history.

## AC-05 Field visibility

For Public, Agent, responsible Agent, Brokerage, Developer, Bank, Regulator, Buyer, and Steward scenarios:

- every field group matches the approved visibility matrix;
- restricted values do not leak through search snippets, counts where sensitive, exports, reports, notifications, URLs, logs, analytics, caches, or error messages;
- denied states explain the policy category without revealing protected content;
- restricted read/override is audited where policy requires.

## AC-06 Provenance and verification

For every identity-critical or authority-critical claim:

- source identity/key and effective/retrieval time are available to authorized users;
- normalized values retain lineage to raw source claims;
- conflicts do not destroy source records;
- verification states identify claim scope, verifier, rule version, assessment time, and expiry/review where relevant;
- public badges never imply broader or permanent verification than the recorded claim.

## AC-07 Duplicate review and merge

When duplicate candidates are reviewed:

- users can compare source identifiers, normalized address, geospatial/project-unit context, and history;
- only authorized Steward/authority roles can finalize merge;
- not-duplicate, link, and merge outcomes require reasons;
- merge preserves aliases, source records, Listing history, Audit Events, and downstream correlation;
- rerunning the same merge command is idempotent.

## AC-08 Search and discovery

- Search distinguishes Property, Listing, Project, Unit, and permitted source records.
- Filters use governed taxonomy and explicit units/currency/time semantics.
- Public, Industry, and Restricted search documents are independently authorized.
- Status/price changes reach relevant indexes within an approved measurable SLA.
- Stale or failed indexing is observable and reconcilable.

## AC-09 Project and Unit inventory

- Import validates Project/Building/Unit identity and reports row-level errors.
- Replaying the same source batch does not duplicate Units.
- Unit identity state is separate from commercial availability.
- Price/status changes are effective-dated and audited.
- Distribution assignment limits which Organization can create/distribute Unit Listings.

## AC-10 Buyer collaboration and consent

- Buyers see only Public projections.
- Shortlist, share, contact, and viewing requests do not expose restricted Listing data.
- Sharing data with an Agent or Bank requires clear purpose and consent scope.
- Revocation prevents future access while preserving lawful audit/history.
- Data Issue reports can be submitted without exposing reporter details to unauthorized parties.

## AC-11 Operations and regulator oversight

- Quality queues show assignment, severity, age, source, affected resources, and resolution history.
- Regulator detail access is bounded by authority and purpose; default dashboard views are aggregate.
- Override requires reason, authority reference where applicable, and Audit Event.
- Audit search/export applies retention, masking, and export authorization.

## AC-12 Integration reliability

- Imports and outbound feeds have stable source/message IDs.
- Retries do not create duplicate records or events.
- Failed delivery is observable with reason and next action.
- Reconciliation identifies missing, stale, duplicate, and conflicting downstream state.
- Replay is authorized, bounded, and audited.

## Prototype acceptance subset

The local prototype must demonstrate AC-01, the visible portion of AC-02 through AC-06, role-specific denied/masked states, and complete exploration paths for Contacts, CMA, Quality and actor workspaces. It must clearly label demo identities, session-local actions and synthetic data; backend projections remain the authority for Property Intelligence fields.
