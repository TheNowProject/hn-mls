export const actorExperiences = {
  developer: {
    kicker: 'Project & Unit workspace',
    title: 'Điều hành nguồn hàng theo từng Unit',
    description: 'Tách trạng thái định danh của Unit khỏi trạng thái thương mại và quyền phân phối.',
    metrics: [
      ['Unit đã công bố', '284', '12 unit cập nhật trong 7 ngày'],
      ['Đang mở bán', '126', '44,4% tổng inventory'],
      ['Chờ đối chiếu', '9', '3 issue có thể chặn phân phối'],
      ['Sàn được phân phối', '14', '2 assignment sắp hết hạn'],
    ],
    queueTitle: 'Inventory cần xử lý',
    rows: [
      ['The Metropole · T2-18.04', 'Available', '12,8 tỷ', 'Đã đối chiếu', 'HouseNow Partners'],
      ['Lavila · LV-B2-16', 'Under review', '13,9 tỷ', 'Thiếu phụ lục', 'Southgate Homes'],
      ['City Garden · D2-28.08', 'Reserved', '23,6 tỷ', 'Đã xác minh', 'HouseNow Partners'],
      ['Midtown · M5-12.02', 'Available', '15,7 tỷ', 'Đã xác minh', 'Phú Mỹ Hưng Realty'],
    ],
    note: 'Giá và availability có hiệu lực theo thời gian; thay đổi không ghi đè lịch sử inventory.',
  },
  bank: {
    kicker: 'Purpose-bound finance workspace',
    title: 'Đánh giá ngữ cảnh tài chính có consent',
    description: 'Chỉ hiển thị dữ liệu cần thiết cho mục đích đã được người mua cho phép.',
    metrics: [
      ['Hồ sơ có consent', '18', '5 consent hết hạn trong 14 ngày'],
      ['Property đã đối chiếu', '15', '83,3% tập hồ sơ'],
      ['Khoảng vay tham khảo', '42,6 tỷ', 'Không phải cam kết tín dụng'],
      ['Cần bổ sung', '3', 'Thu nhập hoặc mục đích truy cập'],
    ],
    queueTitle: 'Finance fit đang xem xét',
    rows: [
      ['Căn hộ The Metropole', '12,8 tỷ', '70% tham khảo', 'Consent hợp lệ', 'Đủ dữ liệu nền'],
      ['Căn hộ Midtown', '15,7 tỷ', '65% tham khảo', 'Consent hợp lệ', 'Chờ cập nhật giá'],
      ['Nhà phố Nhà Bè', '13,9 tỷ', 'Chưa có', 'Sắp hết hạn', 'Chưa đủ xác minh'],
      ['Căn hộ City Garden', '23,6 tỷ', '60% tham khảo', 'Consent hợp lệ', 'Cần purpose review'],
    ],
    note: 'Không hiển thị owner identity, private remarks hoặc hồ sơ tài chính khi purpose/consent không phù hợp.',
  },
  regulator: {
    kicker: 'Jurisdiction overview',
    title: 'Giám sát thị trường từ dữ liệu tổng hợp',
    description: 'Mặc định xem aggregate; truy cập chi tiết cần authority, purpose và audit.',
    metrics: [
      ['Active inventory', '5.842', '+3,1% trong 30 ngày'],
      ['DOM trung vị', '34 ngày', '-2 ngày so với kỳ trước'],
      ['Issue chất lượng', '127', '18 blocking issue'],
      ['Tỷ lệ đủ nguồn', '91,4%', '+1,8 điểm phần trăm'],
    ],
    queueTitle: 'Tín hiệu cần theo dõi',
    rows: [
      ['TP. Thủ Đức', 'Giá/m² tăng nhanh', '+8,6%', 'Theo dõi', 'Dữ liệu tổng hợp'],
      ['Quận 7', 'Relist trong 30 ngày', '42 record', 'Cần phân tích', 'Đã suppression'],
      ['Nhà Bè', 'Listing thiếu nguồn', '17 record', 'Đang xử lý', 'Không lộ owner'],
      ['Bình Chánh', 'Property candidate trùng', '11 cụm', 'Steward review', 'Theo jurisdiction'],
    ],
    note: 'Không suy diễn giá trị pháp lý hoặc kết luận vi phạm chỉ từ tín hiệu dữ liệu.',
  },
  buyer: {
    kicker: 'Verified home search',
    title: 'Tìm căn phù hợp, hiểu rõ mức độ tin cậy',
    description: 'Chỉ dùng public projection; dữ liệu nội bộ của môi giới và hướng dẫn truy cập luôn được ẩn.',
    metrics: [
      ['Đã lưu', '6', '2 listing vừa thay đổi giá'],
      ['Lịch xem', '2', 'Lịch gần nhất 17:30 hôm nay'],
      ['Listing mới phù hợp', '9', 'Theo nhu cầu đã lưu'],
      ['Đã xác minh', '5/6', 'Một property cần bổ sung nguồn'],
    ],
    queueTitle: 'Shortlist của Trần Thảo Vy',
    rows: [
      ['The Metropole · 2 PN', '12,8 tỷ', 'Đã đối chiếu', 'Giảm 4,5%', 'Lịch xem 17:30'],
      ['City Garden · Duplex', '23,6 tỷ', 'Đã xác minh', 'Mới 1 ngày', 'Đã lưu'],
      ['Midtown · 3 PN', 'Chưa có giá chào', 'Đã xác minh', 'Không có Listing', 'Theo dõi'],
      ['The Sun Avenue · 1 PN', '35 triệu/tháng', 'Đã đối chiếu', '14 DOM', 'Đã lưu'],
    ],
    note: 'Khi chia sẻ với môi giới hoặc ngân hàng, người mua chọn rõ mục đích, dữ liệu và thời hạn consent.',
  },
}

const hanoiActorExperiences = {
  developer: {
    ...actorExperiences.developer,
    metrics: [['Unit đã công bố', '412', '18 unit cập nhật trong 7 ngày'], ['Đang mở bán', '173', '42% tổng inventory'], ['Chờ đối chiếu', '14', '5 issue có thể chặn phân phối'], ['Sàn được phân phối', '19', '3 assignment sắp hết hạn']],
    rows: [['Starlake · H7-SL12', 'Available', '78,5 tỷ', 'Đã xác minh', 'Capital Prime'], ['Masteri Waterfront · M1-1208', 'Available', '6,1 tỷ', 'Đã đối chiếu', 'HouseNow Hà Nội'], ['An Hưng · LK18-09', 'Under review', '22,9 tỷ', 'Thiếu phụ lục', 'Hà Thành Property'], ['Sunshine City · S2-1812', 'Available', '8,9 tỷ', 'Đã xác minh', 'HouseNow Hà Nội']],
  },
  bank: {
    ...actorExperiences.bank,
    metrics: [['Hồ sơ có consent', '24', '6 consent hết hạn trong 14 ngày'], ['Property đã đối chiếu', '20', '83,3% tập hồ sơ'], ['Khoảng vay tham khảo', '58,4 tỷ', 'Không phải cam kết tín dụng'], ['Cần bổ sung', '4', 'Nguồn giá hoặc mục đích truy cập']],
    rows: [['Vinhomes Metropolis · 2 PN', '13,2 tỷ', '70% tham khảo', 'Consent hợp lệ', 'Đủ dữ liệu nền'], ['Times City Park Hill · 3 PN', '9,8 tỷ', '70% tham khảo', 'Consent hợp lệ', 'Đã cập nhật giá'], ['Liền kề An Hưng', '22,9 tỷ', 'Chưa có', 'Sắp hết hạn', 'Chưa đủ xác minh'], ['Masteri Waterfront · 2 PN', '6,1 tỷ', '75% tham khảo', 'Consent hợp lệ', 'Developer source']],
  },
  regulator: {
    ...actorExperiences.regulator,
    metrics: [['Active inventory', '7.126', '+2,4% trong 30 ngày'], ['DOM trung vị', '39 ngày', '-1 ngày so với kỳ trước'], ['Issue chất lượng', '164', '23 blocking issue'], ['Tỷ lệ đủ nguồn', '90,7%', '+1,2 điểm phần trăm']],
    rows: [['Tây Hồ', 'Giá/m² tăng nhanh', '+7,9%', 'Theo dõi', 'Dữ liệu tổng hợp'], ['Gia Lâm', 'Listing mới tăng', '+12,6%', 'Cần phân tích', 'Đã suppression'], ['Hà Đông', 'Thiếu nguồn đại diện', '21 record', 'Đang xử lý', 'Không lộ owner'], ['Đông Anh', 'Parcel cần đối chiếu', '16 cụm', 'Steward review', 'Theo jurisdiction']],
  },
  buyer: {
    ...actorExperiences.buyer,
    metrics: [['Đã lưu', '8', '3 listing vừa thay đổi giá'], ['Lịch xem', '3', 'Lịch gần nhất 18:00 hôm nay'], ['Listing mới phù hợp', '12', 'Theo nhu cầu Hà Nội'], ['Đã xác minh', '7/8', 'Một property cần bổ sung nguồn']],
    rows: [['Vinhomes Metropolis · 2 PN', '13,2 tỷ', 'Đã đối chiếu', 'Giảm 4,3%', 'Lịch xem 18:00'], ['Masteri Waterfront · 2 PN', '6,1 tỷ', 'Đã đối chiếu', 'Mới 4 ngày', 'Đã lưu'], ['Sunshine City · 3 PN', '8,9 tỷ', 'Đã xác minh', 'Giảm 3,3%', 'Theo dõi'], ['Keangnam · 3 PN', '42 triệu/tháng', 'Đã đối chiếu', '9 DOM', 'Đã lưu']],
  },
}

export const actorExperiencesByMarket = { hcm: actorExperiences, hanoi: hanoiActorExperiences }
