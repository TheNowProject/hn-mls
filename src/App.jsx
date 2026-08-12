import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  FluentProvider,
  Tooltip,
  webLightTheme,
} from '@fluentui/react-components'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Buildings,
  CalendarCheck,
  CaretDown,
  ChartLineUp,
  Check,
  CheckCircle,
  Clock,
  ClockCounterClockwise,
  Database,
  Eye,
  FileMagnifyingGlass,
  FileText,
  Funnel,
  HouseLine,
  ListBullets,
  ListMagnifyingGlass,
  LockKey,
  MagnifyingGlass,
  MapPin,
  Plus,
  ShieldCheck,
  SignOut,
  SlidersHorizontal,
  SpinnerGap,
  SquaresFour,
  TrendDown,
  TrendUp,
  UsersThree,
  Warning,
  X,
} from '@phosphor-icons/react'
import { activityFeedsByMarket, properties as initialProperties, qualityIssues, roles } from './data/mockData.js'
import { actorExperiencesByMarket } from './data/actorViews.js'
import { mlsApi } from './lib/apiClient.js'
import {
  ActorTable as ExplorationActorTable,
  ActorWorkspace as ExplorationActorWorkspace,
  AppsWorkspace,
  CmaWorkspace,
  ContactsWorkspace,
  FlowDialog,
  OrganizationWorkspace,
} from './components/ExplorationWorkspaces.jsx'

const navItems = {
  overview: { id: 'overview', label: 'Tổng quan', icon: SquaresFour },
  discover: { id: 'discover', label: 'Tìm kiếm', icon: ListMagnifyingGlass },
  listings: { id: 'listings', label: 'Listing', icon: HouseLine },
  contacts: { id: 'contacts', label: 'Khách hàng', icon: UsersThree },
  analytics: { id: 'analytics', label: 'Phân tích CMA', icon: ChartLineUp },
  quality: { id: 'quality', label: 'Chất lượng dữ liệu', icon: Database },
  organization: { id: 'organization', label: 'Tổ chức', icon: Buildings },
  apps: { id: 'apps', label: 'Ứng dụng', icon: SquaresFour },
  projects: { id: 'projects', label: 'Project & Unit', icon: Buildings },
  finance: { id: 'finance', label: 'Finance fit', icon: ChartLineUp },
  oversight: { id: 'oversight', label: 'Giám sát thị trường', icon: ShieldCheck },
  shortlist: { id: 'shortlist', label: 'Shortlist', icon: CalendarCheck },
}

const navigationByRole = {
  agent: ['overview', 'discover', 'listings', 'contacts', 'analytics', 'apps'],
  broker: ['overview', 'discover', 'listings', 'quality', 'organization', 'analytics'],
  developer: ['overview', 'projects', 'discover', 'listings', 'analytics'],
  bank: ['overview', 'finance', 'discover'],
  regulator: ['overview', 'oversight', 'quality', 'discover'],
  buyer: ['overview', 'discover', 'shortlist'],
  steward: ['overview', 'quality', 'discover', 'organization'],
}

const pageMeta = {
  overview: ['Tổng quan', 'Theo dõi listing, công việc và biến động thị trường trong một nơi.'],
  discover: ['Tìm kiếm dữ liệu', 'Tìm đúng Property, sau đó làm việc với từng Listing liên quan.'],
  listings: ['Listing workspace', 'Quản lý vòng đời, chất lượng và phạm vi phân phối.'],
  quality: ['Chất lượng dữ liệu', 'Xử lý xung đột định danh, nguồn dữ liệu và vi phạm nghiệp vụ.'],
  contacts: ['Khách hàng', 'Nhu cầu, shortlist và lịch xem theo từng khách hàng.'],
  analytics: ['Phân tích CMA', 'Chọn comparable và tạo báo cáo có thể giải thích.'],
  organization: ['Tổ chức', 'Thành viên, vai trò và phạm vi quản trị dữ liệu.'],
  apps: ['Ứng dụng', 'Các công cụ chuyên biệt dùng chung dữ liệu MLS.'],
  projects: ['Project & Unit', 'Quản lý inventory, availability và assignment theo từng Unit.'],
  finance: ['Finance fit', 'Đánh giá ngữ cảnh tài chính trong đúng purpose và consent.'],
  oversight: ['Giám sát thị trường', 'Theo dõi tín hiệu tổng hợp; drill-down luôn cần authority và audit.'],
  shortlist: ['Shortlist', 'So sánh nhà đã lưu, lịch xem và thay đổi giá từ public projection.'],
}

const statusTone = {
  Active: 'positive',
  Incoming: 'warning',
  Submitted: 'warning',
  Pending: 'warning',
  'On hold': 'neutral',
  Closed: 'neutral',
  Withdrawn: 'neutral',
  'Needs correction': 'danger',
}

const theme = {
  ...webLightTheme,
  colorBrandBackground: '#176b55',
  colorBrandBackgroundHover: '#125945',
  colorBrandBackgroundPressed: '#0c4938',
  colorBrandForeground1: '#176b55',
  colorBrandStroke1: '#176b55',
  borderRadiusMedium: '12px',
  borderRadiusLarge: '16px',
  fontFamilyBase: '"Avenir Next", Avenir, "Segoe UI", sans-serif',
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${statusTone[status] ?? 'neutral'}`}>{status}</span>
}

function VerificationBadge({ value }) {
  const confirmed = value === 'Đã xác minh' || value === 'Đã đối chiếu'
  return (
    <span className={`verification-badge ${confirmed ? 'verification-ok' : 'verification-warning'}`}>
      {confirmed ? <ShieldCheck weight="fill" /> : <Warning weight="fill" />}
      {value}
    </span>
  )
}

function App() {
  const [roleId, setRoleId] = useState('agent')
  const [marketId, setMarketId] = useState('hcm')
  const [page, setPage] = useState('overview')
  const [query, setQuery] = useState('')
  const [type, setType] = useState('Tất cả')
  const [selectedId, setSelectedId] = useState(initialProperties[0].id)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [listings, setListings] = useState(initialProperties)
  const [issues, setIssues] = useState(qualityIssues)
  const [isSearching, setIsSearching] = useState(false)
  const [isComposerOpen, setComposerOpen] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [connectionState, setConnectionState] = useState('loading')
  const [connectionError, setConnectionError] = useState('')
  const [flow, setFlow] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Listing cần bổ sung nguồn', meta: 'HN-LST-2026-00904 · 8 phút trước', page: 'listings', read: false },
    { id: 2, title: 'Lịch xem đã được xác nhận', meta: 'The Metropole · 17:30 hôm nay', page: 'contacts', read: false },
    { id: 3, title: 'Có 3 comparable mới', meta: 'CMA Thủ Thiêm · 26 phút trước', page: 'analytics', read: false },
    { id: 4, title: 'Quality issue gần SLA', meta: 'DQ-2031 · còn 2 giờ', page: 'quality', read: false },
  ])

  const role = roles.find((item) => item.id === roleId)
  const market = marketId === 'hanoi' ? { id: 'hanoi', label: 'Hà Nội', shortLabel: 'HN' } : { id: 'hcm', label: 'TP. Hồ Chí Minh', shortLabel: 'SG' }
  const scopedListings = useMemo(() => listings.filter((property) => (property.market ?? 'hcm') === marketId), [listings, marketId])
  const scopedIssues = useMemo(() => issues.filter((issue) => marketId === 'hanoi' ? issue.code.startsWith('DQ-HN-') : !issue.code.startsWith('DQ-HN-')), [issues, marketId])
  const selectedSummary = scopedListings.find((item) => item.id === selectedId) ?? scopedListings[0]
  const selected = selectedDetail?.id === selectedId ? selectedDetail : selectedSummary
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi')
    return scopedListings.filter((property) => {
      const listingId = property.currentListing?.id ?? ''
      const searchable = [property.title, property.address, property.id, property.parcelId, property.project, listingId]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('vi')
      return (!normalized || searchable.includes(normalized)) && (type === 'Tất cả' || property.type === type)
    })
  }, [scopedListings, query, type])
  const propertyTypes = useMemo(() => ['Tất cả', ...new Set(scopedListings.map((property) => property.type))], [scopedListings])

  useEffect(() => {
    let cancelled = false
    async function loadWorkspace() {
      try {
        await mlsApi.login(roleId)
        const payload = await mlsApi.bootstrap()
        if (cancelled) return
        const nextSelectedId = payload.properties.find((property) => (property.market ?? 'hcm') === marketId)?.id
        setListings(payload.properties)
        setIssues(payload.qualityIssues)
        setSelectedId(nextSelectedId)
        setSelectedDetail(null)
        setConnectionState('ready')
      } catch (error) {
        if (cancelled) return
        setConnectionState('offline')
        setConnectionError(error.message)
      }
    }
    loadWorkspace()
    return () => { cancelled = true }
  }, [roleId, marketId])

  useEffect(() => {
    if (connectionState !== 'ready' || !selectedId) return undefined
    let cancelled = false
    mlsApi.propertyIntelligence(selectedId)
      .then((payload) => { if (!cancelled) setSelectedDetail(payload.property) })
      .catch((error) => {
        if (!cancelled) {
          setToast(`Không thể tải Property Intelligence: ${error.message}`)
          window.setTimeout(() => setToast(''), 2600)
        }
      })
    return () => { cancelled = true }
  }, [connectionState, roleId, selectedId])

  const switchRole = (nextRole) => {
    setConnectionState('loading')
    setConnectionError('')
    setPage('overview')
    setSelectedDetail(null)
    setComposerOpen(false)
    setTransitionTarget(null)
    setFlow(null)
    setNotificationsOpen(false)
    setRoleId(nextRole)
  }

  const switchMarket = (nextMarket) => {
    setMarketId(nextMarket)
    setType('Tất cả')
    setQuery('')
    setPage('overview')
    setSelectedDetail(null)
    setMobileDetailOpen(false)
    setConnectionState('loading')
    setFlow(null)
  }

  const navigate = (nextPage) => {
    setPage(nextPage)
    setMobileDetailOpen(false)
  }

  const performSearch = (event) => {
    event?.preventDefault()
    setPage('discover')
    setIsSearching(true)
    window.setTimeout(() => setIsSearching(false), 420)
  }

  const selectProperty = (id) => {
    setSelectedId(id)
    setSelectedDetail(null)
    setMobileDetailOpen(true)
  }

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const openFlow = (nextFlow) => setFlow(() => nextFlow)

  const completeFlow = (completedFlow, form) => {
    completedFlow.onComplete?.(form)
    if (completedFlow.type === 'issue' && form.decision === 'Đã xử lý') {
      setIssues((current) => current.filter((issue) => issue.code !== completedFlow.issue.code))
    }
    setFlow(null)
    notify(completedFlow.success)
  }

  const openNotification = (notification) => {
    setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item))
    setNotificationsOpen(false)
    navigate(notification.page)
  }

  const startListingCreation = () => {
    const candidate = scopedListings.find((property) => !property.currentListing)
    setPage('discover')
    if (!candidate) {
      notify('Không còn Property trống trong không gian dữ liệu này. Mở một Listing hiện hữu để tiếp tục quản lý vòng đời.')
      return
    }
    setSelectedId(candidate.id)
    setSelectedDetail(null)
    setMobileDetailOpen(true)
    setComposerOpen(true)
  }

  const createListing = async (listingInput) => {
    const payload = await mlsApi.createListing({ ...listingInput, propertyId: selected.id })
    setListings((current) => current.map((property) => property.id === payload.property.id ? payload.property : property))
    setComposerOpen(false)
    setPage('listings')
    notify(`Đã tạo ${payload.property.currentListing.status} Listing và ghi audit event.`)
  }

  const transitionListing = async (input) => {
    const payload = await mlsApi.transitionListing(transitionTarget.currentListing.id, input)
    setListings((current) => current.map((property) => property.id === payload.property.id ? payload.property : property))
    setTransitionTarget(null)
    notify(`Listing đã chuyển sang ${payload.property.currentListing.status}.`)
  }

  const [title, subtitle] = pageMeta[page]

  return (
    <FluentProvider theme={theme}>
      <a className="skip-link" href="#main-workspace">Bỏ qua điều hướng</a>
      <div className="app-shell">
        <aside className="sidebar">
          <button className="brand-mark" onClick={() => navigate('overview')} aria-label="Về tổng quan HouseNow MLS">
            <span className="brand-symbol"><HouseLine weight="fill" /></span>
            <span><strong>HouseNow</strong><small>MLS Core</small></span>
          </button>

          <div className="dataset-switcher">
            <span className="dataset-icon">{market.shortLabel}</span>
            <label><small>Không gian dữ liệu</small><select value={marketId} onChange={(event) => switchMarket(event.target.value)} aria-label="Không gian dữ liệu"><option value="hcm">TP. Hồ Chí Minh</option><option value="hanoi">Hà Nội</option></select></label>
            <CaretDown />
          </div>

          <nav className="primary-nav" aria-label="Điều hướng chính">
            {[
              { label: 'Không gian theo vai trò', ids: navigationByRole[roleId].slice(0, 5) },
              { label: 'Công cụ bổ sung', ids: navigationByRole[roleId].slice(5) },
            ].filter((group) => group.ids.length).map((group) => (
              <div className="nav-group" key={group.label}>
                <span className="nav-group-label">{group.label}</span>
                {group.ids.map((id) => {
                  const item = navItems[id]
                  const Icon = item.icon
                  const itemCount = item.id === 'listings'
                    ? scopedListings.filter((property) => property.currentListing).length
                    : item.id === 'quality' ? scopedIssues.length : null
                  return (
                    <button key={item.id} className={page === item.id ? 'nav-item nav-item-active' : 'nav-item'} aria-current={page === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}>
                      <Icon /> <span>{item.label}</span>{itemCount ? <b>{itemCount}</b> : null}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>

          <div className="profile-block">
            <div className="avatar">{role.shortLabel}</div>
            <div><strong>{role.name}</strong><span>{role.organization}</span></div>
            <Tooltip content="Đặt lại phiên khám phá" relationship="label"><button aria-label="Đặt lại phiên khám phá" onClick={() => { switchRole('agent'); notify('Đã đặt lại phiên về góc nhìn Môi giới.') }}><SignOut /></button></Tooltip>
          </div>
        </aside>

        <div className="app-main">
          <header className="global-header">
            <form className="global-search" onSubmit={performSearch} onClick={() => page !== 'discover' && setPage('discover')}>
              <MagnifyingGlass />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm Property, Listing, dự án hoặc môi giới" aria-label="Tìm kiếm toàn cục" />
              <kbd>⌘ K</kbd>
            </form>
            <div className="global-actions">
              <div className="notification-anchor"><Tooltip content="Thông báo" relationship="label"><button className="icon-button" aria-label="Thông báo" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((current) => !current)}><Bell />{notifications.some((item) => !item.read) && <span className="notification-count">{notifications.filter((item) => !item.read).length}</span>}</button></Tooltip>{notificationsOpen && <div className="notification-panel"><header><div><strong>Thông báo</strong><span>{notifications.filter((item) => !item.read).length} chưa đọc</span></div><button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))}>Đánh dấu đã đọc</button></header>{notifications.map((item) => <button key={item.id} className={item.read ? 'notification-item read' : 'notification-item'} onClick={() => openNotification(item)}><span className="notification-dot" /><span><strong>{item.title}</strong><small>{item.meta}</small></span><ArrowRight /></button>)}</div>}</div>
              <div className="role-switcher">
                <span className="role-monogram">{role.shortLabel}</span>
                <label><small>Góc nhìn</small><select value={roleId} onChange={(event) => switchRole(event.target.value)} aria-label="Góc nhìn người dùng">{roles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
                <CaretDown />
              </div>
              {['agent', 'broker', 'steward'].includes(roleId) && <Button appearance="primary" icon={<Plus />} onClick={startListingCreation}>Tạo Listing</Button>}
            </div>
          </header>

          <main className="workspace" id="main-workspace">
            <header className="page-header">
              <div><span className="mobile-brand">HouseNow MLS</span><h1>{title}</h1><p>{subtitle}</p></div>
              <div className="prototype-label"><ShieldCheck weight="fill" /><span><strong>Môi trường khám phá</strong>Dữ liệu mô phỏng · thao tác được giữ trong phiên</span></div>
            </header>

            {connectionState === 'loading' && <div className="connection-banner connection-loading"><SpinnerGap className="spinner" /><span>Đang mở workspace và kiểm tra quyền truy cập...</span></div>}
            {connectionState === 'offline' && <div className="connection-banner connection-error"><Warning weight="fill" /><span><strong>Đang dùng dữ liệu dự phòng.</strong>{connectionError}. Hãy chạy `npm run dev:full` để bật persistence và backend authorization.</span></div>}

            {page === 'overview' && (actorExperiencesByMarket[marketId][roleId]
              ? <ActorOverview role={role} experience={actorExperiencesByMarket[marketId][roleId]} onNavigate={navigate} onOpenFlow={openFlow} />
              : <Dashboard roleId={roleId} role={role} listings={scopedListings} activityItems={activityFeedsByMarket[marketId]} marketLabel={market.label} onNavigate={navigate} onSearch={performSearch} setQuery={setQuery} onSelect={selectProperty} onOpenFlow={openFlow} />)}
            {page === 'discover' && <Discovery query={query} setQuery={setQuery} type={type} setType={setType} propertyTypes={propertyTypes} filtered={filtered} selected={selected} selectedId={selectedId} isSearching={isSearching} onSearch={performSearch} onSelect={selectProperty} roleId={roleId} mobileDetailOpen={mobileDetailOpen} onCloseDetail={() => setMobileDetailOpen(false)} onCreate={() => setComposerOpen(true)} onTransition={setTransitionTarget} onOpenFlow={openFlow} onOpenCma={() => navigate('analytics')} />}
            {page === 'listings' && <ListingsWorkspace listings={scopedListings} roleId={roleId} onSelect={(id) => { setSelectedId(id); navigate('discover') }} onCreate={startListingCreation} onReview={() => navigate('quality')} />}
            {page === 'quality' && <QualityQueue roleId={roleId} issues={scopedIssues} onOpenFlow={openFlow} />}
            {['projects', 'finance', 'oversight', 'shortlist'].includes(page) && <ExplorationActorWorkspace experience={actorExperiencesByMarket[marketId][roleId]} roleId={roleId} onOpenFlow={openFlow} />}
            {page === 'contacts' && <ContactsWorkspace key={marketId} marketId={marketId} onOpenFlow={openFlow} />}
            {page === 'analytics' && <CmaWorkspace listings={scopedListings} onSelectProperty={(id) => { setSelectedId(id); navigate('discover') }} />}
            {page === 'organization' && <OrganizationWorkspace onOpenFlow={openFlow} />}
            {page === 'apps' && <AppsWorkspace onNavigate={navigate} onOpenFlow={openFlow} />}
          </main>
        </div>

        {isComposerOpen && selected && <ListingComposer property={selected} onClose={() => setComposerOpen(false)} onSubmit={createListing} />}
        {transitionTarget && <StatusTransitionDialog property={transitionTarget} onClose={() => setTransitionTarget(null)} onSubmit={transitionListing} />}
        {flow && <FlowDialog flow={flow} onClose={() => setFlow(null)} onComplete={completeFlow} />}
        {toast && <div className="toast" role="status"><CheckCircle weight="fill" />{toast}</div>}
      </div>
    </FluentProvider>
  )
}

function ActorOverview({ role, experience, onNavigate, onOpenFlow }) {
  const primaryPage = { developer: 'projects', bank: 'finance', regulator: 'oversight', buyer: 'shortlist' }[role.id]
  return <div className="actor-overview">
    <section className="actor-hero">
      <div><span className="section-kicker">{experience.kicker}</span><h2>{experience.title}</h2><p>{experience.description}</p></div>
      <div className="actor-context"><ShieldCheck weight="fill" /><span><strong>{role.label}</strong>{role.layer} · {role.organization}</span></div>
    </section>
    <section className="actor-metrics" aria-label={`Chỉ số cho ${role.label}`}>{experience.metrics.map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section>
    <section className="work-panel actor-queue"><div className="panel-heading"><div><h2>{experience.queueTitle}</h2><p>Dữ liệu và hành động được chiếu theo phạm vi actor hiện tại.</p></div><button onClick={() => onNavigate(primaryPage)}>Mở workspace</button></div><ExplorationActorTable rows={experience.rows} roleId={role.id} onOpenFlow={onOpenFlow} /></section>
    <div className="governance-note"><LockKey weight="fill" /><span><strong>Giới hạn dữ liệu theo purpose</strong>{experience.note}</span></div>
  </div>
}

function Dashboard({ roleId, role, listings, activityItems, marketLabel, onNavigate, onSearch, setQuery, onSelect, onOpenFlow }) {
  const activeCount = listings.filter((item) => item.currentListing?.status === 'Active').length
  const incomingCount = listings.filter((item) => item.currentListing?.status === 'Incoming').length
  const brokerView = roleId === 'broker' || roleId === 'steward'
  const tasks = marketLabel === 'Hà Nội'
    ? brokerView
      ? [
        { title: 'Đối chiếu diện tích hiện trạng', meta: 'HN-PROP-100107', priority: 'Quá hạn 2 giờ', icon: Database },
        { title: 'Xác minh phụ lục phân phối', meta: 'HN-LST-2026-10105', priority: 'Cần xử lý hôm nay', icon: FileMagnifyingGlass },
        { title: 'Duyệt điều chỉnh giá', meta: 'HN-LST-2026-10101', priority: 'Còn 5 giờ SLA', icon: TrendDown },
      ]
      : [
        { title: 'Bổ sung phụ lục ủy quyền', meta: 'HN-LST-2026-10105', priority: 'Cần xử lý hôm nay', icon: FileText },
        { title: 'Lịch xem Vinhomes Metropolis', meta: 'Ba Đình, 18:00', priority: 'Sau 4 giờ', icon: CalendarCheck },
        { title: 'Review comparable Tây Hồ', meta: 'D’. Le Roi Soleil', priority: 'Còn 1 ngày', icon: ChartLineUp },
      ]
    : brokerView
    ? [
      { title: 'Xác minh quyền đại diện', meta: 'HN-LST-2026-00904', priority: 'Cần xử lý hôm nay', icon: FileMagnifyingGlass },
      { title: 'Đối chiếu Property candidate', meta: 'Bình Trưng Đông, TP. Thủ Đức', priority: 'Quá hạn 4 giờ', icon: Database },
      { title: 'Duyệt thay đổi giá', meta: 'HN-LST-2026-00831', priority: 'Còn 6 giờ SLA', icon: TrendDown },
    ]
    : [
      { title: 'Bổ sung tài liệu đại diện', meta: 'HN-LST-2026-00904', priority: 'Cần xử lý hôm nay', icon: FileText },
      { title: 'Lịch xem với Trần Thảo Vy', meta: 'The Metropole, 17:30', priority: 'Sau 3 giờ', icon: CalendarCheck },
      { title: 'Cập nhật feedback khách mua', meta: 'Midtown M5-12.02', priority: 'Còn 1 ngày', icon: UsersThree },
    ]

  return (
    <div className="dashboard-grid">
      <section className="command-panel">
        <div><span className="section-kicker">Chào {role.label}</span><h2>Bắt đầu từ dữ liệu đã có</h2><p>Tìm Property trước khi tạo Listing để giữ đúng định danh, lịch sử và nguồn dữ liệu.</p></div>
        <form onSubmit={onSearch} className="command-search"><MagnifyingGlass /><input aria-label="Tìm nhanh" placeholder="Nhập địa chỉ, Property ID hoặc Listing ID" onChange={(event) => setQuery(event.target.value)} /><button type="submit">Tìm dữ liệu <ArrowRight /></button></form>
      </section>

      <section className="metric-strip" aria-label="Chỉ số vận hành">
        <article><span>Listing đang Active</span><strong>{activeCount}</strong><small><TrendUp /> Trong phạm vi của bạn</small></article>
        <article><span>Hồ sơ Incoming</span><strong>{incomingCount}</strong><small><Clock /> Chờ hoàn thiện hoặc duyệt</small></article>
        <article><span>Việc cần xử lý</span><strong>{brokerView ? 7 : 4}</strong><small><Warning /> 2 việc gần SLA</small></article>
        <article><span>Lịch xem hôm nay</span><strong>3</strong><small><CalendarCheck /> Lịch gần nhất 17:30</small></article>
      </section>

      <section className="work-panel task-panel">
        <div className="panel-heading"><div><h2>Việc cần xử lý</h2><p>Sắp xếp theo tác động và SLA.</p></div><button onClick={() => onNavigate(brokerView ? 'quality' : 'listings')}>Xem tất cả</button></div>
        <div className="task-list">
          {tasks.map((task) => { const Icon = task.icon; return <button key={task.title} onClick={() => onOpenFlow({ type: 'record', title: task.title, eyebrow: 'Công việc ưu tiên', data: [task.meta, task.priority, role.label, marketLabel, 'Cập nhật next step'], success: 'Đã cập nhật công việc và ghi nhận next step.' })}><span className="task-icon"><Icon /></span><span><strong>{task.title}</strong><small>{task.meta}</small></span><em>{task.priority}</em><ArrowRight /></button> })}
        </div>
      </section>

      <section className="work-panel market-panel">
        <div className="panel-heading"><div><h2>Market watch</h2><p>{marketLabel}, 30 ngày gần nhất.</p></div><button onClick={() => onNavigate('analytics')}>Phân tích</button></div>
        <div className="market-chart" aria-label="Biểu đồ giá trung vị mô phỏng"><div className="chart-label"><strong>{marketLabel === 'Hà Nội' ? '96,8 triệu/m²' : '112,4 triệu/m²'}</strong><span><TrendUp /> {marketLabel === 'Hà Nội' ? '2,1%' : '2,8%'} so với kỳ trước</span></div><svg viewBox="0 0 560 130" role="img" aria-label="Xu hướng giá tăng nhẹ"><path className="chart-area" d="M0 112 C72 105 84 72 150 79 S230 98 292 65 S382 43 424 55 S492 29 560 18 L560 130 L0 130 Z" /><path className="chart-line" d="M0 112 C72 105 84 72 150 79 S230 98 292 65 S382 43 424 55 S492 29 560 18" /></svg><div className="chart-axis"><span>15/07</span><span>22/07</span><span>29/07</span><span>05/08</span><span>12/08</span></div></div>
      </section>

      <section className="work-panel hot-panel">
        <div className="panel-heading"><div><h2>Hot sheets</h2><p>Biến động mới nhất từ listing lifecycle.</p></div><button onClick={() => onNavigate('discover')}>Xem dữ liệu</button></div>
        <div className="hot-grid">{activityItems.map((event) => <button key={event.id} onClick={() => { setQuery(event.area.includes('Toàn') ? '' : event.area); onSearch() }}><span>{event.label}</span><strong>{event.count}</strong><small>{event.area}</small><em>{event.change}</em></button>)}</div>
      </section>

      <section className="work-panel recent-panel">
        <div className="panel-heading"><div><h2>Listing gần đây</h2><p>Property và Listing được trình bày tách biệt.</p></div><button onClick={() => onNavigate('discover')}>Mở discovery</button></div>
        <div className="compact-table">
          <div className="compact-table-head"><span>Property</span><span>Listing</span><span>Trạng thái</span><span>Giá chào</span><span>Cập nhật</span></div>
          {listings.slice(0, 6).map((property) => <button className="compact-table-row" key={property.id} onClick={() => { onSelect(property.id); onNavigate('discover') }}><span><img src={property.image} alt="" /><span><strong>{property.title}</strong><small>{property.id}</small></span></span><code>{property.currentListing?.id ?? 'Chưa có'}</code><span>{property.currentListing ? <StatusBadge status={property.currentListing.status} /> : <span className="status-badge status-neutral">Không có</span>}</span><strong>{property.currentListing?.priceLabel ?? 'Chưa thiết lập'}</strong><small>{property.sourceUpdatedAt}</small></button>)}
        </div>
      </section>
    </div>
  )
}

function Discovery({ query, setQuery, type, setType, propertyTypes, filtered, selected, selectedId, isSearching, onSearch, onSelect, roleId, mobileDetailOpen, onCloseDetail, onCreate, onTransition, onOpenFlow, onOpenCma }) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [verification, setVerification] = useState('Tất cả')
  const [listingStatus, setListingStatus] = useState('Tất cả')
  const [minQuality, setMinQuality] = useState(0)
  const [sort, setSort] = useState('match')
  const [view, setView] = useState('list')
  const displayed = useMemo(() => {
    const rows = filtered.filter((property) => (verification === 'Tất cả' || property.verification === verification) && (listingStatus === 'Tất cả' || (listingStatus === 'Chưa có Listing' ? !property.currentListing : property.currentListing?.status === listingStatus)) && property.qualityScore >= Number(minQuality))
    return [...rows].sort((a, b) => sort === 'quality' ? b.qualityScore - a.qualityScore : sort === 'price-low' ? (a.currentListing?.price ?? Number.MAX_SAFE_INTEGER) - (b.currentListing?.price ?? Number.MAX_SAFE_INTEGER) : sort === 'updated' ? b.sourceUpdatedAt.localeCompare(a.sourceUpdatedAt) : (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0))
  }, [filtered, verification, listingStatus, minQuality, sort, selectedId])
  const clearAdvanced = () => { setVerification('Tất cả'); setListingStatus('Tất cả'); setMinQuality(0) }
  return (
    <div className="discovery-layout">
      <section className="search-toolbar">
        <form onSubmit={onSearch}><MagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Tìm Property" placeholder="Địa chỉ, Property ID, Parcel ID, Listing ID hoặc dự án" />{query && <button type="button" className="clear-button" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm"><X /></button>}<Button appearance="primary" type="submit">Tìm kiếm</Button></form>
        <div className="filter-row"><SlidersHorizontal />{propertyTypes.map((item) => <button key={item} className={type === item ? 'filter-chip filter-chip-active' : 'filter-chip'} aria-pressed={type === item} onClick={() => setType(item)}>{item}</button>)}<button className={advancedOpen || verification !== 'Tất cả' || listingStatus !== 'Tất cả' || minQuality > 0 ? 'filter-chip filter-chip-active' : 'filter-chip'} aria-expanded={advancedOpen} onClick={() => setAdvancedOpen((current) => !current)}><Funnel /> Bộ lọc nâng cao</button><span className="view-switch"><button className={view === 'list' ? 'view-active' : ''} aria-label="Xem dạng danh sách" aria-pressed={view === 'list'} onClick={() => setView('list')}><ListBullets /></button><button className={view === 'map' ? 'view-active' : ''} aria-label="Xem dạng bản đồ" aria-pressed={view === 'map'} onClick={() => setView('map')}><MapPin /></button></span></div>
        {advancedOpen && <div className="advanced-filter-panel"><label><span>Xác minh</span><select value={verification} onChange={(event) => setVerification(event.target.value)}><option>Tất cả</option><option>Đã xác minh</option><option>Đã đối chiếu</option><option>Đang xác minh</option><option>Cần bổ sung nguồn</option></select></label><label><span>Trạng thái Listing</span><select value={listingStatus} onChange={(event) => setListingStatus(event.target.value)}><option>Tất cả</option><option>Active</option><option>Incoming</option><option>Needs correction</option><option>Closed</option><option>Chưa có Listing</option></select></label><label><span>Quality score tối thiểu</span><select value={minQuality} onChange={(event) => setMinQuality(event.target.value)}><option value="0">Không giới hạn</option><option value="70">70+</option><option value="85">85+</option><option value="95">95+</option></select></label><button onClick={clearAdvanced}>Xóa bộ lọc</button></div>}
      </section>
      <section className="content-grid">
        <div className="results-panel">
          <div className="section-heading"><div><strong>{isSearching ? 'Đang đối chiếu dữ liệu' : `${displayed.length} Property phù hợp`}</strong><span>{view === 'map' ? 'Chọn pin để mở Property 360' : 'Ưu tiên mức độ khớp, nguồn và trạng thái xác minh'}</span></div><label className="sort-select"><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="match">Phù hợp nhất</option><option value="updated">Mới cập nhật</option><option value="quality">Quality cao nhất</option><option value="price-low">Giá thấp nhất</option></select><CaretDown /></label></div>
          {isSearching ? <LoadingState /> : displayed.length === 0 ? <EmptyState onClear={() => { setQuery(''); setType('Tất cả'); clearAdvanced() }} /> : view === 'list' ? <div className="results-list">{displayed.map((property) => <PropertyRow key={property.id} property={property} selected={selectedId === property.id} onClick={() => onSelect(property.id)} />)}</div> : <PropertyMap properties={displayed} selectedId={selectedId} onSelect={onSelect} />}
        </div>
        {selected && <DetailPanel property={selected} roleId={roleId} mobileOpen={mobileDetailOpen} onClose={onCloseDetail} onCreate={onCreate} onTransition={onTransition} onOpenFlow={onOpenFlow} onOpenCma={onOpenCma} />}
      </section>
    </div>
  )
}

function PropertyMap({ properties, selectedId, onSelect }) {
  return <div className="property-map"><div className="map-roads"><span /><span /><span /><span /></div>{properties.map((property, index) => <button key={property.id} className={selectedId === property.id ? 'map-pin selected' : 'map-pin'} style={{ left: `${12 + ((index * 23) % 76)}%`, top: `${14 + ((index * 31) % 67)}%` }} onClick={() => onSelect(property.id)} aria-label={`Mở ${property.title}`}><MapPin weight="fill" /><span>{property.currentListing?.priceLabel ?? property.type}</span></button>)}<div className="map-legend"><span><i />{properties.length} Property</span><small>Dữ liệu vị trí mô phỏng theo khu vực</small></div></div>
}

function PropertyRow({ property, selected, onClick }) {
  return <button className={selected ? 'property-row property-row-selected' : 'property-row'} onClick={onClick}><img src={property.image} alt="" /><span className="property-row-main"><span className="property-row-top"><VerificationBadge value={property.verification} />{property.currentListing ? <StatusBadge status={property.currentListing.status} /> : <span className="status-badge status-neutral">Chưa có Listing</span>}</span><strong>{property.title}</strong><span className="address"><MapPin weight="fill" />{property.address}</span><span className="property-facts"><span>{property.area} m²</span><span>{property.bedrooms} PN</span><span>{property.bathrooms} WC</span><span>{property.type}</span></span></span><span className="property-row-meta"><strong>{property.currentListing?.priceLabel ?? 'Chưa có giá chào'}</strong><small>{property.id}</small><ArrowRight /></span></button>
}

function DetailPanel({ property, roleId, mobileOpen, onClose, onCreate, onTransition, onOpenFlow, onOpenCma }) {
  const [tab, setTab] = useState('Tổng quan')
  const transitions = property.allowedTransitions ?? []
  const audience = {
    agent: ['Member projection', 'Private remarks chỉ hiện với listing được assignment'],
    broker: ['Brokerage projection', 'Chi tiết trong phạm vi sàn và audit đầy đủ'],
    developer: ['Own-inventory projection', 'Ẩn private remarks và dữ liệu ngoài assignment'],
    bank: ['Consent-based projection', 'Chỉ dữ liệu cần cho purpose tài chính'],
    regulator: ['Authority projection', 'Audit được lưu; private remarks bị ẩn'],
    buyer: ['Public projection', 'Chỉ Active Listing và public fields'],
    steward: ['Steward projection', 'Nguồn, audit và quality evidence đầy đủ'],
  }[roleId]
  const canCreate = ['agent', 'broker', 'steward'].includes(roleId)
  return <aside className={`detail-panel ${mobileOpen ? 'detail-panel-mobile-open' : ''}`}><div className="detail-mobile-header"><button onClick={onClose}><ArrowLeft /> Quay lại kết quả</button></div><div className="detail-hero"><img src={property.image} alt={`Hình minh họa ${property.title}`} /><div className="detail-overlay"><VerificationBadge value={property.verification} />{property.currentListing && <StatusBadge status={property.currentListing.status} />}</div></div><div className="detail-content"><div className="audience-context"><Eye /><span><strong>{audience[0]}</strong>{audience[1]}</span></div><h2>{property.title}</h2><p className="detail-address"><MapPin weight="fill" />{property.address}</p><div className="identity-strip"><div><span>Property ID</span><strong>{property.id}</strong></div><div><span>Parcel tham chiếu</span><strong>{property.parcelId}</strong></div></div><div className="tabs" role="tablist">{['Tổng quan', 'Giá & lịch sử', 'Thị trường', 'Nguồn'].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? 'tab-active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>{tab === 'Tổng quan' && <OverviewTab property={property} />}{tab === 'Giá & lịch sử' && <HistoryTab property={property} />}{tab === 'Thị trường' && <MarketTab property={property} onOpenCma={onOpenCma} />}{tab === 'Nguồn' && <SourceTab property={property} />}</div><div className="detail-actionbar"><Button appearance="subtle" icon={<Warning />} onClick={() => onOpenFlow({ type: 'report', title: `Báo sai · ${property.id}`, eyebrow: 'Data quality feedback', success: 'Đã tạo quality issue và giữ snapshot dữ liệu hiện tại.' })}>Báo sai</Button>{roleId === 'buyer' && <Button appearance="secondary" icon={<CalendarCheck />} onClick={() => onOpenFlow({ type: 'showing', title: `Đặt lịch · ${property.title}`, eyebrow: 'Showing Desk', success: 'Đã xác nhận lịch và gửi thông báo cho môi giới phụ trách.' })}>Đặt lịch xem</Button>}{property.currentListing && transitions.length > 0 && <Button appearance="primary" icon={<ArrowRight />} onClick={() => onTransition(property)}>Đổi trạng thái</Button>}{!property.currentListing && canCreate && <Button appearance="primary" icon={<Plus />} onClick={onCreate}>Tạo Listing</Button>}</div></aside>
}

function OverviewTab({ property }) {
  const listing = property.currentListing
  const intelligence = property.intelligence
  return <div className="tab-content"><dl className="facts-grid"><div><dt>Loại tài sản</dt><dd>{property.type}</dd></div><div><dt>Diện tích</dt><dd>{property.area} m²</dd></div><div><dt>Phòng ngủ</dt><dd>{property.bedrooms}</dd></div><div><dt>Phòng tắm</dt><dd>{property.bathrooms}</dd></div><div><dt>Hướng</dt><dd>{property.orientation}</dd></div><div><dt>Unit</dt><dd>{property.unit ?? 'Không áp dụng'}</dd></div></dl>{intelligence && <div className="intelligence-strip"><div><span>Giá gốc</span><strong>{intelligence.priceSummary.originalPriceLabel ?? 'Chưa có'}</strong></div><div><span>Thay đổi</span><strong className={intelligence.priceSummary.changePercent < 0 ? 'negative' : ''}>{intelligence.priceSummary.changePercent != null ? `${intelligence.priceSummary.changePercent}%` : 'Chưa có'}</strong></div><div><span>CDOM</span><strong>{intelligence.cumulativeDaysOnMarket} ngày</strong></div><div><span>Relist</span><strong>{intelligence.relistCount}</strong></div></div>}{listing ? <section className="listing-summary"><div className="summary-title"><div><span>Listing hiện tại</span><strong>{listing.id}</strong></div><FileText /></div><div className="price-row"><strong>{listing.priceLabel}</strong><span>{listing.pricePerArea}</span></div><div className="listing-meta"><span>Đăng {listing.listedAt}</span><span>Hết hạn {listing.expiresAt}</span><span>{listing.daysOnMarket} DOM</span></div><p>{listing.publicRemarks}</p>{listing.agent && <div className="member-note"><UsersThree /><span>{listing.agent} · {listing.brokerage} · {listing.agreement}</span></div>}{listing.privateRemarks && <div className="restricted-note"><LockKey weight="fill" /><div><strong>Ghi chú hạn chế</strong><span>{listing.privateRemarks}</span></div></div>}</section> : <section className="no-active-listing"><CheckCircle weight="fill" /><div><strong>Không có Listing đang hoạt động</strong><span>Property vẫn giữ lịch sử giao dịch và nguồn dữ liệu riêng.</span></div></section>}<section className="media-summary"><div><img src={property.image} alt="" /><img src={`https://picsum.photos/seed/${property.id}-interior/400/300`} alt="" /><img src={`https://picsum.photos/seed/${property.id}-view/400/300`} alt="" /></div><span><FileText /> 8 ảnh · 3 tài liệu · 2 bằng chứng đã đối chiếu</span></section></div>
}

function HistoryTab({ property }) {
  const priceEvents = property.intelligence?.priceEvents ?? []
  return <div className="tab-content">{priceEvents.length > 0 && <><h3>Biến động giá chào</h3><div className="price-timeline">{priceEvents.map((event) => <div key={event.key}><span className="price-node"><TrendDown /></span><div><strong>{event.fromPrice ? `${money(event.fromPrice)} → ` : ''}{money(event.toPrice)}</strong><span>{event.effectiveAt} · {event.reason}</span><small>{event.source} · {event.confidence}</small></div></div>)}</div></>}<h3>Lịch sử Listing & closing</h3><div className="history-list">{property.history.map((item) => <div className="history-item history-item-rich" key={item.listingId}><ClockCounterClockwise /><div><strong>{item.listingId}</strong><span>{item.type}, {item.period} · {item.daysOnMarket ?? 0} DOM</span>{item.closingRecord && <small>Đóng {item.closingRecord.closePriceLabel} · {item.closingRecord.closeDate} · {item.closingRecord.verification}</small>}</div><div><StatusBadge status={item.status} /><span>{item.price}</span></div></div>)}</div>{property.audit?.length > 0 && <><h3>Audit timeline</h3><div className="audit-list">{property.audit.map((event) => <div className="audit-event" key={event.id}><span className="audit-node" /><div><strong>{event.action}</strong><span>{event.actor}, {event.role}</span><small>{event.time}, {event.reason}</small></div></div>)}</div></>}</div>
}

function MarketTab({ property, onOpenCma }) {
  const snapshot = property.intelligence?.marketSnapshot
  if (!snapshot) return <div className="tab-content"><div className="evidence-note"><Database /><p>Chưa có market snapshot cho Property này.</p></div></div>
  return <div className="tab-content market-content"><div className="market-scope"><ChartLineUp /><div><span>Comparable candidate set</span><strong>{snapshot.scope}</strong><small>Cập nhật {snapshot.asOf}</small></div></div><div className="market-range"><span><small>Thấp</small><strong>{snapshot.lowPricePerArea}</strong></span><span><small>Trung vị</small><strong>{snapshot.medianPricePerArea}</strong></span><span><small>Cao</small><strong>{snapshot.highPricePerArea}</strong></span></div><dl className="source-list"><div><dt>Số candidate</dt><dd>{snapshot.comparableCount} Property</dd></div><div><dt>DOM trung vị</dt><dd>{snapshot.medianDaysOnMarket} ngày</dd></div></dl><div className="evidence-note"><Warning /><p><strong>Cần human review</strong><br />{snapshot.methodology}</p></div><Button appearance="primary" icon={<ChartLineUp />} onClick={onOpenCma}>Mở CMA candidate</Button></div>
}

function SourceTab({ property }) {
  const events = property.intelligence?.sourceEvents ?? []
  return <div className="tab-content source-content"><div className="source-score"><ShieldCheck weight="fill" /><div><span>Độ tin cậy định danh</span><strong>{property.confidence}</strong></div></div><dl className="source-list"><div><dt>Nguồn hiện tại</dt><dd>{property.source}</dd></div><div><dt>Cập nhật gần nhất</dt><dd>{property.sourceUpdatedAt}</dd></div><div><dt>Quy tắc chỉnh sửa</dt><dd>Override cần lý do và audit event</dd></div></dl>{events.length > 0 && <div className="source-events">{events.map((event) => <div key={event.key}><Database /><span><strong>{event.type}</strong>{event.summary}<small>{event.effectiveAt} · {event.source} · {event.confidence}</small></span></div>)}</div>}<div className="evidence-note"><Database /><p><strong>Phạm vi dữ liệu demo</strong><br />Nguồn mô phỏng giúp review UX; chưa phải dữ liệu địa chính hoặc chủ đầu tư chính thức.</p></div></div>
}

function money(value) {
  return value >= 1_000_000_000 ? `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1_000_000_000)} tỷ` : `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1_000_000)} triệu`
}

function ListingsWorkspace({ listings, roleId, onSelect, onCreate, onReview }) {
  const [status, setStatus] = useState('Tất cả')
  const rows = listings.filter((item) => status === 'Tất cả' || item.currentListing?.status === status)
  const canCreate = ['agent', 'broker', 'steward'].includes(roleId)
  return <section className="listing-workspace work-panel"><div className="workspace-toolbar"><div className="listing-tabs">{['Tất cả', 'Active', 'Incoming', 'Needs correction', 'Closed'].map((item) => <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}</button>)}</div>{canCreate && <Button appearance="primary" icon={<Plus />} onClick={onCreate}>Tạo Listing</Button>}</div><div className="listing-table"><div className="listing-table-head"><span>Property và Listing</span><span>Trạng thái</span><span>Chất lượng</span><span>Phân phối</span><span>Hết hạn</span><span></span></div>{rows.length ? rows.map((property) => <button className="listing-table-row" key={property.id} onClick={() => onSelect(property.id)}><span className="listing-identity"><img src={property.image} alt="" /><span><strong>{property.title}</strong><small>{property.currentListing?.id ?? 'Chưa có Listing'} | {property.id}</small></span></span><span>{property.currentListing ? <StatusBadge status={property.currentListing.status} /> : <span className="status-badge status-neutral">Chưa tạo</span>}</span><span className="quality-score"><strong>{property.qualityScore}%</strong><small>{property.verification}</small></span><span className="distribution-state">{property.currentListing?.distributionChannels ? <><CheckCircle weight="fill" /> {property.currentListing.distributionChannels} kênh</> : <><Clock /> Chưa phát hành</>}</span><span><strong>{property.currentListing?.expiresAt ?? 'Không áp dụng'}</strong><small>{property.currentListing ? `${property.currentListing.daysOnMarket} ngày trên thị trường` : 'Sẵn sàng tạo mới'}</small></span><ArrowRight /></button>) : <div className="table-empty"><FileMagnifyingGlass /><strong>Không có Listing trong trạng thái này</strong><span>Chọn trạng thái khác hoặc tạo Listing mới.</span></div>}</div>{['broker', 'steward'].includes(roleId) && <div className="review-banner"><ShieldCheck weight="fill" /><div><strong>Bạn đang ở góc nhìn kiểm duyệt</strong><span>Thao tác duyệt, request changes và override luôn yêu cầu lý do audit.</span></div><Button appearance="secondary" onClick={onReview}>Mở hàng đợi</Button></div>}</section>
}

function QualityQueue({ roleId, issues, onOpenFlow }) {
  const [level, setLevel] = useState('Tất cả')
  if (!['broker', 'regulator', 'steward'].includes(roleId)) return <PermissionState />
  const visible = level === 'Tất cả' ? issues : issues.filter((issue) => issue.type === level)
  const blockingCount = issues.filter((issue) => issue.type === 'Blocking').length
  const overdueCount = issues.filter((issue) => issue.due.includes('Quá hạn')).length
  return <section className="quality-layout"><div className="quality-summary"><article><Database /><span><strong>{issues.length}</strong>Issue đang mở</span></article><article><Warning /><span><strong>{blockingCount}</strong>Blocking issue</span></article><article><Clock /><span><strong>{overdueCount}</strong>Issue quá SLA</span></article></div><div className="work-panel"><div className="panel-heading"><div><h2>Hàng đợi cần xử lý</h2><p>Không tự động merge hoặc xóa lịch sử.</p></div><label className="compact-filter"><Funnel /><select value={level} onChange={(event) => setLevel(event.target.value)}><option>Tất cả</option>{[...new Set(issues.map((issue) => issue.type))].map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="issue-table"><div className="issue-head"><span>Issue</span><span>Record</span><span>Loại</span><span>Người phụ trách</span><span>SLA</span><span></span></div>{visible.map((issue) => <button className="issue-row" key={issue.code} onClick={() => onOpenFlow({ type: 'issue', title: `Xử lý ${issue.code}`, eyebrow: 'Quality Queue', issue, success: 'Đã lưu kết luận; issue được cập nhật trong hàng đợi.' })}><span><small>{issue.code}</small><strong>{issue.title}</strong></span><code>{issue.record}</code><span className={`issue-type issue-${issue.level}`}>{issue.type}</span><span>{issue.owner}</span><span className={issue.due.includes('Quá hạn') ? 'overdue' : ''}>{issue.due}</span><ArrowRight /></button>)}</div></div></section>
}

function StatusTransitionDialog({ property, onClose, onSubmit }) {
  const transitions = property.allowedTransitions ?? []
  const [to, setTo] = useState(transitions[0] ?? '')
  const [reason, setReason] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('2026-08-13')
  const [closePrice, setClosePrice] = useState(property.currentListing.price ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!reason.trim()) { setError('Nhập lý do để tạo audit event.'); return }
    setSaving(true)
    setError('')
    try {
      await onSubmit({ to, reason, effectiveDate, ...(to === 'Closed' ? { closePrice } : {}) })
    } catch (submitError) {
      setError(submitError.message)
      setSaving(false)
    }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="transition-dialog" role="dialog" aria-modal="true" aria-labelledby="transition-title"><header className="composer-header"><div><span>Listing lifecycle</span><h2 id="transition-title">Đổi trạng thái</h2></div><button onClick={onClose} aria-label="Đóng"><X /></button></header><div className="transition-body"><div className="transition-route"><span><small>Hiện tại</small><StatusBadge status={property.currentListing.status} /></span><ArrowRight /><span><small>Trạng thái tiếp theo</small><StatusBadge status={to} /></span></div><div className="field"><label htmlFor="next-status">Trạng thái được phép</label><select id="next-status" value={to} onChange={(event) => setTo(event.target.value)}>{transitions.map((status) => <option key={status}>{status}</option>)}</select></div><div className="field"><label htmlFor="effective-date">Ngày hiệu lực</label><input id="effective-date" type="date" value={effectiveDate} onChange={(event) => setEffectiveDate(event.target.value)} /></div>{to === 'Closed' && <div className="field"><label htmlFor="close-price">Giá đóng giao dịch</label><div className="input-with-suffix"><input id="close-price" type="number" value={closePrice} onChange={(event) => setClosePrice(event.target.value)} /><span>VND</span></div></div>}<div className="field"><label htmlFor="transition-reason">Lý do và căn cứ</label><textarea id="transition-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Thông tin này được lưu trong audit timeline" /></div><div className="transition-impact"><Database /><span><strong>Tác động của thay đổi</strong>Search, distribution và báo cáo sẽ nhận trạng thái mới. Lịch sử cũ không bị ghi đè.</span></div>{error && <div className="submit-error"><Warning weight="fill" />{error}</div>}</div><footer className="composer-footer"><Button appearance="secondary" onClick={onClose}>Hủy</Button><Button appearance="primary" disabled={saving || !to} onClick={submit}>{saving ? 'Đang cập nhật...' : `Chuyển sang ${to}`} <Check /></Button></footer></section></div>
}

function ListingComposer({ property, onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ price: '', expiresAt: '', agreement: '', publicRemarks: '', privateRemarks: '', status: 'Incoming', consent: true })
  const errors = { price: !form.price || Number(form.price) < 100000000 ? 'Nhập giá chào hợp lệ từ 100 triệu đồng.' : '', expiresAt: !form.expiresAt ? 'Chọn ngày hết hiệu lực.' : '', agreement: !form.agreement ? 'Chọn căn cứ đại diện.' : '', publicRemarks: form.status === 'Active' && form.publicRemarks.trim().length < 20 ? 'Active cần mô tả công khai tối thiểu 20 ký tự.' : '' }
  const isValid = !Object.values(errors).some(Boolean)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const next = () => { if (step === 2) { setAttempted(true); if (!isValid) return } setAttempted(false); setStep((current) => Math.min(3, current + 1)) }
  const submit = async () => { setSaving(true); setSubmitError(''); try { await onSubmit(form) } catch (error) { setSubmitError(error.message); setSaving(false) } }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title"><header className="composer-header"><div><span>Tạo từ Property hiện hữu</span><h2 id="composer-title">Listing mới</h2></div><button onClick={onClose} aria-label="Đóng"><X /></button></header><div className="stepper">{['Xác nhận Property', 'Quyền đại diện và chi tiết', 'Phân phối và submit'].map((label, index) => <div className={step >= index + 1 ? 'step step-current' : 'step'} key={label}><span>{step > index + 1 ? <Check weight="bold" /> : index + 1}</span><strong>{label}</strong></div>)}</div><div className="composer-body">{step === 1 && <div className="composer-step"><div className="selected-source"><img src={property.image} alt="" /><div><VerificationBadge value={property.verification} /><h3>{property.title}</h3><p>{property.address}</p></div></div>{property.currentListing ? <div className="conflict-warning"><Warning weight="fill" /><div><strong>Đã có Listing hiện tại</strong><span>{property.currentListing.id} đang ở trạng thái {property.currentListing.status}. Không thể tạo Active Listing trùng mà không có review.</span></div></div> : <div className="identity-confirm"><CheckCircle weight="fill" /><div><strong>Giữ nguyên canonical Property ID</strong><span>Listing mới có ID và vòng đời riêng. Lịch sử không bị ghi đè.</span><code>{property.id}</code></div></div>}</div>}{step === 2 && <div className="composer-step form-grid"><div className="field"><label htmlFor="price">Giá chào</label><div className="input-with-suffix"><input id="price" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="12800000000" /><span>VND</span></div>{attempted && errors.price && <small className="field-error">{errors.price}</small>}</div><div className="field"><label htmlFor="expires">Ngày hết hiệu lực</label><input id="expires" type="date" value={form.expiresAt} onChange={(e) => update('expiresAt', e.target.value)} />{attempted && errors.expiresAt && <small className="field-error">{errors.expiresAt}</small>}</div><div className="field field-wide"><label htmlFor="agreement">Căn cứ đại diện</label><select id="agreement" value={form.agreement} onChange={(e) => update('agreement', e.target.value)}><option value="">Chọn loại đại diện</option><option>Đại diện độc quyền</option><option>Đại diện không độc quyền</option><option>Phân phối theo ủy quyền</option></select>{attempted && errors.agreement && <small className="field-error">{errors.agreement}</small>}</div><div className="field field-wide"><label htmlFor="publicRemarks">Mô tả công khai</label><textarea id="publicRemarks" value={form.publicRemarks} onChange={(e) => update('publicRemarks', e.target.value)} placeholder="Thông tin được phép phân phối công khai" />{attempted && errors.publicRemarks && <small className="field-error">{errors.publicRemarks}</small>}</div><div className="field field-wide"><label htmlFor="privateRemarks">Ghi chú hạn chế</label><textarea id="privateRemarks" value={form.privateRemarks} onChange={(e) => update('privateRemarks', e.target.value)} placeholder="Chỉ dành cho role có quyền" /><small>Không đưa nội dung này vào kênh công khai.</small></div></div>}{step === 3 && <div className="composer-step"><h3>Trạng thái sau khi submit</h3><div className="status-options"><button className={form.status === 'Incoming' ? 'status-option status-option-selected' : 'status-option'} onClick={() => update('status', 'Incoming')}><ClockCounterClockwise /><div><strong>Incoming</strong><span>Cấp Listing ID, giới hạn hiển thị và tiếp tục hoàn thiện.</span></div><span className="radio" /></button><button className={form.status === 'Active' ? 'status-option status-option-selected' : 'status-option'} onClick={() => update('status', 'Active')}><CheckCircle /><div><strong>Gửi duyệt Active</strong><span>Agent gửi Submitted. Broker hoặc Data Steward mới có quyền kích hoạt.</span></div><span className="radio" /></button></div><label className="consent-row"><input type="checkbox" checked={form.consent} onChange={(event) => update('consent', event.target.checked)} /><span><strong>Đã ghi nhận consent phân phối</strong><small>Cho phép Housenow Portal nhận public fields sau khi Listing được duyệt.</small></span></label><div className="validation-summary"><ShieldCheck weight="fill" /><div><strong>{isValid ? 'Dữ liệu cơ bản đã hợp lệ' : 'Còn dữ liệu cần bổ sung'}</strong><span>{isValid ? 'Listing ID mới và audit event sẽ được tạo khi submit.' : 'Quay lại bước trước để sửa blocking errors.'}</span></div></div>{submitError && <div className="submit-error"><Warning weight="fill" />{submitError}</div>}</div>}</div><footer className="composer-footer"><Button appearance="secondary" onClick={step === 1 ? onClose : () => setStep(step - 1)}>{step === 1 ? 'Hủy' : 'Quay lại'}</Button>{step < 3 ? <Button appearance="primary" onClick={next}>Tiếp tục <ArrowRight /></Button> : <Button appearance="primary" disabled={saving || !isValid || !form.consent || Boolean(property.currentListing)} onClick={submit}>{saving ? 'Đang tạo...' : `Tạo ${form.status} Listing`} <Check /></Button>}</footer></section></div>
}

function LoadingState() { return <div className="loading-state result-loading" aria-label="Đang đối chiếu các nguồn dữ liệu"><div className="result-skeleton"><span className="skeleton-image" /><span className="skeleton-lines"><i /><i /><i /></span></div><div className="result-skeleton"><span className="skeleton-image" /><span className="skeleton-lines"><i /><i /><i /></span></div><div className="result-skeleton"><span className="skeleton-image" /><span className="skeleton-lines"><i /><i /><i /></span></div><strong>Đang đối chiếu các nguồn dữ liệu</strong><span>Kiểm tra Property, Parcel và Listing hiện hữu.</span></div> }
function EmptyState({ onClear }) { return <div className="empty-state"><MagnifyingGlass /><strong>Không tìm thấy Property phù hợp</strong><span>Thử Listing ID, Parcel ID, tên dự án hoặc địa chỉ ngắn hơn.</span><Button appearance="secondary" onClick={onClear}>Xóa bộ lọc</Button></div> }
function PermissionState() { return <div className="permission-state"><LockKey /><h2>Bạn chưa có quyền truy cập</h2><p>Quality Queue yêu cầu vai trò Quản lý sàn hoặc Data Steward trong tổ chức hiện tại.</p></div> }

export default App
