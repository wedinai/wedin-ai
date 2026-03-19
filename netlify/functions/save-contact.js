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
  <title>Your music portrait</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Wordmark -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-family:Georgia,serif;font-size:13px;color:#6B6560;letter-spacing:0.12em;">wedin.ai</span>
            </td>
          </tr>

          <!-- Eyebrow -->
          <tr>
            <td style="padding-bottom:8px;">
              <span style="font-family:Arial,sans-serif;font-size:11px;font-weight:600;color:#C4922A;letter-spacing:0.1em;text-transform:uppercase;">Your music portrait</span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:32px;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;line-height:1.25;color:#1C2B3A;">
                ${heading ? `${heading}` : 'Your wedding in music'}
              </h1>
            </td>
          </tr>

          <!-- Portrait narrative -->
          <tr>
            <td style="padding:0 0 40px;border-left:2px solid #C4922A;padding-left:20px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:17px;font-style:italic;font-weight:400;line-height:1.8;color:#1C2B3A;">
                ${portraitText.replace(/\n/g, '<br/>')}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:48px;">
              <a href="${appUrl}" style="display:inline-block;background:#1C2B3A;color:#FAF7F2;font-family:Arial,sans-serif;font-size:14px;font-weight:500;text-decoration:none;padding:14px 28px;border-radius:10px;letter-spacing:0.01em;">
                View your music map →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid rgba(28,43,58,0.1);padding-top:24px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6B6560;line-height:1.6;">
                You're receiving this because you saved your progress on wedin.ai.<br/>
                <a href="${appUrl}" style="color:#6B6560;">wedin.ai</a>
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
        subject: heading ? `${heading} — your music portrait` : 'Your music portrait',
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
