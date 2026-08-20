import { useId } from 'react'
import {
  ArrowRight,
  ClockCounterClockwise,
  Funnel,
  MagnifyingGlass,
  SealCheck,
} from '@phosphor-icons/react'
import '../styles/governance.css'

const EXTERNAL_STATUS_OPTIONS = Object.freeze([
  { id: 'all', label: 'Tất cả trạng thái' },
  { id: 'pending', label: 'Chờ tiếp nhận' },
  { id: 'processing', label: 'Đang xử lý' },
  { id: 'supplement', label: 'Yêu cầu bổ sung' },
  { id: 'completed', label: 'Đã xử lý' },
])

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi')
}

function caseIdOf(item) {
  return item.sourceCaseId ?? item.caseId ?? item.id
}

function npidOf(item) {
  return item.npid ?? item.propertyId
}

function ptidOf(item) {
  return item.ptid ?? item.transactionId
}

function canonicalStatusId(item) {
  const explicit = item.normalizedStatusId ?? item.statusId
  if (['pending', 'processing', 'supplement', 'completed'].includes(explicit)) return explicit

  const status = normalize(item.normalizedStatus ?? item.status)
  if (status.includes('bo sung')) return 'supplement'
  if (status.includes('da xu ly') || status.includes('hoan tat') || status.includes('da hoan thanh')) return 'completed'
  if (status.includes('dang xu ly') || status.includes('dang tham dinh')) return 'processing'
  return 'pending'
}

function statusLabel(item) {
  return item.normalizedStatus ?? item.status ?? EXTERNAL_STATUS_OPTIONS.find(
    (option) => option.id === canonicalStatusId(item),
  )?.label ?? 'Chờ tiếp nhận'
}

function formatTimestamp(value) {
  if (!value) return 'Chưa có'
  if (typeof value !== 'string' || !value.includes('T')) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parsed)
}

function matchesSearch(item, query) {
  if (!query.trim()) return true
  const searchable = [
    caseIdOf(item),
    npidOf(item),
    ptidOf(item),
    item.propertyLabel,
    item.processingOrganization,
    item.sourceSystem,
  ].map(normalize).join(' ')
  return searchable.includes(normalize(query.trim()))
}

function ExternalCaseDetail({ item, authorityLabel }) {
  if (!item) {
    return (
      <section className="gov-external-detail gov-empty-state" aria-live="polite">
        <strong>Chọn một hồ sơ để xem chi tiết</strong>
        <span>Thông tin nguồn và lịch sử đồng bộ sẽ hiển thị tại đây.</span>
      </section>
    )
  }

  const events = item.events ?? item.statusEvents ?? item.history ?? []
  return (
    <section className="gov-external-detail" aria-labelledby="external-case-detail-title">
      <header className="gov-section-heading">
        <div>
          <span className="gov-eyebrow">Chi tiết hồ sơ nguồn</span>
          <h2 id="external-case-detail-title">{caseIdOf(item)}</h2>
        </div>
        <span className={`gov-status gov-status--${canonicalStatusId(item)}`}>{statusLabel(item)}</span>
      </header>

      <dl className="gov-detail-grid">
        <div><dt>Mã hồ sơ nguồn</dt><dd className="gov-mono">{caseIdOf(item)}</dd></div>
        <div><dt>Mã định danh Bất động sản</dt><dd className="gov-mono">{npidOf(item) ?? 'Chưa có'}</dd></div>
        <div><dt>Mã giao dịch</dt><dd className="gov-mono">{ptidOf(item) ?? 'Chưa có'}</dd></div>
        <div><dt>Bất động sản</dt><dd>{item.propertyLabel ?? 'Chưa có'}</dd></div>
        <div><dt>Đơn vị đang xử lý</dt><dd>{item.processingOrganization ?? authorityLabel}</dd></div>
        <div><dt>Hệ thống nguồn</dt><dd>{item.sourceSystem ?? `Hệ thống của ${authorityLabel}`}</dd></div>
        <div><dt>Trạng thái tại nguồn</dt><dd>{item.rawStatus ?? statusLabel(item)}</dd></div>
        <div><dt>Cập nhật tại nguồn</dt><dd className="gov-mono">{formatTimestamp(item.sourceUpdatedAt)}</dd></div>
        <div><dt>VMLS nhận lúc</dt><dd className="gov-mono">{formatTimestamp(item.receivedAt ?? item.vmlsReceivedAt)}</dd></div>
      </dl>

      <div className="gov-source-timeline">
        <h3>Lịch sử trạng thái</h3>
        {events.length ? (
          <ol>
            {events.map((event) => (
              <li key={event.id ?? `${event.status}-${event.sourceUpdatedAt}`}>
                <span aria-hidden="true" />
                <div>
                  <strong>{event.normalizedStatus ?? event.status}</strong>
                  {event.rawStatus && event.rawStatus !== event.normalizedStatus ? <p>Trạng thái nguồn: {event.rawStatus}</p> : null}
                  <small>{event.processingOrganization ?? item.processingOrganization} · <time>{formatTimestamp(event.sourceUpdatedAt)}</time></small>
                </div>
              </li>
            ))}
          </ol>
        ) : <p>Chưa có lịch sử trạng thái được đồng bộ.</p>}
      </div>
    </section>
  )
}

/**
 * Read-only source-system queue for VPCC, VPĐKĐĐ, or Cơ quan thuế.
 */
export function ExternalProgressWorkspace({
  authorityLabel = 'Đơn vị xử lý',
  authorityCode,
  cases = [],
  selectedCaseId,
  statusFilter = 'all',
  searchQuery = '',
  onStatusFilterChange,
  onSearchChange,
  onSelectCase,
}) {
  const searchId = useId()
  const statusId = useId()
  const visibleCases = cases.filter((item) => (
    (statusFilter === 'all' || canonicalStatusId(item) === statusFilter)
    && matchesSearch(item, searchQuery)
  ))
  const selectedCase = visibleCases.find((item) => caseIdOf(item) === selectedCaseId)

  return (
    <div className="gov-external-workspace" data-testid={`external-workspace-${authorityCode ?? 'authority'}`}>
      <header className="gov-page-heading gov-page-heading--external">
        <div>
          <span className="gov-eyebrow">Hồ sơ đồng bộ</span>
          <h1>{authorityLabel}</h1>
          <p>Theo dõi hồ sơ và trạng thái được ghi nhận từ hệ thống nguồn.</p>
        </div>
        <dl className="gov-heading-metrics" aria-label="Tổng quan hàng đợi">
          <div><dt>Tổng hồ sơ</dt><dd>{cases.length}</dd></div>
          <div><dt>Đang xử lý</dt><dd>{cases.filter((item) => canonicalStatusId(item) === 'processing').length}</dd></div>
          <div><dt>Cần bổ sung</dt><dd>{cases.filter((item) => canonicalStatusId(item) === 'supplement').length}</dd></div>
        </dl>
      </header>

      <section className="gov-external-queue" aria-labelledby="external-queue-title">
        <header className="gov-section-heading">
          <div>
            <span className="gov-eyebrow">Danh sách hồ sơ</span>
            <h2 id="external-queue-title">Hồ sơ theo trạng thái nguồn</h2>
          </div>
          <span className="gov-result-count">{visibleCases.length} kết quả</span>
        </header>

        <div className="gov-external-filters">
          <label htmlFor={searchId} className="gov-search-control">
            <MagnifyingGlass aria-hidden="true" />
            <span className="sr-only">Tra cứu hồ sơ</span>
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Mã hồ sơ, NPID, PTID hoặc Bất động sản"
              autoComplete="off"
            />
          </label>
          <label htmlFor={statusId} className="gov-select-control">
            <Funnel aria-hidden="true" />
            <span className="sr-only">Lọc theo trạng thái</span>
            <select
              id={statusId}
              value={statusFilter}
              onChange={(event) => onStatusFilterChange?.(event.target.value)}
            >
              {EXTERNAL_STATUS_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {visibleCases.length ? (
          <div className="gov-table-wrap">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>Mã hồ sơ nguồn</th>
                  <th>Định danh</th>
                  <th>Bất động sản</th>
                  <th>Trạng thái</th>
                  <th>Đơn vị đang xử lý</th>
                  <th>Cập nhật nguồn</th>
                  <th>VMLS nhận</th>
                  <th><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleCases.map((item) => (
                  <tr key={caseIdOf(item)} className={caseIdOf(item) === selectedCaseId ? 'is-selected' : ''}>
                    <td data-label="Mã hồ sơ nguồn"><span className="gov-mono">{caseIdOf(item)}</span></td>
                    <td data-label="Định danh">
                      <span className="gov-mono">{npidOf(item) ?? 'Chưa có NPID'}</span>
                      <small className="gov-mono">{ptidOf(item) ?? 'Chưa có PTID'}</small>
                    </td>
                    <td data-label="Bất động sản"><strong>{item.propertyLabel}</strong></td>
                    <td data-label="Trạng thái"><span className={`gov-status gov-status--${canonicalStatusId(item)}`}>{statusLabel(item)}</span></td>
                    <td data-label="Đơn vị đang xử lý">{item.processingOrganization ?? authorityLabel}</td>
                    <td data-label="Cập nhật nguồn"><time className="gov-mono">{formatTimestamp(item.sourceUpdatedAt)}</time></td>
                    <td data-label="VMLS nhận"><time className="gov-mono">{formatTimestamp(item.receivedAt ?? item.vmlsReceivedAt)}</time></td>
                    <td className="gov-table-action">
                      <button type="button" onClick={() => onSelectCase?.(caseIdOf(item))}>
                        Xem chi tiết <ArrowRight aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gov-empty-state">
            <MagnifyingGlass aria-hidden="true" />
            <strong>Không tìm thấy hồ sơ</strong>
            <span>Thay đổi từ khóa hoặc trạng thái để xem kết quả khác.</span>
          </div>
        )}
      </section>

      <div className="gov-readonly-marker">
        <SealCheck aria-hidden="true" />
        <span><strong>Dữ liệu theo dõi</strong> · Nghiệp vụ được xử lý tại hệ thống của {authorityLabel}.</span>
        <ClockCounterClockwise aria-hidden="true" />
      </div>

      <ExternalCaseDetail item={selectedCase} authorityLabel={authorityLabel} />
    </div>
  )
}

export default ExternalProgressWorkspace
