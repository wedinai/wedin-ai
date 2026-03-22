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
  console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      // Session-aware return URL — picked up by App.jsx restore logic on return visit
      // On a different device, the session param is present but localStorage won't be,
      // so full cross-device restore requires fetching answers from Supabase by session ID — deferred TODO
      const returnUrl = session_id
        ? `https://wedin-ai-app.netlify.app?session=${session_id}`
        : 'https://wedin-ai-app.netlify.app'

      const html = `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAF7F2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:48px 24px;font-family:'DM Sans',sans-serif;">
    <tr>
      <td>
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#1C2B3A;margin:0 0 24px 0;line-height:1.2;">Your music portrait is ready.</p>
        ${narrative ? `<div style="background:#FFFFFF;border-left:3px solid #C4922A;padding:20px 24px;margin:0 0 32px 0;border-radius:0 8px 8px 0;"><p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#1C2B3A;line-height:1.6;margin:0;font-style:italic;">${narrative}</p></div>` : ''}
        <p style="font-size:16px;color:#1C2B3A;line-height:1.6;margin:0 0 16px 0;">Your wedding day has nine musical moments — from the first song guests hear as they arrive, to the last song that sends everyone home. Each one shapes how the day feels. Most couples never plan them. You're about to.</p>
        <p style="font-size:16px;color:#1C2B3A;line-height:1.6;margin:0 0 24px 0;">Your Moment Map walks you through every moment in a conversation, not a form. When you're done, you'll have a complete music brief — one your coordinator can act on and your acts can deliver from.</p>
        <p style="font-size:14px;color:#6B6560;margin:0 0 32px 0;">Unlock your Moment Map for R699 — a one-time fee for your complete wedding music plan.</p>
        <a href="${returnUrl}" style="display:inline-block;background:#1C2B3A;color:#FAF7F2;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;text-decoration:none;padding:14px 28px;border-radius:8px;min-height:44px;line-height:1.6;">Open my Moment Map →</a>
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
