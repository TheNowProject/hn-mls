import { useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Database,
  FileArrowUp,
  FilePdf,
  House,
  IdentificationCard,
  ListChecks,
  Signpost,
  Storefront,
  User,
  Warning,
} from '@phosphor-icons/react'
import BrandMark from './BrandMark.jsx'
import {
  HOUSING_MARKET_INFORMATION_SYSTEM_NAME,
  TRANSACTION_357_FIXTURE,
} from '../demo/v5Data.js'
import { V5_ACTIONS } from '../demo/v5Journey.js'
import '../styles/v5.css'

const ROLE_ICONS = Object.freeze({
  agent: IdentificationCard,
  brokerage: Storefront,
  seller: House,
  buyer: User,
  vmls: Database,
})

function formatMoney(value) {
  if (!Number.isFinite(value)) return 'Chưa có'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatTimestamp(value) {
  if (!value) return 'Chưa có'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parsed)
}

function formatDate(value) {
  if (!value) return 'Chưa có'
  const parsed = new Date(`${value}T00:00:00+07:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parsed)
}

function readableStatus(value) {
  if (!value) return 'Chưa có'
  return typeof value === 'string' ? value : value.label ?? value.status ?? 'Chưa có'
}

function formatLocation(value) {
  if (!value) return 'Chưa có'
  if (typeof value === 'string') return value
  return [value.ward, value.district, value.city].filter(Boolean).join(', ')
}

function reconciliationLabel(value) {
  return {
    matched: 'Khớp',
    mismatched: 'Lệch',
    missing_in_vmls: 'Thiếu ở VMLS',
    missing_in_357: `Thiếu ở ${HOUSING_MARKET_INFORMATION_SYSTEM_NAME}`,
    review_required: 'Cần xem xét',
  }[value] ?? readableStatus(value)
}

function reconciliationFieldLabel(field) {
  return {
    npid: 'NPID',
    contractNumber: 'Số hợp đồng',
    transactionValue: 'Giá trị giao dịch',
    buyerMasked: 'Người mua (đã mask)',
    sellerMasked: 'Người bán (đã mask)',
    notaryOffice: 'Văn phòng công chứng',
  }[field] ?? field
}

function reconciliationValue(field, value) {
  if (value === null || value === undefined || value === '') return 'Thiếu'
  return field === 'transactionValue' ? formatMoney(value) : String(value)
}

function obligationDisplay(item) {
  if (item.status !== 'Đã hoàn thành') return item.label ?? item.type
  if (item.id === 'personal_income_tax' || item.label === 'Thuế TNCN') return 'Đã đóng thuế TNCN'
  if (item.id === 'registration_fee' || item.label === 'Lệ phí trước bạ') return 'Đã đóng lệ phí trước bạ'
  return `Đã đóng ${String(item.label ?? item.type).toLocaleLowerCase('vi')}`
}

function statusTone(value) {
  const normalized = readableStatus(value).toLocaleLowerCase('vi')
  if (normalized.includes('hoàn thành')
    || normalized.includes('đã đóng')
    || normalized.includes('đã đồng bộ')
    || normalized.includes('đã xác nhận')
    || normalized.includes('đã khởi tạo')
    || normalized.includes('đã gửi')) return 'success'
  if (normalized.includes('cần') || normalized.includes('chờ') || normalized.includes('lệch') || normalized.includes('thiếu')) return 'warning'
  if (normalized.includes('đang') || normalized.includes('tiếp nhận')) return 'active'
  return 'neutral'
}

function StatusBadge({ children }) {
  return <span className={`v5-status v5-status--${statusTone(children)}`}>{children}</span>
}

function hasAction(projection, action) {
  return Array.isArray(projection.availableActions) && projection.availableActions.includes(action)
}

function partyDisplayName(party, fallback = 'Chưa có') {
  return party?.displayName ?? party?.maskedName ?? party?.name ?? party?.label ?? fallback
}

function partyReference(party) {
  return party?.reference ?? party?.id ?? 'Chưa có'
}

function representationParties(parties = {}) {
  const agent = parties.agent ?? parties.representative ?? {}
  const brokerage = parties.brokerage ?? {}
  return {
    seller: parties.seller ?? {},
    agent,
    brokerageName: partyDisplayName(
      brokerage,
      agent.organization ?? agent.brokerageName ?? 'Sàn HouseNow',
    ),
  }
}

function IdentityStrip({ property, listing, transaction }) {
  return (
    <nav className="v5-identity-strip" aria-label="Quan hệ định danh">
      <div data-testid="object-npid">
        <House aria-hidden="true" />
        <span>NPID</span>
        <strong>{property?.id ?? 'Chưa có'}</strong>
      </div>
      <ArrowRight aria-hidden="true" />
      <div data-testid="object-plid">
        <Signpost aria-hidden="true" />
        <span>PLID</span>
        <strong>{listing?.id ?? 'Chưa cấp'}</strong>
      </div>
      <ArrowRight aria-hidden="true" />
      <div data-testid="object-ptid">
        <ListChecks aria-hidden="true" />
        <span>PTID</span>
        <strong>{transaction?.id ?? 'Chưa cấp'}</strong>
      </div>
    </nav>
  )
}

function NotificationCenter({ notifications, unreadCount, onOpen }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  function closeAndRestoreFocus() {
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <div className="v5-notification-center" onKeyDown={(event) => {
      if (event.key !== 'Escape' || !open) return
      event.preventDefault()
      closeAndRestoreFocus()
    }}>
      <button
        ref={triggerRef}
        className="v5-icon-button"
        type="button"
        aria-label={`Thông báo${unreadCount ? `, ${unreadCount} chưa đọc` : ''}`}
        aria-expanded={open}
        aria-controls="v5-notification-popover"
        onClick={() => setOpen((current) => !current)}
        data-testid="notification-bell"
      >
        <Bell aria-hidden="true" />
        {unreadCount ? <span>{unreadCount}</span> : null}
      </button>
      {open ? (
        <section id="v5-notification-popover" className="v5-notification-popover" aria-label="Hộp thông báo">
          <header><strong>Thông báo</strong><span>{notifications.length} mục</span></header>
          {notifications.length ? notifications.map((notification) => (
            <button
              type="button"
              className={notification.readAt ? '' : 'is-unread'}
              key={notification.id}
              onClick={() => {
                onOpen(notification)
                setOpen(false)
              }}
            >
              <span>{notification.title}</span>
              <small>{notification.body ?? notification.message}</small>
              <time>{formatTimestamp(notification.createdAt)}</time>
            </button>
          )) : <p>Chưa có thông báo.</p>}
        </section>
      ) : null}
    </div>
  )
}

function RepresentationRequestForm({ property, representation, parties, onDispatch }) {
  const [propertyId, setPropertyId] = useState(property?.id ?? '')
  const [scope, setScope] = useState('Độc quyền')
  const [startsOn, setStartsOn] = useState(representation?.defaults?.startsOn ?? '2026-08-11')
  const [expiresOn, setExpiresOn] = useState(representation?.defaults?.expiresOn ?? '2026-09-10')
  const [error, setError] = useState('')
  const visibleParties = representationParties(parties)

  function submit(event) {
    event.preventDefault()
    setError('')
    if (!startsOn || !expiresOn || expiresOn <= startsOn) {
      setError('Ngày hết hạn phải sau ngày hiệu lực.')
      return
    }
    const accepted = onDispatch({
      type: V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
      actor: 'agent',
      payload: {
        propertyId: propertyId.trim().toLocaleUpperCase('vi'),
        scope,
        startsOn,
        expiresOn,
      },
    })
    if (!accepted) setError('Thông tin quyền đại diện chưa hợp lệ hoặc đề nghị đã được gửi.')
  }

  return (
    <form
      id="representation"
      className="v5-representation-form"
      onSubmit={submit}
      data-testid="representation-request-form"
      tabIndex="-1"
    >
      <header>
        <div><span className="v5-eyebrow">Việc cần xử lý</span><h2>Xin quyền đại diện từ Người bán</h2></div>
        <StatusBadge>Chưa gửi</StatusBadge>
      </header>
      <p>Môi giới khai báo phạm vi và thời hạn để Người bán kiểm tra trước khi VMLS khởi tạo Tin bán.</p>
      <div className="v5-form-grid">
        <label><span>Mã định danh Bất động sản</span><input name="propertyId" value={propertyId} onChange={(event) => setPropertyId(event.target.value)} required /></label>
        <label><span>Phạm vi đại diện</span><select value={scope} onChange={(event) => setScope(event.target.value)} required><option>Độc quyền</option><option>Không độc quyền</option></select></label>
        <label><span>Ngày hiệu lực</span><input name="startsOn" type="date" value={startsOn} onChange={(event) => setStartsOn(event.target.value)} required /></label>
        <label><span>Ngày hết hạn</span><input name="expiresOn" type="date" value={expiresOn} onChange={(event) => setExpiresOn(event.target.value)} required /></label>
      </div>
      <dl className="v5-form-readonly" aria-label="Các bên trong đề nghị đại diện">
        <div><dt>Người bán</dt><dd>{partyDisplayName(visibleParties.seller)}</dd></div>
        <div><dt>Mã định danh Người bán</dt><dd className="v5-mono">{partyReference(visibleParties.seller)}</dd></div>
        <div><dt>Người đại diện (Môi giới)</dt><dd>{partyDisplayName(visibleParties.agent)}</dd></div>
        <div><dt>Sàn môi giới</dt><dd>{visibleParties.brokerageName}</dd></div>
      </dl>
      {error ? <p className="v5-form-error" role="alert"><Warning weight="fill" aria-hidden="true" />{error}</p> : null}
      <button className="v5-primary-button" type="submit" data-testid="request-seller-confirmation">
        Gửi thông tin đến Người bán <ArrowRight weight="bold" aria-hidden="true" />
      </button>
    </form>
  )
}

function RepresentationPendingSummary({ representation, parties }) {
  if (representation?.status !== 'Chờ xác nhận') return null
  const request = representation.request ?? representation
  const visibleParties = representationParties(parties)
  return (
    <section id="representation" className="v5-panel" data-testid="representation-pending-summary" tabIndex="-1">
      <header>
        <div><span className="v5-eyebrow">Quyền đại diện</span><h2>Đang chờ Người bán xác nhận</h2></div>
        <StatusBadge>{representation?.status ?? 'Chờ xác nhận'}</StatusBadge>
      </header>
      <dl className="v5-facts">
        <div><dt>Bất động sản</dt><dd className="v5-mono">{representation.propertyId ?? request.propertyId}</dd></div>
        <div><dt>Người đại diện (Môi giới)</dt><dd>{partyDisplayName(visibleParties.agent, 'Đã ghi nhận trong hồ sơ')}</dd></div>
        <div><dt>Sàn môi giới</dt><dd>{visibleParties.brokerageName}</dd></div>
        <div><dt>Phạm vi</dt><dd>{request.scope}</dd></div>
        <div><dt>Hiệu lực</dt><dd>{formatDate(request.startsOn)} — {formatDate(request.expiresOn)}</dd></div>
      </dl>
    </section>
  )
}

function RepresentationConfirmationPanel({ property, representation, parties, onDispatch }) {
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const request = representation?.request ?? {}
  const visibleParties = representationParties(parties)

  function submit(event) {
    event.preventDefault()
    setError('')
    if (!accepted) {
      setError('Cần kiểm tra và xác nhận đầy đủ thông tin quyền đại diện.')
      return
    }
    const wasAccepted = onDispatch({
      type: V5_ACTIONS.CONFIRM_REPRESENTATION,
      actor: 'seller',
      payload: { accepted: true },
    })
    if (!wasAccepted) setError('Không thể xác nhận đề nghị này. Vui lòng kiểm tra trạng thái hồ sơ.')
  }

  return (
    <form
      id="representation"
      className="v5-representation-form"
      onSubmit={submit}
      data-testid="representation-confirmation-panel"
      tabIndex="-1"
    >
      <header>
        <div><span className="v5-eyebrow">Việc cần xử lý</span><h2>Xác nhận quyền đại diện</h2></div>
        <StatusBadge>Chờ xác nhận</StatusBadge>
      </header>
      <p>Kiểm tra đúng Bất động sản, Môi giới, phạm vi và thời hạn trước khi xác nhận.</p>
      <dl className="v5-confirmation-summary">
        <div><dt>Mã bản ghi xác nhận</dt><dd className="v5-mono">{representation?.confirmation?.id ?? representation?.confirmationId ?? 'Chưa có'}</dd></div>
        <div><dt>Mã định danh Bất động sản</dt><dd className="v5-mono">{property?.id ?? representation?.propertyId}</dd></div>
        <div><dt>Người đại diện (Môi giới)</dt><dd>{partyDisplayName(visibleParties.agent)}</dd></div>
        <div><dt>Sàn môi giới</dt><dd>{visibleParties.brokerageName}</dd></div>
        <div><dt>Phạm vi</dt><dd>{request.scope ?? 'Chưa có'}</dd></div>
        <div><dt>Hiệu lực</dt><dd>{formatDate(request.startsOn)} — {formatDate(request.expiresOn)}</dd></div>
      </dl>
      <label className="v5-review-checkbox">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} required />
        <span>Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn.</span>
      </label>
      {error ? <p className="v5-form-error" role="alert"><Warning weight="fill" aria-hidden="true" />{error}</p> : null}
      <button className="v5-primary-button" type="submit" data-testid="confirm-representation">
        Xác nhận quyền đại diện <Check weight="bold" aria-hidden="true" />
      </button>
    </form>
  )
}

function RepresentationLifecycle({ representation, listing }) {
  const requested = Boolean(representation?.request ?? representation?.requestedAt)
  const confirmed = representation?.status === 'Đã xác nhận'
  const currentIndex = !requested ? 0 : !confirmed ? 1 : !listing ? 2 : -1
  const stages = [
    {
      label: 'Môi giới gửi thông tin',
      status: requested ? 'Đã gửi' : 'Chưa gửi',
      done: requested,
    },
    {
      label: 'Người bán xác nhận',
      status: confirmed ? 'Đã xác nhận' : requested ? 'Chờ xác nhận' : 'Chưa bắt đầu',
      done: confirmed,
    },
    {
      label: 'VMLS cấp PLID',
      status: listing ? 'Tin bán đã khởi tạo' : 'Chưa cấp PLID',
      done: Boolean(listing),
    },
  ]
  return (
    <section className="v5-representation-lifecycle" aria-labelledby="representation-lifecycle-title" data-testid="representation-lifecycle">
      <header>
        <div><span className="v5-eyebrow">Trình tự trước giao dịch</span><h2 id="representation-lifecycle-title">Quyền đại diện → Tin bán</h2></div>
        <StatusBadge>{listing ? 'Tin bán đã khởi tạo' : representation?.status ?? 'Chưa gửi'}</StatusBadge>
      </header>
      <ol>
        {stages.map((stage, index) => (
          <li className={stage.done ? 'is-done' : currentIndex === index ? 'is-current' : ''} key={stage.label}>
            <span aria-hidden="true">{stage.done ? <Check weight="bold" /> : index + 1}</span>
            <div><strong>{stage.label}</strong><small>{stage.status}</small></div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ListingCreatedPanel({ listing, representation }) {
  if (!listing) return null
  return (
    <section className="v5-panel" data-testid="listing-created-panel">
      <header>
        <div><span className="v5-eyebrow">Tin bán VMLS</span><h2>Tin bán đã khởi tạo</h2></div>
        <StatusBadge>{listing.status ?? 'Đã khởi tạo'}</StatusBadge>
      </header>
      <dl className="v5-facts">
        <div><dt>PLID</dt><dd className="v5-mono">{listing.id}</dd></div>
        <div><dt>Quyền đại diện</dt><dd>{representation?.status ?? 'Đã xác nhận'}</dd></div>
        <div><dt>Kênh HouseNow</dt><dd><StatusBadge>Chưa phát hành</StatusBadge></dd></div>
      </dl>
    </section>
  )
}

function DeclarationForm({ listing, onDispatch }) {
  const [buyerRef, setBuyerRef] = useState('PARTY-BUYER-HN-0518')
  const [transactionValue, setTransactionValue] = useState('18400000000')
  const [contractNumber, setContractNumber] = useState('HDCN-2026-0819-PT')
  const [contractDate, setContractDate] = useState('2026-08-19')
  const [notaryOffice, setNotaryOffice] = useState('Văn phòng công chứng Tây Hồ')
  const [notarizedAt, setNotarizedAt] = useState('2026-08-19T15:30')
  const [transferContract, setTransferContract] = useState(null)
  const [depositContract, setDepositContract] = useState(null)
  const [error, setError] = useState('')

  function fileMetadata(file) {
    if (!file) return null
    return {
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      sizeBytes: file.size,
    }
  }

  function submit(event) {
    event.preventDefault()
    setError('')
    if (!transferContract || !transferContract.name.toLocaleLowerCase('vi').endsWith('.pdf')) {
      setError('Cần tải lên Hợp đồng chuyển nhượng đã công chứng dạng PDF.')
      return
    }
    if (depositContract && !depositContract.name.toLocaleLowerCase('vi').endsWith('.pdf')) {
      setError('Hợp đồng đặt cọc phải là tệp PDF.')
      return
    }

    const documents = { transferContract: fileMetadata(transferContract) }
    if (depositContract) documents.depositContract = fileMetadata(depositContract)
    const accepted = onDispatch({
      type: V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
      actor: 'agent',
      payload: {
        listingId: listing.id,
        buyerRef,
        transactionValue: Number(transactionValue),
        contractNumber,
        contractDate,
        notaryOffice,
        notarizedAt: `${notarizedAt}:00+07:00`,
        documents,
      },
    })
    if (!accepted) setError('Dữ liệu khai báo chưa hợp lệ hoặc giao dịch đã được submit.')
  }

  return (
    <form className="v5-declaration-form" onSubmit={submit} data-testid="transaction-declaration-form">
      <header>
        <div><span className="v5-eyebrow">Việc cần xử lý</span><h2>Khai báo giao dịch đã công chứng</h2></div>
        <StatusBadge>Sẵn sàng khai báo</StatusBadge>
      </header>
      <p>Thông tin Bất động sản, Tin bán và Người bán được lấy từ Listing đã khớp HouseNow.</p>
      <div className="v5-form-grid">
        <label><span>PLID</span><input value={listing.id} readOnly /></label>
        <label><span>Mã định danh Người mua</span><input value={buyerRef} onChange={(event) => setBuyerRef(event.target.value)} required /></label>
        <label><span>Giá trị giao dịch (VND)</span><input type="number" min="1" step="1" value={transactionValue} onChange={(event) => setTransactionValue(event.target.value)} required /></label>
        <label><span>Số hợp đồng</span><input value={contractNumber} onChange={(event) => setContractNumber(event.target.value)} required /></label>
        <label><span>Ngày hợp đồng</span><input type="date" value={contractDate} onChange={(event) => setContractDate(event.target.value)} required /></label>
        <label><span>Văn phòng công chứng</span><input value={notaryOffice} onChange={(event) => setNotaryOffice(event.target.value)} required /></label>
        <label><span>Thời điểm công chứng</span><input type="datetime-local" value={notarizedAt} onChange={(event) => setNotarizedAt(event.target.value)} required /></label>
      </div>
      <div className="v5-upload-grid">
        <label>
          <FilePdf aria-hidden="true" />
          <span><strong>HĐ chuyển nhượng đã công chứng</strong><small>Bắt buộc · PDF</small></span>
          <input aria-label="Hợp đồng chuyển nhượng đã công chứng" type="file" accept="application/pdf,.pdf" onChange={(event) => setTransferContract(event.target.files?.[0] ?? null)} required />
        </label>
        <label>
          <FileArrowUp aria-hidden="true" />
          <span><strong>Hợp đồng đặt cọc</strong><small>Tùy chọn · PDF</small></span>
          <input aria-label="Hợp đồng đặt cọc" type="file" accept="application/pdf,.pdf" onChange={(event) => setDepositContract(event.target.files?.[0] ?? null)} />
        </label>
      </div>
      {error ? <p className="v5-form-error" role="alert"><Warning weight="fill" aria-hidden="true" />{error}</p> : null}
      <button className="v5-primary-button" type="submit" data-testid="submit-transaction-declaration">
        Submit và chuyển hồ sơ sang Thuế <ArrowRight weight="bold" aria-hidden="true" />
      </button>
    </form>
  )
}

function DeclarationSummary({ declaration, transaction }) {
  if (!declaration) return null
  const transfer = declaration.documents?.transferContract
  const deposit = declaration.documents?.depositContract
  return (
    <section className="v5-panel" data-testid="declaration-summary">
      <header><div><span className="v5-eyebrow">Nguồn VMLS</span><h2>Khai báo của Môi giới</h2></div><StatusBadge>Đã submit</StatusBadge></header>
      <dl className="v5-facts">
        <div><dt>PTID</dt><dd className="v5-mono">{transaction?.id}</dd></div>
        <div><dt>Hợp đồng</dt><dd>{declaration.contractNumber}</dd></div>
        <div><dt>Ngày hợp đồng</dt><dd>{declaration.contractDate}</dd></div>
        <div><dt>Giá trị giao dịch</dt><dd>{formatMoney(declaration.transactionValue)}</dd></div>
        <div><dt>VPCC</dt><dd>{declaration.notaryOffice}</dd></div>
        {transfer || deposit ? <div><dt>Tài liệu</dt><dd>{[transfer?.fileName, deposit?.fileName].filter(Boolean).join(' · ')}</dd></div> : null}
      </dl>
    </section>
  )
}

function HouseNowSnapshotPanel({ snapshot }) {
  if (!snapshot) return null
  return (
    <section className="v5-panel" data-testid="house-now-snapshot">
      <header>
        <div><span className="v5-eyebrow">Nguồn dữ liệu Tin bán</span><h2>Dữ liệu HouseNow đã khớp</h2></div>
        <StatusBadge>Đã khớp NPID · PLID</StatusBadge>
      </header>
      <dl className="v5-facts v5-facts--compact">
        <div><dt>External Listing ID</dt><dd className="v5-mono">{snapshot.externalListingId}</dd></div>
        <div><dt>Phiên bản nguồn</dt><dd className="v5-mono">{snapshot.sourceVersion}</dd></div>
        <div><dt>Cập nhật tại HouseNow</dt><dd>{formatTimestamp(snapshot.sourceUpdatedAt)}</dd></div>
        <div><dt>VMLS nhận snapshot</dt><dd>{formatTimestamp(snapshot.retrievedAt)}</dd></div>
        <div><dt>Đối soát định danh</dt><dd>Đã khớp NPID · PLID</dd></div>
        <div><dt>Phân phối từ VMLS</dt><dd>Chưa phát hành</dd></div>
      </dl>
    </section>
  )
}

function OpsControls({ projection, nextMilestone, onDispatch }) {
  const transactionReady = Boolean(projection.transaction?.id)
  const synced357 = Boolean(projection.transactionSource357)
  return (
    <section className="v5-ops-controls" data-testid="ops-controls">
      <header>
        <div><span className="v5-eyebrow">Vận hành VMLS</span><h2>Đồng bộ nguồn và tiến độ</h2></div>
        <span className="v5-mono">{projection.caseId}</span>
      </header>
      <div className="v5-sync-grid">
        <article>
          <Database aria-hidden="true" />
          <div><h3>Giao dịch từ {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</h3><p>Nhận một snapshot nguồn riêng và đối soát từng trường với khai báo VMLS.</p></div>
          <StatusBadge>{synced357 ? 'Đã đồng bộ' : transactionReady ? 'Sẵn sàng' : 'Chờ PTID'}</StatusBadge>
          <button
            type="button"
            disabled={!transactionReady || synced357}
            data-testid="sync-357"
            onClick={() => onDispatch({
              type: V5_ACTIONS.SYNC_TRANSACTION_FROM_357,
              actor: 'vmls',
              payload: TRANSACTION_357_FIXTURE,
            })}
          >
            {synced357 ? <Check aria-hidden="true" /> : <Database aria-hidden="true" />}
            {synced357 ? `Đã đồng bộ từ ${HOUSING_MARKET_INFORMATION_SYSTEM_NAME}` : `Đồng bộ từ ${HOUSING_MARKET_INFORMATION_SYSTEM_NAME}`}
          </button>
        </article>
        <article>
          <Clock aria-hidden="true" />
          <div><h3>Thuế và VPĐKĐĐ</h3><p>Mỗi lần bấm chỉ nhận đúng một event tiếp theo trong chuỗi tuyến tính.</p></div>
          <StatusBadge>{nextMilestone ? `Mốc ${nextMilestone.sequence}/6` : transactionReady ? 'Đã hoàn tất' : 'Chờ PTID'}</StatusBadge>
          <div className="v5-next-event"><span>Bản tin tiếp theo</span><strong>{nextMilestone?.label ?? 'Chưa có'}</strong></div>
          <button
            type="button"
            disabled={!nextMilestone}
            data-testid="advance-processing"
            onClick={() => onDispatch({
              type: V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING,
              actor: 'vmls',
              payload: {},
            })}
          >
            <ArrowRight aria-hidden="true" /> Đồng bộ từ Thuế và VPĐKĐĐ
          </button>
        </article>
      </div>
    </section>
  )
}

function ReconciliationPanel({ source, reconciliation }) {
  if (!source && !reconciliation) return null
  const fields = reconciliation?.fields ?? reconciliation?.results ?? []
  return (
    <section className="v5-panel" data-testid="reconciliation-panel">
      <header>
        <div><span className="v5-eyebrow">Đối soát hai nguồn</span><h2>VMLS ↔ {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</h2></div>
        <StatusBadge>{reconciliationLabel(reconciliation?.status ?? reconciliation?.overallStatus ?? 'Đã đồng bộ')}</StatusBadge>
      </header>
      <dl className="v5-facts v5-facts--compact">
        <div><dt>Mã giao dịch của {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</dt><dd className="v5-mono">{source?.transactionCode}</dd></div>
        <div><dt>Cập nhật tại nguồn</dt><dd>{formatTimestamp(source?.sourceUpdatedAt)}</dd></div>
      </dl>
      {fields.length ? (
        <div className="v5-table-scroll"><table className="v5-reconciliation-table">
          <thead><tr><th>Trường</th><th>Khai báo VMLS</th><th>Nguồn {HOUSING_MARKET_INFORMATION_SYSTEM_NAME}</th><th>Kết quả</th></tr></thead>
          <tbody>{fields.map((field) => (
            <tr key={field.field ?? field.key}>
              <th>{field.label ?? reconciliationFieldLabel(field.field)}</th>
              <td>{reconciliationValue(field.field, field.vmlsValue ?? field.declaredValue)}</td>
              <td>{reconciliationValue(field.field, field.source357Value ?? field.sourceValue ?? field.value357)}</td>
              <td><StatusBadge>{reconciliationLabel(field.status)}</StatusBadge></td>
            </tr>
          ))}</tbody>
        </table></div>
      ) : null}
    </section>
  )
}

function ProcessingPanel({ processing }) {
  const obligations = processing?.financialObligations ?? []
  const events = processing?.externalEvents ?? []
  const tax = processing?.tax
  const land = processing?.landRegistry
  if (!tax && !land && !events.length) return null

  return (
    <section className="v5-panel" data-testid="processing-panel">
      <header><div><span className="v5-eyebrow">Tiến độ hồ sơ</span><h2>Thuế → Văn phòng đăng ký đất đai</h2></div></header>
      <div className="v5-processing-cases">
        <article><span>Cơ quan Thuế</span><strong>{readableStatus(tax?.status)}</strong>{tax && Object.hasOwn(tax, 'sourceCaseId') ? <small>{tax.sourceCaseId ?? 'Chưa có mã hồ sơ nguồn'}</small> : null}{tax?.appointmentRef ? <small>Giấy hẹn: {tax.appointmentRef}</small> : null}</article>
        <ArrowRight aria-hidden="true" />
        <article className={land ? '' : 'is-locked'}><span>VPĐKĐĐ</span><strong>{readableStatus(land?.status)}</strong>{!land || Object.hasOwn(land, 'sourceCaseId') ? <small>{land?.sourceCaseId ?? (land ? 'Chờ mã hồ sơ nguồn' : 'Mở sau khi hoàn thành nghĩa vụ tài chính')}</small> : null}</article>
      </div>
      {obligations.length ? <div className="v5-obligations">{obligations.map((item) => (
        <div key={item.id ?? item.type}><span>{obligationDisplay(item)}</span><StatusBadge>{item.status === 'Đã hoàn thành' ? 'Đã đóng' : item.status}</StatusBadge></div>
      ))}</div> : null}
      {events.length ? <ol className="v5-timeline">{events.map((event) => (
        <li key={event.id ?? `${event.source}-${event.sourceUpdatedAt}`}><span><CheckCircle weight="fill" aria-hidden="true" /></span><div><strong>{event.label ?? event.milestone}</strong><p>{event.rawStatus ?? event.normalizedStatus ?? event.status}</p><small>{event.source === 'tax' ? 'Cơ quan Thuế' : 'VPĐKĐĐ'} · {formatTimestamp(event.receivedAt ?? event.sourceUpdatedAt)}</small></div></li>
      ))}</ol> : null}
    </section>
  )
}

function RoleInbox({ notifications, workItems, onOpenNotification }) {
  function workItemStatus(item) {
    const representationWork = Boolean(item.representationId)
      || item.type === 'representation_confirmation'
      || String(item.title ?? item.label ?? '').toLocaleLowerCase('vi').includes('quyền đại diện')
    const resolved = item.status === 'resolved' || item.status === 'Đã xác nhận'
    if (representationWork) return resolved ? 'Đã xác nhận' : 'Cần xác nhận trong VMLS'
    return resolved ? 'Đã kết thúc theo trạng thái nguồn' : 'Cần thực hiện ngoài VMLS'
  }

  return (
    <section className="v5-panel" id="inbox" data-testid="role-inbox">
      <header><div><span className="v5-eyebrow">Hộp thư theo tài khoản</span><h2>Thông báo và việc cần làm</h2></div><span>{notifications.length} thông báo</span></header>
      <div className="v5-inbox-grid">
        <div>
          <h3>Thông báo</h3>
          {notifications.length ? notifications.map((notification) => (
            <button key={notification.id} type="button" className={notification.readAt ? 'v5-inbox-item' : 'v5-inbox-item is-unread'} onClick={() => onOpenNotification(notification)}>
              <strong>{notification.title}</strong><span>{notification.body ?? notification.message}</span><time>{formatTimestamp(notification.createdAt)}</time>
            </button>
          )) : <p className="v5-empty-copy">Chưa có thông báo cho tài khoản này.</p>}
        </div>
        <div>
          <h3>Việc cần làm</h3>
          {workItems.length ? workItems.map((item) => (
            <article className="v5-work-item" key={item.id}>
              <strong>{item.title ?? item.label}</strong><span>{item.body ?? item.description ?? item.instruction}</span><StatusBadge>{workItemStatus(item)}</StatusBadge>
            </article>
          )) : <p className="v5-empty-copy">Không có việc ngoài VMLS ở thời điểm này.</p>}
        </div>
      </div>
    </section>
  )
}

function roleIntro(roleId, projection) {
  const representationPending = projection.representation?.status === 'Chờ xác nhận'
  const listingReady = Boolean(projection.listing)
  const copy = {
    agent: listingReady
      ? ['Khai báo giao dịch', 'Tin bán đã được khởi tạo; tiếp tục khai báo giao dịch đã công chứng và bàn giao hồ sơ sang Thuế.']
      : ['Thiết lập quyền đại diện', 'Gửi phạm vi và thời hạn đại diện để Người bán kiểm tra trước khi VMLS khởi tạo Tin bán.'],
    brokerage: listingReady
      ? ['Giám sát giao dịch', 'Theo dõi Tin bán, khai báo của Môi giới và tiến độ liên cơ quan, không có gate duyệt.']
      : ['Giám sát quyền đại diện', 'Theo dõi đề nghị của Môi giới và xác nhận của Người bán; Sàn không xác nhận thay hai bên.'],
    seller: representationPending
      ? ['Xác nhận quyền đại diện', 'Kiểm tra Bất động sản, Môi giới, phạm vi và thời hạn trước khi xác nhận.']
      : ['Hồ sơ của Người bán', listingReady ? 'Theo dõi Tin bán và các thông báo liên quan đến hồ sơ.' : 'Chờ Môi giới gửi thông tin quyền đại diện.'],
    buyer: projection.transaction?.id
      ? ['Hồ sơ của Người mua', 'Theo dõi tiến độ và nhận thông báo đến lấy Giấy chứng nhận khi hoàn tất.']
      : ['Hồ sơ của Người mua', 'Chưa có giao dịch nào được chia sẻ với tài khoản này.'],
    vmls: ['Điều phối nguồn dữ liệu', `Đồng bộ giao dịch từ ${HOUSING_MARKET_INFORMATION_SYSTEM_NAME} và nhận từng event Thuế → VPĐKĐĐ.`],
  }
  return copy[roleId] ?? copy.agent
}

export function V5Workspace({
  role,
  roles,
  projection,
  unreadCount = 0,
  unreadByRole = {},
  nextMilestone = null,
  onDispatch,
  onSwitchRole,
  onOpenDossier,
  onOpenLanding,
  onReset,
}) {
  const [title, description] = roleIntro(role.id, projection)
  const RoleIcon = ROLE_ICONS[role.id] ?? User
  const notifications = projection.notifications ?? []
  const workItems = projection.workItems ?? []
  const parties = projection.parties ?? projection.representation?.parties
  const openNotification = (notification) => {
    onDispatch({
      type: V5_ACTIONS.MARK_NOTIFICATION_READ,
      actor: role.id,
      payload: { notificationId: notification.id },
    })
    if (notification.transactionId) {
      onOpenDossier(notification.transactionId)
      return
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const representationPanel = document.getElementById('representation')
        representationPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        representationPanel?.focus({ preventScroll: true })
      })
    })
  }

  const currentStatus = useMemo(() => {
    if (projection.transaction?.completedAt) return 'Đã hoàn thành sang tên'
    if (projection.processing?.landRegistry) return readableStatus(projection.processing.landRegistry.status)
    if (projection.processing?.tax) return readableStatus(projection.processing.tax.status)
    if (projection.transaction?.id) return 'Đã tạo giao dịch và chuyển sang Thuế'
    if (role.id === 'buyer') return 'Chưa có giao dịch được chia sẻ'
    if (projection.listing) return 'Tin bán đã khởi tạo'
    if (!projection.representation) return 'Chưa có giao dịch được chia sẻ'
    if (projection.representation?.status === 'Chờ xác nhận') return 'Chờ Người bán xác nhận'
    return 'Chờ gửi thông tin đến Người bán'
  }, [projection, role.id])

  const canRequestRepresentation = role.id === 'agent'
    && hasAction(projection, V5_ACTIONS.REQUEST_SELLER_CONFIRMATION)
  const canConfirmRepresentation = role.id === 'seller'
    && hasAction(projection, V5_ACTIONS.CONFIRM_REPRESENTATION)
  const canSubmitDeclaration = role.id === 'agent'
    && Boolean(projection.listing)
    && hasAction(projection, V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION)
  const showPendingRepresentation = projection.representation?.status === 'Chờ xác nhận'
    && !canConfirmRepresentation
  const hasDossier = Boolean(projection.property)

  return (
    <div className="v5-app" data-testid="app-shell">
      <a className="skip-link" href="#workspace-main">Bỏ qua điều hướng</a>
      <header className="v5-app-header">
        <button type="button" className="v5-brand-button" onClick={onOpenLanding} aria-label="Về trang chủ VMLS"><BrandMark inverse /></button>
        <div className="v5-data-label"><span>Sổ bộ dữ liệu</span><strong>{projection.dataLabel}</strong></div>
        <div className="v5-header-actions">
          <NotificationCenter notifications={notifications} unreadCount={unreadCount} onOpen={openNotification} />
          <label className="v5-role-switcher"><span className="sr-only">Đổi tài khoản demo</span><RoleIcon aria-hidden="true" /><select value={role.id} onChange={(event) => onSwitchRole(event.target.value)} data-testid="role-switcher">{roles.map((item) => <option value={item.id} key={item.id}>{item.label}{unreadByRole[item.id] ? ` · ${unreadByRole[item.id]} mới` : ''}</option>)}</select></label>
          <button type="button" className="v5-reset-button" onClick={onReset} data-testid="reset-data">Đặt lại demo</button>
        </div>
      </header>

      <div className="v5-shell">
        <aside className="v5-sidebar">
          <div className="v5-role-card"><RoleIcon aria-hidden="true" /><span>Tài khoản demo</span><strong>{role.label}</strong><small>{role.organization ?? role.accountContext ?? 'Bộ dữ liệu mẫu'}</small></div>
          <nav aria-label="Điều hướng không gian làm việc">
            <a href="#workspace-main"><ListChecks aria-hidden="true" />Công việc</a>
            <a href="#dossier"><House aria-hidden="true" />{projection.transaction?.id ? 'Hồ sơ giao dịch' : hasDossier ? 'Hồ sơ Bất động sản' : 'Hồ sơ được chia sẻ'}</a>
            <a href="#inbox"><Bell aria-hidden="true" />Thông báo{unreadCount ? <span>{unreadCount}</span> : null}</a>
          </nav>
          <div className="v5-sidebar-note"><Database aria-hidden="true" /><span>Prototype client-side</span><small>Không kết nối hệ thống bên ngoài.</small></div>
        </aside>

        <main id="workspace-main" className="v5-main" tabIndex="-1">
          <header className="v5-workspace-heading">
            <div><span className="v5-eyebrow">{role.label}</span><h1>{title}</h1><p>{description}</p></div>
            <div><span>Trạng thái hiện tại</span><StatusBadge>{currentStatus}</StatusBadge></div>
          </header>

          <section id="dossier" className="v5-dossier-card" tabIndex="-1">
            {hasDossier ? <>
              <header><div><span>{projection.transaction?.id ? 'Hồ sơ giao dịch' : 'Hồ sơ Bất động sản'}</span><h2>{projection.property.label}</h2><p>{formatLocation(projection.property.location)}</p></div><span className="v5-mono">{projection.caseId}</span></header>
              <IdentityStrip property={projection.property} listing={projection.listing} transaction={projection.transaction} />
              <div className="v5-property-facts">
                <span>{projection.property.type}</span>
                {projection.listing ? <span>{projection.listing.askingPrice?.displayValue ?? formatMoney(projection.listing.askingPrice?.value)}</span> : <span>PLID: Chưa cấp</span>}
                {projection.houseNowSnapshot
                  ? <span>Nguồn dữ liệu Tin bán: HouseNow</span>
                  : projection.listing
                    ? <span>Tin bán: {projection.listing.status ?? 'Đã khởi tạo'}</span>
                    : projection.representation
                      ? <span>Tin bán: Chưa khởi tạo</span>
                      : <span>Chưa có giao dịch được chia sẻ</span>}
              </div>
            </> : <header><div><span>Hồ sơ được chia sẻ</span><h2>Chưa có hồ sơ</h2><p>Tài khoản này chưa được gắn với giao dịch nào.</p></div></header>}
          </section>

          {projection.representation ? <RepresentationLifecycle representation={projection.representation} listing={projection.listing} /> : null}
          {canRequestRepresentation ? <RepresentationRequestForm property={projection.property} representation={projection.representation} parties={parties} onDispatch={onDispatch} /> : null}
          {canConfirmRepresentation ? <RepresentationConfirmationPanel property={projection.property} representation={projection.representation} parties={parties} onDispatch={onDispatch} /> : null}
          {showPendingRepresentation ? <RepresentationPendingSummary representation={projection.representation} parties={parties} /> : null}
          <ListingCreatedPanel listing={projection.listing} representation={projection.representation} />
          <HouseNowSnapshotPanel snapshot={projection.houseNowSnapshot} />
          {canSubmitDeclaration ? <DeclarationForm listing={projection.listing} onDispatch={onDispatch} /> : null}
          {role.id === 'vmls' ? <OpsControls projection={projection} nextMilestone={nextMilestone} onDispatch={onDispatch} /> : null}
          {projection.declaration ? <DeclarationSummary declaration={projection.declaration} transaction={projection.transaction} /> : null}
          {role.id === 'vmls' ? <ReconciliationPanel source={projection.transactionSource357} reconciliation={projection.reconciliation} /> : null}
          <ProcessingPanel processing={projection.processing} />
          <RoleInbox notifications={notifications} workItems={workItems} onOpenNotification={openNotification} />
        </main>
      </div>
    </div>
  )
}

export default V5Workspace
