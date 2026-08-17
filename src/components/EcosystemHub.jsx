import {
  ArrowRight,
  Bank,
  Broadcast,
  Buildings,
  Database,
  FileText,
  Handshake,
  HouseLine,
  IdentificationCard,
  MagnifyingGlass,
  PlugsConnected,
  SealCheck,
  Signpost,
  Storefront,
} from '@phosphor-icons/react'
import '../styles/marketplace.css'

function interactionMode(item) {
  const value = item.interaction ?? item.mode ?? item.availability
  if (['implemented', 'interactive', 'available'].includes(value)) return 'implemented'
  if (['readOnly', 'read-only', 'preview'].includes(value)) return 'readOnly'
  if (['eventOnly', 'event-only', 'event'].includes(value)) return 'eventOnly'
  if (['unavailable', 'disabled'].includes(value)) return 'unavailable'
  if (item.route) return 'implemented'
  if (item.screenshot || item.preview) return 'readOnly'
  return 'unavailable'
}

function statusLabel(item, mode) {
  if (item.status) return item.status
  if (mode === 'implemented') return 'Có thể thao tác'
  if (mode === 'readOnly') return 'Có dữ liệu để xem'
  if (mode === 'eventOnly') return 'Chỉ nhận sự kiện'
  return 'Chưa khả dụng'
}

function IconGlyph({ item }) {
  const name = item.iconName ?? item.id
  if (name === 'bank') return <Bank />
  if (['brokerage', 'developer'].includes(name)) return <Buildings />
  if (['database', 'source-357'].includes(name)) return <Database />
  if (name === 'document') return <FileText />
  if (name === 'housenow') return <Storefront />
  if (name === 'listing') return <Signpost />
  if (name === 'listing-distribution') return <Broadcast />
  if (name === 'notary') return <SealCheck />
  if (['property', 'property-registry', 'showings'].includes(name)) return <HouseLine />
  if (['representation', 'co-broker-registration', 'transactions'].includes(name)) return <Handshake />
  if (['search', 'maps'].includes(name)) return <MagnifyingGlass />
  if (['work-queue', 'transaction-room', 'tax'].includes(name)) return <FileText />
  if (name === 'represented-inventory') return <Signpost />
  if (name === 'cma') return <Database />
  if (name === 'land-registry') return <Database />
  if (name === 'developer-contract') return <Buildings />
  if (name === 'vneid') return <IdentificationCard />
  return <PlugsConnected />
}

function roleIdOf(role) {
  return typeof role === 'string' ? role : role?.id
}

function roleLabelOf(role) {
  return typeof role === 'string' ? role : role?.label ?? 'Vai trò hiện tại'
}

function isForRole(capability, roleId) {
  const allowedRoles = capability.roles ?? capability.roleIds
  if (!allowedRoles?.length) return true
  return allowedRoles.includes(roleId)
}

function CapabilityItem({ capability, onNavigate, onPreviewConnection }) {
  const mode = interactionMode(capability)
  const capabilityName = capability.name ?? capability.label
  const actionLabel = capability.actionLabel
    ?? (mode === 'implemented' ? 'Mở ứng dụng' : 'Xem phạm vi dữ liệu')
  const content = (
    <>
      <span className="ecosystem-item__icon" aria-hidden="true"><IconGlyph item={capability} /></span>
      <span className="ecosystem-item__copy">
        <span className="ecosystem-item__category">{capability.category ?? 'Ứng dụng VMLS'}</span>
        <strong>{capabilityName}</strong>
        {capability.description ?? capability.purpose ? (
          <span>{capability.description ?? capability.purpose}</span>
        ) : null}
      </span>
      <span className={`ecosystem-state ecosystem-state--${mode}`}>{statusLabel(capability, mode)}</span>
    </>
  )

  if (mode === 'implemented') {
    return (
      <article className="ecosystem-item ecosystem-item--actionable">
        <div className="ecosystem-item__body">{content}</div>
        <button
          className="ecosystem-open-action"
          type="button"
          aria-label={`${actionLabel}: ${capabilityName}`}
          onClick={() => onNavigate?.(capability.route ?? capability.id, capability)}
        >
          {actionLabel}<ArrowRight weight="bold" aria-hidden="true" />
        </button>
      </article>
    )
  }

  if (mode === 'readOnly') {
    return (
      <article className="ecosystem-item ecosystem-item--actionable">
        <div className="ecosystem-item__body">{content}</div>
        <button
          className="ecosystem-preview-action"
          type="button"
          aria-label={`${actionLabel}: ${capabilityName}`}
          onClick={() => onPreviewConnection?.(capability.connectionId ?? capability.id, capability)}
        >
          {actionLabel}<ArrowRight weight="bold" aria-hidden="true" />
        </button>
      </article>
    )
  }

  return <article className="ecosystem-item"><div className="ecosystem-item__body">{content}</div></article>
}

function ConnectionItem({ connection, onPreviewConnection }) {
  const mode = interactionMode(connection)
  const previewable = mode === 'readOnly' || mode === 'implemented'
  const connectionName = connection.name ?? connection.label
  const actionLabel = connection.actionLabel ?? 'Xem phạm vi dữ liệu'

  return (
    <article className={`ecosystem-flow${previewable ? ' ecosystem-flow--previewable' : ''}`}>
      <header>
        {connection.icon ? (
          <img className="ecosystem-flow__logo" src={connection.icon} alt="" />
        ) : (
          <span className="ecosystem-flow__icon" aria-hidden="true"><IconGlyph item={connection} /></span>
        )}
        <div>
          <span>{connection.relationship ?? connection.category ?? 'Điểm trao đổi dữ liệu'}</span>
          <h3>{connectionName}</h3>
        </div>
        <span className={`ecosystem-state ecosystem-state--${mode}`}>{statusLabel(connection, mode)}</span>
      </header>

      <dl className="ecosystem-flow__facts">
        <div><dt>Đơn vị</dt><dd>{connection.owner ?? 'Chưa xác định'}</dd></div>
        <div><dt>Chiều dữ liệu</dt><dd>{connection.direction ?? 'Chưa xác định'}</dd></div>
      </dl>

      {previewable ? (
        <button
          className="ecosystem-preview-action"
          type="button"
          aria-label={`${actionLabel}: ${connectionName}`}
          onClick={() => onPreviewConnection?.(connection.id, connection)}
        >
          {actionLabel}
          <ArrowRight weight="bold" aria-hidden="true" />
        </button>
      ) : null}
    </article>
  )
}

/**
 * Danh mục ứng dụng theo vai trò và các điểm trao đổi dữ liệu của hệ sinh thái.
 * Domain state and navigation are owned by the caller.
 */
export function EcosystemHub({
  role,
  capabilities = [],
  connections = [],
  onNavigate,
  onPreviewConnection,
}) {
  const roleId = roleIdOf(role)
  const roleCapabilities = capabilities.filter((capability) => isForRole(capability, roleId))
  const interactiveCount = roleCapabilities.filter(
    (capability) => interactionMode(capability) === 'implemented',
  ).length

  return (
    <div className="ecosystem-hub" data-testid="ecosystem-hub">
      <header className="market-page-heading ecosystem-heading">
        <div>
          <span className="market-eyebrow">Danh mục chức năng</span>
          <h1>Ứng dụng và luồng dữ liệu</h1>
          <p>{roleLabelOf(role)} · Chức năng được sắp theo quyền sử dụng và trạng thái hiện tại.</p>
        </div>
        <dl className="ecosystem-heading__counts" aria-label="Tổng quan danh mục">
          <div><dt>Ứng dụng sử dụng được</dt><dd>{interactiveCount}</dd></div>
          <div><dt>Điểm trao đổi dữ liệu</dt><dd>{connections.length}</dd></div>
        </dl>
      </header>

      <section className="ecosystem-section" aria-labelledby="role-applications-title">
        <header className="market-section-heading">
          <div>
            <span className="market-eyebrow">Theo vai trò</span>
            <h2 id="role-applications-title">Công cụ của {roleLabelOf(role)}</h2>
          </div>
          <span>{roleCapabilities.length} chức năng</span>
        </header>

        {roleCapabilities.length ? (
          <div className="ecosystem-grid ecosystem-grid--applications">
            {roleCapabilities.map((capability) => (
              <CapabilityItem
                key={capability.id}
                capability={capability}
                onNavigate={onNavigate}
                onPreviewConnection={onPreviewConnection}
              />
            ))}
          </div>
        ) : (
          <div className="market-empty-state">
            <strong>Chưa có chức năng cho vai trò này</strong>
            <span>Chọn vai trò khác để xem phạm vi công việc tương ứng.</span>
          </div>
        )}
      </section>

      <section className="ecosystem-section" aria-labelledby="data-flows-title">
        <header className="market-section-heading">
          <div>
            <span className="market-eyebrow">Hệ sinh thái</span>
            <h2 id="data-flows-title">Ứng dụng bên ngoài và luồng dữ liệu</h2>
          </div>
          <span>{connections.length} điểm kết nối</span>
        </header>

        <div className="ecosystem-grid ecosystem-grid--flows">
          {connections.map((connection) => (
            <ConnectionItem
              key={connection.id}
              connection={connection}
              onPreviewConnection={onPreviewConnection}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default EcosystemHub
