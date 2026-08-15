# VMLS operational workspace

This repository contains a Vietnamese, static Vite/React pre-MVP for working with two property-transfer dossiers. The root route is a data-first registry landing with real lookup, linked identifiers, current work, and external touchpoints; role-scoped queues and dossier forms remain the operational product behind it.

Start with the [repository context router](./context/README.md), then read the [current product state](./context/product/current-state.md), the [operational workspace contract](./context/product/vmls-operational-workspace.md), and the [v2 process proposal](./context/product/vmls-process-v2.md).

> **PROPOSAL:** The configured lifecycle follows `vmls-process-v2`. It does not establish an approved legal, tax, identity, notarization, cadastral, developer, or production-integration workflow.

## What is implemented

- A persistent application shell with global search, role-specific navigation, real queue filters, data tables, record detail tabs, forms, document checklists, integration events, and audit history.
- A registry workbench landing that searches configured data, distinguishes NPID/PLID/PTID, and deep-links into the same operational records.
- Two independent dossiers: the S2-12A HĐMB-transfer case and a synthetic Phú Thượng landed-property case.
- Separate Bất động sản/`NPID`, Tin bán/`PLID`, and Giao dịch/`PTID` records and lifecycles.
- Payload validation and actor/state guards for the Môi giới, Người bán, Người mua, VPCC, Chủ đầu tư, and VPĐKĐĐ jobs.
- Automatic PLID creation after seller confirmation and automatic PTID/tax-event/routing updates after a valid VPCC signing result.
- Role-scoped projections for all six market actors plus VMLS operations, VPCC, and VPĐKĐĐ. Bank records appear only after explicit buyer consent.
- Dated local captures for VNeID, the 357 public portal, and the HouseNow apartment category, displayed only in read-only connection previews; the exact HouseNow icon remains on the Tin bán channel record.
- Versioned browser-state replay and a confirmed reset action.

The client uses only configured, synthetic, or masked records. It has no backend, database, authentication, analytics, or live external API.

## Run locally

Node.js 22 or newer is required.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5180`.

Run the release checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The repeatable 15-minute operational runbook is [context/product/vmls-demo-playbook.md](./context/product/vmls-demo-playbook.md).

## Repository map

```text
context/    Canonical product, domain, research, and quality context
src/        React application, configured records, and reducer
test/       Data-contract and reducer tests
e2e/        Browser acceptance and responsive tests
public/     Self-hosted fonts and image assets
reference/  Immutable legacy research snapshot
output/     Local QA and recording evidence; do not commit generated captures
tmp/        Ignored source media, credentials, and scratch artifacts
```

Read [`AGENTS.md`](./AGENTS.md) before repository work. Implemented behavior does not promote a proposal into Vietnam policy.
