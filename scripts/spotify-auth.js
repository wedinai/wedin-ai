// HOW TO USE THIS SCRIPT
// 1. Make sure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are in .env.local
// 2. Run: npm run spotify-auth
// 3. Open the URL printed in your terminal
// 4. Log in with the wedin.ai Spotify account (not your personal account)
// 5. Approve the permissions
// 6. Copy the refresh token printed in your terminal
// 7. Add it to .env.local as SPOTIFY_REFRESH_TOKEN
// 8. Add it to Netlify environment variables as SPOTIFY_REFRESH_TOKEN
// 9. This script is never deployed — it runs locally one time only.

import http from 'http'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local manually (dotenv not installed — keep it simple)
function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  try {
    const lines = readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim()
      }
    }
  } catch {
    console.error('Could not read .env.local — make sure it exists at the project root.')
    process.exit(1)
  }
}

loadEnv()

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = 'http://127.0.0.1:8888/callback'
const SCOPE = 'playlist-modify-public playlist-modify-private'
const PORT = 8888

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nMissing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local')
  console.error('Add them first, then run this script again.\n')
  process.exit(1)
}

const authUrl =
  `https://accounts.spotify.com/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  `&show_dialog=true`

console.log('\n──────────────────────────────────────────────')
console.log('  wedin.ai — Spotify One-Time Auth Setup')
console.log('──────────────────────────────────────────────')
console.log('\nOpen this URL in your browser and log in with the wedin.ai Spotify account:\n')
console.log(authUrl)
console.log('\nWaiting for Spotify to redirect back...\n')

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) {
    res.end('Not found')
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error || !code) {
    res.end('<html><body><h2>Auth failed or cancelled. Check the terminal.</h2></body></html>')
    console.error('\nAuth failed:', error || 'no code returned')
    server.close()
    process.exit(1)
  }

  // Exchange code for tokens
  try {
    const authHeader = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    const data = await tokenRes.json()

    if (!data.refresh_token) {
      throw new Error(JSON.stringify(data))
    }

    res.end('<html><body><h2>Success! Check your terminal for the refresh token.</h2><p>You can close this tab.</p></body></html>')

    console.log('\n──────────────────────────────────────────────')
    console.log('  SUCCESS')
    console.log('──────────────────────────────────────────────')
    console.log('\nYOUR REFRESH TOKEN (copy this to Netlify env vars and .env.local as SPOTIFY_REFRESH_TOKEN):\n')
    console.log(data.refresh_token)
    console.log('\n──────────────────────────────────────────────')
    console.log('\nNext steps:')
    console.log('1. Add to .env.local:  SPOTIFY_REFRESH_TOKEN=' + data.refresh_token)
    console.log('2. Add to Netlify:     Settings → Environment variables → SPOTIFY_REFRESH_TOKEN')
    console.log('3. Also add SPOTIFY_USER_ID (your wedin.ai Spotify profile username)\n')

    server.close()
  } catch (e) {
    res.end('<html><body><h2>Token exchange failed. Check the terminal.</h2></body></html>')
    console.error('\nToken exchange failed:', e.message)
    server.close()
    process.exit(1)
  }
})

server.listen(PORT)
