import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bank,
  Buildings,
  CalendarCheck,
  CaretDown,
  CheckCircle,
  Clock,
  ClockCounterClockwise,
  Database,
  FileText,
  FolderOpen,
  Funnel,
  Handshake,
  House,
  IdentificationCard,
  LinkSimple,
  ListChecks,
  MagnifyingGlass,
  MapPin,
  PlugsConnected,
  Plus,
  SealCheck,
  Signpost,
  Storefront,
  User,
  UsersThree,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import BrandMark from './components/BrandMark.jsx'
import LandingPage from './components/LandingPage.jsx'
import { ActionButton, Checklist, Field, FieldGrid, StatusPill } from './components/RegistryPrimitives.jsx'
import {
  STORAGE_KEY,
  demoCases,
  ecosystemConnections,
  roles,
} from './demo/demoData.js'
import {
  ACTION_META,
  ACTIONS,
  allowedActionsFor,
  createInitialState,
  getCaseStatus,
  getNextWorkItem,
  journeyReducer,
  projectStateForPublic,
  projectStateForRole,
  restoreDemoState,
  serializeDemoState,
} from './demo/journey.js'

const ROLE_ICONS = {
  agent: IdentificationCard,
  brokerage: Storefront,
  seller: House,
  buyer: User,
  bank: Bank,
  notary: SealCheck,
  developer: Buildings,
  landRegistry: MapPin,
  vmls: Database,
}

const ROLE_LABELS = {
  agent: 'Môi giới',
  brokerage: 'Sàn môi giới',
  seller: 'Người bán',
  buyer: 'Người mua',
  bank: 'Ngân hàng',
  notary: 'Văn phòng công chứng',
  developer: 'Chủ đầu tư',
  landRegistry: 'Văn phòng đăng ký đất đai',
  vmls: 'Vận hành VMLS',
}

const FALLBACK_ROLES = Object.keys(ROLE_LABELS).map((id) => ({ id, label: ROLE_LABELS[id] }))
const AVAILABLE_ROLES = roles?.length ? roles : FALLBACK_ROLES

const WORKSPACE_TITLES = {
  agent: 'Công việc cần xử lý',
  brokerage: 'Điều phối hồ sơ',
  seller: 'Yêu cầu và tài liệu',
  buyer: 'Hồ sơ mua',
  bank: 'Hồ sơ được chia sẻ',
  notary: 'Hồ sơ công chứng',
  developer: 'Chuyển nhượng HĐMB',
  landRegistry: 'Đăng ký biến động',
  vmls: 'Theo dõi xử lý',
}

const NAV_ITEMS = {
  agent: [
    ['cong-viec', 'Công việc', FolderOpen],
    ['bat-dong-san', 'Bất động sản', House],
    ['tin-ban', 'Tin bán', Signpost],
    ['giao-dich', 'Giao dịch', Handshake],
  ],
  brokerage: [
    ['cong-viec', 'Điều phối hồ sơ', UsersThree],
    ['bat-dong-san', 'Bất động sản', House],
    ['tin-ban', 'Tin bán', Signpost],
  ],
  seller: [
    ['cong-viec', 'Yêu cầu và tài liệu', FolderOpen],
    ['bat-dong-san', 'Bất động sản', House],
    ['tin-ban', 'Tin bán', Signpost],
  ],
  buyer: [
    ['cong-viec', 'Hồ sơ mua', FolderOpen],
    ['giao-dich', 'Giao dịch', Handshake],
  ],
  bank: [['cong-viec', 'Hồ sơ được chia sẻ', Bank]],
  notary: [
    ['cong-viec', 'Công việc', FolderOpen],
    ['cong-chung', 'Hồ sơ công chứng', SealCheck],
  ],
  developer: [
    ['cong-viec', 'Công việc', FolderOpen],
    ['chuyen-quyen', 'Chuyển nhượng HĐMB', Buildings],
  ],
  landRegistry: [
    ['cong-viec', 'Công việc', FolderOpen],
    ['chuyen-quyen', 'Đăng ký biến động', MapPin],
  ],
  vmls: [
    ['cong-viec', 'Theo dõi xử lý', FolderOpen],
    ['bat-dong-san', 'Bất động sản', House],
    ['tin-ban', 'Tin bán', Signpost],
    ['giao-dich', 'Giao dịch', Handshake],
    ['nguon-du-lieu', 'Kết nối & nguồn dữ liệu', PlugsConnected],
    ['nhat-ky', 'Nhật ký xử lý', ClockCounterClockwise],
  ],
}

const DETAIL_TABS = [
  ['tong-quan', 'Tổng quan'],
  ['bat-dong-san', 'Dữ liệu BĐS'],
  ['quyen-dai-dien', 'Quyền đại diện'],
  ['tin-ban', 'Tin bán'],
  ['nguoi-mua', 'Người mua'],
  ['cong-chung', 'Công chứng'],
  ['chuyen-quyen', 'Chuyển quyền'],
  ['lich-su', 'Lịch sử'],
]

const ACTION_LABELS = {
  [ACTIONS.REQUEST_SELLER_CONFIRMATION]: 'Gửi thông tin đến Người bán',
  [ACTIONS.CONFIRM_REPRESENTATION]: 'Xác nhận quyền đại diện',
  [ACTIONS.RECORD_BUYER]: 'Ghi nhận Người mua',
  [ACTIONS.VERIFY_READINESS]: 'Xác nhận thông tin',
  [ACTIONS.SUBMIT_NOTARY_DOSSIER]: 'Tiếp nhận hồ sơ',
  [ACTIONS.REQUEST_SUPPLEMENT]: 'Yêu cầu bổ sung',
  [ACTIONS.PROVIDE_SUPPLEMENT]: 'Gửi tài liệu bổ sung',
  [ACTIONS.RECORD_NOTARY_SIGNING]: 'Ghi nhận kết quả ký',
  [ACTIONS.APPROVE_LAND_REGISTRY]: 'Ghi nhận kết quả đăng ký',
  [ACTIONS.DEVELOPER_INTAKE]: 'Tiếp nhận hồ sơ chuyển nhượng',
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: 'Xác nhận chuyển nhượng',
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: 'Xác nhận đã nhận HĐMB',
}

const ACTION_ERROR_MESSAGES = {
  [ACTIONS.REQUEST_SELLER_CONFIRMATION]: 'Kiểm tra mã định danh Bất động sản, phạm vi và thời hạn của quyền đại diện.',
  [ACTIONS.CONFIRM_REPRESENTATION]: 'Xác nhận thông tin Bất động sản, người đại diện, phạm vi và thời hạn.',
  [ACTIONS.RECORD_BUYER]: 'Kiểm tra mã định danh Người mua, giá và ngày dự kiến ký.',
  [ACTIONS.VERIFY_READINESS]: 'Xác nhận đủ ba nội dung sẵn sàng trước công chứng.',
  [ACTIONS.SUBMIT_NOTARY_DOSSIER]: 'Mã tiếp nhận và toàn bộ tài liệu bắt buộc phải đầy đủ.',
  [ACTIONS.REQUEST_SUPPLEMENT]: 'Kiểm tra loại tài liệu, lý do và hạn bổ sung.',
  [ACTIONS.PROVIDE_SUPPLEMENT]: 'Tài liệu phải đúng yêu cầu và có tên tệp PDF hợp lệ.',
  [ACTIONS.RECORD_NOTARY_SIGNING]: 'Kiểm tra mã hợp đồng và thời điểm ký.',
  [ACTIONS.APPROVE_LAND_REGISTRY]: 'Kiểm tra mã kết quả và thời điểm hiệu lực.',
  [ACTIONS.DEVELOPER_INTAKE]: 'Kiểm tra mã tiếp nhận, thời điểm và số tài liệu.',
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: 'Kiểm tra mã và thời điểm xác nhận chuyển nhượng.',
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: 'Kiểm tra biên nhận và xác nhận đã nhận đúng HĐMB mới.',
}

const FILTERS = [
  ['all', 'Tất cả'],
  ['mine', 'Việc của tôi'],
  ['waiting', 'Đang chờ bên khác'],
  ['blocked', 'Có vướng mắc'],
  ['done', 'Đã xong'],
]

function subscribeToHash(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHash() {
  return window.location.hash || '#/'
}

function navigate(path) {
  if (window.location.hash === path) return
  window.location.hash = path
}

function decodeRoutePart(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

function parseRoute(hash) {
  const [path, search = ''] = hash.replace(/^#\/?/, '').split('?')
  const parts = path.split('/').filter(Boolean)
  if (parts[0] !== 'vai-tro') {
    const rawCaseId = parts[0] === 'tra-cuu' ? parts[1] : null
    const decodedCaseId = rawCaseId ? decodeRoutePart(rawCaseId) : null
    return {
      roleId: 'agent',
      page: 'landing',
      caseId: rawCaseId ? decodedCaseId ?? '__invalid_public_case__' : null,
      query: parts[0] === 'tra-cuu' ? new URLSearchParams(search).get('q') ?? '' : '',
    }
  }
  const roleId = ROLE_LABELS[parts[1]] ? parts[1] : 'agent'
  if (parts[2] === 'ho-so' && parts[3]) {
    return { roleId, page: 'ho-so', caseId: parts[3], tab: parts[4] || 'tong-quan' }
  }
  return { roleId, page: parts[2] || 'cong-viec' }
}

function rolePath(roleId, page = 'cong-viec') {
  return `#/vai-tro/${roleId}/${page}`
}

function casePath(roleId, caseId, tab = 'tong-quan') {
  return `#/vai-tro/${roleId}/ho-so/${caseId}/${tab}`
}

function publicSearchPath(query) {
  const value = query.trim()
  return value ? `#/tra-cuu?q=${encodeURIComponent(value)}` : '#/'
}

function publicCasePath(caseId) {
  return `#/tra-cuu/${encodeURIComponent(caseId)}`
}

function caseRouteToken(roleId, demoCase, projected) {
  return roleId === 'bank' ? projected?.shareId : demoCase?.id
}

function resolveRouteCaseId(route, caseStates) {
  if (route.page !== 'ho-so' || route.roleId !== 'bank') return route.caseId
  return demoCases.find((demoCase) => {
    const projection = projectStateForRole(caseStates[demoCase.id], 'bank')
    return projection?.shareId === route.caseId
  })?.id
}

function roleById(roleId) {
  return AVAILABLE_ROLES.find((item) => item.id === roleId)
    ?? { id: roleId, label: ROLE_LABELS[roleId] ?? roleId }
}

function formatDate(value, includeTime = true) {
  if (!value) return 'Chưa có'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return 'Chưa có'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

function dateInputValue(value) {
  return typeof value === 'string' ? value.slice(0, 10) : ''
}

function dateTimeInputValue(value) {
  return typeof value === 'string' ? value.slice(0, 16) : ''
}

function hanoiTimestamp(value) {
  return `${value}:00+07:00`
}

function addDays(value, days) {
  if (!value) return ''
  const date = new Date(`${dateInputValue(value)}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function hasOwn(value, key) {
  return Boolean(value) && Object.prototype.hasOwnProperty.call(value, key)
}

function statusTone(status = '') {
  const value = (typeof status === 'string' ? status : status?.label ?? '').toLowerCase()
  if (value.includes('hoàn tất') || value.includes('đã nhận') || value.includes('đã phê duyệt') || value.includes('đã xác nhận')) return 'verified'
  if (value.includes('bổ sung') || value.includes('lỗi') || value.includes('từ chối')) return 'warning'
  if (value.includes('chờ') || value.includes('chưa')) return 'pending'
  return 'neutral'
}

function initialStates() {
  const clean = Object.fromEntries(demoCases.map((item) => [item.id, createInitialState(item.id)]))
  try {
    const envelope = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (!envelope?.cases) return clean
    return Object.fromEntries(demoCases.map((item) => [
      item.id,
      envelope.cases[item.id]
        ? restoreDemoState(JSON.stringify(envelope.cases[item.id]), item.id)
        : clean[item.id],
    ]))
  } catch {
    return clean
  }
}

function storedWorkspaceRoute() {
  try {
    const candidate = JSON.parse(window.localStorage.getItem(STORAGE_KEY))?.lastWorkspaceRoute
    if (typeof candidate !== 'string' || !candidate.startsWith('#/vai-tro/')) return null
    return parseRoute(candidate).page === 'landing' ? null : candidate
  } catch {
    return null
  }
}

function storedLandingRoleId() {
  try {
    const roleId = JSON.parse(window.localStorage.getItem(STORAGE_KEY))?.landingRoleId
    return ROLE_LABELS[roleId] ? roleId : null
  } catch {
    return null
  }
}

function validatedWorkspaceRoute(caseStates) {
  const candidate = storedWorkspaceRoute()
  if (!candidate) return null

  const parsed = parseRoute(candidate)
  if (!candidate.startsWith(`#/vai-tro/${parsed.roleId}/`)) return null

  if (parsed.page !== 'ho-so') {
    const allowedPages = (NAV_ITEMS[parsed.roleId] ?? []).map(([page]) => page)
    return allowedPages.includes(parsed.page) ? candidate : rolePath(parsed.roleId)
  }

  const caseId = resolveRouteCaseId(parsed, caseStates)
  const state = caseId ? caseStates[caseId] : null
  const demoCase = demoCases.find((item) => item.id === caseId)
  const projected = state ? projectStateForRole(state, parsed.roleId) : null
  const routeToken = caseRouteToken(parsed.roleId, demoCase, projected)
  return projected && routeToken === parsed.caseId ? candidate : rolePath(parsed.roleId)
}

function actorWithWork(state) {
  return Object.keys(ROLE_LABELS).find((roleId) => allowedActionsFor(state, roleId).length > 0) ?? null
}

function isComplete(state) {
  const status = getCaseStatus(state).label.toLowerCase()
  return status.includes('hoàn tất') || status.includes('đã nhận hđmb') || status.includes('đăng ký biến động hoàn tất')
}

function rowFor(demoCase, state, roleId) {
  const projected = projectStateForRole(state, roleId)
  if (!projected) return null
  const ownActions = allowedActionsFor(state, roleId)
  const nextWork = projected.nextWorkItem
  const ownerId = nextWork?.roleId ?? nextWork?.ownerRoleId ?? (ownActions.length ? roleId : null)
  const supplement = projected.records.notaryDossier?.supplement
  const blocked = projected.records.notaryDossier?.status === 'Yêu cầu bổ sung'
    || supplement?.status === 'Chờ người bán'
  const complete = roleId === 'bank' ? false : isComplete(state)
  const bucket = complete ? 'done' : blocked ? 'blocked' : ownActions.length ? 'mine' : 'waiting'
  const updatedAt = roleId === 'bank'
    ? projected.records.readiness?.financeSharing?.recordedAt
    : state.auditEvents.at(-1)?.occurredAt
      ?? state.auditEvents.at(-1)?.at
      ?? demoCase.property.sourceRecords?.at(-1)?.receivedAt
  const visibleStatus = projected.status?.label
    ?? projected.records.readiness?.status
    ?? projected.records.readiness?.financeSharing?.status
  return {
    demoCase,
    state,
    projected,
    bucket,
    ownActions,
    ownerId,
    priority: projected.priority ?? null,
    dueAt: projected.slaDueAt ?? null,
    route: projected.records.transfer?.route ?? null,
    agentLabel: projected.parties?.agent?.displayName ?? null,
    representationExpiresOn: projected.records.representation?.expiresOn
      ?? projected.records.representation?.request?.expiresOn
      ?? null,
    status: visibleStatus,
    nextLabel: ownActions.length
      ? ACTION_LABELS[ownActions[0]] ?? ACTION_META[ownActions[0]]?.label
      : nextWork?.label ?? (complete ? 'Không còn việc cần xử lý' : roleId === 'bank' ? 'Theo dõi hồ sơ được chia sẻ' : 'Chờ cập nhật'),
    updatedAt,
  }
}

function searchableText(row) {
  const { projected } = row
  const records = projected.records
  return [
    projected.title,
    projected.dossierId,
    records.property?.id,
    records.property?.name,
    records.property?.type,
    records.property?.location,
    records.listing?.id,
    records.listing?.askingPrice?.displayValue,
    records.transaction?.id,
    records.readiness?.status,
    Number.isFinite(records.readiness?.agreedPrice) ? formatMoney(records.readiness.agreedPrice) : null,
    records.readiness?.financeSharing?.purpose,
  ].filter(Boolean).join(' ').toLocaleLowerCase('vi')
}

function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => '#/')
  const route = parseRoute(hash)
  const [caseStates, setCaseStates] = useState(initialStates)
  const [landingRoleId, setLandingRoleId] = useState(() => (
    storedLandingRoleId() ?? (storedWorkspaceRoute() ? parseRoute(storedWorkspaceRoute()).roleId : 'agent')
  ))
  const [query, setQuery] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [toast, setToast] = useState(null)
  const [showReset, setShowReset] = useState(false)
  const savedWorkspaceRoute = route.page === 'landing' ? validatedWorkspaceRoute(caseStates) : null

  useEffect(() => {
    const cases = Object.fromEntries(Object.entries(caseStates).map(([caseId, state]) => [
      caseId,
      JSON.parse(serializeDemoState(state)),
    ]))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 3,
      cases,
      landingRoleId,
      lastWorkspaceRoute: route.page === 'landing' ? savedWorkspaceRoute : hash,
    }))
  }, [caseStates, hash, landingRoleId, route.page, savedWorkspaceRoute])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function dispatch(caseId, action) {
    try {
      const previous = caseStates[caseId]
      const next = journeyReducer(previous, action)
      if (next === previous) {
        return false
      }
      setCaseStates((current) => ({ ...current, [caseId]: next }))
      const label = ACTION_LABELS[action.type] ?? 'Đã cập nhật hồ sơ'
      setAnnouncement(label)
      setToast({ tone: 'success', message: label })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật hồ sơ.'
      setAnnouncement(message)
      setToast({ tone: 'error', message })
      return false
    }
  }

  function resetData() {
    setCaseStates(Object.fromEntries(demoCases.map((item) => [item.id, createInitialState(item.id)])))
    setShowReset(false)
    setToast({ tone: 'success', message: 'Đã đặt lại 2 hồ sơ.' })
    navigate('#/vai-tro/agent/cong-viec')
  }

  const role = roleById(route.roleId)
  const rows = demoCases.map((item) => rowFor(item, caseStates[item.id], role.id)).filter(Boolean)
  const activeCaseId = resolveRouteCaseId(route, caseStates)
  const activeDemoCase = demoCases.find((item) => item.id === activeCaseId)
  const publicRecords = demoCases
    .map((item) => projectStateForPublic(caseStates[item.id]))
    .filter(Boolean)
  const landingRoleRows = demoCases
    .map((item) => rowFor(item, caseStates[item.id], landingRoleId))
    .filter(Boolean)
  const landingRoleSummary = {
    visibleDossiers: landingRoleRows.length,
    actionable: landingRoleRows.filter(({ bucket }) => bucket === 'mine').length,
    blocked: landingRoleRows.filter(({ bucket }) => bucket === 'blocked').length,
  }
  const resumeRoute = savedWorkspaceRoute
  const resumeRoleId = resumeRoute ? parseRoute(resumeRoute).roleId : null

  return (
    <div className="app-root" data-testid={route.page === 'landing' ? 'landing-shell' : 'app-shell'}>
      {route.page === 'landing' ? (
        <LandingPage
          key={`${route.caseId ?? 'all'}:${route.query ?? ''}`}
          publicRecords={publicRecords}
          connections={ecosystemConnections}
          routeCaseId={route.caseId}
          routeQuery={route.query}
          selectedRoleId={landingRoleId}
          resumeRoleId={resumeRoleId}
          roleSummary={landingRoleSummary}
          onEnterWorkspace={(roleId = 'agent') => navigate(rolePath(roleId))}
          canOpenDossier={(caseId) => Boolean(projectStateForRole(caseStates[caseId], landingRoleId))}
          onOpenDossier={(caseId, tab = 'tong-quan') => {
            const demoCase = demoCases.find((item) => item.id === caseId)
            const projected = projectStateForRole(caseStates[caseId], landingRoleId)
            const routeToken = caseRouteToken(landingRoleId, demoCase, projected)
            if (projected && routeToken) {
              navigate(casePath(landingRoleId, routeToken, tab))
              return
            }
            navigate(rolePath(landingRoleId))
          }}
          onResumeWorkspace={() => { if (resumeRoute) navigate(resumeRoute) }}
          onRoleChange={setLandingRoleId}
          onSearchRoute={(value) => navigate(publicSearchPath(value))}
          onSelectRecord={(caseId) => navigate(publicCasePath(caseId))}
        />
      ) : (
        <>
          <button className="skip-link" type="button" onClick={() => document.getElementById('noi-dung-chinh')?.focus()}>Bỏ qua điều hướng</button>
          <AppHeader role={role} query={query} onQuery={setQuery} onSearch={() => navigate(rolePath(role.id))} onReset={() => setShowReset(true)} />
          <div className="app-frame">
            <Sidebar role={role} activePage={route.page} />
            <main id="noi-dung-chinh" tabIndex="-1">
              {route.page === 'ho-so' ? (
                <DossierPage
                  role={role}
                  demoCase={activeDemoCase}
                  state={caseStates[activeCaseId]}
                  tab={route.tab}
                  onAction={(action) => dispatch(activeCaseId, action)}
                />
              ) : route.page === 'cong-viec' ? (
                <WorkQueue key={role.id} role={role} rows={rows} query={query} />
              ) : route.page === 'nguon-du-lieu' ? (
                <SourcesWorkspace />
              ) : route.page === 'nhat-ky' ? (
                <AuditWorkspace rows={rows} />
              ) : (
                <CollectionWorkspace role={role} page={route.page} rows={rows} query={query} />
              )}
            </main>
          </div>
        </>
      )}
      <div className="sr-only" aria-live="polite">{announcement}</div>
      {toast ? <Toast {...toast} onClose={() => setToast(null)} /> : null}
      {showReset ? <ResetDialog onCancel={() => setShowReset(false)} onConfirm={resetData} /> : null}
    </div>
  )
}

function AppHeader({ role, query, onQuery, onSearch, onReset }) {
  const Icon = ROLE_ICONS[role.id] ?? User
  function changeRole(event) {
    navigate(rolePath(event.target.value))
  }
  return (
    <header className="app-header">
      <div className="header-brand"><BrandMark compact /><span>Không gian dữ liệu Hà Nội</span></div>
      <form className="global-search" role="search" aria-label="Tìm trong không gian làm việc" onSubmit={(event) => { event.preventDefault(); onSearch() }}>
        <MagnifyingGlass aria-hidden="true" />
        <label className="sr-only" htmlFor="global-search-input">Tìm trong không gian làm việc</label>
        <input id="global-search-input" value={query} onChange={(event) => onQuery(event.target.value)} placeholder={role.id === 'bank' ? 'Tìm loại Bất động sản, khoảng giá, mục đích' : 'Tìm NPID, PLID, PTID, dự án, khu vực'} data-testid="global-search" />
      </form>
      <div className="header-context">
        <Icon aria-hidden="true" />
        <label>
          <span className="sr-only">Vai trò làm việc</span>
          <select value={role.id} onChange={changeRole} data-testid="role-switcher">
            {[...new Set(AVAILABLE_ROLES.map((item) => item.group ?? 'Vai trò'))].map((group) => (
              <optgroup key={group} label={group}>
                {AVAILABLE_ROLES.filter((item) => (item.group ?? 'Vai trò') === group).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </optgroup>
            ))}
          </select>
          <CaretDown aria-hidden="true" />
        </label>
        <button className="reset-button" type="button" onClick={onReset} aria-label="Đặt lại dữ liệu" title="Đặt lại dữ liệu" data-testid="reset-data">
          <ClockCounterClockwise aria-hidden="true" /><span>Đặt lại dữ liệu</span>
        </button>
      </div>
    </header>
  )
}

function Sidebar({ role, activePage }) {
  const items = NAV_ITEMS[role.id] ?? NAV_ITEMS.agent
  return (
    <aside className="app-sidebar">
      <div className="sidebar-context">
        <small>Không gian làm việc</small>
        <strong>{role.label}</strong>
        <span>{WORKSPACE_TITLES[role.id]}</span>
      </div>
      <nav aria-label="Phân hệ nghiệp vụ">
        {items.map(([id, label, Icon]) => (
          <button key={id} type="button" className={activePage === id ? 'is-active' : ''} onClick={() => navigate(rolePath(role.id, id))}>
            <Icon weight={activePage === id ? 'fill' : 'regular'} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot"><span>Địa bàn</span><strong>Hà Nội</strong></div>
    </aside>
  )
}

function WorkQueue({ role, rows, query }) {
  const [filter, setFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [routeFilter, setRouteFilter] = useState('')
  const ownerOptions = [...new Set(rows.map((row) => row.ownerId).filter(Boolean))]
  const priorityOptions = [...new Set(rows.map((row) => row.priority).filter(Boolean))]
  const routeOptions = [...new Set(rows.map((row) => row.route).filter(Boolean))]
  const queueFilters = role.id === 'brokerage'
    ? [['all', 'Tất cả'], ['open', 'Cần theo dõi'], ['blocked', 'Có vướng mắc'], ['done', 'Đã xong']]
    : role.id === 'bank'
      ? []
      : FILTERS
  const filtered = rows.filter((row) => {
    const matchesFilter = filter === 'all'
      ? true
      : filter === 'open'
        ? row.bucket !== 'done'
        : row.bucket === filter
    const matchesQuery = !query.trim() || searchableText(row).includes(query.trim().toLocaleLowerCase('vi'))
    return matchesFilter
      && matchesQuery
      && (!ownerFilter || row.ownerId === ownerFilter)
      && (!priorityFilter || row.priority === priorityFilter)
      && (!routeFilter || row.route === routeFilter)
  })
  const counts = Object.fromEntries(queueFilters.map(([id]) => [id, id === 'all' ? rows.length : id === 'open' ? rows.filter((row) => row.bucket !== 'done').length : rows.filter((row) => row.bucket === id).length]))

  return (
    <section className="page-shell work-queue" aria-labelledby="workspace-title" data-testid="work-queue">
      <PageHeader
        title={WORKSPACE_TITLES[role.id]}
        count={`${filtered.length} hồ sơ`}
        action={role.id === 'agent'
          ? <ActionButton icon={Plus} disabled testId="create-dossier">Khởi tạo</ActionButton>
          : null}
      />
      <div className="queue-controls queue-controls-meta">
        <span className="filter-summary"><Funnel aria-hidden="true" /> Dữ liệu cập nhật đến 28/08/2026</span>
      </div>
      {queueFilters.length ? <div className="metric-filters" aria-label="Lọc theo trạng thái công việc">
        {queueFilters.map(([id, label]) => (
          <button key={id} type="button" className={filter === id ? 'is-active' : ''} onClick={() => setFilter(id)} aria-pressed={filter === id} data-testid={`status-filter-${id}`}>
            <span>{label}</span><strong>{counts[id]}</strong>
          </button>
        ))}
      </div> : null}
      {ownerOptions.length || priorityOptions.length || routeOptions.length ? <div className="queue-filters" aria-label="Bộ lọc nghiệp vụ">
        {ownerOptions.length ? <label><span>Phụ trách</span><select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option value="">Tất cả</option>{ownerOptions.map((id) => <option key={id} value={id}>{ROLE_LABELS[id]}</option>)}</select></label> : null}
        {priorityOptions.length ? <label><span>Ưu tiên</span><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="">Tất cả</option>{priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></label> : null}
        {routeOptions.length ? <label><span>Tuyến chuyển quyền</span><select value={routeFilter} onChange={(event) => setRouteFilter(event.target.value)}><option value="">Tất cả</option>{routeOptions.map((route) => <option key={route} value={route}>{routeLabel(route)}</option>)}</select></label> : null}
      </div> : null}
      {filtered.length ? <WorkTable rows={filtered} role={role} /> : <EmptyState role={role} query={query} />}
    </section>
  )
}

function WorkTable({ rows, role }) {
  if (role.id === 'bank') return <BankWorkTable rows={rows} role={role} />
  return (
    <div className="data-table-wrap">
      <table className="data-table work-table">
        <thead><tr><th>Bất động sản</th><th>NPID</th><th>PLID</th><th>PTID</th>{role.id === 'brokerage' ? <th>Môi giới</th> : null}<th>Việc cần làm</th><th>Trạng thái</th><th>Phụ trách</th><th>Ưu tiên</th><th>Hạn xử lý</th>{role.id === 'brokerage' ? <th>Hết hạn đại diện</th> : null}<th>Cập nhật</th><th><span className="sr-only">Hành động</span></th></tr></thead>
        <tbody>{rows.map((row) => {
          const records = row.projected.records
          const property = records.property
          return (
            <tr key={row.demoCase.id} data-testid={`case-row-${row.demoCase.id}`}>
              <td data-label="Bất động sản"><strong>{row.projected.title ?? property.name ?? property.type}</strong><small>{property.location ?? property.type}</small></td>
              <td data-label="NPID">{property.id ? <button className="id-link" type="button" onClick={() => navigate(casePath(role.id, row.demoCase.id, 'bat-dong-san'))}>{property.id}</button> : <span className="empty-value">Không thuộc phạm vi</span>}</td>
              <td data-label="PLID">{records.listing?.id ? <button className="id-link" type="button" onClick={() => navigate(casePath(role.id, row.demoCase.id, 'tin-ban'))}>{records.listing.id}</button> : <span className="empty-value">Chưa có</span>}</td>
              <td data-label="PTID">{records.transaction?.id ? <button className="id-link" type="button" onClick={() => navigate(casePath(role.id, row.demoCase.id, 'chuyen-quyen'))}>{records.transaction.id}</button> : <span className="empty-value">Chưa có</span>}</td>
              {role.id === 'brokerage' ? <td data-label="Môi giới">{row.agentLabel}</td> : null}
              <td data-label="Việc cần làm"><strong>{row.nextLabel}</strong>{row.bucket === 'blocked' && records.notaryDossier?.supplement?.documentType ? <small className="blocker-copy"><WarningCircle aria-hidden="true" /> {records.notaryDossier.supplement.documentType}</small> : null}</td>
              <td data-label="Trạng thái"><StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill></td>
              <td data-label="Phụ trách">{row.ownerId ? ROLE_LABELS[row.ownerId] : row.bucket === 'done' ? 'Không còn việc' : 'Không thuộc phạm vi'}</td>
              <td data-label="Ưu tiên">{row.priority ? <StatusPill tone={row.priority === 'Cao' ? 'warning' : 'neutral'}>{row.priority}</StatusPill> : <span className="empty-value">Không thuộc phạm vi</span>}</td>
              <td data-label="Hạn xử lý">{row.dueAt ? formatDate(row.dueAt) : <span className="empty-value">Không thuộc phạm vi</span>}</td>
              {role.id === 'brokerage' ? <td data-label="Hết hạn đại diện">{formatDate(row.representationExpiresOn, false)}</td> : null}
              <td data-label="Cập nhật">{formatDate(row.updatedAt)}</td>
              <td><button className="row-action" type="button" onClick={() => navigate(casePath(role.id, row.demoCase.id))}>Mở hồ sơ <ArrowRight aria-hidden="true" /></button></td>
            </tr>
          )
        })}</tbody>
      </table>
    </div>
  )
}

function BankWorkTable({ rows, role }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead><tr><th>Loại Bất động sản</th><th>Giá đã thống nhất</th><th>Mốc hồ sơ</th><th>Mục đích chia sẻ</th><th>Cập nhật</th><th><span className="sr-only">Hành động</span></th></tr></thead>
        <tbody>{rows.map((row) => {
          const records = row.projected.records
          const shareId = caseRouteToken(role.id, row.demoCase, row.projected)
          return <tr key={shareId} data-testid={`shared-case-row-${shareId}`}><td data-label="Loại Bất động sản"><strong>{records.property.type}</strong></td><td data-label="Giá đã thống nhất">{formatMoney(records.readiness.agreedPrice)}</td><td data-label="Mốc hồ sơ"><StatusPill tone={statusTone(records.readiness.status)}>{records.readiness.status}</StatusPill></td><td data-label="Mục đích">{records.readiness.financeSharing.purpose}</td><td data-label="Cập nhật">{formatDate(row.updatedAt)}</td><td><button className="row-action" type="button" onClick={() => navigate(casePath(role.id, shareId))}>Mở hồ sơ <ArrowRight aria-hidden="true" /></button></td></tr>
        })}</tbody>
      </table>
    </div>
  )
}

function EmptyState({ role, query }) {
  const bank = role.id === 'bank'
  return (
    <div className="empty-state">
      <FolderOpen aria-hidden="true" />
      <h2>{query ? 'Không tìm thấy hồ sơ' : bank ? 'Chưa có hồ sơ được chia sẻ' : 'Không có hồ sơ ở bộ lọc này'}</h2>
      <p>{query ? bank ? 'Thử tìm theo loại Bất động sản, giá hoặc mục đích chia sẻ.' : 'Thử tìm bằng NPID, PLID, PTID, dự án hoặc khu vực khác.' : bank ? 'Hồ sơ chỉ xuất hiện khi Người mua cấp quyền chia sẻ còn hiệu lực.' : 'Chọn một trạng thái khác để xem hồ sơ.'}</p>
    </div>
  )
}

function CollectionWorkspace({ role, page, rows, query }) {
  const config = {
    'bat-dong-san': { title: 'Bất động sản', icon: House },
    'tin-ban': { title: 'Tin bán', icon: Signpost },
    'giao-dich': { title: 'Giao dịch', icon: Handshake },
    'cong-chung': { title: 'Hồ sơ công chứng', icon: SealCheck },
    'chuyen-quyen': { title: role.id === 'developer' ? 'Chuyển nhượng HĐMB' : 'Đăng ký biến động', icon: role.id === 'developer' ? Buildings : MapPin },
  }[page] ?? { title: 'Dữ liệu', icon: Database }
  const records = rows.filter((row) => {
    const projectedRecords = row.projected.records
    if (page === 'tin-ban') return Boolean(projectedRecords.listing)
    if (page === 'giao-dich') return Boolean(projectedRecords.transaction)
    if (page === 'cong-chung') return projectedRecords.notaryDossier?.status !== 'Chưa nộp'
    if (page === 'chuyen-quyen') return Boolean(projectedRecords.transaction)
    return true
  }).filter((row) => !query.trim() || searchableText(row).includes(query.trim().toLocaleLowerCase('vi')))
  const Icon = config.icon
  return (
    <section className="page-shell collection-page">
      <PageHeader title={config.title} count={`${records.length} bản ghi`} icon={Icon} />
      {records.length ? <CollectionTable page={page} rows={records} role={role} /> : <EmptyState role={role} query={query} />}
    </section>
  )
}

function CollectionTable({ page, rows, role }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead><tr><th>Mã bản ghi</th><th>Bất động sản</th><th>Loại / tuyến</th><th>Trạng thái</th><th>Cập nhật</th><th><span className="sr-only">Hành động</span></th></tr></thead>
        <tbody>{rows.map((row) => {
          const records = row.projected.records
          const record = page === 'tin-ban' ? records.listing : page === 'giao-dich' || page === 'chuyen-quyen' ? records.transaction : page === 'cong-chung' ? records.notaryDossier : records.property
          const tab = page === 'giao-dich' || page === 'chuyen-quyen' ? 'chuyen-quyen' : page
          const propertyLabel = row.projected.title ?? records.property?.name ?? records.property?.project ?? records.property?.type ?? row.projected.dossierId
          const typeOrRoute = page === 'chuyen-quyen'
            ? routeLabel(records.transfer?.route)
            : records.property?.type ?? records.property?.project ?? records.listing?.transactionType
          return (
            <tr key={row.demoCase.id}>
              <td data-label="Mã bản ghi"><button className="id-link" type="button" onClick={() => navigate(casePath(role.id, row.demoCase.id, tab))}>{record?.id}</button></td>
              <td data-label="Bất động sản"><strong>{propertyLabel}</strong>{records.property?.id ? <small>{records.property.id}</small> : null}</td>
              <td data-label="Loại / tuyến">{typeOrRoute ?? <span className="empty-value">Không thuộc phạm vi</span>}</td>
              <td data-label="Trạng thái"><StatusPill tone={statusTone(record?.status)}>{record?.status}</StatusPill></td>
              <td data-label="Cập nhật">{formatDate(row.updatedAt)}</td>
              <td><button className="row-action" type="button" onClick={() => navigate(casePath(role.id, row.demoCase.id, tab))}>Mở bản ghi <ArrowRight aria-hidden="true" /></button></td>
            </tr>
          )
        })}</tbody>
      </table>
    </div>
  )
}

function PageHeader({ title, count, icon: Icon, action = null }) {
  return (
    <header className="page-header">
      <div>{Icon ? <Icon weight="duotone" aria-hidden="true" /> : null}<div><h1 id="workspace-title">{title}</h1><p>{count}</p></div></div>
      {action}
    </header>
  )
}

function DossierPage({ role, demoCase, state, tab, onAction }) {
  if (!demoCase || !state) return <NotFound role={role} />
  const projected = projectStateForRole(state, role.id)
  if (!projected) return <NotFound role={role} restricted />
  const records = projected.records ?? state.records
  const routeToken = caseRouteToken(role.id, demoCase, projected)
  const availableTabs = tabsForRole(role.id)
  const activeTab = availableTabs.some(([id]) => id === tab) ? tab : availableTabs[0][0]
  const status = projected.status ?? {
    label: records.readiness?.status ?? records.readiness?.financeSharing?.status,
  }
  const ownerLabel = projected.nextWorkItem?.ownerLabel
    ?? (allowedActionsFor(state, role.id).length ? role.label : null)
  const updatedAt = role.id === 'bank'
    ? records.readiness?.financeSharing?.recordedAt
    : state.auditEvents.at(-1)?.occurredAt ?? state.auditEvents.at(-1)?.at ?? demoCase.property.sourceRecords?.at(-1)?.receivedAt
  return (
    <section className="dossier-page">
      <header className="dossier-header">
        <button className="back-link" type="button" onClick={() => navigate(rolePath(role.id))}><ArrowLeft aria-hidden="true" /> Quay lại danh sách</button>
        <div className="dossier-heading">
          <div><span>{role.id === 'bank' ? 'Hồ sơ được chia sẻ' : demoCase.dossierId ?? demoCase.id}</span><h1>{role.id === 'bank' ? records.property?.type : projected.title ?? demoCase.title}</h1><p>{role.id === 'bank' ? records.readiness?.financeSharing?.purpose : records.property?.project ?? records.property?.location ?? records.property?.type}</p></div>
          <dl>
            <div><dt>Trạng thái</dt><dd><StatusPill tone={statusTone(status)}>{status.label}</StatusPill></dd></div>
            {role.id === 'bank' ? null : <div><dt>Ưu tiên</dt><dd>{projected.priority}</dd></div>}
            {role.id === 'bank' ? null : <div><dt>Hạn xử lý</dt><dd>{formatDate(projected.slaDueAt)}</dd></div>}
            {role.id === 'bank' ? null : <div><dt>Phụ trách</dt><dd>{ownerLabel ?? 'Không còn việc'}</dd></div>}
            <div><dt>Cập nhật</dt><dd>{formatDate(updatedAt)}</dd></div>
          </dl>
        </div>
        {role.id === 'bank' ? null : <RecordRelationBar role={role} demoCase={demoCase} records={records} />}
        <nav className="detail-tabs" aria-label="Nội dung hồ sơ">
          {availableTabs.map(([id, label]) => <button key={id} type="button" className={activeTab === id ? 'is-active' : ''} onClick={() => navigate(casePath(role.id, routeToken, id))}>{label}</button>)}
        </nav>
      </header>
      <div className="dossier-content">
        <DossierTab role={role} demoCase={demoCase} state={state} projected={projected} records={records} parties={projected.parties ?? {}} tab={activeTab} onAction={onAction} />
      </div>
    </section>
  )
}

function tabsForRole(roleId) {
  if (roleId === 'bank') return DETAIL_TABS.filter(([id]) => id === 'tong-quan')
  if (roleId === 'brokerage') return DETAIL_TABS.filter(([id]) => !['nguoi-mua', 'lich-su'].includes(id))
  if (roleId === 'seller') return DETAIL_TABS.filter(([id]) => id !== 'nguoi-mua')
  if (roleId === 'buyer') return DETAIL_TABS.filter(([id]) => !['quyen-dai-dien', 'lich-su'].includes(id))
  if (roleId === 'notary') return DETAIL_TABS.filter(([id]) => ['tong-quan', 'bat-dong-san', 'quyen-dai-dien', 'nguoi-mua', 'cong-chung'].includes(id))
  if (roleId === 'developer' || roleId === 'landRegistry') return DETAIL_TABS.filter(([id]) => ['tong-quan', 'bat-dong-san', 'cong-chung', 'chuyen-quyen'].includes(id))
  return DETAIL_TABS
}

function RecordRelationBar({ role, demoCase, records }) {
  const links = [
    ['property', 'NPID', records.property?.id, 'bat-dong-san', House],
    ['listing', 'PLID', records.listing?.id, 'tin-ban', Signpost],
    ['transaction', 'PTID', records.transaction?.id, 'chuyen-quyen', Handshake],
  ].filter(([recordKey]) => hasOwn(records, recordKey))
  return (
    <div className="relation-bar" aria-label="Bản ghi liên quan">
      {links.map(([, label, value, tab, Icon]) => (
        <button key={label} type="button" disabled={!value} onClick={() => navigate(casePath(role.id, demoCase.id, tab))} data-testid={`object-${label.toLowerCase()}`}>
          <Icon aria-hidden="true" /><span>{label}</span><strong>{value ?? 'Chưa có'}</strong><ArrowRight aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

function DossierTab({ role, demoCase, state, projected, records, parties, tab, onAction }) {
  if (role.id === 'bank') return <BankOverview records={records} />
  if (tab === 'tong-quan') return <OverviewTab role={role} demoCase={demoCase} state={state} records={records} onAction={onAction} />
  if (tab === 'bat-dong-san') return <PropertyTab property={records.property} />
  if (tab === 'quyen-dai-dien') return <RepresentationTab parties={parties} record={records.representation} />
  if (tab === 'tin-ban') return <ListingTab listing={records.listing} />
  if (tab === 'nguoi-mua') return <BuyerTab readiness={records.readiness} />
  if (tab === 'cong-chung') return <NotaryTab dossier={records.notaryDossier} />
  if (tab === 'chuyen-quyen') return <TransferTab transaction={records.transaction} transfer={records.transfer} integrations={projected.integrationEvents ?? []} />
  return <HistoryTab events={projected.auditEvents ?? []} />
}

function OverviewTab({ role, demoCase, state, records, onAction }) {
  const propertyFields = [
    ['Loại', records.property?.type],
    ['Khu vực', records.property?.location],
    ['Dự án', records.property?.project],
    ['Căn / thửa', records.property?.unit ?? records.property?.parcelRef],
    ['Trạng thái định danh', records.property?.status],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '')
  return (
    <div className="overview-layout">
      <TaskPanel role={role} demoCase={demoCase} state={state} onAction={onAction} />
      <div className="overview-secondary">
        <section className="record-panel"><PanelHeading icon={House} title="Bất động sản" meta={records.property?.id} /><FieldGrid>{propertyFields.map(([label, value]) => <Field key={label} label={label} value={value} />)}</FieldGrid></section>
        <section className="record-panel"><PanelHeading icon={ListChecks} title="Tình trạng hồ sơ" /><div className="status-stack">{records.representation ? <StatusRow label="Quyền đại diện" value={records.representation.status} /> : null}{records.listing ? <StatusRow label="Tin bán" value={records.listing.status ?? 'Đã ghi nhận'} /> : null}{records.readiness ? <StatusRow label="Người mua" value={records.readiness.status} /> : null}{records.notaryDossier ? <StatusRow label="Công chứng" value={records.notaryDossier.status} /> : null}{records.transfer ? <StatusRow label="Chuyển quyền" value={records.transfer.status} /> : null}</div></section>
      </div>
    </div>
  )
}

function TaskPanel({ role, demoCase, state, onAction }) {
  const actions = allowedActionsFor(state, role.id)
  const nextWork = getNextWorkItem(state)
  if (!actions.length) {
    const complete = isComplete(state)
    return (
      <section className="task-panel no-action" data-testid="task-panel">
        <PanelHeading icon={complete ? CheckCircle : Clock} title={complete ? 'Không còn việc cần xử lý' : 'Đang chờ cập nhật'} />
        <FieldGrid><Field label="Trạng thái" value={getCaseStatus(state).label} /><Field label="Bên phụ trách" value={nextWork?.ownerLabel ?? (actorWithWork(state) ? ROLE_LABELS[actorWithWork(state)] : 'Không còn việc')} /><Field label="Việc tiếp theo" value={nextWork?.label ?? (complete ? 'Hồ sơ đã hoàn tất' : 'Chờ hồ sơ trước hoàn thành')} /></FieldGrid>
      </section>
    )
  }
  return (
    <section className="task-panel" data-testid="task-panel">
      <PanelHeading icon={CalendarCheck} title="Việc cần xử lý" meta={role.label} />
      <ActionForm actionTypes={actions} role={role} demoCase={demoCase} state={state} onAction={onAction} />
    </section>
  )
}

function ActionForm({ actionTypes, role, demoCase, state, onAction }) {
  const [selectedAction, setSelectedAction] = useState(actionTypes[0])
  const actionType = actionTypes.includes(selectedAction) ? selectedAction : actionTypes[0]
  if (actionTypes.length > 1) {
    return (
      <div className="action-choice">
        <div role="tablist" aria-label="Chọn kết quả kiểm tra">
          {actionTypes.map((type) => <button key={type} role="tab" aria-selected={actionType === type} type="button" onClick={() => setSelectedAction(type)}>{ACTION_LABELS[type]}</button>)}
        </div>
        <ActionFields key={`${demoCase.id}-${actionType}`} actionType={actionType} role={role} demoCase={demoCase} state={state} onAction={onAction} />
      </div>
    )
  }
  return <ActionFields key={`${demoCase.id}-${actionType}`} actionType={actionType} role={role} demoCase={demoCase} state={state} onAction={onAction} />
}

function ActionFields({ actionType, role, demoCase, state, onAction }) {
  const requiredDocuments = demoCase.notary?.documents ?? []
  const [form, setForm] = useState(() => defaultActionForm(actionType, demoCase, state, requiredDocuments))
  const [formError, setFormError] = useState('')
  function update(name, value) { setForm((current) => ({ ...current, [name]: value })) }
  function submit(event) {
    event.preventDefault()
    setFormError('')
    if (actionType === ACTIONS.REQUEST_SELLER_CONFIRMATION && form.expiresOn <= form.startsOn) {
      setFormError('Ngày hết hạn phải sau ngày hiệu lực.')
      event.currentTarget.querySelector('[name="expiresOn"]')?.focus()
      return
    }
    const accepted = onAction({ type: actionType, actor: role.id, payload: payloadFor(actionType, form) })
    if (!accepted) setFormError(ACTION_ERROR_MESSAGES[actionType] ?? 'Kiểm tra lại dữ liệu đã nhập.')
  }

  const formErrorNode = formError ? <p className="form-error" role="alert"><WarningCircle weight="fill" aria-hidden="true" />{formError}</p> : null
  const submitControl = (secondary = false) => <>{formErrorNode}<ActionButton type="submit" formNoValidate secondary={secondary} testId={`action-${actionType}`}>{ACTION_LABELS[actionType]}</ActionButton></>

  if (actionType === ACTIONS.REQUEST_SELLER_CONFIRMATION) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã định danh Bất động sản" name="propertyId" value={form.propertyId} onChange={(value) => update('propertyId', value)} /><FormSelect label="Phạm vi đại diện" value={form.scope} onChange={(value) => update('scope', value)} options={['Độc quyền', 'Không độc quyền']} /><FormInput label="Ngày hiệu lực" name="startsOn" type="date" value={form.startsOn} onChange={(value) => update('startsOn', value)} /><FormInput label="Ngày hết hạn" name="expiresOn" type="date" value={form.expiresOn} onChange={(value) => update('expiresOn', value)} /></div><div className="form-readonly"><span>Người bán</span><strong>{demoCase.parties?.seller?.displayName}</strong><span>Mã định danh Người bán</span><strong className="mono">{demoCase.parties?.seller?.reference}</strong><span>Người đại diện (Môi giới)</span><strong>{demoCase.parties?.agent?.displayName}</strong><span>Sàn môi giới</span><strong>{demoCase.parties?.agent?.organization}</strong></div>{submitControl()}</form>
  }

  if (actionType === ACTIONS.CONFIRM_REPRESENTATION) {
    return <form className="task-form" onSubmit={submit}><div className="confirmation-summary"><FieldGrid><Field label="Mã bản ghi xác nhận" value={state.records.representation.confirmation?.id} mono /><Field label="Mã định danh Bất động sản" value={state.records.property.id} mono /><Field label="Người đại diện (Môi giới)" value={demoCase.parties?.agent?.displayName} /><Field label="Sàn môi giới" value={demoCase.parties?.agent?.organization} /><Field label="Phạm vi" value={state.records.representation.request?.scope} /><Field label="Hiệu lực" value={`${formatDate(state.records.representation.request?.startsOn, false)} — ${formatDate(state.records.representation.request?.expiresOn, false)}`} /></FieldGrid></div><label className="checkbox-field"><input type="checkbox" checked={form.accepted} onChange={(event) => update('accepted', event.target.checked)} required /><span>Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn.</span></label>{submitControl()}</form>
  }

  if (actionType === ACTIONS.RECORD_BUYER) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã định danh Người mua" value={form.buyerRef} onChange={(value) => update('buyerRef', value)} /><FormInput label="Giá đã thống nhất (VND)" type="number" min="1" value={form.agreedPrice} onChange={(value) => update('agreedPrice', value)} /><FormInput label="Ngày dự kiến ký" type="date" value={form.expectedSigningOn} onChange={(value) => update('expectedSigningOn', value)} /></div>{submitControl()}</form>
  }

  if (actionType === ACTIONS.VERIFY_READINESS) {
    const checklist = [['identityReviewed', 'Thông tin định danh của tôi'], ['paymentPlanReviewed', 'Phương án thanh toán'], ['documentsReviewed', 'Danh mục tài liệu được chia sẻ']]
    const contract = state.records.readiness.contractConfirmation ?? {}
    return <form className="task-form" onSubmit={submit}><section className="confirmation-summary contract-confirmation" aria-labelledby="contract-confirmation-title"><h3 id="contract-confirmation-title">Thông tin hợp đồng cần xác nhận</h3><FieldGrid><Field label="Họ tên Người mua" value={contract.buyer?.displayName ?? state.records.readiness.buyer?.displayName} /><Field label="Mã định danh Người mua" value={contract.buyer?.reference ?? state.records.readiness.buyer?.reference} mono /><Field label="Mã định danh Bất động sản" value={contract.property?.id ?? state.records.property.id} mono /><Field label="Loại giao dịch" value={contract.transactionType ?? state.records.listing?.transactionType} /><Field label="Giá đã thống nhất" value={formatMoney(contract.agreedPrice ?? state.records.readiness.agreedPrice)} /><Field label="Ngày dự kiến ký" value={formatDate(contract.expectedSigningOn ?? state.records.readiness.expectedSigningOn, false)} /></FieldGrid></section><fieldset className="readiness-checks"><legend>Nội dung Người mua xác nhận</legend>{checklist.map(([key, label]) => <label key={key}><input type="checkbox" checked={form[key]} onChange={(event) => update(key, event.target.checked)} required /><span>{label}</span></label>)}</fieldset><label className="checkbox-field optional"><input type="checkbox" checked={form.bankConsent} onChange={(event) => update('bankConsent', event.target.checked)} /><span>Chia sẻ giá, Bất động sản và lịch dự kiến với Ngân hàng</span></label>{submitControl()}</form>
  }

  if (actionType === ACTIONS.SUBMIT_NOTARY_DOSSIER) {
    return <form className="task-form" onSubmit={submit}><FormInput label="Mã tiếp nhận" value={form.submissionRef} onChange={(value) => update('submissionRef', value)} /><fieldset className="document-checks"><legend>Thành phần hồ sơ</legend>{requiredDocuments.map((document) => { const id = typeof document === 'string' ? document : document.id; const label = typeof document === 'string' ? document : document.label; return <label key={id}><input type="checkbox" checked={form.documentIds.includes(id)} onChange={(event) => update('documentIds', event.target.checked ? [...form.documentIds, id] : form.documentIds.filter((item) => item !== id))} /><span>{label}</span></label> })}</fieldset>{submitControl()}</form>
  }

  if (actionType === ACTIONS.REQUEST_SUPPLEMENT) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormSelect label="Loại tài liệu" value={form.documentType} onChange={(value) => update('documentType', value)} options={[demoCase.notary.supplement.documentType]} /><FormSelect label="Lý do" value={form.reasonCode} onChange={(value) => update('reasonCode', value)} options={[demoCase.notary.supplement.reasonCode]} labels={['Thiếu xác nhận tình trạng hôn nhân']} /><FormInput label="Hạn bổ sung" type="date" value={form.dueOn} onChange={(value) => update('dueOn', value)} /></div>{submitControl(true)}</form>
  }

  if (actionType === ACTIONS.PROVIDE_SUPPLEMENT) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã tài liệu" value={form.documentId} onChange={(value) => update('documentId', value)} /><FormInput label="Loại tài liệu" value={form.documentType} onChange={(value) => update('documentType', value)} /><FormInput label="Tên tệp PDF" value={form.fileName} onChange={(value) => update('fileName', value)} pattern=".+\.pdf$" /></div>{submitControl()}</form>
  }

  if (actionType === ACTIONS.RECORD_NOTARY_SIGNING) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã hợp đồng" value={form.contractId} onChange={(value) => update('contractId', value)} /><FormInput label="Thời điểm ký" type="datetime-local" min="2026-08-01T00:00" max="2026-08-31T23:59" value={form.signedAt} onChange={(value) => update('signedAt', value)} /></div>{submitControl()}</form>
  }

  if (actionType === ACTIONS.APPROVE_LAND_REGISTRY) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã kết quả" value={form.resultRef} onChange={(value) => update('resultRef', value)} /><FormInput label="Thời điểm hiệu lực" type="datetime-local" min="2026-08-01T00:00" max="2026-08-31T23:59" value={form.approvedAt} onChange={(value) => update('approvedAt', value)} /></div>{submitControl()}</form>
  }

  if (actionType === ACTIONS.DEVELOPER_INTAKE) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã tiếp nhận Chủ đầu tư" value={form.intakeRef} onChange={(value) => update('intakeRef', value)} /><FormInput label="Thời điểm tiếp nhận" type="datetime-local" min="2026-08-01T00:00" max="2026-08-31T23:59" value={form.receivedAt} onChange={(value) => update('receivedAt', value)} /><FormInput label="Số tài liệu" type="number" min={Math.max(1, requiredDocuments.length)} value={form.documentCount} onChange={(value) => update('documentCount', value)} /></div>{submitControl()}</form>
  }

  if (actionType === ACTIONS.DEVELOPER_CONFIRM_TRANSFER) {
    return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã xác nhận chuyển nhượng" value={form.confirmationRef} onChange={(value) => update('confirmationRef', value)} /><FormInput label="Thời điểm xác nhận" type="datetime-local" min="2026-08-01T00:00" max="2026-08-31T23:59" value={form.confirmedAt} onChange={(value) => update('confirmedAt', value)} /></div><p className="result-preview"><FileText aria-hidden="true" /> HĐMB mới: <strong className="mono">{demoCase.transfer?.resultRef ?? 'HDMB-MOI-S2-12A/2026'}</strong></p>{submitControl()}</form>
  }

  return <form className="task-form" onSubmit={submit}><div className="form-grid"><FormInput label="Mã biên nhận" value={form.receiptRef} onChange={(value) => update('receiptRef', value)} /><FormInput label="Thời điểm nhận" type="datetime-local" min="2026-08-01T00:00" max="2026-08-31T23:59" value={form.receivedAt} onChange={(value) => update('receivedAt', value)} /></div><label className="checkbox-field"><input type="checkbox" checked={form.acknowledged} onChange={(event) => update('acknowledged', event.target.checked)} required /><span>Tôi xác nhận đã nhận đúng HĐMB mới.</span></label>{submitControl()}</form>
}

function defaultActionForm(type, demoCase, state, documents) {
  const actionTimes = demoCase.actionTimes ?? {}
  const representationStart = dateInputValue(actionTimes[ACTIONS.REQUEST_SELLER_CONFIRMATION])
  const defaults = {
    [ACTIONS.REQUEST_SELLER_CONFIRMATION]: { propertyId: demoCase.property.id, scope: 'Độc quyền', startsOn: representationStart, expiresOn: addDays(representationStart, 30) },
    [ACTIONS.CONFIRM_REPRESENTATION]: { accepted: false },
    [ACTIONS.RECORD_BUYER]: { buyerRef: demoCase.parties?.buyer?.reference ?? `BUYER-${demoCase.id}`, agreedPrice: demoCase.listing?.askingPrice?.value ?? 1, expectedSigningOn: dateInputValue(actionTimes[ACTIONS.RECORD_NOTARY_SIGNING]) },
    [ACTIONS.VERIFY_READINESS]: { confirmed: true, identityReviewed: false, paymentPlanReviewed: false, documentsReviewed: false, bankConsent: demoCase.id === 'sun-grand-thuy-khue' },
    [ACTIONS.SUBMIT_NOTARY_DOSSIER]: { submissionRef: demoCase.notary?.id, documentIds: documents.map((item) => typeof item === 'string' ? item : item.id) },
    [ACTIONS.REQUEST_SUPPLEMENT]: { reasonCode: demoCase.notary?.supplement?.reasonCode ?? 'missing-document', documentType: demoCase.notary?.supplement?.documentType ?? 'Tài liệu bổ sung', dueOn: dateInputValue(actionTimes[ACTIONS.PROVIDE_SUPPLEMENT]) },
    [ACTIONS.PROVIDE_SUPPLEMENT]: { documentId: 'TLBS-HN-00044', documentType: state.records.notaryDossier.supplement?.documentType ?? 'Xác nhận tình trạng hôn nhân', fileName: 'xac-nhan-tinh-trang-hon-nhan.pdf' },
    [ACTIONS.RECORD_NOTARY_SIGNING]: { contractId: demoCase.notary?.contractId ?? demoCase.transfer?.contractReference ?? `HD-${demoCase.id}`, signedAt: dateTimeInputValue(actionTimes[ACTIONS.RECORD_NOTARY_SIGNING]) },
    [ACTIONS.APPROVE_LAND_REGISTRY]: { resultRef: 'KQ-ĐKBĐ-260828-044', approvedAt: dateTimeInputValue(actionTimes[ACTIONS.APPROVE_LAND_REGISTRY]) },
    [ACTIONS.DEVELOPER_INTAKE]: { intakeRef: demoCase.transfer?.intakeRef ?? 'TNCĐT-S2-12A-2026', receivedAt: dateTimeInputValue(actionTimes[ACTIONS.DEVELOPER_INTAKE]), documentCount: Math.max(4, demoCase.notary?.requiredDocumentIds?.length ?? 4) },
    [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: { confirmationRef: `XN-${demoCase.transfer?.intakeRef ?? 'CDT-S2-12A'}`, confirmedAt: dateTimeInputValue(actionTimes[ACTIONS.DEVELOPER_CONFIRM_TRANSFER]) },
    [ACTIONS.BUYER_RECEIVE_CONTRACT]: { receiptRef: demoCase.transfer?.resultRef ?? 'HDMB-MOI-S2-12A/2026', receivedAt: dateTimeInputValue(actionTimes[ACTIONS.BUYER_RECEIVE_CONTRACT]), acknowledged: false },
  }
  return defaults[type] ?? {}
}

function payloadFor(type, form) {
  if (type === ACTIONS.REQUEST_SELLER_CONFIRMATION) return { ...form, propertyId: String(form.propertyId ?? '').trim().toUpperCase() }
  if (type === ACTIONS.RECORD_BUYER) return { buyerRef: form.buyerRef, agreedPrice: Number(form.agreedPrice), expectedSigningOn: form.expectedSigningOn }
  if (type === ACTIONS.VERIFY_READINESS) return { confirmed: true, checklist: { identityReviewed: form.identityReviewed, paymentPlanReviewed: form.paymentPlanReviewed, documentsReviewed: form.documentsReviewed }, bankConsent: form.bankConsent }
  if (type === ACTIONS.SUBMIT_NOTARY_DOSSIER) return { submissionRef: form.submissionRef, documentIds: form.documentIds ?? [] }
  if (type === ACTIONS.RECORD_NOTARY_SIGNING) return { ...form, signedAt: hanoiTimestamp(form.signedAt) }
  if (type === ACTIONS.APPROVE_LAND_REGISTRY) return { ...form, approvedAt: hanoiTimestamp(form.approvedAt) }
  if (type === ACTIONS.DEVELOPER_INTAKE) return { ...form, documentCount: Number(form.documentCount), receivedAt: hanoiTimestamp(form.receivedAt) }
  if (type === ACTIONS.DEVELOPER_CONFIRM_TRANSFER) return { ...form, confirmedAt: hanoiTimestamp(form.confirmedAt) }
  if (type === ACTIONS.BUYER_RECEIVE_CONTRACT) return { ...form, receivedAt: hanoiTimestamp(form.receivedAt) }
  return form
}

function FormInput({ label, value, onChange, type = 'text', ...props }) {
  return <label className="form-field"><span>{label}</span><input type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} required {...props} /></label>
}

function FormSelect({ label, value, onChange, options, labels = options }) {
  return <label className="form-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} required>{options.map((option, index) => <option key={option} value={option}>{labels[index]}</option>)}</select></label>
}

function PropertyTab({ property }) {
  const areas = property.areas ?? []
  const sources = property.sources ?? property.sourceRecords ?? []
  const identificationFields = [
    ['Tên Bất động sản', property.name],
    ['Loại', property.type],
    ['Khu vực', property.location],
    ['Dự án', hasOwn(property, 'project') ? property.project ?? 'Không thuộc dự án' : undefined],
    ['Căn / thửa', property.unit ?? property.parcelRef],
    ['Trạng thái định danh', property.status],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '')
  return (
    <div className="two-column-grid">
      <section className="record-panel"><PanelHeading icon={House} title="Thông tin nhận dạng" meta={property.id} /><FieldGrid>{identificationFields.map(([label, value]) => <Field key={label} label={label} value={value} />)}</FieldGrid></section>
      {areas.length ? <section className="record-panel"><PanelHeading icon={ListChecks} title="Diện tích theo nguồn" /><div className="fact-table">{areas.map((area) => <div key={area.kind ?? area.label}><span>{area.label}</span><strong>{area.displayValue ?? `${String(area.value).replace('.', ',')} ${area.unit}`}</strong><small>{area.sourceLabel ?? area.sourceId}</small></div>)}</div></section> : null}
      {sources.length ? <section className="record-panel full-span"><PanelHeading icon={LinkSimple} title="Nguồn của bản ghi" /><table className="compact-table"><thead><tr><th>Mã nguồn</th><th>Loại tài liệu</th><th>Ngày ghi nhận</th><th>Trạng thái</th></tr></thead><tbody>{sources.map((source) => <tr key={source.id}><td className="mono">{source.id}</td><td>{source.label ?? source.type}</td><td>{formatDate(source.receivedAt ?? source.effectiveAt ?? source.issuedOn, false)}</td><td><StatusPill tone={statusTone(source.status ?? 'Đã ghi nhận')}>{source.status ?? 'Đã ghi nhận'}</StatusPill></td></tr>)}</tbody></table></section> : null}
    </div>
  )
}

function RepresentationTab({ parties, record }) {
  const representationParties = record.parties ?? {}
  const seller = representationParties.seller ?? parties.seller
  const representative = representationParties.representative ?? representationParties.agent ?? parties.agent
  const sellerFields = [
    ['Họ tên', seller?.displayName],
    ['Mã định danh Người bán', seller?.reference],
    ['Giấy tờ định danh', seller?.identityRef],
    ['Liên hệ', seller?.phone],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '')
  const representativeFields = [
    ['Họ tên', representative?.displayName],
    ['Mã định danh Người đại diện', representative?.reference],
    ['Sàn môi giới', representative?.organization],
    ['Liên hệ', representative?.phone],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '')
  const hasScope = hasOwn(record, 'scope') || hasOwn(record, 'request')
  const hasStart = hasOwn(record, 'startsOn') || hasOwn(record.request, 'startsOn')
  const hasExpiry = hasOwn(record, 'expiresOn') || hasOwn(record.request, 'expiresOn')
  const hasConfirmation = hasOwn(record, 'confirmation')
  const authorityFields = [
    ['Kênh xác nhận', record.confirmationChannel, false],
    ['Trạng thái', record.status, false],
    hasScope ? ['Phạm vi', record.scope ?? record.request?.scope, false] : null,
    hasStart ? ['Ngày bắt đầu', formatDate(record.startsOn ?? record.request?.startsOn, false), false] : null,
    hasExpiry ? ['Ngày hết hạn', formatDate(record.expiresOn ?? record.request?.expiresOn, false), false] : null,
    hasConfirmation ? ['Mã bản ghi xác nhận', record.confirmation?.id, true] : null,
  ].filter(Boolean)
  return (
    <div className="two-column-grid">
      <section className="record-panel"><PanelHeading icon={House} title="Thông tin Người bán" meta={seller?.reference} /><FieldGrid>{sellerFields.map(([label, value]) => <Field key={label} label={label} value={value} mono={label.startsWith('Mã định danh')} />)}</FieldGrid></section>
      <section className="record-panel"><PanelHeading icon={IdentificationCard} title="Thông tin Người đại diện (Môi giới)" meta={representative?.reference} /><FieldGrid>{representativeFields.map(([label, value]) => <Field key={label} label={label} value={value} mono={label.startsWith('Mã định danh')} />)}</FieldGrid></section>
      <section className="record-panel full-span"><PanelHeading icon={CalendarCheck} title="Phạm vi và hiệu lực" meta={record.id} /><FieldGrid>{authorityFields.map(([label, value, mono]) => <Field key={label} label={label} value={value} mono={mono} />)}</FieldGrid></section>
    </div>
  )
}

function BankOverview({ records }) {
  return (
    <div className="two-column-grid">
      <section className="record-panel"><PanelHeading icon={Bank} title="Thông tin được chia sẻ" /><FieldGrid><Field label="Loại Bất động sản" value={records.property?.type} /><Field label="Giá đã thống nhất" value={formatMoney(records.readiness?.agreedPrice)} /><Field label="Mốc hồ sơ" value={records.readiness?.status} /></FieldGrid></section>
      <section className="record-panel"><PanelHeading icon={ListChecks} title="Phạm vi sử dụng" /><FieldGrid><Field label="Trạng thái chia sẻ" value={records.readiness?.financeSharing?.status} /><Field label="Mục đích" value={records.readiness?.financeSharing?.purpose} /><Field label="Trường dữ liệu" value={records.readiness?.financeSharing?.visibleFields?.join(', ')} /></FieldGrid></section>
    </div>
  )
}

function ListingTab({ listing }) {
  if (!listing) return <RecordEmpty icon={Signpost} title="Chưa có Tin bán" copy="Tin bán được tạo sau khi Người bán xác nhận quyền đại diện." />
  const channels = listing.channels ?? []
  return <div className="two-column-grid"><section className="record-panel"><PanelHeading icon={Signpost} title="Tin bán" meta={listing.id} /><FieldGrid><Field label="Bất động sản" value={listing.propertyId ?? listing.npid} mono /><Field label="Loại giao dịch" value={listing.transactionType} /><Field label="Giá" value={listing.askingPrice?.displayValue ?? formatMoney(listing.askingPrice)} /><Field label="Trạng thái" value={listing.status} /><Field label="Ngày khởi tạo" value={formatDate(listing.createdAt)} /></FieldGrid></section><section className="record-panel full-span"><PanelHeading icon={PlugsConnected} title="Kênh phân phối" /><table className="compact-table channel-table"><thead><tr><th>Kênh</th><th>Phạm vi dữ liệu</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead><tbody>{channels.map((channel) => <tr key={channel.id ?? channel.name} data-testid={channel.id === 'housenow' ? 'distribution-housenow' : undefined}><td><span className="channel-name">{channel.icon ? <img src={channel.icon} alt="" /> : null}<strong>{channel.name}</strong></span></td><td>{channel.fieldScope ?? channel.scope}</td><td><StatusPill tone={statusTone(channel.status)}>{channel.status}</StatusPill></td><td>{formatDate(channel.updatedAt)}</td></tr>)}</tbody></table></section></div>
}

function BuyerTab({ readiness }) {
  const contract = readiness.contractConfirmation ?? {}
  const buyer = contract.buyer ?? readiness.buyer
  return <div className="two-column-grid"><section className="record-panel"><PanelHeading icon={User} title="Người mua" meta={buyer?.reference} /><FieldGrid><Field label="Họ tên" value={buyer?.displayName} /><Field label="Mã định danh Người mua" value={buyer?.reference} mono /><Field label="Giấy tờ định danh" value={buyer?.identityRef} /><Field label="Giá đã thống nhất" value={formatMoney(contract.agreedPrice ?? readiness.agreedPrice)} /><Field label="Ngày dự kiến ký" value={formatDate(contract.expectedSigningOn ?? readiness.expectedSigningOn, false)} /><Field label="Trạng thái" value={readiness.status} /></FieldGrid></section><section className="record-panel"><PanelHeading icon={FileText} title="Thông tin hợp đồng" /><FieldGrid><Field label="Mã định danh Bất động sản" value={contract.property?.id} mono /><Field label="Bất động sản" value={contract.property?.name} /><Field label="Loại giao dịch" value={contract.transactionType} /></FieldGrid></section><section className="record-panel"><PanelHeading icon={ListChecks} title="Nội dung đã kiểm tra" /><Checklist items={Object.entries(readiness.checklist ?? {}).map(([key, value]) => ({ id: key, label: { identityReviewed: 'Thông tin định danh', paymentPlanReviewed: 'Phương án thanh toán', documentsReviewed: 'Danh mục tài liệu' }[key] ?? key, state: value ? 'done' : 'pending' }))} /></section>{hasOwn(readiness, 'financeSharing') ? <section className="record-panel full-span"><PanelHeading icon={Bank} title="Chia sẻ với Ngân hàng" /><FieldGrid><Field label="Trạng thái" value={readiness.financeSharing?.status} /><Field label="Mục đích" value={readiness.financeSharing?.purpose} /><Field label="Trường dữ liệu" value={readiness.financeSharing?.visibleFields?.join(', ')} /></FieldGrid></section> : null}</div>
}

function NotaryTab({ dossier }) {
  const docs = dossier.documents ?? []
  const dossierFields = [
    hasOwn(dossier, 'office') ? ['Văn phòng', dossier.office, false] : null,
    hasOwn(dossier, 'submission') ? ['Mã tiếp nhận', dossier.submission?.reference, true] : null,
    ['Trạng thái', dossier.status, false],
    hasOwn(dossier, 'signedResult') ? ['Mã hợp đồng', dossier.signedResult?.contractId, true] : null,
  ].filter(Boolean)
  return <div className="two-column-grid"><section className="record-panel"><PanelHeading icon={SealCheck} title="Hồ sơ công chứng" meta={dossier.id} /><FieldGrid>{dossierFields.map(([label, value, mono]) => <Field key={label} label={label} value={value} mono={mono} />)}</FieldGrid></section>{docs.length ? <section className="record-panel"><PanelHeading icon={FileText} title="Thành phần hồ sơ" /><Checklist items={docs.map((document) => typeof document === 'string' ? document : ({ id: document.id, label: document.label, state: document.status === 'Thiếu' ? 'warning' : document.status === 'Chưa nộp' ? 'pending' : 'done', stateLabel: document.status }))} /></section> : null}{dossier.supplement ? <section className="record-panel full-span issue-panel"><PanelHeading icon={WarningCircle} title="Yêu cầu bổ sung" meta={dossier.supplement.status} /><FieldGrid><Field label="Loại tài liệu" value={dossier.supplement.documentType} /><Field label="Lý do" value={dossier.supplement.reasonLabel ?? dossier.supplement.reasonCode} /><Field label="Người cung cấp" value="Người bán" /><Field label="Hạn bổ sung" value={formatDate(dossier.supplement.dueOn, false)} /><Field label="Tệp đã gửi" value={dossier.supplement.document?.fileName} /></FieldGrid></section> : null}</div>
}

function TransferTab({ transaction, transfer, integrations }) {
  if (!transaction) return <RecordEmpty icon={Handshake} title="Chưa có Giao dịch" copy="Giao dịch được tạo khi hệ thống nhận kết quả ký hợp lệ từ hồ sơ công chứng." />
  const routeFields = transfer.route === 'developer'
    ? [
        ['Mã tiếp nhận', transfer.intakeRef ?? transfer.intake?.reference],
        ['Mã xác nhận', transfer.confirmationRef ?? transfer.confirmation?.reference],
        ['HĐMB mới', transfer.contractReference ?? transfer.resultRef],
        ['Mã biên nhận', transfer.receiptRef ?? transfer.receipt?.reference],
      ]
    : [
        ['Mã kết quả đăng ký', transfer.resultRef ?? transfer.result?.reference],
        ['Thời điểm hiệu lực', formatDate(transfer.resultAt ?? transfer.result?.approvedAt)],
      ]
  return (
    <div className="two-column-grid">
      <section className="record-panel"><PanelHeading icon={Handshake} title="Giao dịch" meta={transaction.id} /><FieldGrid><Field label="NPID" value={transaction.propertyId ?? transaction.npid} mono /><Field label="PLID" value={transaction.listingId ?? transaction.plid} mono /><Field label="Hồ sơ công chứng" value={transaction.notaryDossierId} mono /><Field label="Trạng thái" value={transaction.status} /></FieldGrid></section>
      <section className="record-panel"><PanelHeading icon={routeIcon(transfer.route)} title="Xử lý chuyển quyền" meta={routeLabel(transfer.route)} /><FieldGrid><Field label="Căn cứ định tuyến" value={transfer.basisLabel ?? transfer.basis} /><Field label="Trạng thái" value={transfer.status} />{routeFields.map(([label, value]) => <Field key={label} label={label} value={value} mono />)}</FieldGrid></section>
      {integrations.length ? <section className="record-panel full-span"><PanelHeading icon={PlugsConnected} title="Sự kiện xử lý" /><IntegrationTable events={integrations} /></section> : null}
    </div>
  )
}

function HistoryTab({ events }) {
  const showReferences = events.some((event) => event.targetId || event.correlationId)
  return <section className="record-panel"><PanelHeading icon={ClockCounterClockwise} title="Lịch sử thay đổi" meta={`${events.length} sự kiện`} />{events.length ? <table className="compact-table audit-table"><thead><tr><th>Thời điểm</th><th>Chủ thể</th><th>Thao tác</th>{showReferences ? <th>Đối tượng</th> : null}<th>Thay đổi trạng thái</th>{showReferences ? <th>Mã tương quan</th> : null}</tr></thead><tbody>{[...events].reverse().map((event) => <tr key={event.id}><td>{formatDate(event.occurredAt ?? event.at)}</td><td>{ROLE_LABELS[event.actorRoleId ?? event.actor] ?? event.actorLabel ?? event.actor}</td><td>{event.label ?? event.action}</td>{showReferences ? <td className="mono">{event.targetId}</td> : null}<td>{event.beforeStatus && event.afterStatus ? `${event.beforeStatus} → ${event.afterStatus}` : event.reason ?? event.summary}</td>{showReferences ? <td className="mono">{event.correlationId}</td> : null}</tr>)}</tbody></table> : <p className="empty-copy">Chưa có thay đổi nào.</p>}</section>
}

function IntegrationTable({ events = [] }) {
  if (!events.length) return <p className="empty-copy">Chưa có sự kiện xử lý.</p>
  return <table className="compact-table"><thead><tr><th>Thời điểm</th><th>Hệ thống</th><th>Đối tượng</th><th>Loại sự kiện</th><th>Trạng thái</th><th>Mã tương quan</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td>{formatDate(event.occurredAt ?? event.at)}</td><td>{event.system ?? event.source}</td><td className="mono">{event.targetId ?? event.target}</td><td>{event.label ?? event.type}</td><td><StatusPill tone={statusTone(event.status)}>{event.status}</StatusPill></td><td className="mono">{event.correlationId}</td></tr>)}</tbody></table>
}

function SourcesWorkspace() {
  const [preview, setPreview] = useState(null)
  const sources = ecosystemConnections
  return (
    <section className="page-shell sources-page">
      <PageHeader title="Kết nối & nguồn dữ liệu" count={`${sources.length} điểm nối`} icon={PlugsConnected} />
      <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Hệ thống</th><th>Vai trò dữ liệu</th><th>Phạm vi trao đổi</th><th>Địa chỉ</th><th>Trạng thái</th><th>Ảnh chụp</th><th><span className="sr-only">Hành động</span></th></tr></thead><tbody>{sources.map((source) => <tr key={source.id} data-testid={source.id}><td data-label="Hệ thống"><strong>{source.name}</strong><small>{source.owner} · <span className="mono">{source.id}</span></small></td><td data-label="Vai trò dữ liệu">{source.relationship}<small>{source.direction}</small></td><td data-label="Phạm vi trao đổi"><strong>{source.inputLabel}</strong><small>{source.inputFields.join(' · ')}</small></td><td data-label="Địa chỉ"><a href={source.url} target="_blank" rel="noreferrer">{source.url} <LinkSimple aria-hidden="true" /></a></td><td data-label="Trạng thái"><StatusPill tone={statusTone(source.status)}>{source.status}</StatusPill></td><td data-label="Ảnh chụp">{source.capturedOn}</td><td><button className="row-action" type="button" onClick={() => setPreview(source)}>Xem bản chụp</button></td></tr>)}</tbody></table></div>
      {preview ? <SourcePreview source={preview} onClose={() => setPreview(null)} /> : null}
    </section>
  )
}

function SourcePreview({ source, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const returnFocus = document.activeElement
    ref.current?.querySelector('button')?.focus()
    return () => returnFocus?.isConnected && returnFocus.focus()
  }, [])
  function handleKeyDown(event) {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
    if (event.key !== 'Tab') return
    const controls = [...ref.current.querySelectorAll('button:not([disabled]), a[href]')]
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus() }
    if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus() }
  }
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><aside className="source-drawer" role="dialog" aria-modal="true" aria-labelledby="source-title" tabIndex="-1" ref={ref} onKeyDown={handleKeyDown} data-testid="source-preview"><header><div><small>Ảnh chụp {source.capturedOn}</small><h2 id="source-title">{source.name}</h2></div><button type="button" onClick={onClose} aria-label="Đóng"><X aria-hidden="true" /></button></header><img src={source.screenshot} alt={`${source.name} chụp ngày ${source.capturedOn}`} /><dl><div><dt>Địa chỉ</dt><dd><a href={source.url} target="_blank" rel="noreferrer">{source.url}</a></dd></div><div><dt>Vai trò dữ liệu</dt><dd>{source.relationship}</dd></div><div><dt>{source.inputLabel}</dt><dd>{source.inputFields.join(' · ')}</dd></div><div><dt>{source.outputLabel}</dt><dd>{source.outputFields.join(' · ')}</dd></div><div><dt>Trạng thái</dt><dd>{source.status}</dd></div></dl></aside></div>
}

function AuditWorkspace({ rows }) {
  const events = rows.flatMap((row) => row.state.auditEvents.map((event) => ({ ...event, propertyId: row.state.records.property.id }))).sort((a, b) => String(b.occurredAt ?? b.at).localeCompare(String(a.occurredAt ?? a.at)))
  return <section className="page-shell"><PageHeader title="Nhật ký xử lý" count={`${events.length} sự kiện`} icon={ClockCounterClockwise} /><section className="record-panel">{events.length ? <table className="compact-table audit-table"><thead><tr><th>Thời điểm</th><th>NPID</th><th>Chủ thể</th><th>Thao tác</th><th>Đối tượng</th><th>Mã tương quan</th></tr></thead><tbody>{events.map((event) => <tr key={`${event.propertyId}-${event.id}`}><td>{formatDate(event.occurredAt ?? event.at)}</td><td className="mono">{event.propertyId}</td><td>{ROLE_LABELS[event.actorRoleId ?? event.actor] ?? event.actorLabel}</td><td>{event.label ?? event.action}</td><td className="mono">{event.targetId}</td><td className="mono">{event.correlationId}</td></tr>)}</tbody></table> : <p className="empty-copy">Chưa có sự kiện xử lý.</p>}</section></section>
}

function PanelHeading({ icon: Icon, title, meta }) {
  return <header className="panel-heading"><span><Icon weight="duotone" aria-hidden="true" /></span><div><h2>{title}</h2>{meta ? <small>{meta}</small> : null}</div></header>
}

function StatusRow({ label, value }) {
  return <div><span>{label}</span><StatusPill tone={statusTone(value)}>{value}</StatusPill></div>
}

function RecordEmpty({ icon: Icon, title, copy }) {
  return <div className="record-empty"><Icon aria-hidden="true" /><h2>{title}</h2><p>{copy}</p></div>
}

function routeLabel(route) {
  if (route === 'developer') return 'Chủ đầu tư / HĐMB'
  if (route === 'landRegistry') return 'Văn phòng đăng ký đất đai'
  return 'Chưa xác định'
}

function routeIcon(route) {
  return route === 'developer' ? Buildings : route === 'landRegistry' ? MapPin : Handshake
}

function NotFound({ role, restricted = false }) {
  return <div className="page-shell"><div className="empty-state"><FolderOpen aria-hidden="true" /><h1>{restricted ? 'Hồ sơ không thuộc phạm vi được chia sẻ' : 'Không tìm thấy hồ sơ'}</h1><p>{restricted ? 'Danh sách của vai trò này chỉ hiển thị các hồ sơ có quyền chia sẻ còn hiệu lực.' : 'Bản ghi có thể đã đổi mã hoặc không còn trong danh sách.'}</p><ActionButton onClick={() => navigate(rolePath(role.id))}>Quay lại danh sách</ActionButton></div></div>
}

function Toast({ tone, message, onClose }) {
  return <div className={`toast toast-${tone}`} role={tone === 'error' ? 'alert' : 'status'}><span>{tone === 'error' ? <WarningCircle weight="fill" /> : <CheckCircle weight="fill" />}</span><strong>{message}</strong><button type="button" onClick={onClose} aria-label="Đóng thông báo"><X aria-hidden="true" /></button></div>
}

function ResetDialog({ onCancel, onConfirm }) {
  const ref = useRef(null)
  useEffect(() => {
    const returnFocus = document.activeElement
    ref.current?.querySelector('button')?.focus()
    return () => returnFocus?.isConnected && returnFocus.focus()
  }, [])
  function onKeyDown(event) {
    if (event.key === 'Escape') { event.preventDefault(); onCancel(); return }
    if (event.key !== 'Tab') return
    const controls = [...ref.current.querySelectorAll('button:not([disabled])')]
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus() }
    if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus() }
  }
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}><section className="reset-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={onKeyDown}><button className="dialog-close" type="button" onClick={onCancel} aria-label="Đóng"><X aria-hidden="true" /></button><ClockCounterClockwise className="dialog-icon" aria-hidden="true" /><h2 id="reset-title">Đặt lại 2 hồ sơ?</h2><p>Các thay đổi đã lưu trong trình duyệt sẽ trở về trạng thái ban đầu.</p><div><ActionButton secondary icon={null} onClick={onCancel}>Hủy</ActionButton><ActionButton danger icon={null} onClick={onConfirm} testId="confirm-reset">Đặt lại dữ liệu</ActionButton></div></section></div>
}

export default App
