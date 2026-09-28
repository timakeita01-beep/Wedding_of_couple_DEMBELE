import { ArrowUpRightIcon, HomeIcon } from '../common/Icons'
import './LocationCard.css'

export function LocationCard({ title, mapsUrl, buttonLabel }) {
  return (
    <article className="location-card">
      <span className="location-card__icon" aria-hidden="true">
        <HomeIcon width={26} height={26} />
      </span>
      <h3 className="location-card__title">{title}</h3>
      <p className="location-card__hint">Itinéraire Google Maps</p>
      <a
        className="btn btn--ghost location-card__btn"
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${buttonLabel} ${title.toLowerCase()} (ouvre Google Maps dans un nouvel onglet)`}
      >
        {buttonLabel}
        <ArrowUpRightIcon />
      </a>
    </article>
  )
}
