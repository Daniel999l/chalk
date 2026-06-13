// routes/teams.js
import { Router } from 'express'
import { Team } from '../models/index.js'

const r = Router()
r.get('/',        async (_req, res) => res.json(await Team.find()))
r.post('/',       async (req, res) => res.json(await Team.create(req.body)))
r.put('/:id',     async (req, res) => res.json(await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })))
r.delete('/:id',  async (req, res) => { await Team.findByIdAndDelete(req.params.id); res.json({ ok: true }) })
export default r
