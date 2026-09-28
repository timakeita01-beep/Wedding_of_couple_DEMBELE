import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { ChevronIcon, CloseIcon } from '../common/Icons'
import { EASE } from '../common/Reveal'

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 60, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d) => ({ opacity: 0, x: d * -60, scale: 0.97 }),
}

export function Lightbox({ photos, index, onChange, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const touchX = useRef(0)
  const [direction, setDirection] = useState(0)
  const count = photos.length
  const photo = photos[index]

  const go = (step) => {
    if (count < 2) return
    setDirection(step)
    onChange((index + step + count) % count)
  }

  // Keyboard: Esc, arrows, and keep Tab inside the dialog.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const focusables = dialogRef.current.querySelectorAll('button')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  // Lock page scroll and move focus into the dialog.
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  return (
    <m.div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} sur ${count}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose}>
        <CloseIcon />
        <span className="visually-hidden">Fermer</span>
      </button>

      <div className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.img
            key={photo.src}
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 960px) 60vw, 100vw"
            alt={photo.alt}
            className="lightbox__img"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
            }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="lightbox__nav">
          <button type="button" className="lightbox__btn" onClick={() => go(-1)}>
            <ChevronIcon direction="left" />
            <span className="visually-hidden">Photo précédente</span>
          </button>
          <span className="lightbox__counter" aria-live="polite">
            {index + 1} / {count}
          </span>
          <button type="button" className="lightbox__btn" onClick={() => go(1)}>
            <ChevronIcon direction="right" />
            <span className="visually-hidden">Photo suivante</span>
          </button>
        </div>
      )}
    </m.div>
  )
}
