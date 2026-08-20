// @ts-check

/**
 * A deterministic, client-only market module for the represented-listing demo.
 *
 * Property, Listing, Representation, CoBrokerRegistration and DistributionEvent
 * deliberately remain separate records. Consumers receive an explicit Industry
 * projection rather than the fixture records themselves.
 */

export const MARKET_STORAGE_KEY = 'vmls:represented-market:2026-08:v2'
export const PUBLIC_DISTRIBUTION_PROJECTION_VERSION = 'vmls-public-listing-v1'

export const PUBLICATION_FIELD_GROUPS = Object.freeze([
  Object.freeze({ id: 'identity', label: 'Mã Tin bán và Bất động sản', locked: true }),
  Object.freeze({ id: 'propertyType', label: 'Loại giao dịch và Bất động sản', locked: true }),
  Object.freeze({ id: 'generalLocation', label: 'Khu vực tổng quát', locked: true }),
  Object.freeze({ id: 'businessContact', label: 'Liên hệ kinh doanh', locked: true }),
  Object.freeze({ id: 'price', label: 'Giá chào bán', locked: false }),
  Object.freeze({ id: 'projectUnit', label: 'Dự án và căn', locked: false }),
  Object.freeze({ id: 'detailedLocation', label: 'Vị trí chi tiết', locked: false }),
  Object.freeze({ id: 'areas', label: 'Diện tích', locked: false }),
  Object.freeze({ id: 'features', label: 'Đặc điểm', locked: false }),
  Object.freeze({ id: 'description', label: 'Mô tả', locked: false }),
  Object.freeze({ id: 'images', label: 'Hình ảnh', locked: false }),
])

export const MARKET_ACTIONS = Object.freeze({
  REGISTER_CO_BROKER: 'register_co_broker',
  DISTRIBUTE_LISTING: 'distribute_listing',
  SAVE_PUBLICATION_DRAFT: 'save_publication_draft',
  APPLY_PUBLICATION_PROFILE: 'apply_publication_profile',
  REQUEST_LISTING_CORRECTION: 'request_listing_correction',
  APPLY_LISTING_CORRECTION: 'apply_listing_correction',
})

const MARKET_VERSION = 2
const MARKET_DATA_VERSION = 'vmls-represented-market-2026-08-v2'
const MARKET_EFFECTIVE_AT = '2026-08-17T10:00:00+07:00'
const DISTRIBUTION_PURPOSE = 'Phân phối Tin bán'
const CURRENT_SELLER_REFERENCE = 'PARTY-SELLER-HN-71001'
const LOCKED_PUBLICATION_GROUPS = PUBLICATION_FIELD_GROUPS
  .filter(({ locked }) => locked)
  .map(({ id }) => id)
const TOGGLE_PUBLICATION_GROUPS = PUBLICATION_FIELD_GROUPS
  .filter(({ locked }) => !locked)
  .map(({ id }) => id)
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
    .map((event) => {
      const channelState = state.channelStates?.find((candidate) => (
        candidate.listingId === listing.id && candidate.channel.id === event.channel.id
      ))
      return {
        id: event.id,
        channel: { id: event.channel.id, name: event.channel.name },
        status: channelState?.status ?? event.status,
        acknowledgement: channelState?.acknowledgement ?? event.acknowledgement,
        purpose: event.purpose,
        projectionVersion: event.projectionVersion,
        publicationProfileId: event.publicationProfileId,
        publicationProfileVersion: event.publicationProfileVersion,
        sentAt: event.sentAt,
      }
    })

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

/**
 * Public Listing payload. The profile-aware allowlist is filled by the
 * governance reducer below; an invalid or unavailable Listing fails closed.
 *
 * @param {ReturnType<typeof createMarketState>} state
 * @param {string} id
 */
export function getPublicListing(state, id) {
  if (typeof id !== 'string' || !id.trim()) return null
  const records = findRecords(state, id)
  if (!records || !isEligible(state, records.listing, records.representation)) return null
  return createPublicDistributionPayload(
    records.listing,
    records.property,
    records.project,
    records.representation.responsibleAgent,
    findPublicationProfile(state, records.listing.id),
  )
}

/** @param {ReturnType<typeof createMarketState>} state @param {string} id */
export function getSellerListingDetail(state, id) {
  if (typeof id !== 'string' || !id.trim()) return null
  const records = findRecords(state, id)
  if (!records || records.representation.sellerPartyReference !== CURRENT_SELLER_REFERENCE) return null
  const industry = getListingDetail(state, records.listing.id)
  const publicationProfile = state.publicationProfiles?.find(({ listingId }) => (
    listingId === records.listing.id
  ))
  if (!industry || !publicationProfile) return null
  return {
    ...industry,
    publicationProfile: clone(publicationProfile),
    publicProjection: getPublicListing(state, records.listing.id),
    correctionRequests: clone(state.sellerCorrectionRequests?.filter(({ listingId }) => (
      listingId === records.listing.id
    )) ?? []),
    listingRevisions: clone(state.listingRevisions?.filter(({ listingId }) => (
      listingId === records.listing.id
    )) ?? []),
    channelStates: clone(state.channelStates?.filter(({ listingId }) => (
      listingId === records.listing.id
    )) ?? []),
    reconciliationEvents: clone(state.reconciliationEvents?.filter(({ listingId }) => (
      listingId === records.listing.id
    )) ?? []),
  }
}

/** @param {ReturnType<typeof createMarketState>} state */
export function getSellerListings(state) {
  if (!Array.isArray(state?.representations)) return []
  return state.representations
    .filter(({ sellerPartyReference }) => sellerPartyReference === CURRENT_SELLER_REFERENCE)
    .flatMap(({ listingId }) => {
      const detail = getSellerListingDetail(state, listingId)
      return detail ? [detail] : []
    })
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
  const distributedListingChannels = new Set(distributions.map((event) => (
    `${event.listingId}:${event.channel.id}`
  )))
  const channelStates = Array.isArray(state?.channelStates)
    ? state.channelStates.filter((channelState) => (
        distributedListingChannels.has(`${channelState.listingId}:${channelState.channel.id}`)
      ))
    : []

  return {
    representedListings: representedListings.length,
    openForCollaboration: representedListings.filter((record) => record.collaboration.registrationOpen).length,
    registeredByCurrentAgent: registrations.length,
    sentToHouseNow: channelStates.filter((channelState) => (
      channelState.channel.id === 'housenow'
    )).length,
    awaitingChannelResponse: channelStates.filter((channelState) => (
      channelState.acknowledgement === 'Chờ phản hồi kênh'
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

/** @param {Record<string, any>} state @param {string} listingId */
function findPublicationProfile(state, listingId) {
  if (!Array.isArray(state?.publicationProfiles)) return null
  return state.publicationProfiles.find((profile) => profile.listingId === listingId) ?? null
}

/** @param {string} listingId @param {number} version */
function publicationVersionId(listingId, version) {
  return `PUB-${listingId.slice(5)}-V${String(version).padStart(3, '0')}`
}

/**
 * Preserve outbound DistributionEvents and append an explicit reconciliation
 * record whenever an already-sent channel no longer represents current data.
 *
 * @param {ReturnType<typeof createMarketState>} state
 * @param {string} listingId
 * @param {string} reason
 * @param {string} relatedRecordId
 * @param {string} createdAt
 */
function requireDistributionReconciliation(state, listingId, reason, relatedRecordId, createdAt) {
  const affectedChannels = state.channelStates.filter((channelState) => (
    channelState.listingId === listingId
  ))
  const additions = affectedChannels.map((channelState, index) => ({
    id: `DREC-HN-${String(state.reconciliationEvents.length + index + 1).padStart(5, '0')}`,
    listingId,
    channelId: channelState.channel.id,
    reason,
    relatedRecordId,
    status: 'Cần cập nhật',
    createdAt,
  }))

  return {
    channelStates: state.channelStates.map((channelState) => (
      channelState.listingId === listingId
        ? {
            ...channelState,
            status: 'Cần cập nhật',
            acknowledgement: 'Chờ đồng bộ lại',
            updatedAt: createdAt,
          }
        : channelState
    )),
    reconciliationEvents: [...state.reconciliationEvents, ...additions],
  }
}

/**
 * @param {Record<string, any>} listing
 * @param {Record<string, any>} property
 * @param {Record<string, any>} project
 * @param {Record<string, any>} agent
 * @param {Record<string, any>} profile
 */
function createPublicDistributionPayload(listing, property, project, agent, profile) {
  if (!profile?.applied || !Array.isArray(profile.applied.visibleGroups)) return null
  const visible = new Set(profile.applied.visibleGroups)
  const payload = {
    listingId: listing.id,
    propertyId: property.id,
    propertyType: property.type,
    transactionType: listing.transactionType,
    location: {
      district: property.location.district,
      city: property.location.city,
    },
    businessContact: {
      displayName: agent.displayName,
      organizationName: agent.organizationName,
    },
  }

  if (visible.has('price')) {
    payload.askingPrice = {
      value: listing.askingPrice.value,
      currency: listing.askingPrice.currency,
    }
  }
  if (visible.has('projectUnit')) {
    payload.title = `${property.unitLabel} · ${project.name}`
    payload.projectName = project.name
    payload.developerName = project.developer.name
    payload.unitLabel = property.unitLabel
  }
  if (visible.has('detailedLocation')) {
    payload.detailedLocation = {
      ward: property.location.ward,
    }
  }
  if (visible.has('areas')) {
    payload.area = {
      value: property.area.value,
      unit: property.area.unit,
      concept: property.area.concept,
    }
  }
  if (visible.has('features')) {
    payload.bedrooms = property.bedrooms
    payload.bathrooms = property.bathrooms
    payload.features = Array.isArray(listing.features) ? [...listing.features] : []
  }
  if (visible.has('description')) {
    payload.description = `${property.type} tại ${property.location.district}, ${property.location.city}.`
  }
  if (visible.has('images')) payload.mediaCount = listing.mediaCount

  return payload
}

/**
 * @param {unknown} action
 * @param {string[]} payloadKeys
 */
function hasValidCommandShape(action, actor, payloadKeys) {
  return isPlainObject(action)
    && hasExactKeys(action, ['type', 'actor', 'payload'])
    && action.actor === actor
    && hasExactKeys(action.payload, payloadKeys)
}

/**
 * @param {ReturnType<typeof createMarketState>} state
 * @param {unknown} action
 */
export function marketplaceReducer(state, action) {
  if (!state || state.version !== MARKET_VERSION || !isPlainObject(action)) return state

  if (action.type === MARKET_ACTIONS.SAVE_PUBLICATION_DRAFT) {
    if (!hasValidCommandShape(action, 'seller', ['listingId', 'visibleGroups'])) return state
    const listingId = normalizeIdentifier(action.payload.listingId)
    const records = findRecords(state, listingId)
    if (!records || records.representation.sellerPartyReference !== CURRENT_SELLER_REFERENCE) return state
    if (!Array.isArray(action.payload.visibleGroups)
      || action.payload.visibleGroups.some((group) => typeof group !== 'string')
      || new Set(action.payload.visibleGroups).size !== action.payload.visibleGroups.length
      || action.payload.visibleGroups.some((group) => !TOGGLE_PUBLICATION_GROUPS.includes(group))) {
      return state
    }

    const visibleGroups = TOGGLE_PUBLICATION_GROUPS.filter((group) => (
      action.payload.visibleGroups.includes(group)
    ))
    const profile = findPublicationProfile(state, records.listing.id)
    if (!profile || (visibleGroups.length === profile.draft.visibleGroups.length
      && visibleGroups.every((group, index) => group === profile.draft.visibleGroups[index]))) {
      return state
    }

    const version = Math.max(profile.draft.version, profile.applied.version) + 1
    const acceptedAction = {
      type: MARKET_ACTIONS.SAVE_PUBLICATION_DRAFT,
      actor: 'seller',
      payload: { listingId: records.listing.id, visibleGroups },
    }
    return {
      ...state,
      publicationProfiles: state.publicationProfiles.map((candidate) => (
        candidate.id === profile.id
          ? {
              ...candidate,
              draft: {
                id: publicationVersionId(records.listing.id, version),
                version,
                visibleGroups,
                savedAt: actionTime(state.actionLog.length + 1),
              },
            }
          : candidate
      )),
      actionLog: [...state.actionLog, acceptedAction],
    }
  }

  if (action.type === MARKET_ACTIONS.APPLY_PUBLICATION_PROFILE) {
    if (!hasValidCommandShape(action, 'seller', ['listingId'])) return state
    const listingId = normalizeIdentifier(action.payload.listingId)
    const records = findRecords(state, listingId)
    if (!records || records.representation.sellerPartyReference !== CURRENT_SELLER_REFERENCE) return state
    const profile = findPublicationProfile(state, records.listing.id)
    if (!profile || profile.draft.version === profile.applied.version) return state

    const acceptedAction = {
      type: MARKET_ACTIONS.APPLY_PUBLICATION_PROFILE,
      actor: 'seller',
      payload: { listingId: records.listing.id },
    }
    const appliedAt = actionTime(state.actionLog.length + 1)
    const reconciliation = requireDistributionReconciliation(
      state,
      records.listing.id,
      'publication_profile_changed',
      profile.draft.id,
      appliedAt,
    )
    return {
      ...state,
      publicationProfiles: state.publicationProfiles.map((candidate) => (
        candidate.id === profile.id
          ? {
              ...candidate,
              applied: {
                id: profile.draft.id,
                version: profile.draft.version,
                visibleGroups: [...profile.draft.visibleGroups],
                appliedAt,
              },
            }
          : candidate
      )),
      ...reconciliation,
      actionLog: [...state.actionLog, acceptedAction],
    }
  }

  if (action.type === MARKET_ACTIONS.REQUEST_LISTING_CORRECTION) {
    if (!hasValidCommandShape(
      action,
      'seller',
      ['listingId', 'field', 'proposedValue', 'reason'],
    )) return state
    const listingId = normalizeIdentifier(action.payload.listingId)
    const records = findRecords(state, listingId)
    const reason = typeof action.payload.reason === 'string' ? action.payload.reason.trim() : ''
    const proposedValue = action.payload.proposedValue
    if (!records
      || records.representation.sellerPartyReference !== CURRENT_SELLER_REFERENCE
      || action.payload.field !== 'askingPrice'
      || !hasExactKeys(proposedValue, ['value', 'currency'])
      || !Number.isSafeInteger(proposedValue.value)
      || proposedValue.value <= 0
      || proposedValue.currency !== 'VND'
      || reason.length < 3
      || reason.length > 160
      || proposedValue.value === records.listing.askingPrice.value
      || state.sellerCorrectionRequests.some((request) => (
        request.listingId === records.listing.id
          && request.field === 'askingPrice'
          && request.status === 'Chờ Sàn xử lý'
      ))) {
      return state
    }

    const sequence = state.sellerCorrectionRequests.length + 1
    const acceptedAction = {
      type: MARKET_ACTIONS.REQUEST_LISTING_CORRECTION,
      actor: 'seller',
      payload: {
        listingId: records.listing.id,
        field: 'askingPrice',
        proposedValue: { value: proposedValue.value, currency: 'VND' },
        reason,
      },
    }
    return {
      ...state,
      sellerCorrectionRequests: [
        ...state.sellerCorrectionRequests,
        {
          id: `SCR-HN-${String(sequence).padStart(5, '0')}`,
          listingId: records.listing.id,
          field: 'askingPrice',
          currentValue: {
            value: records.listing.askingPrice.value,
            currency: records.listing.askingPrice.currency,
          },
          proposedValue: { value: proposedValue.value, currency: 'VND' },
          reason,
          status: 'Chờ Sàn xử lý',
          requestedBy: 'seller',
          requestedAt: actionTime(state.actionLog.length + 1),
          resolvedBy: null,
          resolvedAt: null,
        },
      ],
      actionLog: [...state.actionLog, acceptedAction],
    }
  }

  if (action.type === MARKET_ACTIONS.APPLY_LISTING_CORRECTION) {
    if (!hasValidCommandShape(action, 'brokerage', ['requestId'])) return state
    const requestId = normalizeIdentifier(action.payload.requestId)
    const request = state.sellerCorrectionRequests.find(({ id }) => id === requestId)
    if (!request || request.status !== 'Chờ Sàn xử lý' || request.field !== 'askingPrice') return state
    const records = findRecords(state, request.listingId)
    if (!records
      || records.listing.askingPrice.value !== request.currentValue.value
      || records.listing.askingPrice.currency !== request.currentValue.currency) {
      return state
    }

    const appliedAt = actionTime(state.actionLog.length + 1)
    const revisionSequence = state.listingRevisions.length + 1
    const revisionId = `REV-HN-${String(revisionSequence).padStart(5, '0')}`
    const listingVersion = state.listingRevisions.filter(({ listingId }) => (
      listingId === records.listing.id
    )).length + 2
    const revision = {
      id: revisionId,
      listingId: records.listing.id,
      version: listingVersion,
      field: 'askingPrice',
      beforeValue: clone(request.currentValue),
      afterValue: clone(request.proposedValue),
      reason: request.reason,
      correctionRequestId: request.id,
      appliedBy: 'brokerage',
      appliedAt,
    }
    const reconciliation = requireDistributionReconciliation(
      state,
      records.listing.id,
      'listing_correction_applied',
      revisionId,
      appliedAt,
    )
    const acceptedAction = {
      type: MARKET_ACTIONS.APPLY_LISTING_CORRECTION,
      actor: 'brokerage',
      payload: { requestId: request.id },
    }
    return {
      ...state,
      listings: state.listings.map((listing) => (
        listing.id === records.listing.id
          ? { ...listing, askingPrice: clone(request.proposedValue) }
          : listing
      )),
      sellerCorrectionRequests: state.sellerCorrectionRequests.map((candidate) => (
        candidate.id === request.id
          ? {
              ...candidate,
              status: 'Đã áp dụng',
              resolvedBy: 'brokerage',
              resolvedAt: appliedAt,
            }
          : candidate
      )),
      listingRevisions: [...state.listingRevisions, revision],
      auditEvents: [
        ...state.auditEvents,
        {
          id: `AUD-MARKET-${String(state.auditEvents.length + 1).padStart(5, '0')}`,
          type: 'listing_correction_applied',
          actor: 'brokerage',
          organizationReference: 'ORG-HN-BROKERAGE-001',
          target: { type: 'Listing', id: records.listing.id },
          field: 'askingPrice',
          beforeValue: clone(request.currentValue),
          afterValue: clone(request.proposedValue),
          reason: request.reason,
          sourceRequestId: request.id,
          occurredAt: appliedAt,
        },
      ],
      ...reconciliation,
      actionLog: [...state.actionLog, acceptedAction],
    }
  }

  if (action.type === MARKET_ACTIONS.REGISTER_CO_BROKER) {
    if (!hasValidCommandShape(action, 'agent', ['listingId'])) return state
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
    if (!hasValidCommandShape(action, 'agent', ['listingId', 'channelId'])) return state
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
    const publicationProfile = findPublicationProfile(state, records.listing.id)
    const payload = createPublicDistributionPayload(
      records.listing,
      records.property,
      records.project,
      records.representation.responsibleAgent,
      publicationProfile,
    )
    if (!publicationProfile || !payload) return state
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
          publicationProfileId: publicationProfile.applied.id,
          publicationProfileVersion: publicationProfile.applied.version,
          sentAt: actionTime(state.actionLog.length + 1),
          payload,
        },
      ],
      channelStates: [
        ...state.channelStates,
        {
          listingId: records.listing.id,
          channel: { ...CHANNELS.housenow },
          status: 'Đã gửi',
          acknowledgement: 'Chờ phản hồi kênh',
          lastDistributionEventId: distributionId(sequence),
          updatedAt: actionTime(state.actionLog.length + 1),
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
    publicationProfiles: MARKET_FIXTURES.map(({ listing }) => ({
      id: `PUB-${listing.id.slice(5)}`,
      listingId: listing.id,
      lockedGroups: [...LOCKED_PUBLICATION_GROUPS],
      toggleGroups: [...TOGGLE_PUBLICATION_GROUPS],
      draft: {
        id: `PUB-${listing.id.slice(5)}-V001`,
        version: 1,
        visibleGroups: [...TOGGLE_PUBLICATION_GROUPS],
        savedAt: MARKET_EFFECTIVE_AT,
      },
      applied: {
        id: `PUB-${listing.id.slice(5)}-V001`,
        version: 1,
        visibleGroups: [...TOGGLE_PUBLICATION_GROUPS],
        appliedAt: MARKET_EFFECTIVE_AT,
      },
    })),
    coBrokerRegistrations: [],
    distributionEvents: [],
    channelStates: [],
    reconciliationEvents: [],
    sellerCorrectionRequests: [],
    listingRevisions: [],
    auditEvents: [],
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
