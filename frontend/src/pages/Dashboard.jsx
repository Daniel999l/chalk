import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isToday, parseISO } from 'date-fns'
import { Zap, Users, BookOpen, CalendarDays, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import TeamBadge from '../components/TeamBadge.jsx'
import BlockTypeTag from '../components/BlockTypeTag.jsx'

function todayStr() { return format(new Date(), 'yyyy-MM-dd') }

export default function Dashboard() {
  const { teams, coaches, plans, schedules, practices, generateAllForDate, getTeamsForDate, showToast } = useApp()
  const navigate = useNavigate()
  const today = todayStr()
  const todayTeams = getTeamsForDate(today)
  const [generating, setGenerating] = useState(false)

  function handleGenerateToday() {
    setGenerating(true)
    setTimeout(() => {
      const count = generateAllForDate(today)
      showToast(count > 0 ? `Generated ${count} practice${count > 1 ? 's' : ''}` : 'All practices already generated')
      setGenerating(false)
    }, 400)
  }

  const totalPractices = Object.keys(practices).length

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="card p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
           style={{ background: 'var(--accent)' }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/50 mb-1">Today</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-none">
            {format(new Date(), 'EEEE')}
          </h1>
          <p className="text-ink/60 font-medium mt-1">{format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <button onClick={handleGenerateToday} disabled={generating}
          className="btn-dark self-start sm:self-auto shrink-0">
          <Zap size={14} className={generating ? 'animate-spin' : ''} />
          {generating ? 'Generating…' : 'Generate Today'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Teams',          value: teams.length,       icon: Users },
          { label: 'Coaches',        value: coaches.length,     icon: Users },
          { label: 'Lesson Plans',   value: plans.length,       icon: BookOpen },
          { label: 'Sessions',       value: totalPractices,     icon: CalendarDays },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">{label}</p>
              <Icon size={15} className="text-muted" />
            </div>
            <p className="text-3xl font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Today's practices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Today's Practices</h2>
          <span className="section-label">{todayTeams.length} team{todayTeams.length !== 1 ? 's' : ''}</span>
        </div>

        {todayTeams.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-semibold text-ink mb-1">No practices today</p>
            <p className="text-muted text-sm">Check the calendar or add teams to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayTeams.map(team => {
              const practice = practices[`${team.id}_${today}`]
              const schedule = schedules.find(s => s.teamId === team.id)
              return (
                <div key={team.id} className="card overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: team.color }} />
                      <span className="font-semibold text-ink text-sm">{team.name}</span>
                    </div>
                    <span className="text-xs text-muted">{schedule?.startTime}–{schedule?.endTime}</span>
                  </div>
                  <div className="p-4">
                    {practice ? (
                      <div className="space-y-2">
                        {practice.blocks.slice(0, 3).map((block, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <BlockTypeTag blockType={block.blockType} />
                            <span className="text-xs text-muted truncate">{block.assignedPlanTitle}</span>
                          </div>
                        ))}
                        {practice.blocks.length > 3 && (
                          <p className="text-xs text-muted">+{practice.blocks.length - 3} more</p>
                        )}
                        <button onClick={() => navigate(`/practice/${team.id}/${today}`)}
                          className="btn-dark w-full text-xs mt-2">
                          View Practice <ChevronRight size={11} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-xs text-muted mb-3">Not generated yet</p>
                        <button onClick={() => { generateAllForDate(today); navigate(`/practice/${team.id}/${today}`) }}
                          className="btn-accent text-xs mx-auto">
                          <Zap size={11} /> Generate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent sessions */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Recent Sessions</h2>
        {Object.values(practices).length === 0 ? (
          <div className="card p-8 text-center text-muted text-sm">
            No sessions yet - hit Generate Today above.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border" style={{ background: 'var(--bg)' }}>
                  <th className="text-left px-4 py-3 section-label">Date</th>
                  <th className="text-left px-4 py-3 section-label">Team</th>
                  <th className="text-left px-4 py-3 section-label">Blocks</th>
                  <th className="text-left px-4 py-3 section-label hidden md:table-cell">Time</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {Object.values(practices)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 8)
                  .map(p => {
                    const team = teams.find(t => t.id === p.teamId)
                    return (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-[var(--bg)] transition-colors">
                        <td className="px-4 py-3 text-ink">
                          {format(parseISO(p.date), 'MMM d, yyyy')}
                          {p.date === today && <span className="ml-2 tag-accent">Today</span>}
                        </td>
                        <td className="px-4 py-3">{team && <TeamBadge team={team} />}</td>
                        <td className="px-4 py-3 text-muted">{p.blocks.length} blocks</td>
                        <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                          {format(parseISO(p.generatedAt), 'HH:mm')}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => navigate(`/practice/${p.teamId}/${p.date}`)}
                            className="btn-outline text-xs">
                            View <ChevronRight size={11} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
