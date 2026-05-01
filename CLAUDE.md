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

**Stage 2 — Moment by Moment** ✓ BUILT
Payment gate → nine moment deep-dives (with song question per moment) → confirmation flow. Gate: payment (R699). Couple pays before accessing the Moment Map. This is the current architecture and it is correct.

**Stage 3 — Wedding Soundtrack** ✓ BUILT
WeddingSoundtrackScreen.jsx displays generate-brief-a.js output on a dedicated full screen before MILIntakeScreen. Warm prose narrative, all 9 moments, moment headings rendered as gold DM Sans uppercase labels. generate-brief-a.js output stored in App.jsx state (coupleBrief) and passed to BriefScreen as prop — BriefScreen skips the generate-brief-a call if coupleBrief prop is already present. MEL summary screen concept dropped entirely — not needed.

**Stage 4 — The Emotional Music Plan** ✓ BUILT
MIL output live and generating song-referenced recommendations. Cost field suppressed in Music Plan tab render. Three targeted MIL prompt additions implemented May 1 2026 — see MIL Architecture section.

**Stage 5 — Practical Guidance** (EXISTS inside MIL — Budget Tab pending)
Costs, booking lead times, five vetting questions per live act, booking sequence. productionCheck removed from MIL-B as of May 1 2026. Budget information will be delivered via a dedicated Budget tab (generate-budget.js + Excel download) — see Session 10b in remaining sessions.

**Stage 6 — Coordinator Brief** ✓ BUILT (coordinator profile calibration complete — Session 8)
Assembled from confirmed moment summaries and emotional music plan. Second person to coordinator. Operational and verb-led. Coordinator profile calibration complete — professional / venue / volunteer profiles implemented in generate-brief-b.js.

**Stage 7 — Artist Brief** (NOT BUILT — deferred post-launch)
Per-act brief documents — specific instructions for each booked act. Deferred — see post-launch list.

---

## The Correct Product Flow — Locked

This is the agreed end-to-end flow. Every screen, every transition, in sequence. Do not deviate without explicit instruction.

```
Discovery session (24 questions)
↓
Music Portrait generates (generate-portrait.js — Claude Sonnet)
↓
Portrait confirmation screen → "View your music portrait" CTA
↓
Portrait screen — email capture → "Save my portrait →"
↓
Post-email confirmation → "Open my Moment Map →"
↓
Pre-payment Moment Map (9 moments locked)
→ "Unlock my Moment Map →" CTA → Payment screen (PayFast)
↓
Post-payment Moment Map (9 moments unlocked)
↓
Couple completes all 9 moment deep-dives
↓
"Build my wedding soundtrack →" on Moment Map
↓
WeddingSoundtrackScreen — generate-brief-a.js self-generates on mount
Output stored in App.jsx coupleBrief state via onSetCoupleBrief callback
Email button: "Email me my wedding soundtrack →"
CTA: "Build my music plan →"
↓
MILIntakeScreen — one screen, three chip inputs:
  "Have you thought about a music budget yet?"
  "Have you already booked any acts?"
  "Who will be coordinating the music on the day?" (coordinator_profile)
↓
Music Plan generates (generate-mil-a.js + generate-mil-b.js in parallel)
↓
BriefScreen — four tabs: Music Plan | How to Book | Coordinator Brief | Budget (pending Session 10b)
coupleBrief received as prop — generate-brief-a.js call skipped if prop present
```

**Critical flow rule:** handleGenerateBrief in App.jsx routes to setView('weddingSoundtrack'). Supabase restore logic routes to setView('weddingSoundtrack') for sessions with 9 confirmed moments but no MIL. PostBriefScreen remains in App.jsx as a safe fallback only — never in the forward path.

---

## BriefScreen.jsx — Tab Structure

Current tabs: Music Plan | How to Book | Coordinator Brief ✓ BUILT
Pending: Budget tab (Session 10b)

Music Plan tab: MIL output rendered. Cost field suppressed at render level. Built. productionCheck card removed May 1 2026 — production check data will move to Budget tab.
When mil_budget === "not_sure": render disclaimer at top — "Cost estimates below are indicative — treat them as reference points and confirm directly with acts."
How to Book tab: same MIL JSON, cost field rendered, act-specific vetting questions per moment. Built. productionCheck card removed May 1 2026.
Coordinator Brief tab: generate-brief-b.js output. Built. Three coordinator profiles (professional / venue / volunteer) calibrate language register, cue language, and instruction style. "Send to coordinator →" email button on this tab.
Budget tab (PENDING Session 10b): New fourth tab. generate-budget.js Netlify function. Three-sheet Excel download. Illustrative pricing with explicit disclaimer. Booking timeline. Hidden costs checklist. See Budget Tab section below.

---

## Budget Tab — Specification (Session 10b)

**Why:** productionCheck was removed from MIL-B to reduce timeout pressure. Budget information is delivered separately as a dedicated planning tool the couple can use and update over months.

**Function:** `generate-budget.js` — new Netlify function. Receives MIL output plus couple data. Generates three-sheet Excel using xlsx skill. Returns download link.

**Three-sheet Excel structure:**

Sheet 1 — Music Budget
- One row per moment
- Columns: Moment | Act Recommended | Illustrative Range | Your Quote | Variance
- Pre-populated from MIL output. Empty "Your Quote" column for couple to fill in as real quotes arrive
- Auto-calculated Variance column
- Total row at bottom
- Disclaimer at top (merged cell): "These are market reference ranges based on SA wedding pricing as of early 2026. Every act quotes differently based on experience, lineup, travel, and availability. Use these as planning anchors, not booking commitments."

Sheet 2 — Booking Timeline
- What to book first, lead times per act type
- Pre-populated from MIL recommendations

Sheet 3 — Hidden Costs
- PA, sound engineer, travel, VAT, generator
- Structured as checklist with illustrative ranges and confirmed/not applicable column

**Tab name:** "What This Costs" — not "Budget"

**Pricing disclaimer:** Must appear prominently. Protects wedin.ai commercially. Frames document as planning tool not binding quote.

**Build order for Session 10b:**
1. Read xlsx skill before writing any code
2. Build generate-budget.js
3. Add Budget tab to BriefScreen
4. Test end to end with Scenarios 5, 12, 13

---

## Current Build Status — May 1, 2026

**Phase:** Phase 2 — in progress.

**Real user testing completed:**
- Zach & Julia — March 25, 2026. Positive, no specific feedback.
- Sasha — March 26, 2026. Full feedback captured, most items resolved.
- Anonymous couple — March 26, 2026 evening. Self-directed, output quality strong.
- Test user (April 2026): Spotify integration cited as the difference between willingness to pay and not.
- Rus (founder) — April 29, 2026. Full flow tested post-Session 7. All generating correctly.
- Scenarios 1–25 tested May 1, 2026. All 10 moments present and in correct order across all scenarios. Scenario 5 (maximum complexity) occasionally triggers cold start timeout on MIL-B — retry resolves reliably.

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
- Netlify Functions — generate-portrait, save-session, save-contact, create-checkout-session, verify-payment, generate-ceremony-summary, generate-brief-a, generate-brief-b, generate-mil-a, generate-mil-b
- All API keys secure — no browser exposure, all server-side
- Landing page — live at wedinai.github.io/wedin-ai, Google Search Console verified
- Moment Map UI — white card + gold left border CTA block at top, back link to portrait wired
- Brief generation — generate-brief-a.js + generate-brief-b.js, parallel Promise.all, AbortController prevents 504
- BriefScreen.jsx — three tabs: Music Plan | How to Book | Coordinator Brief
- Brief person consistency — couple's brief 2nd person to couple, coordinator's brief 2nd person to coordinator
- MIL — generate-mil-a.js + generate-mil-b.js, parallel, JSON output — see MIL Architecture for current split
- MIL system prompt — full SA market knowledge base, all rules active including Rules 1 and 3 (May 1 2026)
- All 9 deep-dives live with momentAnswers persistence
- Character limits on all 9 deep-dive free-text fields — 200 chars descriptive, 400 chars song fields, live counter with colour thresholds
- Ceremony deep-dive — faith tradition sub-flows, AI summary wired and generating on completion
- Ceremony summary — second person to couple, warm voice, three tone consistency instructions deployed
- Inline term explanations — pre-drinks, recessional, processional
- Session restore — localStorage + Supabase persistence, restore on return visit confirmed working
- Email restore link — ?email= query parameter in portrait email, App.jsx triggers restore on load ✓
- Email — portrait in gold-bordered block, R699 pricing, CTA links to Moment Map, Resend confirmed delivering (domain verified April 30 2026)
- Stripe test integration — R699 ZAR, unlocks Moment Map
- T&Cs and Privacy Policy — live at /terms and /privacy, footer links, cookie consent banner ✓
- ceremonyKnowledge.js — updated to v3.0, April 4
- Spotify integration — complete and live. See Spotify section below.
- Education cards — collapsed dropdowns per confirmed moment on Moment Map ✓
- BriefScreen tab restructure — Music Plan | How to Book | Coordinator Brief ✓
- Cost suppressed in Music Plan tab ✓
- **Session 6 — Email outputs + remarketing ✓**
  - Two-touch remarketing sequence (48hr Touch 1, 7-day Touch 2) live
  - Email deduplication by most recent session per email address
  - Music Plan email button on BriefScreen Music Plan tab
  - How to Book email button on BriefScreen How to Book tab
  - Coordinator Brief email — couple inputs coordinator address, sent directly
  - handleCopy bug fixed on How to Book tab
  - milComplete flag written to Supabase state on MIL completion
  - remarketing_touch column in sessions table (integer, default 0)
- **Session 7 — WeddingSoundtrackScreen + flow fix ✓** (April 29, 2026)
  - handleGenerateBrief routes to setView('weddingSoundtrack') — was setView('postBrief')
  - Supabase restore logic routes to setView('weddingSoundtrack') for 9 confirmed moments + no MIL
  - WeddingSoundtrackScreen.jsx — new component, self-generates via generate-brief-a.js on mount
  - Markdown section headings rendered as gold DM Sans uppercase labels — mirrors BriefContent pattern
  - coupleBrief added to App.jsx state — written by WeddingSoundtrackScreen via onSetCoupleBrief callback
  - BriefScreen receives coupleBrief as prop — skips generate-brief-a.js call if prop is non-empty
  - send-wedding-soundtrack.js — new Resend function, gold-bordered email, restore link CTA
  - PostBriefScreen retained in App.jsx as safe fallback — not deleted, not in forward path
  - MEL summary screen concept dropped entirely
- **Copy audit ✓** (April 29, 2026 — commit 5cc9d70)
  - MomentMap.jsx, CompletionScreen.jsx, MusicPortrait.jsx, BriefScreen.jsx, App.jsx, MILIntakeScreen.jsx updated
  - MILIntakeScreen fully merged to one screen — step counter gone, bookings fades in below budget
  - send-remarketing.js and send-music-plan.js email copy updated
  - milBudget state wired through App.jsx to BriefScreen for not_sure disclaimer
- **Session 8 — Coordinator profile ✓** (April 30, 2026 — commit 7f9d0d2)
  - coordinator_profile chip question added to MILIntakeScreen (third chip, fades in after bookings)
  - coordinatorProfile state wired through App.jsx → BriefScreen → generate-brief-b.js payload
  - generate-brief-b.js SYSTEM_PROMPT converted to getSystemPrompt() function
  - Three coordinator profiles implemented: professional / venue / volunteer
  - Professional: peer-to-peer, industry terminology, concise
  - Venue: self-contained, full couple context, no assumed prior knowledge
  - Volunteer: plain language, named handoffs, one action per moment, warm tone
  - Default coordinator profile: venue (safe fallback if not set)
  - All 12 checklist items verified across three profile outputs
- **Session 10 — MIL architectural restructure + rule additions ✓** (May 1, 2026)
  - Dinner moved from generate-mil-a.js to generate-mil-b.js — resolves truncation
  - Your Entrance moved from generate-mil-a.js to generate-mil-b.js — resolves truncation
  - productionCheck removed from generate-mil-b.js entirely — resolves timeout pressure
  - productionCheck render blocks removed from BriefScreen.jsx (Music Plan tab and How to Book tab)
  - Rule 1: OVERVIEW RULE second person addition — "Overview must be second person only — 'You want', never '[Names] want'." — generate-mil-a.js only
  - Rule 3: BUDGET OVERRUN RULE key names corrected in generate-mil-b.js to match payload values (under_r30k, r30_60k, r60_100k, r100_150k, r150k_plus)
  - Character limits deployed on all 9 deep-dive components — 200 chars descriptive / 400 chars song fields

---

## ✗ NOT YET BUILT — Remaining Before Launch

**Session 10b — Budget Tab:**
New generate-budget.js function. Three-sheet Excel output. New "What This Costs" tab in BriefScreen. Illustrative pricing disclaimer. Booking timeline. Hidden costs checklist. See Budget Tab section above.

**Session 11 — PayFast + security:**
PayFast merchant account must be live before this session. Rate limiting, Supabase RLS audit, data deletion (POPIA), post-payment confirmation state. Stripe test mode currently live.

**Session 12 — Pre-launch QA:**
Full flow on real mobile. All 9 moments. Real payment. All email flows. All three coordinator profiles tested against live output.

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
| Email | Resend — hello@wedin.ai verified (domain re-verified April 30 2026) |
| Hosting | Netlify |
| Payments | PayFast — replacing Stripe. Stripe test mode currently live. |
| Music APIs | Spotify — complete and live |
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
      GuestArrivalsDeepDive.jsx — character limits: 200 descriptive / 400 song
      PreDrinksDeepDive.jsx     — character limits: 200 descriptive / 400 song
      EntranceDeepDive.jsx      — character limits: 200 descriptive / 400 song
      FirstDanceDeepDive.jsx    — character limits: 200 descriptive / 400 song
      DinnerDeepDive.jsx        — character limits: 200 descriptive / 400 song
      SpeechesDeepDive.jsx      — character limits: 200 descriptive / 400 song
      DancingDeepDive.jsx       — character limits: 200 descriptive / 400 song
      LastSongDeepDive.jsx      — character limits: 200 descriptive / 400 song
      BriefScreen.jsx          — three tabs: Music Plan | How to Book | Coordinator Brief
                                  Budget tab pending Session 10b
      WeddingSoundtrackScreen.jsx — ✓ BUILT. Self-generates via generate-brief-a.js. Gold label,
                                    heading, sub-heading, gold-bordered content block, email button,
                                    CTA. Markdown headings rendered as gold DM Sans uppercase labels.
      PostBriefScreen.jsx      — safe fallback only, not in forward path
      MILIntakeScreen.jsx      — three chip inputs: budget / bookings / coordinator_profile
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
      generate-brief-a.js          — Wedding Soundtrack, 2nd person to couple, emotional mirror
      generate-brief-b.js          — coordinator's brief, 2nd person to coordinator, JSON repair fallback
                                     three coordinator profiles: professional / venue / volunteer
      generate-mil-a.js            — overview + Guest Arrivals + Ceremony + Pre-drinks (4 entries)
                                     max_tokens: 1800. Rule 1 (second person overview) active.
      generate-mil-b.js            — Your Entrance + Dinner + Speeches + First Dance + Dancing +
                                     Last Song (6 moments, no productionCheck). max_tokens: 2400.
                                     Rule 3 (budget key fix) active.
      generate-budget.js           — PENDING Session 10b. Budget Excel download.
      restore-session.js           — queries by email, returns most recent, never errors app
      send-remarketing.js          — scheduled daily, two-touch sequence, deduplication active
      send-music-plan.js           — Music Plan email to couple
      send-how-to-book.js          — How to Book email to couple
      send-coordinator-brief.js    — Coordinator Brief email to coordinator address
      send-wedding-soundtrack.js   — ✓ BUILT. Wedding Soundtrack email to couple, Resend SDK,
                                     gold-bordered content block, restore link CTA
      generate-spotify-tracks.js   — Claude Haiku, fence stripping, boundary search fallback
  netlify.toml
```

---

## Phase Plan

### Phase 1 — MVP Core ✓ COMPLETE
### Phase 1.5 — Moment Map + Payment ✓ COMPLETE

### Phase 2 — Full Seven-Stage Product (IN PROGRESS)
See wedin-launch-sessions.md for complete session-by-session breakdown.

### Phase 3 — Marketplace (post-revenue)
- Curated artist directory, direct booking, couple reviews
- Planner dashboard
- Band-matched landing pages (5 versions)
- Referral mechanism (10% rebate)
- UK market adaptation
- Streaming MIL (collapse mil-a/b into single streaming function)
- PDF download
- Artist Brief (Stage 7) — deferred from pre-launch

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

**Cold start behaviour:** MIL-B on maximum complexity scenarios (Scenario 5 — Naledi & David, R150k+) occasionally runs 28-30 seconds on cold start. Retry resolves reliably. JSON repair fallback recovers all 6 moments. Accepted pre-launch behaviour — streaming post-launch permanently solves it.

---

## Timeout and JSON Debugging

**Timeout debugging sequence:**
1. Add console.log at top of handler and before API call
2. No logs → infrastructure issue (routing, build error, netlify.toml, endpoint dedup)
3. Logs stop before API call → setup/parsing code issue
4. API call starts but never completes → output too large; compress prompt or use parallel calls
5. Always use JSON output not HTML — 60–70% smaller

**JSON truncation fix pattern:**
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

**CURRENT SPLIT (as of May 1, 2026):**

**generate-mil-a.js** — 4 entries: overview + Guest Arrivals + Ceremony + Pre-drinks
- max_tokens: 1800
- Rule 1 active: OVERVIEW RULE includes "Overview must be second person only — 'You want', never '[Names] want'."
- No productionCheck

**generate-mil-b.js** — 6 moments: Your Entrance + Dinner + Speeches + First Dance + Dancing + Last Song
- max_tokens: 2400
- Rule 3 active: BUDGET OVERRUN RULE keys corrected to match payload (under_r30k, r30_60k, r60_100k, r100_150k, r150k_plus)
- No productionCheck — removed May 1 2026. Budget information moves to generate-budget.js (Session 10b)

**Output order (client-side merge):** overview → Guest Arrivals → Ceremony → Pre-drinks → Your Entrance → Dinner → Speeches → First Dance → Dancing → Last Song

**No client-side changes needed for moment order** — BriefScreen.jsx concatenates MIL-A moments + MIL-B moments in array order. Order is preserved naturally.

**PRODUCTION CHECK COHERENCE rule in generate-mil-b.js:** Updated May 1 2026. References moments 1-3 (GA, Ceremony, Pre-drinks) as inferred from couple's answers. Your Entrance and Dinner are directly generated in MIL-B batch.

**Model:** `claude-haiku-4-5-20251001`
**Output:** JSON object rendered to React components in BriefScreen.jsx Music Plan tab
**JSON repair fallback:** active in both functions

**Do not change generate-mil-a.js or generate-mil-b.js system prompts without:**
1. Completing Part A review in Claude.ai first
2. Testing against Scenarios 5, 12, 13, and 17 before deploying
3. Checking MIL-A duration stays under 20 seconds and MIL-B under 25 seconds after any prompt addition

**Live act intelligence framework:** wedin-live-act-intelligence-framework.md — load for any session touching MIL logic.

**MIL reasoning sequence (live):**
1. Physical constraints — guest count and venue type
2. Budget
3. Cultural and faith context
4. Emotional signals — home_listening, crowd_vs_taste, what_guests_say
5. Named songs — ground truth, override taste inferences

Earlier inputs take precedence over later ones. Never allow emotional signals to override physical constraints.

**Current system prompt rules — all active:**

Original 17: Musical profile classification / Two-act architecture + 90-min live act rule / Guilty pleasure restraint / Single reference rule / Sparse data restraint / Bold directions / Pre-drinks single act / Pre-drinks vs dancing DJ / Person consistency / Overview as first entry / Discovery questions shaping output / Hallucination prevention / OUTPUT LENGTH RULES / Banned word "Deploy" / No band classification language / Coordinator plain language / No hardcoded guest counts

Framework 10 (Session 1b): DJ PLUS removed / Live vs PA golden rule / Function vs feature rule / Solo musician ceiling / Instrumentation logic (2a, 2b, 2c) / Arc principle / Song-led recommendations / Five vetting questions / Coordinator brief specificity / Volume instruction

Session 10 additions (May 1 2026):
- Rule 1: OVERVIEW RULE second person — generate-mil-a.js only. "Overview must be second person only — 'You want', never '[Names] want'."
- Rule 3: BUDGET OVERRUN RULE key names corrected — generate-mil-b.js only. Keys now match payload: under_r30k / r30_60k / r60_100k / r100_150k / r150k_plus

**SA Market Knowledge Base (embedded in system prompt):**
- Pricing: flat package / hourly with minimum / production package
- Standard SA wedding timeline: 8–9 hours total coverage
- Ensemble scaling: Solo R5k–R10k → Duo R8k–R15k → Trio R12k–R20k → Quartet R15k–R25k
- Availability tiers: Tier 1 (DJs, jazz, cover bands, solos) / Tier 2 (strings, gospel, choirs) / Tier 3 (big bands — R150k+ only)
- Budget tier guidance: Under R30k → R30k–R60k → R60k–R100k → R100k–R150k → R150k+
- City context: CT and JHB deepest pools, outside metros add travel costs

**Input payload:** portrait, sessionAnswers (includes venue_type), momentAnswers (includes song_question per moment via formatAnswers), milAnswers (mil_budget, mil_existing_bookings — coordinator_profile goes to generate-brief-b.js only, not MIL functions), coupleName, ceremonySummary.

---

## Brief Architecture

**generate-brief-a.js** — couple's Wedding Soundtrack, second person to couple, emotional mirror, no act recommendations, max_tokens 2500. Not affected by coordinator profile. Output stored in App.jsx coupleBrief state by WeddingSoundtrackScreen via onSetCoupleBrief callback. Passed to BriefScreen as prop — BriefScreen skips generate-brief-a call if prop is non-empty. Consistent output guaranteed — generated once, used everywhere.

**generate-brief-b.js** — coordinator's brief, second person to coordinator, verb-led operational instructions, max_tokens 2500, JSON regex fallback active. Accepts coordinator_profile variable (professional / venue / volunteer, default: venue) and calibrates language register, structure, and cue language accordingly. Full specification in wedin-planner-brief-SKILL-v5.md. Three profiles implemented May 1 2026 — Session 8 complete.

**Timing rule — non-negotiable:** No clock times in any brief output. Ever. Express all timing as duration and sequence only. "Pre-drinks: approximately 60–75 minutes, directly following ceremony recessional" not "Pre-drinks: 15:30–16:45". This applies to generate-brief-a.js, generate-brief-b.js, and all future brief functions.

**generate-artist-brief-[type].js** — Artist Brief, Stage 7, deferred post-launch. Do not build pre-launch.

**AbortController:** BriefScreen.jsx cancels in-flight requests on unmount.

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

---

## Song Question — Deep-Dive Addition

A song question is the final question in each of the 9 moment deep-dives.

**Why:** Songs are the ground truth. They determine live vs PA decision, instrumentation, and Spotify playlist content. Without songs the MIL reasons in the abstract.

**Standard framing:** "If you could hear four songs during [this moment], what would they be?"

**Character limit on song fields:** 400 characters maximum. Live counter displayed. Hard stop enforced.

**MIL behaviour when songs provided:** Evaluate each song against the recommended ensemble. Confirm or adjust format recommendation. Reference songs specifically in output. Flag tensions between choices. Pass to Spotify playlist generation.

---

## Character Limits — Deep-Dive Fields

Implemented May 1 2026 across all 9 deep-dive components.

**Descriptive fields:** 200 characters maximum
**Song question fields:** 400 characters maximum

Counter displays below each field in real time — format "142 / 200". Colour: grey → amber at 80% → red at 100%. Hard limit enforced via maxLength attribute — no silent truncation.

Trust copy:
- Below descriptive fields: "Specific answers give you the best recommendations."
- Below song fields: "List up to four songs — these become the ground truth for your plan."

---

## Session Persistence Architecture

**Current state:** localStorage + Supabase. Email captured at portrait screen — all subsequent answers persist to Supabase keyed to email. On return visit, detect email, restore session from Supabase. Any device, pick up where left off.

**save-session.js modes:**
- Insert mode: body has `answers` only → inserts new row
- Update mode: body has `session_id + email + state` → updates email and state columns

**restore-session.js:** accepts `{ email }`, queries sessions WHERE email matches, returns most recent. Returns `{ found: false }` if nothing there — never errors the app.

**persistState:** called after every deep-dive completion, ceremony completion, moment confirmation, and MIL completion.

**isPaid:** stays localStorage only. Never included in Supabase state object.

**Email restore link:** ?email= query parameter in portrait email. App.jsx reads on load, writes to localStorage, triggers Supabase restore. Built and live ✓

**Restore routing logic:**
- MIL present → setView('brief')
- 9 confirmed moments, no MIL → setView('weddingSoundtrack') — WeddingSoundtrackScreen self-generates fresh
- Fewer than 9 confirmed → setView('momentMap')
- localStorage fallback → setView('momentMap')

---

## Infrastructure & Hosting Reference

Full details in wedin-infrastructure-reference.md (project file). Key facts:

- Domain: wedin.ai — registered at GoDaddy, DNS managed at Netlify (NS1 nameservers)
- App: wedin-ai-app.netlify.app — custom domain app.wedin.ai pre-configured (CNAME exists), activation is a pre-launch step
- Email sending: Resend, hello@wedin.ai, domain verified April 30 2026
- DNS records for Resend (DKIM, SPF MX, SPF TXT) added to Netlify DNS April 30 2026

---

## Discovery Session — Current Question Set

**Stage 4 — Music Identity:**
1. `stop_and_look` — text
2. `guilty_pleasure` — text
3. `home_listening` — text
4. `musical_confidence` — chips + Other
5. `crowd_vs_taste` — chips + Other (conditionalEducate on "our taste leading")
6. `live_vs_recorded` — chips + Other (conditionalEducate after all answers)

**Venue type question:** After guest count, before music identity. Key: `venue_type`, 7 chip options.

**"Other — tell us more" pattern:**
- All chip questions in discovery (except age_range) and all 9 deep-dives
- Does NOT auto-advance — reveals text input, saves as "Other: [text]"
- ceremony_faith and protestant_denomination untouched

---

## Legal — Status

**T&Cs** — live at /terms. Key points: wedin.ai is a planning tool not a booking agency; R699 one-time fee; no refunds once brief generated; act pricing is indicative not guaranteed.

**Privacy Policy** — live at /privacy. POPIA compliant. Email + session answers in Supabase; payment via PayFast; data not sold; user rights under POPIA.

**Legal entity:** Tones of Note PTY (Ltd) | **Contact:** hello@wedin.ai

**Cookie consent banner** — live ✓

---

## Payment Gateway

**Stripe** — test mode currently live. SA merchant limitations.
**PayFast** — replacement. SA's most used gateway. Supports cards, EFT, SnapScan, Zapper. Merchant account application submitted. Swap create-checkout-session.js and verify-payment.js. Test end-to-end before going live.

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

---

## What NOT to Build Without Asking

- DJ PLUS as a standard recommendation
- Alternative tech stack, freemium pricing, account creation before portrait reveal
- Payment before Moment Map is shown
- Specific artist recommendations by name (Phase 3)
- MIL streaming / mil-a + mil-b collapse (post-launch only)
- Feature branches — always commit to main
- Stage 7 Artist Brief pre-launch — deferred post-launch
- Any feature outside the current session plan in wedin-launch-sessions.md
- Clock times in any brief output — timing is always duration and sequence only, never absolute clock time
- Routing handleGenerateBrief to anything other than setView('weddingSoundtrack')
- Removing or modifying the coordinator_profile question on MILIntakeScreen without explicit instruction
- Changes to generate-mil-a.js or generate-mil-b.js system prompts without Part A review in Claude.ai first
- The 30/70 MIL reweighting — superseded, do not implement
- MEL summary screen — concept dropped, do not rebuild
- Persistent in-document storage — post-launch only
- productionCheck — removed from MIL architecture. Do not re-add to generate-mil-b.js. Budget information goes to generate-budget.js (Session 10b)
- Moving Dinner or Your Entrance back to generate-mil-a.js — architectural decision locked May 1 2026

---

## Real User Testing — Testers

- Zach & Julia — first couple, March 25 2026, positive response
- Sasha — second tester, March 26 2026, full feedback captured and largely resolved
- Anonymous couple — self-directed session March 26 evening, strong output quality
- MIL scenario testing: Scenarios 1–25 tested May 1 2026. All 10 moments present in correct order across all scenarios tested. Scenario 5 (Naledi & David — maximum complexity) cold start occasionally triggers retry — resolves on second attempt.
- Rus (founder) — April 29 + May 1, 2026. Full flow tested. All generating correctly.
