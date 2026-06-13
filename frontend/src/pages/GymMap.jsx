import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { AREA_COLORS, GYM_AREAS } from '../data/seed.js'

const TIME_SLOTS = []
for (let h = 6; h <= 22; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2,'0')}:00`)
  if (h < 22) TIME_SLOTS.push(`${String(h).padStart(2,'0')}:30`)
}

function formatSlot(slot) {
  const [h, m] = slot.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h > 12 ? h - 12 : h || 12
  return `${displayH}${m ? ':30' : ''}${ampm}`
}

export default function GymMap() {
  const { coaches, teams, saveGymMapSlot, clearGymMapSlot, getGymMapForDate } = useApp()
  const [dateOffset, setDateOffset] = useState(0)
  const [selectedArea, setSelectedArea] = useState('Floor')

  const currentDate = addDays(new Date(), dateOffset)
  const dateStr = format(currentDate, 'yyyy-MM-dd')
  const gymData  = getGymMapForDate(dateStr)

  function getSlot(coachId, slotTime) {
    const coachSlots = gymData[coachId] || []
    return coachSlots.find(s => s.slotTime === slotTime) || null
  }

  function handleCellClick(coachId, slotTime) {
    const existing = getSlot(coachId, slotTime)
    if (existing) {
      clearGymMapSlot(dateStr, coachId, existing.slotId)
    } else {
      saveGymMapSlot(dateStr, coachId, {
        slotId: `${coachId}_${slotTime}`,
        slotTime,
        area: selectedArea,
      })
    }
  }

  const visibleSlots = TIME_SLOTS.filter(t => parseInt(t) >= 14 && parseInt(t) <= 22)
  const teamMap = {}
  teams.forEach(t => { teamMap[t.id] = t })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Gym Map</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setDateOffset(d => d - 1)} className="btn-outline p-2">
            <ChevronLeft size={15} />
          </button>
          <div className="card px-4 py-1.5 min-w-[148px] text-center">
            <span className="font-semibold text-sm text-ink">{format(currentDate, 'EEE, MMM d')}</span>
          </div>
          <button onClick={() => setDateOffset(d => d + 1)} className="btn-outline p-2">
            <ChevronRight size={15} />
          </button>
          <button onClick={() => setDateOffset(0)} className="btn-dark text-sm">Today</button>
        </div>
      </div>

      {/* Area selector */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <span className="section-label">Assign Area:</span>
        {GYM_AREAS.map(area => (
          <button key={area} onClick={() => setSelectedArea(area)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedArea === area ? 'ring-2 ring-ink ring-offset-1' : 'border-border'
            }`}
            style={{
              background: selectedArea === area ? AREA_COLORS[area] : AREA_COLORS[area] + '40',
              color: 'var(--ink)',
            }}>
            {area}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-xs text-muted">
          <Info size={11} />
          <span>Click to assign, click again to clear</span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${120 + visibleSlots.length * 52}px` }}>
            {/* Time header */}
            <div className="flex border-b border-border sticky top-0 z-10"
                 style={{ background: 'var(--bg)' }}>
              <div className="w-[120px] shrink-0 px-3 py-2.5 border-r border-border">
                <span className="section-label">Coach</span>
              </div>
              {visibleSlots.map(slot => (
                <div key={slot} className="w-[52px] shrink-0 border-r border-border/50 px-1 py-2.5 text-center">
                  <span className="text-[9px] font-semibold text-muted block leading-tight">
                    {formatSlot(slot)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coach rows */}
            {coaches.map((coach, ci) => {
              const team = teamMap[coach.teamId]
              return (
                <div key={coach.id}
                  className="flex border-b border-border/50 min-h-[44px]"
                  style={{ background: ci % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                  <div className="w-[120px] shrink-0 px-3 py-2 border-r border-border/50 flex flex-col justify-center">
                    <span className="font-semibold text-xs text-ink truncate">{coach.name}</span>
                    {team && (
                      <span className="text-[9px] font-semibold mt-0.5 px-1.5 py-0.5 rounded-md inline-block"
                            style={{ background: team.color + '25', color: team.color }}>
                        {team.name}
                      </span>
                    )}
                  </div>
                  {visibleSlots.map(slot => {
                    const slotData = getSlot(coach.id, slot)
                    return (
                      <div key={slot}
                        onClick={() => handleCellClick(coach.id, slot)}
                        className="w-[52px] shrink-0 border-r border-border/30 cursor-pointer relative transition-all hover:ring-2 hover:ring-accent hover:z-10 hover:ring-inset self-stretch"
                        style={{ background: slotData ? AREA_COLORS[slotData.area] + '60' : 'transparent' }}
                        title={slotData ? `${coach.name} - ${slotData.area} at ${formatSlot(slot)}` : `Assign to ${coach.name} at ${formatSlot(slot)}`}>
                        {slotData && (
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-ink opacity-70 leading-none text-center px-0.5">
                            {slotData.area.substring(0,3).toUpperCase()}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Area legend */}
      <div className="card p-4">
        <p className="section-label mb-3">Gym Areas</p>
        <div className="flex flex-wrap gap-2">
          {GYM_AREAS.map(area => (
            <div key={area} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border"
                 style={{ background: 'var(--bg)' }}>
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: AREA_COLORS[area] }} />
              <span className="font-semibold text-xs text-ink">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage summary */}
      {Object.keys(gymData).length > 0 && (
        <div className="card p-5">
          <p className="section-label mb-3">Coverage - {format(currentDate, 'MMM d')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {GYM_AREAS.map(area => {
              const count = Object.values(gymData).flat().filter(s => s.area === area).length
              return (
                <div key={area} className="rounded-xl p-3 text-center"
                     style={{ background: AREA_COLORS[area] + '20' }}>
                  <p className="font-bold text-2xl text-ink">{count}</p>
                  <p className="text-xs text-muted mt-0.5">{area}</p>
                  <p className="text-[10px] text-muted/60">slots</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
