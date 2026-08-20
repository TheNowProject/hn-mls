import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Check,
  IdentificationCard,
  LockKey,
  SignOut,
  X,
} from '@phosphor-icons/react'
import '../styles/governance.css'

const DEFAULT_SCOPES = Object.freeze([
  'Họ tên đã định danh',
  'Mã định danh công dân đã che',
  'Trạng thái xác thực danh tính',
])

function focusableElements(container) {
  if (!container) return []

  return [...container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hasAttribute('hidden'))
}

/**
 * Local, two-step VNeID handoff dialog. Authentication state remains owned by the caller.
 */
export function VNeIDSessionDialog({
  open = false,
  step = 'scope',
  identity = {},
  scopes = DEFAULT_SCOPES,
  onContinue,
  onBack,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const firstTarget = dialogRef.current?.querySelector('[data-dialog-autofocus]')
      ?? focusableElements(dialogRef.current)[0]
    firstTarget?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open])

  if (!open) return null

  const isIdentityStep = step === 'identity'
  const titleId = 'vneid-session-title'
  const descriptionId = 'vneid-session-description'

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel?.()
      return
    }

    if (event.key !== 'Tab') return
    const elements = focusableElements(dialogRef.current)
    if (!elements.length) return

    const first = elements[0]
    const last = elements.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="gov-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.()
      }}
    >
      <section
        ref={dialogRef}
        className="gov-dialog"
        data-testid="vneid-session-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onKeyDown={handleKeyDown}
      >
        <header className="gov-dialog__header">
          <span className="gov-icon-box" aria-hidden="true"><IdentificationCard /></span>
          <div>
            <span className="gov-eyebrow">Xác thực danh tính</span>
            <h2 id={titleId}>{isIdentityStep ? 'Xác nhận thông tin VNeID' : 'Đăng nhập bằng VNeID'}</h2>
          </div>
          <button
            className="gov-icon-button"
            type="button"
            aria-label="Đóng cửa sổ đăng nhập VNeID"
            onClick={onCancel}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        {!isIdentityStep ? (
          <div className="gov-dialog__body">
            <p id={descriptionId}>
              VMLS sẽ nhận các thông tin dưới đây sau khi bạn đồng ý chia sẻ.
            </p>
            <ul className="gov-consent-list" aria-label="Phạm vi thông tin được chia sẻ">
              {scopes.map((scope) => (
                <li key={scope}><Check weight="bold" aria-hidden="true" /><span>{scope}</span></li>
              ))}
            </ul>
            <div className="gov-notice">
              <LockKey aria-hidden="true" />
              <span>Phiên đăng nhập không thay đổi vai trò làm việc hoặc quyền xem hồ sơ.</span>
            </div>
          </div>
        ) : (
          <div className="gov-dialog__body">
            <p id={descriptionId}>Kiểm tra thông tin đã che trước khi hoàn tất đăng nhập.</p>
            <dl className="gov-identity-review">
              <div><dt>Họ tên</dt><dd>{identity.displayName ?? 'Nguyễn T*** A**'}</dd></div>
              <div><dt>Mã định danh</dt><dd className="gov-mono">{identity.reference ?? '0••••••••123'}</dd></div>
              <div><dt>Trạng thái</dt><dd>{identity.status ?? 'Đã xác thực'}</dd></div>
            </dl>
          </div>
        )}

        <footer className="gov-dialog__footer">
          {isIdentityStep ? (
            <button className="gov-button gov-button--secondary" type="button" onClick={onBack}>
              <ArrowLeft aria-hidden="true" /> Quay lại
            </button>
          ) : (
            <button className="gov-button gov-button--secondary" type="button" onClick={onCancel}>
              Hủy
            </button>
          )}
          <button
            className="gov-button gov-button--primary"
            type="button"
            data-dialog-autofocus
            onClick={isIdentityStep ? onConfirm : onContinue}
          >
            {isIdentityStep ? 'Xác nhận đăng nhập' : 'Tiếp tục'}
          </button>
        </footer>
      </section>
    </div>
  )
}

/**
 * Header/landing control around VNeIDSessionDialog.
 * `session` is null while signed out and a masked identity object while signed in.
 */
export function VNeIDSessionControl({
  session,
  identityPreview,
  scopes = DEFAULT_SCOPES,
  onLogin,
  onLogout,
  variant = 'header',
  className = '',
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStep, setDialogStep] = useState('scope')
  const loginButtonRef = useRef(null)
  const logoutButtonRef = useRef(null)
  const pendingFocusRef = useRef(null)

  useEffect(() => {
    if (session && pendingFocusRef.current === 'session') {
      logoutButtonRef.current?.focus()
      pendingFocusRef.current = null
    } else if (!session && pendingFocusRef.current === 'login') {
      loginButtonRef.current?.focus()
      pendingFocusRef.current = null
    }
  }, [session])

  function closeDialog() {
    setDialogOpen(false)
    setDialogStep('scope')
  }

  function confirmLogin() {
    pendingFocusRef.current = 'session'
    onLogin?.(identityPreview)
    closeDialog()
  }

  function logout() {
    pendingFocusRef.current = 'login'
    onLogout?.()
  }

  if (session) {
    return (
      <div className={`gov-vneid-session gov-vneid-session--${variant} ${className}`.trim()} data-testid="vneid-session-control">
        <IdentificationCard aria-hidden="true" />
        <span>
          <small>Đã đăng nhập VNeID</small>
          <strong>{session.displayName ?? session.reference ?? 'Danh tính đã xác thực'}</strong>
        </span>
        <button ref={logoutButtonRef} type="button" onClick={logout} aria-label="Đăng xuất khỏi phiên VNeID">
          <SignOut aria-hidden="true" /> <span>Đăng xuất</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        ref={loginButtonRef}
        className={`gov-vneid-login gov-vneid-login--${variant} ${className}`.trim()}
        type="button"
        data-testid="vneid-session-control"
        onClick={() => setDialogOpen(true)}
      >
        <IdentificationCard aria-hidden="true" />
        <span>Đăng nhập bằng VNeID</span>
      </button>
      <VNeIDSessionDialog
        open={dialogOpen}
        step={dialogStep}
        identity={identityPreview}
        scopes={scopes}
        onContinue={() => setDialogStep('identity')}
        onBack={() => setDialogStep('scope')}
        onConfirm={confirmLogin}
        onCancel={closeDialog}
      />
    </>
  )
}

export default VNeIDSessionControl
