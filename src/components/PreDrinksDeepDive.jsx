import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'predrinks_couple_presence',
    type: 'chips',
    educate: "Pre-drinks (the drinks reception between your ceremony and dinner) is the most underplanned moment of the day. It often runs longer than expected — photos overrun, the couple disappears for 90 minutes — and the music has to carry the room entirely on its own. Get this right and guests arrive at dinner already feeling something. Get it wrong and the day loses momentum it never fully recovers.",
    question: "During pre-drinks, will you be with your guests — or away for photos?",
    chips: [
      'With our guests the whole time',
      'Away for photos — probably 45–60 minutes',
      'Away for most of it — could be 90 minutes or more',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'predrinks_impact',
    type: 'chips',
    question: "Do you want something guests will notice and talk about — a live act that becomes part of the story of the day — or excellent music that creates the right atmosphere without demanding attention?",
    chips: [
      "Something they'll notice and talk about",
      'Atmosphere — present but not demanding attention',
      'Somewhere in between',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'predrinks_energy_shift',
    type: 'chips',
    question: "Pre-drinks often runs 60–90 minutes. Do you want the energy to build or shift at some point — a live act giving way to a DJ, a surprise element appearing midway?",
    chips: [
      'Yes — we want a shift or surprise moment',
      'No — consistent energy throughout',
      'Only if photos run long and we need to fill time',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'predrinks_cultural',
    type: 'chips',
    question: "Are there guests — from overseas or from a different cultural background — who would appreciate a specifically South African musical moment during pre-drinks?",
    chips: [
      'Yes — this matters to us',
      'Possibly — worth considering',
      'No — keeping it consistent throughout',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'song_question',
    type: 'text',
    question: "Your guests are outside, drinks in hand, the day still unfolding. What four songs would you want drifting across the space? The ones that would set exactly the right mood while you're off having your photos taken.",
    placeholder: "Four songs, or as many as you have. Artists, titles, or just vibes — anything helps.",
  },
]

// ── Derives the conditional presence context note from Q1 answer ───────────

function getPresenceContext(answer) {
  if (
    answer === 'Away for photos — probably 45–60 minutes' ||
    answer === 'Away for most of it — could be 90 minutes or more'
  ) {
    return "This is important. When the couple is away, the music carries the room alone. A live act without the couple present loses its emotional centre — we'll factor this into your recommendation."
  }
  if (answer === 'With our guests the whole time') {
    return "Having you present transforms what's possible here. A live act lands completely differently when the couple is in the room."
  }
  return null // 'Not sure yet'
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

export default function PreDrinksDeepDive({
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

  function handleChipSelect(chip) {
    if (chip === 'Other — tell us more') {
      setOtherSelected(true)
      return
    }
    saveAndAdvance(chip)
  }

  function saveAndAdvance(value) {
    let newAnswers = { ...answers, [currentStep.id]: value }

    // When Q1 is answered, also save the interpreted context note
    if (currentStep.id === 'predrinks_couple_presence') {
      newAnswers.predrinks_presence_context = getPresenceContext(value)
    }

    setAnswers(newAnswers)

    const nextIndex = stepIndex + 1
    if (nextIndex >= totalSteps) {
      onComplete?.(newAnswers)
    } else {
      setStepIndex(nextIndex)
    }
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

  // The conditional presence context note — shown on Q2 only
  const presenceNote = stepIndex === 1 ? answers.predrinks_presence_context : null

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
              Pre-drinks · {stepIndex + 1} of {totalSteps}
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

            {/* Conditional presence context note — Q2 only, warm grey, DM Sans italic */}
            {presenceNote && (
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
                {presenceNote}
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
