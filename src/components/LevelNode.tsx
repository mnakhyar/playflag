import type { NodeStatus } from '../store/selectors'

type LevelNodeProps = {
  id: number
  title: string
  status: NodeStatus
  statusLabel: string
  onClick: () => void
  index?: number
}

export function LevelNode({
  id,
  title,
  status,
  statusLabel,
  onClick,
  index = 0,
}: LevelNodeProps) {
  const styles =
    status === 'locked'
      ? 'bg-transparent text-muted'
      : 'bg-turf text-chalk'

  const idTone =
    status === 'available'
      ? 'text-flag'
      : status === 'completed'
        ? 'text-line'
        : 'text-muted'

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${index * 55}ms` }}
      className={`stagger-in pressable flex min-h-14 w-full items-center gap-4 rounded-[var(--radius-surface)] px-4 py-3.5 text-left transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${styles}`}
    >
      <span className={`font-display text-2xl font-bold tabular-nums tracking-tight ${idTone}`}>
        {String(id).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold tracking-tight text-balance">{title}</span>
        <span className="text-xs text-muted">{statusLabel}</span>
      </span>
      {status === 'available' && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-flag" aria-hidden />
      )}
    </button>
  )
}
