import React, { useState, useEffect } from 'react'

// ── Standard step definitions ──────────────────────────────────────────────

const STEP_CEREMONY_STRUCTURE = {
  id: 'ceremony_structure',
  type: 'chips',
  educate: "Every ceremony has its own musical soul — shaped by tradition, faith, culture, or a couple's own instinct for what feels right. Before we plan the music, we need to understand what your ceremony is rooted in.",
  question: "How would you describe your ceremony?",
  chips: [
    'Fully religious',
    'Blend of religious and personal',
    'Cultural but not religious',
    'Entirely secular',
    'Something else entirely',
    'Other — tell us more',
  ],
}

const STEP_CEREMONY_FAITH = {
  id: 'ceremony_faith',
  type: 'chips_with_other',
  question: "What tradition or faith is your ceremony rooted in?",
  chips: ['Christian', 'Jewish', 'Muslim', 'Hindu', 'Afrikaans Reformed', 'Catholic', 'Greek Orthodox', 'Interfaith', 'Other'],
}

const STEP_PROCESSIONAL_SONG = {
  id: 'processional_song',
  type: 'text',
  educate: "The processional is the moment the whole room holds its breath. What plays as you walk in will set the emotional register for your entire ceremony.",
  question: "Is there a song already in your head for walking down the aisle — or is that still completely open?",
  placeholder: "A song title, an artist, or just a feeling — anything helps.",
}

const STEP_PROCESSIONAL_TONE = {
  id: 'processional_tone',
  type: 'chips',
  question: "When you imagine that walk, what does the space feel like?",
  chips: [
    'Sacred and still',
    'Joyful and alive',
    'Warm and intimate',
    'Unexpected — we want to catch people off guard',
    'Other — tell us more',
  ],
}

const STEP_SIGNING_MUSIC = {
  id: 'signing_music',
  type: 'text',
  educate: "The signing moment is 3–5 minutes most couples forget to plan. You're seated, close to each other, and the room goes quieter than anywhere else in the day.",
  question: "Have you thought about music for the signing — or is that still a blank? It can be the most beautiful space in the ceremony to fill.",
  placeholder: "A song, a feeling, or 'hadn't thought about it' — all useful.",
}

const STEP_RECESSIONAL_SONG = {
  id: 'recessional_song',
  type: 'text',
  educate: "The recessional is your first 60 seconds as a married couple. It's the last thing your guests hear before they pour out behind you.",
  question: "Have you thought about your recessional song (your walk back down the aisle as a married couple)? This is the moment most couples want to feel most like themselves.",
  placeholder: "A song title, an artist, or the feeling you want.",
}

const STEP_CEREMONY_FORMAT = {
  id: 'ceremony_format',
  type: 'chips',
  educate: "Ceremony music can be live — a string quartet, a solo vocalist, a guitarist — or played from a well-prepared recording. Each creates a different atmosphere, and the cost difference is significant.",
  question: "Do you have a preference — live musicians for your ceremony, or a curated recording?",
  chips: [
    'Live musicians',
    'Curated recording',
    'Open to either',
    'Depends on budget',
    'We already have someone in mind',
    'Other — tell us more',
  ],
}

const STEP_OFFICIANT_REQUIREMENTS = {
  id: 'officiant_requirements',
  type: 'chips',
  educate: "Some officiants have specific requirements or restrictions around ceremony music — religious, cultural, or personal. It's worth knowing this before you plan anything.",
  question: "Does your officiant have any input on your ceremony music?",
  chips: [
    "Yes, they've given us guidelines",
    "No, it's entirely our choice",
    "We're not sure yet",
    'Other — tell us more',
  ],
}

// ── Faith tradition sub-flow steps ────────────────────────────────────────

const JEWISH_STEPS = [
  {
    id: 'jewish_denomination',
    type: 'chips',
    question: "Orthodox, Conservative, or Reform — which best describes how you're approaching the ceremony? This shapes everything from the structure of the service to which music moments need planning.",
    chips: ['Orthodox', 'Conservative', 'Reform', 'Not sure — somewhere in between', 'Other — tell us more'],
  },
  {
    id: 'jewish_moments',
    type: 'text',
    question: "Jewish ceremonies have several distinct music moments — the Badeken, the processional, music through the seven circles, the ketubah signing, and the recessional after the glass is broken. Which of these have you thought about, and which need the most help?",
    placeholder: "Tell us which moments you've thought about and where you need the most help.",
  },
]

const MUSLIM_STEPS = [
  {
    id: 'muslim_nikah_location',
    type: 'chips',
    question: "Is your Nikah taking place at a mosque or at your venue? This changes the music brief significantly — mosque ceremonies typically have no music, while venue ceremonies often welcome it.",
    chips: ['At a mosque', 'At our venue', 'Combination of both', 'Not sure yet', 'Other — tell us more'],
  },
  {
    id: 'muslim_cape_malay',
    type: 'chips',
    infoText: "Cape Malay Muslim weddings in South Africa have distinct musical traditions — Die Afhaal (the formal fetching of the bride), the Salawaat (praise choir), and Nagaul music — that are specific to this community.",
    question: "Are you incorporating any of these Cape Malay traditions — or is the musical focus mainly on the reception?",
    chips: ['Yes, Cape Malay traditions are central', 'Some elements, not all', 'No — mainly reception focus', 'Tell me more about these', 'Other — tell us more'],
  },
]

const HINDU_STEPS = [
  {
    id: 'hindu_tradition',
    type: 'chips',
    question: "Are you Tamil, or North Indian/Gujarati? The ceremony structure and music moments are quite different between these traditions — I want to make sure we plan for the right ones.",
    chips: ['Tamil', 'North Indian', 'Gujarati', 'Mixed — both traditions in the family', 'Other'],
  },
  {
    id: 'hindu_moments',
    type: 'text',
    question: "The Baraat, the Varmala, the Pheras, and the Vidaai are each distinct music moments. Which of these are part of your ceremony, and is there anything — especially the Vidaai — that hasn't been planned yet?",
    placeholder: "Tell us which of these are part of your ceremony and what still needs planning.",
  },
]

const CATHOLIC_STEPS = [
  {
    id: 'catholic_mass_type',
    type: 'chips',
    question: "Are you having a full Nuptial Mass, or a Rite of Marriage outside of Mass? This determines how long the ceremony runs and which sung elements are required — the priest will have confirmed this with you.",
    chips: ['Full Nuptial Mass', 'Rite of Marriage', 'Not sure yet — need to confirm with priest', 'Other — tell us more'],
  },
  {
    id: 'catholic_church_requirements',
    type: 'chips',
    question: "Catholic ceremonies have required sung elements — the Sanctus, Agnus Dei, and responses — plus the common Ave Maria moment. Has the church given you a music brief, and is there a church organist you're expected to use?",
    chips: ["Yes, we have the church's requirements", 'No, we have full freedom', "There's an organist we need to work with", 'Not sure yet', 'Other — tell us more'],
  },
]

const ORTHODOX_STEPS = [
  {
    id: 'orthodox_choir_status',
    type: 'chips',
    question: "Greek Orthodox ceremonies are a cappella only — no instruments in the church. Is the chanting and choir arrangement already in place with your priest and choir director, or does this need to be organised?",
    chips: ['Yes, all arranged', 'We have a priest but no choir director yet', 'Still to be organised', "We weren't aware of this — thank you", 'Other — tell us more'],
  },
  {
    id: 'orthodox_reception_music',
    type: 'chips',
    question: "The reception after a Greek Orthodox ceremony is often the moment where the musical energy completely transforms. Is there a traditional Greek element you want to include at the reception, or are you moving into a fully contemporary reception?",
    chips: ['Yes, traditional Greek music at the reception', 'A blend of traditional and contemporary', 'Fully contemporary', 'Not sure yet', 'Other — tell us more'],
  },
]

const NGKERK_STEPS = [
  {
    id: 'ngkerk_dominee',
    type: 'chips',
    question: "NG Kerk ceremonies are fully in the dominee's hands — organ, Liedboek, and his approval on all music. Has he given you any guidance on what's possible, or is that conversation still ahead of you?",
    chips: ["Yes, we know exactly what's allowed", 'Still to speak to him', 'We have some flexibility but mostly traditional', "It's a civil ceremony at a venue, not the church", 'Other — tell us more'],
  },
  {
    id: 'ngkerk_focus',
    type: 'chips',
    question: "NG Kerk couples often treat the ceremony and the reception as completely separate musical worlds. Are you planning anything specific for the ceremony music, or is your energy mainly on the reception?",
    chips: ['The ceremony is planned — focus on reception', 'Both need equal attention', 'Mainly the ceremony', 'Tell me what we should be thinking about', 'Other — tell us more'],
  },
]

const INTERFAITH_STEPS = [
  {
    id: 'interfaith_traditions',
    type: 'text',
    question: "Which traditions are coming together in your ceremony? This helps us navigate where Wagner's Bridal Chorus and other tradition-specific pieces might need to be reconsidered.",
    placeholder: "Tell us which traditions are part of your ceremony.",
  },
  {
    id: 'interfaith_structure',
    type: 'chips',
    question: "Interfaith ceremonies need to feel unified rather than divided. Do you have a clear sense of which tradition's structure takes precedence — or are you building something entirely your own?",
    chips: ["One tradition leads, the other is honoured", 'Equally blended', 'Something entirely our own', 'Still figuring this out', 'Other — tell us more'],
  },
]

// ── Protestant steps — conditional Q2 + Q3 ────────────────────────────────

const PROTESTANT_Q1 = {
  id: 'protestant_denomination',
  type: 'chips',
  question: "Which denomination are you? This helps us understand how much flexibility you have with the music — it varies significantly between Anglican, Methodist, Baptist, and Pentecostal.",
  chips: ['Anglican', 'Methodist', 'Baptist', 'Pentecostal/Charismatic', 'Other'],
}

const PROTESTANT_Q3 = {
  id: 'protestant_detail',
  type: 'text',
  question: "Anything else about the church's music requirements we should know — specific songs the family is expecting, anything that's off the table, or anything the minister has already approved?",
  placeholder: "Family expectations, songs the minister has approved, anything that's off the table…",
}

// Derives the conditional Q2 question object from the denomination answer
function resolveProtestantQ2(denomination) {
  if (denomination === 'Anglican') {
    return {
      id: 'protestant_structure',
      type: 'chips',
      question: "Anglican ceremonies are typically formal, with the vicar approving all music. Have you had that conversation yet — and is there an organist at the church you're working with or replacing?",
      chips: ["Yes, vicar has approved our choices", "Not yet — still to confirm", "There's an organist we need to factor in", "We have full freedom", 'Other — tell us more'],
    }
  }
  if (denomination === 'Methodist' || denomination === 'Baptist') {
    return {
      id: 'protestant_structure',
      type: 'chips',
      question: "Methodist and Baptist ceremonies generally welcome hymn-based music and congregational singing. Are there specific hymns the family is expecting, and do you want the music to lean traditional or contemporary Christian?",
      chips: ['Traditional hymns', 'Contemporary Christian', 'A mix', 'Open to guidance', 'Other — tell us more'],
    }
  }
  // Pentecostal/Charismatic
  return {
    id: 'protestant_structure',
    type: 'chips',
    question: "Pentecostal ceremonies often include a worship band and a significant praise section. Is that the plan here — and does your church have its own worship team, or do you need one arranged?",
    chips: ['Yes, full worship band', 'Praise songs but more contained', 'We want a blend', 'The church has their team', 'Other — tell us more'],
  }
}

// Protestant sub-flow: Q1 always; Q2 + Q3 only if denomination is not 'Other'
function getProtestantSteps(answers) {
  const denom = answers['protestant_denomination']
  const steps = [PROTESTANT_Q1]
  if (denom && denom !== 'Other') {
    steps.push(resolveProtestantQ2(denom))
    steps.push(PROTESTANT_Q3)
  }
  return steps
}

// ── Faith sub-flow injection ───────────────────────────────────────────────

// Maps ceremony_faith answer → tradition-specific step array
function getFaithSubFlowSteps(answers) {
  switch (answers['ceremony_faith']) {
    case 'Jewish':             return JEWISH_STEPS
    case 'Muslim':             return MUSLIM_STEPS
    case 'Hindu':              return HINDU_STEPS
    case 'Catholic':           return CATHOLIC_STEPS
    case 'Greek Orthodox':     return ORTHODOX_STEPS
    case 'Christian':          return getProtestantSteps(answers)
    case 'Afrikaans Reformed': return NGKERK_STEPS
    case 'Interfaith':         return INTERFAITH_STEPS
    default:                   return []
  }
}

// ── Step builder ───────────────────────────────────────────────────────────

// Builds the complete ordered step list for the current answer state.
// Faith sub-flow steps are injected between ceremony_faith and processional_song.
function buildAllSteps(answers) {
  const steps = [STEP_CEREMONY_STRUCTURE]
  const s = answers['ceremony_structure']
  if (s === 'Fully religious' || s === 'Blend of religious and personal') {
    steps.push(STEP_CEREMONY_FAITH)
    steps.push(...getFaithSubFlowSteps(answers))
  }
  steps.push(
    STEP_PROCESSIONAL_SONG,
    STEP_PROCESSIONAL_TONE,
    STEP_SIGNING_MUSIC,
    STEP_RECESSIONAL_SONG,
    STEP_CEREMONY_FORMAT,
    STEP_OFFICIANT_REQUIREMENTS,
  )
  return steps
}

// ── Chip button ───────────────────────────────────────────────────────────────

function Chip({ label, selected, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'block',
        width: '100%',
        padding: '14px 20px',
        borderRadius: 10,
        border: selected
          ? '1.5px solid #1C2B3A'
          : `1.5px solid rgba(28,43,58,${hovered ? '0.18' : '0.1'})`,
        background: selected ? '#1C2B3A' : hovered ? 'rgba(28,43,58,0.03)' : '#FFFFFF',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: selected ? 500 : 400,
        color: selected ? '#FAF7F2' : '#1C2B3A',
        textAlign: 'left',
        transition: 'all 180ms ease',
        minHeight: 48,
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CeremonyDeepDive({
  sessionId,
  coupleName,
  sessionAnswers = {},
  onComplete,
  onBack,
}) {
  const [answers, setAnswers] = useState({})
  const [stepIndex, setStepIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [otherText, setOtherText] = useState('')
  const [otherSelected, setOtherSelected] = useState(false)
  const [screen, setScreen] = useState('question') // 'question' | 'loading' | 'complete'
  const [summary, setSummary] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const applicableSteps = buildAllSteps(answers)
  const currentStep = applicableSteps[stepIndex]
  const totalSteps = applicableSteps.length

  // Reset text input and other state when step changes
  useEffect(() => {
    setCurrentText(answers[currentStep?.id] || '')
    setOtherText('')
    setOtherSelected(false)
  }, [stepIndex])

  function saveAndAdvance(value) {
    const newAnswers = { ...answers, [currentStep.id]: value }
    setAnswers(newAnswers)

    // Recompute applicable steps with the new answer (in case it unlocks sub-flow steps)
    const nextApplicable = buildAllSteps(newAnswers)
    const nextIndex = stepIndex + 1

    if (nextIndex >= nextApplicable.length) {
      // All steps done — generate summary
      generateSummary(newAnswers)
    } else {
      setStepIndex(nextIndex)
    }
  }

  async function generateSummary(finalAnswers) {
    setScreen('loading')
    try {
      const res = await fetch('/.netlify/functions/generate-ceremony-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ceremonyAnswers: finalAnswers,
          sessionAnswers,
          coupleName,
        }),
      })
      const data = res.ok ? await res.json() : {}
      setSummary(data.summary || null)
    } catch (e) {
      console.error('Ceremony summary failed:', e)
      setSummary(null)
    }
    setScreen('complete')
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    } else {
      onBack?.()
    }
  }

  function handleChipSelect(chip) {
    if (currentStep.type === 'chips_with_other' && chip === 'Other') {
      setOtherSelected(true)
      return
    }
    if (currentStep.type === 'chips' && chip === 'Other — tell us more') {
      setOtherSelected(true)
      return
    }
    saveAndAdvance(chip)
  }

  function handleOtherConfirm() {
    if (!otherText.trim()) return
    if (currentStep.type === 'chips') {
      saveAndAdvance('Other: ' + otherText.trim())
    } else {
      saveAndAdvance(otherText.trim())
    }
  }

  function handleTextContinue() {
    saveAndAdvance(currentText.trim() || null)
  }

  if (!mounted) return null

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (screen === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#1C2B3A',
            opacity: 0.7,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Writing your ceremony summary…
        </p>
      </div>
    )
  }

  // ── Completion screen ──────────────────────────────────────────────────────
  if (screen === 'complete') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px 64px' }}>

          {/* Eyebrow */}
          <p
            style={{
              margin: '0 0 8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: '#C4922A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Ceremony · Complete
          </p>

          {/* Heading */}
          <h1
            style={{
              margin: '0 0 32px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              fontWeight: 400,
              color: '#1C2B3A',
              lineHeight: 1.2,
            }}
          >
            Your ceremony is planned.
          </h1>

          {/* AI summary */}
          {summary ? (
            <div
              style={{
                borderLeft: '2px solid #C4922A',
                paddingLeft: 20,
                marginBottom: 40,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 19,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#1C2B3A',
                  lineHeight: 1.75,
                }}
              >
                {summary}
              </p>
            </div>
          ) : (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1.5px solid rgba(28,43,58,0.08)',
                padding: '20px 24px',
                marginBottom: 40,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#6B6560',
                  lineHeight: 1.6,
                }}
              >
                Your Ceremony summary will appear here once it's been generated.
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => onComplete?.(answers, summary)}
            style={{
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '15px 24px',
              background: '#1C2B3A',
              color: '#FAF7F2',
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Back to your music map
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M8 1l7 7-7 7M1 8h14"
                stroke="#FAF7F2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>
      </div>
    )
  }

  // ── Question screen ────────────────────────────────────────────────────────
  const pct = Math.round((stepIndex / totalSteps) * 100)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(28,43,58,0.08)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #1C2B3A, #C4922A)',
              transition: 'width 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Back + step counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 48,
            }}
          >
            <button
              onClick={handleBack}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#6B6560',
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                <path
                  d="M9 1L3 7l6 6"
                  stroke="#6B6560"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {stepIndex === 0 ? 'Your music map' : 'Back'}
            </button>

            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: '#6B6560',
              }}
            >
              Ceremony · {stepIndex + 1} of {totalSteps}
            </span>
          </div>

          {/* Question content */}
          <div
            key={currentStep.id}
            style={{ animation: 'fadeUp 300ms ease both' }}
          >
            {/* Info text — DM Sans, 14px, italic, warm grey (used for Cape Malay educate) */}
            {currentStep.infoText && (
              <p
                style={{
                  margin: '0 0 16px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: '#6B6560',
                  lineHeight: 1.6,
                }}
              >
                {currentStep.infoText}
              </p>
            )}

            {/* Educate — Cormorant Garamond, 16px, italic, warm grey */}
            {currentStep.educate && (
              <p
                style={{
                  margin: '0 0 16px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 16,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#6B6560',
                  lineHeight: 1.6,
                }}
              >
                {currentStep.educate}
              </p>
            )}

            {/* Question */}
            <h2
              style={{
                margin: '0 0 32px',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                fontWeight: 400,
                color: '#1C2B3A',
                lineHeight: 1.25,
              }}
            >
              {currentStep.question}
            </h2>

            {/* Text input */}
            {currentStep.type === 'text' && (
              <div>
                <textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder={currentStep.placeholder || ''}
                  rows={4}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(28,43,58,0.12)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#1C2B3A',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    marginBottom: 16,
                    transition: 'border-color 200ms',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1C2B3A' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(28,43,58,0.12)' }}
                />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleTextContinue}
                    style={{
                      all: 'unset',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      flex: 1,
                      padding: '14px 24px',
                      background: '#1C2B3A',
                      color: '#FAF7F2',
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      textAlign: 'center',
                    }}
                  >
                    Continue
                  </button>
                  {!currentText.trim() && (
                    <button
                      onClick={() => saveAndAdvance(null)}
                      style={{
                        all: 'unset',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        padding: '14px 20px',
                        border: '1.5px solid rgba(28,43,58,0.12)',
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: '#6B6560',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Skip for now
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Chips */}
            {(currentStep.type === 'chips' || currentStep.type === 'chips_with_other') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentStep.chips.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    selected={answers[currentStep.id] === chip}
                    onClick={() => handleChipSelect(chip)}
                  />
                ))}

                {/* Other — text input */}
                {otherSelected && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder={currentStep.type === 'chips_with_other' ? "Tell us your tradition or faith" : "Tell us more…"}
                      autoFocus
                      style={{
                        display: 'block',
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1.5px solid #1C2B3A',
                        borderRadius: 10,
                        padding: '14px 16px',
                        fontSize: 15,
                        fontFamily: "'DM Sans', sans-serif",
                        color: '#1C2B3A',
                        outline: 'none',
                        marginBottom: 12,
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleOtherConfirm() }}
                    />
                    <button
                      onClick={handleOtherConfirm}
                      disabled={!otherText.trim()}
                      style={{
                        all: 'unset',
                        boxSizing: 'border-box',
                        cursor: otherText.trim() ? 'pointer' : 'default',
                        display: 'block',
                        width: '100%',
                        padding: '14px 24px',
                        background: '#1C2B3A',
                        color: '#FAF7F2',
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        textAlign: 'center',
                        opacity: otherText.trim() ? 1 : 0.4,
                      }}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
