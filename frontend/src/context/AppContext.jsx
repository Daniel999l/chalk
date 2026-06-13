import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
  DEFAULT_TEAMS, DEFAULT_COACHES, DEFAULT_LESSON_PLANS,
  DEFAULT_ROTATIONS, DEFAULT_SCHEDULES,
} from '../data/seed.js'
import { generatePractice, attachTimes } from '../lib/rotationEngine.js'
import { api } from '../lib/api.js'

const AppContext = createContext(null)

const SEED = () => ({
  teams:     DEFAULT_TEAMS,
  coaches:   DEFAULT_COACHES,
  plans:     DEFAULT_LESSON_PLANS,
  rotations: DEFAULT_ROTATIONS,
  schedules: DEFAULT_SCHEDULES,
  practices: {},
  gymMap:    {},
})

export function AppProvider({ children }) {
  const [teams,     setTeams]     = useState(DEFAULT_TEAMS)
  const [coaches,   setCoaches]   = useState(DEFAULT_COACHES)
  const [plans,     setPlans]     = useState(DEFAULT_LESSON_PLANS)
  const [rotations, setRotations] = useState(DEFAULT_ROTATIONS)
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES)
  const [practices, setPractices] = useState({})
  const [gymMap,    setGymMap]    = useState({})
  const [toast,     setToast]     = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  const isLoaded = useRef(false)
  const saveTimer = useRef(null)

  // ── Load from API on mount ────────────────────────────────────────────────
  useEffect(() => {
    api.get('/api/user-data')
      .then(data => {
        if (data && data.teams) {
          setTeams(data.teams)
          setCoaches(data.coaches)
          setPlans(data.plans)
          setRotations(data.rotations)
          setSchedules(data.schedules)
          setPractices(data.practices || {})
          setGymMap(data.gymMap || {})
        } else {
          // New user — write seed immediately so next load finds data
          api.put('/api/user-data', SEED()).catch(() => {})
        }
      })
      .catch(() => { /* offline or unauthed — keep defaults */ })
      .finally(() => {
        isLoaded.current = true
        setDataLoading(false)
      })
  }, [])

  // ── Debounced save to API on any state change ─────────────────────────────
  useEffect(() => {
    if (!isLoaded.current) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      api.put('/api/user-data', { teams, coaches, plans, rotations, schedules, practices, gymMap })
        .catch(() => {})
    }, 1500)
    return () => clearTimeout(saveTimer.current)
  }, [teams, coaches, plans, rotations, schedules, practices, gymMap])

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  // ── Clear all data ────────────────────────────────────────────────────────
  const clearAllData = useCallback(async () => {
    isLoaded.current = false
    await api.delete('/api/user-data').catch(() => {})
    const seed = SEED()
    setTeams(seed.teams)
    setCoaches(seed.coaches)
    setPlans(seed.plans)
    setRotations(seed.rotations)
    setSchedules(seed.schedules)
    setPractices({})
    setGymMap({})
    await api.put('/api/user-data', seed).catch(() => {})
    isLoaded.current = true
    showToast('Data cleared and reset to defaults')
  }, [showToast])

  // ── Getters ───────────────────────────────────────────────────────────────
  const getSchedule = useCallback(
    (teamId) => schedules.find(s => s.teamId === teamId) || null,
    [schedules]
  )

  const getPractice = useCallback(
    (teamId, dateStr) => practices[`${teamId}_${dateStr}`] || null,
    [practices]
  )

  const getTeamsForDate = useCallback((dateStr) => {
    const dow = new Date(dateStr).getDay()
    return schedules
      .filter(s => s.days.includes(dow))
      .map(s => teams.find(t => t.id === s.teamId))
      .filter(Boolean)
  }, [schedules, teams])

  // ── Practice generation ───────────────────────────────────────────────────
  const generatePracticeForDate = useCallback((teamId, dateStr) => {
    const key = `${teamId}_${dateStr}`
    if (practices[key]) return practices[key]
    const schedule = schedules.find(s => s.teamId === teamId)
    if (!schedule) return null
    const { generatedBlocks, updatedRotations } = generatePractice(teamId, schedule, rotations, plans)
    const timedBlocks = attachTimes(generatedBlocks, schedule.startTime)
    const instance = {
      id: key,
      teamId,
      date: dateStr,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      blocks: timedBlocks,
      generatedAt: new Date().toISOString(),
    }
    setPractices(prev => ({ ...prev, [key]: instance }))
    setRotations(updatedRotations)
    return instance
  }, [practices, schedules, rotations, plans])

  const generateAllForDate = useCallback((dateStr) => {
    const dow = new Date(dateStr).getDay()
    let count = 0
    schedules.forEach(schedule => {
      if (schedule.days.includes(dow)) {
        const key = `${schedule.teamId}_${dateStr}`
        if (!practices[key]) {
          generatePracticeForDate(schedule.teamId, dateStr)
          count++
        }
      }
    })
    return count
  }, [schedules, practices, generatePracticeForDate])

  // ── CRUD: Teams ───────────────────────────────────────────────────────────
  const addTeam = useCallback((team) => {
    const t = { ...team, id: `t${Date.now()}` }
    setTeams(prev => [...prev, t])
    showToast(`Team "${team.name}" created`)
    return t
  }, [showToast])

  const updateTeam = useCallback((id, data) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    showToast('Team updated')
  }, [showToast])

  const deleteTeam = useCallback((id) => {
    setTeams(prev => prev.filter(t => t.id !== id))
    showToast('Team deleted')
  }, [showToast])

  // ── CRUD: Coaches ─────────────────────────────────────────────────────────
  const addCoach = useCallback((coach) => {
    const c = { ...coach, id: `c${Date.now()}` }
    setCoaches(prev => [...prev, c])
    showToast(`Coach "${coach.name}" added`)
    return c
  }, [showToast])

  const updateCoach = useCallback((id, data) => {
    setCoaches(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }, [])

  const deleteCoach = useCallback((id) => {
    setCoaches(prev => prev.filter(c => c.id !== id))
    showToast('Coach removed')
  }, [showToast])

  // ── CRUD: Lesson Plans ────────────────────────────────────────────────────
  const addPlan = useCallback((plan) => {
    const p = { ...plan, id: `lp${Date.now()}` }
    setPlans(prev => [...prev, p])
    showToast(`"${plan.title}" added to library`)
    return p
  }, [showToast])

  const updatePlan = useCallback((id, data) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    showToast('Plan updated')
  }, [showToast])

  const deletePlan = useCallback((id) => {
    setPlans(prev => prev.filter(p => p.id !== id))
    showToast('Plan removed')
  }, [showToast])

  // ── Rotations ─────────────────────────────────────────────────────────────
  const addPlanToRotation = useCallback((teamId, blockType, planId) => {
    const key = `${teamId}_${blockType}`
    setRotations(prev => {
      const existing = prev[key] || { playlist: [], visitCount: 0 }
      if (existing.playlist.includes(planId)) return prev
      return { ...prev, [key]: { ...existing, playlist: [...existing.playlist, planId] } }
    })
    showToast('Plan added to rotation')
  }, [showToast])

  const resetRotation = useCallback((teamId, blockType) => {
    const key = `${teamId}_${blockType}`
    setRotations(prev => ({ ...prev, [key]: { ...prev[key], visitCount: 0 } }))
    showToast('Rotation reset')
  }, [showToast])

  // ── Gym Map ───────────────────────────────────────────────────────────────
  const saveGymMapSlot = useCallback((dateStr, coachId, slot) => {
    setGymMap(prev => {
      const day = prev[dateStr] || {}
      const slots = (day[coachId] || []).filter(s => s.slotId !== slot.slotId)
      return { ...prev, [dateStr]: { ...day, [coachId]: [...slots, slot] } }
    })
  }, [])

  const clearGymMapSlot = useCallback((dateStr, coachId, slotId) => {
    setGymMap(prev => {
      const day = prev[dateStr] || {}
      const slots = (day[coachId] || []).filter(s => s.slotId !== slotId)
      return { ...prev, [dateStr]: { ...day, [coachId]: slots } }
    })
  }, [])

  const getGymMapForDate = useCallback((dateStr) => gymMap[dateStr] || {}, [gymMap])

  // ── Schedule ──────────────────────────────────────────────────────────────
  const updateSchedule = useCallback((teamId, data) => {
    setSchedules(prev => prev.map(s => s.teamId === teamId ? { ...s, ...data } : s))
    showToast('Schedule updated')
  }, [showToast])

  return (
    <AppContext.Provider value={{
      teams, coaches, plans, rotations, schedules, practices, gymMap, toast, dataLoading,
      getSchedule, getPractice, getTeamsForDate, getGymMapForDate,
      generatePracticeForDate, generateAllForDate,
      addTeam, updateTeam, deleteTeam,
      addCoach, updateCoach, deleteCoach,
      addPlan, updatePlan, deletePlan,
      addPlanToRotation, resetRotation,
      saveGymMapSlot, clearGymMapSlot,
      updateSchedule,
      showToast, clearAllData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
