---
name: _linear-workflow
description: Create and update MLS Linear issues with evidence-aware requirements, domain scope, acceptance criteria, and safe external writes. Use only when the user explicitly asks to work with Linear.
---

# MLS Linear workflow

## Preconditions

- Do not infer a Linear workspace, team, project, cycle, umbrella issue, labels, or assignee from the copied template or another repository.
- Discover the connected workspace and current project configuration before proposing values.
- If the correct team/project cannot be determined from existing MLS issues or repository documentation, ask the user before creating or moving an issue.
- Do not create, update, comment, assign, move, or close an issue unless the user authorizes that write.

## Issue classification

Use the tracker labels that actually exist. When compatible labels are available, distinguish:

- Product/BA or Discovery
- Legal/Compliance
- Data/Integration
- Backend
- Frontend
- DevOps
- QA
- AI/Analytics
- Support/Operations

Do not classify backend application work as DevOps merely because it runs on a server.

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
- Preserve parent priority, project, and cycle only after verifying those values are intentional for the MLS project.

## After-code updates

- Inspect `git status --short --branch`, the relevant diff, and verification results.
- Distinguish staged, unstaged, untracked, and unrelated changes.
- Include a commit ID only after a commit exists.
- Mark work Done only when acceptance criteria are met and required verification is complete; otherwise state the exact remaining condition.
