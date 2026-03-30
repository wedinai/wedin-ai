import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS_MAIN = [
  {
    id: 'firstdance_song',
    type: 'text',
    educate: "The first dance is the moment every eye in the room is on you. The song matters — but what the dance does to the room, and what happens in the thirty seconds after it ends, is what most couples forget to plan.",
    question: "Have you chosen your first dance song? Tell us what it is — or if you're still deciding, describe the feeling you're looking for.",
    placeholder: "e.g. La Vie En Rose — warm, nostalgic, a little bittersweet",
  },
  {
    id: 'firstdance_room_feeling',
    type: 'chips',
    question: "What should the first dance do to the room?",
    chips: [
      'Settle everyone in — warm, emotional, intimate',
      'Build slowly then open the floor with energy',
      'Start with energy and keep it going',
      "We're not sure yet",
      'Other — tell us more',
    ],
  },
  {
    id: 'firstdance_live_or_recorded',
    type: 'chips',
    question: "Do you want the song performed live by the band, or played as the original recording?",
    chips: [
      'Live performance',
      'Original recording',
      'Open to either',
      "We don't have a band — DJ only",
      'Other — tell us more',
    ],
  },
  {
    id: 'firstdance_additional',
    type: 'chips',
    question: "Are there other dances that matter — a father-daughter moment, a mother-son dance, or anyone else you want to bring onto the floor before it opens?",
    chips: [
      'Yes — there are additional dances',
      'No — just our first dance',
      "We haven't thought about this yet",
      'Other — tell us more',
    ],
  },
  {
    id: 'firstdance_transition',
    type: 'chips',
    question: "What happens the moment the first dance ends — how do you want the floor to open?",
    chips: [
      'Immediately — high energy, no pause',
      'A slow build — give the room a breath first',
      'Another dance follows before the floor opens',
      'Leave it to the act or DJ to read the room',
      "We haven't thought about this",
      'Other — tell us more',
    ],
  },
]

const STEPS_BRANCH = [
  {
    id: 'firstdance_additional_who',
    type: 'text',
    question: "Tell us who — father-daughter, mother-son, both sets of parents, or someone else. And if you have songs in mind for any of them, include those too.",
    placeholder: "e.g. Father-daughter: My Girl. Mother-son: still deciding.",
  },
  {
    id: 'firstdance_additional_sequence',
    type: 'chips',
    question: "How do you want these dances to flow?",
    chips: [
      'All together before the floor opens',
      'Spread through the evening',
      'Not sure yet',
      'Other — tell us more',
    ],
  },
]

// Computes the ordered step list based on current answers
function getActiveSteps(answers) {
  if (answers.firstdance_additional === 'Yes — there are additional dances') {
    return [
      STEPS_MAIN[0],
      STEPS_MAIN[1],
      STEPS_MAIN[2],
      STEPS_MAIN[3],
      STEPS_BRANCH[0],
      STEPS_BRANCH[1],
      STEPS_MAIN[4],
    ]
  }
  return STEPS_MAIN
}

// ── Conditional note helpers ───────────────────────────────────────────────

function getLiveContext(answer) {
  if (answer === 'Live performance') {
    return "A live first dance changes the feeling in the room — but it requires rehearsal and carries real risk around tempo, key, and feel. Make sure your act has performed this song before, or build rehearsal time into the brief."
  }
  if (answer === 'Original recording') {
    return "The original recording means the couple hears exactly what they fell in love with. Often the right call. We'll note this in your brief."
  }
  if (answer === 'Open to either') {
    return "We'll include both options in your brief with the tradeoffs clearly stated — your act or coordinator can advise based on what they know works."
  }
  return null // 'We don't have a band — DJ only' → no note
}

const ADDITIONAL_NOTE =
  "These dances are often the most personally meaningful moments of the night for the families involved. Planning the songs and sequence in advance means nothing gets forgotten on the day."

const TRANSITION_DISPLAY_NOTE =
  "The thirty seconds after the first dance ends is the most important transition of the night. We'll include a specific instruction to your act or DJ in the brief — what to play, when to start, and how to bring the room with them."

// ── Builds the final answers object (nulls out branch fields if branch not taken) ──

function buildFinalAnswers(answers) {
  const final = { ...answers }
  if (final.firstdance_additional !== 'Yes — there are additional dances') {
    final.firstdance_additional_who = null
    final.firstdance_additional_sequence = null
  }
  if (!('firstdance_live_context' in final)) final.firstdance_live_context = null
  if (!('firstdance_transition_context' in final)) final.firstdance_transition_context = null
  return final
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

export default function FirstDanceDeepDive({
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
    let newAnswers = { ...answers, [currentStep.id]: value }

    // Save context notes alongside the answer that generates them
    if (currentStep.id === 'firstdance_live_or_recorded') {
      newAnswers.firstdance_live_context = getLiveContext(value)
    }
    if (currentStep.id === 'firstdance_transition') {
      // Brief annotation — the display note is separate (TRANSITION_DISPLAY_NOTE)
      newAnswers.firstdance_transition_context = "Specific transition instruction included in brief."
    }

    setAnswers(newAnswers)

    // Re-derive active steps from newAnswers so branch changes take effect immediately
    const newActiveSteps = getActiveSteps(newAnswers)
    const nextIndex = stepIndex + 1
    if (nextIndex >= newActiveSteps.length) {
      onComplete?.(buildFinalAnswers(newAnswers))
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
  if (currentStep?.id === 'firstdance_additional') {
    contextNote = answers.firstdance_live_context || null
  } else if (currentStep?.id === 'firstdance_additional_who') {
    contextNote = ADDITIONAL_NOTE
  } else if (currentStep?.id === 'firstdance_transition') {
    contextNote = TRANSITION_DISPLAY_NOTE
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
              First Dance · {stepIndex + 1} of {totalSteps}
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
