import { Router } from 'express'
import { PracticeInstance, PracticeSchedule } from '../models/index.js'
import { getNextPlan } from '../services/rotationEngine.js'

const r = Router()

// Get practice for a team on a date
r.get('/', async (req, res) => {
  const { teamId, date } = req.query
  if (!teamId || !date) return res.json(await PracticeInstance.find())
  const practice = await PracticeInstance.findOne({ teamId, date })
  res.json(practice || null)
})

r.get('/:id', async (req, res) => {
  res.json(await PracticeInstance.findById(req.params.id))
})

// Generate a practice for a team on a date
r.post('/generate', async (req, res) => {
  const { teamId, date } = req.body
  if (!teamId || !date) return res.status(400).json({ error: 'teamId and date required' })

  const existing = await PracticeInstance.findOne({ teamId, date })
  if (existing) return res.json(existing)

  const schedule = await PracticeSchedule.findOne({ teamId })
  if (!schedule) return res.status(404).json({ error: 'No schedule for team' })

  const blocks = schedule.blocks.filter(b => b.durationMins > 0)
  let cursor = timeToMins(schedule.startTime)

  const generatedBlocks = []
  for (const block of blocks) {
    const plan = await getNextPlan(teamId, block.blockType)
    const start = minsToTime(cursor)
    cursor += block.durationMins
    const end = minsToTime(cursor)
    generatedBlocks.push({
      blockType:         block.blockType,
      durationMins:      block.durationMins,
      gymArea:           block.gymArea,
      assignedPlanId:    plan?._id?.toString() || null,
      assignedPlanTitle: plan?.title || 'No plan assigned',
      startTime: start,
      endTime:   end,
    })
  }

  const instance = await PracticeInstance.create({
    teamId, date,
    startTime: schedule.startTime,
    endTime:   schedule.endTime,
    blocks: generatedBlocks,
  })
  res.json(instance)
})

function timeToMins(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
function minsToTime(m) {
  return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`
}

export default r
