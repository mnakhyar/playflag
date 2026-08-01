import { createInitialState, normalizePlay } from '../content/teamDefaults'
import { LEGACY_LEVEL_TO_SKILL } from '../content/skillTree'
import type { Play, PlayFlagState, SkillMastery } from './types'

export const STORAGE_KEY = 'playflag:v2'
const LEGACY_STORAGE_KEY = 'playflag:v1'

export type LoadResult = {
  state: PlayFlagState
  recoveredFromCorruptStorage: boolean
  persistDisabled: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function migrateLegacyState(raw: unknown): PlayFlagState | null {
  if (!isRecord(raw) || !isRecord(raw.progress) || !isRecord(raw.team)) {
    return null
  }
  const progress = raw.progress
  const completedLevels = Array.isArray(progress.completedLevels)
    ? (progress.completedLevels as number[])
    : []
  const skillMastery: Record<string, SkillMastery> = {
    ...(isRecord(progress.skillMastery)
      ? (progress.skillMastery as Record<string, SkillMastery>)
      : {}),
  }
  for (const levelId of completedLevels) {
    const skillId = LEGACY_LEVEL_TO_SKILL[levelId]
    if (skillId) skillMastery[skillId] = 'done'
  }

  const quizScores: PlayFlagState['progress']['quizScores'] = {}
  if (isRecord(progress.quizScores)) {
    for (const [key, value] of Object.entries(progress.quizScores)) {
      if (!isRecord(value)) continue
      const skillId = LEGACY_LEVEL_TO_SKILL[Number(key)] ?? key
      quizScores[skillId] = {
        category: value.category as PlayFlagState['progress']['quizScores'][string]['category'],
        scorePercent: Number(value.scorePercent) || 0,
      }
    }
  }

  const drillLogs: PlayFlagState['progress']['drillLogs'] = []
  if (Array.isArray(progress.drillLogs)) {
    for (const log of progress.drillLogs) {
      if (!isRecord(log)) continue
      const skillId =
        typeof log.skillId === 'string'
          ? log.skillId
          : LEGACY_LEVEL_TO_SKILL[Number(log.levelId)]
      if (!skillId) continue
      drillLogs.push({
        skillId,
        targetReps: Number(log.targetReps) || 0,
        achievedReps: Number(log.achievedReps) || 0,
        durationSec: Number(log.durationSec) || 0,
        at: typeof log.at === 'string' ? log.at : new Date().toISOString(),
      })
    }
  }

  const team = raw.team
  if (!Array.isArray(team.roster) || !Array.isArray(team.plays)) return null

  const plays: Play[] = []
  for (const play of team.plays) {
    const normalized = normalizePlay(play)
    if (normalized) plays.push(normalized)
  }

  return {
    profile: (raw.profile as PlayFlagState['profile']) ?? null,
    progress: {
      completedLevels,
      skillMastery,
      quizScores,
      drillLogs,
    },
    team: {
      name: typeof team.name === 'string' ? team.name : 'Tim PlayFlag',
      roster: team.roster as PlayFlagState['team']['roster'],
      plays,
    },
  }
}

function isValidState(value: unknown): value is PlayFlagState {
  if (!isRecord(value) || !isRecord(value.progress) || !isRecord(value.team)) {
    return false
  }
  const progress = value.progress
  return (
    Array.isArray(progress.completedLevels) &&
    isRecord(progress.skillMastery) &&
    isRecord(progress.quizScores) &&
    Array.isArray(progress.drillLogs) &&
    Array.isArray(value.team.roster) &&
    Array.isArray(value.team.plays)
  )
}

export function loadState(): LoadResult {
  try {
    const tryLoad = (raw: string | null): PlayFlagState | null => {
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      const migrated = migrateLegacyState(parsed)
      if (!migrated || !isValidState(migrated)) return null
      if (migrated.team.roster.length !== 5) {
        const initial = createInitialState()
        migrated.team.roster = initial.team.roster
      }
      return migrated
    }

    const fromV2 = tryLoad(localStorage.getItem(STORAGE_KEY))
    if (fromV2) {
      return {
        state: fromV2,
        recoveredFromCorruptStorage: false,
        persistDisabled: false,
      }
    }

    const fromV1 = tryLoad(localStorage.getItem(LEGACY_STORAGE_KEY))
    if (fromV1) {
      saveState(fromV1)
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return {
        state: fromV1,
        recoveredFromCorruptStorage: !!localStorage.getItem(STORAGE_KEY),
        persistDisabled: false,
      }
    }

    const hadAny =
      localStorage.getItem(STORAGE_KEY) != null ||
      localStorage.getItem(LEGACY_STORAGE_KEY) != null

    return {
      state: createInitialState(),
      recoveredFromCorruptStorage: hadAny,
      persistDisabled: false,
    }
  } catch (err) {
    console.warn('PlayFlag: failed to load storage', err)
    const persistDisabled =
      err instanceof DOMException &&
      (err.name === 'SecurityError' || err.name === 'QuotaExceededError')
    return {
      state: createInitialState(),
      recoveredFromCorruptStorage: true,
      persistDisabled,
    }
  }
}

export function saveState(state: PlayFlagState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (err) {
    console.warn('PlayFlag: progres tidak tersimpan', err)
    return false
  }
}
