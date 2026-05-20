import crypto from 'crypto'
import { checkRateLimit, getIP, RATE_LIMITED_RESPONSE } from './utils/rateLimit.js'

const PAYFAST_SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process'
const PAYFAST_LIVE_URL = 'https://www.payfast.co.za/eng/process'

function generateSignature(params, passphrase) {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => { acc[key] = params[key]; return acc }, {})
  let queryString = new URLSearchParams(sorted).toString()
  if (passphrase) queryString += '&passphrase=' + encodeURIComponent(passphrase)
  return crypto.createHash('md5').update(queryString).digest('hex')
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const ip = getIP(event)
  const { limited } = await checkRateLimit(ip, 'create-checkout-session')
  if (limited) return RATE_LIMITED_RESPONSE

  const merchantId = process.env.PAYFAST_MERCHANT_ID
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY
  const passphrase = process.env.PAYFAST_PASSPHRASE

  if (!merchantId || !merchantKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'PayFast not configured' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { session_id } = body
  if (!session_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'session_id required' }) }
  }

  const isSandbox = process.env.PAYFAST_SANDBOX === 'true'
  const payfastUrl = isSandbox ? PAYFAST_SANDBOX_URL : PAYFAST_LIVE_URL

  const params = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: 'https://app.wedin.ai?payment=success',
    cancel_url: 'https://app.wedin.ai',
    notify_url: 'https://app.wedin.ai/.netlify/functions/verify-payment',
    m_payment_id: session_id,
    amount: '699.00',
    item_name: 'wedin.ai — Wedding Music Plan',
  }

  const signature = generateSignature(params, passphrase)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: { ...params, signature },
      url: payfastUrl,
    }),
  }
}
