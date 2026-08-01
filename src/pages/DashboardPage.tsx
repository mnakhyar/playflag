import { Link } from 'react-router-dom'
import { SKILLS } from '../content/skillTree'
import { PathBar } from '../components/PathBar'
import { SkillRadar } from '../components/SkillRadar'
import { ASSETS } from '../lib/assets'
import {
  doneSkillCount,
  hasRadarData,
  learnPath,
  nextLearnTarget,
  pathPercent,
  radarScores,
} from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function DashboardPage() {
  const { state, dispatch } = usePlayFlag()
  const percent = pathPercent(state)
  const radar = radarScores(state)
  const name = state.profile?.displayName ?? 'Pemain'
  const streak = state.profile?.streak ?? 0
  const doneCount = doneSkillCount(state)
  const target = nextLearnTarget(state)
  const interactiveDone =
    ['GEN-01', 'GEN-05', 'GEN-08'].every(
      (id) => state.progress.skillMastery[id] === 'done',
    )

  return (
    <div className="space-y-12">
      <header className="stagger-in relative -mx-5 overflow-hidden px-5 pb-2 pt-1">
        <img
          src={ASSETS.dashboardAtmosphere}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-45"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/20 via-night/55 to-night"
          aria-hidden
        />
        <div className="relative space-y-4 py-6">
          <span className="eyebrow">Road to 2028</span>
          <div className="space-y-2">
            <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-chalk">
              PlayFlag
            </h1>
            <p className="text-[15px] text-line">
              Hai {name}. Ini ringkasan progres belajarmu.
            </p>
          </div>
        </div>
      </header>

      <section
        className="stagger-in grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end"
        style={{ animationDelay: '70ms' }}
      >
        <div className="space-y-4">
          <PathBar percent={percent} />
          <p className="text-sm text-muted">
            <span className="tabular-nums text-chalk">{doneCount}</span>
            <span className="tabular-nums"> dari {SKILLS.length}</span> keterampilan
            ditandai selesai.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius-surface)] md:text-right">
          {streak > 0 && (
            <img
              src={ASSETS.streak}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
              decoding="async"
            />
          )}
          <div
            className={`relative px-1 py-1 ${streak > 0 ? 'bg-gradient-to-l from-night/40 to-night/85' : ''}`}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Streak aktif
            </p>
            <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-flag">
              {streak}
              <span className="ml-1 text-lg font-semibold text-line">hari</span>
            </p>
          </div>
        </div>
      </section>

      <section className="stagger-in space-y-4" style={{ animationDelay: '120ms' }}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight">Skill</h2>
          <span className="text-xs text-muted">Rules · Movement · Strategy</span>
        </div>
        <div className="bezel">
          <div className="bezel-inner overflow-hidden px-4 py-6">
            {!hasRadarData(state) ? (
              <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr] sm:items-center">
                <img
                  src={ASSETS.radarEmpty}
                  alt=""
                  className="aspect-[16/10] w-full rounded-[var(--radius-control)] object-cover object-center"
                  decoding="async"
                />
                <p className="max-w-[36ch] text-sm leading-relaxed text-line">
                  Radar masih kosong. Kerjakan kuis interaktif di fondasi untuk mengisi skor
                  skill.
                </p>
              </div>
            ) : (
              <SkillRadar scores={radar} />
            )}
          </div>
        </div>
      </section>

      <div className="stagger-in grid gap-3" style={{ animationDelay: '170ms' }}>
        {interactiveDone && !target ? (
          <>
            <Link to="/learn" className="btn-primary group">
              <span>Jelajahi cabang posisi</span>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/10 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
            <Link to="/team" className="btn-secondary">
              Buka playbook tim
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
                  ? `Lanjutkan drill ${target.skillId}`
                  : target
                    ? `Mulai ${target.skillId}`
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
