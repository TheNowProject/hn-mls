// @ts-check

export const V5_SCHEMA_VERSION = 6
export const V5_SCHEMA = 'vmls-phu-thuong-representation-transaction-v6'
export const V5_STORAGE_KEY = 'vmls:phu-thuong:2026-08:v6'
export const V5_PRIMARY_CASE_ID = 'phu-thuong-title-transfer'
export const PRIMARY_PROPERTY_ID = 'NPID-HN-10421'
export const PRIMARY_LISTING_ID = 'PLID-HN-00208'
export const HOUSING_MARKET_INFORMATION_SYSTEM_NAME = 'Hệ thống thông tin về nhà ở và thị trường bất động sản'

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) deepFreeze(child)
  }
  return value
}

export const V5_ROLES = deepFreeze([
  {
    id: 'agent',
    label: 'Môi giới',
    shortLabel: 'MG',
    organization: 'HouseNow',
    purpose: 'Xin quyền đại diện, theo dõi Tin bán được khởi tạo và khai báo giao dịch đã công chứng.',
  },
  {
    id: 'brokerage',
    label: 'Sàn môi giới',
    shortLabel: 'SÀN',
    organization: 'Sàn HouseNow',
    purpose: 'Giám sát quyền đại diện, Tin bán và hồ sơ giao dịch trong phạm vi sàn.',
  },
  {
    id: 'seller',
    label: 'Người bán',
    shortLabel: 'NB',
    organization: null,
    accountContext: 'Tài khoản cá nhân',
    purpose: 'Xác nhận quyền đại diện và theo dõi thông báo liên quan.',
  },
  {
    id: 'buyer',
    label: 'Người mua',
    shortLabel: 'NM',
    organization: null,
    accountContext: 'Tài khoản cá nhân',
    purpose: 'Theo dõi kết quả sang tên và nhận thông báo trả kết quả.',
  },
  {
    id: 'vmls',
    label: 'Vận hành VMLS',
    shortLabel: 'VMLS',
    organization: 'VMLS Hà Nội',
    purpose: `Đồng bộ nguồn ${HOUSING_MARKET_INFORMATION_SYSTEM_NAME} và trạng thái xử lý ngoài VMLS.`,
  },
])

export const PUBLIC_LISTINGS = deepFreeze([
  {
    id: PRIMARY_LISTING_ID,
    propertyId: PRIMARY_PROPERTY_ID,
    title: 'Nhà phố Phú Thượng · Tây Hồ',
    propertyType: 'Nhà ở riêng lẻ',
    location: { ward: 'Phú Thượng', district: 'Tây Hồ', city: 'Hà Nội' },
    askingPrice: { value: 18_600_000_000, currency: 'VND' },
    area: { value: 72, unit: 'm²' },
    bedrooms: 4,
    status: 'Đang bán',
    provenance: {
      source: 'HouseNow',
      sourceKey: 'HN-LST-78421',
      sourceVersion: '2026.08.19-03',
      retrievedAt: '2026-08-20T08:30:00+07:00',
    },
  },
  {
    id: 'PLID-HN-00209',
    propertyId: 'NPID-HN-10422',
    title: 'Căn hộ Ngoại Giao Đoàn · Bắc Từ Liêm',
    propertyType: 'Căn hộ chung cư',
    location: { ward: 'Xuân Tảo', district: 'Bắc Từ Liêm', city: 'Hà Nội' },
    askingPrice: { value: 8_950_000_000, currency: 'VND' },
    area: { value: 118, unit: 'm²' },
    bedrooms: 3,
    status: 'Đang bán',
    provenance: {
      source: 'HouseNow',
      sourceKey: 'HN-LST-78435',
      sourceVersion: '2026.08.18-01',
      retrievedAt: '2026-08-20T08:30:00+07:00',
    },
  },
  {
    id: 'PLID-HN-00210',
    propertyId: 'NPID-HN-10423',
    title: 'Nhà phố Việt Hưng · Long Biên',
    propertyType: 'Nhà ở riêng lẻ',
    location: { ward: 'Việt Hưng', district: 'Long Biên', city: 'Hà Nội' },
    askingPrice: { value: 15_200_000_000, currency: 'VND' },
    area: { value: 84, unit: 'm²' },
    bedrooms: 5,
    status: 'Đang bán',
    provenance: {
      source: 'HouseNow',
      sourceKey: 'HN-LST-78394',
      sourceVersion: '2026.08.17-02',
      retrievedAt: '2026-08-20T08:30:00+07:00',
    },
  },
  {
    id: 'PLID-HN-00211',
    propertyId: 'NPID-HN-10424',
    title: 'Căn hộ Mỹ Đình · Nam Từ Liêm',
    propertyType: 'Căn hộ chung cư',
    location: { ward: 'Mỹ Đình 1', district: 'Nam Từ Liêm', city: 'Hà Nội' },
    askingPrice: { value: 6_780_000_000, currency: 'VND' },
    area: { value: 96, unit: 'm²' },
    bedrooms: 3,
    status: 'Đang bán',
    provenance: {
      source: 'HouseNow',
      sourceKey: 'HN-LST-78288',
      sourceVersion: '2026.08.16-04',
      retrievedAt: '2026-08-20T08:30:00+07:00',
    },
  },
  {
    id: 'PLID-HN-00212',
    propertyId: 'NPID-HN-10425',
    title: 'Nhà phố Văn Quán · Hà Đông',
    propertyType: 'Nhà ở riêng lẻ',
    location: { ward: 'Văn Quán', district: 'Hà Đông', city: 'Hà Nội' },
    askingPrice: { value: 13_500_000_000, currency: 'VND' },
    area: { value: 68, unit: 'm²' },
    bedrooms: 4,
    status: 'Đang bán',
    provenance: {
      source: 'HouseNow',
      sourceKey: 'HN-LST-78176',
      sourceVersion: '2026.08.15-01',
      retrievedAt: '2026-08-20T08:30:00+07:00',
    },
  },
])

export const PRIMARY_PROPERTY = deepFreeze({
  id: PRIMARY_PROPERTY_ID,
  label: 'Nhà phố Phú Thượng · Tây Hồ',
  type: 'Nhà ở riêng lẻ',
  certificateStatus: 'Đã có Giấy chứng nhận',
  location: {
    ward: 'Phú Thượng',
    district: 'Tây Hồ',
    city: 'Hà Nội',
  },
})

export const PRIMARY_REPRESENTATION = deepFreeze({
  id: 'REP-HN-00044',
  propertyId: PRIMARY_PROPERTY_ID,
  confirmationId: 'XND-HN-00044',
  confirmationChannel: 'Tài khoản VMLS',
  allowedScopes: ['Độc quyền', 'Không độc quyền'],
  parties: {
    seller: {
      reference: 'PARTY-SELLER-HN-0312',
      maskedName: 'Trần V••• A•••',
    },
    representative: {
      reference: 'PARTY-AGENT-HN-0246',
      maskedName: 'Phạm Q••• M•••',
      organization: 'HouseNow',
    },
  },
})

export const PRIMARY_REPRESENTATION_REQUEST_PAYLOAD = deepFreeze({
  propertyId: PRIMARY_PROPERTY_ID,
  scope: 'Độc quyền',
  startsOn: '2026-08-11',
  expiresOn: '2026-09-10',
})

export const PRIMARY_LISTING = deepFreeze({
  ...PUBLIC_LISTINGS.find(({ id }) => id === PRIMARY_LISTING_ID),
  representationId: PRIMARY_REPRESENTATION.id,
  seller: PRIMARY_REPRESENTATION.parties.seller,
})

export const HOUSE_NOW_SNAPSHOT = deepFreeze({
  id: 'HNSNAP-PLID-HN-00208-20260820',
  listingId: PRIMARY_LISTING_ID,
  propertyId: PRIMARY_PROPERTY_ID,
  externalListingId: 'HN-LST-78421',
  source: 'HouseNow',
  sourceVersion: '2026.08.19-03',
  sourceUpdatedAt: '2026-08-19T17:45:00+07:00',
  retrievedAt: '2026-08-20T08:30:00+07:00',
  payload: {
    title: 'Nhà phố Phú Thượng · Tây Hồ',
    askingPrice: { value: 18_600_000_000, currency: 'VND' },
    status: 'Đang bán',
  },
})

export const PRIMARY_DECLARATION_PAYLOAD = deepFreeze({
  listingId: PRIMARY_LISTING_ID,
  buyerRef: 'PARTY-BUYER-HN-0518',
  transactionValue: 18_400_000_000,
  contractNumber: 'HDCN-2026-0819-PT',
  contractDate: '2026-08-19',
  notaryOffice: 'Văn phòng công chứng Tây Hồ',
  notarizedAt: '2026-08-19T15:30:00+07:00',
  documents: {
    transferContract: {
      fileName: 'hop-dong-chuyen-nhuong-cong-chung.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 2_480_128,
    },
  },
})

export const TRANSACTION_357_FIXTURE = deepFreeze({
  transactionCode: '357-GD-2026-000812',
  npid: PRIMARY_PROPERTY_ID,
  contractNumber: 'HDCN-2026-0819-PT',
  transactionValue: 18_400_000_000,
  buyerMasked: 'Nguyễn H••• M•••',
  sellerMasked: 'Trần V••• A•••',
  notaryOffice: 'Văn phòng công chứng Tây Hồ',
  sourceUpdatedAt: '2026-08-21T09:05:00+07:00',
})

export const V5_EXTERNAL_MILESTONES = deepFreeze([
  {
    sequence: 1,
    id: 'TAX-EVT-PT-001',
    source: 'tax',
    label: 'Thuế đã tiếp nhận hồ sơ',
    rawStatus: 'Đã tiếp nhận hồ sơ xác định nghĩa vụ tài chính',
    normalizedStatus: 'Chờ thông báo nghĩa vụ tài chính',
    sourceUpdatedAt: '2026-08-21T10:15:00+07:00',
    receivedAt: '2026-08-21T10:16:00+07:00',
  },
  {
    sequence: 2,
    id: 'TAX-EVT-PT-002',
    source: 'tax',
    label: 'Cần thực hiện nghĩa vụ tài chính',
    rawStatus: 'Đã phát hành thông báo nghĩa vụ tài chính',
    normalizedStatus: 'Cần thực hiện nghĩa vụ tài chính',
    sourceUpdatedAt: '2026-08-22T09:10:00+07:00',
    receivedAt: '2026-08-22T09:12:00+07:00',
  },
  {
    sequence: 3,
    id: 'TAX-EVT-PT-003',
    source: 'tax',
    label: 'Đã hoàn thành nghĩa vụ tài chính',
    rawStatus: 'Đã hoàn thành các nghĩa vụ tài chính',
    normalizedStatus: 'Đã hoàn thành nghĩa vụ tài chính',
    sourceUpdatedAt: '2026-08-25T14:20:00+07:00',
    receivedAt: '2026-08-25T14:22:00+07:00',
  },
  {
    sequence: 4,
    id: 'LAND-EVT-PT-001',
    source: 'landRegistry',
    label: 'VPĐKĐĐ đã tiếp nhận hồ sơ',
    rawStatus: 'Đã tiếp nhận hồ sơ TTHC đăng ký sang tên',
    normalizedStatus: 'Đã tiếp nhận',
    sourceUpdatedAt: '2026-08-26T08:45:00+07:00',
    receivedAt: '2026-08-26T08:47:00+07:00',
  },
  {
    sequence: 5,
    id: 'LAND-EVT-PT-002',
    source: 'landRegistry',
    label: 'VPĐKĐĐ đang xử lý TTHC',
    rawStatus: 'Đang xử lý TTHC đăng ký biến động',
    normalizedStatus: 'Đang xử lý TTHC',
    sourceUpdatedAt: '2026-08-28T11:30:00+07:00',
    receivedAt: '2026-08-28T11:32:00+07:00',
  },
  {
    sequence: 6,
    id: 'LAND-EVT-PT-003',
    source: 'landRegistry',
    label: 'Đã hoàn thành sang tên',
    rawStatus: 'Đã hoàn thành xử lý và có kết quả trả',
    normalizedStatus: 'Đã hoàn thành',
    sourceUpdatedAt: '2026-09-04T15:00:00+07:00',
    receivedAt: '2026-09-04T15:02:00+07:00',
  },
])
