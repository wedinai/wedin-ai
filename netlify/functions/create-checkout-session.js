import Stripe from 'stripe'

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

  const { session_id, couple_name } = body

  const stripe = new Stripe(stripeKey)

  // Derive the app URL from the request origin or a configured env var
  const appUrl = process.env.APP_URL || event.headers.origin || 'http://localhost:8888'

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'zar',
            unit_amount: 99900, // R999.00 in cents
            product_data: {
              name: 'wedin.ai — Moment Map',
              description: 'Unlock your full music plan: 9 guided deep-dive sessions and a complete wedding music brief.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}?payment=success&stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?payment=cancelled`,
      metadata: {
        wedin_session_id: session_id || '',
        couple_name: couple_name || '',
      },
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: checkoutSession.url }),
    }
  } catch (e) {
    console.error('Stripe error:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    }
  }
}
