import { Router } from 'express'
import { GymSchedule } from '../models/index.js'

const r = Router()
r.get('/', async (req, res) => {
  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'date required' })
  const schedules = await GymSchedule.find({ date })
  const result = {}
  schedules.forEach(s => { result[s.coachId] = s.slots })
  res.json(result)
})

r.post('/', async (req, res) => {
  const { date, coachId, slot } = req.body
  const schedule = await GymSchedule.findOneAndUpdate(
    { date, coachId },
    { $pull: { slots: { slotId: slot.slotId } } },
    { new: true, upsert: true }
  )
  await GymSchedule.updateOne(
    { date, coachId },
    { $push: { slots: slot } }
  )
  res.json({ ok: true })
})

r.delete('/', async (req, res) => {
  const { date, coachId, slotId } = req.body
  await GymSchedule.updateOne({ date, coachId }, { $pull: { slots: { slotId } } })
  res.json({ ok: true })
})

export default r
