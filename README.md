# HouseNow MLS

Workspace cho product discovery, domain specification và local MVP của Housenow MLS.

## Trạng thái

- Phase 0: baseline tài liệu hoàn tất, chờ stakeholder phê duyệt các open decisions.
- Phase 1: discovery hoàn tất cho research snapshot được cung cấp; chưa có implementation repo để đánh giá code reuse.
- Phase 2: đặc tả draft hoàn tất, gồm domain, permission, lifecycle, data dictionary, business rules, acceptance criteria và traceability.
- Phase 3: prototype cho sáu actor chính đã triển khai; các màn hình giao dịch mở rộng vẫn đang tiếp tục.
- Phase 4: scope cho vertical slice đã khóa ở mức working baseline; còn chờ human sign-off.
- Phase 5: nền tảng local (React, HTTP API, SQLite, audit trail) đã vận hành.
- Phase 6: core vertical slice và Property Intelligence đã vận hành end-to-end; chưa phải bản pilot/production hoàn chỉnh.

Tài liệu bắt đầu tại [MASTER_PLAN.md](./MASTER_PLAN.md). Ngôn ngữ miền Housenow nằm tại [CONTEXT.md](./CONTEXT.md).

## Chạy local

```bash
npm install
npm run dev:full
```

Ứng dụng chạy tại `http://127.0.0.1:5180`; API chạy tại `http://127.0.0.1:5181`.

## Các lệnh chính

- `npm run dev`: chỉ chạy giao diện Vite
- `npm run dev:api`: chỉ chạy local API
- `npm run dev:full`: chạy giao diện và API cùng lúc
- `npm run build`: tạo production build trong `dist/`
- `npm run preview`: xem thử production build
- `npm run lint`: kiểm tra source code
- `npm test`: chạy domain, API integration và backup tests
- `npm run db:backup`: tạo và kiểm tra bản sao SQLite trong `var/backups/`

## Cấu trúc

```text
housenow-mls/
├── MASTER_PLAN.md
├── CONTEXT.md
├── docs/
│   ├── product/
│   ├── domain/
│   ├── decisions/
│   └── research/
├── reference/mls/  # Research snapshot, không chỉnh trực tiếp
├── server/          # HTTP API, SQLite adapter, auth và domain lifecycle
├── test/            # Domain/API/backup tests
└── src/             # React application
```

## Phạm vi Phase 6 hiện tại

Luồng đã nối thật: tìm Property → xem giá/lịch sử/nguồn → tạo Listing → validation → sàn duyệt → Active → Pending → Closed → audit. UI có góc nhìn riêng cho Môi giới, Sàn môi giới, Chủ đầu tư, Ngân hàng, Cơ quan quản lý và Người mua; Data Steward là lớp vận hành bổ sung. Không gian dữ liệu hiện có TP. Hồ Chí Minh và Hà Nội với 26 Property mô phỏng, market-specific dashboard, Listing, quality queue và Property Intelligence. Hệ thống dùng demo identity và dữ liệu local; tích hợp địa chính, đối tác, SSO, bảo mật production và phê duyệt pháp lý vẫn nằm ngoài phạm vi hiện tại.
