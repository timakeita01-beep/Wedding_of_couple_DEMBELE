import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { weddingData } from '../../data/weddingData'
import { Photo } from '../common/Photo'
import { Ornament } from '../common/Ornament'
import { Reveal } from '../common/Reveal'
import './LoveStory.css'

const t = weddingData.text.love

export function LoveStory() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [20, -20])

  return (
    <section ref={ref} className="section love" aria-labelledby="love-title">
      <div className="container love__grid">
        <Reveal className="love__intro">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 id="love-title" className="love__quote">
            <span aria-hidden="true" className="love__mark">
              “
            </span>
            {t.quote}
          </h2>
        </Reveal>

        <Reveal className="love__media" delay={0.1} y={40}>
          <m.div style={{ y }} className="love__frame">
            <Photo name={weddingData.photos.love} sizes="(min-width: 960px) 420px, 82vw" />
          </m.div>
        </Reveal>

        <div className="love__text">
          {t.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={0.1 * i}>
              {p}
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <Ornament />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
