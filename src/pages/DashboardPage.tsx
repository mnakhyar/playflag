import { Link } from 'react-router-dom'
import { PathBar } from '../components/PathBar'
import { SkillRadar } from '../components/SkillRadar'
import { pathPercent, radarScores } from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function DashboardPage() {
  const { state, dispatch } = usePlayFlag()
  const percent = pathPercent(state)
  const radar = radarScores(state)
  const name = state.profile?.displayName ?? 'Pemain'
  const streak = state.profile?.streak ?? 0
  const done = state.progress.completedLevels.length

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-muted">Halo, {name}</p>
        <h1 className="font-display text-5xl leading-none text-chalk">PlayFlag</h1>
        <p className="mt-1 text-line/80">Road to 2028 — progres belajarmu</p>
      </header>

      <section className="space-y-4 rounded-3xl bg-turf/30 p-5 ring-1 ring-line/15">
        <PathBar percent={percent} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{done} / 8 level selesai</span>
          <span className="rounded-lg bg-night/50 px-3 py-1 font-semibold text-flag">
            Streak {streak} hari
          </span>
        </div>
      </section>

      <section className="rounded-3xl bg-night/40 p-5 ring-1 ring-line/15">
        <h2 className="mb-3 font-display text-2xl text-chalk">Skill radar</h2>
        <SkillRadar scores={radar} />
      </section>

      <div className="grid gap-3">
        <Link
          to="/learn"
          className="rounded-2xl bg-flag px-4 py-3 text-center font-semibold text-night hover:bg-flag-hot"
        >
          Lanjut belajar
        </Link>
        <Link
          to="/team"
          className="rounded-2xl bg-turf/40 px-4 py-3 text-center font-semibold text-chalk ring-1 ring-line/20"
        >
          Buka Tim Saya
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm('Reset semua progres demo?')) {
              dispatch({ type: 'RESET_DEMO' })
              window.location.href = '/'
            }
          }}
          className="text-center text-xs text-muted underline"
        >
          Reset demo
        </button>
      </div>
    </div>
  )
}
