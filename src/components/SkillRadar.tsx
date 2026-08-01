import type { SkillCategory } from '../store/types'

type SkillRadarProps = {
  scores: Record<SkillCategory, number>
}

const AXES: SkillCategory[] = ['Rules', 'Movement', 'Strategy']
const SIZE = 200
const CX = SIZE / 2
const CY = SIZE / 2
const R = 78

function point(index: number, value: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXES.length
  const r = (value / 100) * R
  return {
    x: CX + Math.cos(angle) * r,
    y: CY + Math.sin(angle) * r,
  }
}

export function SkillRadar({ scores }: SkillRadarProps) {
  const poly = AXES.map((axis, i) => {
    const p = point(i, scores[axis])
    return `${p.x},${p.y}`
  }).join(' ')

  const grid = [33, 66, 100].map((pct) =>
    AXES.map((_, i) => {
      const p = point(i, pct)
      return `${p.x},${p.y}`
    }).join(' '),
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-48 w-48" aria-label="Radar skill">
        {grid.map((g) => (
          <polygon
            key={g}
            points={g}
            fill="none"
            stroke="rgba(200,230,201,0.25)"
            strokeWidth="1"
          />
        ))}
        {AXES.map((_, i) => {
          const tip = point(i, 100)
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={tip.x}
              y2={tip.y}
              stroke="rgba(200,230,201,0.35)"
              strokeWidth="1"
            />
          )
        })}
        <polygon
          points={poly}
          fill="rgba(255,90,31,0.35)"
          stroke="#ff5a1f"
          strokeWidth="2"
        />
        {AXES.map((axis, i) => {
          const label = point(i, 118)
          return (
            <text
              key={axis}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f4f7f2"
              fontSize="11"
              fontFamily="DM Sans, sans-serif"
            >
              {axis}
            </text>
          )
        })}
      </svg>
      <div className="flex w-full justify-between gap-2 text-xs text-muted">
        {AXES.map((axis) => (
          <span key={axis}>
            {axis} {scores[axis]}%
          </span>
        ))}
      </div>
    </div>
  )
}
