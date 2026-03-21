import React, { useState, useEffect } from 'react'
import DiscoverySession from './components/DiscoverySession.jsx'
import MusicPortrait from './components/MusicPortrait.jsx'
import MomentMap from './components/MomentMap.jsx'
import CeremonyDeepDive from './components/CeremonyDeepDive.jsx'
import GuestArrivalsDeepDive from './components/GuestArrivalsDeepDive.jsx'

export default function App() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success' && params.get('stripe_session_id')) {
      return 'paymentConfirming'
    }
    return 'discovery'
  }) // 'discovery' | 'portrait' | 'momentMap' | 'arrivals' | 'ceremony' | 'paymentConfirming'
  const [sessionAnswers, setSessionAnswers] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [coupleName, setCoupleName] = useState('Your Wedding')
  const [isPaid, setIsPaid] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [completedMoments, setCompletedMoments] = useState([])
  const [inProgressMoments, setInProgressMoments] = useState([])
  const [momentAnswers, setMomentAnswers] = useState({}) // { guestArrivals: {…}, ceremony: {…}, … }

  // Save session to Supabase whenever a completed set of answers arrives
  useEffect(() => {
    if (Object.keys(sessionAnswers).length === 0) return

    fetch('/.netlify/functions/save-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionAnswers),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session_id) setSessionId(data.session_id)
      })
      .catch((e) => console.error('Session save failed:', e))
  }, [sessionAnswers])

  // On mount, check if returning from Stripe Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get('payment')
    const stripeSessionId = params.get('stripe_session_id')

    if (paymentStatus === 'success' && stripeSessionId) {
      // Clear URL params immediately so refresh doesn't re-trigger
      window.history.replaceState({}, '', window.location.pathname)

      fetch('/.netlify/functions/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripe_session_id: stripeSessionId }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.isPaid) {
            setIsPaid(true)
            setView('momentMap')
          }
        })
        .catch((e) => console.error('Payment verification failed:', e))
    }
  }, [])

  function handleComplete(answers) {
    setSessionAnswers(answers)
    setView('portrait')
  }

  function handleStartOver() {
    setSessionAnswers({})
    setSessionId(null)
    setIsPaid(false)
    setView('discovery')
  }

  function handleViewMomentMap() {
    setView('momentMap')
  }

  function handleMomentStart(momentId) {
    if (momentId === 'arrivals') {
      setInProgressMoments((prev) => prev.includes('arrivals') ? prev : [...prev, 'arrivals'])
      setView('arrivals')
    } else if (momentId === 'ceremony') {
      setInProgressMoments((prev) => prev.includes('ceremony') ? prev : [...prev, 'ceremony'])
      setView('ceremony')
    }
  }

  function handleArrivalsComplete(answers) {
    setMomentAnswers((prev) => ({ ...prev, guestArrivals: answers }))
    setCompletedMoments((prev) => prev.includes('arrivals') ? prev : [...prev, 'arrivals'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'arrivals'))
    setView('momentMap')
  }

  function handleCeremonyComplete(answers, summary) {
    setCompletedMoments((prev) => prev.includes('ceremony') ? prev : [...prev, 'ceremony'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'ceremony'))
    setView('momentMap')
  }

  async function handleUnlock() {
    if (unlocking) return
    setUnlocking(true)

    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, couple_name: coupleName }),
      })

      if (!res.ok) throw new Error('Failed to create checkout session')

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (e) {
      console.error('Unlock failed:', e)
      setUnlocking(false)
    }
  }

  if (view === 'arrivals') {
    return (
      <GuestArrivalsDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleArrivalsComplete}
        onBack={() => setView('momentMap')}
      />
    )
  }

  if (view === 'ceremony') {
    return (
      <CeremonyDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        sessionAnswers={sessionAnswers}
        onComplete={handleCeremonyComplete}
        onBack={() => setView('momentMap')}
      />
    )
  }

  if (view === 'momentMap') {
    return (
      <MomentMap
        coupleName={coupleName}
        isPaid={isPaid}
        completedMoments={completedMoments}
        inProgressMoments={inProgressMoments}
        onUnlock={handleUnlock}
        onMomentStart={handleMomentStart}
        onBack={() => setView('portrait')}
      />
    )
  }

  if (view === 'portrait') {
    return (
      <MusicPortrait
        answers={sessionAnswers}
        sessionId={sessionId}
        coupleName={coupleName}
        onStartOver={handleStartOver}
        onViewMomentMap={handleViewMomentMap}
      />
    )
  }

  if (view === 'paymentConfirming') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
      }}>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--navy)',
        }}>
          wedin.ai
        </span>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontSize: '24px',
          color: 'var(--navy)',
          margin: 0,
        }}>
          Setting up your music map…
        </p>
      </div>
    )
  }

  return <DiscoverySession onComplete={handleComplete} onSetCoupleName={setCoupleName} />
}
