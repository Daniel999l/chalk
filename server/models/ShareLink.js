import mongoose from 'mongoose'

// A public, revocable link that exposes ONE team's read-only schedule.
// It references the owner + teamId rather than snapshotting, so the shared
// view always reflects the owner's current data.
const ShareLinkSchema = new mongoose.Schema({
  shareId:     { type: String, required: true, unique: true, index: true },
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId:      { type: String, required: true },
  scope:       { type: String, default: 'calendar' },
  revoked:     { type: Boolean, default: false },
}, { timestamps: true })

export const ShareLink = mongoose.model('ShareLink', ShareLinkSchema)
