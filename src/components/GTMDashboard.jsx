import { useState, useEffect, useCallback, useRef } from 'react'
import WedinDashboard from './wedin-instagram-dashboard'

// ── Google Fonts ────────────────────────────────────────────────────────────
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap'

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED_ACTIONS = [
  { id: 'a1', text: 'Review and send first 2 planner outreach emails', owner: 'Unassigned', type: 'Outreach', urgent: true, done: false },
  { id: 'a2', text: 'Add 10 target planners to the pipeline', owner: 'Unassigned', type: 'Pipeline', urgent: true, done: false },
  { id: 'a3', text: "Write this week's SEO content piece", owner: 'Unassigned', type: 'SEO', urgent: false, done: false },
  { id: 'a4', text: 'Schedule this week\'s 4 Instagram posts in Buffer', owner: 'Unassigned', type: 'Content', urgent: false, done: false },
  { id: 'a5', text: 'Check Instagram DMs and reply to any enquiries', owner: 'Unassigned', type: 'Engagement', urgent: false, done: false },
]

const SEED_PIPELINE = [
  { id: 'p1', name: 'Add your first planner', business: '', date: '', status: 'not-contacted', owner: 'Amanda', notes: 'Start here — add planners from your research list' },
]

const SEED_CALENDAR = [
  { day: 'Mon', type: '', title: '' },
  { day: 'Tue', type: 'SEO', title: 'Wedding music SA guide' },
  { day: 'Wed', type: 'Instagram', title: 'Moment feature' },
  { day: 'Thu', type: '', title: '' },
  { day: 'Fri', type: 'Instagram', title: 'Behind the Build' },
  { day: 'Sat', type: '', title: '' },
  { day: 'Sun', type: '', title: '' },
]

function uid() { return Math.random().toString(36).slice(2, 10) }

function mergeWithSeeds(raw) {
  const d = raw || {}
  return {
    ...d,
    actions: (d.actions && d.actions.length) ? d.actions : SEED_ACTIONS,
    pipeline: (d.pipeline && d.pipeline.length) ? d.pipeline : SEED_PIPELINE,
    content_calendar: (d.content_calendar && d.content_calendar.length) ? d.content_calendar : SEED_CALENDAR,
    daily: d.daily || {},
    weekly: d.weekly || {},
    monthly: d.monthly || {},
    weekly_summary: d.weekly_summary || {},
    morning_briefing: d.morning_briefing || '',
  }
}

// ── Inline styles ─────────────────────────────────────────────────────────────
const S = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: '#FAF7F2',
    color: '#1C2B3A',
    minHeight: '100vh',
    fontSize: 16,
  },
  header: {
    background: '#FFFFFF',
    borderBottom: '1px solid rgba(28,43,58,0.08)',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  wordmark: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 26,
    fontWeight: 500,
    color: '#1C2B3A',
    letterSpacing: '-0.02em',
  },
  wordmarkDot: { color: '#C4922A' },
  headerRight: { fontSize: 14, color: '#6B6560', textAlign: 'right' },
  headerRightStrong: { display: 'block', color: '#1C2B3A', fontWeight: 600, fontSize: 15 },
  nav: {
    background: '#FFFFFF',
    borderBottom: '1px solid rgba(28,43,58,0.08)',
    display: 'flex',
    padding: '0 24px',
    overflowX: 'auto',
  },
  main: { padding: '28px 24px 60px', maxWidth: 1100, margin: '0 auto' },
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(28,43,58,0.08)',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(28,43,58,0.07)',
    padding: 24,
    marginBottom: 16,
  },
  cardGold: {
    background: '#FFFFFF',
    border: '1px solid rgba(28,43,58,0.08)',
    borderLeft: '3px solid #C4922A',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(28,43,58,0.07)',
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 600,
    color: '#1C2B3A',
    marginBottom: 16,
  },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 },
  metricCard: {
    background: '#FFFFFF',
    border: '1px solid rgba(28,43,58,0.08)',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(28,43,58,0.07)',
    padding: '20px 24px',
  },
  metricLabel: { fontSize: 13, fontWeight: 500, color: '#6B6560', marginBottom: 6 },
  metricValue: { fontSize: 34, fontWeight: 600, color: '#1C2B3A', lineHeight: 1.1 },
  metricValueGold: { fontSize: 34, fontWeight: 600, color: '#C4922A', lineHeight: 1.1 },
  metricSub: { fontSize: 13, color: '#6B6560', marginTop: 4 },
  sectionLabel: { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6560', marginBottom: 12 },
  input: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: '#1C2B3A',
    background: '#FAF7F2',
    border: '1px solid rgba(28,43,58,0.18)',
    borderRadius: 8,
    padding: '10px 14px',
    minHeight: 44,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#1C2B3A',
    background: '#FAF7F2',
    border: '1px solid rgba(28,43,58,0.18)',
    borderRadius: 8,
    padding: '6px 10px',
    minHeight: 36,
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: '#1C2B3A',
    background: '#FAF7F2',
    border: '1px solid rgba(28,43,58,0.18)',
    borderRadius: 8,
    padding: '10px 14px',
    minHeight: 80,
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: '#FAF7F2',
    background: '#1C2B3A',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    minHeight: 44,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnSecondary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: '#6B6560',
    background: 'rgba(28,43,58,0.06)',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    minHeight: 32,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  badgeRus: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '3px 8px',
    borderRadius: 6,
    background: '#1C2B3A',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
  },
  badgeAmanda: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '3px 8px',
    borderRadius: 6,
    background: 'rgba(196,146,42,0.15)',
    color: '#8a600d',
    whiteSpace: 'nowrap',
  },
  badgeUnassigned: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '3px 8px',
    borderRadius: 6,
    background: 'rgba(28,43,58,0.07)',
    color: '#6B6560',
    whiteSpace: 'nowrap',
  },
  divider: { height: 1, background: 'rgba(28,43,58,0.08)', margin: '20px 0' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 160 },
  label: { fontSize: 13, fontWeight: 500, color: '#6B6560' },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' },
}

function fmt(val, suffix = '') {
  if (val === null || val === undefined || val === '') return '—'
  if (suffix) return val + suffix
  return String(val)
}

function badgeStyle(owner) {
  if (owner === 'Rus') return S.badgeRus
  if (owner === 'Amanda') return S.badgeAmanda
  return S.badgeUnassigned
}

// ── Components ────────────────────────────────────────────────────────────────

function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: 500,
        color: active ? '#1C2B3A' : '#6B6560',
        background: 'none',
        border: 'none',
        borderBottom: active ? '3px solid #C4922A' : '3px solid transparent',
        padding: '14px 20px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        minHeight: 44,
        transition: 'color 0.15s, border-color 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function ProgressBar({ label, current, target, isBoolean = false }) {
  const pct = isBoolean ? (current ? 100 : 0) : Math.min(100, Math.round((current / target) * 100))
  const complete = isBoolean ? current : current >= target
  const displayCount = isBoolean ? (current ? 'Done' : 'Not done') : `${current} / ${target}`

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, color: '#6B6560' }}>{displayCount}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(28,43,58,0.1)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: complete ? '#C4922A' : '#1C2B3A',
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

function ActionItem({ action, onChange, onToggle }) {
  return (
    <div style={{
      border: '1px solid rgba(28,43,58,0.08)',
      borderLeft: action.urgent ? '3px solid #C4922A' : '1px solid rgba(28,43,58,0.08)',
      borderRadius: 12,
      padding: action.urgent ? '14px 16px 14px 14px' : '14px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      background: '#FFFFFF',
      opacity: action.done ? 0.45 : 1,
      transition: 'opacity 0.2s',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: '#1C2B3A' }}>{action.text}</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 2 }}>{action.type}{action.urgent ? ' · Urgent' : ''}</div>
      </div>
      <select
        value={action.owner}
        onChange={e => onChange({ ...action, owner: e.target.value })}
        style={{ ...S.select, fontSize: 12 }}
      >
        <option>Unassigned</option>
        <option>Rus</option>
        <option>Amanda</option>
      </select>
      <button
        style={{ ...S.btnSecondary, background: action.done ? 'rgba(196,146,42,0.12)' : undefined, color: action.done ? '#C4922A' : undefined }}
        onClick={() => onToggle(action.id)}
      >
        {action.done ? 'Undo' : 'Done'}
      </button>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, visible }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 24,
      background: '#1C2B3A',
      color: '#FFFFFF',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      fontWeight: 500,
      padding: '12px 20px',
      borderRadius: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.2s, transform 0.2s',
      pointerEvents: 'none',
      zIndex: 999,
    }}>
      {msg}
    </div>
  )
}

const GTM_PASSWORD = 'music2026'
const GTM_LS_KEY = 'gtm_auth'

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!document.querySelector(`link[href*="Cormorant+Garamond"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = FONT_LINK
      document.head.appendChild(link)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pw === GTM_PASSWORD) {
      localStorage.setItem(GTM_LS_KEY, GTM_PASSWORD)
      onAuth()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@import url('${FONT_LINK}');`}</style>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: '#1C2B3A', letterSpacing: '-0.02em', marginBottom: 40 }}>
        wedin<span style={{ color: '#C4922A' }}>.</span>ai
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 320 }}>
        <input
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false) }}
          autoFocus
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: '#1C2B3A',
            background: '#FFFFFF',
            border: error ? '1px solid #C4922A' : '1px solid rgba(28,43,58,0.18)',
            borderRadius: 8,
            padding: '12px 16px',
            width: '100%',
            minHeight: 44,
            outline: 'none',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        />
        {error && <p style={{ fontSize: 14, color: '#C4922A', margin: 0 }}>That's not right — try again.</p>}
        <button type="submit" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#FAF7F2', background: '#1C2B3A', border: 'none', borderRadius: 10, padding: '12px 40px', minHeight: 44, cursor: 'pointer', width: '100%' }}>
          Enter
        </button>
      </form>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GTMDashboard() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(GTM_LS_KEY) === GTM_PASSWORD)
  const [tab, setTab] = useState('today')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toastMsg, setToastMsg] = useState('Saved')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef(null)

  // Update form state
  const [upd, setUpd] = useState({
    outreach: '', ig: '', seo: false,
    payments: '', activations: '', referrals: '', organic: '',
    briefing: '',
    worked: '', didnt: '', rec: '', search: '', instagram: '',
  })

  // Add action form
  const [newAction, setNewAction] = useState({ text: '', owner: 'Unassigned', type: 'Outreach', urgent: false })

  const handleLock = () => {
    localStorage.removeItem(GTM_LS_KEY)
    setAuthed(false)
  }

  // Load Google Fonts
  useEffect(() => {
    if (!document.querySelector(`link[href*="Cormorant+Garamond"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = FONT_LINK
      document.head.appendChild(link)
    }
  }, [])

  const showToast = useCallback((msg = 'Saved') => {
    setToastMsg(msg)
    setToastVisible(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200)
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetch('/.netlify/functions/gtm-data')
      .then(r => r.json())
      .then(raw => {
        const merged = mergeWithSeeds(raw)
        setData(merged)
        setLoading(false)
      })
      .catch(() => {
        setData(mergeWithSeeds(null))
        setLoading(false)
      })
  }, [])

  // Populate update form when switching to update tab
  useEffect(() => {
    if (tab === 'update' && data) {
      const w = data.weekly || {}
      const m = data.monthly || {}
      const ws = data.weekly_summary || {}
      setUpd({
        outreach: w.outreach_sent ?? '',
        ig: w.ig_posts ?? '',
        seo: !!w.seo_done,
        payments: m.payments ?? '',
        activations: m.planner_activations ?? '',
        referrals: m.planner_referrals ?? '',
        organic: m.organic_search_sessions ?? '',
        briefing: data.morning_briefing || '',
        worked: ws.worked || '',
        didnt: ws.didnt_work || '',
        rec: ws.recommendation || '',
        search: ws.search_notes || '',
        instagram: ws.instagram_notes || '',
      })
    }
  }, [tab, data])

  const save = useCallback(async (patch, msg = 'Saved') => {
    try {
      const res = await fetch('/.netlify/functions/gtm-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const updated = await res.json()
      setData(mergeWithSeeds(updated))
      showToast(msg)
    } catch {
      showToast('Save failed — check connection')
    }
  }, [showToast])

  // Action handlers
  const handleActionChange = useCallback((updated) => {
    setData(prev => {
      const actions = prev.actions.map(a => a.id === updated.id ? updated : a)
      const next = { ...prev, actions }
      save({ actions }, 'Action updated')
      return next
    })
  }, [save])

  const handleToggleDone = useCallback((id) => {
    setData(prev => {
      const actions = prev.actions.map(a => a.id === id ? { ...a, done: !a.done } : a)
      const next = { ...prev, actions }
      save({ actions }, 'Action updated')
      return next
    })
  }, [save])

  const handleAddAction = () => {
    if (!newAction.text.trim()) return
    const action = { ...newAction, id: uid(), done: false }
    setData(prev => {
      const actions = [...prev.actions, action]
      save({ actions }, 'Action added')
      return { ...prev, actions }
    })
    setNewAction({ text: '', owner: 'Unassigned', type: 'Outreach', urgent: false })
  }

  // Pipeline handlers
  const handleAddPlanner = () => {
    const planner = { id: uid(), name: '', business: '', date: '', status: 'not-contacted', owner: 'Unassigned', notes: '' }
    setData(prev => {
      const pipeline = [...prev.pipeline, planner]
      save({ pipeline }, 'Planner added')
      return { ...prev, pipeline }
    })
  }

  const handlePlannerChange = useCallback((id, field, value) => {
    setData(prev => {
      const pipeline = prev.pipeline.map(p => p.id === id ? { ...p, [field]: value } : p)
      save({ pipeline }, 'Pipeline updated')
      return { ...prev, pipeline }
    })
  }, [save])

  // Update form submit
  const handleSaveUpdate = () => {
    const patch = {
      weekly: {
        ...(data.weekly || {}),
        outreach_sent: upd.outreach === '' ? null : Number(upd.outreach),
        ig_posts: upd.ig === '' ? null : Number(upd.ig),
        seo_done: upd.seo,
      },
      monthly: {
        ...(data.monthly || {}),
        payments: upd.payments === '' ? null : Number(upd.payments),
        planner_activations: upd.activations === '' ? null : Number(upd.activations),
        planner_referrals: upd.referrals === '' ? null : Number(upd.referrals),
        organic_search_sessions: upd.organic === '' ? null : Number(upd.organic),
      },
      morning_briefing: upd.briefing,
      weekly_summary: {
        worked: upd.worked,
        didnt_work: upd.didnt,
        recommendation: upd.rec,
        search_notes: upd.search,
        instagram_notes: upd.instagram,
      },
    }
    save(patch, 'Dashboard updated')
  }

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  if (loading) {
    return (
      <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#6B6560' }}>Loading…</div>
      </div>
    )
  }

  const d = data.daily || {}
  const w = data.weekly || {}
  const m = data.monthly || {}
  const ws = data.weekly_summary || {}

  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={S.root}>
      {/* Font injection */}
      <style>{`@import url('${FONT_LINK}');`}</style>

      {/* Header */}
      <header style={S.header}>
        <div style={S.wordmark}>wedin<span style={S.wordmarkDot}>.</span>ai</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={handleLock} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6B6560', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            Lock dashboard
          </button>
          <div style={S.headerRight}>
            <strong style={S.headerRightStrong}>GTM Command Centre</strong>
            <span>{today}</span>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav style={S.nav}>
        {['today', 'pipeline', 'content', 'metrics', 'update'].map(t => (
          <NavButton key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
        ))}
      </nav>

      <main style={S.main}>

        {/* ═══════════════ TODAY ═══════════════ */}
        {tab === 'today' && (
          <div>
            {/* Metric cards */}
            <div style={S.grid3}>
              {[
                { label: 'Sessions today', value: fmt(d.sessions_started), gold: false },
                { label: 'Captures today', value: fmt(d.email_captures), gold: false },
                { label: 'Payments today', value: fmt(d.payments), gold: false },
                { label: 'Total customers', value: fmt(w.total_customers), gold: true },
                { label: 'Conversion rate', value: d.conversion_rate != null ? d.conversion_rate + '%' : '—', gold: false, sub: 'captures → paid' },
                {
                  label: 'Last updated',
                  value: data.updated_at ? new Date(data.updated_at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—',
                  gold: false,
                  small: true,
                },
              ].map(card => (
                <div key={card.label} style={S.metricCard}>
                  <div style={S.metricLabel}>{card.label}</div>
                  <div style={{ ...(card.gold ? S.metricValueGold : S.metricValue), ...(card.small ? { fontSize: 20 } : {}) }}>
                    {card.value}
                  </div>
                  {card.sub && <div style={S.metricSub}>{card.sub}</div>}
                </div>
              ))}
            </div>

            {/* Non-negotiables + briefing */}
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>Three non-negotiables</div>
                <ProgressBar label="Planner outreach" current={Number(w.outreach_sent) || 0} target={10} />
                <ProgressBar label="Instagram posts" current={Number(w.ig_posts) || 0} target={4} />
                <ProgressBar label="SEO content" current={!!w.seo_done} target={1} isBoolean />
              </div>
              <div style={S.cardGold}>
                <div style={S.cardTitle}>Morning briefing</div>
                {data.morning_briefing
                  ? data.morning_briefing.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} style={{ fontSize: 15, color: '#1C2B3A', lineHeight: 1.7 }}>{line.trim()}</p>
                  ))
                  : <p style={{ fontSize: 15, color: '#6B6560', fontStyle: 'italic' }}>No briefing yet — add one in the Update tab.</p>
                }
              </div>
            </div>

            {/* Action queue */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={S.cardTitle}>Action queue</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {data.actions.length === 0
                  ? <p style={{ fontSize: 15, color: '#6B6560' }}>No actions yet.</p>
                  : data.actions.map(action => (
                    <ActionItem key={action.id} action={action} onChange={handleActionChange} onToggle={handleToggleDone} />
                  ))
                }
              </div>

              <div style={S.divider} />
              <div style={{ ...S.sectionLabel, marginTop: 16 }}>Add action</div>
              <div style={{ ...S.formRow, marginBottom: 12 }}>
                <div style={{ ...S.formGroup, flex: 3, minWidth: 200 }}>
                  <label style={S.label}>Action</label>
                  <input
                    style={S.input}
                    type="text"
                    placeholder="Describe the action…"
                    value={newAction.text}
                    onChange={e => setNewAction(p => ({ ...p, text: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddAction()}
                  />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Owner</label>
                  <select style={{ ...S.select, minHeight: 44, fontSize: 15, padding: '10px 14px', width: '100%' }} value={newAction.owner} onChange={e => setNewAction(p => ({ ...p, owner: e.target.value }))}>
                    <option>Unassigned</option>
                    <option>Rus</option>
                    <option>Amanda</option>
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Type</label>
                  <select style={{ ...S.select, minHeight: 44, fontSize: 15, padding: '10px 14px', width: '100%' }} value={newAction.type} onChange={e => setNewAction(p => ({ ...p, type: e.target.value }))}>
                    <option>Outreach</option>
                    <option>Pipeline</option>
                    <option>Content</option>
                    <option>SEO</option>
                    <option>Engagement</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, fontSize: 15, cursor: 'pointer' }}>
                  <input type="checkbox" checked={newAction.urgent} onChange={e => setNewAction(p => ({ ...p, urgent: e.target.checked }))} style={{ width: 18, height: 18, accentColor: '#C4922A' }} />
                  Urgent
                </label>
                <button style={S.btnPrimary} onClick={handleAddAction}>Add action</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ PIPELINE ═══════════════ */}
        {tab === 'pipeline' && (
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={S.cardTitle}>Planner pipeline</div>
              <button style={S.btnPrimary} onClick={handleAddPlanner}>+ Add planner</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr>
                    {['Planner', 'Business', 'Date contacted', 'Status', 'Owner', 'Notes'].map(h => (
                      <th key={h} style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6B6560', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid rgba(28,43,58,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.pipeline.map(p => (
                    <tr key={p.id}>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(28,43,58,0.06)', verticalAlign: 'middle' }}>
                        <input style={{ ...S.input, minHeight: 36, fontSize: 14, padding: '6px 10px', minWidth: 130 }} value={p.name} onChange={e => handlePlannerChange(p.id, 'name', e.target.value)} />
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(28,43,58,0.06)', verticalAlign: 'middle' }}>
                        <input style={{ ...S.input, minHeight: 36, fontSize: 14, padding: '6px 10px', minWidth: 130 }} value={p.business} onChange={e => handlePlannerChange(p.id, 'business', e.target.value)} />
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(28,43,58,0.06)', verticalAlign: 'middle' }}>
                        <input style={{ ...S.input, minHeight: 36, fontSize: 14, padding: '6px 10px', minWidth: 100 }} placeholder="DD/MM/YY" value={p.date} onChange={e => handlePlannerChange(p.id, 'date', e.target.value)} />
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(28,43,58,0.06)', verticalAlign: 'middle' }}>
                        <select style={S.select} value={p.status} onChange={e => handlePlannerChange(p.id, 'status', e.target.value)}>
                          <option value="not-contacted">Not contacted</option>
                          <option value="outreach-sent">Outreach sent</option>
                          <option value="replied">Replied</option>
                          <option value="activated">Activated</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(28,43,58,0.06)', verticalAlign: 'middle' }}>
                        <select style={S.select} value={p.owner} onChange={e => handlePlannerChange(p.id, 'owner', e.target.value)}>
                          <option>Unassigned</option>
                          <option>Rus</option>
                          <option>Amanda</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid rgba(28,43,58,0.06)', verticalAlign: 'middle' }}>
                        <input style={{ ...S.input, minHeight: 36, fontSize: 14, padding: '6px 10px', minWidth: 160 }} value={p.notes} onChange={e => handlePlannerChange(p.id, 'notes', e.target.value)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ CONTENT ═══════════════ */}
        {tab === 'content' && <WedinDashboard />}

        {/* ═══════════════ METRICS ═══════════════ */}
        {tab === 'metrics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={S.cardGold}>
              <div style={S.cardTitle}>Weekly summary</div>
              {[
                { key: 'worked', label: 'What worked' },
                { key: 'didnt_work', label: "What didn't work" },
                { key: 'recommendation', label: 'Recommendation' },
                { key: 'search_notes', label: 'Search' },
                { key: 'instagram_notes', label: 'Instagram' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6B6560', marginBottom: 4 }}>{f.label}</div>
                  {(ws[f.key] || '').trim()
                    ? <div style={{ fontSize: 15, color: '#1C2B3A', lineHeight: 1.6 }}>{ws[f.key]}</div>
                    : <div style={{ fontSize: 15, color: '#6B6560', fontStyle: 'italic' }}>Not yet added.</div>
                  }
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.cardTitle}>Month to date</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Payments', value: m.payments, gold: true },
                  { label: 'Planner activations', value: m.planner_activations },
                  { label: 'Planner referrals', value: m.planner_referrals },
                  { label: 'Organic sessions', value: m.organic_search_sessions },
                ].map(card => (
                  <div key={card.label} style={{ background: '#FAF7F2', border: '1px solid rgba(28,43,58,0.08)', borderRadius: 12, padding: '16px 20px' }}>
                    <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 4 }}>{card.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 600, color: card.gold ? '#C4922A' : '#1C2B3A' }}>{fmt(card.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ UPDATE ═══════════════ */}
        {tab === 'update' && (
          <div style={S.card}>
            <div style={S.cardTitle}>Update dashboard</div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(28,43,58,0.08)' }}>This week's numbers</div>
              <div style={S.formRow}>
                <div style={S.formGroup}>
                  <label style={S.label}>Outreach sent this week</label>
                  <input style={S.input} type="number" min="0" placeholder="0" value={upd.outreach} onChange={e => setUpd(p => ({ ...p, outreach: e.target.value }))} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Instagram posts this week</label>
                  <input style={S.input} type="number" min="0" placeholder="0" value={upd.ig} onChange={e => setUpd(p => ({ ...p, ig: e.target.value }))} />
                </div>
                <div style={{ ...S.formGroup, justifyContent: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, fontSize: 15, cursor: 'pointer' }}>
                    <input type="checkbox" checked={upd.seo} onChange={e => setUpd(p => ({ ...p, seo: e.target.checked }))} style={{ width: 18, height: 18, accentColor: '#C4922A' }} />
                    SEO piece done this week
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(28,43,58,0.08)' }}>Month to date</div>
              <div style={S.formRow}>
                {[
                  { label: 'Payments this month', key: 'payments' },
                  { label: 'Planner activations', key: 'activations' },
                  { label: 'Planner referrals', key: 'referrals' },
                  { label: 'Organic sessions', key: 'organic' },
                ].map(f => (
                  <div key={f.key} style={S.formGroup}>
                    <label style={S.label}>{f.label}</label>
                    <input style={S.input} type="number" min="0" placeholder="0" value={upd[f.key]} onChange={e => setUpd(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(28,43,58,0.08)' }}>Cowork morning briefing</div>
              <div style={S.formGroup}>
                <label style={S.label}>One line per item — each becomes its own row</label>
                <textarea style={{ ...S.textarea, minHeight: 120 }} placeholder={'e.g. 3 DMs to follow up\nAmanda to add planners to pipeline\nSEO post due Friday'} value={upd.briefing} onChange={e => setUpd(p => ({ ...p, briefing: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(28,43,58,0.08)' }}>Weekly retrospective</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'What worked', key: 'worked', placeholder: 'Channels, tactics, or content that performed…' },
                  { label: "What didn't work", key: 'didnt', placeholder: 'What to stop or adjust…' },
                  { label: 'Recommendation', key: 'rec', placeholder: 'The one thing to prioritise next week…' },
                  { label: 'Search notes', key: 'search', placeholder: 'Keyword movements, ranking changes, content gaps…' },
                  { label: 'Instagram notes', key: 'instagram', placeholder: 'Engagement patterns, post performance, follower growth…' },
                ].map(f => (
                  <div key={f.key} style={S.formGroup}>
                    <label style={S.label}>{f.label}</label>
                    <textarea style={S.textarea} placeholder={f.placeholder} value={upd[f.key]} onChange={e => setUpd(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button style={S.btnPrimary} onClick={handleSaveUpdate}>Save all updates</button>
            </div>
          </div>
        )}
      </main>

      <Toast msg={toastMsg} visible={toastVisible} />
    </div>
  )
}
