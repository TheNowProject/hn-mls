---
title: Test strategy
status: current
authority: supporting
last_reviewed: 2026-08-15
---

# Test strategy

This strategy covers the static VMLS public pre-MVP demo. It verifies a persuasive and internally consistent walkthrough, not production policy, security, external contracts, or legal correctness.

## Automated coverage

- Demo-data tests enforce exactly six market roles, separate external/system workspaces, two independent dossiers, distinct `NPID`/`PLID`/`PTID` identities, masked parties, sourced area concepts, and allowed evidence labels.
- State-machine tests cover stage guards, responsible actors, Listing status `Đã khởi tạo`, buyer-readiness ordering, the single recoverable VPCC supplement, append-oriented histories, invalid-action no-ops, automatic routing, both branch outcomes, and versioned serialization/reset.
- Playwright coverage must include the common journey, Developer and VPĐKĐĐ outcomes, role projections, pilot brief, hash-route restoration, browser persistence/reset, and required local assets.
- Lint, demo-contract type checking, unit tests, production build, and browser tests are required release gates.

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Browser and presentation verification

Verify at minimum:

- `1440 × 900` and `1920 × 1080` for the primary presentation;
- `1024 × 768` for compact desktop/tablet;
- `390 × 844` for mobile;
- keyboard navigation, visible focus, semantic labels, sufficient contrast, and reduced motion;
- no missing fonts or images, unexpected console errors, or unexpected network requests;
- readable Vietnamese labels and identifiers at the intended recording scale.

## End-to-end smoke path

1. Open the introduction, identify the `Mô phỏng đề xuất` boundary, and enter each dossier independently.
2. Complete the common journey with the correct role at each gate; exercise and recover from one `Yêu cầu bổ sung` path.
3. Confirm PLID remains `Đã khởi tạo`, PTID appears only after the notarization result, tax events append, and routing is automatic.
4. Complete VPĐKĐĐ approval for the landed Property and Developer intake → confirmation → buyer receipt for the HĐMB case.
5. Confirm the living record retains separate Property, Listing, and Transaction identities and histories.
6. Inspect Sàn môi giới and Ngân hàng projections, the attributed 357 capture, restrained HouseNow reference, and pilot brief.
7. Reload a hash route to verify progress restoration, then use `Khôi phục dữ liệu mẫu` and confirm both dossiers return to their configured initial state.

Store the independent dogfood report and evidence under `output/qa/vmls-interactive-demo/`. Generated browser screenshots and recordings remain local and uncommitted.

## Deliberately not covered

- Real authentication, authorization, API, database, concurrency, backup, recovery, load, or security testing; those systems do not exist in this demo.
- VNeID, VPCC, tax, VPĐKĐĐ, Developer Portal, 357, HouseNow, or other external contract tests; all are mocked or represented by local reference assets.
- Validation of legal, tax, cadastral, notarization, identity, or developer-transfer policy.

Production-grade acceptance criteria remain future work after the pilot boundary and external contracts are approved.
