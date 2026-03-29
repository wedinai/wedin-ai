// generate-brief-b.js — Coordinator's brief only (operational document)

const SYSTEM_PROMPT = `You are a wedding music specialist for wedin.ai. Generate the coordinator's brief only — the operational document.

Built for a professional working fast. Each moment section includes the musical approach and ends with a clear, specific operational instruction. Direct and professional tone. Saves the coordinator 45 minutes of music discovery calls. Every moment tells the coordinator exactly what to brief the act or DJ.

PERSON CONSISTENCY: Write in second person to the coordinator. "Your couple has chosen", "your brief for this moment", "instruct your act". Never address the couple directly — this document is for the coordinator, not the couple. Every moment section ends with a specific operational instruction starting with a verb: "Brief the DJ", "Confirm with the couple", "Ensure the musician".

OVERVIEW: Before the nine moments, generate a two-sentence OVERVIEW section. Mark it **OVERVIEW** on its own line. Draw from: the couple's three words describing their wedding feeling, their home listening answer, their crowd vs taste answer, and what they want guests to say driving home. The overview should capture the vibe and feel — not list genres. It should feel like a north star that every moment is calibrated against. Do not be genre-prescriptive or box the couple in. If one of their words is "romantic", do not just say classical — offer the emotional register that word implies and how multiple styles could achieve it. Example tone: 'Warm and unhurried, with a groove underneath everything — music that feels like you, not like a wedding.' Never use: magical, perfect, seamless, dream wedding.

Rules:
- Be specific — reference the couple's actual choices, not generic wedding language
- No clichés.
- Prose only — no bullet points or numbered lists
- Only include moments where answers are provided — omit moments with no data
- Mark each moment section with **MOMENT NAME** on its own line — nothing else on that line
- Use \\n\\n to separate paragraphs
- Each moment section must end with a clear operational instruction
- JSON SAFETY: Never use double quotation marks (") anywhere in the brief text — this output is embedded in a JSON string value and unescaped double quotes will break it. Use single quotes (') when referencing song titles, couple's words, or any quoted phrase.

STRICT OUTPUT LIMIT: Keep each moment section to 2–3 sentences plus one operational instruction. The entire brief must stay under 2200 tokens. Do not pad or elaborate — clarity over completeness. If approaching token limit, shorten earlier sections before starting new ones. Never leave a JSON object unclosed.

Return ONLY valid JSON: {"coordinatorBrief": "..."}`

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
    momentAnswers = {},
    portrait = '',
    coupleName,
    sessionAnswers = {},
  } = body

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'
  const momentBlock = formatMomentAnswers(momentAnswers)

  const prompt = `Generate the coordinator's brief (operational document) for ${name}.

DISCOVERY CONTEXT:
- Wedding feeling (three words): ${sessionAnswers['three_words'] || 'not provided'}
- Home listening: ${sessionAnswers['home_listening'] || 'not provided'}
- Crowd vs taste: ${sessionAnswers['crowd_vs_taste'] || 'not provided'}
- What guests say driving home: ${sessionAnswers['driving_home'] || 'not provided'}
- Music importance: ${sessionAnswers['music_importance'] || 'not provided'}
- Guest count: ${sessionAnswers['guest_count'] || 'not provided'}
- Budget: ${sessionAnswers['total_budget'] || 'not provided'}
- Most anticipated moment: ${sessionAnswers['most_anticipated_moment'] || 'not provided'}
- Cultural background: ${sessionAnswers['cultural_background'] || 'not provided'}

MUSIC PORTRAIT:
${portrait ? portrait.slice(0, 600) : 'Not available'}

MOMENT ANSWERS:
${momentBlock || 'No moment answers provided'}

Return ONLY valid JSON: {"coordinatorBrief": "..."}`

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
        max_tokens: 3000,
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

    let parsed
    try {
      const text = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const start = clean.indexOf('{')
      const end = clean.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object found')
      parsed = JSON.parse(clean.slice(start, end + 1))
    } catch (err) {
      console.error('Brief-B parse error:', err.message)
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to parse brief-b response' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinatorBrief: parsed.coordinatorBrief ?? null }),
    }
  } catch (e) {
    console.error('Brief-B generation failed:', e)
    return { statusCode: 500, body: JSON.stringify({ error: 'Brief-B generation failed' }) }
  }
}
