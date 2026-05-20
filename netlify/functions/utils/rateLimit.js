import { createClient } from '@supabase/supabase-js'

export function getIP(event) {
  return (
    event.headers['x-nf-client-connection-ip'] ||
    (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown'
  )
}

export async function checkRateLimit(ip, endpoint, maxRequests = 20) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()

    // Remove stale rows for this IP+endpoint (prevents unbounded table growth)
    await supabase
      .from('rate_limits')
      .delete()
      .eq('ip', ip)
      .eq('endpoint', endpoint)
      .lt('created_at', fiveMinutesAgo)

    // Count requests in the last minute
    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .eq('endpoint', endpoint)
      .gte('created_at', oneMinuteAgo)

    if (count >= maxRequests) return { limited: true }

    // Record this request
    await supabase.from('rate_limits').insert({ ip, endpoint })
    return { limited: false }
  } catch {
    // Fail open — a Supabase outage must not take down the product
    return { limited: false }
  }
}

export const RATE_LIMITED_RESPONSE = {
  statusCode: 429,
  headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  body: JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
}
