import { useId, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  Eye,
  EyeSlash,
  FloppyDisk,
  Image,
  LockKey,
  NotePencil,
  WarningCircle,
} from '@phosphor-icons/react'
import '../styles/governance.css'

const DEFAULT_PUBLICATION_FIELD_GROUPS = Object.freeze([
  { id: 'price', label: 'Giá chào', description: 'Giá bán đang áp dụng cho Tin bán.' },
  { id: 'projectUnit', label: 'Dự án và căn', description: 'Tên dự án, tòa và mã căn.' },
  { id: 'detailedLocation', label: 'Vị trí chi tiết', description: 'Phường, quận và thông tin vị trí chi tiết.' },
  { id: 'areas', label: 'Diện tích', description: 'Các khái niệm diện tích và đơn vị tương ứng.' },
  { id: 'features', label: 'Đặc điểm', description: 'Phòng ngủ, phòng tắm và tiện ích.' },
  { id: 'description', label: 'Mô tả', description: 'Nội dung giới thiệu đã được duyệt.' },
  { id: 'images', label: 'Hình ảnh', description: 'Ảnh được phép dùng khi phân phối.' },
])

function pick(object, ...paths) {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], object)
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
}

function listingIdOf(listing) {
  return pick(listing, 'listingId', 'plid', 'listing.id', 'id')
}

function propertyIdOf(listing) {
  return pick(listing, 'propertyId', 'npid', 'property.id', 'listing.propertyId')
}

function moneyValue(value) {
  const amount = typeof value === 'number' ? value : value?.value
  return Number.isFinite(amount) ? amount : undefined
}

function formatMoney(value) {
  const amount = moneyValue(value)
  if (!Number.isFinite(amount)) return 'Chưa có'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: value?.currency ?? 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatArea(value) {
  if (typeof value === 'string') return value
  if (!Number.isFinite(value?.value)) return undefined
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value.value)} ${value.unit ?? 'm²'}${value.concept ? ` · ${value.concept}` : ''}`
}

function visibleGroupsFrom(listing, explicitGroups) {
  if (explicitGroups) return explicitGroups
  return pick(
    listing,
    'publicationProfile.draft.visibleGroups',
    'publicationProfile.draftVisibleGroups',
    'publicationProfile.applied.visibleGroups',
    'publicationProfile.appliedVisibleGroups',
  ) ?? DEFAULT_PUBLICATION_FIELD_GROUPS.map((group) => group.id)
}

function appliedGroupsFrom(listing, explicitGroups) {
  return explicitGroups ?? pick(
    listing,
    'publicationProfile.applied.visibleGroups',
    'publicationProfile.appliedVisibleGroups',
  ) ?? DEFAULT_PUBLICATION_FIELD_GROUPS.map((group) => group.id)
}

function profileVersion(listing, kind) {
  return pick(
    listing,
    `publicationProfile.${kind}.version`,
    `publicationProfile.${kind}Version`,
  ) ?? 1
}

function titleOf(listing) {
  return pick(listing, 'title', 'property.title')
    ?? [pick(listing, 'property.unitLabel'), pick(listing, 'project.name', 'projectName')].filter(Boolean).join(' · ')
    ?? listingIdOf(listing)
}

function generalAreaOf(listing) {
  return pick(listing, 'publicProjection.generalArea', 'marketArea', 'areaName')
    ?? [
      pick(listing, 'location.district'),
      pick(listing, 'location.city'),
    ].filter(Boolean).join(', ')
    ?? [
      pick(listing, 'property.location.district'),
      pick(listing, 'property.location.city'),
    ].filter(Boolean).join(', ')
}

function detailedLocationOf(listing) {
  const direct = pick(listing, 'publicProjection.detailedLocation', 'detailedLocation', 'property.location.display')
  if (typeof direct === 'string') return direct
  if (direct && typeof direct === 'object') {
    return [direct.unitLabel, direct.ward, direct.district, direct.city].filter(Boolean).join(', ')
  }
  return [
    pick(listing, 'property.location.ward'),
    pick(listing, 'property.location.district'),
    pick(listing, 'property.location.city'),
  ].filter(Boolean).join(', ')
}

function OptionalPreview({ groupId, visibleGroups, children }) {
  if (!visibleGroups.has(groupId)) return null
  return children
}

function PublicListingPreview({ listing, visibleGroupIds }) {
  const visibleGroups = new Set(visibleGroupIds)
  const preview = listing.publicProjection ?? listing
  const areaClaims = pick(preview, 'areaClaims', 'property.areaClaims')
    ?? [pick(preview, 'area', 'property.area')].filter(Boolean)
  const features = [
    pick(preview, 'bedrooms', 'property.bedrooms') ? `${pick(preview, 'bedrooms', 'property.bedrooms')} phòng ngủ` : null,
    pick(preview, 'bathrooms', 'property.bathrooms') ? `${pick(preview, 'bathrooms', 'property.bathrooms')} phòng tắm` : null,
    ...(Array.isArray(preview.features) ? preview.features : []),
  ].filter(Boolean)
  const mediaCount = pick(preview, 'mediaCount', 'listing.mediaCount') ?? 0
  const projectName = pick(preview, 'projectName', 'project.name')
  const unitLabel = pick(preview, 'unitLabel', 'property.unitLabel')
  const agent = pick(preview, 'businessContact', 'responsibleAgent') ?? {}
  const previewTitle = pick(preview, 'title') ?? (
    [pick(preview, 'propertyType'), generalAreaOf(preview)].filter(Boolean).join(' · ')
    || 'Tin bán'
  )

  return (
    <section className="gov-public-preview" aria-labelledby="seller-public-preview-title">
      <header>
        <div>
          <span className="gov-eyebrow">Bản đang áp dụng</span>
          <h2 id="seller-public-preview-title">Thông tin được công khai</h2>
        </div>
        <Eye aria-hidden="true" />
      </header>

      <div className="gov-preview-identity">
        <span className="gov-mono">{listingIdOf(listing)}</span>
        <h3>{previewTitle}</h3>
        <p>{pick(preview, 'transactionType', 'listing.transactionType') ?? 'Bán'} · {pick(preview, 'propertyType', 'property.type') ?? 'Bất động sản'}</p>
      </div>

      <dl className="gov-preview-grid">
        <div><dt>Khu vực</dt><dd>{generalAreaOf(preview) || 'Chưa có'}</dd></div>
        <div><dt>Môi giới phụ trách</dt><dd>{agent.displayName ?? 'Chưa có'}{agent.organizationName ? ` · ${agent.organizationName}` : ''}</dd></div>
        <OptionalPreview groupId="price" visibleGroups={visibleGroups}>
          <div><dt>Giá chào</dt><dd>{formatMoney(pick(preview, 'askingPrice', 'listing.askingPrice'))}</dd></div>
        </OptionalPreview>
        <OptionalPreview groupId="projectUnit" visibleGroups={visibleGroups}>
          <div><dt>Dự án / Căn</dt><dd>{[projectName, unitLabel].filter(Boolean).join(' · ') || 'Không áp dụng'}</dd></div>
        </OptionalPreview>
        <OptionalPreview groupId="detailedLocation" visibleGroups={visibleGroups}>
          <div><dt>Vị trí chi tiết</dt><dd>{detailedLocationOf(preview) || 'Chưa có'}</dd></div>
        </OptionalPreview>
        <OptionalPreview groupId="areas" visibleGroups={visibleGroups}>
          <div><dt>Diện tích</dt><dd>{areaClaims.map(formatArea).filter(Boolean).join('; ') || 'Chưa có'}</dd></div>
        </OptionalPreview>
        <OptionalPreview groupId="features" visibleGroups={visibleGroups}>
          <div><dt>Đặc điểm</dt><dd>{Array.isArray(features) ? features.join(' · ') : features || 'Chưa có'}</dd></div>
        </OptionalPreview>
        <OptionalPreview groupId="description" visibleGroups={visibleGroups}>
          <div className="gov-preview-grid__wide"><dt>Mô tả</dt><dd>{pick(preview, 'description', 'listing.description') ?? 'Chưa có mô tả'}</dd></div>
        </OptionalPreview>
      </dl>

      <OptionalPreview groupId="images" visibleGroups={visibleGroups}>
        <div className="gov-preview-media">
          <Image aria-hidden="true" />
          <span><strong>{mediaCount} ảnh</strong> được phép dùng khi phân phối</span>
        </div>
      </OptionalPreview>
    </section>
  )
}

function SellerListingContent({
  listing,
  fieldGroups,
  initialDraftGroups,
  appliedVisibleGroups,
  correctionRequest,
  onSaveDraft,
  onApplyProfile,
  onRequestCorrection,
}) {
  const listingId = listingIdOf(listing)
  const currentPrice = pick(listing, 'askingPrice', 'listing.askingPrice')
  const currentPriceValue = moneyValue(currentPrice)
  const [selectedGroups, setSelectedGroups] = useState(() => new Set(initialDraftGroups))
  const [proposedPrice, setProposedPrice] = useState(() => currentPriceValue ? String(currentPriceValue) : '')
  const [correctionReason, setCorrectionReason] = useState('')
  const correctionTitleId = useId()

  const selectedGroupIds = useMemo(
    () => fieldGroups.filter((group) => !group.locked && selectedGroups.has(group.id)).map((group) => group.id),
    [fieldGroups, selectedGroups],
  )
  const proposedPriceValue = Number(proposedPrice)
  const sameGroups = (left, right) => left.length === right.length
    && left.every((groupId) => right.includes(groupId))
  const draftIsDirty = !sameGroups(selectedGroupIds, initialDraftGroups)
  const profileCanApply = !draftIsDirty && !sameGroups(initialDraftGroups, appliedVisibleGroups)
  const correctionIsValid = Number.isFinite(proposedPriceValue)
    && proposedPriceValue > 0
    && proposedPriceValue !== currentPriceValue
    && correctionReason.trim().length >= 3

  function toggleGroup(group) {
    if (group.locked) return
    setSelectedGroups((current) => {
      const next = new Set(current)
      if (next.has(group.id)) next.delete(group.id)
      else next.add(group.id)
      return next
    })
  }

  function submitCorrection(event) {
    event.preventDefault()
    if (!correctionIsValid) return
    onRequestCorrection?.({
      listingId,
      field: 'askingPrice',
      proposedValue: { value: proposedPriceValue, currency: currentPrice?.currency ?? 'VND' },
      reason: correctionReason.trim(),
    })
  }

  return (
    <div className="gov-seller-workspace" data-testid="seller-listing-workspace">
      <header className="gov-page-heading">
        <div>
          <span className="gov-eyebrow">Tin bán của tôi</span>
          <h1>{titleOf(listing)}</h1>
          <p><span className="gov-mono">{propertyIdOf(listing)}</span> · <span className="gov-mono">{listingId}</span></p>
        </div>
        <span className="gov-status gov-status--ready">{pick(listing, 'status', 'listing.status') ?? 'Đang hiệu lực'}</span>
      </header>

      <div className="gov-seller-layout">
        <div className="gov-seller-controls">
          <section className="gov-surface" aria-labelledby="seller-visibility-title">
            <header className="gov-section-heading">
              <div>
                <span className="gov-eyebrow">Công khai & chỉnh sửa</span>
                <h2 id="seller-visibility-title">Chọn thông tin được công khai</h2>
              </div>
              <span className="gov-version">Bản nháp v{profileVersion(listing, 'draft')}</span>
            </header>
            <p className="gov-section-intro">Các mục bị khóa luôn cần thiết để nhận biết Tin bán và đơn vị phụ trách.</p>

            <div className="gov-field-choice-list">
              {fieldGroups.map((group) => {
                const checked = group.locked || selectedGroups.has(group.id)
                return (
                  <label key={group.id} className={`gov-field-choice${group.locked ? ' is-locked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={group.locked}
                      onChange={() => toggleGroup(group)}
                    />
                    <span className="gov-field-choice__check" aria-hidden="true">{checked ? <Check weight="bold" /> : null}</span>
                    <span>
                      <strong>{group.label}</strong>
                      {group.description ? <small>{group.description}</small> : null}
                    </span>
                    {group.locked ? <LockKey aria-label="Mục bắt buộc" /> : checked ? <Eye aria-label="Đang công khai" /> : <EyeSlash aria-label="Đang ẩn" />}
                  </label>
                )
              })}
            </div>

            <div className="gov-action-row">
              <button
                className="gov-button gov-button--secondary"
                type="button"
                data-testid="publication-save"
                disabled={!draftIsDirty}
                onClick={() => {
                  if (draftIsDirty) onSaveDraft?.({ listingId, visibleGroups: selectedGroupIds })
                }}
              >
                <FloppyDisk aria-hidden="true" /> Lưu bản nháp
              </button>
              <button
                className="gov-button gov-button--primary"
                type="button"
                data-testid="publication-apply"
                disabled={!profileCanApply}
                onClick={() => {
                  if (profileCanApply) onApplyProfile?.({ listingId })
                }}
              >
                Áp dụng cấu hình <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </section>

          <section className="gov-surface" aria-labelledby={correctionTitleId}>
            <header className="gov-section-heading">
              <div>
                <span className="gov-eyebrow">Yêu cầu chỉnh sửa</span>
                <h2 id={correctionTitleId}>Đề nghị Sàn cập nhật giá chào</h2>
              </div>
              <NotePencil aria-hidden="true" />
            </header>

            {correctionRequest ? (
              <div className="gov-correction-current">
                <span className="gov-status gov-status--pending">{correctionRequest.status ?? 'Chờ Sàn xử lý'}</span>
                <dl>
                  {correctionRequest.status === 'Đã áp dụng' ? (
                    <>
                      <div><dt>Giá trước chỉnh sửa</dt><dd>{formatMoney(correctionRequest.currentValue)}</dd></div>
                      <div><dt>Giá đã áp dụng</dt><dd>{formatMoney(currentPrice)}</dd></div>
                    </>
                  ) : (
                    <>
                      <div><dt>Giá đang áp dụng</dt><dd>{formatMoney(correctionRequest.currentValue ?? currentPrice)}</dd></div>
                      <div><dt>Giá đề nghị</dt><dd>{formatMoney(correctionRequest.proposedValue)}</dd></div>
                    </>
                  )}
                  <div><dt>Lý do</dt><dd>{correctionRequest.reason}</dd></div>
                </dl>
              </div>
            ) : (
              <form className="gov-correction-form" onSubmit={submitCorrection}>
                <div className="gov-readonly-value">
                  <span>Giá đang áp dụng</span>
                  <strong>{formatMoney(currentPrice)}</strong>
                </div>
                <label>
                  <span>Giá đề nghị (VND)</span>
                  <input
                    type="number"
                    min="1000000"
                    step="1000000"
                    value={proposedPrice}
                    onChange={(event) => setProposedPrice(event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Lý do chỉnh sửa</span>
                  <textarea
                    rows="3"
                    value={correctionReason}
                    onChange={(event) => setCorrectionReason(event.target.value)}
                    placeholder="Ví dụ: Điều chỉnh theo thỏa thuận mới với Sàn"
                    required
                  />
                </label>
                <div className="gov-notice gov-notice--plain">
                  <WarningCircle aria-hidden="true" />
                  <span>Giá hiện tại vẫn được sử dụng cho đến khi Sàn áp dụng yêu cầu.</span>
                </div>
                <button className="gov-button gov-button--primary" type="submit" disabled={!correctionIsValid} data-testid="publication-correction">
                  Gửi yêu cầu chỉnh sửa <ArrowRight aria-hidden="true" />
                </button>
              </form>
            )}
          </section>
        </div>

        <div className="gov-seller-preview-column">
          <PublicListingPreview listing={listing} visibleGroupIds={appliedVisibleGroups} />
          <div className="gov-profile-note">
            <strong>Cấu hình đang áp dụng · v{profileVersion(listing, 'applied')}</strong>
            <span>HouseNow và các bề mặt công khai chỉ nhận đúng các nhóm dữ liệu trong bản này.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Seller workspace for one Listing. The component never renders seller identity or raw Listing data.
 */
export function SellerListingWorkspace({
  listing,
  fieldGroups = DEFAULT_PUBLICATION_FIELD_GROUPS,
  draftVisibleGroups,
  appliedVisibleGroups,
  correctionRequest,
  onSaveDraft,
  onApplyProfile,
  onRequestCorrection,
}) {
  if (!listing) {
    return (
      <section className="gov-empty-state" aria-live="polite">
        <strong>Chưa có Tin bán</strong>
        <span>Không có Tin bán nào thuộc phạm vi của tài khoản Người bán này.</span>
      </section>
    )
  }

  const initialDraftGroups = visibleGroupsFrom(listing, draftVisibleGroups)
  const currentAppliedGroups = appliedGroupsFrom(listing, appliedVisibleGroups)
  const formKey = `${listingIdOf(listing)}:${profileVersion(listing, 'draft')}`

  return (
    <SellerListingContent
      key={formKey}
      listing={listing}
      fieldGroups={fieldGroups}
      initialDraftGroups={initialDraftGroups}
      appliedVisibleGroups={currentAppliedGroups}
      correctionRequest={correctionRequest
        ?? listing.correctionRequest
        ?? listing.correctionRequests?.find(({ status }) => status === 'Chờ Sàn xử lý')}
      onSaveDraft={onSaveDraft}
      onApplyProfile={onApplyProfile}
      onRequestCorrection={onRequestCorrection}
    />
  )
}

export default SellerListingWorkspace
