# wedin.ai — Launch Sessions
## Updated May 1, 2026

Load alongside CLAUDE.md at the start of every Claude Code session. CLAUDE.md is the architectural reference. This document is the build sequencing reference. Do not duplicate content between them.

---

## Locked Design Principles — Apply to All Sessions

**Timing ownership:** wedin.ai owns sequence, duration, and arc. The coordinator owns clock time. No clock times in any brief output. Ever. Express all timing as duration and sequence only.

**Coordinator profile:** Three profiles — professional / venue / volunteer. generate-brief-b.js calibrates to the profile captured on MIL intake screen. Full specification in wedin-planner-brief-SKILL-v5.md. Implemented Session 8 — complete.

**MIL caution protocol:** Never modify generate-mil-a.js or generate-mil-b.js system prompts without completing a Part A test in Claude.ai first. One rule at a time. Test against Scenarios 5, 12, 13, and 17 after each change. Check MIL-A duration under 20 seconds and MIL-B under 25 seconds. Revert immediately if any output degrades.

**MIL moment split (locked May 1 2026):** generate-mil-a.js covers overview + Guest Arrivals + Ceremony + Pre-drinks. generate-mil-b.js covers Your Entrance + Dinner + Speeches + First Dance + Dancing + Last Song. productionCheck removed entirely. Do not change this split without explicit instruction.

**Artist Brief pricing:** Included in R699. Locked. Do not relitigate. Deferred post-launch.

**Output document access:** Generated outputs live in React state and localStorage. Email outputs from Session 6 are the launch solution for document access. Persistent in-product document storage is post-launch.

---

## Critical Path — These Block Launch

1. **PayFast merchant account** — admin task, not a build task. Must be live with sandbox test credentials before Session 11 opens.
2. **Session 10b (Budget Tab)** — productionCheck removed from MIL. Budget information must be delivered via generate-budget.js before launch.
3. **Session 12 (QA)** — always finds things. Budget full 3 hours. Expect a fix session after.

---

## Session Summary

| Session | Type | Focus | Est. Hours | Status |
|---------|------|-------|------------|--------|
| 6 | Claude Code | Email outputs + remarketing | 3–4 | ✓ COMPLETE |
| Flow fix + Session 7 | Claude Code | WeddingSoundtrackScreen + flow fix | 2.5 | ✓ COMPLETE |
| Copy audit | Claude Code | Naming + copy changes — React components + email functions | 1–2 | ✓ COMPLETE |
| 8 | Claude Code | Coordinator profile + brief calibration | 3–4 | ✓ COMPLETE — April 30 |
| 9 | Claude Code | Artist Brief (Stage 7) | 4–5 | DEFERRED — post-launch |
| 10 | Claude.ai + Claude Code | MIL architectural restructure + rule additions | 2–3 | ✓ COMPLETE — May 1 |
| 10b | Claude Code | Budget Tab — generate-budget.js + "What This Costs" tab | 2–3 | ✓ COMPLETE — May 1 |
| 10c | Claude Code | Completion card + consolidated email + UX fixes | 2–3 | ✓ COMPLETE — May 3 |
| 11 | Claude Code | PayFast + security hardening | 2–3 | NEXT |
| 12 | Claude Code | Pre-launch QA | 3+ | Last |

---

## Session 6 — Claude Code ✓ COMPLETE
### Email outputs + remarketing trigger

**Built and deployed:**
- Two-touch remarketing sequence — Touch 1 at 48 hours, Touch 2 at 7 days
- Email deduplication by most recent session per email address
- remarketing_touch column in Supabase sessions table (integer, default 0)
- milComplete flag written to Supabase state on MIL completion
- Music Plan email button on BriefScreen Music Plan tab
- How to Book email button on BriefScreen How to Book tab
- Coordinator Brief email — couple inputs coordinator address, sent directly via Resend
- handleCopy bug fixed on How to Book tab (was copying coupleBrief, now copies How to Book content)

---

## Session 7 — Claude Code ✓ COMPLETE
### WeddingSoundtrackScreen + flow fix
*Shipped: April 29, 2026*

**What changed:**
MEL summary screen concept dropped entirely. generate-brief-a.js output now displays on WeddingSoundtrackScreen before MILIntakeScreen. coupleBrief stored in App.jsx state — generated once, passed to BriefScreen as prop, BriefScreen skips generate-brief-a.js if prop present.

**Built and deployed:**
- handleGenerateBrief routes to setView('weddingSoundtrack')
- Supabase restore routes to setView('weddingSoundtrack') for 9 confirmed moments + no MIL
- WeddingSoundtrackScreen.jsx — self-generates, gold label, Cormorant headings, gold-bordered content, markdown headings rendered as gold DM Sans uppercase labels
- coupleBrief added to App.jsx state via onSetCoupleBrief callback
- send-wedding-soundtrack.js — Resend function, gold-bordered email, restore link CTA
- PostBriefScreen retained as safe fallback only

---

## Copy Audit — Claude Code ✓ COMPLETE
### Naming + copy changes across React components and email functions
*Shipped: April 29, 2026 — commit 5cc9d70*

**Built and deployed:**
- MomentMap.jsx — all CTA copy, status lines, button labels updated
- CompletionScreen.jsx — portrait confirmation CTA updated
- MusicPortrait.jsx — email capture card, saveState done body updated
- BriefScreen.jsx — page heading, sub-heading, not_sure disclaimer added, dead button removed
- App.jsx — milBudget state wired through to BriefScreen
- MILIntakeScreen.jsx — fully merged to one screen, step counter removed, budget question reframed, bookings question fades in below budget
- send-remarketing.js, send-music-plan.js — email copy updated

**Post-launch cleanup logged:**
- Internal tab ID 'couple' (How to Book tab) — harmless mismatch, deferred

---

## Session 8 — Claude Code ✓ COMPLETE
### Coordinator profile + generate-brief-b.js calibration
*Shipped: April 30, 2026 — commit 7f9d0d2*

**Pre-session work completed:** Three coordinator profile prompt additions drafted and tested in Claude.ai against real scenarios before Claude Code opened. All 12 checklist items verified.

**Built and deployed:**

**Task 1 — MILIntakeScreen.jsx:**
- coordinator_profile chip question added as third chip section
- Fades in after bookings selection using fadeUp pattern
- Question copy: "One last thing — who will be coordinating the music on the day?"
- Options: "We have a professional coordinator" (professional) / "The venue is providing a coordinator" (venue) / "A friend or family member is helping out" (volunteer)
- Default if not answered: venue

**Task 2 — App.jsx + BriefScreen.jsx:**
- coordinatorProfile state added to App.jsx, default 'venue'
- Extracted in handleMILComplete from answers.coordinator_profile
- Passed to BriefScreen as prop
- BriefScreen includes coordinatorProfile in generate-brief-b.js fetch body

**Task 3 — generate-brief-b.js:**
- SYSTEM_PROMPT converted to getSystemPrompt(coordinatorProfile) function
- Three profile instructions injected based on coordinator_profile value:
  - professional: peer-to-peer, industry terminology (cue sheet, pre-brief, sound check window, load-in, PA spec), concise, assumed prior knowledge, focus on couple-specific not general process
  - venue: self-contained, full couple context, professional but no assumed prior knowledge of couple
  - volunteer: plain language, no jargon, one clear action per moment, named person at every transition, what-to-do-if-something-goes-wrong guidance, warm encouraging tone
- TIMING rule appended unconditionally — no clock times in any profile output

**Session restore:** coordinator_profile NOT required for restore — default 'venue' is safe fallback.

---

## Session 9 — DEFERRED post-launch
### Artist Brief — Stage 7

**Decision made May 1, 2026:** Artist Brief deferred post-launch.

**Reasoning:** The artist brief has genuine value but requires a confirmed booking to be useful. Most couples using wedin.ai at launch will not have booked acts yet — they're planning, not confirming. Delivering a detailed document to a booked act months before the wedding, when timing, venue run sheets, and song choices will all change, creates false certainty. The brief would need to be regenerated closer to the wedding date anyway. A re-engagement flow (couple returns 6-8 weeks before wedding to generate final confirmed documents) is the correct version of this feature and is post-launch work.

**What remains valid from the original Session 9 spec:** The three generate-artist-brief-[type].js functions and ArtistBriefScreen.jsx spec is correct and can be built post-launch unchanged. Add to Phase 3 list.

---

## Session 10 — Claude.ai + Claude Code ✓ COMPLETE
### MIL architectural restructure + rule additions
*Shipped: May 1, 2026*

**Context:** generate-mil-a.js was truncating on complex scenarios (Scenario 5 — Naledi & David). Root cause: budget key fix caused longer output per moment, tipping already-marginal scenarios over the 1800 token ceiling. Your Entrance and Dinner were both affected.

**Architectural changes:**

generate-mil-a.js now covers: overview + Guest Arrivals + Ceremony + Pre-drinks (4 entries, max_tokens 1800)

generate-mil-b.js now covers: Your Entrance + Dinner + Speeches + First Dance + Dancing + Last Song (6 moments, no productionCheck, max_tokens 2400)

Output order preserved — BriefScreen concatenates arrays naturally: overview → Guest Arrivals → Ceremony → Pre-drinks → Your Entrance → Dinner → Speeches → First Dance → Dancing → Last Song. No client-side changes needed.

productionCheck removed from generate-mil-b.js and BriefScreen render. Budget information moves to generate-budget.js (Session 10b).

**Rule additions:**

Rule 1 — generate-mil-a.js OVERVIEW RULE: "Overview must be second person only — 'You want', never '[Names] want'." Confirmed working across Scenarios 12, 13, 17.

Rule 3 — generate-mil-b.js BUDGET OVERRUN RULE: Key names corrected to match payload — under_r30k / r30_60k / r60_100k / r100_150k / r150k_plus. Confirmed working.

Rule 2 — Not implemented. Failure not confirmed as systemic in live testing. Do not add.

**Cold start behaviour:** MIL-B on Scenario 5 occasionally runs 28-30 seconds on cold start. Retry resolves reliably. Accepted pre-launch behaviour. Streaming post-launch solves permanently.

**Character limits deployed:** All 9 deep-dive components — 200 chars descriptive fields / 400 chars song fields. Live counter with colour thresholds.

**Email domain re-verified:** Resend domain wedin.ai re-verified April 30 2026. All three email functions confirmed delivering.

---

## Session 10b — Claude Code
### Budget Tab — generate-budget.js + "What This Costs" tab
*Estimated: 2–3 hours*

**Why this session exists:** productionCheck removed from MIL-B to resolve timeout pressure. Budget information needs a dedicated home. "Production Reality Check" naming was inconsistent with the product's emotional register. Budget information reframed as a planning tool the couple uses and updates over months.

**Load at session start:** CLAUDE.md + wedin-session-consolidation-may1.md

**Read before writing any code:** `/mnt/skills/public/xlsx/SKILL.md` — mandatory first step.

**Build tasks — execute in this order:**

**Task 1 — generate-budget.js (new Netlify function)**
- Receives: milRecommendations (moments array), coupleName, sessionAnswers, milAnswers
- Generates three-sheet Excel using xlsx skill
- Returns download link
- max_tokens: 1000 (budget rows only — short generation)

**Three-sheet Excel structure:**

Sheet 1 — Music Budget:
- Header row: Moment | Act Recommended | Illustrative Range | Your Quote | Variance
- One row per moment (all 9 moments, populated from MIL recommendations)
- "Your Quote" column empty — couple fills in as real quotes arrive
- Variance column: formula = Your Quote - Illustrative Range midpoint
- Total row at bottom
- Disclaimer at top in merged cell A1:E1 — exact copy: "These are market reference ranges based on SA wedding pricing as of early 2026. Every act quotes differently based on experience, lineup, travel, and availability. Use these as planning anchors, not booking commitments."

Sheet 2 — Booking Timeline:
- What to book first (from MIL bookFirst logic)
- Lead times per act type (from SA market knowledge base)
- Columns: Act | Recommended Lead Time | Your Target Date

Sheet 3 — Hidden Costs:
- PA + sound engineer / VAT 15% / Travel outside metro / Generator (outdoor only) / Stage hire
- Columns: Item | Illustrative Range | Confirmed? | Notes
- Pre-populated with ranges from SA knowledge base

**Task 2 — BriefScreen.jsx: add "What This Costs" tab**
- New fourth tab, positioned after Coordinator Brief
- Tab label: "What This Costs"
- On tab activation: trigger generate-budget.js call if not already generated
- Render: download button for Excel file + brief text summary of key costs
- Loading state while generating
- Error state with retry

**Task 3 — netlify.toml**
Add timeout entry for new function:
```toml
[functions."generate-budget"]
  timeout = 26
```

**Test before closing:**
- Run Scenarios 5, 12, and 13 through full flow including Budget tab
- Confirm Excel downloads correctly and opens with correct data
- Confirm disclaimer present on Sheet 1
- Confirm all three sheets populated
- Confirm tab renders correctly on mobile

---

## Session 10c — Claude Code ✓ COMPLETE
### Completion card + consolidated email + UX fixes
*Shipped: May 3, 2026*

**What was built:**

**Completion card — BriefScreen.jsx**
Gold left-border card rendered below all tabs, always visible regardless of active tab. Contains: "You're ready." heading, body copy naming all four outputs, reassurance line ("Your plan is saved. Use the link in your portrait email to come back any time."), email input pre-filled from `storedEmail` (editable), "Email me everything →" send button with loading/success/error states, "Want to update an answer? Return to your moment map" secondary underlined link replacing all previous "Back to Moment Map" primary buttons.

**send-complete-plan.js — new Netlify function**
Consolidated email via Resend. Three sections: YOUR WEDDING SOUNDTRACK (full coupleBrief, asterisks stripped before heading detection), YOUR MUSIC PLAN — KEY MOMENTS (moment name + recommendation only, no why/cost/instruction), YOUR OTHER OUTPUTS (plain text pointing to app for coordinator brief and budget guide). Restore link at bottom. Subject: "Your wedin.ai music plan is ready — [coupleName]".

**Email renderer fix**
`send-complete-plan.js` strips `**asterisks**` from lines before ALL-CAPS heading detection. Prevents raw Markdown rendering in email. Same fix applied as double-defence.

**Error state fix**
"Back to Moment Map" secondary link reinstated in BriefScreen error state — was accidentally removed during Session 10c changes. Error state now correctly shows: "We hit a snag" → "Try again" button → "Back to Moment Map" underlined link.

**persistState() retry**
`App.jsx` `persistState()` converted to async function with one retry on 2-second delay if first attempt fails. Silent to couple — console.error only. Protects session restore for real users on transient Supabase failures.

**Redundant ceremony screen removed**
`CeremonyDeepDive.jsx` — intermediate "Your ceremony is planned." screen removed. Ceremony flow now matches all other moments: complete deep-dive → MomentSummaryScreen with summary + two CTAs. 123 lines deleted, 4 inserted.

**Landing page copy**
All eight approved copy changes live on wedin.ai — output names updated throughout, nav CTA "Start with the music →", five deliverable cards, pricing list updated with all seven items.

---

## Session 11 — Claude Code
### PayFast integration + security hardening
*Estimated: 2–3 hours code*

**Pre-session requirement:** PayFast merchant account for Tones of Note PTY (Ltd) live with sandbox credentials in hand. Do not open this session without them.

**Load at session start:** CLAUDE.md

**Build tasks — execute in this order:**
1. Replace `create-checkout-session.js` with PayFast equivalent
2. Replace `verify-payment.js` with PayFast equivalent
3. Wire PayFast webhook signature verification
4. Update T&Cs and Privacy Policy copy to reference PayFast not Stripe
5. Add post-payment confirmation state — "You're in. Your nine moments are ready." before Moment Map loads
6. Rate limiting on all Netlify functions
7. Supabase RLS audit — confirm row-level security active on all tables
8. Data deletion mechanism — POPIA compliance, couple can request data removal
9. Test full payment flow end-to-end in PayFast sandbox on the production Netlify build

If merchant account not yet ready when session opens: complete tasks 5, 6, 7, and 8 first — none require PayFast credentials.

---

## Session 12 — Claude Code
### Pre-launch QA
*Estimated: 3 hours minimum — do not shortcut*

**Run on a real mobile device. Not browser dev tools. Not desktop.**

**Load at session start:** CLAUDE.md

**Full flow test:** Discovery session → portrait → email capture → payment → all 9 moments → "Build my wedding soundtrack →" → WeddingSoundtrackScreen → MILIntakeScreen (all three chip questions) → Music Plan → BriefScreen all four tabs → Budget tab Excel download. Real PayFast payment. All email flows triggered and confirmed arriving.

**QA checklist — tick every item before declaring launch-ready:**

Flow:
- [ ] "Build my wedding soundtrack →" on Moment Map generates WeddingSoundtrackScreen — PostBriefScreen never appears
- [ ] WeddingSoundtrackScreen loads with loading state then warm prose narrative
- [ ] Moment headings render as gold uppercase labels — no raw asterisks visible
- [ ] "Email me my wedding soundtrack →" sends and arrives correctly
- [ ] "Build my music plan →" goes to MILIntakeScreen (one screen, three chip questions)
- [ ] MILIntakeScreen shows budget → bookings → coordinator_profile in sequence
- [ ] Music Plan tab populates after MIL generates — all 10 entries in correct order
- [ ] BriefScreen coupleBrief renders from prop — generate-brief-a.js does NOT fire again on BriefScreen mount (confirm via Network tab)
- [ ] All four BriefScreen tabs populate correctly
- [ ] "What This Costs" tab generates Excel download correctly
- [ ] No productionCheck card visible anywhere in the product

Email flows:
- [ ] Portrait email arrives with working restore link that lands in correct session state
- [ ] Remarketing query targets correct sessions only (email present, milComplete absent, 48h elapsed)
- [ ] Wedding Soundtrack email sends with restore link and full narrative
- [ ] Music Plan email sends with correct content
- [ ] How to Book email sends with correct content
- [ ] Coordinator brief email arrives at external address entered by couple

Outputs and screens:
- [ ] Wedding Soundtrack narrative feels specific to this couple — warm prose, all 9 moments reflected
- [ ] Music Plan shows all 10 moments in correct order: overview → Guest Arrivals → Ceremony → Pre-drinks → Your Entrance → Dinner → Speeches → First Dance → Dancing → Last Song
- [ ] All three coordinator profile variants produce meaningfully different brief output
- [ ] No clock times appear in any coordinator brief output
- [ ] Volunteer profile includes named handoffs and what-to-do-if-something-goes-wrong guidance
- [ ] Professional profile uses industry terminology (cue sheet, pre-brief, sound check window)
- [ ] Music Plan "not sure yet" disclaimer appears when applicable
- [ ] Copy audit changes all live — check each amended screen
- [ ] Budget Excel has three sheets, disclaimer on Sheet 1, correct data populated
- [ ] Completion card visible at bottom of BriefScreen — present on all four tabs, always visible
- [ ] Completion card email input pre-filled with couple's stored email
- [ ] "Email me everything →" sends successfully — gold "Sent to [email] ✓" state
- [ ] Consolidated email arrives with correct subject, three sections, no raw asterisks, restore link works
- [ ] "Want to update an answer? Return to your moment map" secondary link present and functional
- [ ] Error state shows both "Try again" button AND "Back to Moment Map" underlined link
- [ ] No "Back to Moment Map" primary button visible anywhere in the ready state

Payment and persistence:
- [ ] PayFast payment completes and unlocks Moment Map correctly
- [ ] Post-payment confirmation state appears before Moment Map loads
- [ ] Session restore works from a completely different device
- [ ] Restore with 9 confirmed moments + no MIL → routes to WeddingSoundtrackScreen ✓
- [ ] Restore with MIL present → routes to BriefScreen ✓
- [ ] isPaid gate holds — Moment Map inaccessible without payment

Technical cleanup:
- [ ] All diagnostic console.log lines removed. Error logs remain.
- [ ] No broken loading states on mobile
- [ ] Security pre-launch checklist in CLAUDE.md fully checked

**Do not launch until every item above is ticked.**

---

## Post-Launch — Do Not Build Before Go-Live

**Product:**
- Artist Brief (Stage 7) — generate-artist-brief-dj/band/other.js + ArtistBriefScreen.jsx. Full spec in original Session 9 section above — valid, build post-launch unchanged.
- Re-engagement flow — couple returns 6-8 weeks before wedding, generates final confirmed documents for each act and coordinator. This is the correct version of the Artist Brief feature.
- Persistent in-product document access — save generated outputs to Supabase
- Section-level brief regeneration
- Brief accuracy score 1–5
- Optional moments — mark a moment as not applicable
- Second remarketing touch at 72 hours

**Growth:**
- Band-matched landing pages (5 versions)
- Referral mechanism (10% rebate)
- UK market adaptation
- Artist directory (Phase 3)
- Planner dashboard (Phase 3)
- Custom domain activation — app.wedin.ai. CNAME already configured in Netlify DNS. Activate via Netlify → wedin-ai-app → Domain management → Add custom domain → app.wedin.ai. Update all landing page CTAs from wedin-ai-app.netlify.app to app.wedin.ai after activation. See wedin-infrastructure-reference.md for full instructions.

**Technical:**
- MIL streaming — collapse mil-a and mil-b into single streaming function. Eliminates cold start timeout risk permanently. Estimated 4-6 hours. Touches generate-mil-a.js, generate-mil-b.js, MILIntakeScreen.jsx, BriefScreen.jsx.
- Apple Music integration
- PDF download
