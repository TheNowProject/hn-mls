# VMLS transaction flow — step-by-step screens

> **Superseded for review:** the revised workflow and screens are available in [VMLS transaction flow v2](./vmls-process-v2.md). This file preserves the original 24-step draft for comparison.

> Evidence status: **PROPOSAL** — storyboard screens generated for stakeholder review, not an approved legal or production workflow.
>
> Naming note: **HNRE in the supplied flow is treated as VMLS**. Property (`NPID`), Listing (`PLID`), Transaction (`PTID`) and Closing Record remain separate objects.

## Review map

| Step | Actor | Screen / outcome |
|---:|---|---|
| 01 | Môi giới | Tiếp nhận nhu cầu rao bán |
| 02 | Môi giới | Nhập khách bán và thông tin BĐS |
| 03 | Người bán | Xác nhận quyền đại diện |
| 04 | VMLS | Sinh PLID và kích hoạt Listing |
| 05 | Môi giới / VPCC | Chuẩn bị hồ sơ công chứng |
| 06 | VMLS | Khởi tạo hồ sơ giao dịch |
| 07 | VPCC | Cập nhật trạng thái, sau đó VMLS sinh PTID |
| 08 | VMLS | Gửi dữ liệu sang HouseNow T-VAN |
| 09 | VMLS | Chuyển thông tin cho Cơ quan Thuế |
| 10 | Cơ quan Thuế | Phát hành yêu cầu đóng thuế trên eTax |
| 11 | Người bán | Đóng thuế trên eTax |
| 12 | Cơ quan Thuế → VMLS | Cập nhật PTID “Đã đóng thuế” |
| 13 | Cơ quan Thuế / eTax | Trả xác nhận nộp NSNN |
| 14 | Sàn / Môi giới | Thực hiện đóng thuế qua T-VAN |
| 15 | Người bán | Chọn tuyến sang tên VPĐKĐĐ hoặc CĐT |
| 16 | Người bán | Nộp sổ đỏ và PTID |
| 17 | VPĐKĐĐ → VMLS | Cập nhật PTID “Đã sang tên” |
| 18 | VMLS / Hệ định danh | Đồng bộ VNeID và NPID |
| 19 | Người mua | Nhận thông báo và giấy chứng nhận |
| 20 | Người bán | Nộp HĐMB và PTID cho CĐT |
| 21 | Chủ đầu tư | Tiếp nhận hồ sơ qua Portal |
| 22 | Chủ đầu tư | Xác nhận chuyển nhượng |
| 23 | Người mua | Nhận HĐMB mới |
| 24 | VMLS | Đối soát, cập nhật và tạo Closing Record |

## Listing và quyền đại diện — Steps 01–04

### Step 01 — Môi giới tiếp nhận nhu cầu

![Step 01 — Môi giới tiếp nhận nhu cầu](./assets/vmls-process-steps/step-01-agent-intake.png)

### Step 02 — Môi giới nhập khách bán và BĐS

![Step 02 — Môi giới nhập khách bán và BĐS](./assets/vmls-process-steps/step-02-agent-property-seller.png)

### Step 03 — Người bán xác nhận quyền đại diện

![Step 03 — Người bán xác nhận quyền đại diện](./assets/vmls-process-steps/step-03-seller-representation.png)

### Step 04 — VMLS sinh PLID

![Step 04 — VMLS sinh PLID](./assets/vmls-process-steps/step-04-vmls-create-plid.png)

## Công chứng và khởi tạo giao dịch — Steps 05–08

### Step 05 — Chuẩn bị hồ sơ công chứng

![Step 05 — Chuẩn bị hồ sơ công chứng](./assets/vmls-process-steps/step-05-notary-dossier.png)

### Step 06 — VMLS khởi tạo hồ sơ giao dịch

![Step 06 — VMLS khởi tạo hồ sơ giao dịch](./assets/vmls-process-steps/step-06-vmls-create-deal.png)

### Step 07 — VPCC cập nhật trạng thái, sau đó VMLS sinh PTID

![Step 07 — VPCC cập nhật trạng thái, sau đó VMLS sinh PTID](./assets/vmls-process-steps/step-07-notary-status-ptid.png)

### Step 08 — VMLS gửi dữ liệu sang HouseNow T-VAN

![Step 08 — VMLS gửi dữ liệu sang HouseNow T-VAN](./assets/vmls-process-steps/step-08-vmls-tvan-delivery.png)

## Thuế — Steps 09–14

### Step 09 — VMLS chuyển thông tin cho Cơ quan Thuế

![Step 09 — VMLS chuyển thông tin cho Cơ quan Thuế](./assets/vmls-process-steps/step-09-vmls-tax-delivery.png)

### Step 10 — Cơ quan Thuế phát hành yêu cầu đóng thuế

![Step 10 — Cơ quan Thuế phát hành yêu cầu đóng thuế](./assets/vmls-process-steps/step-10-tax-notice.png)

### Step 11 — Người bán đóng thuế trên eTax

![Step 11 — Người bán đóng thuế trên eTax](./assets/vmls-process-steps/step-11-seller-etax-payment.png)

### Step 12 — Cơ quan Thuế cập nhật trạng thái cho VMLS

![Step 12 — Cơ quan Thuế cập nhật trạng thái cho VMLS](./assets/vmls-process-steps/step-12-tax-vmls-paid-status.png)

### Step 13 — eTax trả xác nhận nộp ngân sách

![Step 13 — eTax trả xác nhận nộp ngân sách](./assets/vmls-process-steps/step-13-tax-budget-confirmation.png)

### Step 14 — Sàn / Môi giới thực hiện đóng thuế qua T-VAN

![Step 14 — Sàn / Môi giới thực hiện đóng thuế qua T-VAN](./assets/vmls-process-steps/step-14-brokerage-tvan.png)

## Điểm rẽ nhánh — Step 15

### Step 15 — Người bán chọn tuyến sang tên

![Step 15 — Người bán chọn tuyến sang tên](./assets/vmls-process-steps/step-15-seller-transfer-route.png)

## Nhánh A: Văn phòng đăng ký đất đai — Steps 16–19

### Step 16 — Người bán nộp sổ đỏ và PTID

![Step 16 — Người bán nộp sổ đỏ và PTID](./assets/vmls-process-steps/step-16-seller-land-documents.png)

### Step 17 — VPĐKĐĐ cập nhật PTID “Đã sang tên”

![Step 17 — VPĐKĐĐ cập nhật PTID](./assets/vmls-process-steps/step-17-land-registry-transfer.png)

### Step 18 — VMLS đồng bộ VNeID và NPID

![Step 18 — VMLS đồng bộ VNeID và NPID](./assets/vmls-process-steps/step-18-vmls-identity-sync.png)

### Step 19 — Người mua nhận thông báo và giấy chứng nhận

![Step 19 — Người mua nhận thông báo và giấy chứng nhận](./assets/vmls-process-steps/step-19-buyer-certificate.png)

## Nhánh B: Chủ đầu tư — Steps 20–24

### Step 20 — Người bán nộp HĐMB và PTID

![Step 20 — Người bán nộp HĐMB và PTID](./assets/vmls-process-steps/step-20-seller-developer-documents.png)

### Step 21 — Chủ đầu tư tiếp nhận hồ sơ

![Step 21 — Chủ đầu tư tiếp nhận hồ sơ](./assets/vmls-process-steps/step-21-developer-intake.png)

### Step 22 — Chủ đầu tư xác nhận chuyển nhượng

![Step 22 — Chủ đầu tư xác nhận chuyển nhượng](./assets/vmls-process-steps/step-22-developer-confirm-transfer.png)

### Step 23 — Người mua nhận HĐMB mới

![Step 23 — Người mua nhận HĐMB mới](./assets/vmls-process-steps/step-23-buyer-new-contract.png)

### Step 24 — VMLS cập nhật dữ liệu và tạo Closing Record

![Step 24 — VMLS cập nhật dữ liệu và tạo Closing Record](./assets/vmls-process-steps/step-24-vmls-closing.png)

## Shared demo data

- Project: Sun Grand City Thụy Khuê Residence
- Unit: S2-12A
- Property ID: `NPID-HN-09876`
- Listing ID: `PLID-HN-00125`
- Transaction ID: `PTID-HN-00031`
- Closing Record: `CR-HN-00019`
- Seller: Trần Thị Minh Anh
- Buyer: Nguyễn Văn An
- Agent: Nguyễn Hoàng Nam
