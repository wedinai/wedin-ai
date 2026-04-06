import React, { useState, useEffect, useRef } from 'react'

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

// ── How to Book tab ────────────────────────────────────────────────────────

const VETTING_QUESTIONS = [
  'Ask for a set list — what songs do they actually play?',
  'Are they open to couple-requested songs if provided in advance?',
  'Do they use a backing track?',
  'What styles and genres can they genuinely play?',
  'Is this a fixed lineup or do they use deps?',
]

const BOOKING_LEAD_TIME =
  'Book 6–9 months out for live acts; 3–6 months for DJs and soloists. Outside Cape Town or Johannesburg, add travel costs and expect a shorter available pool.'

function HowToBook({ milRecommendations }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {milRecommendations.moments?.map((moment, i) => (
        <div
          key={i}
          style={{
            marginBottom: '32px',
            paddingBottom: '32px',
            borderBottom:
              i < milRecommendations.moments.length - 1
                ? '1px solid rgba(28,43,58,0.08)'
                : 'none',
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '22px',
              color: '#C4922A',
              margin: '0 0 12px 0',
              fontWeight: 400,
            }}
          >
            {moment.name}
          </h3>

          {moment.recommendation && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '14px' }}>Recommendation: </span>
              <span style={{ color: '#1C2B3A', fontSize: '14px' }}>{moment.recommendation}</span>
            </div>
          )}

          {moment.cost && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '14px' }}>Cost estimate: </span>
              <span style={{ color: '#1C2B3A', fontSize: '14px' }}>{moment.cost}</span>
            </div>
          )}

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28,43,58,0.08)',
              borderLeft: '3px solid #C4922A',
              borderRadius: '0 8px 8px 0',
              padding: '14px 16px',
              marginBottom: '12px',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: '#C4922A',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Before you book
            </p>
            <ol style={{ margin: 0, paddingLeft: '18px' }}>
              {VETTING_QUESTIONS.map((q, qi) => (
                <li
                  key={qi}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: '#1C2B3A',
                    lineHeight: 1.65,
                    marginBottom: qi < VETTING_QUESTIONS.length - 1 ? '6px' : 0,
                  }}
                >
                  {q}
                </li>
              ))}
            </ol>
          </div>

          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#6B6560',
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            {BOOKING_LEAD_TIME}
          </p>
        </div>
      ))}

      {milRecommendations.productionCheck && (
        <div
          style={{
            background: '#1C2B3A',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '8px',
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '20px',
              color: '#FAF7F2',
              margin: '0 0 16px 0',
              fontWeight: 400,
            }}
          >
            Production Reality Check
          </h3>
          <div style={{ color: '#FAF7F2', fontSize: '14px', marginBottom: '8px' }}>
            <strong>Total estimate:</strong> {milRecommendations.productionCheck.totalEstimate}
          </div>
          <div style={{ color: '#FAF7F2', fontSize: '14px', marginBottom: '8px' }}>
            <strong>Book first:</strong> {milRecommendations.productionCheck.bookFirst}
          </div>
          <div style={{ color: 'rgba(250,247,242,0.7)', fontSize: '13px' }}>
            {milRecommendations.productionCheck.hiddenCosts}
          </div>
        </div>
      )}
    </div>
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
  milRecommendations = null,
  initialTab = null,
}) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [coupleBrief, setCoupleBrief] = useState('')
  const [coordinatorBrief, setCoordinatorBrief] = useState('')
  const [activeTab, setActiveTab] = useState(
    initialTab || (milRecommendations ? 'musicPlan' : 'couple')
  ) // 'musicPlan' | 'couple' | 'coordinator'
  const [copyLabel, setCopyLabel] = useState('Copy to clipboard')
  const [copyMusicPlanLabel, setCopyMusicPlanLabel] = useState('Copy to clipboard')
  const [mounted, setMounted] = useState(false)
  const abortRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    generateBrief()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateBrief() {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setCoupleBrief('')
    setCoordinatorBrief('')

    try {
      const [res1, res2] = await Promise.all([
        fetch('/.netlify/functions/generate-brief-a', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ momentAnswers, portrait, coupleName, sessionAnswers }),
          signal: controller.signal,
        }),
        fetch('/.netlify/functions/generate-brief-b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ momentAnswers, portrait, coupleName, sessionAnswers }),
          signal: controller.signal,
        }),
      ])
      if (!res1.ok || !res2.ok) throw new Error('Brief generation failed')
      const [data1, data2] = await Promise.all([res1.json(), res2.json()])
      if (controller.signal.aborted) return
      setCoupleBrief(data1.coupleBrief || '')
      setCoordinatorBrief(data2.coordinatorBrief || '')
      setStatus('ready')
    } catch (e) {
      if (e.name === 'AbortError') return
      console.error('Brief generation failed:', e)
      setStatus('error')
    }
  }

  function copyMusicPlan() {
    if (!milRecommendations) return
    const lines = []
    if (milRecommendations.moments) {
      milRecommendations.moments.forEach((m) => {
        lines.push(m.name.toUpperCase())
        if (m.recommendation) lines.push(`Recommendation: ${m.recommendation}`)
        if (m.why)            lines.push(`Why: ${m.why}`)
        if (m.instruction)    lines.push(`Brief instruction: ${m.instruction}`)
        lines.push('')
      })
    }
    if (milRecommendations.productionCheck) {
      const pc = milRecommendations.productionCheck
      lines.push('PRODUCTION REALITY CHECK')
      if (pc.totalEstimate) lines.push(`Total estimate: ${pc.totalEstimate}`)
      if (pc.bookFirst)     lines.push(`Book first: ${pc.bookFirst}`)
      if (pc.hiddenCosts)   lines.push(`Hidden costs: ${pc.hiddenCosts}`)
    }
    navigator.clipboard.writeText(lines.join('\n').trim()).then(() => {
      setCopyMusicPlanLabel('Copied')
      setTimeout(() => setCopyMusicPlanLabel('Copy to clipboard'), 2000)
    })
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
            We hit a snag.
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
            We couldn't generate your brief. Your answers are saved — try again.
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
  const isMILJson = milRecommendations && typeof milRecommendations === 'object'
  const activeBrief = activeTab === 'couple' ? coupleBrief : activeTab === 'coordinator' ? coordinatorBrief : ''

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
              overflowX: 'auto',
            }}
          >
            {milRecommendations && (
              <Tab
                label="Music Plan"
                active={activeTab === 'musicPlan'}
                onClick={() => setActiveTab('musicPlan')}
              />
            )}
            <Tab
              label="How to Book"
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
          {activeTab === 'musicPlan' && milRecommendations ? (
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {isMILJson ? (
                <>
                  {milRecommendations.moments?.map((moment, i) => (
                    <div key={i} style={{
                      marginBottom: '32px',
                      paddingBottom: '32px',
                      borderBottom: i < milRecommendations.moments.length - 1 ? '1px solid rgba(28,43,58,0.08)' : 'none',
                    }}>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '22px',
                        color: '#C4922A',
                        margin: '0 0 12px 0',
                        fontWeight: 400,
                      }}>{moment.name}</h3>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '14px' }}>Recommendation: </span>
                        <span style={{ color: '#1C2B3A', fontSize: '14px' }}>{moment.recommendation}</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '14px' }}>Why: </span>
                        <span style={{ color: '#6B6560', fontSize: '14px' }}>{moment.why}</span>
                      </div>
                      <div style={{
                        background: 'rgba(196,146,42,0.06)',
                        borderLeft: '3px solid #C4922A',
                        borderRadius: '0 8px 8px 0',
                        padding: '12px 16px',
                        marginTop: '12px',
                      }}>
                        <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '13px' }}>Brief instruction: </span>
                        <span style={{ color: '#1C2B3A', fontSize: '13px', fontStyle: 'italic' }}>{moment.instruction}</span>
                      </div>
                    </div>
                  ))}
                  {milRecommendations.productionCheck && (
                    <div style={{
                      background: '#1C2B3A',
                      borderRadius: '12px',
                      padding: '24px',
                      marginTop: '8px',
                    }}>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '20px',
                        color: '#FAF7F2',
                        margin: '0 0 16px 0',
                        fontWeight: 400,
                      }}>Production Reality Check</h3>
                      <div style={{ color: '#FAF7F2', fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Total estimate:</strong> {milRecommendations.productionCheck.totalEstimate}
                      </div>
                      <div style={{ color: '#FAF7F2', fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Book first:</strong> {milRecommendations.productionCheck.bookFirst}
                      </div>
                      <div style={{ color: 'rgba(250,247,242,0.7)', fontSize: '13px' }}>
                        {milRecommendations.productionCheck.hiddenCosts}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: milRecommendations }} />
              )}
            </div>
          ) : activeTab === 'couple' && isMILJson ? (
            <HowToBook milRecommendations={milRecommendations} />
          ) : (
            <BriefContent text={activeBrief} />
          )}

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
            {onStartMIL && !milRecommendations && (
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

            {activeTab === 'musicPlan' && milRecommendations && (
            <button
              onClick={copyMusicPlan}
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
              {copyMusicPlanLabel}
              {copyMusicPlanLabel === 'Copied' ? (
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
            )}

            {activeTab !== 'musicPlan' && (
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
            )}

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
