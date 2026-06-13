import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameMonth, isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Calendar() {
  const { teams, schedules, practices, generateAllForDate, generatePracticeForDate, showToast } = useApp()
  const navigate = useNavigate()
  const [current, setCurrent] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(current), { weekStartsOn: 0 }),
    end:   endOfWeek(endOfMonth(current), { weekStartsOn: 0 }),
  })

  function getTeamsForDay(date) {
    const dow = date.getDay()
    return schedules.filter(s => s.days.includes(dow)).map(s => teams.find(t => t.id === s.teamId)).filter(Boolean)
  }

  function hasPractice(team, date) {
    return !!practices[`${team.id}_${format(date, 'yyyy-MM-dd')}`]
  }

  const selectedStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
  const selectedTeams = selectedDate ? getTeamsForDay(selectedDate) : []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrent(subMonths(current, 1))} className="btn-outline p-2">
            <ChevronLeft size={15} />
          </button>
          <div className="card px-4 py-1.5 min-w-[148px] text-center">
            <span className="font-semibold text-sm text-ink">{format(current, 'MMMM yyyy')}</span>
          </div>
          <button onClick={() => setCurrent(addMonths(current, 1))} className="btn-outline p-2">
            <ChevronRight size={15} />
          </button>
          <button onClick={() => setCurrent(new Date())} className="btn-dark text-sm">Today</button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Grid */}
        <div className="flex-1 min-w-0 card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center section-label py-2.5">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map(day => {
              const inMonth  = isSameMonth(day, current)
              const today    = isToday(day)
              const dateStr  = format(day, 'yyyy-MM-dd')
              const dayTeams = getTeamsForDay(day)
              const isSel    = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr

              return (
                <div key={dateStr} onClick={() => setSelectedDate(day)}
                  className="border-r border-b border-border p-1.5 min-h-[76px] cursor-pointer transition-colors last:border-r-0"
                  style={{ background: isSel ? 'var(--accent-soft)' : !inMonth ? 'var(--bg)' : 'transparent' }}>
                  <div className={`w-6 h-6 flex items-center justify-center text-xs font-semibold mb-1 rounded-full
                    ${today ? 'bg-ink text-accent' : !inMonth ? 'text-muted/40' : 'text-ink'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayTeams.map(team => (
                      <div key={team.id} className="flex items-center gap-1 text-[10px] font-semibold px-1 py-0.5 rounded-sm"
                           style={{ background: team.color + '20', color: team.color }}>
                        <span className="truncate">{team.name}</span>
                        {hasPractice(team, day) && <span className="ml-auto shrink-0">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-56 shrink-0 space-y-3">
          {selectedDate ? (
            <div className="card overflow-hidden sticky top-20">
              <div className="px-4 py-3 border-b border-border">
                <p className="section-label">Selected</p>
                <p className="font-semibold text-ink mt-0.5">{format(selectedDate, 'EEE, MMM d')}</p>
                {isToday(selectedDate) && <span className="tag-accent mt-1 inline-block">Today</span>}
              </div>
              <div className="p-3 space-y-2">
                {selectedTeams.length === 0 ? (
                  <p className="text-xs text-muted">No practices scheduled.</p>
                ) : (
                  <>
                    {selectedTeams.map(team => {
                      const practice = practices[`${team.id}_${selectedStr}`]
                      const schedule = schedules.find(s => s.teamId === team.id)
                      return (
                        <div key={team.id} className="rounded-lg overflow-hidden border border-border">
                          <div className="px-3 py-2 border-b border-border flex items-center justify-between"
                               style={{ background: team.color + '15' }}>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: team.color }} />
                              <span className="font-semibold text-xs text-ink">{team.name}</span>
                            </div>
                            <span className="text-[10px] text-muted">{schedule?.startTime}</span>
                          </div>
                          <div className="px-3 py-2">
                            {practice ? (
                              <button onClick={() => navigate(`/practice/${team.id}/${selectedStr}`)}
                                className="btn-dark w-full text-xs">View</button>
                            ) : (
                              <button onClick={() => { generatePracticeForDate(team.id, selectedStr); navigate(`/practice/${team.id}/${selectedStr}`) }}
                                className="btn-accent w-full text-xs">
                                <Zap size={10} /> Generate
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {selectedTeams.some(t => !practices[`${t.id}_${selectedStr}`]) && (
                      <button onClick={() => { generateAllForDate(selectedStr); showToast('Generated!') }}
                        className="btn-dark w-full text-xs">
                        <Zap size={10} /> Generate All
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center sticky top-20">
              <p className="font-semibold text-ink text-sm mb-1">Select a day</p>
              <p className="text-xs text-muted">Click any date to see teams.</p>
            </div>
          )}

          <div className="card p-4 sticky top-[280px]">
            <p className="section-label mb-3">Teams</p>
            <div className="space-y-2">
              {teams.map(team => (
                <div key={team.id} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: team.color }} />
                  <span className="text-xs text-ink">{team.name}</span>
                  <span className="text-[10px] text-muted ml-auto">{team.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
