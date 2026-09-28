import * as m from 'motion/react-m'

export const EASE = [0.22, 1, 0.36, 1]

/** Fades and lifts its content into view once, when scrolled to. */
export function Reveal({ as = 'div', delay = 0, y = 28, duration = 1, children, ...rest }) {
  const Component = m[as]
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}
