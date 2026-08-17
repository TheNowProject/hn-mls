# VMLS data workspace

This repository contains a Vietnamese, static Vite/React pre-MVP for VMLS lookup, represented inventory, listing distribution, and property-transfer operations. The root route is a data-first registry workbench; role-scoped application, inventory, queue, and dossier surfaces sit behind it.

Start with the [repository context router](./context/README.md), then read the [current product state](./context/product/current-state.md), the [operational workspace contract](./context/product/vmls-operational-workspace.md), and the [v2 process proposal](./context/product/vmls-process-v2.md).

> **PROPOSAL:** The configured lifecycle follows `vmls-process-v2`. It does not establish an approved legal, tax, identity, notarization, cadastral, developer, or production-integration workflow.

## What is implemented

- A persistent application shell with global search, role-specific navigation, real queue filters, data tables, record detail tabs, forms, document checklists, integration events, and audit history.
- A registry workbench landing with combined filters for NPID or keyword, area, developer, and project. It distinguishes NPID/PLID/PTID and opens either a represented Tin bán or an operational dossier.
- A role-specific application hub that shows the wider VMLS capability and third-party exchange map. Implemented applications can be opened, configured capture records can be inspected, and event-only or unconfigured modules have no false action.
- A five-record synthetic inventory of effective Tin bán whose seller representation has been confirmed and whose collaboration scope is open.
- Môi giới lookup, `Đăng ký hợp tác bán`, a channel preflight, an explicit public-field allowlist, and a HouseNow outbound event that stops at `Đã gửi · Chờ phản hồi kênh`. Sàn môi giới receives a read-only inventory projection.
- Two independent dossiers: the S2-12A HĐMB-transfer case and a synthetic Phú Thượng landed-property case.
- Separate Bất động sản/`NPID`, Tin bán/`PLID`, and Giao dịch/`PTID` records and lifecycles.
- Payload validation and actor/state guards for the Môi giới, Người bán, Người mua, VPCC, Chủ đầu tư, and VPĐKĐĐ jobs.
- Automatic PLID creation after seller confirmation and automatic PTID/tax-event/routing updates after a valid VPCC signing result.
- Role-scoped projections for all six market actors plus VMLS operations, VPCC, and VPĐKĐĐ. Bank records appear only after explicit buyer consent.
- Dated local captures for VNeID, the 357 public portal, and the HouseNow apartment category, displayed only in read-only connection previews; the exact HouseNow icon remains on the HouseNow channel record.
- Separate versioned browser-state replay for the two transaction dossiers and the represented-inventory actions, plus one confirmed reset action.
- A standalone VMLS identity using the canonical living-registry palette and typography; HouseNow is a distribution channel, not a brand byline.

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
