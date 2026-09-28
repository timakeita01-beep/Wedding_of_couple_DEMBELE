import { weddingData } from '../data/weddingData'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Dates are calendar days ('YYYY-MM-DD'): format them in UTC so the visitor's
// own timezone can never shift the day.
const toDate = (isoDay) => new Date(`${isoDay}T12:00:00Z`)
const fmt = (options) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', ...options })

/** '2026-12-20' → 'Dimanche 20 décembre 2026' */
export const formatLongDate = (isoDay) =>
  capitalize(fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(toDate(isoDay)))

/** '2026-12-20' → '20 décembre 2026' */
export const formatDate = (isoDay) => fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(toDate(isoDay))

/** '2026-12-20' → '20.12.2026' */
export const formatNumericDate = (isoDay) => isoDay.split('-').reverse().join('.')

/** '2026-12-20' → { weekday: 'Dimanche', day: '20', monthYear: 'Décembre 2026' } */
export const dateParts = (isoDay) => {
  const d = toDate(isoDay)
  return {
    weekday: capitalize(fmt({ weekday: 'long' }).format(d)),
    day: fmt({ day: 'numeric' }).format(d),
    monthYear: capitalize(fmt({ month: 'long', year: 'numeric' }).format(d)),
  }
}

/** '08:00' → '8h00' */
export const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(':')
  return `${Number(h)}h${m}`
}

/** '08:00' → 'À partir de 8h00' */
export const formatStartTime = (hhmm) => `À partir de ${formatTime(hhmm)}`

/** Exact start of the celebration, in Bamako time. */
export const weddingStart = new Date(
  `${weddingData.wedding.date}T${weddingData.wedding.startTime}:00${weddingData.utcOffset}`,
)
