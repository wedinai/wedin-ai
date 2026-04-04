---
name: wedin-discovery-architect
description: Activated when designing, writing, reviewing, or improving the wedin.ai discovery session — the onboarding conversation flow that takes a couple from zero to a music portrait. Use this skill whenever working on discovery session questions, conversation flow architecture, question sequencing, ICP-specific question variants, band classification logic, or the music portrait reveal. Note: the discovery session produces a portrait and earns the email address. The paid deep-dive session (governed by wedin-moment-architect) is where moment-by-moment planning happens.
---

# wedin-discovery-architect

## The Discovery Session's Job

The discovery session is wedin.ai's trust-building experience. It has one job: make the couple feel understood — and then produce a music portrait that proves they were.

Its job is NOT to plan their wedding. It is to earn the email address, demonstrate the product's intelligence, and create enough aspiration that the couple wants to pay to continue.

Every question must pass this test: **does this question move the couple closer to feeling understood, or does it feel like form-filling?**

Planning questions belong in the paid deep-dive session — not here.

---

## Current State — Built and Live (March 2026)

The discovery session is live at wedin-ai-app.netlify.app. **24 questions across 5 sections** in `src/data/questions.js`.

**What is live and working:**
- All 24 questions with followUp functions wired into DiscoverySession.jsx
- Dynamic acknowledgements — answer-specific copy, fully wired to UI
- conditionalEducate pattern — gold border block after followUp for specific answers, requires explicit Continue tap
- "Other — tell us more" chip option — all chip questions except age_range; reveals text input; saves as "Other: [text]"
- Budget NOT asked in discovery — captured in MIL intake after brief review (deliberate, locked sequencing)

---

## The Full Product Architecture

**Phase 1 — Discovery Session (this skill governs)**
Free. 24 questions. Emotionally focused. Produces the music portrait.
Job: earn the email address.

**Phase 1.5 — Moment Map (post-email, pre-payment)**
9 moments shown. Payment triggers from Moment Map — never before.
Job: convert email to paying customer.

**Phase 2 — Deep-Dive Sessions (wedin-moment-architect governs)**
Paid. One conversation per moment. Brief assembles after all 9 moments. MIL runs after brief review.
Job: produce the brief and music plan.

---

## Flow Architecture

**Stage 1 — Entry**
Landing page CTA → immediate entry. No account creation. No friction.

**Stage 2 — Band Classification**
Guest count only — softly framed. "Roughly how many people are you planning for?"
Budget is NOT asked here. It is asked in MIL intake. This sequencing is deliberate and locked.

**Stage 3 — Feeling Questions (3–5 questions)**
Emotion, atmosphere, identity. Trust-building. Opens curiosity gap.

**Stage 4 — Music Identity (6 questions — current live set)**
The couple's musical world. Richest data source for the MIL.

Current live Stage 4 questions:
1. `stop_and_look` — "Is there a song that, when it comes on, you both stop and look at each other?"
2. `guilty_pleasure` — "Are there genres or artists you'd be embarrassed to admit?"
3. `home_listening` — "What's actually on when you're at home together — cooking on a Sunday, driving, just spending time at home?"
4. `musical_confidence` — chips + Other
5. `crowd_vs_taste` — chips + Other (conditionalEducate on "our taste leading")
6. `live_vs_recorded` — chips + Other (conditionalEducate after all answers)

**Stage 5 — Cultural & Ceremony Foundation (2 questions)**
Surfaces structural constraints. Always include both.

**Stage 6 — Portrait Reveal + Email Capture**
Show portrait BEFORE asking for email. Four states: loading / portrait + email capture / email saved / error.
Label: YOUR MUSIC PORTRAIT IS READY. Heading: Your Moment Map is ready. Button: Save my portrait →

**Stage 7 — Moment Map Preview**
9 moments shown, all not started. Aspiration before payment.

---

## Cultural & Ceremony Foundation Questions (Stage 5)

**Question 1 — Religious/Cultural Structure:**
"Does your ceremony have a formal religious or cultural structure that the music needs to work within — or is it entirely your own design?"

Why: A hora, gospel choir, or religious processional changes the entire day's architecture. This must be in the discovery session because it affects the portrait, not just the plan.

**Question 2 — Ceremony Feeling:**
"The ceremony is the moment everyone watches in silence. Should that silence feel sacred and still — or joyfully celebratory?"

Why: Sacred/still → string quartet, solo, classical. Joyfully celebratory → choir, African ensemble, full band. Shapes the entire ceremony recommendation.

---

## The "Other — Tell Us More" Pattern

All chip questions in discovery (except age_range) include "Other — tell us more" as the final chip.

- Selecting "Other" does NOT auto-advance — reveals text input
- Saves as "Other: [text]" prefix
- Reason: forces the couple to pick the closest wrong answer without this option, feeding bad data into the portrait and MIL

---

## Dynamic Acknowledgements

Every question has a `followUp` function returning answer-specific acknowledgement copy. All wired into DiscoverySession.jsx.

Rule: if the acknowledgement could apply to any couple, it is not good enough.

**conditionalEducate:** Some followUp functions also return a conditionalEducate block — gold-bordered informational panel after the followUp, requires explicit "Continue →" tap. Used where the couple needs context to make a good decision.

---

## Band Classification Logic

| Guest Count | Band | Behaviour |
|-------------|------|-----------|
| 0–50 | Band 1 — Intimate | Intimacy-specific questions. Every choice is noticed. |
| 51–120 | Band 2 — Mid-Size ★ | Hybrid format education. Most decision-rich band. |
| 121–220 | Band 3 — Classic ★ | Full moment-by-moment mapping. Music strategy. |
| 221–350 | Band 4 — Grand | Production-level considerations. |
| 350+ | Band 5 — Spectacular | Specialist production partners for execution layer. |

★ = primary target segments. Bands 2 and 3 represent 70–75% of all SA weddings.

---

## ICP-Specific Adaptations

**ICP-1: The Intentional Couple** — Start with music identity. Give specific answers room. Reference them back.

**ICP-2: The Overwhelmed Organiser** — Start gentle and directive. Reassure early. Use smart defaults.

**ICP-3: The Destination Couple** — Plans remotely, higher budgets, zero SA music knowledge, highly anxious. Open with destination acknowledgment. Use UK/AUS reference points as valid input.

**ICP-4: The Cultural Couple** — Stage 5 questions are most important. Actively invite cultural specificity. The answer unlocks Cultural Moment on the Moment Map.

**ICP-5: The Wedding Planner (B2B)** — Separate onboarding. Dashboard view. Phase 3.

---

## Question Quality Checklist

Before adding any question:
- [ ] Opens a feeling or surfaces an identity signal — not a planning decision?
- [ ] Written in couple's language, not product language?
- [ ] Short enough to read in under 5 seconds?
- [ ] One idea, not two?
- [ ] Answer changes the portrait — not just the plan?
- [ ] ICP-2 would feel comfortable answering it?
- [ ] ICP-1 would find it interesting, not patronising?
- [ ] Has a followUp function with specific, non-generic acknowledgement?
- [ ] If chip question, includes "Other — tell us more"?

---

## Completion Rate Principles

- Save progress after every answer — automatically, silently
- Show proximity to completion, not percentages
- Account creation after portrait reveal — never before
- Payment from Moment Map — never before couple sees it
