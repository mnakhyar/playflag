import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LEVELS } from '../content/levels'
import { LevelNode } from '../components/LevelNode'
import { nodeStatus } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function LearnTreePage() {
  const { state } = usePlayFlag()
  const navigate = useNavigate()
  const [teaser, setTeaser] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl text-chalk">Skill tree</h1>
        <p className="text-line/80">8 langkah Road to 2028</p>
      </header>

      {teaser && (
        <div className="rounded-2xl bg-flag/15 px-4 py-3 text-sm text-chalk ring-1 ring-flag/40">
          {teaser}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setTeaser(null)}
          >
            OK
          </button>
        </div>
      )}

      <div className="relative space-y-3">
        <div className="absolute bottom-4 left-7 top-4 w-0.5 bg-line/20" aria-hidden />
        {LEVELS.map((level) => {
          const status = nodeStatus(level.id, state.progress.completedLevels)
          return (
            <div key={level.id} className="relative">
              <LevelNode
                id={level.id}
                title={level.title}
                status={status}
                onClick={() => {
                  if (status === 'locked') {
                    setTeaser(
                      level.teaser ??
                        'Buka di tahap berikutnya — Road to 2028',
                    )
                    return
                  }
                  navigate(`/learn/${level.id}/lesson`)
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
