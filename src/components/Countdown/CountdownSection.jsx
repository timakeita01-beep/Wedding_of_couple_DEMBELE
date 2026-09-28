import { weddingData } from '../../data/weddingData'
import { formatLongDate, formatTime, weddingStart } from '../../utils/format'
import { Countdown } from './Countdown'
import { Ornament } from '../common/Ornament'
import { Reveal } from '../common/Reveal'

const t = weddingData.text.countdown
const { wedding } = weddingData

export function CountdownSection() {
  return (
    <section id="compte-a-rebours" className="section countdown-section" aria-labelledby="countdown-title">
      <div className="container">
        <Reveal className="section-header">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 id="countdown-title" className="section-title">
            {t.title}
          </h2>
          <Ornament light />
        </Reveal>

        <Reveal delay={0.15}>
          <Countdown target={weddingStart} doneMessage={t.done} doneSubtitle={t.doneSubtitle} />
        </Reveal>

        <Reveal as="p" delay={0.3} className="countdown-section__note">
          <span>{formatLongDate(wedding.date)}</span>
          <span>{formatTime(wedding.startTime)} · heure de Bamako</span>
        </Reveal>
      </div>
    </section>
  )
}
