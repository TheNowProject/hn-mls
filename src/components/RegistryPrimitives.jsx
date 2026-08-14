import {
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  Info,
  LockKey,
  ShieldCheck,
  Warning,
} from '@phosphor-icons/react'

export function StatusPill({ tone = 'neutral', children, icon: Icon }) {
  return (
    <span className={`status-pill status-${tone}`}>
      {Icon ? <Icon weight="fill" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export function EvidenceBadge({ label = 'MÔ PHỎNG ĐỀ XUẤT' }) {
  const translations = {
    FACT: 'ĐÃ KIỂM CHỨNG',
    'SOURCE CLAIM': 'TUYÊN BỐ TỪ NGUỒN',
    INFERENCE: 'NHẬN ĐỊNH TỪ BẰNG CHỨNG',
    PROPOSAL: 'MÔ PHỎNG ĐỀ XUẤT',
    'OPEN QUESTION': 'CẦN XÁC NHẬN',
  }
  const translatedLabel = Object.entries(translations).reduce(
    (current, [code, translation]) => current.replace(code, translation),
    label,
  )
  return (
    <span className="evidence-badge">
      <Info weight="fill" aria-hidden="true" />
      {translatedLabel}
    </span>
  )
}

export function IdentifierCard({ label, value, detail, tone = 'green', empty = false }) {
  return (
    <article className={`identifier-card identifier-${tone}${empty ? ' identifier-empty' : ''}`}>
      <span>{label}</span>
      <strong>{value || 'Chưa cấp mã'}</strong>
      <small>{detail}</small>
    </article>
  )
}

export function SimulationNotice({ children, compact = false }) {
  return (
    <div className={`simulation-notice${compact ? ' compact' : ''}`} role="note">
      <ShieldCheck aria-hidden="true" />
      <div>
        <strong>Mô phỏng đề xuất</strong>
        <span>{children}</span>
      </div>
    </div>
  )
}

export function ProgressRail({ items, currentId, completedIds = [] }) {
  const currentIndex = items.findIndex((item) => item.id === currentId)
  return (
    <ol className="progress-rail" aria-label="Tiến trình hồ sơ">
      {items.map((item, index) => {
        const isDone = completedIds.includes(item.id) || index < currentIndex
        const isCurrent = item.id === currentId
        return (
          <li key={item.id} className={`${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}>
            <span className="progress-dot" aria-hidden="true">
              {isDone ? <Check weight="bold" /> : item.short || index + 1}
            </span>
            <span className="progress-copy">
              <small>{item.eyebrow}</small>
              <strong>{item.label}</strong>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function FieldGrid({ children, className = '' }) {
  return <dl className={`field-grid ${className}`}>{children}</dl>
}

export function Field({ label, value, mono = false, privacy }) {
  return (
    <div className="field">
      <dt>{label}</dt>
      <dd className={mono ? 'mono' : ''}>{value}</dd>
      {privacy ? <small><LockKey aria-hidden="true" /> {privacy}</small> : null}
    </div>
  )
}

export function Checklist({ items }) {
  return (
    <ul className="checklist">
      {items.map((item) => {
        const state = typeof item === 'string' ? 'done' : item.state || 'done'
        const label = typeof item === 'string' ? item : item.label
        const Icon = state === 'warning' ? Warning : state === 'pending' ? Clock : CheckCircle
        return (
          <li key={label} className={`check-${state}`}>
            <Icon weight={state === 'done' ? 'fill' : 'regular'} aria-hidden="true" />
            <span>{label}</span>
            <small>{state === 'done' ? 'Đủ điều kiện' : state === 'warning' ? 'Cần bổ sung' : 'Đang chờ'}</small>
          </li>
        )
      })}
    </ul>
  )
}

export function RegistryTimeline({ events = [], emptyCopy = 'Chưa có sự kiện nào được ghi nhận.' }) {
  if (!events.length) return <p className="empty-copy">{emptyCopy}</p>
  return (
    <ol className="registry-timeline">
      {[...events].reverse().map((event, index) => (
        <li key={event.id || `${event.action}-${index}`}>
          <span className="timeline-marker" aria-hidden="true" />
          <div>
            <small>{event.time || event.at}</small>
            <strong>{event.label || event.action}</strong>
            <p>{event.detail || event.reason}</p>
            {event.actor ? <span>{event.actor}</span> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function ActionButton({ children, onClick, secondary = false, disabled = false, icon: Icon = ArrowRight, testId }) {
  return (
    <button
      className={`action-button${secondary ? ' action-secondary' : ''}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      <span>{children}</span>
      {Icon ? <Icon weight="bold" aria-hidden="true" /> : null}
    </button>
  )
}
