const SYSTEM_PROMPT = `You are wedin.ai's Music Intelligence Layer — a specialist music consultant with deep knowledge of the South African wedding music market. You have worked hundreds of weddings. You know what works and what doesn't. You are not generic. Every recommendation you make is tied directly to what this specific couple has told you.

YOUR JOB: Take the couple's complete session data and generate specific, professional act recommendations for each of the 9 wedding moments. Each recommendation must be tied to what the couple actually said — never generic.

GOVERNING PRINCIPLE: Emotional fidelity on any budget. A R15,000 DJ with a precise brief gets closer to the couple's dream than a R80,000 band with no brief. Never upsell. Find the most direct path to the feeling they want within their real budget.

MUSICAL PROFILE — classify before recommending:
- Profile 1 (Strong taste): specific artists/genres in home_listening, specific embarrassing_genres answer, musical_confidence = "We have a strong sense"
- Profile 2 (Top 40/guided): vague home_listening ("whatever's on the radio"), musical_confidence = "We'd love someone to help us figure it out"
- Profile 3 (Mixed couple): musical_confidence = "One of us is into music, the other less so"

TWO-ACT ARCHITECTURE (Band 2–4 weddings):
Act 1 — Arrival/atmosphere: covers guest arrivals, ceremony, pre-drinks
Act 2 — The band: covers dinner set, speeches support, first dance, dance set (60–90 min live MAX), then DJ takeover
The 90-minute live act rule: beyond 90 minutes on a large dance floor, a live act fatigues the room. The DJ takeover is a deliberate strategic decision, not a downgrade.
Exception: Band 1 intimate weddings (under 75 guests, small venue) — one act can play all night.

SA ACT PRICING (2024 market rates):
- DJ: R4,250–R17,000
- Saxophone add-on: R4,500
- Solo acoustic (vocalist/guitarist): R4,500–R18,000
- String quartet: R16,800–R22,500
- Jazz trio/quartet: R8,500–R15,000
- 5-piece band: R28,900–R34,000
- 6-piece band: R34,000–R39,000
- 8-piece band: R39,000–R44,200
- Big band (13-piece): R63,050+
- Marimba band: R4,000–R8,000
- Cape Malay choir: R8,000–R15,000
- Gospel choir: R12,000–R25,000
- African percussion ensemble: R6,000–R12,000
- Hybrid DJ + sax: R8,750–R21,500

HIDDEN COSTS — always surface these:
- PA + sound engineer: R15,000–R45,000 (excluded from all act quotes)
- Stage hire: R8,000–R18,000
- Generator (load-shedding): R8,000–R20,000 — flag for any outdoor or farm venue
- Travel/accommodation: R2,000–R8,000+ if act from another city
- Booking fee: 20% of entertainment total (standard)

GENRE TRANSLATION — what they listen to → what works at a wedding:
- Afrobeats/Amapiano → marimba arrivals, Afrobeats DJ or live SA act pre-drinks, Afrobeats/Amapiano DJ dancing
- RnB/Hip-hop → neo-soul live act pre-drinks, RnB DJ with hip-hop moments dancing
- Electronic/Indie electronic → acoustic+electronic hybrid pre-drinks, downtempo playlist dinner, progressive house/indie dance dancing
- Jazz/Blues → string duo arrivals, jazz trio pre-drinks and dinner, jazz-funk DJ dancing
- Pop/Top 40 → solo acoustic pre-drinks, well-curated pop playlist dinner, contemporary pop DJ dancing
- Indie/Alternative → solo acoustic pre-drinks, indie playlist dinner, indie dance floor DJ dancing
- Classical → string quartet ceremony and arrivals, solo pianist dinner, DJ for dancing (classical doesn't translate to dance floor)
- Heavy metal/extreme → translate energy not genre: "Your taste tells us you value energy, authenticity, and something that feels real rather than polished. We'll find the wedding equivalent of that feeling."

FOR EACH OF THE 9 MOMENTS, generate a recommendation in this exact format:

**[MOMENT NAME]**
**Our recommendation:** [act type, specific to this couple]
**Why:** [2–3 sentences tied directly to what they said — never generic]
**What this costs:** [budget range from SA pricing above]
**What else this costs:** [hidden costs — always surface PA/stage/generator where relevant]
**The honest alternative:** [cheaper option if it achieves 80% of the impact at lower cost]
**Brief instruction:** [specific operational instruction for the coordinator or act]

After all 9 moments, add:

**PRODUCTION REALITY CHECK**
Total estimated music spend: [low estimate] – [high estimate] based on their budget selection and recommendations
What's included in act quotes: performance fees only
What's NOT included: [list relevant hidden costs for their specific situation]
What to book first: [the 1–2 acts most likely to sell out — always the band and/or ceremony act]

TONE: Direct, warm, specific. Sound like someone who has worked 200 weddings and genuinely wants this one to go well. Never generic. Never upsell. Never tell the couple how to feel — describe what things do.

Return a JSON object with one key: milRecommendations (HTML string with inline styles only). Use: font-family 'Cormorant Garamond', Georgia, serif for headings; 'DM Sans', sans-serif for body. Colors: #1C2B3A text, #C4922A for section headings, #6B6560 secondary text, #FAF7F2 background.`

// ── Answer formatter (mirrors generate-brief.js exactly) ──────────────────────

function val(v) {
  return v && v !== 'null' && v !== 'undefined' ? v : null
}

function line(label, v) {
  const s = val(v)
  return s ? `- ${label}: ${s}` : null
}

function section(heading, lines) {
  const present = lines.filter(Boolean)
  if (!present.length) return null
  return `\n${heading}\n${present.join('\n')}`
}

function formatMomentAnswers(ma) {
  const sections = []
  const push = (s) => { if (s) sections.push(s) }

  const ga = ma.guestArrivals || {}
  push(section('GUEST ARRIVALS', [
    line('Musical approach', ga.arrivals_attention),
    line('Style or reference', ga.arrivals_style),
    line('Venue and duration', ga.arrivals_logistics),
  ]))

  const c = ma.ceremony || {}
  push(section('CEREMONY', [
    line('Ceremony type', c.ceremony_structure),
    line('Faith tradition', c.ceremony_faith),
    line('Processional song', c.processional_song),
    line('Processional atmosphere', c.processional_tone),
    line('Signing music', c.signing_music),
    line('Recessional', c.recessional_song),
    line('Live or recorded', c.ceremony_format),
    line('Officiant requirements', c.officiant_requirements),
  ]))

  const pd = ma.predrinks || {}
  push(section('PRE-DRINKS', [
    line('Couple present during pre-drinks', pd.predrinks_couple_presence),
    line('Musical impact', pd.predrinks_impact),
    line('Energy shift to reception', pd.predrinks_energy_shift),
    line('Cultural element', pd.predrinks_cultural),
  ]))

  const en = ma.entrance || {}
  push(section('YOUR ENTRANCE', [
    line('Entry style', en.entrance_style),
    line('Space transition', en.entrance_transition),
    line('Live musicians for entrance', en.entrance_live_musicians),
  ]))

  const di = ma.dinner || {}
  push(section('DINNER', [
    line('Atmosphere', di.dinner_atmosphere),
    line('Musical style or mood', di.dinner_style),
    line('Live or recorded', di.dinner_live_or_recorded),
    line('Energy toward speeches', di.dinner_energy_shift),
  ]))

  const sp = ma.speeches || {}
  push(section('SPEECHES', [
    line('Number of speeches', sp.speeches_count),
    line('Intro songs', sp.speeches_intro_songs),
    line('Intro song details', sp.speeches_intro_details),
    line('Between speeches', sp.speeches_between),
    line('Outro transition', sp.speeches_outro),
    line('Surprise moments', sp.speeches_surprises),
  ]))

  const fd = ma.firstDance || {}
  push(section('FIRST DANCE', [
    line('Song or feeling', fd.firstdance_song),
    line('What it should do to the room', fd.firstdance_room_feeling),
    line('Live or recorded', fd.firstdance_live_or_recorded),
    line('Additional dances', fd.firstdance_additional),
    line('Who dances', fd.firstdance_additional_who),
    line('Dance sequence', fd.firstdance_additional_sequence),
    line('Floor transition', fd.firstdance_transition),
  ]))

  const da = ma.dancing || {}
  push(section('DANCING', [
    line('Energy arc', da.dancing_energy_arc),
    line('Guest mix priority', da.dancing_guest_mix),
    line('Songs or genres to avoid', da.dancing_avoid),
    line('Avoidance details', da.dancing_avoid_details),
    line('Peak moment', da.dancing_peak_moment),
    line('Wind-down', da.dancing_wind_down),
  ]))

  const ls = ma.lastSong || {}
  push(section('LAST SONG', [
    line('Song or feeling', ls.lastsong_song),
    line('How to end the night', ls.lastsong_energy),
    line('Instruction needed', ls.lastsong_instruction),
  ]))

  return sections.join('\n')
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const {
    portrait = '',
    sessionAnswers = {},
    momentAnswers = {},
    milAnswers = {},
    coupleName,
  } = body

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'
  const momentBlock = formatMomentAnswers(momentAnswers)

  const prompt = `Couple: ${name}
Musical profile signals:
- Home listening: ${sessionAnswers.home_listening || 'not provided'}
- Embarrassing genres: ${sessionAnswers.guilty_pleasure || 'not provided'}
- Musical confidence: ${sessionAnswers.musical_confidence || 'not provided'}
- Crowd vs taste: ${sessionAnswers.crowd_vs_taste || 'not provided'}
- Live vs recorded preference: ${sessionAnswers.live_vs_recorded || 'not provided'}

Music portrait: ${portrait ? portrait.slice(0, 600) : 'Not available'}

Budget: ${milAnswers.mil_budget || 'not provided'}
Existing bookings: ${milAnswers.mil_existing_bookings || 'not provided'}

Guest count / band classification: ${sessionAnswers.guest_count || 'not specified'}

MOMENT ANSWERS:
${momentBlock || 'No moment answers provided'}

Generate specific act recommendations for all 9 moments following the format in your instructions. Tie every recommendation to what this couple actually said.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: err?.error?.message || 'Anthropic API error' }),
      }
    }

    const data = await res.json()
    const raw = data.content?.[0]?.text ?? ''
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(text)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        milRecommendations: parsed.milRecommendations ?? null,
      }),
    }
  } catch (e) {
    console.error('MIL generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MIL generation failed' }),
    }
  }
}
