import { createClient } from '@supabase/supabase-js'

// POPIA data erasure — run manually via curl when a deletion request arrives at hello@wedin.ai.
// Usage: curl -X POST https://app.wedin.ai/.netlify/functions/delete-session \
//   -H 'Content-Type: application/json' \
//   -d '{"email":"user@example.com","secret":"YOUR_DELETE_SECRET"}'

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

  const { email, secret } = body

  if (!secret || secret !== process.env.DELETE_SECRET) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    }
  }

  if (!email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'email required' }),
    }
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: deletedContacts } = await supabase
      .from('contacts')
      .delete()
      .eq('email', email)
      .select()

    const { data: deletedSessions } = await supabase
      .from('sessions')
      .delete()
      .eq('email', email)
      .select()

    const contactsRemoved = deletedContacts?.length ?? 0
    const sessionsRemoved = deletedSessions?.length ?? 0

    console.log(`POPIA deletion: ${email} — ${sessionsRemoved} sessions, ${contactsRemoved} contacts removed`)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleted: true, sessionsRemoved, contactsRemoved }),
    }
  } catch (e) {
    console.error('delete-session error:', e.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Deletion failed', detail: e.message }),
    }
  }
}
