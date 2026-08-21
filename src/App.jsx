import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import LandingPage from './components/LandingPage.jsx'
import V5Workspace from './components/V5Workspace.jsx'
import VNeIDSessionControl from './components/VNeIDSession.jsx'
import {
  PRIMARY_LISTING_ID,
  V5_ROLES,
  V5_STORAGE_KEY,
} from './demo/v5Data.js'
import {
  createV5InitialState,
  getNextExternalMilestone,
  projectV5Public,
  projectV5StateForRole,
  restoreV5State,
  serializeV5State,
  v5Reducer,
} from './demo/v5Journey.js'
import {
  VNEID_SESSION_ACTIONS,
  VNEID_SESSION_STORAGE_KEY,
  restoreVneidSession,
  serializeVneidSession,
  vneidSessionReducer,
} from './demo/vneidSession.js'

const LEGACY_DEMO_KEYS = Object.freeze([
  'vmls:operations:2026-08:v4',
  'vmls:represented-market:2026-08:v2',
  'vmls:phu-thuong:2026-08:v5',
  'vmls:phu-thuong:2026-08:v6',
])

const ROLE_IDS = new Set(V5_ROLES.map(({ id }) => id))

function subscribeToHash(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHash() {
  return window.location.hash || '#/'
}

function parseRoute(hash) {
  if (!hash || hash === '#' || hash === '#/') return { page: 'landing', valid: true }
  const workMatch = hash.match(/^#\/vai-tro\/([^/]+)\/cong-viec$/)
  if (workMatch && ROLE_IDS.has(workMatch[1])) {
    return { page: 'cong-viec', roleId: workMatch[1], valid: true }
  }
  const dossierMatch = hash.match(/^#\/vai-tro\/([^/]+)\/ho-so\/([^/]+)$/)
  if (dossierMatch && ROLE_IDS.has(dossierMatch[1])) {
    return {
      page: 'ho-so',
      roleId: dossierMatch[1],
      dossierId: dossierMatch[2],
      valid: true,
    }
  }
  return { page: 'landing', valid: false }
}

function navigate(hash) {
  if (window.location.hash === hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }
  window.location.hash = hash
}

function initialState() {
  try {
    return restoreV5State(window.localStorage.getItem(V5_STORAGE_KEY))
  } catch {
    return createV5InitialState()
  }
}

function initialVneidSession() {
  try {
    return restoreVneidSession(window.localStorage.getItem(VNEID_SESSION_STORAGE_KEY))
  } catch {
    return restoreVneidSession(null)
  }
}

function displayMoney(value) {
  const amount = typeof value === 'number' ? value : value?.value
  if (!Number.isFinite(amount)) return null
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function displayTimestamp(value) {
  if (!value) return 'Bộ dữ liệu mẫu'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parsed)
}

function normalizeLandingListing(record) {
  const provenance = record.provenance ?? {}
  const area = record.area ?? record.areas?.[0]
  return {
    id: record.id,
    listingId: record.id,
    propertyId: record.propertyId,
    title: record.title,
    propertyType: record.propertyType,
    status: record.status,
    location: typeof record.location === 'string'
      ? record.location
      : [record.location?.ward, record.location?.district, record.location?.city].filter(Boolean).join(', '),
    askingPriceDisplay: record.askingPrice?.displayValue ?? displayMoney(record.askingPrice),
    areaLabel: area?.displayValue ?? (area?.value ? `${area.value} ${area.unit ?? 'm²'}` : null),
    source: {
      name: provenance.sourceName ?? provenance.source ?? 'HouseNow',
      recordId: provenance.sourceRecordId ?? provenance.sourceKey ?? provenance.recordId ?? record.id,
      version: provenance.version ?? provenance.sourceVersion ?? 'snapshot-v1',
      updatedAt: displayTimestamp(provenance.sourceUpdatedAt ?? provenance.retrievedAt ?? provenance.updatedAt),
    },
    isPrimary: record.id === PRIMARY_LISTING_ID,
  }
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => '#/')
  const route = parseRoute(hash)
  const [state, setState] = useState(initialState)
  const [vneidSession, setVneidSession] = useState(initialVneidSession)
  const stateRef = useRef(state)
  const [announcement, setAnnouncement] = useState('')
  const validDossierRoute = route.page !== 'ho-so'
    || (Boolean(state.records.transaction.id) && route.dossierId === state.records.transaction.id)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (route.valid && validDossierRoute) return
    const timeout = window.setTimeout(() => {
      if (state.actionLog.length) {
        const fresh = createV5InitialState()
        stateRef.current = fresh
        setState(fresh)
        setAnnouncement('Route không hợp lệ; đã trả demo về fixture sạch.')
      }
      navigate('#/')
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [route.valid, state.actionLog.length, validDossierRoute])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (route.page === 'landing') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }
      const isDossierRoute = route.page === 'ho-so'
      const target = document.getElementById(isDossierRoute ? 'dossier' : 'workspace-main')
      target?.focus({ preventScroll: true })
      if (isDossierRoute) target?.scrollIntoView({ block: 'start', behavior: 'auto' })
      else window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash, route.page])

  useEffect(() => {
    try {
      window.localStorage.setItem(V5_STORAGE_KEY, serializeV5State(state))
      for (const key of LEGACY_DEMO_KEYS) window.localStorage.removeItem(key)
    } catch {
      // The runtime stays usable in privacy modes that deny localStorage writes.
    }
  }, [state])

  useEffect(() => {
    try {
      window.localStorage.setItem(VNEID_SESSION_STORAGE_KEY, serializeVneidSession(vneidSession))
    } catch {
      // The runtime stays usable in privacy modes that deny localStorage writes.
    }
  }, [vneidSession])

  const publicProjection = useMemo(() => projectV5Public(state), [state])
  const landingListings = useMemo(
    () => (publicProjection?.listings ?? []).map(normalizeLandingListing),
    [publicProjection],
  )
  const unreadByRole = useMemo(() => Object.fromEntries(V5_ROLES.map(({ id }) => {
    const projection = projectV5StateForRole(state, id)
    const count = projection?.notifications?.filter(({ readAt }) => !readAt).length ?? 0
    return [id, count]
  })), [state])

  function dispatchAction(action) {
    const current = stateRef.current
    const next = v5Reducer(current, action)
    if (next === current) return false
    stateRef.current = next
    setState(next)
    setAnnouncement(action.type === 'MARK_NOTIFICATION_READ' ? 'Đã đánh dấu thông báo là đã đọc.' : 'Đã cập nhật hồ sơ.')
    return true
  }

  function enterRole(roleId) {
    if (!ROLE_IDS.has(roleId)) return
    navigate(`#/vai-tro/${roleId}/cong-viec`)
  }

  function resetDemo() {
    const next = createV5InitialState()
    stateRef.current = next
    setState(next)
    setAnnouncement('Đã đặt lại bộ dữ liệu mẫu.')
    navigate('#/')
  }

  function confirmVneidLogin() {
    setVneidSession((current) => vneidSessionReducer(current, {
      type: VNEID_SESSION_ACTIONS.CONFIRM_LOGIN,
      payload: { accepted: true },
    }))
    setAnnouncement('Đã đăng nhập VNeID.')
  }

  function logoutVneid() {
    setVneidSession((current) => vneidSessionReducer(current, {
      type: VNEID_SESSION_ACTIONS.LOGOUT,
    }))
    setAnnouncement('Đã đăng xuất VNeID.')
  }

  const vneidIdentity = vneidSession.status === 'authenticated' ? vneidSession.identity : null
  const vneidControl = (
    <VNeIDSessionControl
      session={vneidIdentity}
      identityPreview={{
        reference: 'VNEID-HN-0001',
        displayName: 'N••• H••• N••',
        status: 'Đã xác thực',
      }}
      scopes={['Mã phiên định danh', 'Họ tên đã che', 'Kết quả xác thực']}
      onLogin={confirmVneidLogin}
      onLogout={logoutVneid}
      variant="header"
    />
  )

  if (route.page === 'landing' || !route.roleId || !validDossierRoute) {
    return (
      <>
        <LandingPage
          listings={landingListings}
          roles={V5_ROLES}
          unreadByRole={unreadByRole}
          onEnterDemo={enterRole}
          vneidControl={vneidControl}
        />
        <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      </>
    )
  }

  const role = V5_ROLES.find(({ id }) => id === route.roleId)
  if (!role) return null
  const projection = projectV5StateForRole(state, role.id)
  if (!projection) return null

  return (
    <>
      <V5Workspace
        role={role}
        roles={V5_ROLES}
        projection={projection}
        unreadCount={unreadByRole[role.id] ?? 0}
        unreadByRole={unreadByRole}
        nextMilestone={role.id === 'vmls' ? getNextExternalMilestone(state) : null}
        onDispatch={dispatchAction}
        onSwitchRole={enterRole}
        onOpenDossier={(transactionId) => navigate(`#/vai-tro/${role.id}/ho-so/${transactionId}`)}
        onOpenLanding={() => navigate('#/')}
        onReset={resetDemo}
        vneidControl={vneidControl}
      />
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    </>
  )
}
