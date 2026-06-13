import { Router } from 'express'
import { LessonPlan } from '../models/index.js'

const r = Router()
r.get('/',       async (req, res) => {
  const q = req.query.blockType ? { blockType: req.query.blockType } : {}
  res.json(await LessonPlan.find(q))
})
r.post('/',      async (req, res) => res.json(await LessonPlan.create(req.body)))
r.put('/:id',    async (req, res) => res.json(await LessonPlan.findByIdAndUpdate(req.params.id, req.body, { new: true })))
r.delete('/:id', async (req, res) => { await LessonPlan.findByIdAndDelete(req.params.id); res.json({ ok: true }) })
export default r
