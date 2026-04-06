import React from 'react'

export default function EducationCard({ card, isExpanded, onToggle }) {
  if (!card) return null

  return (
    <>
      <style>{`
        @keyframes educationFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Toggle trigger */}
      <button
        onClick={onToggle}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          paddingTop: 10,
          paddingBottom: 4,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: '#C4922A',
          minHeight: 44,
          boxSizing: 'border-box',
        }}
      >
        Why this works {isExpanded ? '↑' : '↓'}
      </button>

      {/* Card content — shown only when expanded */}
      {isExpanded && (
        <div
          style={{
            borderLeft: '3px solid #C4922A',
            background: 'rgba(196,146,42,0.06)',
            borderRadius: '0 8px 8px 0',
            padding: '16px 20px',
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
      )}
    </>
  )
}
