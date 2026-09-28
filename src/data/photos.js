import manifest from './photos.generated.json'
import { weddingData } from './weddingData'

/**
 * Returns everything an <img> needs for a photo listed in /photos,
 * or null if the photo has not been processed with `npm run photos`.
 */
export function getPhoto(name) {
  const entry = manifest[name]
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`Photo « ${name} » introuvable. Lancez \`npm run photos\`.`)
    return null
  }
  const largest = entry.sources.at(-1)
  return {
    name,
    src: largest.src,
    srcSet: entry.sources.map((s) => `${s.src} ${s.width}w`).join(', '),
    width: entry.width,
    height: entry.height,
    placeholder: entry.placeholder,
    alt: weddingData.photos.alt[name] ?? weddingData.couple.displayName,
  }
}
