// patch-test-session.js
// Patches the most recent Supabase session for a test email to include
// couple_brief, mil_budget, and coordinator_profile in the state column.
// Run once to set up restore-link testing. Never deploy.
//
// Usage: node scripts/patch-test-session.js

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const TEST_EMAIL = 'rus@the-ear.com'

function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  try {
    const lines = readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex < 0) continue
      const key = trimmed.slice(0, eqIndex).trim()
      const val = trimmed.slice(eqIndex + 1).trim()
      process.env[key] = val
    }
  } catch {
    console.error('Could not read .env.local — make sure it exists at the project root.')
    process.exit(1)
  }
}

loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

// ── 1. Fetch the most recent session for TEST_EMAIL ───────────────────────
const fetchUrl =
  `${SUPABASE_URL}/rest/v1/sessions` +
  `?email=eq.${encodeURIComponent(TEST_EMAIL)}` +
  `&order=created_at.desc` +
  `&limit=1`

const fetchRes = await fetch(fetchUrl, { headers })

if (!fetchRes.ok) {
  console.error('Supabase fetch failed:', fetchRes.status, await fetchRes.text())
  process.exit(1)
}

const rows = await fetchRes.json()

if (!rows.length) {
  console.error(`No session found for ${TEST_EMAIL}`)
  process.exit(1)
}

const row = rows[0]
const existingState = row.state || {}

console.log(`Found session: ${row.id}`)
console.log(`Current state keys: ${Object.keys(existingState).join(', ') || '(none)'}`)

// ── 2. Build couple_brief stand-in ───────────────────────────────────────
// Use existing value if present; otherwise stringify mil_recommendations
// (any non-empty string satisfies the restore guard in App.jsx).
const coupleBriefValue =
  existingState.couple_brief ||
  (existingState.mil_recommendations
    ? JSON.stringify(existingState.mil_recommendations).slice(0, 200)
    : '[patched — couple_brief stand-in for restore test]')

// ── 3. Merge three new fields into state ─────────────────────────────────
const patchedState = {
  ...existingState,
  couple_brief: coupleBriefValue,
  mil_budget: existingState.mil_budget || 'R30 000 – R60 000',
  coordinator_profile: existingState.coordinator_profile || 'venue',
}

// ── 4. Write back to Supabase ─────────────────────────────────────────────
const patchUrl = `${SUPABASE_URL}/rest/v1/sessions?id=eq.${row.id}`

const patchRes = await fetch(patchUrl, {
  method: 'PATCH',
  headers: { ...headers, 'Prefer': 'return=minimal' },
  body: JSON.stringify({ state: patchedState }),
})

if (!patchRes.ok) {
  console.error('Supabase patch failed:', patchRes.status, await patchRes.text())
  process.exit(1)
}

console.log(`Done — session ${row.id} patched with couple_brief, mil_budget, coordinator_profile`)
console.log(`\ncouple_brief: ${patchedState.couple_brief.slice(0, 80)}…`)
console.log(`mil_budget:   ${patchedState.mil_budget}`)
console.log(`coordinator:  ${patchedState.coordinator_profile}`)
