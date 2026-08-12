const listing = (input) => ({ agreement: 'Đại diện độc quyền', distributionChannels: 0, ...input })

const audit = (propertyId, actor = 'Nguyễn Thu Trang') => [
  { id: `${propertyId}-A1`, action: 'Đối chiếu Property và nguồn', actor: 'Đỗ Minh Phương', role: 'Data Steward', time: '12/08/2026, 09:20', reason: 'Khớp project, building, unit và địa chỉ chuẩn hóa' },
  { id: `${propertyId}-A2`, action: 'Cập nhật Listing snapshot', actor, role: 'Môi giới', time: '11/08/2026, 16:05', reason: 'Cập nhật dữ liệu thị trường Hà Nội' },
]

export const hanoiProperties = [
  {
    id: 'HN-PROP-100101', parcelId: 'HN-BD-101-22', market: 'hanoi', title: 'Căn hộ 2 phòng ngủ tại Vinhomes Metropolis',
    address: '29 Liễu Giai, phường Ngọc Hà, Hà Nội', project: 'Vinhomes Metropolis', unit: 'M2-2208', type: 'Căn hộ', area: 79.6, bedrooms: 2, bathrooms: 2, orientation: 'Đông Nam', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 97,
    source: 'Hồ sơ dự án và sàn đối chiếu', sourceUpdatedAt: '13/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-metropolis/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10101', status: 'Active', price: 13200000000, priceLabel: '13,2 tỷ', pricePerArea: '165,8 triệu/m²', daysOnMarket: 12, listedAt: '01/08/2026', expiresAt: '01/02/2027', agent: 'Nguyễn Thu Trang', brokerage: 'HouseNow Hà Nội', publicRemarks: 'Căn góc tầng cao, nội thất hoàn thiện, tầm nhìn hồ và trung tâm Ba Đình.', privateRemarks: 'Lịch xem sau 18:00, cần đăng ký trước với lễ tân.', distributionChannels: 4 }),
    history: [{ listingId: 'HN-LST-2026-10101', type: 'Chào bán', status: 'Active', price: '13,2 tỷ', period: '01/08/2026 đến nay' }, { listingId: 'HN-LST-2024-09114', type: 'Cho thuê', status: 'Closed', price: '48 triệu/tháng', period: '03/2024 - 03/2025' }], audit: audit('HN-PROP-100101'),
  },
  {
    id: 'HN-PROP-100102', parcelId: 'HN-TH-102-07', market: 'hanoi', title: 'Căn hộ 3 phòng ngủ tại Times City Park Hill',
    address: '458 Minh Khai, phường Vĩnh Tuy, Hà Nội', project: 'Times City Park Hill', unit: 'P8-1706', type: 'Căn hộ', area: 118.4, bedrooms: 3, bathrooms: 2, orientation: 'Nam', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 96,
    source: 'Project Unit và lịch sử sàn', sourceUpdatedAt: '12/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-timescity/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10102', status: 'Active', price: 9800000000, priceLabel: '9,8 tỷ', pricePerArea: '82,8 triệu/m²', daysOnMarket: 21, listedAt: '23/07/2026', expiresAt: '23/01/2027', agent: 'Trần Hoàng Nam', brokerage: 'Red River Homes', publicRemarks: 'Căn ba phòng ngủ Park Hill, ban công rộng, gần trường học và tiện ích nội khu.', privateRemarks: 'Chủ nhà linh hoạt thời gian bàn giao trong tháng 9.', distributionChannels: 3 }),
    history: [{ listingId: 'HN-LST-2026-10102', type: 'Chào bán', status: 'Active', price: '9,8 tỷ', period: '23/07/2026 đến nay' }, { listingId: 'HN-LST-2023-08102', type: 'Chào bán', status: 'Withdrawn', price: '8,6 tỷ', period: '09/2023 - 12/2023' }], audit: audit('HN-PROP-100102', 'Trần Hoàng Nam'),
  },
  {
    id: 'HN-PROP-100103', parcelId: 'HN-CA-103-15', market: 'hanoi', title: 'Căn hộ 2 phòng ngủ tại D’. Le Roi Soleil',
    address: '59 Xuân Diệu, phường Tây Hồ, Hà Nội', project: 'D’. Le Roi Soleil', unit: 'A-1509', type: 'Căn hộ', area: 88.2, bedrooms: 2, bathrooms: 2, orientation: 'Tây Bắc', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 94,
    source: 'Ban quản lý dự án và sàn', sourceUpdatedAt: '13/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-leroisoleil/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10103', status: 'Active', price: 11800000000, priceLabel: '11,8 tỷ', pricePerArea: '133,8 triệu/m²', daysOnMarket: 8, listedAt: '05/08/2026', expiresAt: '05/02/2027', agent: 'Lê Thanh Huyền', brokerage: 'West Lake Realty', publicRemarks: 'Căn hộ hoàn thiện cao cấp, logia thoáng, kết nối nhanh tới hồ Tây và khu Ngoại giao đoàn.', privateRemarks: 'Không công bố số căn trên portal ngoài HouseNow.', distributionChannels: 2 }),
    history: [{ listingId: 'HN-LST-2026-10103', type: 'Chào bán', status: 'Active', price: '11,8 tỷ', period: '05/08/2026 đến nay' }, { listingId: 'HN-LST-2025-09203', type: 'Cho thuê', status: 'Closed', price: '52 triệu/tháng', period: '04/2025 - 04/2026' }], audit: audit('HN-PROP-100103', 'Lê Thanh Huyền'),
  },
  {
    id: 'HN-PROP-100104', parcelId: 'HN-NTH-104-03', market: 'hanoi', title: 'Biệt thự song lập tại Starlake Tây Hồ Tây',
    address: 'Khu đô thị Starlake, phường Xuân Đỉnh, Hà Nội', project: 'Starlake Tây Hồ Tây', unit: 'H7-SL12', type: 'Biệt thự', area: 248, bedrooms: 5, bathrooms: 5, orientation: 'Đông Bắc', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 98,
    source: 'Hồ sơ chủ đầu tư và brokerage', sourceUpdatedAt: '11/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-starlake-villa/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10104', status: 'Active', price: 78500000000, priceLabel: '78,5 tỷ', pricePerArea: '316,5 triệu/m²', daysOnMarket: 32, listedAt: '12/07/2026', expiresAt: '12/07/2027', agent: 'Phạm Đức Anh', brokerage: 'Capital Prime', publicRemarks: 'Biệt thự song lập hoàn thiện mặt ngoài, khuôn viên riêng, nằm trong lõi đô thị Tây Hồ Tây.', privateRemarks: 'Buyer qualification bắt buộc trước khi xác nhận lịch xem.', distributionChannels: 2 }),
    history: [{ listingId: 'HN-LST-2026-10104', type: 'Chào bán', status: 'Active', price: '78,5 tỷ', period: '12/07/2026 đến nay' }], audit: audit('HN-PROP-100104', 'Phạm Đức Anh'),
  },
  {
    id: 'HN-PROP-100105', parcelId: 'HN-HĐ-105-19', market: 'hanoi', title: 'Liền kề tại An Hưng, Hà Đông',
    address: 'Khu đô thị An Hưng, phường Dương Nội, Hà Nội', project: 'An Hưng New Urban Area', unit: 'LK18-09', type: 'Nhà phố', area: 90, bedrooms: 5, bathrooms: 5, orientation: 'Đông Nam', verification: 'Cần bổ sung nguồn', confidence: 'Trung bình', qualityScore: 71,
    source: 'Môi giới khai báo và ảnh hiện trạng', sourceUpdatedAt: '13/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-anhung-townhouse/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10105', status: 'Incoming', price: 22900000000, priceLabel: '22,9 tỷ', pricePerArea: '254,4 triệu/m²', daysOnMarket: 0, listedAt: '13/08/2026', expiresAt: '13/02/2027', agreement: 'Chờ xác minh', agent: 'Vũ Thùy Linh', brokerage: 'Hà Thành Property', publicRemarks: 'Nhà liền kề hoàn thiện bốn tầng, đường nội khu rộng và gần trục Tố Hữu.', privateRemarks: 'Thiếu phụ lục ủy quyền và bản đo diện tích cập nhật.' }),
    history: [{ listingId: 'HN-LST-2026-10105', type: 'Chào bán', status: 'Incoming', price: '22,9 tỷ', period: '13/08/2026 đến nay' }], audit: audit('HN-PROP-100105', 'Vũ Thùy Linh'),
  },
  {
    id: 'HN-PROP-100106', parcelId: 'HN-CG-106-05', market: 'hanoi', title: 'Shophouse tại Vinhomes Gardenia',
    address: 'Đường Hàm Nghi, phường Cầu Diễn, Hà Nội', project: 'Vinhomes Gardenia', unit: 'A3-SH05', type: 'Thương mại', area: 126, bedrooms: 0, bathrooms: 4, orientation: 'Tây Nam', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 91,
    source: 'Project Unit và hồ sơ sàn', sourceUpdatedAt: '10/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-gardenia-shop/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10106', status: 'Pending', price: 35500000000, priceLabel: '35,5 tỷ', pricePerArea: '281,7 triệu/m²', daysOnMarket: 47, listedAt: '27/06/2026', expiresAt: '27/12/2026', agent: 'Hoàng Quang Minh', brokerage: 'Capital Prime', publicRemarks: 'Shophouse hai mặt tiếp cận, đang có hợp đồng thuê thương mại và dòng tiền ổn định.', privateRemarks: 'Đã nhận đặt cọc; chờ hoàn tất điều kiện giao dịch.', distributionChannels: 0 }),
    history: [{ listingId: 'HN-LST-2026-10106', type: 'Chào bán', status: 'Pending', price: '35,5 tỷ', period: '27/06/2026 đến nay' }, { listingId: 'HN-LST-2022-07106', type: 'Chào bán', status: 'Expired', price: '31 tỷ', period: '02/2022 - 08/2022' }], audit: audit('HN-PROP-100106', 'Hoàng Quang Minh'),
  },
  {
    id: 'HN-PROP-100107', parcelId: 'HN-LB-107-31', market: 'hanoi', title: 'Nhà phố Ngọc Lâm gần cầu Long Biên',
    address: 'Phường Ngọc Lâm, Hà Nội', project: null, unit: null, type: 'Nhà phố', area: 68.5, bedrooms: 4, bathrooms: 4, orientation: 'Nam', verification: 'Đang xác minh', confidence: 'Trung bình', qualityScore: 65,
    source: 'Môi giới khai báo và hồ sơ địa chỉ', sourceUpdatedAt: '09/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-ngoclam-house/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10107', status: 'Needs correction', price: 14900000000, priceLabel: '14,9 tỷ', pricePerArea: '217,5 triệu/m²', daysOnMarket: 0, listedAt: '09/08/2026', expiresAt: '09/02/2027', agreement: 'Chờ xác minh', agent: 'Bùi Mai Anh', brokerage: 'Red River Homes', publicRemarks: 'Nhà bốn tầng trong khu dân cư hiện hữu, kết nối nhanh sang khu phố cổ.', privateRemarks: 'Diện tích hồ sơ và diện tích hiện trạng chênh lệch 3,2 m².' }),
    history: [{ listingId: 'HN-LST-2026-10107', type: 'Chào bán', status: 'Needs correction', price: '14,9 tỷ', period: '09/08/2026 đến nay' }], audit: audit('HN-PROP-100107', 'Bùi Mai Anh'),
  },
  {
    id: 'HN-PROP-100108', parcelId: 'HN-BTL-108-18', market: 'hanoi', title: 'Căn hộ 3 phòng ngủ tại Sunshine City',
    address: 'Khu đô thị Ciputra, phường Phú Thượng, Hà Nội', project: 'Sunshine City', unit: 'S2-1812', type: 'Căn hộ', area: 116.8, bedrooms: 3, bathrooms: 2, orientation: 'Đông', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 95,
    source: 'Chủ đầu tư và lịch sử Listing', sourceUpdatedAt: '12/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-sunshinecity/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10108', status: 'Active', price: 8900000000, priceLabel: '8,9 tỷ', pricePerArea: '76,2 triệu/m²', daysOnMarket: 16, listedAt: '28/07/2026', expiresAt: '28/01/2027', agent: 'Nguyễn Thu Trang', brokerage: 'HouseNow Hà Nội', publicRemarks: 'Căn ba phòng ngủ tầng trung, nội thất sáng màu, phù hợp gia đình cần không gian rộng.', privateRemarks: 'Giá đã gồm phần lớn nội thất liền tường.', distributionChannels: 4 }),
    history: [{ listingId: 'HN-LST-2026-10108', type: 'Chào bán', status: 'Active', price: '8,9 tỷ', period: '28/07/2026 đến nay' }, { listingId: 'HN-LST-2025-09308', type: 'Cho thuê', status: 'Closed', price: '32 triệu/tháng', period: '01/2025 - 01/2026' }], audit: audit('HN-PROP-100108'),
  },
  {
    id: 'HN-PROP-100109', parcelId: 'HN-NK-109-12', market: 'hanoi', title: 'Văn phòng hạng B phố Trần Hưng Đạo',
    address: 'Phường Cửa Nam, Hà Nội', project: null, unit: 'T8-802', type: 'Văn phòng', area: 214, bedrooms: 0, bathrooms: 2, orientation: 'Bắc', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 89,
    source: 'Hồ sơ tòa nhà và đơn vị quản lý', sourceUpdatedAt: '08/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-office/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10109', status: 'Active', price: 118000000, priceLabel: '118 triệu/tháng', pricePerArea: '551 nghìn/m²', daysOnMarket: 27, listedAt: '17/07/2026', expiresAt: '17/07/2029', agreement: 'Đại diện không độc quyền', agent: 'Đinh Quốc Việt', brokerage: 'Hanoi Commercial', publicRemarks: 'Mặt bằng văn phòng nguyên sàn, có sảnh đón và hệ thống điều hòa trung tâm.', privateRemarks: 'Phí dịch vụ và VAT tách riêng; thời hạn thuê tối thiểu ba năm.', distributionChannels: 3 }),
    history: [{ listingId: 'HN-LST-2026-10109', type: 'Cho thuê', status: 'Active', price: '118 triệu/tháng', period: '17/07/2026 đến nay' }, { listingId: 'HN-LST-2023-07909', type: 'Cho thuê', status: 'Closed', price: '102 triệu/tháng', period: '08/2023 - 06/2026' }], audit: audit('HN-PROP-100109', 'Đinh Quốc Việt'),
  },
  {
    id: 'HN-PROP-100110', parcelId: 'HN-ĐA-110-44', market: 'hanoi', title: 'Đất ở ven trục Nhật Tân - Nội Bài',
    address: 'Xã Vĩnh Ngọc, huyện Đông Anh, Hà Nội', project: null, unit: null, type: 'Đất ở', area: 186.3, bedrooms: 0, bathrooms: 0, orientation: 'Tây Bắc', verification: 'Đang xác minh', confidence: 'Trung bình', qualityScore: 73,
    source: 'Source record địa chính mô phỏng', sourceUpdatedAt: '07/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-donganh-land/1200/800', currentListing: null,
    history: [{ listingId: 'HN-LST-2021-06110', type: 'Chào bán', status: 'Expired', price: '10,8 tỷ', period: '05/2021 - 11/2021' }], audit: audit('HN-PROP-100110', 'Source ingest'),
  },
  {
    id: 'HN-PROP-100111', parcelId: 'HN-TL-111-09', market: 'hanoi', title: 'Căn hộ cho thuê tại Keangnam Landmark',
    address: 'Đường Phạm Hùng, phường Từ Liêm, Hà Nội', project: 'Keangnam Hanoi Landmark Tower', unit: 'A-3109', type: 'Căn hộ', area: 109.7, bedrooms: 3, bathrooms: 2, orientation: 'Đông Nam', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 93,
    source: 'Ban quản lý và brokerage record', sourceUpdatedAt: '11/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-keangnam/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10111', status: 'Active', price: 42000000, priceLabel: '42 triệu/tháng', pricePerArea: '383 nghìn/m²', daysOnMarket: 9, listedAt: '04/08/2026', expiresAt: '04/08/2027', agent: 'Trần Hoàng Nam', brokerage: 'Red River Homes', publicRemarks: 'Căn hộ ba phòng ngủ đầy đủ nội thất, phù hợp chuyên gia làm việc tại khu vực Mỹ Đình.', privateRemarks: 'Không nhận lưu trú ngắn hạn; đặt cọc hai tháng.', distributionChannels: 3 }),
    history: [{ listingId: 'HN-LST-2026-10111', type: 'Cho thuê', status: 'Active', price: '42 triệu/tháng', period: '04/08/2026 đến nay' }, { listingId: 'HN-LST-2025-09511', type: 'Cho thuê', status: 'Closed', price: '39 triệu/tháng', period: '05/2025 - 05/2026' }], audit: audit('HN-PROP-100111', 'Trần Hoàng Nam'),
  },
  {
    id: 'HN-PROP-100112', parcelId: 'HN-HM-112-17', market: 'hanoi', title: 'Nhà nguyên căn khu đô thị Gamuda Gardens',
    address: 'Phường Hoàng Liệt, Hà Nội', project: 'Gamuda Gardens', unit: 'ST4-17', type: 'Nhà phố', area: 112, bedrooms: 4, bathrooms: 4, orientation: 'Đông Nam', verification: 'Đã xác minh', confidence: 'Cao', qualityScore: 92,
    source: 'Project record và closing workflow', sourceUpdatedAt: '06/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-gamuda-home/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10112', status: 'Closed', price: 33000000, priceLabel: '33 triệu/tháng', pricePerArea: '295 nghìn/m²', daysOnMarket: 24, listedAt: '10/07/2026', expiresAt: '10/07/2027', agent: 'Đỗ Hồng Nhung', brokerage: 'South Hanoi Realty', publicRemarks: 'Nhà nguyên căn có sân vườn nhỏ, phù hợp gia đình cần không gian yên tĩnh.', privateRemarks: 'Đã bàn giao; giữ snapshot phục vụ lịch sử thị trường.' }),
    history: [{ listingId: 'HN-LST-2026-10112', type: 'Cho thuê', status: 'Closed', price: '33 triệu/tháng', period: '10/07/2026 - 03/08/2026' }, { listingId: 'HN-LST-2024-08312', type: 'Cho thuê', status: 'Closed', price: '29 triệu/tháng', period: '06/2024 - 06/2025' }], audit: audit('HN-PROP-100112', 'Đỗ Hồng Nhung'),
  },
  {
    id: 'HN-PROP-100113', parcelId: 'HN-GL-113-08', market: 'hanoi', title: 'Căn hộ 2 phòng ngủ tại Masteri Waterfront',
    address: 'Khu đô thị Vinhomes Ocean Park, xã Gia Lâm, Hà Nội', project: 'Masteri Waterfront', unit: 'M1-1208', type: 'Căn hộ', area: 64.8, bedrooms: 2, bathrooms: 2, orientation: 'Đông Bắc', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 94,
    source: 'Hồ sơ chủ đầu tư và sàn phân phối', sourceUpdatedAt: '13/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-masteriwaterfront/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10113', status: 'Active', price: 6100000000, priceLabel: '6,1 tỷ', pricePerArea: '94,1 triệu/m²', daysOnMarket: 4, listedAt: '09/08/2026', expiresAt: '09/02/2027', agreement: 'Phân phối theo ủy quyền', agent: 'Nguyễn Thu Trang', brokerage: 'HouseNow Hà Nội', publicRemarks: 'Căn hai phòng ngủ mới bàn giao, ban công hướng hồ và tiện ích hoàn thiện.', privateRemarks: 'Cần xác nhận tình trạng nội thất trước mỗi lịch xem.', distributionChannels: 5 }),
    history: [{ listingId: 'HN-LST-2026-10113', type: 'Chào bán', status: 'Active', price: '6,1 tỷ', period: '09/08/2026 đến nay' }], audit: audit('HN-PROP-100113'),
  },
  {
    id: 'HN-PROP-100114', parcelId: 'HN-ĐĐ-114-26', market: 'hanoi', title: 'Nhà mặt phố Thái Hà',
    address: 'Phường Đống Đa, Hà Nội', project: null, unit: null, type: 'Thương mại', area: 82.4, bedrooms: 3, bathrooms: 4, orientation: 'Tây', verification: 'Đã đối chiếu', confidence: 'Cao', qualityScore: 90,
    source: 'Hồ sơ pháp lý và sàn đối chiếu', sourceUpdatedAt: '10/08/2026', image: 'https://picsum.photos/seed/housenow-hanoi-thaiha-commercial/1200/800',
    currentListing: listing({ id: 'HN-LST-2026-10114', status: 'Incoming', price: 52000000000, priceLabel: '52 tỷ', pricePerArea: '631,1 triệu/m²', daysOnMarket: 0, listedAt: '10/08/2026', expiresAt: '10/02/2027', agreement: 'Chờ xác minh', agent: 'Lê Thanh Huyền', brokerage: 'West Lake Realty', publicRemarks: 'Nhà mặt phố có mặt tiền rộng, phù hợp kinh doanh và khai thác cho thuê dài hạn.', privateRemarks: 'Đang chờ xác nhận phạm vi công bố thông tin hợp đồng thuê hiện hữu.' }),
    history: [{ listingId: 'HN-LST-2026-10114', type: 'Chào bán', status: 'Incoming', price: '52 tỷ', period: '10/08/2026 đến nay' }, { listingId: 'HN-LST-2020-05114', type: 'Chào bán', status: 'Withdrawn', price: '43 tỷ', period: '04/2020 - 07/2020' }], audit: audit('HN-PROP-100114', 'Lê Thanh Huyền'),
  },
]

export const hanoiIntelligenceSeed = {
  priceEvents: [
    { key: 'PE-10101-01', listingId: 'HN-LST-2026-10101', fromPrice: null, toPrice: 13800000000, effectiveAt: '01/08/2026', actor: 'Nguyễn Thu Trang', reason: 'Giá chào khi kích hoạt', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-10101-02', listingId: 'HN-LST-2026-10101', fromPrice: 13800000000, toPrice: 13200000000, effectiveAt: '09/08/2026', actor: 'Nguyễn Thu Trang', reason: 'Điều chỉnh sau tuần mở bán đầu tiên', source: 'Brokerage review', confidence: 'Đã đối chiếu' },
    { key: 'PE-10102-01', listingId: 'HN-LST-2026-10102', fromPrice: null, toPrice: 10200000000, effectiveAt: '23/07/2026', actor: 'Trần Hoàng Nam', reason: 'Giá chào ban đầu', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-10102-02', listingId: 'HN-LST-2026-10102', fromPrice: 10200000000, toPrice: 9800000000, effectiveAt: '06/08/2026', actor: 'Trần Hoàng Nam', reason: 'Seller phê duyệt mức giá mới', source: 'Brokerage review', confidence: 'Đã đối chiếu' },
    { key: 'PE-10104-01', listingId: 'HN-LST-2026-10104', fromPrice: null, toPrice: 82000000000, effectiveAt: '12/07/2026', actor: 'Phạm Đức Anh', reason: 'Giá chào ban đầu', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-10104-02', listingId: 'HN-LST-2026-10104', fromPrice: 82000000000, toPrice: 78500000000, effectiveAt: '02/08/2026', actor: 'Phạm Đức Anh', reason: 'Điều chỉnh phạm vi thương lượng', source: 'Brokerage review', confidence: 'Đã đối chiếu' },
    { key: 'PE-10108-01', listingId: 'HN-LST-2026-10108', fromPrice: null, toPrice: 9200000000, effectiveAt: '28/07/2026', actor: 'Nguyễn Thu Trang', reason: 'Giá chào ban đầu', source: 'Listing agent', confidence: 'Đã ghi nhận' },
    { key: 'PE-10108-02', listingId: 'HN-LST-2026-10108', fromPrice: 9200000000, toPrice: 8900000000, effectiveAt: '10/08/2026', actor: 'Nguyễn Thu Trang', reason: 'Điều chỉnh theo comparable đã review', source: 'CMA review', confidence: 'Đã đối chiếu' },
    { key: 'PE-10113-01', listingId: 'HN-LST-2026-10113', fromPrice: null, toPrice: 6100000000, effectiveAt: '09/08/2026', actor: 'Nguyễn Thu Trang', reason: 'Giá chào khi kích hoạt', source: 'Developer assignment', confidence: 'Đã đối chiếu' },
  ],
  closingRecords: [
    { listingId: 'HN-LST-2024-09114', closePrice: 46500000, closeDate: '18/03/2025', createdBy: 'HouseNow source ingest', source: 'Brokerage closing record', verification: 'Đã đối chiếu' },
    { listingId: 'HN-LST-2025-09203', closePrice: 50000000, closeDate: '02/04/2026', createdBy: 'HouseNow source ingest', source: 'Brokerage closing record', verification: 'Đã đối chiếu' },
    { listingId: 'HN-LST-2025-09308', closePrice: 31000000, closeDate: '12/01/2026', createdBy: 'HouseNow source ingest', source: 'Brokerage closing record', verification: 'Đã đối chiếu' },
    { listingId: 'HN-LST-2023-07909', closePrice: 105000000, closeDate: '30/06/2026', createdBy: 'Closing workflow', source: 'Property manager record', verification: 'Đã ghi nhận' },
    { listingId: 'HN-LST-2025-09511', closePrice: 39000000, closeDate: '25/05/2026', createdBy: 'HouseNow source ingest', source: 'Brokerage closing record', verification: 'Đã đối chiếu' },
    { listingId: 'HN-LST-2026-10112', closePrice: 32500000, closeDate: '03/08/2026', createdBy: 'Đỗ Hồng Nhung', source: 'Brokerage closing workflow', verification: 'Broker confirmed' },
    { listingId: 'HN-LST-2024-08312', closePrice: 28500000, closeDate: '18/06/2025', createdBy: 'HouseNow source ingest', source: 'Brokerage closing record', verification: 'Đã đối chiếu' },
  ],
  sourceEvents: [
    { key: 'SE-10101-01', propertyId: 'HN-PROP-100101', type: 'Unit identity', summary: 'Khớp tòa M2, tầng 22 và mã căn 2208', effectiveAt: '01/08/2026', source: 'Project record', confidence: 'Cao', visibility: 'Industry' },
    { key: 'SE-10101-02', propertyId: 'HN-PROP-100101', type: 'Area evidence', summary: 'Diện tích sử dụng 79,6 m² được đối chiếu', effectiveAt: '12/08/2026', source: 'Hồ sơ unit', confidence: 'Cao', visibility: 'Public' },
    { key: 'SE-10104-01', propertyId: 'HN-PROP-100104', type: 'Project assignment', summary: 'Khớp phân khu H7 và mã căn SL12', effectiveAt: '11/08/2026', source: 'Developer inventory', confidence: 'Cao', visibility: 'Industry' },
    { key: 'SE-10105-01', propertyId: 'HN-PROP-100105', type: 'Representation gap', summary: 'Chưa đủ phụ lục ủy quyền phân phối', effectiveAt: '13/08/2026', source: 'Brokerage review', confidence: 'Trung bình', visibility: 'Restricted' },
    { key: 'SE-10107-01', propertyId: 'HN-PROP-100107', type: 'Area conflict', summary: 'Chênh lệch 3,2 m² giữa hồ sơ và đo hiện trạng', effectiveAt: '10/08/2026', source: 'Quality review', confidence: 'Trung bình', visibility: 'Restricted' },
    { key: 'SE-10113-01', propertyId: 'HN-PROP-100113', type: 'Unit identity', summary: 'Khớp tòa M1, tầng 12 và mã căn 1208', effectiveAt: '09/08/2026', source: 'Developer inventory', confidence: 'Cao', visibility: 'Industry' },
  ],
}

export const hanoiQualityIssues = [
  { code: 'DQ-HN-2041', title: 'Thiếu phụ lục ủy quyền phân phối', record: 'HN-LST-2026-10105', type: 'Blocking', owner: 'Vũ Thùy Linh', due: 'Hôm nay, 16:30', level: 'danger', status: 'Open' },
  { code: 'DQ-HN-2038', title: 'Xung đột diện tích hiện trạng', record: 'HN-PROP-100107', type: 'Nguồn dữ liệu', owner: 'Đỗ Minh Phương', due: 'Quá hạn 2 giờ', level: 'danger', status: 'Open' },
  { code: 'DQ-HN-2032', title: 'Địa chỉ phường cần chuẩn hóa', record: 'HN-PROP-100109', type: 'Định danh', owner: 'Quality router', due: 'Còn 1 ngày', level: 'warning', status: 'Open' },
  { code: 'DQ-HN-2029', title: 'Parcel reference cần đối chiếu', record: 'HN-PROP-100110', type: 'Nguồn dữ liệu', owner: 'Đỗ Minh Phương', due: 'Còn 2 ngày', level: 'warning', status: 'Open' },
  { code: 'DQ-HN-2017', title: 'Consent portal sắp hết hạn', record: 'HN-LST-2026-10103', type: 'Distribution', owner: 'West Lake Realty', due: 'Còn 3 ngày', level: 'neutral', status: 'Open' },
]

export const hanoiActivityFeed = [
  { id: 'hn-1', type: 'new', label: 'Listing mới', count: 26, area: 'Tây Hồ và Ba Đình', change: '+8 so với hôm qua' },
  { id: 'hn-2', type: 'price-down', label: 'Giảm giá', count: 11, area: 'Toàn Hà Nội', change: 'Trung vị -3,1%' },
  { id: 'hn-3', type: 'back-market', label: 'Trở lại thị trường', count: 6, area: 'Cầu Giấy và Hà Đông', change: '+2 trong 24 giờ' },
  { id: 'hn-4', type: 'closed', label: 'Đã đóng', count: 17, area: 'Toàn Hà Nội', change: 'DOM trung vị 39 ngày' },
]
