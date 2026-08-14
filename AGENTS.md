# Agent Instructions

## Project grounding

- Read `context/README.md` first and follow its task route to the smallest relevant context set. Do not load the whole knowledge tree by default.
- Treat `reference/mls/documents/research/mls-texas/BA-report.md` as the primary analyzed research reference and `reference/mls/documents/research/mls-texas/visual-analysis.md`, transcript, and frames as supporting evidence.
- Treat `reference/mls/` as an immutable snapshot of the legacy research repository. Make current product and implementation changes at the repository root instead of editing the snapshot.
- Preserve the evidence labels `FACT`, `SOURCE CLAIM`, `INFERENCE`, `PROPOSAL`, and `OPEN QUESTION`. Do not silently promote a source claim or Texas-specific observation into a Vietnam requirement.
- Do not use `Property`, `Parcel`, `Project`, `Unit`, `Listing`, `Closing Record`, `Party`, `Membership`, `Agent`, and `Brokerage` interchangeably. Update `context/domain/language.md` when a term is resolved.
- Treat `context/brand/README.md` and `context/brand/assets/vmls-living-registry.png` as the canonical visual direction for VMLS.
- Keep source videos, temporary extraction artifacts, credentials, and generated scratch data under `tmp/`; this directory is intentionally ignored by Git.

## Instruction loading

Always follow the root instructions in this file. Before starting work, identify the relevant role instructions and read the matching file. If the user does not explicitly name a role, infer it from the task scope, files, commands, systems, and expected output. Do not wait for the user to specify a role when the task provides enough context.

- Coding, implementation, refactoring, debugging, code review, validation, commits, pull requests, releases, or telemetry: `.agents/WORKER.md`
- Linear, issue planning, product breakdown, specifications, ticket creation, triage, or post-code issue updates: `.agents/PM.md`
- QA, test planning, regression, acceptance checks, bug verification, browser or API verification, or test account and OTP flows: `.agents/QA.md`

If a task spans multiple roles, read every matching file before acting. When role detection is uncertain, read the smallest plausible set that safely covers the task. If no specialized role applies, read `.agents/WORKER.md` for general repository work.

Role files route to the relevant repository skills. Read only the matching skills instead of loading every skill for every task. MLS-specific skills and these repository instructions take precedence over third-party skills when they conflict.
