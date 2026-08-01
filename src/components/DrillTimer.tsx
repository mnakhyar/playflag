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
    <div className="flex items-center justify-between gap-4 border-y border-[rgba(84,84,88,0.55)] py-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Waktu
        </p>
        <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-chalk">
          {mm}:{ss}
        </p>
      </div>
      <button type="button" onClick={onToggle} className="btn-accent pressable min-h-11 px-5">
        {running ? 'Berhenti' : 'Mulai'}
      </button>
    </div>
  )
}
