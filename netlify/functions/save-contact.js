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
      // Email-based restore URL — works on any device, no localStorage dependency
      const returnUrl = `https://wedin-ai-app.netlify.app?email=${encodeURIComponent(email.trim())}`

      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ew { background: #E8E4DC; padding: 48px 16px; font-family: 'DM Sans', sans-serif; }
  .es { max-width: 560px; margin: 0 auto; background: #FAF7F2; border-radius: 16px; overflow: hidden; }

  .eh { padding: 28px 48px; text-align: center; border-bottom: 1px solid rgba(28,43,58,0.07); }
  .wm { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 20px; letter-spacing: 0.05em; color: #1C2B3A; text-decoration: none; }

  .eb { padding: 44px 48px 0; }

  .eh2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 36px; color: #1C2B3A; margin: 0 0 36px; line-height: 1.15; }
  .eh2 em { color: #C4922A; font-style: normal; }

  .bp { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; color: #1C2B3A; margin: 0 0 20px; }
  .bi { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; color: #1C2B3A; margin: 0 0 20px; font-style: italic; }

  .div1 { border: none; border-top: 1px solid rgba(28,43,58,0.08); margin: 36px 0; }
  .pl { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #C4922A; margin: 0 0 14px; }
  .pt { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; color: #1C2B3A; margin: 0; }

  .pc {
    background: #FFFFFF;
    border-left: 3px solid #C4922A;
    border-radius: 12px;
    padding: 28px 32px;
    box-shadow: 0 4px 24px rgba(28,43,58,0.06), 0 1px 4px rgba(28,43,58,0.04);
  }

  .ef { padding: 36px 48px 40px; }

  .cb { display: block; background: #1C2B3A; color: #FAF7F2; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; letter-spacing: 0.01em; text-align: center; text-decoration: none; padding: 17px 32px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(28,43,58,0.18); }
  .cn { text-align: center; font-size: 13px; color: #6B6560; font-style: italic; margin: 0 0 36px; }

  .fd { border: none; border-top: 1px solid rgba(28,43,58,0.08); margin: 0 0 28px; }
  .fw { text-align: center; }
  .fwm { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 15px; letter-spacing: 0.04em; color: #1C2B3A; display: block; margin-bottom: 4px; }
  .ft { font-size: 12px; color: #6B6560; margin: 0; font-family: 'DM Sans', sans-serif; }

  @media (max-width: 480px) {
    .eb, .ef, .eh { padding-left: 24px; padding-right: 24px; }
    .eh2 { font-size: 28px; }
  }
</style>
</head>
<body>
<div class="ew">
  <div class="es">

    <div class="eh">
      <span class="wm">wedin.ai</span>
    </div>

    <div class="eb">
      <h1 class="eh2">Your music portrait is <em>ready.</em></h1>

      <p class="bp">You already know the music matters. It's the soul of the day — the thing that moves your guests from one moment to the next, that sets the tone for everything. The question is how you make it sound the way you've always pictured it.</p>

      <p class="bp">What you said — about how you want your wedding to feel and what you want your guests and friends to carry home — that matters, and it's exactly what we'll build towards. The soul and soundtrack to your wedding.</p>

      <p class="bp">What comes next is a conversation. Not a form, not a checklist. A guided walk through every moment of your day — wedin.ai leads it, you both answer together. Nine moments, from the music your guests hear arriving to the last song of the night. Every one of them mapped around what you tell us.</p>

      <p class="bp">The spreadsheets aren't going anywhere. This is the good bit.</p>

      <p class="bi">This might be one of the best conversations you have while planning your wedding. Find a quiet hour, just the two of you.</p>

      <hr class="div1">

      <div class="pc">
        <p class="pl">Your music portrait</p>
        <p class="pt">${narrative || ''}</p>
      </div>
    </div>

    <div class="ef">
      <a class="cb" href="${returnUrl}">Continue your Moment Map &rarr;</a>
      <p class="cn">Your session is saved. Pick up where you left off.</p>

      <hr class="fd">

      <div class="fw">
        <span class="fwm">wedin.ai</span>
        <p class="ft">Start with the music.</p>
      </div>
    </div>

  </div>
</div>
</body>
</html>`

      const sendResult = await resend.emails.send({
        from: 'wedin.ai <hello@wedin.ai>',
        to: email.trim(),
        subject: "Your music portrait is ready — here's what comes next.",
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
