---
name: wedin-cto
description: Activated for ALL technical architecture decisions, infrastructure choices, security questions, database design, deployment decisions, and any question about how wedin.ai is built under the hood. Use this skill before making any architectural decision, adding any new service or dependency, setting up any new infrastructure, or answering questions about data storage, security, APIs, or deployment. Also use when reviewing code for security issues, evaluating new technical approaches, or troubleshooting infrastructure problems. If the question involves HOW the product is built rather than WHAT it does or looks like, this skill must be consulted first.
---

# wedin-cto

## Role

This skill acts as the CTO layer for wedin.ai. It exists because architectural decisions made early are expensive to undo. Every infrastructure and security decision should be checked against this skill before proceeding.

The founder (Rus) is non-technical but commercially sharp. This skill translates technical decisions into plain language tradeoffs without over-explaining. Default to the simplest solution that is production-safe. Never over-engineer.

---

## Locked Tech Stack

Do not suggest alternatives to these decisions. They are locked.

| Layer | Decision | Notes |
|-------|----------|-------|
| Frontend | React + Tailwind CSS | Mobile-first. Vite for bundling. |
| AI — brief + MIL | claude-haiku-4-5-20251001 | Fast, cost-effective for structured JSON generation |
| AI — portrait + ceremony | claude-sonnet-4-6 | Higher quality for narrative generation |
| Music | Spotify API | Phase 2 active. Apple Music deferred indefinitely. |
| Payments | PayFast (replacing Stripe) | Stripe has SA merchant limitations. PayFast is SA's primary gateway. Research account setup for Tones of Note PTY Ltd. |
| PDF generation | Deferred to Phase 3 | window.print() removed. Proper PDF TBD. |
| Hosting | Netlify | Frontend + serverless functions. |
| Database | Supabase | PostgreSQL. Row-level security. |
| Email | Resend | hello@wedin.ai verified. 3,000 emails/month free. |
| Version control | GitHub — wedinai account | Repository: wedinai/wedin-ai |
| Legal entity | Tones of Note PTY (Ltd) | All contracts, T&Cs, Privacy Policy under this entity |

---

## Architecture Overview — Current State (March 2026)

```
Browser (React + Tailwind + Vite)
  Discovery Session (24 questions, 5 sections)
  Music Portrait Screen (4 states)
  Moment Map (9 moments, payment gate)
  9 Deep-Dive Components (one per moment)
  BriefScreen (3 tabs: Music Plan / Your Brief / Coordinator's Brief)
  PostBriefScreen (MIL CTA)
  MILIntakeScreen (budget + bookings → parallel MIL calls)

Netlify Functions (10 active)
  generate-portrait.js          → Claude sonnet-4-6 → portrait narrative
  save-session.js               → Supabase sessions table
  save-contact.js               → Supabase contacts + Resend email
  create-checkout-session.js    → Stripe test (PayFast migration pending)
  verify-payment.js             → Stripe test (PayFast migration pending)
  generate-ceremony-summary.js  → Claude sonnet-4-6 → ceremony narrative
  generate-brief-a.js           → Claude haiku → couple's brief JSON
  generate-brief-b.js           → Claude haiku → coordinator's brief JSON
  generate-mil-a.js             → Claude haiku → MIL moments 1–5 JSON
  generate-mil-b.js             → Claude haiku → MIL moments 6–9 + production check JSON

Supabase (PostgreSQL)
  sessions table  (session_id, answers JSON, band, created_at)
  contacts table  (email, session_id, created_at)

Claude API — always called server-side via Netlify Functions, never from browser
```

---

## Security — Non-Negotiables

- NEVER expose API keys in browser code. No VITE_ prefix on sensitive keys.
- VITE_ prefix only for: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Sensitive keys live server-side only: ANTHROPIC_API_KEY, RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY, payment gateway key
- All keys in .env.local locally (never committed) and Netlify environment variables dashboard
- Supabase RLS enabled on all tables
- All writes to Supabase go through Netlify Functions, never from browser
- HTTPS automatic on Netlify

---

## Parallel Function Architecture Pattern

**The problem:** Netlify 26-second hard timeout. Claude API ~20 second time-to-first-token. Any function generating 5+ structured outputs in one call will timeout.

**The solution:** Two separate function files. Call both via Promise.all. Each completes in 13–18 seconds. Results combine client-side.

**Critical rule:** NEVER call the same endpoint twice concurrently. Netlify deduplicates concurrent POSTs to the same URL — second call dropped silently. Always two separate function files.

```js
// Frontend pattern
const [res1, res2] = await Promise.all([
  fetch('/.netlify/functions/generate-x-a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }),
  fetch('/.netlify/functions/generate-x-b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
])
if (!res1.ok || !res2.ok) throw new Error('Generation failed')
const [data1, data2] = await Promise.all([res1.json(), res2.json()])
const combined = { ...data1.result, ...data2.result }
```

```toml
[functions."generate-x-a"]
  timeout = 26
[functions."generate-x-b"]
  timeout = 26
```

Apply to: any future large generation — Spotify playlist generation, section-level brief regeneration.

---

## Timeout Debugging Approach

1. Add console.log at handler start and before API call
2. If NO logs → infrastructure issue (routing, build error, netlify.toml, endpoint dedup)
3. Logs stop before API call → parsing/setup code issue
4. API call starts but never completes → output too large; compress prompt or parallel calls
5. 500 error + JSON parse error → Claude truncating mid-JSON (use JSON repair fallback)
6. Always use JSON output not HTML — 60–70% smaller, faster to generate

**Token management:**
- max_tokens: 2500 safe ceiling for 26s functions
- Add to system prompt: "One sentence per field maximum. Total output under 2000 tokens."

---

## JSON Repair Fallback Pattern

Active in: generate-mil-a.js, generate-mil-b.js, generate-brief-b.js

```js
// Primary parse
let parsed
const start = clean.indexOf('{')
const end = clean.lastIndexOf('}')
if (start !== -1 && end !== -1) {
  try { parsed = JSON.parse(clean.slice(start, end + 1)) } catch (e) {}
}

// Repair fallback — find last complete JSON object
if (!parsed) {
  try {
    const lastComplete = clean.lastIndexOf('},')
    if (lastComplete > 0) {
      const repaired = clean.substring(0, lastComplete + 1) + ']}}'
      parsed = JSON.parse(repaired)
      console.log('Parse: used repair fallback')
    }
  } catch (repairErr) {
    console.log('Parse: repair fallback failed', repairErr.message)
  }
}

// Regex fallback for coordinator brief
if (!parsed) {
  const match = text.match(/"coordinatorBrief"\s*:\s*"([\s\S]+)/)
  if (match) {
    parsed = { coordinatorBrief: match[1].replace(/"\s*\}?\s*$/, '').trim() }
  }
}
```

---

## AI Hallucination Prevention

Always include in every generative function system prompt:

```
IMPORTANT: Generating content for this specific couple based ONLY on answers provided.
Fresh session. No memory of previous couples.
Only reference what the couple actually said.
Do not invent musical details, formats, preferences, or acts.
Every artist name must be traceable to what this couple typed.
If field is empty or vague, reflect that warmly — do not fill with plausible language.
```

---

## Payment Gateway — Migration Pending

**Current:** Stripe test mode live. R999 ZAR unlocks Moment Map.
**Issue:** Stripe SA merchant limitations — may reject Tones of Note PTY Ltd at live onboarding.
**Replacement:** PayFast — SA's most used gateway. Cards, EFT, SnapScan, Zapper.

**Migration tasks:**
1. Research PayFast account setup for Tones of Note PTY Ltd
2. Replace create-checkout-session.js and verify-payment.js
3. Update T&Cs and Privacy Policy to reference PayFast
4. Test full payment flow before going live

---

## Legal Compliance

**T&Cs:** Drafted, ready to implement (Tones of Note PTY Ltd).
**Privacy Policy:** Drafted, POPIA compliant.
**Cookie consent:** Not yet built — needs banner on first visit, accept/decline, remembered choice.

**To implement:**
1. Add /terms and /privacy static routes to React app
2. Add footer links
3. Build cookie consent banner
4. Update Privacy Policy when PayFast replaces Stripe

---

## Spotify Integration — Phase 2

**Architecture:** Single wedin.ai Spotify app account. No couple login. Playlists generated programmatically and shared as public links.

**New function:** generate-spotify-playlists.js — called after MIL completes. Translates MIL recommendations into Spotify search queries. Adds playlist links to milRecommendations object.

**Requires:** SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Netlify environment variables. Never expose to browser.

---

## Netlify Configuration

```toml
[functions."generate-portrait"]
  timeout = 26
[functions."generate-ceremony-summary"]
  timeout = 26
[functions."generate-brief-a"]
  timeout = 26
[functions."generate-brief-b"]
  timeout = 26
[functions."generate-mil-a"]
  timeout = 26
[functions."generate-mil-b"]
  timeout = 26
```

---

## What NOT to Build Without Asking

- Any third-party service not in the locked stack
- Apple Music integration
- Alternative payment gateways other than PayFast
- Server-side rendering
- A backend beyond Netlify Functions
- Account creation before portrait reveal
- Payment before Moment Map is shown
