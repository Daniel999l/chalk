import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Zap, Clock, MapPin, BookOpen, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import BlockTypeTag from '../components/BlockTypeTag.jsx'
import { AREA_COLORS } from '../data/seed.js'
import { getRotationInfo } from '../lib/rotationEngine.js'

function PracticeBlock({ block, plan, rotInfo, isExpanded, onToggle }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--bg)] transition-colors"
           onClick={onToggle}>
        <BlockTypeTag blockType={block.blockType} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-ink truncate">{block.assignedPlanTitle}</p>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted">
            <span className="flex items-center gap-1"><Clock size={10} /> {block.startTime}–{block.endTime}</span>
            {block.gymArea && <span className="flex items-center gap-1"><MapPin size={10} /> {block.gymArea}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rotInfo && (
            <span className="text-[10px] font-semibold text-muted hidden sm:inline">
              {rotInfo.currentIndex}/{rotInfo.playlistLength}
            </span>
          )}
          {isExpanded ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
        </div>
      </div>
      {isExpanded && plan && (
        <div className="px-4 pb-4 pt-0 border-t border-border">
          <div className="flex items-center justify-between mt-3 mb-2">
            <div className="flex items-center gap-2 text-muted">
              <BookOpen size={13} />
              <span className="font-semibold text-sm text-ink">{plan.title}</span>
            </div>
            <span className="text-xs text-muted">{plan.duration} min</span>
          </div>
          <div className="rounded-lg p-3 text-sm text-muted whitespace-pre-line leading-relaxed"
               style={{ background: 'var(--bg)' }}>
            {plan.content}
          </div>
          {rotInfo && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted">
              <RotateCcw size={11} />
              Visit {rotInfo.visitCount} · Plan {rotInfo.currentIndex}/{rotInfo.playlistLength} · Resets in {rotInfo.nextReset} visit{rotInfo.nextReset !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
      {isExpanded && !plan && (
        <div className="px-4 pb-4 pt-2 border-t border-border text-sm text-muted">
          No lesson plan assigned.
        </div>
      )}
    </div>
  )
}

export default function PracticeDetail() {
  const { teamId, date } = useParams()
  const navigate = useNavigate()
  const { teams, plans, rotations, practices, generatePracticeForDate } = useApp()
  const [expandedBlocks, setExpandedBlocks] = useState({})

  const team    = teams.find(t => t.id === teamId)
  const practice = practices[`${teamId}_${date}`]

  function toggleBlock(i) { setExpandedBlocks(p => ({ ...p, [i]: !p[i] })) }
  function expandAll() {
    const all = {}
    practice?.blocks.forEach((_, i) => { all[i] = true })
    setExpandedBlocks(all)
  }

  if (!team) return (
    <div className="card p-8 text-center">
      <p className="font-semibold text-ink mb-3">Team not found.</p>
      <button onClick={() => navigate(-1)} className="btn-dark">Go Back</button>
    </div>
  )

  if (!practice) return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="btn-outline flex items-center gap-1 text-sm">
        <ArrowLeft size={13} /> Back
      </button>
      <div className="card p-10 text-center">
        <p className="section-label mb-3">Practice not generated</p>
        <p className="font-bold text-2xl text-ink mb-1">{team.name}</p>
        <p className="text-muted text-sm mb-6">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
        <button onClick={() => generatePracticeForDate(teamId, date)} className="btn-accent mx-auto">
          <Zap size={15} /> Generate Practice Plan
        </button>
      </div>
    </div>
  )

  const totalMins = practice.blocks.reduce((s, b) => s + b.durationMins, 0)
  const h = Math.floor(totalMins / 60), m = totalMins % 60

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-outline flex items-center gap-1 text-sm">
        <ArrowLeft size={13} /> Back
      </button>

      {/* Header card */}
      <div className="card overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-border flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: team.color }} />
              <p className="section-label">Practice Plan</p>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink">{team.name}</h1>
            <p className="text-muted text-xs sm:text-sm mt-0.5">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl sm:text-3xl font-bold text-ink">{practice.startTime}</p>
            <p className="text-muted text-sm">– {practice.endTime}</p>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ background: 'var(--bg)' }}>
          {[
            ['Blocks', practice.blocks.length],
            ['Duration', `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm' : ''}`],
            ['Level', team.level],
          ].map(([label, val]) => (
            <div key={label}>
              <span className="section-label block">{label}</span>
              <p className="font-bold text-ink">{val}</p>
            </div>
          ))}
          <div className="ml-auto">
            <button onClick={expandAll} className="btn-outline text-xs">Expand All</button>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-2">
        <h2 className="font-bold text-ink flex items-center gap-2"><Clock size={16} /> Blocks</h2>
        {practice.blocks.map((block, i) => (
          <PracticeBlock key={i} block={block}
            plan={plans.find(p => p.id === block.assignedPlanId)}
            rotInfo={getRotationInfo(teamId, block.blockType, rotations)}
            isExpanded={!!expandedBlocks[i]}
            onToggle={() => toggleBlock(i)} />
        ))}
      </div>

      {/* Rotation status */}
      <div className="card p-5">
        <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <RotateCcw size={15} /> Rotation Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {practice.blocks.map((block, i) => {
            const rotInfo = getRotationInfo(teamId, block.blockType, rotations)
            if (!rotInfo) return null
            return (
              <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg)' }}>
                <BlockTypeTag blockType={block.blockType} />
                <div className="mt-2.5">
                  <div className="flex justify-between text-xs text-muted mb-1.5">
                    <span>{rotInfo.currentIndex}/{rotInfo.playlistLength}</span>
                    <span>{rotInfo.visitCount} visits</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full bg-accent transition-all"
                         style={{ width: `${(rotInfo.currentIndex / rotInfo.playlistLength) * 100}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
