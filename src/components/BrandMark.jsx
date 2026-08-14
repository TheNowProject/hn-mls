import '../styles/tokens.css'

export function BrandMark({
  className = '',
  compact = false,
  inverse = false,
  ariaLabel = 'VMLS by HouseNow — Hạ tầng dữ liệu thị trường bất động sản Việt Nam',
}) {
  const classes = [
    'vmls-brand-mark',
    compact ? 'vmls-brand-mark--compact' : '',
    inverse ? 'vmls-brand-mark--inverse' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} role="img" aria-label={ariaLabel}>
      <svg
        className="vmls-brand-mark__glyph"
        viewBox="0 0 54 56"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="vmls-brand-mark__facet vmls-brand-mark__facet--left"
          d="M3 5h9.4l15.9 34.8-5.1 11.1L3 7.2V5Z"
        />
        <path
          className="vmls-brand-mark__facet vmls-brand-mark__facet--middle-left"
          d="M15.8 5h9.4l7.9 17.2-5.2 11.2L15.8 7.2V5Z"
        />
        <path
          className="vmls-brand-mark__facet vmls-brand-mark__facet--middle-right"
          d="M29.1 5h9.4L31 21.4l-4.7-10.3L29.1 5Z"
        />
        <path
          className="vmls-brand-mark__facet vmls-brand-mark__facet--right"
          d="M41.6 5H51L30.8 50.9l-5.2-11.3L41.6 5Z"
        />
      </svg>

      <span className="vmls-brand-mark__wordmark" aria-hidden="true">
        <strong>VMLS</strong>
        {!compact && <small>by HouseNow</small>}
      </span>
    </span>
  )
}

export default BrandMark
