import { weddingData } from '../../data/weddingData'
import { formatLongDate, formatStartTime } from '../../utils/format'
import { CalendarIcon, ClockIcon, PinIcon } from '../common/Icons'
import { Ornament } from '../common/Ornament'
import { Reveal } from '../common/Reveal'
import { LocationCard } from '../LocationCard/LocationCard'
import './WeddingDetails.css'

const { wedding, locations } = weddingData
const t = weddingData.text.details

const FACTS = [
  { icon: CalendarIcon, label: 'Date', value: formatLongDate(wedding.date) },
  { icon: ClockIcon, label: 'Heure', value: formatStartTime(wedding.startTime) },
  { icon: PinIcon, label: 'Lieu', value: wedding.location },
]

export function WeddingDetails() {
  return (
    <section id="informations" className="section details" aria-labelledby="details-title">
      <div className="container">
        <Reveal className="section-header">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 id="details-title" className="section-title">
            {t.title}
          </h2>
          <Ornament />
        </Reveal>

        <dl className="details__facts">
          {FACTS.map(({ icon: Icon, label, value }, i) => (
            <Reveal key={label} delay={i * 0.12} className="details__fact">
              <dt>
                <span className="details__icon" aria-hidden="true">
                  <Icon width={22} height={22} />
                </span>
                {label}
              </dt>
              <dd>{value}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="details__locations-header">
          <h3 className="details__subtitle">{t.locationsTitle}</h3>
          <p>{t.locationsIntro}</p>
        </Reveal>

        <ul className="details__locations">
          {locations.map((loc, i) => (
            <Reveal as="li" key={loc.id} delay={i * 0.15}>
              <LocationCard title={loc.title} mapsUrl={loc.mapsUrl} buttonLabel={t.mapButton} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
