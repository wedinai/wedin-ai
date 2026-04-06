// create-spotify-playlist.js
// Takes Claude's track list, searches Spotify for each track,
// creates one playlist for the full wedding, returns the shareable URL.

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_USER_ID } = process.env

  // Graceful failure when credentials are absent
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN || !SPOTIFY_USER_ID) {
    console.log('create-spotify-playlist: Spotify credentials not configured — skipping')
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistUrl: null }),
    }
  }

  try {
    const { tracks = [], coupleName = 'Wedding' } = JSON.parse(event.body || '{}')

    if (!tracks.length) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistUrl: null }),
      }
    }

    // ── Step 1: Exchange refresh token for access token ──────────────────────
    const authHeader = 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      console.error('create-spotify-playlist: token exchange failed', err)
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playlistUrl: null }) }
    }

    const { access_token: accessToken } = await tokenRes.json()

    // ── Step 2: Search each track in parallel ────────────────────────────────
    const searchResults = await Promise.all(
      tracks.map(async ({ artist, title }) => {
        try {
          const q = encodeURIComponent(`track:"${title}" artist:"${artist}"`)
          const res = await fetch(
            `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          if (!res.ok) return null
          const data = await res.json()
          return data.tracks?.items?.[0]?.uri || null
        } catch {
          return null
        }
      })
    )

    const trackUris = searchResults.filter(Boolean)

    if (!trackUris.length) {
      console.log('create-spotify-playlist: no tracks found on Spotify')
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playlistUrl: null }) }
    }

    // ── Step 3: Create playlist on wedin.ai Spotify account ─────────────────
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${coupleName} Wedding`,
          public: true,
          description: 'Your wedding soundtrack, built by wedin.ai',
        }),
      }
    )

    if (!playlistRes.ok) {
      const err = await playlistRes.text()
      console.error('create-spotify-playlist: playlist creation failed', err)
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playlistUrl: null }) }
    }

    const playlist = await playlistRes.json()

    // ── Step 4: Add tracks ───────────────────────────────────────────────────
    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackUris }),
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistUrl: playlist.external_urls?.spotify || null }),
    }
  } catch (e) {
    console.error('create-spotify-playlist: handler error', e.message)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistUrl: null }),
    }
  }
}
