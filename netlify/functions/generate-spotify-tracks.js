// generate-spotify-tracks.js
// Claude curates a track list from the couple's moment answers and MIL output.
// Called after MIL completes. Output feeds into create-spotify-playlist.js.

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MOMENT_FUNCTIONS = `
- Guest Arrivals: ambient, welcoming, warm — low energy
- Ceremony: sacred or celebratory per couple's answer — instrumental preferred
- Pre-drinks: social energy builds — upbeat, conversational volume
- Entrance: one high-energy song — peak moment, short
- Dinner: background presence, carries conversation — moderate tempo, acoustic preferred
- Speeches: skip — no music recommendation needed
- First Dance: entirely determined by couple's chosen song — recommend same-feel alternatives only
- Dancing: energy arc — moderate to peak to cool-down
- Last Song: emotional resolution — high valence, singalong quality`

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { momentAnswers = {}, milRecommendations = {}, sessionAnswers = {}, coupleName = 'the couple' } =
      JSON.parse(event.body || '{}')

    // Extract all named songs from moment answers — these are ground truth
    const songSources = {
      firstdance_song: momentAnswers.firstDance?.firstdance_song,
      lastsong_song:   momentAnswers.lastSong?.lastsong_song,
      processional:    momentAnswers.ceremony?.processional_song,
      signing:         momentAnswers.ceremony?.signing_music,
      recessional:     momentAnswers.ceremony?.recessional_song,
      arrivals_songs:  momentAnswers.guestArrivals?.song_question,
      ceremony_songs:  momentAnswers.ceremony?.song_question,
      predrinks_songs: momentAnswers.predrinks?.song_question,
      entrance_songs:  momentAnswers.entrance?.song_question,
      dinner_songs:    momentAnswers.dinner?.song_question,
      speeches_songs:  momentAnswers.speeches?.song_question,
      dancing_songs:   momentAnswers.dancing?.song_question,
      lastsong_songs:  momentAnswers.lastSong?.song_question,
    }

    // Filter out empty/undefined values
    const namedSongs = Object.fromEntries(
      Object.entries(songSources).filter(([, v]) => v && v.trim())
    )

    // Summarise MIL recommendations per moment for Claude context
    const milSummary = (milRecommendations.moments || [])
      .filter(m => m.name && m.recommendation)
      .map(m => `${m.name}: ${m.recommendation}`)
      .join('\n')

    const userContent = `Couple: ${coupleName}
Musical taste signals:
- Three words to describe the vibe: ${sessionAnswers.three_words || 'not provided'}
- Home listening: ${sessionAnswers.home_listening || 'not provided'}
- Discovery answers: crowd_vs_taste=${sessionAnswers.crowd_vs_taste || 'not provided'}, live_vs_recorded=${sessionAnswers.live_vs_recorded || 'not provided'}

Songs the couple named (ground truth — must appear exactly as named):
${Object.keys(namedSongs).length ? JSON.stringify(namedSongs, null, 2) : 'None named'}

MIL recommendations per moment:
${milSummary || 'Not yet generated'}

Build the playlist now. Return ONLY valid JSON — no markdown, no preamble.`

    const systemPrompt = `You are a wedding music curator building a Spotify playlist for a real couple's wedding day.

For each of the 9 wedding moments below, return 2–3 tracks that match the moment's emotional function and the couple's musical taste.

Moment emotional functions:
${MOMENT_FUNCTIONS}

Rules:
1. Any song the couple named directly must appear exactly as named — same artist spelling, same title spelling. These are ground truth.
2. For moments with no named songs, generate contextual suggestions based on the MIL recommendation and the couple's session answers.
3. For Speeches: skip — do not include any tracks.
4. Keep artist and title as they appear on Spotify — no abbreviations.
5. Return ONLY valid JSON. No markdown. No explanation. No preamble.
6. Format: array of objects — [{ "moment": string, "artist": string, "title": string }]
7. Target 20–27 tracks total. Total output under 800 tokens.

IMPORTANT: Base all recommendations only on what this couple actually said. Fresh session. No memory of previous couples. Do not invent preferences they did not express.`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const raw = response.content?.[0]?.text || '[]'
    const clean = raw.trim()

    let tracks = []
    try {
      const start = clean.indexOf('[')
      const end = clean.lastIndexOf(']')
      if (start !== -1 && end !== -1) {
        tracks = JSON.parse(clean.slice(start, end + 1))
      }
    } catch (e) {
      console.error('generate-spotify-tracks: JSON parse failed', e.message)
      tracks = []
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracks }),
    }
  } catch (e) {
    console.error('generate-spotify-tracks: handler error', e.message)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracks: [] }),
    }
  }
}
