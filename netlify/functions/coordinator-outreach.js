import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getIP, RATE_LIMITED_RESPONSE } from './utils/rateLimit.js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function getSupabase() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function sortPriority(c, now, todayStr) {
  const overdue =
    (c.status === 'email_1_sent' && c.follow_up_1_due_at && new Date(c.follow_up_1_due_at) < now) ||
    (c.status === 'email_2_sent' && c.follow_up_2_due_at && new Date(c.follow_up_2_due_at) < now)
  if (overdue) return 0

  const f1 = c.follow_up_1_due_at ? new Date(c.follow_up_1_due_at).toDateString() : null
  const f2 = c.follow_up_2_due_at ? new Date(c.follow_up_2_due_at).toDateString() : null
  if (f1 === todayStr || f2 === todayStr) return 1

  const order = {
    not_contacted: 2,
    followed: 3,
    email_1_sent: 4,
    email_2_sent: 5,
    replied: 6,
    activated: 7,
    not_interested: 8,
  }
  return order[c.status] ?? 9
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  const ip = getIP(event)
  const limited = await checkRateLimit(ip, 'coordinator-outreach')
  if (limited) return { ...RATE_LIMITED_RESPONSE, headers: { ...RATE_LIMITED_RESPONSE.headers, ...CORS } }

  const supabase = getSupabase()

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('coordinator_outreach').select('*')

    if (error) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) }
    }

    const now = new Date()
    const todayStr = now.toDateString()
    const sorted = (data || []).sort((a, b) => {
      const pa = sortPriority(a, now, todayStr)
      const pb = sortPriority(b, now, todayStr)
      if (pa !== pb) return pa - pb
      return (a.biz || '').localeCompare(b.biz || '')
    })

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ coordinators: sorted }) }
  }

  if (event.httpMethod === 'POST') {
    let body
    try { body = JSON.parse(event.body || '{}') } catch { body = {} }

    if (body.action === 'update_status') {
      const { id, status } = body
      if (!id || !status) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'id and status required' }) }
      }

      const now = new Date().toISOString()
      const update = { status, updated_at: now }

      if (status === 'email_1_sent') {
        update.email_1_sent_at = now
        update.follow_up_1_due_at = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }
      if (status === 'email_2_sent') {
        update.email_2_sent_at = now
        update.follow_up_2_due_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      if (status === 'replied') {
        update.replied_at = now
        update.follow_up_1_due_at = null
        update.follow_up_2_due_at = null
      }
      if (status === 'activated') {
        update.activated_at = now
      }

      const { data, error } = await supabase
        .from('coordinator_outreach')
        .update(update)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) }
      }

      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true, coordinator: data }) }
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) }
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }
}
