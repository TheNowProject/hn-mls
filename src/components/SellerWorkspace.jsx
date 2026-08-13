import { useEffect, useMemo, useState } from 'react'
import { Button } from '@fluentui/react-components'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  HouseLine,
  LockKey,
  ShieldCheck,
  Warning,
} from '@phosphor-icons/react'
import { mlsApi } from '../lib/apiClient.js'

const today = new Date().toISOString().slice(0, 10)

function relationshipTone(status) {
  if (status === 'Đã xác minh') return 'positive'
  if (status === 'Chờ xác minh') return 'warning'
  return 'danger'
}

function EmptyState({ title, copy }) {
  return <div className="seller-empty"><LockKey /><strong>{title}</strong><span>{copy}</span></div>
}

function PropertyPicker({ properties, selectedId, onChange }) {
  return <label className="seller-property-picker"><span>Bất động sản</span><select value={selectedId ?? ''} onChange={(event) => onChange(event.target.value)}>{properties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}</select></label>
}

export function SellerWorkspace({ view, properties, marketId, onClaim, notify }) {
  const marketProperties = useMemo(() => properties.filter((property) => (property.market ?? 'hcm') === marketId), [properties, marketId])
  const [selectedId, setSelectedId] = useState(marketProperties[0]?.id ?? '')
  const [representations, setRepresentations] = useState([])
  const [consents, setConsents] = useState([])
  const [cases, setCases] = useState([])
  const [busy, setBusy] = useState(false)
  const [authorityError, setAuthorityError] = useState('')
  const [claimForm, setClaimForm] = useState({ propertyId: '', relationshipType: 'Chủ sở hữu', ownershipShare: '100', evidenceReference: '', reason: '' })
  const [caseForm, setCaseForm] = useState({ propertyId: marketProperties[0]?.id ?? '', type: 'Sửa dữ liệu', reason: '', evidenceReference: '' })
  const effectiveSelectedId = marketProperties.some((property) => property.id === selectedId) ? selectedId : marketProperties[0]?.id ?? ''
  const effectiveCasePropertyId = marketProperties.some((property) => property.id === caseForm.propertyId) ? caseForm.propertyId : marketProperties[0]?.id ?? ''
  const selected = marketProperties.find((property) => property.id === effectiveSelectedId)

  useEffect(() => {
    if (view !== 'authority' || !selected?.id) return undefined
    let cancelled = false
    Promise.all([
      mlsApi.representations(selected.id),
      mlsApi.distributionConsents(selected.id),
    ]).then(([representationPayload, consentPayload]) => {
      if (cancelled) return
      setAuthorityError('')
      setRepresentations(representationPayload.representations)
      setConsents(consentPayload.consents)
    }).catch((error) => { if (!cancelled) setAuthorityError(error.message) })
    return () => { cancelled = true }
  }, [view, selected?.id])

  useEffect(() => {
    if (view !== 'seller-cases') return undefined
    let cancelled = false
    mlsApi.sellerCases().then((payload) => { if (!cancelled) setCases(payload.cases) }).catch((error) => { if (!cancelled) notify(error.message) })
    return () => { cancelled = true }
  }, [view, notify])

  const submitClaim = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      await onClaim({ ...claimForm, ownershipShare: Number(claimForm.ownershipShare) })
      setClaimForm({ propertyId: '', relationshipType: 'Chủ sở hữu', ownershipShare: '100', evidenceReference: '', reason: '' })
    } finally {
      setBusy(false)
    }
  }

  const revokeRepresentation = async (representation) => {
    setBusy(true)
    try {
      await mlsApi.changeRepresentation(selected.id, { action: 'revoke', representationId: representation.id, effectiveAt: today, reason: 'Chủ sở hữu thu hồi quyền đại diện từ workspace Seller.' })
      const payload = await mlsApi.representations(selected.id)
      setRepresentations(payload.representations)
      notify('Đã ghi phiên bản thu hồi Representation và Audit Event.')
    } finally {
      setBusy(false)
    }
  }

  const revokeConsent = async (consent) => {
    setBusy(true)
    try {
      await mlsApi.changeDistributionConsent(selected.id, { action: 'revoke', consentId: consent.id, effectiveAt: today, reason: 'Chủ sở hữu dừng phân phối trên các kênh đã cấp trước đó.' })
      const payload = await mlsApi.distributionConsents(selected.id)
      setConsents(payload.consents)
      notify('Đã thu hồi consent và tạo việc reconciliation downstream.')
    } finally {
      setBusy(false)
    }
  }

  const submitCase = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const payload = await mlsApi.createSellerCase({ ...caseForm, propertyId: effectiveCasePropertyId })
      setCases((current) => [payload.case, ...current])
      setCaseForm((current) => ({ ...current, reason: '', evidenceReference: '' }))
      notify('Đã tạo Seller case; Listing hiện tại chưa bị thay đổi.')
    } finally {
      setBusy(false)
    }
  }

  if (view === 'properties') return <div className="seller-workspace">
    <section className="seller-summary work-panel">
      <div><span className="section-kicker">Own-scope workspace</span><h2>Bất động sản của tôi</h2><p>Chỉ Property có quan hệ sở hữu hoặc Ownership Claim của Nguyễn Quốc Khánh được trả về từ API.</p></div>
      <div className="seller-summary-metrics"><article><strong>{marketProperties.length}</strong><span>Property liên kết</span></article><article><strong>{marketProperties.filter((item) => item.sellerRelationship?.status === 'Đã xác minh').length}</strong><span>Đã xác minh</span></article><article><strong>{marketProperties.filter((item) => item.sellerRelationship?.status === 'Chờ xác minh').length}</strong><span>Đang đối chiếu</span></article></div>
    </section>
    <div className="seller-property-grid">
      <section className="work-panel seller-property-list"><div className="panel-heading"><div><h2>Quan hệ Property</h2><p>Ownership Claim không tự làm thay đổi định danh hoặc verification của Property.</p></div></div>{marketProperties.length ? marketProperties.map((property) => <article key={property.id}><img src={property.image} alt="" /><div><span className={`status-badge status-${relationshipTone(property.sellerRelationship?.status)}`}>{property.sellerRelationship?.status}</span><h3>{property.title}</h3><p>{property.address}</p><small>{property.id} · {property.sellerRelationship?.relationshipType} · {property.sellerRelationship?.ownershipShare}%</small></div><div className="seller-listing-state"><strong>{property.currentListing?.status ?? 'Chưa có Listing'}</strong><span>{property.currentListing?.priceLabel ?? 'Chưa có giá chào'}</span></div></article>) : <EmptyState title="Chưa có Property trong data space này" copy="Tạo Ownership Claim để bắt đầu quy trình đối chiếu." />}</section>
      <aside className="work-panel seller-claim-panel"><div className="panel-heading"><div><h2>Liên kết Property</h2><p>Tạo claim kèm evidence; HouseNow sẽ review trước khi xác minh.</p></div></div><form onSubmit={submitClaim}><label><span>Property ID</span><input required value={claimForm.propertyId} onChange={(event) => setClaimForm({ ...claimForm, propertyId: event.target.value })} placeholder="HN-PROP-..." /></label><label><span>Quan hệ khai báo</span><select value={claimForm.relationshipType} onChange={(event) => setClaimForm({ ...claimForm, relationshipType: event.target.value })}><option>Chủ sở hữu</option><option>Đồng sở hữu</option><option>Người được ủy quyền</option></select></label><label><span>Tỷ lệ quyền (%)</span><input type="number" min="1" max="100" value={claimForm.ownershipShare} onChange={(event) => setClaimForm({ ...claimForm, ownershipShare: event.target.value })} /></label><label><span>Evidence reference</span><input required value={claimForm.evidenceReference} onChange={(event) => setClaimForm({ ...claimForm, evidenceReference: event.target.value })} placeholder="Mã hồ sơ, không tải PII vào prototype" /></label><label><span>Lý do</span><textarea required minLength="20" value={claimForm.reason} onChange={(event) => setClaimForm({ ...claimForm, reason: event.target.value })} placeholder="Mô tả căn cứ liên kết Property..." /></label><Button appearance="primary" type="submit" disabled={busy}>Gửi Ownership Claim</Button></form></aside>
    </div>
  </div>

  if (view === 'authority') return <div className="seller-workspace">
    <section className="seller-summary work-panel"><div><span className="section-kicker">Authority & distribution</span><h2>Đại diện và phân phối</h2><p>Mỗi grant, renew hoặc revoke là một version mới; lịch sử cũ không bị ghi đè.</p></div><PropertyPicker properties={marketProperties} selectedId={effectiveSelectedId} onChange={setSelectedId} /></section>
    {authorityError && <div className="connection-banner connection-error"><Warning />{authorityError}</div>}
    {!selected ? <EmptyState title="Chưa có Property để quản lý" copy="Hoàn tất Ownership Claim trước khi cấp quyền đại diện." /> : <div className="seller-authority-grid">
      <section className="work-panel seller-authority-panel"><div className="panel-heading"><div><h2>Representation</h2><p>Ai được hành động cho chủ sở hữu, trong phạm vi nào và đến khi nào.</p></div></div><div className="seller-record-list">{representations.length ? representations.map((item) => <article key={item.id}><span className="seller-record-icon"><ShieldCheck /></span><div><strong>{item.agentName} · {item.brokerage}</strong><span>{item.transactionScope} · {item.exclusivity}</span><small>v{item.version} · {item.startsAt} → {item.expiresAt}</small><em>{item.status}</em></div>{item.status === 'Có hiệu lực' && <Button appearance="secondary" disabled={busy} onClick={() => revokeRepresentation(item)}>Thu hồi</Button>}</article>) : <EmptyState title="Chưa có quyền đại diện" copy="Grant/renew form sẽ xuất hiện khi ownership relationship đủ điều kiện." />}</div></section>
      <section className="work-panel seller-authority-panel"><div className="panel-heading"><div><h2>Consent phân phối</h2><p>Consent gắn với public preview, field scope, channel, purpose và thời hạn.</p></div></div><div className="seller-record-list">{consents.length ? consents.map((item) => <article key={item.id}><span className="seller-record-icon"><HouseLine /></span><div><strong>{item.previewVersion}</strong><span>{item.channels}</span><small>v{item.version} · hết hạn {item.expiresAt}</small><em>{item.status}{item.reconciliationRequired ? ' · cần reconciliation' : ''}</em></div>{item.status === 'Có hiệu lực' && <Button appearance="secondary" disabled={busy} onClick={() => revokeConsent(item)}>Thu hồi</Button>}</article>) : <EmptyState title="Chưa có consent phân phối" copy="Listing không được phân phối nếu consent phù hợp chưa tồn tại." />}</div></section>
    </div>}
  </div>

  return <div className="seller-workspace">
    <section className="seller-summary work-panel"><div><span className="section-kicker">Request, not direct mutation</span><h2>Yêu cầu và tranh chấp</h2><p>Sửa dữ liệu, pause hoặc withdraw luôn tạo case; chỉ reviewer có thẩm quyền mới đổi lifecycle.</p></div><div className="seller-boundary"><LockKey /><span><strong>Listing vẫn giữ nguyên</strong>Case chỉ tạo review task và audit.</span></div></section>
    <div className="seller-case-grid"><section className="work-panel seller-case-list"><div className="panel-heading"><div><h2>Case của tôi</h2><p>Trạng thái và phản hồi được chiếu về đúng chủ thể.</p></div></div>{cases.length ? cases.map((item) => <article key={item.id}><span className="seller-record-icon">{item.status === 'Mới' ? <Clock /> : <CheckCircle />}</span><div><strong>{item.id} · {item.type}</strong><span>{item.propertyId}</span><p>{item.reason}</p><small>{item.status} · {item.createdAt}</small>{item.decisionReason && <em>{item.decidedBy}: {item.decisionReason}</em>}</div><ArrowRight /></article>) : <EmptyState title="Chưa có yêu cầu" copy="Tạo case mới khi thông tin, authority hoặc phân phối cần được review." />}</section><aside className="work-panel seller-case-form"><div className="panel-heading"><div><h2>Tạo yêu cầu</h2><p>Listing không thay đổi ngay sau khi gửi.</p></div></div><form onSubmit={submitCase}><PropertyPicker properties={marketProperties} selectedId={effectiveCasePropertyId} onChange={(propertyId) => setCaseForm({ ...caseForm, propertyId })} /><label><span>Loại yêu cầu</span><select value={caseForm.type} onChange={(event) => setCaseForm({ ...caseForm, type: event.target.value })}><option>Sửa dữ liệu</option><option>Tạm dừng phân phối</option><option>Rút Listing</option><option>Tranh chấp quyền đại diện</option></select></label><label><span>Evidence reference</span><input value={caseForm.evidenceReference} onChange={(event) => setCaseForm({ ...caseForm, evidenceReference: event.target.value })} /></label><label><span>Lý do</span><textarea required minLength="20" value={caseForm.reason} onChange={(event) => setCaseForm({ ...caseForm, reason: event.target.value })} /></label><Button type="submit" appearance="primary" disabled={busy || !effectiveCasePropertyId}>Gửi yêu cầu review</Button></form></aside></div>
  </div>
}
