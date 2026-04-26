import React, { useEffect, useState } from 'react'

export default function MELSummaryScreen({
  sessionAnswers,
  momentAnswers,
  portrait,
  coupleName,
  email,
  onConfirm,
}) {
  const [melSummary, setMelSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [sendState, setSendState] = useState('idle') // idle | sending | sent | error

  useEffect(() => {
    fetchSummary()
  }, [])

  async function fetchSummary() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/.netlify/functions/generate-mel-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portrait, sessionAnswers, momentAnswers, coupleName }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      if (!data.melSummary) throw new Error('Empty response')
      setMelSummary(data.melSummary)
      localStorage.setItem('wedin_mel_summary', data.melSummary)
    } catch (e) {
      console.error('MEL summary generation failed:', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendEmail(e) {
    e.preventDefault()
    const recipient = email || emailInput.trim()
    if (!recipient || !melSummary) return
    setSendState('sending')
    try {
      const res = await fetch('/.netlify/functions/send-mel-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recipient, melSummary, coupleName }),
      })
      if (!res.ok) throw new Error('Send failed')
      setSendState('sent')
    } catch (e) {
      console.error('MEL summary email failed:', e)
      setSendState('error')
    }
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
          Reading your whole day…
        </p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream)' }}
      >
        <div className="max-w-form mx-auto px-6 text-center">
          <p
            className="font-sans mb-6"
            style={{ fontSize: '1rem', color: 'var(--grey)', lineHeight: 1.6 }}
          >
            Something went wrong — tap to try again.
          </p>
          <button onClick={fetchSummary} className="btn-primary">
            Try again →
          </button>
        </div>
      </div>
    )
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-form mx-auto px-6 py-16">

        {/* Label */}
        <p
          className="font-sans font-medium uppercase mb-8"
          style={{ color: 'var(--gold)', letterSpacing: '0.14em', fontSize: '0.6875rem' }}
        >
          Your day as a whole
        </p>

        {/* The paragraph — hero */}
        <div
          style={{
            borderLeft: '3px solid var(--gold)',
            background: 'rgba(196,146,42,0.06)',
            padding: '20px 24px',
            borderRadius: '0 8px 8px 0',
            marginBottom: '48px',
          }}
        >
          <p
            className="font-display"
            style={{
              fontSize: '1.25rem',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'var(--navy)',
              margin: 0,
            }}
          >
            {melSummary}
          </p>
        </div>

        {/* Confirm button */}
        <button onClick={onConfirm} className="btn-primary w-full" style={{ marginBottom: '20px' }}>
          Build my music plan →
        </button>

        {/* Soft reference */}
        <p
          className="font-sans text-center"
          style={{
            fontSize: '0.875rem',
            color: 'var(--grey)',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          Want the thinking behind each moment? Your nine moment insights are on your Moment Map.
        </p>

        {/* Email section */}
        <div style={{ borderTop: '1px solid rgba(28,43,58,0.08)', paddingTop: '28px' }}>
          {sendState === 'sent' ? (
            <p
              className="font-sans text-center"
              style={{ fontSize: '0.9375rem', color: 'var(--grey)', lineHeight: 1.6 }}
            >
              Sent. Check your inbox.
            </p>
          ) : email ? (
            <div className="text-center">
              <button
                onClick={handleSendEmail}
                disabled={sendState === 'sending'}
                className="font-sans"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: sendState === 'sending' ? 'default' : 'pointer',
                  fontSize: '0.9375rem',
                  color: sendState === 'error' ? '#C4922A' : 'var(--navy)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  padding: '8px 0',
                  opacity: sendState === 'sending' ? 0.5 : 1,
                }}
              >
                {sendState === 'sending'
                  ? 'Sending…'
                  : sendState === 'error'
                  ? 'Something went wrong — try again'
                  : 'Email me this summary →'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendEmail}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email address"
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
                disabled={sendState === 'sending'}
                className="font-sans w-full text-center"
                style={{
                  background: 'none',
                  border: '1.5px solid rgba(28,43,58,0.18)',
                  borderRadius: 8,
                  cursor: sendState === 'sending' ? 'default' : 'pointer',
                  fontSize: '0.9375rem',
                  color: 'var(--navy)',
                  padding: '13px 16px',
                  minHeight: 44,
                  opacity: sendState === 'sending' ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {sendState === 'sending' ? 'Sending…' : 'Email me this summary →'}
              </button>
              {sendState === 'error' && (
                <p
                  className="font-sans text-center mt-2"
                  style={{ fontSize: '0.875rem', color: '#C4922A' }}
                >
                  Something went wrong — try again.
                </p>
              )}
            </form>
          )}
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
