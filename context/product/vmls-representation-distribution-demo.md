---
title: VMLS represented inventory and distribution demo
status: PROPOSAL
updated: 2026-08-17
---

# Demo: nguồn hàng được đại diện và phân phối Tin bán

## Phạm vi nghiệp vụ

- **PROPOSAL:** Sau khi chủ sở hữu xác nhận quyền đại diện, một Tin bán đủ điều kiện được phép tra cứu trong phạm vi thị trường nội bộ.
- **PROPOSAL:** Môi giới khác chỉ thấy Industry projection phục vụ hợp tác; danh tính, liên hệ và hồ sơ riêng của chủ sở hữu không xuất hiện.
- **PROPOSAL:** Đăng sang một nền tảng tin đăng chỉ được thực hiện khi Tin bán còn hiệu lực và consent phân phối bao phủ đúng kênh, mục đích và thời hạn.
- **PROPOSAL:** VMLS chỉ gửi public projection đã duyệt, đồng thời ghi Distribution Event và trạng thái đồng bộ theo kênh.
- **PROPOSAL:** HouseNow trong demo là kênh ví dụ, không phải xác nhận một tích hợp đang vận hành.

## Quan hệ giữa hai màn

`Nguồn hàng được đại diện` → chọn Tin bán đủ điều kiện → `Đăng ký hợp tác bán` → kiểm tra quyền và phạm vi dữ liệu công khai → `Phân phối Tin bán` → ghi nhận trạng thái gửi theo kênh.

## Quyết định cho demo hiện tại

- **PROPOSAL:** Dùng một bộ dữ liệu synthetic riêng gồm năm căn hộ. Không tái sử dụng `NPID`/`PLID` của hai hồ sơ giao dịch vì hai hồ sơ đó bắt đầu trước khi Người bán xác nhận quyền đại diện.
- **PROPOSAL:** Kho chỉ nhận Tin bán có `PLID`, trạng thái `Đang hiệu lực`, Industry visibility `Được phép tra cứu`, quyền đại diện `Đã xác nhận` và còn hiệu lực, đồng thời có phạm vi hợp tác `Mở đăng ký`.
- **PROPOSAL:** Môi giới hợp tác là một actor khác với Môi giới phụ trách. Hành động `Đăng ký cùng bán` tạo một `CoBrokerRegistration`; nó không tạo thêm quyền đại diện của Người bán.
- **PROPOSAL:** Tra cứu kết hợp bốn tiêu chí `Mã định danh Bất động sản`, `Khu vực`, `Chủ đầu tư` và `Dự án` theo phép AND. Cùng tập dữ liệu này xuất hiện trên root lookup và trong workspace Môi giới/Sàn.
- **PROPOSAL:** Mỗi Distribution Event ghi phiên bản tập dữ liệu công khai cùng kênh, mục đích, thời điểm, trạng thái gửi và trạng thái phản hồi để lần bàn giao có thể được đối chiếu sau khi schema thay đổi.
- **PROPOSAL:** HouseNow là kênh tương tác được triển khai trong slice này. Kết quả dừng ở `Đã gửi` và `Chờ phản hồi kênh`; không khẳng định hệ thống ngoài đã đăng thành công.
- **PROPOSAL:** Môi giới hợp tác chỉ nhận Industry projection theo allowlist. Danh tính/liên hệ Người bán, bằng chứng đại diện, dữ liệu Người mua, tài chính, công chứng, PTID và correlation ID không nằm trong projection.

## Vị trí trong danh mục ứng dụng

- **PROPOSAL:** `Ứng dụng` hiển thị toàn bộ nhóm công cụ VMLS, kết nối theo hồ sơ và mô-đun mở rộng để người dùng hiểu phạm vi hệ sinh thái theo vai trò.
- **PROPOSAL:** `Nguồn hàng được đại diện`, `Đăng ký hợp tác bán` và `Phân phối Tin bán` là các chức năng có route cho Môi giới; Sàn chỉ có quyền tra cứu nguồn hàng và chi tiết.
- **PROPOSAL:** VNeID, Hệ thống thông tin 357 và HouseNow chỉ mở bản chụp/metadata local. Các điểm chỉ nhận sự kiện và mô-đun chưa cấu hình không có nút, liên kết hoặc click target.
- **FACT:** UI hiện tại dùng dấu hiệu VMLS độc lập theo brandkit. HouseNow chỉ xuất hiện như một kênh phân phối và bản chụp liên quan, không phải byline thương hiệu.

## 01. Kho căn được đại diện

Actor: **Môi giới tra cứu nguồn hàng**.

Mục tiêu: tìm Tin bán đã được xác nhận đại diện theo `NPID`, khu vực, Chủ đầu tư hoặc Dự án; xem phạm vi hợp tác và đăng ký cùng bán. Màn danh sách không hiển thị dữ liệu riêng của chủ sở hữu.

![Kho căn được đại diện](assets/vmls-representation-distribution-demo/01-represented-listing-inventory.png)

## 02. Phân phối Tin bán lên HouseNow

Actor: **Môi giới đã có đăng ký hợp tác bán còn hiệu lực**.

Mục tiêu: chọn kênh, kiểm tra điều kiện phân phối, rà soát dữ liệu công khai, xem trước tin và ghi nhận sự kiện gửi. Hệ thống nêu rõ các trường không được chia sẻ và chờ acknowledgement từ kênh.

![Phân phối Tin bán lên HouseNow](assets/vmls-representation-distribution-demo/02-publish-listing-to-housenow.png)

## Điểm cần chốt trước khi triển khai

- **OPEN QUESTION:** Môi giới hợp tác có được tự phân phối Tin bán hay phải qua phê duyệt của môi giới phụ trách?
- **OPEN QUESTION:** Lead từ HouseNow thuộc môi giới đăng tin, môi giới phụ trách hay được phân phối theo quy tắc của brokerage?
- **OPEN QUESTION:** Consent được quản lý theo từng kênh cụ thể hay theo nhóm nền tảng tin đăng?
- **OPEN QUESTION:** Khi quyền đại diện hết hạn hoặc bị thu hồi, VMLS có tự động gỡ tin trên mọi kênh hay tạo yêu cầu xử lý?
- **OPEN QUESTION:** Điều khoản hợp tác/hoa hồng nào phải được chấp thuận trước khi `CoBrokerRegistration` có hiệu lực trong production?
- **OPEN QUESTION:** Địa chỉ/căn chính xác thuộc Industry projection nào và cần entitlement gì?
