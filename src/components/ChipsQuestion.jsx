import React, { useState, useEffect } from 'react'

export default function ChipsQuestion({ question, value, onChange, onContinue, onSkip }) {
  const [otherInput, setOtherInput] = useState('')

  useEffect(() => { setOtherInput('') }, [question.id])

  // value is an array for multiSelect, string for single
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const otherIsSelected = selected.includes('other_tell_us_more')

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

  function handleContinue() {
    if (otherIsSelected) {
      const trimmed = otherInput.trim()
      if (!trimmed) return
      if (question.multiSelect) {
        const next = selected
          .filter((id) => id !== 'other_tell_us_more')
          .concat('Other: ' + trimmed)
        onChange(next)
      } else {
        onChange('Other: ' + trimmed)
      }
    }
    onContinue()
  }

  const canContinue = selected.length > 0 && (!otherIsSelected || otherInput.trim())

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
              // For single-select, auto-advance — unless it's the other option
              if (!question.multiSelect && opt.id !== 'other_tell_us_more') {
                setTimeout(onContinue, 220)
              }
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Other — text input */}
      {otherIsSelected && (
        <input
          autoFocus
          type="text"
          value={otherInput}
          onChange={(e) => setOtherInput(e.target.value)}
          placeholder="Tell us more…"
          style={{
            display: 'block',
            width: '100%',
            background: '#FFFFFF',
            border: '1.5px solid var(--navy)',
            borderRadius: 10,
            padding: '14px 16px',
            fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--navy)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && otherInput.trim()) handleContinue()
          }}
        />
      )}

      {/* Single-select: show Continue when other is selected */}
      {!question.multiSelect && otherIsSelected && (
        <button
          className="btn-primary w-full"
          disabled={!otherInput.trim()}
          onClick={handleContinue}
        >
          Continue
        </button>
      )}

      {/* Multi-select continue */}
      {question.multiSelect && (
        <div className="flex flex-col gap-3">
          <button
            className="btn-primary w-full"
            disabled={!canContinue}
            onClick={handleContinue}
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
      {!question.multiSelect && question.skipLabel && !otherIsSelected && (
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
