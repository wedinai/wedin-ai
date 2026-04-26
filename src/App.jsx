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
import MELSummaryScreen from './components/MELSummaryScreen.jsx'

export default function App() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success' && params.get('stripe_session_id')) {
      return 'paymentConfirming'
    }
    return 'discovery'
  }) // 'discovery' | 'portrait' | 'momentMap' | 'arrivals' | 'predrinks' | 'ceremony' | 'entrance' | 'firstdance' | 'dinner' | 'speeches' | 'dancing' | 'lastsong' | 'postBrief' | 'melSummary' | 'brief' | 'mil' | 'paymentConfirming'
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
  const [ceremonySummary, setCeremonySummary] = useState(null)
  const [email, setEmail] = useState(null)
  const [educationCards, setEducationCards] = useState({})
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState(
    () => localStorage.getItem('wedin_spotify_playlist') || null
  )
  const [spotifyLoading, setSpotifyLoading] = useState(false)

  // ── Supabase state persistence ────────────────────────────────────────────
  // Called after each deep-dive confirmation and after MIL completion.
  // Reads current closure values + applies overrides for newly-computed values
  // that haven't been committed to React state yet.
  function persistState(overrides = {}) {
    const em = localStorage.getItem('wedin_email')
    if (!sessionId || !em) return
    const state = {
      couple_name: coupleName,
      portrait,
      ceremony_summary: ceremonySummary,
      moment_answers: momentAnswers,
      completed_moments: completedMoments,
      moment_confirmed: momentConfirmed,
      mil_recommendations: milRecommendations,
      ...overrides,
    }
    fetch('/.netlify/functions/save-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, email: em, state }),
    }).catch(e => console.error('persistState failed:', e))
  }

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

  useEffect(() => {
    if (Object.keys(educationCards).length > 0) {
      localStorage.setItem('wedin_education_cards', JSON.stringify(educationCards))
    }
  }, [educationCards])

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

  // Restore session for returning couples — Supabase first (keyed by email), localStorage fallback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') return

    // Email link restore — ?email= param lands from portrait delivery email
    const urlEmail = params.get('email')
    if (urlEmail) {
      localStorage.setItem('wedin_email', urlEmail)
      window.history.replaceState({}, '', window.location.pathname)
    }

    const savedEmail = urlEmail || localStorage.getItem('wedin_email')
    const savedSessionId = localStorage.getItem('wedin_session_id')
    const savedAnswers = localStorage.getItem('wedin_session_answers')
    const urlSessionId = params.get('session')

    function restoreFromLocalStorage() {
      const sessionToRestore = urlSessionId || savedSessionId
      if (!sessionToRestore || !savedAnswers) return
      if (savedEmail) setEmail(savedEmail)
      setSessionId(sessionToRestore)
      setSessionAnswers(JSON.parse(savedAnswers))
      const savedPortrait = localStorage.getItem('wedin_portrait')
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
      if (storedMilRecs) { try { setMilRecommendations(JSON.parse(storedMilRecs)) } catch (e) {} }
      const savedConfirmed = localStorage.getItem('wedin_moment_confirmed')
      if (savedConfirmed) { try { setMomentConfirmed(JSON.parse(savedConfirmed)) } catch (e) {} }
      const savedFeedback = localStorage.getItem('wedin_moment_feedback')
      if (savedFeedback) { try { setMomentFeedback(JSON.parse(savedFeedback)) } catch (e) {} }
      const savedCeremonySummary = localStorage.getItem('wedin_ceremony_summary')
      if (savedCeremonySummary) setCeremonySummary(savedCeremonySummary)
      const savedEducationCards = localStorage.getItem('wedin_education_cards')
      if (savedEducationCards) { try { setEducationCards(JSON.parse(savedEducationCards)) } catch (e) {} }
      setView('momentMap')
    }

    if (savedEmail) {
      // Primary: restore from Supabase keyed by email
      fetch('/.netlify/functions/restore-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail }),
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.found) {
            setEmail(savedEmail)
            setSessionId(data.session_id)
            setSessionAnswers(data.answers || {})
            const s = data.state || {}
            if (s.couple_name) setCoupleName(s.couple_name)
            if (s.portrait) setPortrait(s.portrait)
            if (s.ceremony_summary) setCeremonySummary(s.ceremony_summary)
            if (s.moment_answers) setMomentAnswers(s.moment_answers)
            if (s.completed_moments) setCompletedMoments(s.completed_moments)
            if (s.moment_confirmed) setMomentConfirmed(s.moment_confirmed)
            if (s.mil_recommendations) setMilRecommendations(s.mil_recommendations)
            const storedIsPaid = localStorage.getItem('wedin_is_paid')
            if (storedIsPaid === 'true') setIsPaid(true)
            // Navigate based on restored state
            const confirmedCount = Object.values(s.moment_confirmed || {}).filter(Boolean).length
            if (s.mil_recommendations) {
              setView('brief')
            } else if (confirmedCount >= 9) {
              setView('postBrief')
            } else {
              setView('momentMap')
            }
            const savedEducationCards = localStorage.getItem('wedin_education_cards')
            if (savedEducationCards) { try { setEducationCards(JSON.parse(savedEducationCards)) } catch (e) {} }
          } else {
            restoreFromLocalStorage()
          }
        })
        .catch(() => restoreFromLocalStorage())
    } else if ((urlSessionId || savedSessionId) && savedAnswers) {
      restoreFromLocalStorage()
    }
  }, [])

  function handleEmailSaved(savedEmail, narrativeText) {
    setEmail(savedEmail)
    setPortrait(narrativeText)
    // Save email + initial portrait to Supabase
    if (sessionId) {
      fetch('/.netlify/functions/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          email: savedEmail,
          state: {
            couple_name: coupleName,
            portrait: narrativeText,
            ceremony_summary: null,
            moment_answers: {},
            completed_moments: [],
            moment_confirmed: {},
            mil_recommendations: null,
          },
        }),
      }).catch(e => console.error('Initial state persist failed:', e))
    }
  }

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
    localStorage.removeItem('wedin_ceremony_summary')
    localStorage.removeItem('wedin_email')
    localStorage.removeItem('wedin_education_cards')
    setSessionAnswers({})
    setSessionId(null)
    setPortrait(null)
    setIsPaid(false)
    setCompletedMoments([])
    setMomentAnswers({})
    setMilRecommendations(null)
    setMomentConfirmed({})
    setMomentFeedback({})
    setCeremonySummary(null)
    setEmail(null)
    setEducationCards({})
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
    const newMomentAnswers = { ...momentAnswers, ceremony: answers }
    const newCompleted = completedMoments.includes('ceremony') ? completedMoments : [...completedMoments, 'ceremony']
    setMomentAnswers((prev) => ({ ...prev, ceremony: answers }))
    setCompletedMoments((prev) => prev.includes('ceremony') ? prev : [...prev, 'ceremony'])
    setInProgressMoments((prev) => prev.filter((id) => id !== 'ceremony'))
    if (summary) {
      setCeremonySummary(summary)
      localStorage.setItem('wedin_ceremony_summary', summary)
    }
    persistState({
      moment_answers: newMomentAnswers,
      completed_moments: newCompleted,
      ceremony_summary: summary || ceremonySummary,
    })
    setMomentSummary(summary || null)
    setMomentSummaryLoading(false)
    setPendingConfirmation({ momentId: 'ceremony', momentName: 'Ceremony', answersKey: 'ceremony' })
    setView('momentSummary')
  }

  function handleGenerateBrief() {
    setView('postBrief')
  }

  function handleConfirmMoment(feedback) {
    const { momentId } = pendingConfirmation
    const newConfirmed = { ...momentConfirmed, [momentId]: true }
    setMomentConfirmed((prev) => ({ ...prev, [momentId]: true }))
    setMomentFeedback((prev) => ({ ...prev, [momentId]: feedback }))
    setPendingConfirmation(null)
    persistState({ moment_confirmed: newConfirmed })
    generateEducationCard(momentId)
    setView('momentMap')
  }

  function handleSummaryConfirm() {
    const { momentId } = pendingConfirmation
    const newConfirmed = { ...momentConfirmed, [momentId]: true }
    setMomentConfirmed(prev => ({ ...prev, [momentId]: true }))
    setPendingConfirmation(null)
    persistState({ moment_confirmed: newConfirmed })
    generateEducationCard(momentId)
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

  const MOMENTS_META = {
    arrivals:   'Guest Arrivals',
    ceremony:   'Ceremony',
    predrinks:  'Pre-drinks',
    entrance:   'Your Entrance',
    firstdance: 'First Dance',
    dinner:     'Dinner',
    speeches:   'Speeches',
    dancing:    'Dancing',
    lastsong:   'Last Song',
  }

  const EDUCATION_ANSWERS_KEY = {
    arrivals:   'guestArrivals',
    ceremony:   'ceremony',
    predrinks:  'predrinks',
    entrance:   'entrance',
    firstdance: 'firstDance',
    dinner:     'dinner',
    speeches:   'speeches',
    dancing:    'dancing',
    lastsong:   'lastSong',
  }

  function generateEducationCard(momentId) {
    const answersKey = EDUCATION_ANSWERS_KEY[momentId]
    if (!answersKey) return

    ;(async () => {
      try {
        const res = await fetch('/.netlify/functions/generate-education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portrait,
            sessionAnswers,
            momentAnswers,
            momentId,
            momentName: MOMENTS_META[momentId] || momentId,
            coupleName,
          }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (!data.card) return
        setEducationCards(prev => {
          const next = { ...prev, [momentId]: data.card }
          localStorage.setItem('wedin_education_cards', JSON.stringify(next))
          return next
        })
      } catch {
        // silent failure — education card is non-blocking
      }
    })()
  }

  function handleMILComplete(answers, recommendations) {
    setMilRecommendations(recommendations)
    localStorage.setItem('wedin_mil_recommendations', JSON.stringify(recommendations))
    persistState({ mil_recommendations: recommendations, milComplete: true })
    setView('brief')

    // Non-blocking Spotify playlist generation — delayed 12s to avoid competing
    // with generate-brief-a/b for Anthropic API capacity during brief assembly.
    ;(async () => {
      await new Promise(resolve => setTimeout(resolve, 12000))
      setSpotifyLoading(true)
      try {
        const r1 = await fetch('/.netlify/functions/generate-spotify-tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            momentAnswers,
            milRecommendations: recommendations,
            sessionAnswers,
            coupleName,
          }),
        })
        if (!r1.ok) return
        const { tracks } = await r1.json()
        if (!tracks?.length) return
        const r2 = await fetch('/.netlify/functions/create-spotify-playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tracks, coupleName }),
        })
        if (!r2.ok) return
        const { playlistUrl } = await r2.json()
        if (playlistUrl) {
          setSpotifyPlaylistUrl(playlistUrl)
          localStorage.setItem('wedin_spotify_playlist', playlistUrl)
          persistState({ mil_recommendations: recommendations, spotify_playlist_url: playlistUrl })
        }
      } catch (e) {
        console.error('Spotify playlist generation failed:', e)
      } finally {
        setSpotifyLoading(false)
      }
    })()
  }

  async function handleMomentComplete(momentId, momentName, answersKey, answers) {
    const newMomentAnswers = { ...momentAnswers, [answersKey]: answers }
    const newCompleted = completedMoments.includes(momentId) ? completedMoments : [...completedMoments, momentId]
    setMomentAnswers((prev) => ({ ...prev, [answersKey]: answers }))
    setCompletedMoments((prev) => prev.includes(momentId) ? prev : [...prev, momentId])
    setInProgressMoments((prev) => prev.filter((id) => id !== momentId))
    setPendingConfirmation({ momentId, momentName, answersKey })
    persistState({ moment_answers: newMomentAnswers, completed_moments: newCompleted })

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
    const confirmedList = Object.keys(momentConfirmed).filter((k) => momentConfirmed[k])
    const allConfirmed = confirmedList.length >= 9
    return (
      <PostBriefScreen
        onStartMIL={() => { if (allConfirmed) setView('melSummary') }}
        allConfirmed={allConfirmed}
        confirmedCount={confirmedList.length}
      />
    )
  }

  if (view === 'melSummary') {
    return (
      <MELSummaryScreen
        sessionAnswers={sessionAnswers}
        momentAnswers={momentAnswers}
        portrait={portrait}
        coupleName={coupleName}
        email={email}
        onConfirm={() => setView('mil')}
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
        spotifyPlaylistUrl={spotifyPlaylistUrl}
        spotifyLoading={spotifyLoading}
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
        ceremonySummary={ceremonySummary}
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
        onConfirm={handleSummaryConfirm}
      />
    )
  }

  if (view === 'confirm' && pendingConfirmation) {
    return (
      <MomentConfirmationScreen
        key={confirmKey}
        momentId={pendingConfirmation.momentId}
        momentName={pendingConfirmation.momentName}
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
        educationCards={educationCards}
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
        onEmailSaved={handleEmailSaved}
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
