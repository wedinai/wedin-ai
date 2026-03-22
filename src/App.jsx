import React, { useState, useEffect } from 'react'
import DiscoverySession from './components/DiscoverySession.jsx'
import MusicPortrait from './components/MusicPortrait.jsx'
import MomentMap from './components/MomentMap.jsx'
import CeremonyDeepDive from './components/CeremonyDeepDive.jsx'
import GuestArrivalsDeepDive from './components/GuestArrivalsDeepDive.jsx'
import PreDrinksDeepDive from './components/PreDrinksDeepDive.jsx'
import EntranceDeepDive from './components/EntranceDeepDive.jsx'
import FirstDanceDeepDive from './components/FirstDanceDeepDive.jsx'
import DinnerDeepDive from './components/DinnerDeepDive.jsx'

export default function App() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success' && params.get('stripe_session_id')) {
      return 'paymentConfirming'
    }
    return 'discovery'
  }) // 'discovery' | 'portrait' | 'momentMap' | 'arrivals' | 'predrinks' | 'ceremony' | 'entrance' | 'firstdance' | 'dinner' | 'paymentConfirming'
  const [sessionAnswers, setSessionAnswers] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [coupleName, setCoupleName] = useState('Your Wedding')
  const [isPaid, setIsPaid] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [completedMoments, setCompletedMoments] = useState([])
  const [inProgressMoments, setInProgressMoments] = useState([])
  const [momentAnswers, setMomentAnswers] = useState({}) // { guestArrivals: {…}, ceremony: {…}, … }
  const [portrait, setPortrait] = useState(null)

  // Save session to Supabase whenever a completed set of answers arrives
  useEffect(() => {
    if (Object.keys(sessionAnswers).length === 0) return
    if (sessionId) return // already have a session ID — restored from storage, do not re-save

    fetch('/.netlify/functions/save-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionAnswers),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session_id) {
          setSessionId(data.session_id)
          localStorage.setItem('wedin_session_id', data.session_id)
          localStorage.setItem('wedin_session_answers', JSON.stringify(sessionAnswers))
          // Portrait is generated in MusicPortrait and written to localStorage there
          // once the narrative is ready — see MusicPortrait.jsx
        }
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

  // Restore session for returning couples — from localStorage or ?session= URL param
  // Cross-device restore (fetching answers from Supabase by session ID) is deferred — TODO Phase 2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') return // payment flow takes priority

    const savedSessionId = localStorage.getItem('wedin_session_id')
    const savedAnswers = localStorage.getItem('wedin_session_answers')
    const savedPortrait = localStorage.getItem('wedin_portrait')
    const urlSessionId = params.get('session')

    const sessionToRestore = urlSessionId || savedSessionId

    if (sessionToRestore && savedAnswers && savedPortrait) {
      setSessionId(sessionToRestore)
      setSessionAnswers(JSON.parse(savedAnswers))
      setPortrait(savedPortrait)
      setView('momentMap') // skip discovery and portrait, go straight to the map
    }
  }, [])

  function handleComplete(answers) {
    setSessionAnswers(answers)
    setView('portrait')
  }

  function handleStartOver() {
    localStorage.removeItem('wedin_session_id')
    localStorage.removeItem('wedin_session_answers')
    localStorage.removeItem('wedin_portrait')
    setSessionAnswers({})
    setSessionId(null)
    setPortrait(null)
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
    } else if (momentId === 'predrinks') {
      setInProgressMoments((prev) => prev.includes('predrinks') ? prev : [...prev, 'predrinks'])
      setView('predrinks')
    } else if (momentId === 'ceremony') {
      setInProgressMoments((prev) => prev.includes('ceremony') ? prev : [...prev, 'ceremony'])
      setView('ceremony')
    } else if (momentId === 'entrance') {
      setInProgressMoments((prev) => prev.includes('entrance') ? prev : [...prev, 'entrance'])
      setView('entrance')
    } else if (momentId === 'firstdance') {
      setInProgressMoments((prev) => prev.includes('firstdance') ? prev : [...prev, 'firstdance'])
      setView('firstdance')
    } else if (momentId === 'dinner') {
      setInProgressMoments((prev) => prev.includes('dinner') ? prev : [...prev, 'dinner'])
      setView('dinner')
    }
  }

  function handlePreDrinksComplete(answers) {
    setMomentAnswers((prev) => ({ ...prev, predrinks: answers }))
    setCompletedMoments((prev) => prev.includes('predrinks') ? prev : [...prev, 'predrinks'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'predrinks'))
    setView('momentMap')
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

  function handleEntranceComplete(answers) {
    setMomentAnswers((prev) => ({ ...prev, entrance: answers }))
    setCompletedMoments((prev) => prev.includes('entrance') ? prev : [...prev, 'entrance'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'entrance'))
    setView('momentMap')
  }

  function handleFirstDanceComplete(answers) {
    setMomentAnswers((prev) => ({ ...prev, firstDance: answers }))
    setCompletedMoments((prev) => prev.includes('firstdance') ? prev : [...prev, 'firstdance'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'firstdance'))
    setView('momentMap')
  }

  function handleDinnerComplete(answers) {
    setMomentAnswers((prev) => ({ ...prev, dinner: answers }))
    setCompletedMoments((prev) => prev.includes('dinner') ? prev : [...prev, 'dinner'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'dinner'))
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

  if (view === 'predrinks') {
    return (
      <PreDrinksDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handlePreDrinksComplete}
        onBack={() => setView('momentMap')}
      />
    )
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

  if (view === 'dinner') {
    return (
      <DinnerDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleDinnerComplete}
        onBack={() => setView('momentMap')}
      />
    )
  }

  if (view === 'firstdance') {
    return (
      <FirstDanceDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleFirstDanceComplete}
        onBack={() => setView('momentMap')}
      />
    )
  }

  if (view === 'entrance') {
    return (
      <EntranceDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleEntranceComplete}
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
