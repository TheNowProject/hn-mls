import {
  ArrowRight,
  CheckCircle,
  Clock,
  Warning,
} from '@phosphor-icons/react'
import '../styles/governance.css'

function normalizeStatusId(value) {
  const normalized = String(value ?? '').toLocaleLowerCase('vi')
  if (normalized.includes('bổ sung')) return 'supplement'
  if (normalized.includes('đã xử lý') || normalized.includes('hoàn tất') || normalized.includes('đã hoàn thành')) return 'completed'
  if (normalized.includes('đang xử lý')) return 'processing'
  return 'pending'
}

function formatTimestamp(value) {
  if (!value) return 'Chưa có thời điểm'
  if (typeof value !== 'string' || !value.includes('T')) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parsed)
}

function TimelineIcon({ status }) {
  const statusId = normalizeStatusId(status)
  if (statusId === 'completed') return <CheckCircle weight="fill" aria-hidden="true" />
  if (statusId === 'supplement') return <Warning weight="fill" aria-hidden="true" />
  return <Clock aria-hidden="true" />
}

export function ProcessingTimeline({ events = [], title = 'Lịch sử đồng bộ tiến độ' }) {
  return (
    <section className="gov-processing-timeline" aria-labelledby="processing-timeline-title">
      <header>
        <h3 id="processing-timeline-title">{title}</h3>
        <span>{events.length} cập nhật</span>
      </header>
      {events.length ? (
        <ol>
          {events.map((event) => (
            <li key={event.id ?? `${event.source}-${event.receivedAt ?? event.sourceUpdatedAt}`}>
              <span className={`gov-timeline-node gov-timeline-node--${normalizeStatusId(event.status ?? event.normalizedStatus)}`}>
                <TimelineIcon status={event.status ?? event.normalizedStatus} />
              </span>
              <div>
                <strong>{event.milestone ?? event.sourceLabel ?? event.source}</strong>
                <p>{event.normalizedStatus ?? event.status}</p>
                <small>{event.processingOrganization ?? 'Chưa xác định đơn vị'} · <time>{formatTimestamp(event.receivedAt ?? event.sourceUpdatedAt)}</time></small>
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="gov-muted-copy">Chưa có cập nhật từ đơn vị xử lý.</p>}
    </section>
  )
}

/** Compact milestone + source status + processor projection for market-role views. */
export function ProcessingSummary({ projection, events = [], showTimeline = true }) {
  if (!projection) {
    return (
      <section className="gov-processing-summary gov-empty-state" aria-live="polite">
        <strong>Chưa xác định đơn vị xử lý</strong>
        <span>Tiến độ sẽ xuất hiện sau khi hồ sơ được bàn giao.</span>
      </section>
    )
  }

  const status = projection.normalizedStatus ?? projection.status ?? 'Chờ tiếp nhận'
  const statusId = normalizeStatusId(status)
  return (
    <section className="gov-processing-summary" aria-labelledby="processing-summary-title" data-testid="processing-summary">
      <header>
        <div>
          <span className="gov-eyebrow">Tiến độ hồ sơ</span>
          <h2 id="processing-summary-title">{projection.milestone ?? projection.sourceLabel ?? 'Chưa có mốc xử lý'}</h2>
        </div>
        <span className={`gov-status gov-status--${statusId}`}>{status}</span>
      </header>
      <dl>
        <div>
          <dt>Đơn vị đang xử lý</dt>
          <dd>{projection.processingOrganization ?? 'Chưa xác định'}</dd>
        </div>
        <div>
          <dt>Cập nhật gần nhất</dt>
          <dd className="gov-mono">{formatTimestamp(projection.receivedAt ?? projection.sourceUpdatedAt)}</dd>
        </div>
        {projection.nextMilestone ? (
          <div>
            <dt>Mốc tiếp theo</dt>
            <dd>{projection.nextMilestone} <ArrowRight aria-hidden="true" /></dd>
          </div>
        ) : null}
      </dl>
      {showTimeline ? <ProcessingTimeline events={events} /> : null}
    </section>
  )
}

export default ProcessingSummary
