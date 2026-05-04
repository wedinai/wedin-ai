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

const VETTING_QUESTIONS_BY_TYPE = {
  dj: [
    'Does this DJ have experience with weddings of your size and venue type?',
    'Can you hear a recent wedding set or see a recent setlist?',
    'Do they own professional outdoor PA if your venue requires it?',
    'What is their backup plan if equipment fails?',
    'Are they comfortable with a specific wind-down arc rather than a fixed set?',
  ],
  band: [
    'What is the band\'s exact lineup on your date — no deps without approval?',
    'Can they provide a live recording from a recent wedding, not a studio recording?',
    'Do they provide their own backline and PA or does that need to be hired separately?',
    'What is their set length and break structure?',
    'Have they played your specific venue or a similar size before?',
  ],
  acoustic: [
    'Can they perform the specific songs you named — ask for a sample recording of each one?',
    'Do they have their own PA for outdoor or large indoor spaces?',
    'What is their set length and can they sustain it without repetition?',
    'Are they open to requests on the day?',
  ],
  strings: [
    'Can they perform contemporary arrangements — not just classical repertoire?',
    'Ask for sample recordings of the specific pieces you named.',
    'What is their dep policy — will the same musicians play on your day?',
    'Do they provide their own music stands and need specific stage requirements?',
  ],
  choir: [
    'Can they perform both traditional and contemporary repertoire as your brief requires?',
    'What is their minimum booking size and what is included in rehearsal?',
    'Do they have experience with weddings and cultural ceremonies specifically?',
    'Ask for a sample recording of the traditional pieces you need.',
  ],
  recorded: [
    'Confirm your venue\'s PA system is adequate for your guest count.',
    'Does your DJ have the specific songs you named in their library?',
    'Who is responsible for cueing songs at the right moment — DJ, coordinator, or AV technician?',
  ],
}

function getVettingQuestions(momentName, recommendation) {
  if (momentName === 'Your Wedding') return []
  if (!recommendation) return VETTING_QUESTIONS_BY_TYPE.dj
  const r = recommendation.toLowerCase()
  if (r.includes('choir')) return VETTING_QUESTIONS_BY_TYPE.choir
  if (r.includes('quartet') || r.includes('string') || r.includes('classical')) return VETTING_QUESTIONS_BY_TYPE.strings
  if (r.includes('band')) return VETTING_QUESTIONS_BY_TYPE.band
  if (r.includes('acoustic') || r.includes('solo') || r.includes('duo') || r.includes('jazz') || r.includes('marimba') || r.includes('saxophone') || r.includes('sax')) return VETTING_QUESTIONS_BY_TYPE.acoustic
  if (r.includes('recorded') || r.includes('playlist')) return VETTING_QUESTIONS_BY_TYPE.recorded
  if (r.includes('dj')) return VETTING_QUESTIONS_BY_TYPE.dj
  return VETTING_QUESTIONS_BY_TYPE.dj
}

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

          {(() => {
            const questions = getVettingQuestions(moment.name, moment.recommendation)
            if (!questions.length) return null
            return (
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
                  {questions.map((q, qi) => (
                    <li
                      key={qi}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '13px',
                        color: '#1C2B3A',
                        lineHeight: 1.65,
                        marginBottom: qi < questions.length - 1 ? '6px' : 0,
                      }}
                    >
                      {q}
                    </li>
                  ))}
                </ol>
              </div>
            )
          })()}

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

    </div>
  )
}

// ── Plain text extraction for Music Plan ──────────────────────────────────

function buildMusicPlanText(milRecommendations) {
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
  return lines.join('\n').trim()
}

function buildHowToBookText(milRecommendations) {
  const lines = []
  if (milRecommendations.moments) {
    milRecommendations.moments.forEach((m) => {
      lines.push(m.name.toUpperCase())
      if (m.recommendation) lines.push(`Recommendation: ${m.recommendation}`)
      if (m.cost)           lines.push(`Cost estimate: ${m.cost}`)
      lines.push('')
      const questions = getVettingQuestions(m.name, m.recommendation)
      if (questions.length) {
        lines.push('BEFORE YOU BOOK')
        questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`))
      }
      lines.push('')
      lines.push(BOOKING_LEAD_TIME)
      lines.push('')
    })
  }
  return lines.join('\n').trim()
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BriefScreen({
  momentAnswers,
  portrait,
  coupleName,
  sessionAnswers,
  onBack,
  milRecommendations = null,
  milBudget = '',
  coordinatorProfile = 'venue',
  initialTab = null,
  spotifyPlaylistUrl = null,
  spotifyLoading = false,
  coupleBrief: coupleBriefProp = '',
  budgetData = null,
  onBudgetGenerated,
}) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [coupleBrief, setCoupleBrief] = useState('')
  const [coordinatorBrief, setCoordinatorBrief] = useState('')
  const [activeTab, setActiveTab] = useState(
    initialTab || (milRecommendations ? 'musicPlan' : 'couple')
  ) // 'musicPlan' | 'couple' | 'coordinator' | 'budget'
  const [copyLabel, setCopyLabel] = useState('Copy to clipboard')
  const [copyMusicPlanLabel, setCopyMusicPlanLabel] = useState('Copy to clipboard')
  const [mounted, setMounted] = useState(false)
  const abortRef = useRef(null)
  const [musicPlanEmailStatus, setMusicPlanEmailStatus] = useState('idle')
  const [storedEmail, setStoredEmail] = useState('')
  const [inlineEmail, setInlineEmail] = useState('')
  const [showInlineEmail, setShowInlineEmail] = useState(false)
  const [coordEmail, setCoordEmail] = useState('')
  const [coordSendStatus, setCoordSendStatus] = useState('idle')
  const [howToBookEmailStatus, setHowToBookEmailStatus] = useState('idle')
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [budgetError, setBudgetError] = useState(false)
  const [completePlanStatus, setCompletePlanStatus] = useState('idle')
  const [completePlanEmail, setCompletePlanEmail] = useState('')

  useEffect(() => {
    setMounted(true)
    generateBrief()
    const saved = localStorage.getItem('wedin_email')
    if (saved) {
      setStoredEmail(saved)
      setCompletePlanEmail(saved)
    }
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateBrief() {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setCoordinatorBrief('')

    // If coupleBrief arrived as a prop (generated on WeddingSoundtrackScreen),
    // use it directly — skip the generate-brief-a call to avoid a second non-deterministic generation.
    if (coupleBriefProp) {
      setCoupleBrief(coupleBriefProp)
    } else {
      setCoupleBrief('')
    }

    try {
      const briefAPromise = coupleBriefProp
        ? Promise.resolve(null) // skip — prop already has the value
        : fetch('/.netlify/functions/generate-brief-a', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ momentAnswers, portrait, coupleName, sessionAnswers }),
            signal: controller.signal,
          })

      const briefBPromise = fetch('/.netlify/functions/generate-brief-b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ momentAnswers, portrait, coupleName, sessionAnswers, coordinatorProfile }),
        signal: controller.signal,
      })

      const [res1, res2] = await Promise.all([briefAPromise, briefBPromise])
      if (res1 && !res1.ok) throw new Error('Brief generation failed')
      if (!res2.ok) throw new Error('Brief generation failed')

      const [data1, data2] = await Promise.all([
        res1 ? res1.json() : Promise.resolve(null),
        res2.json(),
      ])
      if (controller.signal.aborted) return

      if (data1) setCoupleBrief(data1.coupleBrief || '')
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
    navigator.clipboard.writeText(buildMusicPlanText(milRecommendations)).then(() => {
      setCopyMusicPlanLabel('Copied')
      setTimeout(() => setCopyMusicPlanLabel('Copy to clipboard'), 2000)
    })
  }

  async function handleEmailMusicPlan() {
    const emailToUse = storedEmail || inlineEmail.trim()
    if (!emailToUse) {
      setShowInlineEmail(true)
      return
    }
    if (!milRecommendations) return
    setMusicPlanEmailStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/send-music-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          content: buildMusicPlanText(milRecommendations),
          coupleName,
        }),
      })
      if (!res.ok) throw new Error('failed')
      if (!storedEmail) setStoredEmail(emailToUse)
      setMusicPlanEmailStatus('sent')
    } catch {
      setMusicPlanEmailStatus('error')
    }
  }

  async function handleEmailCoordinator() {
    if (!coordEmail.trim()) return
    setCoordSendStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/send-coordinator-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinatorEmail: coordEmail.trim(),
          content: coordinatorBrief,
          coupleName,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setCoordSendStatus('sent')
    } catch {
      setCoordSendStatus('error')
    }
  }

  async function handleEmailHowToBook() {
    const emailToUse = storedEmail || inlineEmail.trim()
    if (!emailToUse) {
      setShowInlineEmail(true)
      return
    }
    if (!milRecommendations) return
    setHowToBookEmailStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/send-music-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          content: buildHowToBookText(milRecommendations),
          coupleName,
        }),
      })
      if (!res.ok) throw new Error('failed')
      if (!storedEmail) setStoredEmail(emailToUse)
      setHowToBookEmailStatus('sent')
    } catch {
      setHowToBookEmailStatus('error')
    }
  }

  async function handleSendCompletePlan() {
    const emailToUse = completePlanEmail.trim()
    if (!emailToUse) return
    setCompletePlanStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/send-complete-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, coupleName, coupleBrief, milRecommendations }),
      })
      if (!res.ok) throw new Error('failed')
      setCompletePlanStatus('sent')
    } catch {
      setCompletePlanStatus('error')
    }
  }

  async function generateBudget() {
    if (!milRecommendations) return
    setBudgetLoading(true)
    setBudgetError(false)
    try {
      const res = await fetch('/.netlify/functions/generate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupleName,
          milRecommendations,
          sessionAnswers,
          milAnswers: { mil_budget: milBudget },
        }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (onBudgetGenerated) onBudgetGenerated(data)
    } catch {
      setBudgetError(true)
    } finally {
      setBudgetLoading(false)
    }
  }

  function handleDownloadBudget() {
    if (!budgetData?.data) return
    const binary = atob(budgetData.data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = budgetData.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleCopy() {
    const text = (activeTab === 'couple' && milRecommendations)
      ? buildHowToBookText(milRecommendations)
      : activeTab === 'couple' ? coupleBrief : coordinatorBrief
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied')
      setTimeout(() => setCopyLabel('Copy to clipboard'), 2000)
    })
  }

  useEffect(() => {
    if (activeTab === 'budget' && !budgetData && !budgetLoading) {
      generateBudget()
    }
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

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
              background: 'none',
              border: 'none',
              fontSize: 13,
              color: '#6B6560',
              cursor: 'pointer',
              textDecoration: 'underline',
              opacity: 0.65,
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 12,
              display: 'block',
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
            Your music plan.
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
            What we'd recommend, and how to make it happen.
          </p>

          {/* Spotify playlist banner */}
          {spotifyLoading && (
            <div style={{
              marginBottom: 24,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#6B6560',
              animation: 'pulse 2s ease infinite',
            }}>
              Building your playlist…
            </div>
          )}
          {!spotifyLoading && spotifyPlaylistUrl && (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28,43,58,0.06)',
              borderLeft: '3px solid #C4922A',
              borderRadius: '0 8px 8px 0',
              padding: '12px 16px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <p style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#1C2B3A',
                lineHeight: 1.4,
              }}>
                Your wedding soundtrack is ready.
              </p>
              <a
                href={spotifyPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1C2B3A',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Open in Spotify →
              </a>
            </div>
          )}

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
            <Tab
              label="What This Costs"
              active={activeTab === 'budget'}
              onClick={() => setActiveTab('budget')}
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
          {activeTab === 'budget' ? (
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {budgetLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 40 }}>
                  <p style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#1C2B3A',
                    textAlign: 'center',
                    animation: 'pulse 2s ease infinite',
                  }}>
                    Building your budget plan…
                  </p>
                  <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6B6560', textAlign: 'center' }}>
                    This takes about 20 seconds.
                  </p>
                </div>
              )}

              {budgetError && !budgetLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 40 }}>
                  <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6B6560', textAlign: 'center', lineHeight: 1.6 }}>
                    We couldn't generate your budget plan. Try again in a moment.
                  </p>
                  <button
                    onClick={generateBudget}
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
              )}

              {budgetData && !budgetLoading && (
                <>
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(28,43,58,0.06)',
                    borderLeft: '3px solid #C4922A',
                    borderRadius: '0 8px 8px 0',
                    padding: '16px 20px',
                    marginBottom: 24,
                  }}>
                    <p style={{ margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C2B3A' }}>
                      Your music budget
                    </p>
                    <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6B6560', lineHeight: 1.6 }}>
                      A planning spreadsheet with illustrative costs for each moment, a booking timeline, and a hidden costs checklist. Update it as real quotes come in.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadBudget}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '14px 24px',
                      background: '#1C2B3A',
                      color: '#FAF7F2',
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    Download your budget plan →
                  </button>
                </>
              )}
            </div>
          ) : activeTab === 'musicPlan' && milRecommendations ? (
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {milBudget === 'not_sure' && (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#6B6560',
                  fontStyle: 'italic',
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}>
                  Cost estimates below are indicative — treat them as reference points and confirm directly with acts.
                </p>
              )}
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
                      {moment.recommendation && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '14px' }}>Recommendation: </span>
                          <span style={{ color: '#1C2B3A', fontSize: '14px' }}>{moment.recommendation}</span>
                        </div>
                      )}
                      {moment.why && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontWeight: 500, color: '#1C2B3A', fontSize: '14px' }}>Why: </span>
                          <span style={{ color: '#6B6560', fontSize: '14px' }}>{moment.why}</span>
                        </div>
                      )}
                      {moment.instruction && (
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
                      )}
                    </div>
                  ))}
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
            {/* ── Music Plan tab actions ─────────────────────────────── */}
            {activeTab === 'musicPlan' && milRecommendations && (
              <>
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

                {showInlineEmail && musicPlanEmailStatus === 'idle' && (
                  <input
                    type="email"
                    value={inlineEmail}
                    onChange={e => setInlineEmail(e.target.value)}
                    placeholder="Your email address"
                    style={{
                      all: 'unset',
                      width: '100%',
                      padding: '13px 16px',
                      background: '#FFFFFF',
                      border: '1.5px solid rgba(28,43,58,0.15)',
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: '#1C2B3A',
                      boxSizing: 'border-box',
                    }}
                  />
                )}

                <button
                  onClick={musicPlanEmailStatus === 'error' ? () => setMusicPlanEmailStatus('idle') : handleEmailMusicPlan}
                  disabled={musicPlanEmailStatus === 'sending' || musicPlanEmailStatus === 'sent'}
                  style={{
                    all: 'unset',
                    cursor: musicPlanEmailStatus === 'sending' || musicPlanEmailStatus === 'sent' ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 24px',
                    border: '1.5px solid rgba(28,43,58,0.12)',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: musicPlanEmailStatus === 'error' ? '#C0392B' : '#1C2B3A',
                    textAlign: 'center',
                    opacity: musicPlanEmailStatus === 'sending' ? 0.5 : 1,
                  }}
                >
                  {musicPlanEmailStatus === 'sent'
                    ? `Sent to ${storedEmail} ✓`
                    : musicPlanEmailStatus === 'error'
                    ? 'Something went wrong — try again'
                    : musicPlanEmailStatus === 'sending'
                    ? 'Sending…'
                    : 'Email me my music plan →'}
                </button>
              </>
            )}

            {/* ── How to Book tab actions ────────────────────────────── */}
            {activeTab === 'couple' && (
              <>
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

                {showInlineEmail && howToBookEmailStatus === 'idle' && (
                  <input
                    type="email"
                    value={inlineEmail}
                    onChange={e => setInlineEmail(e.target.value)}
                    placeholder="Your email address"
                    style={{
                      all: 'unset',
                      width: '100%',
                      padding: '13px 16px',
                      background: '#FFFFFF',
                      border: '1.5px solid rgba(28,43,58,0.15)',
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: '#1C2B3A',
                      boxSizing: 'border-box',
                    }}
                  />
                )}

                <button
                  onClick={howToBookEmailStatus === 'error' ? () => setHowToBookEmailStatus('idle') : handleEmailHowToBook}
                  disabled={howToBookEmailStatus === 'sending' || howToBookEmailStatus === 'sent'}
                  style={{
                    all: 'unset',
                    cursor: howToBookEmailStatus === 'sending' || howToBookEmailStatus === 'sent' ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 24px',
                    border: '1.5px solid rgba(28,43,58,0.12)',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: howToBookEmailStatus === 'error' ? '#C0392B' : '#1C2B3A',
                    textAlign: 'center',
                    opacity: howToBookEmailStatus === 'sending' ? 0.5 : 1,
                  }}
                >
                  {howToBookEmailStatus === 'sent'
                    ? `Sent to ${storedEmail} ✓`
                    : howToBookEmailStatus === 'error'
                    ? 'Something went wrong — try again'
                    : howToBookEmailStatus === 'sending'
                    ? 'Sending…'
                    : 'Email me my how to book guide →'}
                </button>
              </>
            )}

            {/* ── Coordinator Brief tab actions ──────────────────────── */}
            {activeTab === 'coordinator' && (
              <>
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

                <input
                  type="email"
                  value={coordEmail}
                  onChange={e => { setCoordEmail(e.target.value); if (coordSendStatus !== 'idle') setCoordSendStatus('idle') }}
                  placeholder="Your coordinator's email address"
                  style={{
                    all: 'unset',
                    width: '100%',
                    padding: '13px 16px',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(28,43,58,0.15)',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: '#1C2B3A',
                    boxSizing: 'border-box',
                  }}
                />

                <button
                  onClick={coordSendStatus === 'error' ? () => setCoordSendStatus('idle') : handleEmailCoordinator}
                  disabled={coordSendStatus === 'sending' || coordSendStatus === 'sent' || !coordEmail.trim()}
                  style={{
                    all: 'unset',
                    cursor: coordSendStatus === 'sending' || coordSendStatus === 'sent' || !coordEmail.trim() ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 24px',
                    background: coordSendStatus === 'sent' ? 'rgba(28,43,58,0.06)' : '#1C2B3A',
                    color: coordSendStatus === 'sent' ? '#1C2B3A' : coordSendStatus === 'error' ? '#C0392B' : '#FAF7F2',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'center',
                    opacity: coordSendStatus === 'sending' || (!coordEmail.trim() && coordSendStatus === 'idle') ? 0.5 : 1,
                  }}
                >
                  {coordSendStatus === 'sent'
                    ? `Sent to ${coordEmail} ✓`
                    : coordSendStatus === 'error'
                    ? 'Something went wrong — try again'
                    : coordSendStatus === 'sending'
                    ? 'Sending…'
                    : 'Send to coordinator →'}
                </button>
              </>
            )}

          </div>
        </div>

        {/* ── Completion card ───────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            padding: '32px 24px 64px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28,43,58,0.06)',
              borderLeft: '3px solid #C4922A',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <p
              style={{
                margin: '0 0 12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 18,
                fontWeight: 500,
                color: '#1C2B3A',
              }}
            >
              You're ready.
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: '#6B6560',
                lineHeight: 1.7,
              }}
            >
              Your wedding soundtrack, music plan, coordinator brief, and budget guide are all here. Your next move is the first booking conversation — start with whoever your plan recommends, and book early.
            </p>
            <p
              style={{
                margin: '12px 0 0',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#6B6560',
                opacity: 0.65,
              }}
            >
              Your plan is saved. Use the link in your portrait email to come back any time.
            </p>

            <div style={{ marginTop: 20 }}>
              <p
                style={{
                  margin: '0 0 8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#6B6560',
                }}
              >
                Send everything to:
              </p>
              <input
                type="email"
                value={completePlanEmail}
                onChange={e => {
                  setCompletePlanEmail(e.target.value)
                  if (completePlanStatus !== 'idle') setCompletePlanStatus('idle')
                }}
                placeholder="your@email.com"
                style={{
                  all: 'unset',
                  display: 'block',
                  width: '100%',
                  padding: '13px 16px',
                  background: '#FAF7F2',
                  border: '1.5px solid rgba(28,43,58,0.15)',
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#1C2B3A',
                  boxSizing: 'border-box',
                  marginBottom: 12,
                }}
              />
              <button
                onClick={completePlanStatus === 'error' ? () => setCompletePlanStatus('idle') : handleSendCompletePlan}
                disabled={completePlanStatus === 'sending' || completePlanStatus === 'sent' || !completePlanEmail.trim()}
                style={{
                  all: 'unset',
                  cursor: completePlanStatus === 'sending' || completePlanStatus === 'sent' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 44,
                  background: completePlanStatus === 'sent' ? 'rgba(28,43,58,0.06)' : '#1C2B3A',
                  color: completePlanStatus === 'sent' ? '#C4922A' : completePlanStatus === 'error' ? '#C0392B' : '#FAF7F2',
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  opacity: completePlanStatus === 'sending' || !completePlanEmail.trim() ? 0.5 : 1,
                }}
              >
                {completePlanStatus === 'sent'
                  ? `Sent to ${completePlanEmail} ✓`
                  : completePlanStatus === 'error'
                  ? 'Something went wrong — try again'
                  : completePlanStatus === 'sending'
                  ? 'Sending…'
                  : 'Email me everything →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  onClick={onBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    color: '#6B6560',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    opacity: 0.65,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Want to update an answer? Return to your moment map
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
