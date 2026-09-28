import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useCountdown } from './useCountdown'
import { EASE } from '../common/Reveal'
import './Countdown.css'

const UNITS = [
  { key: 'days', label: 'Jours', singular: 'Jour' },
  { key: 'hours', label: 'Heures', singular: 'Heure' },
  { key: 'minutes', label: 'Minutes', singular: 'Minute' },
  { key: 'seconds', label: 'Secondes', singular: 'Seconde' },
]

const pad = (n) => String(n).padStart(2, '0')

/**
 * Reusable live countdown.
 *
 * @param {Date|string} target      moment to count down to
 * @param {React.ReactNode} doneMessage   shown once the moment is reached
 */
export function Countdown({ target, doneMessage, doneSubtitle }) {
  const time = useCountdown(target)

  return (
    <div className="countdown">
      <AnimatePresence mode="wait" initial={false}>
        {time.done ? (
          <m.div
            key="done"
            className="countdown__done"
            role="status"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <p className="countdown__done-title">{doneMessage}</p>
            {doneSubtitle && <p className="countdown__done-sub">{doneSubtitle}</p>}
          </m.div>
        ) : (
          <m.div key="running" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.6 }}>
            {/* Screen readers get a calm summary instead of a value changing every second. */}
            <p className="visually-hidden">
              Il reste {time.days} jours, {time.hours} heures et {time.minutes} minutes.
            </p>
            <ol className="countdown__grid" aria-hidden="true">
              {UNITS.map(({ key, label, singular }) => (
                <li key={key} className="countdown__unit">
                  <span className="countdown__value">
                    <span key={time[key]} className="countdown__digits">
                      {key === 'days' ? time[key] : pad(time[key])}
                    </span>
                  </span>
                  <span className="countdown__label">{time[key] === 1 ? singular : label}</span>
                </li>
              ))}
            </ol>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
