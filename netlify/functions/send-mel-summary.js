import { Resend } from 'resend'

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

  const { email, melSummary, coupleName } = body

  if (!email || !email.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) }
  }
  if (!melSummary) {
    return { statusCode: 400, body: JSON.stringify({ error: 'melSummary is required' }) }
  }

  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Email not configured' }) }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const returnUrl = `https://wedin-ai-app.netlify.app?email=${encodeURIComponent(email.trim())}`
  const displayName = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'Your wedding'

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
  .eh2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 36px; color: #1C2B3A; margin: 0 0 8px; line-height: 1.15; }
  .sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #6B6560; margin: 0 0 32px; }
  .div1 { border: none; border-top: 1px solid rgba(28,43,58,0.08); margin: 32px 0; }
  .gold-block { border-left: 3px solid #C4922A; background: rgba(196,146,42,0.06); padding: 20px 24px; border-radius: 0 8px 8px 0; margin: 0 0 8px; }
  .gold-para { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; font-weight: 400; color: #1C2B3A; line-height: 1.75; margin: 0; }
  .ef { padding: 36px 48px 40px; }
  .cb { display: block; background: #1C2B3A; color: #FAF7F2; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; text-align: center; text-decoration: none; padding: 17px 32px; border-radius: 10px; margin-bottom: 20px; }
  .fd { border: none; border-top: 1px solid rgba(28,43,58,0.08); margin: 0 0 28px; }
  .fw { text-align: center; }
  .fwm { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 15px; letter-spacing: 0.04em; color: #1C2B3A; display: block; margin-bottom: 4px; }
  .ft { font-size: 12px; color: #6B6560; margin: 0; font-family: 'DM Sans', sans-serif; }
  @media (max-width: 480px) { .eb, .ef, .eh { padding-left: 24px; padding-right: 24px; } .eh2 { font-size: 28px; } }
</style>
</head>
<body>
<div class="ew">
  <div class="es">
    <div class="eh"><span class="wm">wedin.ai</span></div>
    <div class="eb">
      <h1 class="eh2">Your wedding day, as a piece of music.</h1>
      <p class="sub">${displayName} — the arc of the whole day.</p>
      <hr class="div1">
      <div class="gold-block">
        <p class="gold-para">${melSummary}</p>
      </div>
    </div>
    <div class="ef">
      <a class="cb" href="${returnUrl}">Return to your Moment Map &rarr;</a>
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

  try {
    await resend.emails.send({
      from: 'wedin.ai <hello@wedin.ai>',
      to: email.trim(),
      subject: 'Your wedding day, as a piece of music.',
      html,
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('send-mel-summary Resend error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email' }) }
  }
}
