import { Router } from 'express'
import { UserData } from '../models/UserData.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const doc = await UserData.findOne({ userId: req.user._id })
    if (!doc) return res.status(404).json({ error: 'No data' })
    res.json(doc.payload)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/', async (req, res) => {
  try {
    await UserData.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { payload: req.body, updatedAt: new Date() } },
      { upsert: true, new: true }
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/', async (req, res) => {
  try {
    await UserData.deleteOne({ userId: req.user._id })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
