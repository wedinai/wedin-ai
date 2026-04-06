import { createClient } from '@supabase/supabase-js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  // ── Update mode: session_id + email + state present ──────────────────────
  // Called after each deep-dive completion and after MIL to persist incremental state.
  if (body.session_id && body.email && body.state !== undefined) {
    const { error } = await supabase
      .from('sessions')
      .update({ email: body.email, state: body.state })
      .eq('id', body.session_id)

    if (error) {
      console.error('Supabase update error:', error)
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update session' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    }
  }

  // ── Insert mode: body is the raw discovery session answers ───────────────
  const answers = body

  const { data, error } = await supabase
    .from('sessions')
    .insert({ answers })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save session' }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: data.id }),
  }
}
