import { useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { weddingData } from '../../data/weddingData'
import { isBackendConfigured, RSVPError, submitRSVP } from '../../services/rsvp'
import { Ornament } from '../common/Ornament'
import { EASE, Reveal } from '../common/Reveal'
import { RSVPConfirmation } from '../RSVPConfirmation/RSVPConfirmation'
import './RSVP.css'

const t = weddingData.text.rsvp
const { maxGuests, deadline } = weddingData.rsvp

const EMPTY = { firstName: '', lastName: '', email: '', guests: 1, message: '', website: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Merci d’indiquer votre prénom.'
  if (!values.lastName.trim()) errors.lastName = 'Merci d’indiquer votre nom.'
  if (!values.email.trim()) errors.email = 'Merci d’indiquer votre adresse e-mail.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Cette adresse e-mail ne semble pas valide.'
  const guests = Number(values.guests)
  if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)
    errors.guests = `Indiquez un nombre entre 1 et ${maxGuests}.`
  return errors
}

export function RSVP() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [submitError, setSubmitError] = useState('')
  const [guestName, setGuestName] = useState('')
  const formRef = useRef(null)

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }))
  }

  const setGuests = (n) => {
    setValues((v) => ({ ...v, guests: Math.min(maxGuests, Math.max(1, n)) }))
    setErrors((err) => ({ ...err, guests: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      formRef.current.querySelector('[aria-invalid="true"]')?.focus()
      return
    }

    // Honeypot: bots fill the hidden "website" field, humans never see it.
    if (values.website) {
      setStatus('success')
      return
    }

    setStatus('submitting')
    setSubmitError('')
    try {
      await submitRSVP(values)
      setGuestName(values.firstName.trim())
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setSubmitError(err instanceof RSVPError ? err.message : 'Une erreur est survenue. Merci de réessayer.')
    }
  }

  const fieldProps = (name) => ({
    id: `rsvp-${name}`,
    name,
    value: values[name],
    onChange: update(name),
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `rsvp-${name}-error` : undefined,
  })

  const fieldError = (name) =>
    errors[name] && (
      <p id={`rsvp-${name}-error`} className="rsvp__error">
        {errors[name]}
      </p>
    )

  return (
    <section id="rsvp" className="section rsvp" aria-labelledby="rsvp-title">
      <div className="container container--narrow">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' ? (
            <RSVPConfirmation key="thanks" guestName={guestName} />
          ) : (
            <m.div key="form" exit={{ opacity: 0, scale: 0.97, y: -10 }} transition={{ duration: 0.5, ease: EASE }}>
              <Reveal className="section-header">
                <span className="eyebrow">{t.eyebrow}</span>
                <h2 id="rsvp-title" className="section-title rsvp__title">
                  {t.title}
                </h2>
                <Ornament />
                <p>{t.intro}</p>
                {deadline && <p className="rsvp__deadline">Réponse souhaitée {deadline}.</p>}
              </Reveal>

              <Reveal>
                <form ref={formRef} className="rsvp__form" onSubmit={onSubmit} noValidate>
                  <div className="rsvp__row">
                    <div className="rsvp__field">
                      <label htmlFor="rsvp-firstName">Prénom</label>
                      <input {...fieldProps('firstName')} type="text" autoComplete="given-name" required />
                      {fieldError('firstName')}
                    </div>
                    <div className="rsvp__field">
                      <label htmlFor="rsvp-lastName">Nom</label>
                      <input {...fieldProps('lastName')} type="text" autoComplete="family-name" required />
                      {fieldError('lastName')}
                    </div>
                  </div>

                  <div className="rsvp__field">
                    <label htmlFor="rsvp-email">Adresse e-mail</label>
                    <input
                      {...fieldProps('email')}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    {fieldError('email')}
                  </div>

                  <div className="rsvp__field">
                    <label htmlFor="rsvp-guests">Nombre de personnes</label>
                    <div className="rsvp__stepper">
                      <button
                        type="button"
                        onClick={() => setGuests(Number(values.guests) - 1)}
                        disabled={Number(values.guests) <= 1}
                        aria-label="Retirer une personne"
                      >
                        −
                      </button>
                      <input
                        {...fieldProps('guests')}
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max={maxGuests}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setGuests(Number(values.guests) + 1)}
                        disabled={Number(values.guests) >= maxGuests}
                        aria-label="Ajouter une personne"
                      >
                        +
                      </button>
                    </div>
                    {fieldError('guests')}
                  </div>

                  <div className="rsvp__field">
                    <label htmlFor="rsvp-message">
                      Message <span className="rsvp__optional">(facultatif)</span>
                    </label>
                    <textarea
                      {...fieldProps('message')}
                      rows="4"
                      maxLength={1000}
                      placeholder="Un mot pour les mariés…"
                    />
                  </div>

                  <div className="rsvp__honeypot" aria-hidden="true">
                    <label htmlFor="rsvp-website">Ne pas remplir</label>
                    <input {...fieldProps('website')} type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  {submitError && (
                    <p className="rsvp__submit-error" role="alert">
                      {submitError}
                    </p>
                  )}

                  <button type="submit" className="btn rsvp__submit" disabled={status === 'submitting'}>
                    {status === 'submitting' && <span className="rsvp__spinner" aria-hidden="true" />}
                    {status === 'submitting' ? t.submitting : t.submit}
                  </button>

                  {!isBackendConfigured && (
                    <p className="rsvp__demo-note">
                      Mode démonstration : aucun service d’enregistrement n’est encore connecté, les réponses ne
                      sont pas transmises.
                    </p>
                  )}
                </form>
              </Reveal>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
