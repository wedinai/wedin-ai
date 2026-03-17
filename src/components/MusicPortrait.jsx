import React, { useEffect, useState } from 'react'

// ── Portrait generation via Netlify Function ───────────────────────────────

async function generateNarrative(answers) {
  try {
    const res = await fetch('/.netlify/functions/generate-portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.narrative ?? null
  } catch (e) {
    console.error('Portrait generation failed:', e)
    return null
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MusicPortrait({ answers, sessionId, onStartOver, onViewMomentMap }) {
  const [narrative, setNarrative] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [saveState, setSaveState] = useState('idle') // idle | submitting | done

  useEffect(() => {
    generateNarrative(answers).then((text) => {
      setNarrative(text)
      setLoading(false)
    })
  }, [])

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSaveState('submitting')

    try {
      await fetch('/.netlify/functions/save-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), session_id: sessionId }),
      })
    } catch (e) {
      console.error('Contact save failed:', e)
    }

    setSaveState('done')
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream)' }}
      >
        <p
          className="font-display text-center"
          style={{
            fontSize: '1.125rem',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--navy)',
            opacity: 0.7,
          }}
        >
          Building your music portrait…
        </p>
      </div>
    )
  }

  // ── Portrait ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-form mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <p
            className="font-sans font-medium uppercase mb-4"
            style={{ color: 'var(--gold)', letterSpacing: '0.14em', fontSize: '0.6875rem' }}
          >
            Your music portrait
          </p>
          <h1
            className="font-display"
            style={{ fontSize: '2rem', fontWeight: 400, lineHeight: 1.25, color: 'var(--navy)' }}
          >
            {answers['three_words'] || 'Your wedding in music'}
          </h1>
        </div>

        {/* Narrative — the hero */}
        {narrative && (
          <div className="mb-12" style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 24 }}>
            <p
              className="font-display"
              style={{
                fontSize: '1.25rem',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.8,
                color: 'var(--navy)',
              }}
            >
              {narrative}
            </p>
          </div>
        )}

        {/* Email capture */}
        <div className="card" style={{ padding: '32px 28px' }}>
          {saveState === 'done' ? (
            <div className="py-4">
              <p
                className="font-display mb-2"
                style={{
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--navy)',
                  lineHeight: 1.5,
                }}
              >
                You've made a start.
              </p>
              <p
                className="font-sans mb-6"
                style={{ fontSize: '0.9375rem', color: 'var(--grey)', lineHeight: 1.6 }}
              >
                We'll be in touch as your soundtrack comes together.
              </p>
              <button
                onClick={onViewMomentMap}
                className="btn-primary w-full"
              >
                See your music map →
              </button>
            </div>
          ) : (
            <>
              <p
                className="font-sans font-medium uppercase mb-3"
                style={{ color: 'var(--gold)', letterSpacing: '0.14em', fontSize: '0.6875rem' }}
              >
                Your soundtrack begins
              </p>
              <p
                className="font-display mb-3"
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: 'var(--navy)',
                }}
              >
                You've begun the soundtrack to your day.
              </p>
              <p
                className="font-sans mb-6"
                style={{ fontSize: '0.9375rem', color: 'var(--grey)', lineHeight: 1.6 }}
              >
                Save this so we can keep building towards the music your wedding deserves.
                Leave your email and we'll be in touch as your plan takes shape.
              </p>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full mb-3"
                  style={{
                    background: 'var(--cream)',
                    border: '1.5px solid rgba(18,24,40,0.18)',
                    borderRadius: 8,
                    padding: '14px 16px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    color: 'var(--navy)',
                    outline: 'none',
                    transition: 'border-color 200ms',
                    minHeight: 44,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--navy)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(18,24,40,0.18)' }}
                />
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={saveState === 'submitting'}
                  style={{ opacity: saveState === 'submitting' ? 0.6 : 1 }}
                >
                  {saveState === 'submitting' ? 'Saving…' : 'Save my progress'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Start over */}
        <div className="text-center mt-6">
          <button
            onClick={onStartOver}
            className="font-sans"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'var(--grey)',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              padding: '8px 0',
            }}
          >
            Start over
          </button>
        </div>

        {/* Wordmark */}
        <div className="py-10 text-center">
          <span className="wordmark" style={{ fontSize: '0.875rem', opacity: 0.4 }}>
            wedin.ai
          </span>
        </div>

      </div>
    </div>
  )
}
