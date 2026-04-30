import React, { useState, useEffect } from 'react'

// ── Step definitions ───────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'lastsong_song',
    type: 'text',
    educate: "The last song is the one moment where everyone in the room is together for the last time that night. Done well, it brings the whole room in — a deliberate close that people feel rather than just hear. Most couples never plan it. It ends up being whatever the DJ had queued. It deserves better than that.",
    question: "Have you thought about your last song? Tell us what it is — or describe the feeling you want that final moment to carry.",
    placeholder: "e.g. Don't Stop Believin' — everyone knows it. Or something quieter, just for us.",
  },
  {
    id: 'lastsong_energy',
    type: 'chips',
    question: "How do you want the night to end?",
    chips: [
      'A warm, emotional close — the whole room together one last time',
      'One final burst of energy — end on a high, together',
      'Something unmistakably us — a song that could only close our day',
      "We're not sure yet",
      'Other — tell us more',
    ],
  },
  {
    id: 'lastsong_instruction',
    type: 'chips',
    question: "Does your act or DJ know this is how you want the night to end — or does this need to be in the brief as a specific instruction?",
    chips: [
      "They know — it's already discussed",
      'It needs to be in the brief',
      "We haven't decided yet",
      'Other — tell us more',
    ],
  },
  {
    id: 'song_question',
    type: 'text',
    question: "Four songs that feel like the end of your night — songs that belong in the final hour, alongside or leading up to your last one. The floor thinning, the night winding down. Which four songs belong here?",
    placeholder: "Four songs for the final hour. Artists, titles, or feelings — anything helps.",
  },
]

// ── Conditional note helpers ───────────────────────────────────────────────

function getEnergyContext(answer) {
  if (answer === 'A warm, emotional close — the whole room together one last time') {
    return "A warm close works best when the act or DJ knows it's coming — and knows that nothing follows it. We'll include a specific instruction in your brief: this is the last track, no segue, no fade into something else."
  }
  if (answer === 'One final burst of energy — end on a high, together') {
    return "Ending on a high requires the same specific instruction — this is the last track, full energy, nothing after it. The room should still be feeling it as the night closes."
  }
  if (answer === 'Something unmistakably us — a song that could only close our day') {
    return "A closing song that feels personal is the strongest possible note to end on. We'll make sure your act or DJ knows this is the one — and that it plays in full, as the final moment of the night."
  }
  return null // "We're not sure yet"
}

const INSTRUCTION_NOTE =
  "We'll include a clear instruction in your brief: the last song, played in full, as the final moment of the night. No segue. No fade. A deliberate close that brings everyone together one last time."

function getInstructionContext(answer) {
  if (answer === 'It needs to be in the brief' || answer === "We haven't decided yet") {
    return INSTRUCTION_NOTE
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

export default function LastSongDeepDive({
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

    // Save conditional context notes alongside the triggering answer
    if (currentStep.id === 'lastsong_energy') {
      newAnswers.lastsong_energy_context = getEnergyContext(value)
    }
    if (currentStep.id === 'lastsong_instruction') {
      newAnswers.lastsong_instruction_context = getInstructionContext(value)
    }

    setAnswers(newAnswers)

    const nextIndex = stepIndex + 1
    if (nextIndex >= totalSteps) {
      const finalAnswers = {
        lastsong_song: newAnswers.lastsong_song || null,
        lastsong_energy: newAnswers.lastsong_energy || null,
        lastsong_energy_context: newAnswers.lastsong_energy_context || null,
        lastsong_instruction: newAnswers.lastsong_instruction || null,
        lastsong_instruction_context: newAnswers.lastsong_instruction_context || null,
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

  // Context note shown on Q3 screen — derived from Q2 answer
  const contextNote =
    currentStep?.id === 'lastsong_instruction'
      ? (answers.lastsong_energy_context || null)
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
              Last Song · {stepIndex + 1} of {totalSteps}
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
