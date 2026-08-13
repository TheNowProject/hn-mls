import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createMlsStore } from '../server/database.js'
import { createHttpServer } from '../server/http.js'

async function request(baseUrl, path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${baseUrl}/api${path}`, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: response.status, body: await response.json() }
}

test('core Listing lifecycle persists and audits through the HTTP interface', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`

  const agentSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'agent' } })
  const brokerSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'broker' } })
  const agentToken = agentSession.body.token
  const brokerToken = brokerSession.body.token

  const unauthorized = await request(baseUrl, '/bootstrap')
  assert.equal(unauthorized.status, 401)

  const publicView = await request(baseUrl, '/public/properties')
  assert.equal(publicView.status, 200)
  assert.ok(publicView.body.properties.length > 0)
  assert.equal(publicView.body.properties.every((property) => property.currentListing.status === 'Active'), true)
  assert.equal(publicView.body.properties.some((property) => property.currentListing.privateRemarks || property.audit), false)

  const before = await request(baseUrl, '/bootstrap', { token: agentToken })
  const availableProperty = before.body.properties.find((property) => !property.currentListing)
  assert.ok(availableProperty)
  assert.equal(before.body.qualityIssues.length, 0)
  assert.equal(before.body.properties.some((property) => property.currentListing?.agent === 'Nguyễn Minh An' && property.currentListing?.privateRemarks), true)

  const outOfScope = before.body.properties.find((property) => property.currentListing?.agent && property.currentListing.agent !== 'Nguyễn Minh An' && property.currentListing.status === 'Active')
  const scopeDenied = await request(baseUrl, `/listings/${outOfScope.currentListing.id}/transitions`, { token: agentToken, method: 'POST', body: { to: 'Pending', reason: 'Thử thao tác ngoài assignment' } })
  assert.equal(scopeDenied.status, 403)
  assert.equal(scopeDenied.body.error.code, 'RESOURCE_SCOPE_FORBIDDEN')

  const input = {
    propertyId: availableProperty.id,
    price: 15200000000,
    expiresAt: '2027-02-13',
    agreement: 'Đại diện độc quyền',
    publicRemarks: 'Căn hộ ba phòng ngủ dùng cho kiểm thử lifecycle end-to-end.',
    privateRemarks: 'Chỉ role phù hợp được xem nội dung này.',
    status: 'Incoming',
    consent: true,
  }
  const created = await request(baseUrl, '/listings', { token: agentToken, method: 'POST', body: input })
  assert.equal(created.status, 201)
  assert.equal(created.body.property.currentListing.status, 'Incoming')
  const listingId = created.body.property.currentListing.id

  const duplicate = await request(baseUrl, '/listings', { token: agentToken, method: 'POST', body: input })
  assert.equal(duplicate.status, 409)
  assert.equal(duplicate.body.error.code, 'CURRENT_LISTING_CONFLICT')

  const forbidden = await request(baseUrl, `/listings/${listingId}/transitions`, { token: agentToken, method: 'POST', body: { to: 'Active', reason: 'Agent tự duyệt' } })
  assert.equal(forbidden.status, 403)

  const activated = await request(baseUrl, `/listings/${listingId}/transitions`, { token: brokerToken, method: 'POST', body: { to: 'Active', reason: 'Đã kiểm tra quyền đại diện và dữ liệu bắt buộc' } })
  assert.equal(activated.status, 200)
  assert.equal(activated.body.property.currentListing.status, 'Active')

  const pending = await request(baseUrl, `/listings/${listingId}/transitions`, { token: agentToken, method: 'POST', body: { to: 'Pending', reason: 'Đã nhận xác nhận giao dịch' } })
  assert.equal(pending.status, 200)
  assert.equal(pending.body.property.currentListing.status, 'Pending')

  const closed = await request(baseUrl, `/listings/${listingId}/transitions`, { token: brokerToken, method: 'POST', body: { to: 'Closed', reason: 'Đã hoàn tất hồ sơ đóng giao dịch', closePrice: 14900000000, effectiveDate: '2026-08-13' } })
  assert.equal(closed.status, 200)
  assert.equal(closed.body.property.currentListing.status, 'Closed')
  assert.ok(closed.body.property.audit.length >= 4)

  const brokerView = await request(baseUrl, '/bootstrap', { token: brokerToken })
  assert.equal(brokerView.body.qualityIssues.length, 12)
  assert.equal(brokerView.body.properties.find((property) => property.id === availableProperty.id).currentListing.status, 'Closed')
})

test('six actor projections expose only the intended Property Intelligence fields', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const tokens = {}

  for (const roleId of ['agent', 'broker', 'developer', 'bank', 'regulator', 'buyer', 'steward']) {
    const session = await request(baseUrl, '/session', { method: 'POST', body: { roleId } })
    assert.equal(session.status, 200)
    tokens[roleId] = session.body.token
  }

  const agentDetail = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: tokens.agent })
  assert.equal(agentDetail.status, 200)
  assert.equal(agentDetail.body.property.intelligence.priceEvents.length, 3)
  assert.equal(agentDetail.body.property.intelligence.priceEvents[0].key, 'PE-831-03')
  assert.equal(agentDetail.body.property.intelligence.priceSummary.originalPrice, 13400000000)
  assert.equal(agentDetail.body.property.currentListing.privateRemarks.length > 0, true)
  assert.equal(agentDetail.body.property.history.some((item) => item.closingRecord), true)

  const buyerBootstrap = await request(baseUrl, '/bootstrap', { token: tokens.buyer })
  assert.equal(buyerBootstrap.body.properties.every((property) => property.currentListing?.status === 'Active'), true)
  assert.equal(buyerBootstrap.body.properties.some((property) => property.market === 'hanoi'), true)
  const buyerDetail = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: tokens.buyer })
  assert.equal('privateRemarks' in buyerDetail.body.property.currentListing, false)
  assert.equal('audit' in buyerDetail.body.property, false)
  assert.equal('sourceEvents' in buyerDetail.body.property.intelligence, false)
  assert.equal('source' in buyerDetail.body.property.history.find((item) => item.closingRecord).closingRecord, false)

  for (const roleId of ['developer', 'bank']) {
    const detail = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: tokens[roleId] })
    assert.equal('privateRemarks' in detail.body.property.currentListing, false)
    assert.equal('audit' in detail.body.property, false)
  }

  const regulatorDetail = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: tokens.regulator })
  assert.equal('privateRemarks' in regulatorDetail.body.property.currentListing, false)
  assert.equal(regulatorDetail.body.property.audit.length > 0, true)
  const regulatorBootstrap = await request(baseUrl, '/bootstrap', { token: tokens.regulator })
  assert.equal(regulatorBootstrap.body.qualityIssues.length, 12)
  assert.equal(regulatorBootstrap.body.properties.filter((property) => property.market === 'hanoi').length, 14)

  const hanoiDetail = await request(baseUrl, '/properties/HN-PROP-100101/intelligence', { token: tokens.agent })
  assert.equal(hanoiDetail.status, 200)
  assert.equal(hanoiDetail.body.property.market, 'hanoi')
  assert.equal(hanoiDetail.body.property.intelligence.priceEvents.length, 2)
  assert.equal(hanoiDetail.body.property.intelligence.marketSnapshot.scope.includes('Hà Nội'), true)
})

test('seller receives only linked Property relationships through the HTTP projection', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`

  const session = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'seller' } })
  assert.equal(session.status, 200)
  assert.equal(session.body.actor.role, 'seller')

  const bootstrap = await request(baseUrl, '/bootstrap', { token: session.body.token })
  assert.equal(bootstrap.status, 200)
  assert.deepEqual(
    bootstrap.body.properties.map((property) => property.id).sort(),
    ['HN-PROP-000184', 'HN-PROP-000288', 'HN-PROP-100101'],
  )
  assert.equal(bootstrap.body.properties.every((property) => property.sellerRelationship?.status), true)
  assert.equal(bootstrap.body.properties.some((property) => property.market === 'hanoi'), true)
  assert.equal(bootstrap.body.properties.every((property) => !property.currentListing?.privateRemarks), true)
  assert.equal(bootstrap.body.properties.every((property) => !('audit' in property)), true)

  const owned = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: session.body.token })
  assert.equal(owned.status, 200)
  assert.equal(owned.body.property.sellerRelationship.status, 'Đã xác minh')
  assert.equal('privateRemarks' in owned.body.property.currentListing, false)
  assert.equal('audit' in owned.body.property, false)
  assert.deepEqual(owned.body.property.allowedTransitions, [])

  const unowned = await request(baseUrl, '/properties/HN-PROP-000219/intelligence', { token: session.body.token })
  assert.equal(unowned.status, 403)
  assert.equal(unowned.body.error.code, 'PROPERTY_SCOPE_FORBIDDEN')
})

test('seller revokes Representation by appending a new version through the HTTP interface', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const session = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'seller' } })

  const before = await request(baseUrl, '/properties/HN-PROP-000184/representations', { token: session.body.token })
  assert.equal(before.status, 200)
  assert.equal(before.body.representations.length, 1)
  assert.equal(before.body.representations[0].status, 'Có hiệu lực')

  const revoked = await request(baseUrl, '/properties/HN-PROP-000184/representations', {
    token: session.body.token,
    method: 'POST',
    body: {
      action: 'revoke',
      representationId: before.body.representations[0].id,
      effectiveAt: '2026-08-13',
      reason: 'Chủ sở hữu kết thúc phạm vi đại diện hiện tại.',
    },
  })
  assert.equal(revoked.status, 201)
  assert.equal(revoked.body.representation.status, 'Đã thu hồi')
  assert.equal(revoked.body.representation.version, 2)

  const after = await request(baseUrl, '/properties/HN-PROP-000184/representations', { token: session.body.token })
  assert.equal(after.body.representations.length, 2)
  assert.equal(after.body.representations.some((representation) => representation.status === 'Có hiệu lực'), true)
  assert.equal(after.body.representations.some((representation) => representation.status === 'Đã thu hồi'), true)

  const forbidden = await request(baseUrl, '/properties/HN-PROP-000219/representations', { token: session.body.token })
  assert.equal(forbidden.status, 403)
  assert.equal(forbidden.body.error.code, 'PROPERTY_SCOPE_FORBIDDEN')
})

test('seller revokes distribution consent without deleting its prior version', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const session = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'seller' } })

  const before = await request(baseUrl, '/properties/HN-PROP-000184/distribution-consents', { token: session.body.token })
  assert.equal(before.status, 200)
  assert.equal(before.body.consents.length, 1)
  assert.equal(before.body.consents[0].status, 'Có hiệu lực')

  const revoked = await request(baseUrl, '/properties/HN-PROP-000184/distribution-consents', {
    token: session.body.token,
    method: 'POST',
    body: {
      action: 'revoke',
      consentId: before.body.consents[0].id,
      effectiveAt: '2026-08-13',
      reason: 'Dừng phân phối trên các kênh đã cấp trước đó.',
    },
  })
  assert.equal(revoked.status, 201)
  assert.equal(revoked.body.consent.status, 'Đã thu hồi')
  assert.equal(revoked.body.consent.version, 2)
  assert.equal(revoked.body.consent.reconciliationRequired, true)

  const after = await request(baseUrl, '/properties/HN-PROP-000184/distribution-consents', { token: session.body.token })
  assert.equal(after.body.consents.length, 2)
  assert.equal(after.body.consents.some((consent) => consent.status === 'Có hiệu lực'), true)
  assert.equal(after.body.consents.some((consent) => consent.status === 'Đã thu hồi'), true)
})

test('seller pause request creates a review case and never mutates Listing directly', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const sellerSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'seller' } })
  const brokerSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'broker' } })

  const before = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: sellerSession.body.token })
  assert.equal(before.body.property.currentListing.status, 'Active')

  const created = await request(baseUrl, '/seller-cases', {
    token: sellerSession.body.token,
    method: 'POST',
    body: {
      propertyId: 'HN-PROP-000184',
      type: 'Tạm dừng phân phối',
      reason: 'Cần rà soát lại phạm vi đại diện trước khi tiếp tục phân phối.',
      evidenceReference: 'EV-SELLER-PAUSE-001',
    },
  })
  assert.equal(created.status, 201)
  assert.equal(created.body.case.status, 'Mới')

  const unchanged = await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: sellerSession.body.token })
  assert.equal(unchanged.body.property.currentListing.status, 'Active')

  const decided = await request(baseUrl, `/seller-cases/${created.body.case.id}/decision`, {
    token: brokerSession.body.token,
    method: 'POST',
    body: { status: 'Đã tiếp nhận', reason: 'Sàn đã khóa lịch phân phối mới và chuyển hồ sơ sang review.' },
  })
  assert.equal(decided.status, 200)
  assert.equal(decided.body.case.status, 'Đã tiếp nhận')
  assert.equal(decided.body.case.decidedBy, 'Lê Hoàng Phúc')

  const cases = await request(baseUrl, '/seller-cases', { token: sellerSession.body.token })
  assert.equal(cases.status, 200)
  assert.equal(cases.body.cases.some((item) => item.id === created.body.case.id && item.status === 'Đã tiếp nhận'), true)
})

test('seller Ownership Claim stays pending and does not verify canonical Property', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const session = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'seller' } })

  const created = await request(baseUrl, '/ownership-claims', {
    token: session.body.token,
    method: 'POST',
    body: {
      propertyId: 'HN-PROP-000219',
      relationshipType: 'Chủ sở hữu',
      ownershipShare: 100,
      evidenceReference: 'EV-CLAIM-NEW-0219',
      reason: 'Yêu cầu liên kết tài sản để HouseNow đối chiếu hồ sơ.',
    },
  })
  assert.equal(created.status, 201)
  assert.equal(created.body.claim.status, 'Chờ xác minh')

  const bootstrap = await request(baseUrl, '/bootstrap', { token: session.body.token })
  const claimedProperty = bootstrap.body.properties.find((property) => property.id === 'HN-PROP-000219')
  assert.ok(claimedProperty)
  assert.equal(claimedProperty.sellerRelationship.status, 'Chờ xác minh')
  assert.notEqual(claimedProperty.verification, 'Đã xác minh quyền sở hữu')
})

test('notification feed is projected by authenticated actor and market', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const allowedPages = {
    agent: ['listings', 'contacts', 'analytics', 'access'],
    broker: ['listings', 'quality', 'organization', 'access'],
    developer: ['projects', 'listings', 'access'],
    bank: ['finance', 'access'],
    regulator: ['oversight', 'quality', 'access'],
    buyer: ['shortlist', 'discover', 'access'],
    seller: ['properties', 'authority', 'seller-cases', 'access'],
    steward: ['quality', 'access'],
  }
  const titlesByRole = {}

  for (const roleId of Object.keys(allowedPages)) {
    const session = await request(baseUrl, '/session', { method: 'POST', body: { roleId } })
    const feed = await request(baseUrl, '/notifications?market=hanoi', { token: session.body.token })
    assert.equal(feed.status, 200)
    assert.equal(feed.body.notifications.length, 4)
    assert.equal(feed.body.notifications.every((item) => item.id.startsWith(`hanoi-${roleId}-`)), true)
    assert.equal(feed.body.notifications.every((item) => allowedPages[roleId].includes(item.page)), true)
    assert.equal(feed.body.notifications.every((item) => item.category && item.tone), true)
    titlesByRole[roleId] = feed.body.notifications.map((item) => item.title)
  }

  assert.notDeepEqual(titlesByRole.agent, titlesByRole.bank)
  assert.notDeepEqual(titlesByRole.buyer, titlesByRole.steward)

  const agentSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'agent' } })
  const invalidMarket = await request(baseUrl, '/notifications?market=all', { token: agentSession.body.token })
  assert.equal(invalidMarket.status, 400)
  assert.equal(invalidMarket.body.error.code, 'MARKET_INVALID')
})

test('access policy exposes actor projections and persists governed access requests', async (context) => {
  const store = createMlsStore({ dbPath: ':memory:' })
  const server = createHttpServer({ store })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => { server.close(); store.close() })
  const baseUrl = `http://127.0.0.1:${server.address().port}`

  const agentSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'agent' } })
  const bankSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'bank' } })
  const brokerSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'broker' } })
  const buyerSession = await request(baseUrl, '/session', { method: 'POST', body: { roleId: 'buyer' } })

  const bankAccess = await request(baseUrl, '/access', { token: bankSession.body.token })
  assert.equal(bankAccess.status, 200)
  assert.equal(bankAccess.body.profile.label, 'Ngân hàng')
  assert.equal(bankAccess.body.roleProfiles.buyer.projection.includes('never'), true)
  assert.equal(bankAccess.body.exchangePolicies.agent.recipients.bank.never.includes('Private remarks'), true)

  const invalid = await request(baseUrl, '/access-requests', { token: bankSession.body.token, method: 'POST', body: { resourceId: 'HN-PROP-000184' } })
  assert.equal(invalid.status, 422)
  assert.equal(invalid.body.error.code, 'ACCESS_REQUEST_INVALID')

  const created = await request(baseUrl, '/access-requests', {
    token: bankSession.body.token,
    method: 'POST',
    body: { resourceId: 'HN-PROP-000184', fieldGroup: 'Closing/finance data', purpose: 'Pre-qualification đã có consent', duration: '30 ngày' },
  })
  assert.equal(created.status, 201)
  assert.equal(created.body.request.status, 'Chờ duyệt')

  const buyerDecision = await request(baseUrl, `/access-requests/${created.body.request.id}/decision`, { token: buyerSession.body.token, method: 'POST', body: { status: 'Đã duyệt', reason: 'Không có authority' } })
  assert.equal(buyerDecision.status, 403)

  const approved = await request(baseUrl, `/access-requests/${created.body.request.id}/decision`, { token: brokerSession.body.token, method: 'POST', body: { status: 'Đã duyệt', reason: 'Purpose và consent phù hợp trong 30 ngày' } })
  assert.equal(approved.status, 200)
  assert.equal(approved.body.request.status, 'Đã duyệt')
  assert.equal(approved.body.request.decidedBy, 'Lê Hoàng Phúc')

  await request(baseUrl, '/properties/HN-PROP-000184/intelligence', { token: agentSession.body.token })
  const agentAccess = await request(baseUrl, '/access', { token: agentSession.body.token })
  assert.equal(agentAccess.body.accessAudit.some((event) => event.resourceId === 'HN-PROP-000184'), true)
})
