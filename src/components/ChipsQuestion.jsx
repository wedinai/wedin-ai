import React from 'react'

export default function ChipsQuestion({ question, value, onChange, onContinue, onSkip }) {
  // value is an array for multiSelect, string for single
  const selected = Array.isArray(value) ? value : value ? [value] : []

  function toggle(optionId) {
    if (question.multiSelect) {
      const next = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId]
      onChange(next)
    } else {
      // single select — immediately advances on tap
      onChange(optionId)
    }
  }

  const canContinue = selected.length > 0

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      {/* Question */}
      <h2
        className="question-text"
        style={{ fontSize: '1.4375rem', lineHeight: 1.4, color: 'var(--navy)' }}
      >
        {question.question}
      </h2>

      {/* Hint */}
      {question.hint && (
        <p
          className="font-sans text-caption"
          style={{ color: 'var(--grey)', marginTop: -8 }}
        >
          {question.hint}
        </p>
      )}

      {/* Chips */}
      <div className="flex flex-wrap gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            className={`chip ${selected.includes(opt.id) ? 'selected' : ''}`}
            onClick={() => {
              toggle(opt.id)
              // For single-select, auto-advance after a brief moment so user sees selection
              if (!question.multiSelect) {
                setTimeout(onContinue, 220)
              }
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Multi-select continue */}
      {question.multiSelect && (
        <div className="flex flex-col gap-3">
          <button
            className="btn-primary w-full"
            disabled={!canContinue}
            onClick={onContinue}
          >
            Continue
          </button>

          {question.skipLabel && (
            <button className="btn-ghost text-center w-full" onClick={onSkip}>
              {question.skipLabel}
            </button>
          )}
        </div>
      )}

      {/* Single-select skip */}
      {!question.multiSelect && question.skipLabel && (
        <button className="btn-ghost text-center w-full" onClick={onSkip}>
          {question.skipLabel}
        </button>
      )}

      {question.multiSelect && (
        <p
          className="font-sans text-caption text-center"
          style={{ color: 'var(--grey)', opacity: 0.55 }}
        >
          Select all that apply
        </p>
      )}
    </div>
  )
}
