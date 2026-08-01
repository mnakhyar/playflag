import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { initials } from '../lib/id'
import type { Play, RosterPlayer } from '../store/types'

const HIT_RADIUS = 28

type PlayCanvasProps = {
  play: Play
  roster: RosterPlayer[]
  mode: 'position' | 'route'
  onChange: (play: Play) => void
  selectedRouteId: string | null
  onSelectRoute: (id: string | null) => void
  routeDraftFrom: string | null
  onRouteDraftFrom: (id: string | null) => void
}

export function PlayCanvas({
  play,
  roster,
  mode,
  onChange,
  selectedRouteId,
  onSelectRoute,
  routeDraftFrom,
  onRouteDraftFrom,
}: PlayCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 320, h: 420 })
  const dragging = useRef<string | null>(null)

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
    drawField(ctx, size.w, size.h, play, roster, selectedRouteId, routeDraftFrom)
  }, [size, play, roster, selectedRouteId, routeDraftFrom])

  const toNorm = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    }
  }

  const hitPlayer = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const px = x * size.w
    const py = y * size.h
    let best: { id: string; dist: number } | null = null
    for (const p of play.players) {
      const dx = p.x * size.w - px
      const dy = p.y * size.h - py
      const dist = Math.hypot(dx, dy)
      if (dist <= HIT_RADIUS && (!best || dist < best.dist)) {
        best = { id: p.id, dist }
      }
    }
    return best?.id ?? null
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toNorm(e.clientX, e.clientY)
    const hit = hitPlayer(x, y)
    if (mode === 'position' && hit) {
      dragging.current = hit
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      return
    }
    if (mode === 'route') {
      if (hit) {
        onRouteDraftFrom(hit)
        onSelectRoute(null)
        return
      }
      if (routeDraftFrom) {
        const id = `route_${Math.random().toString(36).slice(2, 8)}`
        onChange({
          ...play,
          routes: [
            ...play.routes,
            { id, fromPlayerId: routeDraftFrom, to: { x, y } },
          ],
        })
        onRouteDraftFrom(null)
      }
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'position' || !dragging.current) return
    const { x, y } = toNorm(e.clientX, e.clientY)
    onChange({
      ...play,
      players: play.players.map((p) =>
        p.id === dragging.current ? { ...p, x, y } : p,
      ),
    })
  }

  const onPointerUp = () => {
    if (dragging.current) {
      dragging.current = null
    }
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

function drawField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  play: Play,
  roster: RosterPlayer[],
  selectedRouteId: string | null,
  routeDraftFrom: string | null,
) {
  ctx.clearRect(0, 0, w, h)
  /* Field green stays on canvas only; UI chrome stays neutral. */
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
  ctx.fillText('ENDZONE', 12, 18)
  ctx.fillText('ENDZONE', 12, h - 8)
  ctx.fillText('MIDDLE', w / 2 - 24, h / 2 - 6)

  for (const route of play.routes) {
    const from = play.players.find((p) => p.id === route.fromPlayerId)
    if (!from) continue
    const x1 = from.x * w
    const y1 = from.y * h
    const x2 = route.to.x * w
    const y2 = route.to.y * h
    ctx.strokeStyle = route.id === selectedRouteId ? '#ff9f0a' : 'rgba(255,255,255,0.85)'
    ctx.lineWidth = route.id === selectedRouteId ? 2.5 : 1.5
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    drawArrowHead(
      ctx,
      x1,
      y1,
      x2,
      y2,
      route.id === selectedRouteId ? '#ff9f0a' : 'rgba(255,255,255,0.85)',
    )
  }

  for (const p of play.players) {
    const x = p.x * w
    const y = p.y * h
    const name = roster.find((r) => r.id === p.id)?.name ?? p.id
    const active = routeDraftFrom === p.id
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.fillStyle = active ? '#ff9f0a' : '#0a0a0a'
    ctx.fill()
    ctx.strokeStyle = active ? '#ffb340' : 'rgba(255,255,255,0.55)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = active ? '#0a0a0a' : 'rgba(255,255,255,0.92)'
    ctx.font = 'bold 11px DM Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initials(name), x, y)
  }
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
