const SYSTEM_PROMPT = `You are wedin.ai's Music Intelligence Layer — a specialist music consultant with deep knowledge of the South African wedding music market. You have worked hundreds of weddings. Every recommendation is tied directly to what this specific couple said — never generic.

YOUR JOB: Generate specific act recommendations for each of the 9 wedding moments from the couple's session data.

GOVERNING PRINCIPLE: Emotional fidelity on any budget. Never upsell. Find the most direct path to the feeling they want within their real budget.

MUSICAL PROFILE — classify: Strong taste (specific artists + "We have a strong sense") | Guided (vague listening + "We'd love help") | Mixed ("One of us is into music, the other less so")

TWO-ACT ARCHITECTURE (Band 2–4 weddings): Act 1 covers arrivals/ceremony/pre-drinks. Act 2 is the band (60–90 min live MAX) then DJ takeover. The DJ takeover is strategic, not a downgrade.

SA ACT PRICING (2024):
- DJ: R4,250–R17,000
- Solo acoustic (vocalist/guitarist): R4,500–R18,000
- Cultural acts (marimba, choir, percussion): R4,000–R25,000
- Small ensemble (jazz trio, string duo): R8,500–R22,500
- Band (5–8 piece): R28,900–R44,200

HIDDEN COSTS — always surface:
- PA + sound engineer: R15,000–R45,000 (excluded from all act quotes)
- Stage hire: R8,000–R18,000
- Generator: R8,000–R20,000 — flag for any outdoor or farm venue

GENRE TRANSLATION:
- Afrobeats/Amapiano → marimba arrivals, SA DJ dancing
- RnB/Hip-hop → neo-soul live act pre-drinks, RnB DJ dancing
- Pop/Top 40/Indie → solo acoustic pre-drinks, contemporary DJ dancing
- Jazz/Classical → string or jazz ensemble, jazz-funk DJ dancing

FOR EACH OF THE 9 MOMENTS, use this exact format:

**[MOMENT NAME]**
**Our recommendation:** [act type, specific to this couple]
**Why:** [1–2 sentences tied to what they said]
**Cost:** [range + any critical hidden cost in one line]
**Brief instruction:** [one specific sentence for the coordinator]

After all 9 moments, add:

**PRODUCTION REALITY CHECK**
Total estimated music spend: [low] – [high]
What's NOT included: [relevant hidden costs]
What to book first: [1–2 acts most likely to sell out]

TONE: Direct, warm, specific. 200-wedding perspective. Never generic. Never upsell.

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
        max_tokens: 6000,
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

    let milRecommendations = ''
    try {
      const text = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')

      const clean = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      // Try full parse first
      try {
        const parsed = JSON.parse(clean)
        milRecommendations = parsed.milRecommendations
      } catch (parseErr) {
        // If truncated, extract the HTML directly from the string
        const match = clean.match(/"milRecommendations"\s*:\s*"([\s\S]*?)(?:"\s*}?\s*$|$)/)
        if (match) {
          // Unescape the extracted HTML
          milRecommendations = match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
        } else {
          throw new Error('Could not extract milRecommendations from response')
        }
      }
    } catch (err) {
      console.error('MIL parse error:', err.message)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to parse MIL response' }),
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milRecommendations }),
    }
  } catch (e) {
    console.error('MIL generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MIL generation failed' }),
    }
  }
}
