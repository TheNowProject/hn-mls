# Worker Agent Instructions

## Skill loading

Use repository skills as the source of detailed workflow rules. Read the full matching `SKILL.md` before acting.

- For implementation, refactoring, code review, validation, data modeling, access control, or integration work, use `.agents/skills/_mls-development/SKILL.md`.
- For commits and pull requests, also use `.agents/skills/_git-release-workflow/SKILL.md`.
- For diagnosing bugs or performance regressions, also use `.agents/skills/diagnosing-bugs/SKILL.md`.
- For an explicit code review request, also use `.agents/skills/code-review/SKILL.md`.
- For architecture or module-boundary design, use `.agents/skills/codebase-design/SKILL.md`; use `.agents/skills/improve-codebase-architecture/SKILL.md` when the user asks for a broader architecture assessment.
- Use `.agents/skills/tdd/SKILL.md` only when the user explicitly requests tests or TDD.
- Use `.agents/skills/implement/SKILL.md` for implementation from an approved spec or ticket set only when its workflow is requested or clearly applicable. Do not let it override MLS-specific evidence and domain rules.

If several entries match, read all relevant skills. MLS-specific skills and repository instructions take precedence over third-party skills when they conflict.

## Worktree safety

- Check `git status --short` before editing.
- Treat existing or unexpected changes as user or other-session work.
- Do not modify, format, stage, revert, or commit unrelated changes.
- When committing, stage only files or hunks belonging to the requested task and inspect `git diff --cached` before creating the commit.

## Scope and completion

- Implement only when the user requests a change. For diagnosis or review requests, report findings without changing code unless the user also asks for a fix.
- Keep changes focused and avoid abstractions that are not needed by the requested behavior.
- Verify changes in proportion to risk. Run the narrowest relevant checks first and document any checks unavailable because the implementation stack has not been selected yet.
- Do not commit, push, create a pull request, deploy, or modify an external issue unless the user requests that action.
