import React, { useState, useEffect, useRef } from 'react'
import { questions, ANSWERABLE_COUNT } from '../data/questions.js'
import ProgressBar from './ProgressBar.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'
import TextQuestion from './TextQuestion.jsx'
import ChipsQuestion from './ChipsQuestion.jsx'
import ScaleQuestion from './ScaleQuestion.jsx'
import Acknowledgement from './Acknowledgement.jsx'
import CompletionScreen from './CompletionScreen.jsx'

// Conversational follow-ons — warm, never "Great choice!"
// Uses what they said when possible, otherwise a neutral bridge.
function getAcknowledgement(question, answer) {
  if (!answer || (Array.isArray(answer) && answer.length === 0)) return null

  switch (question.id) {
    case 'three_words':
      return `${answer}.`
    case 'most_anticipated_moment':
      return 'That moment will drive everything we build around it.'
    case 'relationship_song':
      return `${answer} — noted.`
    case 'stop_and_look':
      return 'That one matters.'
    case 'energy_lift':
      return 'That tells us a lot about your reception.'
    case 'guilty_pleasure':
      return 'This is often the most useful thing anyone tells us.'
    case 'perfect_music_memory':
      return "We'll build towards that feeling."
    case 'dance_vs_talk':
      return null // Single chip — no delay needed
    case 'processional':
      return 'The most important 60 seconds of music in the whole day.'
    case 'first_dance':
      return 'Everything flows from this.'
    case 'last_song':
      return 'The last song is always remembered. Good call thinking about it now.'
    default:
      return null
  }
}

export default function DiscoverySession({ onComplete, onSetCoupleName }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [phase, setPhase] = useState('question') // 'question' | 'ack'
  const [ackText, setAckText] = useState('')

  // Ref always holds the latest currentAnswer — prevents stale closures in
  // setTimeout-based auto-advance (single-select chips, scale questions).
  const currentAnswerRef = useRef(currentAnswer)
  currentAnswerRef.current = currentAnswer

  const current = questions[step]

  // Load saved answer when step changes
  useEffect(() => {
    const saved = answers[current?.id]
    setCurrentAnswer(saved !== undefined ? saved : '')
  }, [step])

  // Count answered questions for progress (skip welcome/complete)
  const answeredCount = Object.keys(answers).filter((id) => {
    const q = questions.find((q) => q.id === id)
    return q && q.type !== 'welcome' && q.type !== 'complete'
  }).length

  // Current question's section (for label)
  const answerableIndex = questions
    .slice(0, step + 1)
    .filter((q) => q.type !== 'welcome' && q.type !== 'complete').length

  function saveAndAdvance(skipAck = false) {
    // Always read from the ref so setTimeout-based callers get the fresh value
    const answer = currentAnswerRef.current

    // Save answer
    if (current.type !== 'welcome' && current.type !== 'complete') {
      setAnswers((prev) => ({ ...prev, [current.id]: answer }))
    }

    // Check for acknowledgement
    const ack = !skipAck ? getAcknowledgement(current, answer) : null

    if (ack && answer) {
      setAckText(ack)
      setPhase('ack')
    } else {
      advance()
    }
  }

  function advance() {
    // Reset currentAnswer immediately so the incoming question component never
    // receives a stale value from the previous question (e.g. an array from a
    // multiSelect chips question reaching a TextQuestion that calls .trim()).
    setCurrentAnswer('')
    setPhase('question')
    setStep((s) => Math.min(s + 1, questions.length - 1))
  }

  function goBack() {
    if (step > 0) {
      setCurrentAnswer('')
      setPhase('question')
      setStep((s) => s - 1)
    }
  }

  function skip() {
    // Mark as skipped (null) and move on
    setAnswers((prev) => ({ ...prev, [current.id]: null }))
    advance()
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (current.type === 'welcome') {
    return (
      <WelcomeScreen
        onStart={(name) => {
          onSetCoupleName?.(name)
          setStep(1)
        }}
      />
    )
  }

  if (current.type === 'complete') {
    return <CompletionScreen answers={answers} onViewPlan={() => onComplete?.(answers)} />
  }

  // Merge current in-progress answer with saved
  const displayAnswer =
    currentAnswer !== '' ? currentAnswer : answers[current.id] ?? ''

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--cream)' }}
    >
      {/* Progress — always at top */}
      <div className="sticky top-0 z-10 pt-4 pb-2" style={{ background: 'var(--cream)' }}>
        <ProgressBar
          current={answerableIndex}
          total={ANSWERABLE_COUNT}
          section={current.section}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-form mx-auto w-full">
        {/* Back button */}
        {step > 1 && (
          <button className="btn-back mb-8" onClick={goBack}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}

        {/* Acknowledgement phase */}
        {phase === 'ack' && (
          <Acknowledgement text={ackText} onDone={advance} />
        )}

        {/* Question phase */}
        {phase === 'question' && (
          <>
            {current.type === 'text' && (
              <TextQuestion
                key={current.id}
                question={current}
                value={displayAnswer}
                onChange={setCurrentAnswer}
                onContinue={saveAndAdvance}
                onSkip={skip}
              />
            )}

            {(current.type === 'chips' || current.type === 'single') && (
              <ChipsQuestion
                key={current.id}
                question={current}
                value={displayAnswer}
                onChange={setCurrentAnswer}
                onContinue={saveAndAdvance}
                onSkip={skip}
              />
            )}

            {current.type === 'scale' && (
              <ScaleQuestion
                key={current.id}
                question={current}
                value={displayAnswer}
                onChange={setCurrentAnswer}
                onContinue={saveAndAdvance}
                onSkip={skip}
              />
            )}
          </>
        )}
      </div>

      {/* Wordmark — bottom of screen */}
      <div className="py-6 text-center">
        <span
          className="wordmark"
          style={{ fontSize: '0.875rem', opacity: 0.4 }}
        >
          wedin.ai
        </span>
      </div>
    </div>
  )
}
