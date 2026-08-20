---
title: Kịch bản vận hành VMLS
status: proposal
authority: working
last_reviewed: 2026-08-20
evidence_labels:
  - FACT
  - SOURCE CLAIM
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# Kịch bản vận hành VMLS

## Mục đích

Kịch bản này kiểm tra và trình diễn VMLS như một sản phẩm dữ liệu: tra cứu Bất động sản từ nguồn 357, quản lý quyền đại diện và phạm vi công khai của Tin bán, hợp tác/phân phối, khai báo Người mua, điều phối hồ sơ, và theo dõi trạng thái nhận từ hệ thống nguồn.

Phiên đạt yêu cầu khi người xem có thể xác định từ chính giao diện:

1. NPID, PLID và PTID là ba bản ghi riêng nhưng liên kết;
2. dữ liệu Bất động sản nào đến từ bản ghi nguồn 357, phiên bản và thời điểm nào;
3. Người bán quyết định nhóm thông tin Public nào được áp dụng;
4. Industry projection và Public projection phục vụ hai mục đích khác nhau;
5. Môi giới hợp tác không thay thế quyền đại diện gốc;
6. Sàn là đơn vị khai báo Người mua, bàn giao hồ sơ công chứng và xử lý yêu cầu sửa Tin bán;
7. đơn vị nào đang xử lý hồ sơ và trạng thái nào được đồng bộ về VMLS;
8. VPCC, VPĐKĐĐ và Cơ quan thuế chỉ theo dõi trên VMLS, không làm nghiệp vụ tại đây;
9. kết quả VPCC cuối tạo PTID và route; Thuế chạy song song;
10. `Cần cập nhật` là chênh lệch phiên bản kênh, không phải xác nhận HouseNow đã tự đổi dữ liệu.

`PROPOSAL`: Các record, command, projection và event trong kịch bản là hợp đồng pre-MVP. Quan hệ “357 cấp NPID” chưa phải interface chính thức. Nhãn bằng chứng này chỉ nằm trong tài liệu; UI dùng ngôn ngữ vận hành và không render wording giải thích nội bộ.

## Kiểm tra trước khi chạy

- Mở đúng release candidate ở zoom 100%, ưu tiên `1920 × 1080`; kiểm tra thêm `1440 × 900`, `1024 × 768` và `390 × 844` trước khi quay.
- Chọn `Đặt lại dữ liệu`, xác nhận reset, reload, rồi kiểm tra dữ liệu hồ sơ và thị trường về fixture đầu. Phiên VNeID đã xác nhận phải còn nguyên.
- Nếu cần quay từ trạng thái chưa đăng nhập, dùng riêng `Đăng xuất`; không xóa browser storage thủ công.
- Kiểm tra landing có `Đăng nhập bằng VNeID`, tra cứu NPID/từ khóa, khu vực, Chủ đầu tư và Dự án; NPID/PLID/PTID được trình bày riêng.
- Kiểm tra `Ứng dụng` hiển thị đủ module/luồng theo vai trò. Card chưa triển khai không có chevron, hover hoặc nút giả.
- Kiểm tra `Tin bán của tôi`, kho nguồn hàng, correction queue của Sàn, ba queue VPCC/VPĐKĐĐ/Thuế, và source cards của Vận hành VMLS mở được.
- Kiểm tra các local asset VNeID, 357, HouseNow và icon HouseNow tải được; không mở website thật trong phiên quay.
- Mở console ở cửa sổ khác để theo dõi lỗi nhưng không để lọt vào video.

### Dữ liệu khóa

| Hồ sơ | NPID | PLID sau xác nhận | PTID sau kết quả VPCC cuối | Căn cứ | Tuyến |
|---|---|---|---|---|---|
| Căn hộ S2-12A · Thụy Khuê | `NPID-HN-09876` | `PLID-HN-00125` | `PTID-HN-00031` | HĐMB với Chủ đầu tư | Chủ đầu tư / HĐMB |
| Nhà ở · Phú Thượng | `NPID-HN-10421` | `PLID-HN-00208` | `PTID-HN-00044` | Giấy chứng nhận | VPĐKĐĐ |

Kho hợp tác có năm cặp `NPID-HN-21001…21005` / `PLID-HN-31001…31005`. Chúng là fixture riêng, không phải trạng thái tương lai của hai hồ sơ giao dịch.

## Video cuối — 20–22 phút, im lặng, 1080p

Video dùng chính production release đã vượt smoke test, `1920 × 1080`, không audio. Callout tiếng Việt phải nằm trong khung hình và đồng thời xuất ra WebVTT. Không thao tác trên website hoặc ứng dụng VNeID, 357, HouseNow. Chỉ thao tác control của VMLS; khi cần ngữ cảnh ngoài hệ thống, dùng media local và wording bên dưới.

| Thời gian | Không gian | Thao tác trong VMLS | Callout/phụ đề bắt buộc |
|---|---|---|---|
| 00:00–00:50 | Landing · VNeID | Chọn `Đăng nhập bằng VNeID`, xem danh tính masked/phạm vi chia sẻ, xác nhận | `VMLS ghi nhận một phiên cục bộ với danh tính đã che. Không có yêu cầu đăng nhập hoặc OTP gửi đến VNeID.` |
| 00:50–02:15 | Tra cứu và 357 | Tra `NPID-HN-21001`, lọc khu vực/Dự án; mở provenance của một BĐS | `NPID được dùng trực tiếp từ bản ghi nguồn 357 đã cấu hình; phiên bản và hai mốc thời gian nguồn/VMLS được giữ riêng.` |
| 02:15–03:45 | Người bán · Tin bán của tôi | Mở `PLID-HN-31001`, tắt `Vị trí chi tiết` và `Ảnh`, lưu draft rồi áp dụng; xem Public preview | `Người bán kiểm soát nhóm dữ liệu Public. Trường đã ẩn bị loại khỏi projection, không chỉ che trên màn hình.` |
| 03:45–05:15 | Môi giới · Nguồn hàng | Mở cùng PLID, đăng ký hợp tác, kiểm tra Industry projection và gửi HouseNow | `Industry projection phục vụ hợp tác. HouseNow chỉ nhận applied Public projection; VMLS ghi nhận bàn giao cục bộ.` |
| 05:15–06:40 | Người bán rồi Sàn | Người bán yêu cầu sửa giá; Sàn mở correction queue, đối chiếu và áp dụng | `Giá mới tạo revision Tin bán. Phiên bản đã gửi trước đó chuyển sang Cần cập nhật; VMLS không khẳng định HouseNow đã tự đổi.` |
| 06:40–08:40 | Sàn rồi Người mua · S2-12A | Sàn khai báo Người mua; Người mua xem hợp đồng, checklist và panel 357 rồi xác nhận readiness | `Sàn khai báo Người mua. Người mua thấy dữ liệu hợp đồng và snapshot BĐS từ 357; Người bán và cơ quan ngoài không nhận danh tính này.` |
| 08:40–09:50 | Sàn · bàn giao VPCC | Gửi hồ sơ công chứng; mở VPCC workspace ở chế độ đọc | `VPCC xử lý trên hệ thống nguồn. VMLS chỉ hiển thị hồ sơ và trạng thái được đồng bộ.` |
| 09:50–11:30 | Vận hành VMLS | Nhận lần lượt trạng thái VPCC của S2-12A; dừng ở source cards/timeline | `Mỗi sự kiện giữ raw status, đơn vị xử lý, thời gian cập nhật tại nguồn và thời gian VMLS nhận.` |
| 11:30–13:20 | Phú Thượng · ngoại lệ bổ sung | Đi nhanh đến bàn giao; VMLS nhận `Yêu cầu bổ sung`; Người bán gửi PDF outbound; VMLS nhận event kế tiếp | `Yêu cầu và bản gửi bổ sung đều được nối thêm. VPCC không có nút yêu cầu bổ sung trực tiếp trên VMLS.` |
| 13:20–15:20 | Kết quả VPCC · PTID · Thuế | Nhận kết quả cuối của S2-12A; quan sát PTID/route và handoff Thuế; nhận một Tax event | `Kết quả VPCC cuối tạo PTID và route. Thuế có timeline riêng, chạy song song và không gate tuyến chuyển quyền trong demo.` |
| 15:20–16:50 | Tuyến Chủ đầu tư | Chủ đầu tư ghi nhận tiếp nhận/xác nhận; Người mua nhận HĐMB mới | `Cùng một PTID đi qua tuyến HĐMB. Không có bước closing giả.` |
| 16:50–18:50 | Tuyến VPĐKĐĐ | Nhận kết quả VPCC cuối của Phú Thượng; nhận các event VPĐKĐĐ đến `Đã xử lý` | `Route được xác định từ căn cứ hồ sơ. VPĐKĐĐ chỉ có queue/detail đọc trên VMLS.` |
| 18:50–20:15 | VPCC · VPĐKĐĐ · Thuế | Chuyển ba vai trò, lọc queue và mở detail | `Ba cơ quan theo dõi hồ sơ đồng bộ với trạng thái chuẩn; không tiếp nhận, ký, phê duyệt hoặc xử lý thuế trong VMLS.` |
| 20:15–21:30 | Môi giới · Sàn · Người bán · Người mua | So sánh cột tiến độ/đơn vị xử lý và timeline của cùng hồ sơ | `Mỗi vai thấy đúng dữ liệu cần thiết, cùng milestone nguồn và đơn vị đang xử lý, không dùng phần trăm tiến độ giả.` |

Cho phép co giãn mỗi cảnh 10–20 giây để tổng video nằm trong 20–22 phút. Callout không che identifier, timestamp, source status, trường Public hoặc action chính.

### Wording tích hợp trong video

- **VNeID**: `Phiên đăng nhập cục bộ dùng danh tính đã che và phạm vi chia sẻ đã cấu hình; không gửi yêu cầu đến VNeID.`
- **357**: `Bản ghi nguồn 357 cung cấp NPID và các claim BĐS đã cấu hình; ảnh chụp có ngày không chứng minh kết nối API.`
- **HouseNow**: `VMLS gửi applied Public projection tới kênh HouseNow và theo dõi phiên bản bàn giao; không thao tác hoặc xác nhận đăng tin trên HouseNow.`

Không dùng wording `mô phỏng đề xuất`, `demo giả lập`, evidence label, lời dẫn story-telling hoặc disclaimer banner trong UI/callout. Ranh giới được nói bằng sự kiện quan sát được: local session, bản ghi nguồn, payload, read-only queue, trạng thái cục bộ và timestamp.

## Phiên vận hành chuẩn — 20–22 phút

### A. Danh tính, nguồn và Public projection

1. Ở landing, đăng nhập VNeID qua handoff hai bước. Kiểm tra header thành `Đã đăng nhập VNeID`, reload vẫn giữ phiên, và role hiện tại không đổi.
2. Tra cứu bằng NPID, khu vực, Chủ đầu tư và Dự án. Mở BĐS và kiểm tra source record ID, version, source-updated-at, VMLS-received-at, project/developer, loại BĐS, tòa/căn, diện tích có khái niệm, và trạng thái công bố.
3. Vào Người bán → `Tin bán của tôi` → `PLID-HN-31001`. Kiểm tra chỉ có Tin bán thuộc Seller. Tắt `Vị trí chi tiết` và `Ảnh`, `Lưu bản nháp`, sau đó `Áp dụng cấu hình`.
4. Kiểm tra preview Public không còn hai nhóm đã tắt; PLID, loại giao dịch/BĐS, khu vực tổng quát và liên hệ kinh doanh của Môi giới vẫn có và không thể bỏ.

### B. Hợp tác, phân phối và sửa giá

5. Vào Môi giới, tra `PLID-HN-31001`, đăng ký hợp tác và kiểm tra Representation/Môi giới phụ trách gốc không đổi.
6. Mở phân phối, kiểm tra payload HouseNow đúng applied Public version và không có Seller identity, evidence, Buyer, finance, VPCC, PTID, audit hoặc correlation data. Gửi một lần.
7. Vào Người bán, yêu cầu sửa `askingPrice`. Người bán chỉ nhập/đề xuất giá mới; không sửa trực tiếp fixture nguồn hoặc revision cũ.
8. Vào Sàn, mở correction queue, kiểm tra PLID, old/new value, người gửi, trạng thái, hạn xử lý; áp dụng. Kiểm tra revision mới, Audit Event mới, channel `Cần cập nhật`, reconciliation event và không có claim remote-update.

### C. Buyer, readiness và handoff

9. Với S2-12A, Môi giới nhập exact NPID, scope và term; Người bán xác nhận; kiểm tra PLID tự tạo ở `Đã khởi tạo`.
10. Vào Sàn, khai báo Buyer bằng mã định danh, giá thỏa thuận và ngày dự kiến ký. Kiểm tra Môi giới không có action này.
11. Vào Người mua, kiểm tra họ tên masked, mã định danh, NPID, giá/ngày ký, checklist, và `Dữ liệu BĐS từ 357`. Xác nhận readiness; consent Ngân hàng là tùy chọn.
12. Vào Sàn và bàn giao hồ sơ công chứng. Kiểm tra VPCC queue nhận journey dossier nhưng chỉ có filter, tìm kiếm và detail.

### D. Nhận trạng thái ngoài VMLS

13. Vào Vận hành VMLS, mở S2-12A và dùng `Nhận cập nhật` đúng source VPCC. Mỗi lần phải lấy event kế tiếp, không bỏ qua và không cho event cũ làm lùi state.
14. Với Phú Thượng, đi đến bàn giao; nhận chuỗi VPCC tới `Yêu cầu bổ sung`. Vào Người bán gửi tài liệu PDF outbound, rồi quay lại VMLS nhận event tiếp theo.
15. Nhận kết quả VPCC cuối cho cả hai hồ sơ. Kiểm tra contract ID, PTID, route, Tax handoff, và VPĐKĐĐ handoff của Phú Thượng được tạo tự động.
16. Nhận Tax status song song. Hoàn tất tuyến Chủ đầu tư/HĐMB cho S2-12A và nhận VPĐKĐĐ events cho Phú Thượng. Tax chưa hoàn tất không được chặn hai route.

### E. Cross-role monitoring

17. Mở queue/detail của Môi giới, Sàn, Người bán, Người mua; kiểm tra `Tiến độ hồ sơ`, `Đơn vị đang xử lý` và timeline theo quyền.
18. Mở lần lượt VPCC, VPĐKĐĐ, Cơ quan thuế; mỗi queue có ít nhất 5–6 hồ sơ masked/synthetic, bốn trạng thái chuẩn, mã hồ sơ nguồn, NPID, PTID nếu có, BĐS, đơn vị xử lý, thời gian nguồn và thời gian VMLS nhận. Không có business action.
19. Mở Ngân hàng với một hồ sơ không consent và một hồ sơ consent. Hồ sơ không consent phải biến mất; hồ sơ consent chỉ có finance projection.
20. Reload direct hash route, kiểm tra replay; reset business data và xác nhận phiên VNeID vẫn còn. Đăng xuất VNeID riêng.

## Hợp đồng command và payload

Command sai actor, sai state, thừa/thiếu key hoặc payload không hợp lệ phải để toàn bộ state không đổi.

| Actor | Command | Payload/check chính |
|---|---|---|
| Người bán | `SAVE_PUBLICATION_DRAFT` | PLID thuộc Seller; danh sách optional group hợp lệ; locked group không nhận từ form |
| Người bán | `APPLY_PUBLICATION_PROFILE` | PLID đúng; applied version lấy từ draft hiện tại |
| Người bán | `REQUEST_LISTING_CORRECTION` | `askingPrice`, old/new whole-VND; Seller không tự apply |
| Người bán | `SUBMIT_SUPPLEMENT_HANDOFF` | đúng hồ sơ/yêu cầu, loại tài liệu, tên tệp PDF |
| Sàn | `DECLARE_BUYER` | mã định danh Người mua, giá thỏa thuận VND nguyên, ngày dự kiến ký |
| Sàn | `APPLY_LISTING_CORRECTION` | đúng request đang chờ và PLID trong Organization scope |
| Sàn | `HANDOFF_NOTARY_DOSSIER` | đúng hồ sơ, readiness và tập tài liệu bắt buộc |
| Vận hành VMLS | `RECEIVE_EXTERNAL_EVENT` | `{ caseId, source }`; chỉ event kế tiếp của đúng hồ sơ/nguồn |
| VNeID local | `CONFIRM_VNEID_LOGIN` | danh tính masked và sharing scope đã cấu hình; không nhận role |
| VNeID local | `LOGOUT_VNEID` | chỉ xóa session, không đổi business state |

VPCC, VPĐKĐĐ và Cơ quan thuế luôn có `allowedActions=[]`. Kiểm tra DOM không có nút tiếp nhận, ký, phê duyệt, yêu cầu bổ sung hoặc quyết định thuế.

## Kiểm tra projection và lịch sử

- Public search và HouseNow phải serialize applied Public projection; group tắt không được xuất hiện trong DOM/payload.
- Industry projection không tự thay đổi theo Public setting và không lộ Seller identity/contact, Representation evidence, Buyer, finance, VPCC, PTID, audit hoặc correlation ID.
- Seller chỉ thấy Tin bán của mình; correction giữ old/new/request/apply/revision theo thứ tự append.
- Buyer identity không xuất hiện trong Seller hoặc external-agency projection.
- Buyer panel 357 không chứa owner identity, CCCD hoặc private transaction history.
- External event giữ raw status, normalized status, source system, processing organization, source time và received time.
- Duplicate external event không nối thêm; event cũ không làm lùi status.
- External status history và Audit Event không được trộn vào một collection.
- NPID, PLID, PTID, source case ID, contract ID và idempotency/correlation ID không được dùng thay nhau.

## Review sâu 60 phút

| Phút | Mô-đun | Câu hỏi review |
|---|---|---|
| 00–10 | NPID và provenance 357 | Ai sở hữu official NPID, field claim, version, correction và conflict-resolution contract? |
| 10–20 | Representation và PublicationProfile | Locked/optional groups có đúng Public policy; ai duyệt thay đổi nhạy cảm? |
| 20–30 | Industry, hợp tác và HouseNow | Ai duyệt Môi giới hợp tác, consent kênh, retry/reconciliation và gỡ tin? |
| 30–40 | Buyer và privacy | Vì sao Sàn khai báo; projection nào cho Agent/Buyer/Seller/Bank/cơ quan ngoài? |
| 40–50 | VPCC, supplement, PTID, Tax | Inbound event contract, idempotency, sequencing và tax gating chính thức là gì? |
| 50–60 | VPĐKĐĐ/Developer và cross-role monitoring | Route/rule version, source ownership, SLA và completion semantics do ai phê duyệt? |

## Persistence và reset

### Tiếp tục

- Journey commands replay từ storage `v4`; market governance và VNeID dùng store riêng.
- Payload cũ, sai schema hoặc bị sửa phải reset store tương ứng an toàn.
- Reload hoặc direct hash route phải khôi phục cùng projection và milestone.

### Đặt lại dữ liệu mẫu

1. Chọn `Đặt lại dữ liệu` và xác nhận.
2. Kiểm tra hai dossier, market registration/distribution, PublicationProfile/correction và external event progress về fixture đầu.
3. Kiểm tra năm inventory fixture, source records và bundled assets vẫn còn.
4. Kiểm tra VNeID session không bị xóa; dùng `Đăng xuất` riêng khi cần.

## Fallback khi trình diễn hoặc quay

- Nếu storage không dùng được, chạy trong một phiên liên tục và ghi giới hạn vào QA report.
- Nếu một source event không nhận được, kiểm tra đúng `caseId`, source, handoff prerequisite và next fixture; không đổi vai cơ quan để ép state.
- Nếu projection còn field đã tắt, dừng quay: đây là lỗi privacy, không dùng CSS/crop để che.
- Nếu external queue có action nghiệp vụ, dừng quay: ba workspace phải read-only.
- Nếu local asset lỗi, dùng bản build local đã kiểm chứng từ cùng release candidate; không thay bằng website live.
- Nếu production smoke thất bại, rollback về deployment ready trước và không quay trên release lỗi.
- Nếu video callout che UI, quay lại cảnh; không sửa bằng crop làm mất identifier/timestamp.

## Checklist cuối phiên

- [ ] Landing là workbench dữ liệu, có VNeID entry và bốn tiêu chí tra cứu thật; không phải portfolio hero.
- [ ] Header/logo chỉ là VMLS; không có `Powered by HouseNow`.
- [ ] 357-issued NPID được gắn `PROPOSAL` trong tài liệu nhưng UI không render evidence label.
- [ ] Property provenance có source record, version và hai timestamp; không lộ owner/CCCD/private history.
- [ ] Seller chỉ thấy PLID của mình, có draft/applied Public profile, preview và correction request.
- [ ] Detailed location/images bị omit sau khi apply; locked groups vẫn còn.
- [ ] Môi giới đăng ký hợp tác; Sàn khai báo Buyer và bàn giao VPCC.
- [ ] HouseNow dùng applied Public projection; correction sau send tạo `Cần cập nhật` và reconciliation event.
- [ ] Buyer thấy contract/checklist/357 panel; Seller và external agency không thấy Buyer identity.
- [ ] Môi giới/Sàn/Seller/Buyer có milestone + processing organization + source timeline.
- [ ] VPCC/VPĐKĐĐ/Tax queue có 5–6 hồ sơ, filter/search/detail và không có business command.
- [ ] VMLS nhận event tuần tự/idempotent/non-regressive; external events tách khỏi Audit Events.
- [ ] Final VPCC event tạo PTID/route/Tax handoff; Tax không gate; hai transfer outcome hoàn tất.
- [ ] VNeID session qua reload, độc lập role/reset, logout riêng, không có external request.
- [ ] Giao diện không render `PROPOSAL`, `mô phỏng đề xuất`, product-story copy hoặc disclaimer banner.
- [ ] MP4/WebM 1080p im lặng, callout tiếng Việt trong hình, VTT khớp timing, full decode/frame sample/checksum đều PASS.

## Ranh giới bằng chứng cho reviewer

- `FACT`: Static build, bundled assets, configured values, reducer guards, browser stores và UI behavior có thể kiểm tra trực tiếp.
- `FACT`: VNeID, 357 và HouseNow media là local dated captures; không media nào tự chứng minh live integration.
- `PROPOSAL`: 357 cấp NPID, PublicationProfile, correction/reconciliation, Buyer ownership, external event contract, Tax parallel và route là giả thuyết sản phẩm hiện tại.
- `OPEN QUESTION`: official identifier owner, legal state transition, field policy, tax decision/gating, entitlement, interface contract, retry/SLA và downstream reconciliation cần stakeholder có thẩm quyền phê duyệt.
- Dữ liệu công khai phải synthetic/masked. Không nhập danh tính, liên hệ, tài chính, tài liệu hoặc credential thật.
