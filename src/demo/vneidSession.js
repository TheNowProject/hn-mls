// @ts-check

export const VNEID_SESSION_STORAGE_KEY = 'vmls:vneid-session:2026-08:v1'

export const VNEID_SESSION_ACTIONS = Object.freeze({
  CONFIRM_LOGIN: 'confirm_vneid_login',
  LOGOUT: 'logout_vneid',
})

const AUTHENTICATED_SESSION = Object.freeze({
  version: 1,
  status: 'authenticated',
  identity: Object.freeze({
    reference: 'VNEID-HN-0001',
    displayName: 'N••• H••• N••',
  }),
  authenticatedAt: '2026-08-20T08:30:00+07:00',
  sharedFields: Object.freeze([
    'Mã phiên định danh',
    'Họ tên đã che',
    'Kết quả xác thực',
  ]),
})

export function createVneidSession() {
  return { version: 1, status: 'signedOut' }
}

function exactKeys(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const actual = Object.keys(value).sort()
  return actual.length === keys.length
    && actual.every((key, index) => key === [...keys].sort()[index])
}

function cloneAuthenticatedSession() {
  return {
    ...AUTHENTICATED_SESSION,
    identity: { ...AUTHENTICATED_SESSION.identity },
    sharedFields: [...AUTHENTICATED_SESSION.sharedFields],
  }
}

export function vneidSessionReducer(state, action) {
  if (!exactKeys(action, action?.type === VNEID_SESSION_ACTIONS.CONFIRM_LOGIN
    ? ['type', 'payload']
    : ['type'])) return state

  if (action.type === VNEID_SESSION_ACTIONS.CONFIRM_LOGIN) {
    if (state.status !== 'signedOut' || !exactKeys(action.payload, ['accepted']) || action.payload.accepted !== true) {
      return state
    }
    return cloneAuthenticatedSession()
  }

  if (action.type === VNEID_SESSION_ACTIONS.LOGOUT) {
    return state.status === 'authenticated' ? createVneidSession() : state
  }

  return state
}

export function serializeVneidSession(state) {
  return JSON.stringify(state)
}

function validAuthenticatedSession(value) {
  return exactKeys(value, [
    'version',
    'status',
    'identity',
    'authenticatedAt',
    'sharedFields',
  ])
    && value.version === 1
    && value.status === 'authenticated'
    && exactKeys(value.identity, ['reference', 'displayName'])
    && value.identity.reference === AUTHENTICATED_SESSION.identity.reference
    && value.identity.displayName === AUTHENTICATED_SESSION.identity.displayName
    && value.authenticatedAt === AUTHENTICATED_SESSION.authenticatedAt
    && Array.isArray(value.sharedFields)
    && JSON.stringify(value.sharedFields) === JSON.stringify(AUTHENTICATED_SESSION.sharedFields)
}

export function restoreVneidSession(serialized) {
  if (typeof serialized !== 'string' || !serialized) return createVneidSession()
  try {
    const value = JSON.parse(serialized)
    if (exactKeys(value, ['version', 'status']) && value.version === 1 && value.status === 'signedOut') {
      return createVneidSession()
    }
    return validAuthenticatedSession(value) ? cloneAuthenticatedSession() : createVneidSession()
  } catch {
    return createVneidSession()
  }
}
