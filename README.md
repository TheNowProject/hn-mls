# HouseNow MLS

HouseNow MLS is an executable Vietnam-focused Multiple Listing Service prototype. It models six market actors and demonstrates governed workflows for Property identity, Listing lifecycle, representation, consent, source provenance, field-level access, and audit history.

Start with the [repository context router](./context/README.md). New contributors can then read the [HouseNow MLS primer](./context/research/primer.md) and [current product state](./context/product/current-state.md).

## Canonical market actors

1. Real-estate Agent (`Môi giới BĐS`)
2. Brokerage (`Sàn môi giới`)
3. Developer (`Chủ đầu tư`)
4. Buyer (`Người mua`)
5. Owner/Seller (`Người bán / Chủ sở hữu`)
6. Bank (`Ngân hàng`)

Data Steward, Organization Admin, and System Admin are operational roles, not additional market actors. Regulator remains deferred oversight scope until a lawful workflow is approved.

## Run the prototype

Requires Node.js 22 or newer.

```bash
npm install
npm run dev:full
```

- Web: `http://127.0.0.1:5180`
- API: `http://127.0.0.1:5181`

```bash
npm run lint
npm test
npm run build
```

Use the role selector to explore actor-specific projections and switch data spaces to compare synthetic Ho Chi Minh City (`TP. Hồ Chí Minh`) and Hanoi (`Hà Nội`) records.

## Repository map

```text
context/    Canonical knowledge, specifications, decisions, research, and QA context
src/        React interface and actor workspaces
server/     HTTP API, authorization, lifecycle policy, audit, and SQLite persistence
test/       Domain, API integration, and backup tests
reference/  Immutable legacy research snapshot
tmp/        Ignored local media, archives, credentials, and scratch artifacts
```

Read [`AGENTS.md`](./AGENTS.md) before assigning repository work to an agent. The current product baseline and reading routes live under [`context/`](./context/); `reference/mls/` remains an immutable evidence snapshot.
