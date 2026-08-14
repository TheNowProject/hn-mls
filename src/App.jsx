import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bank,
  Buildings,
  Check,
  CheckCircle,
  CirclesThreePlus,
  ClockCounterClockwise,
  Database,
  FileText,
  FlowArrow,
  Handshake,
  House,
  IdentificationCard,
  ListChecks,
  LockKey,
  MapPin,
  Phone,
  SealCheck,
  ShieldCheck,
  Signpost,
  Storefront,
  User,
  UsersThree,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import BrandMark from './components/BrandMark.jsx'
import {
  ActionButton,
  Checklist,
  EvidenceBadge,
  Field,
  FieldGrid,
  IdentifierCard,
  ProgressRail,
  RegistryTimeline,
  SimulationNotice,
  StatusPill,
} from './components/RegistryPrimitives.jsx'
import {
  DEMO_STAGES,
  PILOT_BRIEF,
  ROLE_PROJECTIONS,
  demoCases,
  externalRoles,
  marketRoles,
} from './demo/demoData.js'
import {
  ACTION_META,
  ACTIONS,
  allowedActionsFor,
  createInitialState,
  journeyReducer,
  projectStateForRole,
  restoreDemoState,
} from './demo/journey.js'

const STORAGE_KEY = 'vmls-demo:2026-08:v1'
const ALL_ACTORS = [...marketRoles, ...externalRoles]
const ACTOR_ICONS = {
  agent: IdentificationCard,
  brokerage: Storefront,
  developer: Buildings,
  buyer: User,
  seller: House,
  bank: Bank,
  vmls: Database,
  notary: SealCheck,
  land_registry: MapPin,
}

const STAGE_VIEW = {
  property_match: 'property-match',
  seller_confirmation: 'seller-confirmation',
  listing_created: 'listing-created',
  transaction_readiness: 'transaction-readiness',
  notary_dossier: 'notary-signing',
  notary_signed: 'transaction-routing',
  routed: 'transfer-result',
  land_registry_complete: 'transfer-result',
  developer_intake: 'transfer-result',
  developer_confirmed: 'transfer-result',
  contract_received: 'transfer-result',
}

const STAGE_STATUS = {
  property_match: 'Đang đối chiếu',
  seller_confirmation: 'Chờ xác nhận',
  listing_created: 'Tin bán đã khởi tạo',
  transaction_readiness: 'Chuẩn bị công chứng',
  notary_dossier: 'VPCC đang xử lý',
  notary_signed: 'Đã ký công chứng',
  routed: 'Đã xác định tuyến',
  land_registry_complete: 'Bản ghi sống đã cập nhật',
  developer_intake: 'Chủ đầu tư đã tiếp nhận',
  developer_confirmed: 'Đã xác nhận chuyển nhượng',
  contract_received: 'Bản ghi sống đã cập nhật',
}

const COMPLETE_STAGES = new Set(['land_registry_complete', 'contract_received'])

function subscribeToHash(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHash() {
  return window.location.hash || '#/gioi-thieu'
}

function navigate(path) {
  if (window.location.hash === path) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    return
  }
  window.location.hash = path
}

function parseRoute(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'ho-so' && parts[1] && parts[2] === 'vai-tro' && parts[3]) {
    return { page: 'dossier', caseId: parts[1], roleId: parts[3] }
  }
  if (parts[0] === 'ho-so') return { page: 'queue' }
  if (parts[0] === 'goc-nhin' && parts[1]) return { page: 'projection', roleId: parts[1] }
  if (parts[0] === 'pilot') return { page: 'pilot' }
  return { page: 'intro' }
}

function actorById(actorId) {
  return ALL_ACTORS.find(({ id }) => id === actorId) ?? ALL_ACTORS[0]
}

function firstNextActor(state) {
  return ALL_ACTORS.find(({ id }) => allowedActionsFor(state, id).length > 0)?.id ?? 'vmls'
}

function initialStates() {
  const clean = Object.fromEntries(demoCases.map(({ id }) => [id, createInitialState(id)]))
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (stored?.version !== 1 || typeof stored.cases !== 'object') return clean
    return Object.fromEntries(demoCases.map(({ id }) => {
      const saved = stored.cases[id]
      return [id, saved ? restoreDemoState(JSON.stringify(saved), id) : clean[id]]
    }))
  } catch {
    return clean
  }
}

function progressFor(state) {
  const progress = {
    property_match: state.flags.propertyMatched ? 10 : 2,
    seller_confirmation: state.flags.representationConfirmed ? 22 : 16,
    listing_created: 32,
    transaction_readiness: state.flags.readinessVerified ? 46 : 39,
    notary_dossier: state.supplement.status === 'required' ? 54 : 58,
    notary_signed: 67,
    routed: 76,
    developer_intake: 84,
    developer_confirmed: 92,
    contract_received: 100,
    land_registry_complete: 100,
  }
  return progress[state.stage] ?? 0
}

function stageItemsFor(state) {
  return DEMO_STAGES.filter((stage) => stage.number || stage.includeInRail).map((stage) => ({
    id: stage.id,
    short: stage.id === 'transfer-result'
      ? state.route === 'developer' ? 'B' : state.route === 'land_registry' ? 'A' : 'A/B'
      : stage.number,
    eyebrow: stage.id === 'transfer-result'
      ? state.route === 'developer' ? 'Tuyến HĐMB' : state.route === 'land_registry' ? 'Tuyến đất đai' : 'Tự động chọn tuyến'
      : `Bước ${stage.number}`,
    label: stage.label,
  }))
}

function stageViewFor(state) {
  if (state.stage === 'transaction_readiness' && state.flags.readinessVerified) {
    return 'notary-dossier'
  }
  return STAGE_VIEW[state.stage]
}

function completedStageIds(state) {
  const current = stageViewFor(state)
  const ids = stageItemsFor(state).map(({ id }) => id)
  const index = ids.indexOf(current)
  if (current === 'transaction-readiness') {
    return ids.slice(0, ids.indexOf('notary-dossier'))
  }
  return index < 0 ? [] : ids.slice(0, index)
}

function rolePath(caseId, roleId) {
  return `#/ho-so/${caseId}/vai-tro/${roleId}`
}

function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => '#/gioi-thieu')
  const route = parseRoute(hash)
  const [caseStates, setCaseStates] = useState(initialStates)
  const [announcement, setAnnouncement] = useState('')
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, cases: caseStates }))
  }, [caseStates])

  const completedCount = Object.values(caseStates).filter((state) => COMPLETE_STAGES.has(state.stage)).length
  const hasProgress = Object.values(caseStates).some(({ auditEvents }) => auditEvents.length > 0)

  function dispatch(caseId, action) {
    setAnnouncement(`${ACTION_META[action.type].label} — đã ghi vào lịch sử hồ sơ.`)
    setCaseStates((current) => {
      const previous = current[caseId]
      const next = journeyReducer(previous, action)
      if (next === previous) return current
      return { ...current, [caseId]: next }
    })
  }

  function resetDemo() {
    const reset = Object.fromEntries(demoCases.map(({ id }) => [id, createInitialState(id)]))
    setCaseStates(reset)
    setShowReset(false)
    setAnnouncement('Đã khôi phục toàn bộ dữ liệu mẫu.')
    navigate('#/gioi-thieu')
  }

  let content
  if (route.page === 'intro') {
    content = <Introduction caseStates={caseStates} hasProgress={hasProgress} />
  } else if (route.page === 'queue') {
    content = <CaseQueue caseStates={caseStates} />
  } else if (route.page === 'dossier') {
    const demoCase = demoCases.find(({ id }) => id === route.caseId) ?? demoCases[0]
    const role = actorById(route.roleId)
    content = (
      <DossierWorkspace
        demoCase={demoCase}
        state={caseStates[demoCase.id]}
        role={role}
        onAction={(type) => dispatch(demoCase.id, { type, actor: role.id })}
      />
    )
  } else if (route.page === 'projection') {
    content = <ProjectionWorkspace role={actorById(route.roleId)} caseStates={caseStates} />
  } else {
    content = <PilotBrief completedCount={completedCount} />
  }

  return (
    <div className="app-root">
      <a className="skip-link" href="#noi-dung-chinh">Bỏ qua điều hướng</a>
      <AppHeader route={route} completedCount={completedCount} onReset={() => setShowReset(true)} />
      <main id="noi-dung-chinh" tabIndex="-1">{content}</main>
      <div className="sr-only" aria-live="polite">{announcement}</div>
      <AppFooter />
      {showReset ? <ResetDialog onCancel={() => setShowReset(false)} onConfirm={resetDemo} /> : null}
    </div>
  )
}

function AppHeader({ route, completedCount, onReset }) {
  const inDemo = route.page !== 'intro'
  return (
    <header className="app-header">
      <div className="header-inner">
        <button className="brand-button" type="button" onClick={() => navigate('#/gioi-thieu')} aria-label="Về trang giới thiệu">
          <BrandMark compact />
        </button>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <button className={route.page === 'queue' || route.page === 'dossier' ? 'is-active' : ''} type="button" onClick={() => navigate('#/ho-so')} data-testid="nav-case-queue">
            Hai hồ sơ
            {completedCount ? <span>{completedCount}/2</span> : null}
          </button>
          <button className={route.page === 'projection' ? 'is-active' : ''} type="button" onClick={() => navigate('#/goc-nhin/brokerage')}>Góc nhìn vai trò</button>
          <button className={route.page === 'pilot' ? 'is-active' : ''} type="button" onClick={() => navigate('#/pilot')} data-testid="nav-pilot">Bản thảo pilot</button>
        </nav>
        <div className="header-actions">
          <EvidenceBadge label="MÔ PHỎNG ĐỀ XUẤT" />
          {inDemo ? (
            <button className="icon-text-button" type="button" onClick={onReset} data-testid="reset-demo" aria-label="Khôi phục dữ liệu mẫu">
              <ClockCounterClockwise aria-hidden="true" />
              <span>Khôi phục dữ liệu mẫu</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

function Introduction({ caseStates, hasProgress }) {
  const nextCase = [...demoCases].sort((a, b) => progressFor(caseStates[b.id]) - progressFor(caseStates[a.id]))[0]
  const nextRole = firstNextActor(caseStates[nextCase.id])

  return (
    <div className="intro-page">
      <section className="hero-section">
        <div className="cadastral-map" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="hero-copy">
          <p className="eyebrow">Hạ tầng phối hợp cho thị trường bất động sản Việt Nam</p>
          <h1>Một tài sản. Một định danh.<br /><em>Một hành trình có thể kiểm chứng.</em></h1>
          <p className="hero-lede">
            VMLS không làm thay công việc của Môi giới, Văn phòng công chứng hay đơn vị chuyển quyền.
            VMLS nối đúng hồ sơ, đúng quyền và đúng kết quả thành một bản ghi sống.
          </p>
          <div className="hero-actions">
            <ActionButton testId="start-demo" onClick={() => navigate(hasProgress ? rolePath(nextCase.id, nextRole) : '#/ho-so')}>
              {hasProgress ? 'Tiếp tục hành trình' : 'Khám phá hai hồ sơ'}
            </ActionButton>
            <button className="text-link" type="button" onClick={() => navigate('#/pilot')}>Xem đề bài pilot <ArrowRight aria-hidden="true" /></button>
          </div>
          <SimulationNotice>
            Quy trình v2 và mọi tích hợp bên ngoài trong demo đều là đề xuất để thảo luận, không phải quy trình pháp lý đã phê duyệt.
          </SimulationNotice>
        </div>
        <RegistryPromise />
      </section>

      <section className="intro-section object-model" aria-labelledby="object-model-title">
        <div className="section-heading">
          <p className="eyebrow">Ba danh tính, không nhập làm một</p>
          <h2 id="object-model-title">Biết chính xác điều gì đang thay đổi</h2>
          <p>Một Bất động sản có thể tồn tại lâu dài, có nhiều Tin bán qua thời gian và nhiều Giao dịch riêng biệt.</p>
        </div>
        <div className="object-flow" role="list">
          <ObjectDefinition icon={House} code="NPID" title="Bất động sản" copy="Danh tính bền vững của tài sản, thuộc tính và nguồn dữ liệu." />
          <FlowArrow className="object-arrow" aria-hidden="true" />
          <ObjectDefinition icon={Signpost} code="PLID" title="Tin bán" copy="Một ý định bán hoặc chuyển nhượng, có quyền đại diện và vòng đời riêng." />
          <FlowArrow className="object-arrow" aria-hidden="true" />
          <ObjectDefinition icon={Handshake} code="PTID" title="Giao dịch" copy="Một mã tham chiếu demo nối kết quả công chứng, thuế và chuyển quyền." />
        </div>
      </section>

      <section className="intro-section orchestration-section" aria-labelledby="orchestration-title">
        <div className="orchestration-copy">
          <p className="eyebrow">Điều phối, không chiếm quyền</p>
          <h2 id="orchestration-title">Mỗi bên làm đúng phần việc của mình</h2>
          <p>VMLS giữ liên kết và lịch sử. Người có thẩm quyền vẫn là người tạo ra kết quả nghiệp vụ.</p>
          <ul className="principle-list">
            <li><ShieldCheck weight="fill" aria-hidden="true" /> Quyền đại diện phải được Người bán xác nhận.</li>
            <li><SealCheck weight="fill" aria-hidden="true" /> Kết quả công chứng đến từ VPCC mô phỏng.</li>
            <li><MapPin weight="fill" aria-hidden="true" /> Kết quả chuyển quyền đến từ đúng tuyến tiếp nhận.</li>
          </ul>
        </div>
        <div className="orchestration-diagram" aria-label="Sơ đồ VMLS kết nối các chủ thể">
          <span className="orbit orbit-one">Thị trường</span>
          <span className="orbit orbit-two">Công chứng</span>
          <span className="orbit orbit-three">Chuyển quyền</span>
          <div className="registry-core"><BrandMark compact inverse /><small>Sổ đăng ký sống</small></div>
        </div>
      </section>
    </div>
  )
}

function RegistryPromise() {
  return (
    <aside className="registry-promise" aria-label="Bản ghi sống minh họa">
      <div className="promise-header">
        <span>Sổ đăng ký sống</span>
        <StatusPill tone="verified" icon={CheckCircle}>Có thể truy vết</StatusPill>
      </div>
      <div className="promise-property">
        <span className="property-glyph"><House weight="duotone" aria-hidden="true" /></span>
        <div><small>Bất động sản</small><strong>NPID-HN-09876</strong><span>S2-12A · Thụy Khuê</span></div>
      </div>
      <div className="promise-trace">
        <div><span>01</span><p><strong>Nguồn</strong><small>Giữ khái niệm và thời điểm</small></p></div>
        <div><span>02</span><p><strong>Quyền</strong><small>Xác nhận có phạm vi</small></p></div>
        <div><span>03</span><p><strong>Trạng thái</strong><small>Nối tiếp, không ghi đè</small></p></div>
      </div>
      <div className="promise-foot"><CirclesThreePlus aria-hidden="true" /> NPID → PLID → PTID</div>
    </aside>
  )
}

function ObjectDefinition({ icon: Icon, code, title, copy }) {
  return (
    <article className="object-definition" role="listitem">
      <div className="object-code"><Icon weight="duotone" aria-hidden="true" /><span>{code}</span></div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  )
}

function CaseQueue({ caseStates }) {
  return (
    <div className="page-shell queue-page">
      <PageIntro eyebrow="Hai hồ sơ độc lập" title="Theo một quy trình, nhìn rõ hai tuyến chuyển quyền" copy="Mỗi hồ sơ bắt đầu lại từ Bất động sản, Tin bán và Giao dịch riêng. Chọn một hồ sơ để làm từng bàn giao vai trò." />
      <div className="case-grid">
        {demoCases.map((demoCase, index) => {
          const state = caseStates[demoCase.id]
          const nextRole = firstNextActor(state)
          const complete = COMPLETE_STAGES.has(state.stage)
          return (
            <article className="case-card" key={demoCase.id} data-testid={`case-${demoCase.id}`}>
              <div className="case-card-top">
                <span className="case-index">0{index + 1}</span>
                <StatusPill tone={complete ? 'verified' : 'neutral'} icon={complete ? CheckCircle : undefined}>{STAGE_STATUS[state.stage]}</StatusPill>
              </div>
              <p className="case-route">{demoCase.routeLabel}</p>
              <h2>{demoCase.title}</h2>
              <p>{demoCase.summary}</p>
              <div className="case-id-row">
                <span><small>NPID</small><strong>{demoCase.property.id}</strong></span>
                <span><small>PLID</small><strong>{state.records.listing?.id ?? 'Chưa cấp'}</strong></span>
                <span><small>PTID</small><strong>{state.records.transaction?.id ?? 'Chưa cấp'}</strong></span>
              </div>
              <div className="progress-meter" aria-label={`Tiến độ ${progressFor(state)}%`}><span style={{ width: `${progressFor(state)}%` }} /></div>
              <div className="case-card-foot">
                <span>{demoCase.chronologyLabel}</span>
                <ActionButton onClick={() => navigate(rolePath(demoCase.id, nextRole))}>
                  {complete ? 'Xem bản ghi sống' : state.auditEvents.length ? 'Tiếp tục hồ sơ' : 'Bắt đầu hồ sơ'}
                </ActionButton>
              </div>
            </article>
          )
        })}
      </div>
      <div className="queue-note">
        <WarningCircle aria-hidden="true" />
        <div><strong>Dữ liệu công khai đã được che hoặc giả lập</strong><p>Hai hồ sơ dùng dòng thời gian cố định tháng 08/2026 để bản demo có thể lặp lại và kiểm thử.</p></div>
      </div>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy, children }) {
  return (
    <header className="page-intro">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div>
      {children}
    </header>
  )
}

function DossierWorkspace({ demoCase, state, role, onAction }) {
  const stageId = stageViewFor(state)
  const stage = DEMO_STAGES.find(({ id }) => id === stageId) ?? DEMO_STAGES[0]
  const allowed = allowedActionsFor(state, role.id)
  const nextRole = actorById(firstNextActor(state))
  const RoleIcon = ACTOR_ICONS[role.id] ?? User
  const complete = COMPLETE_STAGES.has(state.stage)
  const stageEyebrow = stage.id === 'transfer-result'
    ? state.route === 'developer' ? 'Tuyến B · Chủ đầu tư / HĐMB' : 'Tuyến A · Văn phòng đăng ký đất đai'
    : stage.number ? `Bước ${stage.number}` : 'Không đánh số · chuẩn bị giao dịch'

  return (
    <div className="workspace-page">
      <div className="workspace-topbar">
        <button type="button" className="back-button" onClick={() => navigate('#/ho-so')}><ArrowLeft aria-hidden="true" /> Hai hồ sơ</button>
        <div className="workspace-title">
          <span>{demoCase.routeLabel}</span>
          <h1>{demoCase.title}</h1>
        </div>
        <div className="workspace-progress">
          <span>{progressFor(state)}%</span>
          <div className="progress-meter"><span style={{ width: `${progressFor(state)}%` }} /></div>
          <small>{STAGE_STATUS[state.stage]}</small>
        </div>
      </div>

      <div className="workspace-layout">
        <aside className="actor-sidebar"><RoleSwitcher demoCase={demoCase} activeRole={role} /></aside>
        <div className="workspace-main">
          {role.supplemental ? (
            <RoleScopedDossier demoCase={demoCase} state={state} role={role} nextRole={nextRole} />
          ) : <>
          <section className="registry-passport" aria-label="Hộ chiếu định danh hồ sơ">
            <IdentifierCard label="Bất động sản · NPID" value={state.records.property.id} detail="Danh tính bền vững" />
            <IdentifierCard label="Tin bán · PLID" value={state.records.listing?.id} detail={state.records.listing?.status ?? 'Chỉ cấp sau xác nhận'} tone="mint" empty={!state.records.listing} />
            <IdentifierCard label="Giao dịch · PTID" value={state.records.transaction?.id} detail={state.records.transaction?.status ?? 'Chỉ cấp sau công chứng'} tone="coral" empty={!state.records.transaction} />
          </section>

          <div className="workspace-columns">
            <aside className="progress-sidebar">
              <ProgressRail items={stageItemsFor(state)} currentId={stageId} completedIds={completedStageIds(state)} />
              <button className="projection-link" type="button" onClick={() => navigate(`#/goc-nhin/${role.id}`)}>
                <UsersThree aria-hidden="true" /> Xem toàn bộ góc nhìn {role.label}
              </button>
            </aside>
            <div className="stage-column">
              <header className="stage-header">
                <div><p className="eyebrow">{stageEyebrow}</p><h2>{stage.title}</h2><p>{stage.intent}</p></div>
                <span className="stage-actor"><RoleIcon weight="duotone" aria-hidden="true" /><small>Đang xem với vai trò</small><strong>{role.label}</strong></span>
              </header>
              <StageContent demoCase={demoCase} state={state} />
              {!complete ? <ActionPanel role={role} allowed={allowed} nextRole={nextRole} onAction={onAction} demoCase={demoCase} state={state} /> : <CompletionPanel demoCase={demoCase} state={state} />}
              <HistoryPanel demoCase={demoCase} state={state} />
            </div>
          </div>
          </>}
        </div>
      </div>
    </div>
  )
}

function RoleScopedDossier({ demoCase, state, role, nextRole }) {
  const projection = projectStateForRole(state, role.id)
  const isBank = role.id === 'bank'
  const records = projection.records
  const indicators = projection.indicators

  return (
    <section className="role-scoped-view" data-testid="role-scoped-view" aria-labelledby="role-scope-title">
      <header className="role-scope-header">
        <div>
          <p className="eyebrow">Bản chiếu tối thiểu theo mục đích</p>
          <h2 id="role-scope-title">Phạm vi hồ sơ dành cho {role.label}</h2>
          <p>{projection.scope.headline}</p>
        </div>
        <StatusPill tone="neutral" icon={LockKey}>Đã giới hạn dữ liệu</StatusPill>
      </header>

      <div className="content-grid">
        <article className="panel">
          <PanelTitle icon={ShieldCheck} eyebrow="Được xem" title="Thông tin phục vụ đúng mục đích" />
          <Checklist items={projection.scope.cards} />
          <FieldGrid>
            {isBank ? <>
              <Field label="Loại Bất động sản" value={records.property.type} />
              <Field label="Giá đề nghị" value={records.listing?.askingPrice ?? 'Chưa được chia sẻ'} />
              <Field label="Đồng ý chia sẻ" value={indicators.consent} />
              <Field label="Mốc sẵn sàng" value={indicators.readiness} />
            </> : <>
              <Field label="Bất động sản" value={records.property.id} mono />
              <Field label="Tin bán" value={records.listing?.status ?? 'Chưa khởi tạo'} />
              <Field label="Quyền đại diện" value={indicators.representation} />
              <Field label="Điểm nghẽn" value={indicators.bottleneck} />
            </>}
          </FieldGrid>
          {isBank ? <p className="panel-note"><LockKey aria-hidden="true" /> {indicators.financeContext}</p> : null}
        </article>
        <article className="panel scoped-boundary">
          <PanelTitle icon={LockKey} eyebrow="Không được mở" title="Ranh giới dữ liệu được thực thi" />
          <ul>{projection.scope.hidden.map((item) => <li key={item}><LockKey aria-hidden="true" />{item}</li>)}</ul>
          <SimulationNotice compact>Góc nhìn này không tải chi tiết các bên, hồ sơ công chứng hay nhật ký kỹ thuật. Đây là phép chiếu trên cùng trạng thái lõi, không phải một bản sao hồ sơ.</SimulationNotice>
        </article>
      </div>

      <div className="role-scope-actions">
        <button type="button" className="text-link" onClick={() => navigate(`#/goc-nhin/${role.id}`)}><ArrowLeft aria-hidden="true" /> Xem tổng quan {role.label}</button>
        <ActionButton onClick={() => navigate(rolePath(demoCase.id, nextRole.id))} testId="handoff-next-role">Chuyển sang {nextRole.label}</ActionButton>
      </div>
    </section>
  )
}

function RoleSwitcher({ demoCase, activeRole }) {
  return (
    <nav className="role-switcher" aria-label="Đổi vai trò demo">
      <div className="role-group"><p>6 chủ thể thị trường</p>{marketRoles.map((role) => <RoleButton key={role.id} role={role} active={activeRole.id === role.id} caseId={demoCase.id} />)}</div>
      <div className="role-group role-group-systems"><p>Hệ thống & đơn vị mô phỏng</p>{externalRoles.map((role) => <RoleButton key={role.id} role={role} active={activeRole.id === role.id} caseId={demoCase.id} />)}</div>
    </nav>
  )
}

function RoleButton({ role, active, caseId }) {
  const Icon = ACTOR_ICONS[role.id] ?? User
  return (
    <button type="button" className={active ? 'is-active' : ''} onClick={() => navigate(rolePath(caseId, role.id))} data-testid={`role-${role.id}`}>
      <Icon weight={active ? 'fill' : 'regular'} aria-hidden="true" /><span><strong>{role.label}</strong><small>{role.defaultWorkspace}</small></span>
    </button>
  )
}

function StageContent({ demoCase, state }) {
  if (state.stage === 'property_match') return <PropertyStage demoCase={demoCase} state={state} />
  if (state.stage === 'seller_confirmation') return <SellerStage demoCase={demoCase} state={state} />
  if (state.stage === 'listing_created') return <ListingStage demoCase={demoCase} state={state} />
  if (state.stage === 'transaction_readiness') {
    return state.flags.readinessVerified
      ? <NotarySubmissionStage demoCase={demoCase} />
      : <ReadinessStage demoCase={demoCase} state={state} />
  }
  if (state.stage === 'notary_dossier') return <NotaryStage demoCase={demoCase} state={state} />
  if (state.stage === 'notary_signed') return <SignedStage demoCase={demoCase} />
  return <RouteStage demoCase={demoCase} state={state} />
}

function PropertyStage({ demoCase, state }) {
  return (
    <>
      <div className="content-grid content-grid-wide">
        <article className="panel primary-panel">
          <PanelTitle icon={House} eyebrow="Bất động sản đã chọn" title={demoCase.property.name} />
          <FieldGrid>
            <Field label="NPID" value={demoCase.property.id} mono />
            <Field label="Loại" value={demoCase.property.type} />
            <Field label="Khu vực" value={demoCase.property.location} privacy={demoCase.property.addressVisibility} />
            <Field label="Dự án / Căn" value={demoCase.project ? `${demoCase.project} · ${demoCase.unit}` : 'Không thuộc dự án'} />
          </FieldGrid>
          <div className="area-ledger">
            {demoCase.property.areas.map((area) => <div key={area.kind}><span>{area.label}</span><strong>{area.value.toLocaleString('vi-VN')} {area.unit}</strong><small>{area.sourceLabel}</small><EvidenceBadge label={area.evidence} /></div>)}
          </div>
          <p className="panel-note"><ShieldCheck aria-hidden="true" /> {demoCase.property.identityNote}</p>
        </article>
        <article className={`panel match-panel ${state.flags.propertyMatched ? 'is-matched' : ''}`}>
          <PanelTitle icon={ListChecks} eyebrow="Đối chiếu" title={state.flags.propertyMatched ? 'Đã khớp đúng hồ sơ' : 'Ba lớp bằng chứng'} />
          <Checklist items={[
            { label: 'Danh tính NPID và loại tài sản', state: state.flags.propertyMatched ? 'done' : 'pending' },
            { label: 'Khái niệm diện tích kèm nguồn', state: state.flags.propertyMatched ? 'done' : 'pending' },
            { label: 'Chủ thể và liên hệ đã che', state: state.flags.propertyMatched ? 'done' : 'pending' },
          ]} />
        </article>
      </div>
      <Source357Panel open={state.flags.propertyMatched} />
    </>
  )
}

function Source357Panel({ open }) {
  if (open) {
    return (
      <section className="source-panel source-revealed" aria-labelledby="source-357-title">
        <div className="source-summary"><Database aria-hidden="true" /><span><strong id="source-357-title">Nguồn tham khảo bên ngoài · Cổng thông tin 357</strong><small>Ảnh chụp tham chiếu, không phải dữ liệu của hồ sơ</small></span><StatusPill tone="verified" icon={CheckCircle}>Đã hiển thị sau đối chiếu</StatusPill></div>
        <Source357Body />
      </section>
    )
  }
  return (
    <details className="source-panel">
      <summary><Database aria-hidden="true" /><span><strong>Nguồn tham khảo bên ngoài · Cổng thông tin 357</strong><small>Ảnh chụp tham chiếu, không phải dữ liệu của hồ sơ</small></span><span className="summary-action">Mở nguồn</span></summary>
      <Source357Body />
    </details>
  )
}

function Source357Body() {
  return (
    <div className="source-body">
      <img src="/assets/demo/357-homepage-2026-08-15.png" alt="Ảnh chụp trang chính Hệ thống thông tin về nhà ở và thị trường bất động sản của Bộ Xây dựng ngày 15 tháng 8 năm 2026" />
      <div className="source-caption"><EvidenceBadge label="FACT · ẢNH CHỤP THAM CHIẾU" /><p>Nguồn: Hệ thống thông tin về nhà ở và thị trường BĐS — <a href="https://thongtinbds.moc.gov.vn/" target="_blank" rel="noreferrer">thongtinbds.moc.gov.vn</a> · chụp ngày 15/08/2026.</p><small>Việc hiển thị ảnh không thể hiện kết nối kỹ thuật, dữ liệu hồ sơ, sự bảo chứng hay quan hệ hợp tác chính thức với VMLS.</small></div>
    </div>
  )
}

function SellerStage({ demoCase, state }) {
  const seller = demoCase.parties.seller
  return (
    <div className="content-grid">
      <article className="panel phone-handoff"><div className="phone-frame"><div className="phone-status"><span>09:41</span><LockKey weight="fill" aria-hidden="true" /></div><div className="phone-app"><span className="neutral-app-icon"><Phone weight="fill" aria-hidden="true" /></span><small>Chuyển tiếp xác nhận</small><h3>Quyền đại diện Tin bán</h3></div><div className="phone-card"><span>Người bán</span><strong>{seller.displayName}</strong><small>{seller.contact.phone}</small></div><div className="phone-card"><span>Bất động sản</span><strong>{demoCase.property.name}</strong><small>{demoCase.property.id}</small></div><div className={`phone-consent ${state.flags.representationConfirmed ? 'is-confirmed' : ''}`}><CheckCircle weight="fill" aria-hidden="true" /><span>{state.flags.representationConfirmed ? 'Đã xác nhận quyền đại diện' : 'Chờ Người bán xác nhận'}</span></div></div></article>
      <article className="panel">
        <PanelTitle icon={ShieldCheck} eyebrow="Bàn giao trung lập" title="VNeID chỉ là bề mặt xác nhận mô phỏng" />
        <p>Người bán nhìn thấy đúng Bất động sản, Môi giới được ủy quyền, phạm vi “bán/chuyển nhượng” và phiên bản nội dung.</p>
        <Checklist items={['Không đăng nhập VNeID thật', 'Không thu thập dữ liệu định danh thật', { label: 'Sự đồng ý được đóng dấu thời gian', state: state.flags.representationConfirmed ? 'done' : 'pending' }]} />
        <SimulationNotice compact>Đây là mô phỏng một lần chuyển tiếp. Mô hình tích hợp và thẩm quyền phải được xác nhận trong pilot.</SimulationNotice>
      </article>
    </div>
  )
}

function ListingStage({ demoCase, state }) {
  return (
    <div className="content-grid">
      <article className="panel listing-stamp-panel"><PanelTitle icon={Signpost} eyebrow="Tin bán riêng biệt" title="PLID đã được cấp" /><div className="listing-stamp"><small>PLID</small><strong>{state.records.listing.id}</strong><StatusPill tone="mint" icon={CheckCircle}>{state.records.listing.status}</StatusPill></div><FieldGrid><Field label="Tham chiếu Bất động sản" value={demoCase.property.id} mono /><Field label="Loại giao dịch" value={demoCase.listing.transactionType} /><Field label="Giá đề nghị mô phỏng" value={demoCase.listing.askingPrice.displayValue} /><Field label="Trạng thái" value="Đã khởi tạo · chưa phải Đang hoạt động" /></FieldGrid></article>
      <article className="panel channel-panel"><PanelTitle icon={FlowArrow} eyebrow="Phân phối theo đồng ý" title="Một lõi, nhiều điểm chạm" /><div className="channel-row"><img src="/assets/demo/housenow-icon.png" alt="Biểu tượng ứng dụng HouseNow" /><div><strong>HouseNow</strong><span>Kênh tiếp cận thị trường</span></div><StatusPill tone="neutral">Đủ điều kiện nhận Tin bán</StatusPill></div><p>HouseNow chỉ nhận phần dữ liệu cần thiết sau khi quyền đại diện được xác nhận. VMLS vẫn giữ định danh và lịch sử lõi.</p><EvidenceBadge label="PROPOSAL · KÊNH PHÂN PHỐI MÔ PHỎNG" /></article>
    </div>
  )
}

function ReadinessStage({ demoCase, state }) {
  return (
    <div className="content-grid">
      <article className="panel"><PanelTitle icon={UsersThree} eyebrow="Các bên trong hồ sơ" title="Người mua chỉ được nối khi có nhu cầu thật" /><div className="party-list">{['seller', 'buyer', 'agent'].map((partyId) => { const party = demoCase.parties[partyId]; return <div key={partyId}><span>{partyId === 'seller' ? 'Người bán' : partyId === 'buyer' ? 'Người mua' : 'Môi giới'}</span><strong>{party.displayName}</strong><small>{party.contact.phone}</small></div> })}</div></article>
      <article className="panel"><PanelTitle icon={ListChecks} eyebrow="Không phải bước v2 đánh số" title="Danh mục sẵn sàng công chứng" /><Checklist items={demoCase.readiness.checklist.map((label, index) => ({ label, state: index === 0 ? state.flags.buyerRecorded ? 'done' : 'pending' : state.flags.readinessVerified ? 'done' : 'pending' }))} /><p className="panel-note"><LockKey aria-hidden="true" /> {demoCase.readiness.financeContext}</p></article>
    </div>
  )
}

function NotarySubmissionStage({ demoCase }) {
  return (
    <div className="content-grid">
      <article className="panel">
        <PanelTitle icon={FileText} eyebrow="Bộ hồ sơ chuẩn bị gửi" title={demoCase.notary.dossierId} />
        <FieldGrid>
          <Field label="Văn phòng công chứng" value={demoCase.notary.office} />
          <Field label="Mã tương quan dự kiến" value={demoCase.notary.correlationId} mono />
          <Field label="Bất động sản" value={demoCase.property.id} mono />
          <Field label="Trạng thái" value="Sẵn sàng để VPCC tiếp nhận" />
        </FieldGrid>
      </article>
      <article className="panel">
        <PanelTitle icon={ListChecks} eyebrow="Ranh giới trách nhiệm" title="VPCC tiếp nhận trong không gian riêng" />
        <Checklist items={[
          'Đúng Bất động sản và các bên đã che',
          'Quyền đại diện có lịch sử xác nhận',
          'VMLS chỉ nhận trạng thái và mã tương quan cần thiết',
        ]} />
        <SimulationNotice compact>Không nộp hồ sơ thật và không kết nối phần mềm công chứng trong bản demo công khai.</SimulationNotice>
      </article>
    </div>
  )
}

function NotaryStage({ demoCase, state }) {
  const supplementRequired = state.supplement.status === 'required'
  return (
    <div className="content-grid">
      <article className="panel"><PanelTitle icon={FileText} eyebrow="Hồ sơ nghiệp vụ VPCC" title={demoCase.notary.dossierId} /><FieldGrid><Field label="Đơn vị" value={demoCase.notary.office} /><Field label="Mã tương quan" value={demoCase.notary.correlationId} mono /><Field label="Trạng thái" value={supplementRequired ? 'Yêu cầu bổ sung' : state.supplement.status === 'provided' ? 'Đã bổ sung · đủ điều kiện ký' : 'Đã tiếp nhận'} /><Field label="Phạm vi VMLS nhận" value="Trạng thái, thời điểm, mã tương quan" /></FieldGrid></article>
      <article className={`panel exception-panel ${supplementRequired ? 'has-exception' : ''}`}><PanelTitle icon={supplementRequired ? WarningCircle : CheckCircle} eyebrow="Ngoại lệ có thể phục hồi" title={supplementRequired ? 'Thiếu một tài liệu' : state.supplement.status === 'provided' ? 'Đã nối tài liệu bổ sung' : 'Hồ sơ đang đủ điều kiện'} />{supplementRequired ? <><p>{demoCase.notary.supplementReason || 'Thiếu tài liệu đối chiếu trong bộ hồ sơ mô phỏng.'}</p><StatusPill tone="warning">Lịch sử tiếp nhận ban đầu vẫn được giữ</StatusPill></> : state.supplement.status === 'provided' ? <Checklist items={[demoCase.notary.supplementDocument || 'Tài liệu bổ sung đã che', 'Lịch sử hồ sơ được nối tiếp']} /> : <Checklist items={['Bất động sản và các bên đã đối chiếu', 'Quyền đại diện có bằng chứng', 'Danh mục công chứng đã sẵn sàng']} />}</article>
    </div>
  )
}

function SignedStage({ demoCase }) {
  return (
    <div className="content-grid"><article className="panel result-seal"><SealCheck weight="duotone" aria-hidden="true" /><span>Kết quả từ VPCC mô phỏng</span><h3>Đã ký công chứng</h3><strong>{demoCase.notary.correlationId}</strong></article><article className="panel"><PanelTitle icon={Database} eyebrow="VMLS nhận kết quả" title="Chưa tự nhận là cơ quan công chứng" /><p>VMLS nhận mã tương quan, thời điểm và trạng thái tối thiểu để nối lịch sử. Bước tiếp theo mới tạo PTID tham chiếu và xác định tuyến.</p><SimulationNotice compact>Kết quả nghiệp vụ thuộc VPCC mô phỏng. VMLS chỉ điều phối bản ghi.</SimulationNotice></article></div>
  )
}

function RouteStage({ demoCase, state }) {
  const routeKnown = Boolean(state.route)
  const routeComplete = COMPLETE_STAGES.has(state.stage)
  return (
    <><div className="route-decision"><div className="route-origin"><small>Giao dịch</small><strong>{state.records.transaction?.id ?? 'Chờ PTID'}</strong><span>{state.records.transaction?.status ?? 'Chờ kết quả công chứng'}</span></div><FlowArrow aria-hidden="true" /><div className={`route-destination ${routeKnown ? 'is-selected' : ''}`}><small>{routeKnown ? 'Tuyến được xác định tự động' : 'Đang chờ xác định tuyến'}</small><strong>{routeKnown ? demoCase.routeLabel : 'VPĐKĐĐ hoặc Chủ đầu tư'}</strong><span>{routeKnown ? demoCase.transfer.reason : 'Dựa trên loại hồ sơ và căn cứ chuyển quyền.'}</span></div></div><div className="content-grid"><article className="panel"><PanelTitle icon={FlowArrow} eyebrow="Sự kiện tích hợp" title="Nối tiếp thay vì ghi đè" /><IntegrationList events={state.integrationEvents} /></article><article className="panel"><PanelTitle icon={routeComplete ? CheckCircle : ClockCounterClockwise} eyebrow={demoCase.routeLabel} title={routeComplete ? 'Bản ghi sống đã cập nhật' : STAGE_STATUS[state.stage]} /><FieldGrid><Field label="Đơn vị tiếp nhận" value={demoCase.transfer.ownerLabel} /><Field label="Mã tiếp nhận" value={demoCase.transfer.intakeId} mono /><Field label="Kết quả" value={routeComplete ? demoCase.transfer.finalStatus : state.records.transaction?.status ?? 'Chưa có'} /><Field label="Tham chiếu kết quả" value={routeComplete ? demoCase.transfer.resultReference : 'Chờ đơn vị tiếp nhận'} mono /></FieldGrid></article></div></>
  )
}

function IntegrationList({ events }) {
  if (!events.length) return <p className="empty-copy">Chưa có sự kiện tích hợp. Mỗi sự kiện sẽ có loại, thời điểm và trạng thái mô phỏng.</p>
  return <ol className="integration-list">{events.map((event) => <li key={event.id}><span><Check weight="bold" aria-hidden="true" /></span><div><strong>{event.label}</strong><small>{event.status} · {event.at}</small></div></li>)}</ol>
}

function PanelTitle({ icon: Icon, eyebrow, title }) {
  return <header className="panel-title"><Icon weight="duotone" aria-hidden="true" /><div><span>{eyebrow}</span><h3>{title}</h3></div></header>
}

function ActionPanel({ role, allowed, nextRole, onAction, demoCase, state }) {
  const canAct = allowed.length > 0
  const showRecommendedException = demoCase.notary.supplementRequired && state.stage === 'notary_dossier' && state.supplement.status === 'none'
  const actionDescription = allowed[0] === ACTIONS.MATCH_PROPERTY && !demoCase.project
    ? 'Khớp khu vực, loại nhà ở, diện tích đất và bằng chứng nguồn với NPID hiện có.'
    : ACTION_META[allowed[0]]?.description
  return (
    <section className={`action-panel ${canAct ? 'can-act' : ''}`} aria-label="Hành động tiếp theo">
      <div className="action-copy"><span>{canAct ? 'Quyền thao tác trong vai trò này' : 'Bàn giao tiếp theo'}</span><h3>{canAct ? `${role.label} có thể tiếp tục hồ sơ` : `Cần chuyển sang ${nextRole.label}`}</h3><p>{canAct ? actionDescription : 'Mỗi thao tác chỉ xuất hiện ở đúng không gian làm việc chịu trách nhiệm.'}</p></div>
      <div className="action-controls">{canAct ? allowed.map((actionType) => <ActionButton key={actionType} secondary={actionType === ACTIONS.REQUEST_SUPPLEMENT} onClick={() => onAction(actionType)} testId={`action-${actionType}`}>{actionType === ACTIONS.REQUEST_SUPPLEMENT && showRecommendedException ? 'Minh họa yêu cầu bổ sung' : ACTION_META[actionType].label}</ActionButton>) : <ActionButton onClick={() => navigate(rolePath(demoCase.id, nextRole.id))} testId="handoff-next-role">Chuyển sang {nextRole.label}</ActionButton>}</div>
    </section>
  )
}

function CompletionPanel({ demoCase, state }) {
  return (
    <section className="completion-panel" data-testid="living-record-complete"><span className="completion-icon"><CheckCircle weight="fill" aria-hidden="true" /></span><div><p className="eyebrow">Kết quả · không phải bước đóng giả</p><h3>Bản ghi sống đã được cập nhật</h3><p>{demoCase.transfer.finalStatus}. NPID, PLID và PTID vẫn là ba đối tượng riêng, được nối bằng lịch sử có nguồn.</p></div><div className="completion-actions"><button type="button" onClick={() => navigate('#/ho-so')}>Mở hồ sơ còn lại</button><button type="button" onClick={() => navigate('#/pilot')}>Cùng thiết kế pilot <ArrowRight aria-hidden="true" /></button></div><span className="completion-code">{state.records.property.id} · {state.records.listing.id} · {state.records.transaction.id}</span></section>
  )
}

function HistoryPanel({ demoCase, state }) {
  const events = [...demoCase.initialAuditEvents.map((event) => ({ ...event, label: event.action, actor: event.actorLabel })), ...state.auditEvents.map((event) => ({ ...event, actor: actorById(event.actor).label }))]
  return <details className="history-panel"><summary><ClockCounterClockwise aria-hidden="true" /><span><strong>Lịch sử hồ sơ nối tiếp</strong><small>{events.length} sự kiện · không xóa sự kiện trước</small></span><span className="summary-action">Xem lịch sử</span></summary><RegistryTimeline events={events} /></details>
}

function ProjectionWorkspace({ role, caseStates }) {
  const projection = ROLE_PROJECTIONS[role.id] ?? ROLE_PROJECTIONS.agent
  const RoleIcon = ACTOR_ICONS[role.id] ?? User
  return (
    <div className="page-shell projection-page">
      <PageIntro eyebrow="Các bản chiếu trên cùng bản ghi" title={`Góc nhìn ${role.label}`} copy={projection.headline}><span className="projection-role-icon"><RoleIcon weight="duotone" aria-hidden="true" /></span></PageIntro>
      <ProjectionRoleTabs activeRole={role} />
      <div className="projection-grid"><article className="panel projection-scope"><PanelTitle icon={ShieldCheck} eyebrow="Được xem theo mục đích" title="Phần dữ liệu hữu ích" /><ul>{projection.cards.map((item) => <li key={item}><CheckCircle weight="fill" aria-hidden="true" />{item}</li>)}</ul></article><article className="panel projection-hidden"><PanelTitle icon={LockKey} eyebrow="Tối thiểu hóa dữ liệu" title="Không hiển thị trong góc nhìn này" /><ul>{projection.hidden.map((item) => <li key={item}><LockKey aria-hidden="true" />{item}</li>)}</ul></article></div>
      <section className="projection-cases" aria-labelledby="projection-cases-title">
        <div className="section-heading"><p className="eyebrow">Cùng dữ liệu lõi</p><h2 id="projection-cases-title">Hai hồ sơ qua lăng kính {role.label}</h2></div>
        <div className="projection-case-grid">{demoCases.map((demoCase) => <ProjectionCaseCard key={demoCase.id} demoCase={demoCase} state={caseStates[demoCase.id]} role={role} />)}</div>
      </section>
    </div>
  )
}

function ProjectionRoleTabs({ activeRole }) {
  function handleKeyDown(event, index) {
    const lastIndex = marketRoles.length - 1
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1
    if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = lastIndex
    if (nextIndex === null) return

    event.preventDefault()
    const nextRole = marketRoles[nextIndex]
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[nextIndex]?.focus()
    navigate(`#/goc-nhin/${nextRole.id}`)
  }

  return (
    <div className="projection-switcher" role="tablist" aria-label="Chọn vai trò">
      {marketRoles.map((item, index) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={activeRole.id === item.id}
          tabIndex={activeRole.id === item.id ? 0 : -1}
          type="button"
          onClick={() => navigate(`#/goc-nhin/${item.id}`)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {item.label}{item.supplemental ? <small>Góc nhìn bổ sung</small> : null}
        </button>
      ))}
    </div>
  )
}

function ProjectionCaseCard({ demoCase, state, role }) {
  const projected = projectStateForRole(state, role.id)
  const isBank = role.id === 'bank'
  const isBrokerage = role.id === 'brokerage'

  return (
    <article>
      <div><StatusPill tone={COMPLETE_STAGES.has(state.stage) ? 'verified' : 'neutral'}>{STAGE_STATUS[state.stage]}</StatusPill><span>{demoCase.routeLabel}</span></div>
      <h3>{demoCase.shortTitle}</h3>
      {isBank ? (
        <dl>
          <div><dt>Loại Bất động sản</dt><dd>{projected.records.property.type}</dd></div>
          <div><dt>Giá đề nghị</dt><dd>{projected.records.listing?.askingPrice ?? 'Chưa được chia sẻ'}</dd></div>
          <div><dt>Đồng ý chia sẻ</dt><dd>{projected.indicators.consent}</dd></div>
        </dl>
      ) : isBrokerage ? (
        <dl>
          <div><dt>Bất động sản</dt><dd>{projected.records.property.id}</dd></div>
          <div><dt>Trạng thái Tin bán</dt><dd>{projected.records.listing?.status ?? 'Chưa khởi tạo'}</dd></div>
          <div><dt>Điểm nghẽn</dt><dd>{projected.indicators.bottleneck}</dd></div>
        </dl>
      ) : (
        <dl>
          <div><dt>Bất động sản</dt><dd>{projected.records.property.id}</dd></div>
          <div><dt>Tin bán</dt><dd>{projected.records.listing?.id ?? 'Chưa khởi tạo'}</dd></div>
          <div><dt>Giao dịch</dt><dd>{projected.records.transaction?.id ?? 'Chưa khởi tạo'}</dd></div>
        </dl>
      )}
      {isBank ? <p className="projection-context"><LockKey aria-hidden="true" /> {projected.indicators.financeContext}</p> : null}
      {isBrokerage ? <p className="projection-context"><Storefront aria-hidden="true" /> {projected.indicators.bottleneck}</p> : null}
      <button type="button" onClick={() => navigate(rolePath(demoCase.id, role.id))}>Mở hồ sơ với vai trò này <ArrowRight aria-hidden="true" /></button>
    </article>
  )
}

function PilotBrief({ completedCount }) {
  return (
    <div className="pilot-page">
      <section className="pilot-hero"><div><p className="eyebrow">{PILOT_BRIEF.eyebrow}</p><h1>{PILOT_BRIEF.title}</h1><p>{PILOT_BRIEF.summary}</p></div><span className="pilot-score"><strong>{completedCount}/2</strong><small>hồ sơ demo đã hoàn tất</small></span></section>
      <div className="pilot-layout"><section className="pilot-questions" aria-labelledby="pilot-questions-title"><p className="eyebrow">5 quyết định cần cùng chốt</p><h2 id="pilot-questions-title">Bắt đầu bằng câu hỏi có chủ sở hữu</h2><ol>{PILOT_BRIEF.questions.map((question, index) => <li key={question}><span>{String(index + 1).padStart(2, '0')}</span><p>{question}</p></li>)}</ol></section><aside className="pilot-output"><PanelTitle icon={Handshake} eyebrow="Đầu ra của buổi làm việc" title="Một pilot đủ nhỏ để học thật" /><Checklist items={PILOT_BRIEF.proposedOutputs} /><a className="pilot-mail" href="mailto:pilot@housenow.com.vn?subject=Cùng%20thiết%20kế%20pilot%20VMLS">Cùng thiết kế pilot VMLS <ArrowRight aria-hidden="true" /></a><small>{PILOT_BRIEF.disclaimer}</small></aside></div>
      <section className="pilot-principles"><div><strong>01</strong><span>Chọn một tuyến</span><p>Không mở rộng cả thị trường trong vòng đầu.</p></div><div><strong>02</strong><span>Dùng dữ liệu an toàn</span><p>Giả lập hoặc đã che, có chủ sở hữu và mục đích.</p></div><div><strong>03</strong><span>Đo khả năng truy vết</span><p>Biết nguồn, quyền, trạng thái và lý do điều phối.</p></div></section>
    </div>
  )
}

function ResetDialog({ onCancel, onConfirm }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const returnFocus = document.activeElement
    dialogRef.current?.querySelector('button')?.focus()
    return () => returnFocus?.isConnected && returnFocus.focus()
  }, [])

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
      return
    }
    if (event.key !== 'Tab') return

    const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')]
    const first = focusable[0]
    const last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}><section ref={dialogRef} className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={handleKeyDown}><button className="dialog-close" type="button" onClick={onCancel} aria-label="Đóng"><X aria-hidden="true" /></button><span className="dialog-icon"><ClockCounterClockwise aria-hidden="true" /></span><h2 id="reset-title">Khôi phục dữ liệu mẫu?</h2><p>Mọi tiến độ trong hai hồ sơ trên trình duyệt này sẽ trở về điểm bắt đầu. Hành động không ảnh hưởng dữ liệu bên ngoài.</p><div><ActionButton secondary onClick={onCancel} icon={null}>Giữ tiến độ</ActionButton><ActionButton onClick={onConfirm} testId="confirm-reset">Khôi phục dữ liệu mẫu</ActionButton></div></section></div>
}

function AppFooter() {
  return <footer className="app-footer"><BrandMark compact inverse /><p>Bản demo công khai · Dữ liệu giả lập hoặc đã che · Tháng 08/2026</p><button type="button" onClick={() => navigate('#/pilot')}>Cùng thiết kế pilot</button></footer>
}

export default App
