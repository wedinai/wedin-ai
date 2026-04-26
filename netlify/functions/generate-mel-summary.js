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

  const { portrait, sessionAnswers, momentAnswers, coupleName } = body

  if (!sessionAnswers) {
    return { statusCode: 400, body: JSON.stringify({ error: 'sessionAnswers is required' }) }
  }
  if (!momentAnswers) {
    return { statusCode: 400, body: JSON.stringify({ error: 'momentAnswers is required' }) }
  }

  const systemPrompt = `You are generating a single paragraph for wedin.ai — a wedding music planning product. This paragraph appears between the couple completing their nine moment deep-dives and seeing their Music Plan for the first time. It is the second emotional peak of the product after the music portrait.

YOUR JOB:
Write one paragraph — five to six sentences maximum — that captures the shape of this couple's entire wedding day as a musical arc. Not moment by moment. The whole thing.

This paragraph must do three things:

1. Say something the couple has not already been told. Do not restate what the portrait said. Do not summarise individual moments. Find the pattern across all nine moments that only becomes visible when you look at the whole day at once — the emotional through-line, the shape of the arc, where the weight lands.

2. Be genuinely brief and precise. Five to six sentences. Every sentence must earn its place. No warmth for warmth's sake. No adjectives that don't carry meaning.

3. Look forward, not backward. Orient the couple toward what their day is going to feel like — not what they said during planning. The portrait reflected who they are. This paragraph prepares them for what's coming.

WHAT TO LOOK FOR ACROSS THE NINE MOMENTS:
- Where does the emotional weight of this day sit? Ceremony? First dance? Last song?
- How does the energy move — does it build steadily, peak early, hold a plateau, or save everything for the end?
- What is the single most distinctive thing about this couple's musical vision that makes their day unlike a generic wedding?
- Is there a tension in the day — a quiet moment before a loud one, an intimate ceremony before a big reception — and how does the music navigate it?

RULES:
- Never use the words: seamless, journey, unique, special, perfect, beautiful, magical, memorable, celebrate, or any generic wedding language
- Never list the nine moments by name
- Never repeat language from the portrait verbatim
- Never write in bullet points or use headings
- Second person — write to the couple directly
- Warm but precise — same register as the portrait, not warmer
- If the couple gave sparse answers with little emotional detail, reflect that honestly — do not invent an arc that isn't there
- IMPORTANT: Generate content for this specific couple only, based on answers provided. Fresh session. No memory of previous couples. Only reference what this couple actually said.

OUTPUT:
One paragraph only. No heading. No sign-off. No quotation marks. Just the paragraph.`

  const userMessage = `Couple name: ${coupleName || 'Not provided'}

Music portrait (match its register and tone — do not repeat verbatim):
${portrait || 'Not available'}

Discovery session answers:
${JSON.stringify(sessionAnswers, null, 2)}

Moment-by-moment answers across all nine deep-dives:
${JSON.stringify(momentAnswers, null, 2)}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('generate-mel-summary Anthropic error:', err)
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: err?.error?.message || 'Anthropic API error' }),
      }
    }

    const data = await res.json()
    const melSummary = data.content?.[0]?.text?.trim() ?? ''

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ melSummary }),
    }
  } catch (err) {
    console.error('generate-mel-summary error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Generation failed' }) }
  }
}
