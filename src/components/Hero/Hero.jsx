import * as m from 'motion/react-m'
import { weddingData } from '../../data/weddingData'
import { formatLongDate, formatStartTime } from '../../utils/format'
import { Photo } from '../common/Photo'
import { Ornament } from '../common/Ornament'
import { EASE } from '../common/Reveal'
import { ArrowDownIcon } from '../common/Icons'
import './Hero.css'

const { couple, wedding, photos } = weddingData
const t = weddingData.text.hero

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: EASE, delay },
})

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <m.div
          className="hero__reveal"
          initial={{ opacity: 0, scale: 1.06, clipPath: 'inset(6% 6% 6% 6%)' }}
          animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
        >
          <Photo name={photos.hero} priority sizes="(min-width: 960px) 45vw, 100vw" className="hero__photo" />
        </m.div>
      </div>

      <div className="hero__content">
        <m.span className="eyebrow" {...rise(0.6)}>
          {t.eyebrow}
        </m.span>

        <m.h1 id="hero-title" className="hero__names" {...rise(0.75)}>
          <span className="visually-hidden">{`${couple.displayName}, ${couple.coupleLabel}`}</span>
          <span aria-hidden="true" className="hero__first-names">
            {couple.groom.firstName} <span className="hero__amp">&amp;</span> {couple.bride.firstName}
          </span>
          <span aria-hidden="true" className="hero__family">
            {couple.coupleLabel}
          </span>
        </m.h1>

        <m.p className="hero__intro" {...rise(0.95)}>
          {t.intro}
        </m.p>

        <m.div {...rise(1.1)}>
          <Ornament />
        </m.div>

        <m.dl className="hero__facts" {...rise(1.25)}>
          <div>
            <dt className="visually-hidden">Date</dt>
            <dd className="hero__date">{formatLongDate(wedding.date)}</dd>
          </div>
          <div>
            <dt className="visually-hidden">Heure</dt>
            <dd>{formatStartTime(wedding.startTime)}</dd>
          </div>
          <div>
            <dt className="visually-hidden">Lieu</dt>
            <dd>{wedding.location}</dd>
          </div>
        </m.dl>

        <m.a href="#compte-a-rebours" className="hero__scroll" {...rise(1.5)}>
          <span>{t.scroll}</span>
          <ArrowDownIcon width={16} height={16} />
        </m.a>
      </div>
    </section>
  )
}
