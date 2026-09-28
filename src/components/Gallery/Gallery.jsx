import { useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { weddingData } from '../../data/weddingData'
import { getPhoto } from '../../data/photos'
import { Photo } from '../common/Photo'
import { Ornament } from '../common/Ornament'
import { Reveal } from '../common/Reveal'
import { Lightbox } from './Lightbox'
import './Gallery.css'

const t = weddingData.text.gallery
const photos = weddingData.photos.gallery.map(getPhoto).filter(Boolean)

export function Gallery() {
  const [openIndex, setOpenIndex] = useState(null)
  const triggers = useRef([])

  if (photos.length === 0) return null

  const close = () => {
    const trigger = triggers.current[openIndex]
    setOpenIndex(null)
    trigger?.focus({ preventScroll: true })
  }

  return (
    <section className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <Reveal className="section-header">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 id="gallery-title" className="section-title">
            {t.title}
          </h2>
          <Ornament />
        </Reveal>

        <ul className="gallery__track">
          {photos.map((photo, i) => (
            <Reveal as="li" key={photo.name} delay={i * 0.12} className="gallery__item">
              <button
                ref={(el) => (triggers.current[i] = el)}
                type="button"
                className="gallery__button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Agrandir la photo ${i + 1} sur ${photos.length}`}
              >
                <Photo name={photo.name} sizes="(min-width: 960px) 340px, 78vw" />
              </button>
            </Reveal>
          ))}
        </ul>
        {photos.length > 1 && (
          <p className="gallery__hint" aria-hidden="true">
            Faites glisser · Touchez pour agrandir
          </p>
        )}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  )
}
