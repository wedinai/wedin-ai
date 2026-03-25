import React, { useState, useEffect } from 'react'

export default function PostBriefScreen({ onStartMIL }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        .postbrief-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 56px;
        }
        @media (min-width: 520px) {
          .postbrief-cards {
            flex-direction: row;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 560,
            width: '100%',
            animation: 'fadeUp 400ms ease both',
          }}
        >
          {/* ── Top section ─────────────────────────────────────────── */}
          <p
            style={{
              margin: '0 0 16px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: '#C4922A',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Your music plan
          </p>

          <h1
            style={{
              margin: '0 0 16px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 40,
              fontWeight: 300,
              color: '#1C2B3A',
              lineHeight: 1.15,
            }}
          >
            Every moment of your day is mapped.
          </h1>

          <p
            style={{
              margin: '0 0 48px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: '#6B6560',
              lineHeight: 1.7,
            }}
          >
            You've done the hard part — you know how you want your day to feel.
            The next step is turning that into a plan: which acts, what to book,
            and what your coordinator needs to know.
          </p>

          {/* ── Three feature cards ──────────────────────────────────── */}
          <div className="postbrief-cards">

            {/* Card 1 — Act recommendations */}
            <div
              style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '20px 18px',
                boxShadow: '0 2px 12px rgba(28,43,58,0.06)',
                border: '1px solid rgba(28,43,58,0.06)',
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 18V6l12-2v12"
                    stroke="#C4922A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="6" cy="18" r="3" stroke="#C4922A" strokeWidth="1.5" />
                  <circle cx="18" cy="16" r="3" stroke="#C4922A" strokeWidth="1.5" />
                </svg>
              </div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1C2B3A',
                  lineHeight: 1.3,
                }}
              >
                Act recommendations
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: '#6B6560',
                  lineHeight: 1.5,
                }}
              >
                Which live acts and DJs serve each moment
              </p>
            </div>

            {/* Card 2 — Budget guidance */}
            <div
              style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '20px 18px',
                boxShadow: '0 2px 12px rgba(28,43,58,0.06)',
                border: '1px solid rgba(28,43,58,0.06)',
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="9" cy="7" r="3" stroke="#C4922A" strokeWidth="1.5" />
                  <path
                    d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
                    stroke="#C4922A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="17" cy="7" r="3" stroke="#C4922A" strokeWidth="1.5" />
                  <path
                    d="M17 14c1.8 0 3.5 1.2 4.5 4"
                    stroke="#C4922A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1C2B3A',
                  lineHeight: 1.3,
                }}
              >
                Budget guidance
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: '#6B6560',
                  lineHeight: 1.5,
                }}
              >
                What things actually cost, including what's hidden
              </p>
            </div>

            {/* Card 3 — Coordinator brief */}
            <div
              style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '20px 18px',
                boxShadow: '0 2px 12px rgba(28,43,58,0.06)',
                border: '1px solid rgba(28,43,58,0.06)',
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                    stroke="#C4922A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6M8 13h8M8 17h8M8 9h2"
                    stroke="#C4922A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1C2B3A',
                  lineHeight: 1.3,
                }}
              >
                Coordinator brief
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: '#6B6560',
                  lineHeight: 1.5,
                }}
              >
                A document your planner can act on immediately
              </p>
            </div>
          </div>

          {/* ── Bottom CTA ───────────────────────────────────────────── */}
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#1C2B3A',
              lineHeight: 1.3,
            }}
          >
            Ready to build your music plan?
          </h2>

          <p
            style={{
              margin: '0 0 32px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: '#6B6560',
              lineHeight: 1.6,
            }}
          >
            Two quick questions about your budget and what you've already booked
            — then we'll give you specific recommendations for every moment of
            the day.
          </p>

          <button
            onClick={onStartMIL}
            style={{
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 52,
              background: '#1C2B3A',
              color: '#FAF7F2',
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              marginBottom: 16,
              transition: 'background 180ms ease',
            }}
          >
            Build my music plan →
          </button>

        </div>
      </div>
    </>
  )
}
