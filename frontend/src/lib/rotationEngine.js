/**
 * Chalk Rotation Engine
 *
 * Assigns lesson plans based on how many times a block type
 * has been visited by a team, NOT by calendar date.
 *
 * planIndex = visitCount % playlistLength
 * Counters advance only when a practice is "generated" for a new date.
 */

/**
 * Get the assigned lesson plan for a team+blockType WITHOUT advancing counter.
 */
export function peekNextPlan(teamId, blockType, rotations, lessonPlans) {
  const key = `${teamId}_${blockType}`
  const rotation = rotations[key]
  if (!rotation || rotation.playlist.length === 0) return null

  const playlist = rotation.playlist
  const visitCount = rotation.visitCount
  const planId = playlist[visitCount % playlist.length]
  return lessonPlans.find(lp => lp.id === planId) || null
}

/**
 * Generate a full practice for a team on a given date.
 * Advances rotation counters for each block.
 * Returns { generatedBlocks, updatedRotations }
 */
export function generatePractice(teamId, schedule, rotations, lessonPlans) {
  const updatedRotations = { ...rotations }
  const blocks = schedule.blocks.filter(b => b.durationMins > 0)

  const generatedBlocks = blocks.map(block => {
    const { blockType, durationMins, gymArea } = block
    const key = `${teamId}_${blockType}`
    const rotation = updatedRotations[key]

    let assignedPlan = null
    if (rotation && rotation.playlist.length > 0) {
      const planId = rotation.playlist[rotation.visitCount % rotation.playlist.length]
      assignedPlan = lessonPlans.find(lp => lp.id === planId) || null
      updatedRotations[key] = {
        ...rotation,
        visitCount: rotation.visitCount + 1,
      }
    }

    return {
      blockType,
      durationMins,
      gymArea,
      assignedPlanId: assignedPlan?.id || null,
      assignedPlanTitle: assignedPlan?.title || 'No plan assigned',
    }
  })

  return { generatedBlocks, updatedRotations }
}

/**
 * Add start/end times to generated blocks based on practice startTime.
 */
export function attachTimes(generatedBlocks, startTime) {
  const [startH, startM] = startTime.split(':').map(Number)
  let cursor = startH * 60 + startM

  return generatedBlocks.map(block => {
    const start = minutesToTime(cursor)
    cursor += block.durationMins
    const end = minutesToTime(cursor)
    return { ...block, startTime: start, endTime: end }
  })
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Get rotation progress info for display.
 * Returns { currentIndex, playlistLength, nextReset }
 */
export function getRotationInfo(teamId, blockType, rotations) {
  const key = `${teamId}_${blockType}`
  const rotation = rotations[key]
  if (!rotation) return null
  const len = rotation.playlist.length
  const idx = rotation.visitCount % len
  return {
    currentIndex: idx + 1,
    playlistLength: len,
    visitCount: rotation.visitCount,
    nextReset: len - idx,
  }
}
