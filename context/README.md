---
title: Repository context router
status: current
authority: canonical
last_reviewed: 2026-08-14
---

# Repository context router

This directory is the single maintained knowledge root for HouseNow MLS. Read this file first, then load only the route relevant to the task. Operational instructions remain in [`AGENTS.md`](../AGENTS.md) and [`.agents/`](../.agents/).

## Authority order

1. Accepted decisions and locked product scope.
2. Canonical domain language and current product context.
3. Working specifications and implementation plans.
4. Technical descriptions of the local prototype.
5. Research, source claims, inferences, proposals, and open questions.
6. The immutable legacy snapshot under [`reference/mls/`](../reference/mls/).

Only documents marked `canonical`, `approved`, or `locked` may establish product intent. A working document does not become policy merely because it is implemented in the prototype. Research never overrides approved Vietnam product context.

## Task routes

| Task | Read first | Then read |
|---|---|---|
| Repository orientation or status | [Current state](./product/current-state.md) | [Roadmap](./product/roadmap.md) |
| Domain, schema, API, or lifecycle | [Domain language](./domain/language.md) | Relevant [domain](./domain/) and [product](./product/) specifications |
| Product planning or scope | [Alignment](./product/alignment.md) | [Requirements](./product/requirements.md), [open questions](./product/open-questions.md), and relevant plan |
| Authorization or sensitive data | [Permissions](./domain/permissions.md) | [Access governance](./product/plans/phase-6-2-access-governance.md) and [security](./technical/security.md) |
| Architecture or irreversible design | [Decision register](./decisions/README.md) | Relevant ADR and technical context |
| API, testing, or operations | [Technical context](./technical/) | Relevant product and domain rules |
| Brand, UI, or generated visuals | [Brand direction](./brand/README.md) | [UI-flow research](./research/experience/ui-flow.md) |
| Research or evidence work | [Research index](./research/README.md) | The relevant topic and primary sources |
| QA or regression review | [Quality context](./quality/) | [Acceptance criteria](./product/acceptance-criteria.md) and [test strategy](./technical/test-strategy.md) |

## Knowledge map

- [`brand/`](./brand/) — canonical visual direction.
- [`domain/`](./domain/) — terminology, rules, data concepts, and permissions.
- [`product/`](./product/) — current state, roadmap, scope, requirements, and implementation plans.
- [`decisions/`](./decisions/) — accepted architecture and product decisions.
- [`technical/`](./technical/) — local API, security limitations, and test strategy.
- [`research/`](./research/) — dated evidence, comparisons, source audits, and proposals.
- [`quality/`](./quality/) — retained QA findings and audit reports.

## Evidence discipline

Preserve the labels `FACT`, `SOURCE CLAIM`, `INFERENCE`, `PROPOSAL`, and `OPEN QUESTION`. Texas, U.S., 357, and legacy HouseNow observations are inputs, not automatic Vietnam requirements. Record unresolved policy instead of inferring it from the prototype.
