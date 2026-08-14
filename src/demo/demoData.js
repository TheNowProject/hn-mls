// @ts-check

/**
 * Dữ liệu tĩnh cho bản demo VMLS tháng 08/2026.
 *
 * Các mã kỹ thuật và nhãn bằng chứng được giữ ổn định để reducer, kiểm thử và
 * kịch bản trình diễn cùng tham chiếu một hợp đồng dữ liệu. Toàn bộ hành vi tích
 * hợp trong tệp này là mô phỏng đề xuất, không phải hợp đồng tích hợp thật.
 */

/**
 * @typedef {'FACT'|'SOURCE CLAIM'|'INFERENCE'|'PROPOSAL'|'OPEN QUESTION'} EvidenceLabel
 *
 * @typedef {Object} DemoRole
 * @property {string} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {string} group
 * @property {string} purpose
 * @property {string} defaultWorkspace
 * @property {EvidenceLabel} evidence
 * @property {boolean} [supplemental]
 * @property {boolean} [workspaceVisible]
 * @property {string} [simulationLabel]
 *
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string} at
 * @property {string} action
 * @property {EvidenceLabel} evidence
 * @property {string} reason
 * @property {string} targetType
 * @property {string} targetId
 * @property {string} [actor]
 * @property {string} [actorRoleId]
 * @property {string} [actorLabel]
 * @property {string} [label]
 * @property {string} [summary]
 * @property {string} [correlationId]
 * @property {Object} [before]
 * @property {Object} [after]
 * @property {EvidenceLabel} [evidenceLabel]
 *
 * @typedef {Object} IntegrationEvent
 * @property {string} id
 * @property {string} [name]
 * @property {string} [shortName]
 * @property {string} [type]
 * @property {string} [label]
 * @property {string} [role]
 * @property {string} status
 * @property {EvidenceLabel} evidence
 * @property {EvidenceLabel} [evidenceLabel]
 * @property {string} [correlationId]
 * @property {string} disclaimer
 * @property {'developer'|'land_registry'} [route]
 * @property {string} [screenshot]
 * @property {string} [icon]
 * @property {string} [capturedOn]
 * @property {string} [attribution]
 *
 * @typedef {Object} DemoCase
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} shortTitle
 * @property {'developer'|'land_registry'} route
 * @property {string} routeLabel
 * @property {{id:string, status:string, type:string}} property
 * @property {{id:string, askingPrice:{displayValue:string}}} listing
 * @property {{id:string}} transaction
 * @property {Record<string, Object>} parties
 * @property {{financeContext:string, financeConsent:{status:'granted'|'none', label:string}}} readiness
 * @property {{dossierId:string, correlationId:string}} notary
 * @property {Object} transfer
 * @property {readonly {actionId:string, at:string, label:string}[]} chronology
 * @property {readonly IntegrationEvent[]} integrations
 * @property {readonly AuditEvent[]} initialAuditEvents
 */

export const DEMO_VERSION = 'vmls-public-demo-2026-08-v1'

export const EVIDENCE_LABELS = Object.freeze({
  FACT: {
    code: 'FACT',
    label: 'Đã kiểm chứng trực tiếp',
    description: 'Điều quan sát được trực tiếp từ nguồn hoặc hiện vật được dẫn chiếu.',
  },
  SOURCE_CLAIM: {
    code: 'SOURCE CLAIM',
    label: 'Tuyên bố từ nguồn',
    description: 'Nội dung do một nguồn nêu ra nhưng chưa được kiểm chứng độc lập.',
  },
  INFERENCE: {
    code: 'INFERENCE',
    label: 'Nhận định từ bằng chứng',
    description: 'Diễn giải có căn cứ, không phải bằng chứng triển khai hay yêu cầu đã duyệt.',
  },
  PROPOSAL: {
    code: 'PROPOSAL',
    label: 'Mô phỏng đề xuất',
    description: 'Phương án dùng để thảo luận sản phẩm, chưa phải quy trình pháp lý hoặc vận hành đã duyệt.',
  },
  OPEN_QUESTION: {
    code: 'OPEN QUESTION',
    label: 'Cần xác nhận',
    description: 'Quyết định còn mở, cần chủ thể có thẩm quyền xác nhận trước khi triển khai thật.',
  },
})

/** @type {readonly DemoRole[]} */
export const PRIMARY_ROLES = Object.freeze([
  {
    id: 'agent',
    label: 'Môi giới',
    shortLabel: 'MG',
    group: 'Thị trường',
    purpose: 'Đối chiếu Bất động sản, chuẩn bị Tin bán và theo dõi hồ sơ được giao.',
    defaultWorkspace: 'Hồ sơ khách bán',
    evidence: 'PROPOSAL',
  },
  {
    id: 'brokerage',
    label: 'Sàn môi giới',
    shortLabel: 'SÀN',
    group: 'Thị trường',
    purpose: 'Theo dõi chất lượng, quyền đại diện và tiến độ các hồ sơ trong phạm vi sàn.',
    defaultWorkspace: 'Điều phối hồ sơ',
    supplemental: true,
    evidence: 'PROPOSAL',
  },
  {
    id: 'developer',
    label: 'Chủ đầu tư',
    shortLabel: 'CĐT',
    group: 'Thị trường',
    purpose: 'Tiếp nhận và xác nhận chuyển nhượng HĐMB đối với hồ sơ thuộc dự án.',
    defaultWorkspace: 'Chuyển nhượng HĐMB',
    evidence: 'PROPOSAL',
  },
  {
    id: 'buyer',
    label: 'Người mua',
    shortLabel: 'NM',
    group: 'Thị trường',
    purpose: 'Xem thông tin được phép, xác nhận sẵn sàng và nhận kết quả thuộc hồ sơ của mình.',
    defaultWorkspace: 'Tiến độ mua',
    evidence: 'PROPOSAL',
  },
  {
    id: 'seller',
    label: 'Người bán',
    shortLabel: 'NB',
    group: 'Thị trường',
    purpose: 'Xác nhận quyền đại diện và theo dõi các mốc được phép của Bất động sản đang chuyển nhượng.',
    defaultWorkspace: 'Xác nhận và theo dõi',
    evidence: 'PROPOSAL',
  },
  {
    id: 'bank',
    label: 'Ngân hàng',
    shortLabel: 'NH',
    group: 'Thị trường',
    purpose: 'Xem ngữ cảnh tài chính tối thiểu trong phạm vi mục đích và đồng ý được mô phỏng.',
    defaultWorkspace: 'Khả năng tài chính',
    supplemental: true,
    evidence: 'PROPOSAL',
  },
])

/** @type {readonly DemoRole[]} */
export const SYSTEM_ROLES = Object.freeze([
  {
    id: 'vmls',
    label: 'VMLS',
    shortLabel: 'VMLS',
    group: 'Hệ thống mô phỏng',
    purpose: 'Cấp mã tham chiếu, ghi nhận trạng thái và điều phối kết quả giữa các bên.',
    defaultWorkspace: 'Sổ đăng ký sống',
    workspaceVisible: true,
    simulationLabel: 'Mô phỏng đề xuất',
    evidence: 'PROPOSAL',
  },
  {
    id: 'notary',
    label: 'Văn phòng công chứng',
    shortLabel: 'VPCC',
    group: 'Đơn vị bên ngoài mô phỏng',
    purpose: 'Tiếp nhận hồ sơ, yêu cầu bổ sung, ghi nhận ký và trả kết quả công chứng.',
    defaultWorkspace: 'Hồ sơ công chứng',
    workspaceVisible: true,
    simulationLabel: 'Mô phỏng đề xuất',
    evidence: 'PROPOSAL',
  },
  {
    id: 'land_registry',
    label: 'Văn phòng đăng ký đất đai',
    shortLabel: 'VPĐKĐĐ',
    group: 'Đơn vị bên ngoài mô phỏng',
    purpose: 'Tiếp nhận và trả kết quả đăng ký biến động cho hồ sơ đi tuyến đất đai.',
    defaultWorkspace: 'Đăng ký biến động',
    workspaceVisible: true,
    simulationLabel: 'Mô phỏng đề xuất',
    evidence: 'PROPOSAL',
  },
])

export const AUXILIARY_SYSTEMS = Object.freeze([
  {
    id: 'tax',
    label: 'Trao đổi dữ liệu thuế',
    shortLabel: 'THUẾ',
    group: 'Tự động hóa mô phỏng',
    purpose: 'Ghi nhận các sự kiện gửi, tiếp nhận và đối soát nghĩa vụ thuế trong nhật ký tích hợp.',
    defaultWorkspace: 'Nhật ký tích hợp',
    workspaceVisible: false,
    simulationLabel: 'Mô phỏng đề xuất',
    evidence: 'OPEN QUESTION',
  },
  {
    id: 'vneid',
    label: 'VNeID',
    shortLabel: 'VNeID',
    group: 'Chuyển tiếp bên ngoài mô phỏng',
    purpose: 'Minh họa một lần chuyển tiếp trung lập để Người bán xác nhận quyền đại diện.',
    defaultWorkspace: 'Xác nhận bên ngoài',
    workspaceVisible: false,
    simulationLabel: 'Mô phỏng đề xuất',
    evidence: 'PROPOSAL',
  },
  {
    id: 'source357',
    label: 'Cổng thông tin 357',
    shortLabel: '357',
    group: 'Nguồn tham khảo',
    purpose: 'Minh họa nguồn tham khảo có thể tham gia đối chiếu; không thể hiện kết nối hoặc bảo chứng.',
    defaultWorkspace: 'Nguồn tham khảo',
    workspaceVisible: false,
    simulationLabel: 'Nguồn tham khảo, không bảo chứng',
    evidence: 'FACT',
  },
])

export const ALL_ROLES = Object.freeze([...PRIMARY_ROLES, ...SYSTEM_ROLES])

export const STAGES = Object.freeze({
  PROPERTY_MATCH: 'property_match',
  SELLER_CONFIRMATION: 'seller_confirmation',
  LISTING_CREATED: 'listing_created',
  TRANSACTION_READINESS: 'transaction_readiness',
  NOTARY_DOSSIER: 'notary_dossier',
  NOTARY_SIGNED: 'notary_signed',
  ROUTED: 'routed',
  LAND_REGISTRY_COMPLETE: 'land_registry_complete',
  DEVELOPER_INTAKE: 'developer_intake',
  DEVELOPER_CONFIRMED: 'developer_confirmed',
  CONTRACT_RECEIVED: 'contract_received',
})

export const DEMO_STAGES = Object.freeze([
  {
    id: 'property-match',
    number: '01',
    label: 'Đối chiếu Bất động sản',
    title: 'Môi giới đối chiếu đúng Bất động sản',
    actorId: 'agent',
    objectType: 'property',
    intent: 'Bắt đầu từ một Bất động sản có danh tính bền vững, không tạo Tin bán thay cho tài sản.',
    completionLabel: 'Đã gửi Người bán xác nhận',
    actions: [
      {
        id: 'match_property',
        actorId: 'agent',
        label: 'Đối chiếu Bất động sản',
        result: 'Bất động sản được chọn và bằng chứng nguồn được hiển thị.',
      },
      {
        id: 'request_seller_confirmation',
        actorId: 'agent',
        label: 'Gửi xác nhận cho Người bán',
        result: 'Yêu cầu xác nhận quyền đại diện đã được gửi tới Người bán.',
      },
    ],
  },
  {
    id: 'seller-confirmation',
    number: '02',
    label: 'Xác nhận quyền đại diện',
    title: 'Người bán xác nhận qua chuyển tiếp VNeID',
    actorId: 'seller',
    objectType: 'representation',
    intent: 'Ghi nhận sự đồng ý có phạm vi và thời điểm; không biến quan hệ tài khoản thành quyền đại diện.',
    completionLabel: 'Đã xác nhận quyền đại diện',
    actions: [
      {
        id: 'confirm_representation',
        actorId: 'seller',
        label: 'Xác nhận qua VNeID',
        requires: ['request_seller_confirmation'],
        result: 'Quyền đại diện được ghi nhận với thời điểm và phiên bản nội dung xác nhận.',
      },
    ],
  },
  {
    id: 'listing-created',
    number: '03',
    label: 'Khởi tạo Tin bán',
    title: 'VMLS cấp PLID cho một Tin bán riêng biệt',
    actorId: 'vmls',
    objectType: 'listing',
    intent: 'Tin bán tham chiếu Bất động sản nhưng có danh tính, trạng thái và lịch sử riêng.',
    completionLabel: 'Tin bán · Đã khởi tạo',
    actions: [
      {
        id: 'create_listing',
        actorId: 'vmls',
        label: 'Khởi tạo Tin bán',
        requires: ['confirm_representation'],
        result: 'PLID được cấp với trạng thái “Đã khởi tạo”; chưa phải Tin bán đang hoạt động.',
      },
    ],
  },
  {
    id: 'transaction-readiness',
    number: null,
    label: 'Sẵn sàng giao dịch',
    title: 'Ghi nhận Người mua và kiểm tra sẵn sàng công chứng',
    actorId: 'buyer',
    objectType: 'readiness',
    intent: 'Chuẩn bị giao dịch mà chưa cấp PTID trước khi có kết quả công chứng.',
    completionLabel: 'Đã sẵn sàng công chứng',
    actions: [
      {
        id: 'record_buyer',
        actorId: 'agent',
        label: 'Ghi nhận Người mua',
        requires: ['create_listing'],
        result: 'Người mua được liên kết trong phạm vi hồ sơ; dữ liệu liên hệ vẫn được che.',
      },
      {
        id: 'verify_readiness',
        actorId: 'buyer',
        label: 'Xác nhận sẵn sàng công chứng',
        requires: ['record_buyer'],
        result: 'Danh mục sẵn sàng đạt yêu cầu để chuyển sang Văn phòng công chứng.',
      },
    ],
  },
  {
    id: 'notary-dossier',
    number: '04',
    label: 'Hồ sơ công chứng',
    title: 'Văn phòng công chứng lập và nộp hồ sơ',
    actorId: 'notary',
    objectType: 'notaryDossier',
    intent: 'Văn phòng công chứng sở hữu thao tác nghiệp vụ; VMLS chỉ nhận trạng thái cần thiết.',
    completionLabel: 'Hồ sơ đã tiếp nhận',
    actions: [
      {
        id: 'submit_notary_dossier',
        actorId: 'notary',
        label: 'Nộp hồ sơ công chứng',
        requires: ['verify_readiness'],
        result: 'Hồ sơ được ghi nhận “Đã tiếp nhận”.',
      },
      {
        id: 'request_supplement',
        actorId: 'notary',
        label: 'Yêu cầu bổ sung',
        requires: ['submit_notary_dossier'],
        optional: true,
        result: 'Hồ sơ tạm dừng ở trạng thái “Yêu cầu bổ sung”; lịch sử nộp ban đầu được giữ nguyên.',
      },
      {
        id: 'provide_supplement',
        actorId: 'agent',
        label: 'Gửi tài liệu bổ sung',
        requires: ['request_supplement'],
        optional: true,
        result: 'Tài liệu bổ sung được nối vào hồ sơ; trạng thái trở lại “Đủ điều kiện ký”.',
      },
    ],
  },
  {
    id: 'notary-signing',
    number: '05',
    label: 'Kết quả công chứng',
    title: 'Văn phòng công chứng ghi nhận đã ký và trả kết quả',
    actorId: 'notary',
    objectType: 'notaryDossier',
    intent: 'Kết quả công chứng đến từ đơn vị có thẩm quyền mô phỏng, không do VMLS tự quyết định.',
    completionLabel: 'Đã ký công chứng',
    actions: [
      {
        id: 'record_notary_signing',
        actorId: 'notary',
        label: 'Ghi nhận đã ký và gửi kết quả',
        requires: ['submit_notary_dossier'],
        result: 'Kết quả ký được ghi nhận và gửi về VMLS kèm mã tương quan.',
      },
    ],
  },
  {
    id: 'transaction-routing',
    number: '06',
    label: 'Tạo Giao dịch và điều phối',
    title: 'VMLS cấp PTID mô phỏng và xác định tuyến',
    actorId: 'vmls',
    objectType: 'transaction',
    intent: 'PTID là mã tham chiếu demo; sự kiện thuế và tuyến xử lý được nối vào lịch sử thay vì ghi đè.',
    completionLabel: 'Đã xác định tuyến chuyển quyền',
    actions: [
      {
        id: 'create_transaction',
        actorId: 'vmls',
        label: 'Tạo mã Giao dịch và điều phối',
        requires: ['record_notary_signing'],
        result: 'PTID được tạo; các sự kiện tích hợp thuế được thêm; tuyến chuyển quyền được xác định tự động.',
      },
    ],
  },
  {
    id: 'transfer-result',
    number: null,
    includeInRail: true,
    label: 'Kết quả chuyển quyền',
    title: 'Đơn vị tiếp nhận trả kết quả về sổ đăng ký sống',
    actorId: 'route-owner',
    objectType: 'transaction',
    intent: 'Kết thúc bằng bản ghi sống đã cập nhật; không tạo bước đóng giao dịch giả.',
    completionLabel: 'Bản ghi sống đã cập nhật',
    actions: [
      {
        id: 'approve_land_registry',
        actorId: 'land_registry',
        label: 'Phê duyệt đăng ký biến động',
        requires: ['create_transaction'],
        route: 'land_registry',
        result: 'Kết quả VPĐKĐĐ mô phỏng được trả qua API và nối vào lịch sử Bất động sản.',
      },
      {
        id: 'developer_intake',
        actorId: 'developer',
        label: 'Tiếp nhận hồ sơ HĐMB',
        requires: ['create_transaction'],
        route: 'developer',
        result: 'Chủ đầu tư mô phỏng đã tiếp nhận hồ sơ chuyển nhượng.',
      },
      {
        id: 'developer_confirm_transfer',
        actorId: 'developer',
        label: 'Xác nhận chuyển nhượng',
        requires: ['developer_intake'],
        route: 'developer',
        result: 'Chủ đầu tư mô phỏng xác nhận chuyển nhượng; VMLS nhận sự kiện đồng bộ.',
      },
      {
        id: 'buyer_receive_contract',
        actorId: 'buyer',
        label: 'Bàn giao HĐMB mới',
        requires: ['developer_confirm_transfer'],
        route: 'developer',
        result: 'Người mua nhận bản HĐMB mới đã che thông tin; bản ghi sống được cập nhật.',
      },
    ],
  },
])

const maskedContact = (
  /** @type {string} */ phone,
  /** @type {string} */ email,
  /** @type {string} */ identityRef,
) => ({
  phone,
  email,
  identityRef,
  masked: true,
})

/** @type {readonly IntegrationEvent[]} */
const sharedIntegrations = [
  {
    id: 'source-357',
    name: 'Cổng thông tin về nhà ở và thị trường bất động sản',
    shortName: 'Nguồn tham khảo 357',
    role: 'Nguồn tham khảo khi đối chiếu danh tính tài sản',
    status: 'Chỉ minh họa',
    screenshot: '/assets/demo/357-homepage-2026-08-15.png',
    capturedOn: '15/08/2026',
    attribution: 'Ảnh chụp trang chính thongtinbds.moc.gov.vn ngày 15/08/2026.',
    disclaimer: 'Không thể hiện kết nối kỹ thuật, dữ liệu hồ sơ hoặc sự bảo chứng của cơ quan quản lý.',
    evidence: 'FACT',
  },
  {
    id: 'housenow',
    name: 'HouseNow',
    shortName: 'HouseNow',
    role: 'Kênh phân phối Tin bán được mô phỏng',
    status: 'Chờ Tin bán được khởi tạo',
    icon: '/assets/demo/housenow-icon.png',
    disclaimer: 'HouseNow là một kênh phân phối trong hành trình; VMLS vẫn giữ danh tính và lịch sử lõi.',
    evidence: 'PROPOSAL',
  },
  {
    id: 'vneid-handoff',
    name: 'Chuyển tiếp VNeID',
    shortName: 'VNeID',
    role: 'Bề mặt xác nhận quyền đại diện được mô phỏng',
    status: 'Chưa gửi xác nhận',
    disclaimer: 'Không kết nối VNeID thật, không đăng nhập và không thu thập dữ liệu định danh thật.',
    evidence: 'PROPOSAL',
  },
  {
    id: 'tax-exchange',
    name: 'Trao đổi dữ liệu thuế',
    shortName: 'Thuế',
    role: 'Các sự kiện tự động sau công chứng',
    status: 'Chờ PTID',
    disclaimer: 'Cách thức xét duyệt thủ công hay tự động vẫn cần cơ quan có thẩm quyền xác nhận.',
    evidence: 'OPEN QUESTION',
  },
]

/** @type {readonly DemoCase[]} */
export const DEMO_CASES = Object.freeze([
  {
    id: 'sun-grand-thuy-khue',
    slug: 'sun-grand-thuy-khue',
    title: 'Chuyển nhượng HĐMB · S2-12A',
    shortTitle: 'S2-12A · Thụy Khuê',
    route: 'developer',
    routeLabel: 'Tuyến Chủ đầu tư / HĐMB',
    routeOwnerRoleId: 'developer',
    project: 'Sun Grand City Thụy Khuê Residence',
    unit: 'S2-12A',
    isSynthetic: true,
    badge: 'Mô phỏng đề xuất',
    summary: 'Một căn hộ dự án được chuyển nhượng theo tuyến Chủ đầu tư, từ NPID đến HĐMB mới của Người mua.',
    chronologyLabel: 'Dòng thời gian cố định · 10–26/08/2026',
    property: {
      id: 'NPID-HN-09876',
      objectLabel: 'Bất động sản',
      name: 'Căn hộ S2-12A',
      type: 'Căn hộ thuộc dự án',
      project: 'Sun Grand City Thụy Khuê Residence',
      unit: 'S2-12A',
      location: 'Khu vực Thụy Khuê, Hà Nội',
      addressVisibility: 'Địa chỉ chi tiết đã che trong bản demo công khai',
      status: 'Đã tạo hồ sơ minh họa',
      areas: [
        {
          kind: 'usable',
          label: 'Diện tích thông thủy',
          value: 69.2,
          unit: 'm²',
          sourceLabel: 'Hợp đồng mua bán mẫu đã che thông tin',
          evidence: 'SOURCE CLAIM',
        },
        {
          kind: 'gross',
          label: 'Diện tích tim tường',
          value: 82.3,
          unit: 'm²',
          sourceLabel: 'Hồ sơ chủ đầu tư mẫu',
          evidence: 'SOURCE CLAIM',
        },
      ],
      identityNote: 'Hai khái niệm diện tích được giữ riêng cùng nguồn; không chọn một giá trị để ghi đè giá trị còn lại.',
    },
    listing: {
      id: 'PLID-HN-00125',
      objectLabel: 'Tin bán',
      transactionType: 'Chuyển nhượng',
      initialStatus: 'Chưa khởi tạo',
      createdStatus: 'Đã khởi tạo',
      activeStatus: null,
      askingPrice: { value: 15800000000, displayValue: '15,8 tỷ đồng', currency: 'VND', evidence: 'PROPOSAL' },
      representationStatus: 'Chờ Người bán xác nhận',
      distributionChannels: ['HouseNow'],
      scopeNote: '“Tin bán” trong demo này chỉ dùng cho nhu cầu bán hoặc chuyển nhượng.',
    },
    transaction: {
      id: 'PTID-HN-00031',
      objectLabel: 'Giao dịch',
      initialStatus: 'Chưa khởi tạo',
      createdStatus: 'Đã ký công chứng',
      finalStatus: 'HĐMB mới đã bàn giao',
      route: 'developer',
      identifierDisclaimer: 'PTID là mã tham chiếu của bản demo VMLS; thẩm quyền cấp mã chính thức vẫn cần xác nhận.',
      evidence: 'PROPOSAL',
    },
    parties: {
      seller: {
        roleId: 'seller',
        displayName: 'T••• M••• A•••',
        organization: null,
        contact: maskedContact('09•• ••• 218', 'm•••@vi-du.vn', 'CCCD •••• 1842'),
      },
      buyer: {
        roleId: 'buyer',
        displayName: 'N••• V••• A•',
        organization: null,
        contact: maskedContact('09•• ••• 506', 'a•••@vi-du.vn', 'CCCD •••• 5076'),
      },
      agent: {
        roleId: 'agent',
        displayName: 'N••• H••• N••',
        organization: 'Sàn môi giới An Cư (mô phỏng)',
        contact: maskedContact('09•• ••• 831', 'n•••@vi-du.vn', 'Mã môi giới ••831'),
      },
    },
    readiness: {
      initialStatus: 'Chưa ghi nhận Người mua',
      readyStatus: 'Đã sẵn sàng công chứng',
      checklist: ['Người mua đã được ghi nhận', 'Thông tin các bên đã che', 'Bộ hồ sơ HĐMB sẵn sàng chuyển VPCC'],
      financeContext: 'Người mua chọn trao đổi nhu cầu tài chính ở mức tổng quan; không chia sẻ hồ sơ tín dụng.',
      financeConsent: {
        status: 'granted',
        label: 'Đã đồng ý chia sẻ ngữ cảnh tổng quan (mô phỏng)',
      },
    },
    notary: {
      dossierId: 'HSCC-HN-00031',
      office: 'Văn phòng công chứng Minh Tâm (mô phỏng)',
      initialStatus: 'Chưa nộp',
      acceptedStatus: 'Đã tiếp nhận',
      signedStatus: 'Đã ký công chứng',
      supplementRequired: false,
      correlationId: 'VPCC-HN-260819-031',
      evidence: 'PROPOSAL',
    },
    transfer: {
      route: 'developer',
      ownerLabel: 'Chủ đầu tư',
      reason: 'Hồ sơ mô phỏng gắn với HĐMB của Unit thuộc Project nên hệ thống điều phối sang tuyến Chủ đầu tư.',
      intakeId: 'CĐT-HN-260821-031',
      initialStatus: 'Chờ tiếp nhận',
      finalStatus: 'HĐMB mới đã bàn giao',
      resultReference: 'HDMB-MOI-S2-12A/2026',
      evidence: 'PROPOSAL',
    },
    integrations: sharedIntegrations,
    sourceRecords: [
      {
        id: 'SRC-S2-12A-HS-BAN',
        label: 'Hồ sơ bên bán đã che thông tin',
        sourceKey: 'HS-BAN-S2-12A',
        retrievedAt: '2026-08-10T08:40:00+07:00',
        effectiveAt: '2026-08-10T00:00:00+07:00',
        confidenceLabel: 'Dữ liệu mô phỏng',
        editable: false,
        evidence: 'PROPOSAL',
        source: 'Hồ sơ bên bán mẫu do nhóm demo chuẩn hóa',
      },
      {
        id: 'SRC-S2-12A-HDMB',
        label: 'HĐMB đã che thông tin cá nhân',
        sourceKey: 'HDMB-S2-12A',
        retrievedAt: '2026-08-10T08:42:00+07:00',
        effectiveAt: '2026-08-10T00:00:00+07:00',
        confidenceLabel: 'Dữ liệu mô phỏng',
        editable: false,
        evidence: 'PROPOSAL',
        source: 'Hợp đồng mua bán mẫu đã che thông tin',
      },
    ],
    chronology: [
      { actionId: 'match-property', at: '2026-08-10T09:05:00+07:00', label: 'Đối chiếu Bất động sản và gửi xác nhận' },
      { actionId: 'confirm-representation', at: '2026-08-11T10:15:00+07:00', label: 'Người bán xác nhận quyền đại diện' },
      { actionId: 'create-listing', at: '2026-08-12T08:30:00+07:00', label: 'VMLS khởi tạo PLID' },
      { actionId: 'record-buyer', at: '2026-08-13T14:20:00+07:00', label: 'Ghi nhận Người mua' },
      { actionId: 'confirm-readiness', at: '2026-08-14T09:10:00+07:00', label: 'Xác nhận sẵn sàng công chứng' },
      { actionId: 'submit-notary-dossier', at: '2026-08-17T09:45:00+07:00', label: 'VPCC tiếp nhận hồ sơ' },
      { actionId: 'record-signing', at: '2026-08-19T15:30:00+07:00', label: 'VPCC ghi nhận đã ký' },
      { actionId: 'create-transaction', at: '2026-08-19T15:32:00+07:00', label: 'VMLS tạo PTID và xác định tuyến' },
      { actionId: 'accept-developer-dossier', at: '2026-08-21T10:00:00+07:00', label: 'Chủ đầu tư tiếp nhận hồ sơ HĐMB' },
      { actionId: 'confirm-developer-transfer', at: '2026-08-24T16:10:00+07:00', label: 'Chủ đầu tư xác nhận chuyển nhượng' },
      { actionId: 'deliver-new-contract', at: '2026-08-26T09:00:00+07:00', label: 'Người mua nhận HĐMB mới' },
    ],
    initialAuditEvents: [
      {
        id: 'AUD-S2-12A-001',
        at: '2026-08-10T08:45:00+07:00',
        actorRoleId: 'vmls',
        actorLabel: 'VMLS · Dữ liệu mẫu',
        action: 'Nạp hồ sơ mô phỏng',
        targetType: 'property',
        targetId: 'NPID-HN-09876',
        summary: 'Khởi tạo hồ sơ minh họa từ storyboard v2; chưa thực hiện hành động giao dịch.',
        reason: 'Chuẩn bị hành trình demo công khai.',
        evidence: 'PROPOSAL',
      },
    ],
  },
  {
    id: 'phu-thuong-landed-home',
    slug: 'phu-thuong-landed-home',
    title: 'Đăng ký biến động · Nhà ở Phú Thượng',
    shortTitle: 'Nhà ở · Phú Thượng',
    route: 'land_registry',
    routeLabel: 'Tuyến Văn phòng đăng ký đất đai',
    routeOwnerRoleId: 'land_registry',
    isSynthetic: true,
    badge: 'Dữ liệu giả lập',
    summary: 'Một nhà ở riêng lẻ có Giấy chứng nhận đi tuyến VPĐKĐĐ và trải qua một lần yêu cầu bổ sung có thể xử lý.',
    chronologyLabel: 'Dòng thời gian cố định · 11–28/08/2026',
    property: {
      id: 'NPID-HN-10421',
      objectLabel: 'Bất động sản',
      name: 'Nhà ở riêng lẻ Phú Thượng',
      type: 'Nhà ở riêng lẻ gắn với đất',
      project: null,
      unit: null,
      location: 'Phường Phú Thượng, Hà Nội',
      addressVisibility: 'Số nhà và số thửa đã che trong bản demo công khai',
      status: 'Đã tạo hồ sơ giả lập',
      areas: [
        {
          kind: 'land',
          label: 'Diện tích đất',
          value: 72,
          displayValue: '72 m²',
          unit: 'm²',
          sourceLabel: 'Trích lục Giấy chứng nhận giả lập đã che số thửa',
          sourceKey: 'GCN-GIA-LAP-PTH/DT-DAT',
          evidence: 'PROPOSAL',
        },
        {
          kind: 'floor',
          label: 'Tổng diện tích sàn',
          value: 216,
          displayValue: '216 m²',
          unit: 'm²',
          sourceLabel: 'Phiếu hiện trạng nhà ở giả lập',
          sourceKey: 'HT-NHA-PTH/DT-SAN',
          evidence: 'PROPOSAL',
        },
      ],
      identityNote: 'Diện tích đất và diện tích sàn là hai thuộc tính khác nhau; dữ liệu giả lập không đại diện hồ sơ địa chính thật.',
    },
    listing: {
      id: 'PLID-HN-00208',
      objectLabel: 'Tin bán',
      transactionType: 'Bán',
      initialStatus: 'Chưa khởi tạo',
      createdStatus: 'Đã khởi tạo',
      activeStatus: null,
      askingPrice: { value: 21800000000, displayValue: '21,8 tỷ đồng', currency: 'VND', evidence: 'PROPOSAL' },
      representationStatus: 'Chờ Người bán xác nhận',
      distributionChannels: ['HouseNow'],
      scopeNote: '“Tin bán” trong demo này chỉ dùng cho nhu cầu bán hoặc chuyển nhượng.',
    },
    transaction: {
      id: 'PTID-HN-00044',
      objectLabel: 'Giao dịch',
      initialStatus: 'Chưa khởi tạo',
      createdStatus: 'Đã ký công chứng',
      finalStatus: 'Đã ghi nhận đăng ký biến động',
      route: 'land_registry',
      identifierDisclaimer: 'PTID là mã tham chiếu của bản demo VMLS; thẩm quyền cấp mã chính thức vẫn cần xác nhận.',
      evidence: 'PROPOSAL',
    },
    parties: {
      seller: {
        roleId: 'seller',
        displayName: 'L• T•• H• (giả lập)',
        organization: null,
        contact: maskedContact('09•• ••• 401', 'h•••@vi-du.vn', 'CCCD •••• 6401'),
      },
      buyer: {
        roleId: 'buyer',
        displayName: 'P••• M••• K• (giả lập)',
        organization: null,
        contact: maskedContact('09•• ••• 927', 'k•••@vi-du.vn', 'CCCD •••• 1927'),
      },
      agent: {
        roleId: 'agent',
        displayName: 'V• T•••• L• (giả lập)',
        organization: 'Sàn môi giới An Cư (mô phỏng)',
        contact: maskedContact('09•• ••• 635', 'l•••@vi-du.vn', 'Mã môi giới ••635'),
      },
    },
    readiness: {
      initialStatus: 'Chưa ghi nhận Người mua',
      readyStatus: 'Đã sẵn sàng công chứng',
      checklist: ['Người mua đã được ghi nhận', 'Thông tin các bên đã che', 'Tài liệu Giấy chứng nhận giả lập đã đính kèm'],
      financeContext: 'Người mua chưa chia sẻ nhu cầu vay; Ngân hàng chỉ thấy trạng thái “Chưa có đồng ý”.',
      financeConsent: {
        status: 'none',
        label: 'Chưa có đồng ý chia sẻ',
      },
    },
    notary: {
      dossierId: 'HSCC-HN-00044',
      office: 'Văn phòng công chứng Minh Tâm (mô phỏng)',
      initialStatus: 'Chưa nộp',
      acceptedStatus: 'Đã tiếp nhận',
      signedStatus: 'Đã ký công chứng',
      supplementRequired: true,
      supplementReason: 'Thiếu bản đối chiếu tình trạng hôn nhân đã che thông tin cá nhân.',
      supplementDocument: 'Bản xác nhận tình trạng hôn nhân giả lập · Đã che',
      correlationId: 'VPCC-HN-260825-044',
      evidence: 'PROPOSAL',
    },
    transfer: {
      route: 'land_registry',
      ownerLabel: 'Văn phòng đăng ký đất đai',
      reason: 'Hồ sơ giả lập ghi nhận Bất động sản đã có Giấy chứng nhận nên hệ thống điều phối sang tuyến VPĐKĐĐ.',
      intakeId: 'VPĐK-HN-260826-044',
      initialStatus: 'Chờ tiếp nhận qua API mô phỏng',
      finalStatus: 'Đã ghi nhận đăng ký biến động',
      resultReference: 'KQ-ĐKBĐ-260828-044',
      evidence: 'PROPOSAL',
    },
    integrations: sharedIntegrations,
    sourceRecords: [
      {
        id: 'SRC-PTH-GCN',
        label: 'Trích lục Giấy chứng nhận giả lập',
        sourceKey: 'GCN-GIA-LAP-PTH',
        retrievedAt: '2026-08-11T08:15:00+07:00',
        effectiveAt: '2026-08-11T00:00:00+07:00',
        confidenceLabel: 'Dữ liệu giả lập',
        editable: false,
        evidence: 'PROPOSAL',
        source: 'Giấy chứng nhận giả lập do nhóm demo tạo',
      },
      {
        id: 'SRC-PTH-HIEN-TRANG',
        label: 'Phiếu hiện trạng nhà ở giả lập',
        sourceKey: 'HT-NHA-PTH',
        retrievedAt: '2026-08-11T08:18:00+07:00',
        effectiveAt: '2026-08-11T00:00:00+07:00',
        confidenceLabel: 'Dữ liệu giả lập',
        editable: false,
        evidence: 'PROPOSAL',
        source: 'Phiếu hiện trạng nhà ở giả lập do nhóm demo tạo',
      },
    ],
    chronology: [
      { actionId: 'match-property', at: '2026-08-11T09:00:00+07:00', label: 'Đối chiếu Bất động sản và gửi xác nhận' },
      { actionId: 'confirm-representation', at: '2026-08-12T11:20:00+07:00', label: 'Người bán xác nhận quyền đại diện' },
      { actionId: 'create-listing', at: '2026-08-13T08:45:00+07:00', label: 'VMLS khởi tạo PLID' },
      { actionId: 'record-buyer', at: '2026-08-17T13:30:00+07:00', label: 'Ghi nhận Người mua' },
      { actionId: 'confirm-readiness', at: '2026-08-18T09:05:00+07:00', label: 'Xác nhận sẵn sàng công chứng' },
      { actionId: 'submit-notary-dossier', at: '2026-08-19T10:10:00+07:00', label: 'VPCC tiếp nhận hồ sơ' },
      { actionId: 'request-supplement', at: '2026-08-19T14:40:00+07:00', label: 'VPCC yêu cầu bổ sung' },
      { actionId: 'provide-supplement', at: '2026-08-20T09:25:00+07:00', label: 'Người bán gửi tài liệu bổ sung' },
      { actionId: 'record-signing', at: '2026-08-25T15:00:00+07:00', label: 'VPCC ghi nhận đã ký' },
      { actionId: 'create-transaction', at: '2026-08-25T15:02:00+07:00', label: 'VMLS tạo PTID và xác định tuyến' },
      { actionId: 'approve-land-transfer', at: '2026-08-28T10:20:00+07:00', label: 'VPĐKĐĐ trả kết quả đăng ký biến động' },
    ],
    initialAuditEvents: [
      {
        id: 'AUD-PTH-001',
        at: '2026-08-11T08:20:00+07:00',
        actorRoleId: 'vmls',
        actorLabel: 'VMLS · Dữ liệu mẫu',
        action: 'Nạp hồ sơ giả lập',
        targetType: 'property',
        targetId: 'NPID-HN-10421',
        summary: 'Khởi tạo hồ sơ nhà ở riêng lẻ hoàn toàn giả lập; chưa thực hiện hành động giao dịch.',
        reason: 'Minh họa tuyến Văn phòng đăng ký đất đai và ngoại lệ bổ sung hồ sơ.',
        evidence: 'PROPOSAL',
      },
    ],
  },
])

export const ROLE_PROJECTIONS = Object.freeze({
  agent: {
    roleId: 'agent',
    headline: 'Từ nhu cầu bán đến một hồ sơ có thể theo dõi',
    cards: ['Danh tính Bất động sản và nguồn đối chiếu', 'Quyền đại diện và Tin bán phụ trách', 'Tiến độ công chứng và tuyến chuyển quyền'],
    hidden: ['Định danh đầy đủ của Người mua', 'Hồ sơ tín dụng', 'Ghi chú nội bộ của đơn vị tiếp nhận'],
    allowedActions: ['match_property', 'request_seller_confirmation', 'record_buyer', 'provide_supplement'],
    evidence: 'PROPOSAL',
  },
  brokerage: {
    roleId: 'brokerage',
    headline: 'Một hàng đợi chất lượng thay cho chuỗi trao đổi rời rạc',
    cards: ['Tính đầy đủ của quyền đại diện', 'Trạng thái Tin bán trong phạm vi sàn', 'Điểm nghẽn và yêu cầu bổ sung'],
    hidden: ['Hồ sơ định danh đầy đủ của các bên', 'Tài liệu ngoài mục đích điều phối'],
    allowedActions: [],
    supplemental: true,
    evidence: 'PROPOSAL',
  },
  developer: {
    roleId: 'developer',
    headline: 'Chỉ nhận đúng hồ sơ thuộc tuyến HĐMB',
    cards: ['Dự án và Căn liên quan', 'Kết quả công chứng tối thiểu', 'Tiếp nhận và xác nhận chuyển nhượng HĐMB'],
    hidden: ['Hồ sơ tuyến VPĐKĐĐ', 'Ghi chú môi giới', 'Nhu cầu tài chính của Người mua'],
    allowedActions: ['developer_intake', 'developer_confirm_transfer'],
    evidence: 'PROPOSAL',
  },
  buyer: {
    roleId: 'buyer',
    headline: 'Biết mình đang mua gì và hồ sơ đang ở đâu',
    cards: ['Thông tin Tin bán được phép', 'Danh mục sẵn sàng của chính mình', 'Tiến độ và kết quả chuyển quyền'],
    hidden: ['Liên hệ riêng của Người bán', 'Ghi chú sàn', 'Nhật ký kỹ thuật đầy đủ'],
    allowedActions: ['verify_readiness', 'buyer_receive_contract'],
    evidence: 'PROPOSAL',
  },
  seller: {
    roleId: 'seller',
    headline: 'Quyền đại diện được xác nhận rõ và có lịch sử',
    cards: ['Bất động sản thuộc hồ sơ của mình', 'Nội dung xác nhận quyền đại diện', 'Các mốc công chứng và chuyển quyền được phép'],
    hidden: ['Định danh đầy đủ của Người mua', 'Đánh giá tín dụng', 'Ghi chú nghiệp vụ nội bộ'],
    allowedActions: ['confirm_representation'],
    evidence: 'PROPOSAL',
  },
  bank: {
    roleId: 'bank',
    headline: 'Ngữ cảnh tài chính tối thiểu, đúng mục đích',
    cards: ['Giá đề nghị và loại Bất động sản', 'Trạng thái đồng ý chia sẻ', 'Mốc sẵn sàng giao dịch'],
    hidden: ['Tài liệu công chứng', 'Định danh Người bán', 'Lịch sử tích hợp không phục vụ tài chính'],
    allowedActions: [],
    supplemental: true,
    evidence: 'PROPOSAL',
  },
  vmls: {
    roleId: 'vmls',
    headline: 'Một sổ đăng ký sống nối danh tính, quyền và trạng thái',
    cards: ['NPID, PLID và PTID là ba đối tượng riêng', 'Nguồn và lịch sử nối tiếp', 'Trạng thái tích hợp và lý do điều phối'],
    hidden: ['Dữ liệu nguồn không cần thiết cho mục đích điều phối'],
    allowedActions: ['create_listing', 'create_transaction'],
    evidence: 'PROPOSAL',
  },
  notary: {
    roleId: 'notary',
    headline: 'Văn phòng công chứng làm việc trong hồ sơ nghiệp vụ riêng',
    cards: ['Các bên và Bất động sản cần công chứng', 'Danh mục hồ sơ và tài liệu bổ sung', 'Kết quả ký và mã tương quan'],
    hidden: ['Phân phối Tin bán', 'Ngữ cảnh ngân hàng', 'Ghi chú không thuộc hồ sơ công chứng'],
    allowedActions: ['submit_notary_dossier', 'request_supplement', 'record_notary_signing'],
    evidence: 'PROPOSAL',
  },
  land_registry: {
    roleId: 'land_registry',
    headline: 'Chỉ nhận hồ sơ được điều phối sang tuyến đất đai',
    cards: ['Bất động sản và căn cứ tuyến', 'Kết quả công chứng tối thiểu', 'Kết quả đăng ký biến động'],
    hidden: ['Hồ sơ tuyến Chủ đầu tư', 'Phân phối Tin bán', 'Nhu cầu tài chính của Người mua'],
    allowedActions: ['approve_land_registry'],
    evidence: 'PROPOSAL',
  },
})

export const PILOT_BRIEF = Object.freeze({
  eyebrow: 'Cùng thiết kế pilot VMLS',
  title: 'Chọn một lát cắt đủ nhỏ để kiểm chứng giá trị phối hợp',
  summary: 'Buổi demo không đề nghị mua một hệ thống hoàn chỉnh. Mục tiêu là chọn một hành trình pilot, dữ liệu được phép và các đơn vị cùng chịu trách nhiệm.',
  questions: [
    'Tuyến chuyển quyền nào nên được kiểm chứng trước?',
    'Đơn vị nào chịu trách nhiệm cho từng nguồn và trạng thái?',
    'Trường dữ liệu nào được xem công khai, trong ngành hoặc theo mục đích hạn chế?',
    'Mã PTID chính thức sẽ do ai cấp hoặc đối chiếu?',
    'Thành công của pilot được đo bằng thời gian, chất lượng dữ liệu hay khả năng truy vết nào?',
  ],
  proposedOutputs: [
    'Một hành trình ưu tiên và phạm vi địa bàn hoặc phân khúc',
    'Danh sách đầu mối của các tổ chức tham gia',
    'Bộ dữ liệu giả lập hoặc đã che được phép dùng',
    'Tiêu chí chấp nhận và ranh giới tích hợp',
  ],
  ctaLabel: 'Mở bản thảo pilot',
  disclaimer: 'Đây là đề xuất đồng thiết kế; không phải cam kết triển khai, hợp đồng hay phê duyệt pháp lý.',
  evidence: 'PROPOSAL',
})

// Alias công khai giúp giao diện và kiểm thử đọc dữ liệu theo cách gọi ngắn.
export const demoCases = DEMO_CASES
export const marketRoles = PRIMARY_ROLES
export const externalRoles = SYSTEM_ROLES
