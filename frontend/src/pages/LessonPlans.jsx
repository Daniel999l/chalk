import { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen, Search } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import BlockTypeTag from '../components/BlockTypeTag.jsx'
import Modal from '../components/Modal.jsx'
import { BLOCK_TYPES } from '../data/seed.js'

function PlanCard({ plan, teams, rotations, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const activeTeams = teams.filter(team => {
    const rot = rotations[`${team.id}_${plan.blockType}`]
    return rot?.playlist.includes(plan.id)
  })

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <BlockTypeTag blockType={plan.blockType} />
            {plan.duration && <span className="text-xs text-muted">{plan.duration} min</span>}
          </div>
          <p className="font-semibold text-sm text-ink">{plan.title}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(plan)} className="btn-outline p-1.5"><Pencil size={11} /></button>
          <button onClick={() => onDelete(plan.id)} className="btn-outline p-1.5 hover:text-red-500 hover:border-red-200"><Trash2 size={11} /></button>
        </div>
      </div>
      {activeTeams.length > 0 && (
        <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 flex-wrap"
             style={{ background: 'var(--bg)' }}>
          <span className="text-[10px] font-semibold text-muted">IN ROTATION:</span>
          {activeTeams.map(t => (
            <span key={t.id} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: t.color + '20', color: t.color }}>{t.name}</span>
          ))}
        </div>
      )}
      <div className="px-4 py-3">
        <div className={`text-sm text-muted whitespace-pre-line overflow-hidden cursor-pointer ${expanded ? '' : 'line-clamp-3'}`}
             onClick={() => setExpanded(e => !e)}>
          {plan.content}
        </div>
        {plan.content?.split('\n').length > 3 && (
          <button onClick={() => setExpanded(e => !e)}
            className="text-xs font-semibold text-muted mt-1.5 hover:text-ink">
            {expanded ? 'Less ↑' : 'More ↓'}
          </button>
        )}
      </div>
    </div>
  )
}

function PlanForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    blockType: initial?.blockType || 'Warm Up',
    duration: initial?.duration || 15,
    content: initial?.content || '',
  })
  return (
    <div className="space-y-4">
      <div>
        <label className="section-label block mb-1">Title</label>
        <input className="neo-input" value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. WU1 - Dynamic Run" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="section-label block mb-1">Block Type</label>
          <select className="neo-select" value={form.blockType}
            onChange={e => setForm(p => ({ ...p, blockType: e.target.value }))}>
            {BLOCK_TYPES.map(bt => <option key={bt}>{bt}</option>)}
          </select>
        </div>
        <div>
          <label className="section-label block mb-1">Duration (min)</label>
          <input type="number" className="neo-input" value={form.duration}
            onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
        </div>
      </div>
      <div>
        <label className="section-label block mb-1">Content</label>
        <textarea className="neo-input min-h-[140px] resize-y" value={form.content}
          onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          placeholder="List each drill on its own line…" />
      </div>
      <div className="flex gap-2 justify-end pt-3 border-t border-border">
        <button onClick={onCancel} className="btn-outline">Cancel</button>
        <button onClick={() => form.title.trim() && onSave(form)} className="btn-dark">Save Plan</button>
      </div>
    </div>
  )
}

export default function LessonPlans() {
  const { plans, teams, rotations, addPlan, updatePlan, deletePlan } = useApp()
  const [search, setSearch] = useState('')
  const [filterBlock, setFilterBlock] = useState('All')
  const [editingPlan, setEditingPlan] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = plans.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterBlock === 'All' || p.blockType === filterBlock)
  )
  const grouped = BLOCK_TYPES.map(bt => ({ bt, plans: filtered.filter(p => p.blockType === bt) })).filter(g => g.plans.length > 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Lesson Plans</h1>
          <p className="text-sm text-muted mt-0.5">{plans.length} plans</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-dark flex items-center gap-2">
          <Plus size={14} /> Add Plan
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="neo-input pl-8" placeholder="Search plans…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', ...BLOCK_TYPES].map(bt => (
            <button key={bt} onClick={() => setFilterBlock(bt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                filterBlock === bt ? 'bg-ink text-surface border-ink' : 'bg-surface text-muted border-border hover:border-ink/30 hover:text-ink'
              }`}>
              {bt}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation overview */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-ink text-sm">Rotation Playlists</h2>
          <span className="text-xs text-muted">Visit-count based</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {teams.map(team =>
            BLOCK_TYPES.map(bt => {
              const rot = rotations[`${team.id}_${bt}`] || { playlist: [], visitCount: 0 }
              return (
                <div key={`${team.id}_${bt}`} className="rounded-lg p-3" style={{ background: 'var(--bg)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ background: team.color + '20', color: team.color }}>{team.name}</span>
                    <BlockTypeTag blockType={bt} />
                  </div>
                  <p className="text-xs text-muted">{rot.playlist.length} plans · #{rot.visitCount}</p>
                </div>
              )
            })
          )}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="card p-10 text-center">
          <BookOpen size={28} className="mx-auto mb-3 text-muted opacity-40" />
          <p className="font-semibold text-ink mb-1">No plans found</p>
          <p className="text-muted text-sm">Try a different filter or add a new plan.</p>
        </div>
      ) : (
        grouped.map(({ bt, plans: bPlans }) => (
          <div key={bt}>
            <div className="flex items-center gap-3 mb-3">
              <BlockTypeTag blockType={bt} size="lg" />
              <span className="text-sm text-muted">{bPlans.length} plan{bPlans.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {bPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} teams={teams} rotations={rotations}
                  onEdit={setEditingPlan} onDelete={id => { if (window.confirm('Remove this plan?')) deletePlan(id) }} />
              ))}
            </div>
          </div>
        ))
      )}

      {showAdd && (
        <Modal title="New Lesson Plan" onClose={() => setShowAdd(false)}>
          <PlanForm onSave={data => { addPlan(data); setShowAdd(false) }} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {editingPlan && (
        <Modal title="Edit Plan" onClose={() => setEditingPlan(null)}>
          <PlanForm initial={editingPlan}
            onSave={data => { updatePlan(editingPlan.id, data); setEditingPlan(null) }}
            onCancel={() => setEditingPlan(null)} />
        </Modal>
      )}
    </div>
  )
}
