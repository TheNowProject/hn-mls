---
title: Kịch bản vận hành VMLS
status: proposal
authority: working
last_reviewed: 2026-08-17
evidence_labels:
  - FACT
  - SOURCE CLAIM
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# Kịch bản vận hành VMLS

## Mục đích

Kịch bản này kiểm tra và trình diễn VMLS như một sản phẩm dữ liệu phục vụ tra cứu, hợp tác bán, phân phối Tin bán và vận hành giao dịch. Phiên bắt đầu ở sổ bộ dữ liệu, đi qua danh mục ứng dụng theo vai trò, kho Tin bán được đại diện, rồi vào hàng đợi và trang chi tiết để nhập các trường nghiệp vụ mà từng vai trò cần.

Phiên chạy đạt yêu cầu khi người xem có thể tự xác định từ giao diện:

1. bản ghi nào đang được xử lý;
2. vai trò nào chịu trách nhiệm cho công việc tiếp theo;
3. hành động yêu cầu dữ liệu gì;
4. vì sao `NPID`, `PLID` và `PTID` là ba đối tượng riêng nhưng có liên kết;
5. vì sao hồ sơ đi tuyến VPĐKĐĐ hoặc Chủ đầu tư;
6. Tin bán nào đủ điều kiện cho Môi giới khác đăng ký hợp tác;
7. dữ liệu nào được và không được gửi tới một kênh tin đăng;
8. kết quả bên ngoài và sự kiện audit nào đã được nối thêm;
9. vì sao một bản ghi `Đã gửi · Chờ phản hồi kênh` không đồng nghĩa đã đăng thành công bên ngoài VMLS.

`PROPOSAL`: Các lệnh và sự kiện tích hợp trong phiên chạy thực thi hợp đồng đề xuất của `vmls-process-v2`. Chúng không xác lập quy trình pháp lý, thuế, định danh, công chứng, đăng ký đất đai, Chủ đầu tư hoặc hợp đồng tích hợp đã được phê duyệt.

## Kiểm tra trước khi chạy

- Mở đúng release candidate ở mức zoom 100%; ưu tiên 1440 × 900 hoặc 1920 × 1080.
- Xác nhận màn hình đầu tiên có tiêu đề `Tra cứu và điều phối hồ sơ`, bốn trường NPID/từ khóa, khu vực, Chủ đầu tư và Dự án, dải NPID/PLID/PTID và nút `Ứng dụng`.
- Mở workspace, chọn `Đặt lại dữ liệu`, xác nhận hộp thoại và kiểm tra cả hai Bất động sản là `Đã định danh`; năm Tin bán thị trường vẫn có mặt nhưng chưa có đăng ký hợp tác hoặc sự kiện phân phối. Quay lại `/` trước khi bắt đầu quay.
- Kiểm tra root có bảy bản ghi: năm Tin bán thị trường và hai hồ sơ giao dịch. Kiểm tra NPID/từ khóa cùng ba bộ lọc có thể kết hợp.
- Kiểm tra `Ứng dụng` hiển thị đầy đủ chức năng và luồng ngoài hệ thống; chỉ ứng dụng đã triển khai và ba bản chụp được cấu hình có thao tác.
- Kiểm tra `/assets/demo/vneid-google-play-2026-08-15.png`, `/assets/demo/357-homepage-2026-08-15.png`, `/assets/demo/housenow-can-ho-2026-08-15.png` và `/assets/demo/housenow-icon.png` tải từ local asset.
- Kiểm tra header chỉ dùng thương hiệu VMLS; HouseNow không xuất hiện như byline.
- Với phiên QA hoặc quay video, mở console ở một cửa sổ riêng.

### Trạng thái ban đầu

| Hồ sơ | NPID | PLID sau xác nhận | PTID sau kết quả ký | Căn cứ chuyển quyền | Tuyến mong đợi |
|---|---|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | `PLID-HN-00125` | `PTID-HN-00031` | Hợp đồng mua bán với Chủ đầu tư | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | `PLID-HN-00208` | `PTID-HN-00044` | Giấy chứng nhận quyền sử dụng đất | Văn phòng đăng ký đất đai |

Sau khi đặt lại, PLID và PTID có thể tồn tại trong cấu hình nhưng không được xuất hiện như bản ghi đã tạo trong hàng đợi hoặc thanh liên kết đối tượng.

Kho thị trường sau khi đặt lại có năm cặp `NPID-HN-21001…21005` / `PLID-HN-31001…31005`. Cả năm đang hiệu lực, được phép tra cứu nội bộ, có quyền đại diện đã xác nhận và mở đăng ký hợp tác. Đây là bộ dữ liệu synthetic riêng, không phải trạng thái tương lai của hai hồ sơ trong bảng trên.

## Video cuối — 16 phút, có phụ đề

Video dùng đúng production release candidate ở `1920 × 1080`, không có audio. Phụ đề tiếng Việt phải hiển thị trong khung hình và đồng thời được xuất thành WebVTT. Không mở tab mới, đăng nhập, tìm kiếm, xác nhận, đồng bộ hoặc đăng tin trên VNeID, 357 hay HouseNow.

| Thời gian | Màn hình | Thao tác trong VMLS | Phụ đề/điểm phải thấy |
|---|---|---|---|
| 00:00–00:45 | Sổ bộ dữ liệu | Lọc khu vực `Tây Hồ`, chọn một dự án, rồi tra đúng `NPID-HN-21001` | `VMLS tra cứu Bất động sản và Tin bán theo định danh, khu vực, Chủ đầu tư và Dự án trên cùng một sổ bộ.` |
| 00:45–01:25 | Ứng dụng · Môi giới | Mở danh mục; dừng ở nhóm công cụ của vai trò và nhóm luồng dữ liệu | `Ứng dụng đã triển khai có thể mở. Luồng chỉ nhận sự kiện và mô-đun chưa cấu hình không có thao tác giả.` |
| 01:25–01:55 | VNeID | Mở bản chụp chỉ đọc, giữ ít nhất 8 giây, đóng | `VNeID là điểm nhận kết quả xác nhận người bán. Video không đăng nhập hoặc thực hiện định danh.` |
| 01:55–02:25 | Hệ thống thông tin 357 | Mở bản chụp chỉ đọc, giữ URL/ngày chụp ít nhất 8 giây, đóng | `Cổng 357 là nguồn tham chiếu công khai, không phải bằng chứng kết nối dữ liệu cấp hồ sơ.` |
| 02:25–02:55 | HouseNow | Mở bản chụp chỉ đọc, giữ icon/phạm vi/ảnh danh mục ít nhất 8 giây, đóng | `HouseNow là một kênh nhận dữ liệu Tin bán; ảnh chụp không phải trang đang được thao tác.` |
| 02:55–04:10 | Nguồn hàng được đại diện | Mở `PLID-HN-31001`; kiểm tra NPID, dự án, giá, Môi giới/Sàn phụ trách và đăng ký hợp tác | `Đăng ký hợp tác tạo quan hệ với Môi giới thứ hai, không thay thế quyền đại diện đã được chủ sở hữu xác nhận.` |
| 04:10–05:10 | Phân phối Tin bán | Kiểm tra bốn điều kiện, hai danh sách trường và gửi HouseNow | `VMLS chỉ ghi nhận đã gửi phạm vi dữ liệu công khai và đang chờ phản hồi kênh; chưa có khẳng định tin đã được đăng.` |
| 05:10–09:35 | Hai hồ sơ giao dịch | Đi nhanh S2-12A từ nhập NPID, xác nhận đại diện, PLID, Người mua, VPCC đến tuyến Chủ đầu tư/HĐMB; ghé Ngân hàng | Nêu rõ PLID/PTID tự tạo, projection Ngân hàng chỉ có khi Người mua đồng ý và HouseNow trong hồ sơ này vẫn là kênh chưa phát hành. |
| 09:35–14:45 | Phú Thượng | Đi nhanh từ yêu cầu đại diện qua VPCC yêu cầu bổ sung đến kết quả VPĐKĐĐ | `Một hồ sơ khác có PTID riêng, xử lý được yêu cầu bổ sung và được định tuyến theo căn cứ Giấy chứng nhận.` |
| 14:45–16:00 | Sàn và Vận hành VMLS | Kiểm tra Nguồn hàng ở chế độ chỉ đọc, hàng đợi điều phối và nhật ký | `VMLS giữ riêng quyền đại diện, hợp tác bán, phân phối Tin bán và kết quả chuyển quyền để mỗi vai chỉ thấy dữ liệu cần thiết.` |

Ba drawer tích hợp chỉ có thao tác đọc trong VMLS: mở, quan sát, đóng. Cursor không đi vào ảnh chụp như thể có thể thao tác với trang ngoài. Phụ đề không che URL nguồn, ngày chụp, identifier, danh sách trường hoặc trạng thái. Cảnh `Gửi Tin bán đến HouseNow` chỉ thao tác nút của VMLS và kết thúc ở `Chờ phản hồi kênh`; không cắt ghép thành thao tác thật trên HouseNow.

## Phiên vận hành chuẩn — 15 phút

Dùng bộ chọn vai trò/không gian làm việc đang hiển thị. Mở hồ sơ từ hàng đợi của vai trò tương ứng, không dùng liên kết “vai trò tiếp theo”. Giữ các giá trị đã điền sẵn trong form trừ khi đang kiểm tra validation.

| Thời gian | Không gian làm việc | Thao tác | Điểm phải kiểm tra |
|---|---|---|---|
| 00:00–00:40 | Sổ bộ dữ liệu | Kết hợp khu vực `Tây Hồ` với một Dự án; xóa lọc rồi nhập `NPID-HN-21001` | Bốn tiêu chí chạy trên cùng một tập bảy bản ghi. Kết quả có NPID, PLID, PTID và mở đúng loại bản ghi. |
| 00:40–01:15 | Môi giới · Ứng dụng | Mở danh mục ứng dụng và luồng dữ liệu | Công cụ dùng được có nút mở; VNeID/357/HouseNow có bản chụp chỉ đọc; luồng sự kiện và mô-đun chưa cấu hình không có thao tác. |
| 01:15–02:05 | Môi giới · Nguồn hàng được đại diện | Lọc theo NPID, khu vực, Chủ đầu tư và Dự án; mở `PLID-HN-31001` | Có năm Tin bán đủ điều kiện. Detail có Môi giới/Sàn phụ trách nhưng không có danh tính, liên hệ hoặc bằng chứng của chủ sở hữu. |
| 02:05–02:35 | Chi tiết Tin bán | Chọn `Đăng ký hợp tác bán` | Tạo đăng ký của Môi giới hiện tại; quyền đại diện gốc và Môi giới phụ trách không đổi. |
| 02:35–03:20 | Phân phối Tin bán | Kiểm tra preflight, `Dữ liệu gửi`, `Không chia sẻ`; gửi HouseNow | Kết quả là một sự kiện `Đã gửi · Chờ phản hồi kênh`. Không có wording xác nhận đã đăng thật. |
| 03:20–04:25 | S2-12A · Môi giới rồi Người bán | Nhập `NPID-HN-09876`, phạm vi, thời hạn; gửi và xác nhận yêu cầu | Không có bước khớp candidate. Hai khối Người bán/Người đại diện luôn có mặt; `PLID-HN-00125` tự tạo ở trạng thái `Đã khởi tạo`. |
| 04:25–05:10 | S2-12A · Môi giới rồi Người mua | Ghi nhận Người mua; kiểm tra thông tin hợp đồng và hoàn tất readiness có chia sẻ Ngân hàng | PTID chưa có. VPCC nhận được hồ sơ; Ngân hàng chỉ nhận projection đã được đồng ý. |
| 05:10–06:05 | S2-12A · VPCC | Tiếp nhận đủ tài liệu, nhập mã hợp đồng và thời điểm ký | `PTID-HN-00031` tự tạo, sự kiện thuế được nối và tuyến Chủ đầu tư/HĐMB được xác định tự động. |
| 06:05–06:50 | Chủ đầu tư rồi Người mua | Ghi nhận tiếp nhận, xác nhận chuyển nhượng và biên nhận HĐMB mới | Cùng một PTID đi hết tuyến; không tạo Giao dịch hoặc bước closing giả. |
| 06:50–07:20 | Ngân hàng và Sàn | Kiểm tra projection tài chính và hàng đợi điều phối | Ngân hàng không thấy dữ liệu ngoài consent; Sàn thấy trạng thái, blocker, owner và hạn xử lý. |
| 07:20–08:25 | Phú Thượng · Môi giới, Người bán, Người mua | Gửi và xác nhận quyền đại diện; ghi nhận Người mua; hoàn tất readiness | `PLID-HN-00208` và trạng thái chia sẻ hoàn toàn độc lập với S2-12A. |
| 08:25–09:20 | Phú Thượng · VPCC | Tiếp nhận rồi gửi `Yêu cầu bổ sung` cụ thể | Lần tiếp nhận cũ vẫn có trong lịch sử; việc chuyển cho Người bán với loại tài liệu, lý do và hạn. |
| 09:20–10:00 | Phú Thượng · Người bán | Gửi đúng tài liệu PDF được yêu cầu | Hồ sơ thành `Đủ hồ sơ ký`; yêu cầu và phản hồi cùng được giữ. |
| 10:00–10:50 | Phú Thượng · VPCC rồi VPĐKĐĐ | Ghi mã hợp đồng/thời điểm ký; sau đó ghi mã kết quả và thời điểm hiệu lực | `PTID-HN-00044` tự tạo; tuyến VPĐKĐĐ được xác định theo căn cứ Giấy chứng nhận; không có mã tham chiếu chủ mới. |
| 10:50–12:05 | Ứng dụng · ba bản chụp | Mở lần lượt VNeID, 357 và HouseNow; mỗi bản giữ ít nhất 8 giây | Cả ba chỉ có metadata và media local. Không thao tác đăng nhập, tra cứu hay đăng tin trên hệ thống ngoài. |
| 12:05–13:05 | Vận hành VMLS · Nhật ký | Kiểm tra audit và integration events của cả hai hồ sơ | NPID/PLID/PTID, mã hồ sơ, mã kết quả và correlation không bị dùng thay nhau. |
| 13:05–14:00 | Sàn · Nguồn hàng được đại diện | Mở cùng kho và detail `PLID-HN-31001` | Sàn có projection đọc để điều phối nhưng không có nút đăng ký hoặc phân phối. |
| 14:00–15:00 | Persistence và reset | Reload direct hash route; xác nhận trạng thái, rồi `Đặt lại dữ liệu` và reload | Cả hai store được replay trước reset. Sau reset, hai dossier về đầu; năm Tin bán còn lại nhưng đăng ký và DistributionEvent bị xóa. |

## Điểm kiểm tra payload

Không chấp nhận thay đổi trạng thái nếu form chưa hiển thị và thu đủ payload tương ứng.

| Hành động | Trường phải kiểm tra |
|---|---|
| Tra cứu nguồn hàng | Mã định danh Bất động sản, khu vực, Chủ đầu tư và Dự án; các tiêu chí kết hợp theo phép AND |
| Đăng ký hợp tác bán | Đúng PLID đủ điều kiện và actor Môi giới; không nhận mã Môi giới từ form hoặc thay đổi Representation gốc |
| Gửi Tin bán đến HouseNow | Đăng ký hợp tác còn hiệu lực, Tin bán/Representation/consent đạt, đúng kênh `housenow`, payload chỉ có public allowlist |
| Gửi thông tin đến Người bán | Mã định danh Bất động sản, phạm vi, ngày bắt đầu, ngày hết hạn |
| Người bán xác nhận | Đúng BĐS, môi giới/sàn, phạm vi, thời hạn, xác nhận tường minh |
| Ghi nhận Người mua | Mã định danh Người mua, giá VND nguyên, ngày dự kiến ký |
| Người mua xác nhận | Họ tên, mã định danh Người mua, NPID, loại giao dịch, giá, ngày ký; ba checklist; chia sẻ Ngân hàng là tùy chọn |
| VPCC tiếp nhận | Mã tiếp nhận và toàn bộ tài liệu bắt buộc |
| Yêu cầu bổ sung | Mã lý do, đúng loại tài liệu, hạn bổ sung |
| Gửi bổ sung | Mã tài liệu, đúng loại, tên tệp PDF |
| VPCC ghi nhận ký | Mã hợp đồng và thời điểm trong chronology tháng 08/2026 |
| Kết quả VPĐKĐĐ | Mã kết quả và thời điểm hiệu lực |
| Chủ đầu tư tiếp nhận | Mã tiếp nhận, thời điểm, số tài liệu |
| Chủ đầu tư xác nhận | Mã xác nhận và thời điểm |
| Người mua nhận HĐMB | Mã biên nhận, thời điểm, xác nhận tường minh |

## Kiểm tra collection và detail

Trong phiên chạy, kiểm tra ít nhất một lần từng hành vi sau:

- Metric tổng hợp thay đổi filter và số dòng của hàng đợi.
- Global search tìm được dòng bằng NPID, sau đó bằng PLID hoặc PTID.
- Root lookup kết hợp NPID/từ khóa, khu vực, Chủ đầu tư và Dự án; một tổ hợp không khớp trả đúng empty state.
- Hub `Ứng dụng` có action đúng theo mode: điều hướng, bản chụp chỉ đọc, hoặc không có action.
- Kho Tin bán đổi số lượng theo filter và tab `Có thể đăng ký` / `Đã đăng ký` / `Đã phân phối`.
- Sau đăng ký và phân phối, detail, tab, summary và nhật ký bàn giao cùng phản ánh một state.
- Identifier trong hàng đợi mở đúng tab chi tiết.
- Thanh liên kết chuyển từ chỉ có NPID sang NPID/PLID rồi NPID/PLID/PTID.
- Vai trò không có quyền không nhận được record hoặc field bị hạn chế.
- Khi vai hiện tại không có lệnh, giao diện chỉ ra vai trò và công việc đang chờ thay vì nút “tiếp tục”.
- Refresh khôi phục các lệnh hợp lệ bằng replay; state bị sửa sai quay về dữ liệu cấu hình ban đầu.
- Reset tác động lên cả hai hồ sơ và store hợp tác/phân phối, nhưng không xóa năm fixture nguồn hàng, source registry hoặc bundled assets.

## Các mô-đun review 60 phút

Các mô-đun dùng trực tiếp màn hình vận hành; không cần trang trình bày hoặc trang pilot riêng.

| Phút | Mô-đun | Màn hình và thao tác | Câu hỏi review |
|---|---|---|---|
| 00–10 | Sổ bộ và định danh | Root lookup theo bốn tiêu chí, NPID/PLID/PTID, hai loại record detail | Hệ thống nguồn nào cấp NPID, chuẩn hóa khu vực/dự án và xử lý xung đột định danh? |
| 10–20 | Ứng dụng theo vai trò | Đổi vai, so sánh công cụ, bản chụp, event-only và mô-đun chưa cấu hình | Danh mục đã đủ để mỗi vai hiểu phạm vi sản phẩm mà không tạo action giả chưa? |
| 20–30 | Nguồn hàng và hợp tác | Filter, Industry detail, Môi giới/Sàn phụ trách, đăng ký hợp tác | Ai phê duyệt Môi giới hợp tác, entitlement nào được xem địa chỉ/căn chính xác và điều khoản hợp tác nằm ở đâu? |
| 30–40 | Phân phối Tin bán | Preflight, public allowlist, excluded fields, HouseNow event, retry/idempotency | Ai sở hữu consent theo kênh, phản hồi/reconciliation và gỡ tin khi quyền hết hạn? |
| 40–50 | Giao dịch và routing | Representation, buyer readiness, VPCC bổ sung, PTID tự tạo, hai route | Ai sở hữu mã chính thức và rule version; retry/reconciliation vận hành thế nào? |
| 50–60 | Projection và audit | Sàn, Ngân hàng, source registry, integration, DistributionEvent và audit tables | Mỗi vai có đủ dữ liệu để làm việc mà không nhận field hạn chế ngoài mục đích không? |

## Đặt lại và tiếp tục

### Đặt lại toàn bộ dữ liệu mẫu

1. Chọn `Đặt lại dữ liệu` trên header.
2. Xác nhận hộp thoại đặt lại dữ liệu mẫu.
3. Kiểm tra cả hai Bất động sản là `Đã định danh` và công việc tiếp theo là gửi thông tin đến Người bán.
4. Kiểm tra chưa có Tin bán hoặc Giao dịch trong projection của hai hồ sơ.
5. Kiểm tra năm Tin bán trong kho vẫn còn, nhưng `Đã đăng ký` và `Đã phân phối` đều bằng 0.
6. Kiểm tra source registry và bundled assets vẫn còn.

### Tiếp tục phiên bị gián đoạn

- Tải lại trang; các lệnh đã chấp nhận được replay từ browser storage có version.
- Chọn đúng vai trò trong bộ chọn workspace.
- Dùng `Việc của tôi` hoặc tìm theo NPID để lấy hồ sơ có thể xử lý.
- Mở hồ sơ và kiểm tra trạng thái, owner và form trước khi gửi.
- Không reset nếu không có ý định chạy lại cả hai tuyến và xóa đăng ký/phân phối thị trường hiện tại.

## Xử lý sự cố

- Nếu form không gửi, kiểm tra vai trò, trạng thái hiện tại, mã định danh, trường bắt buộc, định dạng ngày và tập tài liệu VPCC đầy đủ. Không bấm control không liên quan để ép tiến độ.
- Nếu hồ sơ không xuất hiện trong queue của một vai, kiểm tra điều kiện trước và projection rule. Ví dụ: Ngân hàng cần consent; VPCC cần readiness; queue chuyển quyền cần kết quả ký và route đã xác định.
- Nếu Tin bán không xuất hiện trong kho, kiểm tra PLID, trạng thái hiệu lực, Industry visibility, Representation và `Mở đăng ký`; sau đó xóa cả bốn bộ lọc.
- Nếu không thể phân phối, kiểm tra đăng ký hợp tác của Môi giới hiện tại, consent HouseNow và bốn dòng preflight. Không dùng vai Sàn để tạo lệnh.
- Nếu ảnh VNeID, 357 hoặc HouseNow không tải, kiểm tra local asset và connection record trước khi quay; không thay bằng trang web live giữa phiên.
- Nếu icon HouseNow không tải, kiểm tra local asset và dòng kênh trên Tin bán trước khi quay.
- Nếu browser storage không dùng được, hoàn tất trong một phiên liên tục và ghi giới hạn vào QA evidence.
- Nếu deployment không truy cập được, dùng `vite preview` từ đúng build đã kiểm thử và không ghi nhận là production verification.

## Checklist cuối phiên

- [ ] Màn hình đầu tiên là sổ bộ dữ liệu có bốn tiêu chí tra cứu thật, bảy bản ghi và đường vào ứng dụng/workspace, không phải portfolio hero.
- [ ] Logo/header là VMLS độc lập, không có `Powered by HouseNow` hoặc byline HouseNow.
- [ ] Hub hiển thị đầy đủ ứng dụng/luồng, nhưng chỉ ứng dụng triển khai và bản chụp read-only có action.
- [ ] Kho có năm Tin bán đủ điều kiện; tra cứu theo NPID, khu vực, Chủ đầu tư, Dự án và phép AND hoạt động.
- [ ] Sàn chỉ đọc; Môi giới đăng ký hợp tác mà không thay đổi Representation gốc.
- [ ] Phân phối chỉ gửi public allowlist; dữ liệu chủ sở hữu, bằng chứng, Người mua, tài chính, VPCC, PTID, audit và correlation không xuất hiện.
- [ ] HouseNow event kết thúc ở `Đã gửi · Chờ phản hồi kênh`, không có claim đã đăng thành công.
- [ ] Search, metric filter, row, ID, status, owner và due date đều hoạt động.
- [ ] Mọi hành động thay đổi trạng thái đều dùng form payload nghiệp vụ.
- [ ] PLID tự xuất hiện sau khi Người bán xác nhận.
- [ ] PTID, integration events và route tự xuất hiện sau khi VPCC ghi nhận ký.
- [ ] S2-12A hoàn tất qua Chủ đầu tư/HĐMB.
- [ ] Phú Thượng hoàn tất qua VPĐKĐĐ sau một yêu cầu bổ sung có thể xử lý.
- [ ] Queue Sàn hiển thị blocker và ownership mà không lộ dữ liệu bên ngoài phạm vi.
- [ ] Ngân hàng chỉ thấy hồ sơ và field đã được đồng ý chia sẻ.
- [ ] VNeID, 357 và HouseNow có ảnh chụp local, URL, ngày và contract dữ liệu chỉ đọc; không có thao tác ngoài hệ thống giả.
- [ ] 357 không được gắn thành provenance cấp hồ sơ; trạng thái vẫn là `Chưa cấu hình`.
- [ ] HouseNow trong dossier vẫn là kênh `Chưa phát hành`; DistributionEvent của nguồn hàng là một state riêng.
- [ ] MP4 1080p có phụ đề tiếng Việt trong khung hình, không có audio; WebVTT khớp nội dung và timing.
- [ ] NPID, PLID, PTID, dossier ID, result reference và correlation ID luôn riêng biệt.
- [ ] Audit/DistributionEvent nối thêm; hai browser store reset và replay đúng.
- [ ] Giao diện không render evidence label, product-story copy hoặc disclaimer banner về thẩm quyền bên ngoài.

## Ranh giới bằng chứng cho người review

- `FACT`: Có thể kiểm tra trực tiếp static build, bundled assets, giá trị cấu hình, reducer guards và hành vi UI quan sát được.
- `FACT`: Asset 357 là ảnh chụp trang chủ công khai có ngày. Sự tồn tại của ảnh không thiết lập nguồn ở cấp record hoặc kết nối kỹ thuật.
- `FACT`: Build hiện tại dùng nhãn VMLS độc lập; HouseNow chỉ xuất hiện theo ngữ cảnh kênh/bản chụp.
- `PROPOSAL`: Role jobs, nguồn hàng đủ điều kiện, Industry/public projection, đăng ký hợp tác, DistributionEvent, payload, automatic transitions, routing basis, tax events và external result shapes là product hypothesis hiện tại.
- `OPEN QUESTION`: Chủ sở hữu mã chính thức, field nguồn có thẩm quyền, state transition pháp lý, tax decision point, quyền production, integration contract và SLA cần quyết định của stakeholder có thẩm quyền.
- Dữ liệu cá nhân trong mọi phiên công khai phải được che. Không nhập định danh, liên hệ, tài chính hoặc tài liệu thật.
