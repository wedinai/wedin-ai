import React, { useState, useEffect } from 'react'
import DiscoverySession from './components/DiscoverySession.jsx'
import MusicPortrait from './components/MusicPortrait.jsx'
import MomentMap from './components/MomentMap.jsx'
import CeremonyDeepDive from './components/CeremonyDeepDive.jsx'

export default function App() {
  const [view, setView] = useState('discovery') // 'discovery' | 'portrait' | 'momentMap' | 'ceremony'
  const [sessionAnswers, setSessionAnswers] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [coupleName, setCoupleName] = useState('Your Wedding')
  const [isPaid, setIsPaid] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [completedMoments, setCompletedMoments] = useState([])
  const [inProgressMoments, setInProgressMoments] = useState([])

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
    // Only Ceremony is built in Phase 2 so far
    if (momentId === 'ceremony') {
      setInProgressMoments((prev) => prev.includes('ceremony') ? prev : [...prev, 'ceremony'])
      setView('ceremony')
    }
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

  return <DiscoverySession onComplete={handleComplete} onSetCoupleName={setCoupleName} />
}
