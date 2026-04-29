import React, { useState, useEffect, useRef } from 'react'

export default function WeddingSoundtrackScreen({
  momentAnswers,
  portrait,
  coupleName,
  sessionAnswers,
  userEmail,
  onConfirm,
  onSetCoupleBrief,
}) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [coupleBrief, setCoupleBrief] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const abortRef = useRef(null)

  useEffect(() => {
    generateWeddingSoundtrack()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateWeddingSoundtrack() {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('loading')
    setCoupleBrief('')
    try {
      const res = await fetch('/.netlify/functions/generate-brief-a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ momentAnswers, portrait, coupleName, sessionAnswers }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      if (controller.signal.aborted) return
      const brief = data.coupleBrief || ''
      setCoupleBrief(brief)
      if (onSetCoupleBrief) onSetCoupleBrief(brief)
      setStatus('ready')
    } catch (e) {
      if (e.name === 'AbortError') return
      console.error('Wedding Soundtrack generation failed:', e)
      setStatus('error')
    }
  }

  async function handleEmailSoundtrack() {
    if (!userEmail || emailStatus === 'sending' || emailStatus === 'sent') return
    setEmailStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/send-wedding-soundtrack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, coupleBrief, coupleName }),
      })
      if (!res.ok) throw new Error('Email failed')
      setEmailStatus('sent')
    } catch (e) {
      console.error('Wedding Soundtrack email failed:', e)
      setEmailStatus('error')
    }
  }

  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    * { box-sizing: border-box; }
  `

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <>
        <style>{style}</style>
        <div
          style={{
            minHeight: '100vh',
            background: '#FAF7F2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '0 24px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#1C2B3A',
              textAlign: 'center',
              animation: 'pulse 2s ease infinite',
            }}
          >
            Building your wedding soundtrack…
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#6B6560',
              textAlign: 'center',
            }}
          >
            This takes about 30 seconds.
          </p>
        </div>
      </>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <>
        <style>{style}</style>
        <div
          style={{
            minHeight: '100vh',
            background: '#FAF7F2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            padding: '0 24px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#1C2B3A',
              textAlign: 'center',
            }}
          >
            We hit a snag — tap to try again.
          </p>
          <button
            onClick={generateWeddingSoundtrack}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '13px 28px',
              background: '#1C2B3A',
              color: '#FAF7F2',
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </div>
      </>
    )
  }

  // ── Ready ────────────────────────────────────────────────────────────────
  const paragraphs = coupleBrief
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  return (
    <>
      <style>{style}</style>
      <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            padding: '56px 24px 80px',
            animation: 'fadeUp 400ms ease both',
          }}
        >
          {/* Gold label */}
          <p
            style={{
              margin: '0 0 12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: '#C4922A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            YOUR WEDDING SOUNDTRACK
          </p>

          {/* Heading */}
          <h1
            style={{
              margin: '0 0 10px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              fontWeight: 400,
              color: '#1C2B3A',
              lineHeight: 1.15,
            }}
          >
            Your wedding soundtrack.
          </h1>

          {/* Sub-heading */}
          <p
            style={{
              margin: '0 0 40px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#6B6560',
              lineHeight: 1.5,
            }}
          >
            Every moment of your day, the way you described it.
          </p>

          {/* Content block — gold bordered */}
          <div
            style={{
              background: 'rgba(196,146,42,0.05)',
              border: '1px solid rgba(28,43,58,0.06)',
              borderLeft: '3px solid #C4922A',
              borderRadius: '0 12px 12px 0',
              padding: '28px 28px 28px 24px',
              marginBottom: 40,
            }}
          >
            {paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  margin: i === paragraphs.length - 1 ? 0 : '0 0 16px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: '#1C2B3A',
                  lineHeight: 1.75,
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Email button */}
          {userEmail && (
            <button
              onClick={handleEmailSoundtrack}
              disabled={emailStatus === 'sending' || emailStatus === 'sent'}
              style={{
                all: 'unset',
                cursor: emailStatus === 'sent' ? 'default' : 'pointer',
                display: 'block',
                width: '100%',
                padding: '13px 24px',
                border: '1.5px solid #1C2B3A',
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: emailStatus === 'sent' ? '#6B6560' : '#1C2B3A',
                textAlign: 'center',
                marginBottom: 16,
                opacity: emailStatus === 'sending' ? 0.6 : 1,
                boxSizing: 'border-box',
              }}
            >
              {emailStatus === 'sending'
                ? 'Sending…'
                : emailStatus === 'sent'
                ? 'Sent to ' + userEmail
                : emailStatus === 'error'
                ? 'Try again →'
                : 'Email me my wedding soundtrack →'}
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={onConfirm}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              padding: '16px 24px',
              background: '#1C2B3A',
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: '#FAF7F2',
              textAlign: 'center',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          >
            Build my music plan →
          </button>

          {/* Sub-note */}
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontStyle: 'italic',
              color: '#6B6560',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Two quick questions — then your music plan, how to book, and your coordinator's brief.
          </p>
        </div>
      </div>
    </>
  )
}
