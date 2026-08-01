import { useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DrillTimer, useDrillTimer } from '../components/DrillTimer'
import { FlowBackLink } from '../components/FlowBackLink'
import { getSkill } from '../content/skillTree'
import { ASSETS } from '../lib/assets'
import { todayLocal } from '../lib/dates'
import { skillNodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

const INTERACTIVE_ORDER = ['GEN-01', 'GEN-05', 'GEN-08'] as const

export function DrillPage() {
  const { skillId } = useParams()
  const { state, dispatch } = usePlayFlag()
  const skill = skillId ? getSkill(skillId) : undefined
  const status = skill
    ? skillNodeStatus(skill.id, state.progress.skillMastery)
    : 'locked'
  const timer = useDrillTimer()
  const [reps, setReps] = useState('')
  const [done, setDone] = useState(false)
  const [achieved, setAchieved] = useState(0)

  if (!skill || !skill.interactive || !skill.drillInteractive) {
    return <Navigate to="/learn" replace />
  }
  if (status === 'locked' && !done) {
    return <Navigate to="/learn" replace />
  }

  const targetReps = skill.drillInteractive.targetReps
  const orderIdx = INTERACTIVE_ORDER.indexOf(
    skill.id as (typeof INTERACTIVE_ORDER)[number],
  )
  const nextId =
    orderIdx >= 0 && orderIdx < INTERACTIVE_ORDER.length - 1
      ? INTERACTIVE_ORDER[orderIdx + 1]
      : null

  const onFinish = (e: FormEvent) => {
    e.preventDefault()
    const value = Number(reps)
    if (!Number.isFinite(value) || value < 0) return
    if (timer.running) timer.toggle()
    dispatch({
      type: 'COMPLETE_DRILL',
      skillId: skill.id,
      targetReps,
      achievedReps: value,
      durationSec: timer.elapsedSec,
      today: todayLocal(),
    })
    setAchieved(value)
    setDone(true)
  }

  if (done) {
    const met = achieved >= targetReps
    return (
      <div className="flex min-h-[70dvh] flex-col justify-center space-y-8">
        <div className="stagger-in space-y-5 text-left">
          <img
            src={ASSETS.levelComplete}
            alt=""
            className="aspect-[16/10] w-full rounded-[var(--radius-surface)] object-cover object-[center_30%]"
            decoding="async"
          />
          <div className="space-y-3">
            <span className="eyebrow">Skill selesai</span>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-chalk">
              {skill.id} tuntas
            </h1>
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-line">
              {skill.name}. Hasil drill:{' '}
              <span className="tabular-nums text-chalk">
                {achieved}/{targetReps}
              </span>{' '}
              reps
              {met ? '. Target tercapai.' : '. Catatan tetap tersimpan.'}
            </p>
          </div>
        </div>
        <div className="stagger-in grid gap-3" style={{ animationDelay: '80ms' }}>
          {nextId != null && (
            <Link to={`/learn/${nextId}/lesson`} className="btn-primary group">
              <span>Buka {nextId}</span>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          )}
          <Link to="/learn" className="btn-secondary">
            Kembali ke skill tree
          </Link>
          <Link
            to="/dashboard"
            className="min-h-10 text-center text-sm text-muted underline underline-offset-4"
          >
            Lihat beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <FlowBackLink to={`/learn/${skill.id}/quiz`}>Kembali ke kuis</FlowBackLink>

      <div className="space-y-3">
        <p className="text-[13px] font-medium text-flag">
          {skill.id}
          <span className="text-muted"> · Drill</span>
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          {skill.drillInteractive.title}
        </h1>
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-pretty text-line">
          {skill.drillInteractive.instructions}
        </p>
        <p className="text-sm text-muted">
          Target:{' '}
          <span className="tabular-nums font-semibold text-chalk">{targetReps}</span> reps
        </p>
      </div>

      <DrillTimer
        running={timer.running}
        onToggle={timer.toggle}
        elapsedSec={timer.elapsedSec}
      />

      <form onSubmit={onFinish} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-[13px] font-medium text-muted">Reps yang kamu capai</span>
          <input
            type="number"
            min={0}
            required
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="field-input tabular-nums"
          />
          {reps !== '' && Number.isFinite(Number(reps)) && (
            <span className="block text-xs text-muted tabular-nums">
              Dibanding target {targetReps}
              {Number(reps) >= targetReps
                ? ': sudah cukup.'
                : ': masih di bawah target.'}
            </span>
          )}
        </label>
        <button type="submit" className="btn-primary">
          Simpan hasil dan selesaikan skill
        </button>
      </form>
    </div>
  )
}
