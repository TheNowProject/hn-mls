# VMLS interactive demo

This repository contains a Vietnamese, static pre-MVP demo of the VMLS Living Registry idea. It is designed to help senior stakeholders understand how VMLS keeps **Bất động sản / NPID**, **Tin bán / PLID**, and **Giao dịch / PTID** distinct while orchestrating a traceable property-transfer journey.

> **PROPOSAL:** The journey follows `vmls-process-v2` for demonstration. It is not an approved legal, tax, identity, notarization, cadastral, developer, or production integration workflow.

Start with the [repository context router](./context/README.md), then read the [current product state](./context/product/current-state.md) and the [v2 process proposal](./context/product/vmls-process-v2.md).

## Canonical market actors

1. Real-estate Agent (`Môi giới BĐS`)
2. Brokerage (`Sàn môi giới`)
3. Developer (`Chủ đầu tư`)
4. Buyer (`Người mua`)
5. Owner/Seller (`Người bán / Chủ sở hữu`)
6. Bank (`Ngân hàng`)

Data Steward, Organization Admin, and System Admin are operational roles, not additional market actors. Regulator remains deferred oversight scope until a lawful workflow is approved.

## What the demo contains

- Two independent dossiers: a Sun Grand City Thụy Khuê Residence HĐMB transfer and a synthetic landed-property transfer.
- A gated common journey from Property matching and Seller confirmation through Listing creation, notarization readiness, PTID creation, tax events, and automatic routing.
- Two mocked outcomes: Developer/HĐMB transfer and VPĐKĐĐ approval.
- The six market perspectives listed above.
- Separate simulated workspaces for VMLS, Văn phòng công chứng, and Văn phòng đăng ký đất đai.
- A dated 357 reference screenshot and a restrained HouseNow distribution-channel reference; neither implies endorsement or a live integration.

All external integrations and authority actions are labelled `Mô phỏng đề xuất`. The demo uses only bundled, synthetic or masked data.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5180`.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The application is a static Vite/React client. It has no backend, database, authentication, analytics, or live external API. Demo progress is stored in versioned browser `localStorage`; hash routes keep dossier, role, and pilot views directly addressable on static hosting.

## Repository map

```text
context/    Canonical knowledge, proposals, research, and quality context
src/        React interface, configured demo records, and journey state machine
test/       Demo-data and state-machine unit tests
e2e/        Browser journey and responsive checks
public/     Self-hosted public demo assets
reference/  Immutable legacy research snapshot
output/     Local QA and recording evidence; generated captures remain uncommitted
tmp/        Ignored source media, credentials, and scratch artifacts
```

The committed presenter guide is [context/product/vmls-demo-playbook.md](./context/product/vmls-demo-playbook.md).

Read [`AGENTS.md`](./AGENTS.md) before assigning repository work. Product intent wins only when it is marked accepted, locked, or canonical; implemented demo behavior does not promote a proposal into Vietnam policy.
