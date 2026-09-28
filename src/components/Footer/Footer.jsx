import { weddingData } from '../../data/weddingData'
import { formatNumericDate } from '../../utils/format'
import './Footer.css'

export function Footer() {
  const { couple, wedding, text } = weddingData
  return (
    <footer className="footer">
      <p className="footer__mono" aria-hidden="true">
        {couple.monogram}
      </p>
      <p className="footer__line">
        {couple.displayName} · {couple.coupleLabel} · {formatNumericDate(wedding.date)}
      </p>
      <p className="footer__note">{text.footer.note}</p>
    </footer>
  )
}
