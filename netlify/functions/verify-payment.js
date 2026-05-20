import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// PayFast ITN handler — server-to-server only, never called by the browser.
// PayFast POSTs payment notifications here after each transaction.
// Must return 200 quickly or PayFast will retry.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function verifySignature(params, passphrase) {
  // Rebuild query string from params in received order, excluding 'signature'
  const entries = Object.entries(params).filter(([key]) => key !== 'signature')
  let queryString = entries.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&')
  if (passphrase) queryString += '&passphrase=' + encodeURIComponent(passphrase).replace(/%20/g, '+')
  return crypto.createHash('md5').update(queryString).digest('hex')
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // Decode body — Netlify may base64-encode form-posted bodies
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf-8')
    : event.body

  // Parse form-encoded body preserving field order
  const parsed = new URLSearchParams(rawBody)
  const params = {}
  for (const [key, value] of parsed.entries()) {
    params[key] = value
  }

  const receivedSignature = params.signature
  const passphrase = process.env.PAYFAST_PASSPHRASE

  // Verify ITN signature
  const expectedSignature = verifySignature(params, passphrase)
  if (!receivedSignature || receivedSignature !== expectedSignature) {
    console.error('PayFast ITN: signature mismatch', { received: receivedSignature, expected: expectedSignature })
    return { statusCode: 400, body: 'Invalid signature' }
  }

  // Only process COMPLETE payments — other statuses are valid ITN notifications
  if (params.payment_status !== 'COMPLETE') {
    console.log('PayFast ITN: non-complete status', params.payment_status)
    return { statusCode: 200, body: 'OK' }
  }

  const sessionId = params.m_payment_id
  if (!sessionId || !UUID_RE.test(sessionId)) {
    console.error('PayFast ITN: invalid m_payment_id', sessionId)
    return { statusCode: 200, body: 'OK' }
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    await supabase
      .from('sessions')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('id', sessionId)

    console.log('PayFast ITN: session marked paid', sessionId)
  } catch (e) {
    // Log but always return 200 — a Supabase error must not trigger PayFast retry storm
    console.error('PayFast ITN: Supabase update failed', e.message)
  }

  return { statusCode: 200, body: 'OK' }
}
