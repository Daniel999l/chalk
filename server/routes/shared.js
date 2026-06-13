import { Router } from 'express'
import crypto from 'node:crypto'
import { ShareLink } from '../models/ShareLink.js'
import { UserData } from '../models/UserData.js'
import { User } from '../models/User.js'
import requireAuth from '../middleware/requireAuth.js'
import { extractTeamSlice, importSlice, emptyPayload } from '../lib/shareSlice.js'

const router = Router()

const genId = () => crypto.randomBytes(8).toString('base64url')

// ── List my active share links ────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const links = await ShareLink
      .find({ ownerUserId: req.user._id, revoked: false })
      .select('shareId teamId scope createdAt')
      .sort({ createdAt: -1 })
    res.json(links)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Create (or reuse) a share link for one of my teams ──────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const { teamId, scope = 'calendar' } = req.body || {}
    if (!teamId) return res.status(400).json({ error: 'teamId required' })

    const doc  = await UserData.findOne({ userId: req.user._id })
    const team = doc?.payload?.teams?.find(t => t.id === teamId)
    if (!team) return res.status(404).json({ error: 'Team not found' })

    // Reuse an existing active link so we don't mint a new one every click.
    let link = await ShareLink.findOne({ ownerUserId: req.user._id, teamId, revoked: false })
    if (!link) {
      link = await ShareLink.create({ shareId: genId(), ownerUserId: req.user._id, teamId, scope })
    }
    res.json({ shareId: link.shareId, teamName: team.name })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Public read-only view of a shared team (NO auth) ───────────────────────────
router.get('/:shareId', async (req, res) => {
  try {
    const link = await ShareLink.findOne({ shareId: req.params.shareId, revoked: false })
    if (!link) return res.status(404).json({ error: 'Share not found' })

    const doc   = await UserData.findOne({ userId: link.ownerUserId })
    const slice = extractTeamSlice(doc?.payload, link.teamId)
    if (!slice) return res.status(404).json({ error: 'This team is no longer available' })

    const owner = await User.findById(link.ownerUserId).select('name')
    res.json({ ...slice, scope: link.scope, ownerName: owner?.name || 'A coach' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Import a shared team into my own account ────────────────────────────────────
router.post('/:shareId/import', requireAuth, async (req, res) => {
  try {
    const link = await ShareLink.findOne({ shareId: req.params.shareId, revoked: false })
    if (!link) return res.status(404).json({ error: 'Share not found' })

    const ownerDoc = await UserData.findOne({ userId: link.ownerUserId })
    const slice    = extractTeamSlice(ownerDoc?.payload, link.teamId)
    if (!slice) return res.status(404).json({ error: 'This team is no longer available' })

    const myDoc = await UserData.findOne({ userId: req.user._id })
    const base  = myDoc?.payload?.teams ? myDoc.payload : emptyPayload()
    const { payload, teamName } = importSlice(base, slice)

    await UserData.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { payload, updatedAt: new Date() } },
      { upsert: true, new: true }
    )
    res.json({ ok: true, teamName })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Revoke a link I own ─────────────────────────────────────────────────────────
router.delete('/:shareId', requireAuth, async (req, res) => {
  try {
    await ShareLink.updateOne(
      { shareId: req.params.shareId, ownerUserId: req.user._id },
      { $set: { revoked: true } }
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
