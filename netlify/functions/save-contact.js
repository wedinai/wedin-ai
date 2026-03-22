import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

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

  const { email, session_id, couple_name, narrative } = body

  if (!email || !email.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) }
  }

  // ── Save contact to Supabase ────────────────────────────────────────────
  const { error } = await supabase
    .from('contacts')
    .insert({ email: email.trim(), session_id: session_id || null })

  if (error) {
    console.error('Supabase error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save contact' }),
    }
  }

  // ── Send portrait email via Resend ──────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const html = `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAF7F2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:48px 24px;font-family:'DM Sans',sans-serif;">
    <tr>
      <td>
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#1C2B3A;margin:0 0 24px 0;line-height:1.2;">Your Moment Map is ready.</p>
        <p style="font-size:16px;color:#1C2B3A;line-height:1.6;margin:0 0 16px 0;">You've mapped the musical identity of your wedding day. Your portrait is saved.</p>
        <p style="font-size:16px;color:#1C2B3A;line-height:1.6;margin:0 0 32px 0;">Your Moment Map is waiting — nine musical moments, each one ready to be shaped around exactly how you want the day to feel. Step inside and start building the soundtrack to your day.</p>
        <a href="https://wedin-ai-app.netlify.app" style="display:inline-block;background:#1C2B3A;color:#FAF7F2;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;text-decoration:none;padding:14px 28px;border-radius:8px;min-height:44px;line-height:1.6;">Open my Moment Map →</a>
        <p style="font-size:13px;color:#6B6560;margin:40px 0 0 0;">wedin.ai — Start with the music.</p>
      </td>
    </tr>
  </table>
</body>
</html>`

      await resend.emails.send({
        from: 'wedin.ai <hello@wedin.ai>',
        to: email.trim(),
        subject: 'Your wedin.ai music portrait is ready',
        html,
      })
    } catch (emailError) {
      // Log but don't fail the request — contact is already saved
      console.error('Resend error:', emailError)
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  }
}
