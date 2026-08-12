# Phase 0: Product alignment baseline

Status: `DRAFT BASELINE`  
Evidence date: 2026-08-12

## One-sentence product definition

`PROPOSAL`: Housenow MLS is a permissioned market-data and workflow platform that gives each real-estate asset a durable identity and makes every Listing, authority claim, source, verification, and material change traceable.

## Primary prototype objective

`PROPOSAL`: Validate whether brokerage users and data stewards can correctly distinguish a durable Property from a time-bounded Listing while completing the flow `find Property → create Listing → validate → review → activate → inspect history`.

## Product promise

Users can determine what an asset is, who is authorized to market it, where its data came from, what is currently offered, and how each important claim changed over time.

## Principles

1. Trust before growth.
2. Permission by design.
3. History is append-oriented and cannot be silently overwritten.
4. One canonical identity may have many time-bounded Listings.
5. Important data has explicit provenance and verification state.
6. Complete workflows take priority over disconnected features.
7. Prototype evidence precedes irreversible MVP architecture.

## Actors

| Actor | Prototype responsibility | Evidence status |
|---|---|---|
| Agent | Find Property, prepare Listing, submit and maintain it | `FACT` in reference, adapted as `PROPOSAL` |
| Brokerage reviewer | Review representation, quality, and activation | `INFERENCE + PROPOSAL` |
| Developer operator | Maintain Project/Unit inventory and distribution assignment | `PROPOSAL` |
| Bank operator | View permitted verified data and finance-fit context | `PROPOSAL` |
| Regulatory viewer | Inspect aggregates, issues, and audit within authority | `PROPOSAL` |
| Buyer | Discover verified public data, shortlist, contact, and report issues | `PROPOSAL` |
| Housenow Data Steward | Resolve identity, provenance, duplicate, and data-quality cases | `PROPOSAL`, strongly required by governance needs |
| Owner or seller | Grants ownership/marketing consent and representation authority | `PROPOSAL` in domain, account participation unresolved |

## Proposed first slice

- Segment: secondary-market residential.
- Locality: TP.HCM sample data.
- Daily users: Agent, brokerage reviewer, Housenow Data Steward.
- Primary risk: duplicated Property identity and untraceable Listing authority.
- Data: synthetic only.

These are working assumptions for prototype progress, not signed business decisions.

## In scope through prototype

- Role switch simulation.
- Property search and identity candidate review.
- Existing Listing history.
- Create Listing from an existing Property.
- Representation declaration.
- Incoming and Active validation paths.
- Brokerage review simulation.
- Verification and provenance presentation.
- Append-oriented audit timeline.
- Field visibility differences by actor.
- Project/Unit, bank, regulator, buyer, and quality-queue concept screens after the core slice.

## Non-goals through prototype

- Production authentication or authorization.
- Legal validation of Vietnam lifecycle or contract policy.
- Real cadastral, tax, banking, regulator, identity, or syndication integration.
- Booking, offer, transaction, e-signature, commission, or mortgage approval.
- Automated valuation or AI decision-making.
- Real personal data.
- Production database, API, infrastructure, or deployment choice.

## Decision ownership proposal

| Decision class | Accountable owner | Required contributors |
|---|---|---|
| Product scope and pilot | Product Owner | Business, Tech Lead, pilot organizations |
| Domain and workflow | Product Owner | BA, Data Steward, brokerage/developer experts |
| Legal, privacy, regulator authority | Legal/Compliance owner | Product, regulator representatives, security |
| Data standards and provenance | Data Governance owner | Tech Lead, Data Steward, source owners |
| Architecture and delivery | Tech Lead | Product, Security, Data Engineering |
| Prototype UX | Product Design owner | Product, actor representatives, Tech Lead |

## Exit assessment

| Phase 0 criterion | Status |
|---|---|
| One-sentence product definition | Drafted |
| Actors and operating actors | Drafted |
| Prototype validation objective | Drafted |
| Scope and non-scope | Drafted |
| First buyer, pilot group, segment, locality | `OPEN QUESTION`; working proposal recorded |
| Named human decision owners | `OPEN QUESTION`; responsibility classes proposed |

Phase 0 is documentation-complete but not stakeholder-approved. Open decisions remain visible rather than being silently assumed.
