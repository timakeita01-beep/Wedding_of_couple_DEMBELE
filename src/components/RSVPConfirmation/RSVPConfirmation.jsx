import { useEffect, useRef } from 'react'
import * as m from 'motion/react-m'
import { weddingData } from '../../data/weddingData'
import { Ornament } from '../common/Ornament'
import { EASE } from '../common/Reveal'
import { HeartIcon } from '../common/Icons'
import './RSVPConfirmation.css'

const t = weddingData.text.confirmation
const COLORS = ['#d8c093', '#b39159', '#e8cfc8', '#b98a82', '#fbf7f1']

async function celebrate() {
  // Loaded only when needed, to keep the initial page light.
  const { default: confetti } = await import('canvas-confetti')
  const base = {
    colors: COLORS,
    disableForReducedMotion: true,
    ticks: 260,
    gravity: 0.7,
    scalar: 0.85,
    shapes: ['circle', 'square'],
    zIndex: 150,
  }
  confetti({ ...base, particleCount: 70, spread: 70, startVelocity: 38, origin: { x: 0.15, y: 0.75 }, angle: 60 })
  confetti({ ...base, particleCount: 70, spread: 70, startVelocity: 38, origin: { x: 0.85, y: 0.75 }, angle: 120 })
  setTimeout(() => {
    confetti({ ...base, particleCount: 60, spread: 110, startVelocity: 22, origin: { x: 0.5, y: 0.35 }, gravity: 0.5 })
  }, 450)
}

// Soft particles floating up behind the message (pure CSS).
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.45) % 5}s`,
  duration: `${6 + (i % 4)}s`,
  size: `${3 + (i % 3) * 2}px`,
}))

const item = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
})

export function RSVPConfirmation({ guestName }) {
  const ref = useRef(null)
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ref.current?.focus({ preventScroll: true })
    celebrate()
  }, [])

  return (
    <m.div
      ref={ref}
      className="confirmation"
      tabIndex={-1}
      role="status"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <div className="confirmation__particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{ left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      <m.span className="confirmation__icon" aria-hidden="true" {...item(0.3)}>
        <HeartIcon width={26} height={26} />
      </m.span>

      <m.h2 className="confirmation__title" {...item(0.45)}>
        {t.title}
      </m.h2>

      {guestName && (
        <m.p className="confirmation__name" {...item(0.55)}>
          {guestName}, votre présence est bien notée.
        </m.p>
      )}

      <m.p className="confirmation__message" {...item(0.7)}>
        « {t.message} »
      </m.p>

      <m.div {...item(0.85)}>
        <Ornament />
      </m.div>

      <m.p className="confirmation__couple" {...item(1)}>
        {weddingData.couple.displayName} · {weddingData.couple.coupleLabel}
      </m.p>
    </m.div>
  )
}
