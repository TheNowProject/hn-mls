import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MARKET_ACTIONS,
  MARKET_STORAGE_KEY,
  PUBLICATION_FIELD_GROUPS,
  createMarketState,
  getPublicListing,
  getMarketSummary,
  getRepresentedListings,
  getSellerListingDetail,
  getSellerListings,
  marketplaceReducer,
  restoreMarketState,
  serializeMarketState,
} from '../src/demo/marketplace.js'

const LISTING_ID = 'PLID-HN-31001'
const VISIBLE_WITHOUT_DETAIL_OR_IMAGES = [
  'price',
  'projectUnit',
  'areas',
  'features',
  'description',
]

function register(state) {
  return marketplaceReducer(state, {
    type: MARKET_ACTIONS.REGISTER_CO_BROKER,
    actor: 'agent',
    payload: { listingId: LISTING_ID },
  })
}

function distribute(state) {
  return marketplaceReducer(state, {
    type: MARKET_ACTIONS.DISTRIBUTE_LISTING,
    actor: 'agent',
    payload: { listingId: LISTING_ID, channelId: 'housenow' },
  })
}

function saveHiddenDetailAndImages(state) {
  return marketplaceReducer(state, {
    type: MARKET_ACTIONS.SAVE_PUBLICATION_DRAFT,
    actor: 'seller',
    payload: { listingId: LISTING_ID, visibleGroups: VISIBLE_WITHOUT_DETAIL_OR_IMAGES },
  })
}

function applyProfile(state) {
  return marketplaceReducer(state, {
    type: MARKET_ACTIONS.APPLY_PUBLICATION_PROFILE,
    actor: 'seller',
    payload: { listingId: LISTING_ID },
  })
}

test('market v2 starts with versioned PublicationProfiles and one seller-owned Listing', () => {
  const state = createMarketState()

  assert.equal(MARKET_STORAGE_KEY, 'vmls:represented-market:2026-08:v2')
  assert.equal(state.version, 2)
  assert.equal(state.publicationProfiles.length, 5)
  assert.deepEqual(PUBLICATION_FIELD_GROUPS.map(({ id, locked }) => ({ id, locked })), [
    { id: 'identity', locked: true },
    { id: 'propertyType', locked: true },
    { id: 'generalLocation', locked: true },
    { id: 'businessContact', locked: true },
    { id: 'price', locked: false },
    { id: 'projectUnit', locked: false },
    { id: 'detailedLocation', locked: false },
    { id: 'areas', locked: false },
    { id: 'features', locked: false },
    { id: 'description', locked: false },
    { id: 'images', locked: false },
  ])

  const sellerListings = getSellerListings(state)
  assert.equal(sellerListings.length, 1)
  assert.equal(sellerListings[0].listingId, LISTING_ID)
  assert.equal(getSellerListingDetail(state, 'PLID-HN-31002'), null)

  const profile = sellerListings[0].publicationProfile
  assert.equal(profile.id, 'PUB-HN-31001')
  assert.equal(profile.draft.version, 1)
  assert.equal(profile.applied.version, 1)
  assert.deepEqual(profile.draft.visibleGroups, [
    'price',
    'projectUnit',
    'detailedLocation',
    'areas',
    'features',
    'description',
    'images',
  ])
  assert.deepEqual(profile.applied.visibleGroups, profile.draft.visibleGroups)
})

test('Seller saves a draft before applying a structurally filtered Public projection', () => {
  const initial = createMarketState()
  const saveAction = {
    type: MARKET_ACTIONS.SAVE_PUBLICATION_DRAFT,
    actor: 'seller',
    payload: {
      listingId: LISTING_ID,
      visibleGroups: VISIBLE_WITHOUT_DETAIL_OR_IMAGES,
    },
  }

  assert.strictEqual(marketplaceReducer(initial, { ...saveAction, actor: 'agent' }), initial)
  assert.strictEqual(marketplaceReducer(initial, {
    ...saveAction,
    payload: { ...saveAction.payload, hiddenGroups: ['images'] },
  }), initial)
  assert.strictEqual(marketplaceReducer(initial, {
    ...saveAction,
    payload: { ...saveAction.payload, visibleGroups: [...VISIBLE_WITHOUT_DETAIL_OR_IMAGES, 'identity'] },
  }), initial)
  assert.strictEqual(marketplaceReducer(initial, {
    ...saveAction,
    payload: { ...saveAction.payload, listingId: 'PLID-HN-31002' },
  }), initial)

  const before = getPublicListing(initial, LISTING_ID)
  assert.equal(before.detailedLocation.ward, 'Phú Thượng')
  assert.equal(before.mediaCount, 14)

  const saved = marketplaceReducer(initial, saveAction)
  const savedDetail = getSellerListingDetail(saved, LISTING_ID)
  assert.equal(savedDetail.publicationProfile.draft.version, 2)
  assert.equal(savedDetail.publicationProfile.applied.version, 1)
  assert.deepEqual(savedDetail.publicationProfile.draft.visibleGroups, VISIBLE_WITHOUT_DETAIL_OR_IMAGES)
  assert.deepEqual(getPublicListing(saved, LISTING_ID), before)

  const industryBefore = getRepresentedListings(initial, { npid: 'NPID-HN-21001' })[0]
  const industryAfterSave = getRepresentedListings(saved, { npid: 'NPID-HN-21001' })[0]
  assert.deepEqual(industryAfterSave, industryBefore)

  const applyAction = {
    type: MARKET_ACTIONS.APPLY_PUBLICATION_PROFILE,
    actor: 'seller',
    payload: { listingId: LISTING_ID },
  }
  assert.strictEqual(marketplaceReducer(saved, { ...applyAction, actor: 'brokerage' }), saved)
  const applied = marketplaceReducer(saved, applyAction)
  const publicListing = getPublicListing(applied, LISTING_ID)
  const appliedDetail = getSellerListingDetail(applied, LISTING_ID)

  assert.equal(appliedDetail.publicationProfile.applied.version, 2)
  assert.equal(appliedDetail.publicationProfile.applied.id, 'PUB-HN-31001-V002')
  assert.deepEqual(appliedDetail.publicationProfile.applied.visibleGroups, VISIBLE_WITHOUT_DETAIL_OR_IMAGES)
  assert.equal(Object.hasOwn(publicListing, 'detailedLocation'), false)
  assert.equal(Object.hasOwn(publicListing, 'mediaCount'), false)
  assert.doesNotMatch(JSON.stringify(publicListing), /Phú Thượng|14/u)
  assert.deepEqual(getRepresentedListings(applied, { npid: 'NPID-HN-21001' })[0], industryBefore)
  assert.strictEqual(marketplaceReducer(applied, applyAction), applied)
})

test('each optional Publication group is structurally independent', () => {
  const optionalGroups = PUBLICATION_FIELD_GROUPS.filter(({ locked }) => !locked).map(({ id }) => id)
  const omittedKeys = {
    price: ['askingPrice'],
    projectUnit: ['title', 'projectName', 'developerName', 'unitLabel'],
    detailedLocation: ['detailedLocation'],
    areas: ['area'],
    features: ['bedrooms', 'bathrooms', 'features'],
    description: ['description'],
    images: ['mediaCount'],
  }

  for (const hiddenGroup of optionalGroups) {
    const initial = createMarketState()
    const saved = marketplaceReducer(initial, {
      type: MARKET_ACTIONS.SAVE_PUBLICATION_DRAFT,
      actor: 'seller',
      payload: {
        listingId: LISTING_ID,
        visibleGroups: optionalGroups.filter((groupId) => groupId !== hiddenGroup),
      },
    })
    const applied = marketplaceReducer(saved, {
      type: MARKET_ACTIONS.APPLY_PUBLICATION_PROFILE,
      actor: 'seller',
      payload: { listingId: LISTING_ID },
    })
    const projection = getPublicListing(applied, LISTING_ID)

    for (const key of omittedKeys[hiddenGroup]) assert.equal(Object.hasOwn(projection, key), false)
    if (hiddenGroup === 'projectUnit') {
      assert.doesNotMatch(JSON.stringify(projection), /A2-1208|Tây Hồ Garden|Công ty CP Đô thị Hồ Tây/u)
    }
    if (hiddenGroup === 'detailedLocation') {
      assert.doesNotMatch(JSON.stringify(projection), /Phú Thượng/u)
    }
    if (hiddenGroup === 'features') {
      assert.doesNotMatch(JSON.stringify(projection), /phòng ngủ|phòng tắm/iu)
    }
  }
})

test('HouseNow records the applied profile and later visibility changes require reconciliation', () => {
  const distributed = distribute(register(createMarketState()))
  const originalEvent = structuredClone(distributed.distributionEvents[0])

  assert.equal(originalEvent.publicationProfileId, 'PUB-HN-31001-V001')
  assert.equal(originalEvent.publicationProfileVersion, 1)
  assert.equal(originalEvent.payload.detailedLocation.ward, 'Phú Thượng')
  assert.equal(originalEvent.payload.mediaCount, 14)
  assert.deepEqual(distributed.channelStates, [{
    listingId: LISTING_ID,
    channel: { id: 'housenow', name: 'HouseNow' },
    status: 'Đã gửi',
    acknowledgement: 'Chờ phản hồi kênh',
    lastDistributionEventId: 'PP-HN-00001',
    updatedAt: '2026-08-17T10:02:00+07:00',
  }])

  const applied = applyProfile(saveHiddenDetailAndImages(distributed))
  const sellerDetail = getSellerListingDetail(applied, LISTING_ID)

  assert.deepEqual(applied.distributionEvents[0], originalEvent)
  assert.equal(sellerDetail.channelStates[0].status, 'Cần cập nhật')
  assert.equal(sellerDetail.channelStates[0].acknowledgement, 'Chờ đồng bộ lại')
  assert.equal(applied.reconciliationEvents.length, 1)
  assert.deepEqual(applied.reconciliationEvents[0], {
    id: 'DREC-HN-00001',
    listingId: LISTING_ID,
    channelId: 'housenow',
    reason: 'publication_profile_changed',
    relatedRecordId: 'PUB-HN-31001-V002',
    status: 'Cần cập nhật',
    createdAt: '2026-08-17T10:04:00+07:00',
  })
  assert.equal(Object.hasOwn(sellerDetail.publicProjection, 'detailedLocation'), false)
  assert.equal(Object.hasOwn(sellerDetail.publicProjection, 'mediaCount'), false)
})

test('Seller price correction is applied only by Brokerage as an auditable Listing revision', () => {
  const distributed = distribute(register(createMarketState()))
  const requestAction = {
    type: MARKET_ACTIONS.REQUEST_LISTING_CORRECTION,
    actor: 'seller',
    payload: {
      listingId: LISTING_ID,
      field: 'askingPrice',
      proposedValue: { value: 7_850_000_000, currency: 'VND' },
      reason: 'Điều chỉnh theo giá chào bán đã thống nhất',
    },
  }

  assert.strictEqual(marketplaceReducer(distributed, { ...requestAction, actor: 'agent' }), distributed)
  assert.strictEqual(marketplaceReducer(distributed, {
    ...requestAction,
    payload: { ...requestAction.payload, field: 'ownerPhone' },
  }), distributed)
  assert.strictEqual(marketplaceReducer(distributed, {
    ...requestAction,
    payload: {
      ...requestAction.payload,
      proposedValue: { value: 7_850_000_000, currency: 'USD' },
    },
  }), distributed)
  assert.strictEqual(marketplaceReducer(distributed, {
    ...requestAction,
    payload: { ...requestAction.payload, sellerPartyReference: 'PARTY-LEAK' },
  }), distributed)

  const requested = marketplaceReducer(distributed, requestAction)
  assert.deepEqual(requested.sellerCorrectionRequests, [{
    id: 'SCR-HN-00001',
    listingId: LISTING_ID,
    field: 'askingPrice',
    currentValue: { value: 7_680_000_000, currency: 'VND' },
    proposedValue: { value: 7_850_000_000, currency: 'VND' },
    reason: 'Điều chỉnh theo giá chào bán đã thống nhất',
    status: 'Chờ Sàn xử lý',
    requestedBy: 'seller',
    requestedAt: '2026-08-17T10:03:00+07:00',
    resolvedBy: null,
    resolvedAt: null,
  }])
  assert.strictEqual(marketplaceReducer(requested, requestAction), requested)

  const applyAction = {
    type: MARKET_ACTIONS.APPLY_LISTING_CORRECTION,
    actor: 'brokerage',
    payload: { requestId: 'SCR-HN-00001' },
  }
  assert.strictEqual(marketplaceReducer(requested, { ...applyAction, actor: 'seller' }), requested)
  assert.strictEqual(marketplaceReducer(requested, {
    ...applyAction,
    payload: { ...applyAction.payload, approved: true },
  }), requested)

  const applied = marketplaceReducer(requested, applyAction)
  const sellerDetail = getSellerListingDetail(applied, LISTING_ID)

  assert.deepEqual(sellerDetail.listing.askingPrice, { value: 7_850_000_000, currency: 'VND' })
  assert.deepEqual(sellerDetail.publicProjection.askingPrice, {
    value: 7_850_000_000,
    currency: 'VND',
  })
  assert.equal(sellerDetail.correctionRequests[0].status, 'Đã áp dụng')
  assert.equal(sellerDetail.correctionRequests[0].resolvedBy, 'brokerage')
  assert.deepEqual(applied.listingRevisions, [{
    id: 'REV-HN-00001',
    listingId: LISTING_ID,
    version: 2,
    field: 'askingPrice',
    beforeValue: { value: 7_680_000_000, currency: 'VND' },
    afterValue: { value: 7_850_000_000, currency: 'VND' },
    reason: 'Điều chỉnh theo giá chào bán đã thống nhất',
    correctionRequestId: 'SCR-HN-00001',
    appliedBy: 'brokerage',
    appliedAt: '2026-08-17T10:04:00+07:00',
  }])
  assert.deepEqual(applied.auditEvents, [{
    id: 'AUD-MARKET-00001',
    type: 'listing_correction_applied',
    actor: 'brokerage',
    organizationReference: 'ORG-HN-BROKERAGE-001',
    target: { type: 'Listing', id: LISTING_ID },
    field: 'askingPrice',
    beforeValue: { value: 7_680_000_000, currency: 'VND' },
    afterValue: { value: 7_850_000_000, currency: 'VND' },
    reason: 'Điều chỉnh theo giá chào bán đã thống nhất',
    sourceRequestId: 'SCR-HN-00001',
    occurredAt: '2026-08-17T10:04:00+07:00',
  }])
  assert.deepEqual(applied.distributionEvents[0].payload.askingPrice, {
    value: 7_680_000_000,
    currency: 'VND',
  })
  assert.equal(sellerDetail.channelStates[0].status, 'Cần cập nhật')
  assert.equal(applied.reconciliationEvents[0].reason, 'listing_correction_applied')
  assert.equal(applied.reconciliationEvents[0].relatedRecordId, 'REV-HN-00001')
  assert.deepEqual(getMarketSummary(applied), {
    representedListings: 5,
    openForCollaboration: 5,
    registeredByCurrentAgent: 1,
    sentToHouseNow: 1,
    awaitingChannelResponse: 0,
  })
  assert.doesNotMatch(JSON.stringify(getPublicListing(applied, LISTING_ID)), /SCR-HN|PARTY-SELLER|Điều chỉnh/u)
  assert.doesNotMatch(JSON.stringify(getRepresentedListings(applied)), /SCR-HN|PARTY-SELLER|Điều chỉnh/u)
  assert.strictEqual(marketplaceReducer(applied, applyAction), applied)
})

test('market v2 replays governance commands and rejects legacy or tampered envelopes', () => {
  let state = distribute(register(createMarketState()))
  state = applyProfile(saveHiddenDetailAndImages(state))
  state = marketplaceReducer(state, {
    type: MARKET_ACTIONS.REQUEST_LISTING_CORRECTION,
    actor: 'seller',
    payload: {
      listingId: LISTING_ID,
      field: 'askingPrice',
      proposedValue: { value: 7_850_000_000, currency: 'VND' },
      reason: 'Điều chỉnh theo giá chào bán đã thống nhất',
    },
  })
  state = marketplaceReducer(state, {
    type: MARKET_ACTIONS.APPLY_LISTING_CORRECTION,
    actor: 'brokerage',
    payload: { requestId: 'SCR-HN-00001' },
  })

  const serialized = serializeMarketState(state)
  const envelope = JSON.parse(serialized)
  assert.deepEqual(Object.keys(envelope), ['version', 'actions'])
  assert.equal(envelope.version, 2)
  assert.equal(envelope.actions.length, 6)
  assert.deepEqual(restoreMarketState(serialized), state)
  assert.doesNotMatch(serialized, /PARTY-SELLER|ownerPhone|buyer/iu)

  const initial = createMarketState()
  assert.deepEqual(restoreMarketState(JSON.stringify({ version: 1, actions: [] })), initial)
  assert.deepEqual(restoreMarketState(JSON.stringify({
    version: 2,
    actions: [{
      type: MARKET_ACTIONS.SAVE_PUBLICATION_DRAFT,
      actor: 'seller',
      payload: {
        listingId: LISTING_ID,
        visibleGroups: [...VISIBLE_WITHOUT_DETAIL_OR_IMAGES, 'identity'],
      },
    }],
  })), initial)
  assert.deepEqual(restoreMarketState(JSON.stringify({
    version: 2,
    actions: envelope.actions,
    publicationProfiles: state.publicationProfiles,
  })), initial)

  const injected = structuredClone(state)
  injected.actionLog[2].payload.ownerPhone = '0900000000'
  assert.deepEqual(JSON.parse(serializeMarketState(injected)), { version: 2, actions: [] })
})

test('Public and Industry projections never expose seller, buyer, correction or audit records', () => {
  const state = createMarketState()
  state.properties[0].ownerPhone = '0900000000'
  state.properties[0].buyerIdentity = 'BUYER-PRIVATE'
  state.representations[0].sellerName = 'Người bán riêng tư'
  state.auditEvents.push({ reason: 'Ghi chú nội bộ' })
  state.sellerCorrectionRequests.push({ reason: 'Yêu cầu nội bộ' })

  const publicListing = getPublicListing(state, LISTING_ID)
  const industryListing = getRepresentedListings(state, { npid: 'NPID-HN-21001' })[0]
  for (const projection of [publicListing, industryListing]) {
    const serialized = JSON.stringify(projection)
    assert.doesNotMatch(
      serialized,
      /0900000000|BUYER-PRIVATE|Người bán riêng tư|Ghi chú nội bộ|Yêu cầu nội bộ/iu,
    )
    assert.doesNotMatch(serialized, /sellerPartyReference|evidenceReferences|ownerPhone/iu)
  }

  const malformed = structuredClone(state)
  malformed.publicationProfiles = []
  assert.equal(getPublicListing(malformed, LISTING_ID), null)
})
