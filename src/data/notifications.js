const marketContext = {
  hcm: {
    label: 'TP.HCM',
    agentListing: 'HN-LST-2026-00904',
    project: 'The Metropole',
    secondaryProject: 'City Garden',
    area: 'TP. Thủ Đức',
    qualityIssue: 'DQ-2031',
    unit: 'T2-18.04',
    report: 'Báo cáo TP.HCM · tuần 33',
  },
  hanoi: {
    label: 'Hà Nội',
    agentListing: 'HN-LST-2026-10105',
    project: 'Vinhomes Metropolis',
    secondaryProject: 'Masteri Waterfront',
    area: 'Tây Hồ',
    qualityIssue: 'DQ-HN-3104',
    unit: 'H7-SL12',
    report: 'Báo cáo Hà Nội · tuần 33',
  },
}

export const notificationPagesByRole = {
  agent: ['listings', 'contacts', 'analytics', 'access'],
  broker: ['listings', 'quality', 'organization', 'access'],
  developer: ['projects', 'listings', 'access'],
  bank: ['finance', 'access'],
  regulator: ['oversight', 'quality', 'access'],
  buyer: ['shortlist', 'discover', 'access'],
  steward: ['quality', 'access'],
}

const notificationBuilders = {
  agent: (market) => [
    ['listing-source', 'Listing cần bổ sung nguồn', `${market.agentListing} · 8 phút trước`, 'listings', 'Listing', 'warning'],
    ['showing-confirmed', 'Lịch xem đã được xác nhận', `${market.project} · 17:30 hôm nay`, 'contacts', 'Lịch xem', 'positive'],
    ['comparable-match', 'Có 3 comparable mới', `CMA ${market.area} · 26 phút trước`, 'analytics', 'CMA', 'info'],
    ['access-approved', 'Quyền xem lịch sử giá đã được duyệt', `${market.secondaryProject} · hiệu lực 14 ngày`, 'access', 'Quyền dữ liệu', 'positive'],
  ],
  broker: (market) => [
    ['listing-review', 'Có 4 Listing chờ sàn duyệt', `${market.label} · SLA gần nhất còn 1 giờ`, 'listings', 'Kiểm duyệt', 'warning'],
    ['quality-sla', 'Quality issue gần SLA', `${market.qualityIssue} · còn 2 giờ`, 'quality', 'Chất lượng', 'danger'],
    ['member-invite', 'Lời mời thành viên cần xác nhận', `HouseNow Partners · ${market.label}`, 'organization', 'Tổ chức', 'info'],
    ['access-request', 'Có yêu cầu quyền cần quyết định', `Closing/finance data · ${market.agentListing}`, 'access', 'Quyền dữ liệu', 'warning'],
  ],
  developer: (market) => [
    ['inventory-change', '12 Unit vừa thay đổi availability', `${market.project} · đồng bộ 6 phút trước`, 'projects', 'Inventory', 'info'],
    ['assignment-expiry', 'Assignment phân phối sắp hết hạn', `${market.unit} · còn 7 ngày`, 'projects', 'Phân phối', 'warning'],
    ['listing-sync', 'Một Listing chưa khớp Unit inventory', `${market.secondaryProject} · cần đối chiếu`, 'listings', 'Đồng bộ', 'danger'],
    ['source-access', 'Yêu cầu xem nguồn đã được duyệt', `${market.agentListing} · hiệu lực 14 ngày`, 'access', 'Quyền dữ liệu', 'positive'],
  ],
  bank: (market) => [
    ['consent-expiry', 'Consent tài chính sắp hết hạn', `${market.project} · còn 5 ngày`, 'access', 'Consent', 'warning'],
    ['finance-missing', 'Hồ sơ finance-fit cần bổ sung', `${market.secondaryProject} · thiếu purpose`, 'finance', 'Hồ sơ', 'danger'],
    ['price-change', 'Property trong hồ sơ vừa đổi giá', `${market.project} · cập nhật 18 phút trước`, 'finance', 'Tín hiệu giá', 'info'],
    ['access-approved', 'Access Request đã được duyệt', `Closing/finance data · hiệu lực 30 ngày`, 'access', 'Quyền dữ liệu', 'positive'],
  ],
  regulator: (market) => [
    ['market-signal', 'Tín hiệu giá cần theo dõi', `${market.area} · vượt ngưỡng 30 ngày`, 'oversight', 'Thị trường', 'warning'],
    ['weekly-report', 'Báo cáo thị trường đã sẵn sàng', market.report, 'oversight', 'Báo cáo', 'positive'],
    ['quality-cluster', 'Phát hiện cụm dữ liệu thiếu nguồn', `${market.label} · 17 record`, 'quality', 'Chất lượng', 'info'],
    ['authority-expiry', 'Authority truy cập sắp hết hạn', `Jurisdiction ${market.label} · còn 3 ngày`, 'access', 'Thẩm quyền', 'warning'],
  ],
  buyer: (market) => [
    ['new-match', 'Có 4 căn mới phù hợp nhu cầu', `${market.label} · theo bộ lọc đã lưu`, 'shortlist', 'Gợi ý', 'info'],
    ['price-drop', 'Một căn đã lưu vừa giảm giá', `${market.project} · giảm 4,5%`, 'discover', 'Thay đổi giá', 'positive'],
    ['showing-confirmed', 'Lịch xem đã được xác nhận', `${market.project} · 18:00 hôm nay`, 'shortlist', 'Lịch xem', 'positive'],
    ['consent-used', 'Consent vừa được sử dụng', `Ngân hàng Đại Việt · mục đích pre-qualification`, 'access', 'Quyền riêng tư', 'warning'],
  ],
  steward: (market) => [
    ['duplicate-cluster', 'Có Property candidate nghi trùng', `${market.label} · 6 candidate cần review`, 'quality', 'Định danh', 'warning'],
    ['quality-sla', 'Quality issue đã vượt SLA', `${market.qualityIssue} · quá hạn 2 giờ`, 'quality', 'Chất lượng', 'danger'],
    ['source-conflict', 'Nguồn diện tích đang xung đột', `${market.agentListing} · 2 nguồn khác nhau`, 'quality', 'Nguồn dữ liệu', 'danger'],
    ['access-request', 'Yêu cầu quyền cần đánh giá purpose', `Source/provenance · ${market.secondaryProject}`, 'access', 'Quyền dữ liệu', 'warning'],
  ],
}

export function notificationsForActor(roleId, marketId = 'hcm') {
  const market = marketContext[marketId]
  const build = notificationBuilders[roleId]
  if (!market || !build) return []
  const allowedPages = new Set(notificationPagesByRole[roleId])
  return build(market).map(([key, title, meta, page, category, tone]) => {
    if (!allowedPages.has(page)) throw new Error(`Notification route ${page} không hợp lệ cho ${roleId}.`)
    return {
      id: `${marketId}-${roleId}-${key}`,
      title,
      meta,
      page,
      category,
      tone,
      read: false,
    }
  })
}
