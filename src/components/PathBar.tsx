type PathBarProps = {
  percent: number
}

export function PathBar({ percent }: PathBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="w-full space-y-3">
      <div className="flex items-end justify-between gap-3">
        <span className="text-[13px] font-medium text-line">Progres skill tree</span>
        <span className="font-display text-4xl font-bold leading-none tabular-nums tracking-tight text-chalk">
          {clamped}
          <span className="text-xl text-muted">%</span>
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-sm bg-surface">
        <div
          className="h-full rounded-sm bg-flag transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
