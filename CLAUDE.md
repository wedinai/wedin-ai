# wedin.ai — Claude Code Context

Read this file at the start of every session. Do not ask Rus to re-explain anything documented here.

---

## Git Rules — Non-Negotiable

- All commits go directly to **main**
- Never create feature branches
- Netlify deploys from main only — any other branch will not deploy
- Always run: `git push origin main`
- Confirm deployment on wedin-ai-app.netlify.app after every push — never assume it worked

---

## What We Are Building

wedin.ai is an AI-powered wedding music planning companion. The tagline is: **Start with the music.**

It solves a real problem: couples can't articulate what they want musically, planners waste hours drawing it out, and acts receive useless briefs. wedin.ai runs a guided discovery session, generates a music portrait, then walks couples through a moment-by-moment deep-dive that auto-assembles a written brief for the planner and the acts.

The founder is Rus Nerwich — CEO of The Ear Academy (SA EdTech). He ran Tones of Note, a music booking agency that worked 100+ weddings. He is non-technical but highly commercially minded. Build sessions should produce working, shippable output — not architecture discussions.

---

## The Seven-Stage Product Model

The product is a series of conversations, each unlocking the next. This architecture is locked. Do not compress stages or combine outputs without explicit instruction.

**Stage 1 — Musical Identity** ✓ BUILT
Discovery session + music portrait. Gate: email capture (portrait revealed first, email asked second — always).

**Stage 2 — Moment by Moment** (~75% built)
Payment gate → nine moment deep-dives (with song question per moment) → confirmation flow. Gate: payment (R699). Couple pays before accessing the Moment Map. This is the current architecture and it is correct.

**Stage 3 — Music Education Layer** (PARTIALLY BUILT)
Education cards live as collapsed dropdowns under each confirmed moment 
on the Moment Map — warm, specific to the couple's answers, generated 
per moment. Tap to expand. No gate currently in place.
Not yet built: MEL summary screen — a single synthesised paragraph 
appearing after all 9 moments confirmed and before MILIntakeScreen, 
replacing the per-card gate. New component MELSummaryScreen.jsx + 
generate-mel-summary.js (claude-sonnet-4-6). See Session 7 in 
wedin-build-plan-april-17.md.

**Stage 4 — The Emotional Music Plan** (EXISTS — needs rebalancing)
MIL output, reweighted to 30% recommendation / 70% brief instruction. No costs. No booking logistics. The recommendation tells the couple what direction to go. The brief instruction tells their act how to execute it on the night. Gate: reading and confirmation → Stage 5 unlocks.

**Stage 5 — Practical Guidance** (EXISTS inside MIL — needs separation)
Costs, booking lead times, five vetting questions per live act, booking sequence. Rendered separately from Stage 4 so the couple absorbs the emotional plan before they think about logistics. Gate: Stage 4 confirmation → unlocks automatically.

**Stage 6 — Coordinator Brief** ✓ BUILT (timing adjustment needed)
Assembled from confirmed moment summaries and emotional music plan. Second person to coordinator. Operational and verb-led. Should finalise only after couple confirms Stage 4.

**Stage 7 — Artist Brief** (NOT BUILT)
Per-act brief documents — specific instructions for each booked act (DJ, band, string quartet). Generated from confirmed moment summaries, music plan, and production notes. Includes vetting questions as pre-booking checklist. Pricing model (included in R699 vs separate) to be decided post-launch.

---

## BriefScreen.jsx — Tab Structure

Current tabs: Music Plan | How to Book | Coordinator Brief ✓ BUILT

Music Plan tab: MIL output with `cost` field suppressed. Built.
How to Book tab: same MIL JSON, `cost` field rendered, act-specific 
vetting questions per moment. Built.
Coordinator Brief tab: generate-brief-b.js output. Built.

Pending Session 8: coordinator_profile variable wired into 
generate-brief-b.js to calibrate brief language and structure per 
coordinator type (professional / venue / volunteer).

---

## Current Build Status — April 2026

**Phase:** Phase 2 — in progress. Launch timeline extended to complete all seven stages.

**Real user testing completed:**
- Zach & Julia — March 25, 2026. Positive, no specific feedback.
- Sasha — March 26, 2026. Full feedback captured, most items resolved (see below).
- Anonymous couple — March 26, 2026 evening. Self-directed, output quality strong.
- Test user (April 2026): Spotify integration cited as the difference between willingness to pay and not. Songs per moment are ground truth that makes recommendations specific rather than theoretical.

**Sasha feedback — status:**
"Other" on chips ✓, unfamiliar terms ✓, person consistency ✓, wedding vibe overview ✓, discovery questions feeding MIL ✓. Save state → session persistence build (pending). Ceremony output → MIL ceremony gap fix (pending). Section-level brief regeneration, brief accuracy score, optional moments → deferred post-launch.

---

## ✓ DONE — Built and Working

- Discovery session — React app, 24 questions across 5 sections
- Music identity questions — home_listening, musical_confidence, crowd_vs_taste, live_vs_recorded, stop_and_look, guilty_pleasure
- conditionalEducate pattern — gold border block shown after followUp for specific answers
- "Other — tell us more" chip option — all chip questions across discovery session and all 9 deep-dives
- Two ceremony questions — religious/cultural structure + ceremony feeling
- Couple name capture — welcome screen, passes through to Moment Map
- Dynamic acknowledgements — followUp functions wired into DiscoverySession.jsx
- Claude API connected server-side — music portrait generates from answers
- Portrait hallucination fix — session boundary instruction, no-invention rule in generate-portrait.js
- Music portrait screen — four states: loading / portrait revealed + email capture / email saved / error
- Supabase connected — sessions and contacts tables live
- Netlify Functions — ten functions live: generate-portrait, save-session, save-contact, create-checkout-session, verify-payment, generate-ceremony-summary, generate-brief-a, generate-brief-b, generate-mil-a, generate-mil-b
- All API keys secure — no browser exposure, all server-side
- Landing page — live at wedinai.github.io/wedin-ai
- Google Search Console verified
- Moment Map UI — white card + gold left border CTA block at top, back link to portrait wired
- Brief generation — generate-brief-a.js + generate-brief-b.js, parallel Promise.all, AbortController prevents 504
- BriefScreen.jsx — three tabs, copy to clipboard on all three tabs
- Brief person consistency — couple's brief 2nd person to couple, coordinator's brief 2nd person to coordinator
- Brief overview paragraph — two sentences from three_words, home_listening, crowd_vs_taste, what_guests_say
- PostBriefScreen.jsx — post-brief screen with MIL CTA
- MIL — generate-mil-a.js (moments 1–5) + generate-mil-b.js (moments 6–9 + production check), parallel, JSON output
- MIL system prompt — full SA market knowledge base, 17 active rules + 10 framework rules pending
- All 9 deep-dives live with momentAnswers persistence
- Ceremony deep-dive — faith tradition sub-flows, AI summary wired and generating on completion
- Ceremony summary — second person to couple, warm voice, three tone consistency instructions deployed
- Inline term explanations — pre-drinks, recessional, processional
- Session restore — localStorage persistence of all state including milRecommendations
- Email — portrait in gold-bordered block, R699 pricing, CTA links to Moment Map, Resend confirmed delivering
- Stripe test integration — R999 ZAR, unlocks Moment Map
- T&Cs and Privacy Policy — drafted, ready to implement
- ceremonyKnowledge.js — updated to v3.0, April 4. Nine traditions fully documented.
- Four MIL copy quality rules added April 2: banned "Deploy", no band classification language, coordinator plain language, no hardcoded guest counts
- MIL JSON truncation fix — max_tokens raised to 1800 (mil-a) / 2000 (mil-b), sanitiseMILResponse replaced with walk-backward loop repair
- Entrance live act rule — hard prohibition (MUST / PROHIBITED), explicit keyword enumeration, dinner-invention loophole closed
- Production check coherence rule — explicit prohibition on inventing acts not in couple's stated answers
- Outdoor amplification rule — verbatim sentence enforcement, paraphrase escape hatch closed
- First dance song ground truth rule — FIRST DANCE SONG GROUND TRUTH instruction added, formatAnswers label renamed to 'Chosen first dance song — ground truth'
- PreDrinksDeepDive + EntranceDeepDive — song question text input render block added (was rendering chips only)
- wedin-test-scenarios.md — five test scenario seed scripts + RESET script, committed to repo
- Email restore link — ?email= query parameter in portrait email, App.jsx triggers restore on load. Built and live.
- Copy audit — banned words removed across all UI copy. Session 6 complete.
- BriefScreen restructure — cost suppressed in Music Plan tab, How to Book tab live with costs and vetting questions. Session 8 complete.
- Music Education Layer — education cards live per moment before recommendations. Session 7 complete.

---

## ✗ NOT YET BUILT — Remaining Before Launch

- Remarketing email — Supabase query: email present + no milComplete 
  flag + created_at older than 24 hours → one Resend email re-showing 
  portrait block with restore link CTA
- Music Plan email — button on BriefScreen Music Plan tab, sends 
  content to couple via Resend
- Coordinator Brief email — couple inputs coordinator address, sent 
  directly via Resend
- MEL summary screen — new component MELSummaryScreen.jsx + new 
  function generate-mel-summary.js (claude-sonnet-4-6). Appears after 
  all 9 moments confirmed, before MILIntakeScreen. Single synthesised 
  paragraph, one confirm button, email button with restore link.
- Coordinator profile question — new chip on MILIntakeScreen: "Who 
  will be coordinating the music on the day?" Values: professional / 
  venue / volunteer. Key: coordinator_profile. Default: venue.
- generate-brief-b.js coordinator profile calibration — accepts 
  coordinator_profile, calibrates language register, structure, and 
  cue language per wedin-planner-brief-SKILL-v5.md. No clock times 
  in any output — duration and sequence only.
- Artist Brief (Stage 7) — generate-artist-brief-dj.js + 
  generate-artist-brief-band.js + generate-artist-brief-other.js + 
  ArtistBriefScreen.jsx. Included in R699. coordinator_profile passes 
  into all three functions.
- MIL output rebalancing — 30% recommendation / 70% brief instruction. 
  Caution protocol: Part A review in Claude.ai before any code opens. 
  One rule at a time. Three scenario tests after each change.
- PayFast integration — replace create-checkout-session.js and 
  verify-payment.js. Webhook signature verification. Rate limiting. 
  Supabase RLS audit. Data deletion (POPIA). Merchant account for 
  Tones of Note PTY (Ltd) must be live before this session.
- Pre-launch QA — full flow on real mobile. All 9 moments, all 7 
  stages, real payment, all email flows, session restore from different 
  device. Remove all diagnostic console.log lines.

---

## Spotify Integration — Architecture & Known Issues

**Status:** Complete and live as of April 2026.

**Critical endpoint fix:** Use `/v1/playlists/{id}/items` NOT `/v1/playlists/{id}/tracks`. The `/tracks` endpoint is deprecated for new Spotify apps created after November 2024 and returns 403 Forbidden with no useful error detail.

**Auth script:** `scripts/spotify-auth.js` — must include `show_dialog=true` in the auth URL or Spotify silently reuses old approval without showing scope changes. Both scopes required: `playlist-modify-public` and `playlist-modify-private`.

**How it works:** Playlists are created on the wedin.ai Spotify account. Couples receive a public shareable link. No couple login required. Playlist persists to localStorage and Supabase.

**Playlist accumulation:** Every session creates a new playlist on the wedin.ai Spotify account. Test playlists accumulate — clean up manually periodically. Consider prefixing test runs with `"TEST —"` in `coupleName` to identify them.

**Claude curation:** `generate-spotify-tracks.js` uses `claude-haiku-4-5-20251001`. Claude returns JSON wrapped in markdown fences despite instructions — fence stripping is implemented before `JSON.parse`. Secondary `[`/`]` boundary search included as fallback.

**Env vars required:**
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN` (re-issue if scopes change — use `show_dialog=true`)
- `SPOTIFY_USER_ID = [see Netlify environment variables]`

---

## Security — Pre-Launch Checklist

**API key security (verify not drifted):**
- No `VITE_` prefix on: `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_` prefix only for: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- All sensitive keys in `.env.local` (never committed) and Netlify environment variables

**Must build before launch:**
- Rate limiting on Netlify functions — prevent Claude API abuse
- Supabase RLS audit — verify row-level security enforced on sessions and contacts tables
- PayFast webhook signature verification — payment cannot be bypassed by spoofing webhook
- Data deletion mechanism — must honour POPIA erasure requests without manually querying Supabase

**Always:**
- Supabase RLS enabled on all tables
- All writes to Supabase through Netlify Functions, never from browser
- HTTPS automatic on Netlify

---

## Locked Tech Stack

| Layer | Decision |
|-------|----------|
| Frontend | React + Tailwind CSS, Vite |
| AI — brief + MIL | `claude-haiku-4-5-20251001` |
| AI — portrait + ceremony | `claude-sonnet-4-6` |
| Database | Supabase (PostgreSQL) |
| Email | Resend — hello@wedin.ai verified |
| Hosting | Netlify |
| Payments | PayFast — replacing Stripe. Stripe test mode currently live. |
| Music APIs | Spotify — building post-Stage 2 completion |
| Version control | GitHub — wedinai/wedin-ai |
| Legal entity | Tones of Note PTY (Ltd) |

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

**CSS Variables:**
```css
--cream: #FAF7F2;
--navy: #1C2B3A;
--gold: #C4922A;
--grey: #6B6560;
--white: #FFFFFF;
```

---

## UI Non-Negotiables

- Mobile-first — 375px first, desktop is the enhancement
- One dominant element per screen
- One primary action per screen
- 8px minimum border radius on all interactive elements
- 44px minimum tap targets
- 8-point spacing grid
- Gold focus ring: `0 0 0 3px rgba(196,146,42,0.12)`
- Progress bar: 3px, navy-to-gold gradient
- No Inter or Roboto as primary font
- No purple gradients, no confetti, no dark patterns
- Account creation AFTER portrait reveal — never before
- Payment triggered from Moment Map — couple pays before accessing deep-dives
- Conditional educate lines: `3px solid #C4922A`, background `rgba(196,146,42,0.06)`, DM Sans italic 14px, padding `16px 20px`, border radius `0 8px 8px 0`
- White card with gold left border: background `#FFFFFF`, `1px solid rgba(28,43,58,0.06)` border, `3px solid #C4922A` left border, `16px` radius

---

## File Structure

```
wedin.ai/
  src/
    components/
      DiscoverySession.jsx
      WelcomeScreen.jsx
      ProgressBar.jsx
      TextQuestion.jsx
      ChipsQuestion.jsx        — "Other — tell us more" pattern
      ScaleQuestion.jsx
      Acknowledgement.jsx
      CompletionScreen.jsx
      MusicPortrait.jsx        — four states, all copy updated
      MomentMap.jsx            — white card CTA at top, back link wired
      CeremonyDeepDive.jsx     — faith sub-flows, AI summary wired, Other pattern
      GuestArrivalsDeepDive.jsx
      PreDrinksDeepDive.jsx
      EntranceDeepDive.jsx
      FirstDanceDeepDive.jsx
      DinnerDeepDive.jsx
      SpeechesDeepDive.jsx
      DancingDeepDive.jsx
      LastSongDeepDive.jsx
      BriefScreen.jsx          — three tabs: Music Plan | How to Book | Coordinator Brief
      PostBriefScreen.jsx
      MILIntakeScreen.jsx
    data/
      questions.js             — 24 questions, Other on chip questions
      ceremonyKnowledge.js     — ceremony knowledge base v3.0 (April 4)
  App.jsx
  index.css
  netlify/
    functions/
      generate-portrait.js         — hallucination prevention, session boundary
      save-session.js
      save-contact.js              — Resend confirmed delivering
      create-checkout-session.js   — Stripe test (PayFast migration pending)
      verify-payment.js
      generate-ceremony-summary.js — second person, tone consistency rules deployed
      generate-brief-a.js          — couple's brief, overview, 2nd person to couple
      generate-brief-b.js          — coordinator's brief, 2nd person to coordinator, JSON repair fallback
      generate-mil-a.js            — moments 1–5, full SA knowledge base, JSON repair fallback, copy quality rules
      generate-mil-b.js            — moments 6–9 + production check, copy quality rules
  netlify.toml
```

---

## Phase Plan

### Phase 1 — MVP Core ✓ COMPLETE
### Phase 1.5 — Moment Map + Payment ✓ COMPLETE

### Phase 2 — Full Seven-Stage Product (IN PROGRESS)
See wedin-session-plan.md for complete session-by-session breakdown.

### Phase 3 — Marketplace (post-revenue)
- Curated artist directory, direct booking, couple reviews
- Planner dashboard
- Band-matched landing pages (5 versions)
- Referral mechanism (10% rebate)
- UK market adaptation
- Streaming MIL (collapse mil-a/b into single streaming function)
- PDF download

---

## Parallel Function Architecture Pattern

**Problem:** Netlify 26-second hard timeout. Claude API ~20 second time-to-first-token.

**Solution:** Two separate function files, parallel Promise.all calls, results combine client-side.

**Critical:** NEVER call the same endpoint twice — Netlify deduplicates concurrent POSTs to the same URL. Always use separate function files.

**Established in:** generate-brief-a/b.js and generate-mil-a/b.js

```js
const [res1, res2] = await Promise.all([
  fetch('/.netlify/functions/generate-x-a', { method: 'POST', body: JSON.stringify(payload) }),
  fetch('/.netlify/functions/generate-x-b', { method: 'POST', body: JSON.stringify(payload) }),
])
```

```toml
[functions."generate-x-a"]
  timeout = 26
[functions."generate-x-b"]
  timeout = 26
```

**Future:** Post-launch, collapse MIL-a and MIL-b into a single streaming function. Do not attempt pre-launch.

---

## Timeout and JSON Debugging

**Timeout debugging sequence:**
1. Add console.log at top of handler and before API call
2. No logs → infrastructure issue (routing, build error, netlify.toml, endpoint dedup)
3. Logs stop before API call → setup/parsing code issue
4. API call starts but never completes → output too large; compress prompt or use parallel calls
5. Always use JSON output not HTML — 60–70% smaller

**JSON truncation fix pattern:**
- max_tokens: 2500 — enough for content, tight enough to complete within timeout
- OUTPUT LENGTH RULES in system prompt: one sentence per field maximum
- JSON repair fallback after brace-boundary parse:

```js
if (!parsed) {
  try {
    const lastComplete = clean.lastIndexOf('},')
    if (lastComplete > 0) {
      const repaired = clean.substring(0, lastComplete + 1) + ']}}'
      parsed = JSON.parse(repaired)
    }
  } catch (repairErr) {
    console.log('MIL parse: repair fallback also failed', repairErr.message)
  }
}
```

---

## AI Hallucination Prevention

Always include in every generative function system prompt:

```
IMPORTANT: Generating content for this specific couple based ONLY on answers provided. Fresh session. No memory of previous couples.
Only reference what the couple actually said. Do not invent musical details, formats, preferences, or acts.
Every artist name must be traceable to what this couple typed. If no artists mentioned, suggest none.
If a field is empty or vague, reflect that warmly — do not fill gaps with plausible-sounding language.
```

---

## MIL Architecture

**Functions:** generate-mil-a.js (moments 1–5) + generate-mil-b.js (moments 6–9 + production check)
**Model:** `claude-haiku-4-5-20251001`
**Output:** JSON object rendered to React components in BriefScreen.jsx Music Plan tab
**max_tokens:** 2500 per function
**JSON repair fallback:** active in both functions

**Live act intelligence framework:** wedin-live-act-intelligence-framework.md — load for any session touching MIL logic, deep-dive questions, or brief generation. Supersedes old ensemble-to-room-size logic.

**MIL reasoning sequence (pending implementation — Session 1b):**
Before generating any recommendation, the MIL reasons through inputs in this exact order:
1. Physical constraints — guest count and venue type
2. Budget
3. Cultural and faith context
4. Emotional signals — home_listening, crowd_vs_taste, what_guests_say
5. Named songs — ground truth, override taste inferences

Earlier inputs take precedence over later ones. Never allow emotional signals to override physical constraints.

**MIL output rebalancing (pending — after Stage 3/4 separation):**
Target weighting: 30% recommendation, 70% brief instruction.
Cost field moves to Stage 5 (How to Book tab). Suppressed in Music Plan tab.

**Prompt audit required before adding new rules:** Measure token count in both functions. Confirm headroom before adding anything. Add rules one at a time, test between each addition.

**Current system prompt rules (17 active):**
1. Musical profile classification (Profile 1 / 2 / 3)
2. Two-act architecture, 90-minute live act rule
3. Guilty pleasure restraint — one moment max, never primary driver, never named
4. Single reference rule — one artist/song/style per moment maximum
5. Sparse data restraint — describe feeling, don't invent setlists
6. Bold directions — unusual combinations as optional section after standard rec
7. Pre-drinks single act — one act only
8. Pre-drinks vs dancing DJ — different briefs, flag distinction
9. Person consistency — second person to couple throughout
10. Overview as first entry — two sentences from three_words + home_listening + crowd_vs_taste + what_guests_say
11. Discovery questions actively shaping output
12. Hallucination prevention / session boundary
13. OUTPUT LENGTH RULES — one sentence per field, total under 2000 tokens
14. Banned word "Deploy"
15. No band classification language — Band 1/2/3 etc never in output
16. Coordinator plain language — no DJ booth jargon
17. No hardcoded guest counts — use "your guests" or "the room"

**Pending MIL additions — Session 1b (prompt audit first):**
10 new rules from wedin-live-act-intelligence-framework.md — see that document for full detail:
DJ PLUS removed / Live vs PA golden rule / Function vs feature rule / Solo musician ceiling / Instrumentation logic (2a, 2b, 2c) / Arc principle / Song-led recommendations / Five vetting questions / Coordinator brief specificity / Volume instruction.

**SA Market Knowledge Base (March 2026, embedded in system prompt):**
- Pricing: flat package / hourly with minimum / production package
- Standard SA wedding timeline: 8–9 hours total coverage
- Ensemble scaling: Solo R5k–R10k → Duo R8k–R15k → Trio R12k–R20k → Quartet R15k–R25k
- Availability tiers: Tier 1 (DJs, jazz, cover bands, solos) / Tier 2 (strings, gospel, choirs) / Tier 3 (big bands — R150k+ only)
- Budget tier guidance: Under R30k → R30k–R60k → R60k–R100k → R100k–R150k → R150k+
- City context: CT and JHB deepest pools, outside metros add travel costs

---

## Brief Architecture

**generate-brief-a.js — Couple's brief:**
- Second person to the couple
- Starts with two-sentence overview from discovery session
- Emotional mirror — no act recommendations
- max_tokens: 2500, 3–4 sentences per moment maximum

**generate-brief-b.js — Coordinator's brief:**
- Second person to coordinator
- Every moment ends with verb-led operational instruction
- Professional, direct, actionable
- max_tokens: 2500, 3–4 sentences per moment maximum
- JSON regex fallback: extracts coordinatorBrief value even from truncated response

**AbortController:** BriefScreen.jsx cancels in-flight requests on unmount, prevents 504 on repeat generation.

---

## Ceremony Summary Architecture

**Function:** generate-ceremony-summary.js
**Model:** `claude-sonnet-4-6`
**Trigger:** automatically when couple completes ceremony deep-dive
**Output:** warm, second-person narrative shown on ceremony completion screen

**Three tone consistency rules:**
1. No "you need to", "you must", "you should" — use "worth confirming", "something to think through"
2. Never open with "You haven't" — reframe gaps as opportunities
3. End with single warm forward-facing sentence, never a checklist

**Known gap:** ceremony summary not feeding MIL ceremony recommendation. Fix: pass ceremony summary as context to generate-mil-a.js. Scheduled Session 4.

---

## Song Question — Deep-Dive Addition

A song question must be added as the final question in each of the 9 moment deep-dives.

**Why:** Songs are the ground truth. They determine live vs PA decision, instrumentation, and Spotify playlist content. Without songs the MIL reasons in the abstract.

**Standard framing:** "If you could hear four songs during [this moment], what would they be?"

**Moment-specific copy:** See wedin-live-act-intelligence-framework.md — Song Question section. Use exact copy. Exceptions: Entrance, First Dance, Last Song take 1–2 songs.

**MIL behaviour when songs provided:** Evaluate each song against the recommended ensemble. Confirm or adjust format recommendation. Reference songs specifically in output. Flag tensions between choices. Pass to Spotify playlist generation.

---

## Session Persistence Architecture

**Current state:** localStorage only. If browser clears or device switches, couple loses all answers.

**Fix:** Once email captured at portrait screen, all subsequent answers persist to Supabase keyed to email. On return visit, detect email, restore session from Supabase. Any device, pick up where left off.

**Architecture:** Extend save-session.js to accept incremental answer updates. Write to Supabase on each deep-dive completion. On app load, check for existing session by email if available.

---

## Discovery Session — Current Question Set

**Stage 4 — Music Identity:**
1. `stop_and_look` — text
2. `guilty_pleasure` — text
3. `home_listening` — text
4. `musical_confidence` — chips + Other
5. `crowd_vs_taste` — chips + Other (conditionalEducate on "our taste leading")
6. `live_vs_recorded` — chips + Other (conditionalEducate after all answers)

**Venue type question (pending — Session 2):**
After guest count, before music identity.
"Where is your wedding being held?"
Chips: Hotel or events venue / Wine estate or garden / Farm or bush / Beach or outdoor / Church or religious venue / Destination (outside SA) / Not sure yet
Passes through as `venue_type` in sessionAnswers.

**"Other — tell us more" pattern:**
- All chip questions in discovery (except age_range) and all 9 deep-dives
- Does NOT auto-advance — reveals text input, saves as "Other: [text]"
- ceremony_faith and protestant_denomination untouched

---

## Legal — Status

**T&Cs** — drafted, ready to implement. Key points: wedin.ai is a planning tool not a booking agency; R699 one-time fee; no refunds once brief generated; act pricing is indicative not guaranteed.

**Privacy Policy** — drafted, POPIA compliant. Email + session answers in Supabase; payment via PayFast; data not sold; user rights under POPIA; Information Regulator contact included.

**Legal entity:** Tones of Note PTY (Ltd) | **Contact:** hello@wedin.ai

**To implement:** `/terms` and `/privacy` static routes; footer links; cookie consent banner.

---

## Payment Gateway

**Stripe** — test mode currently live. SA merchant limitations.
**PayFast** — replacement. SA's most used gateway. Supports cards, EFT, SnapScan, Zapper.

Research PayFast account setup for Tones of Note PTY (Ltd). Swap create-checkout-session.js and verify-payment.js. Update T&Cs and Privacy Policy to reference PayFast. Test full payment flow before going live.

---

## Product Principles

- The brief is the equaliser — a couple with a wedin.ai brief and a R15,000 budget should have a more emotionally coherent wedding than a couple with R150,000 who winged it
- Emotional fidelity on any budget
- Tradition-aware intelligence
- Staged delivery — each stage requires something from the couple before the next opens
- Account creation after value — portrait before email, always
- Payment gates the Moment Map — couple pays before accessing deep-dives
- One question at a time — conversation not a form
- Save progress automatically — never lose answers
- Describe what things do — never tell the couple how to feel
- Sincerity and authenticity — the product never performs emotion
- "You both" preferred over "you"
- Couple's brief = emotional mirror / Coordinator's brief = operational document / Artist brief = operational instruction per act
- Songs lead — the song determines the format and ensemble, not the other way around
- Education before recommendation — the couple understands why before they receive what

---

## Copy Principles

- Describe what things do — never tell the couple how to feel
- Banned words in all output including AI-generated: seamless, journey, unlock, leverage, magical, perfect, dream wedding, deploy, Band 1/2/3/4/5 (internal language)
- "You both" preferred over "you"
- Copy audit — planned, not yet executed against code

---

## What NOT to Build Without Asking

- DJ PLUS as a standard recommendation — removed from MIL
- Alternative tech stack choices
- Freemium or free tier pricing
- Account creation before portrait reveal
- Payment before Moment Map is shown
- Specific artist recommendations by name (Phase 3)
- Any feature outside the current session plan
- MIL streaming / mil-a + mil-b collapse (post-launch only)
- Feature branches — always commit to main
- Stage 7 pricing model — decision deferred

---

## Real User Testing — Testers

- Zach & Julia — first couple, March 25 2026, positive response
- Sasha — second tester, March 26 2026, full feedback captured and largely resolved
- Anonymous couple — self-directed session March 26 evening, strong output quality
