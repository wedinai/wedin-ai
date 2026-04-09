import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('wedin_cookie_consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem('wedin_cookie_consent', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '16px',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(28, 43, 58, 0.12)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            color: '#1C2B3A',
            margin: 0,
            flex: 1,
            minWidth: '200px',
            lineHeight: 1.5,
          }}
        >
          wedin.ai uses cookies to save your session progress. No tracking cookies. No third parties.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0,
          }}
        >
          <Link
            to="/privacy"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: '#C4922A',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Learn more
          </Link>

          <button
            onClick={handleAccept}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: '#FAF7F2',
              backgroundColor: '#1C2B3A',
              border: 'none',
              borderRadius: '10px',
              height: '44px',
              padding: '0 24px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Got it
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .cookie-banner-inner {
            flex-direction: column !important;
          }
          .cookie-banner-inner button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
