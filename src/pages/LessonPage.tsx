import { Link, Navigate, useParams } from 'react-router-dom'
import { FlowBackLink } from '../components/FlowBackLink'
import { getSkill } from '../content/skillTree'
import { skillNodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function LessonPage() {
  const { skillId } = useParams()
  const { state } = usePlayFlag()
  const skill = skillId ? getSkill(skillId) : undefined
  const status = skill
    ? skillNodeStatus(skill.id, state.progress.skillMastery)
    : 'locked'
  const completed = status === 'completed'

  if (!skill || !skill.interactive || !skill.lesson) {
    return <Navigate to="/learn" replace />
  }
  if (status === 'locked') {
    return <Navigate to="/learn" replace />
  }

  return (
    <div className="space-y-8">
      <FlowBackLink to={`/learn/skill/${skill.id}`}>Kembali ke detail</FlowBackLink>

      <div className="space-y-3">
        <p className="text-[13px] font-medium text-flag">
          {skill.id}
          {skill.category ? (
            <span className="text-muted"> · {skill.category}</span>
          ) : null}
          {completed ? <span className="text-muted"> · Ulang materi</span> : null}
        </p>
        <h1 className="font-display max-w-[18ch] text-4xl font-extrabold tracking-tight text-chalk">
          {skill.lesson.heading}
        </h1>
      </div>

      <ol className="space-y-0">
        {skill.lesson.bullets.map((b, i) => (
          <li key={b} className="hairline flex gap-4 py-4 last:border-0">
            <span className="font-display text-lg font-bold tabular-nums text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-pretty text-line">
              {b}
            </p>
          </li>
        ))}
      </ol>

      <Link to={`/learn/${skill.id}/quiz`} className="btn-primary group">
        <span>{completed ? 'Ulangi kuis' : 'Lanjut ke kuis'}</span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </Link>
    </div>
  )
}
