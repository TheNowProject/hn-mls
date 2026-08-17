import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Database,
  IdentificationCard,
  LinkSimple,
  MagnifyingGlass,
  Signpost,
  SquaresFour,
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

function connectionTone(status) {
  const normalized = normalizeText(status)
  if (normalized.includes('phat hanh') || normalized.includes('cau hinh') || normalized.includes('cho')) return 'pending'
  if (normalized.includes('da ') || normalized.includes('san sang')) return 'ready'
  return 'neutral'
}

function recordTone(status) {
  if (typeof status === 'object' && status?.tone) return status.tone
  const normalized = normalizeText(typeof status === 'object' ? status?.label : status)
  if (normalized.includes('hoan tat') || normalized.includes('xac nhan') || normalized.includes('du dieu kien')) return 'success'
  if (normalized.includes('cho') || normalized.includes('bo sung')) return 'pending'
  return 'neutral'
}

function connectionActionLabel(connectionId) {
  if (connectionId === 'vneid') return 'Xem dữ liệu bàn giao'
  if (connectionId === 'source-357') return 'Xem ảnh chụp'
  if (connectionId === 'housenow') return 'Xem phạm vi phân phối'
  return 'Xem phạm vi dữ liệu'
}

function uniqueOptions(records, getter) {
  return [...new Set(records.map(getter).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'vi'))
}

function normalizeRecord(record, index) {
  const sourceProperty = record.property ?? {}
  const property = {
    ...sourceProperty,
    id: sourceProperty.id ?? record.id ?? null,
    name: sourceProperty.name ?? record.title ?? 'Bất động sản',
    type: sourceProperty.type ?? 'Bất động sản',
    location: sourceProperty.location ?? sourceProperty.region ?? 'Chưa có',
    region: sourceProperty.region ?? sourceProperty.location ?? null,
    project: sourceProperty.project ?? null,
    developer: sourceProperty.developer ?? null,
  }
  const workspaceCaseId = record.caseId ?? record.demoCase?.id ?? null
  const resultId = workspaceCaseId ?? record.id ?? property.id ?? `lookup-${index}`
  const title = record.title ?? record.demoCase?.title ?? property.name
  const listing = record.listing ?? (record.listingId ? { id: record.listingId } : null)
  const transaction = record.transaction ?? (record.transactionId ? { id: record.transactionId } : null)
  const status = typeof record.status === 'object'
    ? { label: record.status?.label ?? 'Chưa có trạng thái', tone: recordTone(record.status) }
    : { label: record.status ?? 'Chưa có trạng thái', tone: recordTone(record.status) }

  return {
    demoCase: { id: resultId, title },
    workspaceCaseId,
    status,
    nextWork: record.nextWork ?? null,
    property,
    listing,
    transaction,
    transfer: record.transfer ?? null,
    updatedAt: record.latestMaterialAt ?? record.updatedAt ?? null,
    searchText: normalizeText([
      title,
      property.name,
      property.type,
      property.project,
      property.developer,
      property.region,
      property.unit,
      property.parcelRef,
      property.location,
      property.id,
      listing?.id,
      transaction?.id,
    ].filter(Boolean).join(' ')),
  }
}

function identityNode({ kind, label, value }) {
  return (
    <div
      className={`landing-identity-node${value ? '' : ' is-empty'}`}
      data-testid={`landing-identity-${kind}`}
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
          <button type="button" onClick={onClose} aria-label="Đóng"><X aria-hidden="true" /></button>
        </header>

        <div className="landing-drawer-body">
          <figure className="landing-connection-figure">
            {connection.screenshot ? (
              <img src={connection.screenshot} alt={`Ảnh chụp ${connection.name} ngày ${connection.capturedOn}`} />
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
  onOpenLookupRecord,
  canOpenLookupRecord,
  canOpenDossier,
  selectedRoleLabel,
}) {
  const canOpen = selectedRecord?.workspaceCaseId
    ? canOpenDossier(selectedRecord.workspaceCaseId)
    : false

  return (
    <aside id="landing-selected-dossier" className="landing-selected-card" aria-live="polite">
      {selectedRecord ? (
        <>
          <header>
            <div>
              <span className="landing-record-kind">Bản ghi đang chọn</span>
              <h2 ref={headingRef} tabIndex="-1">{selectedRecord.demoCase.title}</h2>
              <p>{selectedRecord.property.location}</p>
            </div>
            <span className={`landing-status is-${selectedRecord.status.tone}`}>{selectedRecord.status.label}</span>
          </header>

          <div className="landing-identity-trace" aria-label="Quan hệ định danh">
            {identityNode({ kind: 'npid', label: 'Bất động sản · NPID', value: selectedRecord.property.id })}
            {identityNode({ kind: 'plid', label: 'Tin bán · PLID', value: selectedRecord.listing?.id })}
            {identityNode({ kind: 'ptid', label: 'Giao dịch · PTID', value: selectedRecord.transaction?.id })}
          </div>

          <dl className="landing-dossier-facts">
            <div><dt>Khu vực</dt><dd>{selectedRecord.property.region ?? selectedRecord.property.location}</dd></div>
            <div><dt>Chủ đầu tư</dt><dd>{selectedRecord.property.developer ?? 'Không áp dụng'}</dd></div>
            <div><dt>Dự án</dt><dd>{selectedRecord.property.project ?? 'Không thuộc dự án'}</dd></div>
            <div><dt>Loại bất động sản</dt><dd>{selectedRecord.property.type}</dd></div>
          </dl>

          {selectedRecord.workspaceCaseId ? (
            <button
              className="landing-open-dossier"
              type="button"
              onClick={() => onOpenDossier(selectedRecord.workspaceCaseId, 'tong-quan')}
            >
              {canOpen ? `Mở hồ sơ · ${selectedRoleLabel}` : `Xem hàng đợi · ${selectedRoleLabel}`} <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          ) : selectedRecord.listing?.id ? (
            <button
              className="landing-open-dossier"
              type="button"
              onClick={() => onOpenLookupRecord(selectedRecord.listing.id)}
              data-testid="landing-open-listing"
            >
              {canOpenLookupRecord ? 'Mở Tin bán' : `Xem ứng dụng · ${selectedRoleLabel}`} <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          ) : null}
        </>
      ) : (
        <div className="landing-selected-empty">Chọn một bản ghi trong kết quả tra cứu.</div>
      )}
    </aside>
  )
}

export function LandingPage({
  publicRecords = [],
  lookupRecords = [],
  connections = [],
  routeCaseId = null,
  routeQuery = '',
  routeRegion = '',
  routeDeveloper = '',
  routeProject = '',
  selectedRoleId = 'agent',
  resumeRoleId = null,
  onEnterWorkspace = () => {},
  canOpenDossier = () => false,
  onOpenDossier = () => {},
  onResumeWorkspace = () => {},
  onOpenLookupRecord = () => {},
  canOpenLookupRecord = false,
  onOpenApplications = () => {},
  onRoleChange = () => {},
  onSearchRoute = () => {},
  onSelectRecord = () => {},
}) {
  const sourceRecords = useMemo(() => {
    if (!lookupRecords.length) return publicRecords
    const representedPropertyIds = new Set(
      lookupRecords.map((record) => record.property?.id ?? record.id).filter(Boolean),
    )
    return [
      ...lookupRecords,
      ...publicRecords.filter((record) => !representedPropertyIds.has(record.property?.id ?? record.id)),
    ]
  }, [lookupRecords, publicRecords])
  const [query, setQuery] = useState(routeQuery)
  const [region, setRegion] = useState(routeRegion)
  const [developer, setDeveloper] = useState(routeDeveloper)
  const [project, setProject] = useState(routeProject)
  const [selectedCaseId, setSelectedCaseId] = useState(() => {
    const routed = sourceRecords.some((record) => (record.caseId ?? record.demoCase?.id ?? record.id) === routeCaseId)
    return routed ? routeCaseId : sourceRecords[0]?.caseId ?? sourceRecords[0]?.demoCase?.id ?? sourceRecords[0]?.id ?? null
  })
  const [previewConnection, setPreviewConnection] = useState(null)
  const previewTriggerRef = useRef(null)
  const selectedHeadingRef = useRef(null)

  const records = useMemo(() => sourceRecords.map(normalizeRecord), [sourceRecords])
  const regionOptions = useMemo(
    () => uniqueOptions(records, (record) => record.property.region ?? record.property.location),
    [records],
  )
  const developerOptions = useMemo(
    () => uniqueOptions(records, (record) => record.property.developer),
    [records],
  )
  const projectOptions = useMemo(
    () => uniqueOptions(records, (record) => record.property.project),
    [records],
  )

  const normalizedQuery = normalizeText(query).trim()
  const filteredRecords = useMemo(() => records.filter((record) => {
    const exactNpid = normalizedQuery.startsWith('npid-')
    const matchesQuery = !normalizedQuery || (exactNpid
      ? normalizeText(record.property.id) === normalizedQuery
      : record.searchText.includes(normalizedQuery))
    const matchesRegion = !region || (record.property.region ?? record.property.location) === region
    const matchesDeveloper = !developer || record.property.developer === developer
    const matchesProject = !project || record.property.project === project
    return matchesQuery && matchesRegion && matchesDeveloper && matchesProject
  }), [developer, normalizedQuery, project, records, region])

  const routedRecord = routeCaseId
    ? records.find(({ demoCase, workspaceCaseId }) => workspaceCaseId === routeCaseId || demoCase.id === routeCaseId)
    : null
  const hasStructuredFilter = Boolean(region || developer || project)
  const displayedRecords = normalizedQuery || hasStructuredFilter
    ? filteredRecords
    : routeCaseId
      ? routedRecord ? [routedRecord] : []
      : filteredRecords
  const selectedRecord = displayedRecords.find(({ demoCase }) => demoCase.id === selectedCaseId)
    ?? displayedRecords[0]
    ?? null
  const selectedRole = roles.find(({ id }) => id === selectedRoleId) ?? roles[0]
  const canResume = Boolean(resumeRoleId && resumeRoleId === selectedRole.id)

  useEffect(() => {
    if (!routeCaseId && !routeQuery && !routeRegion && !routeDeveloper && !routeProject) return undefined
    const frame = window.requestAnimationFrame(() => selectedHeadingRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [routeCaseId, routeDeveloper, routeProject, routeQuery, routeRegion])

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
    onSearchRoute({ query, region, developer, project })
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
    setRegion('')
    setDeveloper('')
    setProject('')
    setSelectedCaseId(records[0]?.demoCase.id ?? null)
    onSearchRoute({ query: '', region: '', developer: '', project: '' })
  }

  return (
    <div className="landing-page" data-testid="landing-page">
      <button className="landing-skip" type="button" onClick={focusMain}>Bỏ qua điều hướng</button>

      <header className="landing-header">
        <div className="landing-header-inner">
          <button
            className="landing-brand-button"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })}
            aria-label="Về đầu trang VMLS"
          >
            <BrandMark inverse ariaLabel="VMLS" />
          </button>

          <div className="landing-place" aria-label="Không gian dữ liệu Hà Nội">
            <span>Sổ bộ dữ liệu</span>
            <strong>Hà Nội</strong>
          </div>

          <nav className="landing-nav" aria-label="Điều hướng trang tra cứu">
            <button type="button" onClick={() => scrollToSection('landing-records')}>Tra cứu</button>
            <button type="button" onClick={() => scrollToSection('landing-connections')}>Nguồn dữ liệu</button>
          </nav>

          <div className="landing-role-entry">
            <button
              className="landing-applications-button"
              type="button"
              onClick={() => onOpenApplications(selectedRole.id)}
              data-testid="landing-applications"
            >
              <SquaresFour aria-hidden="true" />
              <span>Ứng dụng</span>
            </button>
            <label htmlFor="landing-role"><span className="sr-only">Vai trò vào không gian làm việc</span></label>
            <select id="landing-role" value={selectedRoleId} onChange={(event) => onRoleChange(event.target.value)}>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
            </select>
            <button className="landing-enter-button" type="button" onClick={enterWorkspace} data-testid="enter-workspace">
              <span>{canResume ? 'Tiếp tục công việc' : 'Mở không gian làm việc'}</span>
              <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="landing-main" className="landing-main" tabIndex="-1">
        <section id="landing-records" className="landing-registry" aria-labelledby="landing-title">
          <header className="landing-registry-heading">
            <div>
              <p className="landing-eyebrow">Tra cứu dữ liệu VMLS</p>
              <h1 id="landing-title">Tra cứu và điều phối hồ sơ</h1>
            </div>
            <p>Bất động sản, Tin bán và Giao dịch có định danh riêng, liên kết trên cùng một hồ sơ vận hành.</p>
          </header>

          <form className="landing-search-form" role="search" onSubmit={submitSearch}>
            <label className="landing-field is-query" htmlFor="landing-search-input">
              <span>Mã định danh Bất động sản (NPID) / từ khóa</span>
              <span className="landing-input-shell">
                <MagnifyingGlass aria-hidden="true" />
                <input
                  id="landing-search-input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="NPID-HN-…"
                  autoComplete="off"
                  data-testid="landing-search"
                />
              </span>
            </label>

            <label className="landing-field" htmlFor="landing-region-filter">
              <span>Khu vực</span>
              <select id="landing-region-filter" value={region} onChange={(event) => setRegion(event.target.value)} data-testid="landing-filter-region">
                <option value="">Tất cả khu vực</option>
                {regionOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>

            <label className="landing-field" htmlFor="landing-developer-filter">
              <span>Chủ đầu tư</span>
              <select id="landing-developer-filter" value={developer} onChange={(event) => setDeveloper(event.target.value)} data-testid="landing-filter-developer">
                <option value="">Tất cả chủ đầu tư</option>
                {developerOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>

            <label className="landing-field" htmlFor="landing-project-filter">
              <span>Dự án</span>
              <select id="landing-project-filter" value={project} onChange={(event) => setProject(event.target.value)} data-testid="landing-filter-project">
                <option value="">Tất cả dự án</option>
                {projectOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>

            <button className="landing-search-submit" type="submit">Tra cứu</button>
          </form>

          <div className="landing-result-bar">
            <div>
              <strong>Kết quả tra cứu</strong>
              <span role="status" aria-live="polite">{displayedRecords.length} / {records.length} bản ghi</span>
            </div>
            {normalizedQuery || hasStructuredFilter ? <button type="button" onClick={clearSearch}>Xóa bộ lọc</button> : null}
          </div>

          <div className="landing-workbench">
            <div className="landing-table-card">
              <div className="landing-table-scroll">
                <table>
                  <thead>
                    <tr><th>Bất động sản</th><th>NPID</th><th>PLID</th><th>PTID</th><th>Trạng thái</th></tr>
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
                              <small>{record.property.project ?? record.property.type} · {record.property.location}</small>
                            </button>
                          </td>
                          <td><span className="landing-mono">{record.property.id}</span></td>
                          <td><span className={record.listing ? 'landing-mono' : 'landing-empty'}>{record.listing?.id ?? 'Chưa có'}</span></td>
                          <td><span className={record.transaction ? 'landing-mono' : 'landing-empty'}>{record.transaction?.id ?? 'Chưa có'}</span></td>
                          <td><span className={`landing-status is-${record.status.tone}`}>{record.status.label}</span></td>
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
                  <span>Kiểm tra lại NPID hoặc điều kiện tra cứu.</span>
                  <button type="button" onClick={clearSearch}>Xóa nội dung tìm kiếm</button>
                </div>
              ) : null}
            </div>

            <SelectedDossierCard
              selectedRecord={selectedRecord}
              headingRef={selectedHeadingRef}
              onOpenDossier={onOpenDossier}
              onOpenLookupRecord={onOpenLookupRecord}
              canOpenLookupRecord={canOpenLookupRecord}
              canOpenDossier={canOpenDossier}
              selectedRoleLabel={selectedRole.label}
            />
          </div>
        </section>

        {connections.length ? (
          <section id="landing-connections" className="landing-connections" aria-labelledby="landing-connections-title">
            <div className="landing-section-heading">
              <div><p>Nguồn và kênh dữ liệu</p><h2 id="landing-connections-title">Điểm nối ngoài VMLS</h2></div>
              <span>{connections.length} điểm nối</span>
            </div>

            <div className="landing-connection-list">
              {connections.map((connection) => {
                const Icon = CONNECTION_ICONS[connection.id] ?? Signpost
                return (
                  <article className="landing-connection-card" key={connection.id} data-testid={`landing-connection-${connection.id}`}>
                    <div className="landing-connection-heading">
                      {connection.icon ? <img src={connection.icon} alt="" /> : <span className="landing-connection-icon"><Icon aria-hidden="true" /></span>}
                      <div><small>{connection.relationship}</small><h3>{connection.name}</h3></div>
                    </div>
                    <div className="landing-connection-direction"><span>Chiều dữ liệu</span><strong>{connection.direction}</strong></div>
                    <span className={`landing-status is-${connectionTone(connection.status)}`}>{connection.status}</span>
                    <button className="landing-preview-button" type="button" onClick={(event) => openConnection(connection, event.currentTarget)}>
                      {connectionActionLabel(connection.id)} <ArrowRight weight="bold" aria-hidden="true" />
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="landing-footer">
        <BrandMark compact ariaLabel="VMLS" />
        <span>Sổ bộ dữ liệu · Hà Nội</span>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })}>Về đầu trang</button>
      </footer>

      <ConnectionDrawer connection={previewConnection} onClose={closeConnection} />
    </div>
  )
}

export default LandingPage
