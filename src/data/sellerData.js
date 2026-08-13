export const sellerPartySeed = [
  { id: 'PTY-SELLER-001', type: 'Person', displayName: 'Nguyễn Quốc Khánh' },
]

export const sellerRelationshipSeed = [
  {
    id: 'REL-OWN-001',
    propertyId: 'HN-PROP-000184',
    partyId: 'PTY-SELLER-001',
    relationshipType: 'Chủ sở hữu',
    status: 'Đã xác minh',
    ownershipShare: 100,
    evidenceReference: 'EV-OWN-2026-0184',
    effectiveAt: '01/08/2026',
  },
  {
    id: 'REL-OWN-002',
    propertyId: 'HN-PROP-000288',
    partyId: 'PTY-SELLER-001',
    relationshipType: 'Ownership Claim',
    status: 'Chờ xác minh',
    ownershipShare: 50,
    evidenceReference: 'EV-CLAIM-2026-0288',
    effectiveAt: '12/08/2026',
  },
  {
    id: 'REL-OWN-003',
    propertyId: 'HN-PROP-100101',
    partyId: 'PTY-SELLER-001',
    relationshipType: 'Chủ sở hữu',
    status: 'Đã xác minh',
    ownershipShare: 100,
    evidenceReference: 'EV-OWN-2026-10101',
    effectiveAt: '05/08/2026',
  },
]

export const sellerRepresentationSeed = [
  {
    id: 'REP-001-V1',
    rootId: 'REP-001',
    version: 1,
    propertyId: 'HN-PROP-000184',
    partyId: 'PTY-SELLER-001',
    agentName: 'Nguyễn Minh An',
    brokerage: 'HouseNow Partners',
    transactionScope: 'Chào bán',
    exclusivity: 'Độc quyền',
    startsAt: '01/08/2026',
    expiresAt: '01/02/2027',
    evidenceReference: 'EV-REP-2026-0184',
    action: 'grant',
    status: 'Có hiệu lực',
    reason: 'Chủ sở hữu xác nhận quyền đại diện.',
  },
  {
    id: 'REP-002-V1',
    rootId: 'REP-002',
    version: 1,
    propertyId: 'HN-PROP-100101',
    partyId: 'PTY-SELLER-001',
    agentName: 'Nguyễn Thu Trang',
    brokerage: 'HouseNow Hà Nội',
    transactionScope: 'Chào bán',
    exclusivity: 'Không độc quyền',
    startsAt: '05/08/2026',
    expiresAt: '05/02/2027',
    evidenceReference: 'EV-REP-2026-10101',
    action: 'grant',
    status: 'Có hiệu lực',
    reason: 'Chủ sở hữu xác nhận phạm vi đại diện tại Hà Nội.',
  },
]

export const sellerDistributionConsentSeed = [
  {
    id: 'DSC-001-V1',
    rootId: 'DSC-001',
    version: 1,
    propertyId: 'HN-PROP-000184',
    partyId: 'PTY-SELLER-001',
    previewVersion: 'PUB-HN-PROP-000184-V3',
    fieldScope: 'Giá, trạng thái, đặc điểm, media công khai',
    channels: 'HouseNow, website sàn, đối tác được chỉ định',
    purpose: 'Tiếp thị và phân phối Listing',
    startsAt: '01/08/2026',
    expiresAt: '01/02/2027',
    action: 'grant',
    status: 'Có hiệu lực',
    reason: 'Chủ sở hữu duyệt đúng public preview và kênh phân phối.',
  },
  {
    id: 'DSC-002-V1',
    rootId: 'DSC-002',
    version: 1,
    propertyId: 'HN-PROP-100101',
    partyId: 'PTY-SELLER-001',
    previewVersion: 'PUB-HN-PROP-100101-V2',
    fieldScope: 'Giá, trạng thái, đặc điểm, media công khai',
    channels: 'HouseNow, website HouseNow Hà Nội',
    purpose: 'Tiếp thị Listing đã xác minh',
    startsAt: '05/08/2026',
    expiresAt: '05/02/2027',
    action: 'grant',
    status: 'Có hiệu lực',
    reason: 'Chủ sở hữu duyệt public preview và hai kênh phân phối.',
  },
]

export const sellerCaseSeed = [
  {
    id: 'SC-2026-001',
    propertyId: 'HN-PROP-000184',
    partyId: 'PTY-SELLER-001',
    type: 'Sửa dữ liệu',
    reason: 'Đề nghị đối chiếu lại mô tả nội thất trong public remarks.',
    evidenceReference: 'EV-CASE-2026-001',
    brokerageScope: 'HouseNow Partners',
    status: 'Đã tiếp nhận',
    createdAt: '12/08/2026, 14:10',
    decidedBy: 'Lê Hoàng Phúc',
    decisionReason: 'Sàn đã tiếp nhận và giao môi giới phụ trách kiểm tra.',
    decidedAt: '12/08/2026, 15:05',
  },
]

export function localSellerPropertyProjection(properties) {
  const relationships = new Map(sellerRelationshipSeed.map((relationship) => [relationship.propertyId, relationship]))
  return properties.filter((property) => relationships.has(property.id)).map((property) => {
    const projected = structuredClone(property)
    projected.sellerRelationship = structuredClone(relationships.get(property.id))
    if (projected.currentListing) delete projected.currentListing.privateRemarks
    delete projected.audit
    return projected
  })
}
