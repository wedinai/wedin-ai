const SYSTEM_PROMPT = `You are a wedding music specialist for wedin.ai. You have worked 200+ weddings and you know exactly what each moment needs to succeed.

Write a short moment summary directly to the couple in second person — warm, specific, and grounded in what they just told you. 3–4 sentences only.

Your job is to reflect back the key choices they've made and what it will feel like on the day. This is not a checklist. This is a mirror.

Tone rules:
- Warm and direct — like a knowledgeable friend, not a coordinator
- Specific to their answers — never generic placeholder language
- Forward-facing — oriented toward the day, not toward tasks
- Never use: seamless, journey, magical, perfect, dream wedding
- Never use "you need to", "you must", "you should"
- Do not flag gaps or missing decisions — that is not the job of this summary
- Never start a sentence with "You haven't"

Structure: Open with what they're creating and the feeling it will have. Then 1–2 sentences on the specific choices that will make it work. Close with one sentence that makes them feel ready.

Respond ONLY with valid JSON: {"summary": "your 3–4 sentence summary here"}`

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

  const { momentId, momentName, answers = {}, sessionAnswers = {}, coupleName, refinementFeedback } = body

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'

  const formattedAnswers = Object.entries(answers)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n')

  const refinementSection = refinementFeedback
    ? `\n\nThe couple has reviewed the summary and provided this feedback:\n- ${refinementFeedback.reflection || 'none'}\n- ${refinementFeedback.practical || 'none'}\n\nUpdate the summary to reflect their feedback specifically.`
    : ''

  const prompt = `Write a ${momentName} music summary for ${name}, speaking directly to them in second person.

Their discovery session context:
- Wedding feeling: ${sessionAnswers['three_words'] || 'not provided'}
- Most anticipated moment: ${sessionAnswers['most_anticipated_moment'] || 'not provided'}

Their ${momentName} answers:
${formattedAnswers || '(no answers provided)'}${refinementSection}

Respond ONLY with valid JSON: {"summary": "3–4 sentence summary"}`

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
        max_tokens: 600,
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

    let summary = null
    try {
      const parsed = JSON.parse(text)
      summary = parsed.summary ?? null
    } catch (parseErr) {
      console.error('Moment summary JSON parse failed, using raw text:', parseErr)
      summary = text || null
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary }),
    }
  } catch (e) {
    console.error('Moment summary generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Summary generation failed' }),
    }
  }
}
