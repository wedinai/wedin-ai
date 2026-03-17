import React from 'react'

const STEPS = [1, 2, 3, 4, 5]

export default function ScaleQuestion({ question, value, onChange, onContinue, onSkip }) {
  const selected = value ? Number(value) : null

  function select(n) {
    onChange(String(n))
    setTimeout(onContinue, 260)
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-8">
      {/* Question */}
      <h2
        className="question-text"
        style={{ fontSize: '1.4375rem', lineHeight: 1.4, color: 'var(--navy)' }}
      >
        {question.question}
      </h2>

      {/* Scale */}
      <div className="flex flex-col gap-4">
        {/* Step buttons */}
        <div className="flex justify-between gap-2">
          {STEPS.map((n) => {
            const isSelected = selected === n
            return (
              <button
                key={n}
                onClick={() => select(n)}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 10,
                  border: isSelected
                    ? '2px solid var(--navy)'
                    : '1.5px solid rgba(28,43,58,0.14)',
                  background: isSelected ? 'var(--navy)' : 'var(--cream)',
                  color: isSelected ? 'var(--cream)' : 'var(--navy)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '1rem',
                  fontWeight: isSelected ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isSelected
                    ? '0 2px 8px rgba(28,43,58,0.18)'
                    : '0 1px 3px rgba(28,43,58,0.06)',
                }}
              >
                {n}
              </button>
            )
          })}
        </div>

        {/* Labels */}
        <div className="flex justify-between">
          <span
            className="font-sans text-caption"
            style={{ color: 'var(--grey)', maxWidth: '40%', lineHeight: 1.4 }}
          >
            {question.lowLabel}
          </span>
          <span
            className="font-sans text-caption text-right"
            style={{ color: 'var(--grey)', maxWidth: '40%', lineHeight: 1.4 }}
          >
            {question.highLabel}
          </span>
        </div>
      </div>

      {question.skipLabel && (
        <button className="btn-ghost text-center w-full" onClick={onSkip}>
          {question.skipLabel}
        </button>
      )}
    </div>
  )
}
