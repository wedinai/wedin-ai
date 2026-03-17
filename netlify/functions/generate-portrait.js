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

  let answers
  try {
    answers = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const namedSongs = [
    answers['relationship_song'],
    answers['stop_and_look'],
    answers['first_dance'],
    answers['energy_lift'],
    answers['guilty_pleasure'],
    answers['last_song'],
  ].filter(Boolean).join(', ') || 'none named'

  const prompt = `You are writing a music portrait for a couple planning their wedding.

Write a warm, specific 2–3 sentence narrative describing what their wedding music should feel and do for their guests. Be direct and personal — use their actual words where possible. Never use generic wedding clichés. Make them feel truly understood.

Their answers:
- Wedding feeling: ${answers['three_words'] || 'not answered'}
- Most anticipated moment: ${answers['most_anticipated_moment'] || 'not answered'}
- Guests arrive feeling: ${Array.isArray(answers['guests_arrive_feeling']) ? answers['guests_arrive_feeling'].join(', ') : (answers['guests_arrive_feeling'] || 'not answered')}
- What guests should say driving home: ${answers['driving_home'] || 'not answered'}
- Dance vs talk preference: ${answers['dance_vs_talk'] || 'not answered'}
- Songs named: ${namedSongs}

Respond ONLY with valid JSON: {"narrative": "2–3 sentence narrative here"}`

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
        max_tokens: 256,
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
      body: JSON.stringify({ narrative: parsed.narrative ?? null }),
    }
  } catch (e) {
    console.error('Portrait generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Portrait generation failed' }),
    }
  }
}
