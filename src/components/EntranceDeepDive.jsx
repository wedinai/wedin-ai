import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'entrance_style',
    type: 'chips',
    educate: "Your entrance into the reception is a choreographic moment — often the most theatrically impactful of the entire day. The music, the timing, and the transition from pre-drinks all need to work together. Most couples leave this completely unplanned.",
    question: "How do you want to enter the reception — grand and announced, with a song the room knows? Or something more intimate and surprising?",
    chips: [
      'Grand and announced — we want a moment',
      'Intimate and surprising',
      'Somewhere in between',
      "We haven't thought about it yet",
      'Other — tell us more',
    ],
  },
  {
    id: 'entrance_transition',
    type: 'chips',
    question: "Is there a physical transition you need to mark — moving guests from outside to inside, from pre-drinks to dinner, or from one space to another? The music can do that work.",
    chips: [
      'Yes — guests move between spaces',
      'No — everyone is already in one place',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'entrance_live_musicians',
    type: 'chips',
    question: "Have you thought about using live musicians to lead the entrance — percussionists, a brass section, or a saxophone player who physically moves with the room?",
    chips: [
      'Yes — this appeals to us',
      'Interesting — tell me more in the brief',
      'No — we want recorded music',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'song_question',
    type: 'text',
    question: "The doors open. You walk in as married. What song is playing? And if you have a second choice waiting in the wings — tell us that too.",
    placeholder: "The song (or two) that plays as you enter.",
  },
]

// ── Derives the conditional transition context note from Q2 answer ──────────

function getTransitionContext(answer) {
  if (answer === 'Yes — guests move between spaces') {
    return "This is one of the most underused opportunities of the day. Live musicians physically leading guests from one space to another — percussionists, a brass pair, a sax player — creates a moment guests talk about for years. We'll factor this into your recommendation."
  }
  return null // No note for 'No' or 'Not sure yet'
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

// ── Main component ─────────────────────────────────────────────────────────

export default function EntranceDeepDive({
  sessionId,
  coupleName,
  onComplete,
  onBack,
}) {
  const [answers, setAnswers] = useState({})
  const [stepIndex, setStepIndex] = useState(0)
  const [otherSelected, setOtherSelected] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [songText, setSongText] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    setOtherSelected(false)
    setOtherText('')
    setSongText('')
  }, [stepIndex])

  const currentStep = STEPS[stepIndex]
  const totalSteps = STEPS.length

  function saveAndAdvance(value) {
    let newAnswers = { ...answers, [currentStep.id]: value }

    // When Q2 is answered, also save the interpreted transition context note
    if (currentStep.id === 'entrance_transition') {
      newAnswers.entrance_transition_context = getTransitionContext(value)
    }

    setAnswers(newAnswers)

    const nextIndex = stepIndex + 1
    if (nextIndex >= totalSteps) {
      onComplete?.(newAnswers)
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

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    } else {
      onBack?.()
    }
  }

  if (!mounted) return null

  // ── Question screen ──────────────────────────────────────────────────────
  const pct = Math.round((stepIndex / totalSteps) * 100)

  // The conditional transition context note — shown on Q3 only
  const transitionNote = stepIndex === 2 ? answers.entrance_transition_context : null

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
              Your Entrance · {stepIndex + 1} of {totalSteps}
            </span>
          </div>

          {/* Question content */}
          <div
            key={currentStep.id}
            style={{ animation: 'fadeUp 300ms ease both' }}
          >
            {/* Educate — Cormorant Garamond, italic, warm grey */}
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

            {/* Conditional transition context note — Q3 only, warm grey, DM Sans italic */}
            {transitionNote && (
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
                {transitionNote}
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

            {/* Text input — song question */}
            {currentStep.type === 'text' && (
              <div>
                <textarea
                  value={songText}
                  onChange={(e) => setSongText(e.target.value)}
                  placeholder={currentStep.placeholder}
                  rows={4}
                  autoFocus
                  style={{
                    display: 'block',
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(28,43,58,0.15)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#1C2B3A',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.6,
                    marginBottom: 12,
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1.5px solid #1C2B3A'
                    e.target.style.boxShadow = '0 0 0 3px rgba(196,146,42,0.12)'
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1.5px solid rgba(28,43,58,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  onClick={() => { if (songText.trim()) saveAndAdvance(songText.trim()) }}
                  disabled={!songText.trim()}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    cursor: songText.trim() ? 'pointer' : 'default',
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
                    opacity: songText.trim() ? 1 : 0.4,
                  }}
                >
                  Continue
                </button>
                <button
                  onClick={() => saveAndAdvance('')}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    display: 'block',
                    width: '100%',
                    padding: '12px 24px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: '#6B6560',
                    textAlign: 'center',
                    marginTop: 8,
                  }}
                >
                  Skip this question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
