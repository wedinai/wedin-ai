---
name: wedin-brand-voice
description: Activated for ALL copy, design, UI, landing pages, emails, ads, in-product text, marketing material, and any creative or written output for wedin.ai. Use this skill whenever writing or reviewing any wedin.ai-facing content — headlines, CTAs, discovery session questions, error messages, onboarding copy, social media, planner briefs, component design, or any text or visual the customer sees. This skill also governs the visual identity system — colours, typography, components — for every Claude Code build session. If you are writing words, designing screens, building components, or creating anything a wedin.ai user will see or experience, this skill must be active. Load this skill before any other wedin.ai task.
---

# wedin-brand-voice + identity

The complete creative and brand reference for wedin.ai. Voice, visual identity, imagination, and implementation — all in one place.

---

## Brand Foundation

**The tagline:** Start with the music.

**The emotional destination:** The moment a couple realises this day they care so deeply about is going to go exactly the way they dreamed.

**The one-sentence brand truth:** Wedin.ai is what it feels like when technology finally understands what you're trying to say about the most important day of your life.

**The psychological arc the brand moves people through:**
1. **Curiosity** — opens the information gap, compels the next step. Never explain everything upfront. Imply. Invite. Let the product reveal itself.
2. **Recognition** — "this was built for me." Every piece of copy aims to create this moment.
3. **Deep relief** — not "that's done" but "that's going to be beautiful."

**Pre-suasion principle:** Every visual and copy signal before the first decision primes the user to feel they're in the right place. The brand environment does psychological work before the product does functional work.

---

## Locked Visual Identity

*These values are locked as of March 2026. Do not deviate in any build or design output.*

### Colour Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary surface | Cream | `#FAF7F2` | All screen backgrounds, document surfaces |
| Type & structure | Navy | `#1C2B3A` | All body text, headings, primary buttons, wordmark |
| Accent & moments | Gold | `#C4922A` | Focus rings, progress fill, completion moments, hero accent, hover states |
| Secondary text | Warm Grey | `#6B6560` | Captions, helper text, timestamps, secondary labels |
| Card surface | White | `#FFFFFF` | Cards inside cream backgrounds |

**Gold rule:** One moment of gold per screen maximum. Never a large background. If in doubt, don't use it.

**CSS variables:**
```css
:root {
  --cream:  #FAF7F2;
  --navy:   #1C2B3A;
  --gold:   #C4922A;
  --grey:   #6B6560;
  --white:  #FFFFFF;
}
```

### Typography

Two typefaces only. Never introduce a third.

| Role | Typeface | Weight | Notes |
|------|----------|--------|-------|
| Wordmark | Cormorant Garamond | Medium 500 | Tracked +40, roman upright, navy only |
| Hero headlines | Cormorant Garamond | Light 300 | 48–80px mobile, roman upright |
| Hero accent | Cormorant Garamond | Light 300 | Key emotional word in Gold — roman, never italic |
| Subheads | Cormorant Garamond | Regular 400 | Italic permitted here only |
| Discovery questions | Cormorant Garamond | Regular 400 | Roman upright — never italic |
| Body copy | DM Sans | Regular 400 | 16px, line-height 1.7 |
| UI labels | DM Sans | Medium 500 | 11–13px, tracked +120, uppercase for section labels |
| Captions | DM Sans | Light 300 | 12–13px, warm grey |
| Buttons | DM Sans | Medium 500 | 15px, tracked +10 |

**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap
```

**Italic rules:** Use only for subheads, secondary copy, pull quotes. Never for: wordmark, discovery questions, button text, UI labels, body copy.

**Banned typefaces:** Inter · Roboto · Arial (UI) · System fonts · Space Grotesk · any unlisted font.

### Logo

Wordmark only. No symbol. No mark. No icon alongside it.

- **Set:** `wedin.ai` in Cormorant Garamond Medium 500
- **Case:** Mixed — lowercase w, `.ai` integral, never hidden or made smaller
- **Primary:** Navy on cream
- **Reversed:** Cream on navy (dark backgrounds only)
- **Never:** Gold wordmark · stretched · rotated · effects · symbol added

### UI Component Style — Warm

| Component | Specification |
|-----------|--------------|
| Border radius | 8px min all interactive · Cards: 16px · Chips: 100px |
| Spacing | 8-point grid only |
| Tap targets | 44px minimum height |
| Primary button | Navy fill · cream text · 10px radius · `box-shadow: 0 2px 8px rgba(28,43,58,0.18)` · hover: lift + deeper shadow |
| Secondary button | White fill · navy text · 1.5px navy border at 15% · 10px radius · soft shadow |
| Text button | No fill · gold text · no border |
| Input resting | Cream fill · 1.5px navy border at 12% · 10px radius · `inset 0 1px 3px rgba(28,43,58,0.04)` |
| Input focus | Gold border · `0 0 0 3px rgba(196,146,42,0.12)` — the signature moment |
| Card | White bg · 1px navy border at 6% · 16px radius · `0 4px 24px rgba(28,43,58,0.07), 0 1px 4px rgba(28,43,58,0.04)` |
| Gold left border card | White bg · `1px solid rgba(28,43,58,0.06)` · `3px solid #C4922A` left border · 16px radius — used for CTA blocks and important informational panels |
| Chip resting | Cream fill · 1.5px navy border at 12% · 100px radius · soft shadow |
| Chip hover | Gold border · lifted shadow |
| Chip selected | Navy fill · cream text · deeper shadow |
| Progress bar | 3px height · cream track · navy-to-gold gradient · 3px radius |
| Completion icon | Circle · gold border · gold-tinted bg · `0 2px 12px rgba(196,146,42,0.15)` |
| Conditional educate block | `3px solid #C4922A` left border · `rgba(196,146,42,0.06)` background · DM Sans italic 14px · padding `16px 20px` · border radius `0 8px 8px 0` |

**Non-negotiables for every build:**
- One dominant element per screen · One primary action per view
- Account creation after first moment of value — never before
- Auto-save always — never lose answers
- No dark patterns · Mobile-first (390px width first)

---

## Voice Principles

**The wedin.ai voice is a knowledgeable friend** who has planned hundreds of weddings and genuinely wants yours to be perfect. Not a chatbot. Not a form. A person who knows things you don't and tells you straight.

### Six voice rules

1. **Say the thing.** Don't circle it. Direct, warm, specific.
2. **Use their language.** "The moment you walk down the aisle" not "processional input."
3. **Never explain what you're about to do — just do it.** No preamble.
4. **Have a point of view.** The brand leads gently — it doesn't just reflect.
5. **Specific beats generic.** "Your 47-song playlist has no arc" beats "we help with music."
6. **Earn every word.** If a word doesn't work, cut it.

### Banned words

Seamless · Journey (metaphor) · Unlock · Leverage · Streamline · Elevate · Curate/curated (unless specific) · Bespoke · Tailored · Solutions · "We're here to help" · "It's that simple" · "Your dream wedding" · "Powered by AI" · "AI-driven" · "Cutting-edge" · "Innovative" · Magical · Perfect

**Critical note:** These banned words apply equally to AI-generated output — the couple's brief, coordinator's brief, music plan, ceremony summary, and music portrait. If any of these words appear in generated output, they must be removed via system prompt instructions. "Seamless" is the most common offender in AI-generated copy — flag it everywhere.

---

## Creative Imagination — What Great Looks Like

*Read these before writing any copy or designing any screen. These are the target, not the ceiling.*

### Headlines: weak vs. great

| Weak | Great |
|------|-------|
| Plan your wedding music with AI | The music at your wedding will outlast the flowers. Plan it like it matters. |
| Get a complete music plan in minutes | Stop deferring the music. 20 minutes. Done. |
| AI-powered music planning | You know exactly how you want it to feel. You just don't have the words yet. |
| Find the perfect wedding band | 47 songs. Four energy levels. No arc. That's most wedding playlists. Yours doesn't have to be. |
| Start planning today | The ceremony is in 8 months. The band you want books out in 4. |

### Discovery questions: weak vs. great

| Weak | Great |
|------|-------|
| What type of music do you like? | Close your eyes. It's 10pm. The floor is full. What does that feel like? |
| What's your budget for music? | [Never ask this in discovery — always after emotional questions and brief reveal] |
| Do you want a band or DJ? | When you picture the moment you walk in — is it live music or something else? |
| What songs do you want played? | Is there a song that, if it came on, would make everything feel right? |
| How many guests? | Tell us about the day — big celebration or something more intimate? |

### Error messages: weak vs. great

| Weak | Great |
|------|-------|
| Error: field required | We need a date to build your plan — what day is the wedding? |
| Invalid email address | That email doesn't look quite right — worth a double-check? |
| Session expired | We saved your progress. Pick up where you left off. |

### Completion moments: weak vs. great

| Weak | Great |
|------|-------|
| Your plan is complete! 🎉 | Your music plan is ready. Every moment of your day, mapped. |
| Thanks for using wedin.ai | This is what it should feel like — knowing exactly what's going to happen, and knowing it's going to be right. |
| Download your brief | Your planner brief is ready. Send it to your shortlisted acts and watch the quotes get better. |

### What a great body copy paragraph sounds like

**Bad:** "Wedin.ai uses advanced AI to create personalised wedding music plans based on your unique preferences and budget."

**Good:** "Most couples spend more time choosing table linens than they do planning the music. The music is the only thing every single guest experiences together, from the moment you walk in to the moment the last person leaves the floor. Start with it."

### What great band-matched copy sounds like

**Band 2 — warm and knowing:**
> "At this size, every musical choice is audible. The wrong song in the wrong moment doesn't disappear into the room — it lands. The right one does too. That's the opportunity."

**Band 3 — confident and strategic:**
> "A 200-person wedding has five distinct musical chapters. Most couples plan one. wedin.ai plans all five — and tells you exactly which acts can carry each one."

**Band 4 — elevated, production-aware:**
> "At this scale, music is architecture. It shapes how people move, where they go, when they stay. It's not a playlist decision — it's a production decision."

---

## Band-Matched Copy Registers

| Band | Guest Count | Tagline | Register | Words |
|------|------------|---------|----------|-------|
| Band 1 — Intimate | 0–50 | Every song heard by everyone. Every moment felt by all. | Quiet, poetic, intentional | presence · intimacy · stillness · felt · close |
| Band 2 — Mid-Size ★ | 51–120 | The art of the perfect choice. | Warm and knowing | considered · surprising · exactly right · smart |
| Band 3 — Classic ★ | 121–220 | Five musical chapters. One unforgettable day. | Confident, strategic | crafted · arc · chapter · built · designed |
| Band 4 — Grand | 221–350 | Design the experience, not just the event. | Elevated, production-aware | production · legacy · scale · architecture |
| Band 5 — Spectacular | 350+ | This is a production. Let's produce it. | Prestige, unambiguous | spectacle · landmark · unforgettable · produced |

★ = primary target segments. Bands 2 and 3 represent 70–75% of all SA weddings.

**Band classification is the locked definition across all skills.** Do not use different guest count ranges in any other skill or document.

---

## ICP-Matched Messaging

| ICP | Primary Hook | Fear addressed |
|-----|-------------|----------------|
| ICP-1: Intentional Couple | Don't plan your music around your budget. Plan it around who you are. | Music feels generic |
| ICP-2: Overwhelmed Organiser | Stop deferring the music. 20 minutes to a complete plan. | Still TBD in 6 months |
| ICP-3: Destination Couple | You're planning an SA wedding from abroad. The music is the one gap. Until now. | Can't evaluate SA acts |
| ICP-4: Cultural Couple | Your wedding carries two worlds. The music should carry both. | One side gets ignored |
| ICP-5: Wedding Planner | Your couples can't tell you what they want musically. wedin.ai gives them the words. | Bad brief reflects on her |

---

## Discovery Session Copy Rules

- Open with feeling, never logistics. Never lead with guest count or budget.
- Short questions. One idea per question.
- The question IS the label — no separate field label above inputs.
- Acknowledge answers with a natural follow-on that uses what they said. Never "Great choice!"
- Errors warm: "We hit a snag — let's try that again."
- Completions quiet: one satisfying moment, not confetti.
- Budget is never asked in the discovery session — it is asked in the MIL intake after the brief reveal.

---

## What wedin.ai Is Never Allowed to Do

- Aspirational dissonance — never show Band 4 language to Band 2 couples
- Dark patterns — no artificial urgency, pre-checked boxes, hidden costs
- Show pricing before value is experienced
- Sound like any other wedding platform
- Sound like a generic AI product
- Speak down to the couple about budget
- Hollow preamble: "Great question!" · "Certainly!" · "Of course!" · "Absolutely!"
- Start any response with a compliment before the content
- Use banned words in AI-generated output (briefs, portrait, music plan, ceremony summary)

---

## Quick Tone + Design Check

Before shipping any copy or screen:
1. Does this sound like a knowledgeable friend, or like a brand?
2. Does it use their language or internal language?
3. Does it open a curiosity gap or close one?
4. Is it specific enough to feel written for this person?
5. Have I cut every word that isn't working?
6. Does the visual use the locked palette and type system exactly?
7. Does gold appear only where it's earned?
8. Are any banned words present — including in AI-generated output?

If any answer is no — rewrite or redesign.
