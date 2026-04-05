import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { SCENARIOS } from '../test/scenarios.js'

const ALL_MOMENTS = [
  'arrivals', 'ceremony', 'predrinks', 'entrance',
  'dinner', 'speeches', 'firstdance', 'dancing', 'lastsong',
]

const ALL_CONFIRMED = ALL_MOMENTS.reduce((acc, id) => {
  acc[id] = true
  return acc
}, {})

export default function TestRoute() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const scenarioKey = searchParams.get('scenario')
  const scenario = SCENARIOS[scenarioKey]

  useEffect(() => {
    if (!scenario) return

    // Clear all existing wedin_* keys
    Object.keys(localStorage)
      .filter((k) => k.startsWith('wedin_'))
      .forEach((k) => localStorage.removeItem(k))

    // Write the 8 required keys
    localStorage.setItem('wedin_session_id', scenario.sessionId)
    localStorage.setItem('wedin_couple_name', scenario.coupleName)
    localStorage.setItem('wedin_is_paid', 'true')
    localStorage.setItem('wedin_session_answers', JSON.stringify(scenario.sessionAnswers))
    localStorage.setItem('wedin_moment_answers', JSON.stringify(scenario.momentAnswers))
    localStorage.setItem('wedin_completed_moments', JSON.stringify(ALL_MOMENTS))
    localStorage.setItem('wedin_moment_confirmed', JSON.stringify(ALL_CONFIRMED))
    localStorage.setItem('wedin_portrait', scenario.portrait)

    navigate('/moment-map', { replace: true })
  }, [scenario, navigate])

  if (!scenario) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          gap: 12,
        }}
      >
        <p style={{ fontSize: 15, color: '#1C2B3A', margin: 0 }}>
          Unknown scenario: <strong>{scenarioKey || '(none)'}</strong>
        </p>
        <p style={{ fontSize: 13, color: '#6B6560', margin: 0 }}>
          Valid options: {Object.keys(SCENARIOS).join(', ')}
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF7F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <p style={{ fontSize: 14, color: '#6B6560', margin: 0 }}>
        Loading scenario…
      </p>
    </div>
  )
}
