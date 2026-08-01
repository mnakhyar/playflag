import { Link, useNavigate } from 'react-router-dom'
import {
  BRANCH_META,
  DEMO_UNLOCK_ALL,
  POSITION_META,
  SKILLS,
  generalSkills,
} from '../content/skillTree'
import { SkillNodeCard } from '../components/SkillNodeCard'
import { ASSETS } from '../lib/assets'
import {
  branchProgress,
  entryStepForSkill,
  getMastery,
  pathPercent,
  positionProgress,
  skillNodeStatus,
  skillStatusLabel,
} from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

export function LearnTreePage() {
  const { state } = usePlayFlag()
  const navigate = useNavigate()
  const mastery = state.progress.skillMastery
  const percent = pathPercent(state)
  const gen = generalSkills()
  const offenseProg = branchProgress('offense', mastery)
  const defenseProg = branchProgress('defense', mastery)

  return (
    <div className="relative space-y-10">
      <div
        className="pointer-events-none absolute -inset-x-5 -top-8 h-[28rem] overflow-hidden opacity-[0.28]"
        aria-hidden
      >
        <img
          src={ASSETS.skillTreePath}
          alt=""
          className="h-full w-full object-cover object-[center_40%]"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/30 via-night/70 to-night" />
      </div>

      <header className="stagger-in relative space-y-3">
        <span className="eyebrow">Kurikulum IFAF</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          Skill tree
        </h1>
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-line">
          Fondasi → Offense / Defense → posisi. {SKILLS.length} keterampilan.
        </p>
        {DEMO_UNLOCK_ALL && (
          <p className="inline-flex rounded-[var(--radius-chip)] bg-turf px-3 py-1.5 text-xs font-medium text-flag">
            Demo: semua cabang terbuka
          </p>
        )}
        <p className="text-sm text-muted">
          Progres{' '}
          <span className="tabular-nums font-semibold text-chalk">{percent}%</span>
        </p>
      </header>

      <section className="relative space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {BRANCH_META.general.name}
          </h2>
          <span className="text-xs text-muted">Tier 0 · wajib</span>
        </div>
        <div className="space-y-2">
          {gen.map((skill, index) => {
            const status = skillNodeStatus(skill.id, mastery)
            const level = getMastery(skill.id, mastery)
            return (
              <SkillNodeCard
                key={skill.id}
                id={skill.id}
                title={skill.name}
                status={status}
                mastery={level}
                statusLabel={skillStatusLabel(
                  skill.id,
                  status,
                  mastery,
                  state.progress.quizScores,
                )}
                badge={skill.interactive ? 'Interaktif' : undefined}
                index={index}
                onClick={() => {
                  if (status === 'locked') return
                  if (skill.interactive) {
                    navigate(
                      `/learn/${skill.id}/${entryStepForSkill(skill.id, state)}`,
                    )
                    return
                  }
                  navigate(`/learn/skill/${skill.id}`)
                }}
              />
            )
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {(['offense', 'defense'] as const).map((branchId) => {
          const meta = BRANCH_META[branchId]
          const prog = branchId === 'offense' ? offenseProg : defenseProg
          return (
            <Link
              key={branchId}
              to={`/learn/branch/${branchId}`}
              className="pressable stagger-in block rounded-[var(--radius-surface)] bg-turf px-5 py-5 transition-colors"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                Tier 1
              </p>
              <h3 className="font-display mt-1 text-2xl font-bold tracking-tight">
                {meta.name}
              </h3>
              <p className="mt-2 text-sm text-line">
                Basics cabang + jalur posisi
              </p>
              <p className="mt-3 text-xs tabular-nums text-muted">
                {prog.done}/{prog.total} selesai
              </p>
            </Link>
          )
        })}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold tracking-tight">Posisi</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {POSITION_META.map((pos) => {
            const prog = positionProgress(pos.id, mastery)
            return (
              <div key={pos.id} className="space-y-2">
                <Link
                  to={`/learn/position/${pos.id}`}
                  className="pressable flex min-h-14 items-center justify-between rounded-[var(--radius-surface)] bg-turf px-4 py-3.5"
                >
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.1em] text-muted">
                      {BRANCH_META[pos.branch].name}
                    </span>
                    <span className="font-semibold tracking-tight">{pos.name}</span>
                  </span>
                  <span className="text-xs tabular-nums text-muted">
                    {prog.done}/{prog.total}
                  </span>
                </Link>
                {pos.subBranch && (
                  <Link
                    to={`/learn/position/${pos.subBranch.id}`}
                    className="pressable flex min-h-12 items-center justify-between rounded-[var(--radius-control)] px-4 py-2.5 text-sm text-line"
                  >
                    <span>↳ {pos.subBranch.name}</span>
                    <span className="text-xs tabular-nums text-muted">
                      {positionProgress(pos.subBranch.id, mastery).done}/
                      {positionProgress(pos.subBranch.id, mastery).total}
                    </span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
