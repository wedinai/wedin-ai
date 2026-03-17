import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe not configured' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { stripe_session_id } = body

  if (!stripe_session_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'stripe_session_id required' }) }
  }

  const stripe = new Stripe(stripeKey)

  try {
    const session = await stripe.checkout.sessions.retrieve(stripe_session_id)

    if (session.payment_status !== 'paid') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: false }),
      }
    }

    // Payment confirmed — update Supabase if we have a wedin session ID
    const wedinSessionId = session.metadata?.wedin_session_id
    if (wedinSessionId) {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      await supabase
        .from('sessions')
        .update({ is_paid: true, paid_at: new Date().toISOString() })
        .eq('id', wedinSessionId)
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid: true }),
    }
  } catch (e) {
    console.error('Stripe verify error:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Payment verification failed' }),
    }
  }
}
