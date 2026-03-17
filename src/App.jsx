import React, { useState, useEffect } from 'react'
import DiscoverySession from './components/DiscoverySession.jsx'
import MusicPortrait from './components/MusicPortrait.jsx'
import MomentMap from './components/MomentMap.jsx'

export default function App() {
  const [view, setView] = useState('discovery') // 'discovery' | 'portrait' | 'momentMap'
  const [sessionAnswers, setSessionAnswers] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [coupleName, setCoupleName] = useState('Your Wedding')

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

  function handleComplete(answers) {
    setSessionAnswers(answers)
    setView('portrait')
  }

  function handleStartOver() {
    setSessionAnswers({})
    setSessionId(null)
    setView('discovery')
  }

  function handleViewMomentMap() {
    setView('momentMap')
  }

  if (view === 'momentMap') {
    return (
      <MomentMap
        coupleName={coupleName}
        isPaid={false}
        onUnlock={() => console.log('Stripe TODO')}
        onBack={() => setView('portrait')}
      />
    )
  }

  if (view === 'portrait') {
    return (
      <MusicPortrait
        answers={sessionAnswers}
        sessionId={sessionId}
        onStartOver={handleStartOver}
        onViewMomentMap={handleViewMomentMap}
      />
    )
  }

  return <DiscoverySession onComplete={handleComplete} onSetCoupleName={setCoupleName} />
}
