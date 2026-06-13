import { BlockRotation, LessonPlan } from '../models/index.js'

/**
 * Get or assign the next lesson plan for a team's block type.
 * Atomically increments visitCount.
 */
export async function getNextPlan(teamId, blockType) {
  const rotation = await BlockRotation.findOne({ teamId, blockType })
  if (!rotation || rotation.playlist.length === 0) return null

  const planId = rotation.playlist[rotation.visitCount % rotation.playlist.length]
  const plan   = await LessonPlan.findById(planId)

  // Advance counter
  await BlockRotation.updateOne({ teamId, blockType }, { $inc: { visitCount: 1 } })

  return plan
}

/**
 * Peek at what the next plan WOULD be without advancing counter.
 */
export async function peekNextPlan(teamId, blockType) {
  const rotation = await BlockRotation.findOne({ teamId, blockType })
  if (!rotation || rotation.playlist.length === 0) return null
  const planId = rotation.playlist[rotation.visitCount % rotation.playlist.length]
  return LessonPlan.findById(planId)
}

/**
 * Get rotation status info.
 */
export async function getRotationInfo(teamId, blockType) {
  const rotation = await BlockRotation.findOne({ teamId, blockType })
  if (!rotation) return null
  const len = rotation.playlist.length
  const idx = rotation.visitCount % (len || 1)
  return {
    currentIndex:   idx + 1,
    playlistLength: len,
    visitCount:     rotation.visitCount,
    nextReset:      len - idx,
  }
}
