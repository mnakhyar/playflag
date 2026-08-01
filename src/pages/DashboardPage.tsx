import { Link } from 'react-router-dom'
import { PathBar } from '../components/PathBar'
import { SkillRadar } from '../components/SkillRadar'
import {
  hasRadarData,
  learnPath,
  nextLearnTarget,
  pathPercent,
  phase1CompletedCount,
  radarScores,
} from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function DashboardPage() {
  const { state, dispatch } = usePlayFlag()
  const percent = pathPercent(state)
  const radar = radarScores(state)
  const name = state.profile?.displayName ?? 'Pemain'
  const streak = state.profile?.streak ?? 0
  const phase1Done = phase1CompletedCount(state)
  const target = nextLearnTarget(state)
  const p1Complete = phase1Done >= 3 && target == null

  return (
    <div className="space-y-12">
      <header className="stagger-in space-y-4">
        <span className="eyebrow">Road to 2028</span>
        <div className="space-y-2">
          <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-chalk">
            PlayFlag
          </h1>
          <p className="text-[15px] text-line">
            Hai {name}. Ini ringkasan progres belajarmu.
          </p>
        </div>
      </header>

      <section
        className="stagger-in grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end"
        style={{ animationDelay: '70ms' }}
      >
        <div className="space-y-4">
          <PathBar percent={percent} />
          <p className="text-sm text-muted">
            <span className="tabular-nums text-chalk">{phase1Done}</span>
            <span className="tabular-nums"> dari 3</span> level Phase 1 selesai.
            Jalur penuh tetap 8 level.
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Streak aktif
          </p>
          <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-flag">
            {streak}
            <span className="ml-1 text-lg font-semibold text-line">hari</span>
          </p>
        </div>
      </section>

      <section className="stagger-in space-y-4" style={{ animationDelay: '120ms' }}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight">Skill</h2>
          <span className="text-xs text-muted">Rules · Movement · Strategy</span>
        </div>
        <div className="bezel">
          <div className="bezel-inner px-4 py-6">
            {!hasRadarData(state) ? (
              <p className="max-w-[36ch] text-sm leading-relaxed text-line">
                Radar masih kosong. Kerjakan kuis di level mana pun untuk mengisi skor skill.
              </p>
            ) : (
              <SkillRadar scores={radar} />
            )}
          </div>
        </div>
      </section>

      <div className="stagger-in grid gap-3" style={{ animationDelay: '170ms' }}>
        {p1Complete ? (
          <>
            <Link to="/team" className="btn-primary group">
              <span>Buka playbook tim</span>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
            <Link to="/learn" className="btn-secondary">
              Lihat skill tree
            </Link>
          </>
        ) : (
          <>
            <Link
              to={target ? learnPath(target) : '/learn'}
              className="btn-primary group"
            >
              <span>
                {target?.step === 'drill'
                  ? `Lanjutkan drill level ${target.levelId}`
                  : target
                    ? `Mulai level ${target.levelId}`
                    : 'Buka skill tree'}
              </span>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
            <Link to="/team" className="btn-secondary">
              Kelola Tim Saya
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            if (confirm('Hapus semua progres demo di perangkat ini?')) {
              dispatch({ type: 'RESET_DEMO' })
              window.location.href = '/'
            }
          }}
          className="min-h-10 text-center text-xs text-muted underline underline-offset-4"
        >
          Reset demo
        </button>
      </div>
    </div>
  )
}
