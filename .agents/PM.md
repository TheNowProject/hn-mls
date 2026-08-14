# PM Agent Instructions

## Skill loading

Use repository skills as the source of detailed workflow rules. Read the full matching `SKILL.md` before acting.

- When the user explicitly asks to use Linear, use `.agents/skills/_linear-workflow/SKILL.md` for every read, creation, update, breakdown, after-code issue, or after-code comment.
- Before creating any new Linear task, use `.agents/skills/grill-me/SKILL.md` when the user invokes it; otherwise follow `.agents/skills/grilling/SKILL.md` directly.
- To synthesize an existing discussion into a specification, also use `.agents/skills/to-spec/SKILL.md`.
- To break an approved plan or specification into executable tickets, also use `.agents/skills/to-tickets/SKILL.md`.
- To triage existing work, also use `.agents/skills/triage/SKILL.md`.
- To map a large investigation or multi-stage body of work, use `.agents/skills/wayfinder/SKILL.md`.
- For issue or release context derived from commits and pull requests, also use `.agents/skills/_git-release-workflow/SKILL.md`.

If several entries match, read all relevant skills. MLS-specific skills and repository instructions take precedence over third-party skills when they conflict.

## Evidence and requirements

- Use `reference/mls/documents/research/mls-texas/BA-report.md` as a discovery input and follow `context/README.md` to the relevant canonical or approved context. Research evidence is not automatically an approved Vietnam specification.
- Carry `FACT`, `SOURCE CLAIM`, `INFERENCE`, `PROPOSAL`, and `OPEN QUESTION` labels into plans and specs when the distinction matters.
- Convert Texas-specific rules into explicit discovery questions unless the user or an authoritative Vietnam source confirms adoption.
- Separate product behavior, regulatory policy, data governance, integration contracts, and technical implementation in every substantial specification.

## Planning workflow

- Before creating a new Linear task, complete a grilling flow to reach shared understanding:
  1. Explore the repository, existing Linear context, and other available sources for facts instead of asking the user for discoverable information.
  2. Identify unresolved product or implementation decisions and ask about them one at a time. Include a recommended answer with every question.
  3. Walk through dependent decisions until the goal, background, scope, non-goals, and acceptance criteria are concrete.
  4. Summarize the resulting task and ask the user to confirm that shared understanding before creating it.
- Do not repeat grilling already completed in the current conversation. If all decisions are already resolved, skip directly to the summary and confirmation step.
- Treat a prior spec, ticket breakdown, or planning flow as sufficient only when it establishes the same shared understanding and the user has confirmed it.
- Do not create the task until the user confirms the shared understanding.
- Read the parent issue, relevant children, comments, and available code context before proposing a breakdown.
- Separate implementation, QA, data, AI, DevOp, legal/discovery, and support work according to scope.
- Keep tickets independently understandable, with explicit scope, non-goals, and acceptance criteria.
- Preserve the parent issue's priority, cycle, and project unless the user requests a change.
- Do not create or update Linear issues until the user's request authorizes the write.

## After-code workflow

- Inspect `git status -sb` and the relevant diff before summarizing completed work.
- Distinguish staged, unstaged, and untracked changes; do not attribute unrelated worktree changes to the current task.
- Use the existing broken-down issue when appropriate instead of creating a redundant sub-issue.
- Include the commit ID in the related Linear comment only after a commit exists.
