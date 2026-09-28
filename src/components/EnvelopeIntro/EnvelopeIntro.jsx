import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { weddingData } from '../../data/weddingData'
import { formatNumericDate } from '../../utils/format'
import { preloadPhoto } from '../common/Photo'
import { EASE } from '../common/Reveal'
import { ArrowDownIcon } from '../common/Icons'
import { Ornament } from '../common/Ornament'
import './EnvelopeIntro.css'

const { couple, wedding, photos } = weddingData
const t = weddingData.text.envelope
const w = weddingData.text.welcome

/** Total length of the flap + letter animation before the page is revealed. */
const OPEN_DURATION = 2300

function Welcome({ onStart }) {
  const words = w.title.split(' ')
  return (
    <m.div
      className="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <m.span
        className="welcome__mono"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
      >
        {couple.monogram.replace(/\s/g, '')}
      </m.span>

      <m.span
        className="eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.4 }}
      >
        {w.eyebrow}
      </m.span>

      <h1 className="welcome__title">
        {words.map((word, i) => (
          <m.span
            key={i}
            className="welcome__word"
            initial={{ opacity: 0, y: '0.5em', filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.6 + i * 0.16 }}
          >
            {word}
          </m.span>
        ))}
      </h1>

      <m.div
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 1.3 }}
      >
        <Ornament />
      </m.div>

      <m.p
        className="welcome__message"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 1.5 }}
      >
        {w.message}
      </m.p>

      <m.button
        type="button"
        className="envelope-intro__cta"
        onClick={onStart}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 2 }}
      >
        <span>{w.start}</span>
        <ArrowDownIcon className="welcome__cta-icon" width={16} height={16} />
      </m.button>
    </m.div>
  )
}

export function EnvelopeIntro({ onOpen }) {
  const [stage, setStage] = useState('welcome') // welcome | envelope
  const [opening, setOpening] = useState(false)
  const reduceMotion = useReducedMotion()
  const envelopeRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    // Download the hero photo while the guest reads the welcome screen.
    preloadPhoto(photos.hero, '(min-width: 960px) 45vw, 100vw')
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const open = () => {
    if (opening) return
    setOpening(true)
    // Glitter bursts out as the letter leaves the envelope.
    later(() => {
      const rect = envelopeRef.current?.getBoundingClientRect()
      if (!rect) return
      window.dispatchEvent(
        new CustomEvent('sparkles:burst', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.25, count: 60 },
        }),
      )
    }, 850)
    later(onOpen, reduceMotion ? 250 : OPEN_DURATION)
  }

  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: opening ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 },
    transition: opening ? { duration: 0.5, ease: EASE } : { duration: 1.3, ease: EASE, delay },
  })

  return (
    <m.div
      className={`envelope-intro ${opening ? 'is-opening' : ''}`}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <AnimatePresence mode="wait">
        {stage === 'welcome' ? (
          <Welcome key="welcome" onStart={() => setStage('envelope')} />
        ) : (
          <m.div key="envelope" className="envelope-intro__inner">
            <m.header className="envelope-intro__header" {...fade(0.1)}>
              <span className="eyebrow">{t.invited}</span>
              <h1 className="envelope-intro__names">
                <span className="visually-hidden">{`${couple.displayName}, ${couple.coupleLabel}`}</span>
                <span aria-hidden="true">
                  {couple.groom.firstName} <span className="amp">&amp;</span> {couple.bride.firstName}
                </span>
                <span className="envelope-intro__family" aria-hidden="true">
                  {couple.coupleLabel}
                </span>
              </h1>
            </m.header>

            <m.div
              className="envelope-scene"
              initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: 25 }}
              animate={{ opacity: 1, y: opening ? '12%' : 0, scale: 1, rotateX: 0 }}
              transition={{ duration: opening ? 1.2 : 1.4, ease: EASE, delay: opening ? 0.6 : 0.25 }}
            >
              {/* Decorative: the real control is the button below. */}
              <div ref={envelopeRef} className="envelope" onClick={open} aria-hidden="true">
                <div className="envelope__back" />

                <div className="envelope__letter">
                  <span className="envelope__letter-label">{t.cardLabel}</span>
                  <span className="envelope__letter-mono">{couple.monogram}</span>
                  <span className="envelope__letter-line" />
                  <span className="envelope__letter-date">{formatNumericDate(wedding.date)}</span>
                </div>

                <svg className="envelope__pocket" viewBox="0 0 100 70" preserveAspectRatio="none">
                  <polygon className="envelope__side" points="0,0 49,37 0,70" />
                  <polygon className="envelope__side envelope__side--right" points="100,0 51,37 100,70" />
                  <path className="envelope__bottom" d="M0,70 L47,35.5 Q50,33.5 53,35.5 L100,70 Z" />
                </svg>

                <div className="envelope__flap">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,0 H100 L54,95 Q50,101 46,95 Z" />
                  </svg>
                </div>

                <div className="envelope__seal">
                  <span>{couple.monogram.replace(/\s/g, '')}</span>
                </div>
              </div>
            </m.div>

            <m.div className="envelope-intro__footer" {...fade(0.55)}>
              <p className="envelope-intro__tagline">{t.tagline}</p>
              <button type="button" className="envelope-intro__cta" onClick={open} disabled={opening} autoFocus>
                <span>{t.open}</span>
                <ArrowDownIcon className="envelope-intro__cta-icon" width={16} height={16} />
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}
