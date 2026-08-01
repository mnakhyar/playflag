import type { SkillMastery } from '../store/types'
import type { NodeStatus } from '../store/selectors'

type SkillNodeCardProps = {
  id: string
  title: string
  status: NodeStatus
  statusLabel: string
  mastery: SkillMastery
  badge?: string
  onClick: () => void
  index?: number
}

const masteryMark: Record<SkillMastery, string> = {
  unseen: '○',
  learning: '◔',
  done: '●',
}

export function SkillNodeCard({
  id,
  title,
  status,
  statusLabel,
  mastery,
  badge,
  onClick,
  index = 0,
}: SkillNodeCardProps) {
  const styles =
    status === 'locked'
      ? 'bg-transparent text-muted'
      : mastery === 'done'
        ? 'bg-turf text-chalk'
        : 'bg-turf text-chalk'

  const idTone =
    status === 'available' && mastery !== 'done'
      ? 'text-flag'
      : mastery === 'done'
        ? 'text-line'
        : 'text-muted'

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${index * 40}ms` }}
      className={`stagger-in pressable flex min-h-14 w-full items-center gap-3 rounded-[var(--radius-surface)] px-4 py-3.5 text-left transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${styles}`}
    >
      <span
        className={`font-display w-8 shrink-0 text-center text-lg font-bold ${idTone}`}
        aria-hidden
      >
        {masteryMark[mastery]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {id}
          {badge ? ` · ${badge}` : ''}
        </span>
        <span className="block font-semibold tracking-tight text-balance">{title}</span>
        <span className="text-xs text-muted">{statusLabel}</span>
      </span>
      {status === 'available' && mastery !== 'done' && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-flag" aria-hidden />
      )}
    </button>
  )
}
