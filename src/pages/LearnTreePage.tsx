import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LEVELS } from '../content/levels'
import { LevelNode } from '../components/LevelNode'
import {
  entryStepForLevel,
  levelStatusLabel,
  lockTeaserMessage,
  nodeStatus,
} from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function LearnTreePage() {
  const { state } = usePlayFlag()
  const navigate = useNavigate()
  const [teaser, setTeaser] = useState<string | null>(null)
  const completed = state.progress.completedLevels

  return (
    <div className="space-y-8">
      <header className="stagger-in space-y-3">
        <span className="eyebrow">Kurikulum</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          Skill tree
        </h1>
        <p className="max-w-[36ch] text-[15px] leading-relaxed text-line">
          Delapan langkah menuju 2028. Phase 1 membuka tiga level pertama.
        </p>
      </header>

      {teaser && (
        <div className="rounded-[var(--radius-control)] bg-turf px-4 py-3 text-sm leading-relaxed text-pretty text-line">
          {teaser}{' '}
          <button
            type="button"
            className="min-h-10 font-medium text-flag underline underline-offset-2"
            onClick={() => setTeaser(null)}
          >
            Mengerti
          </button>
        </div>
      )}

      <div className="relative space-y-2">
        <div
          className="absolute bottom-5 left-7 top-5 w-px bg-[rgba(84,84,88,0.55)]"
          aria-hidden
        />
        {LEVELS.map((level, index) => {
          const status = nodeStatus(level.id, completed)
          const label = levelStatusLabel(
            level.id,
            status,
            completed,
            state.progress.quizScores,
          )
          return (
            <div key={level.id} className="relative">
              <LevelNode
                id={level.id}
                title={level.title}
                status={status}
                statusLabel={label}
                index={index}
                onClick={() => {
                  if (status === 'locked') {
                    setTeaser(
                      lockTeaserMessage(level.id, completed, level.teaser),
                    )
                    return
                  }
                  const step = entryStepForLevel(level.id, state)
                  navigate(`/learn/${level.id}/${step}`)
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
