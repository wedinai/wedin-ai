import React, { useState, useEffect } from 'react'

// ── Question data ─────────────────────────────────────────────────────────────

const ALL_STEPS = [
  {
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
    ],
  },
  {
    id: 'ceremony_faith',
    type: 'chips_with_other',
    question: "What tradition or faith is your ceremony rooted in?",
    chips: ['Christian', 'Jewish', 'Muslim', 'Hindu', 'Afrikaans Reformed', 'Catholic', 'Interfaith', 'Other'],
    conditional: (answers) => {
      const s = answers['ceremony_structure']
      return s === 'Fully religious' || s === 'Blend of religious and personal'
    },
  },
  {
    id: 'processional_song',
    type: 'text',
    educate: "The processional is the moment the whole room holds its breath. What plays as you walk in will set the emotional register for your entire ceremony.",
    question: "Is there a song already in your head for walking down the aisle — or is that still completely open?",
    placeholder: "A song title, an artist, or just a feeling — anything helps.",
  },
  {
    id: 'processional_tone',
    type: 'chips',
    question: "When you imagine that walk, what does the space feel like?",
    chips: [
      'Sacred and still',
      'Joyful and alive',
      'Warm and intimate',
      'Unexpected — we want to catch people off guard',
    ],
  },
  {
    id: 'signing_music',
    type: 'text',
    educate: "The signing moment is 3–5 minutes most couples forget to plan. You're seated, close to each other, and the room goes quieter than anywhere else in the day.",
    question: "Have you thought about music for the signing — or is that still a blank? It can be the most beautiful space in the ceremony to fill.",
    placeholder: "A song, a feeling, or 'hadn't thought about it' — all useful.",
  },
  {
    id: 'recessional_song',
    type: 'text',
    educate: "The recessional is your first 60 seconds as a married couple. It's the last thing your guests hear before they pour out behind you.",
    question: "Have you thought about your recessional song? This is the moment most couples want to feel most like themselves.",
    placeholder: "A song title, an artist, or the feeling you want.",
  },
  {
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
    ],
  },
  {
    id: 'officiant_requirements',
    type: 'chips',
    educate: "Some officiants have specific requirements or restrictions around ceremony music — religious, cultural, or personal. It's worth knowing this before you plan anything.",
    question: "Does your officiant have any input on your ceremony music?",
    chips: [
      "Yes, they've given us guidelines",
      "No, it's entirely our choice",
      "We're not sure yet",
    ],
  },
]

function getApplicableSteps(answers) {
  return ALL_STEPS.filter((step) => !step.conditional || step.conditional(answers))
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

  const applicableSteps = getApplicableSteps(answers)
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

    // Recompute applicable steps with the new answer (in case it unlocks a conditional)
    const nextApplicable = getApplicableSteps(newAnswers)
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
    saveAndAdvance(chip)
  }

  function handleOtherConfirm() {
    if (!otherText.trim()) return
    saveAndAdvance(otherText.trim())
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
          Building your Ceremony plan…
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

          {/* Music Intelligence Layer stub */}
          <div
            style={{
              background: '#1C2B3A',
              borderRadius: 12,
              padding: '20px 24px',
              marginBottom: 40,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: 'rgba(250,247,242,0.5)',
                lineHeight: 1.5,
              }}
            >
              Your Ceremony recommendations will appear here.
            </p>
          </div>

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
            {/* Educate */}
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
                {currentStep.type === 'chips_with_other' && otherSelected && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Tell us your tradition or faith"
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
