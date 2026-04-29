import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const handler = async () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const resend = new Resend(process.env.RESEND_API_KEY)

  let touch1Sent = 0
  let touch2Sent = 0

  // ── Touch 1 — 48 hours, portrait not yet completed ──────────────────────
  const { data: touch1Candidates, error: touch1QueryError } = await supabase
    .from('sessions')
    .select('id, email, state, created_at')
    .not('email', 'is', null)
    .eq('remarketing_touch', 0)
    .lt('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())

  if (touch1QueryError) {
    console.error('Touch 1 query error:', touch1QueryError)
    return { statusCode: 500, body: 'Touch 1 query failed' }
  }

  const touch1Eligible = dedupeByEmail(
    (touch1Candidates || []).filter(s => !s.state || !s.state.milComplete)
  )

  for (const session of touch1Eligible) {
    const narrative = session.state?.portrait || null
    if (!narrative) continue // no portrait yet — skip

    const returnUrl = `https://wedin-ai-app.netlify.app?email=${encodeURIComponent(session.email)}`

    const html = buildTouch1Html(narrative, returnUrl)

    try {
      await resend.emails.send({
        from: 'wedin.ai <hello@wedin.ai>',
        to: session.email,
        subject: "Your music portrait is still here — and your nine moments are waiting.",
        html,
      })

      await supabase
        .from('sessions')
        .update({ remarketing_touch: 1 })
        .eq('id', session.id)

      touch1Sent++
    } catch (err) {
      console.error(`Touch 1 send failed for session ${session.id}:`, err.message)
    }
  }

  // ── Touch 2 — 7 days, portrait not yet completed ─────────────────────────
  const { data: touch2Candidates, error: touch2QueryError } = await supabase
    .from('sessions')
    .select('id, email, state, created_at')
    .not('email', 'is', null)
    .eq('remarketing_touch', 1)
    .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  if (touch2QueryError) {
    console.error('Touch 2 query error:', touch2QueryError)
    return { statusCode: 500, body: 'Touch 2 query failed' }
  }

  const touch2Eligible = dedupeByEmail(
    (touch2Candidates || []).filter(s => !s.state || !s.state.milComplete)
  )

  for (const session of touch2Eligible) {
    const returnUrl = `https://wedin-ai-app.netlify.app?email=${encodeURIComponent(session.email)}`

    const html = buildTouch2Html(returnUrl)

    try {
      await resend.emails.send({
        from: 'wedin.ai <hello@wedin.ai>',
        to: session.email,
        subject: "Your Moment Map — a quiet hour when you're ready.",
        html,
      })

      await supabase
        .from('sessions')
        .update({ remarketing_touch: 2 })
        .eq('id', session.id)

      touch2Sent++
    } catch (err) {
      console.error(`Touch 2 send failed for session ${session.id}:`, err.message)
    }
  }

  console.log(`Remarketing complete — Touch 1: ${touch1Sent} sent, Touch 2: ${touch2Sent} sent`)
  return {
    statusCode: 200,
    body: JSON.stringify({ touch1Sent, touch2Sent }),
  }
}

// ── Email templates ──────────────────────────────────────────────────────────

function dedupeByEmail(sessions) {
  const seen = new Map()
  for (const s of sessions) {
    const existing = seen.get(s.email)
    if (!existing || s.created_at > existing.created_at) {
      seen.set(s.email, s)
    }
  }
  return Array.from(seen.values())
}

function sharedStyles() {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ew { background: #E8E4DC; padding: 48px 16px; font-family: 'DM Sans', sans-serif; }
  .es { max-width: 560px; margin: 0 auto; background: #FAF7F2; border-radius: 16px; overflow: hidden; }

  .eh { padding: 28px 48px; text-align: center; border-bottom: 1px solid rgba(28,43,58,0.07); }
  .wm { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 20px; letter-spacing: 0.05em; color: #1C2B3A; text-decoration: none; }

  .eb { padding: 44px 48px 0; }

  .eh2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 36px; color: #1C2B3A; margin: 0 0 36px; line-height: 1.15; }

  .bp { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; color: #1C2B3A; margin: 0 0 20px; }

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
  `
}

function sharedHeader() {
  return `
    <div class="eh">
      <span class="wm">wedin.ai</span>
    </div>
  `
}

function sharedFooter() {
  return `
      <hr class="fd">
      <div class="fw">
        <span class="fwm">wedin.ai</span>
        <p class="ft">Start with the music.</p>
      </div>
  `
}

function buildTouch1Html(narrative, returnUrl) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${sharedStyles()}</style>
</head>
<body>
<div class="ew">
  <div class="es">

    ${sharedHeader()}

    <div class="eb">
      <h1 class="eh2">Your portrait is still here.</h1>

      <p class="bp">You told us what you want your wedding to feel like. That portrait doesn't go anywhere. What's waiting for you is a nine-moment walk through your day — from the music your guests hear as they arrive to the last song of the night. Each one shaped around what you said.</p>

      <hr class="div1">

      <div class="pc">
        <p class="pl">Your music portrait</p>
        <p class="pt">${narrative}</p>
      </div>
    </div>

    <div class="ef">
      <a class="cb" href="${returnUrl}">Open my Moment Map &rarr;</a>
      <p class="cn">Your session is saved. Pick up where you left off.</p>

      ${sharedFooter()}
    </div>

  </div>
</div>
</body>
</html>`
}

function buildTouch2Html(returnUrl) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${sharedStyles()}</style>
</head>
<body>
<div class="ew">
  <div class="es">

    ${sharedHeader()}

    <div class="eb">
      <h1 class="eh2">Nine moments. One conversation.</h1>

      <p class="bp">Most couples who complete their Moment Map tell us it's the first time the music conversation with their planner felt manageable. Not because the planning got easier — because they finally had words for what they wanted.</p>

      <p class="bp">Here's what's waiting: arrivals, ceremony, pre-drinks, entrance, dinner, speeches, first dance, dancing, last song. Nine moments, each one mapped around what you both told us. At the end, your wedding soundtrack — and a complete music plan your coordinator and acts can work from.</p>
    </div>

    <div class="ef">
      <a class="cb" href="${returnUrl}">Pick up where you left off &rarr;</a>
      <p class="cn">Your session is saved. Find a quiet hour, just the two of you.</p>

      ${sharedFooter()}
    </div>

  </div>
</div>
</body>
</html>`
}
