# wedin.ai — Claude Code Context

Read this file at the start of every session. Do not ask Rus to re-explain anything documented here.

---

## What We Are Building

wedin.ai is an AI-powered wedding music planning companion. The tagline is: **Start with the music.**

It solves a real problem: couples can't articulate what they want musically, planners waste hours drawing it out, and acts receive useless briefs. wedin.ai runs a guided discovery session, generates a music portrait, then walks couples through a moment-by-moment deep-dive that auto-assembles a written brief for the planner and the acts.

The founder is Rus Nerwich — CEO of The Ear Academy (SA EdTech). He ran Tones of Note, a music booking agency that worked 100+ weddings. He is non-technical but highly commercially minded. Build sessions should produce working, shippable output — not architecture discussions.

---

## Current Build Status

**Phase:** Phase 1.5

**✓ DONE — Phase 1 complete:**
- Discovery session — React app, 22 questions across 5 sections
- Two ceremony questions added — religious/cultural structure + ceremony feeling (chips)
- Couple name capture — entered on welcome screen, passes through to Moment Map
- Claude API connected server-side via Netlify Function — music portrait generates from answers
- Music portrait screen — shows AI narrative + email capture
- Email capture UI — styled correctly, copy locked
- Supabase connected — sessions and contacts tables live, data storing correctly
- Netlify Functions — five functions live (generate-portrait, save-session, save-contact, create-checkout-session, verify-payment)
- All API keys secure — no browser exposure, all server-side
- Landing page — live at wedinai.github.io/wedin-ai
- Google Search Console verified
- Moment Map UI — wired into App.jsx, full flow working
- Last Song card renders full width at bottom of Moment Map
- Stripe Checkout integration — wired to Moment Map unlock CTA
- Netlify deployment — live at wedin-ai-app.netlify.app
- Moment Map overlay — bottom sheet (mobile) / right drawer (desktop) replaces inline panel

**✗ NOT YET BUILT:**
- Resend email sending — code built, awaiting Resend account + RESEND_API_KEY + verified domain
- Deep-dive sessions — Phase 2 (start with Ceremony, then Pre-drinks, First Dance)
- Music Intelligence Layer — Phase 2
- Brief assembly engine — Phase 2
- Spotify + Apple Music APIs — Phase 2

**Next build priority:**
1. Resend setup — create account, verify domain, add RESEND_API_KEY to Netlify env vars
2. Ceremony deep-dive session — first Phase 2 paid moment

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
    data/
      questions.js           — 22 questions, 5 sections
    App.jsx
    index.css
  netlify/
    functions/               — three functions live (running locally)
  netlify.toml
```

---

## Phase Plan

### Phase 1 — MVP Core
1. ~~Conversational discovery session~~ DONE
2. ~~Claude API music portrait~~ DONE
3. ~~Supabase — sessions and contacts tables~~ DONE
4. Netlify deployment — TODO
5. Resend email sending — TODO (deprioritised until Moment Map is live)

### Phase 1.5 — Moment Map + Payment (CURRENT PRIORITY)
1. **Moment Map UI** — horizontal visual timeline of 8–9 musical moments
   - Each moment: name, one-line purpose, status chip (not started / in progress / complete)
   - Personalised from discovery session — cultural moments appear only if flagged
   - Teaser: "Your music plan covers [X] moments. Complete each one to build your full brief."
   - This screen triggers payment — couple sees the value before they pay
2. **Stripe integration** — payment unlocks the deep-dive sessions
3. **Resend email** — music portrait delivered to couple's inbox after saving

### Phase 2 — Deep-Dive Sessions (paid)
- One focused conversation per moment — 9 standard moments + optional cultural/transition moments
- Each moment: Educate (one sentence) → Ask (2–4 questions) → Music Intelligence Layer output
- Recommended sequence: Ceremony → Pre-drinks → First Dance (start here, then remaining 6)
- Framing: "We suggest this order — it follows the emotional arc. But it's your day."
- Music Intelligence Layer: act recommendation + budget reality + hidden cost disclosure per moment
- Brief assembly engine: auto-compiles completed moments → PDF brief
- Brief delivered to couple + planner via Resend

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
Welcome → 22 questions → Music portrait → Email capture → Moment Map preview (teased)

**Flow 2: Moment Map (post-email, pre-payment)**
Full Moment Map revealed → Each moment shown as locked → Payment CTA → Stripe

**Flow 3: Deep-Dive (paid)**
One conversation per moment → Music Intelligence Layer processes → Brief section assembles → Full brief generated

---

## The Moment Map — Build Spec

The Moment Map is the most important screen to build next. It is the product's primary conversion mechanism.

**9 standard moments (always shown):**
1. Guest Arrivals — "The first musical impression of the day"
2. Ceremony — "The moment everyone watches in silence"
3. Pre-drinks — "Where the day's energy is set"
4. Your Entrance — "The transition into the reception"
5. Dinner — "90 minutes that carry the evening forward"
6. Speeches — "Where personalisation lives"
7. First Dance — "Your first 3 minutes as a married couple"
8. Dancing — "The arc that guests remember most"
9. Last Song — "The emotional punctuation mark of the day"

**Optional moments (appear only if flagged in discovery):**
- Cultural Moment / Traditional Ceremony
- Cool-down / Wind-down
- Day-after event

**UI requirements:**
- Horizontal scroll on mobile, full width on desktop
- Each moment is a card with: number, name, one-line description, status chip
- Status chips: "Not started" (grey) → "In progress" (gold) → "Complete" (navy)
- Locked state (pre-payment): all chips show "Not started", CTA button prominent
- Progress indicator: "0 of 9 moments complete"
- One primary action: "Unlock your music plan — [price]"

---

## Music Intelligence Layer — What It Does

Runs after every completed deep-dive moment. Not a Phase 2 feature — active from first paid session.

**Input:** couple's emotional intent for this moment + discovery portrait + budget + band classification + cultural flags

**Output:** act recommendation + reasoning + budget reality + hidden cost disclosure + brief section content

**Governing principle:** Emotional fidelity on any budget. A R15,000 DJ with a precise brief gets closer to the couple's dream than a R80,000 band with no brief.

**Hidden costs to always surface:** stage hire (R8–18k), PA and sound engineer (R15–45k), generator if needed (R8–20k). These are separate from act fees and are frequently not disclosed at quote stage.

---

## Product Principles — Apply to Every Decision

**Emotional fidelity on any budget.** The discovery session reveals what a couple truly wants — not a band or DJ, but a feeling. The Music Intelligence Layer finds the most direct path to that feeling within available budget.

**The brief is the equaliser.** Quality of output is determined by clarity of intention, not size of spend.

**Account creation after value.** The music portrait is shown before the email is requested. Always.

**Payment after the Moment Map.** The couple sees all 9 moments before they pay. They pay to unlock the conversations that complete them.

**One question at a time.** The discovery session and every deep-dive session are conversations, not forms.

**Save progress automatically.** Every answer saved as it's given. Closing and returning never loses work.

---

## What NOT to Build Without Asking

- Anything in Phase 2 or 3 while Phase 1.5 is incomplete
- The brief generator before at least 3 deep-dive sessions are built
- Alternative tech stack choices
- Freemium or free tier pricing
- Account creation before the portrait reveal
- Payment before the Moment Map is shown
- Any feature not in the phase plan

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
