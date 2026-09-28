/**
 * RSVP submission layer.
 *
 * - If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, responses are
 *   inserted into the Supabase table `rsvps` through its REST API
 *   (no SDK needed — a single fetch call).
 * - Otherwise a MOCK is used: nothing is sent anywhere, the response is only
 *   kept in this browser's localStorage so you can test the flow locally.
 *
 * To plug in another backend, replace `sendToBackend` below — the rest of the
 * app only depends on `submitRSVP(data)` resolving or throwing.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const TABLE = 'rsvps'

export const isBackendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export class RSVPError extends Error {}

/**
 * @param {{ firstName: string, lastName: string, email: string, guests: number, message?: string }} data
 */
export async function submitRSVP(data) {
  const payload = {
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    guests: Number(data.guests),
    message: data.message?.trim() || null,
  }
  return isBackendConfigured ? sendToBackend(payload) : sendToMock(payload)
}

async function sendToBackend(payload) {
  let response
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new RSVPError('Connexion impossible. Vérifiez votre réseau et réessayez.')
  }
  if (!response.ok) {
    throw new RSVPError("Votre réponse n'a pas pu être enregistrée. Merci de réessayer dans un instant.")
  }
  return { ok: true, mock: false }
}

async function sendToMock(payload) {
  console.warn('[RSVP] Aucun backend configuré : réponse NON envoyée (mode démo).', payload)
  await new Promise((resolve) => setTimeout(resolve, 900))
  try {
    const key = 'rsvp-mock-responses'
    const saved = JSON.parse(localStorage.getItem(key) || '[]')
    saved.push({ ...payload, created_at: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(saved))
  } catch {
    // localStorage unavailable (private mode…) — fine for a mock.
  }
  return { ok: true, mock: true }
}
