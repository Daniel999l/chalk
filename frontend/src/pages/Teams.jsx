import { useState } from 'react'
import { Plus, Pencil, Trash2, User, RotateCcw, Clock, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Modal from '../components/Modal.jsx'
import BlockTypeTag from '../components/BlockTypeTag.jsx'
import { TEAM_COLORS, BLOCK_TYPES } from '../data/seed.js'
import { getRotationInfo } from '../lib/rotationEngine.js'

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function CoachRow({ coach, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-border/50 last:border-0">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
           style={{ background: 'var(--bg)' }}>
        <User size={13} className="text-muted" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-ink">{coach.name}</p>
        <p className="text-xs text-muted">{coach.role}</p>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(coach)} className="btn-outline p-1.5"><Pencil size={11} /></button>
        <button onClick={() => onDelete(coach.id)} className="btn-outline p-1.5 hover:text-red-500 hover:border-red-200"><Trash2 size={11} /></button>
      </div>
    </div>
  )
}

function TeamForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ name: initial?.name || '', level: initial?.level || 'Beginner', color: initial?.color || TEAM_COLORS[0] })
  return (
    <div className="space-y-4">
      <div>
        <label className="section-label block mb-1">Team Name</label>
        <input className="neo-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Team Apex" />
      </div>
      <div>
        <label className="section-label block mb-1">Level</label>
        <select className="neo-select" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
          {['Beginner','Intermediate','Advanced','Elite','Junior','Senior'].map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="section-label block mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {TEAM_COLORS.map(c => (
            <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
              className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-ink scale-110' : ''}`}
              style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-3 border-t border-border">
        <button onClick={onCancel} className="btn-outline">Cancel</button>
        <button onClick={() => form.name && onSave(form)} className="btn-dark">Save</button>
      </div>
    </div>
  )
}

function CoachForm({ teams, initial, onSave, onCancel }) {
  const [form, setForm] = useState({ name: initial?.name || '', role: initial?.role || 'Assistant', teamId: initial?.teamId || teams[0]?.id || '' })
  return (
    <div className="space-y-4">
      <div>
        <label className="section-label block mb-1">Name</label>
        <input className="neo-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Coach name" />
      </div>
      <div>
        <label className="section-label block mb-1">Role</label>
        <select className="neo-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
          {['Head Coach','Assistant','Specialist','Volunteer'].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="section-label block mb-1">Team</label>
        <select className="neo-select" value={form.teamId} onChange={e => setForm(p => ({ ...p, teamId: e.target.value }))}>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2 justify-end pt-3 border-t border-border">
        <button onClick={onCancel} className="btn-outline">Cancel</button>
        <button onClick={() => form.name && onSave(form)} className="btn-dark">Save</button>
      </div>
    </div>
  )
}

export default function Teams() {
  const { teams, coaches, rotations, plans, schedules, addTeam, updateTeam, deleteTeam,
          addCoach, updateCoach, deleteCoach, resetRotation, updateSchedule } = useApp()
  const [editTeam, setEditTeam]     = useState(null)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [editCoach, setEditCoach]   = useState(null)
  const [showAddCoach, setShowAddCoach] = useState(false)
  const [showRotations, setShowRotations] = useState(null)
  const [showSchedule, setShowSchedule]   = useState(null)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Teams & Coaches</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowAddCoach(true)} className="btn-outline flex items-center gap-1 text-sm"><Plus size={13} /> Coach</button>
          <button onClick={() => setShowAddTeam(true)} className="btn-dark flex items-center gap-1 text-sm"><Plus size={13} /> Team</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map(team => {
          const teamCoaches = coaches.filter(c => c.teamId === team.id)
          const schedule = schedules.find(s => s.teamId === team.id)
          return (
            <div key={team.id} className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: team.color }} />
                  <div>
                    <p className="font-semibold text-ink text-sm">{team.name}</p>
                    <p className="text-xs text-muted">{team.level}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[
                    { fn: () => setShowSchedule(team.id), icon: Calendar },
                    { fn: () => setShowRotations(team.id), icon: RotateCcw },
                    { fn: () => setEditTeam(team), icon: Pencil },
                  ].map(({ fn, icon: Icon }, idx) => (
                    <button key={idx} onClick={fn}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted hover:bg-[var(--bg)] hover:text-ink transition-colors">
                      <Icon size={11} />
                    </button>
                  ))}
                  <button onClick={() => { if (window.confirm('Delete team?')) deleteTeam(team.id) }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              {schedule && (
                <div className="px-4 py-2 border-b border-border/40 flex items-center gap-2"
                     style={{ background: 'var(--bg)' }}>
                  <Clock size={11} className="text-muted shrink-0" />
                  <span className="text-xs text-muted">{schedule.days.map(d => DAY_NAMES[d]).join(', ')} · {schedule.startTime}–{schedule.endTime}</span>
                </div>
              )}
              <div>
                {teamCoaches.length === 0
                  ? <p className="px-4 py-4 text-sm text-muted">No coaches assigned.</p>
                  : teamCoaches.map(c => <CoachRow key={c.id} coach={c} onEdit={setEditCoach} onDelete={id => { if (window.confirm('Remove coach?')) deleteCoach(id) }} />)
                }
              </div>
              <div className="px-4 py-2 border-t border-border/40">
                <button onClick={() => setShowAddCoach({ teamId: team.id })}
                  className="text-xs font-semibold text-muted hover:text-ink flex items-center gap-1 transition-colors">
                  <Plus size={10} /> Add coach
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showAddTeam && <Modal title="New Team" onClose={() => setShowAddTeam(false)}><TeamForm onSave={d => { addTeam(d); setShowAddTeam(false) }} onCancel={() => setShowAddTeam(false)} /></Modal>}
      {editTeam && <Modal title="Edit Team" onClose={() => setEditTeam(null)}><TeamForm initial={editTeam} onSave={d => { updateTeam(editTeam.id, d); setEditTeam(null) }} onCancel={() => setEditTeam(null)} /></Modal>}
      {(showAddCoach || editCoach) && (
        <Modal title={editCoach ? 'Edit Coach' : 'Add Coach'} onClose={() => { setShowAddCoach(false); setEditCoach(null) }}>
          <CoachForm teams={teams}
            initial={editCoach || (showAddCoach?.teamId ? { teamId: showAddCoach.teamId } : null)}
            onSave={d => { if (editCoach) { updateCoach(editCoach.id, d); setEditCoach(null) } else { addCoach(d); setShowAddCoach(false) } }}
            onCancel={() => { setShowAddCoach(false); setEditCoach(null) }} />
        </Modal>
      )}

      {showRotations && (() => {
        const team = teams.find(t => t.id === showRotations)
        return (
          <Modal title={`${team?.name} - Rotations`} onClose={() => setShowRotations(null)} wide>
            <div className="space-y-2">
              {BLOCK_TYPES.map(bt => {
                const rot  = rotations[`${showRotations}_${bt}`]
                const info = getRotationInfo(showRotations, bt, rotations)
                const playlist = rot?.playlist || []
                return (
                  <div key={bt} className="rounded-xl overflow-hidden border border-border">
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-border"
                         style={{ background: 'var(--bg)' }}>
                      <BlockTypeTag blockType={bt} size="lg" />
                      <div className="flex items-center gap-3">
                        {info && <span className="text-xs text-muted">{info.visitCount} visits · {info.currentIndex}/{info.playlistLength}</span>}
                        <button onClick={() => resetRotation(showRotations, bt)} className="btn-outline text-xs flex items-center gap-1">
                          <RotateCcw size={10} /> Reset
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-2">
                      {playlist.length === 0
                        ? <p className="text-sm text-muted py-1">No plans in rotation.</p>
                        : (
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {playlist.map((planId, i) => {
                              const plan = plans.find(p => p.id === planId)
                              const isCur = info && (info.visitCount % playlist.length) === i
                              return (
                                <span key={planId}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${isCur ? 'bg-accent-soft text-ink border-accent/40' : 'bg-surface text-muted border-border'}`}>
                                  {i + 1}. {plan?.title || planId}{isCur && ' ←'}
                                </span>
                              )
                            })}
                          </div>
                        )
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </Modal>
        )
      })()}

      {showSchedule && (() => {
        const team = teams.find(t => t.id === showSchedule)
        const schedule = schedules.find(s => s.teamId === showSchedule)
        if (!schedule) return null
        return (
          <Modal title={`${team?.name} - Schedule`} onClose={() => setShowSchedule(null)} wide>
            <div className="space-y-5">
              <div>
                <label className="section-label block mb-2">Practice Days</label>
                <div className="flex gap-2">
                  {DAY_NAMES.map((d, i) => (
                    <button key={i}
                      onClick={() => {
                        const days = schedule.days.includes(i) ? schedule.days.filter(x => x !== i) : [...schedule.days, i].sort()
                        updateSchedule(showSchedule, { days })
                      }}
                      className={`w-10 h-10 rounded-lg text-xs font-semibold border transition-all ${
                        schedule.days.includes(i) ? 'bg-ink text-accent border-ink' : 'bg-surface text-muted border-border hover:border-ink/40 hover:text-ink'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="section-label block mb-1">Start</label>
                  <input type="time" className="neo-input" value={schedule.startTime} onChange={e => updateSchedule(showSchedule, { startTime: e.target.value })} />
                </div>
                <div>
                  <label className="section-label block mb-1">End</label>
                  <input type="time" className="neo-input" value={schedule.endTime} onChange={e => updateSchedule(showSchedule, { endTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="section-label block mb-2">Blocks</label>
                <div className="space-y-2">
                  {schedule.blocks.map((block, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg p-2.5 border border-border" style={{ background: 'var(--bg)' }}>
                      <BlockTypeTag blockType={block.blockType} />
                      <input type="number" className="neo-input w-16 text-center" value={block.durationMins}
                        onChange={e => { const blocks = schedule.blocks.map((b, j) => j === i ? { ...b, durationMins: Number(e.target.value) } : b); updateSchedule(showSchedule, { blocks }) }} />
                      <span className="text-xs text-muted">min</span>
                      <select className="neo-select ml-auto" value={block.gymArea}
                        onChange={e => { const blocks = schedule.blocks.map((b, j) => j === i ? { ...b, gymArea: e.target.value } : b); updateSchedule(showSchedule, { blocks }) }}>
                        {['','Floor','Beam','Bars','Vault','Trampoline','Conditioning'].map(a => <option key={a} value={a}>{a || '- no area -'}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-border">
                <button onClick={() => setShowSchedule(null)} className="btn-dark">Done</button>
              </div>
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}
