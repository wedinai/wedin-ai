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
import SpeechesDeepDive from './components/SpeechesDeepDive.jsx'
import DancingDeepDive from './components/DancingDeepDive.jsx'
import LastSongDeepDive from './components/LastSongDeepDive.jsx'
import BriefScreen from './components/BriefScreen.jsx'
import PostBriefScreen from './components/PostBriefScreen.jsx'
import MILIntakeScreen from './components/MILIntakeScreen.jsx'
import MomentConfirmationScreen from './components/MomentConfirmationScreen.jsx'
import MomentSummaryScreen from './components/MomentSummaryScreen.jsx'

export default function App() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success' && params.get('stripe_session_id')) {
      return 'paymentConfirming'
    }
    return 'discovery'
  }) // 'discovery' | 'portrait' | 'momentMap' | 'arrivals' | 'predrinks' | 'ceremony' | 'entrance' | 'firstdance' | 'dinner' | 'speeches' | 'dancing' | 'lastsong' | 'postBrief' | 'brief' | 'mil' | 'paymentConfirming'
  const [sessionAnswers, setSessionAnswers] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [coupleName, setCoupleName] = useState('Your Wedding')
  const [isPaid, setIsPaid] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [completedMoments, setCompletedMoments] = useState([])
  const [inProgressMoments, setInProgressMoments] = useState([])
  const [momentAnswers, setMomentAnswers] = useState({}) // { guestArrivals: {…}, ceremony: {…}, … }
  const [portrait, setPortrait] = useState(null)
  const [milRecommendations, setMilRecommendations] = useState(null)
  const [momentConfirmed, setMomentConfirmed] = useState({})
  const [momentFeedback, setMomentFeedback] = useState({})
  const [pendingConfirmation, setPendingConfirmation] = useState(null) // { momentId, momentName }
  const [momentSummary, setMomentSummary] = useState(null)
  const [momentSummaryLoading, setMomentSummaryLoading] = useState(false)
  const [confirmKey, setConfirmKey] = useState(0)

  // Persist completedMoments and momentAnswers to localStorage whenever they change
  useEffect(() => {
    if (completedMoments.length > 0) {
      localStorage.setItem('wedin_completed_moments', JSON.stringify(completedMoments))
    }
  }, [completedMoments])

  useEffect(() => {
    if (Object.keys(momentAnswers).length > 0) {
      localStorage.setItem('wedin_moment_answers', JSON.stringify(momentAnswers))
    }
  }, [momentAnswers])

  useEffect(() => {
    if (Object.keys(momentConfirmed).length > 0) {
      localStorage.setItem('wedin_moment_confirmed', JSON.stringify(momentConfirmed))
    }
  }, [momentConfirmed])

  useEffect(() => {
    if (Object.keys(momentFeedback).length > 0) {
      localStorage.setItem('wedin_moment_feedback', JSON.stringify(momentFeedback))
    }
  }, [momentFeedback])

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
            localStorage.setItem('wedin_is_paid', 'true')
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

    if (sessionToRestore && savedAnswers) {
      setSessionId(sessionToRestore)
      setSessionAnswers(JSON.parse(savedAnswers))
      if (savedPortrait) setPortrait(savedPortrait)

      const savedCompleted = localStorage.getItem('wedin_completed_moments')
      if (savedCompleted) setCompletedMoments(JSON.parse(savedCompleted))

      const savedMomentAnswers = localStorage.getItem('wedin_moment_answers')
      if (savedMomentAnswers) setMomentAnswers(JSON.parse(savedMomentAnswers))

      const storedIsPaid = localStorage.getItem('wedin_is_paid')
      if (storedIsPaid === 'true') setIsPaid(true)

      const storedCoupleName = localStorage.getItem('wedin_couple_name')
      if (storedCoupleName) setCoupleName(storedCoupleName)

      const storedMilRecs = localStorage.getItem('wedin_mil_recommendations')
      if (storedMilRecs) {
        try { setMilRecommendations(JSON.parse(storedMilRecs)) } catch (e) {}
      }

      const savedConfirmed = localStorage.getItem('wedin_moment_confirmed')
      if (savedConfirmed) { try { setMomentConfirmed(JSON.parse(savedConfirmed)) } catch (e) {} }

      const savedFeedback = localStorage.getItem('wedin_moment_feedback')
      if (savedFeedback) { try { setMomentFeedback(JSON.parse(savedFeedback)) } catch (e) {} }

      setView('momentMap') // skip discovery and portrait, go straight to the map
    }
  }, [])

  function handleSetCoupleName(name) {
    setCoupleName(name)
    localStorage.setItem('wedin_couple_name', name)
  }

  function handleComplete(answers) {
    setSessionAnswers(answers)
    setView('portrait')
  }

  function handleStartOver() {
    localStorage.removeItem('wedin_session_id')
    localStorage.removeItem('wedin_session_answers')
    localStorage.removeItem('wedin_portrait')
    localStorage.removeItem('wedin_completed_moments')
    localStorage.removeItem('wedin_moment_answers')
    localStorage.removeItem('wedin_is_paid')
    localStorage.removeItem('wedin_couple_name')
    localStorage.removeItem('wedin_mil_recommendations')
    localStorage.removeItem('wedin_moment_confirmed')
    localStorage.removeItem('wedin_moment_feedback')
    setSessionAnswers({})
    setSessionId(null)
    setPortrait(null)
    setIsPaid(false)
    setCompletedMoments([])
    setMomentAnswers({})
    setMilRecommendations(null)
    setMomentConfirmed({})
    setMomentFeedback({})
    setPendingConfirmation(null)
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
    } else if (momentId === 'speeches') {
      setInProgressMoments((prev) => prev.includes('speeches') ? prev : [...prev, 'speeches'])
      setView('speeches')
    } else if (momentId === 'dancing') {
      setInProgressMoments((prev) => prev.includes('dancing') ? prev : [...prev, 'dancing'])
      setView('dancing')
    } else if (momentId === 'lastsong') {
      setInProgressMoments((prev) => prev.includes('lastsong') ? prev : [...prev, 'lastsong'])
      setView('lastsong')
    }
  }

  function handlePreDrinksComplete(answers) {
    handleMomentComplete('predrinks', 'Pre-drinks', 'predrinks', answers)
  }

  function handleArrivalsComplete(answers) {
    handleMomentComplete('arrivals', 'Guest Arrivals', 'guestArrivals', answers)
  }

  function handleCeremonyComplete(answers, summary) {
    setMomentAnswers((prev) => ({ ...prev, ceremony: answers }))
    setCompletedMoments((prev) => prev.includes('ceremony') ? prev : [...prev, 'ceremony'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'ceremony'))
    setPendingConfirmation({ momentId: 'ceremony', momentName: 'Ceremony' })
    setView('confirm')
  }

  function handleGenerateBrief() {
    setView('postBrief')
  }

  function handleConfirmMoment(feedback) {
    const { momentId } = pendingConfirmation
    setMomentConfirmed((prev) => ({ ...prev, [momentId]: true }))
    setMomentFeedback((prev) => ({ ...prev, [momentId]: feedback }))
    setPendingConfirmation(null)
    setView('momentMap')
  }

  function handleRedoMoment() {
    const { momentId } = pendingConfirmation
    setPendingConfirmation(null)
    setView(momentId)
  }

  async function handleUpdateMoment(feedback) {
    const { momentId, momentName, answersKey } = pendingConfirmation
    setMomentFeedback((prev) => ({ ...prev, [momentId]: feedback }))
    setConfirmKey((prev) => prev + 1)
    setMomentSummary(null)
    setMomentSummaryLoading(true)
    setView('momentSummary')

    const answers = momentAnswers[answersKey] || {}

    try {
      const res = await fetch('/.netlify/functions/generate-moment-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ momentId, momentName, answers, sessionAnswers, coupleName, refinementFeedback: feedback }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMomentSummary(data.summary || null)
    } catch (e) {
      console.error('Moment summary update failed:', e)
      setMomentSummary(null)
    } finally {
      setMomentSummaryLoading(false)
    }
  }

  function handleMILComplete(answers, recommendations) {
    setMilRecommendations(recommendations)
    localStorage.setItem('wedin_mil_recommendations', JSON.stringify(recommendations))
    setView('brief')
  }

  async function handleMomentComplete(momentId, momentName, answersKey, answers) {
    setMomentAnswers((prev) => ({ ...prev, [answersKey]: answers }))
    setCompletedMoments((prev) => prev.includes(momentId) ? prev : [...prev, momentId])
    setInProgressMoments((prev) => prev.filter((id) => id !== momentId))
    setPendingConfirmation({ momentId, momentName, answersKey })

    setMomentSummary(null)
    setMomentSummaryLoading(true)
    setView('momentSummary')

    try {
      const res = await fetch('/.netlify/functions/generate-moment-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ momentId, momentName, answers, sessionAnswers, coupleName }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMomentSummary(data.summary || null)
    } catch (e) {
      console.error('Moment summary generation failed:', e)
      setMomentSummary(null)
    } finally {
      setMomentSummaryLoading(false)
    }
  }

  function handleEntranceComplete(answers) {
    handleMomentComplete('entrance', 'Your Entrance', 'entrance', answers)
  }

  function handleFirstDanceComplete(answers) {
    handleMomentComplete('firstdance', 'First Dance', 'firstDance', answers)
  }

  function handleDinnerComplete(answers) {
    handleMomentComplete('dinner', 'Dinner', 'dinner', answers)
  }

  function handleSpeechesComplete(answers) {
    handleMomentComplete('speeches', 'Speeches', 'speeches', answers)
  }

  function handleDancingComplete(answers) {
    handleMomentComplete('dancing', 'Dancing', 'dancing', answers)
  }

  function handleLastSongComplete(answers) {
    handleMomentComplete('lastsong', 'Last Song', 'lastSong', answers)
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

  if (view === 'lastsong') {
    return (
      <LastSongDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleLastSongComplete}
        onBack={() => setView('momentMap')}
      />
    )
  }

  if (view === 'dancing') {
    return (
      <DancingDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleDancingComplete}
        onBack={() => setView('momentMap')}
      />
    )
  }

  if (view === 'speeches') {
    return (
      <SpeechesDeepDive
        sessionId={sessionId}
        coupleName={coupleName}
        onComplete={handleSpeechesComplete}
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

  if (view === 'postBrief') {
    return (
      <PostBriefScreen
        onStartMIL={() => setView('mil')}
      />
    )
  }

  if (view === 'brief') {
    return (
      <BriefScreen
        momentAnswers={momentAnswers}
        portrait={portrait}
        coupleName={coupleName}
        sessionAnswers={sessionAnswers}
        onBack={() => setView('momentMap')}
        onStartMIL={() => setView('mil')}
        milRecommendations={milRecommendations}
        initialTab={milRecommendations ? 'musicPlan' : 'couple'}
      />
    )
  }

  if (view === 'mil') {
    return (
      <MILIntakeScreen
        onComplete={handleMILComplete}
        portrait={portrait}
        sessionAnswers={sessionAnswers}
        momentAnswers={momentAnswers}
        coupleName={coupleName}
      />
    )
  }

  if (view === 'momentSummary' && pendingConfirmation) {
    return (
      <MomentSummaryScreen
        momentName={pendingConfirmation.momentName}
        summary={momentSummary}
        loading={momentSummaryLoading}
        error={!momentSummaryLoading && !momentSummary}
        onNext={() => setView('confirm')}
      />
    )
  }

  if (view === 'confirm' && pendingConfirmation) {
    return (
      <MomentConfirmationScreen
        key={confirmKey}
        momentId={pendingConfirmation.momentId}
        momentName={pendingConfirmation.momentName}
        onConfirm={handleConfirmMoment}
        onRedo={handleRedoMoment}
        onUpdate={handleUpdateMoment}
      />
    )
  }

  if (view === 'momentMap') {
    const confirmedMoments = Object.keys(momentConfirmed).filter((k) => momentConfirmed[k])
    return (
      <MomentMap
        coupleName={coupleName}
        isPaid={isPaid}
        isUnlocking={unlocking}
        completedMoments={completedMoments}
        confirmedMoments={confirmedMoments}
        inProgressMoments={inProgressMoments}
        onUnlock={handleUnlock}
        onMomentStart={handleMomentStart}
        onGenerateBrief={handleGenerateBrief}
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

  return <DiscoverySession onComplete={handleComplete} onSetCoupleName={handleSetCoupleName} />
}
