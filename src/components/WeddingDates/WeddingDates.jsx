import { weddingData } from '../../data/weddingData'
import { dateParts, formatLongDate, formatStartTime } from '../../utils/format'
import { Ornament } from '../common/Ornament'
import { Reveal } from '../common/Reveal'
import './WeddingDates.css'

const { civilCeremony, wedding } = weddingData
const t = weddingData.text.dates

const EVENTS = [
  {
    numeral: 'I',
    ...civilCeremony,
    details: [civilCeremony.startTime && formatStartTime(civilCeremony.startTime), civilCeremony.location],
  },
  {
    numeral: 'II',
    ...wedding,
    featured: true,
    details: [formatStartTime(wedding.startTime), wedding.location],
  },
]

export function WeddingDates() {
  return (
    <section className="section dates" aria-labelledby="dates-title">
      <div className="container">
        <Reveal className="section-header">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 id="dates-title" className="section-title">
            {t.title}
          </h2>
          <Ornament />
          <p>{t.intro}</p>
        </Reveal>

        <ol className="dates__list">
          {EVENTS.map((event, i) => {
            const parts = dateParts(event.date)
            const details = event.details.filter(Boolean)
            return (
              <Reveal
                as="li"
                key={event.date}
                delay={i * 0.15}
                className={`date-card ${event.featured ? 'date-card--featured' : ''}`}
              >
                <span className="date-card__numeral" aria-hidden="true">
                  {event.numeral}
                </span>
                <time className="date-card__date" dateTime={event.date}>
                  <span className="visually-hidden">{formatLongDate(event.date)}</span>
                  <span aria-hidden="true" className="date-card__weekday">
                    {parts.weekday}
                  </span>
                  <span aria-hidden="true" className="date-card__day">
                    {parts.day}
                  </span>
                  <span aria-hidden="true" className="date-card__month">
                    {parts.monthYear}
                  </span>
                </time>
                <span className="date-card__rule" aria-hidden="true" />
                <h3 className="date-card__title">{event.title}</h3>
                {event.description && <p className="date-card__desc">{event.description}</p>}
                {details.length > 0 && <p className="date-card__details">{details.join(' — ')}</p>}
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
