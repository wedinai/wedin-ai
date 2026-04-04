---
name: wedin-moment-architect
description: Activated when designing, building, reviewing, or improving the wedin.ai paid deep-dive session — the post-payment product that takes a couple through every musical moment of their day and produces a complete planner brief. Use this skill whenever working on the Moment Map UI, the per-moment conversation flows, the Music Intelligence Layer logic, the brief assembly engine, or any moment-specific question or educate copy. This is the core paid product.
---

# wedin-moment-architect

## What This Session Is

The deep-dive session is the paid core of wedin.ai. Entered after: discovery session → music portrait → email capture → payment (R699).

The discovery session asks: *who are you and what do you want to feel?*
The deep-dive session asks: *how do we make that happen, moment by moment?*

---

## Current Build Status — March 2026

All 9 deep-dives are built and live. Each saves to a named momentAnswers object.

**Flow as built:**
1. Couple completes all 9 deep-dives in any order
2. Moment Map shows "All 9 moments complete. Your brief is ready to build."
3. "Build my brief →" → generates couple's brief and coordinator's brief in parallel
4. BriefScreen: three tabs — Music Plan | Your Brief | Coordinator's Brief
5. "Build my music plan →" → PostBriefScreen with MIL CTA
6. MIL intake: two questions (budget + existing bookings)
7. Music plan generates in parallel (generate-mil-a.js + generate-mil-b.js)
8. Music Plan tab populated with per-moment recommendations

**Important:** The MIL runs ONCE after all 9 moments complete and the couple has reviewed their brief — not after each individual moment. Budget is asked at MIL intake, not in discovery.

---

## The Three-Output Architecture

**Output 1 — Couple's Brief (generate-brief-a.js)**
Emotional mirror. Second person to the couple. Overview + 9 moments in warm prose. No act recommendations.

**Output 2 — Coordinator's Brief (generate-brief-b.js)**
Operational document. Second person to coordinator. Every moment ends with verb-led operational instruction.

**Output 3 — Music Plan (generate-mil-a.js + generate-mil-b.js)**
Act recommendations per moment. JSON rendered to React components in Music Plan tab. Generated after brief review and two intake questions.

---

## The 9 Moments — Built and Live

| # | Moment | Component | momentAnswers key |
|---|--------|-----------|-------------------|
| 1 | Guest Arrivals | GuestArrivalsDeepDive.jsx | guestArrivals |
| 2 | Ceremony | CeremonyDeepDive.jsx | ceremony |
| 3 | Pre-drinks | PreDrinksDeepDive.jsx | predrinks |
| 4 | Your Entrance | EntranceDeepDive.jsx | entrance |
| 5 | Dinner | DinnerDeepDive.jsx | dinner |
| 6 | Speeches | SpeechesDeepDive.jsx | speeches |
| 7 | First Dance | FirstDanceDeepDive.jsx | firstDance |
| 8 | Dancing | DancingDeepDive.jsx | dancing |
| 9 | Last Song | LastSongDeepDive.jsx | lastSong |

---

## Per-Moment Conversation Design

Each moment follows three acts:

**Act 1 — Educate:** One sentence on what this moment actually does. Most couples have never thought about it.

**Act 2 — Ask:** 2–4 questions per moment. Emotionally led, practically grounded.

**Act 3 — Complete:** Completion screen confirms moment saved. Returns to Moment Map.

---

## "Other — Tell Us More" Pattern

All chip questions across all 9 deep-dives include "Other — tell us more" as the final chip.
- Does NOT auto-advance — reveals text input
- Saves as "Other: [text]" prefix
- CeremonyDeepDive ceremony_faith and protestant_denomination untouched

---

## Inline Term Explanations

Unfamiliar terms explained inline:
- "Pre-drinks (the drinks reception between your ceremony and dinner)"
- "Recessional (your walk back down the aisle as a married couple)"
- "Processional (your walk down the aisle)"

Add similar explanations whenever a specialist term is introduced.

---

## Per-Moment Educate Lines (current live copy)

**Guest Arrivals:** "This is the first musical impression of your day — before the ceremony begins, before anyone is seated. What guests hear in this first moment shapes how they arrive at everything that follows."

**Ceremony:** "The ceremony is the part everyone watches in silence. The music you choose works differently here — it carries weight precisely because it has no competition."

**Pre-drinks:** "Pre-drinks (the drinks reception between your ceremony and dinner) is the most underplanned moment of the day. And the one that sets the tone for everything after."

**Your Entrance:** "Your entrance into the reception is a choreographic moment — more planned than most couples realise."

**Dinner:** "Dinner is a long moment — often 90 minutes or more. The music here has to sustain conversation and build anticipation for what comes after."

**Speeches:** "Personalised intro songs for speakers are one of the most underused touches in wedding music. Done well, they make each speaker feel seen before they've said a word."

**First Dance:** "The first dance is the most visible musical moment of the night — but what the dance does to the room, and what comes immediately after it, matters just as much as the song."

**Dancing:** "The dance floor arc — how energy builds, peaks, and sustains — is the thing guests remember most. It's not just about the songs. It's about sequencing, reading the room, and knowing exactly when to push and when to pull back."

**Last Song:** "The last song is the one everyone hears as they walk to their car. Most couples never choose it. It ends up being whatever the DJ had queued."

---

## Per-Moment Question Banks

### Guest Arrivals
- "As guests arrive, do you want the music to catch their attention and signal something special is happening — or simply create a warm, welcoming atmosphere in the background?"
- "Will guests be arriving into an outdoor space or an interior? And how long will arrivals typically take?"
- "Is there a musical style or reference that feels right for this moment?"

### Ceremony
CeremonyDeepDive has full faith tradition sub-flows. See generate-ceremony-summary.js and ceremony knowledge base v2.0 in ceremonyKnowledge.js.

Key questions: religious/cultural structure (feeds faith sub-flow branching), processional song choice, signing music, recessional choice, live vs recorded preference.

Ceremony summary generates automatically on completion — second person to couple, warm voice, flags planning gaps as opportunities not omissions. Three tone consistency rules active (no "you need to", no "You haven't", ends with forward-facing sentence).

**Known gap:** Ceremony knowledge base is in generate-ceremony-summary.js but NOT in generate-mil-a.js. MIL ceremony recommendation is thinner as a result. Fix: pass ceremony summary as context to generate-mil-a.js.

### Pre-drinks
- "During pre-drinks, will you be mostly with your guests — or will you be away for photos?"
- "Do you want something people will notice and talk about — or excellent curated music that creates atmosphere without demanding attention?"
- "Pre-drinks often runs 60–90 minutes. Is there a moment partway through where you'd like the energy to shift?"

### Your Entrance
- "How do you want to enter the reception? Grand and announced, or something more intimate?"
- "Is there a transition you'd like to mark?"
- "Have you thought about using live musicians to physically lead guests somewhere?"

### Dinner
- "During dinner, do you want the music to create warmth and conversation — or carry energy and build anticipation toward the dancing?"
- "How many speeches are you expecting, and roughly how long will they run?"
- "Is there a moment during dinner where you'd like the energy to shift?"

### Speeches
- "Which speakers will you have?"
- "For each speaker, is there a song that captures their personality or your relationship with them?"
- "Should the intro songs be a surprise to the speakers?"

### First Dance
- "Have you chosen your first dance song?"
- "What should the first dance do to the room — settle everyone in warmly, or blow the floor open with energy?"
- "Live performance or original recording?"
- "What happens the moment the first dance ends?"

### Dancing
- "How do you want the energy to move across the night?"
- "What's the age range of your guest mix, and how important is it that everyone gets their moment?"
- "Are there specific songs you know will empty the floor?"
- "Is there a moment you want to create — a song everyone will sing along to?"

### Last Song
- "Have you thought about your last song?"
- "Warm emotional close — or one final burst of energy?"
- "Is there a song that would feel unmistakably like you as the closing note of this day?"

---

## Ceremony Deep-Dive — Special Architecture

Full faith tradition sub-flows. Supported: Jewish (Orthodox/Conservative/Reform), Muslim/Cape Malay, Hindu (Tamil + North Indian/Gujarati), Catholic, Greek Orthodox, Protestant (Anglican/Methodist/Baptist/Pentecostal), NG Kerk, Interfaith.

Each tradition sub-flow surfaces tradition-specific musical requirements from ceremony knowledge base v2.0 embedded in generate-ceremony-summary.js.

---

## Music Intelligence Layer — Actual Architecture

**When it runs:** After all 9 moments complete, brief reviewed, two intake questions answered.

**How:** Two parallel functions (generate-mil-a.js + generate-mil-b.js) via Promise.all. Combined client-side.

**What it generates:** JSON with moments array (overview + 9 moments, each with recommendation/why/cost/instruction) and productionCheck. Rendered as React in Music Plan tab.

**Key rules:**
- Two-act architecture
- 90-minute live act maximum
- Ensemble-to-room-size: solo only under 30 guests; duo minimum for standard dinner; trio for 60+ guests
- DJ PLUS architecture for R30k–R60k budgets
- Guilty pleasure — one moment maximum
- Single reference per moment
- Sparse data — describe feeling, don't invent setlists
- Production costs always surfaced

---

## Brief Assembly Engine — Actual Architecture

**generate-brief-a.js:** Claude haiku, max_tokens 2500, 2nd person to couple, 3–4 sentences per moment.

**generate-brief-b.js:** Claude haiku, max_tokens 2500, 2nd person to coordinator, verb-led instructions, JSON regex fallback.

Both called in parallel via Promise.all. AbortController prevents 504 on repeat generation.

---

## UX Principles

- Map not checklist — each moment is a stop, not a task
- Each moment session is contained — enter, complete, return
- Saving is automatic — every answer persists to localStorage
- Incompleteness is never shaming — partial brief is infinitely better than no brief
- Optional moments (not yet built) — couples should be able to mark moments as not applicable

---

## Band Classification — Locked Definition

| Guest Count | Band | Notes |
|-------------|------|-------|
| 0–50 | Band 1 — Intimate | Every choice is noticed |
| 51–120 | Band 2 — Mid-Size ★ | Most decision-rich band |
| 121–220 | Band 3 — Classic ★ | Full music strategy |
| 221–350 | Band 4 — Grand | Production-level considerations |
| 350+ | Band 5 — Spectacular | Specialist production partners |

★ = primary target segments
