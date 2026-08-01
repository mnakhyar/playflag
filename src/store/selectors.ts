import {
  DEMO_UNLOCK_ALL,
  SKILLS,
  getSkill,
  type SkillBranch,
  type SkillPosition,
} from '../content/skillTree'
import { daysBetween } from '../lib/dates'
import type {
  PlayFlagState,
  Profile,
  SkillCategory,
  SkillMastery,
} from './types'

export function pathPercent(state: PlayFlagState): number {
  if (SKILLS.length === 0) return 0
  const done = SKILLS.filter(
    (s) => state.progress.skillMastery[s.id] === 'done',
  ).length
  return Math.round((done / SKILLS.length) * 100)
}

export function doneSkillCount(state: PlayFlagState): number {
  return Object.values(state.progress.skillMastery).filter((m) => m === 'done')
    .length
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

function branchSkillsDone(
  branch: SkillBranch,
  mastery: Record<string, SkillMastery>,
): boolean {
  const nodes = SKILLS.filter((s) => s.branch === branch && s.position == null)
  return nodes.length > 0 && nodes.every((s) => mastery[s.id] === 'done')
}

function generalDone(mastery: Record<string, SkillMastery>): boolean {
  return branchSkillsDone('general', mastery)
}

/** Demo: never locked. Later: GEN → side → position gates. */
export function skillNodeStatus(
  skillId: string,
  mastery: Record<string, SkillMastery>,
): NodeStatus {
  if (mastery[skillId] === 'done') return 'completed'
  if (DEMO_UNLOCK_ALL) return 'available'

  const skill = getSkill(skillId)
  if (!skill) return 'locked'

  if (skill.branch === 'general') {
    return 'available'
  }

  if (!generalDone(mastery)) return 'locked'

  if (skill.position == null) {
    return 'available'
  }

  const sideDone = branchSkillsDone(skill.branch, mastery)
  if (!sideDone) return 'locked'
  return 'available'
}

export function getMastery(
  skillId: string,
  mastery: Record<string, SkillMastery>,
): SkillMastery {
  return mastery[skillId] ?? 'unseen'
}

export type LearnStep = 'lesson' | 'quiz' | 'drill'

export type LearnTarget = {
  skillId: string
  step: LearnStep
}

const INTERACTIVE_ORDER = ['GEN-01', 'GEN-05', 'GEN-08'] as const

function hasPendingDrill(
  skillId: string,
  mastery: Record<string, SkillMastery>,
  quizScores: PlayFlagState['progress']['quizScores'],
): boolean {
  if (mastery[skillId] === 'done') return false
  return quizScores[skillId] != null
}

export function nextLearnTarget(state: PlayFlagState): LearnTarget | null {
  const { skillMastery, quizScores } = state.progress

  for (const skillId of INTERACTIVE_ORDER) {
    if (skillMastery[skillId] === 'done') continue
    if (hasPendingDrill(skillId, skillMastery, quizScores)) {
      return { skillId, step: 'drill' }
    }
    if (skillNodeStatus(skillId, skillMastery) === 'available') {
      return { skillId, step: 'lesson' }
    }
  }
  return null
}

export function learnPath(target: LearnTarget): string {
  return `/learn/${target.skillId}/${target.step}`
}

export function skillStatusLabel(
  skillId: string,
  status: NodeStatus,
  mastery: Record<string, SkillMastery>,
  quizScores: PlayFlagState['progress']['quizScores'],
): string {
  const level = getMastery(skillId, mastery)
  if (status === 'completed' || level === 'done') return 'Selesai'
  if (level === 'learning') {
    if (hasPendingDrill(skillId, mastery, quizScores)) return 'Lanjutkan drill'
    return 'Sedang dipelajari'
  }
  if (status === 'available') return 'Siap dibuka'
  return 'Terkunci'
}

export function entryStepForSkill(
  skillId: string,
  state: PlayFlagState,
): LearnStep {
  const { skillMastery, quizScores } = state.progress
  if (hasPendingDrill(skillId, skillMastery, quizScores)) return 'drill'
  return 'lesson'
}

export function branchProgress(
  branch: SkillBranch,
  mastery: Record<string, SkillMastery>,
): { done: number; total: number } {
  const nodes = SKILLS.filter((s) => s.branch === branch)
  const done = nodes.filter((s) => mastery[s.id] === 'done').length
  return { done, total: nodes.length }
}

export function positionProgress(
  position: SkillPosition,
  mastery: Record<string, SkillMastery>,
): { done: number; total: number } {
  const nodes = SKILLS.filter((s) => s.position === position)
  const done = nodes.filter((s) => mastery[s.id] === 'done').length
  return { done, total: nodes.length }
}
