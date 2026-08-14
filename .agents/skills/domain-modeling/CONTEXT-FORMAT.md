# context/domain/language.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max. Define what it IS, not what it does.
- **Only include terms specific to this project's context.** General programming concepts (timeouts, error types, utility patterns) don't belong even if the project uses them extensively. Before adding a term, ask: is this a concept unique to this context, or a general programming concept? Only the former belongs.
- **Group terms under subheadings** when natural clusters emerge. If all terms belong to a single cohesive area, a flat list is fine.

## Repository knowledge layout

This repository uses `context/README.md` as its router and `context/domain/language.md` as its single canonical domain glossary. When several domain areas need grouping, add headings or additional files under `context/domain/`; do not create context trees inside source modules.

The router lists the maintained knowledge areas and their relationships:

```md
# Context Map

## Domain context

- `context/domain/language.md` — canonical terminology
- `context/domain/business-rules.md` — working domain rules
- `context/decisions/` — accepted, hard-to-reverse choices

## Relationships

- **Product → Domain**: product specifications use canonical domain terms
- **Decisions → Product**: accepted decisions constrain working plans
- **Research → Product**: research informs but does not override product context
```

Read `context/README.md` first. Create `context/domain/language.md` lazily only in repositories that do not already have a context router or documented knowledge convention.
