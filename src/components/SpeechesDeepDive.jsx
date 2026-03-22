import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS_MAIN = [
  {
    id: 'speeches_count',
    type: 'chips',
    educate: "Speeches are where the most personal moments of the day live. The music around them — how each speaker is introduced, how the room is held between speeches, and how the energy transitions out — is one of the most underused personalisation tools in wedding planning.",
    question: "How many speeches are you expecting?",
    chips: [
      '1–2',
      '3–4',
      '5 or more',
      'Not sure yet',
    ],
  },
  {
    id: 'speeches_intro_songs',
    type: 'chips',
    question: "Do you want each speaker introduced with a song — something the room recognises, maybe something that says something about that person?",
    chips: [
      'Yes — this appeals to us',
      'Maybe for some speakers',
      'No — keep it simple',
      "We hadn't thought about this",
    ],
  },
  {
    id: 'speeches_between',
    type: 'chips',
    question: "Between speeches, how do you want the room to feel — should the music hold the energy, or give guests a natural moment to breathe and move?",
    chips: [
      'Hold the energy — keep the room focused',
      'Give guests a moment to breathe and move',
      'Depends on the speech — flexible',
      'Not sure yet',
    ],
  },
  {
    id: 'speeches_outro',
    type: 'chips',
    question: "How do you want the speeches to end — what should the music do the moment the last speech is done?",
    chips: [
      'Transition straight into dancing — high energy',
      'A softer close — let the room settle before dancing',
      'First dance follows speeches',
      'Not sure yet',
    ],
  },
  {
    id: 'speeches_surprises',
    type: 'chips',
    question: "Are there any surprise musical moments planned around the speeches — a guest performer, a song dedication, anything the couple or MC has arranged?",
    chips: [
      "Yes — there's something planned",
      'Possibly — still being discussed',
      'No surprises',
      'Not sure yet',
    ],
  },
]

const STEPS_BRANCH = [
  {
    id: 'speeches_intro_details',
    type: 'text',
    question: "Tell us who's speaking and any song ideas you have for each person — even rough ideas help. If you're not sure yet, describe the tone you're after for each speaker.",
    placeholder: "e.g. Best man: something funny. Father of bride: Frank Sinatra. MOH: still deciding.",
  },
]

const INTRO_BRANCH_VALUES = ['Yes — this appeals to us', 'Maybe for some speakers']

function getActiveSteps(answers) {
  if (INTRO_BRANCH_VALUES.includes(answers.speeches_intro_songs)) {
    return [
      STEPS_MAIN[0],
      STEPS_MAIN[1],
      STEPS_BRANCH[0],
      STEPS_MAIN[2],
      STEPS_MAIN[3],
      STEPS_MAIN[4],
    ]
  }
  return STEPS_MAIN
}

// ── Conditional note helpers ───────────────────────────────────────────────

const INTRO_NOTE =
  "An intro song for each speaker tells the room something about that person before they've said a word. It can be warm, funny, or quietly meaningful — and it gives the DJ or band a specific cue rather than an awkward pause. We'll build this into your brief speaker by speaker."

function getOutroContext(answer) {
  if (answer === 'Transition straight into dancing — high energy') {
    return "This is one of the sharpest transitions of the night. The act or DJ needs a specific instruction — what track, at what volume, the moment the last speaker sits down. We'll include this in your brief."
  }
  if (answer === 'A softer close — let the room settle before dancing') {
    return "A deliberate pause after speeches before the floor opens gives guests a moment to process. Done well it builds anticipation. We'll map this transition in your brief."
  }
  if (answer === 'First dance follows speeches') {
    return "Speeches into first dance is a clean, logical sequence — the room is already focused and emotional. We'll connect these two moments in your brief so the transition is seamless."
  }
  return null // 'Not sure yet'
}

const SURPRISES_NOTE =
  "Surprise moments need a brief too — the act or DJ needs to know exactly when it happens, what their role is, and what comes before and after. We'll include a coordination note in your brief."

function getSurprisesContext(answer) {
  if (answer === "Yes — there's something planned" || answer === 'Possibly — still being discussed') {
    return SURPRISES_NOTE
  }
  return null
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

export default function SpeechesDeepDive({
  sessionId,
  coupleName,
  onComplete,
  onBack,
}) {
  const [answers, setAnswers] = useState({})
  const [stepIndex, setStepIndex] = useState(0)
  const [screen, setScreen] = useState('question') // 'question' | 'complete'
  const [textValue, setTextValue] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Sync textarea value when navigating to a text step
  useEffect(() => {
    const step = getActiveSteps(answers)[stepIndex]
    if (step?.type === 'text') {
      setTextValue(answers[step.id] || '')
    }
  }, [stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeSteps = getActiveSteps(answers)
  const totalSteps = activeSteps.length
  const currentStep = activeSteps[stepIndex]

  function saveAndAdvance(value) {
    const newAnswers = { ...answers, [currentStep.id]: value }

    // Save conditional context notes alongside the triggering answer
    if (currentStep.id === 'speeches_outro') {
      newAnswers.speeches_outro_context = getOutroContext(value)
    }
    if (currentStep.id === 'speeches_surprises') {
      newAnswers.speeches_surprises_context = getSurprisesContext(value)
    }

    setAnswers(newAnswers)

    // Re-derive active steps from newAnswers so branch changes take effect immediately
    const newActiveSteps = getActiveSteps(newAnswers)
    const nextIndex = stepIndex + 1
    if (nextIndex >= newActiveSteps.length) {
      setScreen('complete')
    } else {
      setStepIndex(nextIndex)
    }
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
  if (currentStep?.id === 'speeches_intro_details') {
    // Always shown when on the branch step (means Q2 was Yes or Maybe)
    contextNote = INTRO_NOTE
  } else if (currentStep?.id === 'speeches_surprises') {
    // Show outro context note derived from Q4 answer
    contextNote = answers.speeches_outro_context || null
  }

  if (!mounted) return null

  // ── Completion screen ────────────────────────────────────────────────────
  if (screen === 'complete') {
    const finalAnswers = {
      speeches_count: answers.speeches_count || null,
      speeches_intro_songs: answers.speeches_intro_songs || null,
      speeches_intro_details: INTRO_BRANCH_VALUES.includes(answers.speeches_intro_songs)
        ? (answers.speeches_intro_details || null)
        : null,
      speeches_between: answers.speeches_between || null,
      speeches_outro: answers.speeches_outro || null,
      speeches_outro_context: answers.speeches_outro_context || null,
      speeches_surprises: answers.speeches_surprises || null,
      speeches_surprises_context: answers.speeches_surprises_context || null,
    }

    // Surprises note shown on completion screen if applicable
    const completionNote = finalAnswers.speeches_surprises_context

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px 64px' }}>

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
            Speeches · Complete
          </p>

          <h1
            style={{
              margin: '0 0 24px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              fontWeight: 400,
              color: '#1C2B3A',
              lineHeight: 1.2,
            }}
          >
            Speeches are planned.
          </h1>

          {completionNote && (
            <ContextNote text={completionNote} />
          )}

          <p
            style={{
              margin: '0 0 40px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#6B6560',
              lineHeight: 1.7,
            }}
          >
            The most personal moments of the day — and the music around them — are mapped. Your answers are saved and will feed into your music brief.
          </p>

          <button
            onClick={() => onComplete?.(finalAnswers)}
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
            Back to your Moment Map
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
              Speeches · {stepIndex + 1} of {totalSteps}
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
                    onClick={() => saveAndAdvance(chip)}
                  />
                ))}
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
