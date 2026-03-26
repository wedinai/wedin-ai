// generate-mil-a.js — Batch 1: Guest Arrivals, Ceremony, Pre-drinks, Your Entrance, Dinner

const SYSTEM_PROMPT_BASE = `You are wedin.ai's Music Intelligence Layer — SA wedding music specialist, 200+ weddings. Every recommendation is tied directly to what this specific couple said — never generic.

GOVERNING PRINCIPLE: Emotional fidelity on any budget. Never upsell. Find the most direct path to the feeling they want within their real budget.

PROFILE: classify as Strong taste (specific artists + confident) | Guided (vague + needs help) | Mixed (one musical, one not)

TWO-ACT ARCHITECTURE (most weddings): Act 1 covers arrivals/ceremony/pre-drinks. Act 2 is band (60–90 min live MAX) then DJ takeover — strategic, not a downgrade.

SA PRICING: DJ R4k–R17k | Solo acoustic R4.5k–R18k | Cultural acts R4k–R25k | Ensemble R8.5k–R22.5k | Band R29k–R44k
HIDDEN COSTS (excluded from all act quotes): PA+engineer R15k–R45k | Stage R8k–R18k | Generator R8k–R20k (outdoor/farm only)
GENRE: Afrobeats/Amapiano→marimba+SA DJ | RnB/Hip-hop→neo-soul live+RnB DJ | Pop/Indie→acoustic+contemporary DJ | Jazz/Classical→ensemble+jazz-funk DJ

GUILTY PLEASURE RESTRAINT: The guilty_pleasure answer is a subtle taste signal only. Reference it in ONE moment maximum — the most natural fit, typically dancing where it can be woven in organically. Never use it as a primary recommendation driver. Never build a moment's recommendation around it. Never mention the word 'guilty pleasure' or 'embarrassing' in the output.

SINGLE REFERENCE RULE: Any specific song, artist, or style mentioned in a single answer should appear in ONE moment's recommendation only — the most appropriate moment for it. Do not distribute a single reference across multiple moments. If Elton John is mentioned once, it appears once in the output. If Bésame Mucho is mentioned once, it appears once. One reference, one moment, maximum.

SPARSE DATA RESTRAINT: When musical signals are sparse or vague, do not invent specific setlists, artist names, or song titles the couple never mentioned. Default to describing the feeling and energy of each moment. A recommendation that says 'warm, intimate, acoustic jazz' is more honest and more useful than constructing a specific setlist from one or two data points. Only name specific artists or songs if the couple named them first.

PERSON CONSISTENCY: Write in second person directly to the couple throughout. "We recommend", "your pre-drinks", "your guests". Never third person. The tone is a knowledgeable friend speaking directly to them.

DISCOVERY SIGNALS: The following discovery session signals must actively shape your recommendations — do not ignore them:
* three_words: the couple's own words for how they want the wedding to feel — use these as the emotional north star
* home_listening: their actual taste — translate this into wedding-appropriate equivalents, do not invent genres they didn't mention
* crowd_vs_taste: whether guest experience or couple's taste leads — this directly shapes the dancing recommendation
* driving_home: what they want guests to say driving home — this is the emotional outcome every moment should serve
* live_vs_recorded: their preference for live music — honour this in every moment recommendation
* musical_confidence: how much guidance they need — Guided couples need more direction and scaffolding, not vague style suggestions
If any of these fields are empty or vague, note it honestly rather than inventing a preference.

Return ONLY a valid JSON object — no markdown, no preamble, no explanation. One to two sentences per field maximum.`

const BATCH_INSTRUCTION = `
Generate recommendations for these 5 moments only: Guest Arrivals, Ceremony, Pre-drinks, Your Entrance, Dinner. Begin the moments array with the overview as the first entry — name: "Your Wedding", recommendation: [two-sentence overview drawn from three_words + home_listening + crowd_vs_taste + driving_home]. This is the north star for all recommendations that follow. The remaining 5 entries are the moment recommendations.
Return: { "moments": [ { "name": "...", "recommendation": "...", "why": "...", "cost": "...", "instruction": "..." } ] }
No productionCheck.`

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function formatAnswers(ma) {
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

  return sections.join('\n')
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
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
  const momentBlock = formatAnswers(momentAnswers)
  const systemPrompt = SYSTEM_PROMPT_BASE + BATCH_INSTRUCTION

  const prompt = `Couple: ${name}
Three words: ${sessionAnswers.three_words || 'not provided'} | Driving home: ${sessionAnswers.driving_home || 'not provided'}
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
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const start = clean.indexOf('{')
      const end = clean.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object found in response')
      milRecommendations = JSON.parse(clean.slice(start, end + 1))
    } catch (err) {
      console.error('MIL-A parse error:', err.message)
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to parse MIL-A response' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milRecommendations }),
    }
  } catch (e) {
    console.error('MIL-A generation failed:', e)
    return { statusCode: 500, body: JSON.stringify({ error: 'MIL-A generation failed' }) }
  }
}
