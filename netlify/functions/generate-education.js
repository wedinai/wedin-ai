const MOMENT_ANSWERS_KEY = {
  arrivals:   'guestArrivals',
  ceremony:   'ceremony',
  predrinks:  'predrinks',
  entrance:   'entrance',
  firstdance: 'firstDance',
  dinner:     'dinner',
  speeches:   'speeches',
  dancing:    'dancing',
  lastsong:   'lastSong',
}

const SYSTEM_PROMPT = `You are a music educator embedded in wedin.ai. Write a short, warm explanation of WHY this couple's choices for their moment work for what they said they want from their day.

IMPORTANT: Generating content for this specific couple based ONLY on answers provided. Fresh session. No memory of previous couples. Only reference what the couple actually said. Do not invent musical details, preferences, or formats. If a field is empty or vague, reflect what they did say — do not fill gaps with plausible-sounding language.

Tone rules:
- Write as a knowledgeable friend who has worked 200 weddings — never as a wedding industry explainer
- Second person, "you both" preferred over "you"
- Warm and specific — never generic, never placeholder language
- Explain WHY their direction works — not what to do next
- Describe what things do — never tell the couple how to feel
- 3–4 sentences only. No more. Plain text. No bullet points, no headers.
- Never use: seamless, journey, unlock, leverage, magical, perfect, dream wedding, deploy
- Do not start with "You both" as the literal first two words — vary the opening
- Every card MUST reference at least one specific song title, artist name, or named detail from the couple's actual answers. A card that could apply to any couple is a failure — ground it in what they specifically said.

Structure: One sentence grounded in the specific feeling or choice they named. One or two sentences explaining why that direction works for this particular moment in a wedding. One closing sentence connecting their choice back to what they said they want from the day overall.

Respond ONLY with valid JSON: {"card": "your 3–4 sentence explanation here"}`

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

  const { portrait, sessionAnswers = {}, momentAnswers = {}, momentId, momentName, coupleName } = body

  const answersKey = MOMENT_ANSWERS_KEY[momentId]
  const momentSpecificAnswers = answersKey ? (momentAnswers[answersKey] || {}) : {}

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'

  const formattedMomentAnswers = Object.entries(momentSpecificAnswers)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n')

  const prompt = `Write a 3–4 sentence education card for ${name}'s ${momentName} moment.

Their wedding in a few words: ${sessionAnswers['three_words'] || 'not provided'}
Most anticipated moment: ${sessionAnswers['most_anticipated_moment'] || 'not provided'}
Musical instincts — home listening: ${sessionAnswers['home_listening'] || 'not provided'}, crowd vs taste: ${sessionAnswers['crowd_vs_taste'] || 'not provided'}

Their answers for ${momentName}:
${formattedMomentAnswers || '(no specific answers provided)'}

Respond ONLY with valid JSON: {"card": "your 3–4 sentence explanation here"}`

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
        max_tokens: 350,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Anthropic API error in generate-education:', err)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card: null }),
      }
    }

    const data = await res.json()
    const raw = data.content?.[0]?.text ?? ''
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    let card = null
    try {
      const parsed = JSON.parse(text)
      card = parsed.card ?? null
    } catch (parseErr) {
      console.error('Education card JSON parse failed, using raw text:', parseErr)
      card = text || null
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card }),
    }
  } catch (e) {
    console.error('Education card generation failed:', e)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card: null }),
    }
  }
}
