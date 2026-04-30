import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS_MAIN = [
  {
    id: 'dancing_energy_arc',
    type: 'chips',
    educate: "The dance floor arc — how energy builds, peaks, and sustains across the night — is what guests remember most. It's not just about the songs. It's about sequencing, reading the room, and knowing exactly when to push and when to pull back.",
    question: "How do you want the energy to move across the night?",
    chips: [
      'Build slowly to a peak late in the night',
      'Peak early and sustain it',
      'Variable — peaks and valleys through the night',
      "We'll leave it to the act or DJ to read the room",
      'Other — tell us more',
    ],
  },
  {
    id: 'dancing_guest_mix',
    type: 'chips',
    question: "Think about your guest mix — how important is it that everyone gets their moment on the floor, across all age groups?",
    chips: [
      'Very important — we want everyone dancing at some point',
      "Mostly the younger guests — that's where the energy is",
      "It'll happen naturally — we're not worried",
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'dancing_avoid',
    type: 'chips',
    question: "Are there specific songs, genres, or artists you know will clear the floor — things the act or DJ should never play?",
    chips: [
      'Yes — there are things to avoid',
      'A few things come to mind',
      'No — open floor',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'dancing_peak_moment',
    type: 'text',
    question: "Is there a moment you want to create — a song everyone will sing along to, something that brings the whole room together at once? If you have something in mind, tell us.",
    placeholder: "e.g. Mr Brightside at 11pm. Or just something anthemic that everyone knows.",
  },
  {
    id: 'dancing_wind_down',
    type: 'chips',
    question: "What time do you expect the night to wind down — and how do you want it to feel as it does?",
    chips: [
      'Before midnight — end on a high',
      'Midnight or later — long night, gradual wind-down',
      'We want it to end with one final moment, then done',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
  {
    id: 'song_question',
    type: 'text',
    question: "The floor is open, the night is young. What four songs, if the DJ played them back to back, would have everyone on the floor? These are the songs that define what kind of night you want.",
    placeholder: "Four songs that define the night. Artists, titles, genres — anything helps.",
  },
]

const STEPS_BRANCH = [
  {
    id: 'dancing_avoid_details',
    type: 'text',
    question: "Tell us what to avoid — specific songs, artists, genres, or anything that would feel wrong for this crowd.",
    placeholder: "e.g. No country music. No Macarena. No Ed Sheeran slow songs.",
  },
]

const AVOID_BRANCH_VALUES = ['Yes — there are things to avoid', 'A few things come to mind']

function getActiveSteps(answers) {
  if (AVOID_BRANCH_VALUES.includes(answers.dancing_avoid)) {
    return [
      STEPS_MAIN[0],
      STEPS_MAIN[1],
      STEPS_MAIN[2],
      STEPS_BRANCH[0],
      STEPS_MAIN[3],
      STEPS_MAIN[4],
      STEPS_MAIN[5],
    ]
  }
  return STEPS_MAIN
}

// ── Conditional note helpers ───────────────────────────────────────────────

function getEnergyContext(answer) {
  if (answer === 'Build slowly to a peak late in the night') {
    return "A slow build works best when the act or DJ has a specific peak moment in mind — a song, a time, a signal. We'll ask your act to identify this in the brief and build toward it deliberately."
  }
  if (answer === 'Peak early and sustain it') {
    return "Peaking early keeps energy high but requires careful management of the second half — the floor can empty if the intensity doesn't modulate. We'll flag this in the brief."
  }
  if (answer === 'Variable — peaks and valleys through the night') {
    return "Peaks and valleys give guests moments to rest and return to the floor. This is often the most sustainable arc for a long night. We'll map the intention in the brief."
  }
  return null // 'We'll leave it to the act or DJ' → no note
}

const WIND_DOWN_NOTE =
  "How the night ends is as deliberate as how it starts. We'll include a wind-down instruction in your brief — the act or DJ needs to know whether to fade gradually or end on a specific moment."

function getWindDownContext(answer) {
  if (answer === 'Not sure yet') return null
  return WIND_DOWN_NOTE
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

export default function DancingDeepDive({
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
    const step = getActiveSteps(answers)[stepIndex]
    if (step?.type === 'text') {
      setTextValue(answers[step.id] || '')
    }
    setOtherSelected(false)
    setOtherText('')
  }, [stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeSteps = getActiveSteps(answers)
  const totalSteps = activeSteps.length
  const currentStep = activeSteps[stepIndex]

  function saveAndAdvance(value) {
    const newAnswers = { ...answers, [currentStep.id]: value }

    // Save conditional context notes alongside the triggering answer
    if (currentStep.id === 'dancing_energy_arc') {
      newAnswers.dancing_energy_context = getEnergyContext(value)
    }
    if (currentStep.id === 'dancing_wind_down') {
      newAnswers.dancing_wind_down_context = getWindDownContext(value)
    }

    setAnswers(newAnswers)

    // Re-derive active steps from newAnswers so branch changes take effect immediately
    const newActiveSteps = getActiveSteps(newAnswers)
    const nextIndex = stepIndex + 1
    if (nextIndex >= newActiveSteps.length) {
      const finalAnswers = {
        dancing_energy_arc: newAnswers.dancing_energy_arc || null,
        dancing_energy_context: newAnswers.dancing_energy_context || null,
        dancing_guest_mix: newAnswers.dancing_guest_mix || null,
        dancing_avoid: newAnswers.dancing_avoid || null,
        dancing_avoid_details: AVOID_BRANCH_VALUES.includes(newAnswers.dancing_avoid)
          ? (newAnswers.dancing_avoid_details || null)
          : null,
        dancing_peak_moment: newAnswers.dancing_peak_moment || null,
        dancing_wind_down: newAnswers.dancing_wind_down || null,
        dancing_wind_down_context: newAnswers.dancing_wind_down_context || null,
        song_question: newAnswers.song_question || null,
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

  // Which context note to show on the current screen
  let contextNote = null
  if (currentStep?.id === 'dancing_guest_mix') {
    // Show energy arc note derived from Q1 answer
    contextNote = answers.dancing_energy_context || null
  }

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
              Dancing · {stepIndex + 1} of {totalSteps}
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
                  maxLength={currentStep.id === 'song_question' ? 400 : 200}
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
                    marginBottom: 8,
                    minHeight: 120,
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <p style={{ margin: 0, fontSize: 12, fontStyle: 'italic', color: '#6B6560' }}>
                    {currentStep.id === 'song_question'
                      ? 'List up to four songs — these become the ground truth for your plan.'
                      : 'Specific answers give you the best recommendations.'}
                  </p>
                  <span style={{ marginLeft: 16, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0,
                    color: textValue.length >= (currentStep.id === 'song_question' ? 400 : 200) ? '#E53E3E'
                         : textValue.length >= Math.floor((currentStep.id === 'song_question' ? 400 : 200) * 0.8) ? '#C4922A'
                         : '#6B6560' }}>
                    {textValue.length} / {currentStep.id === 'song_question' ? 400 : 200}
                  </span>
                </div>
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
