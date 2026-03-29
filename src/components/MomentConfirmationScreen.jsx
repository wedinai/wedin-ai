import React, { useState, useEffect } from 'react'

// ── Per-moment confirmation copy ─────────────────────────────────────────────

const COPY = {
  arrivals: {
    prompt1: "Does this feel like the right opening to your day? Tell us what resonated — and anything that didn't.",
    prompt2: "Were the instruments and style suggested right for you? If you had something different in mind — a sound, a feeling, a specific reference — tell us here.",
  },
  ceremony: {
    prompt1: "Does what we've described feel like your ceremony? What felt right, and what felt off?",
    prompt2: "Are the song choices and instrumentation right? If anything needs to change — a different song, a different feel for the signing — say it here.",
  },
  predrinks: {
    prompt1: "Does this feel like the right energy for your guests while they settle in? What worked and what didn't?",
    prompt2: "Were the act type and style right? Too formal, too casual, wrong instruments, wrong energy — anything you'd change, tell us now.",
  },
  entrance: {
    prompt1: "Does this feel like the entrance you've been imagining? What felt right and what didn't?",
    prompt2: "Were you thinking of something different — a specific song, a live instrument, a different energy? Tell us exactly what you had in mind.",
  },
  dinner: {
    prompt1: "Does this feel like the right soundtrack for your dinner? What landed and what didn't?",
    prompt2: "Was the act type right — the instrumentation, the style, the energy level? If you were picturing something different, describe it here.",
  },
  speeches: {
    prompt1: "Does what we've described feel like it honours your speakers? What worked and what didn't?",
    prompt2: "Are the intro songs right for each speaker? If you have specific songs in mind — or if we missed someone — tell us here.",
  },
  firstdance: {
    prompt1: "Does this feel right for you both? What resonated and what didn't?",
    prompt2: "Is the song right? Live or recorded — did we get that right too? If anything needs to change, say it here.",
  },
  dancing: {
    prompt1: "Does the arc we've described feel like the night you want to give your guests? What felt right and what didn't?",
    prompt2: "Were the genres, the energy arc, and the DJ brief right? Specific songs you want included, moments you want created, things you want to avoid — tell us here.",
  },
  lastsong: {
    prompt1: "Does this feel like the right close to your day? What worked and what didn't?",
    prompt2: "Is the song right? And is the way we've described playing it — the feeling, the instruction to the DJ — right for you? Tell us anything you'd change.",
  },
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MomentConfirmationScreen({ momentId, momentName, onConfirm, onRedo, onUpdate }) {
  const [reflection, setReflection] = useState('')
  const [practical, setPractical] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const copy = COPY[momentId] || COPY.arrivals
  const hasText = reflection.trim().length > 0 || practical.trim().length > 0

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        .confirm-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid rgba(28,43,58,0.12);
          border-radius: 10px;
          background: #FFFFFF;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1C2B3A;
          line-height: 1.6;
          resize: none;
          outline: none;
          transition: border-color 180ms ease;
          min-height: 88px;
        }
        .confirm-textarea:focus {
          border-color: #C4922A;
          box-shadow: 0 0 0 3px rgba(196,146,42,0.12);
        }
        .confirm-textarea::placeholder {
          color: #6B6560;
          opacity: 0.7;
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
        {/* Progress strip — full gold to signal completion */}
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
              margin: '0 0 8px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              fontWeight: 400,
              color: '#1C2B3A',
              lineHeight: 1.15,
            }}
          >
            Does this feel right?
          </h1>
          <p
            style={{
              margin: '0 0 40px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#6B6560',
              lineHeight: 1.6,
            }}
          >
            Before you move on — does this feel right?
          </p>

          {/* Text area 1 */}
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                margin: '0 0 12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: '#1C2B3A',
                lineHeight: 1.5,
              }}
            >
              {copy.prompt1}
            </p>
            <textarea
              className="confirm-textarea"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
            />
          </div>

          {/* Text area 2 */}
          <div style={{ marginBottom: 48 }}>
            <p
              style={{
                margin: '0 0 12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: '#1C2B3A',
                lineHeight: 1.5,
              }}
            >
              {copy.prompt2}
            </p>
            <textarea
              className="confirm-textarea"
              value={practical}
              onChange={(e) => setPractical(e.target.value)}
              placeholder="Any specific changes..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Conditional — update (only when feedback fields have text) */}
            {hasText && onUpdate && (
              <button
                onClick={() => onUpdate({ reflection: reflection.trim(), practical: practical.trim() })}
                style={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '15px 24px',
                  background: '#FFFFFF',
                  color: '#C4922A',
                  border: '1.5px solid #C4922A',
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  textAlign: 'center',
                  minHeight: 52,
                }}
              >
                Update this moment →
              </button>
            )}

            {/* Primary — confirm */}
            <button
              onClick={() => onConfirm({ reflection: reflection.trim(), practical: practical.trim() })}
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
              Looks good — back to map
            </button>

            {/* Secondary — redo */}
            <button
              onClick={onRedo}
              style={{
                all: 'unset',
                boxSizing: 'border-box',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '15px 24px',
                background: '#FFFFFF',
                color: '#1C2B3A',
                border: '1.5px solid rgba(28,43,58,0.15)',
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                textAlign: 'center',
                minHeight: 52,
              }}
            >
              Redo this moment
            </button>
          </div>
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
