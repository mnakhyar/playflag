import { daysBetween } from '../lib/dates'
import type { PlayFlagState, Profile, SkillCategory } from './types'

export function pathPercent(state: PlayFlagState): number {
  return Math.round((state.progress.completedLevels.length / 8) * 100)
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
