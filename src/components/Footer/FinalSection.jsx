import { weddingData } from '../../data/weddingData'
import { formatDate } from '../../utils/format'
import { Photo } from '../common/Photo'
import { Ornament } from '../common/Ornament'
import { Reveal } from '../common/Reveal'
import './Footer.css'

const { couple, wedding, photos } = weddingData

export function FinalSection() {
  return (
    <section className="section final" aria-labelledby="final-title">
      <div className="container final__inner">
        <Reveal className="final__photo" y={40}>
          <Photo name={photos.final} sizes="(min-width: 960px) 420px, 80vw" />
        </Reveal>

        <Reveal className="final__text" delay={0.15}>
          <h2 id="final-title" className="final__names">
            <span className="visually-hidden">{`${couple.displayName}, ${couple.coupleLabel}`}</span>
            <span aria-hidden="true">
              {couple.groom.firstName} <em>&amp;</em> {couple.bride.firstName}
            </span>
            <span aria-hidden="true" className="final__family">
              {couple.coupleLabel}
            </span>
          </h2>
          <p className="final__date">{formatDate(wedding.date)}</p>
          <Ornament light />
          <p className="final__message">« {weddingData.text.final.message} »</p>
        </Reveal>
      </div>
    </section>
  )
}
