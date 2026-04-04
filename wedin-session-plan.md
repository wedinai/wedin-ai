# wedin.ai — Session Plan
## Updated April 4, 2026

This document is the single source of truth for build sequencing. Load alongside CLAUDE.md at the start of every session. The seven-stage product model is locked — see CLAUDE.md for stage definitions.

---

## Session Status Overview

| Session | Type | Focus | Status |
|---------|------|--------|--------|
| Session 1 | Claude Code | MIL audit, compression, 10 framework rules | ✓ COMPLETE |
| Session 1b | Claude Code | Reasoning sequence + four targeted fixes | NEXT (Claude Code) |
| Session 2 | Claude Code | Venue question + song question + moment confirmation | QUEUED |
| Session 3 | Claude Code | Output quality verification — full five-input test | QUEUED |
| Session 4 | Claude Code | Ceremony knowledge → MIL + production check coherence | QUEUED |
| Session 5 | Claude Code | Session persistence to Supabase | QUEUED |
| Session 6 | Claude.ai | Copy audit | QUEUED |
| Session 7 | Claude Code | Stage 3 — Music Education Layer | QUEUED |
| Session 8 | Claude Code | Stage 4/5 — MIL output rebalancing + BriefScreen tab restructure | QUEUED |
| Session 9 | Claude Code | Spotify integration | QUEUED |
| Session 10 | Claude Code | Stage 7 — Artist Brief | QUEUED |
| Session 11 | Claude Code | Legal pages + cookie banner | QUEUED |
| Session 12 | Claude Code | PayFast integration | QUEUED |
| Session 13 | Claude Code | Pre-launch QA + debug cleanup | QUEUED |

---

## Session 1 — ✓ COMPLETE
**MIL audit, compression, 10 framework rules added**

All 10 rules from wedin-live-act-intelligence-framework.md added to generate-mil-a.js and generate-mil-b.js. Prompt audit completed. Token headroom confirmed. ceremonyKnowledge.js updated to v3.0 and pushed to main.

---

## Session 1b — NEXT (Claude Code)
**MIL reasoning sequence + four targeted fixes**

This session does NOT include MIL output rebalancing — that waits for Session 8 after the full seven-stage map is locked.

**Task 1 — Reasoning sequence (structural)**
Add to both MIL functions. The MIL must reason through inputs in this exact order before generating any recommendation:
1. Physical constraints — guest count + venue_type
2. Budget
3. Cultural and faith context
4. Emotional signals — home_listening, crowd_vs_taste, what_guests_say
5. Named songs — ground truth, override all taste inferences

Earlier inputs take precedence. Emotional signals never override physical constraints.

**Task 2 — Four targeted fixes (tactical)**

Fix 1 — Entrance live act minimum: Before recommending a live act for the entrance, the MIL must confirm the same act is playing immediately after (pre-drinks or dinner). A live act for a 90-second entrance alone is poor value and creates an awkward gap. If the band doesn't play immediately after, recommend PA for entrance.

Fix 2 — Amplification flag for outdoor moments: Any moment at a farm, bush, beach, or outdoor venue must include an amplification note in the brief instruction. Acoustic acts without amplification outdoors above 40 people fail their function. The MIL must surface this explicitly, not assume the coordinator knows.

Fix 3 — Classical act caveat: Every classical act recommendation must include a flagged note: confirm repertoire range before booking. Classical acts have narrower ranges than couples expect. The five vetting questions are especially important here.

Fix 4 — Production check coherence: The production check total in generate-mil-b.js must account for all live acts across all nine moments — including moments 1–5 recommended by generate-mil-a.js. The two functions run in parallel and cannot see each other. Add system prompt instruction: the production check must include a conservative total estimate accounting for acts across the full day, based on the couple's profile and budget.

**Pre-session checklist:**
- Confirm current token count in both MIL functions before adding anything
- Add reasoning sequence first, test, then add each fix individually with testing between
- Never add complexity without confirming headroom

---

## Session 2 — Claude Code
**Venue type question + song question per moment + moment confirmation flow**

**Task 1 — Venue type question**
Add one question to the discovery session, after guest count, before music identity.

Question: "Where is your wedding being held?"
Chips: Hotel or events venue / Wine estate or garden / Farm or bush / Beach or outdoor / Church or religious venue / Destination (outside SA) / Not sure yet
Key: `venue_type`
Pass through in sessionAnswers to MIL functions.

**Task 2 — Song question per moment**
Add song question as the final question in each of the 9 deep-dives, before the moment summary generates. Songs are an input to the summary — not a response to it.

Use the exact copy from wedin-live-act-intelligence-framework.md — Song Question section.
Exceptions: Entrance and First Dance take 1–2 songs. Last Song takes 1 song.
Key per moment: `song_question`
Passes into momentAnswers. Confirm generate-mil-a.js and generate-mil-b.js are reading song_question per moment.

**Task 3 — Moment confirmation flow**
Review current ~60% built state. Identify gap. Complete.

Couple can: confirm happy / answer 2 follow-up questions / redo the moment.
All nine moments must be confirmed before the MIL intake screen unlocks.
Confirmation state persists in localStorage (and Supabase once Session 5 is complete).

---

## Session 3 — Claude Code
**Output quality verification — full five-input test**

First full end-to-end test with all five reasoning inputs present: guest count, venue type, budget, cultural context, and named songs. This session is verification only — no new features.

Run three complete sessions with different couple profiles. Evaluate MIL output against:
- Reasoning sequence respected (physical constraints before emotional signals)
- Song-led recommendations landing correctly
- Amplification flagged for outdoor moments
- No ensemble minimum violations
- Production check total coherent across all moments
- Cost field present in JSON (will be suppressed in UI in Session 8)
- Five vetting questions surfaced for every live act recommendation

Document any output failures as specific system prompt fixes. Do not patch in Session 3 — document and schedule for Session 1b redux if needed.

---

## Session 4 — Claude Code
**Ceremony knowledge → MIL + production check coherence**

**Task 1:** Pass ceremony summary output as context to generate-mil-a.js. The ceremony summary (generate-ceremony-summary.js) has full access to ceremony knowledge base v3.0. The MIL ceremony recommendation currently does not. Fix by adding ceremony summary to the MIL input payload.

Input payload update:
```js
{
  portrait: "...",
  sessionAnswers: { ... },         // includes venue_type
  momentAnswers: { ... },          // includes song_question per moment
  milAnswers: { mil_budget: "...", mil_existing_bookings: "..." },
  coupleName: "...",
  ceremonySummary: "..."           // ADD THIS — pass output of generate-ceremony-summary.js
}
```

**Task 2:** Verify production check coherence fix from Session 1b is working correctly across three test sessions.

---

## Session 5 — Claude Code
**Session persistence to Supabase**

**Problem:** localStorage only. If browser clears cache or device switches, couple loses all answers. This is a trust issue for a paid product.

**Fix:** Once email is captured at portrait screen, all subsequent answers persist to Supabase keyed to email. Return on any device, pick up exactly where left off.

**Architecture:**
- Extend save-session.js to accept incremental answer updates, not just final submission
- Write to Supabase on each deep-dive completion
- On app load, check for existing session by email if available
- Restore full session state from Supabase on return visit

---

## Session 6 — Claude.ai
**Copy audit**

Full audit of all copy visible to the couple: discovery session questions, acknowledgements, moment deep-dive questions, song questions, portrait screen, moment map, brief screen tabs, confirmation flow, payment screen, error states.

Check against banned word list. Check "you both" preference. Check sincerity and no performance of emotion. Check that nothing tells the couple how to feel. Produce rewrite list with exact before/after for each change. Session 7 (Claude Code) implements the rewrites.

---

## Session 7 — Claude Code
**Stage 3 — Music Education Layer**

New component. New generation function.

**What it does:** Before the couple receives any recommendations (Stage 4), they receive moment-by-moment education cards — warm, specific to their answers, explaining why the direction they're heading works for what they said they want.

**Content per card (generated per couple from their specific answers):**
- Why the ensemble or format they're heading toward works for their answers
- What creates the feeling they described in practice
- One thing that kills that feeling (without being prescriptive)
- What to listen for when evaluating an act for this moment

**Gate:** Couple reads and confirms each card before Stage 4 (Music Plan) unlocks for that moment.

**New function:** `generate-education-layer.js`
Model: `claude-haiku-4-5-20251001`
Input: sessionAnswers + momentAnswers per moment + portrait
Output: JSON array of nine education cards
Tone: warm, accessible, specific to this couple's answers — never generic

**New component:** `EducationLayerScreen.jsx`
Renders education cards one moment at a time. Confirm button per card. Progress tracked in state.

---

## Session 8 — Claude Code
**Stage 4/5 — MIL output rebalancing + BriefScreen restructure**

**Task 1 — MIL output rebalancing**
Adjust MIL system prompt to weight output 30% recommendation / 70% brief instruction.
The recommendation tells the couple what direction to go.
The brief instruction tells their act how to execute it on the night.
Costs remain in JSON output but suppressed in Stage 4 render.

**Task 2 — BriefScreen tab restructure**
Current tabs: Music Plan | Your Brief | Coordinator's Brief
New tabs: Music Plan | How to Book | Coordinator Brief

Music Plan tab: MIL output rendered with `cost` field suppressed.
How to Book tab: same MIL JSON with `cost` rendered + five vetting questions embedded per live act recommendation + booking sequence guidance.
Coordinator Brief tab: generate-brief-b.js output, unchanged.

**Task 3 — Stage 4 gate**
Music Plan tab confirms with a button before How to Book tab is accessible.
How to Book tab accessible immediately after.
Coordinator Brief tab accessible immediately after How to Book.

---

## Session 9 — Claude Code
**Spotify integration**

One wedin.ai Spotify app account. No couple login. Playlists generated server-side after MIL completes. Links added to milRecommendations per moment.

Architecture details in wedin-cto-SKILL.md. Song question outputs from each deep-dive feed the playlist generation per moment. Load wedin-cto-SKILL.md at the start of this session.

---

## Session 10 — Claude Code
**Stage 7 — Artist Brief**

New generation function per act type.

**Per-act brief covers:**
- Specific instructions for this act for their assigned moments
- Named songs referenced
- Coordinator handoff note
- Vetting questions reframed as pre-booking checklist
- Tone and energy brief for the moment

**New functions:**
- `generate-artist-brief-dj.js`
- `generate-artist-brief-band.js`
- `generate-artist-brief-other.js` (string quartet, solo, etc.)

**New component:** `ArtistBriefScreen.jsx`
Couple selects which acts they've booked or shortlisted. Brief generated per act. Copy to clipboard per brief.

**Pricing model:** Whether Stage 7 is included in R699 or priced separately — decision required before this session begins. Raise with Rus.

---

## Session 11 — Claude Code
**Legal pages + cookie banner**

Add `/terms` and `/privacy` static routes to React app. Add footer links. Cookie consent banner appears on first visit, accept/decline, choice remembered.

T&Cs and Privacy Policy content is drafted and ready — see CLAUDE.md Legal section.

---

## Session 12 — Claude Code
**PayFast integration**

Replace Stripe. Research PayFast account setup for Tones of Note PTY (Ltd) before session begins.

Swap `create-checkout-session.js` and `verify-payment.js`. Add PayFast webhook signature verification. Update T&Cs and Privacy Policy to reference PayFast. Test full payment flow end-to-end on staging before going live. Do not leave this to the final 48 hours before launch.

Also in this session: rate limiting on Netlify functions, Supabase RLS audit, data deletion mechanism.

---

## Session 13 — Claude Code
**Pre-launch QA + debug cleanup**

Full flow on real mobile device. All 9 moments. All 7 stages. Payment. Email delivery. Session restore from Supabase.

Remove diagnostic console.log lines: MIL-A raw response, Brief-B raw response logs added during debugging. Remove success path logs. Leave error logs.

Coordinator brief email delivery via Resend — planners and coordinators need this. Build if not done.

Final check against security pre-launch checklist in CLAUDE.md.

---

## Deferred to Post-Launch — Do Not Build Before Go-Live

- Section-level brief regeneration
- Brief accuracy score 1–5
- Optional moments
- Band-matched landing pages (5 versions)
- Referral mechanism (10% rebate)
- PDF download
- UK market adaptation
- MIL streaming / collapse mil-a and mil-b into single streaming function
- Artist directory (Phase 3)
- Planner dashboard (Phase 3)
- Stage 7 pricing model decision
