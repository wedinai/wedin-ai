import React from 'react'

export default function EducationCard({ card, loading = false }) {
  if (!card && !loading) return null

  if (loading) {
    return (
      <div style={{ padding: '12px 20px' }}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            fontSize: 13,
            color: '#6B6560',
            margin: 0,
          }}
        >
          Reading your choices…
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes educationFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          borderLeft: '3px solid #C4922A',
          background: 'rgba(196,146,42,0.06)',
          borderRadius: '0 8px 8px 0',
          padding: '16px 20px',
          marginTop: 8,
          animation: 'educationFadeIn 200ms ease both',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            fontSize: 14,
            lineHeight: 1.6,
            color: '#1C2B3A',
            margin: 0,
          }}
        >
          {card}
        </p>
      </div>
    </>
  )
}
