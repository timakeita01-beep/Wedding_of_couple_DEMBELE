import './common.css'

/** Thin gold divider with a small diamond at its centre. */
export function Ornament({ className = '', light = false }) {
  return (
    <svg
      className={`ornament ${light ? 'ornament--light' : ''} ${className}`}
      viewBox="0 0 160 14"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1="7" x2="64" y2="7" />
      <line x1="96" y1="7" x2="160" y2="7" />
      <circle cx="70" cy="7" r="1.4" />
      <circle cx="90" cy="7" r="1.4" />
      <path d="M80 1.5 L85.5 7 L80 12.5 L74.5 7 Z" />
    </svg>
  )
}
