const tokens = new Map()
let currentRole = 'agent'

async function request(path, options = {}) {
  const token = tokens.get(currentRole)
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error?.message ?? 'Không thể kết nối MLS API.')
    error.code = payload.error?.code
    error.details = payload.error?.details
    error.status = response.status
    throw error
  }
  return payload
}

export const mlsApi = {
  async login(roleId) {
    currentRole = roleId
    if (!tokens.has(roleId)) {
      const session = await request('/session', { method: 'POST', body: JSON.stringify({ roleId }) })
      tokens.set(roleId, session.token)
      return session.actor
    }
    return null
  },
  bootstrap: () => request('/bootstrap'),
  accessSnapshot: () => request('/access'),
  notifications: (marketId) => request(`/notifications?market=${encodeURIComponent(marketId)}`),
  createOwnershipClaim: (input) => request('/ownership-claims', { method: 'POST', body: JSON.stringify(input) }),
  representations: (propertyId) => request(`/properties/${encodeURIComponent(propertyId)}/representations`),
  changeRepresentation: (propertyId, input) => request(`/properties/${encodeURIComponent(propertyId)}/representations`, { method: 'POST', body: JSON.stringify(input) }),
  distributionConsents: (propertyId) => request(`/properties/${encodeURIComponent(propertyId)}/distribution-consents`),
  changeDistributionConsent: (propertyId, input) => request(`/properties/${encodeURIComponent(propertyId)}/distribution-consents`, { method: 'POST', body: JSON.stringify(input) }),
  sellerCases: () => request('/seller-cases'),
  createSellerCase: (input) => request('/seller-cases', { method: 'POST', body: JSON.stringify(input) }),
  requestAccess: (input) => request('/access-requests', { method: 'POST', body: JSON.stringify(input) }),
  decideAccessRequest: (requestId, input) => request(`/access-requests/${encodeURIComponent(requestId)}/decision`, { method: 'POST', body: JSON.stringify(input) }),
  propertyIntelligence: (propertyId) => request(`/properties/${encodeURIComponent(propertyId)}/intelligence`),
  createListing: (input) => request('/listings', { method: 'POST', body: JSON.stringify(input) }),
  transitionListing: (listingId, input) => request(`/listings/${encodeURIComponent(listingId)}/transitions`, { method: 'POST', body: JSON.stringify(input) }),
}
