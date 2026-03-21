# wedin.ai — Claude Code Context

Read this file at the start of every session. Do not ask Rus to re-explain anything documented here.

---

## What We Are Building

wedin.ai is an AI-powered wedding music planning companion. The tagline is: **Start with the music.**

It solves a real problem: couples can't articulate what they want musically, planners waste hours drawing it out, and acts receive useless briefs. wedin.ai runs a guided discovery session, generates a music portrait, then walks couples through a moment-by-moment deep-dive that auto-assembles a written brief for the planner and the acts.

The founder is Rus Nerwich — CEO of The Ear Academy (SA EdTech). He ran Tones of Note, a music booking agency that worked 100+ weddings. He is non-technical but highly commercially minded. Build sessions should produce working, shippable output — not architecture discussions.

---

## Current Build Status

**Phase:** Phase 2 — actively in progress

**✓ DONE — built and working:**
- Discovery session — React app, 22 questions across 5 sections
- Two ceremony questions added — religious/cultural structure + ceremony feeling (chips)
- Couple name capture — entered on welcome screen, passes through to Moment Map
- Dynamic acknowledgements — followUp functions written for all 22 questions in questions.js (UI wiring still pending — see NOT YET BUILT)
- Claude API connected server-side via Netlify Function — music portrait generates from answers
- Music portrait screen — shows AI narrative + email capture
- Email capture UI — styled correctly, copy locked
- Supabase connected — sessions and contacts tables live, data storing correctly
- Netlify Functions — five functions live: generate-portrait, save-session, save-contact, create-checkout-session, verify-payment, generate-ceremony-summary
- All API keys secure — no browser exposure, all server-side
- Landing page — live at wedinai.github.io/wedin-ai
- Google Search Console verified
- Moment Map UI — wired into App.jsx, full flow working
- Moment Map overlay — bottom sheet (mobile) / right drawer (desktop) replaces inline panel
- Last Song card renders full width at bottom of Moment Map
- Stripe test integration — R999 ZAR payment flow working end to end, unlocks Moment Map
- Payment confirmation screen — "Setting up your music map…" shown on Stripe return, no flash to welcome screen
- Netlify deployment — live at wedin-ai-app.netlify.app
- CeremonyDeepDive — 8-step conversational flow with religious/cultural branching, AI summary, completion screen, live and working
- Ceremony knowledge base v2.0 — tradition-aware system prompt embedded in generate-ceremony-summary covering Jewish (Orthodox/Conservative/Reform), Muslim (inc. Cape Malay), Hindu (Tamil + North Indian/Gujarati), Catholic, Greek Orthodox, Protestant denominations (Anglican/Methodist/Baptist/Pentecostal), NG Kerk, Interfaith
- Resend email — Netlify function built and wired (not yet confirmed delivered — needs account setup)

**✗ NOT YET BUILT:**
- Dynamic acknowledgements UI wiring — replace `getAcknowledgement` in DiscoverySession.jsx with `question.followUp?.(answer)`
- Ceremony faith tradition sub-flows — tradition-specific branching questions for Jewish, Muslim (inc. Cape Malay), Hindu, Catholic, Greek Orthodox, Protestant denominations, NG Kerk not yet built into CeremonyDeepDive
- Resend email — code wired but not confirmed delivered; needs Resend account, RESEND_API_KEY, verified domain
- Stripe live mode — swap test keys for live keys when ready to charge real money
- Pre-drinks deep-dive session — Phase 2
- First Dance deep-dive session — Phase 2
- Remaining 6 moment deep-dives — Guest Arrivals, Your Entrance, Dinner, Speeches, Dancing, Last Song
- Music Intelligence Layer — Phase 2, after first 3 deep-dives complete
- Brief assembly engine — Phase 2, after MIL
- Spotify + Apple Music APIs — Phase 2

**Next build priority:**
1. Dynamic acknowledgements UI wiring — DiscoverySession.jsx
2. Ceremony faith tradition sub-flows — Jewish, Muslim/Cape Malay, Hindu, Catholic, Orthodox, Protestant, NG Kerk
3. Pre-drinks deep-dive session
4. First Dance deep-dive session
5. Resend email setup

---

## Locked Tech Stack

| Layer | Decision |
|-------|----------|
| Frontend | React + Tailwind CSS, Vite |
| AI | Claude API — `claude-sonnet-4-6` |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Hosting | Netlify |
| Payments | Stripe (Phase 1.5) |
| Music APIs | Spotify + Apple Music (Phase 2) |
| Version control | GitHub — wedinai/wedin-ai |

Do not suggest alternatives to any of these. They are locked.

---

## Brand — Non-Negotiables

**Colours:**
- Cream `#FAF7F2` — primary background
- Navy `#1C2B3A` — text, buttons, structure
- Gold `#C4922A` — accent only, one use per screen maximum
- Warm Grey `#6B6560` — secondary text
- White `#FFFFFF` — card surfaces

**Fonts:**
- Cormorant Garamond — display, headlines, questions
- DM Sans — body, UI labels, buttons

**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap
```

**CSS Variables (use these everywhere):**
```css
--cream: #FAF7F2;
--navy: #1C2B3A;
--gold: #C4922A;
--grey: #6B6560;
--white: #FFFFFF;
```

---

## UI Non-Negotiables

- Mobile-first — build for 375px first, desktop is the enhancement
- One dominant element per screen
- One primary action per screen
- 8px minimum border radius on all interactive elements
- 44px minimum tap targets
- 8-point spacing grid — all spacing multiples of 8px
- Gold focus ring on inputs: `0 0 0 3px rgba(196,146,42,0.12)`
- Progress bar: 3px, navy-to-gold gradient
- No Inter or Roboto as primary font
- No purple gradients
- No confetti or excessive celebration animations
- No dark patterns
- Account creation AFTER music portrait reveal — never before
- Payment triggered from Moment Map screen — never before the couple has seen their map

---

## Security Rules — Always Apply

- Never put sensitive API keys in browser code
- No `VITE_` prefix on: `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_` prefix allowed only for: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- All sensitive keys go in `.env.local` (never committed) and Netlify environment variables
- Verify `.env.local` is in `.gitignore` before every push
- Supabase RLS enabled on all tables from creation
- All writes to Supabase go through Netlify Functions, not browser

---

## File Structure

```
~/Desktop/wedin.ai/          — React app (the product)
~/Desktop/wedin-landing/     — Static landing page (GitHub Pages)

wedin.ai/
  src/
    components/
      DiscoverySession.jsx   — discovery session orchestrator
      WelcomeScreen.jsx
      ProgressBar.jsx
      TextQuestion.jsx
      ChipsQuestion.jsx
      ScaleQuestion.jsx
      Acknowledgement.jsx
      CompletionScreen.jsx
      MusicPortrait.jsx      — portrait + email capture
      MomentMap.jsx          — Phase 1.5, built and wired
      CeremonyDeepDive.jsx   — Phase 2, built and live
    data/
      questions.js           — 22 questions, 5 sections, all with followUp functions
      ceremonyKnowledge.js   — ceremony music knowledge base v2.0, system prompt context
    App.jsx
    index.css
  netlify/
    functions/
      generate-portrait.js
      save-session.js
      save-contact.js
      create-checkout-session.js
      verify-payment.js
      generate-ceremony-summary.js
  netlify.toml
```

---

## Phase Plan

### Phase 1 — MVP Core
1. ~~Conversational discovery session~~ DONE
2. ~~Claude API music portrait~~ DONE
3. ~~Supabase — sessions and contacts tables~~ DONE
4. ~~Netlify deployment~~ DONE
5. Resend email sending — pending account setup (not blocking)

### Phase 1.5 — Moment Map + Payment
1. ~~Moment Map UI~~ DONE
2. ~~Stripe integration~~ DONE — R999 ZAR, test mode
3. ~~Payment confirmation screen~~ DONE
4. ~~Moment Map overlay~~ DONE
5. Resend email — pending

### Phase 2 — Deep-Dive Sessions (IN PROGRESS)
1. ~~Ceremony deep-dive~~ DONE — 8 steps, AI summary, knowledge base embedded
2. Ceremony faith tradition sub-flows — IN PROGRESS
3. Dynamic acknowledgements UI wiring — NEXT
4. Pre-drinks deep-dive — NEXT
5. First Dance deep-dive — NEXT
6. Remaining 6 moments — Guest Arrivals, Your Entrance, Dinner, Speeches, Dancing, Last Song
7. Music Intelligence Layer — after first 3 deep-dives complete
8. Brief assembly engine — after MIL
9. Brief delivered to couple + planner via Resend

### Phase 3 — Marketplace (post-revenue)
- Curated artist directory
- Direct booking
- Couple reviews
- Planner dashboard
- Band-matched landing pages (5 versions)
- Referral mechanism (10% rebate)
- Spotify + Apple Music playlist integration

---

## Product Architecture — Three Flows

**Flow 1: Discovery (free)**
Welcome → 22 questions → Music portrait → Email capture → Moment Map preview

**Flow 2: Moment Map (post-email, pre-payment)**
Full Moment Map revealed → Each moment shown as locked → Payment CTA → Stripe → Payment confirmation screen → Moment Map unlocked

**Flow 3: Deep-Dive (paid)**
One conversation per moment → AI summary generated → Music Intelligence Layer processes → Brief section assembles → Full brief generated

---

## The Moment Map — 9 Standard Moments

1. Guest Arrivals — "The first musical impression of the day"
2. Ceremony — "The moment everyone watches in silence"
3. Pre-drinks — "Where the day's energy is set"
4. Your Entrance — "The transition into the reception"
5. Dinner — "90 minutes that carry the evening forward"
6. Speeches — "Where personalisation lives"
7. First Dance — "Your first 3 minutes as a married couple"
8. Dancing — "The arc that guests remember most"
9. Last Song — "The emotional punctuation mark of the day" (renders full width)

**Optional moments (appear only if flagged in discovery):**
- Cultural Moment / Traditional Ceremony
- Cool-down / Wind-down
- Day-after event

---

## Ceremony Deep-Dive — Architecture

**Standard flow (secular couples): 7 questions**
1. Ceremony structure (chips) — fully religious / blend / cultural / secular / other
2. Processional song (text)
3. Processional tone (chips) — sacred and still / joyful / warm / unexpected
4. Signing music (text)
5. Recessional song (text)
6. Live or recorded (chips)
7. Officiant requirements (chips)

**Religious/cultural branching: +1 question**
If ceremony_structure = "Fully religious" or "Blend of religious and personal":
- Faith tradition (chips with Other) — Christian / Jewish / Muslim / Hindu / Afrikaans Reformed / Catholic / Greek Orthodox / Interfaith / Other

**Tradition sub-flows (NOT YET BUILT): +2 questions per tradition**
Each faith selection triggers 2 targeted questions drawing from the ceremony knowledge base. These are the next build priority after acknowledgements wiring.

**AI summary:** Generated via Claude API after all steps complete. System prompt includes full ceremony knowledge base v2.0. Summary is tradition-aware, flags planning gaps, feeds into the planner brief.

---

## Ceremony Knowledge Base — What It Covers

`src/data/ceremonyKnowledge.js` — embedded as system prompt in generate-ceremony-summary.js

Covers with full musical structure, common mistakes, and planner requirements for:
- Jewish (Orthodox / Conservative / Reform distinctions, 8 music moments, Yichud, Hora, Wagner avoidance)
- Muslim (Nikah permissibility, Baraat, Zaffe, Walima, Cape Malay specific — Die Afhaal, Salawaat, Rosa, Nagaul)
- Hindu (Tamil vs North Indian/Gujarati, Sangeet, Baraat, Varmala, Pheras, Kanyadaan, Vidaai)
- Catholic (full Mass vs Rite of Marriage, required sung elements, Ave Maria moment)
- Greek/Eastern Orthodox (a cappella only, no instruments, Crowning, Dance of Isaiah)
- Protestant (Anglican / Methodist / Baptist / Pentecostal distinctions)
- Afrikaans Reformed NG Kerk (Liedboek, dominee control, ceremony vs reception as separate worlds)
- Interfaith (Wagner/Mendelssohn cautions, structural approaches, neutral music options)
- Cross-cutting (prelude, seating of parents/grandmothers, register signing, rehearsal requirements)

---

## Music Intelligence Layer — What It Does

Runs after every completed deep-dive moment. Active from first paid session.

**Input:** couple's emotional intent + discovery portrait + budget + band classification + cultural flags from knowledge base

**Output:** act recommendation + reasoning + budget reality + hidden cost disclosure + brief section content

**Governing principle:** Emotional fidelity on any budget. A R15,000 DJ with a precise brief gets closer to the couple's dream than a R80,000 band with no brief.

**Hidden costs to always surface:** stage hire (R8–18k), PA and sound engineer (R15–45k), generator if needed (R8–20k).

---

## Product Principles — Apply to Every Decision

**Emotional fidelity on any budget.** The discovery session reveals what a couple truly wants — not a band or DJ, but a feeling. The Music Intelligence Layer finds the most direct path to that feeling within available budget.

**The brief is the equaliser.** Quality of output is determined by clarity of intention, not size of spend.

**Tradition-aware intelligence.** wedin.ai responds as a knowledgeable specialist in every religious and cultural wedding tradition active in the SA market. A Jewish couple should feel like they're talking to someone who has worked 50 Jewish weddings. Same for every tradition. Every AI output for ceremony moments draws from the ceremony knowledge base.

**Account creation after value.** The music portrait is shown before the email is requested. Always.

**Payment after the Moment Map.** The couple sees all 9 moments before they pay. They pay to unlock the conversations that complete them.

**One question at a time.** The discovery session and every deep-dive session are conversations, not forms.

**Save progress automatically.** Every answer saved as it's given. Closing and returning never loses work.

**Acknowledgements must feel earned.** Every response to a couple's answer should reflect what they actually said — never generic, never the same for every answer. If it could apply to anyone, it applies to no one.

---

## What NOT to Build Without Asking

- The brief generator before at least 3 deep-dive sessions are built
- Alternative tech stack choices
- Freemium or free tier pricing
- Account creation before the portrait reveal
- Payment before the Moment Map is shown
- Any feature not in the phase plan
- Tradition sub-flows without the knowledge base being embedded first (it is — do not rebuild it)

---

## Key Contacts (for context only)

- Vee — Petals Group (vee@petalsgroup.co.za) — validation call done, positive response
- Amy York (amy@amyyorkevents.co.za) — outreach sent
- Inda (inda@ohsoprettyplanning.co.za) — outreach sent
- Nicola (nicola@nicolajane.co.za) — outreach sent
- Elanit (elanit@sistersact.co.za) — outreach sent
- Gail (gail@pieceofcake.co.za) — outreach sent
- Anne Mann (anne@annemann.co.za) — destination wedding specialist — approach after more planner calls
- Wedding Concepts — approach after more planner calls
- Colin Cowie — US market opener — approach post-SA launch with numbers
