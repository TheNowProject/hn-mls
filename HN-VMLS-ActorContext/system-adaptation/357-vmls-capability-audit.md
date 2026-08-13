# Đánh giá khả năng adapt 357 cho VMLS

## 1. Phạm vi và cách đọc kết quả

- Codebase được khảo sát read-only: `/Users/phatnt2702/Desktop/357-cong-thong-tin`.
- Đối chiếu theo 6 actor VMLS: Môi giới, Chủ đầu tư, Sàn, Ngân hàng, Người mua, Cơ quan quản lý.
- `Implemented`: có code thực thi và interface nối tới backend/data source. `Partial`: chỉ đáp ứng một phần use case, hoặc còn thiếu một mắt xích quan trọng. `Mock/docs-only`: dữ liệu tĩnh, UI chưa được route/backend hóa, hoặc chỉ có tài liệu test/use case.
- Đây là audit capability từ source, không phải xác nhận production/UAT. Repo có nhiều tài liệu regression rất chi tiết nhưng chúng không tự động chứng minh hệ thống đã chạy pass E2E.

## 2. Kết luận điều hành

357 phù hợp nhất để làm **trust/regulatory backbone** cho VMLS, không phải để bê nguyên thành marketplace/CRM. Tài sản có thể tái sử dụng mạnh gồm:

1. định danh BĐS và chứng chỉ môi giới;
2. hồ sơ dự án, pháp lý, tồn kho/sản phẩm và lịch sử;
3. khai báo giao dịch nhiều bên, routing, yêu cầu sửa và phê duyệt;
4. tra cứu công khai dự án/BĐS, RBAC, CAPTCHA, audit và ingestion dữ liệu nhà nước;
5. thống kê thị trường ở mức khung và một phần dữ liệu thật.

Khoảng trống lớn so với VMLS là CRM/lead, listing lifecycle thực, hợp tác/commission, channel allocation, loan origination, buyer appointment/offer/booking/handover và inspection/alert case management. 357 hiện không có domain model hay backend workflow đủ cho các phần này.

| Actor VMLS | Mức phù hợp tổng quát | Capability 357 có thể adapt ngay | Khoảng trống chính |
|---|---|---|---|
| Môi giới | Thấp–trung bình | Hồ sơ/chứng chỉ và tra cứu tính hợp lệ | CRM nhu cầu, listing, hợp tác, giao dịch/hoa hồng theo môi giới |
| Chủ đầu tư | Cao cho quản trị dự án/giao dịch | Pháp lý, giỏ BĐS, khai báo/cấp mã, giao dịch, tiến độ | Giá/chính sách, kênh phân phối, booking, bán hàng và bàn giao |
| Sàn | Thấp | IAM/report redirect; có thể dùng chung transaction/audit primitives | Tổ chức môi giới, duyệt tin/kho, lead allocation, commission/compliance vận hành |
| Ngân hàng | Rất thấp | Chỉ có chỉ số dư nợ và metadata pháp lý bảo lãnh | Toàn bộ LOS: sản phẩm vay, prequal, hồ sơ, thẩm định, approval, giải ngân, đối soát, risk |
| Người mua | Trung bình cho discovery/trust | Search/detail dự án/BĐS/pháp lý, lịch sử giao dịch | Compare, contact/appointment, finance/loan, offer/booking/handover |
| Cơ quan quản lý | Cao | Chứng chỉ, định danh BĐS, pháp lý, workflow duyệt, scope/RBAC/audit/report | Verify DN độc lập, inspection case/alert/remediation và compliance rules engine tổng quát |

## 3. Ma trận theo actor/use case

### 3.1 Môi giới

| Use case VMLS | Trạng thái 357 | Bằng chứng và đánh giá |
|---|---|---|
| Hồ sơ/chứng chỉ | **Implemented, nhưng phía cơ quan quản lý** | Backend hỗ trợ lookup theo CCCD, validate số chứng chỉ, cấp mã định danh và chống trùng/chứng chỉ đang còn hiệu lực (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/Ph2AgentCertificateIdentifierService.java:52-99`, `:146-180`). Cơ quan quản lý có list/filter/detail theo tỉnh và mask dữ liệu nhạy cảm (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/AgencyAgentCertificateIdentifierService.java:40-106`, `:114-141`). UI khai báo/import gọi API issue thật (`apps/ph3-website/src/app/components/AgencyBrokerIdentifierCodeDeclarationPage.tsx:998-1021`, `:1108-1134`). Có thể adapt thành broker credential registry/verification; chưa có self-service profile, affiliation, rating hoặc compliance hồ sơ môi giới. |
| CRM nhu cầu | **Chưa có** | Không thấy entity/interface cho lead, customer need, pipeline, activity hoặc assignment tới môi giới. `property_users` chỉ lưu người/chủ thể liên quan BĐS, không phải CRM (`tooling/database/schema.prisma:88-108`). |
| Listing | **Mock, không phải capability** | `TradingPage` dùng hằng `LISTINGS`, filter và favorite chỉ ở state React (`packages/ui/src/components/public/InnerPages.tsx:1295-1372`, `:1374-1478`). Không có route sử dụng `TradingPage`, API contract hay persistence listing. |
| Hợp tác/giao dịch | **Partial** | Transaction core lưu bên bán/bên mua, BĐS, giá trị, workflow và history (`tooling/database/schema.prisma:826-935`) nhưng không mô hình hóa broker/agency participation, co-broker, referral, split/hoa hồng hoặc deal room. Có thể tái dùng transaction primitives, không thể coi là broker transaction module hoàn chỉnh. |

### 3.2 Chủ đầu tư

| Use case VMLS | Trạng thái 357 | Bằng chứng và đánh giá |
|---|---|---|
| Pháp lý dự án | **Implemented** | Contract có hồ sơ pháp lý, file, version (`packages/domain/src/orpc-contract/doanh-nghiep.ts:82-95`, `:114-128`). UI upload multipart và cập nhật trạng thái tài liệu thật (`apps/ph3-website/src/app/components/ProjectLegalInformationTab.tsx:420-487`). Backend cung cấp detail, history, file, upload, sync (`apps/ph3-backend/src/main/java/com/nd357/ph3/controller/BusinessPortalController.java:302-430`). DB lưu loại tài liệu, trạng thái, version và storage metadata (`tooling/database/schema.prisma:470-535`). Đây là capability tái dùng cao. |
| Giỏ/giá/chính sách | **Partial** | Có inventory BĐS đủ điều kiện/chờ cấp mã, filter theo công trình/loại/diện tích và dữ liệu transaction value (`packages/domain/src/orpc-contract/doanh-nghiep.ts:97-112`, `:148-170`, `:251-264`). Có cấp mã BĐS, draft, validate uniqueness (`apps/ph3-website/src/app/components/BusinessFuturePropertyDeclarationPage.tsx:1609-1669`). Tuy nhiên không có price book, versioned sales policy, promotion, quota/hold/availability state dùng cho sales. |
| Kênh phân phối | **Chưa có** | Không có entity/interface cho distribution channel, agency agreement, broker roster, allocation hay inventory permission theo channel. Backend còn chủ động từ chối đơn vị sàn truy cập quản lý dự án; test xác nhận chỉ chủ đầu tư được phép (`apps/ph3-backend/src/test/java/com/nd357/ph3/service/BusinessPortalServiceTests.java:3159-3168`). |
| Booking/bán/bàn giao | **Partial, thiên về báo cáo giao dịch pháp lý** | UI tạo giao dịch và gửi payload thực (`apps/ph3-website/src/app/components/BusinessTransactionDeclarationPage.tsx:2982-3014`). Backend lưu hợp đồng, bên mua/bán, BĐS, chuyển nhượng và đưa vào workflow cơ quan (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/BusinessPortalService.java:3130-3164`). Không có booking/hold/deposit/payment schedule, sales order, cancellation/refund, milestone bàn giao/defect/warranty. |

### 3.3 Sàn giao dịch

| Use case VMLS | Trạng thái 357 | Bằng chứng và đánh giá |
|---|---|---|
| Tổ chức/môi giới | **Partial rất thấp** | IAM nhận biết `SAN_GIAO_DICH_BAT_DONG_SAN` và tổ chức môi giới nhưng phân loại là `report-only` (`apps/ph3-website/src/auth.test.ts:58-75`; logic tại `apps/ph3-website/src/auth.ts:119-145`). Không có roster, team, branch, affiliation hay credential assignment. |
| Duyệt tin/kho | **Mock/chưa có** | Trading UI là dữ liệu tĩnh, không route/backend (`packages/ui/src/components/public/InnerPages.tsx:1295-1478`). Inventory định danh của chủ đầu tư có thể làm source of truth, nhưng chưa có listing moderation/publish/unpublish/quality workflow. |
| Phân bổ lead/giao dịch | **Chưa có** | Transaction có `current_assigned_org/user` và province routing cho cơ quan nhà nước (`tooling/database/schema.prisma:826-859`; `apps/ph3-backend/src/main/java/com/nd357/ph3/service/TransactionRoutingUnitService.java:28-50`), nhưng đó là assignment xử lý tuân thủ, không phải lead routing/sales allocation. |
| Hoa hồng/tuân thủ/báo cáo | **Partial** | Không có commission ledger, formula, approval/payout/clawback. Có audit registry cho các mutation nghiệp vụ (`apps/ph3-backend/src/main/java/com/nd357/ph3/observability/ApiOperationRegistry.java:97-180`) và link báo cáo ra DMP (`apps/ph3-website/src/server/auth-session.ts:290-297`), nên có thể tái dùng audit/report integration, không phải back-office sàn. |

### 3.4 Ngân hàng

| Use case VMLS | Trạng thái 357 | Bằng chứng và đánh giá |
|---|---|---|
| Sản phẩm vay | **Chưa có** | Không có loan product, rate, term, collateral policy hay eligibility model. |
| Prequal/hồ sơ | **Chưa có** | Không có borrower profile, income, KYC/consent, application hoặc document checklist cho khoản vay. |
| Thẩm định/phê duyệt | **Chưa có** | Workflow approve hiện là giao dịch BĐS của cơ quan quản lý, không phải credit underwriting. |
| Giải ngân/đối soát/rủi ro | **Chưa có; chỉ có analytics input** | Market overview đọc chỉ số `Tổng dư nợ tín dụng` từ DMP (`packages/api/src/services/public-market-overview-ctt-dmp.ts:66-80`, `:99-106`). Đây là số liệu tổng hợp, không có khoản vay/giải ngân/repayment/reconciliation/risk. Catalog pháp luật có nội dung bảo lãnh ngân hàng nhưng là metadata tĩnh (`packages/api/src/services/public-legal-documents.ts:410-416`), không phải bank workflow. |

### 3.5 Người mua

| Use case VMLS | Trạng thái 357 | Bằng chứng và đánh giá |
|---|---|---|
| Search/compare | **Implemented cho search; compare chưa có** | Public contract hỗ trợ lookup mã, detail dự án, danh sách BĐS có filter/page, detail BĐS và lịch sử giao dịch (`packages/domain/src/orpc-contract/tra-cuu-cong-khai.ts:4-15`, `:56-99`, `:123-134`, `:255-306`). UI chọn authenticated/public client và thực hiện lookup/detail (`apps/ph3-website/src/app/PublicRoutePage.tsx:303-447`). Có thể làm trusted discovery source; không có shortlist/compare engine và search catalog theo nhu cầu marketplace. |
| Contact/appointment | **Chưa có** | Không có contact request, messaging, broker matching, calendar/appointment hoặc viewing record. |
| Financial/loan | **Chưa có** | Không có calculator/affordability/prequal/application; chỉ có chỉ số thị trường tổng hợp. |
| Offer/booking/handover | **Chưa có trực tiếp** | Buyer chỉ xuất hiện như transaction party (`tooling/database/schema.prisma:894-910`); không có buyer portal, offer negotiation, booking/deposit, payment milestones hay handover. Public property detail có lịch sử giao dịch và tình trạng kinh doanh (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/PublicLookupService.java:577-627`), hữu ích cho due diligence. |

### 3.6 Cơ quan quản lý

| Use case VMLS | Trạng thái 357 | Bằng chứng và đánh giá |
|---|---|---|
| Verify DN/môi giới/chứng chỉ | **Implemented mạnh cho chứng chỉ; partial cho DN** | Chứng chỉ có lookup/validate/issue và uniqueness (`apps/ph3-backend/src/main/java/com/nd357/ph3/controller/Ph2AgentCertificateIdentifierController.java:20-49`; service `Ph2AgentCertificateIdentifierService.java:52-99`). Mã tổ chức chủ đầu tư được đối chiếu với DMP trong flow khai báo BĐS (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/DvcFuturePropertyFileProcessor.java:209-258`). Chưa thấy registry/search/approval độc lập cho doanh nghiệp/sàn. |
| Legal project/property | **Implemented** | Có public project/legal files/property identity/detail, property business status và lịch sử (`apps/ph3-backend/src/main/java/com/nd357/ph3/controller/PublicLookupController.java:36-102`; `PublicLookupService.java:577-627`). Có khai báo và cấp/approve mã BĐS (`apps/ph3-backend/src/main/java/com/nd357/ph3/controller/PropertyIdentifierCodeController.java:18-39`) cùng ingestion MPLIS/N3 để đồng bộ dữ liệu nguồn. |
| Monitor/compliance | **Implemented nền tảng; partial về nghiệp vụ** | RBAC OAuth2/JWT phân tách public/agency/authenticated (`apps/ph3-backend/src/main/java/com/nd357/ph3/security/SecurityConfiguration.java:22-52`). Lookup authenticated phát audit Kafka có actor/client/filter/result (`packages/api/src/services/authenticated-lookup-audit.ts:13-46`, `:272-299`). Transaction workflow kiểm tra scope/assignment/status, yêu cầu sửa và forward/approve (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/BusinessPortalService.java:524-613`). Chưa có rule engine compliance tổng quát, violation/case/remediation/SLA. |
| Report/inspection/alert | **Partial** | Có market overview/report UI và DMP integrations, nhưng báo cáo loại hình hiện chỉ map thật tổng vốn và số giao dịch; nhiều metric trả `N/A` (`packages/api/src/services/public-report-statistics-ctt-dmp.ts:92-147`, `:149-190`). Có API operation/audit logs, nhưng không thấy inspection case, alert subscription, risk scoring, escalation hay enforcement action. |

## 4. Capability liên hệ nhiều actor nên tái sử dụng

### 4.1 Identity, provenance và legal graph — ưu tiên cao

- DB đã phân tách project, construction, property, participant/user, legal document/version, identifiers, transaction/history (`tooling/database/schema.prisma:16-183`, `:297-535`, `:629-935`).
- Consumer Kafka đồng bộ MPLIS cho địa chỉ, tài sản, giấy chứng nhận, thửa đất, quyền sử dụng/quyền sở hữu, dự án/công trình/BĐS/chủ thể; đây là nền rất có giá trị cho VMLS trust graph (`apps/ph3-consumer/src/main/java/com/nd357/ph3consumer/mplis/MplisPayloadSyncOrchestrator.java:91-297`).
- Nên giữ 357 làm authoritative/legal data adapter, còn VMLS bổ sung marketplace domains riêng.

### 4.2 Transaction & approval engine — tái sử dụng có điều chỉnh

- Có create/update transaction, transfer linkage, party/property rows, status, assignment, return/request-change, forward/approve và history (`apps/ph3-backend/src/main/java/com/nd357/ph3/controller/BusinessPortalController.java:90-299`; `tooling/database/schema.prisma:826-935`).
- Có province workflow từ đơn vị khai báo → Sở → UBND và adapter gọi API/config DB (`apps/ph3-backend/src/main/java/com/nd357/ph3/service/TransactionRoutingUnitService.java:28-108`).
- Nên tái dùng cho regulatory submission/approval. Không nên kéo assignment này thành CRM/lead pipeline; hai domain có semantics và SLA khác nhau.

### 4.3 Public discovery và due diligence — tái sử dụng cao

- Search/detail dự án/BĐS/pháp lý, filter/page, public/authenticated variants, CAPTCHA và audit đã có interface tương đối sâu (`packages/domain/src/orpc-contract/tra-cuu-cong-khai.ts:255-306`; `packages/api/src/orpc/routers/tra-cuu-cong-khai.ts:32-160`).
- Có thể trở thành “verified facts panel” trong listing/project của VMLS. Marketplace catalog, ranking, compare, favorites bền vững và contact flow vẫn phải xây riêng.

## 5. Các phần không được tính nhầm là production-ready

1. **Trading/listing page chỉ là mock UI**: dữ liệu hard-code, favorite trong memory, không route/backend (`packages/ui/src/components/public/InnerPages.tsx:1295-1478`).
2. **Sàn và tổ chức môi giới hiện là report-only**: không có operational workspace (`apps/ph3-website/src/auth.ts:141-145`; test `apps/ph3-website/src/auth.test.ts:58-75`).
3. **Một số màn hình Nhà nước dùng fixture/mock**: detail dự án/công trình dùng `MANAGED_PROJECT_*` static (`apps/ph3-website/src/app/components/AgencyProjectConstructionDetailPage.tsx:6-9`, `:36-85`); lịch sử BĐS hard-code (`apps/ph3-website/src/app/components/AgencyFuturePropertyHistoryPage.tsx:7-96`); flow hồ sơ có `mockDossiers` (`apps/ph3-website/src/app/components/AgencyFuturePropertyDeclarationPage.tsx:21-109`).
4. **Draft chứng chỉ môi giới là localStorage**, chưa phải server-side collaborative/audited draft (`apps/ph3-website/src/app/components/AgencyBrokerIdentifierCodeDeclarationPage.tsx:1056-1057`).
5. **Report còn thiếu mapping**: nhiều metric cố ý `N/A` (`packages/api/src/services/public-report-statistics-ctt-dmp.ts:92-147`).
6. **Legal library là catalog metadata hard-code** trong BFF, chưa phải CMS/source-sync workflow (`packages/api/src/services/public-legal-documents.ts:30-64`).
7. **USECASES là assurance plan/docs-only nếu chưa chạy**: ví dụ approval flow mô tả chuyên viên → lãnh đạo → approved (`USECASES/can-bo-duyet-giao-dich.md:164-254`) và transfer E2E có ma trận/state/concurrency (`USECASES/giao-dich-chuyen-nhuong-e2e.md:181-235`, `:506-591`). Không nên dùng riêng các tài liệu này làm bằng chứng “implemented”.

## 6. Khuyến nghị ranh giới adapt cho VMLS

### Giữ/tái sử dụng từ 357

- property/project/construction identifiers và provenance;
- legal document/version + verified status;
- broker certificate registry/verification;
- regulatory transaction submission/approval/history;
- public verified lookup/detail;
- RBAC, authenticated audit, CAPTCHA/rate-limit patterns;
- MPLIS/N3/DMP adapters và market statistics ingestion.

### Xây module VMLS mới, chỉ liên kết bằng identifier

- broker profile/affiliation/CRM và lead pipeline;
- listing/catalog/publication/moderation;
- developer price book/policy/channel/inventory allocation;
- agency collaboration/commission/compliance operations;
- bank loan origination, underwriting, disbursement/reconciliation/risk;
- buyer contact/appointment/compare/offer/booking/payment/handover;
- regulator inspection/violation/alert/remediation case management.

Ranh giới hợp lý là: VMLS giữ trải nghiệm và workflows thương mại; 357 cung cấp authoritative identifiers, verified legal facts, regulatory submissions và audit evidence qua interface riêng. Cách này tận dụng đúng chiều sâu hiện có của 357 mà không ép transaction approval của Nhà nước hoặc mock trading UI thành CRM/marketplace.
