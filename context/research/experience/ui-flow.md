---
title: HouseNow MLS UI-flow research
status: research
authority: supporting
last_reviewed: 2026-08-14
evidence_labels:
  - FACT
  - SOURCE CLAIM
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# HouseNow MLS UI-flow research

## Evidence boundary

The primary observation source is the Texas MLS walkthrough preserved under `reference/mls/documents/research/mls-texas/`: BA report, transcript, selected frames, contact sheets, and visual analysis.

- `FACT` describes visible or audible behavior in the walkthrough.
- `SOURCE CLAIM` describes a participant statement not independently verified.
- `INFERENCE` explains a likely product pattern.
- `PROPOSAL` describes a HouseNow direction.

No Texas association rule, deadline, status transition, membership policy, or integration contract becomes a Vietnam requirement through this document.

## Observed interaction model

### Operational home

`FACT`: The reference system opens into an operational workspace with navigation, counters, saved or recent work, listing summaries, and shortcuts. It is not a marketing landing page.

`INFERENCE`: An MLS home should answer what needs attention now—drafts, reviews, status deadlines, new matches, showing changes, data issues, and access decisions—within the user's permitted organization and market scope.

### Search and results

`FACT`: Search supports structured criteria and reusable search categories. Results provide dense, sortable records with map/list transitions and entry into detail.

`PROPOSAL`: HouseNow search should start from durable Property candidates, expose the current permitted Listing projection, preserve filter state, and make source/verification quality visible. Empty, duplicate, stale, conflicting, and partially sourced results need explicit states.

### Property and Listing detail

`FACT`: Reference detail separates photos, market information, history, and operational actions. Sale and listing history are important supporting views.

`PROPOSAL`: HouseNow Property 360 should keep stable identity, address/location, Project/Unit context, current Listing, price history, source/verification, representation, visibility, and audit evidence distinct. Actor projections must never fetch a full unrestricted record merely to hide fields in the UI.

### Listing input and review

`FACT`: The walkthrough shows large structured forms, conditional sections, tax/property lookup, validation, and status rules.

`PROPOSAL`: Compose a Listing around an existing or deliberately resolved Property. Show validation at field and section level, explain why information is required, preserve drafts, and separate editable Listing Input from submitted Incoming Listing and Active market state.

### Reports and CMA

`FACT`: The reference system exposes on-demand reports and a separate CMA workflow: select a subject, search/select comparables, review a map/list, customize content, and publish a report.

`PROPOSAL`: Keep comparable selection human-reviewed, record inclusion/exclusion rationale, retain source and effective dates, and label the output as CMA rather than statutory valuation.

### Ecosystem tools

`FACT`: The reference organization exposes related applications around the MLS core.

`INFERENCE`: Showing, CMA, distribution, lockbox, tax, portal, and transaction capabilities may remain separate bounded products. The VMLS shell should provide consistent identity, authorization, navigation, and audit context without pretending every vendor is one monolith.

## Proposed HouseNow navigation

```text
Global shell
├── Actor and organization context
├── Data space / market scope
├── Notifications and access context
└── Task workspaces
    ├── Search and Property 360
    ├── Listings and review
    ├── Contacts, shortlist, and showing
    ├── CMA
    ├── Quality and provenance
    ├── Organization and entitlements
    ├── Owner/Seller authority and cases
    └── Project or finance workspace where entitled
```

## Actor-specific priority

| Actor | Default question |
|---|---|
| Agent (`Môi giới`) | Which Properties, clients, Listings, and deadlines need action? |
| Brokerage (`Sàn môi giới`) | Which submissions, members, entitlements, inventory, and quality cases need review? |
| Developer (`Chủ đầu tư`) | Which Project/Unit records, legal evidence, distribution assignments, and availability signals changed? |
| Buyer (`Người mua`) | Which verified Listings match, changed, or require a showing decision? |
| Owner/Seller (`Người bán / Chủ sở hữu`) | Which Property relationships, authority grants, Listings, and cases require consent or correction? |
| Bank (`Ngân hàng`) | Which consented finance leads require the next permitted action? |

## Interaction rules

- Show actor, organization, market/data space, purpose, and resource scope wherever they change the projection.
- Keep primary actions close to the affected record and explain lifecycle guards.
- Use append-oriented timelines for price, status, source, verification, consent, representation, and audit history.
- Distinguish missing evidence, rejected evidence, expired evidence, and inaccessible evidence.
- Make saved state and session-only prototype state explicit.
- Preserve keyboard operation, focus visibility, readable labels, responsive detail panels, and non-color status cues.
- Follow the [Living Registry brand direction](../../brand/README.md): calm registry surfaces, strong identifiers, provenance traces, and restrained action color.

## Important failure states

1. No Property candidate matches.
2. Multiple candidates require identity resolution.
3. Listing authority or Consent is missing, expired, revoked, or disputed.
4. Source records conflict or are stale.
5. The requested transition is illegal for the current status or actor.
6. A field is unavailable for the current purpose, not merely blank.
7. A downstream integration is delayed, rejected, duplicated, or replayed.

## Open questions

- `OPEN QUESTION`: Which workspace and operational queue is the first pilot's daily home?
- `OPEN QUESTION`: Which Vietnamese fields and conditional rules are mandatory for activation?
- `OPEN QUESTION`: Which map, cadastral, showing, CMA, and distribution integrations are approved?
- `OPEN QUESTION`: Which actions require a second approver, strong authentication, or Break-glass Access?
