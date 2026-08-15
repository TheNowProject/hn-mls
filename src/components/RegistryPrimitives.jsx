import {
  ArrowRight,
  CheckCircle,
  Clock,
  LockKey,
  Warning,
} from '@phosphor-icons/react'

export function StatusPill({ tone = 'neutral', children }) {
  return <span className={`status-pill status-${tone}`}>{children}</span>
}

export function FieldGrid({ children, className = '' }) {
  return <dl className={`field-grid ${className}`}>{children}</dl>
}

export function Field({ label, value, mono = false, privacy }) {
  return (
    <div className="field">
      <dt>{label}</dt>
      <dd className={mono ? 'mono' : ''}>{value ?? 'Chưa có'}</dd>
      {privacy ? <small><LockKey aria-hidden="true" /> {privacy}</small> : null}
    </div>
  )
}

export function Checklist({ items = [] }) {
  return (
    <ul className="checklist">
      {items.map((item) => {
        const normalized = typeof item === 'string' ? { label: item, state: 'done' } : item
        const state = normalized.state ?? 'done'
        const Icon = state === 'warning' ? Warning : state === 'pending' ? Clock : CheckCircle
        const stateLabel = normalized.stateLabel
          ?? (state === 'done' ? 'Đã có' : state === 'warning' ? 'Còn thiếu' : 'Đang chờ')
        return (
          <li key={normalized.id ?? normalized.label} className={`check-${state}`}>
            <Icon weight={state === 'done' ? 'fill' : 'regular'} aria-hidden="true" />
            <span>{normalized.label}</span>
            <small>{stateLabel}</small>
          </li>
        )
      })}
    </ul>
  )
}

export function ActionButton({
  children,
  onClick,
  secondary = false,
  danger = false,
  disabled = false,
  icon: Icon = ArrowRight,
  type = 'button',
  testId,
}) {
  return (
    <button
      className={`action-button${secondary ? ' action-secondary' : ''}${danger ? ' action-danger' : ''}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      <span>{children}</span>
      {Icon ? <Icon weight="bold" aria-hidden="true" /> : null}
    </button>
  )
}
