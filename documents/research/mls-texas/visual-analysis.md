# Phân tích hình ảnh video `screen-capture (34).webm`

## Kết luận ngắn

Video là một buổi demo/chia sẻ màn hình qua Microsoft Teams về hệ sinh thái MLS bất động sản tại Texas. Người trình bày dùng Safari trên iPad, đi theo luồng:

**Teams → cổng ứng dụng NTREIS/Clareity → Matrix MLS → Cloud CMA → báo cáo CMA dạng live/PDF → quay lại Teams.**

Hình ảnh cung cấp bằng chứng khá rõ về cấu trúc sản phẩm, chức năng, dữ liệu và quy tắc nghiệp vụ. Tuy nhiên, video **không hiển thị IDE, repository, file tree, source code, terminal, sơ đồ kiến trúc, API, database hay hạ tầng triển khai**. Vì vậy, có thể BA hệ thống ở mức nghiệp vụ/product modules, nhưng không thể kết luận ngôn ngữ lập trình, cấu trúc thư mục, backend, database hoặc kiến trúc monolith/microservices.

## Phương pháp và phạm vi kiểm tra

- Độ dài thực tế đọc từ timestamp video: khoảng **01:08:05**.
- Đã trích **409 frame, mỗi 10 giây**, trải đều từ đầu đến cuối.
- Đã kiểm tra trực tiếp toàn bộ **26 contact sheet** (16 frame/sheet, thứ tự trái→phải, trên→dưới).
- Sau khi xác định các màn hình ổn định, đã quay lại video và trích **24 frame chọn lọc độ phân giải cao**; phần chia sẻ iPad được crop ra khỏi cột người tham dự Teams để chữ rõ hơn.
- OCR chọn lọc được chạy trên các màn hình chứa menu, biểu mẫu, quy tắc trạng thái và workflow CMA. Không OCR/transcribe phần audio trong tài liệu này.
- Màn hình đăng nhập có lúc xuất hiện giá trị trong ô tài khoản/mật khẩu; frame đó không được đưa vào bộ chọn lọc và không OCR thông tin đăng nhập.

Artifacts:

- Bộ frame chọn lọc: [`frames/selected/`](./frames/selected/)
- Contact sheet toàn video: [`contact-sheets/`](./contact-sheets/)
- Mẫu 10 giây: đã được duyệt để tạo báo cáo nhưng không đưa vào gói bàn giao; dùng 24 keyframe và 26 contact sheet ở trên làm evidence chia sẻ.

## Timeline hình ảnh

| Thời gian | Nội dung có bằng chứng hình ảnh |
|---|---|
| 00:00–~01:50 | Microsoft Teams, 4 người tham dự; chưa chia sẻ ứng dụng nghiệp vụ. |
| ~01:50–02:40 | Bắt đầu share iPad, mở/đăng nhập cổng `ntreis.clareity.net`, có các trạng thái loading. |
| 02:40–07:40 | Trang chủ NTREIS Applications and Services; duyệt danh mục ứng dụng và đối tác. |
| 07:40–20:40 | Matrix: dashboard, tìm listing theo địa chỉ, bảng kết quả, chi tiết listing, ảnh, lịch sử giao dịch/tài chính. |
| 20:40–28:40 | Matrix: My Listings, sửa listing, thêm property, form nhiều tab, kiểm tra/submit listing. |
| 28:40–32:00 | Quy tắc trạng thái listing, các loại search, finance/report menus và On Demand Reports. |
| 32:00–47:00 | Tiếp tục duyệt My Listings, record detail, menu và dữ liệu listing; không có source code. |
| 47:00–58:50 | Cloud CMA: recent reports → criteria → lấy comparable → chọn listing → customize → publish → xem report. |
| ~58:50–59:50 | Quay lại danh mục ứng dụng NTREIS. |
| ~59:50–01:08:05 | Quay lại giao diện Teams để trao đổi; không còn thao tác hệ thống đáng kể. |

Các mốc trên là thời gian elapsed của video, làm tròn theo frame ổn định gần nhất.

## Keyframes và ý nghĩa bằng chứng

| Mốc | Frame | Bằng chứng chính |
|---|---|---|
| 01:00 | [Teams meeting](./frames/selected/01m00s_teams-meeting.jpg) | Ngữ cảnh buổi họp/chia sẻ màn hình, không phải video quay trực tiếp một app standalone. |
| 02:40 | [NTREIS home](./frames/selected/02m40s_ntreis-home.jpg) | Cổng ứng dụng trung tâm; Matrix, Paragon, Tax, Trends, Learning Lab, Cloud MLX/CMA/Streams, Transaction Desk, Pro Search. |
| 07:40 | [Matrix dashboard](./frames/selected/07m40s_matrix-home.jpg) | Navigation chính, search widget, Hot Sheets, favorites, Market Watch và external links. |
| 08:50 | [Search results](./frames/selected/08m50s_search-results.jpg) | Một địa chỉ trả về nhiều record/listing theo status Active/Expired/Closed và các thuộc tính MLS. |
| 10:40 | [Listing detail](./frames/selected/10m40s_listing-detail.jpg) | Chi tiết listing, tab nghiệp vụ, ảnh, giá, diện tích, property/parcel/HOA và action bar. |
| 11:40 | [Listing photos](./frames/selected/11m40s_listing-photos.jpg) | Bộ ảnh thuộc listing, phân trang cùng record. |
| 12:20 | [Public-record history](./frames/selected/12m20s_sale-history.jpg) | Sale History, Mortgage History, Foreclosure History cùng một property. |
| 20:40 | [My Listings](./frames/selected/20m40s_my-listings.jpg) | Danh sách listing do agent quản lý; có cả sale và lease record. |
| 24:00 | [Property edit form](./frames/selected/24m00s_property-edit-form.jpg) | Form nhập listing nhiều nhóm trường/tabs; một số trường được tô vàng. |
| 26:00 | [Add property via tax](./frames/selected/26m00s_add-property-tax-search.jpg) | Tạo property bằng cách tìm pre-existing tax record với điều kiện input rõ ràng. |
| 26:40 | [Add property form](./frames/selected/26m40s_add-property-form.jpg) | Form Residential, các nhóm Property Info, Location/Schools, Rooms, Features, Financial, HOA, Showing, Remarks, Status... |
| 28:40 | [Listing status rules](./frames/selected/28m40s_listing-status-rules.jpg) | Quy tắc Incoming/Active, validation và các nút Save as Incomplete/Validate/Submit. |
| 30:40 | [Search categories](./frames/selected/30m40s_search-categories.jpg) | Các domain search: Residential, Income, Land, Commercial, Lease, Cross Property, Public Record. |
| 32:00 | [On Demand Reports](./frames/selected/32m00s_on-demand-reports.jpg) | Agent/Office Market Share và Agent Production & Inventory reports. |
| 47:00 | [Cloud CMA dashboard](./frames/selected/47m00s_cloud-cma-dashboard.jpg) | Recent Reports và entry point Create New Report. |
| 47:30 | [Create CMA — subject](./frames/selected/47m30s_create-cma-subject.jpg) | Wizard Criteria → Listings → Customize → Publish; title/private notes/subject property. |
| 49:00 | [Comparable selection method](./frames/selected/49m00s_comparable-selection-method.jpg) | Hai cách lấy comps: exact MLS numbers hoặc proximity với số lượng/lookback. |
| 50:00 | [Comparables map](./frames/selected/50m00s_comparables-map.jpg) | Subject property, bản đồ, Active/Sold và thống kê giá. |
| 51:00 | [Comparable list](./frames/selected/51m00s_comparable-list.jpg) | Include/exclude comparable, status, price và summary low/median/average/high. |
| 55:00 | [Customize CMA chapters](./frames/selected/55m00s_customize-cma-chapters.jpg) | Chọn/bỏ chương report: listings, analysis, pricing, closing, testimonials... |
| 55:40 | [Publish CMA](./frames/selected/55m40s_publish-cma.jpg) | View PDF/View Live; Email Report/Copy PDF Link/Copy Live Link. |
| 56:00 | [CMA report cover](./frames/selected/56m00s_cma-report-cover.jpg) | Report Comparative Market Analysis đã sinh, hiển thị 1/11 trang. |
| 58:00 | [Average price per sq ft](./frames/selected/58m00s_cma-average-price.jpg) | Trang phân tích đầu ra; số liệu `$209/sq ft` là dữ liệu của demo, không phải hằng số nghiệp vụ. |
| 58:50 | [NTREIS app catalog](./frames/selected/58m50s_ntreis-app-catalog.jpg) | Xác nhận Cloud CMA chỉ là một app trong catalog NTREIS rộng hơn. |

## Cấu trúc sản phẩm có thể xác nhận từ hình ảnh

### 1. Lớp truy cập và điều phối

- **Microsoft Teams** là kênh họp/screen-sharing; không phải thành phần nghiệp vụ MLS.
- **Safari trên iPad** là client được dùng trong demo.
- **NTREIS/Clareity portal** là hub đăng nhập/danh mục ứng dụng. Portal có search apps, messaging/notification/app-grid và membership dues.
- Việc các ứng dụng mở ở domain/tab khác nhau cho thấy đây là một hệ sinh thái nhiều web app được liên kết. Hình ảnh chưa đủ để khẳng định cơ chế SSO, API gateway hay kiến trúc service phía sau.

### 2. Matrix — hệ thống MLS lõi được demo

Navigation nhìn thấy trực tiếp:

- `MY MATRIX`
- `SEARCH`
- `STATS`
- `ROSTER`
- `TAX`
- `FINANCE`
- `LINKS`
- `MARKET REPORTS`
- `MORE`

Dashboard gồm News & Alerts, Hot Sheets theo loại property, Favorite Searches, quick search, MLS-Touch promotion, Market Watch và External Links. Đây là bằng chứng cho thấy Matrix vừa là hệ thống tra cứu/listing management, vừa là điểm điều phối sang nhiều công cụ bổ trợ.

### 3. Listing/search domain trong Matrix

Các entity/khái niệm thấy rõ:

- `Property` và `Parcel/Tax record`
- `MLS Listing` với MLS number, property type/subtype, status, list/current/closed price
- `Agent`, `Listing Agent`, `Listing Office`, broker/office data
- Address, subdivision, county, school district, HOA, beds/baths, area, lot, year built
- Photos, supplements, virtual tour, showing information
- Sale, mortgage và foreclosure history
- Search criteria, saved/favorite search, result set

Một property/address có thể có nhiều listing record theo thời gian và/hoặc loại giao dịch; bảng demo cùng một địa chỉ có Active, Expired và Closed. My Listings cũng cho thấy cùng một địa chỉ có sale (`RESI`) và lease (`RLSE`) record riêng.

### 4. Listing input/maintenance

Màn hình sửa/thêm listing được chia thành các tab:

- Property Info
- Location/Schools
- Rooms
- Features
- Lot Info
- Utilities
- Environment
- Financial
- HOA
- Agent/Office
- Showing
- Remarks
- Condo Info
- Farm & Ranch
- Status

Modify Property cung cấp các action nhìn thấy trực tiếp: đổi sang Active Contingent, Active Option Contract, Pending, Active Kick Out, Closed, Hold; sửa price, open house, virtual tour/URL; quản lý photos, documents qua TransactionDesk, Property Panorama, Listing Data Checker, ShowingTime và BrokerBay.

Đây là danh sách action khả dụng trên UI, **chưa phải bằng chứng về toàn bộ state machine hay quyền của mọi role**.

### 5. Reporting/finance trong Matrix

Các chức năng thấy trên menu/frame:

- Seller's Estimated Net Proceeds
- Buyer's Closing Costs
- New Calculators
- Agent Market Share / Office Market Share
- Agent/Office Market Share by Listed
- Agent Production and Inventory

Video không đi đủ sâu để xác định công thức tính, nguồn dữ liệu hay lịch chạy report.

### 6. Cloud CMA — tạo Comparative Market Analysis

Cloud CMA là app riêng tại `cloudcma.com`, được mở từ hệ sinh thái NTREIS/Matrix. Workflow thể hiện trực tiếp trên UI:

1. **Criteria** — đặt tên report, private notes, subject property (address, beds, baths, sq ft, property type/subtype, cover photo, advanced info).
2. **Listings** — lấy comparable bằng exact MLS numbers hoặc tự động theo proximity/lookback; xem map, status và price summary; include/exclude listing; mở notes & adjustments.
3. **Customize** — cấu hình cover/theme/layout/font và chọn các chương/trang report.
4. **Publish** — sinh bản live/PDF, email report hoặc copy link.

Nội dung report quan sát được gồm title/map, summary of comparable properties, listing detail/photos, comparable statistics, sold property analysis, suggested list price và average price per square foot. Ngoài ra thư viện nội dung còn có analysis, seller net sheet, closing, marketing, testimonials và các phần premium.

## OCR chọn lọc — thông tin nghiệp vụ quan trọng

### Quy tắc tạo listing và trạng thái

Frame [28:40](./frames/selected/28m40s_listing-status-rules.jpg) nêu rõ:

- Listing mới có thể submit ở trạng thái **Active** hoặc **Incoming**.
- Active phải đáp ứng toàn bộ input rules và sau khi submit sẽ khả dụng cho mọi người trong hệ thống.
- Incoming được cấp MLS number nhưng chưa hiển thị cho mọi người.
- Incoming vẫn có thể thêm photos/supplements và chạy reports.
- Khi Incoming được điền đầy đủ và đổi sang Active, listing mới hiển thị rộng rãi.
- Active chỉ được submit nếu vượt qua toàn bộ input rules.

UI tương ứng có `Save as Incomplete`, `Validate`, `Cancel Input`, `Submit Property`. Đây là bằng chứng trực tiếp cho workflow draft/incoming → validate → active/publish.

### Quy tắc tìm tax record khi thêm property

Frame [26:00](./frames/selected/26m00s_add-property-tax-search.jpg) ghi:

- Phải chọn **County** và ít nhất một trong các nhóm: **Tax ID**, hoặc **Street Number + Street Name**, hoặc **Owner Last Name**.
- Giá trị phải nhập exact.

Điều này cho thấy hệ thống hỗ trợ prefill listing từ tax/public record, bên cạnh việc fill từ existing listing hoặc bắt đầu blank property.

### Cách chọn comparable trong Cloud CMA

Frame [49:00](./frames/selected/49m00s_comparable-selection-method.jpg) cho hai lựa chọn:

- **Exact Listings**: nhập MLS numbers đã chọn trước.
- **Quick and Dirty / by Proximity**: tự động lấy listing gần subject property, đặt tối thiểu số listing, giới hạn lookback cho off-market và có `More Criteria`.

UI còn khuyến nghị lấy nhiều candidates hơn cần thiết rồi lọc ở bước tiếp theo. Sau khi fetch, agent quyết định include/exclude từng comp; vì vậy kết quả CMA không hoàn toàn là output tự động không kiểm soát.

### Publish/output CMA

Frame [55:40](./frames/selected/55m40s_publish-cma.jpg) xác nhận đầu ra gồm `View PDF`, `View Live`, `Email Report`, `Copy PDF Link`, `Copy Live Link`. Report trong demo có 11 trang; đó là cấu hình của report mẫu, không nhất thiết là số trang cố định.

## BA — mô hình nghiệp vụ rút ra từ visual

### Actors/stakeholders

- MLS member/real-estate agent (người thao tác chính)
- Listing agent và listing office/broker
- Buyer/seller và buyer agent
- MLS/association administrator
- Data providers và ứng dụng đối tác (tax/public records, showing, transaction documents, syndication, CMA)
- Recipient của report CMA (client/prospect)

### Luồng nghiệp vụ chính

#### A. Tra cứu và đánh giá property/listing

1. Agent đăng nhập portal và mở Matrix.
2. Tìm theo MLS/address/criteria hoặc dùng hot sheet/favorite search.
3. Xem result set và phân biệt nhiều listing status/transaction record.
4. Mở full listing, photos, tax/history/parcel/flood/foreclosure/supplements.
5. Thực hiện action tiếp theo: email, print, share, directions, stats, export, CMA/Quick CMA/Cloud CMA hoặc tích hợp showing/transaction.

#### B. Tạo và quản lý listing

1. Tạo từ existing listing, tax record hoặc blank property.
2. Điền dữ liệu theo các tab domain.
3. Lưu incomplete hoặc validate.
4. Submit Incoming/Active theo quy tắc; Active phải pass input rules.
5. Bổ sung ảnh/supplement, quản lý showing/documents.
6. Thay đổi status/price/open house theo vòng đời listing.

#### C. Tạo CMA cho khách hàng

1. Chọn subject property và đặt metadata report.
2. Fetch comps theo MLS IDs hoặc proximity/criteria.
3. Agent review include/exclude, xem map và price summary, thêm adjustment/note.
4. Chọn nội dung/chapter và presentation settings.
5. Publish, xem live/PDF và chia sẻ qua email/link.

### Business rules đã có bằng chứng

- Một Incoming listing được cấp MLS number nhưng không public toàn hệ thống.
- Active listing phải pass input rules trước khi submit/public.
- Incoming vẫn có thể chứa photos/supplements và chạy report.
- Tìm tax record bắt buộc County + một identifier hợp lệ, exact-match.
- Comparable có thể do agent chỉ định bằng MLS number hoặc hệ thống gợi ý theo proximity/lookback.
- Agent có bước review include/exclude comp trước khi tạo report.

### Những điểm chỉ là suy luận hợp lý, chưa phải fact kỹ thuật

- Portal nhiều khả năng làm identity/app-launch hub, nhưng video không chứng minh protocol SSO.
- Matrix là source nghiệp vụ chính trong demo và Cloud CMA tiêu thụ listing data, nhưng video không cho biết dữ liệu truyền bằng API, deep link, export hay cơ chế khác.
- Các domain/tab riêng cho thấy nhiều sản phẩm, nhưng không đủ để gọi đây là microservice architecture.
- Các field tô vàng có vẻ là field cần chú ý/editable; không có legend nên không khẳng định tất cả đều mandatory.

## Product structure nhìn từ góc BA

```text
Access / session
├── Microsoft Teams (meeting + screen share)
├── iPad Safari
└── NTREIS / Clareity portal (app catalog + membership)
    ├── Matrix MLS
    │   ├── Dashboard / alerts / market watch
    │   ├── Search / result set / saved searches
    │   ├── Listing detail / photos / history
    │   ├── My Listings / input / status lifecycle
    │   ├── Tax / public record
    │   ├── Finance / stats / market reports
    │   └── Actions + partner integrations
    ├── Cloud CMA
    │   ├── Report criteria / subject property
    │   ├── Comparable discovery & selection
    │   ├── Content customization
    │   └── Live/PDF/email/link publishing
    └── Other catalog apps/integrations
        ├── Paragon / Trends / Learning Lab
        ├── Cloud MLX / Cloud Streams / MLS-Touch
        ├── TransactionDesk / ShowingTime / BrokerBay
        └── Tax, syndication, RPR, Realtor.com Pro, etc.
```

Sơ đồ trên là **module map theo giao diện**, không phải deployment diagram.

## Quan sát UX từ hình ảnh

- Matrix mang layout desktop nhiều cột/bảng và được chạy trong viewport iPad; chữ và action bar khá dày.
- iOS text-selection/context menu và keyboard nhiều lần che nội dung form. Đây là bằng chứng về thao tác touch có ma sát, chưa đủ để kết luận lỗi chức năng.
- Form listing rất dài nhưng được chia tab theo domain; giúp nhóm dữ liệu, đồng thời tạo nguy cơ bỏ sót field giữa các tab.
- Cloud CMA có wizard 4 bước rõ hơn về tiến trình, nhưng danh sách comparable và thư viện chapter vẫn dài, cần scroll nhiều.
- Demo qua Teams làm viewport share nhỏ hơn và có thể ảnh hưởng cảm nhận tốc độ/loading; không nên dùng video này để đo performance chính xác.

## Câu hỏi BA/technical discovery còn mở

1. Role/permission nào được search, create, edit, change status, publish listing và xem dữ liệu nhạy cảm?
2. Validation rules đầy đủ theo property type/status là gì; rule nào client-side/server-side?
3. State machine chính thức của listing, điều kiện và audit trail cho từng transition?
4. Source of truth cho property, parcel/tax, listing, public-record history và độ trễ đồng bộ?
5. Matrix truyền subject/comparables sang Cloud CMA bằng cách nào; mapping field và xử lý lỗi/duplicate ra sao?
6. Thuật toán proximity/comparable ranking và cách lưu manual adjustments?
7. CMA có versioning, approval, branding template và audit đối với report đã gửi không?
8. PII/contact/financial/foreclosure data được phân quyền, log và retention như thế nào?
9. Khi partner app (TransactionDesk, ShowingTime, BrokerBay, Cloud CMA) lỗi/session hết hạn, workflow phục hồi ra sao?
10. Yêu cầu responsive/accessibility chính thức cho tablet là gì?

## Giới hạn kết luận về “cấu trúc project”

Không có frame nào trong 409 mẫu cho thấy:

- repository hoặc file/folder tree;
- code, config, package/dependency;
- API request/response;
- database schema;
- deployment/infrastructure;
- UML/architecture diagram.

Do đó, tài liệu này mô tả **cấu trúc sản phẩm và nghiệp vụ có bằng chứng trực quan**. Muốn phân tích codebase thật sự cần thêm repository, technical docs hoặc một video walkthrough IDE/devtools. Bất kỳ khẳng định nào về stack/architecture từ video hiện tại đều là suy đoán không đáng tin cậy.
