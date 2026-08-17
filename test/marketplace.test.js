import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MARKET_ACTIONS,
  MARKET_STORAGE_KEY,
  PUBLIC_DISTRIBUTION_PROJECTION_VERSION,
  createMarketState,
  getListingDetail,
  getMarketSummary,
  getRepresentedListings,
  marketplaceReducer,
  restoreMarketState,
  serializeMarketState,
} from '../src/demo/marketplace.js'

const FIRST_LISTING_ID = 'PLID-HN-31001'

function register(state, listingId = FIRST_LISTING_ID) {
  return marketplaceReducer(state, {
    type: MARKET_ACTIONS.REGISTER_CO_BROKER,
    actor: 'agent',
    payload: { listingId },
  })
}

function distribute(state, listingId = FIRST_LISTING_ID) {
  return marketplaceReducer(state, {
    type: MARKET_ACTIONS.DISTRIBUTE_LISTING,
    actor: 'agent',
    payload: { listingId, channelId: 'housenow' },
  })
}

test('market state starts with five separate synthetic represented Listings', () => {
  const state = createMarketState()

  assert.equal(MARKET_STORAGE_KEY, 'vmls:represented-market:2026-08:v1')
  assert.equal(state.version, 1)
  assert.equal(state.listings.length, 5)
  assert.equal(state.properties.length, 5)
  assert.equal(state.representations.length, 5)
  assert.equal(state.coBrokerRegistrations.length, 0)
  assert.equal(state.distributionEvents.length, 0)

  assert.equal(new Set(state.listings.map(({ id }) => id)).size, 5)
  assert.equal(new Set(state.properties.map(({ id }) => id)).size, 5)
  assert.equal(new Set(state.representations.map(({ id }) => id)).size, 5)
  assert.ok(state.representations.every(({ status }) => status === 'Đã xác nhận'))
  assert.ok(state.listings.every(({ status }) => status === 'Đang hiệu lực'))
  assert.ok(state.listings.every(({ industryVisibility }) => industryVisibility === 'Được phép tra cứu'))

  const allIdentifiers = JSON.stringify({
    properties: state.properties.map(({ id }) => id),
    listings: state.listings.map(({ id }) => id),
  })
  assert.doesNotMatch(allIdentifiers, /NPID-HN-09876|NPID-HN-10421/u)
  assert.ok(state.listings.every((listing) => listing.id !== listing.propertyId))
  assert.ok(state.listings.every((listing) => listing.id !== listing.representationId))
})

test('Industry projections use an explicit allowlist and fail closed for Restricted data', () => {
  const state = createMarketState()
  state.properties[0].ownerPhone = '0900000000'
  state.properties[0].privateRemarks = 'Không chia sẻ'
  state.representations[0].sellerName = 'Chủ sở hữu thử nghiệm'
  state.representations[0].ownerEmail = 'owner@example.test'

  const [projected] = getRepresentedListings(state, { npid: 'NPID-HN-21001' })
  assert.deepEqual(Object.keys(projected), [
    'listingId',
    'property',
    'project',
    'listing',
    'representation',
    'responsibleAgent',
    'collaboration',
    'provenance',
  ])
  assert.deepEqual(Object.keys(projected.property), [
    'id',
    'type',
    'unitLabel',
    'location',
    'area',
    'bedrooms',
    'bathrooms',
  ])
  assert.deepEqual(Object.keys(projected.representation), [
    'status',
    'effectiveFrom',
    'expiresOn',
  ])
  assert.deepEqual(Object.keys(projected.collaboration), [
    'status',
    'registrationOpen',
    'activity',
    'ownRegistration',
    'allowedChannels',
    'distributions',
  ])
  assert.deepEqual(projected.collaboration.activity, {
    registrationCount: 0,
    distributionCount: 0,
  })
  assert.deepEqual(Object.keys(projected.provenance), ['sourceSummary'])

  const serializedProjection = JSON.stringify(projected)
  assert.doesNotMatch(serializedProjection, /representationId|confirmedAt|sellerPartyReference|evidenceReferences/u)
  assert.doesNotMatch(serializedProjection, /ownerPhone|ownerEmail|privateRemarks|0900000000/u)
  assert.doesNotMatch(serializedProjection, /PARTY-SELLER|EVIDENCE-REP/u)
})

test('represented inventory filters NPID, area, developer and project with AND semantics', () => {
  const state = createMarketState()

  assert.equal(getRepresentedListings(state, { npid: '  npid-hn-21003 ' }).length, 1)
  assert.equal(getRepresentedListings(state, { area: 'tây hồ' }).length, 2)
  assert.equal(getRepresentedListings(state, { developer: 'phát triển thăng long' }).length, 1)
  assert.equal(getRepresentedListings(state, { project: 'Mỹ Đình' }).length, 1)

  const combined = getRepresentedListings(state, {
    area: 'Nam Từ Liêm',
    developer: 'Phát triển Mỹ Đình',
    project: 'Central',
  })
  assert.deepEqual(combined.map(({ listingId }) => listingId), ['PLID-HN-31003'])
  assert.deepEqual(getRepresentedListings(state, {
    area: 'Tây Hồ',
    project: 'Mỹ Đình',
  }), [])

  assert.deepEqual(getRepresentedListings(state, { owner: 'ẩn' }), [])
  assert.deepEqual(getRepresentedListings(state, { area: 21 }), [])
  assert.deepEqual(getRepresentedListings(state, null), [])
})

test('co-broker registration has exact command guards and is idempotent', () => {
  const initial = createMarketState()
  const valid = {
    type: MARKET_ACTIONS.REGISTER_CO_BROKER,
    actor: 'agent',
    payload: { listingId: FIRST_LISTING_ID },
  }

  assert.strictEqual(marketplaceReducer(initial, { ...valid, actor: 'seller' }), initial)
  assert.strictEqual(marketplaceReducer(initial, {
    ...valid,
    payload: { ...valid.payload, agentReference: 'AGENT-OTHER' },
  }), initial)
  assert.strictEqual(marketplaceReducer(initial, {
    ...valid,
    payload: { listingId: 'PLID-HN-DOES-NOT-EXIST' },
  }), initial)
  assert.strictEqual(marketplaceReducer(initial, { ...valid, correlationId: 'extra' }), initial)

  const registered = marketplaceReducer(initial, {
    ...valid,
    payload: { listingId: '  plid-hn-31001 ' },
  })
  assert.notStrictEqual(registered, initial)
  assert.equal(registered.representations[0].status, 'Đã xác nhận')
  assert.deepEqual(registered.coBrokerRegistrations, [{
    id: 'HTB-HN-00001',
    listingId: FIRST_LISTING_ID,
    representationId: 'REP-HN-41001',
    agentReference: 'AGENT-HN-COBROKER-001',
    organizationReference: 'ORG-HN-AGENCY-021',
    status: 'Đã đăng ký hợp tác',
    registeredAt: '2026-08-17T10:01:00+07:00',
    effectiveFrom: '2026-08-17',
    expiresOn: '2026-11-05',
  }])
  assert.strictEqual(marketplaceReducer(registered, valid), registered)
})

test('HouseNow distribution requires registration and consent, emits only the public allowlist, and is idempotent', () => {
  const initial = createMarketState()
  const valid = {
    type: MARKET_ACTIONS.DISTRIBUTE_LISTING,
    actor: 'agent',
    payload: { listingId: FIRST_LISTING_ID, channelId: 'housenow' },
  }

  assert.strictEqual(marketplaceReducer(initial, valid), initial)
  const registered = register(initial)
  assert.strictEqual(marketplaceReducer(registered, {
    ...valid,
    actor: 'brokerage',
  }), registered)
  assert.strictEqual(marketplaceReducer(registered, {
    ...valid,
    payload: { ...valid.payload, channelId: 'other-channel' },
  }), registered)
  assert.strictEqual(marketplaceReducer(registered, {
    ...valid,
    payload: { ...valid.payload, retry: true },
  }), registered)

  const wrongPurpose = structuredClone(registered)
  wrongPurpose.representations[0].distributionConsent.purpose = 'Mục đích khác'
  assert.deepEqual(
    getListingDetail(wrongPurpose, FIRST_LISTING_ID).collaboration.allowedChannels,
    [],
  )
  assert.strictEqual(marketplaceReducer(wrongPurpose, valid), wrongPurpose)

  const expiredConsent = structuredClone(registered)
  expiredConsent.representations[0].distributionConsent.expiresOn = '2026-08-16'
  assert.deepEqual(
    getListingDetail(expiredConsent, FIRST_LISTING_ID).collaboration.allowedChannels,
    [],
  )
  assert.strictEqual(marketplaceReducer(expiredConsent, valid), expiredConsent)

  const expiredRegistration = structuredClone(registered)
  expiredRegistration.coBrokerRegistrations[0].expiresOn = '2026-08-16'
  assert.strictEqual(marketplaceReducer(expiredRegistration, valid), expiredRegistration)

  const distributed = marketplaceReducer(registered, valid)
  assert.notStrictEqual(distributed, registered)
  assert.equal(distributed.distributionEvents.length, 1)
  const [event] = distributed.distributionEvents
  assert.equal(event.status, 'Đã gửi')
  assert.equal(event.acknowledgement, 'Chờ phản hồi kênh')
  assert.equal(event.purpose, 'Phân phối Tin bán')
  assert.equal(event.projectionVersion, PUBLIC_DISTRIBUTION_PROJECTION_VERSION)
  assert.deepEqual(event.channel, { id: 'housenow', name: 'HouseNow' })
  assert.deepEqual(Object.keys(event.payload), [
    'listingId',
    'propertyId',
    'title',
    'propertyType',
    'projectName',
    'developerName',
    'location',
    'area',
    'bedrooms',
    'bathrooms',
    'mediaCount',
    'askingPrice',
    'businessContact',
  ])
  assert.deepEqual(Object.keys(event.payload.location), ['district', 'city'])
  assert.deepEqual(Object.keys(event.payload.area), ['value', 'unit', 'concept'])
  assert.deepEqual(Object.keys(event.payload.askingPrice), ['value', 'currency'])
  assert.deepEqual(Object.keys(event.payload.businessContact), ['displayName', 'organizationName'])
  assert.doesNotMatch(JSON.stringify(event.payload), /seller|owner|agent|phone|email|evidence/iu)
  assert.strictEqual(marketplaceReducer(distributed, valid), distributed)

  const detail = getListingDetail(distributed, FIRST_LISTING_ID)
  assert.equal(
    detail.collaboration.distributions[0].projectionVersion,
    PUBLIC_DISTRIBUTION_PROJECTION_VERSION,
  )
})

test('listing detail separates current-agent participation from aggregate activity', () => {
  let state = createMarketState()
  assert.deepEqual(getMarketSummary(state), {
    representedListings: 5,
    openForCollaboration: 5,
    registeredByCurrentAgent: 0,
    sentToHouseNow: 0,
    awaitingChannelResponse: 0,
  })

  state = register(state)
  state = distribute(state)
  const detail = getListingDetail(state, 'NPID-HN-21001')
  assert.equal(detail.listingId, FIRST_LISTING_ID)
  assert.equal(detail.collaboration.ownRegistration.status, 'Đã đăng ký hợp tác')
  assert.equal(detail.collaboration.ownRegistration.expiresOn, '2026-11-05')
  assert.deepEqual(detail.collaboration.distributions, [{
    id: 'PP-HN-00001',
    channel: { id: 'housenow', name: 'HouseNow' },
    status: 'Đã gửi',
    acknowledgement: 'Chờ phản hồi kênh',
    purpose: 'Phân phối Tin bán',
    projectionVersion: PUBLIC_DISTRIBUTION_PROJECTION_VERSION,
    sentAt: '2026-08-17T10:02:00+07:00',
  }])
  assert.deepEqual(detail.collaboration.activity, {
    registrationCount: 1,
    distributionCount: 1,
  })
  assert.deepEqual(getMarketSummary(state), {
    representedListings: 5,
    openForCollaboration: 5,
    registeredByCurrentAgent: 1,
    sentToHouseNow: 1,
    awaitingChannelResponse: 1,
  })
  assert.equal(getListingDetail(state, 'UNKNOWN'), null)
})

test('market progress persists as validated commands and tampered envelopes fail closed', () => {
  const initial = createMarketState()
  const progressed = distribute(register(initial))
  const serialized = serializeMarketState(progressed)
  const envelope = JSON.parse(serialized)

  assert.deepEqual(Object.keys(envelope), ['version', 'actions'])
  assert.equal(envelope.version, 1)
  assert.equal(envelope.actions.length, 2)
  assert.doesNotMatch(serialized, /PARTY-SELLER|EVIDENCE-REP|Công ty CP|askingPrice/u)
  assert.deepEqual(restoreMarketState(serialized), progressed)

  assert.deepEqual(restoreMarketState(null), initial)
  assert.deepEqual(restoreMarketState('{not-json'), initial)
  assert.deepEqual(restoreMarketState(JSON.stringify({
    version: 2,
    actions: envelope.actions,
  })), initial)
  assert.deepEqual(restoreMarketState(JSON.stringify({
    version: 1,
    actions: [envelope.actions[0], envelope.actions[0]],
  })), initial)
  assert.deepEqual(restoreMarketState(JSON.stringify({
    version: 1,
    actions: [{
      ...envelope.actions[0],
      payload: { ...envelope.actions[0].payload, sellerPartyReference: 'PARTY-LEAK' },
    }],
  })), initial)
  assert.deepEqual(restoreMarketState(JSON.stringify({
    version: 1,
    actions: envelope.actions,
    rawState: progressed,
  })), initial)

  const injected = createMarketState()
  injected.actionLog.push({
    ...envelope.actions[0],
    payload: { ...envelope.actions[0].payload, ownerPhone: '0900000000' },
  })
  assert.deepEqual(JSON.parse(serializeMarketState(injected)), {
    version: 1,
    actions: [],
  })
})
