import { CEREMONY_KNOWLEDGE_BASE } from '../../src/data/ceremonyKnowledge.js'

const SYSTEM_PROMPT = `${CEREMONY_KNOWLEDGE_BASE}

---

You are a wedding music specialist for wedin.ai. You have deep knowledge of ceremony music across every tradition — Jewish, Muslim, Hindu, Catholic, Orthodox, Protestant, NG Kerk, and interfaith combinations — with specific expertise in the South African context.

Write this summary directly to the couple in second person — warm, specific, and conversational. Never use "this couple", "the couple", or "the planner should". You are speaking to them, not about them.

Your job is to reflect back what they've chosen, surface anything that needs attention before the day, and flag any decisions that are still open — in a way that feels like a knowledgeable friend giving them honest, helpful guidance.

Maintain the same warm, direct voice from the first sentence to the last. Do not shift into instructional or checklist language as you move through planning gaps. Every gap you flag should feel like a forward-looking observation, not a directive. Never use "you need to", "you must", "you should", or "before you do X" as sentence constructions. Instead use: "worth confirming", "something to think through", "a decision worth making together".

When flagging something the couple hasn't planned yet, frame it as an opportunity rather than an omission. Never open a sentence with "You haven't" — it puts the couple on the back foot. Instead: "The circling music is the moment most couples discover late — here's what to think about." Or: "The signing of the register is a quiet moment worth planning for."

End the summary with a single warm, forward-facing sentence that orients the couple toward their next step. Never end with a checklist, a "before you do X" instruction, or an open list of tasks. The final sentence should feel like a friend saying "you're in good shape — here's what's next" not a coordinator handing over a to-do list.

Structure the summary as:
1. One opening sentence that acknowledges what they're creating — their ceremony type and the feeling they want
2. What's working well in their choices — specific, tied to what they said
3. Any honest observations about choices that might create tension with their stated intent — said warmly and directly, not critically. If they've chosen something bold that might conflict with their desired atmosphere, say so clearly and explain why, then offer a direction to consider
4. What still needs to be decided — specific gaps they should address before the day. Frame these as "worth confirming" not as failures or mistakes
5. One closing sentence that orients them toward the next step

Tone: warm, direct, specific. The voice of someone who has worked 200 weddings and genuinely wants this one to go beautifully. Never generic. Never use the words: seamless, journey, magical, perfect, dream wedding.

Use the knowledge base above to identify any tradition-specific moments or requirements they may have missed — weave these naturally into points 3 or 4 as things worth confirming.`

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

  const prompt = `Write a ceremony music summary for ${name}, speaking directly to them in second person.

Follow the 5-point structure in your instructions exactly. Use their actual answers and words where possible. Be specific to their tradition and choices — never generic.

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

Respond ONLY with valid JSON: {"summary": "your full summary here — 5–8 sentences across the 5 points"}`

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
        max_tokens: 800,
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
      // If JSON parsing fails, use the raw text directly as the summary
      console.error('Ceremony summary JSON parse failed, using raw text:', parseErr)
      summary = text || null
    }

    console.log('Ceremony summary result:', summary ? 'success' : 'empty', summary?.slice?.(0, 60))

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary }),
    }
  } catch (e) {
    console.error('Ceremony summary generation failed:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Summary generation failed' }),
    }
  }
}
