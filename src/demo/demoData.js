// @ts-check

export const DEMO_VERSION = 'vmls-operations-2026-08-v2'
export const STORAGE_KEY = 'vmls:operations:2026-08:v2'

export const roles = Object.freeze([
  {
    id: 'agent',
    label: 'Môi giới',
    shortLabel: 'MG',
    group: 'Thị trường',
    defaultWorkspace: 'sellerDossiers',
    purpose: 'Đối chiếu bất động sản và hoàn thiện hồ sơ khách bán.',
  },
  {
    id: 'brokerage',
    label: 'Sàn môi giới',
    shortLabel: 'SÀN',
    group: 'Thị trường',
    defaultWorkspace: 'coordination',
    purpose: 'Theo dõi quyền đại diện, SLA và điểm nghẽn trong phạm vi sàn.',
  },
  {
    id: 'seller',
    label: 'Người bán',
    shortLabel: 'NB',
    group: 'Thị trường',
    defaultWorkspace: 'sellerRequests',
    purpose: 'Xác nhận quyền đại diện và cung cấp tài liệu của hồ sơ.',
  },
  {
    id: 'buyer',
    label: 'Người mua',
    shortLabel: 'NM',
    group: 'Thị trường',
    defaultWorkspace: 'purchaseDossiers',
    purpose: 'Xác nhận sẵn sàng công chứng và tiếp nhận kết quả.',
  },
  {
    id: 'bank',
    label: 'Ngân hàng',
    shortLabel: 'NH',
    group: 'Thị trường',
    defaultWorkspace: 'sharedDossiers',
    purpose: 'Xử lý các hồ sơ được đồng ý chia sẻ cho mục đích tài chính.',
  },
  {
    id: 'developer',
    label: 'Chủ đầu tư',
    shortLabel: 'CĐT',
    group: 'Thị trường',
    defaultWorkspace: 'contractTransfers',
    purpose: 'Tiếp nhận và xác nhận chuyển nhượng hợp đồng mua bán.',
  },
  {
    id: 'vmls',
    label: 'Vận hành VMLS',
    shortLabel: 'VMLS',
    group: 'Vận hành dữ liệu',
    defaultWorkspace: 'integrations',
    purpose: 'Theo dõi danh tính bản ghi, nguồn dữ liệu và sự kiện tích hợp.',
  },
  {
    id: 'notary',
    label: 'Văn phòng công chứng',
    shortLabel: 'VPCC',
    group: 'Đơn vị xử lý',
    defaultWorkspace: 'notaryDossiers',
    purpose: 'Tiếp nhận, kiểm tra và trả kết quả hồ sơ công chứng.',
  },
  {
    id: 'landRegistry',
    label: 'Văn phòng đăng ký đất đai',
    shortLabel: 'VPĐKĐĐ',
    group: 'Đơn vị xử lý',
    defaultWorkspace: 'landTransfers',
    purpose: 'Tiếp nhận hồ sơ đăng ký biến động và trả kết quả sang tên.',
  },
])

export const marketRoles = Object.freeze(
  roles.filter(({ id }) => ['agent', 'brokerage', 'seller', 'buyer', 'bank', 'developer'].includes(id)),
)

export const externalRoles = Object.freeze(
  roles.filter(({ id }) => ['vmls', 'notary', 'landRegistry'].includes(id)),
)

export const workspaceDefinitions = Object.freeze({
  agent: [
    { id: 'sellerDossiers', label: 'Hồ sơ khách bán' },
    { id: 'properties', label: 'Bất động sản' },
    { id: 'listings', label: 'Tin bán' },
    { id: 'transactions', label: 'Giao dịch' },
  ],
  brokerage: [
    { id: 'coordination', label: 'Điều phối hồ sơ' },
    { id: 'listings', label: 'Tin bán' },
    { id: 'dataQuality', label: 'Chất lượng dữ liệu' },
  ],
  seller: [
    { id: 'sellerRequests', label: 'Yêu cầu xác nhận' },
    { id: 'properties', label: 'Bất động sản' },
    { id: 'listings', label: 'Tin bán' },
  ],
  buyer: [
    { id: 'purchaseDossiers', label: 'Hồ sơ mua' },
    { id: 'contracts', label: 'Hợp đồng mua bán' },
  ],
  bank: [{ id: 'sharedDossiers', label: 'Hồ sơ được chia sẻ' }],
  developer: [{ id: 'contractTransfers', label: 'Chuyển nhượng HĐMB' }],
  vmls: [
    { id: 'integrations', label: 'Tích hợp và nguồn' },
    { id: 'properties', label: 'Bất động sản' },
    { id: 'listings', label: 'Tin bán' },
    { id: 'transactions', label: 'Giao dịch' },
    { id: 'audit', label: 'Nhật ký' },
  ],
  notary: [{ id: 'notaryDossiers', label: 'Hồ sơ công chứng' }],
  landRegistry: [{ id: 'landTransfers', label: 'Đăng ký biến động' }],
})

export const sourceRegistry = Object.freeze([
  {
    id: 'source-357',
    name: 'Cổng thông tin về nhà ở và thị trường bất động sản',
    owner: 'Bộ Xây dựng',
    category: 'Nguồn dữ liệu công khai',
    dataCategory: 'Thông tin nhà ở và thị trường bất động sản',
    url: 'https://thongtinbds.moc.gov.vn/',
    capturedOn: '15/08/2026',
    screenshot: '/assets/demo/357-homepage-2026-08-15.png',
    connectionStatus: 'Chưa cấu hình',
    recordCoverage: 'Trang chủ công khai; không có bản ghi thuộc hai hồ sơ đang xử lý.',
    lastCheckedAt: '2026-08-15T08:15:00+07:00',
  },
])

export const ecosystemConnections = Object.freeze([
  {
    id: 'vneid',
    name: 'VNeID',
    owner: 'Trung tâm dữ liệu quốc gia về dân cư',
    relationship: 'Điểm xác nhận người bán',
    direction: 'Nhận kết quả xác nhận',
    status: 'Chưa kết nối',
    url: 'https://play.google.com/store/apps/details?hl=vi&id=com.vnid',
    capturedOn: '15/08/2026',
    screenshot: '/assets/demo/vneid-google-play-2026-08-15.png',
    inputLabel: 'Dữ liệu gửi',
    inputFields: ['Mã yêu cầu', 'NPID', 'Phạm vi đại diện', 'Thời hạn hiệu lực'],
    outputLabel: 'Dữ liệu nhận',
    outputFields: ['Mã xác nhận', 'Kết quả', 'Thời điểm xác nhận'],
  },
  {
    id: 'source-357',
    name: 'Hệ thống thông tin về nhà ở và thị trường bất động sản',
    owner: 'Bộ Xây dựng',
    relationship: 'Nguồn tham chiếu công khai',
    direction: 'Tham chiếu nguồn',
    status: 'Chưa cấu hình',
    url: 'https://thongtinbds.moc.gov.vn/',
    capturedOn: '15/08/2026',
    screenshot: '/assets/demo/357-homepage-2026-08-15.png',
    inputLabel: 'Dữ liệu gửi',
    inputFields: ['Không có'],
    outputLabel: 'Dữ liệu nhận',
    outputFields: ['Chưa có dữ liệu cấp hồ sơ'],
  },
  {
    id: 'housenow',
    name: 'HouseNow · Căn hộ chung cư',
    owner: 'HouseNow',
    relationship: 'Kênh phân phối Tin bán',
    direction: 'Chuẩn bị dữ liệu gửi',
    status: 'Chưa phát hành',
    url: 'https://www.housenow.com.vn/can-ho-chung-cu',
    capturedOn: '15/08/2026',
    screenshot: '/assets/demo/housenow-can-ho-2026-08-15.png',
    icon: '/assets/demo/housenow-icon.png',
    inputLabel: 'Dữ liệu gửi',
    inputFields: ['PLID', 'Tiêu đề', 'Giá', 'Thông tin BĐS', 'Nội dung và ảnh được chọn'],
    outputLabel: 'Dữ liệu nhận',
    outputFields: ['Trạng thái bàn giao', 'Thời điểm cập nhật'],
  },
])

const maskedParty = (reference, displayName, phone, identityRef, organization = null) => ({
  reference,
  displayName,
  phone,
  identityRef,
  organization,
  masked: true,
})

const houseNowChannel = Object.freeze({
  id: 'housenow',
  name: 'HouseNow',
  icon: '/assets/demo/housenow-icon.png',
  status: 'Chưa phát hành',
  fieldScope: 'Tiêu đề, giá, thông tin BĐS, nội dung và ảnh được chọn',
  updatedAt: null,
})

export const demoCases = Object.freeze([
  {
    id: 'sun-grand-thuy-khue',
    dossierId: 'HS-KB-HN-00031',
    title: 'Căn hộ S2-12A · Thụy Khuê',
    customerLabel: 'T••• M••• A•••',
    ownerLabel: 'N••• H••• N••',
    brokerageLabel: 'Sàn An Cư',
    priority: 'Bình thường',
    slaDueAt: '2026-08-27T17:00:00+07:00',
    expectedRoute: 'developer',
    property: {
      id: 'NPID-HN-09876',
      name: 'Căn hộ S2-12A',
      type: 'Căn hộ thuộc dự án',
      project: 'Sun Grand City Thụy Khuê Residence',
      unit: 'S2-12A',
      location: 'Thụy Khuê, Tây Hồ, Hà Nội',
      candidates: [
        {
          id: 'NPID-HN-09876',
          title: 'S2-12A · Sun Grand City Thụy Khuê Residence',
          label: 'S2-12A · Sun Grand City Thụy Khuê Residence',
          location: 'Thụy Khuê, Tây Hồ, Hà Nội',
          matchSignals: ['Mã căn', 'Dự án', 'Hai khái niệm diện tích'],
        },
        {
          id: 'NPID-HN-09341',
          title: 'S2-12 · Sun Grand City Thụy Khuê Residence',
          label: 'S2-12 · Sun Grand City Thụy Khuê Residence',
          location: 'Thụy Khuê, Tây Hồ, Hà Nội',
          matchSignals: ['Cùng dự án', 'Khác mã căn'],
        },
      ],
      areas: [
        {
          kind: 'usable',
          label: 'Diện tích thông thủy',
          value: 69.2,
          unit: 'm²',
          sourceId: 'SRC-HDMB-S2-12A',
          sourceLabel: 'Hợp đồng mua bán',
        },
        {
          kind: 'gross',
          label: 'Diện tích tim tường',
          value: 82.3,
          unit: 'm²',
          sourceId: 'SRC-HDMB-S2-12A',
          sourceLabel: 'Hợp đồng mua bán',
        },
      ],
      sourceRecords: [
        {
          id: 'SRC-HDMB-S2-12A',
          label: 'Hợp đồng mua bán đã che thông tin',
          documentRef: 'HDMB-S2-12A/2024',
          receivedAt: '2026-08-10T08:42:00+07:00',
        },
        {
          id: 'SRC-HS-BAN-S2-12A',
          label: 'Hồ sơ bên bán đã che thông tin',
          documentRef: 'HS-BAN-S2-12A',
          receivedAt: '2026-08-10T08:40:00+07:00',
        },
      ],
    },
    representation: {
      id: 'REP-HN-00031',
      confirmationChannel: 'VNeID',
      allowedScopes: ['Độc quyền', 'Không độc quyền'],
    },
    listing: {
      id: 'PLID-HN-00125',
      transactionType: 'Chuyển nhượng',
      askingPrice: { value: 15800000000, displayValue: '15,8 tỷ đồng', currency: 'VND' },
      channel: houseNowChannel,
    },
    readiness: {
      financeSharing: {
        shareId: 'CS-8F2D1A',
        purpose: 'Trao đổi nhu cầu tài chính',
        visibleFields: ['Loại bất động sản', 'Giá thỏa thuận', 'Mốc sẵn sàng'],
      },
    },
    notary: {
      id: 'HSCC-HN-00031',
      office: 'Văn phòng công chứng Minh Tâm',
      correlationId: 'VPCC-HN-260819-031',
      resultRef: 'KQCC-HN-260822-031',
      requiredDocumentIds: ['seller-identity', 'buyer-identity', 'sale-contract', 'representation'],
      documents: [
        { id: 'seller-identity', label: 'Giấy tờ định danh bên bán' },
        { id: 'buyer-identity', label: 'Giấy tờ định danh bên mua' },
        { id: 'sale-contract', label: 'Hợp đồng mua bán' },
        { id: 'representation', label: 'Xác nhận quyền đại diện' },
      ],
      requiresSupplement: false,
      supplement: null,
    },
    transaction: {
      id: 'PTID-HN-00031',
    },
    transfer: {
      basis: 'Hợp đồng mua bán với chủ đầu tư',
      route: 'developer',
      intakeRef: 'CDT-HN-260824-031',
      resultRef: 'HDMB-MOI-S2-12A/2026',
      contractReference: 'HDMB-MOI-S2-12A/2026',
    },
    parties: {
      seller: maskedParty('NB-HN-0031', 'T••• M••• A•••', '09•• ••• 218', 'CCCD •••• 1842'),
      buyer: maskedParty('NM-HN-0031', 'N••• V••• A•', '09•• ••• 506', 'CCCD •••• 5076'),
      agent: maskedParty('MG-HN-0831', 'N••• H••• N••', '09•• ••• 831', 'Mã môi giới ••831', 'Sàn An Cư'),
    },
    actionTimes: {
      match_property: '2026-08-10T09:05:00+07:00',
      request_seller_confirmation: '2026-08-10T09:07:00+07:00',
      confirm_representation: '2026-08-12T10:15:00+07:00',
      record_buyer: '2026-08-14T14:20:00+07:00',
      verify_readiness: '2026-08-17T09:10:00+07:00',
      submit_notary_dossier: '2026-08-19T09:45:00+07:00',
      record_notary_signing: '2026-08-22T15:30:00+07:00',
      developer_intake: '2026-08-24T09:00:00+07:00',
      developer_confirm_transfer: '2026-08-25T16:30:00+07:00',
      buyer_receive_contract: '2026-08-26T10:30:00+07:00',
    },
  },
  {
    id: 'phu-thuong-landed-home',
    dossierId: 'HS-KB-HN-00044',
    title: 'Nhà ở · Phú Thượng',
    customerLabel: 'L••• T••• H•••',
    ownerLabel: 'P••• Q••• M•••',
    brokerageLabel: 'Sàn An Cư',
    priority: 'Cao',
    slaDueAt: '2026-08-29T17:00:00+07:00',
    expectedRoute: 'landRegistry',
    property: {
      id: 'NPID-HN-10421',
      name: 'Nhà ở Phú Thượng',
      type: 'Nhà ở riêng lẻ',
      project: null,
      unit: null,
      location: 'Phú Thượng, Tây Hồ, Hà Nội',
      candidates: [
        {
          id: 'NPID-HN-10421',
          title: 'Thửa 118, tờ bản đồ 24',
          label: 'Thửa 118, tờ bản đồ 24',
          location: 'Phú Thượng, Tây Hồ, Hà Nội',
          matchSignals: ['Số thửa', 'Tờ bản đồ', 'Diện tích đất'],
        },
        {
          id: 'NPID-HN-10418',
          title: 'Thửa 181, tờ bản đồ 24',
          label: 'Thửa 181, tờ bản đồ 24',
          location: 'Phú Thượng, Tây Hồ, Hà Nội',
          matchSignals: ['Cùng tờ bản đồ', 'Khác số thửa'],
        },
      ],
      areas: [
        {
          kind: 'land',
          label: 'Diện tích đất',
          value: 72,
          unit: 'm²',
          sourceId: 'SRC-GCN-PTH-118',
          sourceLabel: 'Giấy chứng nhận',
        },
        {
          kind: 'floor',
          label: 'Tổng diện tích sàn',
          value: 216,
          unit: 'm²',
          sourceId: 'SRC-GCN-PTH-118',
          sourceLabel: 'Giấy chứng nhận',
        },
      ],
      sourceRecords: [
        {
          id: 'SRC-GCN-PTH-118',
          label: 'Giấy chứng nhận đã che thông tin',
          documentRef: 'GCN-T118-BD24',
          receivedAt: '2026-08-11T08:12:00+07:00',
        },
        {
          id: 'SRC-HS-BAN-PTH-118',
          label: 'Hồ sơ bên bán đã che thông tin',
          documentRef: 'HS-BAN-PTH-118',
          receivedAt: '2026-08-11T08:14:00+07:00',
        },
      ],
    },
    representation: {
      id: 'REP-HN-00044',
      confirmationChannel: 'VNeID',
      allowedScopes: ['Độc quyền', 'Không độc quyền'],
    },
    listing: {
      id: 'PLID-HN-00208',
      transactionType: 'Bán',
      askingPrice: { value: 24600000000, displayValue: '24,6 tỷ đồng', currency: 'VND' },
      channel: houseNowChannel,
    },
    readiness: {
      financeSharing: {
        shareId: 'CS-41C7E9',
        purpose: 'Trao đổi nhu cầu tài chính',
        visibleFields: ['Loại bất động sản', 'Giá thỏa thuận', 'Mốc sẵn sàng'],
      },
    },
    notary: {
      id: 'HSCC-HN-00044',
      office: 'Văn phòng công chứng Minh Tâm',
      correlationId: 'VPCC-HN-260818-044',
      resultRef: 'KQCC-HN-260826-044',
      requiredDocumentIds: ['seller-identity', 'buyer-identity', 'land-certificate', 'representation'],
      documents: [
        { id: 'seller-identity', label: 'Giấy tờ định danh bên bán' },
        { id: 'buyer-identity', label: 'Giấy tờ định danh bên mua' },
        { id: 'land-certificate', label: 'Giấy chứng nhận' },
        { id: 'representation', label: 'Xác nhận quyền đại diện' },
      ],
      requiresSupplement: true,
      supplement: {
        reasonCode: 'MISSING_MARITAL_STATUS',
        documentType: 'Xác nhận tình trạng hôn nhân',
      },
    },
    transaction: {
      id: 'PTID-HN-00044',
    },
    transfer: {
      basis: 'Giấy chứng nhận quyền sử dụng đất',
      route: 'landRegistry',
      intakeRef: 'VPDKDD-HN-260826-044',
      resultRef: 'DKBD-HN-260828-044',
      contractReference: null,
    },
    parties: {
      seller: maskedParty('NB-HN-0044', 'L••• T••• H•••', '09•• ••• 731', 'CCCD •••• 2941'),
      buyer: maskedParty('NM-HN-0044', 'V••• T••• L•••', '09•• ••• 945', 'CCCD •••• 9135'),
      agent: maskedParty('MG-HN-0246', 'P••• Q••• M•••', '09•• ••• 246', 'Mã môi giới ••246', 'Sàn An Cư'),
    },
    actionTimes: {
      match_property: '2026-08-11T08:35:00+07:00',
      request_seller_confirmation: '2026-08-11T08:38:00+07:00',
      confirm_representation: '2026-08-12T10:10:00+07:00',
      record_buyer: '2026-08-14T15:20:00+07:00',
      verify_readiness: '2026-08-17T09:00:00+07:00',
      submit_notary_dossier: '2026-08-18T10:30:00+07:00',
      request_supplement: '2026-08-19T14:40:00+07:00',
      provide_supplement: '2026-08-20T09:25:00+07:00',
      record_notary_signing: '2026-08-26T10:00:00+07:00',
      approve_land_registry: '2026-08-28T14:30:00+07:00',
    },
  },
])

export function getDemoCase(caseId) {
  return demoCases.find(({ id }) => id === caseId) ?? null
}

export function getActionTime(caseId, actionType) {
  return getDemoCase(caseId)?.actionTimes[actionType] ?? null
}
