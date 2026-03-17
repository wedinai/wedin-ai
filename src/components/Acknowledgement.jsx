import React, { useEffect, useState } from 'react'

/**
 * Conversational follow-on after an answer — shown briefly before the next question.
 * Never says "Great choice!" per the voice rules.
 */
export default function Acknowledgement({ text, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 200)
    }, 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="animate-fade-in flex items-center justify-center min-h-[120px]"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <p
        className="font-display text-center"
        style={{
          fontSize: '1.25rem',
          lineHeight: 1.5,
          color: 'var(--navy)',
          fontStyle: 'italic',
          fontWeight: 400,
          maxWidth: 320,
        }}
      >
        {text}
      </p>
    </div>
  )
}
