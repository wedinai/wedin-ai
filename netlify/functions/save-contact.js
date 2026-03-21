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
      const heading = couple_name && couple_name !== 'Your Wedding' ? couple_name : null
      const portraitText = narrative || 'Your music portrait has been saved.'
      const appUrl = 'https://wedin-ai-app.netlify.app'

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your wedin.ai music portrait is ready</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Wordmark -->
          <tr>
            <td style="padding-bottom:48px;">
              <span style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:#1C2B3A;letter-spacing:0.15em;text-transform:uppercase;">wedin.ai</span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:400;line-height:1.25;color:#1C2B3A;">
                Your music portrait is ready.
              </h1>
            </td>
          </tr>

          <!-- Body copy -->
          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.7;color:#1C2B3A;">
                You've taken the first step toward a wedding day where every musical moment is exactly right.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:40px;">
              <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.7;color:#1C2B3A;">
                Your portrait is saved. When you're ready to continue, your Moment Map is waiting — nine musical moments, each one ready to be shaped around how you want the day to feel.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:48px;">
              <a href="${appUrl}" style="display:inline-block;background:#1C2B3A;color:#FAF7F2;font-family:'DM Sans',Arial,sans-serif;font-size:15px;font-weight:500;text-decoration:none;padding:14px 28px;border-radius:8px;letter-spacing:0.01em;min-height:44px;line-height:16px;">
                Continue planning →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid rgba(28,43,58,0.1);padding-top:24px;">
              <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:#6B6560;line-height:1.6;">
                wedin.ai — Start with the music.
              </p>
            </td>
          </tr>

        </table>
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
