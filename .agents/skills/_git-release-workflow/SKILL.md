---
name: _git-release-workflow
description: Prepare MLS branches, commits, and pull requests with scoped changes, evidence-aware descriptions, and safe release notes. Use when committing, pushing, opening pull requests, or preparing a release.
---

# Git and release workflow

## Safety and scope

- Inspect `git status --short --branch` before staging.
- Do not stage, revert, format, or commit unrelated work.
- Review `git diff --cached` before every commit.
- Do not push, open a pull request, merge, tag, or release unless the user explicitly requests it.
- Use the `codex/` branch prefix unless the user or repository hosting policy specifies another convention.

## Commits

- Use a concise imperative title describing one coherent change.
- Include a tracker ID only when a real related issue exists; do not invent placeholder IDs.
- Keep generated media, local video, credentials, caches, and scratch output out of commits.
- Mention material schema, migration, privacy, permission, lifecycle, or integration effects in the commit body when they are not obvious from the title.

## Pull requests

Before opening a PR, check whether one already exists for the same head and base.

Use this description structure when applicable:

```md
## Goal
- <business or user outcome>

## Scope
- <what changed>

## Domain / data impact
- <Property, Parcel, Listing, lifecycle, authorization, provenance, feed, or migration impact>

## Verification
- `<command or flow>` — PASS/FAIL/PARTIAL

## Evidence and decisions
- <FACT/SOURCE CLAIM/INFERENCE/PROPOSAL/OPEN QUESTION that materially shaped the change>

## Rollout / rollback
- <coordination, migration, feature flag, replay, or rollback notes>
```

Omit empty sections. Write release notes in Vietnamese unless the user requests another language. Describe product impact before implementation detail.

## Release checks

- Confirm branch/base, migrations, data compatibility, access-control impact, feed compatibility, and required environment configuration.
- Confirm temporary source video and `tmp/` are absent from the staged diff.
- Record unresolved assumptions and external dependencies instead of presenting them as verified.
