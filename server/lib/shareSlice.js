import crypto from 'node:crypto'

// Team ids look like "t1"/"t<ts>" (no underscores), so a rotation/practice key
// "<teamId>_<blockType>" can be matched with a "<teamId>_" prefix safely.
const keyMatchesTeam = (key, teamId) => key.startsWith(teamId + '_')

const rid = (prefix) => `${prefix}${crypto.randomBytes(6).toString('hex')}`

export const emptyPayload = () => ({
  teams: [], coaches: [], plans: [], rotations: {}, schedules: [], practices: {}, gymMap: {},
})

/**
 * Pull just one team's shareable data out of a user's full payload.
 * Returns null if the team no longer exists.
 */
export function extractTeamSlice(payload, teamId) {
  const p = payload || {}
  const team = (p.teams || []).find(t => t.id === teamId)
  if (!team) return null

  const coaches  = (p.coaches || []).filter(c => c.teamId === teamId)
  const schedule = (p.schedules || []).find(s => s.teamId === teamId) || null

  const rotations = {}
  for (const [k, v] of Object.entries(p.rotations || {})) {
    if (keyMatchesTeam(k, teamId)) rotations[k] = v
  }

  const planIds = new Set()
  Object.values(rotations).forEach(r => (r.playlist || []).forEach(id => planIds.add(id)))

  const practices = {}
  for (const [k, v] of Object.entries(p.practices || {})) {
    if (v && v.teamId === teamId) {
      practices[k] = v
      ;(v.blocks || []).forEach(b => { if (b.assignedPlanId) planIds.add(b.assignedPlanId) })
    }
  }

  const plans = (p.plans || []).filter(pl => planIds.has(pl.id))

  return { team, coaches, schedule, rotations, plans, practices }
}

/**
 * Merge an extracted slice into an importer's payload, re-id'ing everything
 * so it can't collide with what they already have. Returns the new payload.
 */
export function importSlice(payload, slice) {
  const p = {
    teams:     [...(payload.teams || [])],
    coaches:   [...(payload.coaches || [])],
    plans:     [...(payload.plans || [])],
    rotations: { ...(payload.rotations || {}) },
    schedules: [...(payload.schedules || [])],
    practices: { ...(payload.practices || {}) },
    gymMap:    { ...(payload.gymMap || {}) },
  }

  const newTeamId = rid('t')
  const teamName  = `${slice.team.name} (imported)`
  p.teams.push({ ...slice.team, id: newTeamId, name: teamName })

  slice.coaches.forEach(c => {
    p.coaches.push({ ...c, id: rid('c'), teamId: newTeamId })
  })

  // Remap plan ids so rotations/practices can point at the imported copies.
  const planIdMap = {}
  slice.plans.forEach(pl => {
    const nid = rid('lp')
    planIdMap[pl.id] = nid
    p.plans.push({ ...pl, id: nid })
  })

  if (slice.schedule) {
    p.schedules.push({ ...slice.schedule, id: rid('s'), teamId: newTeamId })
  }

  for (const [k, r] of Object.entries(slice.rotations || {})) {
    const blockType = k.slice(k.indexOf('_') + 1)
    p.rotations[`${newTeamId}_${blockType}`] = {
      ...r,
      playlist: (r.playlist || []).map(id => planIdMap[id] || id),
    }
  }

  Object.values(slice.practices || {}).forEach(prac => {
    const newKey = `${newTeamId}_${prac.date}`
    p.practices[newKey] = {
      ...prac,
      id: newKey,
      teamId: newTeamId,
      blocks: (prac.blocks || []).map(b => ({
        ...b,
        assignedPlanId: b.assignedPlanId ? (planIdMap[b.assignedPlanId] || b.assignedPlanId) : b.assignedPlanId,
      })),
    }
  })

  return { payload: p, newTeamId, teamName }
}
