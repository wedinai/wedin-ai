import { createClient } from '@supabase/supabase-js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { code, session_id } = body

  if (!code || !session_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'code and session_id required' }) }
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Fetch promo code row (case-insensitive)
  const { data: promoRow, error: fetchError } = await supabase
    .from('promo_codes')
    .select('*')
    .ilike('code', code)
    .maybeSingle()

  if (fetchError) {
    console.error('redeem-promo: fetch error', fetchError)
    return { statusCode: 500, body: JSON.stringify({ error: 'Something went wrong' }) }
  }

  if (!promoRow) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Invalid code' }) }
  }

  if (promoRow.uses_remaining === 0) {
    return { statusCode: 403, body: JSON.stringify({ error: 'This code has been fully used' }) }
  }

  if (promoRow.expires_at && new Date(promoRow.expires_at) < new Date()) {
    return { statusCode: 403, body: JSON.stringify({ error: 'This code has expired' }) }
  }

  // Decrement uses_remaining
  const { error: decrementError } = await supabase
    .from('promo_codes')
    .update({ uses_remaining: promoRow.uses_remaining - 1 })
    .eq('code', promoRow.code)

  if (decrementError) {
    console.error('redeem-promo: decrement error', decrementError)
    return { statusCode: 500, body: JSON.stringify({ error: 'Something went wrong' }) }
  }

  // Insert redemption record
  const { error: insertError } = await supabase
    .from('promo_redemptions')
    .insert({ code: promoRow.code, session_id })

  if (insertError) {
    console.error('redeem-promo: insert redemption error', insertError)
  }

  // Update session row with payment method — isPaid is localStorage only, not written here
  const { error: sessionError } = await supabase
    .from('sessions')
    .update({ payment_method: 'promo', promo_code: promoRow.code })
    .eq('id', session_id)

  if (sessionError) {
    console.error('redeem-promo: session update error', sessionError)
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  }
}
