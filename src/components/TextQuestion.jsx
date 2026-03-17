import React, { useState, useRef, useEffect } from 'react'

export default function TextQuestion({ question, value, onChange, onContinue, onSkip }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    // Auto-focus on mount, small delay for animation
    const t = setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus()
    }, 300)
    return () => clearTimeout(t)
  }, [question.id])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])

  const canContinue = value && value.trim().length > 0

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && canContinue) {
      e.preventDefault()
      onContinue()
    }
  }

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

      {/* Input */}
      <textarea
        ref={textareaRef}
        className="input-wedin resize-none overflow-hidden"
        style={{ padding: '14px 16px', minHeight: 56 }}
        placeholder={question.placeholder || 'Your answer...'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
      />

      {/* Actions */}
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

      <p
        className="font-sans text-caption text-center"
        style={{ color: 'var(--grey)', opacity: 0.55 }}
      >
        Enter to continue · Shift + Enter for new line
      </p>
    </div>
  )
}
