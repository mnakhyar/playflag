import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FlowBackLink } from '../components/FlowBackLink'
import { SkillNodeCard } from '../components/SkillNodeCard'
import {
  POSITION_META,
  TIER_LABELS,
  type SkillPosition,
  skillsByPosition,
} from '../content/skillTree'
import {
  getMastery,
  skillNodeStatus,
  skillStatusLabel,
} from '../store/selectors'
import { usePlayFlag } from '../store/StoreProvider'

const POSITION_IDS: SkillPosition[] = [
  'qb',
  'receiver',
  'snapper',
  'rusher',
  'db',
]

export function PositionPage() {
  const { positionId } = useParams()
  const { state } = usePlayFlag()
  const navigate = useNavigate()
  const mastery = state.progress.skillMastery

  if (!positionId || !POSITION_IDS.includes(positionId as SkillPosition)) {
    return <Navigate to="/learn" replace />
  }

  const position = positionId as SkillPosition
  const meta =
    POSITION_META.find((p) => p.id === position) ??
    POSITION_META.flatMap((p) =>
      p.subBranch ? [{ id: p.subBranch.id, name: p.subBranch.name, branch: p.branch }] : [],
    ).find((p) => p.id === position)

  const nodes = skillsByPosition(position)
  const tiers = [2, 3, 4, 5] as const

  return (
    <div className="space-y-8">
      <FlowBackLink to={`/learn/branch/${meta?.branch ?? 'offense'}`}>
        Kembali ke cabang
      </FlowBackLink>

      <header className="space-y-2">
        <span className="eyebrow">Jalur posisi</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-chalk">
          {meta?.name ?? position}
        </h1>
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-line">
          Foundation → Core → Advanced → Elite.
        </p>
      </header>

      {tiers.map((tier) => {
        const group = nodes.filter((n) => n.tier === tier)
        if (group.length === 0) return null
        return (
          <section key={tier} className="space-y-2">
            <h2 className="text-sm font-medium text-muted">
              Tier {tier} · {TIER_LABELS[tier]}
            </h2>
            {group.map((skill, index) => {
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
        )
      })}
    </div>
  )
}
