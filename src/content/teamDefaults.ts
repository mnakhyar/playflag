import { createId } from '../lib/id'
import type { Play, PlayFlagState, RosterPlayer } from '../store/types'

export const DEFAULT_ROSTER: RosterPlayer[] = [
  { id: 'p1', name: 'QB Alex' },
  { id: 'p2', name: 'WR Bella' },
  { id: 'p3', name: 'WR Casey' },
  { id: 'p4', name: 'C Dana' },
  { id: 'p5', name: 'RB Eden' },
]

export function createDefaultPlay(): Play {
  return {
    id: createId('play'),
    name: 'Slant Middle',
    notes: 'QB drop, WR kiri slant ke middle.',
    players: [
      { id: 'p1', x: 0.5, y: 0.72 },
      { id: 'p2', x: 0.22, y: 0.68 },
      { id: 'p3', x: 0.78, y: 0.68 },
      { id: 'p4', x: 0.5, y: 0.78 },
      { id: 'p5', x: 0.38, y: 0.72 },
    ],
    routes: [
      {
        id: createId('route'),
        fromPlayerId: 'p2',
        to: { x: 0.48, y: 0.42 },
      },
    ],
  }
}

export function createEmptyPlay(name = 'Play baru'): Play {
  return {
    id: createId('play'),
    name,
    notes: '',
    players: DEFAULT_ROSTER.map((r, i) => ({
      id: r.id,
      x: 0.2 + i * 0.15,
      y: 0.7,
    })),
    routes: [],
  }
}

export function createInitialState(): PlayFlagState {
  return {
    profile: null,
    progress: {
      completedLevels: [],
      quizScores: {},
      drillLogs: [],
    },
    team: {
      name: 'Tim PlayFlag',
      roster: DEFAULT_ROSTER.map((r) => ({ ...r })),
      plays: [createDefaultPlay()],
    },
  }
}
