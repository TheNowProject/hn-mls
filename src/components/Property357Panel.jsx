import {
  Buildings,
  CheckCircle,
  Database,
  MapPin,
  Ruler,
} from '@phosphor-icons/react'
import { HOUSING_MARKET_INFORMATION_SYSTEM_NAME } from '../demo/v5Data.js'
import '../styles/governance.css'

function pick(object, ...paths) {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], object)
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
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

function formatAreaClaim(claim) {
  if (typeof claim === 'string') return claim
  if (!Number.isFinite(claim?.value)) return undefined
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(claim.value)} ${claim.unit ?? 'm²'}${claim.concept ? ` · ${claim.concept}` : ''}`
}

/**
 * Explicit safe projection of one 357 Property source record.
 * Owner identity and private transaction fields are intentionally unsupported.
 */
export function Property357Panel({ record, compact = false }) {
  if (!record) {
    return (
      <section className="gov-357-panel gov-empty-state" aria-live="polite">
        <Database aria-hidden="true" />
        <strong>Chưa có dữ liệu Bất động sản từ {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</strong>
        <span>Hồ sơ chưa nhận được bản ghi nguồn tương ứng.</span>
      </section>
    )
  }

  const claims = Array.isArray(record.claims) ? record.claims : []
  const claimValue = (field) => claims.find((claim) => claim.field === field)?.value
  const npid = pick(record, 'npid', 'propertyId')
  const sourceKey = pick(record, 'sourceRecordId', 'sourceRecordKey', 'source.key', 'source.recordId')
  const version = pick(record, 'version', 'source.version')
  const sourceUpdatedAt = pick(record, 'sourceUpdatedAt', 'source.updatedAt')
  const receivedAt = pick(record, 'receivedAt', 'vmlsReceivedAt', 'synchronizedAt', 'source.receivedAt')
  const projectName = pick(record, 'projectName', 'property.projectName', 'project.name') ?? claimValue('project')
  const developerName = pick(record, 'developerName', 'property.developerName', 'project.developerName', 'project.developer.name') ?? claimValue('developer')
  const sourceAreaClaims = claims.filter((claim) => claim.field === 'area').map((claim) => claim.value)
  const areaClaims = pick(record, 'areaClaims', 'property.areaClaims')
    ?? (sourceAreaClaims.length ? sourceAreaClaims : [pick(record, 'area', 'property.area')].filter(Boolean))
  const directLocation = pick(record, 'location', 'locationDisplay', 'property.location.display')
    ?? claimValue('location')
  const location = typeof directLocation === 'string'
    ? directLocation
    : [
        directLocation?.ward ?? pick(record, 'ward', 'property.location.ward'),
        directLocation?.district ?? pick(record, 'district', 'property.location.district'),
        directLocation?.province ?? directLocation?.city ?? pick(record, 'province', 'city', 'property.location.city'),
      ].filter(Boolean).join(', ')
  const buildingUnit = [
    pick(record, 'buildingCode', 'buildingName', 'property.buildingCode') ?? claimValue('building'),
    pick(record, 'unitCode', 'property.unitCode', 'property.unitLabel') ?? claimValue('unit'),
  ].filter(Boolean).join(' · ')

  return (
    <section className={`gov-357-panel${compact ? ' gov-357-panel--compact' : ''}`} aria-labelledby="property-357-title" data-testid="property-357-panel">
      <header className="gov-section-heading">
        <div>
          <span className="gov-eyebrow">Nguồn dữ liệu Bất động sản</span>
          <h2 id="property-357-title">Dữ liệu Bất động sản từ {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</h2>
        </div>
        <span className="gov-source-badge"><Database aria-hidden="true" /> {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</span>
      </header>

      <div className="gov-357-identity">
        <div>
          <span>Mã định danh Bất động sản</span>
          <strong className="gov-mono">{npid ?? 'Chưa có NPID'}</strong>
        </div>
        <span className="gov-status gov-status--ready"><CheckCircle weight="fill" aria-hidden="true" /> {pick(record, 'publicationStatus', 'status') ?? 'Đã công bố'}</span>
      </div>

      <div className="gov-357-data-grid">
        <div className="gov-357-data-group">
          <Buildings aria-hidden="true" />
          <dl>
            <div><dt>Loại Bất động sản</dt><dd>{pick(record, 'propertyType', 'property.type') ?? claimValue('propertyType') ?? 'Chưa có'}</dd></div>
            <div><dt>Chủ đầu tư</dt><dd>{developerName ?? 'Không áp dụng'}</dd></div>
            <div><dt>Dự án</dt><dd>{projectName ?? 'Không áp dụng'}</dd></div>
            <div><dt>Tòa / Căn</dt><dd>{buildingUnit || 'Không áp dụng'}</dd></div>
          </dl>
        </div>
        <div className="gov-357-data-group">
          <MapPin aria-hidden="true" />
          <dl>
            <div><dt>Địa bàn</dt><dd>{location || 'Chưa có'}</dd></div>
            <div>
              <dt>Diện tích theo nguồn</dt>
              <dd>{areaClaims.map(formatAreaClaim).filter(Boolean).join('; ') || 'Chưa có'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {!compact ? (
        <div className="gov-357-provenance">
          <Ruler aria-hidden="true" />
          <dl>
            <div><dt>Mã bản ghi nguồn</dt><dd className="gov-mono">{sourceKey ?? 'Chưa có'}</dd></div>
            <div><dt>Phiên bản nguồn</dt><dd className="gov-mono">{version ?? 'Chưa có'}</dd></div>
            <div><dt>Cập nhật tại nguồn</dt><dd className="gov-mono">{formatTimestamp(sourceUpdatedAt)}</dd></div>
            <div><dt>VMLS nhận lúc</dt><dd className="gov-mono">{formatTimestamp(receivedAt)}</dd></div>
          </dl>
        </div>
      ) : (
        <p className="gov-357-compact-source">
          Nguồn <span className="gov-mono">{sourceKey}</span> · cập nhật {formatTimestamp(sourceUpdatedAt)} · VMLS nhận {formatTimestamp(receivedAt)}
        </p>
      )}
    </section>
  )
}

export default Property357Panel
