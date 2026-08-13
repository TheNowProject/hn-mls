# HouseNow MLS

Prototype MLS chạy được dành cho thị trường Việt Nam, xây dựng bằng React với sáu góc nhìn người dùng. Team và founder có thể dùng bản local để khám phá trọn các luồng từ tìm Property, quản lý Listing, khách hàng, lịch xem, CMA đến quality review và audit trên dữ liệu mô phỏng tại TP. Hồ Chí Minh và Hà Nội.

## Repo này giải quyết điều gì?

HouseNow MLS thử nghiệm một nền tảng dữ liệu bất động sản dùng chung, trong đó:

- `Property` là định danh tài sản ổn định; `Listing` là một lần chào bán hoặc cho thuê có vòng đời riêng.
- Dữ liệu được phân quyền theo actor, tổ chức, mục đích truy cập và mức độ nhạy cảm.
- Giá, trạng thái, nguồn và lịch sử giao dịch được lưu theo sự kiện, không ghi đè quá khứ.
- Mọi thay đổi quan trọng đều có lý do và audit trail.

## Tôi đã research như thế nào?

Research bắt đầu từ một MLS đang vận hành tại Texas, sử dụng BA report, transcript, 24 frame chọn lọc và 26 contact sheet trong [`reference/mls`](./reference/mls). Quy trình gồm:

1. Quan sát search, listing detail, listing input, status lifecycle, portal và Cloud CMA.
2. Phân loại bằng chứng thành `FACT`, `SOURCE CLAIM`, `INFERENCE`, `PROPOSAL` và `OPEN QUESTION`.
3. Giữ các nguyên tắc MLS có thể tái sử dụng, nhưng không sao chép chính sách Texas sang Việt Nam.
4. Xây domain model, permission matrix, business rules và acceptance criteria cho HouseNow.
5. Chuyển đặc tả thành một vertical slice có thể chạy và kiểm thử.

Đọc thêm: [kết quả discovery](./docs/research/phase-1-discovery.md), [product requirements](./docs/product/product-requirements-baseline.md) và [domain language](./CONTEXT.md).

## Sáu actor chính

| Actor | Use case chính trong MLS |
|---|---|
| **Môi giới** | Tìm Property, xem Property 360, tạo/quản lý Listing, quản lý khách hàng, đặt lịch xem và tạo CMA. |
| **Sàn môi giới** | Review hồ sơ, đổi trạng thái, quản lý inventory của sàn, xử lý quality queue, thành viên và entitlement. |
| **Chủ đầu tư** | Khám phá Project/Unit inventory, availability, giá, trạng thái pháp lý và assignment phân phối. |
| **Ngân hàng** | Khám phá finance-fit theo purpose/consent và ghi nhận bước xử lý của từng hồ sơ. |
| **Cơ quan quản lý** | Theo dõi tín hiệu thị trường, mở hồ sơ giám sát và xử lý quality issue trong phạm vi thẩm quyền. |
| **Người mua** | Tìm Listing đã xác minh, xem lịch sử giá, quản lý shortlist, đặt lịch xem và báo sai dữ liệu. |

`Data Steward` là vai trò vận hành bổ sung: xử lý trùng Property, xung đột nguồn, định danh, provenance, taxonomy và quality issue. Đây không phải System Admin.

## Hiện tại đang ở giai đoạn nào?

Repo đang ở **Phase 6 — exploration-ready local prototype**:

- Phase 0–2: hoàn tất draft product alignment, discovery và domain specification.
- Phase 3–4: triển khai prototype sáu actor và khóa working scope cho vertical slice.
- Phase 5: có React frontend, HTTP API, SQLite persistence, backend authorization và audit trail.
- Phase 6: luồng lõi, Property Intelligence và các workspace khám phá đã chạy end-to-end trên local.

Luồng hiện có:

```text
Tìm Property → xem giá/lịch sử/nguồn → tạo Listing → validation
→ sàn review → Active → Pending → Closed → Closing Record + Audit
```

Property Intelligence bao gồm price events, original/current price, DOM/CDOM, relist, lịch sử Listing, closing records, source events và CMA candidate có human review.

Các flow khám phá đã có điểm kết thúc rõ ràng:

- Search với filter nâng cao, sort, list/map và Property 360 theo từng actor.
- Contacts với nhu cầu, shortlist, ghi chú, tạo khách hàng và xác nhận lịch xem.
- CMA với subject Property, include/exclude comparable, rationale và báo cáo khoảng giá.
- Quality Queue với filter, assignment, evidence, kết luận và cập nhật hàng đợi.
- Organization với thành viên, entitlement review và lời mời theo role/scope.
- Quyền & chia sẻ với actor-to-actor projection, field matrix, consent, Access Request có thời hạn và sensitive-read audit.
- Notification Center theo từng actor và data space; mỗi thông báo chỉ dẫn tới workspace actor được phép truy cập.
- Project, Finance, Oversight và Shortlist với record detail và next step.
- App Hub nối MLS Core, CMA Studio, Showing Desk và Distribution Monitor.

Listing lifecycle, Access Request, quyết định quyền, backend authorization và audit được lưu qua SQLite. Các thao tác khám phá ngoài core như lịch xem, client note, lời mời và CMA draft hiện được giữ trong phiên trình duyệt để phục vụ review UX.

Prototype có 26 Property mô phỏng tại hai data space: 12 ở TP. Hồ Chí Minh và 14 ở Hà Nội. Đây chưa phải pilot/production: authentication, consent, dữ liệu địa chính, tích hợp đối tác và chính sách pháp lý vẫn cần được xác nhận.

Trạng thái chi tiết: [PHASE_STATUS.md](./docs/PHASE_STATUS.md). Phase 6.3 đã có [build plan System Admin](./docs/product/phase-6-3-system-admin-build-plan.md): tách control plane khỏi quyền đọc dữ liệu và dùng Break-glass Access cho trường hợp khẩn cấp.

## Chạy prototype

Yêu cầu Node.js 22 trở lên.

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

Gợi ý khám phá: đổi `Góc nhìn` ở header để chuyển giữa sáu actor; đổi `Không gian dữ liệu` ở sidebar để so sánh TP. Hồ Chí Minh và Hà Nội.

## Kiến trúc ngắn gọn

```text
src/        React UI và actor-specific workspaces
server/     HTTP API, auth, lifecycle policy và SQLite adapter
test/       Domain, API integration và backup tests
docs/       Product, domain, decision và technical specifications
reference/  Research snapshot và bằng chứng gốc
```

Tài liệu điều hướng tổng thể nằm tại [MASTER_PLAN.md](./MASTER_PLAN.md); API local nằm tại [docs/technical/api.md](./docs/technical/api.md).
