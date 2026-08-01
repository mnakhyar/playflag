import { useEffect, useRef, useState } from 'react'

type DrillTimerProps = {
  running: boolean
  onToggle: () => void
  elapsedSec: number
}

export function useDrillTimer() {
  const [running, setRunning] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const startedAt = useRef<number | null>(null)
  const baseElapsed = useRef(0)

  useEffect(() => {
    if (!running) return
    startedAt.current = Date.now()
    const id = window.setInterval(() => {
      if (startedAt.current == null) return
      const delta = Math.floor((Date.now() - startedAt.current) / 1000)
      setElapsedSec(baseElapsed.current + delta)
    }, 250)
    return () => window.clearInterval(id)
  }, [running])

  const toggle = () => {
    if (running) {
      baseElapsed.current = elapsedSec
      startedAt.current = null
      setRunning(false)
    } else {
      setRunning(true)
    }
  }

  const reset = () => {
    setRunning(false)
    setElapsedSec(0)
    baseElapsed.current = 0
    startedAt.current = null
  }

  return { running, elapsedSec, toggle, reset }
}

export function DrillTimer({ running, onToggle, elapsedSec }: DrillTimerProps) {
  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0')
  const ss = String(elapsedSec % 60).padStart(2, '0')

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-night/50 px-4 py-3 ring-1 ring-line/15">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">Timer</p>
        <p className="font-display text-4xl tabular-nums text-chalk">
          {mm}:{ss}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="rounded-xl bg-flag px-4 py-2 font-semibold text-night hover:bg-flag-hot"
      >
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  )
}
