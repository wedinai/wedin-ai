import React, { useState } from 'react'

export default function WelcomeScreen({ onStart }) {
  const [coupleName, setCoupleName] = useState('')

  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      {/* Wordmark */}
      <div className="mb-12">
        <span className="wordmark text-2xl">wedin.ai</span>
      </div>

      {/* Hero */}
      <div className="max-w-sm mx-auto mb-10">
        <h1
          className="font-display mb-4"
          style={{
            fontSize: 'clamp(2.25rem, 9vw, 3.5rem)',
            lineHeight: 1.1,
            fontWeight: 300,
            color: 'var(--navy)',
          }}
        >
          Start with{' '}
          <span style={{ color: 'var(--gold)' }}>the music.</span>
        </h1>

        <p
          className="font-sans mt-5"
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--grey)',
            fontWeight: 400,
          }}
        >
          Eight minutes. A few honest answers. Your complete music portrait — and
          everything that follows from it.
        </p>
      </div>

      {/* Name input */}
      <div className="w-full max-w-xs mb-6 text-left">
        <label
          className="font-sans block mb-2"
          style={{ fontSize: '0.875rem', color: 'var(--navy)', fontWeight: 500 }}
        >
          What are your names?
        </label>
        <input
          type="text"
          value={coupleName}
          onChange={(e) => setCoupleName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && coupleName.trim()) onStart(coupleName.trim())
          }}
          placeholder="e.g. Sarah & James"
          className="w-full font-sans"
          style={{
            padding: '12px 16px',
            border: '1.5px solid #D9D4CE',
            borderRadius: '8px',
            fontSize: '1rem',
            color: 'var(--navy)',
            background: 'var(--white)',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={(e) => (e.target.style.borderColor = '#D9D4CE')}
        />
      </div>

      {/* CTA */}
      <button
        className="btn-primary w-full max-w-xs"
        onClick={() => { if (coupleName.trim()) onStart(coupleName.trim()) }}
        disabled={!coupleName.trim()}
        style={{ opacity: coupleName.trim() ? 1 : 0.45, cursor: coupleName.trim() ? 'pointer' : 'not-allowed' }}
      >
        Begin your music portrait
      </button>

      {/* Reassurance */}
      <p
        className="font-sans mt-6 text-caption"
        style={{ color: 'var(--grey)', opacity: 0.75 }}
      >
        No wrong answers. Just yours.
      </p>
    </div>
  )
}
