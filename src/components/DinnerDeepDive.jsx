import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'dinner_atmosphere',
    type: 'chips',
    educate: "Dinner runs 90 minutes or more. It's the longest single moment of the day — and the music has one job: keep conversations flowing without competing with them. Get the energy wrong here and the room either goes flat or gets too loud too early.",
    question: "During dinner, what should the music feel like in the room?",
    chips: [
      'Background — present but not noticed',
      'Ambient but with personality — guests might comment on it',
      'A clear musical statement — this is part of the experience',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'dinner_style',
    type: 'text',
    question: "Is there a musical style or mood that feels right for dinner — something that reflects who you are as a couple rather than generic background music?",
    placeholder: "e.g. Acoustic jazz, low-key Afrobeats, laid-back indie folk — whatever fits",
  },
  {
    id: 'dinner_live_or_recorded',
    type: 'chips',
    question: "Are you planning live music during dinner, or a curated playlist?",
    chips: [
      "Live music — it's worth the investment",
      'Curated playlist — done well, it\'s enough',
      'A combination — live for part of it',
      'Not decided yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'dinner_energy_shift',
    type: 'chips',
    question: "Dinner often leads into speeches. Do you want the energy to build gradually toward that transition — or stay consistent throughout?",
    chips: [
      'Build gradually toward speeches',
      'Stay consistent — speeches handle their own energy',
      'Drop slightly before speeches to create contrast',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
]

// ── Conditional note helper ────────────────────────────────────────────────

function getLiveContext(answer) {
  if (answer === "Live music — it's worth the investment") {
    return "A live act during dinner changes the room — but the act needs a brief that tells them exactly what you need. Volume, energy level, whether to interact with guests or stay in the background. We'll include this in your brief."
  }
  if (answer === "Curated playlist — done well, it's enough") {
    return "A well-curated dinner playlist is underrated. The right sequence of songs at the right volume does more for the room than a live act playing too loud. We'll note the style and energy guidance in your brief."
  }
  if (answer === 'A combination — live for part of it') {
    return "A live act for the first 45 minutes followed by a curated playlist is a strong approach — it creates a moment without the cost of a full dinner set. We'll map the transition in your brief."
  }
  return null // 'Not decided yet' → no note
}

// ── Chip button ────────────────────────────────────────────────────────────

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

// ── Gold border context note ───────────────────────────────────────────────

function ContextNote({ text }) {
  return (
    <p
      style={{
        marginBottom: 24,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontStyle: 'italic',
        color: '#6B6560',
        lineHeight: 1.65,
        padding: '16px 20px',
        backgroundColor: 'rgba(196,146,42,0.06)',
        borderRadius: '0 8px 8px 0',
        borderLeft: '3px solid #C4922A',
      }}
    >
      {text}
    </p>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function DinnerDeepDive({
  sessionId,
  coupleName,
  onComplete,
  onBack,
}) {
  const [answers, setAnswers] = useState({})
  const [stepIndex, setStepIndex] = useState(0)
  const [textValue, setTextValue] = useState('')
  const [otherSelected, setOtherSelected] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Sync textarea value and reset other state when step changes
  useEffect(() => {
    const step = STEPS[stepIndex]
    if (step?.type === 'text') {
      setTextValue(answers[step.id] || '')
    }
    setOtherSelected(false)
    setOtherText('')
  }, [stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalSteps = STEPS.length
  const currentStep = STEPS[stepIndex]

  function saveAndAdvance(value) {
    const newAnswers = { ...answers, [currentStep.id]: value }

    // Save conditional context note alongside the triggering answer
    if (currentStep.id === 'dinner_live_or_recorded') {
      newAnswers.dinner_live_context = getLiveContext(value)
    }

    setAnswers(newAnswers)

    const nextIndex = stepIndex + 1
    if (nextIndex >= totalSteps) {
      const finalAnswers = {
        dinner_atmosphere: newAnswers.dinner_atmosphere || null,
        dinner_style: newAnswers.dinner_style || null,
        dinner_live_or_recorded: newAnswers.dinner_live_or_recorded || null,
        dinner_live_context: newAnswers.dinner_live_context || null,
        dinner_energy_shift: newAnswers.dinner_energy_shift || null,
      }
      onComplete?.(finalAnswers)
    } else {
      setStepIndex(nextIndex)
    }
  }

  function handleChipSelect(chip) {
    if (chip === 'Other — tell us more') {
      setOtherSelected(true)
      return
    }
    saveAndAdvance(chip)
  }

  function handleTextSubmit() {
    if (!textValue.trim()) return
    saveAndAdvance(textValue.trim())
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    } else {
      onBack?.()
    }
  }

  // Conditional context note shown on Q4 screen, derived from Q3 answer
  const contextNote =
    currentStep?.id === 'dinner_energy_shift'
      ? (answers.dinner_live_context || null)
      : null

  if (!mounted) return null

  // ── Question screen ──────────────────────────────────────────────────────
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
              Dinner · {stepIndex + 1} of {totalSteps}
            </span>
          </div>

          {/* Question content */}
          <div
            key={currentStep.id}
            style={{ animation: 'fadeUp 300ms ease both' }}
          >
            {/* Educate — Cormorant Garamond italic warm grey */}
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

            {/* Conditional context note — gold border block */}
            {contextNote && <ContextNote text={contextNote} />}

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

            {/* Chips */}
            {currentStep.type === 'chips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentStep.chips.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    selected={answers[currentStep.id] === chip}
                    onClick={() => handleChipSelect(chip)}
                  />
                ))}
                {otherSelected && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Tell us more…"
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
                        boxSizing: 'border-box',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && otherText.trim())
                          saveAndAdvance('Other: ' + otherText.trim())
                      }}
                    />
                    <button
                      onClick={() => { if (otherText.trim()) saveAndAdvance('Other: ' + otherText.trim()) }}
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

            {/* Text input */}
            {currentStep.type === 'text' && (
              <div>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  rows={4}
                  onFocus={(e) => { e.target.style.borderColor = '#1C2B3A' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(28,43,58,0.12)' }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && textValue.trim()) {
                      handleTextSubmit()
                    }
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1.5px solid rgba(28,43,58,0.12)',
                    background: '#FFFFFF',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: '#1C2B3A',
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 180ms ease',
                    marginBottom: 12,
                    minHeight: 120,
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!textValue.trim()}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    cursor: textValue.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '15px 24px',
                    background: textValue.trim() ? '#1C2B3A' : 'rgba(28,43,58,0.25)',
                    color: '#FAF7F2',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    transition: 'background 180ms ease',
                    minHeight: 48,
                  }}
                >
                  Continue
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
                <p
                  style={{
                    margin: '10px 0 0',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: '#6B6560',
                    textAlign: 'center',
                  }}
                >
                  ⌘ Enter to continue
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
