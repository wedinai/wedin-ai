---
name: wedin-build-assistant
description: Activated at the start of every Claude Code build session for wedin.ai. Use this skill before writing any code, creating any component, or making any architectural decision. This skill orients the build to the correct phase, tech stack, and design principles without requiring re-explanation from the founder. Must be loaded alongside CLAUDE.md at the start of every session.
---

# wedin-build-assistant

## Before Every Build Session

Load these documents as context before beginning any build work:
1. **CLAUDE.md** — current build status, architecture patterns, what's done, what's next
2. **wedin-mil-SKILL.md** — if working on MIL, brief generation, or any AI output
3. **wedin-brand-voice-SKILL.md** — if working on any copy, UI, or component design
4. **wedin-cto-SKILL.md** — if making any infrastructure or architecture decision
5. **This skill** — phase orientation and build principles

Do not proceed without reading CLAUDE.md first. Do not ask the founder to re-explain architecture that exists in these documents.

---

## Current Build State — March 2026

**Phase 2 is active and partially complete.** Phase 1 and Phase 1.5 are done.

**What is live at wedin-ai-app.netlify.app:**
- Discovery session — 24 questions, 5 sections, all with dynamic acknowledgements
- Music portrait — AI narrative, email capture, four states, hallucination prevention
- Moment Map — 9 moments, payment gate, white card CTA at top
- All 9 deep-dive sessions — each with "Other — tell us more" chip option
- Brief assembly — couple's brief + coordinator's brief in parallel
- Music Intelligence Layer — per-moment recommendations with SA market pricing
- Ceremony summary — faith tradition sub-flows, second person, tone rules
- Email delivery — Resend, hello@wedin.ai, confirmed delivering

**What is not yet built (next priorities):**
1. Ensemble-to-room-size logic — MIL system prompt update
2. Spotify integration — playlist per moment in Music Plan tab
3. Section-level brief regeneration
4. Coordinator brief email delivery
5. Cookie consent banner, T&Cs page, Privacy Policy page
6. PayFast integration (replacing Stripe)
7. Save state mid-moment
8. Optional moments

Always read CLAUDE.md for the full current state before starting any session.

---

## Tech Stack — Locked

Do not suggest alternatives. These are locked.

| Layer | Decision | Notes |
|-------|----------|-------|
| Frontend | React + Tailwind CSS | Mobile-first. Vite for bundling. |
| AI — brief + MIL | claude-haiku-4-5-20251001 | Fast JSON generation. Never use for portrait or ceremony. |
| AI — portrait + ceremony | claude-sonnet-4-6 | Higher quality narrative. |
| Music | Spotify API only | Apple Music deferred. Phase 2 active. |
| Payments | PayFast | Stripe test mode currently live. PayFast migration pending — research account setup for Tones of Note PTY Ltd before going live. |
| PDF generation | Deferred to Phase 3 | Do not attempt to build this now. |
| Hosting | Netlify | Frontend + serverless functions. Not Vercel. |
| Database | Supabase | PostgreSQL. Row-level security on all tables. |
| Email | Resend | hello@wedin.ai verified. |
| Version control | GitHub — wedinai/wedin-ai | |
| Legal entity | Tones of Note PTY (Ltd) | |

---

## Phase Plan — Current Status

### Phase 1 — MVP Core ✓ COMPLETE
Discovery session, Claude API, Supabase, Netlify, Resend.

### Phase 1.5 — Moment Map + Payment ✓ COMPLETE
Moment Map UI, Stripe test integration, payment confirmation screen.

### Phase 2 — Deep-Dive Sessions (IN PROGRESS)
All 9 deep-dives ✓ | Brief assembly ✓ | MIL ✓ | Ceremony summary ✓

Remaining Phase 2 items:
- Ensemble-to-room-size logic (MIL system prompt)
- Spotify integration
- Section-level brief regeneration
- Coordinator brief email delivery
- Save state mid-moment
- Brief accuracy score
- Optional moments
- Copy audit implementation
- Cookie consent banner
- T&Cs and Privacy Policy pages
- PayFast integration
- Remove debug console.log lines

### Phase 3 — Marketplace (Post-Revenue)
Curated artist directory, direct booking, couple reviews, planner dashboard, band-matched landing pages (5 versions), referral mechanism (10% rebate), UK market adaptation.

**Always confirm which phase the current session is targeting before writing any code.**

---

## Critical Architecture Patterns — Read Before Building Anything

### Parallel Function Pattern
**Problem:** Netlify 26-second timeout. Claude API ~20 second time-to-first-token.
**Solution:** Two separate function files, parallel Promise.all calls, results combined client-side.
**Critical:** NEVER call the same endpoint twice — Netlify deduplicates concurrent POSTs to the same URL. Always two separate function files.

```js
const [res1, res2] = await Promise.all([
  fetch('/.netlify/functions/generate-x-a', { method: 'POST', body: JSON.stringify(payload) }),
  fetch('/.netlify/functions/generate-x-b', { method: 'POST', body: JSON.stringify(payload) })
])
```

```toml
[functions."generate-x-a"]
  timeout = 26
[functions."generate-x-b"]
  timeout = 26
```

**Established in:** generate-brief-a/b.js and generate-mil-a/b.js. Apply to all future large generations.

### JSON Output Pattern
Always request JSON output from Claude, not HTML. JSON is 60–70% smaller and faster to generate. Render to styled React client-side.

Always include in system prompt: `Return ONLY valid JSON. No markdown, no preamble, no explanation.`

Always include: `OUTPUT LENGTH RULES: One sentence per field maximum. Total output under 2000 tokens.`

max_tokens: 2500 is the safe ceiling for functions that must complete within 26 seconds.

### JSON Repair Fallback
Add to every function that parses Claude JSON output:
```js
if (!parsed) {
  try {
    const lastComplete = clean.lastIndexOf('},')
    if (lastComplete > 0) {
      const repaired = clean.substring(0, lastComplete + 1) + ']}}'
      parsed = JSON.parse(repaired)
    }
  } catch (repairErr) {
    console.log('Parse repair failed:', repairErr.message)
  }
}
```

### Hallucination Prevention
Always include in every generative function system prompt:
```
IMPORTANT: Generating content for this specific couple based ONLY on answers provided.
Fresh session. No memory of previous couples.
Only reference what the couple actually said.
Do not invent musical details, formats, preferences, or acts.
```

### Security Rules — Always Apply
- No VITE_ prefix on: ANTHROPIC_API_KEY, RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY
- VITE_ only for: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- All sensitive keys in .env.local (never committed) and Netlify environment variables
- All writes to Supabase through Netlify Functions, never from browser

---

## Build Principles — Apply to Every Session

**Single-file solutions where possible.** Do not split into multiple files unless complexity genuinely demands it.

**Mobile-first, always.** Every component built for 375px width first. Desktop is the enhancement.

**One dominant element per screen.** If a screen has two competing elements for primary attention — redesign it.

**Account creation after value.** The music portrait reveal happens before the email input. Never gate discovery session output behind account creation.

**Payment after Moment Map.** The couple sees all 9 moments before paying. Never before.

**Progress saved automatically.** Every answer saves to localStorage. Closing and returning never loses work.

**No form-style flows.** One question at a time. The discovery session and deep-dives are conversations, not forms.

**Deploy to Netlify only.** Never start a preview server. Verify all changes on wedin-ai-app.netlify.app.

---

## UI Non-Negotiables — Check Before Every Commit

| Rule | Specification |
|------|--------------|
| Rounded corners | 8px minimum all interactive · Cards 16px · Chips 100px |
| Spacing | 8-point grid only — all spacing multiples of 8px |
| Tap targets | 44px minimum height on all interactive elements |
| Typography | Cormorant Garamond (display) + DM Sans (body). Never Inter or Roboto as primary. |
| Colours | Cream #FAF7F2 · Navy #1C2B3A · Gold #C4922A · Grey #6B6560 · White #FFFFFF |
| Gold | One use per screen maximum. Never a large background. |
| Primary button | Navy fill · cream text · 10px radius |
| Input focus | Gold border · `0 0 0 3px rgba(196,146,42,0.12)` |
| Progress bar | 3px height · navy-to-gold gradient |
| Animation | Purposeful only. 200–300ms. Never decorative. |
| Horizontal scroll | Never. On any screen. On any component. |
| Dark patterns | None. No artificial urgency, pre-checked boxes, hidden fees. |
| Aspirational dissonance | Band-matched visuals only. Never luxury imagery on a Band 2 screen. |

**Banned words in all copy (including AI-generated output):**
Seamless · Journey · Unlock · Leverage · Magical · Perfect · Dream wedding · Powered by AI · Curated (unless specific)

---

## Pre-Ship Checklist — Every Screen

- [ ] One dominant element on screen
- [ ] One primary action
- [ ] Copy uses wedin.ai voice — warm, direct, specific, never generic
- [ ] No internal product terminology visible to user
- [ ] Clear back affordance or escape route
- [ ] Progress through multi-step flow is visible without being intrusive
- [ ] 44px minimum tap targets on all interactive elements
- [ ] Colour contrast meets WCAG AA (4.5:1 body, 3:1 large text)
- [ ] Functional and legible on 375px mobile
- [ ] All states designed: default, hover, active, disabled, loading, error, empty, success
- [ ] Error messages in plain language with clear recovery path
- [ ] Progress saved — closing and returning does not lose work
- [ ] Tested on real mobile device (not browser resize)
- [ ] prefers-reduced-motion respected
- [ ] No dark patterns
- [ ] No banned words in copy

---

## Anti-Patterns — Never Build These

- Form-style discovery session or deep-dive (page of inputs)
- Account creation before portrait reveal
- Payment before Moment Map is shown
- Generic AI aesthetics (purple gradients, Inter font, chatbot chrome)
- Horizontal scroll on mobile
- Aspirational dissonance (wrong band imagery)
- Pricing shown before value is experienced
- Overwhelming first screen (multiple CTAs, banners, pop-ups)
- Technical error messages exposed to users
- Decorative animations
- Calling the same Netlify function endpoint twice concurrently

---

## Founder Context

Rus Nerwich — CEO of The Ear Academy (SA EdTech). Ran Tones of Note (100+ weddings). Non-technical but highly commercially minded. Building solo using Claude Code.

Build sessions should:
- Produce working, shippable output — not architecture discussions
- Default to the simplest solution that meets the requirement
- Flag genuine technical tradeoffs without over-explaining
- Never ask him to re-explain context that's in CLAUDE.md
- Confirm phase alignment before starting any new component
- Always verify on wedin-ai-app.netlify.app — never start a preview server
