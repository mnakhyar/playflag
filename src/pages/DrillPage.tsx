import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { DrillTimer, useDrillTimer } from '../components/DrillTimer'
import { getLevel } from '../content/levels'
import { todayLocal } from '../lib/dates'
import { nodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function DrillPage() {
  const { levelId } = useParams()
  const id = Number(levelId)
  const { state, dispatch } = usePlayFlag()
  const navigate = useNavigate()
  const level = getLevel(id)
  const status = nodeStatus(id, state.progress.completedLevels)
  const timer = useDrillTimer()
  const [reps, setReps] = useState('')

  if (!level || level.statusInP1 !== 'full' || !level.drill) {
    return <Navigate to="/learn" replace />
  }
  if (status === 'locked') {
    return <Navigate to="/learn" replace />
  }

  const onFinish = (e: FormEvent) => {
    e.preventDefault()
    const achieved = Number(reps)
    if (!Number.isFinite(achieved) || achieved < 0) return
    if (timer.running) timer.toggle()
    dispatch({
      type: 'COMPLETE_DRILL',
      levelId: id,
      targetReps: level.drill!.targetReps,
      achievedReps: achieved,
      durationSec: timer.elapsedSec,
      today: todayLocal(),
    })
    navigate('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-flag">Level {id} · Drill</p>
        <h1 className="font-display text-4xl text-chalk">{level.drill.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-line/90">
          {level.drill.instructions}
        </p>
        <p className="mt-2 text-sm text-muted">
          Target: {level.drill.targetReps} reps
        </p>
      </div>

      <DrillTimer
        running={timer.running}
        onToggle={timer.toggle}
        elapsedSec={timer.elapsedSec}
      />

      <form onSubmit={onFinish} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Reps dicapai</span>
          <input
            type="number"
            min={0}
            required
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full rounded-xl border border-line/20 bg-night/60 px-4 py-3 outline-none focus:border-flag"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-flag py-3 font-semibold text-night hover:bg-flag-hot"
        >
          Selesai level
        </button>
      </form>
    </div>
  )
}
