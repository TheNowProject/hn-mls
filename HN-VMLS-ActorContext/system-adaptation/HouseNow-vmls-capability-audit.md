# Audit khả năng thích ứng VMLS của HouseNow

Ngày audit: 2026-08-13

Phạm vi: đọc source tại `/Users/phatnt2702/Desktop/HouseNow-MonoRepo`; không chạy ứng dụng, không truy vấn production DB, không sửa code sản phẩm.

## 1. Quy ước đánh giá

- **Implemented**: có domain model và code thực thi/API hoặc UI gọi API tương ứng.
- **Partial**: có một phần dữ liệu hoặc workflow gần với VMLS, nhưng thiếu các bước/domain quan trọng để thành use case hoàn chỉnh.
- **Docs/demo-only**: chỉ thấy ở trang demo, mock hoặc nội dung marketing; không tìm thấy backend/domain production tương ứng.
- **Not found**: không tìm thấy domain model, API hay workflow sau khi rà Prisma schema, oRPC routers và các app `client`, `business`, `admin` bằng từ khóa Việt/Anh liên quan.

Lưu ý quan trọng: model `Transaction` của HouseNow là giao dịch thanh toán gói hội viên/credit/ví, không phải hồ sơ giao dịch mua bán BĐS. Bằng chứng là các trường `packageId`, `subscriptionName`, `type` web/IAP, `discountCode` tại [schema.prisma:3093](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3093>). Không nên tái sử dụng nó như một VMLS property transaction nếu chưa tách bounded context.

## 2. Kết luận nhanh

HouseNow là nền tảng có thể tái sử dụng tốt cho lớp **marketplace + broker CRM + listing moderation + mortgage lead workflow** của VMLS. Mức sẵn sàng tương đối theo actor:

| Actor | Mức sẵn sàng | Nhận định |
|---|---:|---|
| Môi giới | Cao ở listing/CRM; thấp ở pháp lý nghề và co-broker transaction | Profile, tin đăng, khách hàng/nhu cầu đã có thật; chứng chỉ hành nghề, MLS cooperation agreement và giao dịch BĐS chưa có |
| Chủ đầu tư | Trung bình-thấp | Có dữ liệu dự án/pháp lý/tòa/giá và liên kết sàn; chưa có inventory/price book/policy version, booking, bán hàng, bàn giao theo căn |
| Sàn môi giới | Trung bình | Có tổ chức, thành viên, kho tin, moderation và dashboard; lead routing chỉ một phần, chưa có commission/tuân thủ/giao dịch BĐS |
| Ngân hàng | Cao cho loan lead processing | Có gói vay, hồ sơ, phân quyền chi nhánh, thẩm định bằng status/data, phê duyệt/giải ngân/lịch sử; thiếu hồ sơ tài liệu chuẩn hóa, đối soát và risk engine |
| Người mua | Cao ở discovery/contact; thấp ở transaction lifecycle | Tìm/lọc/so sánh/lưu/liên hệ/đặt lịch và đăng ký vay đã có; chưa có offer/booking/deposit/contract/handover tracking |
| Cơ quan quản lý | Thấp | Có dữ liệu nguồn để hình thành registry và moderation audit, nhưng không có actor/cổng quản lý, xác minh chứng chỉ/doanh nghiệp, thanh tra, cảnh báo hay regulatory reporting |

## 3. Ma trận chi tiết theo 6 actor/use-case VMLS

### 3.1 Môi giới

| Use case VMLS | Trạng thái | Bằng chứng và khoảng trống |
|---|---|---|
| Hồ sơ môi giới | **Implemented** | `AgentProfile` lưu mô tả, khu vực, dự án, số năm kinh nghiệm, sàn/vai trò, free agent tại [schema.prisma:135](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:135>). API đọc profile trả các trường tương ứng tại [agent-router.ts:1038](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/agent-router.ts:1038>). |
| Chứng chỉ hành nghề | **Not found** | Không có trường/model certificate/license/credential trong `AgentProfile` hay router agent. Hiện profile chỉ là self-declared experience/agency; chưa có số chứng chỉ, cơ quan cấp, ngày hiệu lực/hết hạn, tài liệu và trạng thái xác minh. |
| Khách hàng & nhu cầu tìm mua | **Implemented** | Môi giới có thể tạo khách hàng với dự án, quận/huyện, khoảng giá, số phòng, thời gian, mục đích tại [lead-router.ts:17](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/node/lead-router.ts:17>); dữ liệu được ghi vào `leads`, `leadInfos`, `leadDemandHistories` tại [lead-router.ts:70](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/node/lead-router.ts:70>). Danh sách/search khách hàng được giới hạn theo agent tại [lead-router.ts:182](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/lead-router.ts:182>), nhu cầu có lịch sử và được cập nhật tại [lead-router.ts:2693](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/lead-router.ts:2693>) và [lead-router.ts:3092](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/lead-router.ts:3092>). |
| Tạo/cập nhật/tìm kiếm tin đăng | **Implemented** | CRUD/search thực tế: filter tin của agent tại [agent-listing-router.ts:67](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/agent-listing-router.ts:67>), create và insert listing tại [agent-listing-router.ts:853](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/agent-listing-router.ts:853>), update tại [agent-listing-router.ts:1128](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/agent-listing-router.ts:1128>). Public search hỗ trợ keyword, giá, diện tích, phòng, vị trí, dự án, xác minh, loại căn, hướng và sort tại [listing-contract.ts:136](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/contracts/edge/listing-contract.ts:136>). |
| Hợp tác môi giới | **Partial** | Có liên kết agent–project và agent–listing (`AgentLinkProject`, `AgentLinkListing`) tại [schema.prisma:269](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:269>) và [schema.prisma:302](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:302>), đồng thời một listing có `agencyIds` tại [schema.prisma:2166](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2166>). Tuy nhiên các liên kết này phục vụ phân phối/hiển thị, chưa phải co-broker workflow: không có yêu cầu hợp tác, chia sẻ listing có điều kiện, vai trò buyer/seller agent, thỏa thuận phí, acceptance, dispute hay audit trail của collaboration. |
| Theo dõi giao dịch mua bán | **Not found** | Có lead status/note/history nhưng không có property deal model hay pipeline offer → negotiation → deposit → contract → notary → payment → handover. `Transaction` hiện là billing/IAP như lưu ý đầu báo cáo. |

### 3.2 Chủ đầu tư

| Use case VMLS | Trạng thái | Bằng chứng và khoảng trống |
|---|---|---|
| Thông tin & pháp lý dự án | **Implemented/Partial** | `Project` có investor, developer, legal status, extra documents, document dates, construction progress, handoff note và verified flag tại [schema.prisma:1648](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1648>). `ProjectLandingInfo` có giấy chứng nhận quyền sử dụng đất và dự kiến bàn giao tại [schema.prisma:1814](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1814>). Admin có create/update/restore/merge project endpoints tại [project-router.ts:1146](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/project-router.ts:1146>) và [project-router.ts:1908](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/project-router.ts:1908>). Partial ở góc VMLS vì chưa thấy project developer portal, loại giấy phép có cấu trúc, version/effective date/signature và verification provenance. |
| Giỏ hàng/giá/chính sách bán | **Partial** | Có hierarchy dự án–tòa–căn (`ProjectTower`, `Tower`, `TowerApartment`) tại [schema.prisma:1874](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1874>), listing gắn project/tower/apartment/asset identifier và giá tại [schema.prisma:2166](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2166>); primary listing có early price, price schedule, pricing info tại [schema.prisma:2340](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2340>). Chưa có inventory state machine theo unit, hold/lock concurrency, bảng giá phiên bản, payment schedule chuẩn hóa, promotion/policy eligibility hay API bulk import từ CĐT. |
| Sàn môi giới/kênh phân phối | **Partial** | Project có `linkedAgency`/`agencyIds` tại [schema.prisma:1742](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1742>), tower có linked agency tại [schema.prisma:1898](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1898>). Đây là data association, chưa có channel onboarding, contract, quota, allocation, price/policy visibility hay performance settlement. |
| Booking/bán hàng/bàn giao | **Docs/demo-only / Not found** | Source production chỉ lưu mô tả/trạng thái bàn giao (`expectedHandover`, `handoverAt`, `handoverStandard`) tại [schema.prisma:1841](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1841>) và [schema.prisma:2358](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2358>). Chuỗi “Có giỏ hàng/Chờ booking” nằm trong trang demo tại [masterise-lead-flow.tsx:485](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/pages/demo/masterise-lead-flow.tsx:485>); “theo dõi ... booking” cũng là benefit demo tại [masterise-star-club.tsx:124](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/pages/demo/masterise-star-club.tsx:124>). Không có backend booking/sale/handover case. |

### 3.3 Sàn môi giới

| Use case VMLS | Trạng thái | Bằng chứng và khoảng trống |
|---|---|---|
| Cơ cấu tổ chức & môi giới | **Implemented (basic)** | `Agency` có pháp nhân cơ bản (đại diện, MST, địa chỉ) và `AgencyMember` có role admin/member, invitation/active state tại [schema.prisma:602](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:602>). Business app hỗ trợ kiểm tra, mời/accept/remove và xem tin theo nhân viên tại [agency-member-router.ts:30](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/agency-member-router.ts:30>), [agency-member-router.ts:136](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/agency-member-router.ts:136>), [agency-member-router.ts:247](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/agency-member-router.ts:247>). Chưa có team/branch/reporting line và chức danh đa cấp. |
| Kiểm duyệt tin/kho hàng | **Implemented** | Admin có verify toggle và ghi history tại [listing-router.ts:4390](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/listing-router.ts:4390>), review agent listing tại [listing-router.ts:5777](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/listing-router.ts:5777>), review crawled listing tại [listing-router.ts:5802](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/listing-router.ts:5802>). Listing có status/searchable/verified, source, history và agency ownership tại [schema.prisma:2166](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2166>). |
| Phân bổ lead/giao dịch | **Partial** | Lead gắn một `agentFirebaseUserId`, có `matched/matchedAt`, status/note tại [schema.prisma:2527](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2527>); admin CRM có PIC assignment cho lead info tại [lead-info-router.ts:3414](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/lead-info-router.ts:3414>). Đây là lead assignment ở cấp HouseNow/admin/agent; chưa thấy rule engine phân bổ lead trong từng agency, SLA/round robin/capacity, reassignment policy, hoặc phân bổ property deal. |
| Hoa hồng | **Docs/marketing-only** | Trang loan landing hiển thị mức hoa hồng hard-coded và CTA tạo hồ sơ vay tại [SpecificBankSection.tsx:42](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/app/(new-trpc)/wv/routes/wv/_global-search/a/ho-so-vay/landing/-SpecificBankSection.tsx:42>) và [SpecificBankSection.tsx:410](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/app/(new-trpc)/wv/routes/wv/_global-search/a/ho-so-vay/landing/-SpecificBankSection.tsx:410>). Không có commission ledger, rule, accrual, approval, tax document, payout hay reconciliation model. |
| Tuân thủ | **Partial (internal content QA)** | Crawled listing có quality/exposure/audit priority score tại [schema.prisma:1403](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1403>) và admin sắp xếp hậu kiểm theo score tại [listing-router.ts:1821](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/listing-router.ts:1821>). Đây là moderation quality control, chưa phải KYC/AML, giấy phép môi giới, consent, conflict-of-interest, retention hay regulatory compliance. |
| Báo cáo | **Implemented/Partial** | Agency dashboard có số tin, thành viên, lượt xem và khách tiềm năng tại [QuickSummary.tsx:11](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/app/(tanstack-router)/routes/_web/_protected/$agencySlug/_agency/bao-cao-tai-chinh/-components/QuickSummary.tsx:11>); listing report hỗ trợ date/sort/pagination tại [ListingSummary.tsx:21](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/app/(tanstack-router)/routes/_web/_protected/$agencySlug/_agency/bao-cao-tai-chinh/-components/listing-summary/ListingSummary.tsx:21>). Chưa có funnel property deal, GMV, commission, compliance/exception và regulatory exports. |

### 3.4 Ngân hàng

| Use case VMLS | Trạng thái | Bằng chứng và khoảng trống |
|---|---|---|
| Sản phẩm vay | **Implemented (basic catalog)** | `BankLoanPackage` có lãi suất ưu đãi, thời gian ưu đãi, kỳ hạn tối đa, ân hạn tại [schema.prisma:714](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:714>). Thiếu version, eligibility, fees, LTV bands, effective date và approval workflow cho product catalog. |
| Sơ duyệt/tiếp nhận hồ sơ | **Implemented/Partial** | `LoanRequest` lưu người vay, dự án, ngân hàng, số tiền, thu nhập, chi phí, dư nợ, kỳ hạn và tài sản bảo đảm tại [schema.prisma:3296](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3296>). Tạo hồ sơ thực sự insert `loanRequests` và `loanContracts` tại [loan-contract-router.ts:35](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/node/loan-contract-router.ts:35>). Chưa có pre-approval decision engine/score, document checklist, eKYC hay bureau integration. |
| Thẩm định tài sản/phê duyệt tín dụng | **Partial** | `LoanContract` có collateral, income, existing debt và bank status `Đang thẩm định/Phê duyệt/...` tại [schema.prisma:3325](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3325>); bank user có thể cập nhật amount/status/collateral/income/debt/rejection reason tại [bank-loan-router.ts:1552](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/bank-loan-router.ts:1552>). Đây là manual workflow/state tracking, chưa có valuation case, approver matrix, credit memo, conditions precedent hay integration underwriting. |
| Phê duyệt/giải ngân | **Implemented (workflow tracking)** | Loan contract lưu disbursed amount/date và rejection reason tại [schema.prisma:3348](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3348>); bank app cập nhật status/reason tại [bank-loan-router.ts:2369](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/bank-loan-router.ts:2369>), có contract/user histories tại [schema.prisma:3430](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3430>). |
| Phân quyền/PIC | **Implemented** | Bank/branch/member roles director/manager/member tại [schema.prisma:692](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:692>). Query giới hạn theo bank branch và role tại [bank-loan-router.ts:78](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/bank-loan-router.ts:78>); PIC assignment có rule member chỉ tự nhận hồ sơ trống tại [bank-loan-router.ts:2591](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/business/src/orpc/server/routers/edge/bank-loan-router.ts:2591>). |
| Đối soát/rủi ro | **Not found/Partial** | Có lịch sử thay đổi hồ sơ, nhưng không có disbursement reconciliation ledger, bank statement matching, covenant/delinquency/default/fraud/risk model, risk alerts hay portfolio loss reporting. |

### 3.5 Người mua

| Use case VMLS | Trạng thái | Bằng chứng và khoảng trống |
|---|---|---|
| Tìm kiếm/lọc | **Implemented** | Public contract hỗ trợ keyword, giá, diện tích, phòng, vị trí, dự án, loại căn, verified, bounding box, hướng và sorting tại [listing-contract.ts:136](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/contracts/edge/listing-contract.ts:136>). Listing read APIs gồm list, pagination, detail, project/similar listings tại [listing-router.ts:529](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/listing-router.ts:529>). |
| So sánh | **Implemented (project/price comparison)** | Trang so sánh gọi `getAllForCompare` và `getForCompareBySlug`, cho phép tối đa 7 slug tại [page.tsx:13](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/app/(old-trpc)/so-sanh-du-an/[[...slugs]]/page.tsx:13>) và [page.tsx:102](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/app/(old-trpc)/so-sanh-du-an/[[...slugs]]/page.tsx:102>). Không phải legal/loan/total-cost comparison đầy đủ của VMLS. |
| Lưu tin/dự án | **Implemented** | Saved-resource schema hỗ trợ listing, project, tower, land listing/zone tại [my-saved-resource-contract.ts:35](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/contracts/edge/my-saved-resource-contract.ts:35>); router đọc danh sách saved resources tại [my-saved-resource-router.ts:11](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/my-saved-resource-router.ts:11>). |
| Liên hệ & đặt lịch | **Implemented** | UI tạo listing/project contact request với available time tại [Schedule.ScheduleForm.tsx:114](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/app/(new-trpc)/wv/routes/wv/_global-search/-Schedule.ScheduleForm.tsx:114>) và [Schedule.ScheduleForm.tsx:183](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/app/(new-trpc)/wv/routes/wv/_global-search/-Schedule.ScheduleForm.tsx:183>); models lưu contact/showing request tại [schema.prisma:2393](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2393>). Đây là yêu cầu hẹn/liên hệ, chưa có calendar availability, agent confirmation, reschedule/cancel/check-in. |
| Đánh giá tài chính/đăng ký vay | **Implemented/Partial** | Form loan request lưu amount, income, living expense, other loan, term, collateral tại [schema.prisma:3296](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:3296>). Agent cũng xem được trạng thái hồ sơ theo từng ngân hàng tại [agent-bank-loan-router.ts:8](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/client/src/orpc/server/routers/edge/agent-bank-loan-router.ts:8>). Chưa có affordability score/DTI/LTV decision giải thích được hay formal pre-approval offer cho buyer. |
| Đề nghị mua/booking/theo dõi bàn giao | **Not found** | Không có offer, negotiation, reservation/booking, deposit, sale contract, payment milestone hay buyer handover case. Các từ booking chỉ xuất hiện trong demo/marketing như đã dẫn ở phần Chủ đầu tư. |

### 3.6 Cơ quan quản lý

| Use case VMLS | Trạng thái | Bằng chứng và khoảng trống |
|---|---|---|
| Xác minh DN/môi giới/chứng chỉ | **Not found** | Có `Agency.taxCode` và profile agent, nhưng không có registry identity, business verification workflow, credential model, issuer/source, validity/revocation hay regulator role. |
| Pháp lý dự án/BĐS | **Partial as source data** | Project/listing có legal status, extra documents, certificate text, paperwork status và verified flag tại [schema.prisma:1659](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1659>), [schema.prisma:1682](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1682>), [schema.prisma:1841](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:1841>), [schema.prisma:2222](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/packages/db/prisma/schema.prisma:2222>). Dữ liệu phần lớn là string/JSON và admin verification; chưa có authoritative registry sync, parcel/title linkage, digital signature, issuer/provenance/version. |
| Giám sát thị trường/tuân thủ | **Partial (internal operations only)** | Có listing analytics, source/status, moderation history và audit priority score; phù hợp làm input cho monitoring. Tuy nhiên không có market surveillance module, regulator dashboard, rule breach cases, cross-entity anomaly detection hay mandatory filing. |
| Báo cáo/thanh tra/cảnh báo | **Not found/Partial** | Admin `reportRouter` chỉ lưu/đọc HTML report theo role Business/Superadmin tại [report-router.ts:17](</Users/phatnt2702/Desktop/HouseNow-MonoRepo/apps/admin/src/orpc/server/routers/edge/report-router.ts:17>), không phải báo cáo quản lý nhà nước có schema, kỳ báo cáo, chữ ký, submission/acknowledgement. Không thấy inspection case, enforcement action hoặc regulatory warning workflow. |

## 4. Các capability nên tái sử dụng nguyên trạng hoặc ít thay đổi

1. **Identity/session/RBAC nền tảng**: đã có protected/internal/admin/superadmin và role-based branch access; có thể mở rộng actor-specific VMLS permissions.
2. **Listing marketplace**: schema listing/project/address/tower, search/filter, media, saved resources, public detail, analytics.
3. **Broker workspace**: profile, self-service listing CRUD, CRM khách hàng, nhu cầu, note/history, loan referrals.
4. **Admin moderation**: review/verify/history, crawl source, duplicate/quality scoring; là nền tốt cho data quality và compliance queues.
5. **Agency workspace**: agency/member/invitation, member listing visibility, dashboard/report cơ bản.
6. **Mortgage case tracking**: bank/branch/member RBAC, loan request/contract/status/PIC/history/disbursement fields.
7. **Contact/scheduling intake**: contact request theo listing/project, thời gian khả dụng và tracking action.

## 5. Capability phải xây mới để HouseNow thành VMLS

Ưu tiên P0:

- **Credential & legal registry**: `BrokerLicense`, `BusinessVerification`, `ProjectLegalDocument`, `PropertyTitle/Parcel`, issuer/provenance/effective/expiry/revocation, verification case.
- **MLS cooperation**: listing-sharing scope, co-broker invitation/acceptance, buyer-agent/seller-agent sides, cooperation agreement, fee split, permissions, dispute/audit.
- **Property transaction bounded context** tách khỏi billing `Transaction`: `Deal`, `Party`, `Offer`, `CounterOffer`, `Reservation/Booking`, `Deposit`, `SaleContract`, `PaymentMilestone`, `Notary`, `HandoverCase`.
- **Developer inventory/order management**: canonical unit inventory, real-time availability/hold, price book & sales-policy versioning, channel allocation/quota, booking concurrency/idempotency.
- **Agency distribution & commission**: routing rules/SLA/capacity, deal ownership, commission rule/ledger/approval/tax/payout/reconciliation.

Ưu tiên P1:

- **Loan document/decision/risk layer**: document checklist, eKYC/credit bureau/valuation integration, credit decision & conditions, reconciliation, portfolio/default/fraud risk.
- **Regulator workspace/API**: role/tenant riêng, read-only registry views, case management, inspections, alerts, regulatory report schema/submission/acknowledgement, audit export.
- **Consent/privacy/audit hardening**: purpose-based consent, legal basis, retention, subject access, immutable event ledger and field-level provenance.

## 6. Rủi ro nếu “adapt” trực tiếp không tách domain

- Dùng `Transaction` hiện tại cho property deal sẽ trộn billing subscription với giao dịch BĐS, gây sai semantics, quyền truy cập, báo cáo và audit.
- Các trường JSON/string như `agencyIds`, `linkedAgents`, `extraDocuments`, `legalStatus` giúp ship nhanh nhưng không đủ cho tính toàn vẹn referential, versioning, revocation và regulator-grade audit.
- `isVerified` boolean của listing/project không biểu đạt **ai xác minh, dựa trên nguồn nào, phạm vi gì, hiệu lực đến khi nào**, nên không thể coi là pháp lý đã được cơ quan có thẩm quyền xác nhận.
- Lead hiện có một `agentFirebaseUserId` và PIC workflows rời rạc; chưa đủ để biểu diễn multi-party/multi-organization deal và chain of custody.
- Booking xuất hiện trong demo có thể gây đánh giá quá mức nếu chỉ nhìn UI. Audit source cho thấy chưa có model/API production tương ứng.

## 7. Kết luận kiến trúc

Khuyến nghị dùng HouseNow như **experience layer và operational CRM** của VMLS, không cố ép toàn bộ VMLS vào các bảng hiện hữu. Nên giữ các module listing/search/profile/lead/loan, rồi bổ sung các bounded context mới cho registry–credential, developer inventory, MLS cooperation, property transaction, commission và regulator oversight. Cách này tận dụng được phần đã mature mà vẫn tránh biến các boolean/JSON và billing transaction hiện tại thành nền pháp lý/giao dịch không đủ chặt.
