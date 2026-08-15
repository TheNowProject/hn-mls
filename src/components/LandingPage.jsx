import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Clock,
  Database,
  IdentificationCard,
  LinkSimple,
  MagnifyingGlass,
  Signpost,
  Storefront,
  X,
} from '@phosphor-icons/react'
import BrandMark from './BrandMark.jsx'
import { roles } from '../demo/demoData.js'
import '../styles/landing.css'

const CONNECTION_ICONS = Object.freeze({
  vneid: IdentificationCard,
  'source-357': Database,
  housenow: Storefront,
})

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi')
}

function preferredScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function formatDate(value, includeTime = false) {
  if (!value) return 'Chưa có'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

function connectionTone(status) {
  const normalized = normalizeText(status)
  if (normalized.includes('phat hanh') || normalized.includes('cau hinh') || normalized.includes('cho')) {
    return 'pending'
  }
  if (normalized.includes('da ') || normalized.includes('san sang')) return 'ready'
  return 'neutral'
}

function connectionActionLabel(connectionId) {
  if (connectionId === 'vneid') return 'Xem dữ liệu bàn giao'
  if (connectionId === 'source-357') return 'Xem ảnh chụp'
  if (connectionId === 'housenow') return 'Xem phạm vi phân phối'
  return 'Xem phạm vi dữ liệu'
}

function routeLabel(route) {
  if (route === 'developer') return 'Chủ đầu tư · HĐMB'
  if (route === 'landRegistry') return 'VPĐKĐĐ'
  return 'Chưa xác định'
}

function identityNode({ kind, label, value }) {
  const testId = `landing-identity-${kind}`
  return (
    <div
      className={`landing-identity-node${value ? '' : ' is-empty'}`}
      data-testid={testId}
      aria-label={`${label}: ${value ?? 'Chưa có'}`}
    >
      <span>{label}</span>
      <strong>{value ?? 'Chưa có'}</strong>
    </div>
  )
}

function ConnectionDrawer({ connection, onClose }) {
  const dialogRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    if (!connection) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    headingRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [connection])

  if (!connection) return null

  const Icon = CONNECTION_ICONS[connection.id] ?? Database
  const titleId = `landing-connection-title-${connection.id}`

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const focusable = [...dialogRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )]
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable.at(-1)
    if (event.shiftKey && (document.activeElement === headingRef.current || document.activeElement === first)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="landing-drawer-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <aside
        className="landing-connection-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        data-testid="landing-connection-drawer"
      >
        <header className="landing-drawer-header">
          <div className="landing-connection-heading">
            {connection.icon ? (
              <img src={connection.icon} alt="" />
            ) : (
              <span className="landing-connection-icon"><Icon aria-hidden="true" /></span>
            )}
            <div>
              <small>{connection.relationship}</small>
              <h2 id={titleId} ref={headingRef} tabIndex="-1">{connection.name}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="landing-drawer-body">
          <figure className="landing-connection-figure">
            {connection.screenshot ? (
              <img
                src={connection.screenshot}
                alt={`Ảnh chụp ${connection.name} ngày ${connection.capturedOn}`}
              />
            ) : (
              <div className="landing-preview-empty"><Icon aria-hidden="true" /><span>Chưa có ảnh chụp</span></div>
            )}
            {connection.capturedOn ? <figcaption>Ảnh ghi nhận ngày {connection.capturedOn}</figcaption> : null}
          </figure>

          <div className="landing-contract-panel">
            <dl className="landing-connection-meta">
              <div><dt>Đơn vị</dt><dd>{connection.owner ?? 'Chưa có'}</dd></div>
              <div><dt>Vai trò</dt><dd>{connection.relationship ?? 'Chưa có'}</dd></div>
              <div><dt>Chiều dữ liệu</dt><dd>{connection.direction ?? 'Chưa có'}</dd></div>
              <div><dt>Trạng thái</dt><dd>{connection.status ?? 'Chưa có'}</dd></div>
            </dl>

            <div className="landing-contract-grid">
              <section>
                <h3>{connection.inputLabel ?? 'Dữ liệu đầu vào'}</h3>
                <ul>{(connection.inputFields ?? []).map((field) => <li key={field}>{field}</li>)}</ul>
              </section>
              <section>
                <h3>{connection.outputLabel ?? 'Dữ liệu đầu ra'}</h3>
                <ul>{(connection.outputFields ?? []).map((field) => <li key={field}>{field}</li>)}</ul>
              </section>
            </div>

            {connection.url ? (
              <a className="landing-source-link" href={connection.url} target="_blank" rel="noreferrer">
                <span><small>Trang gốc</small><strong>{connection.url}</strong></span>
                <LinkSimple weight="bold" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  )
}

function SelectedDossierCard({
  selectedRecord,
  headingRef,
  onOpenDossier,
  canOpenDossier,
  selectedRoleLabel,
}) {
  const canOpen = selectedRecord ? canOpenDossier(selectedRecord.demoCase.id) : false
  return (
    <aside id="landing-selected-dossier" className="landing-selected-card" aria-live="polite">
      {selectedRecord ? (
        <>
          <header>
            <div>
              <span className="landing-record-kind">{selectedRecord.property.type}</span>
              <h2 ref={headingRef} tabIndex="-1">{selectedRecord.demoCase.title}</h2>
              <p>{selectedRecord.property.location}</p>
            </div>
            <span className={`landing-status is-${selectedRecord.status.tone}`}>{selectedRecord.status.label}</span>
          </header>

          <div className="landing-identity-trace" aria-label="Các định danh liên kết">
            {identityNode({
              kind: 'npid',
              label: 'Bất động sản · NPID',
              value: selectedRecord.property.id,
            })}
            {identityNode({
              kind: 'plid',
              label: 'Tin bán · PLID',
              value: selectedRecord.listing?.id,
            })}
            {identityNode({
              kind: 'ptid',
              label: 'Giao dịch · PTID',
              value: selectedRecord.transaction?.id,
            })}
          </div>

          <dl className="landing-dossier-facts">
            <div><dt>Việc tiếp theo</dt><dd>{selectedRecord.nextWork?.label ?? 'Không có việc đang chờ'}</dd></div>
            <div><dt>Phụ trách</dt><dd>{selectedRecord.nextWork?.ownerLabel ?? '—'}</dd></div>
            <div><dt>Căn cứ chuyển quyền</dt><dd>{selectedRecord.transfer?.basis ?? 'Chưa ghi nhận'}</dd></div>
            <div><dt>Tuyến chuyển quyền</dt><dd>{routeLabel(selectedRecord.transfer?.route)}</dd></div>
            <div><dt>Hạn xử lý</dt><dd>{formatDate(selectedRecord.nextWork?.dueAt, true)}</dd></div>
          </dl>

          <button
            className="landing-open-dossier"
            type="button"
            onClick={() => onOpenDossier(selectedRecord.demoCase.id, 'tong-quan')}
          >
            {canOpen ? `Mở hồ sơ · ${selectedRoleLabel}` : `Xem hàng đợi · ${selectedRoleLabel}`} <ArrowRight weight="bold" aria-hidden="true" />
          </button>
        </>
      ) : (
        <div className="landing-selected-empty">Chọn một hồ sơ để xem định danh và việc cần xử lý.</div>
      )}
    </aside>
  )
}

function OperationalSnapshot({ snapshot, latestUpdate }) {
  return (
    <aside className="landing-snapshot" aria-labelledby="landing-snapshot-title">
      <div className="landing-section-heading is-compact">
        <div>
          <p>Trạng thái phiên làm việc</p>
          <h2 id="landing-snapshot-title">Dữ liệu đang hiển thị</h2>
        </div>
        <span className="landing-updated"><Clock aria-hidden="true" /> {formatDate(latestUpdate, true)}</span>
      </div>
      <dl>
        <div><dt>Hồ sơ</dt><dd>{snapshot.dossiers}</dd></div>
        <div><dt>Việc đang chờ</dt><dd>{snapshot.workItems}</dd></div>
        <div><dt>Đã có PLID</dt><dd>{snapshot.listings}</dd></div>
        <div><dt>Đã có PTID</dt><dd>{snapshot.transactions}</dd></div>
      </dl>
    </aside>
  )
}

export function LandingPage({
  publicRecords = [],
  connections = [],
  routeCaseId = null,
  routeQuery = '',
  selectedRoleId = 'agent',
  resumeRoleId = null,
  roleSummary = { visibleDossiers: 0, actionable: 0, blocked: 0 },
  onEnterWorkspace = () => {},
  canOpenDossier = () => false,
  onOpenDossier = () => {},
  onResumeWorkspace = () => {},
  onRoleChange = () => {},
  onSearchRoute = () => {},
  onSelectRecord = () => {},
}) {
  const [query, setQuery] = useState(routeQuery)
  const [selectedCaseId, setSelectedCaseId] = useState(
    publicRecords.some(({ caseId }) => caseId === routeCaseId)
      ? routeCaseId
      : publicRecords[0]?.caseId ?? null,
  )
  const [previewConnection, setPreviewConnection] = useState(null)
  const previewTriggerRef = useRef(null)
  const selectedHeadingRef = useRef(null)

  const records = useMemo(() => publicRecords.map((record) => {
    const demoCase = { id: record.caseId, title: record.title }
    const { status, nextWork, property, listing, transaction, transfer } = record
    return {
      demoCase,
      status,
      nextWork,
      property,
      listing,
      transaction,
      transfer,
      updatedAt: record.latestMaterialAt,
      searchText: normalizeText([
        demoCase.title,
        property.name,
        property.type,
        property.project,
        property.unit,
        property.parcelRef,
        property.location,
        property.id,
        listing?.id,
        transaction?.id,
      ].filter(Boolean).join(' ')),
    }
  }), [publicRecords])

  const normalizedQuery = normalizeText(query).trim()
  const filteredRecords = useMemo(
    () => records.filter(({ searchText }) => !normalizedQuery || searchText.includes(normalizedQuery)),
    [normalizedQuery, records],
  )
  const routedRecord = routeCaseId
    ? records.find(({ demoCase }) => demoCase.id === routeCaseId)
    : null
  const displayedRecords = normalizedQuery
    ? filteredRecords
    : routeCaseId
      ? routedRecord ? [routedRecord] : []
      : filteredRecords
  const selectedRecord = displayedRecords.find(({ demoCase }) => demoCase.id === selectedCaseId)
    ?? displayedRecords[0]
    ?? null
  const selectedRole = roles.find(({ id }) => id === selectedRoleId) ?? roles[0]
  const canResume = Boolean(resumeRoleId && resumeRoleId === selectedRole.id)
  const snapshot = {
    dossiers: displayedRecords.length,
    workItems: displayedRecords.filter(({ nextWork }) => nextWork).length,
    listings: displayedRecords.filter(({ listing }) => listing).length,
    transactions: displayedRecords.filter(({ transaction }) => transaction).length,
  }
  const latestUpdate = displayedRecords
    .map(({ updatedAt }) => updatedAt)
    .filter(Boolean)
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0]

  useEffect(() => {
    if (!routeCaseId && !routeQuery) return undefined
    const frame = window.requestAnimationFrame(() => selectedHeadingRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [routeCaseId, routeQuery])

  function focusMain() {
    document.getElementById('landing-main')?.focus()
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' })
  }

  function enterWorkspace() {
    if (canResume) onResumeWorkspace()
    else onEnterWorkspace(selectedRole.id)
  }

  function submitSearch(event) {
    event.preventDefault()
    const first = filteredRecords[0]
    onSearchRoute(query)
    if (!first) return
    setSelectedCaseId(first.demoCase.id)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        selectedHeadingRef.current?.focus()
        selectedHeadingRef.current?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'nearest' })
      })
    })
  }

  function selectRecord(caseId) {
    setSelectedCaseId(caseId)
    onSelectRecord(caseId)
  }

  function openConnection(connection, trigger) {
    previewTriggerRef.current = trigger
    setPreviewConnection(connection)
  }

  function closeConnection() {
    setPreviewConnection(null)
    window.requestAnimationFrame(() => previewTriggerRef.current?.focus())
  }

  function clearSearch() {
    setQuery('')
    setSelectedCaseId(publicRecords[0]?.caseId ?? null)
    onSearchRoute('')
  }

  return (
    <div className="landing-page" data-testid="landing-page">
      <button className="landing-skip" type="button" onClick={focusMain}>Bỏ qua điều hướng</button>

      <header className="landing-header">
        <div className="landing-header-inner">
          <button className="landing-brand-button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })} aria-label="Về đầu trang VMLS">
            <BrandMark byline ariaLabel="VMLS" />
          </button>

          <div className="landing-place" aria-label="Không gian dữ liệu Hà Nội">
            <span>Không gian dữ liệu</span>
            <strong>Hà Nội</strong>
          </div>

          <nav className="landing-nav" aria-label="Điều hướng trang tổng quan">
            <button type="button" onClick={() => scrollToSection('landing-records')}>Hồ sơ</button>
            <button type="button" onClick={() => scrollToSection('landing-connections')}>Điểm nối</button>
          </nav>

          <div className="landing-role-entry">
            <label htmlFor="landing-role"><span className="sr-only">Vai trò vào không gian làm việc</span></label>
            <select id="landing-role" value={selectedRoleId} onChange={(event) => onRoleChange(event.target.value)}>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
            </select>
            <button
              className="landing-enter-button"
              type="button"
              onClick={enterWorkspace}
              data-testid="enter-workspace"
            >
              <span>{canResume ? 'Tiếp tục công việc' : 'Mở không gian làm việc'}</span>
              <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="landing-main" className="landing-main" tabIndex="-1">
        <section className="landing-command" aria-labelledby="landing-title">
          <div className="landing-command-copy">
            <p className="landing-eyebrow">Hạ tầng dữ liệu thị trường bất động sản</p>
            <h1 id="landing-title">Tra cứu và điều phối hồ sơ</h1>
            <p className="landing-intro">Bất động sản, Tin bán và Giao dịch được quản lý theo các định danh riêng.</p>

            <form className="landing-search-form" role="search" onSubmit={submitSearch}>
              <MagnifyingGlass aria-hidden="true" />
              <label className="sr-only" htmlFor="landing-search-input">Tìm hồ sơ</label>
              <input
                id="landing-search-input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo địa chỉ, mã hồ sơ, NPID, PLID hoặc PTID"
                autoComplete="off"
                data-testid="landing-search"
              />
              <button type="submit">Tra cứu</button>
            </form>
            <p className="landing-result-count" role="status" aria-live="polite">
              {displayedRecords.length} hồ sơ phù hợp
            </p>
          </div>

          <SelectedDossierCard
            selectedRecord={selectedRecord}
            headingRef={selectedHeadingRef}
            onOpenDossier={onOpenDossier}
            canOpenDossier={canOpenDossier}
            selectedRoleLabel={selectedRole.label}
          />
        </section>

        <section id="landing-records" className="landing-records" aria-labelledby="landing-records-title">
          <div className="landing-section-heading">
            <div>
              <p>Hồ sơ vận hành</p>
              <h2 id="landing-records-title">Định danh và việc cần xử lý</h2>
            </div>
            <span>{displayedRecords.length} / {records.length} hồ sơ</span>
          </div>

          <div className="landing-workbench">
            <div className="landing-table-card">
              <div className="landing-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Hồ sơ</th>
                      <th>NPID</th>
                      <th>PLID</th>
                      <th>PTID</th>
                      <th>Trạng thái</th>
                      <th>Phụ trách</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRecords.map((record) => {
                      const isSelected = selectedRecord?.demoCase.id === record.demoCase.id
                      return (
                        <tr key={record.demoCase.id} className={isSelected ? 'is-selected' : ''}>
                          <td>
                            <button
                              className="landing-case-select"
                              type="button"
                              onClick={() => selectRecord(record.demoCase.id)}
                              data-testid={`landing-case-${record.demoCase.id}`}
                              aria-pressed={isSelected}
                            >
                              <strong>{record.demoCase.title}</strong>
                              <small>{record.property.type} · {record.property.location}</small>
                            </button>
                          </td>
                          <td><span className="landing-mono">{record.property.id}</span></td>
                          <td><span className={record.listing ? 'landing-mono' : 'landing-empty'}>{record.listing?.id ?? 'Chưa có'}</span></td>
                          <td><span className={record.transaction ? 'landing-mono' : 'landing-empty'}>{record.transaction?.id ?? 'Chưa có'}</span></td>
                          <td><span className={`landing-status is-${record.status.tone}`}>{record.status.label}</span></td>
                          <td>{record.nextWork?.ownerLabel ?? 'Không có việc chờ'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {!displayedRecords.length ? (
                <div className="landing-empty-results">
                  <MagnifyingGlass aria-hidden="true" />
                  <h3>Không tìm thấy hồ sơ</h3>
                  <span>Kiểm tra lại địa chỉ hoặc mã định danh.</span>
                  <button type="button" onClick={clearSearch}>Xóa nội dung tìm kiếm</button>
                </div>
              ) : null}
            </div>

            <OperationalSnapshot snapshot={snapshot} latestUpdate={latestUpdate} />
          </div>
        </section>

        <section id="landing-connections" className="landing-connections" aria-labelledby="landing-connections-title">
          <div className="landing-section-heading">
            <div>
              <p>Nguồn và kênh dữ liệu</p>
              <h2 id="landing-connections-title">Điểm nối ngoài VMLS</h2>
            </div>
            <span>{connections.length} điểm nối</span>
          </div>

          <div className="landing-connection-grid">
            {connections.map((connection) => {
              const Icon = CONNECTION_ICONS[connection.id] ?? Signpost
              return (
                <article
                  className="landing-connection-card"
                  key={connection.id}
                  data-testid={`landing-connection-${connection.id}`}
                >
                  <header>
                    <div className="landing-connection-heading">
                      {connection.icon ? <img src={connection.icon} alt="" /> : <span className="landing-connection-icon"><Icon aria-hidden="true" /></span>}
                      <div><small>{connection.relationship}</small><h3>{connection.name}</h3></div>
                    </div>
                    <span className={`landing-status is-${connectionTone(connection.status)}`}>{connection.status}</span>
                  </header>
                  <div className="landing-connection-direction">
                    <span>Chiều dữ liệu</span>
                    <strong>{connection.direction}</strong>
                  </div>
                  <dl>
                    <div><dt>{connection.inputLabel}</dt><dd>{connection.inputFields?.join(' · ')}</dd></div>
                    <div><dt>{connection.outputLabel}</dt><dd>{connection.outputFields?.join(' · ')}</dd></div>
                  </dl>
                  <button
                    className="landing-preview-button"
                    type="button"
                    onClick={(event) => openConnection(connection, event.currentTarget)}
                  >
                    {connectionActionLabel(connection.id)} <ArrowRight weight="bold" aria-hidden="true" />
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        <section className="landing-role-band" aria-labelledby="landing-role-title">
          <div>
            <p>Không gian theo vai trò</p>
            <h2 id="landing-role-title">{selectedRole.label}</h2>
            <span>{selectedRole.purpose}</span>
          </div>
          <dl className="landing-role-summary" aria-label={`Khối lượng công việc của ${selectedRole.label}`}>
            <div><dt>Trong phạm vi</dt><dd>{roleSummary.visibleDossiers}</dd></div>
            <div><dt>Cần xử lý</dt><dd>{roleSummary.actionable}</dd></div>
            <div><dt>Vướng mắc</dt><dd>{roleSummary.blocked}</dd></div>
          </dl>
          <button type="button" onClick={enterWorkspace}>
            {canResume ? `Tiếp tục với ${selectedRole.label}` : `Vào hàng đợi ${selectedRole.label}`} <ArrowRight weight="bold" aria-hidden="true" />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <BrandMark compact ariaLabel="VMLS" />
        <span>Không gian dữ liệu Hà Nội</span>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })}>Về đầu trang</button>
      </footer>

      <ConnectionDrawer connection={previewConnection} onClose={closeConnection} />
    </div>
  )
}

export default LandingPage
