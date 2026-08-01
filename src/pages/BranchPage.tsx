import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FlowBackLink } from '../components/FlowBackLink'
import { SkillNodeCard } from '../components/SkillNodeCard'
import {
  BRANCH_META,
  POSITION_META,
  type SkillBranch,
  skillsByBranch,
} from '../content/skillTree'
import {
  getMastery,
  positionProgress,
  skillNodeStatus,
  skillStatusLabel,
} from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

const BRANCH_IDS: SkillBranch[] = ['offense', 'defense']

export function BranchPage() {
  const { branchId } = useParams()
  const { state } = usePlayFlag()
  const navigate = useNavigate()
  const mastery = state.progress.skillMastery

  if (!branchId || !BRANCH_IDS.includes(branchId as SkillBranch)) {
    return <Navigate to="/learn" replace />
  }

  const branch = branchId as SkillBranch
  const meta = BRANCH_META[branch]
  const nodes = skillsByBranch(branch)
  const positions = POSITION_META.filter((p) => p.branch === branch)

  return (
    <div className="space-y-8">
      <FlowBackLink to="/learn">Kembali ke skill tree</FlowBackLink>

      <header className="space-y-2">
        <span className="eyebrow">Tier 1 · Cabang</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          {meta.name}
        </h1>
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-line">
          Selesaikan basics cabang, lalu pilih jalur posisi.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">Basics</h2>
        {nodes.map((skill, index) => {
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
              index={index}
              onClick={() => {
                if (status === 'locked') return
                navigate(`/learn/skill/${skill.id}`)
              }}
            />
          )
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Jalur posisi</h2>
        <div className="grid gap-2">
          {positions.map((pos) => {
            const prog = positionProgress(pos.id, mastery)
            return (
              <div key={pos.id} className="space-y-2">
                <Link
                  to={`/learn/position/${pos.id}`}
                  className="pressable flex min-h-14 items-center justify-between rounded-[var(--radius-surface)] bg-turf px-4 py-3.5"
                >
                  <span className="font-semibold tracking-tight">{pos.name}</span>
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
