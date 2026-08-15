---
title: Kịch bản vận hành VMLS
status: proposal
authority: working
last_reviewed: 2026-08-15
evidence_labels:
  - FACT
  - SOURCE CLAIM
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# Kịch bản vận hành VMLS

## Mục đích

Kịch bản này kiểm tra và trình diễn VMLS như một sản phẩm dữ liệu phục vụ tra cứu và vận hành. Phiên bắt đầu ở Registry workbench, mở các điểm nối bên ngoài ở chế độ chỉ đọc, rồi đi vào hàng đợi và trang chi tiết để nhập các trường nghiệp vụ mà từng vai trò cần.

Phiên chạy đạt yêu cầu khi người xem có thể tự xác định từ giao diện:

1. bản ghi nào đang được xử lý;
2. vai trò nào chịu trách nhiệm cho công việc tiếp theo;
3. hành động yêu cầu dữ liệu gì;
4. vì sao `NPID`, `PLID` và `PTID` là ba đối tượng riêng nhưng có liên kết;
5. vì sao hồ sơ đi tuyến VPĐKĐĐ hoặc Chủ đầu tư;
6. kết quả bên ngoài và sự kiện audit nào đã được nối thêm.

`PROPOSAL`: Các lệnh và sự kiện tích hợp trong phiên chạy thực thi hợp đồng đề xuất của `vmls-process-v2`. Chúng không xác lập quy trình pháp lý, thuế, định danh, công chứng, đăng ký đất đai, Chủ đầu tư hoặc hợp đồng tích hợp đã được phê duyệt.

## Kiểm tra trước khi chạy

- Mở đúng release candidate ở mức zoom 100%; ưu tiên 1440 × 900 hoặc 1920 × 1080.
- Xác nhận màn hình đầu tiên là Registry workbench có tiêu đề `Tra cứu và điều phối hồ sơ`, ba đối tượng NPID/PLID/PTID và nút `Mở không gian làm việc`.
- Mở workspace, chọn `Đặt lại dữ liệu`, xác nhận hộp thoại và kiểm tra cả hai dòng trở về `Chờ đối chiếu`; quay lại `/` trước khi bắt đầu quay.
- Kiểm tra tìm kiếm nhận tên hồ sơ, dự án/khu vực, `NPID`, `PLID` hoặc `PTID`.
- Kiểm tra hai hồ sơ cấu hình sẵn xuất hiện độc lập.
- Kiểm tra `/assets/demo/vneid-google-play-2026-08-15.png`, `/assets/demo/357-homepage-2026-08-15.png`, `/assets/demo/housenow-can-ho-2026-08-15.png` và `/assets/demo/housenow-icon.png` tải từ local asset.
- Với phiên QA hoặc quay video, mở console ở một cửa sổ riêng.

### Trạng thái ban đầu

| Hồ sơ | NPID | PLID sau xác nhận | PTID sau kết quả ký | Căn cứ chuyển quyền | Tuyến mong đợi |
|---|---|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | `PLID-HN-00125` | `PTID-HN-00031` | Hợp đồng mua bán với Chủ đầu tư | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | `PLID-HN-00208` | `PTID-HN-00044` | Giấy chứng nhận quyền sử dụng đất | Văn phòng đăng ký đất đai |

Sau khi đặt lại, PLID và PTID có thể tồn tại trong cấu hình nhưng không được xuất hiện như bản ghi đã tạo trong hàng đợi hoặc thanh liên kết đối tượng.

## Video cuối — 16 phút, có phụ đề

Video dùng đúng production release candidate ở `1920 × 1080`, không có audio. Phụ đề tiếng Việt phải hiển thị trong khung hình và đồng thời được xuất thành WebVTT. Không mở tab mới, đăng nhập, tìm kiếm, xác nhận, đồng bộ hoặc đăng tin trên VNeID, 357 hay HouseNow.

| Thời gian | Màn hình | Thao tác trong VMLS | Phụ đề/điểm phải thấy |
|---|---|---|---|
| 00:00–00:45 | Registry workbench | Tra cứu `NPID-HN-09876`; chọn hồ sơ S2-12A | `VMLS tổ chức Bất động sản, Tin bán và Giao dịch thành ba đối tượng liên kết nhưng có vòng đời riêng.` |
| 00:45–01:15 | Dải định danh | Dừng ở NPID/PLID/PTID; PLID/PTID đang `Chưa có` | `Trạng thái trên landing được lấy từ chính hồ sơ đang lưu, không điền trước kết quả tương lai.` |
| 01:15–01:45 | Điểm nối VNeID | Mở drawer read-only, giữ ảnh và data contract ít nhất 8 giây, đóng drawer | `VNeID là điểm xác nhận người bán bên ngoài VMLS. Video không đăng nhập hoặc thực hiện định danh.` |
| 01:45–02:15 | Điểm nối 357 | Mở drawer read-only, giữ URL/ngày chụp/ảnh ít nhất 8 giây, đóng drawer | `Cổng 357 được ghi nhận như một nguồn tham chiếu công khai. Ảnh chụp không đại diện cho kết nối dữ liệu cấp hồ sơ.` |
| 02:15–02:45 | Điểm nối HouseNow | Mở drawer read-only, giữ icon/phạm vi/ảnh danh mục ít nhất 8 giây, đóng drawer | `HouseNow là một đích phân phối Tin bán. Video chỉ thể hiện phạm vi bàn giao, không đăng tin thật.` |
| 02:45–03:05 | Registry workbench | Chọn `Mở không gian làm việc` | `Từ cùng hồ sơ, người dùng đi vào hàng đợi và thao tác theo đúng vai trò.` |
| 03:05–08:40 | Workspace | Hoàn tất S2-12A từ đối chiếu NPID đến HĐMB mới; ghé Sàn và Ngân hàng | Nêu rõ PLID tự tạo, PTID tự tạo, tuyến Chủ đầu tư và projection Ngân hàng đã được đồng ý chia sẻ. |
| 08:40–14:45 | Workspace | Hoàn tất Phú Thượng, gồm VPCC yêu cầu bổ sung và kết quả VPĐKĐĐ | Nêu rõ exception có thể xử lý, PTID riêng và tuyến VPĐKĐĐ do căn cứ hồ sơ quyết định. |
| 14:45–16:00 | Sàn và Vận hành VMLS | Kiểm tra điều phối, danh mục kết nối và audit hợp nhất | `Hai hồ sơ, hai tuyến chuyển quyền và một lịch sử nối thêm có thể truy vết từ NPID đến PLID và PTID.` |

Ba drawer tích hợp chỉ có thao tác đọc trong VMLS: mở, quan sát, đóng. Cursor không đi vào ảnh chụp như thể có thể thao tác với trang ngoài. Phụ đề không che URL nguồn, ngày chụp, identifier hoặc trạng thái.

## Phiên vận hành chuẩn — 15 phút

Dùng bộ chọn vai trò/không gian làm việc đang hiển thị. Mở hồ sơ từ hàng đợi của vai trò tương ứng, không dùng liên kết “vai trò tiếp theo”. Giữ các giá trị đã điền sẵn trong form trừ khi đang kiểm tra validation.

| Thời gian | Không gian làm việc | Thao tác | Điểm phải kiểm tra |
|---|---|---|---|
| 00:00–00:45 | Môi giới · Công việc | Tìm `NPID-HN-09876`; chọn `Việc của tôi`; mở S2-12A | Tìm kiếm và filter áp dụng trên cùng một bảng. Dòng có NPID, chưa có PLID/PTID, có trạng thái, người phụ trách và hạn xử lý. |
| 00:45–01:40 | S2-12A · Tổng quan | Mở công việc hiện tại, so sánh hai candidate, chọn `NPID-HN-09876`, rồi chọn `Khớp Bất động sản` | Việc chọn candidate là tường minh. Nguồn đã chọn và trạng thái BĐS được ghi nhận; không chọn nhầm căn gần giống. |
| 01:40–02:25 | S2-12A · Quyền đại diện | Nhập phạm vi, ngày hiệu lực và ngày hết hạn; gửi `Gửi yêu cầu xác nhận` | Yêu cầu chứa đúng BĐS, môi giới, phạm vi và thời hạn. Chủ sở hữu công việc chuyển sang Người bán. |
| 02:25–03:05 | Người bán · Yêu cầu và tài liệu | Mở S2-12A, kiểm tra BĐS/môi giới/phạm vi/thời hạn, tích xác nhận và gửi | Representation thành `Đã xác nhận`. `PLID-HN-00125` tự xuất hiện với trạng thái Tin bán `Đã khởi tạo`. Không có thao tác VMLS chen giữa hai kết quả. |
| 03:05–03:35 | S2-12A · Tin bán | Kiểm tra trường Tin bán và bảng `Kênh phân phối` | NPID và PLID tách biệt. HouseNow là một dòng kênh có đúng icon được cung cấp, phạm vi trường và trạng thái gửi. |
| 03:35–04:15 | Môi giới · S2-12A | Nhập tham chiếu Người mua, giá thỏa thuận và ngày dự kiến ký; gửi `Ghi nhận Người mua` | Chủ sở hữu công việc chuyển sang Người mua. PTID vẫn chưa tồn tại. |
| 04:15–04:55 | Người mua · Hồ sơ mua | Hoàn tất toàn bộ checklist sẵn sàng; giữ lựa chọn chia sẻ tài chính đã cấu hình; gửi | Readiness thành `Đã sẵn sàng công chứng`. Hồ sơ xuất hiện trong hàng đợi VPCC. Nếu đã đồng ý chia sẻ, hồ sơ cũng xuất hiện ở Ngân hàng với đúng tập trường. |
| 04:55–05:25 | Ngân hàng · Hồ sơ được chia sẻ | Mở S2-12A và kiểm tra trường được trả về | Chỉ có loại BĐS, giá đã thống nhất, mốc sẵn sàng và mục đích chia sẻ. Không có giá chào, thông tin Người bán, tài liệu VPCC hoặc audit đầy đủ. |
| 05:25–06:10 | VPCC · Hồ sơ công chứng | Mở S2-12A, nhập mã tiếp nhận, chọn đủ tài liệu bắt buộc và gửi `Tiếp nhận hồ sơ` | Hồ sơ thành `Đã tiếp nhận`; mã tiếp nhận và trạng thái từng tài liệu hiển thị. |
| 06:10–06:50 | VPCC · S2-12A | Nhập mã kết quả ký, thời điểm và mã kiểm tra tài liệu; gửi `Ghi nhận kết quả ký` | Kết quả VPCC được lưu. `PTID-HN-00031` tự tạo; sự kiện thuế và định tuyến được nối; tuyến là Chủ đầu tư/HĐMB. |
| 06:50–07:45 | Chủ đầu tư · Chuyển nhượng HĐMB | Gửi mã tiếp nhận, thời điểm, số tài liệu; sau đó gửi mã và thời điểm xác nhận chuyển nhượng | Cùng một PTID chuyển từ chờ tiếp nhận sang chờ Người mua nhận. Không tạo Giao dịch trùng. |
| 07:45–08:15 | Người mua · Hồ sơ mua | Nhập mã biên nhận/thời điểm, tích xác nhận đã nhận HĐMB và gửi | Tuyến thành `Đã bàn giao HĐMB mới`; có tham chiếu HĐMB mới. Không có thao tác closing riêng. |
| 08:15–08:45 | Vận hành VMLS · Nhật ký | Mở lịch sử S2-12A | Audit giữ actor, target, trạng thái trước/sau, thời điểm và correlation. Sự kiện tích hợp có kết quả VPCC, PTID, thuế, routing, Chủ đầu tư và biên nhận. |
| 08:45–09:20 | Vận hành VMLS · Kết nối & nguồn dữ liệu | Mở dòng 357 và `Xem bản chụp`; đóng drawer | Dòng có chủ nguồn, URL, ngày chụp, phạm vi và `Chưa cấu hình`. Ảnh không được gắn vào NPID như provenance của hồ sơ. |
| 09:20–10:35 | Môi giới rồi Người bán · Phú Thượng | Khớp `NPID-HN-10421`, gửi yêu cầu đại diện có thời hạn, rồi xác nhận ở vai Người bán | `PLID-HN-00208` tự tạo và hoàn toàn độc lập với S2-12A. |
| 10:35–11:30 | Môi giới rồi Người mua · Phú Thượng | Ghi nhận Người mua, rồi hoàn tất checklist readiness | Phú Thượng vào hàng đợi VPCC; trạng thái chia sẻ tài chính không kế thừa từ S2-12A. |
| 11:30–12:20 | VPCC · Phú Thượng | Tiếp nhận đủ hồ sơ; chọn `Yêu cầu bổ sung`; kiểm tra loại tài liệu, lý do và hạn rồi gửi | Hồ sơ thành `Yêu cầu bổ sung`. Lần tiếp nhận ban đầu còn trong lịch sử và công việc chuyển sang Người bán. |
| 12:20–12:55 | Người bán · Phú Thượng | Nhập mã tài liệu bổ sung, đúng loại được yêu cầu và tên tệp PDF; gửi | Hồ sơ thành `Đủ hồ sơ ký`; dữ liệu yêu cầu và phản hồi đều được giữ. |
| 12:55–13:40 | VPCC · Phú Thượng | Gửi mã kết quả ký, thời điểm và digest | `PTID-HN-00044` tự tạo; tuyến là VPĐKĐĐ theo căn cứ Giấy chứng nhận. |
| 13:40–14:25 | VPĐKĐĐ · Đăng ký biến động | Nhập mã kết quả, thời điểm hiệu lực và tham chiếu Người mua đã cấu hình; gửi | BĐS và Giao dịch thành `Đã sang tên`; mã kết quả bên ngoài xuất hiện. |
| 14:25–15:00 | Sàn môi giới rồi Vận hành VMLS | Kiểm tra hàng đợi điều phối và bảng audit/tích hợp tổng hợp | Hai hồ sơ có danh tính và kết quả độc lập. Không còn blocker mở và số liệu khớp với dòng đang hiển thị. |

## Điểm kiểm tra payload

Không chấp nhận thay đổi trạng thái nếu form chưa hiển thị và thu đủ payload tương ứng.

| Hành động | Trường phải kiểm tra |
|---|---|
| Khớp Bất động sản | Candidate NPID và toàn bộ nguồn đã chọn |
| Gửi yêu cầu đại diện | Phạm vi, ngày bắt đầu, ngày hết hạn |
| Người bán xác nhận | Đúng BĐS, môi giới/sàn, phạm vi, thời hạn, xác nhận tường minh |
| Ghi nhận Người mua | Tham chiếu Người mua, giá VND nguyên, ngày dự kiến ký |
| Người mua xác nhận | Định danh, phương án thanh toán, tài liệu; chia sẻ Ngân hàng là tùy chọn |
| VPCC tiếp nhận | Mã tiếp nhận và toàn bộ tài liệu bắt buộc |
| Yêu cầu bổ sung | Mã lý do, đúng loại tài liệu, hạn bổ sung |
| Gửi bổ sung | Mã tài liệu, đúng loại, tên tệp PDF |
| VPCC ghi nhận ký | Mã kết quả, thời điểm trong chronology tháng 08/2026, digest tài liệu |
| Kết quả VPĐKĐĐ | Mã kết quả, thời điểm hiệu lực, tham chiếu Người mua đã cấu hình |
| Chủ đầu tư tiếp nhận | Mã tiếp nhận, thời điểm, số tài liệu |
| Chủ đầu tư xác nhận | Mã xác nhận và thời điểm |
| Người mua nhận HĐMB | Mã biên nhận, thời điểm, xác nhận tường minh |

## Kiểm tra collection và detail

Trong phiên chạy, kiểm tra ít nhất một lần từng hành vi sau:

- Metric tổng hợp thay đổi filter và số dòng của hàng đợi.
- Global search tìm được dòng bằng NPID, sau đó bằng PLID hoặc PTID.
- Identifier trong hàng đợi mở đúng tab chi tiết.
- Thanh liên kết chuyển từ chỉ có NPID sang NPID/PLID rồi NPID/PLID/PTID.
- Vai trò không có quyền không nhận được record hoặc field bị hạn chế.
- Khi vai hiện tại không có lệnh, giao diện chỉ ra vai trò và công việc đang chờ thay vì nút “tiếp tục”.
- Refresh khôi phục các lệnh hợp lệ bằng replay; state bị sửa sai quay về dữ liệu cấu hình ban đầu.
- Reset tác động lên cả hai hồ sơ nhưng không xóa source registry hoặc bundled assets.

## Các mô-đun review 60 phút

Các mô-đun dùng trực tiếp màn hình vận hành; không cần trang trình bày hoặc trang pilot riêng.

| Phút | Mô-đun | Màn hình và thao tác | Câu hỏi review |
|---|---|---|---|
| 00–10 | Hàng đợi và ownership | Queue theo vai, filter, search, người phụ trách, hạn, blocker | Mỗi vai có biết việc cần làm mà không đọc copy giải thích không? |
| 10–20 | Định danh và nguồn | So sánh candidate, NPID detail, khái niệm diện tích, source records | Bằng chứng nào đủ để khớp BĐS và ai xử lý xung đột? |
| 20–30 | Representation và Tin bán | Yêu cầu có thời hạn, xác nhận Người bán, PLID tự tạo, kênh phân phối | Phạm vi, thời hạn, thu hồi và điều kiện phân phối nào cần được phê duyệt? |
| 30–40 | Người mua và VPCC | Payload Người mua, consent, tài liệu bắt buộc, bổ sung, kết quả ký | Trường và tài liệu nào bắt buộc, bị hạn chế hoặc thuộc trách nhiệm bên nào? |
| 40–50 | Giao dịch và routing | PTID tự tạo, sự kiện thuế, căn cứ tuyến, hai queue tiếp nhận | Ai sở hữu mã chính thức và rule version; retry/reconciliation vận hành thế nào? |
| 50–60 | Projection và audit | Sàn, Ngân hàng, source registry, integration và audit tables | Mỗi vai có đủ dữ liệu để làm việc mà không nhận field hạn chế ngoài mục đích không? |

## Đặt lại và tiếp tục

### Đặt lại cả hai hồ sơ

1. Chọn `Đặt lại dữ liệu` trên header.
2. Xác nhận `Đặt lại 2 hồ sơ?`.
3. Kiểm tra trạng thái đối chiếu của cả hai BĐS là `Chờ đối chiếu`.
4. Kiểm tra chưa có Listing hoặc Transaction trong projection của hai hồ sơ.
5. Kiểm tra source registry và bundled assets vẫn còn.

### Tiếp tục phiên bị gián đoạn

- Tải lại trang; các lệnh đã chấp nhận được replay từ browser storage có version.
- Chọn đúng vai trò trong bộ chọn workspace.
- Dùng `Việc của tôi` hoặc tìm theo NPID để lấy hồ sơ có thể xử lý.
- Mở hồ sơ và kiểm tra trạng thái, owner và form trước khi gửi.
- Không reset nếu không có ý định chạy lại cả hai tuyến.

## Xử lý sự cố

- Nếu form không gửi, kiểm tra vai trò, trạng thái hiện tại, trường bắt buộc, định dạng ngày, tập tài liệu/nguồn đầy đủ và tham chiếu có khớp không. Không bấm control không liên quan để ép tiến độ.
- Nếu hồ sơ không xuất hiện trong queue của một vai, kiểm tra điều kiện trước và projection rule. Ví dụ: Ngân hàng cần consent; VPCC cần readiness; queue chuyển quyền cần kết quả ký và route đã xác định.
- Nếu ảnh VNeID, 357 hoặc HouseNow không tải, kiểm tra local asset và connection record trước khi quay; không thay bằng trang web live giữa phiên.
- Nếu icon HouseNow không tải, kiểm tra local asset và dòng kênh trên Tin bán trước khi quay.
- Nếu browser storage không dùng được, hoàn tất trong một phiên liên tục và ghi giới hạn vào QA evidence.
- Nếu deployment không truy cập được, dùng `vite preview` từ đúng build đã kiểm thử và không ghi nhận là production verification.

## Checklist cuối phiên

- [ ] Màn hình đầu tiên là Registry workbench có tra cứu thật và đường vào workspace, không phải portfolio hero.
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
- [ ] HouseNow vẫn là kênh phân phối của Tin bán với trạng thái `Chưa phát hành`.
- [ ] MP4 1080p có phụ đề tiếng Việt trong khung hình, không có audio; WebVTT khớp nội dung và timing.
- [ ] NPID, PLID, PTID, dossier ID, result reference và correlation ID luôn riêng biệt.
- [ ] Audit nối thêm sự kiện; reset và replay đúng.
- [ ] Giao diện không render evidence label, product-story copy hoặc disclaimer banner về thẩm quyền bên ngoài.

## Ranh giới bằng chứng cho người review

- `FACT`: Có thể kiểm tra trực tiếp static build, bundled assets, giá trị cấu hình, reducer guards và hành vi UI quan sát được.
- `FACT`: Asset 357 là ảnh chụp trang chủ công khai có ngày. Sự tồn tại của ảnh không thiết lập nguồn ở cấp record hoặc kết nối kỹ thuật.
- `PROPOSAL`: Role jobs, payload, automatic transitions, routing basis, tax events và external result shapes là product hypothesis hiện tại.
- `OPEN QUESTION`: Chủ sở hữu mã chính thức, field nguồn có thẩm quyền, state transition pháp lý, tax decision point, quyền production, integration contract và SLA cần quyết định của stakeholder có thẩm quyền.
- Dữ liệu cá nhân trong mọi phiên công khai phải được che. Không nhập định danh, liên hệ, tài chính hoặc tài liệu thật.
