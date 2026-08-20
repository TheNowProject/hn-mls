# VMLS data workspace

This repository contains a Vietnamese, static Vite/React pre-MVP for VMLS lookup, represented inventory, seller-controlled listing publication, distribution, and property-transfer coordination. The root route is a data-first registry workbench; role-scoped application, inventory, queue, dossier, and external-status surfaces sit behind it.

Start with the [repository context router](./context/README.md), then read the [current product state](./context/product/current-state.md), the [operational workspace contract](./context/product/vmls-operational-workspace.md), and the [v2 process proposal](./context/product/vmls-process-v2.md).

> **PROPOSAL:** The configured lifecycle follows `vmls-process-v2`. It does not establish an approved legal, tax, identity, notarization, cadastral, developer, or production-integration workflow.
>
> **PROPOSAL — 357:** The demo treats the configured 357 source record as the issuer of NPID and preserves its field provenance. This is a fixture contract, not evidence of an official identifier policy or live 357 interface.

## What is implemented

- A persistent application shell with global search, role-specific navigation, queue filters, data tables, record detail tabs, forms, document checklists, source-status events, integration events, and audit history.
- A registry workbench landing with combined filters for NPID or keyword, area, developer, and project. It distinguishes NPID/PLID/PTID and opens either a represented Tin bán or an operational dossier. The configured `PropertySourceRecord357` supplies record-level provenance and uses the 357-issued NPID directly.
- A role-specific application hub that shows the wider VMLS capability and third-party exchange map. Implemented applications can be opened, configured capture records can be inspected, and event-only or unconfigured modules have no false action.
- A five-record synthetic inventory of effective Tin bán whose seller representation has been confirmed and whose collaboration scope is open.
- Per-PLID publication profiles controlled by the owning Người bán: draft and applied versions, locked mandatory field groups, optional field groups, and a Public preview that structurally omits hidden data. Public lookup and HouseNow use the applied version; represented inventory uses a separate Industry projection.
- A seller price-correction request that Sàn môi giới can reconcile as an append-only Tin bán revision. Previously distributed HouseNow data becomes `Cần cập nhật`; the demo does not claim that an external channel changed automatically.
- Môi giới lookup, `Đăng ký hợp tác bán`, channel preflight, and a HouseNow outbound event that stops at the local acknowledgement state. Sàn môi giới also declares the Người mua and hands the notarization dossier off from VMLS.
- Two independent dossiers: the S2-12A HĐMB-transfer case and a synthetic Phú Thượng landed-property case.
- Separate Bất động sản/`NPID`, Tin bán/`PLID`, and Giao dịch/`PTID` records and lifecycles.
- Payload validation and actor/state guards for Môi giới, Sàn môi giới, Người bán, Người mua, Chủ đầu tư, and Vận hành VMLS jobs. VPCC, VPĐKĐĐ, and Cơ quan thuế have no VMLS business command.
- Automatic PLID creation after seller confirmation. When VMLS receives the final configured VPCC result it creates PTID, determines the transfer route, and prepares applicable tax and land-registry handoffs. Tax status is tracked in parallel and does not gate either route.
- Role-scoped projections for all six market actors plus VMLS operations, VPCC, VPĐKĐĐ, and Cơ quan thuế. Agency queues and details are read-only projections of synchronized source status. Bank records appear only after explicit buyer consent.
- Processing milestones and source timelines for Môi giới, Sàn, Người bán, and Người mua, with raw source status, normalized status, source update time, VMLS receipt time, and the processing organization kept distinct.
- A local two-step `Đăng nhập bằng VNeID` handoff with masked identity and explicit sharing scope. Its versioned session persists through reload, does not change the selected role, is not cleared by dossier reset, and makes no request to VNeID.
- Dated local captures for VNeID, the 357 public portal, and the HouseNow apartment category; the exact HouseNow icon remains on the HouseNow channel record.
- Versioned browser-state replay for transaction journeys (`v4`), represented-market governance, and the independent VNeID session, plus one confirmed reset action for demo business data.
- A standalone VMLS identity using the canonical living-registry palette and typography; HouseNow is a distribution channel, not a brand byline.

The client uses only configured, synthetic, or masked records. It has no backend, database, production authentication, analytics, or live external API.

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

The repeatable 20–22 minute operational runbook is [context/product/vmls-demo-playbook.md](./context/product/vmls-demo-playbook.md).

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
