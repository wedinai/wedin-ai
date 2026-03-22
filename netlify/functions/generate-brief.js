const SYSTEM_PROMPT = `You are a wedding music specialist for wedin.ai. Your role is to assemble the final music brief from a couple's completed planning sessions.

You produce TWO distinct documents in a single response:

1. THE COUPLE'S BRIEF — An emotional mirror. This reflects their own clarity back to them more articulately than they could have expressed it themselves. Written as warm, flowing prose — organised by moment but reads as a coherent document, not a checklist. References their actual words and choices. Makes them feel genuinely understood. Never generic. Never tells them how to feel — describes what the music does and why their choices reflect who they are as a couple.

2. THE COORDINATOR'S BRIEF — An operational document built for a professional working fast. Each moment section includes the musical approach, a specific act or format recommendation, and a clear operational instruction. Saves the coordinator 45 minutes of music discovery calls. Direct and professional tone. Every moment tells the coordinator exactly what to brief the act or DJ.

Rules for both documents:
- Use the couple's actual words and answers wherever possible
- Be specific — reference their actual choices, not generic wedding language
- No clichés. No over-dramatisation.
- Prose only — no bullet points or numbered lists
- Only include moments where answers are provided — omit moments with no data`

// ── Answer formatter ─────────────────────────────────────────────────────────

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
  console.log('generate-brief invoked at', new Date().toISOString())

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
    console.log('Body parsed successfully, keys:', Object.keys(body))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const {
    momentAnswers = {},
    portrait = '',
    coupleName,
    sessionAnswers = {},
  } = body

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'

  const momentBlock = formatMomentAnswers(momentAnswers)

  const prompt = `Generate a complete wedding music brief for ${name}.

DISCOVERY CONTEXT:
- Wedding feeling: ${sessionAnswers['three_words'] || 'not provided'}
- Music importance: ${sessionAnswers['music_importance'] || 'not provided'}
- Guest count: ${sessionAnswers['guest_count'] || 'not provided'}
- Budget: ${sessionAnswers['total_budget'] || 'not provided'}
- Most anticipated moment: ${sessionAnswers['most_anticipated_moment'] || 'not provided'}
- Cultural background: ${sessionAnswers['cultural_background'] || 'not provided'}

MUSIC PORTRAIT:
${portrait ? portrait.slice(0, 600) : 'Not available'}

MOMENT ANSWERS:
${momentBlock || 'No moment answers provided'}

Return ONLY valid JSON in this exact format:
{"coupleBrief": "...", "coordinatorBrief": "..."}

Both values are plain text strings. Use \\n\\n to separate paragraphs. Mark each moment section with **MOMENT NAME** on its own line — nothing else on that line. No markdown bullet points or lists anywhere in the output.`

  try {
    console.log('Starting Claude API call')
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
    console.log('Claude API call complete, status:', res.status)

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
        coupleBrief: parsed.coupleBrief ?? null,
        coordinatorBrief: parsed.coordinatorBrief ?? null,
      }),
    }
  } catch (e) {
    console.error('Brief generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Brief generation failed' }),
    }
  }
}
