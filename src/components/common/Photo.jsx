import { useEffect, useRef, useState } from 'react'
import { getPhoto } from '../../data/photos'
import './common.css'

/**
 * Responsive photo with a blurred placeholder and a soft fade-in once loaded.
 * The box keeps the photo's own aspect ratio, so nothing is cropped unless
 * the parent explicitly asks for it (`fit="cover"`).
 */
export function Photo({ name, sizes = '100vw', priority = false, fit = 'natural', className = '', alt }) {
  const photo = getPhoto(name)
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  if (!photo) {
    return (
      <div className={`photo photo--missing ${className}`} role="img" aria-label="Photo à venir">
        <span>Photo à venir</span>
      </div>
    )
  }

  return (
    <div
      className={`photo photo--${fit} ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{
        '--ph': `url(${photo.placeholder})`,
        aspectRatio: fit === 'natural' ? `${photo.width} / ${photo.height}` : undefined,
      }}
    >
      <img
        ref={imgRef}
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={alt ?? photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

/** Starts downloading a photo ahead of time (used while the envelope is shown). */
export function preloadPhoto(name, sizes = '100vw') {
  const photo = getPhoto(name)
  if (!photo) return
  const img = new Image()
  img.sizes = sizes
  img.srcset = photo.srcSet
  img.src = photo.src
}
