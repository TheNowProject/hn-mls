---
title: Kịch bản trình diễn VMLS công khai
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

# Kịch bản trình diễn VMLS công khai

## Mục tiêu buổi trình diễn

Trong 15 phút, người xem cần có thể:

1. Phân biệt **Bất động sản / NPID**, **Tin bán / PLID** và **Giao dịch / PTID** là ba đối tượng có danh tính và lịch sử riêng.
2. Mô tả VMLS là lớp điều phối và sổ đăng ký sống, không thay thế thẩm quyền của Văn phòng công chứng, Văn phòng đăng ký đất đai, Chủ đầu tư hoặc cơ quan thuế.
3. Nhận ra hai tuyến chuyển quyền được xác định từ hồ sơ: tuyến **Chủ đầu tư / HĐMB** và tuyến **Văn phòng đăng ký đất đai**.
4. Chuyển từ phản hồi về màn hình sang một cuộc thảo luận cụ thể về pilot VMLS.

`PROPOSAL`: Toàn bộ hành trình `vmls-process-v2`, quy tắc điều phối và bề mặt tích hợp trong demo là phương án để thảo luận. Đây không phải quy trình pháp lý, vận hành hoặc hợp đồng tích hợp đã được phê duyệt.

## Chuẩn bị trước khi trình diễn

- Mở bản triển khai bằng cửa sổ riêng ở tỷ lệ thu phóng 100%; ưu tiên khung 1440 × 900 hoặc video 1920 × 1080.
- Kiểm tra hai hồ sơ xuất hiện độc lập: `S2-12A · Thụy Khuê` và `Nhà ở · Phú Thượng`.
- Kiểm tra ảnh 357 tại `/assets/demo/357-homepage-2026-08-15.png` và biểu tượng HouseNow tại `/assets/demo/housenow-icon.png` hiển thị rõ.
- Chọn **Khôi phục dữ liệu mẫu** trước buổi trình diễn; xác nhận cả hai hồ sơ trở về bước đầu.
- Kiểm tra nút **Tiếp tục** đưa người xem tới hành động hợp lệ tiếp theo, không bỏ qua điều kiện trước.
- Giữ con trỏ ngoài nội dung chính khi đổi vai để người xem chú ý vào thay đổi của góc nhìn theo vai, không vào thao tác trình diễn.

Các trạng thái gốc cần xác nhận:

| Đối tượng | Hồ sơ S2-12A | Hồ sơ Phú Thượng |
|---|---|---|
| Bất động sản | `NPID-HN-09876` | `NPID-HN-10421` |
| Tin bán | `PLID-HN-00125` · `Chưa khởi tạo` | `PLID-HN-00208` · `Chưa khởi tạo` |
| Giao dịch | `PTID-HN-00031` · `Chưa khởi tạo` | `PTID-HN-00044` · `Chưa khởi tạo` |
| Tuyến dự kiến từ hồ sơ | Chủ đầu tư / HĐMB | Văn phòng đăng ký đất đai |

## Tuyến trình diễn chính — 15 phút

Tên nút trong cột **Hành động chính xác** phải khớp giao diện. Không nhấp hành động kế tiếp nếu trạng thái mong đợi chưa xuất hiện.

| Thời gian | Hồ sơ / vai đang chọn | Hành động chính xác | Trạng thái mong đợi và lời dẫn |
|---|---|---|---|
| 00:00–00:45 | Giới thiệu | Chọn **Khám phá hai hồ sơ** | Nói: “VMLS cho mỗi Bất động sản một danh tính bền vững và nối Tin bán, Giao dịch, nguồn cùng lịch sử vào danh tính đó.” Chỉ rõ nhãn **Mô phỏng đề xuất**. |
| 00:45–01:25 | S2-12A · **Môi giới** | Mở hồ sơ và ba thẻ danh tính | Chỉ `NPID-HN-09876`; hai thẻ PLID và PTID ghi **Chưa cấp mã**. Nhấn mạnh mã Tin bán và Giao dịch chưa tồn tại trong vòng đời nghiệp vụ. |
| 01:25–02:05 | S2-12A · **Môi giới** | **Đối chiếu Bất động sản** → **Gửi xác nhận cho Người bán** | Bằng chứng đối chiếu chuyển sang đạt; yêu cầu xác nhận được gửi. Mở thẻ nguồn 357: đây là ảnh trang chính chụp ngày 15/08/2026, không phải bằng chứng kết nối hay xác minh hồ sơ. |
| 02:05–02:45 | S2-12A · **Người bán** | **Xác nhận quyền đại diện** | Quyền đại diện được xác nhận và có thời điểm trong lịch sử. Nói rõ VNeID trên màn hình là chuyển tiếp trung lập được mô phỏng, không đăng nhập thật. |
| 02:45–03:25 | S2-12A · **VMLS** | **Khởi tạo Tin bán** | `PLID-HN-00125` có trạng thái **Đã khởi tạo**, tuyệt đối không gọi là “đang hoạt động”. HouseNow xuất hiện một lần với biểu tượng đúng vai trò **kênh phân phối**. |
| 03:25–03:55 | S2-12A · **Sàn môi giới** | Chỉ xem góc nhìn theo vai, không có hành động | Sàn thấy tính đầy đủ của quyền đại diện, Tin bán và điểm nghẽn; không thấy định danh đầy đủ của các bên. Đây là một góc nhìn hỗ trợ, không phải bước mới của v2. |
| 03:55–04:40 | S2-12A · **Môi giới → Người mua** | Môi giới chọn **Ghi nhận Người mua**, rồi Người mua chọn **Xác nhận sẵn sàng công chứng** | Khu vực không đánh số chuyển thành **Đã sẵn sàng công chứng**; PTID vẫn chưa được cấp. |
| 04:40–05:05 | S2-12A · **Ngân hàng** | Chỉ xem góc nhìn theo vai, không có hành động | Ngân hàng chỉ thấy giá, loại Bất động sản, mốc sẵn sàng và trạng thái đồng ý chia sẻ; không thấy tài liệu công chứng hoặc liên hệ Người bán. |
| 05:05–05:50 | S2-12A · **Văn phòng công chứng** | **Tiếp nhận hồ sơ công chứng** | `HSCC-HN-00031` thành **Đã tiếp nhận**. VMLS chỉ nhận trạng thái cần thiết; nghiệp vụ công chứng vẫn ở không gian làm việc của VPCC. |
| 05:50–06:25 | S2-12A · **Văn phòng công chứng** | **Ghi nhận kết quả ký** | Hồ sơ thành **Đã ký công chứng** và trả mã tương quan về VMLS. |
| 06:25–07:05 | S2-12A · **VMLS** | **Tạo tham chiếu Giao dịch** | `PTID-HN-00031` được tạo dưới nhãn **mã tham chiếu demo**; sự kiện thuế được nối vào nhật ký; tuyến **Chủ đầu tư / HĐMB** được xác định tự động. |
| 07:05–08:10 | S2-12A · **Chủ đầu tư → Người mua** | Chủ đầu tư chọn **Tiếp nhận hồ sơ chuyển nhượng** → **Xác nhận chuyển nhượng HĐMB**; Người mua chọn **Xác nhận nhận HĐMB mới** | Ba sự kiện nối tiếp, không ghi đè lịch sử. Người mua nhận HĐMB mới; Bất động sản, Tin bán và Giao dịch vẫn là ba bản ghi riêng. |
| 08:10–08:40 | S2-12A · **Người mua** | Xem bảng **Bản ghi sống đã được cập nhật** | Trạng thái cuối là **HĐMB mới đã bàn giao**. Không có nút hoặc bước “đóng giao dịch” giả. Chỉ diện tích `69,2 m² thông thủy` và `82,3 m² tim tường` cùng nguồn riêng. |
| 08:40–09:20 | Nhà ở Phú Thượng · **Môi giới** | **Đối chiếu Bất động sản** → **Gửi xác nhận cho Người bán** | Chuyển sang hồ sơ độc lập, nhãn **Dữ liệu giả lập**. `NPID-HN-10421` không dùng lại bất kỳ mã nào của S2-12A. |
| 09:20–09:55 | Nhà ở Phú Thượng · **Người bán** | **Xác nhận quyền đại diện** | Quyền đại diện được xác nhận cho đúng hồ sơ Phú Thượng; tiến độ S2-12A không thay đổi. |
| 09:55–10:25 | Nhà ở Phú Thượng · **VMLS** | **Khởi tạo Tin bán** | `PLID-HN-00208` thành **Đã khởi tạo**; `PTID-HN-00044` vẫn chưa được tạo. |
| 10:25–10:55 | Nhà ở Phú Thượng · **Môi giới → Người mua** | Môi giới chọn **Ghi nhận Người mua**, rồi Người mua chọn **Xác nhận sẵn sàng công chứng** | Khu vực sẵn sàng hoàn tất mà không làm thay đổi Bất động sản hay Tin bán. |
| 10:55–11:30 | Nhà ở Phú Thượng · **Văn phòng công chứng** | **Tiếp nhận hồ sơ công chứng** → **Minh họa yêu cầu bổ sung** | Hồ sơ thành **Yêu cầu bổ sung**; lần nộp đầu vẫn còn trong lịch sử. Đây là ngoại lệ có thể phục hồi, không phải màn hình lỗi cụt. |
| 11:30–11:55 | Nhà ở Phú Thượng · **Môi giới** | **Bổ sung tài liệu** | Hồ sơ trở lại **Đủ điều kiện ký**; nội dung định danh trong tài liệu vẫn được che. |
| 11:55–12:20 | Nhà ở Phú Thượng · **Văn phòng công chứng** | **Ghi nhận kết quả ký** | Hồ sơ thành **Đã ký công chứng** và trả kết quả về VMLS. |
| 12:20–12:55 | Nhà ở Phú Thượng · **VMLS** | **Tạo tham chiếu Giao dịch** | `PTID-HN-00044` được tạo; nhật ký thuế được nối; tuyến **Văn phòng đăng ký đất đai** được xác định từ hồ sơ, không do Người bán chọn. |
| 12:55–13:35 | Nhà ở Phú Thượng · **Văn phòng đăng ký đất đai** | **Ghi nhận kết quả sang tên** | Kết quả API mô phỏng `KQ-ĐKBĐ-260828-044` được nối vào lịch sử; trạng thái thành **Đã ghi nhận đăng ký biến động**. |
| 13:35–14:10 | **VMLS** | So sánh hai **Bản ghi sống** | Tóm tắt tuyến HĐMB và tuyến VPĐKĐĐ. Nói: “VMLS không làm thay cơ quan hoặc doanh nghiệp; VMLS giúp các bên cùng nhìn một chuỗi trạng thái có danh tính và nguồn.” |
| 14:10–15:00 | **Cùng thiết kế pilot VMLS** | **Mở bản thảo pilot** | Chọn một tuyến ưu tiên, đầu mối tổ chức, dữ liệu được phép và tiêu chí thành công. Kết thúc bằng lời mời đồng thiết kế, không dùng một bước chốt giả. |

## Các điểm phải được người xem nhìn thấy

- `NPID` luôn nằm trên **Bất động sản**, `PLID` luôn nằm trên **Tin bán**, `PTID` luôn nằm trên **Giao dịch**.
- Tin bán sau bước 03 là **Đã khởi tạo**, không phải “Active”, “đang bán” hoặc “đã duyệt”.
- PTID chỉ xuất hiện sau khi VPCC trả kết quả **Đã ký công chứng**.
- Người dùng không chọn tuyến; hồ sơ xác định tuyến và nhật ký ghi lại lý do.
- Yêu cầu bổ sung nối thêm sự kiện, không xóa lần nộp cũ.
- Sàn môi giới và Ngân hàng có góc nhìn hữu ích trên cùng hồ sơ, không tạo thêm bước quy trình.
- Kết thúc là **Bản ghi sống đã cập nhật**, không phải Closing Record hoặc tuyên bố giao dịch pháp lý đã hoàn tất.

## Đào sâu tùy chọn — phiên 60 phút

Có thể dùng từng mô-đun độc lập hoặc chạy đủ sáu mô-đun. Luôn khôi phục dữ liệu mẫu trước mô-đun cần thao tác từ đầu.

| Phút | Mô-đun | Vai và thao tác | Câu hỏi cần chốt |
|---|---|---|---|
| 00–10 | Danh tính và nguồn | **Môi giới** mở NPID, hai khái niệm diện tích và ảnh 357; thực hiện **Đối chiếu Bất động sản** rồi **Gửi xác nhận cho Người bán** | Nguồn nào được phép tạo claim? Ai xử lý xung đột? Trường nào là công khai, trong ngành hoặc hạn chế? |
| 10–20 | Quyền đại diện và Tin bán | **Người bán** thực hiện **Xác nhận quyền đại diện**; **VMLS** thực hiện **Khởi tạo Tin bán**; chuyển sang **Sàn môi giới** và xem HouseNow | Nội dung xác nhận, thời hạn, thu hồi và trách nhiệm kiểm duyệt thuộc về ai? HouseNow nhận trường nào và theo cơ chế đối soát nào? |
| 20–30 | Sẵn sàng và công chứng | **Môi giới** ghi nhận Người mua; **Người mua** xác nhận sẵn sàng; **VPCC** tiếp nhận, yêu cầu bổ sung và ghi nhận kết quả ký; **Môi giới** nộp bổ sung | Bộ hồ sơ tối thiểu là gì? Trạng thái nào được chia sẻ? Mã tương quan và cơ chế gửi lại hoạt động ra sao? |
| 30–40 | PTID, thuế và điều phối | **VMLS** tạo Giao dịch; so sánh lý do tuyến của hai hồ sơ; mở nhật ký tích hợp | Ai cấp hoặc đối chiếu PTID chính thức? Thuế cần bước phê duyệt thủ công không? Quy tắc tuyến nào có thẩm quyền xác nhận? |
| 40–50 | Sáu góc nhìn thị trường | Lần lượt chọn **Môi giới → Sàn môi giới → Chủ đầu tư → Người mua → Người bán → Ngân hàng** trên cùng hồ sơ | Mỗi vai cần trường nào để hoàn thành công việc? Trường nào tuyệt đối không được trả về góc nhìn đó? Cần bằng chứng đồng ý nào? |
| 50–60 | Hai kết quả và thiết kế pilot | Hoàn tất **Chủ đầu tư** trên S2-12A, **VPĐKĐĐ** trên Phú Thượng, so sánh bản ghi sống rồi mở **Cùng thiết kế pilot VMLS** | Tuyến nào có giá trị kiểm chứng lớn nhất nhưng phạm vi nhỏ nhất? Đơn vị đầu mối, dữ liệu, tiêu chí chấp nhận và ranh giới pháp lý là gì? |

### Gợi ý đào sâu theo vai

- **Môi giới:** tập trung thời gian tìm đúng Bất động sản, nguồn đối chiếu và khả năng theo dõi thay cho trao đổi rời rạc.
- **Sàn môi giới:** tập trung hàng đợi chất lượng, quyền đại diện, điểm nghẽn và dữ liệu không được nhìn thấy.
- **Chủ đầu tư:** tập trung việc chỉ nhận đúng hồ sơ HĐMB, ba mốc tiếp nhận–xác nhận–bàn giao và đồng bộ tự động.
- **Người mua:** tập trung khả năng hiểu tài sản, trạng thái hồ sơ của mình và kết quả nhận được.
- **Người bán:** tập trung quyền xác nhận có phạm vi, lịch sử không bị xóa và cách xử lý bổ sung.
- **Ngân hàng:** tập trung góc nhìn giới hạn theo đúng mục đích; không biến việc có mặt trong hệ sinh thái thành quyền xem toàn bộ hồ sơ.
- **VPCC / VPĐKĐĐ / VMLS:** tập trung quyền sở hữu thao tác, mã tương quan, trạng thái tối thiểu và nhật ký nối tiếp.

## Khôi phục, tiếp tục và phương án dự phòng

### Khôi phục dữ liệu mẫu

1. Chọn **Khôi phục dữ liệu mẫu**.
2. Xác nhận hành động khi giao diện hỏi; đây là thao tác xóa tiến độ demo trong trình duyệt, không xóa dữ liệu nguồn hay gọi hệ thống bên ngoài.
3. Kiểm tra cả hai Tin bán và Giao dịch trở về **Chưa khởi tạo**.
4. Kiểm tra lịch sử mỗi hồ sơ chỉ còn sự kiện nạp dữ liệu mẫu tương ứng.

### Tiếp tục phiên đang dở

- Chọn **Tiếp tục hành trình** ở trang giới thiệu để tới hồ sơ và hành động hợp lệ gần nhất.
- Nếu vai hiện tại không có quyền thực hiện hành động tiếp theo, dùng gợi ý đổi vai; không diễn giải nút bị khóa như lỗi kỹ thuật.
- Tiến độ của hai hồ sơ phải độc lập. Nếu thay đổi sai hồ sơ, khôi phục dữ liệu mẫu trước khi tiếp tục buổi trình diễn chính thức.

### Dự phòng trình diễn

- Nếu bản triển khai công khai không truy cập được, dùng bản `vite preview` từ đúng bản build đã kiểm thử và nói rõ đang chạy bản tĩnh cục bộ.
- Nếu ảnh 357 không tải, không mở trang web trực tiếp giữa buổi. Dùng thẻ nguồn kèm dòng ghi công, sau đó sửa asset trước khi quay video chính thức.
- Nếu biểu tượng HouseNow không tải, dừng bản ghi chính thức và khôi phục asset; đây là hiện vật bắt buộc trong hành trình.
- Nếu trạng thái không khớp, kiểm tra đúng hồ sơ, đúng vai và điều kiện trước. Nếu chưa rõ, khôi phục dữ liệu mẫu thay vì nhấp thử nhiều hành động.
- Nếu trình duyệt chặn lưu trữ, tiếp tục trong một phiên duy nhất và không tải lại trang; ghi nhận giới hạn trong báo cáo QA.
- Nếu bố cục trình chiếu quá chật, ẩn thanh công cụ trình duyệt hoặc chuyển về khung 1440 × 900; không giảm chữ tới mức khó đọc.

## Lời mời thiết kế pilot

Mở màn **Cùng thiết kế pilot VMLS** và dùng lời dẫn:

> “Đây chưa phải đề nghị triển khai một hệ thống hoàn chỉnh. Chúng ta hãy chọn một tuyến đủ nhỏ, xác định ai chịu trách nhiệm cho từng trạng thái, dữ liệu nào được phép dùng và bằng chứng nào cho thấy pilot tạo giá trị.”

Ghi nhận bốn đầu ra ngay trong cuộc thảo luận:

1. Một tuyến và phân khúc hoặc địa bàn ưu tiên.
2. Đầu mối của các tổ chức tham gia.
3. Bộ dữ liệu giả lập hoặc đã che được phép sử dụng.
4. Tiêu chí chấp nhận về thời gian, chất lượng dữ liệu, khả năng truy vết và góc nhìn theo vai.

Không ghi nhận sự quan tâm như một cam kết mua, phê duyệt pháp lý hoặc đồng ý chia sẻ dữ liệu.

## Chú thích cho video không lời

Các câu dưới đây dùng làm chú thích nổi hoặc phụ đề đọc được ở 1080p. Giữ mỗi chú thích trên màn hình ít nhất 3 giây.

| Mốc gợi ý | Chú thích |
|---|---|
| 00:00 | **VMLS — Một danh tính bền vững, một lịch sử có thể truy vết** |
| 00:25 | **Bản demo tĩnh · Dữ liệu giả lập · Không kết nối hệ thống thật** |
| 00:50 | **Bất động sản / NPID ≠ Tin bán / PLID ≠ Giao dịch / PTID** |
| 01:30 | **Môi giới bắt đầu từ đúng Bất động sản, không tạo một bản sao rời rạc** |
| 02:10 | **Ảnh 357 là nguồn tham khảo được ghi công — không phải bằng chứng tích hợp hoặc bảo chứng** |
| 02:45 | **Người bán xác nhận quyền đại diện qua chuyển tiếp VNeID mô phỏng** |
| 03:30 | **Tin bán được khởi tạo với PLID riêng — chưa phải Tin bán đang hoạt động** |
| 04:05 | **HouseNow là một kênh phân phối; VMLS giữ danh tính và lịch sử lõi** |
| 04:45 | **Mỗi vai chỉ thấy dữ liệu cần thiết cho mục đích của mình** |
| 05:35 | **PTID chưa xuất hiện khi hồ sơ mới chỉ sẵn sàng công chứng** |
| 06:35 | **VPCC trả kết quả; VMLS mới tạo mã Giao dịch tham chiếu** |
| 07:10 | **Thuế là chuỗi sự kiện tự động mô phỏng; cơ chế thật vẫn cần xác nhận** |
| 07:35 | **Hồ sơ xác định tuyến — Người bán không chọn cơ quan xử lý** |
| 08:15 | **Tuyến HĐMB: Chủ đầu tư tiếp nhận → xác nhận → bàn giao HĐMB mới** |
| 09:20 | **Hồ sơ thứ hai độc lập hoàn toàn và dùng dữ liệu giả lập** |
| 10:40 | **Yêu cầu bổ sung nối thêm lịch sử, không xóa lần nộp trước** |
| 12:15 | **Tuyến VPĐKĐĐ: kết quả API mô phỏng cập nhật bản ghi sống** |
| 13:10 | **Hai kết quả, cùng một nguyên tắc: danh tính, nguồn và trạng thái có thể truy vết** |
| 14:15 | **VMLS điều phối — không thay thế thẩm quyền của các bên** |
| 15:00 | **Cùng thiết kế một pilot đủ nhỏ để kiểm chứng giá trị** |

## Ranh giới bằng chứng và tuyên bố

- `FACT`: Ảnh trang chính `thongtinbds.moc.gov.vn` được chụp ngày 15/08/2026 và hiển thị với nguồn. Sự tồn tại của ảnh không chứng minh có API, dữ liệu hồ sơ, thẩm quyền nguồn hoặc quan hệ bảo chứng.
- `PROPOSAL`: Hai hồ sơ, mốc tháng 08/2026, quy tắc điều phối, góc nhìn theo vai, chuyển tiếp VNeID, trạng thái VPCC/VPĐKĐĐ/Chủ đầu tư và phân phối qua HouseNow đều là mô phỏng để thảo luận.
- `OPEN QUESTION`: Cơ quan hoặc hệ thống nào cấp PTID chính thức, trường nào được phép đối chiếu và cách VMLS ánh xạ mã tham chiếu vẫn cần xác nhận.
- `OPEN QUESTION`: Trao đổi thuế có hoàn toàn tự động hay cần một bước xét duyệt thủ công vẫn chưa được quyết định.
- Dữ liệu cá nhân trong demo là giả lập hoặc đã che. Không nhập dữ liệu thật trong buổi trình diễn.
- VMLS ghi nhận và điều phối trạng thái; demo không tuyên bố VMLS có thẩm quyền công chứng, thuế, đăng ký đất đai hoặc xác nhận chuyển nhượng của Chủ đầu tư.
- Kết quả cuối là bản ghi sống được cập nhật. Demo không tạo Closing Record và không tuyên bố một giao dịch pháp lý đã hoàn tất.
