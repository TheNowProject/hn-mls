# Tổng quan hệ sinh thái MLS Texas — as observed

## Phạm vi

Tài liệu chỉ mô tả cấu trúc sản phẩm, dữ liệu và quy trình được quan sát trong walkthrough MLS tại Bắc Texas. Source code, API, database và kiến trúc triển khai không xuất hiện trong nguồn nên không được mô tả.

## Thành phần chính

**FACT:** Ba thành phần được quan sát trực tiếp là cổng thành viên NTREIS/Clareity để truy cập danh mục ứng dụng; Matrix MLS để tìm kiếm, xem, tạo, cập nhật và quản lý listing, lịch sử và báo cáo; Cloud CMA để chọn bất động sản so sánh và xuất báo cáo phân tích thị trường.

## Dữ liệu cốt lõi

**FACT:** Matrix thể hiện `Property`, `Parcel`/tax record và `Listing` thành các nhóm dữ liệu riêng. Mỗi listing có MLS number, loại giao dịch, giá, thời hạn, trạng thái và agent/office. Cùng một địa chỉ có thể xuất hiện trong nhiều listing record theo thời gian hoặc loại giao dịch; các record và lịch sử trước đó vẫn được hiển thị.

## Tra cứu và xem hồ sơ

**FACT:** Matrix hỗ trợ tìm theo MLS number, địa chỉ hoặc bộ tiêu chí. Hồ sơ hiển thị riêng dữ liệu listing, tax/public record, ảnh, lịch sử, parcel map, flood map, foreclosure và tài liệu bổ sung. Public remarks được tách khỏi private remarks, thông tin agent/office chi tiết và hướng dẫn showing; các nhóm này không có cùng phạm vi hiển thị.

## Tạo và quản lý listing

**FACT:** Listing có thể lấy dữ liệu từ listing hiện hữu, lấy dữ liệu từ tax record hoặc bắt đầu bằng form trống. UI tách thao tác `Save as Incomplete` khỏi việc submit listing. Listing được submit dưới dạng `Incoming` có MLS number nhưng chưa hiển thị cho mọi người; vẫn có thể bổ sung ảnh, tài liệu và chạy báo cáo. Listing được submit dưới dạng `Active` phải vượt qua toàn bộ input rules. Giá và trạng thái được thay đổi qua action nghiệp vụ riêng.

## CMA

**FACT:** Cloud CMA sử dụng luồng `Criteria → Listings → Customize → Publish`. Comparable được chọn bằng MLS number hoặc tìm theo vị trí, thời gian và tiêu chí, sau đó được review để include/exclude. Báo cáo có bản đồ, nhóm Active/Sold, thống kê Low/Median/Average/High, giá trên diện tích, Days on Market và chi tiết comparable; đầu ra được chia sẻ qua PDF, live link hoặc email.

## Nguồn

- [BA report](./BA-report.md)
- [Phân tích hình ảnh](./visual-analysis.md)
