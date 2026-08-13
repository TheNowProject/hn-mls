---
name: _linear-workflow
description: Create and update MLS Linear issues with operational defaults, evidence-aware requirements, domain scope, acceptance criteria, and safe external writes. Use only when the user explicitly asks to work with Linear.
---

# MLS Linear workflow

## Preconditions

- Do not infer a Linear workspace, project, cycle, umbrella issue, label, or assignee from a copied template or another repository. Use the MLS defaults below only after confirming the work belongs to this repository.
- Discover the connected workspace and current project configuration before proposing values.
- If the correct team/project cannot be determined from existing MLS issues or repository documentation, ask the user before creating or moving an issue.
- Do not create, update, comment, assign, move, or close an issue unless the user authorizes that write.

## Create issues and sub-issues

When creating an MLS issue:

- Always use the Engineers & QAs team (`NOW`).
- Set a new issue or sub-issue to `Todo` unless the user explicitly requests another state or the issue records already-completed work.
- Honor an assignee explicitly named by the user. Otherwise assign the authenticated Linear account connected to the current session; if it cannot be resolved or is not a NOW member, fall back to `binhdv`.
- Preserve the parent issue's priority, cycle, and project after verifying those values are intentional. When the parent has no cycle and the user has not specified one, use NOW's current cycle.
- For work belonging to the B2G VMLS demo, use `CTO-1048` as the parent. For other MLS work, discover the appropriate umbrella issue from current Linear context instead of forcing `CTO-1048`.
- Read the selected parent, its relevant children, and comments before creating the issue. Reuse or update an existing child when it already covers the requested outcome.
- Resolve team, state, assignee, parent, priority, cycle, project, and labels before the write. Do not rely on Linear defaults for these fields.
- After creation, read the issue back and verify its team, state, assignee, parent, priority, cycle, project, and labels. Correct mismatches before reporting completion.

## Issue classification

Use only tracker labels that actually exist. Prefix the title with every applicable delivery scope and add every matching label:

- `[Product]` for Product/BA or Discovery work.
- `[Legal]` for Legal/Compliance work.
- `[Data]` for data modeling, migration, backfill, provenance, quality, or integration-data work.
- `[BE]` and `Backend` for API routes, server services, workers/queues, database queries/migrations, domain logic, integrations, authentication, authorization, validation, notifications, and data processing.
- `[FE]` and `Frontend` for screens/pages, UI components, client state, forms, navigation, responsive layout, styling, client-side validation, browser behavior, and interactions.
- `[Design]` and `Design` for brand, visual identity, UX/UI design, mockups, prototypes, and design-system artifacts that do not implement production UI.
- `[DevOp]` and `DevOp` only for infrastructure and operations: deployment, CI/CD, containers, runtime configuration, environment variables, monitoring/logging, build tooling, dependency/toolchain upgrades, and production operations.
- `[QA]` and `QA` for test planning/execution, regression, bug verification, acceptance checks, and release validation.
- `[AI]` and `AI` for prompts/models, embeddings, retrieval/RAG, agents, evaluation, generated-content quality, and AI pipelines/tooling.
- `[Support]` and `Support` for operational support, data correction, moderation, one-off operational fixes, incident follow-up, and non-code coordination.

Do not classify backend application work as DevOps merely because it runs on a server.
Combine prefixes and labels when a work item spans multiple delivery scopes, for example `[FE/BE]`, `[BE/Data]`, or `[QA/Support]`. If a preferred label is unavailable, keep the accurate title prefix and use the closest existing label only when its meaning is compatible; do not create a new label without authorization.

## Description structure

Use these sections in order:

1. Goal
2. Background and evidence
3. Scope
4. Non-goals
5. Domain/data impact
6. Acceptance Criteria
7. Open questions or dependencies
8. Notes (optional)

In `Background and evidence`, preserve `FACT`, `SOURCE CLAIM`, `INFERENCE`, `PROPOSAL`, and `OPEN QUESTION` when the distinction affects the work. Link to repository documents and timestamps instead of copying large transcript passages.

## Breakdown

- Read the parent, relevant children, comments, and repository context before splitting work.
- Keep each child independently understandable and testable.
- Separate legal/policy confirmation, domain/data design, implementation, integration, migration/backfill, QA, and rollout when they have different owners or completion conditions.
- Apply the creation defaults above to every child, including `Todo`, NOW team, explicit/default assignee, verified parent inheritance, prefixes, and labels.

## After-code updates

- Inspect `git status --short --branch`, the relevant diff, and verification results.
- Distinguish staged, unstaged, untracked, and unrelated changes.
- Include a commit ID only after a commit exists.
- Mark work Done only when acceptance criteria are met and required verification is complete; otherwise state the exact remaining condition.
