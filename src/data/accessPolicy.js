export const accessRoleOrder = ['agent', 'broker', 'developer', 'buyer', 'seller', 'bank', 'regulator', 'steward']

export const fieldGroups = [
  { id: 'public-listing', label: 'Giá, trạng thái, đặc điểm, media', classification: 'Public' },
  { id: 'industry-contact', label: 'Liên hệ nghề nghiệp của agent/sàn', classification: 'Industry' },
  { id: 'private-remarks', label: 'Private remarks và hướng dẫn xem nhà', classification: 'Restricted' },
  { id: 'owner-contact', label: 'Danh tính và liên hệ owner/seller', classification: 'Restricted' },
  { id: 'representation', label: 'Hợp đồng đại diện và tài liệu chứng minh', classification: 'Restricted' },
  { id: 'source-evidence', label: 'Nguồn, provenance và bằng chứng xác minh', classification: 'Industry' },
  { id: 'audit', label: 'Audit event và before/after', classification: 'Restricted' },
  { id: 'finance', label: 'Closing, finance và consent data', classification: 'Restricted' },
]

export const roleAccessProfiles = {
  agent: {
    label: 'Môi giới', scope: 'Assigned Listing + Industry scope', purpose: 'Phục vụ giao dịch và khách hàng được giao',
    capabilities: ['Tìm Property trong Industry projection', 'Tạo và quản lý Listing được giao', 'Xem Restricted Field khi là responsible agent', 'Tạo CMA và yêu cầu quyền bổ sung'],
    projection: ['allowed', 'allowed', 'assigned', 'consent', 'assigned', 'allowed', 'assigned', 'transaction'],
  },
  broker: {
    label: 'Sàn môi giới', scope: 'Organization scope', purpose: 'Giám sát thành viên, Listing và chất lượng của sàn',
    capabilities: ['Review và duyệt Listing trong tổ chức', 'Quản lý Membership và Entitlement', 'Xem audit theo organization scope', 'Duyệt hoặc từ chối Access Request'],
    projection: ['allowed', 'allowed', 'need-to-know', 'need-to-know', 'allowed', 'allowed', 'allowed', 'transaction'],
  },
  developer: {
    label: 'Chủ đầu tư', scope: 'Own Project/Unit inventory', purpose: 'Quản lý inventory và phân phối được ủy quyền',
    capabilities: ['Quản lý Project/Unit thuộc sở hữu', 'Theo dõi Listing trong distribution assignment', 'Xem nguồn liên quan inventory của mình', 'Không truy cập CRM của môi giới'],
    projection: ['own-scope', 'allowed', 'own-scope', 'own-scope', 'own-scope', 'own-scope', 'own-scope', 'own-scope'],
  },
  bank: {
    label: 'Ngân hàng', scope: 'Finance Case có Purpose + Consent', purpose: 'Đánh giá finance-fit tối thiểu cần thiết',
    capabilities: ['Xem Property và mức giá phục vụ finance case', 'Nhận verification outcome', 'Yêu cầu bổ sung dữ liệu có consent', 'Ghi trạng thái case nhưng không sửa Listing'],
    projection: ['purpose', 'purpose', 'never', 'consent', 'never', 'purpose', 'limited', 'consent'],
  },
  regulator: {
    label: 'Cơ quan quản lý', scope: 'Jurisdiction + statutory authority', purpose: 'Giám sát thị trường và điều tra theo thẩm quyền',
    capabilities: ['Xem aggregate mặc định', 'Drill-down theo authority scope', 'Xem audit và nguồn khi có căn cứ', 'Mọi override cần reason và audit'],
    projection: ['authority', 'authority', 'never', 'authority', 'authority', 'authority', 'authority', 'authority'],
  },
  buyer: {
    label: 'Người mua', scope: 'Public Active Listing + own relationship', purpose: 'Khám phá, shortlist và xem nhà',
    capabilities: ['Xem Public Field của Active Listing', 'Lưu shortlist và lịch xem của mình', 'Cấp hoặc thu hồi consent', 'Báo sai nhưng không sửa canonical data'],
    projection: ['allowed', 'public-subset', 'never', 'own', 'never', 'outcome', 'milestone', 'own'],
  },
  seller: {
    label: 'Người bán / Chủ sở hữu', scope: 'Own verified/claimed Property relationship', purpose: 'Quản lý authority, consent và Listing milestone của BĐS liên kết',
    capabilities: ['Xem BĐS liên kết và trạng thái Ownership Claim', 'Quản lý Representation và consent phân phối', 'Theo dõi Listing milestone được phép', 'Tạo correction/dispute case thay vì sửa Listing trực tiếp'],
    projection: ['own-scope', 'public-subset', 'never', 'own', 'own-scope', 'outcome', 'milestone', 'own'],
  },
  steward: {
    label: 'Data Steward', scope: 'Assigned quality/identity case', purpose: 'Giải quyết định danh, nguồn, duplicate và chất lượng',
    capabilities: ['Xem provenance đầy đủ trong case được giao', 'Merge candidate có audit', 'Giải quyết Data Issue', 'Không dùng dữ liệu Restricted ngoài quality purpose'],
    projection: ['allowed', 'allowed', 'assigned', 'case', 'case', 'assigned', 'assigned', 'case'],
  },
}

export const projectionLabels = {
  allowed: ['Được xem', 'visible'],
  assigned: ['Theo assignment', 'conditional'],
  consent: ['Cần consent', 'conditional'],
  transaction: ['Theo giao dịch', 'conditional'],
  'need-to-know': ['Need-to-know', 'conditional'],
  'own-scope': ['Chỉ dữ liệu của mình', 'conditional'],
  purpose: ['Theo purpose', 'conditional'],
  limited: ['Giới hạn', 'conditional'],
  never: ['Không được xem', 'blocked'],
  authority: ['Theo thẩm quyền', 'conditional'],
  own: ['Dữ liệu của mình', 'conditional'],
  'public-subset': ['Public subset', 'visible'],
  outcome: ['Chỉ kết quả', 'conditional'],
  milestone: ['Public milestone', 'visible'],
  case: ['Theo quality case', 'conditional'],
}

export const exchangePolicies = {
  agent: {
    label: 'Dữ liệu do Môi giới đóng góp',
    contributes: ['Listing và biến động giá', 'Public remarks và media', 'Representation evidence', 'Client/showing context'],
    recipients: {
      broker: { visible: ['Listing đầy đủ trong organization scope', 'Representation evidence', 'Audit của Listing'], masked: ['Owner contact theo need-to-know'], never: ['CRM ngoài tổ chức'] },
      bank: { visible: ['Property, giá và verification outcome'], masked: ['Owner/contact khi có consent', 'Closing data theo finance purpose'], never: ['Private remarks', 'CRM và internal audit'] },
      developer: { visible: ['Listing gắn Own Project/Unit'], masked: ['Distribution context được assignment'], never: ['Client CRM', 'Private remarks ngoài inventory'] },
      regulator: { visible: ['Aggregate và Listing theo jurisdiction'], masked: ['Audit detail theo statutory authority'], never: ['Private remarks mặc định'] },
      buyer: { visible: ['Public projection của Active Listing'], masked: ['Showing instruction sau xác nhận'], never: ['Owner identity', 'Audit và representation document'] },
      steward: { visible: ['Identity, source và Data Issue trong case'], masked: ['Restricted field phục vụ verification'], never: ['Dữ liệu ngoài quality purpose'] },
    },
  },
  bank: {
    label: 'Dữ liệu do Ngân hàng đóng góp',
    contributes: ['Finance-case status', 'Yêu cầu bổ sung hồ sơ', 'Finance-fit outcome', 'Consent usage event'],
    recipients: {
      agent: { visible: ['Trạng thái tiếp nhận', 'Yêu cầu bổ sung được chia sẻ'], masked: ['Finance-fit outcome khi khách consent'], never: ['Credit score', 'Risk model', 'Underwriting note'] },
      buyer: { visible: ['Case của chính mình', 'Consent đã cấp', 'Kết quả được phép chia sẻ'], masked: ['Giải thích quyết định theo policy ngân hàng'], never: ['Internal risk model'] },
      broker: { visible: ['Trạng thái tổng hợp của case trong giao dịch'], masked: ['Kết quả theo consent'], never: ['Underwriting nội bộ'] },
      regulator: { visible: ['Aggregate theo authority'], masked: ['Case detail theo statutory request'], never: ['Dữ liệu ngoài jurisdiction'] },
      steward: { visible: ['Consent validity và lỗi liên kết Property'], masked: ['Field cần thiết cho quality case'], never: ['Nội dung thẩm định tín dụng'] },
    },
  },
  developer: {
    label: 'Dữ liệu do Chủ đầu tư đóng góp',
    contributes: ['Project/Unit inventory', 'Availability', 'Unit evidence', 'Distribution assignment'],
    recipients: {
      agent: { visible: ['Inventory được phân phối', 'Unit facts và availability'], masked: ['Tài liệu dự án theo entitlement'], never: ['Commercial terms ngoài assignment'] },
      bank: { visible: ['Project/Unit facts theo finance purpose'], masked: ['Legal evidence theo consent/case'], never: ['Internal sales pipeline'] },
      buyer: { visible: ['Public Project/Unit projection'], masked: ['Booking context của chính mình'], never: ['Distribution contract'] },
      regulator: { visible: ['Aggregate và dữ liệu theo jurisdiction'], masked: ['Project evidence theo authority'], never: ['Dữ liệu ngoài thẩm quyền'] },
      steward: { visible: ['Unit identity và source evidence'], masked: ['Document trong quality case'], never: ['Commercial CRM'] },
    },
  },
}

export const consentSeed = [
  { id: 'CNS-2408-01', subject: 'Trần Thảo Vy', grantee: 'Ngân hàng Đại Việt', purpose: 'Pre-qualification', fields: 'Property, giá, thu nhập khai báo', expiresAt: '30/09/2026', status: 'Có hiệu lực' },
  { id: 'CNS-2391-02', subject: 'Nguyễn Quốc Khánh', grantee: 'HouseNow Partners', purpose: 'Đặt lịch xem', fields: 'Contact, lịch rảnh', expiresAt: '31/08/2026', status: 'Có hiệu lực' },
  { id: 'CNS-2377-01', subject: 'Lê Thanh Hà', grantee: 'Ngân hàng Đại Việt', purpose: 'Finance fit', fields: 'Property, khoảng vay', expiresAt: '18/08/2026', status: 'Sắp hết hạn' },
]

export const accessRequestSeed = [
  { id: 'AR-2026-018', requester: 'Đặng Đức Long', requesterRole: 'Ngân hàng', organization: 'Ngân hàng Đại Việt', resourceId: 'HN-PROP-000184', fieldGroup: 'Closing/finance data', purpose: 'Pre-qualification', duration: '30 ngày', status: 'Chờ duyệt', createdAt: '13/08/2026, 09:20' },
  { id: 'AR-2026-017', requester: 'Phạm Thu Hà', requesterRole: 'Chủ đầu tư', organization: 'Nova Habitat', resourceId: 'HN-PROP-000288', fieldGroup: 'Source/provenance', purpose: 'Đối chiếu Unit inventory', duration: '14 ngày', status: 'Đã duyệt', createdAt: '12/08/2026, 15:42' },
]

export function localAccessSnapshot(roleId) {
  return {
    profile: roleAccessProfiles[roleId],
    fieldGroups,
    roleProfiles: roleAccessProfiles,
    exchangePolicies,
    consents: consentSeed,
    requests: accessRequestSeed,
    accessAudit: [],
  }
}
