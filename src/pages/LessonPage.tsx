import { Link, Navigate, useParams } from 'react-router-dom'
import { getLevel } from '../content/levels'
import { nodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function LessonPage() {
  const { levelId } = useParams()
  const id = Number(levelId)
  const { state } = usePlayFlag()
  const level = getLevel(id)
  const status = nodeStatus(id, state.progress.completedLevels)

  if (!level || level.statusInP1 !== 'full' || !level.lesson) {
    return <Navigate to="/learn" replace />
  }
  if (status === 'locked') {
    return <Navigate to="/learn" replace />
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-flag">Level {id} · {level.category}</p>
        <h1 className="font-display text-4xl text-chalk">{level.lesson.heading}</h1>
      </div>
      <ul className="space-y-3">
        {level.lesson.bullets.map((b) => (
          <li
            key={b}
            className="rounded-2xl bg-turf/25 px-4 py-3 text-sm leading-relaxed text-line ring-1 ring-line/10"
          >
            {b}
          </li>
        ))}
      </ul>
      <Link
        to={`/learn/${id}/quiz`}
        className="block rounded-2xl bg-flag py-3 text-center font-semibold text-night hover:bg-flag-hot"
      >
        Lanjut ke kuis
      </Link>
    </div>
  )
}
