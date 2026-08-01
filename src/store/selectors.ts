import { daysBetween } from '../lib/dates'
import type { PlayFlagState, Profile, SkillCategory } from './types'

export function pathPercent(state: PlayFlagState): number {
  return Math.round((state.progress.completedLevels.length / 8) * 100)
}

export function phase1CompletedCount(state: PlayFlagState): number {
  return state.progress.completedLevels.filter((id) => id >= 1 && id <= 3).length
}

export function touchActivity(
  profile: Profile,
  today: string,
): Pick<Profile, 'streak' | 'lastActiveDate'> {
  if (profile.lastActiveDate === today) {
    return {
      streak: profile.streak,
      lastActiveDate: today,
    }
  }
  const gap = daysBetween(profile.lastActiveDate, today)
  if (gap === 1) {
    return { streak: profile.streak + 1, lastActiveDate: today }
  }
  return { streak: 1, lastActiveDate: today }
}

export function radarScores(state: PlayFlagState): Record<SkillCategory, number> {
  const buckets: Record<SkillCategory, number[]> = {
    Rules: [],
    Movement: [],
    Strategy: [],
  }
  for (const score of Object.values(state.progress.quizScores)) {
    buckets[score.category].push(score.scorePercent)
  }
  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
  return {
    Rules: avg(buckets.Rules),
    Movement: avg(buckets.Movement),
    Strategy: avg(buckets.Strategy),
  }
}

export function hasRadarData(state: PlayFlagState): boolean {
  return Object.keys(state.progress.quizScores).length > 0
}

export type NodeStatus = 'locked' | 'available' | 'completed'

/** Phase 1: levels 4–8 always locked; 1–3 sequential. */
export function nodeStatus(
  levelId: number,
  completedLevels: number[],
): NodeStatus {
  if (levelId >= 4) return 'locked'
  if (completedLevels.includes(levelId)) return 'completed'
  if (levelId === 1) return 'available'
  if (completedLevels.includes(levelId - 1)) return 'available'
  return 'locked'
}

export type LockReason = 'sequential' | 'teaser' | null

export function lockReason(
  levelId: number,
  completedLevels: number[],
): LockReason {
  const status = nodeStatus(levelId, completedLevels)
  if (status !== 'locked') return null
  if (levelId >= 4) return 'teaser'
  return 'sequential'
}

export type LearnStep = 'lesson' | 'quiz' | 'drill'

export type LearnTarget = {
  levelId: number
  step: LearnStep
}

function hasPendingDrill(
  levelId: number,
  completedLevels: number[],
  quizScores: PlayFlagState['progress']['quizScores'],
): boolean {
  if (completedLevels.includes(levelId)) return false
  return quizScores[levelId] != null
}

/** Infer next learn target from quizScores + completedLevels (no extra storage). */
export function nextLearnTarget(state: PlayFlagState): LearnTarget | null {
  const { completedLevels, quizScores } = state.progress

  for (let id = 1; id <= 3; id++) {
    if (completedLevels.includes(id)) continue
    if (hasPendingDrill(id, completedLevels, quizScores)) {
      return { levelId: id, step: 'drill' }
    }
    if (nodeStatus(id, completedLevels) === 'available') {
      return { levelId: id, step: 'lesson' }
    }
  }
  return null
}

export function learnPath(target: LearnTarget): string {
  return `/learn/${target.levelId}/${target.step}`
}

export function levelStatusLabel(
  levelId: number,
  status: NodeStatus,
  completedLevels: number[],
  quizScores: PlayFlagState['progress']['quizScores'],
): string {
  if (status === 'completed') return 'Sudah selesai'
  if (status === 'available') {
    if (hasPendingDrill(levelId, completedLevels, quizScores)) {
      return 'Lanjutkan drill'
    }
    return 'Siap dibuka'
  }
  const reason = lockReason(levelId, completedLevels)
  if (reason === 'teaser') return 'Belum dibuka'
  if (levelId > 1) return `Selesaikan level ${levelId - 1} dulu`
  return 'Terkunci'
}

export function lockTeaserMessage(
  levelId: number,
  completedLevels: number[],
  teaser?: string,
): string {
  const reason = lockReason(levelId, completedLevels)
  if (reason === 'sequential') {
    return `Selesaikan level ${levelId - 1} dulu agar level ini terbuka.`
  }
  return teaser ?? 'Konten ini masuk tahap berikutnya di jalur Road to 2028.'
}

export function entryStepForLevel(
  levelId: number,
  state: PlayFlagState,
): LearnStep {
  const { completedLevels, quizScores } = state.progress
  if (hasPendingDrill(levelId, completedLevels, quizScores)) return 'drill'
  return 'lesson'
}
