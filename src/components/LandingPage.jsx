import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Buildings,
  CheckCircle,
  Database,
  Fingerprint,
  LinkSimple,
  MagnifyingGlass,
  MapPin,
  ShieldCheck,
  Signpost,
  Sparkle,
} from '@phosphor-icons/react'
import BrandMark from './BrandMark.jsx'
import '../styles/landing.css'

const NETWORK_NODES = Object.freeze([
  { id: 'npid', label: 'NPID', detail: 'Định danh Bất động sản' },
  { id: 'plid', label: 'PLID', detail: 'Định danh Tin bán' },
  { id: 'ptid', label: 'PTID', detail: 'Dấu vết Giao dịch' },
  { id: 'housenow', label: 'HouseNow', detail: 'Ảnh chụp Tin bán' },
  { id: 'source-357', label: '357', detail: 'Nguồn Giao dịch' },
  { id: 'tax', label: 'Thuế', detail: 'Nghĩa vụ tài chính' },
  { id: 'land', label: 'VPĐKĐĐ', detail: 'Đăng ký sang tên' },
])

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi')
}

function preferredScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function toPublicListing(listing, index) {
  const listingId = listing?.listingId ?? listing?.id ?? null
  const propertyId = listing?.propertyId ?? null
  const title = listing?.title ?? 'Tin bán VMLS'
  const location = listing?.location ?? 'Hà Nội'
  const isPhuThuong = normalizeText(`${title} ${location}`).includes('phu thuong')
  const source = listing?.source ?? {}

  // Explicit Public projection: never spread transaction, party, contract or processing fields.
  return {
    key: listingId ?? propertyId ?? `public-listing-${index}`,
    listingId,
    propertyId,
    title,
    propertyType: listing?.propertyType ?? 'Bất động sản',
    status: listing?.status ?? null,
    location,
    askingPriceDisplay: listing?.askingPriceDisplay ?? 'Liên hệ',
    areaLabel: listing?.areaLabel ?? null,
    source: {
      name: source.name ?? 'Nguồn chưa xác định',
      recordId: source.recordId ?? '—',
      version: source.version ?? '—',
      updatedAt: source.updatedAt ?? 'Bộ dữ liệu mẫu',
    },
    isPrimary: Boolean(listing?.isPrimary || isPhuThuong),
    searchText: normalizeText([propertyId, listingId, title, location].filter(Boolean).join(' ')),
  }
}

function DemoAccountMenu({ menuId, roles, unreadByRole, onEnterDemo, variant = 'primary', triggerAriaLabel }) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    if (!isOpen) return undefined

    const frame = window.requestAnimationFrame(() => itemRefs.current[0]?.focus())
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', closeOnOutsidePress)
    }
  }, [isOpen])

  function closeAndRestoreFocus() {
    setIsOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function handleMenuKeyDown(event) {
    const activeIndex = itemRefs.current.indexOf(document.activeElement)
    let nextIndex = null

    if (event.key === 'ArrowDown') nextIndex = (activeIndex + 1) % roles.length
    if (event.key === 'ArrowUp') nextIndex = (activeIndex - 1 + roles.length) % roles.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = roles.length - 1
    if (event.key === 'Escape') {
      event.preventDefault()
      closeAndRestoreFocus()
      return
    }
    if (event.key === 'Tab') {
      setIsOpen(false)
      return
    }
    if (nextIndex === null) return
    event.preventDefault()
    itemRefs.current[nextIndex]?.focus()
  }

  function chooseRole(roleId) {
    setIsOpen(false)
    onEnterDemo(roleId)
  }

  return (
    <div className={`landing-v5-account-menu is-${variant}`} ref={rootRef}>
      <button
        ref={triggerRef}
        className="landing-v5-demo-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`${menuId}-menu`}
        aria-label={triggerAriaLabel}
        onClick={() => setIsOpen((current) => !current)}
        disabled={!roles.length}
        data-testid={`${menuId}-trigger`}
      >
        <span>Mở tài khoản demo</span>
        <ArrowRight weight="bold" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          id={`${menuId}-menu`}
          className="landing-v5-account-popover"
          role="menu"
          aria-label="Chọn tài khoản demo"
          onKeyDown={handleMenuKeyDown}
        >
          <div className="landing-v5-account-popover__heading">
            <small>Không gian làm việc mẫu</small>
            <strong>Tiếp tục với vai trò</strong>
          </div>
          {roles.map((role, index) => {
            const unread = Math.max(0, Number(unreadByRole?.[role.id]) || 0)
            return (
              <button
                key={role.id}
                ref={(element) => { itemRefs.current[index] = element }}
                type="button"
                role="menuitem"
                onClick={() => chooseRole(role.id)}
                aria-label={`${role.label}${unread ? `, ${unread} thông báo chưa đọc` : ''}`}
                data-testid={`demo-account-${role.id}`}
              >
                <span className="landing-v5-account-avatar" aria-hidden="true">
                  {(role.shortLabel ?? role.label).slice(0, 2).toLocaleUpperCase('vi')}
                </span>
                <span className="landing-v5-account-name">
                  <strong>{role.label}</strong>
                  <small>{unread ? 'Có thông báo mới' : 'Tài khoản demo'}</small>
                </span>
                {unread ? <span className="landing-v5-unread" aria-hidden="true">{unread > 99 ? '99+' : unread}</span> : null}
                <ArrowRight aria-hidden="true" />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function RegistryNetwork() {
  return (
    <div className="landing-v5-network" aria-label="Mạng dữ liệu Living Registry của VMLS" role="img">
      <svg viewBox="0 0 720 560" aria-hidden="true" focusable="false">
        <path className="landing-v5-trace trace-a" d="M135 118 C245 118 248 247 353 247 S486 124 592 124" />
        <path className="landing-v5-trace trace-b" d="M116 294 C226 294 239 247 353 247 S489 294 605 294" />
        <path className="landing-v5-trace trace-c" d="M141 452 C237 452 253 329 353 247 S469 444 579 444" />
        <path className="landing-v5-trace trace-d" d="M353 82 V247" />
        <circle className="landing-v5-pulse-ring" cx="353" cy="247" r="78" />
      </svg>

      <span className="landing-v5-network-core" aria-hidden="true">
        <BrandMark compact inverse ariaLabel="VMLS" />
        <small>Living Registry</small>
      </span>

      {NETWORK_NODES.map((node) => (
        <span className={`landing-v5-network-node is-${node.id}`} key={node.id} aria-hidden="true">
          <i />
          <strong>{node.label}</strong>
          <small>{node.detail}</small>
        </span>
      ))}

      <span className="landing-v5-network-caption" aria-hidden="true">
        <span /> Dữ liệu có nguồn · lịch sử có dấu vết
      </span>
    </div>
  )
}

function PublicListingCard({ listing }) {
  return (
    <article className={`landing-v5-listing-card${listing.isPrimary ? ' is-primary' : ''}`} data-testid={`public-listing-${listing.listingId ?? listing.key}`}>
      <header>
        <div>
          {listing.isPrimary ? <span className="landing-v5-primary-label"><Sparkle weight="fill" aria-hidden="true" /> Phú Thượng · hồ sơ demo</span> : <span className="landing-v5-listing-kind">Tin bán công khai</span>}
          <span className="landing-v5-property-type">{listing.propertyType}{listing.status ? ` · ${listing.status}` : ''}</span>
        </div>
        <ShieldCheck weight="duotone" aria-label="Dữ liệu công khai có nguồn" />
      </header>

      <div className="landing-v5-listing-content">
        <h3>{listing.title}</h3>
        <p><MapPin aria-hidden="true" /> <span>{listing.location}{listing.areaLabel ? ` · ${listing.areaLabel}` : ''}</span></p>
        <strong className="landing-v5-price">{listing.askingPriceDisplay}</strong>
      </div>

      <dl className="landing-v5-identifiers" aria-label="Định danh công khai">
        <div><dt>NPID</dt><dd>{listing.propertyId ?? 'Chưa cấp'}</dd></div>
        <div><dt>PLID</dt><dd>{listing.listingId ?? 'Chưa cấp'}</dd></div>
      </dl>

      <div className="landing-v5-provenance">
        <span><Database aria-hidden="true" /> Nguồn dữ liệu</span>
        <dl>
          <div><dt>Nguồn</dt><dd>{listing.source.name}</dd></div>
          <div><dt>Mã nguồn</dt><dd>{listing.source.recordId}</dd></div>
          <div><dt>Phiên bản</dt><dd>{listing.source.version}</dd></div>
          <div><dt>Cập nhật</dt><dd>{listing.source.updatedAt}</dd></div>
        </dl>
      </div>

      <p className="landing-v5-listing-scope">
        {listing.isPrimary
          ? 'Hành trình giao dịch mở qua tài khoản demo.'
          : 'Tin bán công khai · không có hành trình giao dịch trong demo.'}
      </p>
    </article>
  )
}

export function LandingPage({
  listings = [],
  roles = [],
  unreadByRole = {},
  onEnterDemo = () => {},
}) {
  const [query, setQuery] = useState('')
  const searchInputRef = useRef(null)

  const publicListings = useMemo(() => listings
    .map(toPublicListing)
    .sort((left, right) => Number(right.isPrimary) - Number(left.isPrimary)
      || left.title.localeCompare(right.title, 'vi')), [listings])
  const hasPrimaryListing = publicListings.some(({ isPrimary }) => isPrimary)

  const normalizedQuery = normalizeText(query).trim()
  const visibleListings = useMemo(() => {
    if (!normalizedQuery) return publicListings
    return publicListings.filter((listing) => listing.searchText.includes(normalizedQuery))
  }, [normalizedQuery, publicListings])

  function focusMain() {
    document.getElementById('landing-v5-main')?.focus()
  }

  function scrollToSearch() {
    document.getElementById('landing-v5-search')?.scrollIntoView({
      behavior: preferredScrollBehavior(),
      block: 'start',
    })
    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }))
  }

  return (
    <div className="landing-v5" data-testid="landing-page">
      <button className="landing-v5-skip" type="button" onClick={focusMain}>Bỏ qua điều hướng</button>

      <header className="landing-v5-header">
        <div className="landing-v5-container landing-v5-header__inner">
          <button
            className="landing-v5-brand"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })}
            aria-label="Về đầu trang VMLS"
          >
            <BrandMark inverse ariaLabel="VMLS" />
          </button>
          <nav aria-label="Điều hướng trang chủ">
            <button type="button" onClick={scrollToSearch}>Tra cứu Tin bán</button>
            <a href="#landing-v5-registry">Living Registry</a>
          </nav>
          <DemoAccountMenu
            menuId="header-demo-accounts"
            roles={roles}
            unreadByRole={unreadByRole}
            onEnterDemo={onEnterDemo}
            variant="header"
            triggerAriaLabel="Chọn vai trò demo"
          />
        </div>
      </header>

      <main id="landing-v5-main" tabIndex="-1">
        <section className="landing-v5-hero" aria-labelledby="landing-v5-title">
          <div className="landing-v5-container landing-v5-hero__grid">
            <div className="landing-v5-hero__copy">
              <p className="landing-v5-eyebrow"><span /> Hạ tầng dữ liệu thị trường bất động sản</p>
              <h1 id="landing-v5-title">Một định danh. Mọi nguồn dữ liệu. Một hành trình có thể truy vết.</h1>
              <p className="landing-v5-lede">VMLS kết nối Bất động sản, Tin bán và Giao dịch thành một sổ bộ sống — nơi nguồn dữ liệu, quyền truy cập và từng thay đổi đều được ghi nhận rõ ràng.</p>
              <div className="landing-v5-hero__actions">
                <DemoAccountMenu
                  menuId="hero-demo-accounts"
                  roles={roles}
                  unreadByRole={unreadByRole}
                  onEnterDemo={onEnterDemo}
                />
                <button className="landing-v5-search-link" type="button" onClick={scrollToSearch}>
                  Tra cứu Tin bán <ArrowDown weight="bold" aria-hidden="true" />
                </button>
              </div>
              <ul className="landing-v5-principles" aria-label="Nguyên tắc Living Registry">
                <li><Fingerprint aria-hidden="true" /><span><strong>Định danh bền vững</strong><small>Tách biệt NPID, PLID và PTID</small></span></li>
                <li><LinkSimple aria-hidden="true" /><span><strong>Nguồn có provenance</strong><small>Mỗi bản ghi giữ dấu vết nguồn</small></span></li>
                <li><CheckCircle aria-hidden="true" /><span><strong>Thay đổi có lịch sử</strong><small>Không ghi đè hành trình đã qua</small></span></li>
              </ul>
            </div>
            <RegistryNetwork />
          </div>
        </section>

        <section id="landing-v5-search" className="landing-v5-search-section" aria-labelledby="landing-v5-search-title">
          <div className="landing-v5-container">
            <header className="landing-v5-section-heading">
              <div>
                <p className="landing-v5-eyebrow"><span /> Tra cứu công khai</p>
                <h2 id="landing-v5-search-title">Tin bán có định danh, dữ liệu có nguồn</h2>
              </div>
              <p>Chỉ hiển thị trường dữ liệu được phép công khai: NPID, PLID, thông tin Tin bán và provenance.</p>
            </header>

            <form className="landing-v5-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <MagnifyingGlass aria-hidden="true" />
              <label className="sr-only" htmlFor="landing-v5-search-input">Tìm theo NPID, PLID, tên Tin bán hoặc địa điểm</label>
              <input
                ref={searchInputRef}
                id="landing-v5-search-input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm NPID, PLID, tên Tin bán hoặc địa điểm…"
                autoComplete="off"
                data-testid="landing-search"
              />
              {query ? <button type="button" onClick={() => setQuery('')}>Xóa</button> : null}
            </form>

            <div className="landing-v5-result-meta" role="status" aria-live="polite">
              <strong>{visibleListings.length} Tin bán</strong>
              <span>{normalizedQuery
                ? `Kết quả cho “${query.trim()}”`
                : hasPrimaryListing
                  ? 'Phú Thượng được ghim làm hành trình demo chính'
                  : 'Hành trình Phú Thượng bắt đầu trong tài khoản Môi giới'}</span>
            </div>

            {visibleListings.length ? (
              <div className="landing-v5-listing-grid">
                {visibleListings.map((listing) => (
                  <PublicListingCard key={listing.key} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="landing-v5-empty">
                <MagnifyingGlass aria-hidden="true" />
                <h3>Chưa tìm thấy Tin bán phù hợp</h3>
                <p>Thử lại bằng NPID, PLID, tên Tin bán hoặc địa điểm.</p>
                <button type="button" onClick={() => setQuery('')}>Xem tất cả Tin bán</button>
              </div>
            )}

            <aside className="landing-v5-privacy-note">
              <ShieldCheck weight="duotone" aria-hidden="true" />
              <div><strong>Public projection</strong><p>Thông tin về các bên, hợp đồng, PTID, hồ sơ Thuế và trạng thái xử lý không xuất hiện trên trang công khai.</p></div>
            </aside>
          </div>
        </section>

        <section id="landing-v5-registry" className="landing-v5-registry-story" aria-labelledby="landing-v5-registry-title">
          <div className="landing-v5-container">
            <header className="landing-v5-section-heading is-light">
              <div>
                <p className="landing-v5-eyebrow"><span /> Living Registry</p>
                <h2 id="landing-v5-registry-title">Một hành trình, nhiều nguồn sự thật</h2>
              </div>
              <p>VMLS giữ từng nguồn riêng biệt và kết nối chúng bằng định danh thay vì san phẳng dữ liệu thành một bản ghi duy nhất.</p>
            </header>
            <ol className="landing-v5-story-steps">
              <li><span>01</span><Fingerprint aria-hidden="true" /><div><strong>Bất động sản</strong><small>NPID giữ định danh bền vững</small></div></li>
              <li><span>02</span><ShieldCheck aria-hidden="true" /><div><strong>Quyền đại diện</strong><small>Người bán xác nhận phạm vi và thời hạn</small></div></li>
              <li><span>03</span><Signpost aria-hidden="true" /><div><strong>Tin bán</strong><small>PLID gắn với ảnh chụp HouseNow</small></div></li>
              <li><span>04</span><Buildings aria-hidden="true" /><div><strong>Giao dịch</strong><small>357, Thuế và VPĐKĐĐ giữ dấu vết riêng</small></div></li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="landing-v5-footer">
        <div className="landing-v5-container">
          <BrandMark compact ariaLabel="VMLS" />
          <p>Sổ bộ sống cho một thị trường có thể truy vết.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })}>Về đầu trang</button>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
