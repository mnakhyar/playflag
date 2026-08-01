import { Link, Navigate, useParams } from 'react-router-dom'
import { FlowBackLink } from '../components/FlowBackLink'
import { getSkill } from '../content/skillTree'
import { entryStepForSkill, getMastery, skillNodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'
import type { SkillMastery } from '../store/types'

export function SkillDetailPage() {
  const { skillId } = useParams()
  const { state, dispatch } = usePlayFlag()
  const skill = skillId ? getSkill(skillId) : undefined
  const mastery = state.progress.skillMastery

  if (!skill || !skillId) {
    return <Navigate to="/learn" replace />
  }

  const status = skillNodeStatus(skill.id, mastery)
  if (status === 'locked') {
    return <Navigate to="/learn" replace />
  }

  const level = getMastery(skill.id, mastery)
  const backTo =
    skill.position != null
      ? `/learn/position/${skill.position}`
      : skill.branch === 'general'
        ? '/learn'
        : `/learn/branch/${skill.branch}`

  const setMastery = (next: SkillMastery) => {
    dispatch({ type: 'SET_SKILL_MASTERY', skillId: skill.id, mastery: next })
  }

  return (
    <div className="space-y-8">
      <FlowBackLink to={backTo}>Kembali</FlowBackLink>

      <header className="space-y-3">
        <p className="text-[13px] font-medium text-flag">
          {skill.id}
          {skill.tierLabel ? (
            <span className="text-muted"> · {skill.tierLabel}</span>
          ) : null}
        </p>
        <h1 className="font-display max-w-[20ch] text-4xl font-extrabold tracking-tight text-chalk">
          {skill.name}
        </h1>
        <p className="max-w-[42ch] text-[15px] leading-relaxed text-pretty text-line">
          {skill.description}
        </p>
      </header>

      {skill.drill && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted">Drill</h2>
          <p className="max-w-[42ch] text-[15px] leading-relaxed text-line">
            {skill.drill}
          </p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">Kriteria kuasai</h2>
        <p className="max-w-[42ch] text-[15px] leading-relaxed text-line">
          {skill.masteryCriteria}
        </p>
      </section>

      {skill.ruleRef && (
        <p className="text-xs text-muted">Ref: {skill.ruleRef}</p>
      )}

      {skill.interactive && skill.lesson && (
        <Link
          to={`/learn/${skill.id}/${entryStepForSkill(skill.id, state)}`}
          className="btn-primary group"
        >
          <span>
            {level === 'done' ? 'Ulang materi interaktif' : 'Mulai lesson → kuis → drill'}
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        </Link>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Tandai progres</h2>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['unseen', 'Belum'],
              ['learning', 'Belajar'],
              ['done', 'Selesai'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMastery(value)}
              className={`pressable min-h-11 rounded-[var(--radius-control)] px-2 text-sm font-medium ${
                level === value
                  ? 'bg-flag text-night'
                  : 'bg-turf text-line'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
