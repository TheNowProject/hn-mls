---
title: Kịch bản vận hành VMLS V5
status: proposal
authority: working
last_reviewed: 2026-08-21
evidence_labels:
  - FACT
  - SOURCE CLAIM
  - INFERENCE
  - PROPOSAL
  - OPEN QUESTION
---

# Kịch bản vận hành VMLS V5

## Mục đích và ranh giới

Kịch bản trình diễn một hành trình duy nhất cho nhà ở có Giấy chứng nhận tại Phú Thượng:

```text
Đã có Property/NPID
→ Môi giới gửi yêu cầu xác nhận quyền đại diện
→ Người bán xác nhận
→ VMLS cấp PLID `Đã khởi tạo` và khớp snapshot HouseNow mẫu
→ Môi giới khai báo giao dịch đã công chứng
→ VMLS đối soát bản ghi giao dịch 357
→ Thuế
→ VPĐKĐĐ
→ Người mua nhận thông báo lấy Giấy chứng nhận
```

Phiên đạt yêu cầu khi người xem nhận ra từ chính giao diện:

1. ban đầu Phú Thượng chỉ có NPID, chưa có PLID;
2. Môi giới gửi yêu cầu quyền đại diện, Người bán xác nhận, và chỉ lúc đó VMLS mới tạo PLID `Đã khởi tạo`;
3. `Đã khởi tạo` không được trình bày như Active, phê duyệt, công khai, phân phối, gửi HouseNow, hoặc HouseNow đã xác nhận;
4. PLID mới được khớp với `HouseNowListingSnapshot` mẫu có external ID, version và timestamp riêng;
5. NPID, PLID và PTID là ba identity riêng nhưng liên kết;
6. Môi giới tự khai báo và submit giao dịch sau công chứng; Sàn chỉ giám sát;
7. khai báo VMLS và `TransactionSourceRecord357` tồn tại song song, được đối soát nhưng không ghi đè;
8. hai nút của Vận hành VMLS độc lập: đồng bộ 357 không gate chuỗi trạng thái;
9. Thuế hoàn thành trước khi VPĐKĐĐ được bàn giao hồ sơ;
10. Người bán nhận thông báo cần xử lý nghĩa vụ tài chính, Người mua nhận thông báo hoàn tất;
11. Public và mỗi tài khoản chỉ thấy projection được phép;
12. không có bước xác nhận readiness, VPCC, Bank, Developer, agency business command, hoặc Closing Record trong runtime.

`SOURCE CLAIM`: Ảnh quy trình và nội dung cuộc họp mô tả trình tự công chứng → Thuế → đăng ký đất đai. Đây chưa phải quy trình pháp lý được xác minh hoặc phê duyệt.

`PROPOSAL`: Representation request/confirmation, thời điểm cấp PLID, snapshot matching, command, record, sáu event, wording trạng thái và notification dưới đây là hợp đồng demo client-side. Chúng không khẳng định có API thật, Listing đã Active/công khai/gửi HouseNow, hồ sơ đã được cơ quan nhận, số tiền thuế, người có nghĩa vụ pháp lý, hoặc Giấy chứng nhận thật đã được cấp.

Storyboard V2/V3 vẫn `SUPERSEDED`. V5 chỉ khôi phục seam Representation ba bước nêu trên; không khôi phục VNeID, Buyer readiness, VPCC workspace, publication flow, hoặc hai nhánh chuyển nhượng cũ.

## Kiểm tra trước khi chạy

- Dùng đúng release candidate, zoom 100%; kiểm tra trước ở `1920 × 1080`, `1440 × 900`, `1024 × 768`, và `390 × 844`.
- Chọn `Đặt lại dữ liệu`, xác nhận quay về landing, rồi reload.
- Kiểm tra landing có headline `Một định danh. Mọi nguồn dữ liệu. Một hành trình có thể truy vết.`, public search, data-network hero, và `Mở tài khoản demo`.
- Kiểm tra account switcher chỉ có Môi giới, Sàn môi giới, Người bán, Người mua, và Vận hành VMLS.
- Kiểm tra public catalogue ban đầu có bốn Listing khác; Phú Thượng chưa có PLID nên chưa xuất hiện như một Listing. Sau Seller confirmation, catalogue có năm Listing và Phú Thượng được ưu tiên.
- Kiểm tra không có PTID, khai báo, contract, party, processing, notification, hoặc internal event trong public result/DOM.
- Kiểm tra asset và font local tải được; console không có lỗi và Network không gọi HouseNow, 357, Tax, VPĐKĐĐ, hoặc VNeID.

### Dữ liệu khóa

| Object | Fixture V5 | Trạng thái đầu |
|---|---|---|
| Bất động sản | Nhà ở · Phú Thượng, `NPID-HN-10421` | Có sẵn |
| Quyền đại diện | `REP-HN-00044` | `Chưa gửi`; chưa có request/confirmation |
| Tin bán | `PLID-HN-00208` | Chưa tồn tại; Seller confirmation mới tạo với `Đã khởi tạo` |
| HouseNow source | external Listing ID + version + source/VMLS timestamps đã cấu hình | Chưa được chiếu như snapshot đã khớp; xuất hiện sau confirmation |
| Khai báo giao dịch | Môi giới submit sau công chứng | Chưa có |
| Giao dịch | PTID VMLS | Chưa có; tạo khi submit |
| 357 transaction source | source transaction ID + provenance đã cấu hình | Chưa sync |
| Tax/VPĐKĐĐ events | Sáu event deterministic | Chưa nhận |
| Notifications | Seller tax due; Buyer completion | Chưa có |

Tất cả identity, organization, document, timestamp, source record, obligation và notification đều synthetic hoặc masked. UI gắn dữ liệu bằng `Bộ dữ liệu mẫu`; không trình bày fixture date như dữ liệu live trong tương lai.

## Phiên vận hành chuẩn

### A — Landing, public search, và tài khoản

1. Quan sát headline và data-network hero. Bật reduced motion ở hệ điều hành/browser và xác nhận hành trình không phụ thuộc animation.
2. Tra cứu NPID/PLID/địa điểm của bốn Listing đã tồn tại. Xác nhận `PLID-HN-00208` chưa có trong catalogue ban đầu vì Seller chưa xác nhận quyền đại diện cho Phú Thượng.
3. Quan sát một thẻ kết quả public. Chỉ ra NPID, PLID, safe Listing fields và provenance; xác nhận không có Representation evidence, PTID hay dữ liệu giao dịch riêng tư.
4. Chọn `Mở tài khoản demo`, dùng bàn phím đi qua năm tài khoản, rồi vào Môi giới.

### B — Yêu cầu và xác nhận quyền đại diện

5. Trong tài khoản Môi giới, mở Property Phú Thượng. Xác nhận có `NPID-HN-10421`, Representation `Chưa gửi`, chưa có PLID và chưa chiếu snapshot HouseNow đã khớp.
6. Gửi `REQUEST_SELLER_CONFIRMATION` với NPID, phạm vi và thời hạn đã cấu hình. Kiểm tra Representation thành `Chờ xác nhận` nhưng PLID vẫn chưa tồn tại.
7. Chuyển sang Người bán. Mở đúng pending request và chọn `CONFIRM_REPRESENTATION`; không dùng VNeID hoặc một agency workspace giả.
8. Kiểm tra confirmation tạo `PLID-HN-00208` với trạng thái `Đã khởi tạo` và làm xuất hiện snapshot HouseNow mẫu đã khớp. Giao diện không được hiển thị Active, đã phê duyệt, đã công khai, đã phân phối, đã gửi HouseNow, hay HouseNow đã xác nhận.
9. Quay lại landing và xác nhận catalogue nay có năm kết quả, Phú Thượng được ưu tiên, và Public chỉ nhận allowlist từ snapshot HouseNow với trạng thái nguồn `Đang bán`. Đối chiếu rằng Listing nội bộ vẫn `Đã khởi tạo`, kênh outbound vẫn `Chưa phát hành`; việc xuất hiện trong local demo catalogue không được mô tả là VMLS publication/distribution acknowledgement.

### C — Môi giới khai báo giao dịch đã công chứng

10. Trong tài khoản Môi giới, mở hồ sơ Phú Thượng. So sánh NPID, PLID và HouseNow external Listing ID; ba giá trị không thay thế nhau.
11. Điền Buyer reference của đúng tài khoản Người mua demo, giá giao dịch nguyên VND, số/ngày hợp đồng, VPCC và ngày công chứng; bảo đảm ngày hợp đồng ≤ thời điểm công chứng ≤ thời điểm submit và toàn bộ nằm trong thời hạn Representation đã xác nhận.
12. Gắn metadata PDF của HĐ chuyển nhượng đã công chứng; HĐ đặt cọc là tùy chọn. Giao diện không upload hoặc giữ byte nội dung.
13. Submit. Kiểm tra đồng thời xuất hiện:
   - `TransactionDeclaration`;
   - PTID;
   - hồ sơ/handoff Thuế;
   - Audit Event cho hành động Môi giới;
   - Integration Event cho handoff hệ thống.
14. Kiểm tra submit lần hai bị vô hiệu/no-op. Chuyển sang Sàn, xác nhận Sàn chỉ theo dõi và không có nút request/confirm Representation, khai báo, phê duyệt, hoặc handoff.

### D — Hai nút Vận hành VMLS

15. Chuyển sang Vận hành VMLS. Hai nút phải cùng được bật sau submit:
    - `Đồng bộ từ 357`;
    - `Đồng bộ từ Thuế và VPĐKĐĐ` với preview mốc kế tiếp.
16. Chọn `Đồng bộ từ 357`. So sánh khai báo Môi giới và bản ghi 357 theo từng trường; fixture chính hiển thị `matched`. Hai source card vẫn tồn tại riêng.
17. Kiểm tra nút 357 chuyển thành `Đã đồng bộ` và không thể tạo bản ghi/event thứ hai.
18. Trong một lần chạy QA riêng, reset, hoàn tất lại Representation/declaration, rồi bấm status trước 357 để chứng minh 357 không gate tiến độ.

### E — Sáu mốc Thuế → VPĐKĐĐ

Mỗi lần bấm `Đồng bộ từ Thuế và VPĐKĐĐ` chỉ nhận mốc kế tiếp. Trước khi bấm, đọc preview; sau khi bấm, kiểm tra event/timeline và side effect.

| Lần bấm | Kết quả bắt buộc | Kiểm tra chéo |
|---:|---|---|
| 1 | Thuế đã tiếp nhận; có giấy hẹn/chờ thông báo nghĩa vụ tài chính | Chưa có Seller notification; chưa có VPĐKĐĐ case |
| 2 | Có nghĩa vụ tài chính cần xử lý | Tạo đúng một Seller notification + open work item, không có số tiền/người chịu khoản |
| 3 | Hai dòng riêng: `Đã đóng thuế TNCN`, `Đã đóng lệ phí trước bạ` | Seller work item đóng; VPĐKĐĐ handoff/case mới được tạo |
| 4 | VPĐKĐĐ đã tiếp nhận hồ sơ TTHC đăng ký sang tên | Processing source/timestamp hiện đúng; PTID chưa complete |
| 5 | VPĐKĐĐ đang xử lý TTHC | Không dùng phần trăm hoặc SLA giả |
| 6 | Hoàn tất xử lý sang tên | PTID complete; tạo đúng một Buyer notification + work item lấy Giấy chứng nhận tại VPĐKĐĐ |

19. Sau lần bấm 2, chuyển sang Người bán. Xác nhận unread badge, mở notification và kiểm tra:
    - notification chỉ dành cho Seller;
    - wording yêu cầu xử lý nghĩa vụ tài chính nhưng không có amount hoặc legal-liability claim;
    - mở notification đánh dấu read và đi tới đúng safe dossier;
    - work item vẫn open cho đến event 3.
20. Quay lại Ops, bấm event 3. Trở lại Seller và xác nhận work item đã đóng nhưng notification/history còn nguyên.
21. Hoàn tất event 4–6. Chuyển sang Người mua, mở notification và kiểm tra chỉ dẫn nhận Giấy chứng nhận tại VPĐKĐĐ.
22. Xác nhận Buyer không có nút `Đã nhận sổ`; hệ thống không tạo Closing Record.

### F — Projection, replay, và reset

23. So sánh cùng PTID qua Agent, Brokerage, Seller, Buyer, và Ops:
    - Agent thấy khai báo và milestone cần thiết;
    - Brokerage thấy Organization monitoring projection;
    - Seller và Buyer không thấy Party reference của nhau;
    - chỉ Ops thấy chi tiết reconciliation và event identities.
24. Reload ở các mốc pending Representation, Listing đã khởi tạo, Seller notification read, và completed. Kiểm tra account, request/confirmation, PLID, unread/read, PTID, reconciliation, obligation, và event index giữ nguyên.
25. Mở một hash V4 hoặc hash không biết. Phải về landing, không fallback sang Agent.
26. Chọn `Đặt lại dữ liệu`. Kiểm tra quay về landing, Phú Thượng chỉ còn NPID và Representation `Chưa gửi`, PLID/snapshot match/declaration/PTID/357/status/notification bị xóa, bốn Listing còn lại không đổi, và browser-storage key không liên quan không bị xóa.

## Command contract

Command sai actor, sai state, thừa/thiếu key, hoặc payload không hợp lệ phải để toàn bộ state không đổi.

| Actor | Command | Contract chính |
|---|---|---|
| Môi giới | `REQUEST_SELLER_CONFIRMATION` | Chỉ dùng NPID đã có và exact `propertyId/scope/startsOn/expiresOn`; từ `Chưa gửi` sang `Chờ xác nhận`; chưa tạo PLID |
| Người bán | `CONFIRM_REPRESENTATION` | Exact `{ accepted: true }` cho request đang chờ; tạo PLID `Đã khởi tạo` và snapshot match; không activation/publication/distribution/HouseNow send |
| Môi giới | `SUBMIT_TRANSACTION_DECLARATION` | Chỉ sau confirmation; một PLID được gán; exact post-notary fields; required notarized-contract PDF metadata; optional deposit PDF metadata; one-shot |
| Vận hành VMLS | `SYNC_TRANSACTION_FROM_357` | Chỉ sau declaration; exact configured source record; one-shot; không overwrite, không gate |
| Vận hành VMLS | `ADVANCE_EXTERNAL_PROCESSING` | Reducer tự chọn event kế tiếp; caller không truyền source/status/index; tối đa sáu lần hợp lệ |
| Tài khoản nhận | `MARK_NOTIFICATION_READ` | Chỉ notification của chính tài khoản; chỉ đổi read metadata |

Không có mutable command cho Brokerage. Không có runtime command/workspace cho Bank, Developer, VPCC, Tax, VPĐKĐĐ, VNeID, Buyer readiness, certificate acknowledgement, hay Closing Record.

## Kiểm tra projection và lịch sử

- Public result serialize bằng allowlist và structurally omit Representation evidence cùng mọi private transaction field; Phú Thượng PLID chỉ có thể xuất hiện sau confirmation.
- RepresentationRequest, RepresentationConfirmation, Listing, và `HouseNowListingSnapshot` là các record/decision boundary riêng; confirmation không tạo Distribution Event.
- `HouseNowListingSnapshot`, `TransactionDeclaration`, và `TransactionSourceRecord357` là ba record riêng với provenance riêng.
- Reconciliation output không mutate source input; mismatch/missing chỉ tạo cảnh báo cho Ops.
- Seller notification không chứa amount hoặc payer allocation; Buyer completion không đồng nghĩa đã nhận sổ.
- Duplicate command/event không nối thêm source, event, notification, work item, Audit Event, hoặc Integration Event.
- Event cũ/skip không làm lùi hoặc nhảy status; không có Land case trước event 3.
- User Audit Events, system Integration Events, và ExternalStatusEvents không dùng chung collection.
- NPID, PLID, PTID, HouseNow Listing ID, 357 transaction ID, contract ID, source case ID, notification ID, và idempotency ID không được dùng thay nhau.

## Persistence và reset

### Tiếp tục

- Demo sản phẩm V5 replay từ browser schema/key `vmls:phu-thuong:2026-08:v6`; không replay command log V4 hoặc envelope V5 transaction-only trước đó. Seam Representation được ghi mới trong state/history hiện tại.
- Payload cũ, sai schema, sai actor/action, hoặc bị sửa reset an toàn về fixture đầu.
- Reload/direct valid route khôi phục đúng Representation/Listing stage, role projection, unread state, reconciliation, và event index.
- Chỉ legacy keys được allowlist mới bị dọn sau khi V5 khởi tạo thành công; không gọi `localStorage.clear()`.

### Đặt lại dữ liệu mẫu

1. Chọn `Đặt lại dữ liệu` và xác nhận.
2. Kiểm tra Representation về `Chưa gửi`; Phú Thượng Listing/PLID, matched snapshot, declaration, PTID, 357 record/reconciliation, external progress, obligations, notifications, và work items đều không còn.
3. Kiểm tra Property/NPID, bốn Listing công khai khác, local source fixture, local assets, và unrelated browser-storage sentinel vẫn còn.
4. Kiểm tra route quay về landing.

## Fallback khi trình diễn

- Nếu Representation request/confirmation không tiến, kiểm tra đúng Agent/Seller, state hiện tại và exact payload; không tự tạo PLID bằng DevTools.
- Nếu declaration không submit, kiểm tra Representation đã xác nhận, PLID/snapshot đã có, đúng Agent, required PDF metadata, media type, value/date, và không có extra field; không chỉnh fixture bằng DevTools.
- Nếu 357 không sync, kiểm tra declaration đã tồn tại và nút chưa chạy; không dùng source record để overwrite khai báo.
- Nếu status không tiến, kiểm tra đúng Ops và preview next event; không truyền/ép source hoặc status tùy ý.
- Nếu Seller/Buyer thấy dữ liệu của Party kia, dừng demo: đây là lỗi privacy, không dùng CSS/crop để che.
- Nếu Land case xuất hiện trước event 3 hoặc notification bị duplicate, dừng demo: đây là lỗi state integrity.
- Nếu production smoke thất bại, dùng release candidate đã xác minh hoặc rollback; không quay trên deployment lỗi.

## Checklist cuối phiên

- [ ] Landing đúng Living Registry, headline, public search, network hero, reduced motion.
- [ ] Public catalogue có 4 Listings ban đầu; sau Seller confirmation có 5 và Phú Thượng ưu tiên; không lộ Representation/private transaction data.
- [ ] Account switcher có đúng 5 tài khoản và badge theo tài khoản.
- [ ] Agent request từ NPID; Seller confirm; PLID `Đã khởi tạo` chỉ xuất hiện sau confirm.
- [ ] Confirmation không claim Active/phê duyệt/publication/distribution/HouseNow send hay acknowledgement.
- [ ] HouseNow snapshot chỉ được match sau confirmation, có external ID/version/timestamps và không bị mutate.
- [ ] Sau seam trên, Agent submit post-notary declaration; Sàn monitoring-only.
- [ ] Submit tạo PTID, Tax handoff, Audit Event, và Integration Event atomically.
- [ ] 357 là transaction source riêng, one-shot, đối soát từng field, không overwrite/gate.
- [ ] Status sync tiến đúng sáu mốc Thuế → VPĐKĐĐ, mỗi lần một event.
- [ ] Seller notification ở event 2; hai obligations complete và Land handoff ở event 3.
- [ ] Buyer notification ở event 6; không acknowledgement hoặc Closing Record.
- [ ] Không còn Bank/Developer/VPCC/Tax/VPĐKĐĐ/VNeID/Buyer-readiness runtime workspace.
- [ ] Reload/direct route/reset/storage migration fail closed đúng contract.
- [ ] Không có external request, fake legal claim, fake amount, fake SLA, hoặc future-live date.

## Ranh giới bằng chứng cho reviewer

- `FACT`: Static build, reducer guards, configured fixtures, browser state, local assets, and rendered behavior can be inspected directly.
- `SOURCE CLAIM`: The supplied process image and meeting statements describe a sequence from notarization through Tax and land registration.
- `PROPOSAL`: V5 Representation request/confirmation, initialized-PLID timing, HouseNow snapshot matching, record ownership, PTID timing, 357 source/reconciliation, six-event sequence, obligations, and notification timing are the current demo contract.
- `OPEN QUESTION`: Official identifiers, legal sequencing, tax/fee liability, source message schemas, authority, completion evidence, integration security, retry/SLA, retention, and production entitlements require approval.
- Dữ liệu phải synthetic/masked. Không nhập danh tính, liên hệ, tài chính, document contents, hoặc credentials thật.
