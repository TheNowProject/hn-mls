# Đánh giá khả năng adapt 357 và HouseNow cho VMLS

Ngày đánh giá: 2026-08-13

## 1. Kết luận điều hành

Hai hệ thống bổ sung cho nhau khá tốt nhưng không thể thay thế lẫn nhau:

- **357** đã có nền tảng mạnh cho lớp **pháp lý, định danh, đăng ký và giám sát nhà nước**: mã định danh BĐS, mã định danh chứng chỉ môi giới, hồ sơ pháp lý dự án, khai báo và phê duyệt giao dịch, tra cứu công khai, lịch sử vòng đời, dữ liệu tổng quan thị trường.
- **HouseNow** đã có nền tảng mạnh cho lớp **marketplace và vận hành thương mại**: hồ sơ môi giới, sàn và thành viên, tin đăng và kiểm duyệt, tìm kiếm/đề xuất, CRM lead và nhu cầu, đặt lịch tư vấn, ngân hàng và hồ sơ vay, thông báo đa kênh, dashboard quản trị.
- Khi ghép hai nền tảng, có thể tận dụng khoảng **70–75% nền móng chức năng** của phạm vi VMLS đã mô tả. Ước lượng này chấm 24 capability trong ma trận theo trọng số `Có = 1`, `Một phần = 0,5`, `Chưa có = 0`, lấy mức tốt nhất giữa hai hệ thống (xấp xỉ 71%). Nó phản ánh khả năng tái sử dụng module/data/interface, **không phải mức sẵn sàng go-live end-to-end**.
- Khoảng trống lớn nhất là **sales transaction workspace**: giỏ hàng chính thức của chủ đầu tư, bảng giá/chính sách có phiên bản, phân phối qua sàn, giữ chỗ/booking có hiệu lực, đề nghị mua, đặt cọc, chia hoa hồng, bàn giao và đối soát; cùng với **regulatory case management** cho thanh tra, cảnh báo và xử lý vi phạm.

Khuyến nghị kiến trúc: dùng **357 làm Regulatory System of Record**, **HouseNow làm Engagement & Commercial Operations Platform**, và xây thêm một lớp **VMLS orchestration** nối hai hệ thống bằng interface/API và sự kiện; không gộp trực tiếp hai database.

## 2. Cách chấm

- **● Có**: có model + interface/backend + UI hoặc route vận hành đủ rõ để tái sử dụng trực tiếp.
- **◐ Một phần**: đã có dữ liệu hoặc một đoạn workflow, nhưng thiếu actor, quy tắc nghiệp vụ hoặc vòng đời VMLS đầy đủ.
- **○ Chưa có**: không thấy module nghiệp vụ tương ứng trong source đã rà.

Đây là đánh giá tĩnh dựa trên source, schema, route, test/use-case và tài liệu trong repository; chưa phải kiểm thử UAT trên môi trường tích hợp.

## 3. Ma trận theo actor/use case VMLS

| Actor | Năng lực VMLS | 357 | HouseNow | Nhận định adapt |
|---|---|:---:|:---:|---|
| Môi giới | Hồ sơ và chứng chỉ hành nghề | ◐ | ◐ | 357 có registry/cấp mã chứng chỉ; HouseNow có hồ sơ môi giới phong phú. Ghép hai bên để tạo hồ sơ môi giới đã xác minh. |
| Môi giới | Khách hàng và nhu cầu tìm mua | ○ | ● | Tái sử dụng CRM `Lead`, `LeadInfo`, demand history, note, PIC và hành vi người dùng của HouseNow. |
| Môi giới | Tạo, cập nhật và tìm kiếm tin đăng | ○ | ● | HouseNow đã có listing CRUD, trạng thái kiểm duyệt, media, tìm kiếm, filter, boost và recommendation. Trading page của 357 chỉ là mock UI hard-coded. |
| Môi giới | Hợp tác môi giới và theo dõi giao dịch | ◐ | ◐ | HouseNow có linked agent/lead assignment/history; 357 có giao dịch chính thức. Còn thiếu co-broker agreement, deal room và chia hoa hồng. |
| Chủ đầu tư | Thông tin và pháp lý dự án | ● | ◐ | 357 nên là nguồn pháp lý chuẩn; HouseNow tái sử dụng presentation, landing page, giá thị trường và nội dung dự án. |
| Chủ đầu tư | Giỏ hàng, giá và chính sách bán | ◐ | ◐ | Cả hai có property/listing, giá và kho theo dự án nhưng chưa có master inventory thương mại cùng bảng giá/chính sách phiên bản hóa. |
| Chủ đầu tư | Sàn môi giới và kênh phân phối | ○ | ◐ | HouseNow có agency, member, `agencyIds`, `linkedAgents`; cần bổ sung hợp đồng phân phối, quota, thời hạn và phạm vi sản phẩm. |
| Chủ đầu tư | Booking, bán hàng và bàn giao | ◐ | ○ | 357 có giao dịch/hợp đồng chính thức; HouseNow chỉ có trạng thái bàn giao dạng thuộc tính, còn “giỏ hàng/booking” nằm ở demo/marketing. Thiếu reservation/deposit/order/handover workflow. |
| Sàn môi giới | Cơ cấu tổ chức và môi giới | ○ | ● | HouseNow có sàn, thành viên, vai trò, invitation và gói thành viên; 357 bổ sung xác minh chứng chỉ nhưng actor sàn hiện chỉ report-only. |
| Sàn môi giới | Kiểm duyệt tin đăng và quản lý kho | ○ | ● | HouseNow có workflow `NeedReview/NeedFix/Listed/...`, admin verification và kho listing; 357 chỉ bổ sung legal/property verification, không có listing moderation thật. |
| Sàn môi giới | Phân bổ khách tiềm năng và giao dịch | ○ | ◐ | HouseNow phân lead/PIC và theo dõi lịch sử tốt nhưng chưa có opportunity/deal pipeline cho giao dịch mua bán. |
| Sàn môi giới | Hoa hồng, tuân thủ và báo cáo | ◐ | ◐ | Có subscription/budget, một số chính sách hoa hồng vay và reporting primitives; chưa có commission ledger/rule engine và compliance case đầy đủ. |
| Ngân hàng | Sản phẩm vay mua BĐS | ○ | ● | HouseNow có bank, branch, member và `BankLoanPackage`. |
| Ngân hàng | Sơ duyệt khả năng vay và tiếp nhận hồ sơ | ○ | ● | HouseNow có `LoanRequest` với thu nhập, chi phí, dư nợ, kỳ hạn, tài sản bảo đảm và luồng tạo hồ sơ. |
| Ngân hàng | Thẩm định tài sản và phê duyệt tín dụng | ○ | ◐ | Có trạng thái `Đang thẩm định/Phê duyệt`, collateral note, PIC và RBAC; thiếu appraisal report, valuation, checklist và decision model có cấu trúc. |
| Ngân hàng | Giải ngân, đối soát và quản trị rủi ro | ○ | ◐ | Có trạng thái/số tiền/ngày giải ngân và lịch sử; thiếu đối soát, covenant, risk scoring và cảnh báo nợ. |
| Người mua | Tìm kiếm, lọc và so sánh BĐS | ◐ | ● | HouseNow đã có discovery/search/filter/recommend/save và UI so sánh dự án; 357 cung cấp badge pháp lý và tra cứu mã chuẩn. |
| Người mua | Liên hệ môi giới và đặt lịch xem BĐS | ○ | ● | HouseNow đã biến contact request thành lead, lịch tư vấn và notification cho môi giới. |
| Người mua | Đánh giá tài chính và đăng ký vay | ○ | ● | HouseNow có loan landing, dữ liệu tài chính, loan request/contract và portal theo dõi hồ sơ. |
| Người mua | Đề nghị mua, booking và theo dõi bàn giao | ○ | ○ | HouseNow mới có appointment “đặt lịch tư vấn”, không có offer/reservation/deposit/handover case; cần module mới. |
| Cơ quan quản lý | Xác minh doanh nghiệp, môi giới và chứng chỉ | ◐ | ○ | 357 mạnh ở registry chứng chỉ/mã định danh; xác minh doanh nghiệp mới là kiểm tra trong một số flow, chưa có registry/approval độc lập cho DN/sàn. |
| Cơ quan quản lý | Xác minh pháp lý dự án và BĐS | ● | ◐ | 357 đã có nguồn dự án, hồ sơ pháp lý theo loại/phiên bản, mã BĐS và public lookup. Dữ liệu HouseNow chỉ nên là bản trình bày/cache. |
| Cơ quan quản lý | Giám sát thị trường và kiểm tra tuân thủ | ◐ | ◐ | 357 có market metrics, workflow phê duyệt, lịch sử/audit; HouseNow có analytics và moderation. Thiếu rules/case management kiểm tra tuân thủ. |
| Cơ quan quản lý | Báo cáo, thanh tra và cảnh báo | ◐ | ◐ | Có report/analytics/log/notification primitives, nhưng chưa thấy hồ sơ thanh tra, vi phạm, biện pháp xử lý và cảnh báo pháp lý end-to-end. |

## 4. Những gì 357 đã thực sự có thể tái sử dụng

### 4.1 Định danh và vòng đời BĐS

Schema đã có `properties`, `property_identifiers`, declaration session/item và `property_lifecycle_records`; mã BĐS là unique và có trạng thái/cơ quan cấp. Đây là hạt nhân phù hợp để VMLS xác minh tài sản trước khi cho đăng bán hoặc booking.

Nguồn: [schema BĐS và định danh](/Users/phatnt2702/Desktop/357-cong-thong-tin/tooling/database/schema.prisma:14), [public lookup controller](/Users/phatnt2702/Desktop/357-cong-thong-tin/apps/ph3-backend/src/main/java/com/nd357/ph3/controller/PublicLookupController.java:36).

### 4.2 Chứng chỉ môi giới

Có đơn vị cấp, chứng chỉ, ngày cấp/hết hạn, trạng thái, mã định danh, thu hồi, import DVC và màn hình/API cơ quan quản lý tra cứu chi tiết. Đây là phần 357 bổ sung trực tiếp cho hồ sơ môi giới HouseNow đang thiếu.

Nguồn: [schema chứng chỉ](/Users/phatnt2702/Desktop/357-cong-thong-tin/tooling/database/schema.prisma:631), [API tra cứu chứng chỉ cho cơ quan](/Users/phatnt2702/Desktop/357-cong-thong-tin/apps/ph3-backend/src/main/java/com/nd357/ph3/controller/AgencyAgentCertificateIdentifierController.java:28).

### 4.3 Dự án và hồ sơ pháp lý

Có project code, chủ thể tham gia dự án, lịch sử dự án, danh mục loại hồ sơ pháp lý, trạng thái thiếu/đã có, current version và version history; chủ đầu tư có route upload/sync/cập nhật tiến độ.

Nguồn: [schema pháp lý dự án](/Users/phatnt2702/Desktop/357-cong-thong-tin/tooling/database/schema.prisma:447), [business project endpoints](/Users/phatnt2702/Desktop/357-cong-thong-tin/apps/ph3-backend/src/main/java/com/nd357/ph3/controller/BusinessPortalController.java:302).

### 4.4 Khai báo và phê duyệt giao dịch chính thức

Có giao dịch do chủ đầu tư/VPCC khai báo, bên mua/bên bán, BĐS trong giao dịch, routing theo tỉnh/cơ quan, người đang xử lý, approve/request change/return và history. Đây nên là ledger pháp lý cuối luồng bán hàng VMLS, không thay CRM/deal pipeline.

Nguồn: [schema giao dịch](/Users/phatnt2702/Desktop/357-cong-thong-tin/tooling/database/schema.prisma:796), [transaction endpoints](/Users/phatnt2702/Desktop/357-cong-thong-tin/apps/ph3-backend/src/main/java/com/nd357/ph3/controller/BusinessPortalController.java:90).

### 4.5 Tra cứu công khai và giám sát thị trường

Có tra cứu dự án/BĐS/hồ sơ pháp lý và danh sách mã BĐS theo filter. Khung metric thị trường đã được định nghĩa, nhưng mức dữ liệu hiện chỉ **một phần**: service DMP đang map số giao dịch, vốn đầu tư và dư nợ tín dụng; nhiều chỉ tiêu khác trả `N/A`, còn router tổng quan theo loại dự án đang dùng số hard-coded. Vì vậy có thể tái sử dụng contract/UI, chưa thể coi là regulatory analytics hoàn chỉnh.

Nguồn: [public lookup](/Users/phatnt2702/Desktop/357-cong-thong-tin/apps/ph3-backend/src/main/java/com/nd357/ph3/controller/PublicLookupController.java:36), [market metrics contract](/Users/phatnt2702/Desktop/357-cong-thong-tin/packages/domain/src/tong-quan-thi-truong.ts:8), [DMP mapping và `N/A`](/Users/phatnt2702/Desktop/357-cong-thong-tin/packages/api/src/services/public-market-overview-ctt-dmp.ts:66), [hard-coded project overview](/Users/phatnt2702/Desktop/357-cong-thong-tin/packages/api/src/orpc/routers/tong-quan-du-an.ts:116).

## 5. Những gì HouseNow đã thực sự có thể tái sử dụng

### 5.1 Marketplace, listing và kiểm duyệt

Listing có dự án/tòa/căn, chủ tin, sàn, giá, diện tích, pháp lý dạng thuộc tính, media, trạng thái, searchable/verified, boost, lịch sử và embedding. Admin có module quản lý listing; public client có search/filter/similar listing.

Nguồn: [Listing schema](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2142), [listing search router](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/listing-router.ts:529), [admin modules](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/documents/web-applications/admin-app-internal-management.md:35).

### 5.2 CRM khách hàng, nhu cầu và phân lead

Có lead gắn listing, môi giới phụ trách, trạng thái/matched, note, lịch sử nhu cầu, khoảng giá, khu vực/dự án quan tâm, thời điểm mua, nhu cầu vay, hành vi meaningful và PIC. Đây là nền CRM rất gần với VMLS.

Nguồn: [Lead/LeadInfo schema](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2513), [demand history](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2774).

### 5.3 Sàn và đội ngũ môi giới

Có `Agency`, `AgencyMember`, role admin/member, invitation/accept/remove, lịch sử, ngân sách, mua/refund subscription cho thành viên và thống kê listing thành viên.

Nguồn: [Agency schema](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:601), [agency member workflow](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/agency-member-router.ts:29).

### 5.4 Liên hệ và đặt lịch

Contact request lưu thời gian liên hệ, tạo/cập nhật lead gắn listing và môi giới, đồng thời phát notification. Đây là appointment/lead booking, chưa phải booking giữ căn.

Nguồn: [ContactRequest schema](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2393), [contact request workflow](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/node/contact-request-router.ts:18).

### 5.5 Ngân hàng và hồ sơ vay

Có bank/branch/package/member/role; loan request chứa thu nhập, chi phí, dư nợ, kỳ hạn, tài sản bảo đảm; loan contract có bank status, PIC, lịch hẹn, phê duyệt/từ chối, số tiền/ngày giải ngân, rating và history. Đây là module gần hoàn chỉnh nhất để adapt actor ngân hàng.

Nguồn: [Bank schema](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:692), [Loan schema](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3295), [business app bank operations](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/documents/web-applications/business-app-agent-dashboard.md:52).

Lưu ý: model `Transaction` hiện tại của HouseNow là thanh toán subscription/credit/IAP với `packageId`, `subscriptionName` và discount, **không phải giao dịch mua bán BĐS**. Không nên mở rộng model này thành property deal; cần bounded context riêng.

Nguồn: [HouseNow billing Transaction](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3093).

### 5.6 Search/recommendation và notification

Có full-text/filter search, saved resources, hành vi người dùng, vector recommendation; ZNS, push, SMS và Slack operational alert. Có thể tái sử dụng cho discovery, nhắc lịch, thay đổi trạng thái booking/vay và cảnh báo vận hành.

Nguồn: [recommendation design](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/documents/ai-and-vector-search/property-recommendation-with-embeddings.md:5), [notification system](/Users/phatnt2702/Desktop/HouseNow-MonoRepo/documents/core-services-and-integrations/notification-system-zns-push-sms.md:1).

## 6. Khoảng trống phải xây mới hoặc nâng cấp đáng kể

1. **Canonical identity & trust link**: ánh xạ user/org/agent/project/property giữa Firebase/HouseNow với IAM/DMP/357; cache trạng thái xác minh nhưng 357 giữ source of truth.
2. **Commercial inventory**: căn/sản phẩm có trạng thái `AVAILABLE/HELD/BOOKED/SOLD/BLOCKED/HANDED_OVER`, optimistic lock, allocation theo kênh và lịch sử thay đổi.
3. **Pricing & sales policy**: bảng giá, version/effective date, discount, payment schedule, quota, eligibility và approval.
4. **Distribution management**: hợp đồng chủ đầu tư–sàn, phạm vi dự án/sản phẩm, quota, đội nhóm, SLA và thu hồi hàng.
5. **Deal/booking/order**: offer, reservation expiry, payment/deposit, sale contract, cancellation/refund, handover checklist và buyer timeline.
6. **Commission ledger**: rule, split, trigger, accrual, approval, payout, clawback, tax và reconciliation.
7. **Structured appraisal/risk**: valuation case, evidence/checklist, LTV/DTI, credit decision, disbursement tranche, reconciliation và risk alert.
8. **Regulatory case management**: rules engine, inspection case, violation/evidence, remediation, sanction, alert, deadline và báo cáo định kỳ.
9. **Consent, privacy and audit**: purpose-based consent, field-level visibility, immutable audit, data retention và legal disclosure giữa các actor.

## 7. Kiến trúc mục tiêu đề xuất

| Bounded context/module | System of record đề xuất | Tái sử dụng chính |
|---|---|---|
| Property/project/legal registry | 357 | Mã dự án/BĐS, legal document/version, owner/participant, lifecycle |
| Broker certificate verification | 357 | Certificate/identifier/status/expiry/revocation |
| Official transaction registry | 357 | Contract parties/properties, authority routing, approval/history |
| Marketplace/listing/search | HouseNow | Listing, media, moderation, search, recommendation |
| CRM/lead/appointment | HouseNow | Lead, demand, assignment, note, contact request, notifications |
| Agency operations | HouseNow + verification từ 357 | Agency/member/role/subscription/listings |
| Loan origination portal | HouseNow, mở rộng | Bank/package/request/contract/status/history |
| Inventory/booking/sales/handover | Module VMLS mới | Orchestrate HouseNow UX với 357 verification/registration |
| Commission/distribution | Module VMLS mới | Dùng agency/member/project/listing IDs từ HouseNow |
| Regulatory supervision | Mở rộng 357 | Market metrics + case/rules/alerts/reports mới |

### Interface tích hợp tối thiểu

- `verifyAgent(certificateNumber | personalIdentifier)` → trạng thái, hạn, mã định danh, đơn vị cấp.
- `verifyProperty(propertyIdentifierCode)` → dự án, loại, legal/business eligibility, trạng thái vòng đời.
- `getProjectLegalStatus(projectCode)` → checklist hồ sơ và current version.
- `registerOfficialTransaction(saleContract)` → transaction ID, workflow status, authority routing.
- Event từ 357: `AgentCertificateStatusChanged`, `PropertyLegalStatusChanged`, `ProjectLegalDocumentChanged`, `OfficialTransactionStatusChanged`.
- Event từ HouseNow/VMLS: `ListingSubmitted`, `LeadAssigned`, `ReservationCreated/Expired`, `DepositConfirmed/Refunded`, `LoanStatusChanged`, `HandoverCompleted`.

Nguyên tắc quan trọng: HouseNow chỉ lưu `verification_snapshot` để hiển thị nhanh; mọi quyết định pháp lý phải gọi hoặc đối soát lại 357. Ngược lại, 357 chỉ nhận dữ liệu thương mại khi một mốc pháp lý cần đăng ký, không nhận toàn bộ hành vi marketplace/CRM.

## 8. Lộ trình khuyến nghị

### Giai đoạn 1 — Trust-enabled marketplace

- Liên kết mã dự án/BĐS và chứng chỉ môi giới 357 vào HouseNow.
- Badge đã xác minh, chặn publish nếu pháp lý không đạt rule.
- Đồng bộ legal status và audit mọi lần tra cứu.
- Giữ nguyên listing/search/CRM/loan/contact của HouseNow.

### Giai đoạn 2 — Chủ đầu tư, sàn và booking

- Xây commercial inventory, price/policy, distribution/quota.
- Xây booking giữ căn có expiry/concurrency, deposit và deal pipeline.
- Bổ sung co-broker và commission ledger.

### Giai đoạn 3 — Closed-loop transaction và quản lý nhà nước

- Đẩy hợp đồng bán đủ điều kiện sang 357 để đăng ký/phê duyệt.
- Đồng bộ trạng thái pháp lý về buyer/agent/investor timeline.
- Xây handover, bank reconciliation/risk và regulatory case/inspection/alert.
- Data mart/báo cáo liên ngành dựa trên event và canonical IDs.

## 9. Quyết định nên chốt sớm

1. VMLS có phải sản phẩm thống nhất về UX nhưng federated về dữ liệu hay không — khuyến nghị **có**.
2. `property_identifier_code`, `project_code`, `agent_certificate_identifier` có được chọn làm khóa tham chiếu pháp lý xuyên hệ thống hay không — khuyến nghị **có**, kèm surrogate ID nội bộ.
3. Booking trong VMLS là chỉ “đặt lịch tư vấn/xem nhà” hay “giữ quyền mua một sản phẩm” — hai khái niệm phải tách thành `Appointment` và `Reservation`.
4. “Giao dịch” phải tách thành `Commercial Deal/Sale Order` ở VMLS/HouseNow và `Official Real-estate Transaction` ở 357.
5. Ai có quyền công bố/cập nhật pháp lý và ai chỉ được hiển thị lại — 357 là authority; HouseNow/VMLS là consumer có kiểm soát.
