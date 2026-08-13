# U.S. MLS feature analysis

Status: `RESEARCH INPUT`

Original analysis date: 2026-08-10

Imported into HN-VMLS: 2026-08-13

## Purpose

This folder preserves the U.S. Multiple Listing Service feature analysis created in the preceding Codex conversation. It is supporting research for HouseNow MLS, not an approved Vietnam product specification.

## Evidence boundary

- `SOURCE CLAIM`: Current U.S. MLS policy, platform, and standards statements come from the linked NAR, RESO, CRMLS, ICE, and MLS Grid sources in the report.
- `INFERENCE`: Capability maturity scores, architectural interpretation, strengths, weaknesses, and opportunity ranking are the analyst's synthesis of those sources.
- `PROPOSAL`: MVP, V1, V2, KPI, and architecture recommendations are design options only.
- `OPEN QUESTION`: Applicability to Vietnam, local governance, legal policy, listing lifecycle, distribution rules, membership structure, and field visibility remain unresolved unless separately decided in current HouseNow specifications.

Nothing in this folder promotes a U.S. or Texas-specific behavior into a HouseNow requirement. Current terminology and approved scope continue to come from [`CONTEXT.md`](../../CONTEXT.md), [`MASTER_PLAN.md`](../../MASTER_PLAN.md), and the current files under [`docs/`](../../docs/).

## Deliverables

- [`Phan_tich_feature_MLS_My_2026.docx`](./Phan_tich_feature_MLS_My_2026.docx): final editable report.
- [`Phan_tich_feature_MLS_My_2026.pdf`](./Phan_tich_feature_MLS_My_2026.pdf): final visually verified PDF render.
- [`conversation-context.md`](./conversation-context.md): task context, findings, sources, assumptions, and handoff notes from the conversation.
- [`build_us_mls_feature_report.py`](./build_us_mls_feature_report.py): deterministic source used to generate the DOCX.

Rendered page PNGs and the superseded first render are retained under `tmp/conversation-imports/us-mls-feature-analysis/`. That directory is intentionally ignored by Git.

## Scope

The report covers the recurring pattern of residential MLS organizations and front-end platforms in the United States. It distinguishes:

1. the MLS as a governed cooperation, data, entitlement, licensing, and distribution infrastructure;
2. the software platform used by brokers and agents, such as Matrix, Paragon, Flexmls, or Perchwell;
3. downstream capabilities such as IDX, VOW, syndication, showing, lockbox, CMA, tax data, CRM, and transaction integrations.

It does not provide state-by-state legal advice, a commercial MLS/CIE specification, or a production-ready Vietnam policy.

## Rebuild note

The report builder uses the bundled `python-docx` runtime expected by Codex document workflows. It writes the DOCX back into this folder. Visual delivery still requires rendering every page and checking the resulting PNGs before replacing the checked-in PDF.
