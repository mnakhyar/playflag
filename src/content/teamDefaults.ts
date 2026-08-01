import { createId } from '../lib/id'
import type { Play, PlayerChip, PlayFlagState, Route, RosterPlayer } from '../store/types'

export const MAX_ROUTE_POINTS = 5

export const DEFAULT_ROSTER: RosterPlayer[] = [
  { id: 'p1', name: 'QB Alex' },
  { id: 'p2', name: 'WR Bella' },
  { id: 'p3', name: 'WR Casey' },
  { id: 'p4', name: 'C Dana' },
  { id: 'p5', name: 'RB Eden' },
]

export function createDefaultDefensePlayers(): PlayerChip[] {
  return [
    { id: 'd1', side: 'defense', label: 'D1', x: 0.22, y: 0.28 },
    { id: 'd2', side: 'defense', label: 'D2', x: 0.38, y: 0.24 },
    { id: 'd3', side: 'defense', label: 'D3', x: 0.5, y: 0.3 },
    { id: 'd4', side: 'defense', label: 'D4', x: 0.62, y: 0.24 },
    { id: 'd5', side: 'defense', label: 'D5', x: 0.78, y: 0.28 },
  ]
}

function createDefaultOffensePlayers(): PlayerChip[] {
  return [
    { id: 'p1', side: 'offense', x: 0.5, y: 0.72 },
    { id: 'p2', side: 'offense', x: 0.22, y: 0.68 },
    { id: 'p3', side: 'offense', x: 0.78, y: 0.68 },
    { id: 'p4', side: 'offense', x: 0.5, y: 0.78 },
    { id: 'p5', side: 'offense', x: 0.38, y: 0.72 },
  ]
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5
  return Math.min(1, Math.max(0, n))
}

function normalizePoint(raw: unknown): { x: number; y: number } | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  if (typeof p.x !== 'number' || typeof p.y !== 'number') return null
  return { x: clamp01(p.x), y: clamp01(p.y) }
}

function normalizeRoute(raw: unknown): Route | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || typeof r.fromPlayerId !== 'string') return null

  let points: Array<{ x: number; y: number }> = []
  if (Array.isArray(r.points)) {
    for (const pt of r.points) {
      const n = normalizePoint(pt)
      if (n) points.push(n)
    }
  } else if (r.to) {
    const n = normalizePoint(r.to)
    if (n) points = [n]
  }

  if (points.length === 0) return null
  if (points.length > MAX_ROUTE_POINTS) {
    points = points.slice(0, MAX_ROUTE_POINTS)
  }

  return {
    id: r.id,
    fromPlayerId: r.fromPlayerId,
    points,
  }
}

function normalizePlayer(raw: unknown): PlayerChip | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  if (typeof p.id !== 'string') return null
  if (typeof p.x !== 'number' || typeof p.y !== 'number') return null

  const side =
    p.side === 'defense' || p.side === 'offense'
      ? p.side
      : p.id.startsWith('d')
        ? 'defense'
        : 'offense'

  const chip: PlayerChip = {
    id: p.id,
    side,
    x: clamp01(p.x),
    y: clamp01(p.y),
  }
  if (typeof p.label === 'string' && p.label.trim()) {
    chip.label = p.label.trim()
  } else if (side === 'defense') {
    const match = /^d(\d+)$/i.exec(p.id)
    chip.label = match ? `D${match[1]}` : p.id.toUpperCase()
  }
  return chip
}

/** Migrate legacy play shapes and ensure O+D chips + valid routes. */
export function normalizePlay(raw: unknown): Play | null {
  if (!raw || typeof raw !== 'object') return null
  const play = raw as Record<string, unknown>
  if (typeof play.id !== 'string') return null

  const players: PlayerChip[] = []
  if (Array.isArray(play.players)) {
    for (const p of play.players) {
      const n = normalizePlayer(p)
      if (n) players.push(n)
    }
  }

  const hasDefense = players.some((p) => p.side === 'defense')
  if (!hasDefense) {
    const used = new Set(players.map((p) => p.id))
    for (const d of createDefaultDefensePlayers()) {
      if (!used.has(d.id)) players.push(d)
    }
  }

  const routes: Route[] = []
  const seenFrom = new Set<string>()
  if (Array.isArray(play.routes)) {
    for (const r of play.routes) {
      const n = normalizeRoute(r)
      if (!n) continue
      if (seenFrom.has(n.fromPlayerId)) continue
      if (!players.some((p) => p.id === n.fromPlayerId)) continue
      seenFrom.add(n.fromPlayerId)
      routes.push(n)
    }
  }

  return {
    id: play.id,
    name: typeof play.name === 'string' ? play.name : 'Play',
    notes: typeof play.notes === 'string' ? play.notes : '',
    players,
    routes,
  }
}

export function createDefaultPlay(): Play {
  return {
    id: createId('play'),
    name: 'Slant Middle',
    notes: 'QB drop, WR kiri slant ke middle. DB kiri trail coverage.',
    players: [...createDefaultOffensePlayers(), ...createDefaultDefensePlayers()],
    routes: [
      {
        id: createId('route'),
        fromPlayerId: 'p2',
        points: [
          { x: 0.22, y: 0.56 },
          { x: 0.48, y: 0.42 },
        ],
      },
      {
        id: createId('route'),
        fromPlayerId: 'd1',
        points: [
          { x: 0.28, y: 0.36 },
          { x: 0.42, y: 0.44 },
        ],
      },
      {
        id: createId('route'),
        fromPlayerId: 'd3',
        points: [{ x: 0.5, y: 0.4 }],
      },
    ],
  }
}

export function createEmptyPlay(name = 'Play baru'): Play {
  return {
    id: createId('play'),
    name,
    notes: '',
    players: [
      ...DEFAULT_ROSTER.map((r, i) => ({
        id: r.id,
        side: 'offense' as const,
        x: 0.2 + i * 0.15,
        y: 0.7,
      })),
      ...createDefaultDefensePlayers(),
    ],
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
