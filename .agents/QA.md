# QA Agent Instructions

## Skill loading

Use repository skills as the source of detailed workflow rules. Read the full matching `SKILL.md` before acting.

- For MLS domain invariants, evidence levels, sensitive fields, and repository conventions, use `.agents/skills/_mls-development/SKILL.md`.
- For an interactive bug-reporting or QA intake session, also use `.agents/skills/qa/SKILL.md`.
- When the user explicitly asks to use Linear, use `.agents/skills/_linear-workflow/SKILL.md` for every QA issue read, creation, update, breakdown, or after-code verification comment.
- For root-cause diagnosis after a failure is reproduced, use `.agents/skills/diagnosing-bugs/SKILL.md` only when the user requests diagnosis or a fix.
- Use `.agents/skills/tdd/SKILL.md` only when the user explicitly requests automated tests or TDD.
- For every end-to-end browser QA or exploratory dogfood run, use `.agents/skills/dogfood/SKILL.md` and its `agent-browser` workflow throughout the complete run: initialization, authentication, orientation, exploration, reproduction, evidence capture, and wrap-up. Do not switch browser tools mid-run unless `agent-browser` is unavailable or cannot perform a required step.
- For narrow browser checks that are not end-to-end, use the available Chrome skill when existing login state is needed, or the available Playwright/browser skill for repeatable scripted flows, screenshots, and traces.

If several entries match, read all relevant skills. MLS-specific skills and repository instructions take precedence over third-party skills when they conflict.

## QA mindset

- Treat QA as end-to-end evidence gathering, not checklist completion.
- Identify the affected MLS capability, actor, account or permission scope, environment, data owner, evidence basis, and listing workflow state before testing.
- Distinguish UI behavior, client or BFF behavior, backend API behavior, persistence, notifications, and downstream list, detail, or search behavior.
- Test the smallest complete flow that proves the business rule.
- For a quick test request, focus on the changed behavior and nearest high-risk regressions. Do not silently expand into a full release regression.
- For an end-to-end request, do not stop at a successful mutation. Verify visible state, persistence, refresh or navigation behavior, and the relevant lookup surface.

## Environment and safety

- Record the branch or commit, target environment and URLs, startup command, app, actor, and requested scope before starting.
- Do not test production unless the user explicitly requests it. Default to read-only production checks unless the user also authorizes a write flow and test data.
- Never print or commit passwords, OTPs, tokens, cookies, authorization headers, private keys, or full database URLs.
- Use unique test data containing the task ID or timestamp and record important created IDs or codes.
- Do not modify or delete shared or pre-existing data. Clean up only data created by the current QA run and only when requested or clearly safe.
- Do not modify repository code during QA unless the user explicitly requests test scaffolding, documentation, diagnosis, or a fix.
- Run relevant automated checks when they exist and are safe; start narrow and report the exact commands and results.

## Evidence and artifacts

- Prefer browser verification for user-visible claims such as validation, button states, messages, redirects, table rows, and persisted state after refresh.
- For API mutations, verify the result through a read, list, detail, or search path instead of relying only on the write response.
- For permission-sensitive flows, test both the intended actor and the nearest wrong-role or wrong-scope actor when suitable accounts exist.
- Store screenshots, traces, request and response JSON, spreadsheets, and other run artifacts under `output/qa/<task-id>-...` unless the user provides another path.
- Override dogfood's default `dogfood-output/` directory with the MLS artifact path above, while preserving its `report.md`, `screenshots/`, and `videos/` structure.
- Name screenshots by step, such as `01-before-submit.png`, `02-after-submit.png`, and `03-search-result.png`.
- Save request and response evidence without secrets. Record status codes, business status, messages, and relevant safe IDs.
- If SSO, CAPTCHA, missing credentials, unstable fixtures, tunnels, or local services block the full flow, capture the exact blocker and complete the strongest safe lower-level verification available.

## Domain-focused coverage

- Verify Property and Listing identity separately, including relist/history behavior.
- Cover `Listing Input`, `Incoming Listing`, `Active Listing`, and downstream visibility as distinct states or stages until the product model resolves them.
- Test Public, Industry, and Restricted Fields across list, detail, search, export, report, logs, and partner feeds.
- For status, price, ownership, closing, and syndication mutations, verify actor, timestamp, reason, provenance, audit history, and downstream reconciliation where applicable.
- Treat all Texas policy and 72-hour statements as source claims unless the accepted specification explicitly adopts them.

## Reporting

- Start with the branch or commit, environment, app, actor, scope, and commands or flows executed.
- Report each requested item as `PASS`, `FAIL`, or `PARTIAL`.
- Include created IDs or codes and artifact paths needed to reproduce the run.
- For failures, include the observed behavior, expected behavior, reproduction steps, safe response summary, and screenshot or trace path when available.
- Separate product failures from environment blockers.
- Keep the report concise while preserving material caveats and any unverified live condition.
