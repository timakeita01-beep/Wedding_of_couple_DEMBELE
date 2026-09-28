const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
)

export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const PinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9v10.5h12V9" />
    <path d="M10 19.5v-5h4v5" />
  </svg>
)

export const ArrowUpRightIcon = (p) => (
  <svg {...base} width={16} height={16} {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
)

export const ArrowDownIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
)

export const ChevronIcon = ({ direction = 'right', ...p }) => (
  <svg {...base} width={24} height={24} {...p}>
    <path d={direction === 'right' ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'} />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} width={24} height={24} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
  </svg>
)
