import React from 'react'

export default function ProgressBar({ current, total, section }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full px-0">
      {/* Thin gradient fill bar — top of screen */}
      <div className="progress-track w-full">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Section label — below bar */}
      {section && (
        <div className="flex justify-between items-center mt-2 px-5">
          <span
            className="text-label font-sans font-medium uppercase tracking-label"
            style={{ color: 'var(--grey)' }}
          >
            {section}
          </span>
          <span
            className="text-caption font-sans"
            style={{ color: 'var(--grey)', opacity: 0.7 }}
          >
            {current} of {total}
          </span>
        </div>
      )}
    </div>
  )
}
