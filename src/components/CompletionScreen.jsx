import React from 'react'

export default function CompletionScreen({ answers, onViewPlan }) {
  // Build a simple summary of what was captured
  const threeWords = answers['three_words']
  const relationshipSong = answers['relationship_song']

  return (
    <div className="animate-fade-in-up flex flex-col items-center text-center px-6 py-16 max-w-sm mx-auto">
      {/* Completion circle — single quiet moment, no confetti */}
      <div className="completion-circle mb-8">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 14.5L11.5 20L22 9"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2
        className="font-display mb-3"
        style={{ fontSize: '1.375rem', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.3 }}
      >
        Your music portrait is ready.
      </h2>

      {/* Subtext */}
      <p
        className="font-sans mb-8"
        style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--grey)' }}
      >
        {threeWords
          ? `${threeWords} — we have everything we need to build your music plan.`
          : 'We have everything we need to build your music plan.'}
      </p>

      {/* Summary card */}
      <div
        className="card w-full text-left mb-8"
        style={{ padding: '24px 28px' }}
      >
        <p
          className="font-sans font-medium uppercase text-label mb-4"
          style={{ color: 'var(--grey)', letterSpacing: '0.12em' }}
        >
          What we captured
        </p>

        <ul className="flex flex-col gap-3">
          {threeWords && (
            <li className="flex gap-3">
              <span style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }}>—</span>
              <span className="font-sans text-caption" style={{ color: 'var(--navy)', lineHeight: 1.6 }}>
                Your wedding feeling: <strong>{threeWords}</strong>
              </span>
            </li>
          )}
          {relationshipSong && (
            <li className="flex gap-3">
              <span style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }}>—</span>
              <span className="font-sans text-caption" style={{ color: 'var(--navy)', lineHeight: 1.6 }}>
                Your relationship song: <strong>{relationshipSong}</strong>
              </span>
            </li>
          )}
          {answers['most_anticipated_moment'] && (
            <li className="flex gap-3">
              <span style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }}>—</span>
              <span className="font-sans text-caption" style={{ color: 'var(--navy)', lineHeight: 1.6 }}>
                Most anticipated: <strong>{answers['most_anticipated_moment']}</strong>
              </span>
            </li>
          )}
          <li className="flex gap-3">
            <span style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }}>—</span>
            <span className="font-sans text-caption" style={{ color: 'var(--navy)', lineHeight: 1.6 }}>
              {Object.keys(answers).filter(Boolean).length} questions answered across{' '}
              {[...new Set(Object.keys(answers))].length} areas of your wedding
            </span>
          </li>
        </ul>
      </div>

      {/* Next step CTA */}
      <button className="btn-primary w-full mb-4" onClick={onViewPlan}>
        View your music plan
      </button>

      <button
        className="btn-secondary w-full"
        onClick={() => window.location.reload()}
      >
        Start over
      </button>
    </div>
  )
}
