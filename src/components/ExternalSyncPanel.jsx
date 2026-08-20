import {
  ArrowClockwise,
  CheckCircle,
  Clock,
  Database,
  FileArrowDown,
  Warning,
} from '@phosphor-icons/react'
import '../styles/governance.css'

function normalizeStatusId(item) {
  if (['pending', 'processing', 'supplement', 'completed'].includes(item.statusId)) return item.statusId
  const value = String(item.normalizedStatus ?? item.status ?? '').toLocaleLowerCase('vi')
  if (value.includes('bổ sung')) return 'supplement'
  if (value.includes('đã xử lý') || value.includes('hoàn tất')) return 'completed'
  if (value.includes('đang xử lý')) return 'processing'
  return 'pending'
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

function statusIcon(statusId) {
  if (statusId === 'completed') return CheckCircle
  if (statusId === 'supplement') return Warning
  if (statusId === 'processing') return ArrowClockwise
  return Clock
}

function sourceCode(item) {
  return item.source ?? item.sourceId ?? item.id
}

function sourceCaseId(item, parentCaseId) {
  return item.caseId ?? item.sourceCaseId ?? parentCaseId
}

/**
 * VMLS-only operational panel for consuming the next configured source event per case/source.
 */
export function ExternalSyncPanel({
  caseId,
  sources = [],
  onReceiveNext,
  disabled = false,
}) {
  return (
    <section className="gov-sync-panel" aria-labelledby="external-sync-panel-title" data-testid="external-sync-panel">
      <header className="gov-section-heading">
        <div>
          <span className="gov-eyebrow">Kết nối theo hồ sơ</span>
          <h2 id="external-sync-panel-title">Trạng thái từ các đơn vị xử lý</h2>
        </div>
        <span className="gov-mono">{caseId}</span>
      </header>
      <p className="gov-section-intro">Mỗi cập nhật được ghi theo hệ thống nguồn và thời điểm VMLS tiếp nhận.</p>

      <div className="gov-sync-sources">
        {sources.map((item) => {
          const statusId = normalizeStatusId(item)
          const StatusIcon = statusIcon(statusId)
          const canReceive = item.canReceive !== false && Boolean(item.nextEventLabel)
          return (
            <article key={sourceCode(item)} className="gov-sync-source">
              <header>
                <span className={`gov-sync-source__icon gov-sync-source__icon--${statusId}`} aria-hidden="true">
                  <StatusIcon />
                </span>
                <div>
                  <span>{item.sourceSystem ?? 'Hệ thống nguồn'}</span>
                  <h3>{item.sourceLabel ?? item.label}</h3>
                </div>
                <span className={`gov-status gov-status--${statusId}`}>
                  {item.normalizedStatus ?? item.status ?? 'Chờ tiếp nhận'}
                </span>
              </header>

              <dl>
                <div><dt>Đơn vị đang xử lý</dt><dd>{item.processingOrganization ?? 'Chưa xác định'}</dd></div>
                <div><dt>Trạng thái tại nguồn</dt><dd>{item.rawStatus ?? item.normalizedStatus ?? 'Chưa có'}</dd></div>
                <div><dt>Cập nhật tại nguồn</dt><dd className="gov-mono">{formatTimestamp(item.sourceUpdatedAt)}</dd></div>
                <div><dt>VMLS nhận lúc</dt><dd className="gov-mono">{formatTimestamp(item.receivedAt ?? item.vmlsReceivedAt)}</dd></div>
              </dl>

              {canReceive ? (
                <div className="gov-sync-next">
                  <span><FileArrowDown aria-hidden="true" /> Bản tin tiếp theo</span>
                  <strong>{item.nextEventLabel}</strong>
                  <button
                    className="gov-button gov-button--secondary"
                    type="button"
                    disabled={disabled || item.receiving}
                    onClick={() => onReceiveNext?.({
                      caseId: sourceCaseId(item, caseId),
                      source: sourceCode(item),
                    })}
                  >
                    <ArrowClockwise aria-hidden="true" />
                    {item.receiving ? 'Đang nhận' : 'Nhận cập nhật'}
                  </button>
                </div>
              ) : (
                <div className="gov-sync-current">
                  <Database aria-hidden="true" />
                  <span>{statusId === 'completed' ? 'Đã nhận bản tin mới nhất' : 'Chưa có bản tin tiếp theo'}</span>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {!sources.length ? (
        <div className="gov-empty-state">
          <Database aria-hidden="true" />
          <strong>Chưa có kết nối theo hồ sơ</strong>
          <span>Các nguồn sẽ xuất hiện sau khi hồ sơ được bàn giao.</span>
        </div>
      ) : null}
    </section>
  )
}

export default ExternalSyncPanel
