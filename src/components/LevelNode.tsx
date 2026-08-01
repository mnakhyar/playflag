import type { NodeStatus } from '../store/selectors'

type LevelNodeProps = {
  id: number
  title: string
  status: NodeStatus
  onClick: () => void
}

export function LevelNode({ id, title, status, onClick }: LevelNodeProps) {
  const styles =
    status === 'completed'
      ? 'border-flag bg-flag/20 text-chalk'
      : status === 'available'
        ? 'border-line bg-turf/40 text-chalk shadow-[0_0_0_1px_rgba(255,90,31,0.35)]'
        : 'border-line/20 bg-night/40 text-muted'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition hover:brightness-110 ${styles}`}
    >
      <span className="font-display text-2xl text-flag">{String(id).padStart(2, '0')}</span>
      <span className="flex-1">
        <span className="block font-medium">{title}</span>
        <span className="text-xs uppercase tracking-wide opacity-70">
          {status === 'completed'
            ? 'Selesai'
            : status === 'available'
              ? 'Tersedia'
              : 'Terkunci'}
        </span>
      </span>
    </button>
  )
}
