import { hanoiActivityFeed, hanoiIntelligenceSeed, hanoiProperties, hanoiQualityIssues } from './hanoiData.js'

export const roles = [
  { id: 'agent', label: 'Môi giới BĐS', shortLabel: 'MG', name: 'Nguyễn Minh An', organization: 'HouseNow Partners', layer: 'Actor chính' },
  { id: 'broker', label: 'Sàn môi giới', shortLabel: 'SL', name: 'Lê Hoàng Phúc', organization: 'HouseNow Partners', layer: 'Actor chính' },
  { id: 'developer', label: 'Chủ đầu tư dự án BĐS', shortLabel: 'CĐT', name: 'Phạm Thu Hà', organization: 'Nova Habitat', layer: 'Actor chính' },
  { id: 'buyer', label: 'Người mua', shortLabel: 'NM', name: 'Trần Thảo Vy', organization: 'Không gian cá nhân', layer: 'Actor chính' },
  { id: 'seller', label: 'Người bán / Chủ sở hữu', shortLabel: 'NB', name: 'Nguyễn Quốc Khánh', organization: 'Không gian chủ sở hữu', layer: 'Actor chính' },
  { id: 'bank', label: 'Ngân hàng', shortLabel: 'NH', name: 'Đặng Đức Long', organization: 'Ngân hàng Đại Việt', layer: 'Actor chính' },
  { id: 'regulator', label: 'Cơ quan quản lý', shortLabel: 'CQ', name: 'Vũ Minh Châu', organization: 'Cơ quan quản lý mô phỏng', layer: 'Mở rộng / deferred' },
  { id: 'steward', label: 'Data Steward', shortLabel: 'DS', name: 'Trần Gia Hân', organization: 'HouseNow MLS', layer: 'Vận hành bổ sung' },
]

export const intelligenceSeed = {
  priceEvents: [
    { key: 'PE-831-01', listingId: 'HN-LST-2026-00831', fromPrice: null, toPrice: 13400000000, effectiveAt: '25/07/2026', actor: 'Nguyễn Minh An', reason: 'Giá chào khi kích hoạt Listing', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-831-02', listingId: 'HN-LST-2026-00831', fromPrice: 13400000000, toPrice: 13100000000, effectiveAt: '02/08/2026', actor: 'Nguyễn Minh An', reason: 'Điều chỉnh theo phản hồi từ các lượt xem', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-831-03', listingId: 'HN-LST-2026-00831', fromPrice: 13100000000, toPrice: 12800000000, effectiveAt: '10/08/2026', actor: 'Nguyễn Minh An', reason: 'Seller phê duyệt mức giá mới', source: 'Brokerage review', confidence: 'Đã đối chiếu' },
    { key: 'PE-918-01', listingId: 'HN-LST-2026-00918', fromPrice: null, toPrice: 80000000000, effectiveAt: '07/08/2026', actor: 'Võ Thanh Tùng', reason: 'Giá chào ban đầu', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-918-02', listingId: 'HN-LST-2026-00918', fromPrice: 80000000000, toPrice: 78000000000, effectiveAt: '12/08/2026', actor: 'Võ Thanh Tùng', reason: 'Điều chỉnh phạm vi thương lượng', source: 'Brokerage review', confidence: 'Đã đối chiếu' },
  ],
  closingRecords: [
    { listingId: 'HN-LST-2025-00394', closePrice: 40500000, closeDate: '18/02/2026', createdBy: 'HouseNow source ingest', source: 'Hồ sơ giao dịch do sàn cung cấp', verification: 'Đã đối chiếu' },
    { listingId: 'HN-LST-2024-00618', closePrice: 46500000, closeDate: '20/12/2024', createdBy: 'HouseNow source ingest', source: 'Hồ sơ giao dịch do sàn cung cấp', verification: 'Đã đối chiếu' },
    { listingId: 'HN-LST-2025-00411', closePrice: 31500000, closeDate: '28/06/2026', createdBy: 'HouseNow source ingest', source: 'Brokerage closing record', verification: 'Đã ghi nhận' },
  ],
  sourceEvents: [
    { key: 'SE-184-01', propertyId: 'HN-PROP-000184', type: 'Unit identity', summary: 'Khớp dự án, tòa, tầng và mã căn T2-18.04', effectiveAt: '25/07/2026', source: 'Hồ sơ chủ đầu tư mô phỏng', confidence: 'Cao', visibility: 'Industry' },
    { key: 'SE-184-02', propertyId: 'HN-PROP-000184', type: 'Area evidence', summary: 'Diện tích thông thủy 72,4 m²', effectiveAt: '10/08/2026', source: 'Hồ sơ unit do chủ đầu tư cung cấp', confidence: 'Cao', visibility: 'Public' },
    { key: 'SE-184-03', propertyId: 'HN-PROP-000184', type: 'Address normalization', summary: 'Chuẩn hóa địa chỉ theo Project và Building', effectiveAt: '10/08/2026', source: 'HouseNow identity process', confidence: 'Cao', visibility: 'Industry' },
  ],
}

intelligenceSeed.priceEvents.push(...hanoiIntelligenceSeed.priceEvents)
intelligenceSeed.closingRecords.push(...hanoiIntelligenceSeed.closingRecords)
intelligenceSeed.sourceEvents.push(...hanoiIntelligenceSeed.sourceEvents)

const listing = ({
  id,
  status,
  price,
  priceLabel,
  pricePerArea,
  daysOnMarket,
  listedAt,
  expiresAt,
  agreement = 'Đại diện độc quyền',
  agent,
  brokerage,
  publicRemarks,
  privateRemarks,
  distributionChannels = 0,
}) => ({
  id,
  status,
  price,
  priceLabel,
  pricePerArea,
  daysOnMarket,
  listedAt,
  expiresAt,
  agreement,
  agent,
  brokerage,
  publicRemarks,
  privateRemarks,
  distributionChannels,
})

export const properties = [
  {
    id: 'HN-PROP-000184', parcelId: 'P79-TH-184-02', title: 'Căn hộ 2 phòng ngủ tại The Metropole',
    address: 'Khu đô thị Thủ Thiêm, TP. Thủ Đức, TP.HCM', project: 'The Metropole Thủ Thiêm', unit: 'T2-18.04',
    type: 'Căn hộ', area: 72.4, bedrooms: 2, bathrooms: 2, orientation: 'Đông Nam', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 96,
    source: 'Hồ sơ chủ đầu tư mô phỏng', sourceUpdatedAt: '10/08/2026', image: 'https://picsum.photos/seed/housenow-metropole-apartment/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00831', status: 'Active', price: 12800000000, priceLabel: '12,8 tỷ', pricePerArea: '176,8 triệu/m²', daysOnMarket: 18, listedAt: '25/07/2026', expiresAt: '25/10/2026', agreement: 'Đại diện không độc quyền', agent: 'Nguyễn Minh An', brokerage: 'HouseNow Partners', publicRemarks: 'Căn góc, tầm nhìn sông, bàn giao hoàn thiện. Lịch xem cần được xác nhận trước.', privateRemarks: 'Chủ nhà ưu tiên lịch xem sau 17:30. Không chia sẻ số căn trên kênh công khai.', distributionChannels: 3 }),
    history: [
      { listingId: 'HN-LST-2026-00831', type: 'Chào bán', status: 'Active', price: '12,8 tỷ', period: '25/07/2026 đến nay' },
      { listingId: 'HN-LST-2025-00394', type: 'Cho thuê', status: 'Closed', price: '42 triệu/tháng', period: '08/2025 - 02/2026' },
    ],
    audit: [
      { id: 1, action: 'Listing chuyển sang Active', actor: 'Lê Hoàng Phúc', role: 'Quản lý sàn', time: '25/07/2026, 10:42', reason: 'Đủ dữ liệu và căn cứ đại diện' },
      { id: 2, action: 'Đối chiếu Property và Unit', actor: 'Trần Gia Hân', role: 'Data Steward', time: '25/07/2026, 09:18', reason: 'Khớp mã dự án, tòa và unit' },
      { id: 3, action: 'Khởi tạo Listing', actor: 'Nguyễn Minh An', role: 'Môi giới', time: '24/07/2026, 16:06', reason: 'Tạo mới từ Property hiện hữu' },
    ],
  },
  {
    id: 'HN-PROP-000219', parcelId: 'P79-BT-219-11', title: 'Nhà phố khu dân cư Bình Trưng Đông',
    address: 'Bình Trưng Đông, TP. Thủ Đức, TP.HCM', project: null, unit: null,
    type: 'Nhà phố', area: 96, bedrooms: 4, bathrooms: 4, orientation: 'Tây Bắc', verification: 'Cần bổ sung nguồn', confidence: 'Trung bình', qualityScore: 68,
    source: 'Môi giới khai báo', sourceUpdatedAt: '11/08/2026', image: 'https://picsum.photos/seed/housenow-thuduc-townhouse/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00904', status: 'Incoming', price: 16400000000, priceLabel: '16,4 tỷ', pricePerArea: '170,8 triệu/m²', daysOnMarket: 0, listedAt: '11/08/2026', expiresAt: '11/11/2026', agreement: 'Chờ xác minh', agent: 'Phạm Khánh Linh', brokerage: 'Đông Sài Gòn Realty', publicRemarks: 'Nhà phố bốn tầng trong khu dân cư hiện hữu.', privateRemarks: 'Thiếu tài liệu chứng minh quyền đại diện. Chưa được phân phối công khai.', distributionChannels: 0 }),
    history: [{ listingId: 'HN-LST-2026-00904', type: 'Chào bán', status: 'Incoming', price: '16,4 tỷ', period: '11/08/2026 đến nay' }],
    audit: [
      { id: 1, action: 'Listing chuyển sang Incoming', actor: 'Phạm Khánh Linh', role: 'Môi giới', time: '11/08/2026, 15:30', reason: 'Lưu hồ sơ để bổ sung tài liệu' },
      { id: 2, action: 'Tạo Property candidate', actor: 'Phạm Khánh Linh', role: 'Môi giới', time: '11/08/2026, 14:52', reason: 'Không tìm thấy mã Property chính xác' },
    ],
  },
  {
    id: 'HN-PROP-000077', parcelId: 'P79-Q7-077-08', title: 'Căn hộ 3 phòng ngủ tại Midtown',
    address: 'Phú Mỹ Hưng, Quận 7, TP.HCM', project: 'Phú Mỹ Hưng Midtown', unit: 'M5-12.02',
    type: 'Căn hộ', area: 112.8, bedrooms: 3, bathrooms: 2, orientation: 'Nam', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 98,
    source: 'Chủ đầu tư và sàn đối chiếu', sourceUpdatedAt: '06/08/2026', image: 'https://picsum.photos/seed/housenow-midtown-residence/1200/800', currentListing: null,
    history: [
      { listingId: 'HN-LST-2025-00142', type: 'Chào bán', status: 'Withdrawn', price: '15,2 tỷ', period: '01/2025 - 04/2025' },
      { listingId: 'HN-LST-2024-00618', type: 'Cho thuê', status: 'Closed', price: '48 triệu/tháng', period: '06/2024 - 12/2024' },
    ],
    audit: [
      { id: 1, action: 'Cập nhật nguồn diện tích', actor: 'Trần Gia Hân', role: 'Data Steward', time: '06/08/2026, 11:24', reason: 'Đối chiếu lại theo hồ sơ unit' },
      { id: 2, action: 'Hợp nhất Property candidate', actor: 'Trần Gia Hân', role: 'Data Steward', time: '18/05/2026, 09:41', reason: 'Trùng project, tòa, tầng và số căn' },
    ],
  },
  {
    id: 'HN-PROP-000246', parcelId: 'P79-TD-246-03', title: 'Biệt thự ven sông tại Thảo Điền',
    address: 'Phường Thảo Điền, TP. Thủ Đức, TP.HCM', project: null, unit: null,
    type: 'Biệt thự', area: 326, bedrooms: 5, bathrooms: 6, orientation: 'Tây Nam', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 93,
    source: 'Hồ sơ sàn và bản đồ địa chính mô phỏng', sourceUpdatedAt: '12/08/2026', image: 'https://picsum.photos/seed/housenow-riverside-villa/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00918', status: 'Active', price: 78000000000, priceLabel: '78 tỷ', pricePerArea: '239,3 triệu/m²', daysOnMarket: 6, listedAt: '07/08/2026', expiresAt: '07/02/2027', agent: 'Võ Thanh Tùng', brokerage: 'Saigon Prime Realty', publicRemarks: 'Biệt thự sân vườn ven sông, khuôn viên riêng và bến thuyền nội khu.', privateRemarks: 'Chỉ xác nhận lịch xem sau khi hoàn tất buyer qualification.', distributionChannels: 2 }),
    history: [
      { listingId: 'HN-LST-2026-00918', type: 'Chào bán', status: 'Active', price: '78 tỷ', period: '07/08/2026 đến nay' },
      { listingId: 'HN-LST-2023-00402', type: 'Chào bán', status: 'Withdrawn', price: '72 tỷ', period: '09/2023 - 01/2024' },
    ],
    audit: [
      { id: 1, action: 'Phát hành tới hai kênh', actor: 'Distribution service', role: 'Hệ thống', time: '07/08/2026, 11:18', reason: 'Consent hợp lệ' },
      { id: 2, action: 'Broker duyệt Listing', actor: 'Lê Hoàng Phúc', role: 'Quản lý sàn', time: '07/08/2026, 10:56', reason: 'Đã kiểm tra quyền đại diện' },
    ],
  },
  {
    id: 'HN-PROP-000251', parcelId: 'P79-Q1-251-06', title: 'Shophouse mặt tiền Nguyễn Huệ',
    address: 'Phường Bến Nghé, Quận 1, TP.HCM', project: null, unit: null,
    type: 'Thương mại', area: 188, bedrooms: 0, bathrooms: 3, orientation: 'Đông', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 91,
    source: 'Hồ sơ pháp lý và sàn đối chiếu', sourceUpdatedAt: '09/08/2026', image: 'https://picsum.photos/seed/housenow-nguyenhue-shophouse/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00894', status: 'Active', price: 185000000000, priceLabel: '185 tỷ', pricePerArea: '984 triệu/m²', daysOnMarket: 22, listedAt: '22/07/2026', expiresAt: '22/01/2027', agent: 'Đỗ Quỳnh Anh', brokerage: 'Central District Property', publicRemarks: 'Bất động sản thương mại mặt tiền phố đi bộ, phù hợp flagship store.', privateRemarks: 'Hồ sơ doanh thu chỉ cung cấp trong data room có phê duyệt.', distributionChannels: 1 }),
    history: [{ listingId: 'HN-LST-2026-00894', type: 'Chào bán', status: 'Active', price: '185 tỷ', period: '22/07/2026 đến nay' }],
    audit: [
      { id: 1, action: 'Cập nhật phạm vi public fields', actor: 'Đỗ Quỳnh Anh', role: 'Môi giới', time: '09/08/2026, 14:12', reason: 'Seller consent bổ sung' },
      { id: 2, action: 'Xác minh hồ sơ Property', actor: 'Trần Gia Hân', role: 'Data Steward', time: '22/07/2026, 08:44', reason: 'Đối chiếu số thửa và địa chỉ' },
    ],
  },
  {
    id: 'HN-PROP-000263', parcelId: 'P79-NB-263-09', title: 'Nhà phố compound tại Nhà Bè',
    address: 'Xã Phước Kiển, Huyện Nhà Bè, TP.HCM', project: 'Lavila Nam Sài Gòn', unit: 'LV-B2-16',
    type: 'Nhà phố', area: 108, bedrooms: 4, bathrooms: 5, orientation: 'Bắc', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 89,
    source: 'Chủ đầu tư và brokerage', sourceUpdatedAt: '12/08/2026', image: 'https://picsum.photos/seed/housenow-nhabe-compound/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00921', status: 'Incoming', price: 13900000000, priceLabel: '13,9 tỷ', pricePerArea: '128,7 triệu/m²', daysOnMarket: 0, listedAt: '12/08/2026', expiresAt: '12/12/2026', agreement: 'Phân phối theo ủy quyền', agent: 'Mai Quốc Bảo', brokerage: 'Southgate Homes', publicRemarks: 'Nhà phố compound có sân trước, nội khu kiểm soát an ninh.', privateRemarks: 'Đang chờ xác nhận phụ lục phân phối từ chủ đầu tư.', distributionChannels: 0 }),
    history: [{ listingId: 'HN-LST-2026-00921', type: 'Chào bán', status: 'Incoming', price: '13,9 tỷ', period: '12/08/2026 đến nay' }],
    audit: [
      { id: 1, action: 'Listing chuyển sang Incoming', actor: 'Mai Quốc Bảo', role: 'Môi giới', time: '12/08/2026, 16:20', reason: 'Đủ minimum submission rules' },
      { id: 2, action: 'Import dữ liệu từ Project Unit', actor: 'Import service', role: 'Hệ thống', time: '12/08/2026, 16:04', reason: 'Khớp project, block và unit' },
    ],
  },
  {
    id: 'HN-PROP-000271', parcelId: 'P79-GV-271-14', title: 'Nhà riêng đường Phan Văn Trị',
    address: 'Phường 7, Quận Gò Vấp, TP.HCM', project: null, unit: null,
    type: 'Nhà phố', area: 74.6, bedrooms: 3, bathrooms: 3, orientation: 'Đông Bắc', verification: 'Cần bổ sung nguồn', confidence: 'Thấp', qualityScore: 54,
    source: 'Môi giới khai báo và ảnh hiện trạng', sourceUpdatedAt: '08/08/2026', image: 'https://picsum.photos/seed/housenow-govap-house/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00876', status: 'Needs correction', price: 8900000000, priceLabel: '8,9 tỷ', pricePerArea: '119,3 triệu/m²', daysOnMarket: 0, listedAt: '08/08/2026', expiresAt: '08/11/2026', agreement: 'Chờ xác minh', agent: 'Ngô Hải Yến', brokerage: 'Gia Định Land', publicRemarks: 'Nhà riêng trong khu dân cư, kết nối thuận tiện tới Phạm Văn Đồng.', privateRemarks: 'Diện tích trên tài liệu và diện tích môi giới khai báo đang xung đột.', distributionChannels: 0 }),
    history: [{ listingId: 'HN-LST-2026-00876', type: 'Chào bán', status: 'Needs correction', price: '8,9 tỷ', period: '08/08/2026 đến nay' }],
    audit: [
      { id: 1, action: 'Reviewer yêu cầu chỉnh sửa', actor: 'Lê Hoàng Phúc', role: 'Quản lý sàn', time: '09/08/2026, 09:25', reason: 'Xung đột diện tích và thiếu tài liệu đại diện' },
      { id: 2, action: 'Submit Listing', actor: 'Ngô Hải Yến', role: 'Môi giới', time: '08/08/2026, 17:42', reason: 'Gửi sàn kiểm duyệt' },
    ],
  },
  {
    id: 'HN-PROP-000288', parcelId: 'P79-BT-288-04', title: 'Căn hộ duplex tại City Garden',
    address: 'Phường 21, Quận Bình Thạnh, TP.HCM', project: 'City Garden', unit: 'P2-2603',
    type: 'Căn hộ', area: 154.2, bedrooms: 3, bathrooms: 3, orientation: 'Đông Nam', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 97,
    source: 'Ban quản lý dự án và hồ sơ sàn', sourceUpdatedAt: '13/08/2026', image: 'https://picsum.photos/seed/housenow-citygarden-duplex/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00925', status: 'Active', price: 23600000000, priceLabel: '23,6 tỷ', pricePerArea: '153 triệu/m²', daysOnMarket: 1, listedAt: '12/08/2026', expiresAt: '12/02/2027', agent: 'Nguyễn Minh An', brokerage: 'HouseNow Partners', publicRemarks: 'Duplex tầng cao, không gian thông tầng và tầm nhìn trung tâm thành phố.', privateRemarks: 'Khách xem cần đăng ký trước 24 giờ với ban quản lý.', distributionChannels: 4 }),
    history: [
      { listingId: 'HN-LST-2026-00925', type: 'Chào bán', status: 'Active', price: '23,6 tỷ', period: '12/08/2026 đến nay' },
      { listingId: 'HN-LST-2024-00281', type: 'Cho thuê', status: 'Closed', price: '78 triệu/tháng', period: '03/2024 - 03/2025' },
    ],
    audit: [
      { id: 1, action: 'Listing chuyển sang Active', actor: 'Lê Hoàng Phúc', role: 'Quản lý sàn', time: '12/08/2026, 13:14', reason: 'Đã đạt Active input rules' },
      { id: 2, action: 'Đồng bộ bốn kênh', actor: 'Distribution service', role: 'Hệ thống', time: '12/08/2026, 13:16', reason: 'Public consent hợp lệ' },
    ],
  },
  {
    id: 'HN-PROP-000294', parcelId: 'P79-BC-294-18', title: 'Đất ở khu dân cư Bình Chánh',
    address: 'Xã Bình Hưng, Huyện Bình Chánh, TP.HCM', project: null, unit: null,
    type: 'Đất ở', area: 142.5, bedrooms: 0, bathrooms: 0, orientation: 'Tây', verification: 'Đang xác minh', confidence: 'Trung bình', qualityScore: 72,
    source: 'Source record địa chính mô phỏng', sourceUpdatedAt: '07/08/2026', image: 'https://picsum.photos/seed/housenow-binhchanh-land/1200/800', currentListing: null,
    history: [{ listingId: 'HN-LST-2022-00091', type: 'Chào bán', status: 'Expired', price: '6,4 tỷ', period: '03/2022 - 09/2022' }],
    audit: [
      { id: 1, action: 'Tạo verification request', actor: 'Trần Gia Hân', role: 'Data Steward', time: '07/08/2026, 10:03', reason: 'Cần đối chiếu biến động thửa' },
      { id: 2, action: 'Liên kết Source Record', actor: 'Source ingest', role: 'Hệ thống', time: '07/08/2026, 09:58', reason: 'Khớp parcel reference' },
    ],
  },
  {
    id: 'HN-PROP-000307', parcelId: 'P79-Q2-307-21', title: 'Căn hộ 1 phòng ngủ tại The Sun Avenue',
    address: 'Phường An Phú, TP. Thủ Đức, TP.HCM', project: 'The Sun Avenue', unit: 'SAV3-18.11',
    type: 'Căn hộ', area: 52.7, bedrooms: 1, bathrooms: 1, orientation: 'Bắc', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 92,
    source: 'Project Unit và lịch sử Listing', sourceUpdatedAt: '05/08/2026', image: 'https://picsum.photos/seed/housenow-sunavenue-unit/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00863', status: 'Active', price: 35000000, priceLabel: '35 triệu/tháng', pricePerArea: '664 nghìn/m²', daysOnMarket: 14, listedAt: '30/07/2026', expiresAt: '30/07/2027', agreement: 'Đại diện không độc quyền', agent: 'Lương Bảo Trâm', brokerage: 'East River Realty', publicRemarks: 'Căn hộ đầy đủ nội thất, phù hợp khách thuê làm việc tại khu Đông.', privateRemarks: 'Giá thuê chưa bao gồm phí quản lý. Không nhận vật nuôi.', distributionChannels: 3 }),
    history: [
      { listingId: 'HN-LST-2026-00863', type: 'Cho thuê', status: 'Active', price: '35 triệu/tháng', period: '30/07/2026 đến nay' },
      { listingId: 'HN-LST-2025-00411', type: 'Cho thuê', status: 'Closed', price: '32 triệu/tháng', period: '08/2025 - 06/2026' },
    ],
    audit: [
      { id: 1, action: 'Price change', actor: 'Lương Bảo Trâm', role: 'Môi giới', time: '05/08/2026, 10:22', reason: 'Điều chỉnh theo yêu cầu bên cho thuê' },
      { id: 2, action: 'Listing chuyển sang Active', actor: 'Phan Tuấn Kiệt', role: 'Quản lý sàn', time: '30/07/2026, 16:50', reason: 'Đạt validation rules' },
    ],
  },
  {
    id: 'HN-PROP-000318', parcelId: 'P79-PN-318-02', title: 'Nhà nguyên căn gần sân bay Tân Sơn Nhất',
    address: 'Phường 2, Quận Tân Bình, TP.HCM', project: null, unit: null,
    type: 'Nhà phố', area: 81, bedrooms: 5, bathrooms: 4, orientation: 'Nam', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 90,
    source: 'Brokerage record và địa chỉ chuẩn hóa', sourceUpdatedAt: '04/08/2026', image: 'https://picsum.photos/seed/housenow-tanbinh-home/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-00840', status: 'Closed', price: 44000000, priceLabel: '44 triệu/tháng', pricePerArea: '543 nghìn/m²', daysOnMarket: 31, listedAt: '01/07/2026', expiresAt: '01/07/2027', agent: 'Trịnh Hoài Nam', brokerage: 'Gia Định Land', publicRemarks: 'Nhà nguyên căn phù hợp văn phòng nhỏ hoặc gia đình nhiều thế hệ.', privateRemarks: 'Đã hoàn tất bàn giao. Giữ record phục vụ market history.', distributionChannels: 0 }),
    history: [
      { listingId: 'HN-LST-2026-00840', type: 'Cho thuê', status: 'Closed', price: '44 triệu/tháng', period: '01/07/2026 - 01/08/2026' },
      { listingId: 'HN-LST-2024-00523', type: 'Cho thuê', status: 'Closed', price: '39 triệu/tháng', period: '02/2024 - 02/2025' },
    ],
    audit: [
      { id: 1, action: 'Listing chuyển sang Closed', actor: 'Trịnh Hoài Nam', role: 'Môi giới', time: '01/08/2026, 14:08', reason: 'Đã ký hợp đồng thuê' },
      { id: 2, action: 'Tạo Closing Record', actor: 'Closing workflow', role: 'Hệ thống', time: '01/08/2026, 14:09', reason: 'Lưu snapshot kết quả giao dịch' },
    ],
  },
  {
    id: 'HN-PROP-000326', parcelId: 'P79-CC-326-07', title: 'Kho vận quy mô nhỏ tại Củ Chi',
    address: 'Xã Tân Phú Trung, Huyện Củ Chi, TP.HCM', project: null, unit: null,
    type: 'Công nghiệp', area: 1240, bedrooms: 0, bathrooms: 2, orientation: 'Đông Nam', verification: 'Đang xác minh', confidence: 'Trung bình', qualityScore: 76,
    source: 'Doanh nghiệp khai báo và tọa độ hiện trạng', sourceUpdatedAt: '03/08/2026', image: 'https://picsum.photos/seed/housenow-cuchi-warehouse/1200/800', currentListing: null,
    history: [],
    audit: [
      { id: 1, action: 'Tạo Property candidate', actor: 'Nguyễn Nhật Quang', role: 'Môi giới', time: '03/08/2026, 08:34', reason: 'Chưa có Property phù hợp trong master data' },
      { id: 2, action: 'Giao verification request', actor: 'Quality router', role: 'Hệ thống', time: '03/08/2026, 08:35', reason: 'Loại tài sản cần kiểm tra bổ sung' },
    ],
  },
]

properties.push(...hanoiProperties)

export const qualityIssues = [
  { code: 'DQ-1842', title: 'Xung đột nguồn diện tích', record: 'HN-PROP-000219', type: 'Nguồn dữ liệu', owner: 'Trần Gia Hân', due: 'Quá hạn 4 giờ', level: 'danger', status: 'Open' },
  { code: 'DQ-1839', title: 'Thiếu căn cứ đại diện', record: 'HN-LST-2026-00904', type: 'Blocking', owner: 'Phạm Khánh Linh', due: 'Hôm nay, 17:00', level: 'warning', status: 'Open' },
  { code: 'DQ-1827', title: 'Kênh portal lệch trạng thái', record: 'HN-LST-2026-00831', type: 'Distribution', owner: 'Integration bot', due: 'Còn 6 giờ', level: 'warning', status: 'Open' },
  { code: 'DQ-1818', title: 'Địa chỉ chưa chuẩn hóa', record: 'HN-PROP-000271', type: 'Định danh', owner: 'Lê Thu Hà', due: 'Còn 1 ngày', level: 'warning', status: 'Open' },
  { code: 'DQ-1806', title: 'Biến động thửa chưa đối chiếu', record: 'HN-PROP-000294', type: 'Nguồn dữ liệu', owner: 'Trần Gia Hân', due: 'Còn 2 ngày', level: 'warning', status: 'Open' },
  { code: 'DQ-1799', title: 'Project Unit thiếu mã block chuẩn', record: 'HN-PROP-000263', type: 'Taxonomy', owner: 'Nguyễn Quốc Thịnh', due: 'Hôm nay, 18:30', level: 'neutral', status: 'Open' },
  { code: 'DQ-1784', title: 'Property candidate cần review', record: 'HN-PROP-000326', type: 'Định danh', owner: 'Lê Thu Hà', due: 'Còn 3 ngày', level: 'neutral', status: 'Open' },
]

qualityIssues.push(...hanoiQualityIssues)

export const activityFeed = [
  { id: 1, type: 'new', label: 'Listing mới', count: 18, area: 'TP. Thủ Đức', change: '+5 so với hôm qua' },
  { id: 2, type: 'price-down', label: 'Giảm giá', count: 7, area: 'Toàn TP.HCM', change: 'Trung vị -2,4%' },
  { id: 3, type: 'back-market', label: 'Trở lại thị trường', count: 4, area: 'Quận 7 và Nhà Bè', change: '+1 trong 24 giờ' },
  { id: 4, type: 'closed', label: 'Đã đóng', count: 12, area: 'Toàn TP.HCM', change: 'DOM trung vị 34 ngày' },
]

export const activityFeedsByMarket = { hcm: activityFeed, hanoi: hanoiActivityFeed }

export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
