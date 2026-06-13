import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { PenLine, Clock, MapPin, CalendarDays, Download, ArrowRight, Loader2 } from 'lucide-react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import BlockTypeTag from '../components/BlockTypeTag.jsx'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Shell({ children }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="max-w-3xl mx-auto px-5 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent">
            <PenLine size={13} className="text-ink" />
          </div>
          <span className="font-bold text-lg text-ink tracking-tight">chalk</span>
        </a>
        <span className="text-xs text-muted">Shared schedule</span>
      </header>
      <main className="max-w-3xl mx-auto px-5 pb-16">{children}</main>
    </div>
  )
}

function PracticeCard({ practice }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between"
           style={{ background: 'var(--bg)' }}>
        <p className="font-semibold text-sm text-ink">
          {format(parseISO(practice.date), 'EEE, MMM d')}
        </p>
        <p className="text-xs text-muted">{practice.startTime}–{practice.endTime}</p>
      </div>
      <div className="divide-y divide-border/50">
        {practice.blocks.map((b, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
            <BlockTypeTag blockType={b.blockType} />
            <span className="flex-1 min-w-0 text-sm text-ink truncate">{b.assignedPlanTitle}</span>
            <span className="flex items-center gap-1 text-xs text-muted shrink-0">
              <Clock size={10} /> {b.startTime}–{b.endTime}
            </span>
            {b.gymArea && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-muted shrink-0">
                <MapPin size={10} /> {b.gymArea}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SharedView({ shareId }) {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState({ status: 'loading', data: null })
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)

  useEffect(() => {
    let alive = true
    api.get(`/api/shared/${shareId}`)
      .then(data => {
        if (!alive) return
        if (!data || data.error || !data.team) setState({ status: 'error', data: null })
        else setState({ status: 'ok', data })
      })
      .catch(() => alive && setState({ status: 'error', data: null }))
    return () => { alive = false }
  }, [shareId])

  async function handleImport() {
    if (!user) return login()
    setImporting(true)
    try {
      const res = await api.post(`/api/shared/${shareId}/import`)
      if (res?.ok) {
        setImported(true)
        setTimeout(() => navigate('/'), 900)
      }
    } finally {
      setImporting(false)
    }
  }

  if (state.status === 'loading') {
    return (
      <Shell>
        <div className="card p-10 flex items-center justify-center gap-2 text-muted">
          <Loader2 size={16} className="animate-spin" /> Loading schedule…
        </div>
      </Shell>
    )
  }

  if (state.status === 'error') {
    return (
      <Shell>
        <div className="card p-10 text-center">
          <p className="font-bold text-xl text-ink mb-1">Link not available</p>
          <p className="text-sm text-muted mb-6">This share link is invalid, was revoked, or the team no longer exists.</p>
          <a href="/" className="btn-dark inline-flex items-center gap-1 mx-auto">
            Go to Chalk <ArrowRight size={14} />
          </a>
        </div>
      </Shell>
    )
  }

  const { team, schedule, practices, plans, ownerName } = state.data
  const practiceList = Object.values(practices || {}).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Shell>
      {/* Team header */}
      <div className="card overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: team.color }} />
            <p className="section-label">Shared by {ownerName}</p>
          </div>
          <h1 className="text-2xl font-bold text-ink">{team.name}</h1>
          <p className="text-muted text-sm mt-0.5">{team.level}</p>
        </div>
        {schedule && (
          <div className="px-6 py-3 flex items-center gap-2" style={{ background: 'var(--bg)' }}>
            <CalendarDays size={13} className="text-muted shrink-0" />
            <span className="text-sm text-muted">
              {schedule.days.map(d => DAY_NAMES[d]).join(', ')} · {schedule.startTime}–{schedule.endTime}
            </span>
          </div>
        )}
      </div>

      {/* Practices, or the template if none generated yet */}
      {practiceList.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-bold text-ink flex items-center gap-2"><Clock size={16} /> Practices</h2>
          {practiceList.map(p => <PracticeCard key={p.id} practice={p} />)}
        </div>
      ) : schedule ? (
        <div className="card p-5">
          <p className="section-label mb-3">Practice template</p>
          <div className="space-y-2">
            {schedule.blocks.filter(b => b.durationMins > 0).map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <BlockTypeTag blockType={b.blockType} />
                <span className="text-xs text-muted">{b.durationMins} min</span>
                {b.gymArea && <span className="text-xs text-muted flex items-center gap-1"><MapPin size={10} /> {b.gymArea}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center text-sm text-muted">No schedule set for this team yet.</div>
      )}

      {/* Import CTA */}
      <div className="card p-6 mt-6" style={{ background: 'var(--accent)' }}>
        <h3 className="font-bold text-ink text-lg mb-1">Coach this team too?</h3>
        <p className="text-ink/70 text-sm mb-4">
          Copy <strong>{team.name}</strong> — its schedule, {plans.length} lesson plan{plans.length !== 1 ? 's' : ''}, and rotations — straight into your own Chalk.
        </p>
        {imported ? (
          <div className="btn-dark inline-flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Imported — opening your Chalk…
          </div>
        ) : (
          <button onClick={handleImport} disabled={importing}
            className="btn-dark inline-flex items-center gap-2 disabled:opacity-60">
            {importing
              ? <><Loader2 size={14} className="animate-spin" /> Importing…</>
              : <><Download size={14} /> {user ? 'Import to my Chalk' : 'Sign in to import'}</>}
          </button>
        )}
      </div>
    </Shell>
  )
}
