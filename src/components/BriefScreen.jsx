import React, { useState, useEffect } from 'react'

// ── Brief content renderer ─────────────────────────────────────────────────
// Parses **HEADING** lines and \n\n paragraph breaks from AI output

function BriefContent({ text }) {
  if (!text) return null
  return (
    <div>
      {text.split('\n\n').map((chunk, i) => {
        const trimmed = chunk.trim()
        if (!trimmed) return null
        const headingMatch = trimmed.match(/^\*\*(.+?)\*\*$/)
        if (headingMatch) {
          return (
            <p
              key={i}
              style={{
                margin: '32px 0 8px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: '#C4922A',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {headingMatch[1]}
            </p>
          )
        }
        return (
          <p
            key={i}
            style={{
              margin: '0 0 16px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: '#2C2C2C',
              lineHeight: 1.75,
            }}
          >
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

// ── Tab button ─────────────────────────────────────────────────────────────

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '10px 20px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        color: active ? '#1C2B3A' : '#6B6560',
        borderBottom: active ? '2px solid #1C2B3A' : '2px solid transparent',
        transition: 'all 180ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BriefScreen({
  momentAnswers,
  portrait,
  coupleName,
  sessionAnswers,
  onBack,
  onStartMIL,
}) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [coupleBrief, setCoupleBrief] = useState('')
  const [coordinatorBrief, setCoordinatorBrief] = useState('')
  const [activeTab, setActiveTab] = useState('couple') // 'couple' | 'coordinator'
  const [copyLabel, setCopyLabel] = useState('Copy to clipboard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    generateBrief()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateBrief() {
    try {
      const res = await fetch('/.netlify/functions/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ momentAnswers, portrait, coupleName, sessionAnswers }),
      })
      if (!res.ok) throw new Error('Brief generation failed')
      const data = await res.json()
      setCoupleBrief(data.coupleBrief || '')
      setCoordinatorBrief(data.coordinatorBrief || '')
      setStatus('ready')
    } catch (e) {
      console.error('Brief generation failed:', e)
      setStatus('error')
    }
  }

  function handleCopy() {
    const text = activeTab === 'couple' ? coupleBrief : coordinatorBrief
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied')
      setTimeout(() => setCopyLabel('Copy to clipboard'), 2000)
    })
  }

  if (!mounted) return null

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
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
            Assembling your brief…
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
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        `}</style>
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
          <h1
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              color: '#1C2B3A',
              textAlign: 'center',
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#6B6560',
              textAlign: 'center',
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            The brief couldn't be generated. Your answers are saved — try again.
          </p>
          <button
            onClick={generateBrief}
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
          <button
            onClick={onBack}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#6B6560',
            }}
          >
            Back to Moment Map
          </button>
        </div>
      </>
    )
  }

  // ── Ready ────────────────────────────────────────────────────────────────
  const activeBrief = activeTab === 'couple' ? coupleBrief : coordinatorBrief

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            padding: '40px 24px 0',
            animation: 'fadeUp 400ms ease both',
          }}
        >
          {/* Back */}
          <button
            onClick={onBack}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#6B6560',
              marginBottom: 32,
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
              <path d="M9 1L3 7l6 6" stroke="#6B6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Your music map
          </button>

          {/* Title */}
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: '#C4922A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {coupleName && coupleName !== 'Your Wedding' ? coupleName : 'Your wedding'}
          </p>
          <h1
            style={{
              margin: '0 0 8px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              fontWeight: 400,
              color: '#1C2B3A',
              lineHeight: 1.15,
            }}
          >
            Your music brief.
          </h1>
          <p
            style={{
              margin: '0 0 32px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#6B6560',
              lineHeight: 1.6,
            }}
          >
            Every moment, every instruction — assembled from your planning sessions.
          </p>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(28,43,58,0.1)',
              marginBottom: 32,
            }}
          >
            <Tab
              label="Your Brief"
              active={activeTab === 'couple'}
              onClick={() => setActiveTab('couple')}
            />
            <Tab
              label="Coordinator Brief"
              active={activeTab === 'coordinator'}
              onClick={() => setActiveTab('coordinator')}
            />
          </div>
        </div>

        {/* ── Brief content ────────────────────────────────────────────── */}
        <div
          key={activeTab}
          style={{
            maxWidth: 680,
            margin: '0 auto',
            padding: '0 24px',
            animation: 'fadeUp 250ms ease both',
          }}
        >
          <BriefContent text={activeBrief} />

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: 40,
              marginBottom: 64,
            }}
          >
            {onStartMIL && (
              <button
                onClick={onStartMIL}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  background: '#1C2B3A',
                  color: '#FAF7F2',
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: 'center',
                  transition: 'background 180ms ease',
                  boxSizing: 'border-box',
                }}
              >
                Build my music plan →
              </button>
            )}

            <button
              onClick={handleCopy}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 24px',
                background: '#1C2B3A',
                color: '#FAF7F2',
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'center',
                transition: 'background 180ms ease',
              }}
            >
              {copyLabel}
              {copyLabel === 'Copied' ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8l4 4 6-7" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <rect x="5" y="1" width="9" height="11" rx="2" stroke="#FAF7F2" strokeWidth="1.5" />
                  <path d="M11 12v2a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1h2" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>

            <button
              onClick={onBack}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 24px',
                border: '1.5px solid rgba(28,43,58,0.12)',
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#1C2B3A',
                textAlign: 'center',
              }}
            >
              Back to Moment Map
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
