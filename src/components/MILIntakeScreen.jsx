import React, { useState } from 'react'

const BUDGET_OPTIONS = [
  { id: 'under_30k',    label: 'Under R30,000' },
  { id: '30k_60k',      label: 'R30,000 – R60,000' },
  { id: '60k_100k',     label: 'R60,000 – R100,000' },
  { id: '100k_150k',    label: 'R100,000 – R150,000' },
  { id: 'over_150k',    label: 'Over R150,000' },
  { id: 'not_sure',     label: "We're not sure yet — show us what's possible" },
]

const BOOKING_OPTIONS = [
  { id: 'nothing_booked',  label: 'No — everything is still open' },
  { id: 'dj_booked',       label: 'Yes — we have a DJ booked' },
  { id: 'band_booked',     label: 'Yes — we have a band booked' },
  { id: 'dj_and_live',     label: 'Yes — we have a DJ and some live acts booked' },
  { id: 'planner_handling', label: 'We have a planner who is handling this' },
]

// ── Chip option button ─────────────────────────────────────────────────────

function ChipOption({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'block',
        width: '100%',
        padding: '14px 20px',
        borderRadius: 10,
        border: `1.5px solid ${selected ? '#1C2B3A' : 'rgba(28,43,58,0.12)'}`,
        background: selected ? '#1C2B3A' : '#FFFFFF',
        color: selected ? '#FAF7F2' : '#1C2B3A',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: selected ? 500 : 400,
        lineHeight: 1.4,
        textAlign: 'left',
        transition: 'all 150ms ease',
        marginBottom: 0,
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function MILIntakeScreen({
  onComplete,
  portrait,
  sessionAnswers,
  momentAnswers,
  coupleName,
}) {
  const [step, setStep] = useState(0)           // 0 = Q1, 1 = Q2
  const [milBudget, setMilBudget] = useState(null)
  const [milBookings, setMilBookings] = useState(null)
  const [phase, setPhase] = useState('questions') // 'questions' | 'loading' | 'error'
  const [selectedAnswers, setSelectedAnswers] = useState({})

  function handleBudgetSelect(id) {
    setMilBudget(id)
    setSelectedAnswers((prev) => ({ ...prev, mil_budget: id }))
    setTimeout(() => setStep(1), 350)
  }

  function handleBookingsSelect(id) {
    setMilBookings(id)
    const answers = { ...selectedAnswers, mil_existing_bookings: id }
    setSelectedAnswers(answers)
    setTimeout(() => generateMIL(answers), 350)
  }

  async function generateMIL(answers) {
    setPhase('loading')
    try {
      const payload = { portrait, sessionAnswers, momentAnswers, milAnswers: answers, coupleName }
      const [res1, res2] = await Promise.all([
        fetch('/.netlify/functions/generate-mil-a', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch('/.netlify/functions/generate-mil-b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ])
      if (!res1.ok || !res2.ok) {
        const [err1, err2] = await Promise.all([
          res1.ok ? Promise.resolve(null) : res1.json().catch(() => ({ error: 'unreadable' })),
          res2.ok ? Promise.resolve(null) : res2.json().catch(() => ({ error: 'unreadable' })),
        ])
        if (err1) console.error('MIL-A error response:', res1.status, err1)
        if (err2) console.error('MIL-B error response:', res2.status, err2)
        throw new Error('MIL generation failed')
      }
      const [data1, data2] = await Promise.all([res1.json(), res2.json()])
      const combined = {
        moments: [
          ...(data1.milRecommendations?.moments || []),
          ...(data2.milRecommendations?.moments || []),
        ],
        productionCheck: data2.milRecommendations?.productionCheck || null,
      }
      onComplete(answers, combined)
    } catch (e) {
      console.error('MIL generation failed:', e)
      setPhase('error')
    }
  }

  function retry() {
    generateMIL(selectedAnswers)
  }

  // ── Loading ────────────────────────────────────────────────────────────

  if (phase === 'loading') {
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
            Building your music plan…
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

  // ── Error ──────────────────────────────────────────────────────────────

  if (phase === 'error') {
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
            Your answers are saved. Try again in a moment.
          </p>
          <button
            onClick={retry}
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
              boxSizing: 'border-box',
            }}
          >
            Try again
          </button>
        </div>
      </>
    )
  }

  // ── Questions ──────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Progress bar strip */}
        <div
          style={{
            height: 3,
            background: 'rgba(28,43,58,0.06)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              height: '100%',
              width: step === 0 ? '50%' : '100%',
              background: 'linear-gradient(90deg, #1C2B3A, #C4922A)',
              transition: 'width 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>

        {/* Step label */}
        <div
          style={{
            padding: '16px 24px 0',
            maxWidth: 560,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: '#6B6560',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Step {step + 1} of 2
          </p>
        </div>

        {/* Content */}
        <div
          key={step}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '32px 24px 48px',
            maxWidth: 560,
            margin: '0 auto',
            width: '100%',
            animation: 'fadeUp 300ms ease both',
          }}
        >
          {step === 0 && (
            <>
              {/* Educate line */}
              <p
                style={{
                  margin: '0 0 28px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: '#6B6560',
                  lineHeight: 1.65,
                }}
              >
                This covers everything — your act, any DJ, live musicians across the whole day. Even a rough range is enough.
              </p>

              <h2
                style={{
                  margin: '0 0 24px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 400,
                  color: '#1C2B3A',
                  lineHeight: 1.25,
                }}
              >
                What's your total music budget for the day?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BUDGET_OPTIONS.map((opt) => (
                  <ChipOption
                    key={opt.id}
                    label={opt.label}
                    selected={milBudget === opt.id}
                    onClick={() => handleBudgetSelect(opt.id)}
                  />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2
                style={{
                  margin: '0 0 24px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 400,
                  color: '#1C2B3A',
                  lineHeight: 1.25,
                }}
              >
                Have you already booked any acts or a DJ?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BOOKING_OPTIONS.map((opt) => (
                  <ChipOption
                    key={opt.id}
                    label={opt.label}
                    selected={milBookings === opt.id}
                    onClick={() => handleBookingsSelect(opt.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Wordmark */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem',
              opacity: 0.4,
              color: '#1C2B3A',
              letterSpacing: '0.05em',
            }}
          >
            wedin.ai
          </span>
        </div>
      </div>
    </>
  )
}
