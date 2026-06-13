import { Router } from 'express'
import { Coach } from '../models/index.js'

const r = Router()
r.get('/',       async (req, res) => {
  const q = req.query.teamId ? { teamId: req.query.teamId } : {}
  res.json(await Coach.find(q))
})
r.post('/',      async (req, res) => res.json(await Coach.create(req.body)))
r.put('/:id',    async (req, res) => res.json(await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true })))
r.delete('/:id', async (req, res) => { await Coach.findByIdAndDelete(req.params.id); res.json({ ok: true }) })
export default r
