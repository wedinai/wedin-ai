import React, { useEffect, useState } from 'react'

export default function MomentSummaryScreen({ momentName, summary, loading, error, onNext }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        * { box-sizing: border-box; }
        .summary-placeholder {
          border-radius: 8px;
          background: rgba(28,43,58,0.06);
          animation: pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Progress strip */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #1C2B3A, #C4922A)', flexShrink: 0 }} />

        {/* Content */}
        <div
          style={{
            flex: 1,
            maxWidth: 560,
            width: '100%',
            margin: '0 auto',
            padding: '40px 24px 64px',
            animation: 'fadeUp 350ms ease both',
          }}
        >
          {/* Moment name */}
          <p
            style={{
              margin: '0 0 6px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: '#C4922A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {momentName}
          </p>

          <h1
            style={{
              margin: '0 0 32px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              fontWeight: 400,
              color: '#1C2B3A',
              lineHeight: 1.15,
            }}
          >
            Here's what you've planned.
          </h1>

          {/* Loading state */}
          {loading && (
            <div style={{ marginBottom: 48 }}>
              <p
                style={{
                  margin: '0 0 20px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: '#6B6560',
                  lineHeight: 1.6,
                }}
              >
                Reading your answers…
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="summary-placeholder" style={{ height: 20, width: '90%' }} />
                <div className="summary-placeholder" style={{ height: 20, width: '100%' }} />
                <div className="summary-placeholder" style={{ height: 20, width: '75%' }} />
              </div>
            </div>
          )}

          {/* Summary ready */}
          {!loading && summary && (
            <p
              style={{
                margin: '0 0 48px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: '#6B6560',
                lineHeight: 1.7,
                maxWidth: 480,
              }}
            >
              {summary}
            </p>
          )}

          {/* Error state */}
          {!loading && error && (
            <p
              style={{
                margin: '0 0 48px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: '#6B6560',
                lineHeight: 1.6,
              }}
            >
              We couldn't load your summary right now. You can still confirm this moment and continue.
            </p>
          )}

          {/* Button — only show when not loading */}
          {!loading && (
            <button
              onClick={onNext}
              style={{
                all: 'unset',
                boxSizing: 'border-box',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '15px 24px',
                background: '#1C2B3A',
                color: '#FAF7F2',
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                textAlign: 'center',
                minHeight: 52,
              }}
            >
              {error ? 'Continue anyway →' : 'Next →'}
            </button>
          )}
        </div>

        {/* Wordmark */}
        <div style={{ padding: '16px', textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, opacity: 0.35, color: '#1C2B3A', letterSpacing: '0.05em' }}>
            wedin.ai
          </span>
        </div>
      </div>
    </>
  )
}
