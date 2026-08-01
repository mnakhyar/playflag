import { createInitialState, normalizePlay } from '../content/teamDefaults'
import type { Play, PlayFlagState } from './types'

export const STORAGE_KEY = 'playflag:v1'

export type LoadResult = {
  state: PlayFlagState
  recoveredFromCorruptStorage: boolean
  persistDisabled: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function normalizeTeamPlays(rawPlays: unknown): Play[] {
  if (!Array.isArray(rawPlays)) return []
  const plays: Play[] = []
  for (const play of rawPlays) {
    const normalized = normalizePlay(play)
    if (normalized) plays.push(normalized)
  }
  return plays
}

function isValidState(value: unknown): value is PlayFlagState {
  if (!value || typeof value !== 'object') return false
  const v = value as PlayFlagState
  return (
    !!v.progress &&
    Array.isArray(v.progress.completedLevels) &&
    !!v.team &&
    Array.isArray(v.team.roster) &&
    Array.isArray(v.team.plays)
  )
}

export function loadState(): LoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        state: createInitialState(),
        recoveredFromCorruptStorage: false,
        persistDisabled: false,
      }
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isValidState(parsed)) {
      return {
        state: createInitialState(),
        recoveredFromCorruptStorage: true,
        persistDisabled: false,
      }
    }
    if (parsed.team.roster.length !== 5) {
      const initial = createInitialState()
      parsed.team.roster = initial.team.roster
    }
    if (isRecord(parsed.team)) {
      parsed.team.plays = normalizeTeamPlays(parsed.team.plays)
    }
    return {
      state: parsed,
      recoveredFromCorruptStorage: false,
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
