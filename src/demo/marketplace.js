// @ts-check

/**
 * A deterministic, client-only market module for the represented-listing demo.
 *
 * Property, Listing, Representation, CoBrokerRegistration and DistributionEvent
 * deliberately remain separate records. Consumers receive an explicit Industry
 * projection rather than the fixture records themselves.
 */

export const MARKET_STORAGE_KEY = 'vmls:represented-market:2026-08:v1'
export const PUBLIC_DISTRIBUTION_PROJECTION_VERSION = 'vmls-public-listing-v1'

export const MARKET_ACTIONS = Object.freeze({
  REGISTER_CO_BROKER: 'register_co_broker',
  DISTRIBUTE_LISTING: 'distribute_listing',
})

const MARKET_VERSION = 1
const MARKET_DATA_VERSION = 'vmls-represented-market-2026-08-v1'
const MARKET_EFFECTIVE_AT = '2026-08-17T10:00:00+07:00'
const DISTRIBUTION_PURPOSE = 'Phân phối Tin bán'
const CURRENT_AGENT = Object.freeze({
  reference: 'AGENT-HN-COBROKER-001',
  displayName: 'Lê M. K.',
  organizationReference: 'ORG-HN-AGENCY-021',
  organizationName: 'Sàn Thành Phố',
})

const CHANNELS = Object.freeze({
  housenow: Object.freeze({
    id: 'housenow',
    name: 'HouseNow',
  }),
})

const clone = (value) => structuredClone(value)

/**
 * @param {unknown} value
 * @returns {value is Record<string, any>}
 */
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * @param {unknown} value
 * @param {string[]} expectedKeys
 */
function hasExactKeys(value, expectedKeys) {
  if (!isPlainObject(value)) return false
  const actualKeys = Object.keys(value).sort()
  const allowedKeys = [...expectedKeys].sort()
  return actualKeys.length === allowedKeys.length
    && actualKeys.every((key, index) => key === allowedKeys[index])
}

/** @param {unknown} value */
function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim().toLocaleLowerCase('vi-VN')
    : ''
}

/** @param {unknown} value */
function normalizeIdentifier(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : ''
}

/**
 * All records below are synthetic and use identifiers that do not overlap the
 * two operational journey dossiers.
 */
const MARKET_FIXTURES = Object.freeze([
  {
    property: {
      id: 'NPID-HN-21001',
      type: 'Căn hộ chung cư',
      unitLabel: 'A2-1208',
      location: {
        ward: 'Phú Thượng',
        district: 'Tây Hồ',
        city: 'Hà Nội',
      },
      area: { value: 72.4, unit: 'm²', concept: 'Thông thủy' },
      bedrooms: 2,
      bathrooms: 2,
      sourceSummary: 'Hồ sơ dự án và xác nhận quyền đại diện',
    },
    project: {
      id: 'PROJECT-HN-51001',
      name: 'Tây Hồ Garden',
      developer: {
        id: 'DEVELOPER-HN-61001',
        name: 'Công ty CP Đô thị Hồ Tây',
      },
    },
    listing: {
      id: 'PLID-HN-31001',
      propertyId: 'NPID-HN-21001',
      representationId: 'REP-HN-41001',
      status: 'Đang hiệu lực',
      industryVisibility: 'Được phép tra cứu',
      transactionType: 'Bán',
      visibility: 'Thị trường nội bộ',
      askingPrice: { value: 7_680_000_000, currency: 'VND' },
      mediaCount: 14,
      effectiveFrom: '2026-08-05',
      expiresOn: '2026-11-05',
    },
    representation: {
      id: 'REP-HN-41001',
      propertyId: 'NPID-HN-21001',
      listingId: 'PLID-HN-31001',
      sellerPartyReference: 'PARTY-SELLER-HN-71001',
      evidenceReferences: ['EVIDENCE-REP-HN-81001'],
      status: 'Đã xác nhận',
      scope: 'Không độc quyền',
      confirmedAt: '2026-08-04T09:18:00+07:00',
      effectiveFrom: '2026-08-05',
      expiresOn: '2026-11-05',
      responsibleAgent: {
        reference: 'AGENT-HN-11001',
        displayName: 'Trần H. A.',
        organizationName: 'Sàn Hồ Tây',
      },
      collaboration: { status: 'Mở đăng ký', registrationOpen: true },
      distributionConsent: {
        channelIds: ['housenow'],
        purpose: DISTRIBUTION_PURPOSE,
        effectiveFrom: '2026-08-05',
        expiresOn: '2026-11-05',
      },
    },
  },
  {
    property: {
      id: 'NPID-HN-21002',
      type: 'Căn hộ chung cư',
      unitLabel: 'B1-1805',
      location: {
        ward: 'Xuân La',
        district: 'Tây Hồ',
        city: 'Hà Nội',
      },
      area: { value: 85.1, unit: 'm²', concept: 'Thông thủy' },
      bedrooms: 3,
      bathrooms: 2,
      sourceSummary: 'Hồ sơ dự án và xác nhận quyền đại diện',
    },
    project: {
      id: 'PROJECT-HN-51002',
      name: 'Thăng Long Riverside',
      developer: {
        id: 'DEVELOPER-HN-61002',
        name: 'Công ty CP Phát triển Thăng Long',
      },
    },
    listing: {
      id: 'PLID-HN-31002',
      propertyId: 'NPID-HN-21002',
      representationId: 'REP-HN-41002',
      status: 'Đang hiệu lực',
      industryVisibility: 'Được phép tra cứu',
      transactionType: 'Bán',
      visibility: 'Thị trường nội bộ',
      askingPrice: { value: 9_250_000_000, currency: 'VND' },
      mediaCount: 18,
      effectiveFrom: '2026-08-07',
      expiresOn: '2026-12-07',
    },
    representation: {
      id: 'REP-HN-41002',
      propertyId: 'NPID-HN-21002',
      listingId: 'PLID-HN-31002',
      sellerPartyReference: 'PARTY-SELLER-HN-71002',
      evidenceReferences: ['EVIDENCE-REP-HN-81002'],
      status: 'Đã xác nhận',
      scope: 'Độc quyền',
      confirmedAt: '2026-08-06T14:20:00+07:00',
      effectiveFrom: '2026-08-07',
      expiresOn: '2026-12-07',
      responsibleAgent: {
        reference: 'AGENT-HN-11002',
        displayName: 'Nguyễn T. M.',
        organizationName: 'Sàn Bắc Hà Nội',
      },
      collaboration: { status: 'Mở đăng ký', registrationOpen: true },
      distributionConsent: {
        channelIds: ['housenow'],
        purpose: DISTRIBUTION_PURPOSE,
        effectiveFrom: '2026-08-07',
        expiresOn: '2026-12-07',
      },
    },
  },
  {
    property: {
      id: 'NPID-HN-21003',
      type: 'Căn hộ chung cư',
      unitLabel: 'C3-0912',
      location: {
        ward: 'Mỹ Đình 1',
        district: 'Nam Từ Liêm',
        city: 'Hà Nội',
      },
      area: { value: 63.8, unit: 'm²', concept: 'Thông thủy' },
      bedrooms: 2,
      bathrooms: 2,
      sourceSummary: 'Hồ sơ dự án và xác nhận quyền đại diện',
    },
    project: {
      id: 'PROJECT-HN-51003',
      name: 'Mỹ Đình Central',
      developer: {
        id: 'DEVELOPER-HN-61003',
        name: 'Công ty CP Phát triển Mỹ Đình',
      },
    },
    listing: {
      id: 'PLID-HN-31003',
      propertyId: 'NPID-HN-21003',
      representationId: 'REP-HN-41003',
      status: 'Đang hiệu lực',
      industryVisibility: 'Được phép tra cứu',
      transactionType: 'Bán',
      visibility: 'Thị trường nội bộ',
      askingPrice: { value: 5_390_000_000, currency: 'VND' },
      mediaCount: 11,
      effectiveFrom: '2026-08-09',
      expiresOn: '2026-11-09',
    },
    representation: {
      id: 'REP-HN-41003',
      propertyId: 'NPID-HN-21003',
      listingId: 'PLID-HN-31003',
      sellerPartyReference: 'PARTY-SELLER-HN-71003',
      evidenceReferences: ['EVIDENCE-REP-HN-81003'],
      status: 'Đã xác nhận',
      scope: 'Không độc quyền',
      confirmedAt: '2026-08-08T11:42:00+07:00',
      effectiveFrom: '2026-08-09',
      expiresOn: '2026-11-09',
      responsibleAgent: {
        reference: 'AGENT-HN-11003',
        displayName: 'Phạm Q. H.',
        organizationName: 'Sàn Nam Hà Nội',
      },
      collaboration: { status: 'Mở đăng ký', registrationOpen: true },
      distributionConsent: {
        channelIds: ['housenow'],
        purpose: DISTRIBUTION_PURPOSE,
        effectiveFrom: '2026-08-09',
        expiresOn: '2026-11-09',
      },
    },
  },
  {
    property: {
      id: 'NPID-HN-21004',
      type: 'Căn hộ chung cư',
      unitLabel: 'D2-1510',
      location: {
        ward: 'Trung Hòa',
        district: 'Cầu Giấy',
        city: 'Hà Nội',
      },
      area: { value: 78.6, unit: 'm²', concept: 'Thông thủy' },
      bedrooms: 2,
      bathrooms: 2,
      sourceSummary: 'Hồ sơ dự án và xác nhận quyền đại diện',
    },
    project: {
      id: 'PROJECT-HN-51004',
      name: 'Cầu Giấy Park',
      developer: {
        id: 'DEVELOPER-HN-61004',
        name: 'Công ty CP Đầu tư Thành Công',
      },
    },
    listing: {
      id: 'PLID-HN-31004',
      propertyId: 'NPID-HN-21004',
      representationId: 'REP-HN-41004',
      status: 'Đang hiệu lực',
      industryVisibility: 'Được phép tra cứu',
      transactionType: 'Bán',
      visibility: 'Thị trường nội bộ',
      askingPrice: { value: 6_740_000_000, currency: 'VND' },
      mediaCount: 16,
      effectiveFrom: '2026-08-10',
      expiresOn: '2026-12-10',
    },
    representation: {
      id: 'REP-HN-41004',
      propertyId: 'NPID-HN-21004',
      listingId: 'PLID-HN-31004',
      sellerPartyReference: 'PARTY-SELLER-HN-71004',
      evidenceReferences: ['EVIDENCE-REP-HN-81004'],
      status: 'Đã xác nhận',
      scope: 'Không độc quyền',
      confirmedAt: '2026-08-10T08:25:00+07:00',
      effectiveFrom: '2026-08-10',
      expiresOn: '2026-12-10',
      responsibleAgent: {
        reference: 'AGENT-HN-11004',
        displayName: 'Đỗ N. P.',
        organizationName: 'Sàn Cầu Giấy',
      },
      collaboration: { status: 'Mở đăng ký', registrationOpen: true },
      distributionConsent: {
        channelIds: ['housenow'],
        purpose: DISTRIBUTION_PURPOSE,
        effectiveFrom: '2026-08-10',
        expiresOn: '2026-12-10',
      },
    },
  },
  {
    property: {
      id: 'NPID-HN-21005',
      type: 'Căn hộ chung cư',
      unitLabel: 'E1-2206',
      location: {
        ward: 'Ngọc Thụy',
        district: 'Long Biên',
        city: 'Hà Nội',
      },
      area: { value: 91.3, unit: 'm²', concept: 'Thông thủy' },
      bedrooms: 3,
      bathrooms: 2,
      sourceSummary: 'Hồ sơ dự án và xác nhận quyền đại diện',
    },
    project: {
      id: 'PROJECT-HN-51005',
      name: 'Long Biên Gateway',
      developer: {
        id: 'DEVELOPER-HN-61005',
        name: 'Công ty CP Đô thị Sông Hồng',
      },
    },
    listing: {
      id: 'PLID-HN-31005',
      propertyId: 'NPID-HN-21005',
      representationId: 'REP-HN-41005',
      status: 'Đang hiệu lực',
      industryVisibility: 'Được phép tra cứu',
      transactionType: 'Bán',
      visibility: 'Thị trường nội bộ',
      askingPrice: { value: 8_120_000_000, currency: 'VND' },
      mediaCount: 20,
      effectiveFrom: '2026-08-12',
      expiresOn: '2026-11-12',
    },
    representation: {
      id: 'REP-HN-41005',
      propertyId: 'NPID-HN-21005',
      listingId: 'PLID-HN-31005',
      sellerPartyReference: 'PARTY-SELLER-HN-71005',
      evidenceReferences: ['EVIDENCE-REP-HN-81005'],
      status: 'Đã xác nhận',
      scope: 'Độc quyền',
      confirmedAt: '2026-08-11T16:05:00+07:00',
      effectiveFrom: '2026-08-12',
      expiresOn: '2026-11-12',
      responsibleAgent: {
        reference: 'AGENT-HN-11005',
        displayName: 'Vũ T. L.',
        organizationName: 'Sàn Long Biên',
      },
      collaboration: { status: 'Mở đăng ký', registrationOpen: true },
      distributionConsent: {
        channelIds: ['housenow'],
        purpose: DISTRIBUTION_PURPOSE,
        effectiveFrom: '2026-08-12',
        expiresOn: '2026-11-12',
      },
    },
  },
])

/** @param {string} date @param {string} from @param {string} until */
function isWithinPeriod(date, from, until) {
  return date >= from && date <= until
}

/**
 * @param {ReturnType<typeof createMarketState>} state
 * @param {Record<string, any>} listing
 * @param {Record<string, any>} representation
 */
function isEligible(state, listing, representation) {
  const effectiveOn = state.effectiveAt.slice(0, 10)
  return listing.status === 'Đang hiệu lực'
    && listing.industryVisibility === 'Được phép tra cứu'
    && representation.status === 'Đã xác nhận'
    && representation.collaboration?.status === 'Mở đăng ký'
    && representation.collaboration?.registrationOpen === true
    && isWithinPeriod(effectiveOn, listing.effectiveFrom, listing.expiresOn)
    && isWithinPeriod(effectiveOn, representation.effectiveFrom, representation.expiresOn)
}

/**
 * @param {ReturnType<typeof createMarketState>} state
 * @param {string} listingId
 */
function findRecords(state, listingId) {
  if (!Array.isArray(state?.listings) || !Array.isArray(state?.properties)
    || !Array.isArray(state?.projects) || !Array.isArray(state?.representations)) {
    return null
  }

  const normalizedId = normalizeIdentifier(listingId)
  const listing = state.listings.find((record) => (
    record.id === normalizedId || record.propertyId === normalizedId
  ))
  if (!listing) return null

  const property = state.properties.find((record) => record.id === listing.propertyId)
  const project = state.projects.find((record) => record.id === listing.projectId)
  const representation = state.representations.find((record) => record.id === listing.representationId)
  if (!property || !project || !representation) return null

  return { listing, property, project, representation }
}

/**
 * Create an Industry-only view with an explicit allowlist. Restricted seller
 * references and representation evidence never cross this boundary.
 *
 * @param {ReturnType<typeof createMarketState>} state
 * @param {{listing: Record<string, any>, property: Record<string, any>, project: Record<string, any>, representation: Record<string, any>}} records
 */
function projectForIndustry(state, records) {
  const { listing, property, project, representation } = records
  const effectiveOn = state.effectiveAt.slice(0, 10)
  const distributionConsentIsEffective = representation.distributionConsent.purpose === DISTRIBUTION_PURPOSE
    && isWithinPeriod(
      effectiveOn,
      representation.distributionConsent.effectiveFrom,
      representation.distributionConsent.expiresOn,
    )
  const activeRegistrations = state.coBrokerRegistrations.filter((record) => (
    record.listingId === listing.id
      && record.status === 'Đã đăng ký hợp tác'
      && isWithinPeriod(effectiveOn, record.effectiveFrom, record.expiresOn)
  ))
  const ownRegistration = state.coBrokerRegistrations.find((record) => (
    record.listingId === listing.id && record.agentReference === state.currentAgent.reference
      && record.status === 'Đã đăng ký hợp tác'
      && isWithinPeriod(effectiveOn, record.effectiveFrom, record.expiresOn)
  )) ?? null
  const listingDistributions = state.distributionEvents
    .filter((event) => event.listingId === listing.id)
  const distributions = listingDistributions
    .filter((event) => event.agentReference === state.currentAgent.reference)
    .map((event) => ({
      id: event.id,
      channel: { id: event.channel.id, name: event.channel.name },
      status: event.status,
      acknowledgement: event.acknowledgement,
      purpose: event.purpose,
      projectionVersion: event.projectionVersion,
      sentAt: event.sentAt,
    }))

  return {
    listingId: listing.id,
    property: {
      id: property.id,
      type: property.type,
      unitLabel: property.unitLabel,
      location: {
        ward: property.location.ward,
        district: property.location.district,
        city: property.location.city,
        display: `${property.location.ward}, ${property.location.district}, ${property.location.city}`,
      },
      area: {
        value: property.area.value,
        unit: property.area.unit,
        concept: property.area.concept,
      },
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
    },
    project: {
      id: project.id,
      name: project.name,
      developer: {
        id: project.developer.id,
        name: project.developer.name,
      },
    },
    listing: {
      status: listing.status,
      industryVisibility: listing.industryVisibility,
      transactionType: listing.transactionType,
      visibility: listing.visibility,
      askingPrice: {
        value: listing.askingPrice.value,
        currency: listing.askingPrice.currency,
      },
      mediaCount: listing.mediaCount,
      effectiveFrom: listing.effectiveFrom,
      expiresOn: listing.expiresOn,
    },
    representation: {
      status: representation.status,
      effectiveFrom: representation.effectiveFrom,
      expiresOn: representation.expiresOn,
    },
    responsibleAgent: {
      reference: representation.responsibleAgent.reference,
      displayName: representation.responsibleAgent.displayName,
      organizationName: representation.responsibleAgent.organizationName,
    },
    collaboration: {
      status: representation.collaboration.status,
      registrationOpen: representation.collaboration.registrationOpen,
      activity: {
        registrationCount: activeRegistrations.length,
        distributionCount: listingDistributions.length,
      },
      ownRegistration: ownRegistration ? {
        id: ownRegistration.id,
        status: ownRegistration.status,
        registeredAt: ownRegistration.registeredAt,
        effectiveFrom: ownRegistration.effectiveFrom,
        expiresOn: ownRegistration.expiresOn,
      } : null,
      allowedChannels: (distributionConsentIsEffective
        ? representation.distributionConsent.channelIds
        : [])
        .filter((channelId) => CHANNELS[channelId])
        .map((channelId) => ({
          ...CHANNELS[channelId],
          purpose: representation.distributionConsent.purpose,
        })),
      distributions,
    },
    provenance: {
      sourceSummary: property.sourceSummary,
    },
  }
}

const FILTER_KEYS = Object.freeze(['npid', 'area', 'developer', 'project'])

/** @param {unknown} filters */
function normalizeFilters(filters) {
  if (filters === undefined) return { npid: '', area: '', developer: '', project: '' }
  if (!isPlainObject(filters)) return null
  if (Object.keys(filters).some((key) => !FILTER_KEYS.includes(key))) return null

  /** @type {Record<string, string>} */
  const normalized = {}
  for (const key of FILTER_KEYS) {
    const value = filters[key]
    if (value !== undefined && typeof value !== 'string') return null
    normalized[key] = normalizeText(value ?? '')
  }
  return normalized
}

/**
 * @param {ReturnType<typeof createMarketState>} state
 * @param {{npid?: string, area?: string, developer?: string, project?: string}} [filters]
 */
export function getRepresentedListings(state, filters) {
  const normalizedFilters = normalizeFilters(filters)
  if (!normalizedFilters || !Array.isArray(state?.listings)) return []

  return state.listings.flatMap((listing) => {
    const records = findRecords(state, listing.id)
    if (!records || !isEligible(state, records.listing, records.representation)) return []

    const haystacks = {
      npid: normalizeText(records.property.id),
      area: normalizeText([
        records.property.location.ward,
        records.property.location.district,
        records.property.location.city,
      ].join(' ')),
      developer: normalizeText(records.project.developer.name),
      project: normalizeText(records.project.name),
    }

    const matches = FILTER_KEYS.every((key) => (
      !normalizedFilters[key] || haystacks[key].includes(normalizedFilters[key])
    ))
    return matches ? [projectForIndustry(state, records)] : []
  })
}

/**
 * @param {ReturnType<typeof createMarketState>} state
 * @param {string} id Listing ID or Property NPID
 */
export function getListingDetail(state, id) {
  if (typeof id !== 'string' || !id.trim()) return null
  const records = findRecords(state, id)
  if (!records || !isEligible(state, records.listing, records.representation)) return null
  return projectForIndustry(state, records)
}

/** @param {ReturnType<typeof createMarketState>} state */
export function getMarketSummary(state) {
  const representedListings = getRepresentedListings(state)
  const registrations = Array.isArray(state?.coBrokerRegistrations)
    ? state.coBrokerRegistrations.filter((record) => record.agentReference === state.currentAgent?.reference)
    : []
  const distributions = Array.isArray(state?.distributionEvents)
    ? state.distributionEvents.filter((event) => event.agentReference === state.currentAgent?.reference)
    : []

  return {
    representedListings: representedListings.length,
    openForCollaboration: representedListings.filter((record) => record.collaboration.registrationOpen).length,
    registeredByCurrentAgent: registrations.length,
    sentToHouseNow: distributions.filter((event) => (
      event.channel.id === 'housenow' && event.status === 'Đã gửi'
    )).length,
    awaitingChannelResponse: distributions.filter((event) => (
      event.acknowledgement === 'Chờ phản hồi kênh'
    )).length,
  }
}

/** @param {number} sequence */
function actionTime(sequence) {
  return `2026-08-17T10:${String(sequence).padStart(2, '0')}:00+07:00`
}

/** @param {number} sequence */
function registrationId(sequence) {
  return `HTB-HN-${String(sequence).padStart(5, '0')}`
}

/** @param {number} sequence */
function distributionId(sequence) {
  return `PP-HN-${String(sequence).padStart(5, '0')}`
}

/** @param {Record<string, any>} listing @param {Record<string, any>} property @param {Record<string, any>} project @param {Record<string, any>} agent */
function createPublicDistributionPayload(listing, property, project, agent) {
  return {
    listingId: listing.id,
    propertyId: property.id,
    title: `${property.unitLabel} · ${project.name}`,
    propertyType: property.type,
    projectName: project.name,
    developerName: project.developer.name,
    location: {
      district: property.location.district,
      city: property.location.city,
    },
    area: {
      value: property.area.value,
      unit: property.area.unit,
      concept: property.area.concept,
    },
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    mediaCount: listing.mediaCount,
    askingPrice: {
      value: listing.askingPrice.value,
      currency: listing.askingPrice.currency,
    },
    businessContact: {
      displayName: agent.displayName,
      organizationName: agent.organizationName,
    },
  }
}

/**
 * @param {unknown} action
 * @param {string[]} payloadKeys
 */
function hasValidCommandShape(action, payloadKeys) {
  return isPlainObject(action)
    && hasExactKeys(action, ['type', 'actor', 'payload'])
    && action.actor === 'agent'
    && hasExactKeys(action.payload, payloadKeys)
}

/**
 * @param {ReturnType<typeof createMarketState>} state
 * @param {unknown} action
 */
export function marketplaceReducer(state, action) {
  if (!state || state.version !== MARKET_VERSION || !isPlainObject(action)) return state

  if (action.type === MARKET_ACTIONS.REGISTER_CO_BROKER) {
    if (!hasValidCommandShape(action, ['listingId'])) return state
    const listingId = normalizeIdentifier(action.payload.listingId)
    if (!listingId) return state

    const records = findRecords(state, listingId)
    if (!records || !isEligible(state, records.listing, records.representation)) return state
    if (records.representation.responsibleAgent.reference === state.currentAgent.reference) return state

    const existing = state.coBrokerRegistrations.some((registration) => (
      registration.listingId === records.listing.id
      && registration.agentReference === state.currentAgent.reference
    ))
    if (existing) return state

    const sequence = state.coBrokerRegistrations.length + 1
    const acceptedAction = {
      type: MARKET_ACTIONS.REGISTER_CO_BROKER,
      actor: 'agent',
      payload: { listingId: records.listing.id },
    }
    return {
      ...state,
      coBrokerRegistrations: [
        ...state.coBrokerRegistrations,
        {
          id: registrationId(sequence),
          listingId: records.listing.id,
          representationId: records.representation.id,
          agentReference: state.currentAgent.reference,
          organizationReference: state.currentAgent.organizationReference,
          status: 'Đã đăng ký hợp tác',
          registeredAt: actionTime(state.actionLog.length + 1),
          effectiveFrom: state.effectiveAt.slice(0, 10),
          expiresOn: records.representation.expiresOn < records.listing.expiresOn
            ? records.representation.expiresOn
            : records.listing.expiresOn,
        },
      ],
      actionLog: [...state.actionLog, acceptedAction],
    }
  }

  if (action.type === MARKET_ACTIONS.DISTRIBUTE_LISTING) {
    if (!hasValidCommandShape(action, ['listingId', 'channelId'])) return state
    const listingId = normalizeIdentifier(action.payload.listingId)
    const channelId = normalizeText(action.payload.channelId)
    if (!listingId || channelId !== 'housenow') return state

    const records = findRecords(state, listingId)
    if (!records || !isEligible(state, records.listing, records.representation)) return state
    const consent = records.representation.distributionConsent
    const effectiveOn = state.effectiveAt.slice(0, 10)
    if (!consent.channelIds.includes(channelId)
      || consent.purpose !== DISTRIBUTION_PURPOSE
      || !isWithinPeriod(effectiveOn, consent.effectiveFrom, consent.expiresOn)) {
      return state
    }

    const registration = state.coBrokerRegistrations.find((record) => (
      record.listingId === records.listing.id
      && record.agentReference === state.currentAgent.reference
      && record.status === 'Đã đăng ký hợp tác'
      && isWithinPeriod(effectiveOn, record.effectiveFrom, record.expiresOn)
    ))
    if (!registration) return state

    const existing = state.distributionEvents.some((event) => (
      event.listingId === records.listing.id
      && event.agentReference === state.currentAgent.reference
      && event.channel.id === channelId
    ))
    if (existing) return state

    const sequence = state.distributionEvents.length + 1
    const acceptedAction = {
      type: MARKET_ACTIONS.DISTRIBUTE_LISTING,
      actor: 'agent',
      payload: { listingId: records.listing.id, channelId },
    }
    return {
      ...state,
      distributionEvents: [
        ...state.distributionEvents,
        {
          id: distributionId(sequence),
          listingId: records.listing.id,
          representationId: records.representation.id,
          coBrokerRegistrationId: registration.id,
          agentReference: state.currentAgent.reference,
          channel: { ...CHANNELS.housenow },
          status: 'Đã gửi',
          acknowledgement: 'Chờ phản hồi kênh',
          purpose: consent.purpose,
          projectionVersion: PUBLIC_DISTRIBUTION_PROJECTION_VERSION,
          sentAt: actionTime(state.actionLog.length + 1),
          payload: createPublicDistributionPayload(
            records.listing,
            records.property,
            records.project,
            state.currentAgent,
          ),
        },
      ],
      actionLog: [...state.actionLog, acceptedAction],
    }
  }

  return state
}

export function createMarketState() {
  return {
    version: MARKET_VERSION,
    dataVersion: MARKET_DATA_VERSION,
    effectiveAt: MARKET_EFFECTIVE_AT,
    currentAgent: clone(CURRENT_AGENT),
    properties: MARKET_FIXTURES.map(({ property }) => clone(property)),
    projects: MARKET_FIXTURES.map(({ project }) => clone(project)),
    listings: MARKET_FIXTURES.map(({ listing, project }) => ({
      ...clone(listing),
      projectId: project.id,
    })),
    representations: MARKET_FIXTURES.map(({ representation }) => clone(representation)),
    coBrokerRegistrations: [],
    distributionEvents: [],
    actionLog: [],
  }
}

/** @param {ReturnType<typeof createMarketState>} state */
export function serializeMarketState(state) {
  const suppliedActions = Array.isArray(state?.actionLog) ? state.actionLog : []
  if (suppliedActions.length > 20) {
    return JSON.stringify({ version: MARKET_VERSION, actions: [] })
  }

  let replayed = createMarketState()
  for (const action of suppliedActions) {
    const next = marketplaceReducer(replayed, action)
    if (next === replayed) {
      return JSON.stringify({ version: MARKET_VERSION, actions: [] })
    }
    replayed = next
  }

  return JSON.stringify({
    version: MARKET_VERSION,
    actions: clone(replayed.actionLog),
  })
}

/** @param {unknown} serialized */
export function restoreMarketState(serialized) {
  const fallback = () => createMarketState()
  if (typeof serialized !== 'string') return fallback()

  try {
    const parsed = JSON.parse(serialized)
    if (!hasExactKeys(parsed, ['version', 'actions'])
      || parsed.version !== MARKET_VERSION
      || !Array.isArray(parsed.actions)
      || parsed.actions.length > 20) {
      return fallback()
    }

    let state = createMarketState()
    for (const action of parsed.actions) {
      const next = marketplaceReducer(state, action)
      if (next === state) return fallback()
      state = next
    }
    return state
  } catch {
    return fallback()
  }
}
