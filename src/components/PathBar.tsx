type PathBarProps = {
  percent: number
}

export function PathBar({ percent }: PathBarProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between gap-3">
        <span className="text-sm text-line/80">Road to 2028</span>
        <span className="font-display text-3xl leading-none text-flag">{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-night/60 ring-1 ring-line/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-flag to-flag-hot transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  )
}
