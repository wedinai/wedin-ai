const SYSTEM_PROMPT_BASE = `You are wedin.ai's Music Intelligence Layer — SA wedding music specialist, 200+ weddings. Every recommendation is tied directly to what this specific couple said — never generic.

GOVERNING PRINCIPLE: Emotional fidelity on any budget. Never upsell. Find the most direct path to the feeling they want within their real budget.

PROFILE: classify as Strong taste (specific artists + confident) | Guided (vague + needs help) | Mixed (one musical, one not)

TWO-ACT ARCHITECTURE (most weddings): Act 1 covers arrivals/ceremony/pre-drinks. Act 2 is band (60–90 min live MAX) then DJ takeover — strategic, not a downgrade.

SA PRICING: DJ R4k–R17k | Solo acoustic R4.5k–R18k | Cultural acts R4k–R25k | Ensemble R8.5k–R22.5k | Band R29k–R44k
HIDDEN COSTS (excluded from all act quotes): PA+engineer R15k–R45k | Stage R8k–R18k | Generator R8k–R20k (outdoor/farm only)
GENRE: Afrobeats/Amapiano→marimba+SA DJ | RnB/Hip-hop→neo-soul live+RnB DJ | Pop/Indie→acoustic+contemporary DJ | Jazz/Classical→ensemble+jazz-funk DJ

Return ONLY a valid JSON object — no markdown, no preamble, no explanation. One to two sentences per field maximum.`

const BATCH_1_INSTRUCTION = `
Generate recommendations for these 5 moments only: Guest Arrivals, Ceremony, Pre-drinks, Your Entrance, Dinner.
Return: { "moments": [ { "name": "...", "recommendation": "...", "why": "...", "cost": "...", "instruction": "..." } ] }
No productionCheck.`

const BATCH_2_INSTRUCTION = `
Generate recommendations for these 4 moments only: Speeches, First Dance, Dancing, Last Song. Include productionCheck.
Return: { "moments": [ { "name": "...", "recommendation": "...", "why": "...", "cost": "...", "instruction": "..." } ], "productionCheck": { "totalEstimate": "...", "bookFirst": "...", "hiddenCosts": "..." } }`

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


function formatBatchAnswers(ma, batch) {
  const sections = []
  const push = (s) => { if (s) sections.push(s) }

  if (batch === 1) {
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
    ]))
    const pd = ma.predrinks || {}
    push(section('PRE-DRINKS', [
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
  } else {
    const sp = ma.speeches || {}
    push(section('SPEECHES', [
      line('Number of speeches', sp.speeches_count),
      line('Intro songs', sp.speeches_intro_songs),
      line('Between speeches', sp.speeches_between),
      line('Outro transition', sp.speeches_outro),
    ]))
    const fd = ma.firstDance || {}
    push(section('FIRST DANCE', [
      line('Song or feeling', fd.firstdance_song),
      line('What it should do to the room', fd.firstdance_room_feeling),
      line('Live or recorded', fd.firstdance_live_or_recorded),
      line('Additional dances', fd.firstdance_additional),
      line('Floor transition', fd.firstdance_transition),
    ]))
    const da = ma.dancing || {}
    push(section('DANCING', [
      line('Energy arc', da.dancing_energy_arc),
      line('Guest mix priority', da.dancing_guest_mix),
      line('Songs or genres to avoid', da.dancing_avoid),
      line('Peak moment', da.dancing_peak_moment),
      line('Wind-down', da.dancing_wind_down),
    ]))
    const ls = ma.lastSong || {}
    push(section('LAST SONG', [
      line('Song or feeling', ls.lastsong_song),
      line('How to end the night', ls.lastsong_energy),
      line('Instruction needed', ls.lastsong_instruction),
    ]))
  }

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
    batch = 1,
  } = body

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'
  const momentBlock = formatBatchAnswers(momentAnswers, batch)
  const systemPrompt = SYSTEM_PROMPT_BASE + (batch === 1 ? BATCH_1_INSTRUCTION : BATCH_2_INSTRUCTION)

  const prompt = `Couple: ${name}
Profile signals: listening=${sessionAnswers.home_listening || 'n/a'} | guilty=${sessionAnswers.guilty_pleasure || 'n/a'} | confidence=${sessionAnswers.musical_confidence || 'n/a'} | crowd_vs_taste=${sessionAnswers.crowd_vs_taste || 'n/a'} | live_vs_recorded=${sessionAnswers.live_vs_recorded || 'n/a'}
Budget: ${milAnswers.mil_budget || 'not provided'} | Bookings: ${milAnswers.mil_existing_bookings || 'nothing booked'} | Guests: ${sessionAnswers.guest_count || 'not specified'}
Portrait: ${portrait ? portrait.slice(0, 400) : 'Not available'}

MOMENT ANSWERS:
${momentBlock || 'No moment answers provided'}`

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
        max_tokens: 2000,
        system: systemPrompt,
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

    let milRecommendations
    try {
      const text = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')

      const clean = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      milRecommendations = JSON.parse(clean)
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
