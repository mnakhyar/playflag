import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { MAX_ROUTE_POINTS } from '../content/teamDefaults'
import { initials } from '../lib/id'
import type { Play, PlaySide, RosterPlayer } from '../store/types'

const HIT_RADIUS = 28
const HANDLE_RADIUS = 14

type Point = { x: number; y: number }

type PlayCanvasProps = {
  play: Play
  roster: RosterPlayer[]
  mode: 'position' | 'route'
  activeSide: PlaySide
  onChange: (play: Play) => void
  selectedRouteId: string | null
  onSelectRoute: (id: string | null) => void
  routeDraftFrom: string | null
  onRouteDraftFrom: (id: string | null) => void
  draftPoints: Point[]
  onDraftPoints: (points: Point[]) => void
  onCommitDraft: (fromPlayerId: string, points: Point[]) => void
}

export function PlayCanvas({
  play,
  roster,
  mode,
  activeSide,
  onChange,
  selectedRouteId,
  onSelectRoute,
  routeDraftFrom,
  onRouteDraftFrom,
  draftPoints,
  onDraftPoints,
  onCommitDraft,
}: PlayCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 320, h: 420 })
  const draggingPlayer = useRef<string | null>(null)
  const draggingHandle = useRef<{ routeId: string; index: number } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (!cr) return
      const w = Math.max(280, cr.width)
      const h = Math.round(w * 1.3)
      setSize({ w, h })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    canvas.style.width = `${size.w}px`
    canvas.style.height = `${size.h}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawField(ctx, size.w, size.h, {
      play,
      roster,
      activeSide,
      selectedRouteId,
      routeDraftFrom,
      draftPoints,
    })
  }, [
    size,
    play,
    roster,
    activeSide,
    selectedRouteId,
    routeDraftFrom,
    draftPoints,
  ])

  const toNorm = (clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    }
  }

  const hitPlayer = (x: number, y: number, sideOnly: PlaySide | null) => {
    const px = x * size.w
    const py = y * size.h
    let best: { id: string; dist: number } | null = null
    for (const p of play.players) {
      if (sideOnly && p.side !== sideOnly) continue
      const dx = p.x * size.w - px
      const dy = p.y * size.h - py
      const dist = Math.hypot(dx, dy)
      if (dist <= HIT_RADIUS && (!best || dist < best.dist)) {
        best = { id: p.id, dist }
      }
    }
    return best?.id ?? null
  }

  const hitHandle = (x: number, y: number) => {
    if (!selectedRouteId) return null
    const route = play.routes.find((r) => r.id === selectedRouteId)
    if (!route) return null
    const from = play.players.find((p) => p.id === route.fromPlayerId)
    if (!from || from.side !== activeSide) return null
    const px = x * size.w
    const py = y * size.h
    let best: { index: number; dist: number } | null = null
    for (let i = 0; i < route.points.length; i++) {
      const pt = route.points[i]
      const dist = Math.hypot(pt.x * size.w - px, pt.y * size.h - py)
      if (dist <= HANDLE_RADIUS && (!best || dist < best.dist)) {
        best = { index: i, dist }
      }
    }
    return best ? { routeId: route.id, index: best.index } : null
  }

  const playerHasRoute = (playerId: string) =>
    play.routes.some((r) => r.fromPlayerId === playerId)

  const clearDraft = () => {
    onRouteDraftFrom(null)
    onDraftPoints([])
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toNorm(e.clientX, e.clientY)

    if (mode === 'position') {
      const hit = hitPlayer(x, y, activeSide)
      if (hit) {
        draggingPlayer.current = hit
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      }
      return
    }

    // Route mode — prefer handles on selected route
    const handle = hitHandle(x, y)
    if (handle) {
      draggingHandle.current = handle
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      return
    }

    const hit = hitPlayer(x, y, activeSide)
    if (hit) {
      if (hit === routeDraftFrom) return

      if (routeDraftFrom && draftPoints.length > 0) {
        onCommitDraft(routeDraftFrom, draftPoints)
      } else {
        clearDraft()
      }

      if (playerHasRoute(hit)) {
        const existing = play.routes.find((r) => r.fromPlayerId === hit)
        onSelectRoute(existing?.id ?? null)
        onRouteDraftFrom(null)
        onDraftPoints([])
        return
      }

      onSelectRoute(null)
      onRouteDraftFrom(hit)
      onDraftPoints([])
      return
    }

    // Field tap while drafting
    if (routeDraftFrom) {
      if (draftPoints.length >= MAX_ROUTE_POINTS) return
      const next = [...draftPoints, { x, y }]
      if (next.length >= MAX_ROUTE_POINTS) {
        onCommitDraft(routeDraftFrom, next)
        onRouteDraftFrom(null)
        onDraftPoints([])
      } else {
        onDraftPoints(next)
      }
      onSelectRoute(null)
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toNorm(e.clientX, e.clientY)

    if (draggingHandle.current) {
      const { routeId, index } = draggingHandle.current
      onChange({
        ...play,
        routes: play.routes.map((r) => {
          if (r.id !== routeId) return r
          const points = r.points.map((pt, i) =>
            i === index ? { x, y } : pt,
          )
          return { ...r, points }
        }),
      })
      return
    }

    if (mode === 'position' && draggingPlayer.current) {
      onChange({
        ...play,
        players: play.players.map((p) =>
          p.id === draggingPlayer.current ? { ...p, x, y } : p,
        ),
      })
    }
  }

  const onPointerUp = () => {
    draggingPlayer.current = null
    draggingHandle.current = null
  }

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full touch-none rounded-2xl ring-1 ring-line/20"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  )
}

type DrawOpts = {
  play: Play
  roster: RosterPlayer[]
  activeSide: PlaySide
  selectedRouteId: string | null
  routeDraftFrom: string | null
  draftPoints: Point[]
}

function drawField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: DrawOpts,
) {
  const { play, roster, activeSide, selectedRouteId, routeDraftFrom, draftPoints } =
    opts

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#1a5c3a'
  ctx.fillRect(0, 0, w, h)

  const endH = h * 0.12
  ctx.fillStyle = '#123d28'
  ctx.fillRect(0, 0, w, endH)
  ctx.fillRect(0, h - endH, w, endH)

  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, h / 2)
  ctx.lineTo(w, h / 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '12px DM Sans, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('ENDZONE', 12, 18)
  ctx.fillText('ENDZONE', 12, h - 8)
  ctx.fillText('MIDDLE', w / 2 - 24, h / 2 - 6)

  for (const route of play.routes) {
    const from = play.players.find((p) => p.id === route.fromPlayerId)
    if (!from || route.points.length === 0) continue
    const side = from.side
    const active = side === activeSide
    const selected = route.id === selectedRouteId
    drawPolylineRoute(ctx, w, h, from, route.points, {
      side,
      selected,
      alpha: active ? 1 : 0.28,
    })
    if (selected && active) {
      for (const pt of route.points) {
        drawHandle(ctx, pt.x * w, pt.y * h)
      }
    }
  }

  if (routeDraftFrom && draftPoints.length > 0) {
    const from = play.players.find((p) => p.id === routeDraftFrom)
    if (from) {
      drawPolylineRoute(ctx, w, h, from, draftPoints, {
        side: from.side,
        selected: true,
        alpha: 1,
        preview: true,
      })
    }
  }

  for (const p of play.players) {
    const x = p.x * w
    const y = p.y * h
    const active = p.side === activeSide
    const drafting = routeDraftFrom === p.id
    const name =
      p.side === 'defense'
        ? (p.label ?? p.id.toUpperCase())
        : (roster.find((r) => r.id === p.id)?.name ?? p.id)
    const label =
      p.side === 'defense' ? (p.label ?? 'D') : initials(name)

    ctx.globalAlpha = active ? 1 : 0.32
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    if (drafting) {
      ctx.fillStyle = '#ff9f0a'
    } else if (p.side === 'defense') {
      ctx.fillStyle = '#1c2a4a'
    } else {
      ctx.fillStyle = '#0a0a0a'
    }
    ctx.fill()
    ctx.strokeStyle = drafting
      ? '#ffb340'
      : p.side === 'defense'
        ? 'rgba(255, 214, 10, 0.85)'
        : 'rgba(255,255,255,0.55)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = drafting
      ? '#0a0a0a'
      : p.side === 'defense'
        ? 'rgba(255, 230, 140, 0.95)'
        : 'rgba(255,255,255,0.92)'
    ctx.font = 'bold 11px DM Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x, y)
    ctx.globalAlpha = 1
  }
}

function drawPolylineRoute(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  from: { x: number; y: number },
  points: Point[],
  style: {
    side: PlaySide
    selected: boolean
    alpha: number
    preview?: boolean
  },
) {
  const nodes = [
    { x: from.x * w, y: from.y * h },
    ...points.map((p) => ({ x: p.x * w, y: p.y * h })),
  ]
  if (nodes.length < 2) return

  const color = style.selected
    ? '#ff9f0a'
    : style.side === 'defense'
      ? 'rgba(255, 214, 10, 0.9)'
      : 'rgba(255,255,255,0.85)'

  ctx.save()
  ctx.globalAlpha = style.alpha
  ctx.strokeStyle = color
  ctx.lineWidth = style.selected || style.preview ? 2.5 : 1.5
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  if (style.side === 'defense') {
    ctx.setLineDash([7, 5])
  } else {
    ctx.setLineDash([])
  }
  ctx.beginPath()
  ctx.moveTo(nodes[0].x, nodes[0].y)
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x, nodes[i].y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  const last = nodes[nodes.length - 1]
  const prev = nodes[nodes.length - 2]
  drawArrowHead(ctx, prev.x, prev.y, last.x, last.y, color)
  ctx.restore()
}

function drawHandle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.arc(x, y, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#ff9f0a'
  ctx.fill()
  ctx.strokeStyle = '#0a0a0a'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const size = 10
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - size * Math.cos(angle - Math.PI / 6),
    y2 - size * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    x2 - size * Math.cos(angle + Math.PI / 6),
    y2 - size * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fill()
}
