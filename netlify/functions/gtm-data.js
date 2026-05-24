import { createClient } from '@supabase/supabase-js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function supabase() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  const db = supabase()

  if (event.httpMethod === 'GET') {
    const { data, error } = await db
      .from('gtm_data')
      .select('*')
      .eq('id', 'singleton')
      .single()

    if (error) {
      console.error('gtm-data GET error:', error.message)
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) }
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify(data) }
  }

  if (event.httpMethod === 'POST') {
    let body
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) }
    }

    // Strip id from payload — we always target singleton
    const { id: _id, ...payload } = body

    const { data, error } = await db
      .from('gtm_data')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', 'singleton')
      .select()
      .single()

    if (error) {
      console.error('gtm-data POST error:', error.message)
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) }
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify(data) }
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }
}
