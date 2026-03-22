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
- Dynamic acknowledgements — followUp functions wired into DiscoverySession.jsx, replace getAcknowledgement confirmed
- Ceremony faith tradition sub-flows — Jewish, Muslim/Cape Malay, Hindu, Catholic, Greek Orthodox, Protestant (with conditional sub-denomination Q2), NG Kerk, Interfaith — live and working
- Resend email — fully live, hello@wedin.ai verified and delivering, RESEND_API_KEY in Netlify
- GuestArrivalsDeepDive — 3-question linear flow, momentAnswers.guestArrivals state, wired into App.jsx and MomentMap.jsx
- PreDrinksDeepDive — 4-question flow with conditional presence context note, momentAnswers.predrinks state, wired into App.jsx and MomentMap.jsx
- EntranceDeepDive — 3-question flow with conditional transition note, momentAnswers.entrance, live
- FirstDanceDeepDive — 6-question flow with additional dances branch, dynamic step counter, momentAnswers.firstDance, live
- DinnerDeepDive — 4-question linear flow with conditional live music note, momentAnswers.dinner, live
- SpeechesDeepDive — 5-question flow with intro songs branch, dynamic step counter, momentAnswers.speeches, live
- DancingDeepDive — 5-question flow with avoidance branch, dynamic step counter, momentAnswers.dancing, live
- LastSongDeepDive — 3-question linear flow, custom completion screen, momentAnswers.lastSong, live
- Session restore — localStorage persistence of sessionId, sessionAnswers, portrait; URL parameter restore; return link in email carries session ID
- Email updated — portrait in gold-bordered block, Moment Map explanation, R699 pricing, CTA links directly to Moment Map
- momentAnswers state — all 9 moments saving to named objects, ready for brief assembly engine
- Brief assembly engine — generate-brief.js Netlify function, single Claude API call, Haiku model, generates couple brief and coordinator brief, live and working
- BriefScreen.jsx — two-tab brief display, copy to clipboard, wired into App.jsx
- momentAnswers.ceremony — fixed, now correctly saved alongside all other moments
- localStorage persistence — completedMoments and momentAnswers persisted, session fully restores on refresh or return visit

**✗ NOT YET BUILT:**
- Music Intelligence Layer — runs after brief is generated, asks budget + existing bookings, generates act recommendations per moment with reasoning and budget ranges
- Coordinator brief — generated only after MIL decisions are confirmed, not before
- Couple brief post-brief screen — "Your music portrait is complete" screen with MIL CTA
- Diagnostic console.log lines — remove from generate-brief.js before launch
- "Plan this moment" button styling — regression fix on MomentMap overlay
- Copy audit — full product copy review against brand voice and conversion copy skills
- Stripe live mode
- Spotify + Apple Music APIs — Phase 2

**Next build priorities:**
1. Remove diagnostic console.log lines from generate-brief.js
2. Fix "Plan this moment" button styling regression on MomentMap overlay
3. Post-brief screen — "Your music portrait is complete" with MIL CTA
4. Music Intelligence Layer — generate-mil.js, budget + booking questions, per-moment act recommendations
5. Coordinator brief — generated after MIL decisions confirmed
6. Copy audit — full product review session
7. Stripe live mode
8. Spotify + Apple Music APIs

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
      GuestArrivalsDeepDive.jsx
      PreDrinksDeepDive.jsx
      EntranceDeepDive.jsx
      FirstDanceDeepDive.jsx
      DinnerDeepDive.jsx
      SpeechesDeepDive.jsx
      DancingDeepDive.jsx
      LastSongDeepDive.jsx
      BriefScreen.jsx        — two-tab brief display, copy to clipboard
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
1. ~~Ceremony deep-dive~~ DONE
2. ~~Ceremony faith tradition sub-flows~~ DONE
3. ~~Dynamic acknowledgements UI wiring~~ DONE
4. ~~Guest Arrivals deep-dive~~ DONE
5. ~~Pre-drinks deep-dive~~ DONE
6. ~~Your Entrance deep-dive~~ DONE
7. ~~First Dance deep-dive~~ DONE
8. ~~Dinner deep-dive~~ DONE
9. ~~Speeches deep-dive~~ DONE
10. ~~Dancing deep-dive~~ DONE
11. ~~Last Song deep-dive~~ DONE
12. ~~Brief assembly engine~~ DONE
13. Post-brief screen + MIL CTA — NEXT
14. Music Intelligence Layer
15. Coordinator brief — after MIL
16. Copy audit

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

## The Two Brief Outputs

wedin.ai produces two distinct documents from the brief assembly engine. They serve different people and different purposes.

**The Couple's Brief — The Emotional Mirror**
The couple's brief reflects their own clarity back to them, more articulately than they could have expressed it themselves. Most couples arrive uncertain — they have feelings they can't name and taste they can't describe. The discovery session and deep-dives surface that clarity through questions that don't feel clinical. The brief then organises it into something that makes them think: "yes, that's exactly us — how did it know that?"

This is not a planning document. It is a mirror. It validates that they know who they are and what they want. That emotional experience is what gets shared, recommended, and remembered.

wedin.ai surfaces a clarity the couple didn't know they had — and reflects it back to them more clearly than they could have expressed it themselves.

**The Coordinator's Brief — The Operational Document**
The coordinator's brief is built for a professional working fast. Every moment section ends with a specific operational instruction. It saves the coordinator 45 minutes of music discovery calls and makes her look good to the couple by demonstrating she received a professional, detailed handover.

This document is what makes planners want to recommend wedin.ai to every couple they work with.

**Consistency across both documents**
Both briefs are generated in a single AI call — one system prompt, all completed moment answers, full discovery portrait. This ensures consistent language, tone, and voice across all 9 moments. Deep-dive sessions save answers to momentAnswers state (one named object per moment) specifically to support this single-pass generation.

---

## Brief Output Architecture

The brief is generated in two stages. Do not collapse these into one.

**Stage 1 — The Couple's Brief (built)**
Generated immediately after all moments are complete. Reflects the couple's emotional intent back to them. Does not make act or budget recommendations — that is not its job. The couple reads it and thinks "yes, that's exactly us."

Shown to the couple immediately. Coordinator brief is NOT sent at this stage.

**Stage 2 — Music Intelligence Layer (not yet built)**
Runs after the couple has reviewed their brief. Asks two practical questions:
- What is your total music budget?
- Have you already booked any acts?

Then generates per-moment recommendations: act type, specific reasoning tied to their answers, budget range, hidden costs (stage, PA, sound engineer, travel).

Only after the couple confirms or adjusts these recommendations is the coordinator brief generated and sent.

**Why this sequencing matters:**
A coordinator brief sent before decisions are made is worse than no brief — it creates confusion and makes the product look unfinished. The coordinator brief is a confirmed plan, not a set of possibilities.

**Coordinator brief triggers:**
- Couple clicks "Send to my coordinator" after reviewing MIL recommendations
- Or couple explicitly requests it from the brief screen
- Never automatically generated or sent without couple confirmation

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
