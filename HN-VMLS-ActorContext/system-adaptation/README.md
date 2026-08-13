# Đánh giá khả năng thích ứng từ 357 và HouseNow

Ngày đánh giá: 2026-08-13

## Phạm vi

- **FACT** — Các artifact trong thư mục này được tạo từ static source audit đối với `357-cong-thong-tin` và `HouseNow-MonoRepo`.
- **FACT** — Đánh giá đối chiếu capability theo sáu actor VMLS: Môi giới, Sàn môi giới, Chủ đầu tư, Ngân hàng, Cơ quan quản lý và Người mua.
- **INFERENCE** — Mức độ tái sử dụng module và kiến trúc mục tiêu là nhận định từ source/schema/API/UI đã rà, không phải kết quả UAT hoặc xác nhận production.
- **PROPOSAL** — 357 giữ vai trò Regulatory System of Record; HouseNow giữ vai trò Engagement & Commercial Operations; các khoảng trống được bổ sung qua VMLS orchestration và bounded context mới.

## Artifact

- [Đánh giá tổng hợp](./VMLS-system-capability-assessment.md)
- [Audit hệ thống 357](./357-vmls-capability-audit.md)
- [Audit HouseNow](./HouseNow-vmls-capability-audit.md)
- [Sơ đồ actor/use case dùng làm context](./assets/vmls-actor-use-case-diagram-v3.png)

Các source code được dẫn bằng đường dẫn tuyệt đối tại thời điểm audit. Nếu vị trí checkout thay đổi, các link bằng chứng cần được cập nhật trước khi dùng lại.
