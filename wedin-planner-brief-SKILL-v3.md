---
name: wedin-planner-brief
description: Activated when generating, reviewing, or improving planner briefs from wedin.ai discovery session outputs. Use this skill whenever producing a music brief document, designing the brief generator, reviewing brief structure, or working on any output that gets handed to a wedding planner or music act. Also use when considering SA-specific brief requirements including load-shedding contingency, cultural elements, and destination wedding considerations.
---

# wedin-planner-brief

## The Brief's Job

A great music brief means the planner can walk into a supplier meeting with authority, brief an act without the couple present, and make in-the-moment decisions on the day that honour the couple's vision.

Most planners receive no structured handover of the couple's music vision — they're expected to divine it from scattered conversations and a vague Pinterest board. The wedin.ai brief eliminates this entirely.

The brief must be specific enough to be actionable and personal enough to feel like it was written for this couple — never generic filler.

---

## Current Brief Architecture — As Built (March 2026)

The live product generates three outputs after the couple completes all 9 deep-dives:

**Output 1 — Couple's Brief (generate-brief-a.js)**
Emotional mirror. Second person to the couple. Overview paragraph + 9 moments in warm prose. No act recommendations. Generated first — the couple reads this before seeing act recommendations.

**Output 2 — Coordinator's Brief (generate-brief-b.js)**
Operational document. Second person to the coordinator ("your couple has chosen", "instruct your act"). Every moment ends with a verb-led operational instruction. Professional, direct, actionable.

**Output 3 — Music Plan (generate-mil-a.js + generate-mil-b.js)**
Act recommendations per moment. Generated after the couple reviews the brief and answers two intake questions: total music budget and any acts already booked. Includes production reality check surfacing PA, stage, generator, VAT, and travel costs.

The seven-section aspirational brief structure below represents the target for future development. The current AI-generated output covers the core content across all three outputs, with section-level brief regeneration as a planned enhancement.

---

## Spend-Level Calibration

The brief must match the couple's actual music plan. A Band 2 couple with a DJ and a Spotify ceremony playlist needs a brief that is just as useful as one for a Band 5 couple with five live acts and a sound engineer. The measure of quality is not complexity — it is clarity.

**Apply these rules:**

- If a moment has no live act assigned, document what's playing (DJ, streaming playlist, band's own background set) — never leave a moment blank
- Only include the Music Technical Table (Section 5) if there is at least one act requiring a sound check; omit it for fully self-organised couples
- The Do Not Play list matters equally at every spend level
- Coordinator Cue Language (Section 6) scales naturally — even a small celebration has transition moments that need a signal
- Cultural and load-shedding sections are required regardless of spend level — these are risk items, not luxury items

**Band calibration guide — locked definition:**

| Band | Guest Count | Typical music setup | Brief emphasis |
|------|------------|--------------------|-|
| Band 1 — Intimate | 0–50 | DJ or streaming only | Moment Map + Do Not Play + key song list |
| Band 2 — Mid-Size ★ | 51–120 | DJ + possibly one ceremony act | Moment Map + DJ brief + sound check basics |
| Band 3 — Classic ★ | 121–220 | Band or DJ + ceremony act | Full brief + Technical Table + handover choreography |
| Band 4 — Grand | 221–350 | Multiple acts + sound engineer | Full brief + Technical Table + Coordinator Cues + full contingency |
| Band 5 — Spectacular | 350+ | Multiple acts, complex day | Full brief + Technical Table + per-zone PA specs + full contingency |

★ = primary target segments

---

## Brief Structure — Seven Sections

### Section 1: Wedding Identity Summary

| Field | Content |
|-------|---------|
| Couple names | First names only in the brief header |
| Wedding date | |
| Venue | Name + location + indoor/outdoor mix |
| Guest count | Exact number + band classification |
| Three-word feeling | Derived from discovery session (e.g. "Warm, Intimate, Joyful") |
| Formality level | 1–5 scale with descriptor (1 = garden party, 5 = cathedral formal) |
| Cultural / traditional elements | Explicit list — never vague. "Zulu umembeso ceremony, 45 minutes, before Western ceremony" not "some traditional elements" |
| Non-negotiables | Must-play list + must-avoid list, both with reasons |

---

### Section 2: Moment-by-Moment Music Map

A table covering each moment of the day. This is the operational core of the brief.

| Moment | Act Type | Tone | Key Songs / References | Energy Level (1–5) | Duration | Notes |
|--------|----------|------|----------------------|-------------------|----------|-------|
| Pre-ceremony | | | | | | |
| Processional | | | | | | |
| Signing | | | | | | |
| Recessional | | | | | | |
| Pre-drinks / cocktail | | | | | | |
| Dinner | | | | | | |
| First dance | | | | | | |
| Parent dances | | | | | | |
| Peak reception | | | | | | |
| Last song | | | | | | |

**Energy arc principle:** The common mistake is peaking too early or creating a dead zone after dinner. The brief must explicitly map the energy arc — when it builds, when it peaks, how it sustains, how it closes.

**For Band 3 and above:** The brief must address the dinner-to-dance-floor transition explicitly. This is the hardest moment of the day to manage and the one most often left unplanned.

**Transition moments that are often missing and must be included:**
- Ceremony end → pre-drinks walk (what plays, who starts it, does a live act walk with guests)
- Pre-drinks → reception entrance (DJ/act cue, named entrance song)
- Dinner → first dance (how the floor opens, who announces it, what plays)
- First dance → general dancing (does the act stay on stage, does the DJ take over)

---

### Section 3: Artist Shortlist

For each recommended act:

| Field | Content |
|-------|---------|
| Act name and category | |
| Why they fit this couple | Specific reasons referencing discovery session answers — not "they're great" but "their Cape Jazz repertoire maps to the Sunday afternoon Kippie's feeling you described" |
| Reference playlist | Spotify link |
| Venue suitability | Has played this venue / similar venue type / outdoor capability |
| Budget position | Where they sit within the couple's music budget |
| Availability confirmed | Yes / No / Not yet checked |
| Lead time required | String quartets 10–12 weeks; jazz acts 6–8 weeks; DJs 4–6 weeks |

---

### Section 4: Coordination Notes

- Who manages act coordination on the day — planner / couple / venue coordinator
- MC responsibilities — who, when, what script or tone
- Contingency protocol — what happens if an act is delayed, sick, or unable to perform
- Power contingency — **load-shedding plan explicitly stated for every electronic act and DJ**
- Production cost disclosure — any acts requiring stage, PA, generator, or sound engineer beyond the act fee must be flagged here with estimated cost range

---

### Section 5: Music Technical Table

*Include for Band 3 and above, or any wedding with one or more acts requiring a dedicated sound check.*
*Omit for fully self-organised couples (streaming-only, DJ with no formal sound check requirement).*

| Moment | Act | Setup Time | Sound Check | Playing Time | Stage / PA Required | Coordinator Cue | Key Songs |
|--------|-----|------------|-------------|--------------|---------------------|-----------------|-----------|
| Pre-ceremony | | | | | | | Background |
| Ceremony | | | | | | | Processional songs |
| Pre-drinks | | | | | | | |
| Cultural moment | | | | | | | |
| Dinner | | | | | | | Entrance song |
| First dance | | | | | | | Named song |
| Dancing | | | | | | | Floor-opener |
| Last song | | | | | | | Named song |

**Standard SA setup timing benchmarks (Tones of Note / F-Sharp production data):**
- Complex multi-act weddings: sound and staging installed the day before
- Day-of setup: act arrives 08h00 for 16h00 ceremony; venue cleared by 12h00; sound checks by 13h15–13h30
- Standard power: Ceremony PA = 15A single phase; Pre-drinks PA = 15A single phase; Reception PA = 32A 3-phase

**Production costs to always flag (Band 3–5):**
- Stage hire: R8,000–R18,000
- PA + sound engineer: R15,000–R45,000 multi-zone
- Generator (if venue cannot supply adequate power): R8,000–R20,000
- VAT (15%): applies to all professional bookings
- Travel: R5–R10/km outside local metro + accommodation if overnight

These costs are separate from the act fee and are frequently not disclosed by acts at quote stage. Always surface them.

---

### Section 6: Coordinator Cue Language

*Gives the planner exact sentences for every musical transition. Formatted for direct insertion into a run sheet.*

**Cue template format:**
[Time] → [Who gives the cue] → [Exact action] → [Act response]

**Standard transition cues:**

**Arrival / pre-ceremony:**
> Background music playing. [Act name] on standby. No cue needed — music plays from guest arrival.

**Ceremony start:**
> [Coordinator name] to give signal to [act/DJ]. Processional music commences. Groom and retinue in position at [location].

**Ceremony end → pre-drinks:**
> Recessional music plays as couple walk the aisle. As couple exit, [DJ/act] transitions to pre-drinks set. Waiters positioned with pre-poured drinks as first guests arrive.

**Pre-drinks → reception entrance:**
> At approximately [time] or on [coordinator's] signal: MC asks guests to follow couple to [location]. [DJ/act] continues until last guest transitions. [Act] begins reception set once guests arrive.

**Dinner entrance:**
> [MC name] to announce the bridal couple at [time]. [DJ/act] to play [named entrance song]. Couple enter and walk to table.

**First dance:**
> At end of [last speech]: MC announces first dance. [DJ/act] cues [first dance song]. [Optional: guests invited to join at [time].]

**Last song:**
> At approximately [time] or on [coordinator's] signal: [DJ/act] to play last song [name if specified]. After last song, bar closes / venue thanks guests.

**Scaling:** For Band 1–2 (DJ self-directing), simplified version appropriate — ceremony start, entrance song, first dance, last song. For Band 4–5 (multiple acts), every transition needs an explicit cue including act-to-act handovers.

---

### Section 7: Do Not Play List

An explicit list of songs, genres, or energy levels to avoid — with the reason for each. Written in plain language the act can actually use.

Examples of required specificity:
- "No 'YMCA' or similar party-starter clichés — this couple has been to too many weddings where this happened"
- "No EDM or hard electronic — their oldest guest is 78 and they want her on the dance floor"
- "No Afrikaans music — acknowledged cultural tension with one side of the family"

Vague entries like "no cheesy songs" are not acceptable. If the couple said it vaguely, the brief must translate it into something actionable.

---

### Section 8: Couple's Own Words

Direct quotes from the discovery session. 3–5 quotes capturing who this couple is.

Purpose: reminds the planner and any act that there are real people and real emotions behind the specification. The last thing the planner reads before a briefing call with an act.

Examples of required specificity:
- "We want it to feel like the best house party anyone has ever been to — but with better lighting."
- "My grandmother came from Durban. The Cape Malay choir is for her."
- "We've been to too many weddings where the music felt like it was for everyone and no one. We want ours to feel unmistakably like us."

---

## SA-Specific Brief Requirements

### Load-Shedding Contingency
Every brief must include an explicit power contingency plan for any electronic act, DJ, or amplified performance:
- Generator availability confirmed (venue or act-supplied)
- Changeover time if power fails
- Which moments are highest-risk (ceremony is most sensitive — cannot be paused)
- Act's own contingency equipment (battery-powered PA, acoustic backup)

This is a section competitors ignore entirely. wedin.ai owns it.

### Cultural Elements
If any cultural or traditional elements are present:
- Named explicitly with ceremony type, approximate duration, and music requirements
- Traditional music requirements separated from Western reception music
- Handover between traditional and Western elements explicitly scripted
- Acts confirmed to have genuine cultural competency

### Destination Wedding Additions
For ICP-3 (Destination Couple) briefs:
- Remote vetting notes — structured feedback from act evaluation sessions
- SA music translation layer — "you described wanting something like Jamie Cullum; here's why we've recommended [SA act] and what to listen for"
- International guest considerations — musical reference points that work across SA and the couple's home country
- Time zone coordination notes for the planner

---

## Brief Quality Standards

Before any brief is delivered:

- [ ] Three-word feeling descriptor specific to this couple — not generic
- [ ] Every moment has an assigned act type — no blank rows
- [ ] Every transition moment between acts documented
- [ ] Energy arc explicitly mapped — peak moment identified
- [ ] Load-shedding contingency present for all electronic acts
- [ ] Do not play list has reasons, not just song titles
- [ ] Artist shortlist includes specific why-they-fit reasoning tied to discovery session answers
- [ ] Couple's own words contains actual quotes, not paraphrases
- [ ] Cultural elements (if any) named and sequenced with handover cues
- [ ] Music Technical Table present if Band 3+ or any act requires sound check
- [ ] Coordinator cues cover all key transition moments
- [ ] Production costs (stage, PA, generator, VAT, travel) flagged
- [ ] Brief reads like it was written for this specific couple — not a template

---

## Brief Tone

The brief is a professional document — but it carries the wedin.ai voice. It is not a corporate specification sheet. It is a document written by someone who understood this couple deeply and wants the planner and every act to understand them too.

Write it the way a great music director would brief their team before a performance they care about.

The wedin.ai voice rules apply: no banned words, no generic wedding language, specific beats generic always.
