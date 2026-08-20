import {
  ArrowLeft,
  ArrowRight,
  Broadcast,
  Check,
  CheckCircle,
  Clock,
  EyeSlash,
  Funnel,
  Handshake,
  HouseLine,
  PaperPlaneTilt,
  ShieldCheck,
  Warning,
} from '@phosphor-icons/react'
import '../styles/marketplace.css'

// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_MARKET_FILTERS = Object.freeze({
  npid: '',
  area: '',
  developer: '',
  project: '',
})

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi')
}

function pick(listing, ...keys) {
  for (const key of keys) {
    const value = listing?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
}

function listingNpid(listing) {
  return pick(listing, 'npid', 'propertyId') ?? listing?.property?.id
}

function listingPlid(listing) {
  return pick(listing, 'plid', 'listingId', 'id')
}

function listingArea(listing) {
  return pick(listing, 'marketArea', 'areaName', 'district', 'location')
    ?? listing?.property?.location?.display
    ?? [
      listing?.property?.location?.ward,
      listing?.property?.location?.district,
      listing?.property?.location?.city,
    ].filter(Boolean).join(', ')
}

function listingDeveloper(listing) {
  return pick(listing, 'developerName', 'developer')
    ?? listing?.project?.developer?.name
    ?? listing?.property?.developer
}

function listingProject(listing) {
  const direct = pick(listing, 'projectName')
  if (direct) return direct
  if (typeof listing?.project === 'string') return listing.project
  return listing?.project?.name ?? listing?.property?.project
}

function listingTitle(listing) {
  const generated = [listing?.property?.unitLabel, listingProject(listing)].filter(Boolean).join(' · ')
  return pick(listing, 'title', 'name') ?? listing?.property?.title ?? (generated || listingPlid(listing))
}

function responsibleAgentName(listing) {
  return pick(listing, 'responsibleAgentName') ?? listing?.responsibleAgent?.displayName
}

function responsibleOrganizationName(listing) {
  return pick(listing, 'responsibleOrganizationName', 'brokerageName')
    ?? listing?.responsibleAgent?.organizationName
}

function registrationStatus(listing) {
  return listing?.registration?.status
    ?? listing?.registrationStatus
    ?? listing?.collaboration?.ownRegistration?.status
    ?? 'Chưa đăng ký'
}

function distributionStatus(listing) {
  const latest = listing?.collaboration?.distributions?.at(-1)
  return listing?.distribution?.status ?? listing?.distributionStatus ?? latest?.status ?? 'Chưa phân phối'
}

function isRegistered(listing) {
  if (typeof listing?.isRegistered === 'boolean') return listing.isRegistered
  if (listing?.marketState === 'registered' || listing?.marketState === 'distributed') return true
  if (listing?.collaboration?.ownRegistration) return true
  return normalizeText(registrationStatus(listing)).includes('da dang ky')
}

function isDistributed(listing) {
  if (typeof listing?.isDistributed === 'boolean') return listing.isDistributed
  if (listing?.marketState === 'distributed') return true
  if (listing?.collaboration?.distributions?.length) return true
  const status = normalizeText(distributionStatus(listing))
  return status.includes('da gui') || status.includes('da phan phoi') || status.includes('da tiep nhan')
}

function tabMatches(listing, tabId) {
  if (tabId === 'registered') return isRegistered(listing) && !isDistributed(listing)
  if (tabId === 'distributed') return isDistributed(listing)
  if (tabId === 'available') return !isRegistered(listing)
  return true
}

function optionValues(listings, getValue) {
  return [...new Set(listings.map(getValue).filter((value) => typeof value === 'string' && value.trim()))]
    .sort((left, right) => left.localeCompare(right, 'vi'))
}

function matchesFilters(listing, filters) {
  const npidQuery = normalizeText(filters.npid)
  if (npidQuery && !normalizeText(listingNpid(listing)).includes(npidQuery)) return false
  if (filters.area && listingArea(listing) !== filters.area) return false
  if (filters.developer && listingDeveloper(listing) !== filters.developer) return false
  if (filters.project && listingProject(listing) !== filters.project) return false
  return true
}

function toneFor(value) {
  const normalized = normalizeText(value)
  if (normalized.includes('da ') || normalized.includes('du dieu kien') || normalized.includes('hieu luc')) {
    return 'ready'
  }
  if (normalized.includes('cho') || normalized.includes('chua')) return 'pending'
  if (normalized.includes('loi') || normalized.includes('tu choi')) return 'blocked'
  return 'neutral'
}

function formatMoney(value) {
  const amount = typeof value === 'number' ? value : value?.value
  if (!Number.isFinite(amount)) return undefined
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: value?.currency ?? 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatArea(value) {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (!Number.isFinite(value.value)) return undefined
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value.value)} ${value.unit ?? 'm²'} · ${value.concept ?? 'Diện tích'}`
}

function MarketStatus({ children, tone }) {
  return <span className={`market-status market-status--${tone ?? toneFor(children)}`}>{children}</span>
}

function updateFilter(onFiltersChange, filters, key, value) {
  onFiltersChange?.({ ...filters, [key]: value })
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="market-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Tất cả</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

const DEFAULT_TABS = Object.freeze([
  { id: 'all', label: 'Tất cả' },
  { id: 'available', label: 'Có thể đăng ký' },
  { id: 'registered', label: 'Đã đăng ký' },
  { id: 'distributed', label: 'Đã phân phối' },
])

const READ_ONLY_TABS = Object.freeze([
  { id: 'all', label: 'Tất cả' },
  { id: 'available', label: 'Chưa có đăng ký' },
  { id: 'registered', label: 'Đăng ký, chưa gửi' },
  { id: 'distributed', label: 'Có phân phối' },
])

/** Kho Listing có quyền đại diện bán đã được xác nhận. */
export function RepresentedInventory({
  listings = [],
  filters = EMPTY_MARKET_FILTERS,
  onFiltersChange,
  activeTab = 'all',
  onTabChange,
  tabs,
  onSelectListing,
  onRegister,
  onOpenDistribution,
  readOnly = false,
}) {
  const visibleTabs = tabs ?? (readOnly ? READ_ONLY_TABS : DEFAULT_TABS)
  const normalizedFilters = { ...EMPTY_MARKET_FILTERS, ...filters }
  const areaOptions = optionValues(listings, listingArea)
  const developerOptions = optionValues(listings, listingDeveloper)
  const projectOptions = optionValues(listings, listingProject)
  const filteredListings = listings.filter(
    (listing) => tabMatches(listing, activeTab) && matchesFilters(listing, normalizedFilters),
  )
  const hasFilters = Object.values(normalizedFilters).some(Boolean)

  return (
    <div className="market-workspace" data-testid="represented-inventory">
      <header className="market-page-heading">
        <div>
          <span className="market-eyebrow">Thị trường hợp tác</span>
          <h1>Kho căn được đại diện</h1>
          <p>Tin bán có quyền đại diện đã được chủ sở hữu xác nhận.</p>
        </div>
        <dl className="market-heading-count" aria-label="Tổng số Tin bán">
          <div>
            <dt>Tin bán đang tra cứu</dt>
            <dd>{listings.length}</dd>
          </div>
        </dl>
      </header>

      <section className="market-filter-panel" aria-labelledby="represented-search-title">
        <header>
          <Funnel aria-hidden="true" />
          <div><h2 id="represented-search-title">Tra cứu Tin bán</h2><p>Tìm theo đúng định danh hoặc phạm vi thị trường.</p></div>
          {hasFilters ? (
            <button type="button" onClick={() => onFiltersChange?.({ ...EMPTY_MARKET_FILTERS })}>
              Xóa bộ lọc
            </button>
          ) : null}
        </header>

        <div className="market-filter-grid">
          <label className="market-filter">
            <span>Mã định danh Bất động sản</span>
            <input
              type="search"
              value={normalizedFilters.npid}
              onChange={(event) => updateFilter(
                onFiltersChange,
                normalizedFilters,
                'npid',
                event.target.value,
              )}
              placeholder="NPID-HN-…"
              autoComplete="off"
            />
          </label>
          <FilterSelect
            label="Khu vực"
            value={normalizedFilters.area}
            options={areaOptions}
            onChange={(value) => updateFilter(onFiltersChange, normalizedFilters, 'area', value)}
          />
          <FilterSelect
            label="Chủ đầu tư"
            value={normalizedFilters.developer}
            options={developerOptions}
            onChange={(value) => updateFilter(onFiltersChange, normalizedFilters, 'developer', value)}
          />
          <FilterSelect
            label="Dự án"
            value={normalizedFilters.project}
            options={projectOptions}
            onChange={(value) => updateFilter(onFiltersChange, normalizedFilters, 'project', value)}
          />
        </div>
      </section>

      <section className="market-results" aria-labelledby="represented-results-title">
        <header className="market-section-heading market-results__heading">
          <div>
            <span className="market-eyebrow">Kết quả</span>
            <h2 id="represented-results-title">Tin bán đủ điều kiện hợp tác</h2>
          </div>
          <span>{filteredListings.length} kết quả</span>
        </header>

        <div className="market-tabs" role="group" aria-label="Lọc theo trạng thái Tin bán">
          {visibleTabs.map((tab) => {
            const count = listings.filter((listing) => tabMatches(listing, tab.id)).length
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                className={activeTab === tab.id ? 'is-active' : ''}
                onClick={() => onTabChange?.(tab.id)}
              >
                <span>{tab.label}</span><strong>{tab.count ?? count}</strong>
              </button>
            )
          })}
        </div>

        {filteredListings.length ? (
          <div className="market-table-wrap">
            <table className="market-table">
              <thead>
                <tr>
                  <th>Tin bán</th>
                  <th>Định danh</th>
                  <th>Chủ đầu tư / Dự án</th>
                  <th>Môi giới / Sàn phụ trách</th>
                  <th>Quyền đại diện</th>
                  <th>Hợp tác bán</th>
                  <th><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => {
                  const registered = isRegistered(listing)
                  const distributed = isDistributed(listing)
                  const rowKey = listingPlid(listing) ?? listingNpid(listing)
                  return (
                    <tr key={rowKey}>
                      <td data-label="Tin bán">
                        <button
                          type="button"
                          className="market-listing-link"
                          onClick={() => onSelectListing?.(listing)}
                        >
                          <strong>{listingTitle(listing)}</strong>
                          <span>{listingArea(listing) ?? 'Chưa có khu vực'}</span>
                        </button>
                      </td>
                      <td data-label="Định danh">
                        <span className="market-identifier">{listingNpid(listing) ?? 'Chưa có NPID'}</span>
                        <span className="market-identifier market-identifier--secondary">{listingPlid(listing) ?? 'Chưa có PLID'}</span>
                      </td>
                      <td data-label="Chủ đầu tư / Dự án">
                        <strong>{listingDeveloper(listing) ?? 'Không áp dụng'}</strong>
                        <span>{listingProject(listing) ?? 'Bất động sản riêng lẻ'}</span>
                      </td>
                      <td data-label="Môi giới / Sàn phụ trách">
                        <strong>{responsibleAgentName(listing) ?? 'Chưa có'}</strong>
                        <span>{responsibleOrganizationName(listing) ?? 'Chưa có Sàn phụ trách'}</span>
                      </td>
                      <td data-label="Quyền đại diện">
                        <MarketStatus>{listing.representationStatus ?? listing.representation?.status ?? 'Đã xác nhận'}</MarketStatus>
                        {listing.representationValidUntil || listing.representation?.expiresOn ? <small>Đến {listing.representationValidUntil ?? listing.representation?.expiresOn}</small> : null}
                      </td>
                      <td data-label="Hợp tác bán">
                        <MarketStatus tone={distributed ? 'ready' : registered ? 'registered' : 'neutral'}>
                          {readOnly
                            ? distributed
                              ? 'Có sự kiện phân phối'
                              : registered
                                ? 'Có đăng ký hợp tác'
                                : 'Chưa có đăng ký hợp tác'
                            : distributed
                              ? distributionStatus(listing)
                              : registrationStatus(listing)}
                        </MarketStatus>
                      </td>
                      <td data-label="Thao tác" className="market-row-actions">
                        {readOnly ? (
                          onSelectListing ? (
                            <button
                              className="market-secondary-action"
                              type="button"
                              onClick={() => onSelectListing(listing)}
                            >
                              Xem chi tiết <ArrowRight weight="bold" aria-hidden="true" />
                            </button>
                          ) : null
                        ) : registered ? (
                          <button
                            className="market-secondary-action"
                            type="button"
                            onClick={() => onOpenDistribution?.(listing)}
                            disabled={listing.canDistribute === false || (listing.collaboration && !listing.collaboration.allowedChannels?.length)}
                          >
                            {distributed ? 'Xem phân phối' : 'Chuẩn bị phân phối'}
                            <ArrowRight weight="bold" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            className="market-secondary-action"
                            type="button"
                            onClick={() => onRegister?.(listing)}
                            disabled={listing.canRegister === false || listing.collaboration?.registrationOpen === false}
                          >
                            Đăng ký hợp tác bán
                            <Handshake weight="bold" aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="market-empty-state">
            <HouseLine aria-hidden="true" />
            <strong>Không có Tin bán phù hợp</strong>
            <span>Thay đổi bộ lọc hoặc chọn nhóm trạng thái khác.</span>
          </div>
        )}
      </section>
    </div>
  )
}

/** Chi tiết công khai nội bộ của một Tin bán được đại diện. */
export function RepresentedListingDetail({
  listing,
  onBack,
  onRegister,
  onOpenDistribution,
  busy = false,
  readOnly = false,
}) {
  if (!listing) return null
  const registered = isRegistered(listing)
  const distributed = isDistributed(listing)
  const facts = [
    ['Mã định danh Bất động sản', listingNpid(listing), true],
    ['Mã định danh Tin bán', listingPlid(listing), true],
    ['Loại Bất động sản', pick(listing, 'propertyType', 'type') ?? listing.property?.type],
    ['Khu vực', listingArea(listing)],
    ['Chủ đầu tư', listingDeveloper(listing) ?? 'Không áp dụng'],
    ['Dự án', listingProject(listing) ?? 'Bất động sản riêng lẻ'],
    ['Căn / thửa', pick(listing, 'unitCode', 'unit') ?? listing.property?.unitCode ?? listing.property?.unitLabel],
    ['Diện tích', pick(listing, 'areaDisplay', 'floorArea') ?? listing.property?.areaDisplay ?? formatArea(listing.property?.area)],
    ['Giá chào', pick(listing, 'priceDisplay') ?? formatMoney(listing.askingPrice ?? listing.listing?.askingPrice)],
    ['Môi giới phụ trách', responsibleAgentName(listing)],
    ['Sàn phụ trách', responsibleOrganizationName(listing)],
    ['Phạm vi hợp tác', pick(listing, 'cooperationScope', 'sharingScope') ?? listing.representation?.scope ?? 'Môi giới trong hệ thống'],
  ]

  return (
    <div className="market-workspace" data-testid="represented-listing-detail">
      <button className="market-back-action" type="button" onClick={onBack}>
        <ArrowLeft weight="bold" aria-hidden="true" /> Quay lại kho Tin bán
      </button>

      <header className="market-record-heading">
        <div>
          <span className="market-identifier">{listingPlid(listing)}</span>
          <h1>{listingTitle(listing)}</h1>
          <p>{listingArea(listing)}</p>
        </div>
        <MarketStatus>{listing.representationStatus ?? listing.representation?.status ?? 'Đã xác nhận quyền đại diện'}</MarketStatus>
      </header>

      <div className="market-detail-grid">
        <section className="market-record-panel" aria-labelledby="listing-information-title">
          <header className="market-section-heading">
            <div><span className="market-eyebrow">Bản ghi</span><h2 id="listing-information-title">Thông tin Tin bán</h2></div>
          </header>
          <dl className="market-fact-grid">
            {facts.map(([label, value, mono]) => (
              <div key={label}><dt>{label}</dt><dd className={mono ? 'market-identifier' : ''}>{value ?? 'Chưa có'}</dd></div>
            ))}
          </dl>
        </section>

        <aside className="market-record-panel market-registration-panel" aria-labelledby="cooperation-title">
          <header>
            <Handshake aria-hidden="true" />
            <div><span className="market-eyebrow">Quyền bán</span><h2 id="cooperation-title">Đăng ký hợp tác</h2></div>
          </header>
          <dl>
            <div><dt>Quyền đại diện</dt><dd>{listing.representationStatus ?? listing.representation?.status ?? 'Đã xác nhận'}</dd></div>
            <div><dt>{readOnly ? 'Đăng ký hợp tác' : 'Đăng ký của bạn'}</dt><dd>{readOnly && registered ? 'Có đăng ký hợp tác' : registrationStatus(listing)}</dd></div>
            <div><dt>Phân phối theo kênh</dt><dd>{readOnly && distributed ? 'Có sự kiện phân phối' : distributionStatus(listing)}</dd></div>
          </dl>
          <p className="market-privacy-note"><ShieldCheck aria-hidden="true" /> Thông tin định danh của chủ sở hữu không nằm trong phạm vi chia sẻ.</p>

          {readOnly ? null : registered ? (
            <button
              className="market-primary-action"
              type="button"
              onClick={() => onOpenDistribution?.(listing)}
              disabled={busy || (!distributed && (listing.canDistribute === false || (listing.collaboration && !listing.collaboration.allowedChannels?.length)))}
            >
              {distributed ? 'Xem phân phối' : 'Chuẩn bị phân phối'} <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          ) : (
            <button
              className="market-primary-action"
              type="button"
              onClick={() => onRegister?.(listing)}
              disabled={busy || listing.canRegister === false || listing.collaboration?.registrationOpen === false}
            >
              Đăng ký hợp tác bán <Handshake weight="bold" aria-hidden="true" />
            </button>
          )}
        </aside>

        {listing.publicNotes?.length ? (
          <section className="market-record-panel market-detail-notes" aria-labelledby="listing-notes-title">
            <header className="market-section-heading">
              <div><span className="market-eyebrow">Nội dung chia sẻ</span><h2 id="listing-notes-title">Ghi chú Tin bán</h2></div>
            </header>
            <ul>{listing.publicNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}

function channelMode(channel) {
  const raw = channel.mode ?? channel.availability
  if (['implemented', 'available', 'interactive'].includes(raw)) return 'implemented'
  if (['readOnly', 'read-only', 'preview'].includes(raw)) return 'readOnly'
  if (channel.id === 'housenow' && raw !== 'unavailable') return 'implemented'
  return 'unavailable'
}

function checkState(item) {
  const state = item.state ?? item.status
  if (['done', 'ready', 'passed', 'complete'].includes(state)) return 'done'
  if (['warning', 'missing', 'blocked'].includes(state)) return 'warning'
  return 'pending'
}

/** Kiểm tra phạm vi dữ liệu và gửi Tin bán sang một kênh phân phối. */
export function DistributionWorkspace({
  listing,
  channels = [],
  selectedChannelId,
  onSelectChannel,
  preflight = [],
  sendFields = [],
  excludedFields = [],
  events = [],
  preview = null,
  status = 'Chưa gửi',
  canSubmit = false,
  submitting = false,
  onSubmit,
  onBack,
}) {
  if (!listing) return null
  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId)
  const selectedMode = selectedChannel ? channelMode(selectedChannel) : 'unavailable'
  const submitDisabled = !canSubmit || submitting || selectedMode !== 'implemented'

  return (
    <div className="market-workspace" data-testid="distribution-workspace">
      <button className="market-back-action" type="button" onClick={onBack}>
        <ArrowLeft weight="bold" aria-hidden="true" /> Quay lại Tin bán
      </button>

      <header className="market-record-heading market-distribution-heading">
        <div>
          <span className="market-identifier">{listingPlid(listing)}</span>
          <h1>Phân phối Tin bán</h1>
          <p>{listingTitle(listing)} · {listingArea(listing)}</p>
        </div>
        <div className="market-distribution-status"><span>Trạng thái</span><MarketStatus>{status}</MarketStatus></div>
      </header>

      <div className="distribution-layout">
        <section className="market-record-panel distribution-channels" aria-labelledby="distribution-channels-title">
          <header className="market-section-heading">
            <div><span className="market-eyebrow">Bước 1</span><h2 id="distribution-channels-title">Chọn kênh phân phối</h2></div>
          </header>
          <div className="distribution-channel-list">
            {channels.map((channel) => {
              const mode = channelMode(channel)
              const interactive = mode === 'implemented'
              const content = (
                <>
                  {channel.icon ? <img src={channel.icon} alt="" /> : <Broadcast aria-hidden="true" />}
                  <span><strong>{channel.name}</strong><small>{channel.description ?? channel.scope ?? 'Kênh đăng tin'}</small></span>
                  <MarketStatus tone={interactive ? toneFor(channel.status) : 'neutral'}>
                    {channel.status ?? (interactive ? 'Có thể gửi' : 'Chưa khả dụng')}
                  </MarketStatus>
                </>
              )
              if (!interactive) {
                return <article className="distribution-channel distribution-channel--static" key={channel.id}>{content}</article>
              }
              return (
                <label className={`distribution-channel${selectedChannelId === channel.id ? ' is-selected' : ''}`} key={channel.id}>
                  <input
                    type="radio"
                    name={`distribution-channel-${listingPlid(listing)}`}
                    value={channel.id}
                    checked={selectedChannelId === channel.id}
                    onChange={() => onSelectChannel?.(channel.id, channel)}
                  />
                  {content}
                </label>
              )
            })}
          </div>
        </section>

        <section className="market-record-panel distribution-preflight" aria-labelledby="distribution-preflight-title">
          <header className="market-section-heading">
            <div><span className="market-eyebrow">Bước 2</span><h2 id="distribution-preflight-title">Kiểm tra trước khi gửi</h2></div>
          </header>
          {preflight.length ? (
            <ul className="distribution-checklist">
              {preflight.map((item) => {
                const state = checkState(item)
                const Icon = state === 'done' ? CheckCircle : state === 'warning' ? Warning : Clock
                return (
                  <li className={`is-${state}`} key={item.id ?? item.label}>
                    <Icon weight={state === 'done' ? 'fill' : 'regular'} aria-hidden="true" />
                    <span><strong>{item.label}</strong>{item.detail ? <small>{item.detail}</small> : null}</span>
                    <em>{item.stateLabel ?? (state === 'done' ? 'Đạt' : state === 'warning' ? 'Cần xử lý' : 'Đang chờ')}</em>
                  </li>
                )
              })}
            </ul>
          ) : <p className="distribution-empty-checks">Chưa có kết quả kiểm tra cho kênh đã chọn.</p>}
        </section>

        <section className="market-record-panel distribution-contract" aria-labelledby="distribution-contract-title">
          <header className="market-section-heading">
            <div><span className="market-eyebrow">Bước 3</span><h2 id="distribution-contract-title">Phạm vi dữ liệu</h2></div>
          </header>
          {preview ? (
            <article className="distribution-listing-preview" data-testid="distribution-preview">
              <header>
                {selectedChannel?.icon ? <img src={selectedChannel.icon} alt="" /> : <Broadcast aria-hidden="true" />}
                <div><span>Xem trước dữ liệu gửi</span><strong>{preview.title}</strong></div>
                <MarketStatus>{selectedChannel?.name ?? 'Kênh phân phối'}</MarketStatus>
              </header>
              <dl>
                <div><dt>Định danh</dt><dd><span className="market-identifier">{preview.propertyId}</span><span className="market-identifier">{preview.listingId}</span></dd></div>
                {preview.price ? <div><dt>Giá chào</dt><dd>{preview.price}</dd></div> : null}
                <div><dt>Bất động sản</dt><dd>{[preview.propertyType, preview.area, preview.rooms].filter(Boolean).join(' · ')}</dd></div>
                {preview.projectName ? <div><dt>Dự án</dt><dd>{[preview.projectName, preview.developerName].filter(Boolean).join(' · ')}</dd></div> : null}
                <div><dt>Khu vực</dt><dd>{preview.location}</dd></div>
                {Number.isFinite(preview.mediaCount) ? <div><dt>Ảnh công khai</dt><dd>{preview.mediaCount} ảnh được chọn</dd></div> : null}
                <div><dt>Liên hệ nghiệp vụ</dt><dd>{preview.businessContact}</dd></div>
              </dl>
            </article>
          ) : null}
          <div className="distribution-contract-grid">
            <section>
              <h3><PaperPlaneTilt aria-hidden="true" /> Dữ liệu gửi</h3>
              <ul>{sendFields.map((field) => <li key={field}><Check aria-hidden="true" />{field}</li>)}</ul>
            </section>
            <section>
              <h3><EyeSlash aria-hidden="true" /> Không chia sẻ</h3>
              <ul>{excludedFields.map((field) => <li key={field}><EyeSlash aria-hidden="true" />{field}</li>)}</ul>
            </section>
          </div>
          <button
            className="market-primary-action distribution-submit"
            type="button"
            onClick={() => onSubmit?.(listing, selectedChannel)}
            disabled={submitDisabled}
          >
            {submitting ? 'Đang gửi Tin bán' : `Gửi Tin bán${selectedChannel ? ` đến ${selectedChannel.name}` : ''}`}
            <PaperPlaneTilt weight="bold" aria-hidden="true" />
          </button>
        </section>

        <aside className="market-record-panel distribution-audit" aria-labelledby="distribution-audit-title">
          <header className="market-section-heading">
            <div><span className="market-eyebrow">Nhật ký</span><h2 id="distribution-audit-title">Trạng thái bàn giao</h2></div>
          </header>
          <ol>
            {events.length ? events.map((event) => (
              <li key={event.id ?? `${event.at}-${event.label}`}>
                <span aria-hidden="true" />
                <div><strong>{event.label ?? event.title}</strong>{event.detail ? <p>{event.detail}</p> : null}<time dateTime={event.at}>{event.displayAt ?? event.at}</time></div>
              </li>
            )) : <li className="is-empty"><span aria-hidden="true" /><div><strong>Chưa có sự kiện bàn giao</strong></div></li>}
          </ol>
        </aside>
      </div>
    </div>
  )
}

/** Convenience switch for hosts that keep the active marketplace view in one state field. */
export function MarketWorkspace({ view = 'inventory', distribution, ...props }) {
  if (view === 'detail') return <RepresentedListingDetail {...props} />
  if (view === 'distribution') return <DistributionWorkspace {...props} {...distribution} />
  return <RepresentedInventory {...props} />
}

export default MarketWorkspace
