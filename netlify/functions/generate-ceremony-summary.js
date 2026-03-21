import { CEREMONY_KNOWLEDGE_BASE } from '../../src/data/ceremonyKnowledge.js'

const SYSTEM_PROMPT = `${CEREMONY_KNOWLEDGE_BASE}

---

You are a wedding music specialist for wedin.ai. You have deep knowledge of ceremony music across every tradition — Jewish, Muslim, Hindu, Catholic, Orthodox, Protestant, NG Kerk, and interfaith combinations — with specific expertise in the South African context.

When generating ceremony music summaries:
1. Use the knowledge base above to identify any tradition-specific moments or requirements the couple may have missed — gaps in their planning that their planner will need to address.
2. Generate summaries that are specific to their tradition and answers, not generic. A Jewish ceremony summary should read differently from a Hindu one.
3. Flag anything important the couple hasn't addressed yet — missing moments, tradition requirements, common oversights — weaving these naturally into the summary.
4. Write as a knowledgeable friend who has worked hundreds of weddings, not as an encyclopedia. Be direct, warm, and practical.`

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

  const { ceremonyAnswers, sessionAnswers = {}, coupleName } = body

  const name = coupleName && coupleName !== 'Your Wedding' ? coupleName : 'this couple'

  const religionLine = ceremonyAnswers['ceremony_structure']
    ? `Ceremony type: ${ceremonyAnswers['ceremony_structure']}${ceremonyAnswers['ceremony_faith'] ? ` (${ceremonyAnswers['ceremony_faith']})` : ''}`
    : null

  const prompt = `You are writing the Ceremony section of a wedding music brief for ${name}.

Write a warm, specific 3–4 sentence paragraph describing their ceremony music vision. Use their actual words where possible. Be direct and personal. Never use generic wedding clichés. This paragraph will be read by their wedding planner and any musicians or sound engineers working the ceremony.

Draw on your knowledge of their tradition to naturally flag any important moments they haven't addressed — weave these into the summary as actionable notes for the planner.

Their discovery session context:
- Wedding feeling: ${sessionAnswers['three_words'] || 'not provided'}
- Most anticipated moment: ${sessionAnswers['most_anticipated_moment'] || 'not provided'}

Their ceremony answers:
${religionLine ? `- ${religionLine}` : ''}
- Processional song/idea: ${ceremonyAnswers['processional_song'] || 'not answered'}
- Processional atmosphere: ${ceremonyAnswers['processional_tone'] || 'not answered'}
- Signing music: ${ceremonyAnswers['signing_music'] || 'not answered'}
- Recessional song/idea: ${ceremonyAnswers['recessional_song'] || 'not answered'}
- Live or recorded: ${ceremonyAnswers['ceremony_format'] || 'not answered'}
- Officiant requirements: ${ceremonyAnswers['officiant_requirements'] || 'not answered'}

Respond ONLY with valid JSON: {"summary": "3–4 sentence paragraph here"}`

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
        max_tokens: 512,
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
      body: JSON.stringify({ summary: parsed.summary ?? null }),
    }
  } catch (e) {
    console.error('Ceremony summary generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Summary generation failed' }),
    }
  }
}
