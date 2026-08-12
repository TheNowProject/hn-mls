# Core data dictionary

Status: `CONCEPTUAL BASELINE`  
This dictionary defines business fields and ownership semantics, not a database schema.

## Common value objects

| Field | Meaning | Rules |
|---|---|---|
| Canonical ID | Stable Housenow identity | Immutable, opaque, never reused |
| Source Reference | Data Source plus external source key | Required for imported claims |
| Effective Period | Time interval when a claim or authority applies | Start, optional end, timezone explicit |
| Money | Amount plus ISO currency | No floating-point semantics |
| Area | Value, unit, measurement type, and source | Never store an unexplained number |
| Address | Structured administrative and street components plus normalized display | Raw source retained alongside normalized form |
| Confidence | Defined assessment level with method/version | Not equivalent to Verification |
| Visibility | Public, Industry, or Restricted plus policy reference | Evaluated per field and purpose |

## Property

| Field | Required | Owner/source | Visibility | Notes |
|---|---:|---|---|---|
| property_id | Yes | Housenow identity service | Industry/public alias policy | Durable canonical ID |
| property_type | Yes | Governed taxonomy | Public | Versioned taxonomy |
| normalized_address | Conditional | Identity process | Public projection | Exact components may be restricted |
| location | Conditional | Governed map/source | Projection-dependent | Precision policy required |
| parcel_links | No | Cadastral/source owners | Restricted/Industry | Many-to-many remains possible |
| project_unit_link | No | Developer/source + Steward | Industry/Public projection | Contains Project/Building/Unit identity |
| characteristics | No | Multiple sources | Per field | Area, rooms, structure, orientation |
| verification_refs | No | Verification process | Outcome projection | Time-bounded claims |
| provenance_refs | Yes for imported data | Data governance | Projection-dependent | Record/field level as needed |
| canonical_state | Yes | Steward policy | Industry | Candidate, Canonical, Disputed, Retired |

## Project and Unit

| Entity.field | Required | Owner/source | Visibility | Notes |
|---|---:|---|---|---|
| Project.project_id | Yes | Housenow | Public/Industry | Stable identity |
| Project.developer_party_id | Yes | Verified organization source | Public | Legal entity reference |
| Project.location | Yes | Developer/governed source | Public | Structured address/boundary |
| Project.legal_document_refs | Conditional | Developer/authority | Restricted/outcome public | Document itself may be restricted |
| Unit.unit_id | Yes | Housenow | Industry/public alias | Stable within canonical identity |
| Unit.inventory_coordinates | Yes | Developer | Industry | Phase/block/building/floor/unit tuple |
| Unit.property_id | No | Identity process | Industry | Linked only when evidence sufficient |
| Unit.commercial_availability | Conditional | Developer | Distribution policy | Separate from identity lifecycle |
| Unit.price_policy | No | Developer | Distribution policy | Effective-dated, not overwritten |

## Listing

| Field | Required for Incoming | Required for Active | Owner/source | Visibility |
|---|---:|---:|---|---|
| listing_id | System allocated | Yes | Housenow | Public/Industry by state |
| property_id or unit_id | Yes | Yes | Identity selection | Public/Industry |
| transaction_type | Yes | Yes | Responsible actor | Public |
| responsible_membership_id | Yes | Yes | Organization | Industry/public projection |
| representation_id | Reference or pending policy | Valid and verified | Parties/verification | Restricted/outcome projection |
| list_price | Yes | Yes | Responsible actor | Public if distributed |
| effective_start/end | Yes | Yes | Agreement/policy | Public/Industry |
| current_status | Yes | Yes | Lifecycle policy | Public/Industry |
| public_remarks | No | Conditional by distribution | Responsible actor | Public |
| industry_remarks | No | Conditional | Responsible actor | Industry |
| restricted_remarks | No | No | Responsible actor | Restricted |
| media_refs | No | Conditional | Responsible actor/source | Per asset |
| distribution_consent | Conditional | Yes for public distribution | Authorized Party | Restricted decision/public outcome |
| validation_version | Yes | Yes | Rule engine | Industry/audit |
| verification_refs | No | Conditional | Verification process | Outcome projection |

## Representation

| Field | Required | Notes |
|---|---:|---|
| representation_id | Yes | Stable identity |
| represented_party_id | Yes | Seller/landlord/other authorized Party |
| representative_membership/org | Yes | Actor and organization authority |
| subject_scope | Yes | Property/Unit and transaction type |
| authority_type | Yes | Governed taxonomy, not hard-coded Texas labels |
| effective_period | Yes | Active transition must fall inside period |
| distribution_scope | Yes | Public/partner restrictions and opt-in/out |
| evidence_refs | Conditional | Restricted documents or source references |
| verification_state | Yes | Pending, Verified, Rejected, Expired, Revoked |

## Verification

| Field | Required | Notes |
|---|---:|---|
| verification_id | Yes | Stable identity |
| claim_type and target | Yes | What is being verified |
| state | Yes | Pending, Verified, Partially Verified, Rejected, Expired, Revoked |
| rule_set_version | Yes | Reproducible decision criteria |
| evidence_refs | Yes for completed outcome | Restricted by default |
| verifier | Yes | Actor/system and organization |
| assessed_at | Yes | Explicit timezone |
| valid_until/review_at | Conditional | Prevent permanent badge semantics |
| reason_codes | Conditional | Required for non-success and revocation |

## Data Source and Provenance

| Field | Required | Notes |
|---|---:|---|
| data_source_id | Yes | Source identity and type |
| source_record_key | Yes for imports | Idempotency and traceability key |
| retrieved_at | Yes | When Housenow received it |
| effective_at/period | Conditional | When source claim applies |
| transformation | Conditional | Normalization or mapping version |
| confidence | Conditional | Method-defined assessment |
| editable | Yes | Whether and how override is permitted |
| supersedes/source_lineage | Conditional | Preserve change lineage |

## Listing Status Event and Audit Event

| Field | Required | Notes |
|---|---:|---|
| event_id | Yes | Immutable unique ID |
| target_type/id | Yes | Resource affected |
| actor_membership/org | Yes unless system event | Responsibility context |
| event_type | Yes | Governed taxonomy |
| occurred_at/effective_at | Yes | Distinguish recording time from business effective time |
| before/after | Required for changes | Sensitive values protected by policy |
| reason and reason_codes | Conditional | Required for override/correction/rejection |
| correlation_id | Yes for workflow/integration | Connects related events |
| policy/rule version | Conditional | Reproduce decision |

## Data Issue and Merge Decision

| Field | Required | Notes |
|---|---:|---|
| issue_id | Yes | Stable case identity |
| issue_type/severity | Yes | Missing, stale, conflict, duplicate, unauthorized, incorrect |
| target_refs | Yes | Records/fields involved |
| reporter and scope | Yes | May require public privacy protection |
| evidence_refs | Conditional | Restricted by default |
| state/assignee/SLA | Yes | Operational workflow |
| resolution | Conditional | Reasoned, auditable outcome |
| merge canonical/superseded refs | Merge only | Never delete history |

## Closing Record and CMA Report

These are separate aggregates and remain post-core for detailed design. Closing Record requires permitted transaction outcome, source, effective date, parties/roles by policy, and audit. CMA Report requires Subject Property, criteria snapshot, human-reviewed Comparable selections, calculation/version metadata, visibility, and immutable published versions.
